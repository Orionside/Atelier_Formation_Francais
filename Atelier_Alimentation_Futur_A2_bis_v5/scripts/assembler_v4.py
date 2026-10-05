#!/usr/bin/env python3
"""Version bis v4 : choisit la meilleure prise de chaque texte d'après ses mots, son timbre, son naturel ET son rythme,
calibre les pauses selon les groupes rythmiques, assemble les fragments et écrit les MP3 + le manifeste.

  .venv-ecoute/bin/python outils_voix/assembler_v4.py <dossier de l'atelier> <dossier de travail> [f0_min f0_max]

Entrées (dossier de travail) : prises/*.wav, prises.json, mesures.json (mots, hauteur), rythme.json (syllabes,
groupes, pauses), ecoute.json (timbre, naturel).
Sorties (atelier) : audio/qwen3-tts/<id>.mp3, manifest.json, qa-selection.json ; (travail) a_ecouter.md.

Une prise est écartée si : elle est tronquée, il lui manque des mots, son timbre s'éloigne de la référence,
sa hauteur sort de la plage de la voix, ou elle fait une pause au milieu d'un groupe rythmique.
Parmi les prises valables, la note combine le naturel (UTMOSv2) et le rythme : fins de groupe marquées
(pause ou dernière syllabe allongée), syllabes régulières à l'intérieur des groupes, débit modéré.
"""
import hashlib
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf

sys.path.insert(0, str(Path(__file__).parent))
from calibrer_v4 import calibrer, PLAGES, DEBIT_MAX

F0_MIN, F0_MAX = 200, 285          # plage de la voix de référence n° 2 (médiane 240 Hz), en Hz
FINAL = True                       # False pendant la présélection (la note de naturel n'existe pas encore)
DEBIT_CONFORT = 5.0                # syllabes par seconde (pauses exclues) au-delà desquelles une prise est pénalisée
TIMBRE_MIN = 0.90


def _mots(s):
    """Mots sans accents, nombres écrits en lettres (« 2 » = « deux ») : évite les fausses erreurs de transcription."""
    import unicodedata
    from num2words import num2words
    s = re.sub(r"\d+(?:[.,]\d+)?", lambda m: " " + num2words(float(m.group().replace(",", ".")) if re.search(r"[.,]", m.group())
                                                         else int(m.group()), lang="fr") + " ", s)
    s = "".join(c for c in unicodedata.normalize("NFKD", s.casefold()) if not unicodedata.combining(c))
    return re.findall(r"[a-z]+", s)


def wer_nombres(attendu, entendu):
    a, b = _mots(attendu), _mots(entendu)
    row = list(range(len(b) + 1))
    for i, x in enumerate(a, 1):
        nxt = [i]
        for j, y in enumerate(b, 1):
            nxt.append(min(row[j] + 1, nxt[-1] + 1, row[j - 1] + (x != y)))
        row = nxt
    return round(row[-1] / max(1, len(a)), 3), len(b) - len(a)


def lettres(t):
    return len(re.findall(r"[^\W\d_]", t))


def note_rythme(r):
    """Bonus/malus de rythme (en points de naturel). r : entrée de rythme.json."""
    if not r or "erreur" in r:
        return 0.0
    s = -0.5 * max(0.0, (r.get("debit_syl_s") or 0) - DEBIT_CONFORT)
    if r.get("frontieres_marquees") is not None:
        s += 0.4 * r["frontieres_marquees"]
    if r.get("regularite_npvi") is not None:
        s -= 0.01 * max(0.0, r["regularite_npvi"] - 40)
    return round(s, 3)


def choisir(noms, P, M, E, texte, trou=False, R=None):
    R = R or {}
    c = []
    for n in noms:
        m, e, p = M.get(n), E.get(n), P.get(n)
        if not (m and e and p):
            continue
        if FINAL and "naturel" not in e:
            continue
        r = R.get(n) or {}
        court = m["duree_s"] < 1.5
        defauts = []
        w, en_plus = wer_nombres(texte, m["transcription"])
        if trou and en_plus > 0:
            defauts.append("mot en plus dans une phrase à trous (la réponse est peut-être dite)")
        if p.get("plafond_atteint"):
            defauts.append("longueur maximale atteinte")
        if m["duree_s"] < max(0.3, 0.045 * lettres(texte)):
            defauts.append("trop court")
        if m["f0_hz"] and not (F0_MIN <= m["f0_hz"] <= F0_MAX):
            defauts.append(f"hauteur {m['f0_hz']} Hz")
        if r.get("pauses_internes"):
            defauts.append("pause au milieu d'un groupe")
        c.append({"nom": n, "wer": w, "timbre": e["timbre"], "naturel": e.get("naturel", 0), "court": court,
                  "art": m["mots_min_hors_pauses"], "defauts": defauts, "syl_s": r.get("debit_syl_s"),
                  "fin_groupe": r.get("allongement_final"), "frontieres_marquees": r.get("frontieres_marquees"),
                  "npvi": r.get("regularite_npvi"), "rythme": note_rythme(r)})
    if not c:
        return None, []
    wer_min = min(x["wer"] for x in c)
    timbre_max = max(x["timbre"] for x in c)
    for x in c:
        if x["wer"] > wer_min + 1e-6:
            x["defauts"].append("mots manquants ou changés")
        seuil = (timbre_max - 0.06) if x["court"] else max(TIMBRE_MIN, timbre_max - 0.05)
        if x["timbre"] < seuil:
            x["defauts"].append(f"timbre {x['timbre']:.2f}")
        x["score"] = round(x["naturel"] + x["rythme"] - 3 * x["wer"] - 2 * len(x["defauts"]), 3)
    c.sort(key=lambda x: -x["score"])
    return c[0], c


