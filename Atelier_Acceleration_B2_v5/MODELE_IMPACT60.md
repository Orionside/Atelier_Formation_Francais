# Modèle « Séance Impact 60 » : mode d'emploi

Un atelier Impact 60 tient dans **deux fichiers** :

| Fichier | Rôle | À modifier ? |
|---|---|---|
| `index.html` | Le moteur : mise en page, enregistreur, mesure, minuteurs, export | **Jamais** |
| `contenu.js` | Tout ce qui dépend de la vidéo et des apprenants | **Oui, et c'est le seul fichier** |

## Créer un nouvel atelier en 5 étapes

1. Copier le dossier `Atelier_Acceleration_B2_v3` sous un nouveau nom, par exemple `Atelier_Teletravail_B2`.
2. Dans `contenu.js`, changer `meta.id` (identifiant unique, sans espace). C'est la clé de sauvegarde dans le navigateur de l'apprenant : deux ateliers ne doivent jamais avoir le même `id`.
3. Remplir les rubriques décrites ci-dessous.
4. Vérifier que le fichier est du JSON strict (voir « Vérifier »).
5. Publier le dossier sur le dépôt, sans toucher aux autres dossiers.

Pour aller plus vite, on peut demander à Claude de rédiger le `contenu.js` à partir de la vidéo et de ce mode d'emploi. Il faudra ensuite relire les minutages à l'oreille.

## Le cycle de séance (fixe)

