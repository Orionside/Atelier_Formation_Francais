# Modèle « Impact 60 », format 45 minutes : mode d'emploi

Le cours dure 45 minutes. Il vient après 10 à 15 minutes de discussion libre avec l'apprenant.

Un atelier tient dans **deux fichiers** :

| Fichier | Rôle | À modifier ? |
|---|---|---|
| `index.html` | Le moteur : mise en page, enregistrement, mesures, lecteur du film, courbes de mélodie | **Jamais** |
| `contenu.js` | Tout ce qui dépend de la vidéo | **Oui, c'est le seul** |

## Principes d'écriture (le plus important)

L'apprenant est un adulte professionnel non francophone : **son effort doit aller à l'oral, pas au décodage des consignes.**

- Des phrases courtes, avec un verbe d'action en premier : « Écoutez », « Cliquez », « Dites ».
- Aucun terme technique : pas de « mesure à froid », de « formule » ou de « tâche », et pas d'alphabet phonétique.
- Les mots difficiles sont suivis d'une aide : « néfaste (= très mauvais) ».
- Les personnes sont désignées par leur rôle : « le sociologue » plutôt que « Rosa ».
- Chaque phrase utile est **réellement dite dans la vidéo** et jouée à l'endroit exact où elle est dite.
- **Extraits des phrases utiles** : couper dans un silence, avec une marge (jusqu'à 1 s) plutôt que de risquer un mot ou une syllabe manquante ; puis **retranscrire chaque extrait coupé** et vérifier que le texte affiché correspond exactement.
  - **Début de l'extrait : au moins 0,5 s avant le premier mot** (même si l'on entend la fin du mot précédent). Le lecteur YouTube perd environ 0,3 à 0,4 s au démarrage : un extrait qui commence pile sur le premier mot fait entendre « …dée, finalement » au lieu de « Et l'idée, finalement ». Dans le doute, aller jusqu'à 1 s.
  - Vérifier aussi l'extrait **sans ses 0,4 premières secondes** (ce que l'apprenant entend vraiment) : le premier mot doit toujours y être.
- **Mélodie** : placer les flèches ↗ ↘ d'après la mélodie **mesurée**, jamais d'après la règle du manuel : dans la parole spontanée, une question ne monte pas toujours.
- La voix de la vidéo doit être **humaine**. Faites-la vérifier à l'oreille avant de concevoir l'atelier : une voix de synthèse ne peut pas servir de modèle de prosodie.
- Les exemples « Au travail » valent pour tous les secteurs : réunions, e-mails, délais, outils, équipe, clients.

## Le cours (fixe)

