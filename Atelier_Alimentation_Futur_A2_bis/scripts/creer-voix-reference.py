#!/usr/bin/env python3
"""Crée des voix féminines candidates avec Qwen3-TTS VoiceDesign (voix décrite en mots).

La voix retenue sert ensuite de référence au modèle Base (clonage) : tous les MP3 de
l'atelier gardent ainsi le même timbre. Chaque candidate dit le même texte de référence.

  /Users/toufik/impact60_mesure/.venv-qwen3tts/bin/python scripts/creer-voix-reference.py

Produit : ~/impact60_mesure/models/qwen3-tts/candidates_femme/c1.wav … c6.wav + candidates.json
Le choix se fait ensuite par mesure (transcription, hauteur, étendue de la mélodie) ET à l'oreille.
"""
import json
from pathlib import Path

import numpy as np
from scipy.io import wavfile

MODEL = "mlx-community/Qwen3-TTS-12Hz-1.7B-VoiceDesign-8bit"
OUT = Path(__file__).resolve().parents[1] / "audio/voix-reference/candidates"
# Une affirmation, une question, une consigne à trois temps : la référence porte la prosodie voulue.
TEXTE = ("Bonjour ! Aujourd'hui, nous allons parler de vos habitudes à table. "
         "Qu'est-ce qui change dans votre assiette ? "
         "Écoutez la phrase, répétez-la, puis dites votre propre phrase.")
DESCRIPTIONS = {
    "A": ("A 35-year-old native French woman from Paris speaking standard metropolitan French. "
          "Clear, precise articulation, warm and natural mid-pitched voice, calm and friendly tone "
          "of a language teacher, moderate pace, natural lively French intonation. "
          "Studio quality, no background noise."),
    "B": ("Une femme française de 35 ans, née à Paris, français standard sans accent régional. "
          "Voix claire et posée, timbre chaleureux, articulation très nette, débit modéré, "
          "intonation naturelle et vivante d'une formatrice bienveillante. Enregistrement en studio."),
    "C": ("Native French female voice, mid-thirties, professional voice-over for an online French "
          "course. Bright, clear, confident and smiling, medium pitch, crisp consonants, "
          "natural melodic French prosody, unhurried pace. Clean studio recording."),
}
GRAINES = [11]


def main():
    import mlx.core as mx
    from mlx_audio.tts.utils import load_model
    OUT.mkdir(parents=True, exist_ok=True)
    model = load_model(MODEL)
    fiche, n = {"model": MODEL, "texte": TEXTE, "candidates": {}}, 0
    for nom, description in DESCRIPTIONS.items():
        for graine in GRAINES:
            n += 1
            mx.random.seed(graine)
            sorties = list(model.generate(text=TEXTE, instruct=description, lang_code="French",
                                          temperature=0.9, top_k=50, top_p=1.0,
                                          repetition_penalty=1.05, stream=False, verbose=False))
            son = np.concatenate([np.asarray(s.audio, dtype=np.float32).reshape(-1) for s in sorties])
            taux = sorties[0].sample_rate
            cible = OUT / f"c{n}.wav"
            wavfile.write(cible, taux, (np.clip(son, -1, 1) * 32767).astype(np.int16))
            fiche["candidates"][cible.stem] = {"description": nom, "instruct": description,
                                               "graine": graine, "duree_s": round(son.size / taux, 2),
                                               "sample_rate": taux}
            (OUT / "candidates.json").write_text(json.dumps(fiche, ensure_ascii=False, indent=2) + "\n",
                                                 encoding="utf-8")
            print(f"[{n}/{len(DESCRIPTIONS) * len(GRAINES)}] {cible.name} : {son.size / taux:.1f} s "
                  f"(description {nom}, graine {graine})", flush=True)
    print("Candidates écrites dans", OUT)


if __name__ == "__main__":
    main()
