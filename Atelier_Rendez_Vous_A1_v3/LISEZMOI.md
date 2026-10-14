# Au café — comprendre, commander et payer (A1) · Rendez-vous A1 v3

Atelier oral de 45 minutes pour adultes débutants, conçu pour pratiquer en autonomie sans présence du formateur. Lien pour les apprenants :
https://orionside.github.io/Atelier_Formation_Francais/Atelier_Rendez_Vous_A1_v3/

Le support publié est exclusivement destiné à l’apprenant. L’espace formateur et son accès par URL sont désactivés.

Les versions précédentes restent en ligne, inchangées : `Atelier_Rendez_Vous_A1` (se présenter et commander) et `Atelier_Rendez_Vous_A1_v2` (première version « Au café »).

## Pratique autonome

Les trois groupes de choix « Je travaille comment ? », « Mon niveau aujourd’hui » et « Aide dans ma langue » sont supprimés de l’accueil. Le parcours apprenant démarre directement en mode seul, au niveau normal, sans panneau de réglages ni bandeau de mode, niveau ou langue. Les anciennes préférences sont remplacées par ces valeurs lors de l’ouverture ; la progression est conservée. Les questions du serveur, les modèles à comparer, les réécoutes et l’enregistrement facultatif permettent de travailler sans formateur. Le bilan permet de reprendre les expressions ; les rappels à deux jours et à sept jours soutiennent la mémorisation. Aucune transmission au formateur n’est demandée.

## Refonte du 14 octobre 2026 (remplace la version du 13 octobre)

Remplacement validé par le formateur. Deux chantiers : la structure du parcours, puis tous les sons.

**Structure et progression** :

