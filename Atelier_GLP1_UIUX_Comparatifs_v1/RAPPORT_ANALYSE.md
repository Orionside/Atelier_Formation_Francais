# GLP-1 B2 : concevoir une interface qui soutient la parole

Analyse du document « Conception et Optimisation de l’Expérience Utilisateur pour l’Apprentissage Linguistique : Intégration Front-End et Ergonomie Cognitive », et essais réalisés le 8 octobre 2026. Public : adulte B2 travaillant dans la banque, souhaitant converser avec des francophones. Le thème médical fournit une matière de discussion ; les activités ne constituent pas un conseil thérapeutique.

## Décision proposée

Adopter **Focus** comme base d’interface : une activité centrale, l’audio près de la question, des aides disponibles à la demande et un plan replié. Tester ensuite **Boucle orale**, qui transforme neuf formulations du reportage en exercices de compréhension du sens, perception du rythme, reprise, reformulation et interaction. Garder le support initial comme référence. Les deux essais sont indépendants et conservent les trois séances.

L’objectif est de libérer l’attention occupée à chercher une commande pour la consacrer à écouter, construire un message et répondre. Il faut préserver l’effort utile : rappeler une expression sans la voir, choisir une relation logique, formuler une idée personnelle et gérer un échange. Une interface agréable peut aussi rendre l’élève passif si elle lui montre immédiatement toutes les réponses.

## Lecture critique du document fourni

Le document rassemble des idées pertinentes : autonomie de l’adulte, segmentation, signalisation, proximité des informations, dévoilement progressif, accessibilité et évaluation. Sa faiblesse est de présenter plusieurs recommandations comme des seuils scientifiques universels, sans bibliographie permettant de vérifier les études, leurs populations ou leurs conditions. Il mélange parfois contraintes d’accessibilité, choix éditoriaux, hypothèses pédagogiques et mesures subjectives.

### 1. Charge cognitive : conserver l’objectif, corriger l’interprétation

