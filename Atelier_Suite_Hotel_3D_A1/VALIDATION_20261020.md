# Armoire et objets d’entrée — 20 octobre 2026

Version des modules et de la banque audio : `20261020-3`.

- Vocabulaire : « l’armoire », féminin, remplace « le placard » ; phrases des cintres et du coffre-fort corrigées. « Le porte-valise » remplace le libellé du porte-bagages. Ajout des tiroirs, des sous-vêtements et des chaussettes : 99 mots.
- Audio : 317 lectures au manifeste. Douze lectures nouvelles ou remplacées, avec la référence féminine Qwen A1 existante. Transcription Whisper conforme ; écart phonétique calculé nul pour les douze lectures. Contrôle des 317 textes, voix, empreintes et décodages MP3. Il ne s’agit pas d’une certification par écoute humaine.
- Ressources : les quatre images fournies sont conservées sans modification, avec leur URL et leur SHA-256 dans `assets/references20/sources.json`.
- Armoire : disposition et surfaces photographiques Madox, caisson et étagères en volume, deux portes vitrées et trois tiroirs mobiles. Les deux premiers contiennent des sous-vêtements ; le dernier contient six chaussettes.
- Contraintes contrôlées automatiquement : tiroirs bloqués portes fermées et pendant l’ouverture ; fermeture des portes bloquée si un tiroir est ouvert ou en mouvement ; clics répétés pendant les animations ; positions finales exactes après fermeture.
- Parcours contrôlé dans Chrome : ouvrir les portes, ouvrir les trois tiroirs, constater le blocage de la fermeture, refermer les trois tiroirs, puis les portes. Même cycle disponible dans la carte et dans le gros plan ; les animations continuent lorsque la scène principale est suspendue par la visionneuse.
- Affichage : armoire fermée et ouverte, tiroir inférieur et chaussettes visibles, porte-valise en situation, bouquet photographique et clés dans le vide-poche. Les gros plans utilisent les modèles de la scène ou les fichiers photographiques originaux.
- Largeur de 390 px : document de 390 px, dialogue de 366 px avec marge de 12 px, commandes présentes dans le dialogue. Contrôle de mise en page dans un navigateur redimensionné, sans téléphone physique.
- Syntaxe JavaScript et `git diff --check` valides. Aucune erreur JavaScript après correction du repérage du bouquet photographique.

Les scripts et prises de production restent dans `production/armoire20261020/`, hors du site publié. Le site contient les deux contrôles reproductibles : `python3 scripts/verifier.py` et `node scripts/verifier_armoire.mjs`.
