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
SPANISH_VOICE = "Mónica"  # Voix macOS explicitement étiquetée es_ES (Espagne).
SPANISH_RATE = 160
LANGUAGE_PAUSE_S = 0.22


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def valid_mp3(path):
    if not path.is_file() or path.stat().st_size < 1000:
        return False
    result = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_name",
                             "-of", "default=nw=1:nk=1", str(path)], capture_output=True,
                            text=True, check=False)
    return result.returncode == 0 and result.stdout.strip() == "mp3"


def qwen_french(model, text, seed):
    import mlx.core as mx
    mx.random.seed(seed)
    outputs = list(model.generate(text=text, lang_code="French",
                                  ref_audio=str(REFERENCE), ref_text=REFERENCE_TEXT,
                                  temperature=0.9, top_k=50, top_p=1.0,
                                  repetition_penalty=1.05, stream=False, verbose=False))
    if len(outputs) != 1:
        raise RuntimeError("Nombre de sorties audio inattendu")
    output = outputs[0]
    mx.eval(output.audio)
    return np.asarray(output.audio, dtype=np.float32).reshape(-1), output.sample_rate


def spanish_spain(text, sample_rate, folder, index):
    """Prononciation castillane via une voix explicitement locale es_ES.

    Qwen3-TTS sait générer de l'espagnol, mais ne garantit pas es_ES avec une
    référence française. La glose est donc isolée et synthétisée par Mónica.
    """
    aiff = folder / f"spanish-{index}.aiff"
    subprocess.run(["say", "-v", SPANISH_VOICE, "-r", str(SPANISH_RATE),
                    "-o", str(aiff), text], check=True, capture_output=True)
    converted = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error",
                                "-i", str(aiff), "-ar", str(sample_rate), "-ac", "1",
                                "-f", "f32le", "-"], check=True, capture_output=True)
    samples = np.frombuffer(converted.stdout, dtype="<f4").copy()
    if samples.size < sample_rate // 5:
        raise RuntimeError("Segment espagnol trop court : " + text)
    return samples


def active_rms(samples):
    peak = float(np.max(np.abs(samples)))
    active = samples[np.abs(samples) > peak * 0.08]
    return float(np.sqrt(np.mean(active * active))) if active.size else 0.0


def render(model, entry, target, seed):
    # La ponctuation encode l'acte de parole ; le Base cloné n'a pas de style
    # paramétrable. Seules les glosses es_ES utilisent une autre voix.
    segments = entry.get("segments")
    with tempfile.TemporaryDirectory(prefix="qwen3tts-", dir=OUTPUT) as dirname:
        folder = Path(dirname)
        if segments:
            pieces, sample_rate, french_level = [], None, None
            for i, part in enumerate(segments):
                if part["lang"] == "fr-FR":
                    sound, rate = qwen_french(model, part["text"],
                                              (seed ^ (i * 0x9e3779b9)) & 0xffffffff)
                    if sample_rate is None:
                        sample_rate = rate
                    elif rate != sample_rate:
                        raise RuntimeError("Fréquence Qwen différente entre segments")
                    if french_level is None:
                        french_level = active_rms(sound)
                elif part["lang"] == "es-ES" and sample_rate:
                    sound = spanish_spain(part["text"], sample_rate, folder, i)
                    level = active_rms(sound)
                    if level < 0.0005 or french_level is None:
                        raise RuntimeError("Niveau de la glose espagnole invalide")
                    gain = np.clip(french_level / level, 0.4, 2.5)
                    sound = np.clip(sound * gain, -1, 1)
                else:
                    raise RuntimeError("Ordre ou langue de segment inattendus")
                if pieces:
                    pieces.append(np.zeros(round(sample_rate * LANGUAGE_PAUSE_S), dtype=np.float32))
                pieces.append(sound)
            samples = np.concatenate(pieces)
        else:
            samples, sample_rate = qwen_french(model, entry["tts_text"], seed)
    duration = samples.size / sample_rate
    if not np.isfinite(samples).all() or duration < 0.2 or duration > 90:
        raise RuntimeError(f"Audio invalide ({duration:.1f} secondes)")
    if np.sqrt(np.mean(samples * samples)) < 0.0005:
        raise RuntimeError("Audio quasiment silencieux")
    with tempfile.TemporaryDirectory(prefix="qwen3tts-", dir=OUTPUT) as folder:
        wav = Path(folder) / "clip.wav"
        mp3 = Path(folder) / "clip.mp3"
        wavfile.write(wav, sample_rate, (np.clip(samples, -1, 1) * 32767).astype(np.int16))
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
    p.add_argument("--force-id", action="append", default=[],
                   help="Régénérer cet identifiant même si son texte n'a pas changé (répétable)")
    args = p.parse_args()
    entries = json.loads(CATALOGUE.read_text(encoding="utf-8"))["entries"]
    unknown = sorted(set(args.force_id) - {x["id"] for x in entries})
    if unknown:
        p.error("Identifiants inconnus : " + ", ".join(unknown))
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
    metadata_updated = False
    for x in entries:
        key_input = {"text":x["tts_text"], "role":x["role"], "params":params}
        if x.get("segments"):
            key_input["bilingual"] = {"segments":x["segments"], "spanish_voice":SPANISH_VOICE,
                                      "spanish_locale":"es_ES", "rate":SPANISH_RATE,
                                      "pause_s":LANGUAGE_PAUSE_S, "mix":"active_rms_v1"}
        key = hashlib.sha256(json.dumps(key_input, ensure_ascii=False,
                                       sort_keys=True).encode()).hexdigest()
        target = OUTPUT / (x["id"] + ".mp3")
        if not args.force and x["id"] not in args.force_id and clips.get(x["id"], {}).get("key") == key and valid_mp3(target):
            if any(clips[x["id"]].get(field) != value for field, value in x.items()):
                clips[x["id"]].update(x)
                metadata_updated = True
            continue
        previous = clips.get(x["id"], {})
        forced = args.force or x["id"] in args.force_id
        variant = (previous.get("seed_variant", 0) + 1) if forced and previous.get("key") == key else 0
        pending.append((x, key, target, variant))
    if args.limit:
        pending = pending[:args.limit]
    if metadata_updated:
        MANIFEST.write_text(json.dumps({"parameters":params, "clips":clips},
                                       ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
    if not pending:
        print("Aucun segment à produire.")
        return 0
    if any(x.get("segments") for x, _, _, _ in pending):
        voices = subprocess.run(["say", "-v", "?"], capture_output=True, text=True, check=True).stdout
        if not re.search(r"^Mónica[^\n]*\bes_ES\b", voices, re.MULTILINE):
            p.error("Voix castillane Mónica (es_ES) absente de ce Mac")
    from mlx_audio.tts.utils import load_model
    model = load_model(MODEL)
    for i, (x, key, target, variant) in enumerate(pending, 1):
        seed = (int(key[:8], 16) ^ (variant * 0x9e3779b9)) & 0xffffffff
        duration = render(model, x, target, seed)
        bilingual = ({"spanish_voice":SPANISH_VOICE, "spanish_locale":"es_ES"}
                     if x.get("segments") else {})
        clips[x["id"]] = {**x, **bilingual, "key":key, "duration_s":duration,
                          "sha256":sha(target), "seed_variant":variant,
                          "status":"non_valide_a_l_ecoute"}
        MANIFEST.write_text(json.dumps({"parameters":params, "clips":clips},
                                       ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
        print(f'[{i}/{len(pending)}] {x["id"]} : {duration:.1f} s', flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
