# Suite 14 · Palace Hôtel — A1

## Révision du 21 octobre — objets, vêtements et cohérence

**Version `20261021-3` : 111 mots, 358 lectures et 14 variantes selon l’objet.** Dans les phrases qui décrivaient déjà une couleur, le texte et le son correspondent à l’exemplaire : coussins jaunes du lit, coussins gris et coussins noirs et blancs de l’armoire. Les autres objets ne reçoivent pas systématiquement une nouvelle phrase de couleur.

L’armoire fait entendre « L’armoire est grande. Les vêtements sont dans l’armoire. ». Les chemises portent leur nom précis ; les pulls pliés sont également identifiés. Après ouverture des portes, **Pratiquer les vêtements et les couleurs** donne accès à douze vêtements : chemises bleue, blanche et rouge ; pantalons noir, gris et marron ; vestes verte, beige et orange ; robes rose, violette et jaune. Chaque choix a son nom, sa phrase et ses boutons de réécoute. Le gros plan permet de changer d’exemplaire et de revenir à l’armoire.

Les chaussettes, croissants, bouteille d’eau, corbeille de fruits et tableaux utilisent désormais des photographies réelles téléchargées et créditées dans [les sources](SOURCES_VISUELLES.md). Leurs proportions sont préservées ; le tableau conserve un cadre et un passe-partout. Les murs enduits intérieurs utilisent la référence Chevron Natural ; les murs extérieurs et latéraux de terrasse reprennent le parement Orsol. Les références Anantara et Hemea guident l’accord des matières et des tons.

Le pied du lampadaire est recentré entièrement sur le tapis et placé au-dessus de son épaisseur. Un tapis déjà découvert relance sa lecture au clic ; le gros plan peut également faire entendre son nom. Un mur sans tableau dit simplement « Voici un mur. ». La phrase des fruits nomme les pommes, les bananes et l’ananas visibles dans la nouvelle corbeille.

Les voix de référence A1 sont conservées. Vingt-huit lectures ont été produites ou reprises ; les fichiers et prises précédents sont sauvegardés hors du site. Les vérifications phonétiques et transcriptions sont automatiques. Voir [la validation de cette révision](VALIDATION_20261021-3.md).

## Révision du 21 octobre 2026

Le support compte **107 mots et 333 lectures**. Les objets visibles dans l’armoire sont sélectionnables dans le gros plan et dans l’inventaire « Les objets de l’armoire » : coussins, oreillers, boîtes, draps, serviettes, cintres, vêtements, cravates, valise, pantalon, mallette, penderie, étagères, tiroirs, sous-vêtements, chaussettes et coffre-fort. Le mot choisi, sa phrase et les commandes d’écoute apparaissent avant la liste et sont amenés à l’écran après la sélection. Un bouton permet de revenir du gros plan d’un objet à l’armoire.

Chaque tiroir comporte six compartiments : sous-vêtements unisexes pliés dans les deux premiers, six paires de chaussettes dans le dernier. Le coffre repose sur une étagère dans sa niche. Les quatre cintres 3D ajoutés au premier plan ont été écartés de la scène ; les cintres de la photographie restent sélectionnables.

Seize lectures complètent les huit nouveaux mots ; onze lectures existantes ont été reprises, dont « le comptoir » et « Il y a deux lavabos. ». Un indicateur signale le chargement et la lecture du son. Les exports repris conservent la parole entière et ajoutent 400 ms de silence final. Les contrôles phonétiques sont automatiques : ils ne certifient pas l’absence de défaut sur toute la banque. Voir [la validation détaillée](VALIDATION_20261021.md).

`wardrobe-interior.js` décrit les 24 zones photographiques et les vêtements en volume ; `wardrobe-learning.js` relie les objets, les choix au clavier et les lectures. Les trois contrôles reproductibles sont `python3 scripts/verifier.py`, `node scripts/verifier_armoire.mjs` et `node scripts/verifier_contenu_armoire.mjs`.

## Révision du 20 octobre 2026

L’armoire remplace le terme « placard » dans le lexique, les phrases et les lectures. Le support compte maintenant 99 mots et 317 lectures : trois entrées ajoutent les tiroirs, les sous-vêtements et les chaussettes. Douze lectures ont été produites ou remplacées avec la référence féminine A1 existante.

L’armoire reprend la disposition et les surfaces photographiques de la référence Madox transmise. Deux portes vitrées s’ouvrent ; chacun des trois tiroirs peut ensuite coulisser, avec des sous-vêtements dans les deux premiers et des chaussettes dans le dernier. Les commandes attendent la fin des animations : il faut ouvrir les portes avant les tiroirs et refermer tous les tiroirs avant les portes. Ces commandes existent dans la carte de l’objet et dans **Fiche → Lexique → l’armoire**.

Le porte-valise est reconstruit avec les panneaux bruns et les bandes inox du modèle fourni. Le bouquet et les clés utilisent directement leurs photographies, avec transparence calculée à l’affichage. Les quatre fichiers originaux sont conservés dans `assets/references20/` ; leur origine et leur empreinte figurent dans `sources.json`. Le gros plan permet aussi d’afficher la photo du modèle de l’armoire et du porte-valise.

`furniture20.js` installe ces objets après l’application de l’éclairage existant ; `wardrobe-state.js` gère les contraintes de mouvement. Contrôles : `python3 scripts/verifier.py` et `node scripts/verifier_armoire.mjs`.

Visite 3D pour adultes débutants, avec vocabulaire, phrases, dialogue à la réception et petites activités. La suite et ses équipements sont une situation fictive enrichie à partir de l'unité « Bon séjour ! » ; ils ne constituent pas une reproduction du document d'origine.

