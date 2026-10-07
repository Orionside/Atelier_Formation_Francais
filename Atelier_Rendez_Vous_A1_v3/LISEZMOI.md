# Au café — comprendre, commander et payer (A1) · Rendez-vous A1 v3

Atelier oral de 45 minutes pour adultes débutants. Lien pour les apprenants :
https://orionside.github.io/Atelier_Formation_Francais/Atelier_Rendez_Vous_A1_v3/

Vue du formateur (cartes privées, grille, sons, suivi) : le même lien suivi de `?vue=formateur`.

Les versions précédentes restent en ligne, inchangées : `Atelier_Rendez_Vous_A1` (se présenter et commander) et `Atelier_Rendez_Vous_A1_v2` (première version « Au café »).

## Ce qui change dans la v3 (retour du formateur après essai de la v2)

- **L'écoute reste toujours disponible.** Plus d'écoute unique : le bouton « Écouter » est présent dans chaque fenêtre d'une activité, on réécoute autant qu'on veut, et la page ne passe jamais seule à la fenêtre suivante. Le nombre d'écoutes est seulement compté dans le suivi du formateur.
- **Retour en arrière.** Un bouton « ← Revenir » ramène à la fenêtre précédente ; « Étape précédente » n'est jamais bloqué.
- **Tout ce qui se lit s'écoute.** Chaque consigne, chaque message de correction et chaque phrase affichée a son bouton d'écoute ; chaque phrase du film a son bouton « Regarder ».
- **Parler avec le serveur.** Dans tous les modes : on entend d'abord le serveur, on peut s'enregistrer et se réécouter, puis écouter un modèle pour comparer. Aucune note automatique.
- **Consignes lues plus lentement**, avec de vraies pauses entre les phrases.
- **Consignes reformulées** : « Sélectionnez… », « Cliquez sur « … » », « Dites … à voix haute » ; plus de « touchez », plus de « dans votre langue ». Étape 3 restructurée en deux gestes : écouter la phrase, sélectionner l'image.
- **Mentions techniques retirées** de la page de l'apprenant (provenance des sons, note sur les sous-titres).
- **Illustrations professionnelles en couleurs** (aplat sobre, sans visage), « Je ne sais pas » au même format que les images de réponse.
- **Voix du serveur** : nouvelle voix de synthèse inventée (homme, voix posée), clonée avec sa transcription pour une mélodie plus naturelle.

## Ce qui n'est pas encore validé (à lire avant d'utiliser en cours)

- **Dialogues créés pour le cours** : ce ne sont pas des extraits de conversations réelles ; deux francophones de France doivent encore les relire.
- **Voix de synthèse** : tous les sons de `audio/synthese/` sont des voix de synthèse, aucune voix de personne réelle n'a été clonée. Les consignes et la cliente d'entraînement utilisent la « voix féminine n° 2 » fournie par le formateur ; les autres voix sont inventées. Tous portent le statut `non_valide_a_l_ecoute` : l'espace formateur (onglet « Sons ») permet de les écouter et de noter « validé » ou « à refaire ». Tant que `audio/humain/` est vide, le test « voix humaine nouvelle » manque.
- **Film** : les extraits de la vidéo YouTube sont joués dans le lecteur officiel, avec l'image ; des sous-titres peuvent apparaître. Leurs bornes viennent de mesures automatiques, à confirmer à l'oreille.
- **Aides en espagnol et en italien** : non relues par un locuteur natif.
- **Grille 0/1/2 et seuils** : provisoires, à piloter. Aucun résultat d'apprenant n'existe pour cette version.
- La vraie lecture du film, le micro et le son sur téléphone ne peuvent pas être testés automatiquement : à vérifier une fois à la main.

## Fichiers

- `index.html`, `contenu.js` (tous les textes et les écrans), `pictos.js` (illustrations).
- `scripts/` : `socle.js` et `socle.css` (lecteur du film, sons, micro, stockage), `index.js` et `ecrans.css` (écrans), `journal.js` (suivi et exports), `formateur.js` et `formateur.css` (espace formateur), `declarer-voix-humaines.mjs` (voir `audio/humain/LISEZMOI.md`).
- `audio/manifest.json` (un son par entrée : texte, voix, statut, empreinte), `audio/manifest_production.json` (fiche de production de chaque son), `audio/synthese/`, `audio/humain/` (vide).

Les réponses restent dans le navigateur de l'apprenant ; rien n'est envoyé. Les enregistrements de la voix ne sont gardés que le temps de la séance. L'apprenant transmet son travail avec « Copier mes réponses ».

Après toute modification publiée, changer le `?v=` dans `index.html` et `VERSION` dans `scripts/index.js`.