| Min. | Étape | Rubrique de `contenu.js` utilisée |
|---|---|---|
| 0–5 | Mesure à froid (90 s enregistrées) | `situations` |
| 5–15 | Écoute ciblée (2 extraits) | `ecoute` |
| 15–25 | Formules (6 + 2 d'interaction) | `formules`, `interaction` |
| 25–33 | Prononciation (1 cible) | `prononciation` |
| 33–50 | Tâche en 3 tours (2 min → 1 min 30 → 1 min) | `tache`, `situations` |
| 50–56 | Mesure finale et comparaison | `situations`, `formules` |
| 56–60 | Engagement et semaine | `semaine`, `seance2` |
| hors séance | Espace formateur | `formateur`, `seance2` |

## Les rubriques de `contenu.js`

**`meta`** : `id`, `titre`, `niveau`, `video` (`url`, `titre`, `duree`), `objectif` (une phrase observable : « À la fin de la séance, vous… »), `reserve` (facultatif : un lien vers un atelier plus complet).

**`profils`** : la liste des métiers (`id`, `label`). Chaque `id` doit ensuite apparaître dans `situations`, dans les `exemples` de chaque formule et dans `tache.interruptions`.

**`situations`** : une situation professionnelle par profil (`titre`, `contexte`, `consigne`). Elle sert à la fois à la mesure et à la tâche. Il faut une vraie décision à défendre, avec un « gain » annoncé et un risque.

**`ecoute`** : deux extraits de 40 à 90 secondes, pas plus. Chaque extrait comporte :
- `debut` et `fin`, en secondes (5:55 → 355) ;
- `pourquoi` : son lien avec la tâche ;
- `predire` : la question posée avant l'écoute ;
- `questions` : 2 QCM (`options`, `bonne` = numéro de la bonne réponse **en partant de 0**, `explication`). Variez la position de la bonne réponse ;
- `trous` : 3 mots à compléter (`avant`, `apres`, `reponses` sans accents ni majuscules, `solution`) ;
- `astuce` : l'endroit précis où l'on décroche à l'oral, et pourquoi.

**`formules`** : 6 au maximum. Chaque formule a une `forme`, une `fonction`, un passage du `film` (`texte`, `t` en secondes), des `exemples` par profil et des motifs `detect`. Ces motifs servent au script de mesure : ils sont écrits en minuscules sans accents ni apostrophes (« c'est » → `c est`), et `…` signifie « quelques mots entre les deux ».

**`interaction`** : 2 formules pour la réunion (concéder, reformuler, interrompre…). Même structure, sans `film`.

**`prononciation`** : **une seule** cible par séance.
- `cible`, `pourquoi`, `regle` (liste) ;
- `quiz` : perception, même format que les QCM ;
- `modeles` : phrases tirées du film, avec `texte` marqué (syllabe allongée en `<strong>`, ↗ ↘ pour la mélodie, `|` entre les groupes, `‿` pour les liaisons et enchaînements), `tts` (le texte brut pour la voix de synthèse) et `t` ;
- `protocole` (étapes du shadowing) et `autocontrole` (cases à cocher).

**`tache`** : `preparation` (en secondes) et 3 `tours`. Chaque tour a une `duree`, une `consigne` et un `apport` : ce qu'on ajoute avant le tour suivant, une seule chose à la fois. S'y ajoutent `interruptions`, 3 objections par profil lues par le formateur au tour 2.

**`semaine`** : 4 ou 5 tâches de 10 minutes, de J+1 à J+5.

**`seance2`** : `principe`, `cible` (la cible de prononciation suivante), une nouvelle situation par profil (`situations`, le test de transfert) et le `deroule`.

**`formateur`** : `deroule` (minuté), `feedback`, `mesure`, `transcription` (erreurs de la transcription automatique et nature de la vidéo) et `changements`.

## Règles d'écriture (pour que tout fonctionne)

- Tout ce qui suit `window.IMPACT60 =` doit être du **JSON strict** : guillemets doubles droits `"…"`, aucune virgule après le dernier élément d'une liste, aucun commentaire à l'intérieur.
- Dans les textes, seules `<strong>` et `<em>` sont prévues.
- Guillemets français « … » et apostrophes typographiques : oui, dans les textes. Dans les motifs `detect` : non.

## Vérifier avant de publier

Dans le Terminal, depuis le dossier de l'atelier :

```
node -e 'const s=require("fs").readFileSync("contenu.js","utf8");const m=s.match(/^window\.IMPACT60\s*=\s*/m);JSON.parse(s.slice(m.index+m[0].length).trim().replace(/;\s*$/,""));console.log("contenu.js : OK")'
```

Ouvrez ensuite `index.html` dans le navigateur et parcourez les étapes avec chacun des profils.

## Les voix : jamais de voix de synthèse du navigateur

La voix de synthèse intégrée aux navigateurs est trop robotique pour servir de modèle de prosodie. Un atelier Impact 60 utilise trois sources de voix, de la plus authentique à la plus pratique :

1. **Les voix humaines de la vidéo.** Chaque phrase citée (`formules[].film`, `prononciation.modeles[]`) est jouée dans le lecteur YouTube officiel, calée au centième de seconde grâce à `debut` et `fin`. L'apprenant peut la jouer en boucle, ou à 0,75× sans que la hauteur de la voix change. Aucun extrait n'est copié : c'est le lecteur de la plateforme qui joue la vidéo, si la chaîne autorise l'intégration (à vérifier pour chaque vidéo).
2. **La voix du formateur**, pour les exemples « métier ». Déposez les fichiers dans `audio/formateur/`.
3. **Une voix neuronale** en attendant, dans `audio/neuronal/`. Seule Microsoft Azure « Rémy (multilingue) » a atteint, dans nos mesures, une mélodie de niveau humain.

Nom des fichiers : `<formule>-<profil>.mp3`, par exemple `f1-juriste.mp3` ou `i2-clinique.mp3`. La page cherche d'abord la voix du formateur, puis la voix neuronale. Sans fichier, aucun bouton ne s'affiche. On ajoute donc des voix **sans rien modifier d'autre**.

### Les courbes de mélodie

Pour chaque phrase modèle, la page affiche la courbe de mélodie de la voix du film (champs `contour` et `etendue`). L'apprenant enregistre la même phrase et voit sa propre courbe superposée à celle du modèle. Le calcul est exactement le même dans la page et dans les scripts (algorithme YIN, validé contre Praat).

### L'outil `voix_atelier.py` (dossier `~/impact60_mesure`)

| Commande | Ce qu'elle fait |
|---|---|
| `uv run voix_atelier.py caler --atelier <dossier>` | Pour une nouvelle vidéo : retrouve chaque phrase citée à partir de son minutage approximatif `t`, puis écrit `debut`, `fin`, `contour` et `etendue` dans `contenu.js` |
| `uv run voix_atelier.py liste --atelier <dossier>` | Écrit la liste des phrases à enregistrer (`phrases_a_enregistrer.md`) |
| `uv run voix_atelier.py formateur --atelier <dossier> lecture.m4a` | Découpe **une seule lecture** de la liste en fichiers propres : silences coupés, volume normalisé. En cas d'erreur, il suffit de redire la phrase : la dernière bonne lecture est gardée |
| `uv run voix_atelier.py azure --atelier <dossier>` | Génère les voix neuronales Azure (clé dans `~/impact60_mesure/.env`) |

## Mesurer une prise de parole

La page mesure dans le navigateur les pauses, le temps de parole et la longueur des segments continus. Pour la mesure complète (débit en syllabes, pauses **au milieu** des phrases, « euh », formules employées), utilisez le script `mesure_oral.py` du formateur avec l'enregistrement exporté par l'apprenant :

```
uv run mesure_oral.py prise_T1.m4a --apprenant "Prénom" --etiquette S1-T1 --contenu contenu.js
```

Les deux outils utilisent la même méthode : trames de 10 ms, seuil adaptatif, pause = silence de 0,25 s ou plus. Leurs chiffres de pauses sont donc identiques.
