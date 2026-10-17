# Refonte visuelle Palace Hôtel · 17 octobre 2026

Version des modules : `20261017-photo-6`. La banque audio de référence reste inchangée : 305 fichiers, 248 lectures féminines et 57 masculines, 93 mots. Le contrôle intégral des textes, des voix, des empreintes SHA-256 et du décodage ffmpeg réussit.

- Nouveaux modèles originaux Blender de couette drapée, oreillers, coussins, canapé et transats. Contrôle visuel de la continuité du chemin de lit sur la couette, du mobilier, des tissus et du miroir dans Chrome.
- Éclairage Cycles appliqué à 270 surfaces ; 92 maillages utilisent un éclairage aux sommets pour éviter les coutures sur les formes courbes. Les empreintes des 32 nouvelles ressources visuelles sont consignées dans `assets/photoreal/integrite.json`.
- Parcours local complet avec coordonnées fictives : dialogue, formulaire, carte magnétique, porte du couloir, « Entrer dans la chambre ». La zone affichée devient bien « La chambre ».
- Lampe de bureau : allumage et extinction essayés ; le changement de lumière reste visible sur le mur et le bureau après intégration de l'éclairage précalculé.
- Gros plan des serviettes : choix de présentation, rotation, zoom et lecture du mot essayés. Le lecteur natif charge le MP3 de référence sans erreur ; le miroir montre une réflexion de la salle de bains.
- Affichage à 390 × 844 pixels : largeur du document de 390 pixels ; gros plan de 366 pixels entre x=12 et x=378 ; contrôles audio et de manipulation accessibles. Cet essai de dimensions ne remplace pas un test sur téléphone physique.
- Galerie des extérieurs : photos réelles de piscine, palmiers, plage, mer et montagne Pelée ; dénomination, phrase et crédit de la photo de la montagne vérifiés. Les autres zones restent navigables en 3D.
- Syntaxe des modules vérifiée avec Node ; aucun message d'erreur JavaScript observé pendant ces parcours Chrome.

Les matériaux photographiques et PBR, les modèles 3D et les photos d'extérieur sont détaillés dans `SOURCES_VISUELLES.md`. Le rendu reste une scène pédagogique 3D fictive ; il ne s'agit pas de la numérisation photographique intégrale d'un hôtel existant.

# Version Palace Hôtel · 16 octobre 2026

305 identifiants audio, dont 34 lectures créées ou remplacées pour la nouvelle version ; 93 mots de vocabulaire. Même paire de références MP4 A1. Les 34 nouvelles prises ont été transcrites ; six lectures ont aussi été vérifiées par décodeur phonétique indépendant, notamment /la kle maɲetik/, /lə spɔt lyminø/ et /palas otɛl/. Le manifeste, les textes et les empreintes de chaque MP3 sont contrôlés par `scripts/verifier.py`. Les premières mesures ci-dessous documentent la banque précédente de 277 lectures ; les remplacements sont identifiés dans `audio/provenance.json`.

Les onze modèles GLB et les cinq jeux de matières PBR sont présents localement. Les géométries ont été optimisées par Meshopt et les textures par WebP. Les références vocales brutes et les modèles originaux non optimisés restent hors publication.

# Contrôles de la version du 16 octobre 2026

## Audio

277 identifiants, 277 lectures distinctes, soit 484,2 secondes de modèles. 220 lectures féminines, 57 masculines. Sources exactes : `voix de référence A1 femme.mp4` (SHA-256 `35f11c7b609aa832d76b069d1a7a23c4392d49640b69b42b89c8e41b0c0988a1`) et `voix de référence homme A1.mp4` (`ebfee1f29cb1b2ebcbbb5975bb7ec796def79539b3fda8597db2dc7dacf70146`). Extraits continus de 7,23 et 7,24 secondes, transcrits et fournis directement à Qwen3-TTS 1.7B Base MLX.

