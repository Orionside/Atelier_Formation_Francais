#!/usr/bin/env python3
"""Mesure le rythme d'un audio français syllabe par syllabe (complète mesurer_gpu.py et ecouter.py).

Le français est une langue à rythme syllabique : à l'intérieur d'un groupe rythmique les syllabes ont des
durées voisines, et seule la DERNIÈRE syllabe du groupe est allongée. C'est ce repère de fin de groupe qui
remplace l'accent de mot pour découper la parole. On mesure donc, pour chaque prise :

  debit_syl_s        syllabes par seconde, pauses exclues (vitesse d'articulation)
  regularite_npvi    variabilité des durées de syllabes voisines à l'intérieur des groupes (nPVI ; plus bas =
                     plus régulier)
  allongement_final  durée de la syllabe de fin de groupe / durée médiane des autres syllabes
  pauses_internes    pauses de 0,25 s ou plus au milieu d'un groupe (elles cassent le groupe). En dessous,
                     un silence peut être une simple consonne (p, t, k) : on ne le compte pas.
  frontieres         pour chaque fin de groupe : type (mineure, virgule, phrase) et pause mesurée

Méthode : les sons attendus (eSpeak NG) sont alignés sur le signal avec le phonétiseur français wav2vec2
(alignement forcé CTC, pas de 20 ms). Une syllabe = l'intervalle entre deux voyelles successives, silences
retirés. La précision est d'environ ±20 ms par voyelle : ces mesures servent à COMPARER des prises entre elles.

  .venv-ecoute/bin/python outils_voix/mesurer_rythme.py <dossier> <textes.json> [--manuel groupes_manuel.txt]
Écrit <dossier>/rythme.json (reprenable).
"""
import argparse
import json
import os
import re
import sys
import unicodedata
from pathlib import Path

os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
os.environ.setdefault("HF_HUB_OFFLINE", "1")
os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")

import numpy as np
import torch
import torchaudio
import librosa

sys.path.insert(0, str(Path(__file__).parent))
from groupes_rythmiques import groupes, charger_manuel

VOYELLES = set("aeiouyøœɑɔəɛɐɒ")
PAS = 0.02
PAUSE_INTERNE = 0.25


class Aligneur:
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
        self.g2p = EspeakBackend("fr-fr", preserve_punctuation=False, with_stress=False, language_switch="remove-flags")
        nom = "Cnam-LMSSC/wav2vec2-french-phonemizer"
        self.p = AutoProcessor.from_pretrained(nom)
        self.m = AutoModelForCTC.from_pretrained(nom).eval()
        self.vocab = self.p.tokenizer.get_vocab()
        self.blanc = self.p.tokenizer.pad_token_id

    def sons(self, groupe):
        """Liste de (identifiant du son, est une voyelle) pour un groupe de mots."""
        t = re.sub(r"[«»()\[\]—–/·…\"]", " ", groupe)
        ipa = unicodedata.normalize("NFD", self.g2p.phonemize([t], strip=True)[0])
        out = []
        for c in ipa:
            if c == "ɥ":
                out.append((self.vocab["y"], False))
            elif c == "̃":
                out.append((self.vocab["̃"], False))
            elif c in self.vocab and c not in "| ":
                out.append((self.vocab[c], c in VOYELLES))
        return out

    @torch.no_grad()
    def aligner(self, x, G):
        """x : signal 16 kHz. G : liste de (groupe, frontière). Renvoie les voyelles : [(temps, n° de groupe)]."""
        cibles, voy = [], []
        for k, (g, _) in enumerate(G):
            for ident, v in self.sons(g):
                if v:
                    voy.append((len(cibles), k))
                cibles.append(ident)
        em = torch.log_softmax(self.m(**self.p(x, sampling_rate=16000, return_tensors="pt")).logits, dim=-1)
        if em.shape[1] < len(cibles) + 2 or not cibles:
            return None
        ali, sc = torchaudio.functional.forced_align(em, torch.tensor([cibles]), blank=self.blanc)
        spans = torchaudio.functional.merge_tokens(ali[0], sc[0].exp(), blank=self.blanc)
        if len(spans) != len(cibles):
            return None
        conf = float(np.mean([s.score for s in spans]))
        return [((spans[i].start + spans[i].end) / 2 * PAS, k) for i, k in voy], conf


