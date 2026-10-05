#!/usr/bin/env python3
"""Calibre un audio de synthèse pour un niveau A2 : pauses et débit, sans changer la hauteur de la voix.

Le modèle Qwen3-TTS Base n'a pas de réglage de vitesse. On agit donc après la génération :
  1. pauses allongées aux endroits où la voix s'arrête déjà après une ponctuation (aucun effet mesuré
     sur la note de naturel) : au moins 0,40 s après une virgule, 0,70 s après une fin de phrase ;
  2. allongement léger (ffmpeg atempo, au plus 1,12) seulement si la voix articule à plus de
     200 mots/min. Essais du 02/10/2026 : atempo coûte environ 0,3 point de naturel (UTMOSv2),
     l'allongement PSOLA de Praat environ 1 point : il a été écarté ;
  3. silences de début et de fin raccourcis, niveau sonore égalisé.
"""
import subprocess

import numpy as np
import soundfile as sf

SEUIL_ALLONGEMENT, CIBLE_ARTICULATION, ALLONGEMENT_MAX = 200.0, 195.0, 1.12
PAUSE_VIRGULE, PAUSE_PHRASE = 0.40, 0.70
NIVEAU_RMS = 0.085  # niveau de la parole (hors silences)


def _rms_parole(x):
    crete = np.abs(x).max() or 1.0
    actif = x[np.abs(x) > 0.08 * crete]
    return float(np.sqrt(np.mean(actif ** 2))) if actif.size else 0.0


def calibrer(chemin_wav, mesure):
    """mesure : l'entrée de mesures.json (mots_t, mots_min_hors_pauses). Renvoie (signal float32, taux, journal)."""
    x, sr = sf.read(str(chemin_wav), dtype="float32")
    W = mesure.get("mots_t") or []
    art = mesure.get("mots_min_hors_pauses") or 0
    f = 1.0
    if len(W) >= 3 and art > SEUIL_ALLONGEMENT:
        f = float(min(art / CIBLE_ARTICULATION, ALLONGEMENT_MAX))
        brut = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(chemin_wav), "-af",
                               f"atempo={1 / f:.5f}", "-f", "f32le", "-ac", "1", "-ar", str(sr), "-"],
                              check=True, capture_output=True).stdout
        x = np.frombuffer(brut, dtype="<f4").copy()
    larg = int(0.02 * sr)
    env = np.convolve(np.abs(x), np.ones(larg) / larg, mode="same")
    seuil = 0.06 * np.percentile(env, 95)
    ajouts = []
    for i in range(len(W) - 1):
        mot, fin, debut = W[i][0], W[i][2] * f, W[i + 1][1] * f
        fin_phrase = mot[-1:] in ".?!…:" or (mot[-1:] in "»\"" and mot[-2:-1] in ".?!…")
        voulu = PAUSE_PHRASE if fin_phrase else PAUSE_VIRGULE if mot[-1:] in ",;" else 0
        if not voulu:
            continue
        a, b = int(max(0, fin - 0.08) * sr), int(min(len(x) / sr, debut + 0.08) * sr)
        calme = np.where(env[a:b] < seuil)[0]
        if calme.size < int(0.06 * sr):
            continue  # la voix ne s'arrête pas ici : on n'invente pas de coupure au milieu d'un son
        existant = calme.size / sr
        if existant < voulu:
            ajouts.append((a + int(np.median(calme)), voulu - existant))
    for pos, manque in sorted(ajouts, reverse=True):
        x = np.concatenate([x[:pos], np.zeros(int(manque * sr), dtype=np.float32), x[pos:]])
    env = np.convolve(np.abs(x), np.ones(larg) / larg, mode="same")
    actif = np.where(env > 0.04 * np.percentile(env, 95))[0]
    if actif.size:
        x = x[max(0, actif[0] - int(0.06 * sr)): min(len(x), actif[-1] + int(0.18 * sr))]
    r = _rms_parole(x)
    if r > 0:
        x = x * min(NIVEAU_RMS / r, 0.97 / (np.abs(x).max() or 1.0))
    n = int(0.01 * sr)
    x[:n] *= np.linspace(0, 1, n); x[-n:] *= np.linspace(1, 0, n)
    return x.astype(np.float32), sr, {"allongement": round(f, 3), "pauses_allongees": len(ajouts),
                                      "pause_ajoutee_s": round(sum(m for _, m in ajouts), 2)}


if __name__ == "__main__":
    import json, sys
    from pathlib import Path
    src, dst = Path(sys.argv[1]), Path(sys.argv[2])
    dst.mkdir(parents=True, exist_ok=True)
    M = json.loads((src / "mesures.json").read_text(encoding="utf-8"))
    J = {}
    for nom, m in M.items():
        x, sr, j = calibrer(src / f"{nom}.wav", m)
        sf.write(dst / f"{nom}.wav", np.clip(x, -1, 1), sr, subtype="PCM_16")
        J[nom] = j
        print(nom, j, flush=True)
    (dst / "calibrage.json").write_text(json.dumps(J, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