## Version du 16 octobre 2026

- Génération directe Qwen3-TTS avec les références exactes `voix de référence A1 femme.mp4` et `voix de référence homme A1.mp4`. La femme lit la réception, le vocabulaire et les questions ; l'homme lit le client, les réponses et les nombres.
- Une seule banque de 311 sons, chargés individuellement. Aucun recours automatique aux voix du navigateur. Vitesse normale, ou 0,9× dans **Fiche → Aide**, avec conservation de la hauteur.
- Serviettes à couches distinctes, plis, bordures et tissage bouclé ; peignoirs à manches, col châle, poches, ceinture et nœud ; chaussons ouverts, sèche-cheveux avec grille et câble, tasses creuses avec anse. Reprise des matériaux, des documents, des plantes et des finitions des autres objets.
- Bouton **Voir de près** sur la carte d'objet ; inspection disponible aussi depuis **Fiche → Lexique**, sans devoir deviner ou retrouver chaque objet. Les petits objets utilisent le même modèle 3D dans la pièce et dans la visionneuse. Rotation et zoom au doigt, à la souris ou avec les boutons et le clavier.

## Une petite séance A1

Choisir une pièce et environ cinq objets. Regarder, dire le nom avec l'article, écouter, puis dire une phrase entière avec une autre information. Revenir le lendemain. Les 111 entrées de vocabulaire forment une banque à répartir sur plusieurs séances.

Les compteurs comptabilisent les découvertes et les choix aux activités ; ils ne mesurent pas la maîtrise orale et ne donnent pas une note de prononciation. Les modèles restent accessibles après un essai.

## Organisation

`index.html` contient la structure et les données pédagogiques ; `style.css` l'interface ; `app.js` les interactions et la scène ; `realism.js` les modèles détaillés ; `palace.js` et `photoreal.js` le mobilier, les matières et l'éclairage ; `atelier18.js` les nouveaux objets et textiles ; `exteriors.js` la galerie des extérieurs ; `inspection.js` la visionneuse. `audio/manifest.json` associe chaque identifiant à son fichier MP3 et à son texte. `audio/provenance.json` documente les sources par empreinte, les prises retenues et les contrôles.

Les vidéos de référence, les extraits de voix et les prises WAV de travail restent hors du dépôt. Les sons diffusés sont des lectures générées pour cet atelier, pas les enregistrements originaux du manuel.

## Utilisation et données

Page apprenant : https://orionside.github.io/Atelier_Formation_Francais/Atelier_Suite_Hotel_3D_A1/

La scène utilise Three.js 0.160.0 via jsDelivr et deux polices via Google Fonts. Elle réunit des modèles originaux réalisés dans le code ou Blender et des ressources 3D, matières PBR et photographies créditées dans [SOURCES_VISUELLES.md](SOURCES_VISUELLES.md). Les fichiers visuels sont hébergés avec l'atelier ; aucune API de photothèque n'est appelée durant la visite. Les audios sont hébergés avec la page, sans service de synthèse à l'exécution.

Pour un essai local, lancer depuis ce dossier `python3 -m http.server 8778 --bind 127.0.0.1`, puis ouvrir `http://127.0.0.1:8778/`.

La progression et le formulaire d'exercice sont conservés dans le navigateur. Utiliser des coordonnées imaginaires. Le bilan est copié à la demande de l'apprenant. Aucun enregistrement de microphone n'est proposé par cet atelier.

## Palace Hôtel — seconde refonte visuelle

96 mots, 311 audios. Le mobilier et les plantes utilisent onze modèles 3D texturés optimisés, avec matières photographiques de parquet, pierre, cuir et tissu. Voir [les sources et bibliothèques](SOURCES_VISUELLES.md). La carte magnétique possède ses deux faces, un format bancaire et des angles arrondis.

Les repères cliquables se masquent avec « Masquer les repères ». Tous les objets restent sélectionnables directement ou depuis Fiche → Lexique. Les petites cibles bénéficient d’une marge de sélection ; les repères tiennent compte des murs. Après la remise de la carte à la réception, ouvrez la porte 14 dans le couloir puis choisissez « Entrer dans la chambre » : le déplacement suit physiquement le passage de la porte.

Le nom Palace Hôtel est une adaptation de cette simulation pédagogique ; il ne renomme pas l’établissement du manuel source. Le lieu reste fictif, même si ses modèles et matières visent un rendu crédible.
La refonte du 17 octobre 2026 ajoute un éclairage préparé dans Cycles, un panorama maritime photographique, de nouveaux modèles de literie et de mobilier, une réflexion plane du miroir et des photographies pour le vocabulaire des extérieurs. Les détails et licences figurent dans [SOURCES_VISUELLES.md](SOURCES_VISUELLES.md). Les 305 fichiers audio et leurs voix de référence sont conservés.

## Références du 18 octobre 2026

Quinze familles d’objets ont été reprises : literie gonflante à taies bordées, couette, tête de lit capitonnée, tapis bouclé, serviettes en coton éponge, peignoir à col châle, bureau aux proportions du Charme Collinet, lampe articulée, armoire vitrée avec LED, valise à roulettes et accessoires d’entrée. [La direction artistique](DIRECTION_ARTISTIQUE.md) explique chaque correspondance aux références.

Cinq matières photographiques PBR et un feuillage d’anthurium scanné sont ajoutés sous CC0, avec variantes de textures pour petits écrans. L’éclairage est recalculé sur 294 surfaces ; 107 formes courbes reçoivent un éclairage aux sommets. La console d’entrée, le vide-poche et le vase ajoutent trois mots et six lectures Qwen avec la référence féminine A1 existante. Les 305 MP3 précédents conservent exactement leurs empreintes.
