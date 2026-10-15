# Vérifications — 14 octobre 2026

## Vérifié

- Syntaxe de `contenu.js`, `app.js`, `preparer-audios.mjs` et du script Python d’installation audio.
- Génération du catalogue : 288 identifiants uniques ; affectation de deux voix ; dialogues et tours de rôle distincts.
- Ouverture HTTP locale de l’index et chargement des scripts.
- Dans Chrome : modèle caché au départ, révélation et masquage ; changement de carte ; retour ; autoévaluation ; persistance après rechargement.
- Navigation dans les huit étapes ; nombres ; questions ; liaisons ; réponse correcte et explication du premier choix de compréhension.
- Changement du scénario Martin au scénario Lopez ; changement client/réception ; passage au deuxième tour ; modèle adapté à une chambre simple pour une nuit.
- Formulaire de préparation de la mission et accès au carnet.
- Affichage à 390 pixels : le débordement initial de la navigation a été corrigé ; largeur totale finale égale à 390 pixels. Inspection visuelle sur petit écran et écran normal.
- Les deux références fournies sont tracées par SHA-256 ; aucune voix de secours n’est chargée. Le manifeste contient les 288 identifiants attendus.

## Production audio — actualisation du 15 octobre 2026

- 248 lectures distinctes exportées vers 288 fichiers/identifiants du lecteur.
- Contrôle de transcription Whisper et de contenu critique : négations, personnes grammaticales, « en supplément » ; reprises des essais signalés.
- Comparaison acoustique WavLM aux deux références ; distinction entre les deux voix.
- Sélection des modèles d’intonation question/réponse et des prises de liaisons.
- Normalisation en volume, export MP3 mono 24 kHz et contrôle de présence, durée et intégrité.

## Lecture dans Chrome

- Lecture réelle du modèle féminin : fichier chargé, durée disponible, lecteur actif.
- Lecture réelle du modèle masculin à 0,9× : vitesse et source confirmées.
- Lecture du dialogue jusqu’à la dernière réplique ; alternance des fichiers féminins et masculins.
- Arrêt global et changement d’étape : aucun lecteur de modèle ne reste actif.
- Écoute de la réplique partenaire dans le jeu de rôle ; aucune erreur du navigateur pendant ces vérifications.

## Limites des vérifications

- Le contrôle automatique ne remplace pas une écoute humaine du naturel et du timbre.
- L’enregistrement micro réel n’a pas été testé : aucune permission matérielle n’a été demandée pendant la préparation. Le navigateur demandera l’autorisation si l’apprenant choisit d’enregistrer.


## Préparation de la publication — 15 octobre 2026

- Mise à jour sur la dernière version de `origin/main`, préservant la correction `fc0ac85` de l’atelier Rendez-vous A1 v3.
- Ajout de l’atelier Bon séjour A1 au catalogue du dépôt et des liens HTTPS dans la documentation.
- Sources audio originales, extraits de référence et prises de travail conservés en local ; seuls les MP3 pédagogiques générés et leurs contrôles sont livrés.
- Vérification du déploiement et des fichiers publics réalisée après l’envoi sur `main` ; le statut de publication est consultable dans les déploiements GitHub Pages du dépôt.
