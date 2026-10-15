# Bon séjour ! — atelier oral A1

Support autonome de révision **après une classe d’une heure**, basé sur les deux captures Desktop du 14/10/2026. Lisez `ANALYSE_PEDAGOGIQUE.md` pour l’analyse et `guide.html` pour la classe.

## État de cette livraison

**Audio intégré : 288 identifiants, issus de 248 lectures distinctes.** Les deux références explicitement fournies ont été clonées avec Qwen3-TTS 1.7B Base (MLX, local) :

- Féminine : `prtap1_sbk_48.mp3`, passage de 36,22 à 43,75 secondes.
- Masculine : `defi_act_2_sbk_80.mp3`, passage de 32,51 à 39,56 secondes.

Clonage par empreinte vocale et, pour certaines reprises retenues, par contexte transcrit. Les empreintes SHA-256 des sources et références, les prises choisies et leurs contrôles sont dans `audio/provenance.json`. Les extraits de référence et les WAV de travail restent dans le dossier de production local, sans figurer dans la livraison.

Les textes ont été contrôlés avec Whisper, avec contrôle renforcé des négations et de « en supplément ». Les fichiers ont été normalisés en volume puis contrôlés après export. La comparaison acoustique WavLM confirme la séparation des références ; elle ne remplace pas une appréciation humaine du naturel et du timbre. Aucun enregistrement n’est présenté comme un audio original du manuel.

L’enregistrement au micro, facultatif, permet déjà de se réécouter. Il fonctionne sur localhost ou HTTPS, selon les permissions du navigateur. La voix reste temporaire dans la page et n’est jamais envoyée. La progression et les choix de compréhension sont enregistrés dans le navigateur, sans fichier vocal. En mode privé ou stockage bloqué, téléchargez le bilan.

## Utilisation

Ouvrir `index.html` pour les activités textuelles. Pour le micro, lancer depuis ce dossier :

```sh
python3 -m http.server 8767 --bind 127.0.0.1
```

Ouvrir `http://127.0.0.1:8767/`. Une page statique dans un dossier du dépôt, comme les autres ateliers. Pas de dépendance web, de clé API ni de connexion à un service pour l’apprenant. Les dessins sont des SVG originaux.

## Parcours

Accueil + 8 étapes : hôtel ; objets ; phrases et nombres ; questions ; liaisons ; compréhension ; réception ; mission personnelle. Une carte à la fois, modèle caché, début de phrase facultatif, changement d’information après chaque essai. Trois scénarios et deux rôles. Carnet et export texte des choix/autoévaluations. Aucun score automatique de prononciation.

Premier passage : choisir environ trois cartes par étape. Répartir sur trois séances d’environ dix minutes. La banque complète peut être parcourue plus lentement selon les besoins.

## Maintenance du catalogue audio

`audio/plan.json` contient la liste complète des textes avec identifiant, voix attendue et distinction question/énoncé. Les modèles, mots isolés et négations sont prévus dans les deux voix. Les répliques sont conservées séparément pour les écoutes et les jeux de rôle. La liste se régénère avec :

```sh
node scripts/preparer-audios.mjs
```

Pour une nouvelle production avec ces références, créer un catalogue :

```json
{
  "references_confirmees": true,
  "voices": {
    "f": {"label": "Référence féminine confirmée", "reference_sha256": "empreinte SHA-256 du fichier de référence"},
    "m": {"label": "Référence masculine confirmée", "reference_sha256": "empreinte SHA-256 du fichier de référence"}
  },
  "clips": {
    "hotel-piscine-model-f": {"file": "sons/hotel-piscine-model-f.mp3"}
  }
}
```

Cet exemple est incomplet : le catalogue réel doit contenir tous les identifiants. Installer avec `python3 scripts/installer-audios.py /chemin/catalogue.json`. Il faut `ffprobe` pour vérifier les durées. L’installation ne rend le manifeste actif qu’après contrôle de la présence de tous les fichiers. Écouter les noms propres, quatorze/vingt et un/quatre-vingt-un, les liaisons, les négations et les questions avant de diffuser.

## Fidélité aux documents

Caribeach et ses informations visibles servent de rappel. Les services non attestés ne sont pas supposés présents ou absents. Le dialogue Martin, ses réponses et les autres scénarios sont explicitement inventés pour l’atelier. Le tarif 154 € reste un prix par nuit du document, pas un tarif actuel. Les pistes du manuel ne sont ni reproduites ni corrigées à partir des seules cases visibles.

## Diffusion GitHub Pages

Atelier apprenant : https://orionside.github.io/Atelier_Formation_Francais/Atelier_Bon_Sejour_A1/

Guide du formateur et aperçu des deux voix : https://orionside.github.io/Atelier_Formation_Francais/Atelier_Bon_Sejour_A1/guide.html

Le dossier autonome est référencé dans le catalogue `README.md` du dépôt `Orionside/Atelier_Formation_Francais`. La configuration existante publie la racine de la branche `main` sur GitHub Pages, en HTTPS. Le navigateur demande l’autorisation du micro uniquement lorsque l’apprenant choisit de s’enregistrer.