def main():
    global F0_MIN, F0_MAX, FINAL
    pre = "--preselection" in sys.argv
    FINAL = not pre
    args = [a for a in sys.argv[1:] if a != "--preselection"]
    A, T = Path(args[0]).resolve(), Path(args[1]).resolve()
    if len(args) > 3:
        F0_MIN, F0_MAX = int(args[2]), int(args[3])
    D = T / "prises"
    P = json.loads((D / "prises.json").read_text(encoding="utf-8"))
    M = json.loads((D / "mesures.json").read_text(encoding="utf-8"))
    EC = json.loads((D / "ecoute.json").read_text(encoding="utf-8"))
    RY = json.loads((D / "rythme.json").read_text(encoding="utf-8"))
    info = json.loads((T / "production.json").read_text(encoding="utf-8"))
    cat = json.loads((A / "audio/catalogue-qwen3tts.json").read_text(encoding="utf-8"))["entries"]
    if pre:
        # Avant la note de naturel (lente) : on garde les 3 meilleures prises de chaque fragment d'après
        # les mots, le timbre, la hauteur et le rythme. Seules celles-là seront notées en naturel.
        garde = []
        for e in cat:
            for k, texte in enumerate([s["text"] for s in e["segments"]] if e.get("segments") else [e["tts_text"]]):
                noms = [n for n in P if n.startswith(f"{e['id']}__s{k}__g")]
                _, tous = choisir(noms, P, M, EC, texte, trou=(e["role"] == "phrase_a_completer"), R=RY)
                garde += [t["nom"] for t in tous[:3]]
        (D / "noms_naturel.json").write_text(json.dumps(garde, ensure_ascii=False, indent=1), encoding="utf-8")
        print(len(garde), "prises retenues pour la note de naturel, sur", len(P))
        return
    OUT = A / "audio/qwen3-tts"
    OUT.mkdir(parents=True, exist_ok=True)
    ref = A / "audio/voix-reference/reference.wav"
    params = {"model": "mlx-community/Qwen3-TTS-12Hz-1.7B-Base-8bit", "language": "French", "runtime": "mlx-audio",
              "mode": info["mode"],
              "reference_sha256": hashlib.sha256(ref.read_bytes()).hexdigest(),
              "voice": "féminine, clonée par Qwen3-TTS Base à partir du fichier « voix féminine synthétisée de référence 2.mp4 » fourni par le formateur comme voix de synthèse",
              "format": "mp3 192 kb/s", "niveau": "A2+", "temperature": 0.9, "top_k": 50, "top_p": 1.0,
              "repetition_penalty": 1.05, "prises_par_texte": info["prises_par_texte"],
              "rythme": info["rythme"],
              "selection": "mots (Whisper), timbre (WavLM), naturel (UTMOSv2) et rythme : fins de groupe marquées, syllabes régulières, débit en syllabes par seconde",
              "calibrage": f"pauses selon la frontière : groupe ≤ {PLAGES['mineure'][1]} s, virgule {PLAGES['virgule'][0]} à {PLAGES['virgule'][1]} s, fin de phrase {PLAGES['phrase'][0]} à {PLAGES['phrase'][1]} s ; atempo ≤ 1,10 au-delà de {DEBIT_MAX} syllabes/s"}
    clips, qa, alertes = {}, {}, []
    for e in cat:
        morceaux = [s["text"] for s in e["segments"]] if e.get("segments") else [e["tts_text"]]
        sons, sr, detail, drapeaux = [], None, [], []
        for k, texte in enumerate(morceaux):
            noms = [n for n in P if n.startswith(f"{e['id']}__s{k}__g")]
            best, tous = choisir(noms, P, M, EC, texte, trou=(e["role"] == "phrase_a_completer"), R=RY)
            if best is None:
                raise RuntimeError("Aucune prise mesurée pour " + e["id"])
            x, sr, j = calibrer(D / f"{best['nom']}.wav", RY.get(best["nom"]) or {})
            sons.append(x)
            detail.append({"prise": best["nom"], "graine": P[best["nom"]]["graine"], **{a: best[a] for a in ("wer", "timbre", "naturel", "art", "syl_s", "fin_groupe", "frontieres_marquees", "npvi")},
                           "calibrage": j, "prises": [{a: t[a] for a in ("nom", "score", "wer", "timbre", "naturel", "rythme", "syl_s", "defauts")} for t in tous]})
            if best["defauts"]:
                drapeaux.append("meilleure prise avec défaut : " + ", ".join(best["defauts"]))
            if best["wer"] > 0:
                drapeaux.append(f"transcription différente ({best['wer']:.0%}) : « {M[best['nom']]['transcription'][:80]} »")
            if best["naturel"] < 2.8 and not best["court"]:
                drapeaux.append(f"naturel {best['naturel']}")
        pause = np.zeros(int(sr * e.get("pause_s", 0.22)), dtype=np.float32)
        y = sons[0] if len(sons) == 1 else np.concatenate([p for i, s in enumerate(sons) for p in ([pause, s] if i else [s])])
        cible = OUT / (e["id"] + ".mp3")
        with tempfile.TemporaryDirectory() as d:
            wav = Path(d) / "c.wav"
            sf.write(wav, np.clip(y, -1, 1), sr, subtype="PCM_16")
            subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(wav), "-codec:a", "libmp3lame",
                            "-b:a", "192k", str(cible)], check=True)
        duree = round(len(y) / sr, 3)
        n_mots = len(re.findall(r"[\wÀ-ÿ]+(?:['’][\wÀ-ÿ]+)*", e["tts_text"]))
        debit = round(n_mots * 60 / duree)
        rapide = [d["syl_s"] for d in detail if d["syl_s"] and d["syl_s"] > DEBIT_MAX and RY.get(d["prise"], {}).get("syllabes", 0) >= 6]
        if rapide:
            drapeaux.append(f"débit {max(rapide)} syllabes/s")
        clips[e["id"]] = {**e, "duration_s": duree, "sha256": hashlib.sha256(cible.read_bytes()).hexdigest(),
                          "key": hashlib.sha256(json.dumps({"t": e["tts_text"], "p": params, "s": [d["prise"] for d in detail]},
                                                           ensure_ascii=False, sort_keys=True).encode()).hexdigest(),
                          "words_per_minute": debit, "status": "non_valide_a_l_ecoute"}
        qa[e["id"]] = {"texte": e["tts_text"], "duree_s": duree, "mots_min": debit, "fragments": detail, "a_ecouter": drapeaux}
        if drapeaux:
            alertes.append((e["id"], e["role"], e["tts_text"], drapeaux))
    (OUT / "manifest.json").write_text(json.dumps({"parameters": params, "clips": clips}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (OUT / "qa-selection.json").write_text(json.dumps(qa, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    L = ["# Audios à écouter en priorité\n"] + [f"- `{i}` ({r}) — « {t[:90]} » : " + " ; ".join(d) for i, r, t, d in alertes]
    (T / "a_ecouter.md").write_text("\n".join(L) + "\n", encoding="utf-8")
    longs = [c["words_per_minute"] for c in clips.values() if len(re.findall(r"\w+", c["tts_text"])) >= 8]
    nat = [f["naturel"] for q in qa.values() for f in q["fragments"]]
    syl = [f["syl_s"] for q in qa.values() for f in q["fragments"] if f["syl_s"] and RY.get(f["prise"], {}).get("syllabes", 0) >= 6]
    fm = [f["frontieres_marquees"] for q in qa.values() for f in q["fragments"] if f["frontieres_marquees"] is not None]
    fg = [f["fin_groupe"] for q in qa.values() for f in q["fragments"] if f["fin_groupe"] is not None]
    nv = [f["npvi"] for q in qa.values() for f in q["fragments"] if f["npvi"] is not None]
    print(f"rythme : débit médian {np.median(syl):.2f} syllabes/s (de {min(syl)} à {max(syl)}) · frontières marquées {np.mean(fm):.0%} · "
          f"allongement de fin de groupe ×{np.median(fg):.2f} · régularité nPVI {np.median(nv):.0f}")
    print(f"{len(clips)} MP3 écrits · {sum(c['duration_s'] for c in clips.values()) / 60:.1f} min · "
          f"débit médian des textes de 8 mots et plus : {np.median(longs):.0f} mots/min (de {min(longs)} à {max(longs)}) · "
          f"naturel médian {np.median(nat):.2f} · timbre médian {np.median([f['timbre'] for q in qa.values() for f in q['fragments']]):.2f} · "
          f"{len(alertes)} audios à écouter en priorité")


if __name__ == "__main__":
    main()
