# GLP-1 · comprendre et converser

Trois séances de 45 minutes, niveau B2 avec aides B1+. Source : « Médicaments GLP1.txt » des téléchargements et reportage franceinfo TI9-BQ5Utg8. Les autres supports sont conservés.

Ouvrir `index.html` avec ses dossiers voisins, ou lancer :

```sh
python3 scripts/servir.py --port 8770
```

Puis ouvrir <http://127.0.0.1:8770/>. Les liens de l’accueil choisissent une séance. Chaque séance garde ses réponses et son parcours séparément dans le navigateur.

Le cycle commun : première production, écoute sans texte ajouté, reformulation, cartes et rappel, groupes de sens, trois reprises avec relances, nouvelle écoute et conversation sur un autre sujet, réemploi dans la semaine. La priorité est de comprendre et d’échanger ; les questions supplémentaires restent facultatives.

Le lecteur utilise `video/glp1.mp4` (H.264/AAC), conserve les bornes, les boucles et la vitesse 0,9. Le mode **Audio seul** est actif par défaut : il masque les images et les textes incrustés. Désactiver ce bouton pour voir les images.

Les boutons circulaires avec haut-parleur lancent les lectures guidées ; ils deviennent des boutons d’arrêt pendant la lecture. Les questions, options, réponses, modèles, consignes et textes de formateur sont sonorisés. Les phrases à trous sont lues entièrement, avec le mot attendu, dès le premier bouton. L’écrit reste masqué jusqu’à la vérification.

Les voix du reportage sont authentiques ; les lectures et dialogues ajoutés utilisent Qwen3-TTS et la voix française féminine de référence 2. Les textes de transfert sont pédagogiques, créés pour ce cours. Pratiquer les échanges avec un partenaire humain dès que possible. Les mesures acoustiques automatiques du moteur ne sont pas utilisées pour noter la fluidité.

Les enregistrements personnels restent dans la session et peuvent être téléchargés. Les textes libres de l’apprenant n’ont pas de fichier de synthèse prédéfini.

```sh
node scripts/construire-catalogue.cjs
~/impact60_mesure/.venv-qwen3tts/bin/python scripts/generer-audios.py --seed 47
node scripts/verifier-parcours.cjs --complet
~/impact60_mesure/.venv-qwen3tts/bin/python scripts/generer-audios.py --verify
```

Ces scripts utilisent les environnements locaux du formateur. Le catalogue, le manifeste et leurs versions JavaScript permettent l’ouverture directe de la page. Les SHA-256, durées et contrôles de transcription sont enregistrés dans `audio/verification.json`.

L’analyse de la source et la carte des compétences sont dans `ANALYSE_PEDAGOGIQUE.md`. Les vérifications et limites sont dans `VALIDATION.md`.

Version préparée le 8 octobre 2026 : 454 lectures audio.

Version 3 (9 octobre 2026) : même contenu et mêmes 454 lectures audio que la version 2. Seule la présentation change : étapes longues découpées en sous-étapes, cartes de phrases ouvertes une à la fois, bouton d’écoute toujours à gauche du texte lu. La version 2 reste publiée dans `Atelier_GLP1_Oral_B2_v2`. Un essai en séance réelle (micro, film, MP3) reste à faire.

[Ouvrir le parcours](https://orionside.github.io/Atelier_Formation_Francais/Atelier_GLP1_Oral_B2_v3/) · [Séance 1](https://orionside.github.io/Atelier_Formation_Francais/Atelier_GLP1_Oral_B2_v3/?seance=1) · [Séance 2](https://orionside.github.io/Atelier_Formation_Francais/Atelier_GLP1_Oral_B2_v3/?seance=2) · [Séance 3](https://orionside.github.io/Atelier_Formation_Francais/Atelier_GLP1_Oral_B2_v3/?seance=3)
