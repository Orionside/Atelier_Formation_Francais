# Audio préparé pour « Livre ou liseuse ? » (B2–C1)

Les 214 entrées de `catalogue-qwen3tts.json` sont des unités d'écoute courtes. Les textes des consignes, questions, options, explications, aides, phrases à compléter, corrections, amorces, exemples et repères d'interface sont associés à un identifiant stable. Les textes écrits par l'apprenant ne sont pas synthétisés à l'avance.

Les passages ARTE et les cinq phrases liées aux courbes de mélodie restent lus dans la vidéo d'origine. Les remplacer par Qwen3-TTS rendrait les courbes incohérentes. Le mode « Vérifier sans regarder » masque également les boutons des phrases non encore révélées ; les explications de QCM, les solutions des trous et la réaction de la collègue ne s'activent qu'après l'action correspondante.

Le générateur local utilise le modèle Qwen3-TTS Base 1,7 B quantifié pour MLX, avec la référence vocale française du dossier `/Users/toufik/impact60_mesure/models/qwen3-tts/`. La référence n'est pas publiée. Le texte et sa ponctuation portent l'acte de parole : interrogation, affirmation, consigne, objection ou amorce suspendue. Les pourcentages et les ordinaux sont écrits en toutes lettres dans le texte oral afin d'éviter une lecture ambiguë, sans changer le sens du texte affiché.

Depuis ce dossier, sur ce Mac :

```sh
node scripts/construire-catalogue.mjs
node scripts/verifier-fidelite-texte.mjs
/Users/toufik/impact60_mesure/.venv-qwen3tts/bin/python scripts/generer-qwen3tts.py --all
/Users/toufik/impact60_mesure/.venv-qwen3tts/bin/python scripts/generer-qwen3tts.py --check
/Users/toufik/.hermes/workspaces/default/.venv-transcription/bin/python scripts/verifier-qwen3tts.py
node scripts/verifier-integration-audio.mjs
```

Le générateur reprend les fichiers valides si leur empreinte de texte, rôle, modèle et référence n'a pas changé. Chaque MP3 et sa transcription de contrôle sont tracés dans `audio/qwen3-tts/`. Le site vérifie le manifeste et utilise l'empreinte du fichier dans son URL pour éviter un vieux MP3 en cache. Une erreur de transcription est un signal de réécoute, non une mesure de prosodie. Le manifeste marque tous les clips `non_valide_a_l_ecoute` tant qu'une personne francophone n'a pas vérifié à l'oreille les mots, pauses, intonations et liaisons.

Avant une séance, écouter en priorité les six amorces et exemples professionnels, les quatre textes à trous et corrections, les valeurs « 1 %, 40 %, 99 % », « première » et « troisième », puis les explications longues. Vérifier que le registre familier cité de la vidéo (« c'est pas ouf », « faire péter ») reste intelligible et que les amorces ne sont pas terminées par une intonation de phrase achevée.
