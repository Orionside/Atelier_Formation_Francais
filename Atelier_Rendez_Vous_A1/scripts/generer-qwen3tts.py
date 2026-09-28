#!/usr/bin/env python3
"""Génération locale, reprenable, des MP3 A1 avec Qwen3-TTS Base sur Mac Apple Silicon.

Ces audios restent des candidats pédagogiques tant qu'une personne francophone ne les a
pas écoutés. La transcription automatique n'évalue pas le naturel ni la prosodie.
"""
import argparse
import hashlib
import json
import re
import subprocess
import tempfile
from pathlib import Path

import numpy as np
from scipy.io import wavfile

ROOT = Path(__file__).resolve().parents[1]
CATALOGUE = ROOT / "audio/catalogue-qwen3tts.json"
OUTPUT = ROOT / "audio/qwen3-tts"
MANIFEST = OUTPUT / "manifest.json"
MODEL = "mlx-community/Qwen3-TTS-12Hz-1.7B-Base-8bit"
REFERENCE = Path("/Users/toufik/impact60_mesure/models/qwen3-tts/reference_atelier.wav")
REFERENCE_TEXT = ("D'un point de vue technique, c'est-à-dire si on regarde la technique. "
                  "Pourquoi cet extrait ? Le journaliste reformule pour vérifier qu'il a compris, "
                  "puis pose une question. Vous allez faire la même chose.")


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def valid_mp3(path):
    if not path.is_file() or path.stat().st_size < 1000:
        return False
    result = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_name",
                             "-of", "default=nw=1:nk=1", str(path)], capture_output=True,
                            text=True, check=False)
    return result.returncode == 0 and result.stdout.strip() == "mp3"


def render(model, entry, target, seed):
    import mlx.core as mx
    mx.random.seed(seed)
    # Une entrée = une unité d'écoute courte. La ponctuation encode l'acte de parole ;
    # le modèle Base n'accepte pas d'instruction de style pour le clonage vocal.
    outputs = list(model.generate(text=entry["tts_text"], lang_code="French",
                                  ref_audio=str(REFERENCE), ref_text=REFERENCE_TEXT,
                                  temperature=0.9, top_k=50, top_p=1.0,
                                  repetition_penalty=1.05, stream=False, verbose=False))
    if len(outputs) != 1:
        raise RuntimeError("Nombre de sorties audio inattendu")
    output = outputs[0]
    mx.eval(output.audio)
    samples = np.asarray(output.audio, dtype=np.float32).reshape(-1)
    duration = samples.size / output.sample_rate
    if not np.isfinite(samples).all() or duration < 0.2 or duration > 90:
        raise RuntimeError(f"Audio invalide ({duration:.1f} secondes)")
    if np.sqrt(np.mean(samples * samples)) < 0.0005:
        raise RuntimeError("Audio quasiment silencieux")
    with tempfile.TemporaryDirectory(prefix="qwen3tts-", dir=OUTPUT) as folder:
        wav = Path(folder) / "clip.wav"
        mp3 = Path(folder) / "clip.mp3"
        wavfile.write(wav, output.sample_rate, (np.clip(samples, -1, 1) * 32767).astype(np.int16))
        subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(wav),
                        "-codec:a", "libmp3lame", "-b:a", "192k", str(mp3)], check=True)
        if not valid_mp3(mp3):
            raise RuntimeError("MP3 illisible")
        mp3.replace(target)
    return round(duration, 3)


def main():
    p = argparse.ArgumentParser(description=__doc__)
    mode = p.add_mutually_exclusive_group(required=True)
    mode.add_argument("--list", action="store_true")
    mode.add_argument("--check", action="store_true")
    mode.add_argument("--all", action="store_true")
    mode.add_argument("--id")
    p.add_argument("--limit", type=int, default=0)
    p.add_argument("--force", action="store_true")
    args = p.parse_args()
    entries = json.loads(CATALOGUE.read_text(encoding="utf-8"))["entries"]
    if args.id:
        entries = [x for x in entries if x["id"] == args.id]
        if not entries:
            p.error("Identifiant inconnu : " + args.id)
    if args.list:
        for x in entries:
            print(f'{x["id"]}\t{x["role"]}\t{x["tts_text"]}')
        print(f"{len(entries)} segments")
        return 0
    if args.check:
        missing = [x["id"] for x in entries if not valid_mp3(OUTPUT / (x["id"] + ".mp3"))]
        print(f"MP3 valides : {len(entries)-len(missing)}/{len(entries)}")
        if missing:
            print("Manquants : " + ", ".join(missing))
        return bool(missing)
    if args.limit < 0 or not REFERENCE.is_file():
        p.error("Limite invalide ou référence vocale absente")
    OUTPUT.mkdir(parents=True, exist_ok=True)
    old = json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.is_file() else {"clips":{}}
    clips = old.get("clips", {})
    params = {"model":MODEL, "language":"French", "runtime":"mlx-audio",
              "reference_sha256":sha(REFERENCE), "reference_text":REFERENCE_TEXT,
              "format":"mp3 192 kb/s", "niveau":"A1", "temperature":0.9,
              "top_k":50, "top_p":1.0, "repetition_penalty":1.05}
    pending = []
    for x in entries:
        key = hashlib.sha256(json.dumps({"text":x["tts_text"], "role":x["role"],
                                        "params":params}, ensure_ascii=False,
                                       sort_keys=True).encode()).hexdigest()
        target = OUTPUT / (x["id"] + ".mp3")
        if not args.force and clips.get(x["id"], {}).get("key") == key and valid_mp3(target):
            continue
        pending.append((x, key, target))
    if args.limit:
        pending = pending[:args.limit]
    if not pending:
        print("Aucun segment à produire.")
        return 0
    from mlx_audio.tts.utils import load_model
    model = load_model(MODEL)
    for i, (x, key, target) in enumerate(pending, 1):
        duration = render(model, x, target, int(key[:8], 16))
        clips[x["id"]] = {**x, "key":key, "duration_s":duration,
                          "sha256":sha(target), "status":"non_valide_a_l_ecoute"}
        MANIFEST.write_text(json.dumps({"parameters":params, "clips":clips},
                                       ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
        print(f'[{i}/{len(pending)}] {x["id"]} : {duration:.1f} s', flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
