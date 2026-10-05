#!/usr/bin/env python3
"""Génère des prises Qwen3-TTS Base (clonage) d'après un plan JSON.

  .venv-qwen3tts/bin/python outils_voix/generer_prises.py <plan.json>

plan.json : {"reference": "ref.wav", "reference_texte": "…", "sortie": "dossier",
             "prises": {"nom": {"texte": "texte envoyé au modèle", "graine": 11}, …}}
Écrit <sortie>/<nom>.wav (24 kHz) et <sortie>/prises.json. Reprenable : une prise déjà écrite n'est pas refaite.
Réglages officiels du modèle : température 0,9 · top-k 50 · top-p 1,0 · pénalité de répétition 1,05
(mlx-audio la relève à 1,5 en clonage avec transcription). Aucune consigne en mots ni vitesse n'existe
pour ce modèle : le débit se règle par la ponctuation du texte et par le choix entre plusieurs prises.
"""
import json
import re
import sys
from pathlib import Path

import numpy as np
from scipy.io import wavfile

MODEL = "mlx-community/Qwen3-TTS-12Hz-1.7B-Base-8bit"


def main():
    import mlx.core as mx
    from mlx_audio.tts.utils import load_model
    plan = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    out = Path(plan["sortie"])
    out.mkdir(parents=True, exist_ok=True)
    fiche_p = out / "prises.json"
    fiche = json.loads(fiche_p.read_text(encoding="utf-8")) if fiche_p.is_file() else {}
    a_faire = [(n, p) for n, p in plan["prises"].items()
               if not ((out / f"{n}.wav").is_file() and fiche.get(n, {}).get("texte") == p["texte"]
                       and fiche.get(n, {}).get("graine") == p["graine"])]
    if not a_faire:
        print("Rien à générer.")
        return
    model = load_model(MODEL)
    for i, (nom, p) in enumerate(a_faire, 1):
        lettres = len(re.findall(r"[^\W\d_]", p["texte"]))
        # Plafond de longueur : 12,5 trames par seconde ; au plus ~0,16 s par lettre + 2 s (évite les boucles sans fin).
        plafond = int(12.5 * (0.16 * lettres + 2.0)) + 10
        mx.random.seed(p["graine"])
        o = list(model.generate(text=p["texte"], lang_code="French", ref_audio=plan["reference"],
                                ref_text=plan["reference_texte"], temperature=0.9, top_k=50, top_p=1.0,
                                repetition_penalty=1.05, max_tokens=plafond, stream=False, verbose=False))
        son = np.concatenate([np.asarray(s.audio, dtype=np.float32).reshape(-1) for s in o])
        taux = o[0].sample_rate
        wavfile.write(out / f"{nom}.wav", taux, (np.clip(son, -1, 1) * 32767).astype(np.int16))
        fiche[nom] = {**p, "duree_s": round(son.size / taux, 2), "plafond_atteint": bool(son.size / taux >= plafond / 12.5 - 0.2)}
        if i % 10 == 0 or i == len(a_faire):
            fiche_p.write_text(json.dumps(fiche, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        print(f"[{i}/{len(a_faire)}] {nom} : {son.size / taux:.1f} s", flush=True)


if __name__ == "__main__":
    main()
