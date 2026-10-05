#!/usr/bin/env python3
"""Comme ecouter.py (timbre WavLM + naturel UTMOSv2), mais par lots : bien plus rapide sur un grand dossier.

  .venv-ecoute/bin/python outils_voix/ecouter_lot.py <dossier> --reference ref.wav [--noms noms.json] [--lot 32]

  timbre  : calculé pour tous les .wav du dossier (rapide)
  naturel : calculé seulement pour les noms de --noms (liste JSON), ou pour tous si l'option est absente
Écrit <dossier>/ecoute.json au fur et à mesure (reprenable).
"""
import argparse
import json
import os
import sys
import time
from pathlib import Path

os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")

sys.path.insert(0, str(Path(__file__).parent))
from ecouter import Timbre, charger


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("dossier", type=Path)
    ap.add_argument("--reference", type=Path, required=True)
    ap.add_argument("--noms", type=Path)
    ap.add_argument("--lot", type=int, default=32)
    ap.add_argument("--sortie", default="ecoute.json")
    a = ap.parse_args()
    sortie = a.dossier / a.sortie
    R = json.loads(sortie.read_text(encoding="utf-8")) if sortie.is_file() else {}
    fichiers = sorted(p for p in a.dossier.glob("*.wav"))
    manque = [p for p in fichiers if "timbre" not in R.get(p.stem, {})]
    if manque:
        timbre = Timbre(a.reference)
        for i, p in enumerate(manque, 1):
            R.setdefault(p.stem, {})["timbre"] = round(timbre(charger(p)), 3)
            if i % 100 == 0 or i == len(manque):
                sortie.write_text(json.dumps(R, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
                print(f"timbre [{i}/{len(manque)}]", flush=True)
    voulus = json.loads(a.noms.read_text(encoding="utf-8")) if a.noms else [p.stem for p in fichiers]
    todo = [n for n in voulus if "naturel" not in R.get(n, {}) and (a.dossier / f"{n}.wav").is_file()]
    if not todo:
        print("naturel : rien à calculer")
        return
    import utmosv2
    modele = utmosv2.create_model(pretrained=True, device="cpu")
    t0 = time.time()
    for k in range(0, len(todo), a.lot):
        lot = todo[k:k + a.lot]
        res = modele.predict(input_dir=str(a.dossier), val_list=list(lot), device="cpu", batch_size=8, num_workers=0, verbose=False)
        for r in res:
            R.setdefault(Path(r["file_path"]).stem, {})["naturel"] = round(float(r["predicted_mos"]), 2)
        sortie.write_text(json.dumps(R, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        fait = min(k + a.lot, len(todo))
        print(f"naturel [{fait}/{len(todo)}] · {(time.time() - t0) / fait:.1f} s par prise", flush=True)


if __name__ == "__main__":
    main()
