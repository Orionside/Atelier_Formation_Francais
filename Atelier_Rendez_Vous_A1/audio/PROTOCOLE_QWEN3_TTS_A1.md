# Audio de l'atelier Rendez-vous A1

Le catalogue `catalogue-qwen3tts.json` contient les 116 segments pédagogiques prédéfinis. Chaque entrée sépare le texte affiché (`display_text`) du texte effectivement envoyé au modèle (`tts_text`), précise son rôle oral et le moment où elle peut être écoutée (`reveal`). `catalogue.js` en est la source : ne modifiez pas le JSON à la main.

## Choix pédagogiques

- Un clip court par consigne, question, option, formule, exemple ou correction : l'apprenant peut lire et réécouter sans parcourir un long enregistrement.
- L'audio d'une correction de QCM reste caché jusqu'à une réponse ; celui d'un texte à trous reste caché jusqu'à « Vérifier ». Les phrases du mode « Vérifier sans regarder » restent également cachées jusqu'à « Voir la phrase ».
- Les quatre questions du serveur ne sont disponibles qu'après leur apparition dans l'exercice.
- Les passages de la vidéo et les phrases associées aux courbes de mélodie restent lus par la vidéo authentique, pas par Qwen3-TTS. Les remplacer invaliderait le lien entre voix et courbe.
- La voix à vitesse normale garde le rythme du modèle. Le bouton global « Voix 0,9× » ralentit les boutons « Écouter » ; les lecteurs des six exemples disposent aussi de leur propre option « Un peu plus lent ». Éviter une lecture artificiellement très ralentie pour un A1 : privilégier des segments courts et la répétition.
- Les nombres, formes abrégées et glosses espagnoles problématiques sont reformulés *dans le texte oral seulement* lorsque cela améliore la compréhension. Le texte affiché reste intact.
- Les textes saisis librement par l'apprenant ne peuvent pas être préparés à l'avance et ne sont pas lus par Qwen.

## Générer ou mettre à jour sur ce Mac

Depuis le dossier `Atelier_Rendez_Vous_A1` :

```sh
node scripts/construire-catalogue.mjs
/Users/toufik/impact60_mesure/.venv-qwen3tts/bin/python scripts/generer-qwen3tts.py --all
/Users/toufik/impact60_mesure/.venv-qwen3tts/bin/python scripts/generer-qwen3tts.py --check
/Users/toufik/.hermes/workspaces/default/.venv-transcription/bin/python scripts/verifier-qwen3tts.py
```

Le générateur est reprenable : il ne refait que les entrées dont le texte, le rôle ou les paramètres vocaux ont changé. Il utilise le modèle `mlx-community/Qwen3-TTS-12Hz-1.7B-Base-8bit` avec une référence vocale locale. Le fichier de référence n'est **pas** ajouté au dépôt. Les MP3 sont des ressources statiques : l'apprenant n'utilise ni clé API ni modèle installé.

## Validation indispensable avant usage pédagogique

`qa-transcription.json` compare le texte prévu à une transcription Whisper et signale les écarts lexicaux. Cela ne mesure **ni** la justesse de l'accent, **ni** la liaison, **ni** la courbe intonative, **ni** le naturel de la voix. Les homophones (`il/ils`, `paie/paient`, `espèce/espèces`) créent des faux positifs.

Un locuteur francophone doit écouter en priorité les six exemples de phrases, les questions (« Et vous ? », « Carte ou espèces ? »), les quatre phrases à compléter et leurs corrections, puis l'ensemble des autres clips. Rejeter toute syllabe manquante, coupure, accent non natif, intonation inadaptée ou mot deviné dans un texte à trous. Les clips sont marqués `non_valide_a_l_ecoute` dans le manifeste tant que cette revue n'a pas eu lieu. Pour une séance A1 de 45 minutes, contrôler aussi que le débit laisse à l'apprenant le temps de répéter.

Le contrôle technique du site doit couvrir ordinateur et téléphone : lecture, arrêt, réécoute, changement d'étape, mode de rappel, correction des exercices et arrêt automatique des autres sources sonores avant l'enregistrement au micro.
