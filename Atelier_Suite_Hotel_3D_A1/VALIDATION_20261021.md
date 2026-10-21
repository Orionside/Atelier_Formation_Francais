# Contenu de l’armoire et corrections audio — 21 octobre 2026

Version des modules et du manifeste audio : `20261021-2`. Cette livraison poursuit les modifications du 20 octobre, à partir du commit `61e6c42`.

## Contenu et interactions

- Deux tiroirs de six compartiments avec sous-vêtements unisexes pliés ; troisième tiroir avec six paires de chaussettes. Cloisons en tissu et coutures en volume.
- Coffre posé sur une étagère pleine dans une niche ; les anciennes serviettes de la photographie sont masquées dans cette niche. Les quatre cintres 3D de premier plan ne sont plus affichés. Les fichiers de référence et les sauvegardes sont conservés.
- Vingt choix dans l’inventaire, couvrant dix-sept familles d’objets ; vingt-quatre zones photographiques repérées. Les objets du gros plan de l’armoire et du tiroir peuvent être sélectionnés au pointeur. L’inventaire offre les mêmes lectures avec des boutons accessibles au clavier.
- Nom, phrase, réécoute et gros plan de l’objet sélectionné ; retour à l’armoire. Le panneau de sélection précède la liste et vient à l’écran après un choix, y compris en bas de la liste sur petit écran.
- Accès au contenu interdit pendant les mouvements, portes fermées et, pour les vêtements, tiroir fermé. Le cycle portes/tiroirs et les clics répétés sont contrôlés par les scripts. La navigation au clavier reste dans le dialogue ; la fermeture restitue le focus lorsque l’élément d’origine existe encore.

## Banque audio

107 mots et 333 MP3 : 16 lectures ajoutées pour huit mots et 11 lectures existantes reprises avec les références Qwen A1 déjà utilisées. Les identifiants repris sont `w_comptoir`, `e_lavabo`, `w_cafe`, `w_jus_orange`, `e_jus_orange`, `w_mb_jus`, `ow_mouchoirs`, `o_bouteille`, `e_seche_cheveux`, `num_58` et `ow_chewing_gums`.

Les exports repris conservent la parole entière et ajoutent 400 ms de silence final. Les anciens MP3, les références vocales, les prises WAV et les rapports restent dans le dossier local `production/armoire20261021/`, hors du site publié. La provenance conserve aussi les prises précédentes.

L’audit automatique des MP3 finaux reconnaît `lə kɔ̃twaʁ` pour « le comptoir » et `il i a dø lavabo` pour « Il y a deux lavabos. », avec un écart phonétique calculé nul. Dans Chrome, les deux fichiers atteignent leur fin sans erreur : respectivement 1,96 s et 2,44 s. L’indicateur « Écoute en cours » se masque à la fin.

Les analyses phonétiques et transcriptions sont automatiques, sans validation par une écoute humaine. Sur les 333 lectures, 276 ont un écart phonétique calculé nul ; les autres différences comprennent schwas, emprunts anglais et divergences de reconnaissance. Pour « café », le reconnaisseur distingue correctement le /f/ dans la prise en contexte, mais donne /s/ sur l’extrait isolé ; l’export provient bien de la première phrase de cette prise. Les essais de remplacement de « quatorze » n’ont pas été retenus. Ces contrôles ne certifient pas toute la banque sans défaut.

## Vérification

- `python3 scripts/verifier.py` : couverture des textes et voix, unicité des identifiants, empreintes et décodage des 333 MP3, ressources visuelles, 107 mots et absence de voix système de secours.
- `node scripts/verifier_armoire.mjs` : contraintes, animations, positions finales et clics répétés.
- `node scripts/verifier_contenu_armoire.mjs` : couverture du lexique et des audios, limites des zones photographiques et accès au contenu.
- Syntaxe des modules modifiés et `git diff --check` valides.
- Chrome : les vingt choix chargent leurs bons MP3 ; clics directs sur coffre, serviettes, oreillers et vêtements ; ouverture et fermeture complètes des portes et tiroirs ; Tab et Shift+Tab contenus dans le dialogue. Ces parcours avaient été vérifiés avant la pause ; la reprise vérifie la sélection réorganisée et la fin des deux lectures signalées.
- À 390 × 844 px : document de 390 px, dialogue de 366 px avec 12 px de marge ; contrôle visuel stabilisé de l’armoire ouverte. Après sélection des coussins, le panneau du mot et des trois commandes est entièrement visible, entre environ 340 et 554 px. Test de mise en page dans Chrome redimensionné, sans téléphone physique.

Le script local `production/armoire20261021/verifier_publication.py` compare après publication les SHA-256 de chaque fichier modifié depuis `61e6c42` et des 333 MP3. Chaque exécution réussie produit un rapport horodaté conservé hors du site ; il contrôle également le type MIME des sons.