La mémoire de travail est limitée, mais « quatre éléments » ne signifie pas quatre boutons autorisés par écran. Le regroupement en unités familières, la connaissance du sujet et la nature de la tâche changent ce qui constitue un élément. Les durées de rétention évoquées ne permettent pas de déduire une durée optimale fixe pour chaque exercice. Voir [Cowan, étude théorique et empirique](https://memory.psych.missouri.edu/assets/doc/articles/2001/cowan-bbs-2001.pdf).

Le document utilise les trois charges intrinsèque, extrinsèque et pertinente. La théorie a évolué : les travaux récents discutent une distinction à deux composantes et la mobilisation des ressources pour apprendre. L’application utile ici reste de réduire les difficultés évitables de présentation, sans supprimer le travail sur le sens. Voir [Sweller et collègues, bilan de la théorie](https://link.springer.com/article/10.1007/s11423-019-09701-3).

Conséquence : ne pas simplifier toutes les phrases au point de perdre le niveau B2. Simplifier le chemin pour les travailler. Un changement de thème, une correction et une nouvelle consigne présentés simultanément risquent de détourner l’attention ; une seule cible de correction est un meilleur point de départ à tester.

### 2. Audio et texte : une aide graduée, pas une interdiction

L’interdiction générale de montrer du texte pendant l’audio serait mal adaptée à une langue seconde. Le texte peut aider à repérer les frontières des mots et à associer forme sonore et forme écrite. Une étude sur le sous-titrage montre des bénéfices dans des conditions précises ; elle ne justifie pas de sous-titrer chaque tâche ni de promettre un résultat identique à tous. Voir [Winke, Gass et Sydorenko, 2010](https://www.lltjournal.org/item/10125-44203/).

Choix : première écoute sans transcription affichée ; une deuxième écoute avec révélation volontaire ; une reprise avec groupes de sens ; puis une production sans modèle visible. L’aide doit être disponible sans devenir obligatoire. Pour une consigne longue, le texte stable reste utile ; lire automatiquement toutes les consignes ajouterait du bruit et interromprait la pratique.

### 3. Lexique et lisibilité : sélectionner selon le sens

Les taux de glosses de 3 % ou 5 % ne sont pas des règles opérationnelles démontrées pour cet apprenant. Retenir les mots qui bloquent le message ou les collocations à réemployer est plus pertinent qu’atteindre un pourcentage. Une explication brève en français accessible convient au B2 ; une traduction peut être proposée si la langue de référence est connue.

Les indices Flesch mesurent certains aspects de lisibilité écrite. Ils ne certifient ni le niveau CECR, ni la compréhension d’un débit naturel, ni la maîtrise des implicites. Une phrase courte contenant « en revanche » peut rester difficile si l’apprenant confond opposition et conséquence. La vérification doit porter sur la relation entre les idées, la négation, la temporalité et la modalité.

### 4. Typographie et accessibilité : des contraintes distinctes

Police familière, corps de 18 px, largeur de lecture proche de 65 caractères et commandes de 44 px sont les choix de ce prototype, pas des garanties scientifiques de mémorisation. Une police dite spécialisée ne constitue pas à elle seule un traitement des difficultés de lecture. La tolérance aux préférences de l’utilisateur compte davantage qu’un nom de police.

La [norme WCAG 2.2](https://www.w3.org/TR/WCAG22/) distingue notamment contraste, agrandissement, redistribution du contenu et taille des cibles. Le critère AA 2.5.8 vise généralement 24 pixels CSS avec des exceptions ; 44 pixels est ici un objectif de confort, pas une description de ce minimum AA. Le critère d’espacement exige que le contenu résiste à des modifications définies par l’utilisateur ; il n’impose pas simplement à l’auteur une interligne de 1,5. Voir [taille minimale des cibles](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

Concrètement : boutons natifs, noms accessibles, focus visible, réponses non signalées par la seule couleur, lecture lancée volontairement, absence de lecteur flottant devant la question, prise en compte de la réduction des animations. Une déclaration complète de conformité exigerait un audit plus large que ces essais.

### 5. SUS et NASA-TLX : ne pas leur faire dire la cause

Le SUS produit un score composite d’utilisabilité de 0 à 100 ; ce n’est pas un pourcentage de réussite ni, directement, un percentile. Un score élevé ne prouve pas que l’effort d’interface est minimal. Les comparaisons dépendent du contexte et des références utilisées. Voir [Brooke, instrument original](https://hci-studies.org/methods-and-measures/downloads/SUS_Brooke1996.pdf).

Le NASA-TLX évalue une charge de travail ressentie selon six dimensions. Il ne sépare pas automatiquement la charge du contenu de celle de l’interface. Une combinaison SUS élevé/TLX élevé ne permet donc pas de conclure que seule la matière est responsable. Voir [NASA, présentation officielle de l’instrument](https://www.nasa.gov/human-systems-integration-division/nasa-task-load-index-tlx/).

Le nombre de participants proposé dans le document ne garantit pas à lui seul une significativité. Avec un seul apprenant, on peut observer des difficultés et améliorer le support ; on ne peut pas généraliser un effet causal à tous les adultes B2.

### 6. Front-end : choisir l’outil après le problème

MkDocs, Markdown et les composants web peuvent servir une architecture documentaire. Leur adoption n’améliore pas, à elle seule, l’apprentissage oral. Une migration technique ajouterait ici du coût sans résoudre la concurrence entre commandes, aides et activité. Les essais restent statiques, réutilisent les médias existants et isolent les modifications dans une extension et une feuille de style. Aucun service de reconnaissance vocale ne reçoit les productions de l’apprenant.

## Ce que l’apprenant doit réellement entraîner

Les capacités visées doivent être observables : identifier l’idée centrale ; repérer négation et modalité ; reconnaître les groupes de sens ; anticiper sans inventer ; rappeler une formulation ; choisir une collocation adaptée ; produire un message intelligible ; reformuler ; prendre ou rendre le tour ; demander une précision ; vérifier qu’on a compris.

Une expression « native » ne se réduit pas à imiter une mélodie. Elle associe une intention, une situation, un registre et une combinaison de mots habituelle. « En revanche » marque une opposition, « au-delà de » dépasse une limite, « pourrait » garde une incertitude. Les substituer mécaniquement par des mots proches peut changer le sens. Le [CECR, volume complémentaire](https://rm.coe.int/16809ea0d4) permet de cadrer l’interaction, la fluidité et la maîtrise phonologique sans exiger l’effacement de tout accent.

## Approche pédagogique retenue

### Comprendre → entendre → reprendre → formuler → converser

**Comprendre.** Écouter une phrase, expliquer son intention avec ses propres mots, puis vérifier une distinction de sens. Les réponses restent cachées pendant la tentative. L’exercice demande pourquoi le locuteur choisit cette formulation, pas seulement quel mot il a prononcé.

**Entendre.** Réécouter l’extrait authentique. Révéler au besoin le texte et les groupes de sens. Repérer une cible : mise en relief, fin de groupe, contraste ou mouvement interrogatif. Le modèle de synthèse est identifié comme tel et sert de répétition stable ; il ne remplace pas toutes les caractéristiques de la voix du reportage.

**Reprendre.** Produire une courte reprise puis s’enregistrer. Écouter et comparer une seule caractéristique : liaison utile, continuité d’un groupe ou accent final, par exemple. Le découpage graphique est une suggestion pédagogique, pas une analyse acoustique mesurée. Aucun score automatique de prononciation n’est affiché.

**Formuler.** Changer les informations pour produire un message personnel, avec trois repères disponibles. Le modèle complet est caché par défaut. Pour le professionnel de la banque, on peut remplacer le sujet médical par un délai, une hypothèse économique ou une évolution de procédure, sans introduire de conseil financier.

**Converser.** Répondre à une relance, préciser une idée et poser une question en retour. Le partenaire humain vérifie le sens et l’intelligibilité. Une transcription automatique éventuelle pourrait aider à relire, mais ne serait pas un juge de la prosodie ni de la justesse sémantique.

Les neuf cibles comprennent changement avant/maintenant, correction d’une attente, dépassement d’une limite, organisation du propos, opposition, possibilité conditionnelle, changement exprimé par la négation, apparence/fait et supposition. Chaque cible est reliée à une intention et à une tâche de réemploi.

### Dosage et autonomie

Ne pas ajouter les neuf boucles complètes aux 45 minutes existantes. Choisir une ou deux cibles prioritaires par séance et remplacer une partie des exercices répétitifs. Les cinq phases restent accessibles sans verrouillage ; une phase déjà maîtrisée peut être sautée. Les autres ressources demeurent consultables à la demande.

Une séquence de travail possible : 2 minutes d’anticipation, 6 minutes d’écoute, 8 minutes sur une formulation, 8 minutes de réemploi et échange, 3 minutes de retour ciblé. Ces durées sont des propositions d’animation, pas des seuils cognitifs établis. L’indicateur essentiel est le temps où l’apprenant produit effectivement un message et reçoit une réponse pertinente.

Pour favoriser le rappel, reprendre une cible dans une autre situation à la séance suivante, puis environ une semaine plus tard. La réussite immédiate avec modèle visible ne doit pas être assimilée à une acquisition durable.

## Les essais comparatifs

**A — référence.** Support GLP-1 v2 conservé.

**B — Focus.** Même matière et médias, affichage par activité, pagination, aides et plan repliés, commandes audio proches de leur texte, lecteur intégré au contenu. « Tout voir » permet de retrouver une vue d’ensemble. Le compromis est une navigation supplémentaire pour passer d’une carte à l’autre ; elle doit être évaluée plutôt que supposée bénéfique.

**C — Boucle orale.** Interface B avec changement pédagogique ciblé pour neuf formulations. Cette comparaison ne permet pas d’attribuer un éventuel progrès au seul design : les tâches et les aides changent aussi. L’essai sert à vérifier l’utilité du guidage pour le transfert oral et son coût en temps.

## Priorités d’amélioration

**P0, en place dans les essais :** hiérarchie visible, une activité centrale, réponses différées, lecture volontaire, proximité commande/contenu, groupes de sens, arrêt des médias lors des changements, séparation entre progression parcourue et maîtrise réelle. Les mesures techniques sont décrites dans le fichier de résultats.

**P1, à valider avec l’apprenant :** quantité d’aide, choix des cibles, rythme des cinq phases, registre des formulations, durée de parole et préférence entre carte unique et vue d’ensemble. Déterminer si l’élève consulte davantage les aides parce qu’elles sont utiles ou parce qu’il se perd.

**P2, après ces observations seulement :** révisions espacées personnalisées, variations de débit authentique, échanges avec plusieurs voix, retour humain plus fin sur les sons. Une visualisation acoustique ne serait ajoutée que si elle répond à une difficulté constatée ; une courbe supplémentaire peut elle-même surcharger l’écran.

## Ce que les tests permettent de conclure

Les contrôles fonctionnels vérifient les parcours, la révélation des réponses et la disponibilité des audios. Les mesures de densité montrent une interface moins chargée dans une configuration précise. Elles ne mesurent pas la charge mentale ni les progrès de l’apprenant. Aucune séance utilisateur, mesure SUS/NASA-TLX ou évaluation orale différée n’a été réalisée.

La recommandation est donc de tester Focus comme base, puis de retenir les phases de Boucle orale qui améliorent un réemploi sans modèle. Le protocole fournit des critères pour décider : moins de recherche d’interface, davantage de parole pertinente, sens conservé et meilleure intelligibilité dans une situation nouvelle.
