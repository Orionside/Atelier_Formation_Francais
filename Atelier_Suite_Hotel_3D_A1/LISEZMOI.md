# Suite 14 · Hôtel Caribeach — A1

Visite 3D pour adultes débutants, avec vocabulaire, phrases, dialogue à la réception et petites activités. La suite et ses équipements sont une situation fictive enrichie à partir de l'unité « Bon séjour ! » ; ils ne constituent pas une reproduction du document d'origine.

## Version du 16 octobre 2026

- Génération directe Qwen3-TTS avec les références exactes `voix de référence A1 femme.mp4` et `voix de référence homme A1.mp4`. La femme lit la réception, le vocabulaire et les questions ; l'homme lit le client, les réponses et les nombres.
- Une seule banque de 277 sons, chargés individuellement. Aucun recours automatique aux voix du navigateur. Vitesse normale, ou 0,9× dans **Fiche → Aide**, avec conservation de la hauteur.
- Serviettes à couches distinctes, plis, bordures et tissage bouclé ; peignoirs à manches, col châle, poches, ceinture et nœud ; chaussons ouverts, sèche-cheveux avec grille et câble, tasses creuses avec anse. Reprise des matériaux, des documents, des plantes et des finitions des autres objets.
- Bouton **Voir de près** sur la carte d'objet ; inspection disponible aussi depuis **Fiche → Lexique**, sans devoir deviner ou retrouver chaque objet. Les petits objets utilisent le même modèle 3D dans la pièce et dans la visionneuse. Rotation et zoom au doigt, à la souris ou avec les boutons et le clavier.

## Une petite séance A1

Choisir une pièce et environ cinq objets. Regarder, dire le nom avec l'article, écouter, puis dire une phrase entière avec une autre information. Revenir le lendemain. Les 79 entrées de vocabulaire forment une banque à répartir sur plusieurs séances.

Les compteurs comptabilisent les découvertes et les choix aux activités ; ils ne mesurent pas la maîtrise orale et ne donnent pas une note de prononciation. Les modèles restent accessibles après un essai.

## Organisation

`index.html` contient la structure et les données pédagogiques ; `style.css` l'interface ; `app.js` les interactions et la scène ; `realism.js` les modèles détaillés ; `inspection.js` la visionneuse. `audio/manifest.json` associe chaque identifiant à son fichier MP3 et à son texte. `audio/provenance.json` documente les sources par empreinte, les prises retenues et les contrôles.

Les vidéos de référence, les extraits de voix et les prises WAV de travail restent hors du dépôt. Les sons diffusés sont des lectures générées pour cet atelier, pas les enregistrements originaux du manuel.

## Utilisation et données

Page apprenant : https://orionside.github.io/Atelier_Formation_Francais/Atelier_Suite_Hotel_3D_A1/

La scène utilise Three.js 0.160.0 via jsDelivr et deux polices via Google Fonts. Les modèles, matières et visuels ont été réalisés dans le code de cet atelier ; aucune photothèque n'est chargée. Les audios sont hébergés avec la page, sans service de synthèse à l'exécution.

Pour un essai local, lancer depuis ce dossier `python3 -m http.server 8778 --bind 127.0.0.1`, puis ouvrir `http://127.0.0.1:8778/`.

La progression et le formulaire d'exercice sont conservés dans le navigateur. Utiliser des coordonnées imaginaires. Le bilan est copié à la demande de l'apprenant. Aucun enregistrement de microphone n'est proposé par cet atelier.