- S2 et S3 : la question « Qu'est-ce que la personne fait ? » était posée après des échanges à deux personnes ; elle devient « On commande, on finit ou on paie ? », la question du titre de l'étape, avec les mêmes trois images. La consigne d'entrée de S2 annonce ces trois moments.
- S2, moment B (serveur + client) : « Écoutez la phrase » devient « Écoutez le serveur et le client ». « Qui parle ? » : les phrases sont numérotées dans l'ordre où elles s'affichent (l'ordre tiré au sort montrait « Phrase 2 » avant « Phrase 1 »).
- S3 : fiches « Lisez les deux phrases. Écoutez-les. » ; plus de flèches « → » dans les explications (elles ne se lisent pas à voix haute) ; avant les questions sans texte, « Le serveur peut changer ses mots » prépare « Vous désirez ? ».
- S4 : le pas facultatif « Faites un geste de la main » est retiré (consigne vague sans interlocuteur, redite du pas précédent).
- S5 : consignes adaptées à un serveur enregistré (« Ne les montrez pas au serveur » retiré ; « Le serveur vous parle »).
- S0 : un seul « Merci » après la réponse au serveur.
- Bilan : « parcours » au lieu de « cours » ; les réponses y portent les mêmes mots que les images (« finir la commande », « payer ») ; la question du film est « ils demandent quoi ? ».
- Toutes les voix d'homme utilisent désormais la même voix (voir plus bas) : « voix nouvelles » et « nouveau serveur » ne sont plus annoncés là où ce n'est plus vrai ; dans les deux dialogues de la banque à 7 jours, le client devient une cliente (deux hommes à la même voix seraient indiscernables).

**Sons** (les 214 fichiers sont régénérés) :

- **Voix féminine de base** (consignes, retours, cliente d'entraînement) : même voix et même réglage qu'au 13 octobre (référence féminine 2 de GLP-1, empreinte vocale seule, Qwen3-TTS 1.7B Base 8 bits). Ce qui change : chaque phrase est générée à part, en 3 à 11 prises, et la prise retenue est celle dont la mélodie respecte la ponctuation et le sens (voix qui descend à la fin d'une affirmation, qui monte à la fin d'une question oui/non, qui reste haute après une virgule, relief sur le mot important : « Non, **deux** thés »). Les pauses suivent la ponctuation : 0,55 s après un point, 0,60 s après une question ; une courte pause réelle est garantie aux virgules et aux deux-points.
- **Voix d'homme** (serveur de l'entraînement, serveur du rappel à 7 jours, client de la banque) : clonage de la « voix de référence synthétisé homme 2 » fournie par le formateur (Qwen3-TTS 1.7B Base bf16, extrait de 10,5 s avec sa transcription). Réglage choisi sur mesures parmi 7 essais : timbre le plus proche de la référence et même hauteur de voix (109 Hz pour 108 Hz).
- Les autres voix féminines (serveuse et cliente de S6, serveuse de la banque et du rappel à 2 jours) gardent leur timbre et suivent le même tri prosodique.
- **Prononciation** : les mots avec un « e » muet ou neutre (demande, regardez, prenez…) et « deux » sont contrôlés phonétiquement dans chaque prise. « Redites-la » était dit « rédites » : la voix reçoit désormais « Re-dites-la » (le texte affiché ne change pas).
- **Résultat mesuré** : 257 phrases sur 274 sans défaut de mélodie ou de pause (voix d'homme : 21 sur 21) ; sur les sons complets, 7 sur 202 gardent un écart léger, contre 60 sur 203 dans la version du 13 octobre.
- Contrôles : `audio/verification.json` (texte reconnu, mesures de mélodie et de pauses de chaque phrase retenue), `audio/qualite_prosodie.json` (résumé et défauts restants). Ces mesures servent à choisir ; elles ne remplacent pas l'écoute.

## Ce qui change dans la v3 (retour du formateur après essai de la v2)

- **L'écoute reste toujours disponible.** Plus d'écoute unique : le bouton « Écouter » est présent dans chaque fenêtre d'une activité, on réécoute autant qu'on veut, et la page ne passe jamais seule à la fenêtre suivante. Le nombre d'écoutes est seulement compté dans le suivi du formateur.
- **Retour en arrière.** Un bouton « ← Revenir » ramène à la fenêtre précédente ; « Étape précédente » n'est jamais bloqué.
- **Tout ce qui se lit s'écoute.** Chaque consigne, chaque message de correction et chaque phrase affichée a son bouton d'écoute ; chaque phrase du film a son bouton « Regarder ».
- **Parler avec le serveur.** Dans tous les modes : on entend d'abord le serveur, on peut s'enregistrer et se réécouter, puis écouter un modèle pour comparer. Aucune note automatique.
- **Consignes lues au rythme naturel**, avec une prosodie continue ; réécoute libre et lecture un peu plus lente à la demande.
- **Consignes reformulées** : « Sélectionnez… », « Cliquez sur « … » », « Dites … à voix haute » ; plus de « touchez », plus de « dans votre langue ». Étape 3 restructurée en deux gestes : écouter la phrase, sélectionner l'image.
- **Mentions techniques retirées** de la page de l'apprenant (provenance des sons, note sur les sous-titres).
- **Illustrations professionnelles en couleurs** (aplat sobre, sans visage), « Je ne sais pas » au même format que les images de réponse.
- **Voix du serveur** : depuis le 14 octobre, voix « homme 2 » fournie par le formateur (voir plus haut).

## Ce qui n'est pas encore validé (à lire avant d'utiliser en cours)

- **Dialogues créés pour le cours** : ce ne sont pas des extraits de conversations réelles ; deux francophones de France doivent encore les relire.
- **Voix de synthèse** : tous les sons de `audio/synthese/` sont des voix de synthèse. Les consignes et la cliente d'entraînement utilisent la « voix féminine n° 2 », les rôles d'homme la « voix homme 2 », toutes deux fournies par le formateur comme voix de synthèse ; les autres voix féminines sont inventées. Tous portent le statut `non_valide_a_l_ecoute`. L'espace formateur étant désactivé dans cette version, l'écoute de validation se fait hors du support (`audio/verification.json` donne, pour chaque phrase, la prise retenue et les défauts mesurés qui restent). Tant que `audio/humain/` est vide, le test « voix humaine nouvelle » manque.
- **Film** : les extraits de la vidéo YouTube sont joués dans le lecteur officiel, avec l'image ; des sous-titres peuvent apparaître. Leurs bornes viennent de mesures automatiques, à confirmer à l'oreille.
- **Aides en espagnol et en italien** : non relues par un locuteur natif.
- **Grille 0/1/2 et seuils** : provisoires, à piloter. Aucun résultat d'apprenant n'existe pour cette version.
- La vraie lecture du film, le micro et le son sur téléphone ne peuvent pas être testés automatiquement : à vérifier une fois à la main.

## Fichiers

- `index.html`, `contenu.js` (tous les textes et les écrans), `pictos.js` (illustrations).
- `scripts/` : `socle.js` et `socle.css` (lecteur du film, sons, micro, stockage), `index.js` et `ecrans.css` (écrans), `journal.js` (progression et réponses personnelles), `declarer-voix-humaines.mjs` (voir `audio/humain/LISEZMOI.md`).
- `audio/manifest.json` (un son par entrée : texte, voix, statut, empreinte), `audio/manifest_production.json` (fiche de production de chaque son), `audio/verification.json` (contrôles de chaque phrase retenue), `audio/qualite_prosodie.json` (résumé des contrôles de prosodie), `audio/synthese/`, `audio/humain/` (vide).

Les réponses restent dans le navigateur de l'apprenant ; rien n'est envoyé. Les enregistrements de la voix ne sont gardés que le temps de la séance. L'apprenant transmet son travail avec « Copier mes réponses ».

Après toute modification publiée, changer le `?v=` dans `index.html` et `VERSION` dans `scripts/index.js`.
