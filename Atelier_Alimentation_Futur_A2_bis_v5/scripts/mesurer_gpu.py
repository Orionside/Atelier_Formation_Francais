#!/usr/bin/env python3
"""Même mesure que mesurer.py, mais avec Whisper sur la carte graphique (mlx_whisper) et reprenable.

  ~/.hermes/workspaces/default/.venv-transcription/bin/python outils_voix/mesurer_gpu.py <dossier> <textes.json>
Écrit <dossier>/mesures.json au fur et à mesure (une prise déjà mesurée n'est pas refaite).
"""
import json, re, sys, unicodedata
from pathlib import Path
import numpy as np
import mlx_whisper
from mlx_whisper.audio import load_audio
sys.path.insert(0, str(Path.home() / "impact60_mesure"))
import melodie as MEL

MODELE = str(next((Path.home() / ".cache/huggingface/hub/models--mlx-community--whisper-large-v3-turbo/snapshots").iterdir()))


def mots(s):
    s = "".join(c for c in unicodedata.normalize("NFKD", s.casefold()) if not unicodedata.combining(c))
    return re.findall(r"[a-z0-9]+", s)


def wer(a, b):
    row = list(range(len(b) + 1))
    for i, x in enumerate(a, 1):
        nxt = [i]
        for j, y in enumerate(b, 1): nxt.append(min(row[j] + 1, nxt[-1] + 1, row[j - 1] + (x != y)))
        row = nxt
    return row[-1] / max(1, len(a))


def mesurer(chemin, attendu):
    x = np.array(load_audio(str(chemin)), dtype=np.float32)
    r = mlx_whisper.transcribe(x, path_or_hf_repo=MODELE, language="fr", word_timestamps=True,
                               condition_on_previous_text=False, verbose=None)
    W = [w for s in r["segments"] for w in s.get("words", [])]
    txt = r["text"].strip()
    f = MEL.f0_yin(x); v = f[f > 0]
    st = 12 * np.log2(v / np.median(v)) if len(v) > 10 else np.zeros(1)
    P = [(W[i]["word"].strip(), round(float(W[i + 1]["start"] - W[i]["end"]), 2)) for i in range(len(W) - 1)
         if W[i + 1]["start"] - W[i]["end"] >= 0.15]
    dur = len(x) / 16000
    parole = (W[-1]["end"] - W[0]["start"] - sum(p for _, p in P)) if W else dur
    n = len(mots(attendu))
    return {"duree_s": round(dur, 2), "wer": round(wer(mots(attendu), mots(txt)), 3), "mots_min": round(n * 60 / dur),
            "mots_min_hors_pauses": round(n * 60 / max(parole, 0.1)), "pauses": P,
            "f0_hz": round(float(np.median(v))) if len(v) > 10 else None,
            "etendue_dt": round(float(np.percentile(st, 95) - np.percentile(st, 5)), 1),
            "transcription": txt,
            "mots_t": [[w["word"].strip(), round(float(w["start"]), 2), round(float(w["end"]), 2)] for w in W]}


def main():
    D, T = Path(sys.argv[1]), json.loads(Path(sys.argv[2]).read_text(encoding="utf-8"))
    sortie = D / "mesures.json"
    R = json.loads(sortie.read_text(encoding="utf-8")) if sortie.is_file() else {}
    a_faire = [n for n in T if n not in R and (D / f"{n}.wav").is_file()]
    for i, n in enumerate(a_faire, 1):
        R[n] = mesurer(D / f"{n}.wav", T[n])
        if i % 20 == 0 or i == len(a_faire):
            sortie.write_text(json.dumps(R, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
            print(f"[{i}/{len(a_faire)}] {n} · erreurs {R[n]['wer']:.0%} · {R[n]['mots_min_hors_pauses']} m/min", flush=True)
    print(f"{len(R)} prises mesurées")


if __name__ == "__main__":
    main()
