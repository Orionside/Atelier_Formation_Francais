# Alimentation du futur · bis : ancrage dans Défi actuel 2

## Version bis v5 — voix féminine 2 et repères rythmiques

La référence est le fichier « voix féminine synthétisée de référence 2.mp4 » fourni le 5 octobre 2026 (15,0 s, AAC stéréo à 44,1 kHz ; SHA-256 du MP4 : `bbaa137d31695e99def5063085c69bb12627f7d604057aa1896d53d88abbb4d5`). Son extrait vocal a été converti en WAV mono à 24 kHz, avec une courte fin silencieuse ; sa hauteur médiane mesurée est de 240 Hz. Le WAV et sa transcription de contrôle restent locaux dans `audio/voix-reference/` et sont ignorés par Git. La synthèse des textes du cours utilise le modèle **Qwen3-TTS 1.7B Base en mode empreinte vocale seule**, sans reprendre le contenu ni le débit de la référence. [Documentation officielle du clonage Qwen3-TTS](https://github.com/QwenLM/Qwen3-TTS#voice-clone).

La chaîne de production reprend les essais locaux de la v4 avec cette même voix : 1 304 prises candidates pour 235 lectures, quatre graines ordinaires et davantage pour les phrases à trous. Le texte envoyé au modèle suit les unités de sens et signale les frontières de groupe par la ponctuation ; les prises sont comparées sur le texte reconnu, la hauteur, le timbre, le naturel estimé et les indices temporels. Le calibrage agit principalement sur les silences **déjà présents** : frontière mineure au plus 0,20 s, virgule entre 0,35 et 0,55 s, fin de phrase entre 0,70 et 0,95 s. Un allongement temporel limité à 10 % ne s'applique qu'aux prises dont le débit articulatoire dépasse 5,6 syllabes/s. Les 235 MP3 totalisent environ 17,1 minutes. Ces mesures sont des contrôles de fabrication, pas une preuve de bénéfice cognitif ni une validation de la prononciation par une oreille francophone.

Le français n'a pas d'accent lexical fixe comparable à celui de certaines autres langues. Les frontières de groupes et l'allongement final peuvent aider à segmenter la parole, mais les syllabes naturelles **n'ont pas toutes la même durée** : l'isochronie stricte n'est donc pas une cible de synthèse. La v5 ajoute trois écoutes courtes avec dévoilement des groupes après une première écoute, puis répétition de la phrase entière. Les expressions restent dans la situation familière de la cantine, avec réécoute et une seule priorité à la fois. Le but est de réduire l'effort de repérage pour l'apprenant adulte ; le support ne prétend pas avoir mesuré une baisse de charge cognitive. Voir l'[étude acoustique et perceptive des groupes accentuels français](https://www.isca-archive.org/speechprosody_2002/rolland02_speechprosody.html), l'[étude sur la segmentation en L2](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.00985/pdf) et les [descripteurs A2 du CECRL](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors-search).

Le contrôle de la v5 a repéré une longue consigne tronquée. Elle est désormais générée en trois phrases. Une courte fin de phrase à trou avait un timbre divergent : plusieurs nouvelles prises ont été comparées avant choix. Les homophones tels que « il/ils » ou « commencer/commencez » produisent de faux écarts dans la transcription automatique ; ils sont analysés selon le son réellement attendu. Le document `audio/A_ECOUTER_EN_PRIORITE.md` distingue les alertes qui nécessitent une écoute humaine. Pour reproduire la production, placer localement la référence convertie sous `audio/voix-reference/reference.wav` ; ni le MP4 fourni, ni le WAV, ni sa transcription ne sont publiés.

Inspection du 1er octobre 2026, dans la session Chrome autorisée du formateur. Le cours A2 fourni en premier ouvre **Défi actuel 2**. Le second lien renvoie à l'ancien cours A1 ; il n'a pas servi de source pour cet atelier.

Cette version prolonge `Atelier_Alimentation_Futur_A2`, déjà publié dans le dépôt. Elle conserve le moteur et la progression de Rendez-vous A1 : situation concrète, premier oral, écoute guidée, six expressions, imitation d'un modèle humain, trois reprises du même message, second oral et objectif de réemploi. Le contenu est adapté à une apprenante adulte de niveau A2 renforcé ; sa langue maternelle n'est pas présumée.

## Ce qui a été examiné

- Les sept pages demandées ont été ouvertes, et leurs images complètes ont été lues visuellement. Le feuilletage présente des pages sous forme d'images ; le texte du document n'est donc pas disponible comme un article HTML accessible.
- Les points interactifs ont été repérés par leur emplacement réel sur les pages et leur rôle dans le DOM : exercices, pistes audio, lectures du texte et capsule vidéo. Aucune réponse d'exercice ni note du compte n'a été soumise.
- Les cinq lecteurs des pistes 35, 36, 37, 38 et 39 ont été ouverts. Leurs **transcriptions officielles visibles**, la durée et les commandes de lecture ont été examinées. La capsule vidéo sur la lettre g affiche une durée de 3 min 56.
- Le code accessible de l'interface a été inspecté : iframe du feuilleteur, images de pages, points interactifs positionnés, lecteur, segmentation des transcriptions et choix de vitesse. Le fichier de données protégé de l'éditeur n'a pas pu être récupéré par la capacité disponible. Il n'a pas été rétroconçu à partir de données cachées.

**Limite de l'analyse audio :** les transcriptions et les lecteurs permettent une analyse linguistique et structurelle. Les cinq fichiers audio natifs n'ont pas été extraits ; aucune mesure acoustique de leur accent, débit parlé effectif ou intonation n'est revendiquée. Les marques de bruits de fond proviennent des transcriptions, pas d'une écoute humaine. Les durées comprennent les introductions et les silences.

## Lecture détaillée des pages

| Page | Contenu vérifié | Fonction pédagogique | Conséquence pour l'atelier bis |
|---|---|---|---|
| 51 | Ouverture de l'unité 3, « Je me suis régalé ! ». Dossier 1 : cuisines locales, cultures culinaires, pronom en, progression, pronoms interrogatifs. Photo d'un restaurant parisien. | Annonce des objectifs de description, de réaction et de choix. Le dossier 2, annoncé également, traite d'autres acquis. | Cibler les acquis du dossier 1 ; ne pas confondre l'annonce de toute l'unité avec ce qui est effectivement travaillé avant la page 58. |
| 52 | Carte des outre-mer et spécialités de Guadeloupe, de La Réunion et de Martinique ; courts portraits culinaires et photos. | Relier un plat à un lieu, reconnaître les ingrédients et choisir un plat. La carte et les photos permettent des hypothèses avant la lecture. | Partir d'un plat familier de l'apprenante ; ne pas faire mémoriser tous les noms et lieux. |
| 53 | Spécialités de Nouvelle-Calédonie et de Polynésie ; activités de repérage, choix et ingrédients ; piste 35 ; répertoire pour qualifier et apprécier un plat. | Passer d'une description à une réaction personnelle ; reconnaître qui a goûté quoi, puis relever un commentaire. | Complément oral : nom, ingrédients, préparation, avis. Une appréciation suffit, sans liste exhaustive d'adjectifs. |
| 54 | Présentation d'un restaurant camerounais et de quatre plats. Photos, ingrédients, accompagnements et préparation ; plusieurs reprises nominales avec en. | Comprendre un texte de type menu/site de restaurant et préparer l'observation du pronom. | Réutiliser la construction dans des phrases courtes sur légumes, riz ou poisson. |
| 55 | Piste 36 : commande au restaurant. Préparations grillée, marinée, cuite ou frite. Observation de la place de en ; piste 37 : habitudes alimentaires. Réactions à des plats et présentation d'une recette personnelle. | Avec un verbe conjugué, en se place devant lui ; avec un verbe conjugué suivi d'un infinitif, en se place devant l'infinitif concerné. Réemploi avec fréquence et expérience passée. | Deux modèles centraux : j'en mange et je peux en préparer. Les formes négatives sont disponibles en complément. |
| 56 | Quatre tendances : cuisine des restes, bols composés, fleurs comestibles et fusion de traditions. Chaque paragraphe est lié à une grande photo. | Comprendre une tendance concrète puis donner son avis ; observer progression et questions de choix dans le texte. | Garder les restes comme pont concret avec la vidéo. Les thèmes techniques ou inhabituels restent des supports de compréhension. |
| 57 | Piste 38 : échange sur les tendances ; progression et piste 39 ; évolution des habitudes ; quatre formes de lequel ; jeu de choix ; capsule phonétique sur la lettre g. | Distinguer changement dans le temps et comparaison ; poser une question avec un référent connu ; distinguer les deux valeurs consonantiques de g dans des mots. | Lequel/laquelle et les pluriels sont réemployés dans un panneau facultatif. La lettre g est proposée avec quatre mots familiers, séparément du travail de mélodie. |

## Pistes 35 à 39 : analyse linguistique des transcriptions

| Piste | Durée du lecteur | Organisation et informations à comprendre | Points de vigilance |
|---|---|---|---|
| 35, p. 53 | 1 min 47 | Interview de trois visiteurs : cari poulet, poisson cru à la tahitienne et acras aux crevettes. Les réponses associent plat, ingrédients/goût et appréciation. | Plusieurs noms propres et spécialités peu familières. Premier passage : associer personne et plat ; second passage : une appréciation. La transcription signale un murmure de fond. |
| 36, p. 55 | 1 min 05 | Serveur et couple : entrée partagée, deux plats, boissons, absence de dessert, satisfaction et addition. | Tableau à six informations possible, mais coûteux en première écoute. Le ndolé et les bananes plantains demandent un repère visuel. Repérer les rôles avant les détails. |
| 37, p. 55 | 46 s | Deux amis contrastent leur consommation de viande, poisson et fromage ; en est repris dans des réponses positives et négatives. | La fréquence porte sur un aliment identifié. Végétarien et végan sont des mots de compréhension ; leur mémorisation n'est pas nécessaire pour produire une habitude. |
| 38, p. 57 | 1 min 31 | Deux amis évoquent surtout cuisine fusion et cuisine des restes ; les questions de choix ont un référent dans la conversation. | Oral familier avec contractions, omission de ne et réactions spontanées. Présenter les formes pleines dans les modèles de production ; les variantes familières servent au repérage. L'annonce orale dit « activité 2 », tandis que le livre place la piste à l'activité 3 : le numéro de piste et son contenu font foi. |
| 39, p. 57 | 49 s | Huit énoncés indépendants : cinq expriment une évolution ; les autres expriment une comparaison ou un choix. | Entendre plus ou moins ne suffit pas à identifier la progression. Faire porter l'écoute sur la construction entière et le sens temporel. |

Les lectures supplémentaires du texte et les liens Lexiville/grammaire ont été repérés. Ils ne sont pas incorporés au parcours : ils ajoutent des objectifs et exigent le compte du manuel. Les pages ou pistes de l'éditeur ne sont pas republiées.

## Alignement A2 renforcé et charge cognitive

Le [Volume complémentaire du CECRL, Conseil de l'Europe, 2021](https://rm.coe.int/cadre-europeen-commun-de-reference-pour-les-langues-apprendre-enseigne/1680a4e270) distingue A2 et A2 renforcé dans certaines échelles. Il rattache la compréhension à une diction claire, à un sujet familier et à un débit adapté ; il permet des descriptions brèves et des échanges simples sur des sujets quotidiens. Les repères utilisés ici sont la compréhension générale de l'oral, la production orale, l'échange d'informations et la maîtrise phonologique. **Ce cadre ne certifie ni un support ni le niveau réel d'une personne**, et n'impose pas un inventaire de grammaire française.

La conception de la bis applique ces repères de manière pédagogique :

1. Une situation stable à la cantine, avec un message repris pendant toute la séance.
2. Trois priorités : une habitude avec en, un changement et une raison simple. Les six cartes constituent une réserve de phrases ; toutes ne doivent pas être maîtrisées en une séance.
3. Deux extraits guidés ; deux questions chacun. Les passages avec nombres, algues ou noms d'insectes sont facultatifs.
4. Des exemples sur l'alimentation pour réduire les changements de contexte. Les aides sont en français courant, sans supposer l'espagnol.
5. Un panneau replié pour revenir au manuel : un plat, en, un choix ou la lettre g. Le formateur choisit **une** activité selon le besoin, sans ajouter une nouvelle étape obligatoire.
6. La répétition du même message conserve le format 90 → 75 → 60 secondes. La réduction n'est pas un test de vitesse ; le formateur peut garder une durée identique et autoriser les mots-clés.
7. Les mesures de pauses et de mélodie sont affichées comme repères approximatifs. Une pause ou une voix moins étendue n'est pas automatiquement un échec.

La vidéo « 1 jour, 1 question » contient du lexique et des formes plus complexes que le noyau de production. Elle sert de document accompagné. Ses projections sur l'avenir ne sont pas validées comme des données actuelles. Les courbes du support décrivent ses extraits humains ; elles ne deviennent pas des règles universelles de prononciation.

## Lectures Qwen et limites de validation

**Version bis v3 (2-3 octobre 2026) : voix féminine clonée, calibrée pour un niveau A2.** Le contenu est celui de la bis ; seule la voix des boutons « Écouter » change. La référence est un extrait de 14,6 secondes du fichier « Voix féminine générée.wav », fourni par le formateur comme voix de synthèse, suivi de 0,5 s de silence (hauteur médiane : 192 Hz).

Méthode, établie par des essais mesurés :
- **Mode « empreinte vocale seule »** : en clonage avec transcription de la référence, 9 prises sur 32 descendaient vers 120 Hz (voix nettement plus grave) ; avec l'empreinte seule, 0 sur 21.
- **Débit** : le modèle n'a pas de réglage de vitesse et n'imite pas le débit de sa référence (une référence ralentie ne change rien). Le texte envoyé au modèle met une phrase par paragraphe et « ... » à la place des virgules (environ −20 %). Après génération, les pauses sont allongées (≥ 0,40 s après une virgule, ≥ 0,70 s après une fin de phrase) et la voix est légèrement allongée (atempo, au plus ×1,12) seulement au-delà de 200 mots/min. L'allongement PSOLA a été écarté : il coûtait environ 1 point de naturel.
- **Choix des prises** : 3 prises par texte (8 à 13 pour les textes difficiles), mesurées par transcription (Whisper large-v3-turbo, nombres lus en lettres), hauteur, ressemblance du timbre (WavLM) et note de naturel (UTMOSv2). La prise retenue a tous ses mots, le bon timbre, une hauteur dans la plage de la voix, et la meilleure note ; dans une phrase à trous, toute prise contenant un mot de trop est rejetée (la réponse risquerait d'être dite).
- **Résultat** : 235 audios, 16,9 minutes ; débit médian des textes de 8 mots et plus : 155 mots/minute ; ressemblance médiane du timbre : 0,95 ; naturel médian : 3,46 sur 5. Détail par audio : `audio/qwen3-tts/qa-selection.json` ; audios à écouter d'abord : `audio/A_ECOUTER_EN_PRIORITE.md`.

Ces mesures ne remplacent pas l'oreille : la note de naturel est surtout calibrée sur l'anglais et ne juge ni l'accent ni la justesse de l'intonation.

Les scripts de cette chaîne sont dans `scripts/` (plan_production, generer_prises, mesurer_gpu, ecouter, calibrer, assembler). Les contenus pédagogiques, compléments, citations courtes du film et notes du formateur sont sonorisés. Les phrases saisies librement et les valeurs calculées par le navigateur ne font pas partie du catalogue prédéfini.

Les lectures à trous et les variantes de certaines cartes sont fabriquées par fragments français séparés par une pause. Les lectures longues de l'apprenante dont le débit estimé dépasse 185 mots/minute sont modérées vers 175 mots/minute, avec une réduction limitée pour éviter une forte déformation temporelle. Cette estimation inclut les pauses et ne décrit pas le débit articulatoire. Le bouton de lecture lente reste disponible.

Contrôles : correspondance du texte affiché avec le catalogue, fichiers MP3 décodables et non silencieux, empreintes des fichiers, intégration au parcours et reconnaissance automatique des mots. **La reconnaissance ne valide pas le naturel, la prosodie ou l'âge perçu.** Une écoute humaine reste le contrôle adéquat de ces qualités. Les modèles de la vidéo restent disponibles avec leur voix humaine ; les lectures Qwen sont des lectures complémentaires distinctes.

Les versions précédentes sont conservées à leur adresse. La bis v3 possède une autre adresse et une autre clé de sauvegarde locale : elle ne remplace pas les réponses enregistrées dans l'ancien atelier.
