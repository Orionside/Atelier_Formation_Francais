"""Plan des prises, version bis v4 : texte découpé en groupes rythmiques, clonage par empreinte vocale seule.

  .venv-ecoute/bin/python outils_voix/plan_production_v4.py <dossier de l'atelier> <dossier de travail>

Choix issus de l'essai comparatif du 05/10/2026 (120 prises, voix de référence n° 2) :
  - empreinte vocale seule : 5,4 syllabes/s, contre 5,8 à 6,0 avec la transcription de la référence
    (le modèle imite alors le débit rapide de la référence) ;
  - une virgule à chaque frontière de groupe rythmique dans le texte envoyé au modèle : 100 % des fins de
    groupe marquées (pause ou dernière syllabe allongée ×2,0), contre 86 % et ×1,4 sans découpage ;
    naturel égal ou meilleur (3,50 contre 3,42).
Le découpage vient de groupes_rythmiques.py, corrigé à la main dans <dossier de travail>/groupes_manuel.txt.
"""
import json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from groupes_rythmiques import mise_en_forme, charger_manuel, groupes
GRAINES = [11, 29, 47, 83]
GRAINES_TROU = [11, 29, 47, 83, 101, 137, 163, 199, 211, 233]   # le modèle complète souvent la phrase à trous
A, T = Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve()
(T / "prises").mkdir(parents=True, exist_ok=True)
E = json.loads((A / "audio/catalogue-qwen3tts.json").read_text(encoding="utf-8"))["entries"]
M = charger_manuel(T / "groupes_manuel.txt") if (T / "groupes_manuel.txt").is_file() else {}
prises, textes, decoupage = {}, {}, {}
for e in E:
    morceaux = [s["text"] for s in e["segments"]] if e.get("segments") else [e["tts_text"]]
    for k, texte in enumerate(morceaux):
        trou = e["role"] == "phrase_a_completer" and texte.rstrip().endswith("…")
        decoupage[f"{e['id']}__s{k}"] = [[g for g, f in ph] for ph in groupes(texte, M)]
        for g in (GRAINES_TROU if trou else GRAINES):
            nom = f"{e['id']}__s{k}__g{g}"
            prises[nom] = {"texte": mise_en_forme(texte, "groupes", M), "graine": g}
            textes[nom] = texte
plan = {"reference": str(A / "audio/voix-reference/reference.wav"), "reference_texte": None, "sortie": str(T / "prises"), "prises": prises}
(T / "plan.json").write_text(json.dumps(plan, ensure_ascii=False, indent=1), encoding="utf-8")
(T / "prises/textes.json").write_text(json.dumps(textes, ensure_ascii=False, indent=1), encoding="utf-8")
(T / "decoupage.json").write_text(json.dumps(decoupage, ensure_ascii=False, indent=1), encoding="utf-8")
(T / "production.json").write_text(json.dumps({
    "mode": "empreinte vocale seule (x-vector), sans transcription de la référence",
    "rythme": "une phrase par paragraphe ; une virgule à chaque frontière de groupe rythmique (3 à 8 syllabes) dans le texte envoyé au modèle",
    "prises_par_texte": len(GRAINES), "prises_par_phrase_a_trous": len(GRAINES_TROU)}, ensure_ascii=False, indent=1), encoding="utf-8")
print(len(E), "entrées ·", len(prises), "prises ·", sum(len(p["texte"]) for p in prises.values()), "caractères")
