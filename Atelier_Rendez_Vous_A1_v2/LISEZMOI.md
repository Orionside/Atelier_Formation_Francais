# Au café — comprendre, commander et payer (A1) · Rendez-vous A1 v2

Atelier oral de 45 minutes pour adultes débutants. Lien pour les apprenants :
https://orionside.github.io/Atelier_Formation_Francais/Atelier_Rendez_Vous_A1_v2/

Vue du formateur (cartes privées, grille, sons, suivi) : le même lien suivi de `?vue=formateur`.

Cette version remplace, pour le thème « café », l'atelier `Atelier_Rendez_Vous_A1` (qui reste en ligne, inchangé, pour « se présenter »). Elle applique le dossier de conception du 6 octobre 2026 (option O1, décisions M01 à M14, séquences S0 à S6).

## Ce qui change par rapport à la première version

- Une seule situation : au comptoir d'un café, commander puis payer. Sept étapes : écouter deux personnes (sans texte), regarder la scène du film, reconnaître le moment, répondre au serveur, dire sa commande d'un seul tenant, commander et payer avec une question imprévue, écouter deux nouvelles personnes.
- La compréhension se vérifie sans texte : une écoute, une réponse libre, des images, la même écoute une seconde fois, puis le texte. La page garde séparément la réponse donnée et l'aide utilisée. Aucun score global.
- Corrections des erreurs de la première version : plus de règle « la dernière syllabe du mot est plus longue », plus de comparaison avec l'espagnol, plus de règle de montée de la voix, plus de verdict automatique sur la mélodie, plus de « moins de pauses = mieux ». **Aucune mesure automatique de la voix.**
- Trois modes (avec mon formateur, en petit groupe, seul·e), trois niveaux (plus simple, normal, un peu plus), aide facultative en espagnol ou en italien, proposée après un premier essai en français.
- Après le cours : rappels à 2 jours et à 7 jours, avec des dialogues et des voix non entendus pendant la séance.

## Ce qui n'est pas encore validé (à lire avant d'utiliser en cours)

- **Dialogues créés pour le cours** : ce ne sont pas des extraits de conversations réelles. Leur naturel a été jugé par un seul relecteur automatique ; deux francophones de France doivent encore les relire.
- **Voix de synthèse** : tous les sons de `audio/synthese/` sont des voix de synthèse (les consignes et la cliente d'entraînement utilisent la « voix n° 2 » de l'atelier Alimentation du futur bis v4 ; les autres voix sont inventées). Tous portent le statut `non_valide_a_l_ecoute`. L'espace formateur (onglet « Sons ») permet de les écouter et de noter « validé » ou « à refaire ». Tant que `audio/humain/` est vide, le test « voix humaine nouvelle » manque.
- **Film** : les extraits de la vidéo YouTube sont joués dans le lecteur officiel, avec l'image ; des sous-titres peuvent apparaître. Ils ne servent jamais de test « sans texte ». Leurs bornes et la seule coupure montrée (« Un café noir pour moi | s'il vous plaît ») viennent de mesures automatiques, à confirmer à l'oreille.
- **Aides en espagnol et en italien** : non relues par un locuteur natif.
- **Seuils et grille 0/1/2** : provisoires, à piloter. Aucun résultat d'apprenant n'existe pour cette version.
- La vraie lecture du film, le micro et le son sur téléphone ne peuvent pas être testés automatiquement : à vérifier une fois à la main.

## Écarts assumés par rapport au script du dossier de conception

- « Deux thés, très bien. » est devenu « Deux thés, d'accord. » (même changement à la fin avec « deux cafés ») : « très » peut être entendu comme « tres / tre » (= 3) alors que la question porte sur une quantité.
- Le défi facultatif « Il n'y a plus de café noir. Un café long ? » est devenu « Il n'y a plus de thé. Un café ? ».

## Fichiers

- `index.html`, `contenu.js` (tous les textes et les écrans), `pictos.js` (pictogrammes).
- `scripts/` : `socle.js` et `socle.css` (lecteur du film, sons, micro, stockage), `index.js` (écrans), `journal.js` (suivi et exports), `formateur.js` et `formateur.css` (espace formateur), `declarer-voix-humaines.mjs` (voir `audio/humain/LISEZMOI.md`).
- `audio/manifest.json` (un son par entrée : texte, voix, statut, empreinte), `audio/manifest_production.json` (fiche complète de production de chaque son), `audio/synthese/` (126 fichiers), `audio/humain/` (vide).

Les réponses restent dans le navigateur de l'apprenant ; rien n'est envoyé. Les enregistrements de la voix ne sont gardés que le temps de la séance. L'apprenant transmet son travail avec « Copier mes réponses ».

Après toute modification publiée, changer le `?v=` dans `index.html` et `VERSION` dans `scripts/index.js`.
