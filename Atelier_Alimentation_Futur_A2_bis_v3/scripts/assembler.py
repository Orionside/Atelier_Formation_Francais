#!/usr/bin/env python3
"""Choisit la meilleure prise de chaque texte, la calibre, assemble les fragments et écrit les MP3 + le manifeste.

  .venv-ecoute/bin/python outils_voix/assembler.py <dossier de l'atelier> <dossier de travail>

Entrées (dossier de travail) : prises/*.wav, prises/prises.json, prises/mesures.json, prises/ecoute.json.
Sorties (atelier) : audio/qwen3-tts/<id>.mp3, manifest.json, qa-selection.json ; (travail) a_ecouter.md.

Une prise est retenue si : elle n'est pas tronquée, tous les mots sont retrouvés (autant que la meilleure
prise), le timbre ressemble à la référence et la hauteur reste dans la plage de la voix. Parmi les prises
valables, on garde la mieux notée en naturel, avec une pénalité si elle articule à plus de 190 mots/min.
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
from calibrer import calibrer

F0_MIN, F0_MAX = 165, 240          # plage de la voix de référence (médiane 192 Hz), en Hz
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


def choisir(noms, P, M, E, texte, trou=False):
    c = []
    for n in noms:
        m, e, p = M.get(n), E.get(n), P.get(n)
        if not (m and e and p):
            continue
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
        c.append({"nom": n, "wer": w, "timbre": e["timbre"], "naturel": e.get("naturel", 0), "court": court,
                  "art": m["mots_min_hors_pauses"], "defauts": defauts})
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
        x["score"] = x["naturel"] - 0.008 * max(0, x["art"] - 190) - 3 * x["wer"] - 2 * len(x["defauts"])
    c.sort(key=lambda x: -x["score"])
    return c[0], c


def main():
    A, T = Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve()
    D = T / "prises"
    P = json.loads((D / "prises.json").read_text(encoding="utf-8"))
    M = json.loads((D / "mesures.json").read_text(encoding="utf-8"))
    EC = json.loads((D / "ecoute.json").read_text(encoding="utf-8"))
    cat = json.loads((A / "audio/catalogue-qwen3tts.json").read_text(encoding="utf-8"))["entries"]
    OUT = A / "audio/qwen3-tts"
    OUT.mkdir(parents=True, exist_ok=True)
    ref = A / "audio/voix-reference/reference.wav"
    params = {"model": "mlx-community/Qwen3-TTS-12Hz-1.7B-Base-8bit", "language": "French", "runtime": "mlx-audio",
              "mode": "empreinte vocale seule (x-vector), sans transcription de la référence",
              "reference_sha256": hashlib.sha256(ref.read_bytes()).hexdigest(),
              "voice": "féminine, clonée par Qwen3-TTS Base à partir du fichier « Voix féminine générée.wav » fourni par le formateur comme voix de synthèse",
              "format": "mp3 192 kb/s", "niveau": "A2+", "temperature": 0.9, "top_k": 50, "top_p": 1.0,
              "repetition_penalty": 1.05, "prises_par_texte": 3,
              "rythme": "une phrase par paragraphe, « ... » à la place des virgules dans le texte envoyé au modèle",
              "calibrage": "pauses ≥ 0,40 s (virgule) et ≥ 0,70 s (fin de phrase) ; atempo ≤ 1,12 au-delà de 200 mots/min"}
    clips, qa, alertes = {}, {}, []
    for e in cat:
        morceaux = [s["text"] for s in e["segments"]] if e.get("segments") else [e["tts_text"]]
        sons, sr, detail, drapeaux = [], None, [], []
        for k, texte in enumerate(morceaux):
            noms = [n for n in P if n.startswith(f"{e['id']}__s{k}__g")]
            best, tous = choisir(noms, P, M, EC, texte, trou=(e["role"] == "phrase_a_completer"))
            if best is None:
                raise RuntimeError("Aucune prise mesurée pour " + e["id"])
            x, sr, j = calibrer(D / f"{best['nom']}.wav", M[best["nom"]])
            sons.append(x)
            detail.append({"prise": best["nom"], "graine": P[best["nom"]]["graine"], **{a: best[a] for a in ("wer", "timbre", "naturel", "art")},
                           "calibrage": j, "prises": [{a: t[a] for a in ("nom", "score", "wer", "timbre", "naturel", "art", "defauts")} for t in tous]})
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
        if n_mots >= 8 and debit > 185:
            drapeaux.append(f"débit {debit} mots/min")
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
    print(f"{len(clips)} MP3 écrits · {sum(c['duration_s'] for c in clips.values()) / 60:.1f} min · "
          f"débit médian des textes de 8 mots et plus : {np.median(longs):.0f} mots/min (de {min(longs)} à {max(longs)}) · "
          f"naturel médian {np.median(nat):.2f} · timbre médian {np.median([f['timbre'] for q in qa.values() for f in q['fragments']]):.2f} · "
          f"{len(alertes)} audios à écouter en priorité")


if __name__ == "__main__":
    main()
