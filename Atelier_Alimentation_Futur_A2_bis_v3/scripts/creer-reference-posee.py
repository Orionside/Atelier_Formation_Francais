#!/usr/bin/env python3
"""Fabrique des candidates de « référence posée » : la voix clonée dit un texte calme et bien ponctué.

Le modèle Base n'a ni consigne en mots ni réglage de vitesse : il imite le débit et la mélodie de sa
référence. On crée donc une référence au bon débit pour un niveau A2 (cible : 140 à 160 mots/min),
à partir de deux sources (a : extrait au débit d'origine ; b : extrait ralenti), plusieurs prises chacune.

  .venv-qwen3tts/bin/python scripts/creer-reference-posee.py [nombre de prises par source]
"""
import json
import sys
from pathlib import Path

import numpy as np
from scipy.io import wavfile

ROOT = Path(__file__).resolve().parents[1]
D = ROOT / "audio/voix-reference/posee"
MODEL = "mlx-community/Qwen3-TTS-12Hz-1.7B-Base-8bit"
TEXTE = ("Bonjour ! Aujourd'hui, nous allons parler de vos habitudes à table. "
         "Qu'est-ce qui change dans votre assiette ? "
         "Écoutez la phrase, répétez-la, puis dites votre propre phrase.")
GRAINES = [11, 29, 47, 83, 101, 137, 163, 199]


def main():
    import mlx.core as mx
    from mlx_audio.tts.utils import load_model
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 4
    sources = sys.argv[2].split(",") if len(sys.argv) > 2 else ["a", "b"]
    model = load_model(MODEL)
    fiche_p = D / "candidates.json"
    fiche = json.loads(fiche_p.read_text(encoding="utf-8")) if fiche_p.is_file() else {"texte": TEXTE, "candidates": {}}
    for s in sources:
        ref, ref_text = D / f"source_{s}.wav", (D / f"source_{s}.txt").read_text(encoding="utf-8").strip()
        for g in GRAINES[:n]:
            nom = f"{s}{g}"
            mx.random.seed(g)
            out = list(model.generate(text=TEXTE, lang_code="French", ref_audio=str(ref), ref_text=ref_text,
                                      temperature=0.9, top_k=50, top_p=1.0, repetition_penalty=1.05,
                                      max_tokens=600, stream=False, verbose=False))
            son = np.concatenate([np.asarray(o.audio, dtype=np.float32).reshape(-1) for o in out])
            taux = out[0].sample_rate
            wavfile.write(D / f"{nom}.wav", taux, (np.clip(son, -1, 1) * 32767).astype(np.int16))
            fiche["candidates"][nom] = {"source": s, "graine": g, "duree_s": round(son.size / taux, 2)}
            fiche_p.write_text(json.dumps(fiche, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            print(f"{nom}.wav : {son.size / taux:.1f} s", flush=True)


if __name__ == "__main__":
    main()
