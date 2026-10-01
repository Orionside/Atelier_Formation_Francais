#!/bin/zsh
# Lance la fabrication des audios Qwen3-TTS de cet atelier (à exécuter hors bac à sable : MLX a besoin de la carte graphique).
#   scripts/lancer-audios.sh voix   → crée trois candidates féminines (modèle VoiceDesign)
#   scripts/lancer-audios.sh tout   → génère tous les MP3 avec la voix retenue, puis lance les contrôles
set -e
cd "$(dirname "$0")/.."
PY=/Users/toufik/impact60_mesure/.venv-qwen3tts/bin/python
ASR=/Users/toufik/.hermes/workspaces/default/.venv-transcription/bin/python
case "$1" in
  voix)
    $PY scripts/creer-voix-reference.py ;;
  tout)
    node scripts/construire-catalogue.mjs
    node scripts/verifier-fidelite-texte.mjs
    $PY scripts/generer-qwen3tts.py --all
    $PY scripts/adapter-debit.py
    $PY scripts/generer-qwen3tts.py --check
    $ASR scripts/verifier-qwen3tts.py
    node scripts/verifier-integration-audio.mjs
    node scripts/verifier-parcours.cjs ;;
  *) echo "Usage : scripts/lancer-audios.sh voix | tout" ; exit 1 ;;
esac
