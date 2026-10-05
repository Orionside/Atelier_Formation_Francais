"""Assemble les reprises ciblées de la v5 après transcription et mesures.

Usage : python scripts/appliquer_reprises_v5.py <travail_v4> <travail_v5>
Le reste des 235 lectures est la production validée techniquement de la v4,
obtenue avec la même référence féminine n° 2 et le même catalogue textuel.
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

from calibrer_v4 import calibrer

ROOT = Path(__file__).resolve().parents[1]
OLD = Path(sys.argv[1]).resolve() / "prises"
NEW = Path(sys.argv[2]).resolve() / "prises"
OUT = ROOT / "audio/qwen3-tts"
CAT = {entry["id"]: entry for entry in json.loads((ROOT / "audio/catalogue-qwen3tts.json").read_text(encoding="utf-8"))["entries"]}
manifest_path = OUT / "manifest.json"
qa_path = OUT / "qa-selection.json"
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
qa = json.loads(qa_path.read_text(encoding="utf-8"))

old_rythme = json.loads((OLD / "rythme.json").read_text(encoding="utf-8"))
new_rythme = json.loads((NEW / "rythme.json").read_text(encoding="utf-8"))
new_mesures = json.loads((NEW / "mesures.json").read_text(encoding="utf-8"))
new_ecoute = json.loads((NEW / "ecoute.json").read_text(encoding="utf-8"))

# Les homophones reconnus par Whisper ne sont pas une erreur acoustique :
# « perdu/perdue », « légume/légumes » et « il/ils » se prononcent pareil ici.
CHOIX = {
    "manuel-3-consigne": ["manuel-3-consigne__s0__g47", "manuel-3-consigne__s1__g47", "manuel-3-consigne__s2__g47"],
    "ecoute-b-trou-2": ["ecoute-b-trou-2__s0__g11", "ecoute-b-trou-2__s1__g257"],
}

for ident, noms in CHOIX.items():
    entry = CAT[ident]
    sons = []
    fragments = []
    sr = None
    for nom in noms:
        ancien = nom == "ecoute-b-trou-2__s0__g11"
        folder = OLD if ancien else NEW
        rythme = old_rythme[nom] if ancien else new_rythme[nom]
        if rythme.get("pauses_internes"):
            raise RuntimeError(f"Pause dans un groupe : {nom}")
        x, rate, journal = calibrer(folder / f"{nom}.wav", rythme)
        if sr is not None and sr != rate:
            raise RuntimeError("Fréquences audio différentes")
        sr = rate
        sons.append(x)
        if ancien:
            detail = qa[ident]["fragments"][0]
        else:
            mesure, ecoute = new_mesures[nom], new_ecoute[nom]
            if ecoute["timbre"] < 0.90 or not 200 <= mesure["f0_hz"] <= 285:
                raise RuntimeError(f"Voix hors plage : {nom}")
            detail = {
                "prise": nom,
                "graine": int(nom.rsplit("g", 1)[1]),
                "wer": mesure["wer"],
                "timbre": ecoute["timbre"],
                "naturel": ecoute["naturel"],
                "art": mesure["mots_min_hors_pauses"],
                "syl_s": rythme.get("debit_syl_s"),
                "fin_groupe": rythme.get("allongement_final"),
                "frontieres_marquees": rythme.get("frontieres_marquees"),
                "npvi": rythme.get("regularite_npvi"),
                "calibrage": journal,
            }
        fragments.append(detail)
    pause = np.zeros(round(sr * entry.get("pause_s", 0.22)), dtype=np.float32)
    y = np.concatenate([piece for i, x in enumerate(sons) for piece in ([pause, x] if i else [x])])
    target = OUT / f"{ident}.mp3"
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / "clip.wav"
        mp3 = Path(tmp) / "clip.mp3"
        sf.write(wav, np.clip(y, -1, 1), sr, subtype="PCM_16")
        subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(wav),
                        "-codec:a", "libmp3lame", "-b:a", "192k", str(mp3)], check=True)
        mp3.replace(target)
    duration = round(len(y) / sr, 3)
    n_words = len(re.findall(r"[\wÀ-ÿ]+(?:['’][\wÀ-ÿ]+)*", entry["tts_text"]))
    digest = hashlib.sha256(target.read_bytes()).hexdigest()
    manifest["clips"][ident] = {
        **entry, "duration_s": duration, "sha256": digest,
        "key": hashlib.sha256((entry["tts_text"] + "\n" + "\n".join(noms)).encode()).hexdigest(),
        "words_per_minute": round(n_words * 60 / duration), "status": "non_valide_a_l_ecoute",
    }
    qa[ident] = {
        "texte": entry["tts_text"], "duree_s": duration,
        "mots_min": round(n_words * 60 / duration), "fragments": fragments,
        "a_ecouter": ["Écoute humaine requise : nouvelle prise et prononciation des homophones"]
    }
    print(ident, duration, "s", digest[:12])

manifest["parameters"]["version"] = "bis v5"
manifest["parameters"]["reprises_ciblees"] = "consigne phonétique découpée ; fragment de phrase à trou remplacé après contrôle du timbre"
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
qa_path.write_text(json.dumps(qa, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

priorite = ["# Audios à écouter en priorité", "", "Les métriques automatiques ne valident pas le naturel ou l'intonation. Écoutez d'abord les deux reprises de la v5 :", ""]
for ident in CHOIX:
    priorite.append(f"- `{ident}` — {CAT[ident]['tts_text']}")
priorite += ["", "Autres alertes automatiques à vérifier au besoin (plusieurs sont des homophones ou des chiffres reconnus autrement) :", ""]
for ident, result in qa.items():
    if ident not in CHOIX and result.get("a_ecouter"):
        priorite.append(f"- `{ident}` — " + "; ".join(result["a_ecouter"]))
(ROOT / "audio/A_ECOUTER_EN_PRIORITE.md").write_text("\n".join(priorite) + "\n", encoding="utf-8")
