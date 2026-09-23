/* =====================================================================
   SÉANCE IMPACT 60 — FICHIER DE CONTENU
   ---------------------------------------------------------------------
   C'est le SEUL fichier à modifier pour créer un nouvel atelier.
   La page index.html (le moteur) ne change jamais.

   Règles d'écriture (le script de mesure lit aussi ce fichier) :
   - tout ce qui suit « window.IMPACT60 = » doit rester du JSON strict :
     guillemets droits doubles "…", pas de virgule après le dernier
     élément, pas de commentaire à l'intérieur des accolades ;
   - les minutages sont en secondes (5:55 → 355) ;
   - seules les balises <strong> et <em> sont prévues dans les textes ;
   - le mode d'emploi complet est dans MODELE_IMPACT60.md.
   ===================================================================== */
window.IMPACT60 = {
  "meta": {
    "id": "acceleration-b2-v3",
    "titre": "Accélération",
    "niveau": "B2",
    "video": {
      "url": "https://youtu.be/9cO5bDqQKMM",
      "titre": "Est-il vrai que tout va toujours plus vite ? | ARTE",
      "duree": "25 min"
    },
    "objectif": "À la fin de la séance, vous défendez en 90 secondes une position nuancée sur un « gain de temps » annoncé : vous exposez le raisonnement évident, vous le réfutez, vous posez une condition, avec des groupes rythmiques nets et sans pause au milieu des phrases.",
    "reserve": {
      "label": "Atelier complet sur la même vidéo (16 segments)",
      "url": "https://orionside.github.io/Atelier_Formation_Francais/Atelier_Acceleration_B2/"
    }
  },

  "profils": [
    { "id": "juriste", "label": "Avocat·e / juriste" },
    { "id": "clinique", "label": "Essais cliniques" },
    { "id": "direction", "label": "Direction / management" }
  ],

  "situations": {
    "juriste": {
      "titre": "Réunion d'associés : l'IA pour la due diligence",
      "contexte": "L'associé gérant propose de confier la revue documentaire des due diligences à un outil d'IA : « On va diviser par deux le temps passé sur chaque dossier. »",
      "consigne": "Vous êtes favorable sur le principe, mais vous craignez l'effet rebond : plus de documents à revoir, une vérification humaine obligatoire, une question de responsabilité. Prenez position."
    },
    "clinique": {
      "titre": "Comité de pilotage : accélérer le recrutement",
      "contexte": "Le sponsor d'un essai multicentrique veut accélérer le recrutement de 30 % en ouvrant quinze nouveaux centres : « On gagnera six mois sur le calendrier. »",
      "consigne": "Vous voyez le gain, mais aussi l'effet rebond : charge de monitoring, qualité des données, déviations au protocole. Prenez position."
    },
    "direction": {
      "titre": "CODIR : répondre aux e-mails en moins d'une heure",
      "contexte": "Un membre du CODIR propose d'imposer à tous les managers une réponse aux e-mails en moins d'une heure : « On gagnera en réactivité. »",
      "consigne": "Vous pensez que c'est une erreur. Expliquez pourquoi et défendez une alternative."
    }
  },

  "ecoute": [
    {
      "id": "A",
      "titre": "Le temps gagné… et reperdu",
      "debut": 355,
      "fin": 447,
      "pourquoi": "C'est le raisonnement de votre tâche : un gain de vitesse annulé par un effet rebond.",
      "predire": "Le film va expliquer pourquoi nous manquons de temps alors que nous en gagnons sans cesse. Avant d'écouter, notez trois mots que vous vous attendez à entendre.",
      "questions": [
        {
          "q": "Quelle « formule simple » explique le phénomène ?",
          "options": [
            "Les taux de croissance dépassent les taux d'accélération.",
            "Les machines vont plus vite que les humains.",
            "Nous travaillons plus d'heures qu'autrefois."
          ],
          "bonne": 0,
          "explication": "« Les taux de croissance dépassent les taux d'accélération » (6:03) : on va plus vite, mais on fait beaucoup plus de choses."
        },
        {
          "q": "Pourquoi l'employée d'hôtel met-elle plus de temps qu'avant, alors qu'elle roule trois fois plus vite ?",
          "options": [
            "Parce que la circulation est devenue très dense.",
            "Parce que la distance domicile-travail a été multipliée par 5, voire par 7.",
            "Parce qu'elle travaille plus loin de l'hôtel."
          ],
          "bonne": 1,
          "explication": "La voiture a réorganisé les villes : les citadins partent en périphérie, et la distance est multipliée par 5, voire par 7 (6:51)."
        }
      ],
      "trous": [
        { "avant": "Conséquence directe, la distance entre le lieu de résidence et le lieu de travail ne cesse de", "apres": ".", "reponses": ["s'allonger", "s allonger", "sallonger"], "solution": "s'allonger" },
        { "avant": "Et c'est précisément là que", "apres": "l'erreur d'appréciation de Keynes.", "reponses": ["reside"], "solution": "réside" },
        { "avant": "Ce qu'il n'avait pas", "apres": ", c'est l'avènement du consumérisme.", "reponses": ["vu venir"], "solution": "vu venir" }
      ],
      "astuce": "« Ce qu'il n'avait pas vu venir » se prononce en un seul souffle, presque [skilnavɛpavyvəniʁ] : à l'oral, les mots se soudent. C'est souvent là qu'on décroche."
    },
    {
      "id": "B",
      "titre": "Faut-il ralentir ? La réponse de Hartmut Rosa",
      "debut": 1341,
      "fin": 1383,
      "pourquoi": "C'est le schéma de réfutation que vous allez réemployer : poser le raisonnement évident, puis le démonter.",
      "predire": "Rosa va répondre à la question : « Faut-il ralentir ? » Selon vous, que va-t-il répondre, et pourquoi ?",
      "questions": [
        {
          "q": "Quels exemples Rosa donne-t-il pour montrer que la lenteur n'est pas toujours souhaitable ?",
          "options": [
            "Les trains et les avions.",
            "Les réunions et les e-mails.",
            "Le médecin urgentiste, les pompiers et une mauvaise connexion internet."
          ],
          "bonne": 2,
          "explication": "« Personne ne veut de médecin urgentiste ou de pompiers lents, et une mauvaise connexion internet n'a jamais amélioré la qualité de vie de personne » (22:32)."
        },
        {
          "q": "Selon lui, quand l'accélération devient-elle néfaste ?",
          "options": [
            "Dès qu'elle dépasse un certain seuil de vitesse.",
            "Quand elle mène à l'aliénation, quand on n'arrive plus à assimiler les choses.",
            "Quand elle touche la vie privée."
          ],
          "bonne": 1,
          "explication": "« L'accélération est néfaste quand elle mène à l'aliénation, quand on n'arrive plus à assimiler les choses » (22:40)."
        }
      ],
      "trous": [
        { "avant": "Si l'accélération est le problème, alors la réponse", "apres": "être le ralentissement.", "reponses": ["devrait"], "solution": "devrait" },
        { "avant": "L'accélération est", "apres": "quand elle mène à l'aliénation.", "reponses": ["nefaste"], "solution": "néfaste" },
        { "avant": "Nous ne résoudrons pas le problème en modifiant notre", "apres": "du temps.", "reponses": ["gestion"], "solution": "gestion" }
      ],
      "astuce": "À 22:43, on entend « quand on arrive plus » : le « n' » de la négation disparaît presque à l'oral (on n'arrive → [ɔ̃naʁiv]). Pour le repérer, écoutez le « plus » : c'est lui qui porte la négation."
    }
  ],

  "formules": [
    {
      "id": "f1",
      "forme": "Prenons un exemple concret : …",
      "fonction": "Illustrer pour convaincre",
      "film": { "texte": "Prenons un exemple concret pour bien comprendre.", "t": 367 },
      "exemples": {
        "juriste": "Prenons un exemple concret : le dossier Delta, 40 000 pièces revues en trois semaines.",
        "clinique": "Prenons un exemple concret : l'étude de phase II de l'an dernier, où deux centres sur dix ont fourni la moitié des patients.",
        "direction": "Prenons un exemple concret : la semaine dernière, 212 e-mails reçus, dont une vingtaine vraiment urgents."
      },
      "detect": ["prenons un exemple", "prenons le cas", "prenons l exemple"]
    },
    {
      "id": "f2",
      "forme": "Sur le papier, on devrait… Dans les faits, …",
      "fonction": "Opposer la théorie et la réalité",
      "film": { "texte": "Nous devrions donc pouvoir vivre de manière sereine et avoir plus de temps.", "t": 334 },
      "exemples": {
        "juriste": "Sur le papier, on devrait diviser le temps de revue par deux. Dans les faits, il faudra tout faire relire par un collaborateur.",
        "clinique": "Sur le papier, quinze centres de plus devraient nous faire gagner six mois. Dans les faits, l'activation d'un centre prend souvent quatre à six mois.",
        "direction": "Sur le papier, répondre en une heure devrait nous rendre plus réactifs. Dans les faits, plus personne n'aura le temps de réfléchir."
      },
      "detect": ["sur le papier", "dans les faits", "en theorie"]
    },
    {
      "id": "f3",
      "forme": "Résultat : …",
      "fonction": "Annoncer la conséquence en un mot",
      "film": { "texte": "Résultat, le trajet quotidien pour se rendre au travail prend aujourd'hui plus de temps qu'auparavant.", "t": 417 },
      "exemples": {
        "juriste": "Résultat : on facture moins d'heures, mais on engage davantage notre responsabilité.",
        "clinique": "Résultat : on recrute plus vite, mais on multiplie les requêtes sur les données.",
        "direction": "Résultat : tout le monde répond vite, et plus personne ne travaille sur le fond."
      },
      "detect": ["resultat"]
    },
    {
      "id": "f4",
      "forme": "Ce que personne n'avait vu venir, c'est…",
      "fonction": "Mettre en relief un effet imprévu",
      "film": { "texte": "Ce qu'il n'avait pas vu venir, c'est l'avènement du consumérisme.", "t": 442 },
      "exemples": {
        "juriste": "Ce que personne n'avait vu venir, c'est que les clients demanderaient d'examiner deux fois plus de documents.",
        "clinique": "Ce que personne n'avait vu venir, c'est la charge de monitoring dans les petits centres.",
        "direction": "Ce que personne n'avait vu venir, c'est que l'urgence deviendrait la norme."
      },
      "detect": ["n avait pas vu venir", "n avait vu venir", "n a vu venir", "n a pas vu venir", "personne n avait"]
    },
    {
      "id": "f5",
      "forme": "Plus…, plus… / Plus…, moins…",
      "fonction": "Montrer une corrélation",
      "film": { "texte": "Plus elles nous facilitent la vie, plus elles nous permettent de compliquer celle des autres.", "t": 957 },
      "exemples": {
        "juriste": "Plus on revoit de documents, plus on s'expose à rater la pièce qui compte.",
        "clinique": "Plus on ouvre de centres, plus le monitoring devient difficile à tenir.",
        "direction": "Plus on exige des réponses rapides, moins on obtient des réponses réfléchies."
      },
      "detect": ["plus … plus", "plus … moins", "moins … plus"]
    },
    {
      "id": "f6",
      "forme": "Si…, alors on devrait… Mais je pense que c'est une erreur : …",
      "fonction": "Poser le raisonnement évident, puis le réfuter",
      "film": { "texte": "Si l'accélération est le problème, alors la réponse devrait être le ralentissement. Mais je pense que c'est une erreur.", "t": 1347 },
      "exemples": {
        "juriste": "Si l'outil va deux fois plus vite, alors on devrait réduire l'équipe. Mais je pense que c'est une erreur : c'est la vérification qui fait notre valeur.",
        "clinique": "Si on manque de patients, alors on devrait ouvrir plus de centres. Mais je pense que c'est une erreur : il vaut mieux renforcer les centres qui recrutent déjà.",
        "direction": "Si on veut plus de réactivité, alors on devrait répondre plus vite. Mais je pense que c'est une erreur : il faut surtout envoyer moins d'e-mails."
      },
      "detect": ["c est une erreur", "ce serait une erreur"]
    }
  ],

  "interaction": [
    {
      "id": "i1",
      "forme": "Je vous rejoins sur…, en revanche…",
      "fonction": "Concéder, puis nuancer (sans braquer)",
      "exemples": {
        "juriste": "Je vous rejoins sur l'intérêt de l'outil, en revanche je ne signerai pas une revue qu'aucun collaborateur n'a relue.",
        "clinique": "Je vous rejoins sur l'objectif de calendrier, en revanche la qualité des données ne se négocie pas.",
        "direction": "Je vous rejoins sur le besoin de réactivité, en revanche une heure, c'est irréaliste pour les dossiers de fond."
      },
      "detect": ["je vous rejoins", "je te rejoins"]
    },
    {
      "id": "i2",
      "forme": "Si je vous suis bien, … C'est bien ça ?",
      "fonction": "Reformuler pour vérifier (et gagner du temps)",
      "exemples": {
        "juriste": "Si je vous suis bien, l'outil ferait le premier tri et nous garderions la validation. C'est bien ça ?",
        "clinique": "Si je vous suis bien, les nouveaux centres seraient activés avant la fin du trimestre. C'est bien ça ?",
        "direction": "Si je vous suis bien, la règle s'appliquerait aussi aux e-mails envoyés le soir. C'est bien ça ?"
      },
      "detect": ["si je vous suis bien", "si je comprends bien", "si je vous ai bien compris"]
    }
  ],

  "prononciation": {
    "cible": "Le groupe rythmique : l'accent tombe à la fin du groupe",
    "pourquoi": "En espagnol, chaque mot a sa syllabe accentuée (e<strong>jem</strong>plo, multipli<strong>ca</strong>da). En français, l'accent ne tombe pas sur le mot, mais sur la <strong>dernière syllabe du groupe de mots</strong>, qui est plus longue. Si vous accentuez chaque mot, votre phrase paraît hachée et plus lente qu'elle ne l'est. Si vous accentuez chaque groupe, elle paraît fluide.",
    "regle": [
      "Découpez la phrase en groupes de sens (souvent 3 à 7 syllabes).",
      "Allongez la <strong>dernière syllabe</strong> de chaque groupe. Les autres syllabes restent régulières, sans accent.",
      "La voix <strong>monte</strong> ↗ à la fin d'un groupe quand la phrase continue, et <strong>descend</strong> ↘ à la fin de la phrase.",
      "À l'intérieur du groupe, on soude les mots : pas de pause, pas de coup de glotte (liaisons et enchaînements ‿)."
    ],
    "quiz": [
      {
        "q": "« Prenons un exemple concret. » Quelle syllabe est accentuée ?",
        "options": ["pre-", "-nons", "-xem-", "-cret"],
        "bonne": 3,
        "explication": "Un seul groupe, donc un seul accent, sur la dernière syllabe : -<strong>cret</strong>. Le piège hispanophone, c'est e-<strong>XEM</strong>-ple, calqué sur ejemplo."
      },
      {
        "q": "« …a été multipliée par cinq. » Où va l'accent dans « multipliée » quand le mot est seul ?",
        "options": ["mul-", "-ti-", "-pli-", "-ée"],
        "bonne": 3,
        "explication": "Sur la dernière syllabe prononcée : multipli-<strong>ée</strong>. Mais dans « a été multipliée par cinq », il glisse sur « <strong>cinq</strong> », la fin du groupe."
      },
      {
        "q": "« Mais je pense que c'est une erreur. » Combien de groupes rythmiques ?",
        "options": ["1", "2", "5"],
        "bonne": 1,
        "explication": "Deux groupes : « Mais je <strong>pense</strong> ↗ | que c'est‿une‿er<strong>reur</strong> ↘ ». On enchaîne « c'est‿une‿erreur » [sɛ.ty.nɛ.ʁœʁ] sans coupure."
      }
    ],
    "modeles": [
      {
        "texte": "Prenons‿un‿exemple con<strong>cret</strong> ↘",
        "tts": "Prenons un exemple concret.",
        "t": 367
      },
      {
        "texte": "Plus‿elles nous facilitent la <strong>vie</strong> ↗ | plus‿elles nous per<strong>mettent</strong> ↗ | de compliquer celle des <strong>autres</strong> ↘",
        "tts": "Plus elles nous facilitent la vie, plus elles nous permettent de compliquer celle des autres.",
        "t": 957
      },
      {
        "texte": "Ce qu'il n'avait pas vu ve<strong>nir</strong> ↗ | c'est l'avènement du consumé<strong>risme</strong> ↘",
        "tts": "Ce qu'il n'avait pas vu venir, c'est l'avènement du consumérisme.",
        "t": 442
      },
      {
        "texte": "Si l'accélération est le pro<strong>blème</strong> ↗ | alors la réponse devrait être le ralentisse<strong>ment</strong> ↘ | Mais je <strong>pense</strong> ↗ | que c'est‿une‿er<strong>reur</strong> ↘",
        "tts": "Si l'accélération est le problème, alors la réponse devrait être le ralentissement. Mais je pense que c'est une erreur.",
        "t": 1347
      }
    ],
    "protocole": [
      "Écoutez l'extrait deux fois sans lire.",
      "Relisez le modèle en écoutant, en suivant les ↗ ↘ du doigt.",
      "Murmurez en même temps que la voix, sans chercher à articuler : seulement la mélodie.",
      "Parlez en même temps que la voix, à voix haute (shadowing), deux fois.",
      "Dites la phrase seul·e, puis appliquez-la à votre phrase clé de la tâche."
    ],
    "autocontrole": [
      "La dernière syllabe de chaque groupe est plus longue que les autres.",
      "Je n'ai accentué aucun mot au milieu d'un groupe.",
      "Ma voix monte en fin de groupe et descend en fin de phrase.",
      "Je n'ai fait aucune pause à l'intérieur d'un groupe."
    ]
  },

  "tache": {
    "preparation": 60,
    "tours": [
      {
        "duree": 120,
        "consigne": "Premier tour. Parlez à partir de vos mots-clés, sans lire. Objectif : tout dire, même imparfaitement.",
        "apport": "Avant le tour 2, ajoutez deux formules : « Sur le papier…, dans les faits… » et « Si…, alors on devrait… Mais je pense que c'est une erreur ». Marquez vos groupes rythmiques sur votre phrase clé."
      },
      {
        "duree": 90,
        "consigne": "Deuxième tour, plus court. Votre formateur vous interrompt une fois avec une objection : répondez avec « Je vous rejoins sur…, en revanche… ».",
        "apport": "Avant le tour 3, ajoutez « Plus…, plus… » et « Résultat : … ». Règle : vos pauses vont entre les groupes, jamais au milieu."
      },
      {
        "duree": 60,
        "consigne": "Troisième tour, sans notes. Uniquement l'essentiel : la position, l'argument principal, la condition.",
        "apport": ""
      }
    ],
    "interruptions": {
      "juriste": [
        "Mais nos concurrents l'utilisent déjà. On ne peut pas se permettre d'attendre.",
        "Le client ne paiera plus pour des heures de revue manuelle.",
        "L'éditeur de l'outil garantit un taux d'erreur inférieur à 1 %."
      ],
      "clinique": [
        "Le sponsor a déjà validé le budget des nouveaux centres.",
        "Nos concurrents recrutent deux fois plus vite que nous.",
        "Le monitoring à distance réglera le problème de charge."
      ],
      "direction": [
        "Nos clients se plaignent de délais de réponse trop longs.",
        "Une heure, c'est une question de discipline, pas de charge.",
        "Les autres directions appliquent déjà cette règle."
      ]
    }
  },

  "semaine": [
    { "jour": "J+1", "tache": "Shadowing de l'extrait « Plus…, plus… » (15:57), 10 minutes, en suivant le protocole en 5 étapes." },
    { "jour": "J+2", "tache": "Rappel des 8 formules en mode « rappel », sans regarder : une phrase sur votre métier pour chacune, à voix haute." },
    { "jour": "J+3", "tache": "Shadowing de Rosa (22:27), puis enregistrez-vous une fois et comparez les fins de groupe." },
    { "jour": "J+4", "tache": "Placez votre formule de la semaine dans une vraie réunion. Notez la phrase exacte." },
    { "jour": "J+5", "tache": "Enregistrez 60 secondes sur la situation du jour, sans notes, et envoyez-les à votre formateur." }
  ],

  "seance2": {
    "principe": "Réactiver, puis transférer : on vérifie que les formules et le rythme tiennent à froid, sur une situation nouvelle.",
    "cible": "Les voyelles nasales [ɑ̃] et [ɔ̃], sans consonne n à la fin : « la réponse… le ralentissement… je pense » (22:27). Piège hispanophone : dire « pen-se » ou « répon-ne ».",
    "situations": {
      "juriste": "Un client vous demande de boucler un contrat de cession en 48 heures au lieu de deux semaines.",
      "clinique": "La direction veut réduire le délai de saisie des données dans l'eCRF de cinq à deux jours dans tous les centres.",
      "direction": "Votre N+1 veut ramener toutes les réunions d'équipe de 60 à 30 minutes."
    },
    "deroule": [
      "0–5 min : rappel à froid des 8 formules (la fonction est donnée, l'apprenant produit la formule).",
      "5–10 min : mesure à froid de 90 secondes sur la NOUVELLE situation (c'est le vrai test de transfert).",
      "10–25 min : cible nasales. Discrimination auditive, puis production, retour par incitation.",
      "25–45 min : jeu de rôle de réunion (le formateur interrompt, relance, conteste).",
      "45–55 min : mesure finale et comparaison avec la séance 1.",
      "55–60 min : formule de la semaine suivante et plan des 10 minutes par jour."
    ]
  },

  "formateur": {
    "deroule": [
      { "temps": "0–5", "phase": "Mesure à froid", "role": "Lancez l'enregistrement de 90 s sans préparation. Ne corrigez rien. Notez deux ou trois erreurs récurrentes." },
      { "temps": "5–15", "phase": "Écoute ciblée", "role": "Faites prédire avant chaque écoute. Après la deuxième écoute, faites repérer où et pourquoi l'apprenant a décroché (débit, mots soudés, chiffres)." },
      { "temps": "15–25", "phase": "Formules", "role": "Répétition en chœur, puis mode rappel (fonction → formule). Faites produire l'exemple dans le métier de l'apprenant, pas celui de la page." },
      { "temps": "25–33", "phase": "Prononciation", "role": "Une seule cible. Faites d'abord percevoir (quiz), puis produire (shadowing). Corrigez par incitation : « Où est l'accent ? », « Encore, en allongeant la fin »." },
      { "temps": "33–50", "phase": "Tâche en 3 tours", "role": "Jouez l'interlocuteur. Au tour 2, lisez une objection. Entre les tours, apportez les formules indiquées, rien d'autre." },
      { "temps": "50–56", "phase": "Mesure finale", "role": "Même consigne qu'au début, 90 s. Comparez les chiffres à voix haute avec l'apprenant." },
      { "temps": "56–60", "phase": "Engagement", "role": "Une formule, une réunion réelle, une date. Rappelez le plan de 10 minutes par jour." }
    ],
    "feedback": [
      "Incitez à se corriger au lieu de donner la bonne forme : l'effet est plus fort, surtout en parole libre (Lyster & Saito, 2010).",
      "Quatre techniques : demander de clarifier (« Pardon ? »), répéter l'erreur avec une intonation montante, donner un indice (« Attention au genre »), faire compléter (« Ce que personne n'avait… ? »).",
      "Pendant les tours 1 et 3, ne corrigez pas : notez. Le retour se fait entre les tours, sur deux points au maximum.",
      "Pour la prononciation, visez la compréhensibilité (l'effort que l'interlocuteur doit fournir), pas l'accent natif."
    ],
    "mesure": [
      "Les chiffres de la page (pauses, temps de parole) sont calculés dans le navigateur, sans transcription. Ils sont indicatifs et sensibles au bruit ambiant.",
      "Pour une mesure complète (débit en syllabes, pauses au milieu des phrases, « euh », formules repérées), passez l'enregistrement au script mesure_oral.py.",
      "Le gain entre la mesure 1 et la mesure 2 inclut l'effet de répétition. Le vrai test, c'est la mesure à froid de la séance 2, sur une situation nouvelle."
    ],
    "transcription": "La transcription automatique de YouTube contient des erreurs sur les noms propres. Formes correctes : Hartmut Rosa, Heinrich Heine, John Maynard Keynes, Marianne Gronemeyer, Gloria Mark, memento mori, le Finnmark. Le film est un documentaire allemand doublé : voix off lue et interviews doublées, donc un modèle de parole préparée, pas de conversation spontanée.",
    "changements": [
      "16 segments → 2 extraits de 40 à 90 secondes, travaillés en profondeur (écoute métacognitive).",
      "79 tournures → 6 formules et 2 formules d'interaction, recyclées pendant une semaine.",
      "Questions rédigées → productions orales enregistrées et mesurées.",
      "Aucune prononciation → une cible par séance, avec perception, shadowing et autocontrôle.",
      "Exemples génériques → exemples et tâches selon le métier : droit, essais cliniques, direction."
    ]
  }
};