- Comparaison initiale des deux modes de clonage sur un petit jeu de mots, question, négation et accueil. 276 prises par empreinte vocale, une prise par contexte transcrit retenue pour le nom de l'hôtel.
- Transcription locale de toutes les prises avec Whisper large-v3-turbo ; contrôles supplémentaires des négations, des personnes grammaticales, des nombres et de « en supplément ».
- Rejet des premières lectures chiffrées de 80 et 96, réellement mal prononcées. Reprises depuis les textes « quatre-vingts » et « quatre-vingt-seize », confirmées par transcription et décodage phonétique indépendant.
- Vérification ciblée de « les chaussons » : l'erreur orthographique de Whisper « les choux sont » a été examinée par un décodeur phonétique indépendant, qui reconnaît bien /le ʃosɔ̃/. Les résultats bruts et le motif d'acceptation sont conservés.
- Comparaison acoustique WavLM à la référence attendue et à l'autre voix. Séparation contrôlée pour les énoncés suffisamment longs ; cette mesure n'est pas une certification d'identité.
- Normalisation en volume, amorce et fin silencieuses conservant les consonnes. MP3 mono 24 kHz à 128 kbit/s. Aucune accélération ni extension artificielle de la durée dans le fichier exporté.
- Contrôle de couverture des textes, des voix et des empreintes ; décodage intégral des 277 MP3 avec ffmpeg. Aucun fichier manquant et aucune alerte de texte ou de signal sur les prises retenues.
- Test Chrome réel : `w_serviettes.mp3` en lecture féminine active, et `qo_0.mp3` en lecture masculine active à 0,9× ; durée disponible et aucune erreur native du lecteur. Fermeture de l'activité : lecteur arrêté.

L'écoute humaine du naturel et du timbre reste une appréciation distincte des contrôles automatiques. La page `guide-audio.html` permet d'écouter directement plusieurs fichiers retenus, dont les deux nombres repris.

## Visuels et interactions

- Syntaxe JavaScript de la scène, du module de détails et de la visionneuse vérifiée avec Node.
- Inspection visuelle dans Chrome des peignoirs et serviettes dans la pièce et en gros plan. Le cadrage et l'orientation des serviettes ont été corrigés après les premiers essais.
- La vue rapprochée utilise les maillages de la scène. Pour une pile de serviettes, le premier exemplaire de la pile est isolé pour montrer ses détails. Sélection disponible entre serviette pliée et suspendue.
- Rotation, agrandissement, réduction et retour à la vue de départ ; accès depuis le lexique, même sans découverte préalable.
- Affichage vérifié à 390 × 844 pixels : largeur du document égale à 390 pixels, boîte de dialogue contenue dans l'écran et contrôles accessibles.
- Navigation vers la salle de bains et retour au parcours. Les anciennes progressions utilisent la même clé de sauvegarde.
- Réglage de vitesse conservé ; lecture et retour après choix au premier quiz. Absence d'erreur JavaScript dans les journaux Chrome de ces essais.

## Diffusion

Même adresse GitHub Pages, dossier `Atelier_Suite_Hotel_3D_A1`. Les deux anciennes banques base64 ont été remplacées par les MP3 et leur manifeste. Les sources MP4, extraits de référence et prises WAV de travail restent en local. Le contrôle après déploiement compare les fichiers publics à la livraison locale ; les traces de publication sont conservées dans le dossier de production.

## Essais de la version Palace Hôtel

- Chrome : chargement sans erreur des onze modèles Meshopt/WebP, visite, repères d’objets, gros plans de la carte et de la plante, rotation et lecture de leurs dénominations.
- Parcours complet avec coordonnées fictives : dialogue, formulaire, remise de la clé, sélection de la porte depuis le couloir, ouverture, bouton « Entrer dans la chambre », marche jusqu’à l’intérieur ; la zone affichée devient « La chambre ».
- Contrôle à 390 × 844 : document de 390 pixels, gros plan de 366 pixels de largeur, entièrement contenu entre x=12 et x=378 ; contrôles et son accessibles, aucune erreur console observée. Ce test de dimensions ne remplace pas un essai sur téléphone physique.
- Les textures générales et les modèles partagés restent en cache ; les audios utilisent un identifiant de version dans leur URL pour renouveler les lectures remplacées.
