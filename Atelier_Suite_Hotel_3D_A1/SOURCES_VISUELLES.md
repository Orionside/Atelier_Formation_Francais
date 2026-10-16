# Palace Hôtel — ressources visuelles

La suite reste un lieu pédagogique fictif. Les meubles sont des modèles 3D détaillés, redimensionnés à l'échelle de la pièce ; la scène n'est pas une photographie d'un établissement existant.

## Mobilier et plantes

Les ressources suivantes proviennent de [Poly Haven](https://polyhaven.com/models), sous [CC0](https://polyhaven.com/license). Les fichiers optimisés sont auto-hébergés dans `assets/models`, sans appel à l'API durant la visite. Les auteurs et fiches originales sont accessibles via chaque lien.

- [Sofa 02](https://polyhaven.com/a/sofa_02) : canapé capitonné.
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

Porte et serrure électronique, poignées, spots, cadres vitrés, prises et interrupteurs, literie drapée, serviettes, peignoirs, chaussons et autres objets paramétriques sont réalisés dans le code de l'atelier. Les illustrations encadrées sont des compositions originales.

## Bibliothèques et optimisation

[Three.js r160](https://github.com/mrdoob/three.js/tree/r160), licence MIT : GLTFLoader, MeshoptDecoder, éclairage de surface, matériaux physiques, EffectComposer, SSAOPass et OutputPass. L'occlusion ambiante est désactivée sur petit écran ; la visite utilise 30 images/s au maximum sur ordinateur et 20 sur petit écran. La visionneuse réutilise les mêmes géométries et matières.

[glTF Transform 4.5.1](https://gltf-transform.dev/cli), licence MIT : optimisation des géométries, compression Meshopt et textures WebP. Les onze modèles passent de 51,2 Mo de ressources sources à environ 5,04 Mo de GLB. Les textures générales conservent une résolution allant jusqu'à 1536 pixels. Le catalogue `assets/catalogue.json` consigne les sources et fichiers distribués.
