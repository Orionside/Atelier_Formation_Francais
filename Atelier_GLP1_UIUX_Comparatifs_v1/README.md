# GLP-1 : essais UI/UX et pratique orale B2

Ouvrir `index.html` via un serveur HTTP servi depuis le dossier parent. B = Focus, C = Boucle orale ; A est le support GLP-1 v2 existant. Les médias de A sont réutilisés par chemins relatifs : conserver les deux dossiers côte à côte.

- `RAPPORT_ANALYSE.html` : analyse critique, sources, approche et priorités.
- `PROTOCOLE_COMPARATIF.html` : essais humains et transfert différé à réaliser.
- `RESULTATS_TECHNIQUES.html` : observations techniques et limites.
- `evaluation.html` : export local d’observations personnalisées, sans télémétrie.

Le dossier contient 68 lectures supplémentaires Qwen3-TTS ; les 454 lectures du support source sont réutilisées. Le manifeste décrit les textes et empreintes. La transcription automatique vérifie approximativement le contenu, pas la qualité phonétique pour l’élève.

Construction : `python3 scripts/construire-pages.py`, puis `node scripts/construire-audios.cjs`. La génération audio utilise l’environnement Qwen local et les références du projet. Contrôle : `node scripts/verifier-essais.cjs --complet` (JSDOM installé dans le dossier de tests du projet). Les fichiers HTML sont livrés déjà construits.

Serveur avec prise en charge des plages de médias : `python3 scripts/servir.py --port 8772`. URL : `/Atelier_GLP1_UIUX_Comparatifs_v1/`.

Les progressions des essais sont isolées de celles du support v2. Le micro reste soumis au choix de l’utilisateur. Pas de score de prononciation automatique ni d’affirmation de gain d’apprentissage sans observation humaine.
