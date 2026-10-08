# Vérifications du 8 octobre 2026

- Neuf écrans et états interactifs sans erreur JavaScript : QCM, corrections, phrases à trous, six cartes, rappel, groupes de sens et quatre objections.
- Catalogue complet : 238 boutons, 238 entrées de manifeste et 238 MP3. Textes affichés et textes de synthèse concordants ; fichiers existants et empreintes SHA-256 vérifiées.
- Les quatre phrases à trous sont lues avec le mot attendu dès le premier bouton. La solution écrite reste masquée jusqu’à Vérifier.
- Tous les MP3 se décodent et sont non silencieux. Durée cumulée : 1 255,8 secondes (environ 21 minutes).
- Reconnaissance française sur les 238 lectures. Huit fichiers repris après contrôle : montant, aides et amorces. Les sept alertes restantes sont des variantes de transcription homophones ou d’écriture des nombres, détaillées dans audio/verification.json. Ce contrôle ne mesure pas le naturel de la voix et ne remplace pas une écoute humaine exhaustive.
- Chrome : lancement d’une question et d’une phrase complète à trous, passage de l’icône haut-parleur à l’arrêt ; boutons circulaires SVG affichés. Les boutons audio ne sélectionnent pas les réponses.
- Vidéo native H.264/AAC : les deux extraits principaux se lancent et s’arrêtent aux bornes prévues (1 min 49 et 17 min 05), sans erreur affichée. Le serveur local prend en charge les requêtes partielles HTTP 206. Le détail des autres modèles vidéo n’a pas été réécouté intégralement.
- Aucun enregistrement réel au micro n’a été effectué.
- Version locale non publiée ; aucun commit ni modification de la v3. Le dossier Rendez-vous déjà présent dans les modifications locales n’a pas été touché.
