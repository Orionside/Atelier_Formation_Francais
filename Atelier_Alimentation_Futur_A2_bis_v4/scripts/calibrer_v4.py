#!/usr/bin/env python3
"""Calibre les pauses d'un audio de synthèse d'après ses groupes rythmiques (version bis v4).

Idée : la pause doit dire la force de la frontière, toujours de la même façon. Un apprenant qui ne peut
pas s'appuyer sur un accent de mot s'appuie sur ces frontières pour découper la phrase.

  frontière de groupe ajoutée (« mineure ») : pas de pause ou une pause courte, au plus 0,20 s
  virgule, deux-points, tiret               : pause de 0,35 à 0,55 s
  fin de phrase                             : pause de 0,70 à 0,95 s

On ne crée jamais de coupure là où la voix ne s'arrête pas : on allonge ou on raccourcit seulement un
silence qui existe déjà à la frontière. La voix elle-même n'est pas modifiée (ni hauteur, ni durée des
syllabes), sauf un léger allongement (atempo, au plus 1,10) au-delà de DEBIT_MAX syllabes par seconde.
"""
import subprocess

import numpy as np
import soundfile as sf

PLAGES = {"mineure": (0.0, 0.20), "virgule": (0.35, 0.55), "phrase": (0.70, 0.95)}
DEBIT_MAX, DEBIT_CIBLE, ALLONGEMENT_MAX = 5.6, 5.2, 1.10
NIVEAU_RMS = 0.085


def _rms_parole(x):
    crete = np.abs(x).max() or 1.0
    actif = x[np.abs(x) > 0.08 * crete]
    return float(np.sqrt(np.mean(actif ** 2))) if actif.size else 0.0


def _silences(x, sr, mini=0.06):
    larg = int(0.02 * sr)
    env = np.convolve(np.abs(x), np.ones(larg) / larg, mode="same")
    calme = env < 0.06 * np.percentile(env, 95)
    S, i, n = [], 0, len(x)
    while i < n:
        if calme[i]:
            j = i
            while j < n and calme[j]:
                j += 1
            if (j - i) / sr >= mini:
                S.append((i, j))
            i = j
        else:
            i += 1
    return S


def calibrer(chemin_wav, rythme):
    """rythme : l'entrée de rythme.json (frontieres, debit_syl_s). Renvoie (signal float32, taux, journal)."""
    x, sr = sf.read(str(chemin_wav), dtype="float32")
    if x.ndim > 1:
        x = x.mean(axis=1)
    S = _silences(x, sr)
    modifs = []
    for typ, _, _, t0, t1 in (rythme.get("frontieres") or []):
        a, b = int(max(0, t0 - 0.02) * sr), int((t1 + 0.02) * sr)
        dedans = [(i, j) for i, j in S if i >= a and j <= b]
        if not dedans:
            continue
        i, j = max(dedans, key=lambda s: s[1] - s[0])
        existant = (j - i) / sr
        mini, maxi = PLAGES[typ]
        voulu = min(max(existant, mini), maxi)
        if abs(voulu - existant) > 0.02:
            modifs.append((i, j, voulu))
    ajoute = retire = 0.0
    for i, j, voulu in sorted(modifs, reverse=True):
        milieu, existant = (i + j) // 2, (j - i) / sr
        if voulu > existant:
            x = np.concatenate([x[:milieu], np.zeros(int((voulu - existant) * sr), dtype=np.float32), x[milieu:]])
            ajoute += voulu - existant
        else:
            k = int((existant - voulu) * sr / 2)
            x = np.concatenate([x[:milieu - k], x[milieu + k:]])
            retire += existant - voulu
    f = 1.0
    debit = rythme.get("debit_syl_s") or 0
    if debit > DEBIT_MAX and (rythme.get("syllabes") or 0) >= 6:
        f = float(min(debit / DEBIT_CIBLE, ALLONGEMENT_MAX))
        brut = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-f", "f32le", "-ar", str(sr), "-ac", "1", "-i", "-",
                               "-af", f"atempo={1 / f:.5f}", "-f", "f32le", "-ac", "1", "-ar", str(sr), "-"],
                              input=x.astype("<f4").tobytes(), check=True, capture_output=True).stdout
        x = np.frombuffer(brut, dtype="<f4").copy()
    larg = int(0.02 * sr)
    env = np.convolve(np.abs(x), np.ones(larg) / larg, mode="same")
    actif = np.where(env > 0.04 * np.percentile(env, 95))[0]
    if actif.size:
        x = x[max(0, actif[0] - int(0.06 * sr)): min(len(x), actif[-1] + int(0.18 * sr))]
    r = _rms_parole(x)
    if r > 0:
        x = x * min(NIVEAU_RMS / r, 0.97 / (np.abs(x).max() or 1.0))
    n = int(0.01 * sr)
    x[:n] *= np.linspace(0, 1, n)
    x[-n:] *= np.linspace(1, 0, n)
    return x.astype(np.float32), sr, {"allongement": round(f, 3), "pauses_modifiees": len(modifs),
                                      "pause_ajoutee_s": round(ajoute, 2), "pause_retiree_s": round(retire, 2)}
