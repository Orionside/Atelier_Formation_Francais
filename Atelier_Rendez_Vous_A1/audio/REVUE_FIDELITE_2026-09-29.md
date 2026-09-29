# Revue texte–audio · Rendez-vous A1 · 29 septembre 2026

## Résultat vérifiable

- 208 entrées du catalogue examinées (116 pédagogiques, 92 repères facultatifs).
- L'audit initial trouvait 46 différences littérales entre `display_text` et `tts_text`, dont plusieurs paraphrases ou omissions réelles ; 23 MP3 ont été régénérés avec la voix de référence locale.
- Le nouveau contrôle `node scripts/verifier-fidelite-texte.mjs` trouve **0 divergence lexicale sur 208** après neutralisation de la typographie muette, des nombres écrits en chiffres et des variantes orthographiques de genre homophones.
- L'inspection des neuf écrans interactifs ne trouve plus de divergence entre le texte adjacent au bouton et son intitulé audio. Les quatre phrases à trous sont l'exception de présentation : le champ `…` matérialise le mot volontairement absent.
- Après « Vérifier », la phrase complète est maintenant affichée à côté de son audio, même lorsque la réponse saisie était correcte. Avant cela, ni le texte ni le bouton de cette correction ne sont visibles.
- `qa-transcription.json` contient une transcription de contrôle pour les 208 MP3. Les écarts signalés par Whisper restent des **alertes**, pas des preuves d'une erreur de prononciation.

## Corrections de contenu et d'interface

| Zone | Rectification |
|---|---|
| Présentation et situation | La durée, « dit : » et la question facultative correspondent désormais aux mots lus. |
| Extraits vidéo | « Pourquoi cet extrait ? » est lu avec l'explication visible. |
| Aides des textes à trous | L'audio dit aussi « Aide : » et la glose espagnole affichée ; il ne prononce pas le mot manquant. |
| Correction des trous | Phrase entière affichée puis lue, seulement après vérification. |
| Explication « Carte ou espèces ? » | Les définitions visibles et audibles utilisent les mêmes mots ; l'affichage ne coupe plus la phrase au milieu. |
| Mélodie | L'explication affichée et la version orale ont les mêmes mots ; les flèches ↗ ↘ restent des repères visuels non prononcés. |
| Repères facultatifs | Fin des paraphrases dans les titres et boutons ; les durées écrites en chiffres sont dites naturellement en lettres. |

## Vérification des alertes de transcription

La première transcription (Whisper large-v3-turbo) marque encore 14 clips en priorité haute. La plupart sont des faux positifs phonétiques : `ils/il`, `paient/paie`, `notes/note`, `sept/cette`, `déroulé/déroulez`, ou des chiffres transcrits en chiffres. Une deuxième transcription indépendante (Whisper large-v3) a confirmé notamment que `ui-extrait-2` contient bien « Au café », que `ui-avant-pendant` dit « Pendant cette minute », et que `essai-2-ajout` se termine sans « Merci » ajouté. Les glosses espagnoles sont parfois retranscrites en français approximatif ; elles demandent une écoute humaine.

## Validation orale encore nécessaire

Une transcription ne permet pas de certifier l'accent natif, la liaison, le rythme, les pauses ou l'intonation interrogative. Tous les clips restent donc marqués `non_valide_a_l_ecoute` dans le manifeste. Avant une séance avec apprenant, faire écouter par un francophone les six modèles professionnels, les questions, les quatre textes à trous et leurs corrections, puis les consignes longues et les aides bilingues. Comparer aussi le timbre, le débit et la courbe intonative à la voix de référence sur un casque et un téléphone. Si un clip échoue, le régénérer avec `--all --force-id <identifiant>`, vérifier sa transcription, puis retenir ou rejeter **à l'oreille** la nouvelle prise.
