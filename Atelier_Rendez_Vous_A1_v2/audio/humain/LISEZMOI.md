# Voix humaines (facultatif)

Ce dossier est vide au départ. Le moteur de l'atelier cherche d'abord ici, puis dans `audio/synthese/`.

## Comment déposer une voix humaine
1. Enregistrer la réplique ou le dialogue (même texte exactement que dans `audio/manifest.json`).
2. Nommer le fichier avec le **même identifiant** que la synthèse : `audio/humain/<id>.mp3`
   (exemple : `audio/humain/s0-dialogue.mp3` remplace `audio/synthese/s0-dialogue.mp3`).
   Un dialogue = un seul fichier assemblé ; les répliques seules ont leur propre fichier (`s0-dialogue-t1.mp3`…).
3. Déclarer le fichier dans le manifeste : depuis le dossier de l'atelier, lancer
   `node scripts/declarer-voix-humaines.mjs`. Le script lit ce dossier et met `audio/manifest.json` à jour
   (clé `humain` de chaque son : `file`, `sha256`, `statut`). Un fichier non déclaré n'est pas lu par la page.
4. L'espace formateur (onglet « Sons ») permet ensuite d'écouter chaque voix et de la marquer « validée à l'écoute ».

Format : MP3 mono. Un enregistrement fait dans l'espace formateur se télécharge en `.webm` ou `.m4a` ;
le convertir, par exemple : `ffmpeg -i s0-dialogue.webm -ac 1 -b:a 96k s0-dialogue.mp3`.

## Consentement
Chaque personne enregistrée donne son accord écrit, pour cet usage (atelier en ligne, non commercial), et peut le retirer.
Ne jamais cloner ni imiter la voix d'une personne réelle. Garder l'accord avec le fichier source, hors du dossier publié.
