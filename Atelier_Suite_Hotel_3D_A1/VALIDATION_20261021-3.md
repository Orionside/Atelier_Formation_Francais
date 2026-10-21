# Objets, couleurs et découverte A1 — version 20261021-3

Révision à partir du commit `28be3b2` : 111 entrées de vocabulaire, 358 MP3 et 14 variantes liées à des exemplaires précis. Les prises et les originaux téléchargés restent dans `production/coherence20261021/`, hors du site.

## Cohérence pédagogique

- Les phrases de couleur préexistantes restent inchangées pour le lit et les autres objets qui leur correspondent. Les coussins photographiques de l’armoire ont deux variantes propres : gris, noirs et blancs. Le choix d’un exemplaire ne modifie pas la phrase d’un autre exemplaire.
- Au clic sur l’armoire : « L’armoire est grande. Les vêtements sont dans l’armoire. ». La lecture automatique respecte les préférences de son de l’apprenant.
- Les chemises et les pulls pliés ont leur nom précis. Douze modèles de vêtements sont reliés à leur nom, leur phrase et leur couleur : chemises bleue/blanche/rouge, pantalons noir/gris/marron, vestes verte/beige/orange et robes rose/violette/jaune. Les choix comportent un mot et un repère visuel de couleur.
- Après ouverture des portes, un bouton donne directement accès à la pratique des vêtements et des couleurs. Un second bouton permet de choisir un autre vêtement après une écoute. Le gros plan propose également un choix d’exemplaire et le retour à l’armoire.
- Le clic sur un tapis déjà découvert relance sa lecture. L’ouverture d’un gros plan lance le nom lorsque la lecture automatique est active. Le fichier `w_tapis`, déjà conforme au contrôle phonétique, est conservé.
- Le mur dit « Voici un mur. ». La phrase mentionnant le tableau n’est plus utilisée pour les murs nus. La corbeille photographique fait nommer les pommes, les bananes et l’ananas qu’elle contient.

## Visuels et positionnement

Chaussettes, croissants, bouteille d’eau, corbeille de fruits et tableaux utilisent des photographies réelles téléchargées. Les droits, auteurs et adaptations sont indiqués dans [SOURCES_VISUELLES.md](SOURCES_VISUELLES.md) et dans `assets/coherence21/sources.json`. Les photographies sont optimisées en WebP et hébergées avec le site.

Les croissants sont présents à deux exemplaires sur l’assiette ; les six cases du tiroir inférieur présentent des paires de chaussettes photographiques. La bouteille et la corbeille s’orientent vers le visiteur pour rester reconnaissables. Les masques de clic des photos suivent les zones visibles. L’œuvre de Van Gogh conserve ses proportions dans le passe-partout des cadres.

La texture Chevron Natural fournie est appliquée aux matériaux des murs enduits intérieurs ; le parement de pierre Orsol est appliqué aux murs extérieurs et aux séparations de terrasse. Les deux autres références fournies guident l’accord des tons et des matières. Les matériaux conservent l’éclairage préparé de la scène ; les surfaces vitrées, le bois et les revêtements spécifiques gardent leur fonction visuelle.

Le lampadaire est déplacé de 25 cm vers l’intérieur du tapis. Son pied doit être entièrement contenu dans l’emprise du tapis ; sa base est placée 4 mm au-dessus du point le plus haut de la surface et des finitions. Un contrôle d’emprise empêche un placement sans support. La zone de collision suit le déplacement. Le contrôle visuel en vue plongeante montre le pied au-dessus du tapis.

## Audio et vérifications

Vingt-huit lectures sont produites ou reprises avec la référence féminine A1 Qwen existante : 25 nouvelles lectures et trois remplacements (`e_armoire`, `e_mur`, `e_fruits`). Les MP3 précédents de ces trois phrases et les manifests sont sauvegardés. Les exports conservent toute la parole, avec 120 ms ajoutées au début et 400 ms à la fin.

Les 28 prises retenues ont une transcription conforme au texte et un écart phonétique automatique inférieur ou égal à 0,06. Pour « pulls », le résultat reconnu /pyl/ est comparé explicitement à la prononciation française : eSpeak avait interprété le mot en anglais. Pour « ananas » et « robes », de petites divergences entre la référence automatique et la reconnaissance sont conservées dans le rapport. Ces vérifications ne constituent pas une validation par écoute humaine.

Contrôles reproductibles : `python3 scripts/verifier.py`, `node scripts/verifier_armoire.mjs`, `node scripts/verifier_contenu_armoire.mjs`, `node scripts/verifier_coherence.mjs`. Ils vérifient la couverture de tous les textes et variantes, les empreintes et décodages MP3, les empreintes visuelles, la syntaxe JavaScript en mode module explicite, les contraintes portes/tiroirs et la séparation des phrases entre exemplaires.

Dans Chrome : vérification des douze choix de vêtements et de leurs vrais MP3, des deux variantes de coussins, des deux phrases de l’armoire, du tapis depuis la scène puis le lexique, et du mur nu. Les photos des chaussettes, croissants et fruits sont chargées sans erreur dans le gros plan. La bouteille reste visible depuis la table, et un clic sur son bouchon la reconnaît correctement. Le tableau est présenté de face ; le gros plan montre la même œuvre que la scène. À 390 × 844 px : document de 390 px, dialogue de 366 px avec 12 px de marge ; le panneau du vêtement, sa phrase et ses quatre commandes sont entièrement visibles. Il s’agit d’un contrôle de mise en page dans Chrome redimensionné, sans téléphone physique.

Le script local `production/coherence20261021/verifier_publication.py` compare après publication chaque fichier modifié depuis `28be3b2` et tous les 358 MP3, par SHA-256 et par type MIME pour l’audio. Il conserve un rapport horodaté pour chaque vérification réussie.