def silences(x, sr=16000, mini=0.12):
    """Intervalles silencieux (début, fin) en secondes, et bornes de la parole."""
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
                S.append((i / sr, j / sr))
            i = j
        else:
            i += 1
    actif = np.where(~calme)[0]
    d, f = (actif[0] / sr, actif[-1] / sr) if actif.size else (0.0, n / sr)
    return [(a, b) for a, b in S if a > d and b < f], d, f


def mesurer(x, texte, A, manuel=None):
    G = [gf for ph in groupes(texte, manuel) for gf in ph]
    r = A.aligner(x, G)
    if r is None:
        return {"erreur": "alignement impossible"}
    V, conf = r
    S, debut, fin = silences(x)
    pauses = [(a, b) for a, b in S if b - a >= 0.15]
    art = (fin - debut) - sum(b - a for a, b in pauses)
    internes, finales, frontieres, n_int = {}, [], [], 0
    for i in range(len(V) - 1):
        (t0, g0), (t1, g1) = V[i], V[i + 1]
        sil = sum(min(b, t1) - max(a, t0) for a, b in S if b > t0 and a < t1)
        d = max(0.03, t1 - t0 - sil)
        if g0 == g1:
            internes.setdefault(g0, []).append(d)
            if any(b - a >= PAUSE_INTERNE and a > t0 and b < t1 for a, b in S):
                n_int += 1
        else:
            finales.append((G[g0][1], d, sil))
            frontieres.append([G[g0][1], round(sil, 2), d, round(t0, 2), round(t1, 2)])
    tous = [d for L in internes.values() for d in L]
    paires = [abs(a - b) / ((a + b) / 2) for L in internes.values() for a, b in zip(L, L[1:])]
    med = float(np.median(tous)) if tous else None
    out = {"syllabes": len(V), "groupes": len(G), "debit_syl_s": round(len(V) / max(art, 0.1), 2),
           "syllabe_mediane_s": round(med, 3) if med else None,
           "regularite_npvi": round(100 * float(np.mean(paires)), 1) if len(paires) >= 3 else None,
           "regularite_varco": round(100 * float(np.std(tous) / np.mean(tous)), 1) if len(tous) >= 4 else None,
           "pauses_internes": n_int, "confiance_alignement": round(conf, 2)}
    # Allongement : mesuré seulement aux frontières SANS pause (avec une pause, le silence mange une partie
    # de la syllabe et fausse la mesure ; la pause signale alors la frontière à elle seule).
    sans = [d for _, d, sil in finales if sil < 0.05]
    out["allongement_final"] = round(float(np.median(sans)) / med, 2) if sans and med else None
    # frontieres : [type, pause, allongement, temps de la dernière voyelle du groupe, temps de la voyelle suivante]
    out["frontieres"] = [[t, sil, round(d / med, 2) if med else None, t0, t1] for t, sil, d, t0, t1 in frontieres]
    marquees = [1 if (sil >= 0.10 or (med and d / med >= 1.3)) else 0 for _, sil, d, _, _ in frontieres]
    out["frontieres_marquees"] = round(float(np.mean(marquees)), 2) if marquees else None
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("dossier", type=Path)
    ap.add_argument("textes", type=Path)
    ap.add_argument("--manuel", type=Path)
    ap.add_argument("--sortie", default="rythme.json")
    ap.add_argument("--refaire", action="store_true", help="recalcule tout, même les prises déjà mesurées")
    a = ap.parse_args()
    T = json.loads(a.textes.read_text(encoding="utf-8"))
    M = charger_manuel(a.manuel) if a.manuel else None
    sortie = a.dossier / a.sortie
    R = json.loads(sortie.read_text(encoding="utf-8")) if sortie.is_file() and not a.refaire else {}
    todo = [n for n in T if n not in R and (a.dossier / f"{n}.wav").is_file()]
    A = Aligneur()
    for i, n in enumerate(todo, 1):
        x, _ = librosa.load(str(a.dossier / f"{n}.wav"), sr=16000, mono=True)
        R[n] = mesurer(x, T[n], A, M)
        if i % 25 == 0 or i == len(todo):
            sortie.write_text(json.dumps(R, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
            print(f"[{i}/{len(todo)}] {n} · {R[n].get('debit_syl_s')} syl/s · fin ×{R[n].get('allongement_final')} · nPVI {R[n].get('regularite_npvi')}", flush=True)
    print(len(R), "prises mesurées")


if __name__ == "__main__":
    main()
