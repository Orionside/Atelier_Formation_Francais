#!/usr/bin/env python3
"""Transcription de contrôle : détecte des écarts lexicaux, pas la prosodie native."""
import argparse
import json
import re
import unicodedata
from pathlib import Path

import mlx_whisper

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "audio/qwen3-tts"
MANIFEST = OUTPUT / "manifest.json"
REPORT = OUTPUT / "qa-transcription.json"
WHISPER = (Path.home() / ".cache/huggingface/hub/"
           "models--mlx-community--whisper-large-v3-turbo/snapshots/"
           "a4aaeec0636e6fef84abdcbe3544cb2bf7e9f6fb")
GAP_ANSWERS = {"ecoute-a-trou-1":"changer", "ecoute-b-trou-1":"permet",
               "ecoute-b-trou-2":"gaspillee"}  # trou A2 (« plus ») : le mot est déjà dans la phrase


def words(text):
    text = unicodedata.normalize("NFKD", text.casefold())
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    return re.findall(r"[a-z0-9]+", text)


def wer(expected, heard):
    a, b = words(expected), words(heard)
    row = list(range(len(b) + 1))
    for i, token in enumerate(a, 1):
        nxt = [i]
        for j, got in enumerate(b, 1):
            nxt.append(min(row[j] + 1, nxt[-1] + 1, row[j - 1] + (token != got)))
        row = nxt
    return round(row[-1] / max(1, len(a)), 4)


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--limit", type=int, default=0)
    p.add_argument("--force", action="store_true")
    args = p.parse_args()
    if not WHISPER.is_dir():
        p.error("Modèle Whisper local introuvable")
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    data = json.loads(REPORT.read_text(encoding="utf-8")) if REPORT.exists() else {"clips":{}}
    records = data["clips"]
    items = list(manifest["clips"].items())
    if args.limit:
        items = items[:args.limit]
    for i, (id, clip) in enumerate(items, 1):
        if not args.force and records.get(id, {}).get("sha256") == clip["sha256"]:
            continue
        result = mlx_whisper.transcribe(str(ROOT / clip["file"]), path_or_hf_repo=str(WHISPER),
                                        language="fr", verbose=None)
        heard = result["text"].strip()
        score = wer(clip["tts_text"], heard)
        disclosed = id in GAP_ANSWERS and GAP_ANSWERS[id] in words(heard)
        if id=="ecoute-a-trou-2":
            disclosed=words(heard).count("plus")>words(clip["tts_text"]).count("plus")
        priority = disclosed or score > (0.35 if len(words(clip["tts_text"])) < 6 else 0.2)
        records[id] = {"sha256":clip["sha256"], "text":clip["tts_text"],
                       "transcribed":heard, "word_error_rate":score,
                       "answer_possibly_disclosed":disclosed,
                       "review_priority":"haute" if priority else "normale"}
        REPORT.write_text(json.dumps({"asr_model":"mlx-community/whisper-large-v3-turbo",
                                      "limitation":"La transcription ne mesure pas la prosodie native.",
                                      "clips":records},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
        print(f"[{i}/{len(items)}] {id}: WER {score:.0%}" +
              (" — réécouter" if priority else ""),flush=True)


if __name__ == "__main__":
    main()
