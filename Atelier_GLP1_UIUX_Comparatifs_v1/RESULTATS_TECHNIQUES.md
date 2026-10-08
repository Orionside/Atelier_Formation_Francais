# Résultats techniques des essais GLP-1

Contrôles effectués le 8 octobre 2026. Ces résultats concernent le fonctionnement et la présentation ; ils ne démontrent pas un gain cognitif ou linguistique.

## Parcours et audios

- 54 vues contrôlées : 9 vues × 3 séances × 2 essais, avec vérification des erreurs de script dans JSDOM.
- Pagination, passage entre cartes, vue d’ensemble, choix différés, révélation des explications et modèles : contrôlés.
- Neuf boucles de cinq phases : une seule phase active par carte, ressources complémentaires conservées.
- 68 lectures supplémentaires produites ; catalogue, présence des MP3, texte attendu, chemins et empreintes SHA-256 vérifiés. Elles complètent les 454 lectures existantes, sans copier ces fichiers.
- Transcription automatique des lectures supplémentaires : une alerte restante correspond à des formes homophones telles que « proposez/proposer ». Ce contrôle du contenu ne constitue pas une validation humaine de la prosodie ou de chaque réalisation phonétique.
- Lecture d’un extrait authentique dans le navigateur : fichier local chargé, `readyState` 4 et progression du temps constatée. Arrêt et fermeture du lecteur vérifiés. Le lecteur se place dans le contenu.

## Densité de la vue d’écoute

Configuration : séance 1, étape d’écoute, aides fermées, première carte Focus, largeur 1470 pixels CSS, état initial avant lecture. Les boutons comptés sont ceux rendus dans tout le contenu principal, même sous la ligne de flottaison ; les boutons des aides fermées sont exclus. Les mots sont séparés par espaces : il s’agit d’un indicateur de texte affiché, pas d’une analyse linguistique.

Référence A : **68 boutons**, **298 mots affichés**, hauteur de page **3971 px**, corps de base **16,5 px**.

Focus B : **29 boutons**, **116 mots affichés**, hauteur de page **1783 px**, corps de base **18 px**.

La carte unique masque les autres extraits derrière « Suivant » ou « Tout voir ». Le contenu n’est pas supprimé. Ces valeurs dépendent de la séance, des aides ouvertes, de l’état du lecteur, de la police et de la largeur. Elles ne signifient pas une baisse équivalente de charge mentale. Le nombre de commandes dans la fenêtre varie aussi avec le défilement : ce n’est pas un critère stable d’apprentissage.

## Petits écrans et contrôles visuels

La redistribution a été contrôlée dans des aperçus intégrés à largeur explicite : Focus à 320 px et Boucle orale à 390 px. Les largeurs document/zone utile correspondent, sans débordement horizontal après correction d’un lien long. Les captures sont conservées dans `captures/`. Ces aperçus ne remplacent pas un essai complet sur téléphone réel, notamment pour le micro et la vidéo.

L’accès aux phases utilise des boutons natifs activables au clavier. Les commandes audio gardent leurs icônes circulaires et leurs noms accessibles. Les médias démarrent sur une action de l’utilisateur. Le CSS respecte la préférence de réduction des mouvements et prévoit un focus visible.

## Limites et essais restants avec une personne

Pas d’audit WCAG complet, pas de test exhaustif avec lecteur d’écran, pas de validation sur tous les appareils. L’enregistrement microphone n’a pas été testé en capturant la voix de l’utilisateur. Les contrôles automatisés ne remplacent pas ces essais.

Aucun résultat SUS, NASA-TLX, temps de parole utilisateur ou progression de prononciation n’est disponible. Le protocole comparatif et le formulaire local permettent de consigner ces observations sans les inventer. Une vérification différée du réemploi dans une situation nouvelle reste indispensable avant de parler d’acquisition.
