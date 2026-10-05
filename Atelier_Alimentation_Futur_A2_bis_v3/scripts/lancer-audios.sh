#!/bin/zsh
# Génère les audios Qwen3-TTS de cet atelier avec la voix de référence déjà installée
# (audio/voix-reference/reference.wav + reference.txt). À exécuter hors bac à sable : MLX a besoin de la carte graphique.
#   scripts/lancer-audios.sh tout
set -e
cd "$(dirname "$0")/.."
PY=/Users/toufik/impact60_mesure/.venv-qwen3tts/bin/python
ASR=/Users/toufik/.hermes/workspaces/default/.venv-transcription/bin/python
case "$1" in
  tout)
    node scripts/construire-catalogue.mjs
    node scripts/verifier-fidelite-texte.mjs
    $PY scripts/generer-qwen3tts.py --all
    $PY scripts/adapter-debit.py
    $PY scripts/generer-qwen3tts.py --check
    $ASR scripts/verifier-qwen3tts.py
    node scripts/verifier-integration-audio.mjs
    node scripts/verifier-parcours.cjs ;;
  *) echo "Usage : scripts/lancer-audios.sh tout" ; exit 1 ;;
esac
