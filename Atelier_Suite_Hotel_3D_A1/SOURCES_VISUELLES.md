# Palace Hôtel — ressources visuelles

La suite reste un lieu pédagogique fictif. Les meubles sont des modèles 3D détaillés, redimensionnés à l'échelle de la pièce ; la scène n'est pas une photographie d'un établissement existant.

## Refonte du 17 octobre 2026

La navigation et la manipulation des objets restent en 3D. Le paysage simplifié est remplacé par le panorama photographique [Illovo Beach Balcony, Greg Zaal](https://polyhaven.com/a/illovo_beach_balcony), sous CC0. Il s'agit d'une référence visuelle maritime réelle ; ce panorama sud-africain ne constitue pas une prise de vue de Fort-de-France.

Le chêne du mobilier et le teck de la terrasse utilisent [Oak Veneer 01](https://polyhaven.com/a/oak_veneer_01) et [Teak Veneer](https://polyhaven.com/a/teak_veneer), sous CC0. Le parquet conserve sa matière photographique propre. Les tissus utilisent les cartes PBR [Fabric 061, ambientCG](https://ambientcg.com/a/Fabric061), sous [CC0](https://docs.ambientcg.com/license/), avec une déclinaison d'albédo blanc. Les cartes textiles reconstruisent une trame ; elles ne sont pas présentées comme des photographies de tous les objets.

La couette est un modèle original drapé par une simulation de tissu dans **Blender 4.5.11 LTS**. Oreillers, coussins, canapé en tissu et transats sont de nouveaux modèles originaux avec volumes rembourrés, passepoils, lattes et assemblages. Le chemin de lit suit la surface effective de la couette. La carte magnétique et les objets détaillés du précédent travail sont conservés.

**Cycles** calcule l'éclairage direct et indirect sur 270 surfaces, avec 256 échantillons et cinq rebonds diffus. Les cartes de lumière sont débruitées avec **Open Image Denoise 2.5.1**, filtre [RTLightmap](https://www.openimagedenoise.org/documentation.html#rtlightmap). Les objets courbes reçoivent la lumière aux sommets, lissée selon la position et la normale, pour limiter les coutures d'atlas. Les lampes ponctuelles restent interactives. Le miroir utilise désormais une réflexion plane avec **Three.js Reflector**.

Les géométries sont compressées avec **glTF Transform 4.5.1 / Meshopt** en conservant leurs identifiants d'interaction. Le paysage existe en 8192 pixels et en version 4096 pixels pour les petits écrans ; les cartes de lumière disposent aussi de variantes mobiles. Blender et le débruiteur servent à la préparation : ils ne sont pas requis sur l'appareil de l'apprenant.

## Photos des extérieurs

Les cinq photos servent à nommer les éléments d'un environnement hôtelier fictif ; elles ne documentent pas toutes un établissement unique.

- Piscine et palmiers : [Pool](https://polyhaven.com/a/pool), CC0, projections rectilinéaires du panorama.
- Plage : [Secluded Beach](https://polyhaven.com/a/secluded_beach), CC0, projection rectilinéaire.
- Mer et photo encadrée : [Illovo Beach Balcony](https://polyhaven.com/a/illovo_beach_balcony), CC0, projection ou recadrage.
- Montagne : [Montagne Pelée, Eugénie Peigné](https://commons.wikimedia.org/wiki/File:Montagne_Pel%C3%A9e.JPG), sous [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). Redimensionnement et conversion WebP ; cette image dérivée reste sous CC BY-SA 3.0. Le crédit apparaît également dans la vue de la photo.

Les sources, variantes et empreintes des nouveaux fichiers figurent dans `assets/photoreal/catalogue.json`, `assets/photoreal/exteriors/sources.json` et `assets/photoreal/integrite.json`.

## Mobilier et plantes

Les ressources suivantes proviennent de [Poly Haven](https://polyhaven.com/models), sous [CC0](https://polyhaven.com/license). Les fichiers optimisés sont auto-hébergés dans `assets/models`, sans appel à l'API durant la visite. Les auteurs et fiches originales sont accessibles via chaque lien.

- [Sofa 02](https://polyhaven.com/a/sofa_02) : canapé capitonné de la version précédente, remplacé dans la scène par le nouveau canapé original en tissu.
- [Arm Chair 01](https://polyhaven.com/a/ArmChair_01) et [Modern Arm Chair 01](https://polyhaven.com/a/modern_arm_chair_01) : fauteuils et assemblages détaillés.
- [Modern Coffee Table 01](https://polyhaven.com/a/modern_coffee_table_01) : table basse en pierre et bois.
- [Side Table 01](https://polyhaven.com/a/side_table_01) : tables de nuit.
- [Dining Chair 02](https://polyhaven.com/a/dining_chair_02) : chaise de bureau en cuir.
- [Desk Lamp Arm 01](https://polyhaven.com/a/desk_lamp_arm_01) : lampe articulée.
- [Modern Ceiling Lamp 01](https://polyhaven.com/a/modern_ceiling_lamp_01) : suspension.
- [Potted Plant 01](https://polyhaven.com/a/potted_plant_01), [02](https://polyhaven.com/a/potted_plant_02) et [04](https://polyhaven.com/a/potted_plant_04) : feuillage, tiges, pots et terre texturés.

## Matières photographiques

[Wood Floor](https://polyhaven.com/a/wood_floor), [Brown Leather](https://polyhaven.com/a/brown_leather), [Marble 01](https://polyhaven.com/a/marble_01), [White Plaster 02](https://polyhaven.com/a/white_plaster_02) et [Fabric Pattern 05](https://polyhaven.com/a/fabric_pattern_05) : couleurs, reliefs normaux et rugosités. Des teintes et réglages différents distinguent parquet, noyer, pierre, cuir et coton. Les fichiers sont auto-hébergés dans `assets/materials`.

## Créations de l'atelier

La carte-clé Palace Hôtel reprend le principe des cartes RFID d'hôtels de luxe montré dans la recherche visuelle fournie : format bancaire, angles arrondis, faible épaisseur, impression recto verso, dorure et signe sans contact. Aucun logo d'hôtel tiers ni image de résultat Google n'est repris.

Porte et serrure électronique, poignées, spots, cadres vitrés, prises et interrupteurs, serviettes, peignoirs, chaussons et autres objets paramétriques sont réalisés dans le code de l'atelier. La nouvelle literie drapée et les meubles rembourrés sont préparés dans Blender. La photo de mer encadrée provient du panorama crédité ci-dessus ; les autres compositions décoratives sont originales.

## Bibliothèques et optimisation

[Three.js r160](https://github.com/mrdoob/three.js/tree/r160), licence MIT : GLTFLoader, MeshoptDecoder, éclairage de surface, matériaux physiques, EffectComposer, SSAOPass et OutputPass. L'occlusion ambiante est désactivée sur petit écran ; la visite utilise 30 images/s au maximum sur ordinateur et 20 sur petit écran. La visionneuse réutilise les mêmes géométries et matières.

[glTF Transform 4.5.1](https://gltf-transform.dev/cli), licence MIT : optimisation des géométries, compression Meshopt et textures WebP. Les onze modèles passent de 51,2 Mo de ressources sources à environ 5,04 Mo de GLB. Les textures générales conservent une résolution allant jusqu'à 1536 pixels. Le catalogue `assets/catalogue.json` consigne les sources et fichiers distribués.
