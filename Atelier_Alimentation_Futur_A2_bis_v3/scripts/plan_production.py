"""Construit le plan des prises d'un atelier : 3 prises par texte (ou par fragment), texte rythmé niveau 2.

  uv run python outils_voix/plan_production.py <dossier de l'atelier> <dossier de travail>
"""
import json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from rythme import rythmer
GRAINES = [11, 29, 47]
A, T = Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve()
T.mkdir(parents=True, exist_ok=True)
E = json.loads((A / "audio/catalogue-qwen3tts.json").read_text(encoding="utf-8"))["entries"]
prises, textes = {}, {}
for e in E:
    morceaux = [s["text"] for s in e["segments"]] if e.get("segments") else [e["tts_text"]]
    for k, texte in enumerate(morceaux):
        for g in GRAINES:
            nom = f"{e['id']}__s{k}__g{g}"
            prises[nom] = {"texte": rythmer(texte, 2), "graine": g}
            textes[nom] = texte
ref = A / "audio/voix-reference/reference.wav"
plan = {"reference": str(ref), "reference_texte": None, "sortie": str(T / "prises"), "prises": prises}
(T / "plan.json").write_text(json.dumps(plan, ensure_ascii=False, indent=1), encoding="utf-8")
(T / "prises").mkdir(exist_ok=True)
(T / "prises/textes.json").write_text(json.dumps(textes, ensure_ascii=False, indent=1), encoding="utf-8")
print(len(E), "entrées ·", len(prises), "prises ·", sum(len(p["texte"]) for p in prises.values()), "caractères")
