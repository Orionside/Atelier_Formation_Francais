#!/usr/bin/env python3
"""Contrôle lexical des six glosses prononcées par la voix macOS es_ES.

L'ASR ne peut pas certifier un accent natif ; la locale de la voix et une écoute
humaine restent indispensables.
"""
import json
import re
import subprocess
import tempfile
from pathlib import Path

import mlx_whisper

ROOT = Path(__file__).resolve().parents[1]
CATALOGUE = ROOT / "audio/catalogue-qwen3tts.json"
REPORT = ROOT / "audio/qwen3-tts/qa-castillan.json"
MODEL = (Path.home() / ".cache/huggingface/hub/"
         "models--mlx-community--whisper-large-v3-mlx/snapshots/"
         "49e6aa286ad60c14352c404340ded53710378a11")


def words(text):
    return re.findall(r"[a-záéíóúüñ]+", text.casefold())


def main():
    if not MODEL.is_dir():
        raise RuntimeError("Modèle Whisper espagnol local introuvable")
    voices = subprocess.run(["say", "-v", "?"], capture_output=True,
                            text=True, check=True).stdout
    if not re.search(r"^Mónica[^\n]*\bes_ES\b", voices, re.MULTILINE):
        raise RuntimeError("Voix Mónica es_ES absente")
    entries = json.loads(CATALOGUE.read_text(encoding="utf-8"))["entries"]
    result = {}
    for entry in entries:
        spanish = [p["text"] for p in entry.get("segments", []) if p["lang"] == "es-ES"]
        if not spanish:
            continue
        if len(spanish) != 1:
            raise RuntimeError("Plusieurs segments espagnols : " + entry["id"])
        with tempfile.TemporaryDirectory(prefix="a1-castillan-") as folder:
            aiff = Path(folder) / "spanish.aiff"
            subprocess.run(["say", "-v", "Mónica", "-r", "160", "-o", str(aiff),
                            spanish[0]], capture_output=True, check=True)
            transcript = mlx_whisper.transcribe(str(aiff), path_or_hf_repo=str(MODEL),
                                                language="es", verbose=None)["text"].strip()
        result[entry["id"]] = {"expected":spanish[0], "transcribed":transcript,
                               "lexical_match":words(spanish[0]) == words(transcript),
                               "voice":"Mónica", "locale":"es_ES"}
        print(entry["id"], spanish[0], "→", transcript, flush=True)
    REPORT.write_text(json.dumps({"asr_model":"mlx-community/whisper-large-v3-mlx",
                                  "limitation":"La transcription contrôle les glosses isolées régénérées par Mónica, et non le MP3 assemblé ; elle ne mesure ni l'accent castillan ni le naturel.",
                                  "clips":result}, ensure_ascii=False, indent=2)+"\n",
                      encoding="utf-8")
    print(f"{sum(x['lexical_match'] for x in result.values())}/{len(result)} glosses reconnues")


if __name__ == "__main__":
    main()
