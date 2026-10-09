# Vérifications du parcours GLP-1 · 8 octobre 2026

## Parcours et médias

- Trois séances, neuf vues chacune et leurs états interactifs vérifiés avec JSDOM : navigation, corrections, rappel, neuf phrases à trous lues avec la solution, six groupes de sens, neuf échanges, relances et transferts. Aucun échec du dernier contrôle de parcours.
- Le catalogue recense 454 lectures distinctes, partagées lorsque le texte est identique. Le manifeste contrôle le texte attendu et l’empreinte SHA-256 de chaque MP3.
- Essais dans le navigateur local : les trois accueils, les cartes, l’entraînement et le transfert ; lancement d’une lecture guidée avec bouton d’arrêt ; vidéo native sans erreur affichée, arrêt automatique du premier et du dernier extrait ; mode audio seul actif et images réaffichables.
- Présentation du transfert inspectée par capture d’écran. Le lecteur utilise le fichier H.264/AAC, indépendant du lecteur intégré YouTube.

## Portée des contrôles

La reconnaissance automatique française contrôle les lectures produites et signale les écarts à examiner ; elle ne certifie ni le naturel ni une prononciation parfaite. Les infinitifs et impératifs homophones, les marques écrites du pluriel et les transcriptions de titres courts peuvent produire des alertes sans changement audible du sens. Le rapport brut est conservé dans `audio/verification.json`.

L’enregistrement réel au micro et son téléchargement n’ont pas été testés avec la voix de l’apprenant. Le micro dépend de l’autorisation du navigateur. Les enregistrements ne sont pas conservés après rechargement. Les essais ne mesurent pas une amélioration de la fluidité ou des mécanismes cognitifs ; utiliser `FICHE_SUIVI.md` pour observer le premier essai et le réemploi avec les aides indiquées.

Le calage des extraits repose sur une transcription automatique horodatée et les essais du lecteur, pas sur une mesure de la prosodie source. Les groupes écrits sont des propositions pédagogiques. Les dialogues ajoutés sont identifiés comme créés pour le cours.

## Contrôle vocal final

454 fichiers décodés, non silencieux et conformes à leur empreinte. Reconnaissance française effectuée sur l’ensemble des lectures : 20 alertes textuelles restantes, examinées dans `audio/REVUE_TRANSCRIPTION.json` (homophonies, accords ou chiffres). Les lectures incomplètes signalées ont été reprises puis contrôlées. Durée cumulée : 2 049,5 secondes, soit environ 34 minutes de lectures proposées à la demande.

Deux intitulés courts sont lus sous forme de phrases équivalentes pour rendre la synthèse plus stable. Les textes de conversation et les phrases à trous gardent leur contenu attendu.
