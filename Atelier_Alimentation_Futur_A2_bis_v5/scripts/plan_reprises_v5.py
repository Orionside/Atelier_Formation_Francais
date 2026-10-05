"""Plan reproductible des reprises ciblées après le contrôle de la production v4.

La référence vient du fichier MP4 fourni ; Qwen3-TTS Base l'emploie en mode
empreinte vocale seule. La longue consigne sur g est synthétisée par phrases pour
éviter la coupure observée. La fin d'une phrase à trou reçoit plusieurs prises
car ce fragment bref changeait parfois de timbre.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WORK = Path(sys.argv[1]).resolve()
WORK.mkdir(parents=True, exist_ok=True)
catalogue = json.loads((ROOT / "audio/catalogue-qwen3tts.json").read_text(encoding="utf-8"))
entries = {entry["id"]: entry for entry in catalogue["entries"]}
prises = {}
textes = {}
for ident, segments, seeds in (
    ("manuel-3-consigne", entries["manuel-3-consigne"]["segments"], [11, 29, 47, 83]),
    ("ecoute-b-trou-2", [entries["ecoute-b-trou-2"]["segments"][1]],
     [101, 137, 163, 199, 211, 233, 257, 283, 307, 331]),
):
    for index, segment in enumerate(segments):
        for seed in seeds:
            name = f"{ident}__s{index if ident == 'manuel-3-consigne' else 1}__g{seed}"
            prises[name] = {"texte": segment["text"], "graine": seed}
            textes[name] = segment["text"]

output = WORK / "prises"
output.mkdir(exist_ok=True)
(WORK / "plan.json").write_text(json.dumps({
    "reference": str(ROOT / "audio/voix-reference/reference.wav"),
    "reference_texte": None,
    "sortie": str(output),
    "prises": prises,
}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
(output / "textes.json").write_text(json.dumps(textes, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"{len(prises)} reprises planifiées dans {WORK}")
