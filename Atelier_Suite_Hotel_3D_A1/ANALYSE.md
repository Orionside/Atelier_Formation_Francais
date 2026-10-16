# Suite 14 — audit avant correction, 16 octobre 2026

Source : atelier public Atelier_Suite_Hotel_3D_A1, commit 14a9c1f. 79 entrées de vocabulaire de l'hôtel, 10 produits du minibar, 10 objets personnels dont 7 cachés, 10 questions il y a/il n'y a pas de, 7 étapes de dialogue à la réception, 12 nombres de loto, 5 messages d'interface. Le code construit 277 identifiants audio. La visite 3D comporte réception, couloir, chambre, salon, bureau, salle de bains et balcon.

## Voix

Les banques JSON contiennent chacune 277 MP3 encodés en base64. La documentation de la page indique une synthèse française Piper et sa conversion kNN-VC, avec compléments de Bon séjour A1 ; ce procédé transforme principalement l'identité acoustique et conserve les limites prosodiques de la synthèse source. La lecture prévoit aussi un secours SpeechSynthesisUtterance à vitesse 0,88, voix choisie par heuristique sur son nom, sans garantie de correspondance. Les deux banques anciennes sont donc remplacées par une génération directe Qwen3-TTS et un seul manifeste traçable, sans substitution automatique par une voix système.

Références à utiliser exclusivement : Downloads/voix de référence A1 femme.mp4 et Downloads/voix de référence homme A1.mp4. Les sources et extraits sont conservés hors dépôt public. Réceptionniste/vocabulaire/questions = femme ; client/réponses/nombres = homme. La vitesse normale doit conserver des liaisons et groupes de sens naturels. Le ralentissement facultatif doit préserver la hauteur et ne pas être ajouté à un fichier déjà artificiellement étiré.

## Visuel et reconnaissance

Le peignoir de la salle de bains est un volume de révolution aplati, sans manches, col, poches ou ceinture. Le peignoir du placard est un parallélépipède. Les serviettes sur étagère sont des boîtes arrondies et la serviette suspendue un seul bloc. Cela ne suffit pas pour identifier ces objets sans lire le nom, et reporte la charge de compréhension sur l'écrit. Les chaussons sont des boîtes, le sèche-cheveux des cylindres non détaillés ; téléphone, télécommande et chargeur manquent également de détails fonctionnels caractéristiques. Les tasses n'ont pas d'anse. Literie et coussins ont des contours rigides ; les textures répétitives du bois/marbre sont trop contrastées et peu crédibles.

La correction doit porter sur la silhouette à distance, les proportions, le volume, le tombé et les détails d'usage ; ajouter du bruit dans une texture ne corrige pas une forme ambiguë. Drapés de serviettes, bords cousus et bandes tissées ; peignoir à deux manches, col châle, croisement, ceinture nouée et poches ; chaussons à semelle et ouverture ; sèche-cheveux avec buse, grille, poignée et câble ; tasses avec anse et intérieur creux. Prévoir une inspection rapprochée manipulable. Les grands objets doivent rester nommables dans la scène, sans multiplication de signes ni texte dans les textures.

## A1 adulte

Conserver les situations concrètes et l'article avec le nom, puis la phrase entière : il y a / j'ai / je n'ai pas de / est-ce que. La banque complète de 79 mots dépasse une séance A1 : permettre de choisir une petite zone et quelques objets, sans assimiler une découverte au clic à une maîtrise orale. Les scores des quiz vérifient les choix de réponse et non la prononciation. Les services inventés de cette suite enrichie ne doivent pas être attribués au document Caribeach d'origine. La valeur affirmative attendue au dialogue ne doit pas invalider une réponse personnelle négative grammaticalement correcte hors scénario. Le formulaire doit rester fictif ; ne pas demander de vraies données personnelles pour l'exercice.

## Validation prévue

Comparer les nouveaux textes reconnus et les éléments critiques (négations, nombres, personne grammaticale), contrôler signal/fin de phrase et référence vocale ; comparer plusieurs essais représentatifs avant la série. Examiner visuellement les objets prioritaires dans le navigateur et au gros plan, puis tester navigation, actions et lecture des deux voix sur ordinateur et petit écran. Publier uniquement après contrôles, vérifier le déploiement et les empreintes des fichiers distants.

## Résultat de la correction

Le choix confirmé par le formateur est de conserver la 3D navigable et d'ajouter une inspection rapprochée. La correction porte donc sur les maillages et les matières réelles de la visite. Le gros plan ne substitue pas une photographie à un objet schématique : il réutilise le modèle détaillé de la scène. Les textiles ont été reconstruits ; les objets d'usage reçoivent des détails fonctionnels reconnaissables. Le lexique permet d'ouvrir directement une inspection, afin que l'effort moteur de se placer face à un petit objet ne bloque pas l'apprentissage du mot.

Une banque unique de 277 lectures Qwen3-TTS remplace les deux anciennes banques et les substitutions de voix. Les références sont les deux MP4 expressément demandés dans cette correction. Le signal n'a pas été étiré pour rendre la diction plus lente : le bouton 0,9× agit seulement sur le lecteur et préserve la hauteur. Les contrôles de transcription, de signal et de timbre ont conduit à écarter une prononciation du nom de l'hôtel et deux lectures erronées de nombres. Les limites de ces contrôles sont documentées dans VERIFICATION.md ; la voix finale peut être écoutée dans guide-audio.html.

Les compteurs de découverte restent distincts de la maîtrise orale. Une recommandation de petites séances de cinq objets et une consigne de réemploi oral après les choix du quiz ont été ajoutées. Les données du formulaire doivent être imaginaires ; aucune vraie réservation n'est effectuée.
