# BYD B2 v4 · secteur bancaire

Le support conserve sept étapes en 45 minutes et un espace formateur. La v3 reste conservée.

Situation stable : réunion dans une banque sur la formation des conseillers à un nouvel outil. Trois priorités : préciser le problème, reconnaître une limite, poser une condition. Les six expressions restent disponibles ; les compléments sont facultatifs.

## Ouvrir le support

Ouvrir `index.html` avec tous ses dossiers voisins, ou lancer :

```sh
python3 scripts/servir.py --port 8769
```

Puis ouvrir <http://127.0.0.1:8769/>. Ce serveur prend en charge les requêtes partielles nécessaires au calage des extraits MP4. La vidéo H.264/AAC est dans `video/byd.mp4`, avec un lien vers sa source YouTube dans le lecteur. Lecture limitée à l’extrait, boucle et vitesse 0,9× sont conservées.

## Les lectures

Chaque lecture possède un bouton circulaire à icône de haut-parleur, accessible au clavier et muni d’un libellé. Pendant la lecture, il devient un bouton d’arrêt. Un seul média joue à la fois ; les lectures sont bloquées pendant un enregistrement.

Les 238 lectures du catalogue sonorisent les consignes, titres, questions, options, corrections, expressions, exemples bancaires, groupes de sens, objections, compléments et textes du formateur. Les textes libres de l’apprenant ne sont pas des lectures prédéfinies.

**Les phrases à trous sont lues intégralement, avec le mot attendu, dès le premier bouton**, selon la demande du formateur. La solution écrite reste masquée jusqu’à la vérification. La correction propose également sa lecture complète.

Les MP3 utilisent Qwen3-TTS Base et la voix française féminine de référence 2 du support Alimentation bis v5. Seuls les textes identiques peuvent reprendre un MP3 existant ; les nouveaux contenus bancaires sont générés. La référence vocale reste locale et n’est pas incluse dans cet atelier.

## Reproduire et vérifier

```sh
node scripts/construire-catalogue.cjs
~/impact60_mesure/.venv-qwen3tts/bin/python scripts/generer-audios.py
node scripts/verifier-parcours.cjs --complet
~/impact60_mesure/.venv-qwen3tts/bin/python scripts/generer-audios.py --verify
```

Les scripts utilisent les environnements locaux du formateur. `audio/catalogue.json` décrit les textes ; `audio/qwen3-tts/manifest.json` relie les fichiers et leurs empreintes. Les versions JavaScript de ces données permettent aussi l’ouverture directe du fichier HTML. `audio/verification.json` consigne les contrôles de fichiers et la reconnaissance automatique ; celle-ci ne mesure pas le naturel de la voix.

L’analyse initiale est dans `ANALYSE_PEDAGOGIQUE.md`. Les réponses écrites restent dans le navigateur ; télécharger les enregistrements pour les conserver.

Adresse de publication : https://orionside.github.io/Atelier_Formation_Francais/Atelier_BYD_Oceans_B2_v4/
