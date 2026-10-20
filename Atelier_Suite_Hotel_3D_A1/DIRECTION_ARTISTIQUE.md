# Références et réalisation — 18 octobre 2026

La chambre conserve sa navigation 3D et ses objets manipulables. Les recherches d'images fournies définissent des familles de mobilier ; elles ne désignent pas toutes une photographie unique. Les formes sont des modèles originaux réalisés pour l'atelier. Le bureau Charme dispose d'une référence produit précise, examinée sur le site Collinet.

| Élément demandé | Réalisation dans la chambre et le gros plan |
| --- | --- |
| Literie | Couette blanche drapée avec volumes de garnissage, revers, quatre oreillers bombés à taies bordées et deux coussins jaunes en velours. Les phrases apprises restent cohérentes avec les quantités et couleurs. |
| Serviettes | Coton éponge photographique, trois plis souples par serviette, petites boucles de fibres en géométrie instanciée, bordures en coton lisse, piles séparées et présentation suspendue. |
| Peignoirs | Corps et épaules reliés, deux manches effilées à poignets ouverts, col châle large, deux poches, ceinture plate nouée et cintre. Vue de face à l'ouverture du gros plan. |
| Tapis | Laine bouclée photographique, épaisseur visible, angles doux et pourtour surjeté. |
| Fleurs exotiques et vase | Bouquet tridimensionnel de fleurs rouges, oiseaux de paradis orange et feuillage d’anthurium scanné ; tiges visibles dans un vase en verre avec volume d'eau. Le vase possède sa propre dénomination. |
| Lampe de bureau | Lampe noire à socle lesté, bras parallèles, pivots, ressorts, câble et abat-jour creux à intérieur clair. L'ampoule et la lumière réagissent à l'allumage. |
| Armoire | Placage bois, deux portes vitrées fumées avec cadre et poignées, tringle, cintres, peignoir, tiroirs et bandes LED. Les portes restent ouvrables. |
| Valises | Coques rigides ivoire à reliefs, coins et poignées contrastés, poignée télescopique métallique, double fermeture, serrure et quatre roulettes doubles. |
| Climatisation | Unité split blanche arrondie, joint de façade, entrée d'air, bouche inférieure, ailettes et volet animé ; affichage existant conservé. |
| Bureau de chambre | Proportions du [Bureau Charme Collinet](https://www.collinet-sieges.com/fr/chambre-bureau/p/bureau-charme-1) : 120 × 45 × 75 cm, plateau plaqué, deux niches latérales, tiroir central, piétement sombre à raccords courbes et sabots métalliques. Téléphone et lampe repositionnés sur le nouveau plateau. |
| Murs | Revêtement chaud à trame de lin photographique fine ; variation d'albédo et relief distincts du bois et des textiles de bain. |
| Meuble d'entrée | Console à hauteur moyenne, plateau en pierre, façades à lattes, deux poignées et pieds métalliques. Objet cliquable séparément. |
| Vide-poche | Coupelle ovale creuse en céramique émaillée bleu-vert, fond incurvé et bord relevé ; son mot et sa phrase disposent de nouveaux audios. |
| Chevets et lampes | Tables de nuit à deux tiroirs, chants, joints et poignées ; pieds céramiques émaillés, garnitures métalliques, abat-jour en lin avec ourlets, armature et ampoule. Le gros plan isole un chevet. |
| Tête de lit | Panneau rembourré à points capitonnés et bordure cousue sur fond bois. Le gros plan se présente du côté du rembourrage. |

## Matières et préparation

Cinq jeux PBR photographiques supplémentaires proviennent de Poly Haven, sous CC0 : [Terry Cloth](https://polyhaven.com/a/terry_cloth), [Cotton Jersey](https://polyhaven.com/a/cotton_jersey), [Wool Boucle](https://polyhaven.com/a/wool_boucle), [Rough Linen](https://polyhaven.com/a/rough_linen) et [Velour Velvet](https://polyhaven.com/a/velour_velvet). Photographie : colormass ; traitement : Rico Cilliers. Les albédos sont déclinés en tons neutres ; les cartes normales et de rugosité conservent le relief des matières sources. Fichiers WebP jusqu'à 1536 pixels (768 sur petit écran), auto-hébergés ; traçabilité dans `assets/atelier18/sources.json`.

Le feuillage du bouquet utilise un spécimen du [scan Anthurium Botany 01](https://polyhaven.com/a/anthurium_botany_01), CC0, Rob Tuytel (scan) et Rico Cilliers (modèle). L’alpha est intégré à la couleur, les textures sont converties en WebP 1024 et la géométrie est comprimée avec Meshopt. Les fleurs orange et rouges sont des modèles originaux.

Les modèles précédents sont enrichis ou remplacés par `atelier18.js`. Blender/Cycles prépare à nouveau l'éclairage sur la géométrie définitive, avec UV secondaires, débruitage Open Image Denoise et compression Meshopt. Les références commerciales servent à l'étude des formes ; leurs photographies ne sont pas incluses dans les ressources distribuées.

## Vocabulaire et voix

Les 93 mots précédents restent accessibles. Trois entrées ajoutées rendent les nouveaux éléments cliquables : « la console d'entrée », « le vide-poche » et « le vase ». Chaque entrée possède un mot et une phrase, générés avec la même référence féminine Qwen3-TTS A1. Les 305 lectures précédentes sont conservées ; la banque comprend désormais 311 fichiers et 96 mots.

Le décor reste une reconstitution 3D pédagogique avec matières photographiques ; ce n'est pas une captation photographique intégrale d'un hôtel existant.
# Révision du 20 octobre 2026 — armoire et accessoires d’entrée

La référence Madox remplace l’armoire précédente : bois clair, trois travées, penderies, linge plié et bloc de trois tiroirs à droite. Le cadrage de la photographie est conservé dans les textures de l’intérieur et des façades ; les tiroirs et les portes vitrées possèdent leur volume et leur mouvement. Les deux tiroirs supérieurs contiennent des sous-vêtements ; le tiroir inférieur contient six chaussettes. La dépendance portes → tiroirs, puis tiroirs → portes, s’applique aussi pendant les animations.

Le porte-valise reprend le plateau brun, les côtés pleins et les bandes inox du modèle demandé. À l’entrée, le bouquet tropical cède la place à la photographie exacte des tulipes roses et du vase vert ; les clés sont celles de la nouvelle image, avec anneau argenté et étiquette brune. Leurs fichiers photographiques restent intacts, et leur fond est masqué par les matériaux d’affichage. Ces deux objets sont des surfaces photographiques, et non des volumes reconstruits.
