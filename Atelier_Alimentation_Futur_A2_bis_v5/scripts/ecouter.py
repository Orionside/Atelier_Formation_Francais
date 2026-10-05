#!/usr/bin/env python3
"""« Écoute » automatique d'audios de synthèse (complète mesurer.py, ne remplace pas l'oreille).

Pour chaque audio :
  naturel     : note UTMOSv2 de 1 à 5 (prédit le jugement d'auditeurs ; calibré surtout sur l'anglais,
                donc à utiliser pour CLASSER des prises entre elles, pas pour certifier une qualité)
  timbre      : ressemblance avec la référence (cosinus des empreintes WavLM, 0 à 1)
  sons        : taux d'erreur sur les sons prononcés (phonétiseur français wav2vec2) par rapport aux sons
                attendus (eSpeak NG). Les deux outils ne notent pas toujours pareil : la valeur de base
                d'une lecture correcte n'est pas 0, on compare donc des prises entre elles.

  .venv-ecoute/bin/python outils_voix/ecouter.py <dossier> --reference ref.wav --texte "…"
  .venv-ecoute/bin/python outils_voix/ecouter.py <dossier> --reference ref.wav --textes textes.json
Écrit ecoute.json dans le dossier.
"""
import argparse
import json
import os
import re
import unicodedata
from pathlib import Path

os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")

import numpy as np
import torch
import librosa


def charger(chemin, sr=16000):
    x, _ = librosa.load(str(chemin), sr=sr, mono=True)
    return x


class Timbre:
    def __init__(self, reference):
        from transformers import Wav2Vec2FeatureExtractor, WavLMForXVector
        nom = "microsoft/wavlm-base-plus-sv"
        self.fe = Wav2Vec2FeatureExtractor.from_pretrained(nom)
        self.m = WavLMForXVector.from_pretrained(nom).eval()
        self.ref = self.empreinte(charger(reference))

    @torch.no_grad()
    def empreinte(self, x):
        if len(x) < 16000:  # les clips très courts sont répétés : l'empreinte a besoin d'au moins 1 s
            x = np.tile(x, int(np.ceil(16000 / max(1, len(x)))))
        e = self.m(**self.fe(x, sampling_rate=16000, return_tensors="pt")).embeddings
        return torch.nn.functional.normalize(e, dim=-1)[0]

    def __call__(self, x):
        return float(torch.dot(self.ref, self.empreinte(x)))


class Sons:
    def __init__(self):
        from transformers import AutoProcessor, AutoModelForCTC
        import espeakng_loader
        from phonemizer.backend.espeak.wrapper import EspeakWrapper
        from phonemizer.backend import EspeakBackend
        EspeakWrapper.set_library(espeakng_loader.get_library_path())
        os.environ["ESPEAK_DATA_PATH"] = espeakng_loader.get_data_path()
        try:
            EspeakWrapper.set_data_path(espeakng_loader.get_data_path())
        except Exception:
            pass
        self.g2p = EspeakBackend("fr-fr", preserve_punctuation=False, with_stress=False)
        nom = "Cnam-LMSSC/wav2vec2-french-phonemizer"
        self.p = AutoProcessor.from_pretrained(nom)
        self.m = AutoModelForCTC.from_pretrained(nom).eval()

    @staticmethod
    def normaliser(s):
        s = unicodedata.normalize("NFC", s)
        s = s.replace("ɡ", "g").replace("ʁ", "ʁ").replace("r", "ʁ").replace("ː", "").replace("-", "")
        s = re.sub(r"[\s|.,;:!?()«»\"']", "", s)
        return list(s)

    def attendus(self, texte):
        return self.normaliser(" ".join(self.g2p.phonemize([texte], strip=True)))

    @torch.no_grad()
    def entendus(self, x):
        logits = self.m(**self.p(x, sampling_rate=16000, return_tensors="pt")).logits
        return self.normaliser(self.p.batch_decode(torch.argmax(logits, dim=-1))[0])

    def __call__(self, x, texte):
        a, b = self.attendus(texte), self.entendus(x)
        row = list(range(len(b) + 1))
        for i, u in enumerate(a, 1):
            nxt = [i]
            for j, v in enumerate(b, 1):
                nxt.append(min(row[j] + 1, nxt[-1] + 1, row[j - 1] + (u != v)))
            row = nxt
        return row[-1] / max(1, len(a)), "".join(a), "".join(b)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("dossier", type=Path)
    ap.add_argument("--reference", type=Path, required=True)
    ap.add_argument("--texte")
    ap.add_argument("--textes", type=Path, help="JSON {nom du fichier sans extension: texte attendu}")
    ap.add_argument("--sans-naturel", action="store_true")
    ap.add_argument("--sans-sons", action="store_true", help="ne pas calculer les sons (mesure peu fiable)")
    ap.add_argument("--sortie", default="ecoute.json")
    a = ap.parse_args()
    textes = json.loads(a.textes.read_text(encoding="utf-8")) if a.textes else None
    fichiers = [p for p in sorted(a.dossier.iterdir()) if p.suffix in (".wav", ".mp3") and not p.stem.startswith("source")
                and (textes is None or p.stem in textes)]
    sortie = a.dossier / a.sortie
    R = json.loads(sortie.read_text(encoding="utf-8")) if sortie.is_file() else {}
    fichiers = [p for p in fichiers if p.stem not in R or ("naturel" not in R[p.stem] and not a.sans_naturel)]
    timbre, sons = Timbre(a.reference), (None if a.sans_sons else Sons())
    naturel = None
    if not a.sans_naturel:
        import utmosv2
        naturel = utmosv2.create_model(pretrained=True, device="cpu")
    for p in fichiers:
        x = charger(p)
        texte = textes[p.stem] if textes else a.texte
        r = R[p.stem] = {"timbre": round(timbre(x), 3)}
        if sons is not None:
            per, att, ent = sons(x, texte)
            r.update({"sons_erreurs": round(per, 3), "sons_attendus": att, "sons_entendus": ent})
        if naturel is not None:
            r["naturel"] = round(float(naturel.predict(input_path=str(p), device="cpu", verbose=False)), 2)
        print(f"{p.stem:28s} naturel {r.get('naturel', '-')} · timbre {r['timbre']:.2f}"
              + (f" · sons {r['sons_erreurs']:.0%}" if "sons_erreurs" in r else ""), flush=True)
        sortie.write_text(json.dumps(R, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