| Min. | Étape (intitulé vu par l'apprenant) | Rubrique de `contenu.js` |
|---|---|---|
| 0–3 | Je parle 1 minute | `sujet`, `difficultes` |
| 3–11 | J'écoute le film | `ecoute` (2 extraits) |
| 11–20 | 6 phrases utiles | `phrases` |
| 20–26 | La mélodie du français | `prononciation` |
| 26–38 | Je m'entraîne 3 fois (1 min 30 → 1 min 15 → 1 min) | `entrainement`, `sujet.plan` |
| 38–41 | Je reparle 1 minute | `sujet`, `phrases` |
| 41–45 | Mon objectif de la semaine | `semaine`, `meta.plusLoin` |

## Les rubriques de `contenu.js`

- **`meta`** :
  - `id` : identifiant unique, qui sert de clé de sauvegarde ;
  - `titre` (repris aussi dans le titre de l'onglet), `niveau`, `duree` (45) ;
  - `support` : les mots qui désignent la source, par exemple `{"le": "la vidéo", "du": "de la vidéo", "dans": "dans la vidéo", "Le": "La vidéo"}`. Sans ce réglage, la page dit « le film » ;
  - `titreSeance` : une question simple ;
  - `objectif` : une phrase, du point de vue de l'apprenant ;
  - `video` ;
  - `plusLoin` : liens facultatifs, affichés seulement à la fin ;
  - `lien` : l'adresse publique du cours. Elle est affichée dans l'aperçu claude.ai, où le son et le micro sont bloqués.
- **`sujet`** : la situation commune à tous les secteurs.
  - `lieu`, `qui`, `dit` (la phrase entre guillemets), `vous`, `consigne` ;
  - `perso` : le champ facultatif « Mon sujet », avec `{x}` remplacé par ce que l'apprenant écrit ;
  - `plan` : 4 étapes, chacune avec sa phrase utile.
- **`difficultes`** : 4 ou 5 réponses à toucher, très concrètes.
- **`ecoute`** : 2 extraits de 40 à 90 secondes. Pour chacun :
  - `titre`, `debut`, `fin`, `pourquoi` (une phrase) ;
  - `devine` : la question posée avant d'écouter ;
  - `questions` : 2 QCM, avec `bonne` compté à partir de 0 ;
  - `trous` : avec une `aide` ;
  - `difficile` : un passage à réécouter, avec `debut`, `fin` et une explication simple.
- **`phrases`** : 6 phrases utiles. Chacune contient :
  - `sert` : à quoi elle sert ;
  - `forme` : la phrase à retenir ;
  - `film` : la phrase exacte du film, avec la phrase utile en `<strong>`, `t` approximatif, puis `debut`, `fin`, `contour` et `etendue` calculés par l'outil ;
  - `exemple` : une phrase générique « Au travail » ;
  - `detect` : les motifs utilisés par le script de mesure.
- **`prononciation`** : une seule cible.
  - `intro`, `regle`, `attention` ;
  - `perception` : syllabes à cliquer. `·` sépare les syllabes, `*` marque la bonne réponse, et `debut`/`fin` indiquent la phrase à écouter ;
  - `legende` ;
  - `modeles` : les phrases du film à répéter ;
  - `etapes`.
- **`entrainement`** : `preparation`, les 3 `essais` (`duree`, `consigne`, `ajout`), les `objections` et, si besoin, `boutonObjection` (le texte du bouton, par exemple « Question du collègue (pour le formateur) »).
- **`semaine`**, **`voix`**, **`formateur`**.

### Signes de prosodie dans les `modeles`

| Écrire | Affichage | Sens |
|---|---|---|
| `<strong>cret</strong>` | syllabe soulignée | syllabe plus longue |
| `↗` `↘` | flèches | la voix monte, puis descend |
| `\|` | trait gris | fin d'un groupe de mots |
| `‿` | lien gris | on enchaîne sans pause (« prenons‿un ») |
| `[z]` `[n]` `[t]` | lien bleu avec la lettre | on ajoute ce son (« les[z]autres », « un[n]exemple », « c'est[t]une ») |

## Les voix

1. **Le film** : les phrases sont jouées dans le lecteur YouTube officiel, calées au centième de seconde, avec le mode « En boucle ». Le bouton « Un peu plus lent » (0,9×) n'apparaît que si YouTube propose cette vitesse. On ne descend jamais plus bas : la voix deviendrait artificielle.
2. **Votre voix** pour les exemples « Au travail » : `audio/formateur/p1.mp3` à `p6.mp3`.
3. En attendant, **une voix de synthèse de qualité** : `audio/neuronal/p1.mp3` à `p6.mp3`.

Sans fichier, aucun bouton ne s'affiche. On ajoute des voix **sans rien modifier d'autre**.

## Les outils (dossier `~/impact60_mesure`)

| Commande | Ce qu'elle fait |
|---|---|
| `uv run voix_atelier.py caler --atelier <dossier>` | Retrouve chaque phrase du film à partir de `t`, puis écrit `debut`, `fin`, `contour` et `etendue` |
| `uv run voix_atelier.py liste --atelier <dossier>` | Écrit la liste des phrases à enregistrer |
| `uv run voix_atelier.py formateur --atelier <dossier> lecture.m4a` | Découpe une seule lecture de la liste en fichiers `p1.mp3` à `p6.mp3` |
| `uv run voix_atelier.py azure --atelier <dossier>` | Génère les voix Azure (clé dans `~/impact60_mesure/.env`) |
| `uv run mesure_oral.py prise.m4a --contenu <dossier>/contenu.js` | Mesure complète d'une prise de parole |

## Vérifier avant de publier

```
node -e 'const s=require("fs").readFileSync("contenu.js","utf8");const m=s.match(/^window\.IMPACT60\s*=\s*/m);JSON.parse(s.slice(m.index+m[0].length).trim().replace(/;\s*$/,""));console.log("contenu.js : OK")'
```
Ouvrez ensuite `index.html`, puis parcourez les 7 étapes en écoutant chaque phrase du film.
