/*
 * Atelier « Au café : comprendre, commander et payer » (Rendez-vous A1 v3) — contenu.js
 * Données seulement : TOUT le texte de l'atelier, aucune logique. JSON strict après le signe égal.
 * Révisé le 2026-10-07 (v3, retour du formateur R1 à R21 : specs/C0_RETOUR_UTILISATEUR_V3.md) à partir de A1 (scénario) corrigé par B0, A2, A3, A4 (ordre de priorité de B0).
 * Statut : dialogues créés, voix de synthèse non validées à l'écoute ; aides ES/IT non relues par un locuteur natif ;
 * aucun résultat d'apprenant. Schéma des blocs : B1_schema_final.md. Contrôle : node B1_verifier_contenu.mjs
 */
window.CONTENU = {
  "version": "20261007-v3",
  "meta": {
    "id": "rendez-vous-a1-v3",
    "titre": "Au café",
    "sous_titre": "comprendre, commander et payer",
    "niveau": "A1",
    "duree_min": 45,
    "langue": "fr",
    "date": "2026-10-07",
    "url_publique": "https://orionside.github.io/Atelier_Formation_Francais/Atelier_Rendez_Vous_A1_v3/",
    "video": {
      "id": "HNBQOEb_O5k",
      "url": "https://youtu.be/HNBQOEb_O5k",
      "titre": "Français pour débutants – Rendez-vous",
      "source": "R",
      "nature": "film joué par des acteurs, lent"
    },
    "ancien_atelier": {
      "libelle": "Se présenter : l'autre cours",
      "url": "https://orionside.github.io/Atelier_Formation_Francais/Atelier_Rendez_Vous_A1/"
    },
    "sequences": [
      "s0",
      "s1",
      "s2",
      "s3",
      "s4",
      "s5",
      "s6"
    ],
    "durees_min": {
      "accueil": 1,
      "s0": 3,
      "s1": 6,
      "s2": 9,
      "s3": 7,
      "s4": 5,
      "s5": 10,
      "s6": 5
    },
    "stockage": {
      "cle": "rendez-vous-a1-v3",
      "studio": "rendez-vous-a1-v3-studio"
    },
    "statut": "v3 : dialogues créés (voix de synthèse non validées à l'écoute). Aucun résultat d'apprenant."
  },
  "video": {
    "id": "HNBQOEb_O5k",
    "extraits": {
      "film-B": [
        137.44,
        212.4
      ],
      "film-p4": [
        145.9,
        148.58
      ],
      "film-p5": [
        153.98,
        157.48
      ],
      "film-p6": [
        191.64,
        193.5
      ],
      "film-Bdif": [
        199.43,
        205.4
      ],
      "film-cafe-long": [
        148.2,
        154.46
      ],
      "film-p5-question": [
        153.98,
        156
      ],
      "film-p5-reponse": [
        155.76,
        157.48
      ],
      "film-croissant": [
        157.65,
        159.9
      ],
      "film-paiement-question": [
        199.43,
        200.95
      ],
      "film-paiement-reponse": [
        203.43,
        205.4
      ]
    },
    "extraits_meta": {
      "film-B": {
        "mesure": "scene_cafe",
        "texte": "toute la scène du café",
        "source": "R",
        "condition": "film_formatif",
        "declare": [
          136.9,
          212.4
        ],
        "ecrans": [
          "s1"
        ]
      },
      "film-p4": {
        "mesure": "p4",
        "texte": "Un café noir pour moi, s'il vous plaît.",
        "source": "R",
        "condition": "film_formatif",
        "groupes_fiables": true,
        "ecrans": [
          "s1",
          "s2",
          "s4"
        ]
      },
      "film-p5": {
        "mesure": "p5",
        "texte": "Parfait. C'est tout ? — Oui, merci, c'est tout.",
        "source": "R",
        "condition": "film_formatif",
        "groupes_fiables": true,
        "ecrans": [
          "s1",
          "s2"
        ],
        "note": "v3 : début à 153,98 s pour contenir « Parfait » en entier (0,5 s avant son premier mot) ; on entend la fin de « s'il vous plaît » de la phrase d'avant."
      },
      "film-p6": {
        "mesure": "p6",
        "texte": "L'addition, s'il vous plaît.",
        "source": "R",
        "condition": "film_formatif",
        "groupes_fiables": false,
        "ecrans": [
          "s1",
          "s2"
        ]
      },
      "film-Bdif": {
        "mesure": "paiement",
        "texte": "Carte ou espèces ? — Espèces, espèces.",
        "source": "R",
        "condition": "film_formatif",
        "groupes_fiables": true,
        "ecrans": [
          "s2"
        ]
      },
      "film-cafe-long": {
        "mesure": "cafe_long",
        "texte": "Et moi, un café long et un jus d'orange, s'il vous plaît.",
        "source": "R",
        "condition": "film_formatif",
        "ecrans": [
          "s1"
        ],
        "groupes_fiables": false,
        "note": "v3 : début à 148,2 s, avant « Et moi » (premier mot à 148,64 s) : on entend la fin de « s'il vous plaît » de la phrase d'avant. Silence de fond de 149,5 à 152,5 s. Fin à 154,46 s (« plaît » finit à 154,35 s)."
      },
      "film-p5-question": {
        "mesure": "p5",
        "texte": "Parfait. C'est tout ?",
        "source": "R",
        "condition": "film_formatif",
        "ecrans": [
          "s1",
          "s2"
        ],
        "groupes_fiables": true,
        "note": "v3 : début à 153,98 s (« Parfait » commence vers 154,5 s) ; on entend la fin de la phrase d'avant."
      },
      "film-p5-reponse": {
        "mesure": "p5",
        "texte": "Oui, merci, c'est tout.",
        "source": "R",
        "condition": "film_formatif",
        "ecrans": [
          "s1",
          "s2"
        ],
        "groupes_fiables": true,
        "note": "v3 : début à 155,76 s ; on entend la fin de « C'est tout ? »."
      },
      "film-croissant": {
        "mesure": "croissant",
        "texte": "Un croissant aussi.",
        "source": "R",
        "condition": "film_formatif",
        "ecrans": [
          "s1"
        ],
        "groupes_fiables": false,
        "note": "v3 : inclut l'hésitation « euh » (158,0 à 158,7 s) ; « Un » commence à 158,73 s."
      },
      "film-paiement-question": {
        "mesure": "paiement",
        "texte": "Carte ou espèces ?",
        "source": "R",
        "condition": "film_formatif",
        "ecrans": [
          "s1",
          "s2"
        ],
        "groupes_fiables": true,
        "note": "v3 : début à 199,43 s ; le son du film est vide de 199,12 à 199,74 s (coupure de montage)."
      },
      "film-paiement-reponse": {
        "mesure": "paiement",
        "texte": "Espèces, espèces.",
        "source": "R",
        "condition": "film_formatif",
        "ecrans": [
          "s1",
          "s2"
        ],
        "groupes_fiables": true
      }
    },
    "marge": "Au moins 0,5 s avant le premier mot ; le lecteur YouTube perd environ 0,35 s au démarrage (A2_mesures_film.json).",
    "avertissement": "MESURES AUTOMATIQUES (Praat, YIN, Whisper, reconnaissance de sons) — pas une écoute experte. Le formateur (francophone) doit confirmer à l'oreille avant tout usage dans le support."
  },
  "glossaire": {
    "le comptoir": "(= le bar du café)",
    "le serveur / la serveuse": "(= il / elle travaille au café)",
    "le client / la cliente": "(= la personne qui achète)",
    "commander": "(= demander une boisson)",
    "espèces": "(= billets et pièces)",
    "par carte": "(= avec la carte bancaire)",
    "l'addition": "(= le papier avec le prix)",
    "répéter": "(= dire encore)",
    "c'est tout": "(= j'ai fini, je ne veux plus rien)"
  },
  "images": {
    "img-comptoir": {
      "pictos": "img-comptoir",
      "libelle": "le comptoir",
      "alt": "Un café. Un serveur derrière le comptoir. Une cliente devant.",
      "ecrans": [
        "accueil",
        "s0",
        "s2",
        "s5"
      ]
    },
    "img-comptoir-2": {
      "pictos": "img-comptoir-2",
      "libelle": "un autre comptoir",
      "alt": "Un autre café. Une serveuse derrière le comptoir. Une cliente devant.",
      "ecrans": [
        "s6"
      ]
    },
    "img-table": {
      "pictos": "img-table",
      "libelle": "la table",
      "alt": "Un homme et une femme à une table de café. Un serveur arrive.",
      "ecrans": [
        "s1"
      ]
    },
    "img-table-addition": {
      "pictos": "img-table-addition",
      "libelle": "à table",
      "alt": "À table : le serveur apporte l'addition.",
      "ecrans": [
        "s2"
      ]
    },
    "img-serveur": {
      "pictos": "img-serveur",
      "libelle": "le serveur",
      "alt": "Le serveur.",
      "ecrans": [
        "accueil",
        "s0",
        "s2"
      ]
    },
    "img-serveuse": {
      "pictos": "img-serveuse",
      "libelle": "la serveuse",
      "alt": "La serveuse.",
      "ecrans": [
        "s6",
        "apres"
      ]
    },
    "img-client": {
      "pictos": "img-client",
      "libelle": "le client",
      "alt": "Le client.",
      "ecrans": [
        "s2"
      ]
    },
    "img-homme": {
      "pictos": "img-homme",
      "libelle": "l'homme",
      "alt": "L'homme.",
      "ecrans": [
        "s1"
      ]
    },
    "img-femme": {
      "pictos": "img-femme",
      "libelle": "la femme",
      "alt": "La femme.",
      "ecrans": [
        "s1"
      ]
    },
    "img-homme-et-femme": {
      "pictos": "img-homme-et-femme",
      "libelle": "l'homme et la femme",
      "alt": "L'homme et la femme.",
      "ecrans": [
        "s1"
      ]
    },
    "img-un-the": {
      "pictos": "img-un-the",
      "libelle": "un thé",
      "alt": "Un thé.",
      "ecrans": [
        "s0",
        "s1",
        "s3",
        "s4",
        "s5",
        "banque"
      ]
    },
    "img-deux-thes": {
      "pictos": "img-deux-thes",
      "libelle": "deux thés",
      "alt": "Deux thés.",
      "ecrans": [
        "s0",
        "s5",
        "banque"
      ]
    },
    "img-un-cafe": {
      "pictos": "img-un-cafe",
      "libelle": "un café",
      "alt": "Un café.",
      "ecrans": [
        "s1",
        "s4",
        "s6",
        "banque"
      ]
    },
    "img-deux-cafes": {
      "pictos": "img-deux-cafes",
      "libelle": "deux cafés",
      "alt": "Deux cafés.",
      "ecrans": [
        "s6"
      ]
    },
    "img-cafe-noir": {
      "pictos": "img-cafe-noir",
      "libelle": "un café noir",
      "alt": "Un café noir.",
      "ecrans": [
        "s1"
      ]
    },
    "img-cafe-long": {
      "pictos": "img-cafe-long",
      "libelle": "un café long",
      "alt": "Un café long.",
      "ecrans": [
        "s1"
      ]
    },
    "img-un-cafe-plus": {
      "pictos": "img-un-cafe-plus",
      "libelle": "un autre café",
      "alt": "Un autre café.",
      "ecrans": [
        "s1"
      ]
    },
    "img-jus-orange": {
      "pictos": "img-jus-orange",
      "libelle": "un jus d'orange",
      "alt": "Un jus d'orange.",
      "ecrans": [
        "s1",
        "s4"
      ]
    },
    "img-croissant": {
      "pictos": "img-croissant",
      "libelle": "un croissant",
      "alt": "Un croissant.",
      "ecrans": [
        "s1",
        "s4"
      ]
    },
    "img-cafe-et-croissant": {
      "pictos": "img-cafe-et-croissant",
      "libelle": "un café et un croissant",
      "alt": "Un café et un croissant.",
      "ecrans": [
        "banque"
      ]
    },
    "img-eau": {
      "pictos": "img-eau",
      "libelle": "un verre d'eau",
      "alt": "Un verre d'eau.",
      "ecrans": [
        "s1"
      ]
    },
    "img-sandwich": {
      "pictos": "img-sandwich",
      "libelle": "un sandwich",
      "alt": "Un sandwich.",
      "ecrans": [
        "s1"
      ]
    },
    "img-carte-bancaire": {
      "pictos": "img-carte-bancaire",
      "libelle": "par carte",
      "alt": "Une carte bancaire.",
      "ecrans": [
        "s2",
        "s3",
        "s5",
        "banque"
      ]
    },
    "img-especes": {
      "pictos": "img-especes",
      "libelle": "en espèces (= billets et pièces)",
      "alt": "Des billets et des pièces.",
      "ecrans": [
        "s2",
        "s3",
        "s5",
        "banque"
      ]
    },
    "img-addition": {
      "pictos": "img-addition",
      "libelle": "l'addition (= le papier avec le prix)",
      "alt": "L'addition : le papier avec le prix.",
      "ecrans": [
        "s1"
      ]
    },
    "img-2-euros": {
      "pictos": "img-2-euros",
      "libelle": "deux euros",
      "alt": "Deux euros.",
      "ecrans": [
        "s5"
      ]
    },
    "img-3-euros": {
      "pictos": "img-3-euros",
      "libelle": "trois euros",
      "alt": "Trois euros.",
      "ecrans": [
        "s5"
      ]
    },
    "img-f-commander": {
      "pictos": "img-f-commander",
      "libelle": "commander (= demander une boisson)",
      "alt": "Commander : demander une boisson.",
      "ecrans": [
        "s2",
        "s3",
        "s5",
        "apres"
      ]
    },
    "img-f-finir": {
      "pictos": "img-f-finir",
      "libelle": "finir la commande",
      "alt": "Finir la commande.",
      "ecrans": [
        "s2",
        "s3",
        "s5"
      ]
    },
    "img-f-payer": {
      "pictos": "img-f-payer",
      "libelle": "payer",
      "alt": "Payer.",
      "ecrans": [
        "s2",
        "s3",
        "s5"
      ]
    },
    "img-fini": {
      "pictos": "img-fini",
      "libelle": "c'est fini",
      "alt": "C'est fini.",
      "ecrans": [
        "banque"
      ]
    },
    "img-encore": {
      "pictos": "img-encore",
      "libelle": "encore quelque chose",
      "alt": "Encore quelque chose.",
      "ecrans": [
        "banque"
      ]
    },
    "img-pardon": {
      "pictos": "img-pardon",
      "libelle": "je demande de répéter",
      "alt": "Je ne comprends pas. Je demande de répéter.",
      "ecrans": [
        "s5",
        "apres"
      ]
    },
    "img-plus-de-cafe-noir": {
      "pictos": "img-plus-de-cafe-noir",
      "libelle": "plus de café noir",
      "alt": "Il n'y a plus de café noir.",
      "ecrans": [],
      "note_formateur": "Plus utilisée : le défi de S5 est devenu « Il n'y a plus de thé. Un café ? » (A2). Un pictogramme « plus de thé » reste à créer ; en attendant le défi montre seulement img-un-cafe."
    },
    "img-mode-formateur": {
      "pictos": "img-mode-formateur",
      "libelle": "avec mon formateur",
      "alt": "Avec mon formateur.",
      "ecrans": [
        "accueil"
      ]
    },
    "img-mode-groupe": {
      "pictos": "img-mode-groupe",
      "libelle": "en petit groupe",
      "alt": "En petit groupe.",
      "ecrans": [
        "accueil"
      ]
    },
    "img-mode-seul": {
      "pictos": "img-mode-seul",
      "libelle": "seul ou seule",
      "alt": "Seul ou seule.",
      "ecrans": [
        "accueil"
      ]
    },
    "img-micro": {
      "pictos": "img-micro",
      "libelle": "le micro",
      "alt": "Le micro.",
      "ecrans": [
        "accueil"
      ]
    },
    "img-plus-de-the": {
      "pictos": "img-plus-de-the",
      "libelle": "plus de thé",
      "alt": "Plus de thé. Une tasse de thé barrée d'une croix.",
      "ecrans": [
        "s5"
      ]
    },
    "img-je-ne-sais-pas": {
      "pictos": "img-je-ne-sais-pas",
      "libelle": "je ne sais pas",
      "alt": "Un point d'interrogation. Je ne sais pas.",
      "ecrans": [
        "s0",
        "s2",
        "s3",
        "s6",
        "banque"
      ]
    }
  },
  "sons": {
    "pers1-bonjour": {
      "type": "replique",
      "role": "serveur",
      "voix": "personnel-1",
      "texte": "Bonjour !",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "ACCUEIL"
    },
    "s0-question-vous": {
      "type": "replique",
      "role": "serveur",
      "voix": "personnel-1",
      "texte": "Et pour vous, café ou thé ?",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S0"
    },
    "pers1-prenez": {
      "type": "replique",
      "role": "serveur",
      "voix": "personnel-1",
      "texte": "Qu'est-ce que vous prenez ?",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "pers1-cest-tout": {
      "type": "replique",
      "role": "serveur",
      "voix": "personnel-1",
      "texte": "C'est tout ?",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "pers1-autre-chose": {
      "type": "replique",
      "role": "serveur",
      "voix": "personnel-1",
      "texte": "Autre chose ?",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "pers1-carte-ou-especes": {
      "type": "replique",
      "role": "serveur",
      "voix": "personnel-1",
      "texte": "Carte ou espèces ?",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S2"
    },
    "pers1-vous-desirez": {
      "type": "replique",
      "role": "serveur",
      "voix": "personnel-1",
      "texte": "Vous désirez ?",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "pers1-un-the": {
      "type": "replique",
      "role": "serveur",
      "voix": "personnel-1",
      "texte": "Un thé ?",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S5"
    },
    "pers1-tres-bien-merci": {
      "type": "replique",
      "role": "serveur",
      "voix": "personnel-1",
      "texte": "Très bien, merci.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S5"
    },
    "pers1-vous-payez-comment": {
      "type": "replique",
      "role": "serveur",
      "voix": "personnel-1",
      "texte": "Vous payez comment ?",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "pers1-trois-euros": {
      "type": "replique",
      "role": "serveur",
      "voix": "personnel-1",
      "texte": "Ça fait trois euros.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S5"
    },
    "pers1-plus-de-cafe-noir": {
      "type": "replique",
      "role": "serveur",
      "voix": "personnel-1",
      "texte": "Il n'y a plus de thé. Un café ?",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S5"
    },
    "s6-question-vous": {
      "type": "replique",
      "role": "serveuse",
      "voix": "personnel-2",
      "texte": "Et pour vous ?",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S6"
    },
    "j2-prenez": {
      "type": "replique",
      "role": "serveuse",
      "voix": "personnel-3",
      "texte": "Qu'est-ce que vous prenez ?",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "APRES"
    },
    "j2-cest-tout": {
      "type": "replique",
      "role": "serveuse",
      "voix": "personnel-3",
      "texte": "C'est tout ?",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "APRES"
    },
    "j2-carte-ou-especes": {
      "type": "replique",
      "role": "serveuse",
      "voix": "personnel-3",
      "texte": "Carte ou espèces ?",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "APRES"
    },
    "j7-prenez": {
      "type": "replique",
      "role": "serveur",
      "voix": "personnel-4",
      "texte": "Qu'est-ce que vous prenez ?",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "APRES"
    },
    "j7-un-the": {
      "type": "replique",
      "role": "serveur",
      "voix": "personnel-4",
      "texte": "Un thé ?",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "APRES"
    },
    "j7-carte-ou-especes": {
      "type": "replique",
      "role": "serveur",
      "voix": "personnel-4",
      "texte": "Carte ou espèces ?",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "APRES"
    },
    "j7-cest-tout": {
      "type": "replique",
      "role": "serveur",
      "voix": "personnel-4",
      "texte": "C'est tout ?",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "APRES"
    },
    "j7-vous-payez-comment": {
      "type": "replique",
      "role": "serveur",
      "voix": "personnel-4",
      "texte": "Vous payez comment ?",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "APRES"
    },
    "cli1-un-cafe-svp": {
      "type": "replique",
      "role": "cliente",
      "voix": "cliente-1",
      "texte": "Un café, s'il vous plaît.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S0"
    },
    "cli1-un-the-svp": {
      "type": "replique",
      "role": "cliente",
      "voix": "cliente-1",
      "texte": "Un thé, s'il vous plaît.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S0"
    },
    "cli1-un-jus-dorange-svp": {
      "type": "replique",
      "role": "cliente",
      "voix": "cliente-1",
      "texte": "Un jus d'orange, s'il vous plaît.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S4"
    },
    "cli1-oui-merci-cest-tout": {
      "type": "replique",
      "role": "cliente",
      "voix": "cliente-1",
      "texte": "Oui, merci, c'est tout.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "cli1-non-merci-cest-tout": {
      "type": "replique",
      "role": "cliente",
      "voix": "cliente-1",
      "texte": "Non merci, c'est tout.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "cli1-par-carte-svp": {
      "type": "replique",
      "role": "cliente",
      "voix": "cliente-1",
      "texte": "Par carte, s'il vous plaît.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S2"
    },
    "cli1-en-especes": {
      "type": "replique",
      "role": "cliente",
      "voix": "cliente-1",
      "texte": "En espèces.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "cli1-pardon-repeter": {
      "type": "replique",
      "role": "cliente",
      "voix": "cliente-1",
      "texte": "Pardon, vous pouvez répéter, s'il vous plaît ?",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S5"
    },
    "cli1-non-un-cafe-svp": {
      "type": "replique",
      "role": "cliente",
      "voix": "cliente-1",
      "texte": "Non, un café, s'il vous plaît.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S5"
    },
    "cli1-deux-thes-svp": {
      "type": "replique",
      "role": "cliente",
      "voix": "cliente-1",
      "texte": "Deux thés, s'il vous plaît.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S5"
    },
    "cli1-oui-merci": {
      "type": "replique",
      "role": "cliente",
      "voix": "cliente-1",
      "texte": "Oui, merci.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S5"
    },
    "cli1-non-merci": {
      "type": "replique",
      "role": "cliente",
      "voix": "cliente-1",
      "texte": "Non merci.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S5"
    },
    "cli1-un-cafe-long-daccord": {
      "type": "replique",
      "role": "cliente",
      "voix": "cliente-1",
      "texte": "Oui, un café, d'accord.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S5"
    },
    "cli1-cafe-moi-the-elle": {
      "type": "replique",
      "role": "cliente",
      "voix": "cliente-1",
      "texte": "Un café pour moi et un thé pour elle, s'il vous plaît.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "qui-cest-tout-question": {
      "type": "replique",
      "role": "serveur",
      "voix": "personnel-1",
      "texte": "C'est tout ?",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S2"
    },
    "qui-cest-tout-reponse": {
      "type": "replique",
      "role": "cliente",
      "voix": "cliente-1",
      "texte": "C'est tout, merci.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S2"
    },
    "c-accueil-situation": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Vous êtes au café, au comptoir. Vous parlez au serveur. Vous êtes le client ou la cliente. Aujourd'hui : vous comprenez, vous commandez, vous payez.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "ACCUEIL"
    },
    "c-accueil-choix": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Je travaille comment ? Mon niveau aujourd'hui. Aide dans ma langue. Vous essayez d'abord en français. L'aide vient après.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "ACCUEIL"
    },
    "c-accueil-micro": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Le micro : seulement si vous voulez. Vous pouvez vous enregistrer pour vous écouter. Votre voix reste sur cet appareil.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "ACCUEIL"
    },
    "c-s0-ecoute": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Vous êtes au café. Écoutez deux personnes : un serveur et une cliente. À la fin, la cliente veut combien de thés ? Vous pouvez écouter plusieurs fois.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S0"
    },
    "c-e-nombre": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Dites le nombre à voix haute. Puis sélectionnez le bon nombre.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S0"
    },
    "c-e-moment": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Qu'est-ce que la personne fait ? Sélectionnez l'image.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S2"
    },
    "c-s0-vous": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Écoutez le serveur. Répondez à voix haute. Vous pouvez dire : « Pardon ? »",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S0"
    },
    "c-s1-regarde": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Un homme et une femme sont au café. Regardez le film. Cherchez : qui parle au serveur ? Ils commandent quoi ? Vous n'avez pas besoin de comprendre tous les mots.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S1"
    },
    "c-s1-qui": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Qui parle au serveur ? Sélectionnez l'image qui correspond.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S1"
    },
    "c-s1-quoi": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Ils commandent quoi ? Sélectionnez les images. Puis cliquez sur « J'ai fini ».",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S1"
    },
    "c-s1-fin": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Regardez encore. À la fin, ils demandent quoi ?",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S1"
    },
    "c-s2-debut": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Vous allez écouter quatre petits moments. Écoutez la phrase. Sélectionnez l'image qui correspond. La personne commande, finit la commande ou paie. Exemple : « Un thé, s'il vous plaît. » La personne commande.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S2"
    },
    "c-s2-ecoute": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Écoutez la phrase. Vous pouvez écouter plusieurs fois.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S2"
    },
    "c-s2-qui": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Écoutez chaque phrase. Qui parle : le serveur ou le client ? Sélectionnez l'image.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S2"
    },
    "c-s2-table-comptoir": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Dans le film : à table. Ils demandent l'addition à la fin. Aujourd'hui : au comptoir. Vous commandez, puis vous payez. Vous comprenez « L'addition, s'il vous plaît ». Aujourd'hui, vous ne la dites pas.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S2"
    },
    "c-s2-d": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Deux autres personnes parlent au comptoir. Écoutez-les. Vous pouvez écouter plusieurs fois.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S2"
    },
    "c-s2-paie": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "La cliente paie comment ? Sélectionnez l'image.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S2"
    },
    "c-s3-ecoute": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Écoutez le serveur et la cliente. Vous pouvez écouter plusieurs fois.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "c-s3-lisez": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Lisez la phrase. Écoutez la phrase. Dites la réponse à voix haute.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "c-s3-change-1": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Maintenant, vous voulez un thé. Changez un seul mot. Écoutez le serveur. Répondez à voix haute.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "c-s3-change-2": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Le serveur change sa question. Écoutez le serveur. Répondez à voix haute.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "c-s3-change-3": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Maintenant, vous payez avec des billets. Changez la réponse. Écoutez le serveur. Répondez à voix haute.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "c-s3-sans-texte": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Maintenant, sans le texte et sans image. Écoutez le serveur. Répondez à voix haute.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "c-s4-ecoute": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Écoutez la femme du film.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S4"
    },
    "c-s4-ensemble": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "« S'il vous plaît » va ensemble. Ne vous arrêtez pas au milieu.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S4"
    },
    "c-s4-dites": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Dites la phrase à voix haute.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S4"
    },
    "c-s4-vous": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Maintenant, vous. Vous voulez quoi ? Sélectionnez une image.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S4"
    },
    "c-s4-geste": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Si vous voulez, redites votre commande à voix haute. Faites un geste de la main. Un seul geste pour toute la phrase.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S4"
    },
    "c-s5-pardon": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Vous ne comprenez pas le serveur ? Demandez de répéter. Écoutez la phrase. Dites-la à voix haute.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S5"
    },
    "c-s5-conv1": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Conversation 1. Vous voulez un café. Le serveur pose une question. Écoutez bien. Répondez à voix haute.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S5"
    },
    "c-s5-conv2": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Conversation 2. Regardez vos deux images. Ne les montrez pas au serveur. Commandez. Puis répondez à voix haute.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S5"
    },
    "c-s5-conv3": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Conversation 3. Sans texte, sans image. Vous voulez un café. Écoutez bien le serveur. Répondez à voix haute.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S5"
    },
    "c-s5-defi": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Un exercice plus difficile, si vous voulez. Vous voulez un thé.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S5"
    },
    "c-s6-ecoute": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Vous êtes au café. Écoutez deux nouvelles personnes : une serveuse et une cliente. À la fin, la cliente veut combien de cafés ? Vous pouvez écouter plusieurs fois.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S6"
    },
    "c-s6-vous": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Écoutez la serveuse. Répondez à voix haute. Vous pouvez demander de répéter.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S6"
    },
    "c-bilan": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Ce que j'ai fait aujourd'hui. Ce sont deux dialogues différents. Les voix changent. La boisson change. Ce n'est pas un examen. Il n'y a pas de note.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S6"
    },
    "c-apres-debut": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Revenez deux fois. Dans 2 jours : 3 à 5 minutes. Dans 7 jours : 3 à 5 minutes.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "APRES"
    },
    "c-apres-phrases": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Une nouvelle serveuse vous parle. Écoutez la serveuse. Répondez à voix haute. Ne regardez pas vos phrases.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "APRES"
    },
    "c-b-ecoute": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Écoutez deux personnes au café. Vous pouvez écouter plusieurs fois. La question arrive après.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "BANQUE"
    },
    "c-b-fini-ou-encore": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Le client a fini ? Ou il veut encore quelque chose ? Sélectionnez la bonne réponse.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "BANQUE"
    },
    "c-b-paie": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Le client paie comment ? Sélectionnez la bonne réponse.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "BANQUE"
    },
    "c-b-t3": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "À la fin, le client prend quoi ? Sélectionnez la bonne réponse.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "BANQUE"
    },
    "c-b-t4": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Le client veut combien de thés ? Dites le nombre à voix haute. Puis sélectionnez le bon nombre.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "BANQUE"
    },
    "s0-dialogue": {
      "type": "dialogue",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "etiquette": "Dialogue créé pour le cours",
      "ecran": "S0",
      "repliques": [
        {
          "id": "s0-dialogue-t1",
          "role": "serveur",
          "voix": "personnel-1",
          "texte": "Un café et un thé ?"
        },
        {
          "id": "s0-dialogue-t2",
          "role": "cliente",
          "voix": "cliente-1",
          "texte": "Non, deux thés, s'il vous plaît."
        },
        {
          "id": "s0-dialogue-t3",
          "role": "serveur",
          "voix": "personnel-1",
          "texte": "Deux thés, d'accord."
        }
      ]
    },
    "s0-r2": {
      "type": "replique",
      "role": "cliente",
      "voix": "cliente-1",
      "texte": "Non, deux thés, s'il vous plaît.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S0",
      "decoupe_de": "s0-dialogue-t2"
    },
    "s6-dialogue": {
      "type": "dialogue",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "etiquette": "Dialogue créé pour le cours",
      "ecran": "S6",
      "repliques": [
        {
          "id": "s6-dialogue-t1",
          "role": "serveuse",
          "voix": "personnel-2",
          "texte": "Un café et un thé ?"
        },
        {
          "id": "s6-dialogue-t2",
          "role": "cliente",
          "voix": "cliente-2",
          "texte": "Non, deux cafés, s'il vous plaît."
        },
        {
          "id": "s6-dialogue-t3",
          "role": "serveuse",
          "voix": "personnel-2",
          "texte": "Deux cafés, d'accord."
        }
      ]
    },
    "s6-r2": {
      "type": "replique",
      "role": "cliente",
      "voix": "cliente-2",
      "texte": "Non, deux cafés, s'il vous plaît.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S6",
      "decoupe_de": "s6-dialogue-t2"
    },
    "ech-carte-especes": {
      "type": "dialogue",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "etiquette": "Dialogue créé pour le cours",
      "ecran": "S2",
      "repliques": [
        {
          "id": "ech-carte-especes-t1",
          "role": "serveur",
          "voix": "personnel-1",
          "texte": "Carte ou espèces ?"
        },
        {
          "id": "ech-carte-especes-t2",
          "role": "cliente",
          "voix": "cliente-1",
          "texte": "Par carte, s'il vous plaît."
        }
      ]
    },
    "ech-prenez-cafe": {
      "type": "dialogue",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "etiquette": "Dialogue créé pour le cours",
      "ecran": "S3",
      "repliques": [
        {
          "id": "ech-prenez-cafe-t1",
          "role": "serveur",
          "voix": "personnel-1",
          "texte": "Qu'est-ce que vous prenez ?"
        },
        {
          "id": "ech-prenez-cafe-t2",
          "role": "cliente",
          "voix": "cliente-1",
          "texte": "Un café, s'il vous plaît."
        }
      ]
    },
    "ech-cest-tout": {
      "type": "dialogue",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "etiquette": "Dialogue créé pour le cours",
      "ecran": "S3",
      "repliques": [
        {
          "id": "ech-cest-tout-t1",
          "role": "serveur",
          "voix": "personnel-1",
          "texte": "C'est tout ?"
        },
        {
          "id": "ech-cest-tout-t2",
          "role": "cliente",
          "voix": "cliente-1",
          "texte": "Oui, merci, c'est tout."
        }
      ]
    },
    "b-d1": {
      "type": "dialogue",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "etiquette": "Dialogue créé pour le cours",
      "ecran": "BANQUE",
      "repliques": [
        {
          "id": "b-d1-t1",
          "role": "serveuse",
          "voix": "personnel-3",
          "texte": "C'est tout ?"
        },
        {
          "id": "b-d1-t2",
          "role": "client",
          "voix": "client-3",
          "texte": "Non, un thé aussi, s'il vous plaît."
        }
      ]
    },
    "b-d2": {
      "type": "dialogue",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "etiquette": "Dialogue créé pour le cours",
      "ecran": "BANQUE",
      "repliques": [
        {
          "id": "b-d2-t1",
          "role": "serveuse",
          "voix": "personnel-3",
          "texte": "Vous payez en espèces ?"
        },
        {
          "id": "b-d2-t2",
          "role": "client",
          "voix": "client-3",
          "texte": "Non, par carte."
        }
      ]
    },
    "b-t1": {
      "type": "dialogue",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "etiquette": "Dialogue créé pour le cours",
      "ecran": "BANQUE",
      "repliques": [
        {
          "id": "b-t1-t1",
          "role": "serveuse",
          "voix": "personnel-3",
          "texte": "C'est tout ?"
        },
        {
          "id": "b-t1-t2",
          "role": "client",
          "voix": "client-3",
          "texte": "Non, un croissant aussi, s'il vous plaît."
        }
      ]
    },
    "b-t2": {
      "type": "dialogue",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "etiquette": "Dialogue créé pour le cours",
      "ecran": "BANQUE",
      "repliques": [
        {
          "id": "b-t2-t1",
          "role": "serveuse",
          "voix": "personnel-3",
          "texte": "Vous payez par carte ?"
        },
        {
          "id": "b-t2-t2",
          "role": "client",
          "voix": "client-3",
          "texte": "Non, en espèces."
        }
      ]
    },
    "b-t3": {
      "type": "dialogue",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "etiquette": "Dialogue créé pour le cours",
      "ecran": "BANQUE",
      "repliques": [
        {
          "id": "b-t3-t1",
          "role": "client",
          "voix": "client-4",
          "texte": "Un café, s'il vous plaît."
        },
        {
          "id": "b-t3-t2",
          "role": "serveur",
          "voix": "personnel-4",
          "texte": "Et un croissant ?"
        },
        {
          "id": "b-t3-t3",
          "role": "client",
          "voix": "client-4",
          "texte": "Non merci, c'est tout."
        }
      ]
    },
    "b-t4": {
      "type": "dialogue",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "etiquette": "Dialogue créé pour le cours",
      "ecran": "BANQUE",
      "repliques": [
        {
          "id": "b-t4-t1",
          "role": "client",
          "voix": "client-4",
          "texte": "Pour moi, un thé."
        },
        {
          "id": "b-t4-t2",
          "role": "serveur",
          "voix": "personnel-4",
          "texte": "Deux thés ?"
        },
        {
          "id": "b-t4-t3",
          "role": "client",
          "voix": "client-4",
          "texte": "Non, un thé."
        }
      ]
    },
    "b-t4-un-seul": {
      "type": "dialogue",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "etiquette": "Dialogue créé pour le cours",
      "ecran": "BANQUE",
      "repliques": [
        {
          "id": "b-t4-un-seul-t1",
          "role": "client",
          "voix": "client-4",
          "texte": "Pour moi, un thé."
        },
        {
          "id": "b-t4-un-seul-t2",
          "role": "serveur",
          "voix": "personnel-4",
          "texte": "Deux thés ?"
        },
        {
          "id": "b-t4-un-seul-t3",
          "role": "client",
          "voix": "client-4",
          "texte": "Non, un seul, s'il vous plaît."
        }
      ]
    },
    "r-s0-1": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Merci. Écoutez les réponses possibles.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S0"
    },
    "r-s0-2": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Merci. Vous allez apprendre ces phrases aujourd'hui. Cliquez sur « Étape suivante ».",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S0"
    },
    "r-s4-1": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Écoutez une réponse. Dites-la à voix haute. Puis réessayez.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S4"
    },
    "r-s5-1": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Fin des conversations. Vous avez commandé et payé en français. Cliquez sur « Étape suivante ».",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S5"
    },
    "r-s5-2": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Fin des conversations. Vous avez commandé en français. Cliquez sur « Étape suivante ».",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S5"
    },
    "r-s4-2": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Écoutez-vous. « S'il vous plaît » : ça va ensemble ?",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S4"
    },
    "r-s6-1": {
      "type": "retour",
      "voix": "consigne",
      "texte": "C'est normal. Vous allez revoir ces phrases dans 2 jours.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S6"
    },
    "r-apres-1": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Deux dialogues nouveaux, avec des voix nouvelles.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "APRES"
    },
    "r-apres-2": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Pas de nouveau dialogue aujourd'hui. Revenez dans 5 jours.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "APRES"
    },
    "r-s0-3": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Merci. Vous verrez la bonne réponse à la fin du cours. Cliquez sur « Suite ».",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S0"
    },
    "r-s0-4": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Écoutez le modèle. Comparez avec votre voix.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S0"
    },
    "c-e-reponse": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Sélectionnez la bonne réponse.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "BANQUE"
    },
    "c-accueil-bonjour": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Le serveur arrive. Dites bonjour.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "ACCUEIL"
    },
    "cli1-bonjour": {
      "type": "replique",
      "role": "cliente",
      "voix": "cliente-1",
      "texte": "Bonjour !",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "ACCUEIL"
    },
    "c-s1-court": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Regardez un petit morceau. La personne commande quoi ?",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S1"
    },
    "r-s1-1": {
      "type": "retour",
      "voix": "consigne",
      "texte": "La personne commande un café noir. Cliquez sur « Un autre morceau ».",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S1"
    },
    "r-s1-2": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Les deux parlent au serveur. La femme et l'homme commandent.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S1"
    },
    "r-s1-3": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Dans le film : un café noir, un café long, un jus d'orange, un croissant.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S1"
    },
    "r-s1-4": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Le thé n'est pas dans le film.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S1"
    },
    "r-s1-5": {
      "type": "retour",
      "voix": "consigne",
      "texte": "L'eau n'est pas dans le film.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S1"
    },
    "r-s1-6": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Le sandwich n'est pas dans le film.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S1"
    },
    "c-s1-jus": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Qui prend le jus d'orange ? Sélectionnez la bonne réponse.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S1"
    },
    "r-s1-7": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Le jus d'orange est pour l'homme.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S1"
    },
    "c-s1-croissant": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Qui prend le croissant ? Sélectionnez la bonne réponse.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S1"
    },
    "r-s1-8": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Le croissant est pour la femme.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S1"
    },
    "c-s1-fin-q": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "À la fin, ils demandent quoi ? Sélectionnez la bonne réponse.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S1"
    },
    "r-s1-9": {
      "type": "retour",
      "voix": "consigne",
      "texte": "À la fin, ils demandent l'addition : ils veulent payer.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S1"
    },
    "r-s2-1": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Ici, la femme commande. Elle demande une boisson : un café noir.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S2"
    },
    "r-s2-2": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Oui. Ici, la femme commande. Elle demande une boisson : un café noir.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S2"
    },
    "r-s2-3": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Le serveur demande : « C'est tout ? » Le client répond oui : c'est fini.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S2"
    },
    "r-s2-4": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Oui. Le serveur demande : « C'est tout ? » Le client répond oui : c'est fini.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S2"
    },
    "r-s2-5": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Ici, la personne veut payer. Elle demande l'addition.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S2"
    },
    "r-s2-6": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Oui. Ici, la personne veut payer. Elle demande l'addition.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S2"
    },
    "r-s2-7": {
      "type": "retour",
      "voix": "consigne",
      "texte": "« C'est tout ? » : le serveur pose une question. « C'est tout, merci. » : le client répond.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S2"
    },
    "c-s2-paie-plus": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "La cliente paie comment ? Dites-le à voix haute.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S2"
    },
    "r-s2-8": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Oui. Le serveur demande comment payer.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S2"
    },
    "r-s2-9": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Ici, le serveur demande comment payer. Écoutez encore le début.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S2"
    },
    "r-s2-10": {
      "type": "retour",
      "voix": "consigne",
      "texte": "La cliente paie par carte.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S2"
    },
    "r-s2-11": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Le serveur propose deux choix. La cliente choisit : « par carte ».",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S2"
    },
    "c-s2-d7": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Dans le film, le serveur pose la même question. Écoutez la réponse.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S2"
    },
    "r-s2-12": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Dans le film, ils paient en espèces.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S2"
    },
    "c-s2-d7-plus": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Dans le film, ils paient comment ?",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S2"
    },
    "r-s3-1": {
      "type": "retour",
      "voix": "consigne",
      "texte": "La cliente commande : elle demande un café.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "r-s3-2": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Oui. La cliente commande : elle demande un café.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "r-s3-3": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Le serveur demande : vous avez fini ? La cliente répond : oui, c'est tout.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "r-s3-4": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Oui. Le serveur demande : vous avez fini ? La cliente répond : oui, c'est tout.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "r-s3-5": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Le serveur demande comment payer. La cliente paie par carte.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "r-s3-6": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Oui. Le serveur demande comment payer. La cliente paie par carte.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "r-s3-7": {
      "type": "retour",
      "voix": "consigne",
      "texte": "« C'est tout ? » → oui. « Autre chose ? » → non. Les deux réponses disent : j'ai fini.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "c-s3-carte-simple": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Le serveur dit : « Carte ou espèces ? » Sélectionnez l'image, ou dites un mot à voix haute.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "c-s3-sans-texte-s": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Maintenant, sans le texte. Écoutez le serveur. Répondez à voix haute.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "c-s3-deux": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Une collègue est avec vous. Commandez pour deux.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "r-s3-8": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Le serveur doit comprendre : un thé.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "r-s3-9": {
      "type": "retour",
      "voix": "consigne",
      "texte": "« Autre chose ? » = le serveur demande une autre boisson. Vous avez fini ? Dites : « Non merci, c'est tout. »",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "r-s3-10": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Le serveur doit comprendre : des billets, pas la carte.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "r-s3-11": {
      "type": "retour",
      "voix": "consigne",
      "texte": "« Vous désirez ? » = « Qu'est-ce que vous prenez ? ». Vous commandez.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S3"
    },
    "c-s4-fini": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Elle a fini de commander ? Cliquez sur votre réponse.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S4"
    },
    "r-s4-3": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Oui. Elle a fini : elle dit « s'il vous plaît » à la fin.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S4"
    },
    "r-s4-4": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Écoutez encore. Elle dit « s'il vous plaît », et elle a fini.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S4"
    },
    "r-s4-5": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Écoutez encore la cliente. Puis dites la phrase encore une fois à voix haute.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S4"
    },
    "c-s4-vous-dire": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Dites votre commande à voix haute. Ne vous arrêtez pas au milieu.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S4"
    },
    "r-s4-6": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Comparez avec votre réponse.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S4"
    },
    "c-s5-formateur": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Écoutez votre formateur : une seule chose à changer.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S5"
    },
    "c-s5-seul": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Regardez les réponses possibles. Choisissez une phrase. Redites-la à voix haute.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S5"
    },
    "c-s5-verif": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Regardez vos images. Le serveur a compris la même chose ?",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S5"
    },
    "r-s5-3": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Dites encore votre commande ou votre paiement à voix haute.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S5"
    },
    "r-s5-4": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Le serveur a compris « un thé ». Vous dites « non » et vous redites votre boisson.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S5"
    },
    "r-s5-5": {
      "type": "retour",
      "voix": "consigne",
      "texte": "« Il n'y a plus de thé » = le thé, c'est fini. Le serveur propose un café.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S5"
    },
    "r-s6-2": {
      "type": "retour",
      "voix": "consigne",
      "texte": "La cliente dit « Non ». Elle change : deux cafés.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S6"
    },
    "r-s6-3": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Merci. C'est la fin du cours. Cliquez sur « Après le cours ».",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S6"
    },
    "c-apres-bloc-a": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Deux dialogues nouveaux, avec des voix nouvelles.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "APRES"
    },
    "r-apres-3": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Merci. Vous avez fini ces dialogues. Vous pouvez fermer cette page.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "APRES"
    },
    "c-apres-pardon": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Vous ne comprenez pas la serveuse. Vous dites quoi ?",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "APRES"
    },
    "r-apres-4": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Écoutez la phrase. Dites-la à voix haute. Vous la retrouverez dans 7 jours.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "APRES"
    },
    "c-apres-dialogues": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Écoutez deux dialogues nouveaux.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "APRES"
    },
    "c-apres-phrases-j7": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Un nouveau serveur vous parle. Vous voulez un café. Écoutez le serveur. Répondez à voix haute. Ne regardez pas vos phrases.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "APRES"
    },
    "r-apres-5": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Écoutez la phrase. Dites-la à voix haute. Vous la retrouverez au prochain cours.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "APRES"
    },
    "r-apres-6": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Merci. Vous avez fini le cours. Vous pouvez fermer cette page.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "APRES"
    },
    "r-banque-1": {
      "type": "retour",
      "voix": "consigne",
      "texte": "La serveuse demande : « C'est tout ? » Le client dit non et ajoute un thé.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "BANQUE"
    },
    "r-banque-2": {
      "type": "retour",
      "voix": "consigne",
      "texte": "La serveuse demande : « en espèces ? » Le client dit non : il paie par carte.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "BANQUE"
    },
    "r-banque-3": {
      "type": "retour",
      "voix": "consigne",
      "texte": "La serveuse demande : « C'est tout ? » Le client dit non et ajoute un croissant.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "BANQUE"
    },
    "r-banque-4": {
      "type": "retour",
      "voix": "consigne",
      "texte": "La serveuse demande : « par carte ? » Le client dit non : il paie en espèces.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "BANQUE"
    },
    "r-banque-5": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Le serveur propose un croissant. Le client dit non : il prend un café seulement.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "BANQUE"
    },
    "r-banque-6": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Le serveur demande : « Deux thés ? » Le client dit non : il veut un thé.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "BANQUE"
    },
    "c-e-nombre-s0": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "À la fin, la cliente veut combien de thés ? Dites le nombre à voix haute. Puis sélectionnez le bon nombre.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S0"
    },
    "c-e-nombre-groupe-s0": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "À la fin, la cliente veut combien de thés ? Ne parlez pas. Sélectionnez le bon nombre.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S0"
    },
    "c-e-images-s0": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "À la fin, la cliente veut combien de thés ? Regardez les deux images. Sélectionnez la bonne réponse.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S0"
    },
    "c-e-nombre-s6": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "À la fin, la cliente veut combien de cafés ? Dites le nombre à voix haute. Puis sélectionnez le bon nombre.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S6"
    },
    "c-e-nombre-groupe-s6": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "À la fin, la cliente veut combien de cafés ? Ne parlez pas. Sélectionnez le bon nombre.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S6"
    },
    "c-e-images-s6": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "À la fin, la cliente veut combien de cafés ? Regardez les deux images. Sélectionnez la bonne réponse.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S6"
    },
    "c-b-t4-images": {
      "type": "consigne",
      "voix": "consigne",
      "texte": "Le client veut combien de thés ? Sélectionnez la bonne réponse.",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "BANQUE"
    },
    "r-s0-5": {
      "type": "retour",
      "voix": "consigne",
      "texte": "Merci. Vous allez apprendre ces phrases aujourd'hui. Cliquez sur « Je commence ».",
      "source": "N",
      "statut": "non_valide_a_l_ecoute",
      "ecran": "S0"
    }
  },
  "interface": {
    "navigation": {
      "etape_n_sur_7": "Étape {n} sur 7",
      "duree_min": "{n} min",
      "suite": "Suite",
      "retour": "Retour",
      "etape_suivante": "Étape suivante",
      "etape_precedente": "Étape précédente",
      "reglages": "Réglages",
      "je_commence": "Je commence",
      "d_accord": "D'accord",
      "formateur": "Formateur",
      "etiquette_film": "",
      "etiquette_cree": "",
      "note_film": "",
      "etat_a_faire": "À faire",
      "etat_en_cours": "En cours",
      "etat_deja_fait": "Déjà fait",
      "etat_fait_le": "Fait le {date}",
      "retour_bloque": ""
    },
    "reglages": {
      "mode_titre": "Je travaille comment ?",
      "mode_formateur": "Avec mon formateur",
      "mode_groupe": "En petit groupe",
      "mode_seul": "Seul(e)",
      "palier_titre": "Mon niveau aujourd'hui",
      "palier_simple": "Plus simple",
      "palier_simple_sous_titre": "Je commence le français.",
      "palier_normal": "Normal",
      "palier_normal_sous_titre": "Je connais quelques mots.",
      "palier_plus": "Un peu plus",
      "palier_plus_sous_titre": "Je parle déjà un peu.",
      "aide_titre": "Aide dans ma langue",
      "aide_aucune": "Aucune",
      "aide_es": "Español",
      "aide_it": "Italiano",
      "aide_note": "Vous essayez d'abord en français. L'aide vient après."
    },
    "sons_et_film": {
      "ecouter": "▶ Écouter",
      "ecouter_encore": "▶ Écouter encore",
      "reecouter": "▶ Réécouter",
      "regarder": "▶ Regarder",
      "regarder_encore": "▶ Regarder encore",
      "ecouter_le_serveur": "▶ Écouter le serveur",
      "ecouter_la_serveuse": "▶ Écouter la serveuse",
      "la_cliente": "▶ La cliente",
      "le_debut": "▶ Le début",
      "phrase_1": "▶ Phrase 1",
      "phrase_2": "▶ Phrase 2",
      "un_autre_morceau": "▶ Un autre morceau",
      "ecouter_la_consigne": "🔊 Écouter ce qu'il faut faire",
      "un_peu_plus_lent": "Un peu plus lent",
      "arreter": "■ Arrêter",
      "ecoutez": "Écoutez…",
      "film_arrive": "Le film arrive…",
      "ecoute_1": "1re écoute",
      "ecoute_2": "2e écoute",
      "trop_long": "C'est trop long ? Un morceau court",
      "voir_toute_la_scene": "Voir toute la scène",
      "voir_les_mots_du_film": "Voir les mots du film"
    },
    "reponses": {
      "chiffre_1": "1",
      "chiffre_2": "2",
      "chiffre_3": "3",
      "chiffre_4": "4",
      "je_ne_sais_pas": "Je ne sais pas",
      "c_est_dit": "C'est dit",
      "j_ai_une_idee": "J'ai une idée",
      "j_ai_fini": "J'ai fini",
      "je_l_ai_dit": "Je l'ai dit",
      "j_ai_dit_la_phrase": "J'ai dit la phrase",
      "j_ai_dit_ma_commande": "J'ai dit ma commande",
      "c_est_fait": "C'est fait",
      "je_passe": "Je passe",
      "j_ai_repondu": "J'ai répondu",
      "j_ai_dit_pardon": "J'ai dit « Pardon ? »",
      "j_ai_demande_de_repeter": "J'ai demandé de répéter",
      "je_demande_de_repeter": "Je demande de répéter",
      "je_n_ai_pas_repondu": "Je n'ai pas répondu",
      "a_vous_repondez": "À vous ! Répondez.",
      "reponses_possibles": "Réponses possibles",
      "aussi_possible": "Aussi possible :",
      "comparez": "Comparez avec votre réponse.",
      "j_ai_dit_ca_ou_presque": "J'ai dit ça, ou presque",
      "pas_encore": "Pas encore",
      "reessayer": "Réessayer",
      "voir_une_reponse_possible": "Voir une réponse possible",
      "je_redis_une_phrase": "Je redis une phrase",
      "c_est_bon": "C'est bon",
      "conversation_finie": "Conversation finie",
      "oui": "Oui",
      "non": "Non",
      "je_fais_le_defi": "Je fais le défi",
      "voir_une_image": "Voir une image",
      "voir_les_images": "Voir les images",
      "voir_la_phrase": "Voir la phrase",
      "revoir_le_texte": "Revoir le texte",
      "le_serveur_dit": "Le serveur dit :",
      "la_serveuse_dit": "La serveuse dit :",
      "vous_pouvez_dire": "Vous pouvez dire :",
      "le_serveur_demande": "Le serveur demande :",
      "le_client_repond": "Le client répond :"
    },
    "messages": {
      "vous_allez_repondre": "Vous pouvez écouter plusieurs fois.",
      "merci_c_est_note": "Merci.",
      "reponse_fin_du_cours": "Vous verrez la bonne réponse à la fin du cours. Cliquez sur « Suite ».",
      "merci_on_continue": "Merci. Écoutez les réponses possibles.",
      "merci_vous_allez_apprendre": "Merci. Vous allez apprendre ces phrases aujourd'hui. Cliquez sur « Étape suivante ».",
      "ecoutez_une_reponse": "Écoutez une réponse. Dites-la à voix haute. Puis réessayez.",
      "fin_conversations": "Fin des conversations. Vous avez commandé et payé en français. Cliquez sur « Étape suivante ».",
      "fin_conversations_simple": "Fin des conversations. Vous avez commandé en français. Cliquez sur « Étape suivante ».",
      "groupe_ne_parlez_pas_nombre": "Ne parlez pas. Sélectionnez le bon nombre.",
      "groupe_ne_parlez_pas_penser": "Ne parlez pas. Pensez à votre réponse.",
      "ecoutez_vous_ensemble": "Écoutez-vous. « S'il vous plaît » : ça va ensemble ?",
      "merci_vous_allez_apprendre_si_suite": "Merci. Vous allez apprendre ces phrases aujourd'hui. Cliquez sur « Je commence »."
    },
    "aide_de_langue": {
      "ayuda_es": "Ayuda en español",
      "aiuto_it": "Aiuto in italiano",
      "fermer_l_aide": "Fermer l'aide"
    },
    "enregistrement": {
      "m_enregistrer": "● M'enregistrer (si je veux)",
      "arreter": "■ Arrêter",
      "m_ecouter": "▶ M'écouter",
      "effacer": "Effacer",
      "j_enregistre": "J'enregistre…"
    },
    "bilan": {
      "titre": "Ce que j'ai fait aujourd'hui",
      "voir_dialogue_debut": "Voir et écouter le dialogue du début",
      "sait_dire_titre": "Ce que je sais dire",
      "je_sais_le_dire": "Je sais le dire",
      "pas_encore": "Pas encore",
      "pour_la_prochaine_fois": "Pour la prochaine fois",
      "c_est_normal_revoir": "C'est normal. Vous allez revoir ces phrases dans 2 jours.",
      "montrer_au_formateur": "Vous pouvez montrer cette page à votre formateur.",
      "exporter": "Exporter mes réponses",
      "exporter_note": "(= copier le texte ou enregistrer un fichier pour mon formateur)",
      "copier_le_texte": "Copier le texte",
      "telecharger_csv": "Télécharger le fichier CSV",
      "telecharger_json": "Télécharger le fichier JSON",
      "copie_ok": "C'est copié.",
      "apres_le_cours": "Après le cours"
    },
    "apres_le_cours": {
      "titre": "Après le cours : je continue",
      "revenez_deux_fois": "Revenez deux fois :",
      "dans_2_jours": "Dans 2 jours : {date} — 3 à 5 minutes",
      "dans_7_jours": "Dans 7 jours : {date} — 3 à 5 minutes",
      "bloc_aujourdhui": "Aujourd'hui, si je veux",
      "bloc_2_jours": "Dans 2 jours",
      "bloc_7_jours": "Dans 7 jours",
      "plus_tard": "Plus tard",
      "deux_dialogues_nouveaux": "Deux dialogues nouveaux, avec des voix nouvelles.",
      "pas_de_nouveau_dialogue": "Pas de nouveau dialogue aujourd'hui. Revenez dans 5 jours.",
      "merci_revenez_le": "Merci. Revenez le {date}. Vous pouvez fermer cette page.",
      "aller_plus_loin": "Si je veux aller plus loin",
      "regarder_tout_le_film": "Regarder tout le film (5 minutes)",
      "me_presenter": "Me présenter : nom, pays, ville"
    },
    "groupe_serveur": {
      "carte_serveur_titre": "Carte du serveur — ne la montrez pas",
      "carte_serveur_consigne": "Lisez la question au client. Vous pouvez d'abord l'écouter."
    },
    "erreurs": {
      "micro_refuse": "Le micro n'est pas autorisé. Ce n'est pas grave : parlez sans enregistrer.",
      "pas_de_micro": "Je ne trouve pas de micro. Parlez sans enregistrer.",
      "enregistrement_rate": "L'enregistrement n'a pas marché. Essayez encore, ou continuez sans enregistrer.",
      "son_coupe": "Le son n'a pas marché.",
      "recommencer_ecoute": "Recommencer l'écoute",
      "pas_de_reseau": "Pas d'Internet. Vérifiez la connexion, puis cliquez sur « Réessayer ».",
      "film_indisponible": "Le film ne marche pas. Cliquez sur « Continuer sans le son ».",
      "reponses_non_gardees": "Attention : vos réponses ne sont pas gardées sur cet appareil.",
      "copie_impossible": "La copie n'a pas marché. Sélectionnez le texte et copiez-le."
    },
    "export_fenetre": {
      "note": "Vos réponses restent sur cet appareil. Rien n'est envoyé tout seul. Les sons ne sont pas dans ces fichiers."
    },
    "moteur": {
      "aller_au_contenu": "Aller au contenu",
      "theme_bascule": "Clair / sombre",
      "reglages_titre": "Mes réglages",
      "les_etapes": "Les étapes",
      "navigation_titre": "Aller à l'écran d'avant ou d'après",
      "fermer": "Fermer",
      "tout_effacer": "Tout effacer",
      "confirmer_effacer": "Effacer toutes mes réponses sur cet appareil ?",
      "oui_effacer": "Oui, tout effacer",
      "annuler": "Annuler",
      "bandeau_mode": "Mode",
      "bandeau_niveau": "Niveau",
      "bandeau_aide": "Aide",
      "vue_formateur": "Vue formateur",
      "pour_le_formateur": "Pour le formateur :",
      "continuer_sans_son": "Continuer sans le son",
      "son_pas_disponible": "Le son n'est pas encore disponible.",
      "rec_consigne": "Facultatif. Cliquez sur « M'enregistrer », puis dites votre phrase à voix haute.",
      "avec_les_images": "Avec les images",
      "bloc_a_venir": "Cette partie n'est pas encore prête."
    },
    "v3": {
      "ecouter": "Écouter",
      "ecouter_encore": "Écouter encore",
      "je_reponds": "Je réponds",
      "revenir": "← Revenir",
      "suite": "Suite",
      "ecouter_le_serveur": "Écouter le serveur",
      "ecouter_le_modele": "Écouter le modèle",
      "m_enregistrer": "M'enregistrer",
      "arreter": "Arrêter",
      "m_ecouter": "M'écouter",
      "comparer": "Écoutez le modèle. Comparez avec votre voix.",
      "je_ne_sais_pas": "Je ne sais pas",
      "regarder": "Regarder",
      "ecouter_la_reponse": "Écouter la réponse",
      "fin_s0": "Merci. Vous verrez la bonne réponse à la fin du cours. Cliquez sur « Suite ».",
      "fenetre": "Fenêtre {n} sur {total}",
      "rec_consigne": "Facultatif. Cliquez sur « M'enregistrer », puis dites votre phrase à voix haute."
    }
  },
  "ecrans": [
    {
      "id": "accueil",
      "titre": "Au café : je comprends, je commande, je paie",
      "duree_min": 1,
      "etape": "Avant le cours",
      "objectif": "Aujourd'hui, vous commandez une boisson au café et vous payez, en français.",
      "pas": [
        {
          "type": "texte",
          "id": "A.1",
          "image": "img-comptoir",
          "consigne": "c-accueil-situation",
          "lignes": [
            "Vous êtes au café, au comptoir (= le bar du café).",
            "Vous parlez au serveur (= il travaille au café).",
            "Vous êtes le client ou la cliente (= la personne qui achète).",
            "Aujourd'hui : vous comprenez, vous commandez (= vous demandez une boisson), vous payez."
          ],
          "bouton": "suite"
        },
        {
          "type": "reglages",
          "id": "A.2",
          "consigne": "c-accueil-choix",
          "groupes": [
            {
              "cle": "mode",
              "question": "mode_titre",
              "defaut": "formateur",
              "options": [
                {
                  "valeur": "formateur",
                  "libelle": "mode_formateur",
                  "image": "img-mode-formateur"
                },
                {
                  "valeur": "groupe",
                  "libelle": "mode_groupe",
                  "image": "img-mode-groupe"
                },
                {
                  "valeur": "seul",
                  "libelle": "mode_seul",
                  "image": "img-mode-seul"
                }
              ]
            },
            {
              "cle": "palier",
              "question": "palier_titre",
              "defaut": "normal",
              "options": [
                {
                  "valeur": "simple",
                  "libelle": "palier_simple",
                  "sous_titre": "palier_simple_sous_titre"
                },
                {
                  "valeur": "normal",
                  "libelle": "palier_normal",
                  "sous_titre": "palier_normal_sous_titre"
                },
                {
                  "valeur": "plus",
                  "libelle": "palier_plus",
                  "sous_titre": "palier_plus_sous_titre"
                }
              ]
            },
            {
              "cle": "aide",
              "question": "aide_titre",
              "defaut": "aucune",
              "note": "aide_note",
              "options": [
                {
                  "valeur": "aucune",
                  "libelle": "aide_aucune"
                },
                {
                  "valeur": "es",
                  "libelle": "aide_es"
                },
                {
                  "valeur": "it",
                  "libelle": "aide_it"
                }
              ]
            }
          ],
          "bouton": "suite",
          "note_interne": "Les valeurs par défaut suffisent : Suite est toujours actif. La langue d'aide est un choix de l'apprenant, jamais déduit."
        },
        {
          "type": "aide_langue",
          "id": "A.2.aide",
          "aide": "accueil",
          "apres": null
        },
        {
          "type": "texte",
          "id": "A.3",
          "image": "img-micro",
          "consigne": "c-accueil-micro",
          "lignes": [
            "Le micro : seulement si vous voulez.",
            "Vous pouvez vous enregistrer pour vous écouter.",
            "Votre voix reste sur cet appareil."
          ],
          "bouton": "d_accord",
          "note_interne": "Aucune demande d'autorisation du micro ici : le navigateur la demande au premier « M'enregistrer »."
        },
        {
          "type": "question_serveur",
          "id": "A.4",
          "trace": "accueil.bonjour",
          "image": "img-serveur",
          "lignes": [
            "Le serveur arrive. Dites bonjour."
          ],
          "serveur": {
            "texte": "Bonjour !",
            "son": "pers1-bonjour",
            "role": "serveur"
          },
          "reponses": [
            {
              "valeur": "je_commence",
              "libelle": "je_commence",
              "effet": "ouvre_s0_et_lance_le_chrono"
            }
          ],
          "reponses_possibles": {
            "liste": [
              {
                "texte": "Bonjour !",
                "son": "cli1-bonjour"
              }
            ],
            "comparer": true
          },
          "retour": null,
          "note_interne": "v3 : le serveur dit « Bonjour ! » dans tous les modes (bouton « Écouter le serveur »), l'apprenant peut s'enregistrer, puis écouter le modèle « Bonjour ! » (cliente-1) pour comparer.",
          "consigne": "c-accueil-bonjour",
          "enregistrement": {
            "cle": "accueil-bonjour",
            "secondes": 10,
            "facultatif": true
          }
        }
      ],
      "carte_formateur": {
        "dit": "« Bonjour ! » (une fois, naturel). Rien sur la présentation de soi : elle est sortie de cette séance (lien facultatif vers l'autre cours à la fin).",
        "note": "Mode, palier, langue d'aide choisie par l'apprenant (jamais déduite de la nationalité) ; matériel (casque, haut-parleur, téléphone ou ordinateur). Palier « Plus simple » : périmètre réduit (commande + fin de commande), à noter avant de comparer des résultats.",
        "a_corriger": "Aucun.",
        "si_temps_manque": "Rien à supprimer ; ne pas dépasser 1 minute.",
        "a_savoir": "En France on salue avant de commander : « Bonjour » d'abord (note linguistique, point 1). Le chronomètre des 45 minutes démarre au bouton « Je commence »."
      }
    },
    {
      "id": "s0",
      "titre": "J'écoute deux personnes",
      "duree_min": 3,
      "etape": "Étape 1 sur 7",
      "objectif": "Vous écoutez un serveur et une cliente. Vous dites ce que la cliente veut à la fin.",
      "pas": [
        {
          "type": "ecoute_sans_texte",
          "id": "0.1",
          "item": "S0-C1",
          "trace": "s0",
          "son": "s0-dialogue",
          "unique": false,
          "condition": "audio_sans_texte",
          "image": "img-comptoir",
          "consigne": "c-s0-ecoute",
          "question": "À la fin, la cliente veut combien de thés ?",
          "e1": {
            "lignes": [
              "Vous êtes au café.",
              "Écoutez deux personnes : un serveur et une cliente.",
              "À la fin, la cliente veut combien de thés ?",
              "Vous pouvez écouter plusieurs fois."
            ],
            "bouton": "ecouter"
          },
          "e2": {
            "saisie": "nombre",
            "nombre_max": 4,
            "consigne": "c-e-nombre-s0",
            "lignes": [
              "Dites le nombre à voix haute. Puis sélectionnez le bon nombre."
            ],
            "boutons": [
              "chiffre_1",
              "chiffre_2",
              "chiffre_3",
              "chiffre_4",
              "je_ne_sais_pas"
            ]
          },
          "e3": {
            "consigne": "c-e-images-s0",
            "lignes": [
              "Regardez les deux images. Sélectionnez la bonne réponse."
            ],
            "images": [
              {
                "image": "img-un-the",
                "libelle": "un thé",
                "valeur": "un"
              },
              {
                "image": "img-deux-thes",
                "libelle": "deux thés",
                "valeur": "deux"
              }
            ],
            "ordre": "fixe"
          },
          "e4": {
            "consigne": null,
            "lignes": [],
            "bouton": null,
            "inutilise": true
          },
          "e5": null,
          "bonne": {
            "valeur": "deux",
            "image": "img-deux-thes",
            "libelle": "deux thés"
          },
          "revele_dans": "s6.bilan",
          "variantes": [
            {
              "si": {
                "mode": [
                  "groupe"
                ]
              },
              "set": {
                "e2.lignes": [
                  "Ne parlez pas. Sélectionnez le bon nombre."
                ],
                "e2.consigne": "c-e-nombre-groupe-s0"
              }
            }
          ]
        },
        {
          "type": "aide_langue",
          "id": "0.1.aide",
          "aide": "s0",
          "apres": "0.1.e2"
        },
        {
          "type": "texte",
          "id": "0.5",
          "role": "retour",
          "lignes": [
            "Merci. Vous verrez la bonne réponse à la fin du cours.",
            "Cliquez sur « Suite »."
          ],
          "bouton": "suite",
          "note_interne": "B1 (QA v3) : le message de fin de S0 ne s'affiche qu'une fois (ici, pas 0.5) et nomme le bouton réellement actif : « Suite ». Son r-s0-3. Texte repris de interface.v3.fin_s0."
        },
        {
          "type": "question_serveur",
          "id": "0.6",
          "item": "S0-P1",
          "trace": "s0.parole",
          "image": "img-serveur",
          "consigne": "c-s0-vous",
          "lignes": [
            "1. Écoutez le serveur.",
            "2. Répondez à voix haute.",
            "Vous pouvez dire : « Pardon ? »"
          ],
          "serveur": {
            "texte": "Et pour vous, café ou thé ?",
            "son": "s0-question-vous",
            "role": "serveur"
          },
          "reponses": [
            {
              "valeur": "repondu",
              "libelle": "j_ai_repondu"
            },
            {
              "valeur": "pardon",
              "libelle": "j_ai_dit_pardon",
              "effet": "redit_une_fois_puis_boutons_reviennent"
            },
            {
              "valeur": "rien",
              "libelle": "je_n_ai_pas_repondu"
            }
          ],
          "enregistrement": {
            "cle": "s0-parole",
            "secondes": 15,
            "facultatif": true
          },
          "retour": {
            "tous": "Merci. Écoutez les réponses possibles.",
            "correction_de_forme": false
          },
          "reponses_possibles": {
            "apres_toucher": true,
            "liste": [
              {
                "texte": "Un café, s'il vous plaît.",
                "son": "cli1-un-cafe-svp"
              },
              {
                "texte": "Un thé, s'il vous plaît.",
                "son": "cli1-un-the-svp"
              }
            ],
            "aussi": [
              "Un café."
            ],
            "comparer": true,
            "message_final": "Merci. Vous allez apprendre ces phrases aujourd'hui. Cliquez sur « Étape suivante ».",
            "reessayer": false,
            "message_final_si_suite": "Merci. Vous allez apprendre ces phrases aujourd'hui. Cliquez sur « Je commence »."
          },
          "variantes": [
            {
              "si": {
                "palier": [
                  "simple"
                ]
              },
              "set": {
                "images_aide": [
                  "img-un-cafe",
                  "img-un-the"
                ]
              }
            }
          ]
        },
        {
          "type": "serie_banque",
          "id": "0.7",
          "si": {
            "option": "verification_debut"
          },
          "facultatif": true,
          "hors_45_min": true,
          "titre": "Deux dialogues en plus",
          "duree_texte": "5 à 8 minutes",
          "series": {
            "A": [
              "b-d1",
              "b-d2"
            ],
            "B": [
              "b-t1",
              "b-t2"
            ]
          },
          "note_interne": "N'existe que si le formateur active « Vérification complémentaire au début » dans son espace. Forme A = D1, D2 ; forme B = T1, T2."
        }
      ],
      "carte_formateur": {
        "dit": "Laisse l'apprenant lancer le dialogue ; ne mime rien, ne répète rien. Puis pose une fois, à débit naturel : « Et pour vous, café ou thé ? ». Si « Pardon ? » : redit une fois, plus clairement, sans donner la réponse.",
        "note": "La réponse libre entendue au pas 0.2 (mot dit à voix haute) ; si l'apprenant garde la première commande au lieu de la correction après « non » (difficulté attendue : la noter, ne pas l'expliquer maintenant) ; la réponse à la question : adaptée / « Pardon ? » (= stratégie, pas un échec) / rien ; aide de langue et incidents. Une réponse « trois » à « combien de thés ? » se note telle quelle.",
        "a_corriger": "Aucun. Pas de correction ici, ni du sens ni de la forme.",
        "si_temps_manque": "Ne jamais supprimer S0. Le pas 0.7 est hors budget.",
        "a_savoir": "Le dialogue commence au milieu de la commande : on n'entend pas la première demande (note A2). La confirmation du serveur est « Deux thés, d'accord. » (et non « très bien », pour éviter la ressemblance avec tres / tre = 3 dans une question de quantité). Pas 0.7 : voir le réglage « Forme A / Forme B ».",
        "validite": "Tant que audio/humain/s0-dialogue.mp3 n'existe pas, le son est une voix de synthèse non validée à l'écoute ; le dire dans tout compte rendu."
      }
    },
    {
      "id": "s1",
      "titre": "Je regarde une scène au café",
      "duree_min": 6,
      "etape": "Étape 2 sur 7",
      "objectif": "Vous regardez un film court. Vous choisissez qui parle au serveur et ce qu'ils commandent.",
      "condition": "film_formatif",
      "pas": [
        {
          "type": "film_extrait",
          "id": "1.1",
          "trace": "s1.regarde",
          "extrait": "film-B",
          "image": "img-table",
          "consigne": "c-s1-regarde",
          "lignes": [
            "Un homme et une femme sont au café.",
            "1. Regardez le film.",
            "2. Cherchez : qui parle au serveur ? Ils commandent quoi ?",
            "Vous n'avez pas besoin de comprendre tous les mots."
          ],
          "bouton": "regarder",
          "images_pendant": false,
          "court": {
            "bouton": "trop_long",
            "trace": "s1.chemin_court",
            "extrait": "film-p4",
            "lignes": [
              "Regardez un petit morceau.",
              "La personne commande quoi ?"
            ],
            "choix": [
              {
                "image": "img-un-cafe",
                "libelle": "un café"
              },
              {
                "image": "img-un-the",
                "libelle": "un thé"
              }
            ],
            "bonne": [
              "img-un-cafe"
            ],
            "retour": "La personne commande un café noir. Cliquez sur « Un autre morceau ».",
            "ensuite": {
              "bouton": "un_autre_morceau",
              "extrait": "film-p5",
              "question": null
            },
            "consigne": "c-s1-court"
          },
          "variantes": [
            {
              "si": {
                "palier": [
                  "simple"
                ]
              },
              "set": {
                "ouvre_par": "court",
                "voir_toute_la_scene": {
                  "bouton": "voir_toute_la_scene",
                  "sans_question": true
                }
              }
            }
          ]
        },
        {
          "type": "choix_images",
          "id": "1.2",
          "si": {
            "palier": [
              "normal",
              "plus"
            ]
          },
          "trace": "s1.qui",
          "consigne": "c-s1-qui",
          "question": "Qui parle au serveur ? Sélectionnez l'image qui correspond.",
          "choix": [
            {
              "image": "img-homme",
              "libelle": "l'homme"
            },
            {
              "image": "img-femme",
              "libelle": "la femme"
            },
            {
              "image": "img-homme-et-femme",
              "libelle": "l'homme et la femme"
            }
          ],
          "bonne": [
            "img-homme-et-femme"
          ],
          "retour": {
            "commun": "Les deux parlent au serveur. La femme et l'homme commandent."
          },
          "note_interne": "Le même retour pour toutes les réponses."
        },
        {
          "type": "aide_langue",
          "id": "1.2.aide",
          "si": {
            "palier": [
              "normal",
              "plus"
            ]
          },
          "aide": "s1",
          "apres": "1.2"
        },
        {
          "type": "choix_multiple",
          "id": "1.3",
          "si": {
            "palier": [
              "normal",
              "plus"
            ]
          },
          "item": "S1-C2",
          "trace": "s1.produits",
          "consigne": "c-s1-quoi",
          "question": "Ils commandent quoi ? Sélectionnez les images. Puis cliquez sur « J'ai fini ».",
          "choix": [
            {
              "image": "img-un-cafe",
              "libelle": "un café"
            },
            {
              "image": "img-un-the",
              "libelle": "un thé"
            },
            {
              "image": "img-jus-orange",
              "libelle": "un jus d'orange"
            },
            {
              "image": "img-croissant",
              "libelle": "un croissant"
            },
            {
              "image": "img-eau",
              "libelle": "un verre d'eau"
            },
            {
              "image": "img-sandwich",
              "libelle": "un sandwich"
            }
          ],
          "bonne": [
            "img-un-cafe",
            "img-jus-orange",
            "img-croissant"
          ],
          "bouton_fin": "j_ai_fini",
          "tableau_film": [
            {
              "image": "img-cafe-noir",
              "libelle": "un café noir"
            },
            {
              "image": "img-cafe-long",
              "libelle": "un café long"
            },
            {
              "image": "img-jus-orange",
              "libelle": "un jus d'orange"
            },
            {
              "image": "img-croissant",
              "libelle": "un croissant"
            }
          ],
          "retour": {
            "intro": "Dans le film : un café noir, un café long, un jus d'orange, un croissant.",
            "trouves": "Vous avez trouvé : {liste}.",
            "hors_film": {
              "img-un-the": "Le thé n'est pas dans le film.",
              "img-eau": "L'eau n'est pas dans le film.",
              "img-sandwich": "Le sandwich n'est pas dans le film."
            },
            "note_interne": "Une réponse partielle est normale : aucun mot comme « faux » ou « incomplet »."
          }
        },
        {
          "type": "choix_images",
          "id": "1.3.plus-a",
          "si": {
            "palier": [
              "plus"
            ]
          },
          "trace": "s1.qui_jus",
          "question": "Qui prend le jus d'orange ? Sélectionnez la bonne réponse.",
          "choix": [
            {
              "image": "img-homme",
              "libelle": "l'homme"
            },
            {
              "image": "img-femme",
              "libelle": "la femme"
            }
          ],
          "bonne": [
            "img-homme"
          ],
          "retour": {
            "commun": "Le jus d'orange est pour l'homme."
          },
          "consigne": "c-s1-jus"
        },
        {
          "type": "choix_images",
          "id": "1.3.plus-b",
          "si": {
            "palier": [
              "plus"
            ]
          },
          "trace": "s1.qui_croissant",
          "question": "Qui prend le croissant ? Sélectionnez la bonne réponse.",
          "choix": [
            {
              "image": "img-homme",
              "libelle": "l'homme"
            },
            {
              "image": "img-femme",
              "libelle": "la femme"
            }
          ],
          "bonne": [
            "img-femme"
          ],
          "retour": {
            "commun": "Le croissant est pour la femme."
          },
          "consigne": "c-s1-croissant"
        },
        {
          "type": "film_extrait",
          "id": "1.4",
          "si": {
            "palier": [
              "normal",
              "plus"
            ]
          },
          "trace": "s1.fin_film",
          "extrait": "film-B",
          "consigne": "c-s1-fin",
          "lignes": [
            "Regardez encore. À la fin, ils demandent quoi ?"
          ],
          "bouton": "regarder_encore",
          "images_pendant": false
        },
        {
          "type": "choix_images",
          "id": "1.4.q",
          "si": {
            "palier": [
              "normal",
              "plus"
            ]
          },
          "item": "S1-C1",
          "trace": "s1.fin",
          "apres": "1.4",
          "question": "À la fin, ils demandent quoi ? Sélectionnez la bonne réponse.",
          "choix": [
            {
              "image": "img-addition",
              "libelle": "l'addition (= le papier avec le prix)"
            },
            {
              "image": "img-un-cafe-plus",
              "libelle": "un autre café"
            }
          ],
          "bonne": [
            "img-addition"
          ],
          "retour": {
            "commun": "À la fin, ils demandent l'addition : ils veulent payer."
          },
          "consigne": "c-s1-fin-q"
        },
        {
          "type": "dialogue_devoile",
          "id": "1.5",
          "si": {
            "palier": [
              "normal",
              "plus"
            ]
          },
          "trace": "s1.texte_vu",
          "facultatif": true,
          "acces": {
            "bouton": "voir_les_mots_du_film"
          },
          "etiquette": "film",
          "repliques": [
            {
              "role": "La femme",
              "couleur": "client",
              "texte": "Un café noir pour moi, s'il vous plaît.",
              "extrait": "film-p4"
            },
            {
              "role": "L'homme",
              "couleur": "client",
              "texte": "Et moi, un café long et un jus d'orange, s'il vous plaît.",
              "extrait": "film-cafe-long"
            },
            {
              "role": "Le serveur",
              "couleur": "personnel",
              "texte": "Parfait. C'est tout ?",
              "extrait": "film-p5-question"
            },
            {
              "role": "Un client",
              "couleur": "client",
              "texte": "Oui, merci, c'est tout.",
              "extrait": "film-p5-reponse"
            },
            {
              "role": "Un client",
              "couleur": "client",
              "texte": "Un croissant aussi.",
              "extrait": "film-croissant"
            },
            {
              "role": "Un client",
              "couleur": "client",
              "texte": "L'addition, s'il vous plaît.",
              "extrait": "film-p6"
            },
            {
              "role": "Le serveur",
              "couleur": "personnel",
              "texte": "Carte ou espèces ?",
              "extrait": "film-paiement-question"
            },
            {
              "role": "Un client",
              "couleur": "client",
              "texte": "Espèces, espèces.",
              "extrait": "film-paiement-reponse"
            }
          ],
          "note_interne": "v3 : chaque réplique du film a son extrait (bouton « Regarder ») ; aucune étiquette de provenance affichée."
        },
        {
          "type": "aide_langue",
          "id": "1.simple.aide",
          "si": {
            "palier": [
              "simple"
            ]
          },
          "aide": "s1",
          "apres": "1.1.court"
        }
      ],
      "carte_formateur": {
        "dit": "Lance la scène. Avant : montre l'image, dit seulement « Regardez. Qui parle au serveur ? ». Ne lit pas les choix avant la première vision.",
        "note": "Une action et un produit identifiés (critère local de 02) ; si des sous-titres étaient visibles ; aide de langue ; chemin court ou non.",
        "a_corriger": "Le sens seulement (qui, quoi). Aucune correction de prononciation.",
        "si_temps_manque": "Supprimer la deuxième vision (pas 1.4) — « L'addition » revient en S2 ; ou passer au chemin court.",
        "a_savoir": "Film joué par des acteurs, lent, pour débutants ; ce n'est pas une conversation spontanée. La scène est à table ; l'apprenant, lui, sera au comptoir (expliqué en S2). Ne pas confondre « la carte » du film (« Voici la carte » = le menu) et « par carte » (paiement) : n'en parler que si l'apprenant hésite. Rôles : « la femme » (café noir) et « l'homme » (café long, jus d'orange) viennent des sous-titres du film ; pour les autres répliques le texte dit « un client » : le film ne permet pas de l'établir sans réécoute. Les extraits sont formatifs (film_formatif) : jamais présentés comme écoute sans texte.",
        "validite": "Sous-titres du lecteur YouTube : non contrôlables, à vérifier à l'écran une fois (extraits A à D)."
      }
    },
    {
      "id": "s2",
      "titre": "J'écoute : on commande, on finit ou on paie ?",
      "duree_min": 9,
      "etape": "Étape 3 sur 7",
      "objectif": "Vous écoutez des phrases courtes. Vous choisissez ce que la personne fait : commander, finir la commande ou payer.",
      "note_ecran": "Quatre extraits : A, B, C (film, film_formatif) puis D (dialogue créé). Les trois images de moment sont toujours les mêmes, dans le même ordre ; v3 : elles apparaissent à la fenêtre « Je choisis l'image » ; l'écoute est libre (aucune fenêtre « Dites votre idée »).",
      "pas": [
        {
          "type": "texte",
          "id": "2.0",
          "consigne": "c-s2-debut",
          "lignes": [
            "Vous allez écouter quatre petits moments.",
            "1. Écoutez la phrase.",
            "2. Sélectionnez l'image qui correspond.",
            "La personne commande, finit la commande ou paie.",
            "Exemple : « Un thé, s'il vous plaît. » La personne commande."
          ],
          "bouton": "suite"
        },
        {
          "type": "ecoute_sans_texte",
          "id": "2.A",
          "item": "S2-C1",
          "trace": "s2a",
          "extrait": "film-p4",
          "unique": false,
          "condition": "film_formatif",
          "support": "film_youtube",
          "texte_visible": "non_controle",
          "consigne": "c-s2-ecoute",
          "e1": {
            "lignes": [
              "1. Écoutez la phrase.",
              "Vous pouvez écouter plusieurs fois."
            ],
            "bouton": "ecouter"
          },
          "e2": {
            "saisie": "aucune",
            "consigne": null,
            "lignes": [],
            "boutons": [],
            "inutilise": true
          },
          "e3": {
            "consigne": "c-e-moment",
            "lignes": [
              "Qu'est-ce que la personne fait ?",
              "2. Sélectionnez l'image."
            ],
            "images": [
              {
                "image": "img-f-commander",
                "libelle": "commander (= demander une boisson)",
                "valeur": "commander"
              },
              {
                "image": "img-f-finir",
                "libelle": "finir la commande",
                "valeur": "finir"
              },
              {
                "image": "img-f-payer",
                "libelle": "payer",
                "valeur": "payer"
              }
            ],
            "ordre": "fixe"
          },
          "e4": {
            "consigne": null,
            "lignes": [],
            "bouton": null,
            "inutilise": true
          },
          "e5": {
            "etiquette": "film",
            "repliques": [
              {
                "role": "La femme",
                "couleur": "client",
                "texte": "Un café noir pour moi, s'il vous plaît.",
                "extrait": "film-p4"
              }
            ],
            "image": "img-f-commander",
            "boutons": [
              "reecouter"
            ],
            "retour": {
              "prefixe_si_bonne": "Oui.",
              "texte": "Ici, la femme commande. Elle demande une boisson : un café noir."
            }
          },
          "bonne": {
            "valeur": "commander",
            "image": "img-f-commander"
          },
          "variantes": [
            {
              "si": {
                "palier": [
                  "simple"
                ]
              },
              "set": {
                "e3.images": [
                  {
                    "image": "img-f-commander",
                    "libelle": "commander (= demander une boisson)",
                    "valeur": "commander"
                  },
                  {
                    "image": "img-f-finir",
                    "libelle": "finir la commande",
                    "valeur": "finir"
                  }
                ],
                "e4.avec_texte": true,
                "e4.marque_trace": "avec_texte"
              }
            }
          ]
        },
        {
          "type": "aide_langue",
          "id": "2.A.aide",
          "aide": "s2",
          "apres": "2.A.e3"
        },
        {
          "type": "ecoute_sans_texte",
          "id": "2.B",
          "item": "S2-C2",
          "trace": "s2b",
          "extrait": "film-p5",
          "unique": false,
          "condition": "film_formatif",
          "support": "film_youtube",
          "texte_visible": "non_controle",
          "consigne": "c-s2-ecoute",
          "e1": {
            "lignes": [
              "1. Écoutez la phrase.",
              "Vous pouvez écouter plusieurs fois."
            ],
            "bouton": "ecouter"
          },
          "e2": {
            "saisie": "aucune",
            "consigne": null,
            "lignes": [],
            "boutons": [],
            "inutilise": true
          },
          "e3": {
            "consigne": "c-e-moment",
            "lignes": [
              "Qu'est-ce que la personne fait ?",
              "2. Sélectionnez l'image."
            ],
            "images": [
              {
                "image": "img-f-commander",
                "libelle": "commander (= demander une boisson)",
                "valeur": "commander"
              },
              {
                "image": "img-f-finir",
                "libelle": "finir la commande",
                "valeur": "finir"
              },
              {
                "image": "img-f-payer",
                "libelle": "payer",
                "valeur": "payer"
              }
            ],
            "ordre": "fixe"
          },
          "e4": {
            "consigne": null,
            "lignes": [],
            "bouton": null,
            "inutilise": true
          },
          "e5": {
            "etiquette": "film",
            "repliques": [
              {
                "role": "Le serveur",
                "couleur": "personnel",
                "texte": "Parfait. C'est tout ?",
                "extrait": "film-p5-question"
              },
              {
                "role": "Un client",
                "couleur": "client",
                "texte": "Oui, merci, c'est tout.",
                "extrait": "film-p5-reponse"
              }
            ],
            "image": "img-f-finir",
            "boutons": [
              "reecouter"
            ],
            "retour": {
              "prefixe_si_bonne": "Oui.",
              "texte": "Le serveur demande : « C'est tout ? » Le client répond oui : c'est fini."
            }
          },
          "bonne": {
            "valeur": "finir",
            "image": "img-f-finir"
          },
          "variantes": [
            {
              "si": {
                "palier": [
                  "simple"
                ]
              },
              "set": {
                "e3.images": [
                  {
                    "image": "img-f-commander",
                    "libelle": "commander (= demander une boisson)",
                    "valeur": "commander"
                  },
                  {
                    "image": "img-f-finir",
                    "libelle": "finir la commande",
                    "valeur": "finir"
                  }
                ],
                "e4.avec_texte": true,
                "e4.marque_trace": "avec_texte"
              }
            }
          ]
        },
        {
          "type": "aide_langue",
          "id": "2.B.aide",
          "aide": "s2",
          "apres": "2.B.e3"
        },
        {
          "type": "aide_langue",
          "id": "2.B.roles",
          "aide": "cest_tout_roles",
          "apres": "2.B.e5"
        },
        {
          "type": "choix_images",
          "id": "2.B.6",
          "si": {
            "palier": [
              "normal",
              "plus"
            ]
          },
          "trace": "s2.qui_parle",
          "consigne": "c-s2-qui",
          "question": "Écoutez chaque phrase. Qui parle : le serveur ou le client ? Sélectionnez l'image.",
          "sequence": [
            {
              "libelle": "phrase_1",
              "son": "qui-cest-tout-question",
              "bonne": "img-serveur"
            },
            {
              "libelle": "phrase_2",
              "son": "qui-cest-tout-reponse",
              "bonne": "img-client"
            }
          ],
          "ordre_phrases": "alea",
          "choix": [
            {
              "image": "img-serveur",
              "libelle": "le serveur"
            },
            {
              "image": "img-client",
              "libelle": "le client"
            }
          ],
          "texte_apres": [
            {
              "role": "Le serveur demande :",
              "texte": "C'est tout ?"
            },
            {
              "role": "Le client répond :",
              "texte": "C'est tout, merci."
            }
          ],
          "retour": {
            "commun": "« C'est tout ? » : le serveur pose une question. « C'est tout, merci. » : le client répond."
          },
          "note_interne": "Modes formateur et groupe : le formateur dit lui-même les deux phrases, avec la même voix."
        },
        {
          "type": "ecoute_sans_texte",
          "id": "2.C",
          "item": "S2-C3",
          "trace": "s2c",
          "extrait": "film-p6",
          "unique": false,
          "condition": "film_formatif",
          "support": "film_youtube",
          "texte_visible": "non_controle",
          "consigne": "c-s2-ecoute",
          "e1": {
            "lignes": [
              "1. Écoutez la phrase.",
              "Vous pouvez écouter plusieurs fois."
            ],
            "bouton": "ecouter"
          },
          "e2": {
            "saisie": "aucune",
            "consigne": null,
            "lignes": [],
            "boutons": [],
            "inutilise": true
          },
          "e3": {
            "consigne": "c-e-moment",
            "lignes": [
              "Qu'est-ce que la personne fait ?",
              "2. Sélectionnez l'image."
            ],
            "images": [
              {
                "image": "img-f-commander",
                "libelle": "commander (= demander une boisson)",
                "valeur": "commander"
              },
              {
                "image": "img-f-finir",
                "libelle": "finir la commande",
                "valeur": "finir"
              },
              {
                "image": "img-f-payer",
                "libelle": "payer",
                "valeur": "payer"
              }
            ],
            "ordre": "fixe"
          },
          "e4": {
            "consigne": null,
            "lignes": [],
            "bouton": null,
            "inutilise": true
          },
          "e5": {
            "etiquette": "film",
            "repliques": [
              {
                "role": "Un client",
                "couleur": "client",
                "texte": "L'addition, s'il vous plaît.",
                "extrait": "film-p6"
              }
            ],
            "image": "img-f-payer",
            "boutons": [
              "reecouter"
            ],
            "retour": {
              "prefixe_si_bonne": "Oui.",
              "texte": "Ici, la personne veut payer. Elle demande l'addition."
            }
          },
          "bonne": {
            "valeur": "payer",
            "image": "img-f-payer"
          },
          "variantes": [
            {
              "si": {
                "palier": [
                  "simple"
                ]
              },
              "set": {
                "forme": "ecoute_avec_images",
                "e3.images_pendant_ecoute": true,
                "aucune_mesure": true
              }
            }
          ]
        },
        {
          "type": "aide_langue",
          "id": "2.C.aide",
          "aide": "s2",
          "apres": "2.C.e3"
        },
        {
          "type": "texte",
          "id": "2.C.6",
          "consigne": "c-s2-table-comptoir",
          "images": [
            {
              "image": "img-table-addition",
              "legende": "Dans le film : à table. Ils demandent l'addition à la fin."
            },
            {
              "image": "img-comptoir",
              "legende": "Aujourd'hui : au comptoir. Vous commandez, puis vous payez."
            }
          ],
          "lignes": [
            "Vous comprenez « L'addition, s'il vous plaît ». Aujourd'hui, vous ne la dites pas."
          ],
          "bouton": "suite"
        },
        {
          "type": "ecoute_sans_texte",
          "id": "2.D",
          "item": "S2-C4",
          "trace": "s2d",
          "son": "ech-carte-especes",
          "unique": false,
          "condition": "audio_sans_texte",
          "consigne": "c-s2-d",
          "e1": {
            "lignes": [
              "Deux autres personnes parlent au comptoir.",
              "1. Écoutez-les.",
              "Vous pouvez écouter plusieurs fois."
            ],
            "bouton": "ecouter"
          },
          "e2": {
            "saisie": "aucune",
            "consigne": null,
            "lignes": [],
            "boutons": [],
            "inutilise": true
          },
          "e3": {
            "consigne": "c-e-moment",
            "lignes": [
              "Qu'est-ce que la personne fait ?",
              "2. Sélectionnez l'image."
            ],
            "images": [
              {
                "image": "img-f-commander",
                "libelle": "commander (= demander une boisson)",
                "valeur": "commander"
              },
              {
                "image": "img-f-finir",
                "libelle": "finir la commande",
                "valeur": "finir"
              },
              {
                "image": "img-f-payer",
                "libelle": "payer",
                "valeur": "payer"
              }
            ],
            "ordre": "fixe"
          },
          "e4": {
            "consigne": null,
            "lignes": [],
            "bouton": null,
            "inutilise": true
          },
          "question_suite": {
            "trace": "s2d.choix_final",
            "consigne": "c-s2-paie",
            "lignes": [
              "La cliente paie comment ?",
              "Sélectionnez l'image."
            ],
            "images": [
              {
                "image": "img-carte-bancaire",
                "libelle": "par carte",
                "valeur": "carte"
              },
              {
                "image": "img-especes",
                "libelle": "en espèces (= billets et pièces)",
                "valeur": "especes"
              }
            ],
            "bonne": {
              "valeur": "carte",
              "image": "img-carte-bancaire"
            },
            "retour_avant_e5": null
          },
          "e5": {
            "etiquette": "cree",
            "repliques": [
              {
                "role": "Le serveur",
                "couleur": "personnel",
                "texte": "Carte ou espèces ?"
              },
              {
                "role": "La cliente",
                "couleur": "client",
                "texte": "Par carte, s'il vous plaît."
              }
            ],
            "images": [
              "img-carte-bancaire",
              "img-especes"
            ],
            "boutons": [
              "reecouter",
              "un_peu_plus_lent"
            ],
            "retour_moment": {
              "si_bonne": "Oui. Le serveur demande comment payer.",
              "sinon": "Ici, le serveur demande comment payer. Écoutez encore le début.",
              "bouton_sinon": {
                "libelle": "le_debut",
                "son": "pers1-carte-ou-especes"
              }
            },
            "retour_paiement": {
              "img-carte-bancaire": {
                "texte": "La cliente paie par carte."
              },
              "img-especes": {
                "texte": "Le serveur propose deux choix. La cliente choisit : « par carte ».",
                "bouton": {
                  "libelle": "la_cliente",
                  "son": "cli1-par-carte-svp"
                }
              }
            }
          },
          "bonne": {
            "valeur": "payer",
            "image": "img-f-payer"
          },
          "variantes": [
            {
              "si": {
                "palier": [
                  "simple"
                ]
              },
              "set": {
                "forme": "ecoute_avec_images",
                "e3.images_pendant_ecoute": true,
                "question_suite.images_pendant_ecoute": true,
                "aucune_mesure": true
              }
            },
            {
              "si": {
                "palier": [
                  "plus"
                ]
              },
              "set": {
                "question_suite.lignes": [
                  "La cliente paie comment ?",
                  "Dites-le à voix haute."
                ],
                "question_suite.boutons": [
                  "c_est_dit"
                ],
                "question_suite.images_cachees": true,
                "question_suite.acces_images": "voir_les_images",
                "question_suite.consigne": "c-s2-paie-plus"
              }
            }
          ]
        },
        {
          "type": "aide_langue",
          "id": "2.D.aide",
          "aide": "s2",
          "apres": "2.D.e3"
        },
        {
          "type": "aide_langue",
          "id": "2.D.par-carte",
          "aide": "par_carte_sens",
          "apres": "2.D.question_suite"
        },
        {
          "type": "aide_langue",
          "id": "2.D.carte-comment",
          "aide": "carte_comment_payer",
          "apres": "2.D.e5",
          "si_reponse_fausse": true
        },
        {
          "type": "film_extrait",
          "id": "2.D.7",
          "si": {
            "palier": [
              "normal",
              "plus"
            ]
          },
          "trace": "s2.film_paiement",
          "extrait": "film-Bdif",
          "facultatif": true,
          "lignes": [
            "Dans le film, le serveur pose la même question.",
            "Écoutez la réponse."
          ],
          "bouton": "regarder",
          "repliques_apres": [
            {
              "role": "Le serveur",
              "couleur": "personnel",
              "texte": "Carte ou espèces ?",
              "extrait": "film-paiement-question"
            },
            {
              "role": "Un client",
              "couleur": "client",
              "texte": "Espèces, espèces.",
              "extrait": "film-paiement-reponse"
            }
          ],
          "retour": "Dans le film, ils paient en espèces.",
          "variantes": [
            {
              "si": {
                "palier": [
                  "plus"
                ]
              },
              "set": {
                "facultatif": false,
                "question_avant": "Dans le film, ils paient comment ?",
                "consigne": "c-s2-d7-plus"
              }
            }
          ],
          "consigne": "c-s2-d7"
        }
      ],
      "carte_formateur": {
        "dit": "Laisse l'apprenant écouter chaque phrase autant de fois qu'il veut, sans rien ajouter. Après l'extrait B, peut dire avec la même voix « C'est tout ? » puis « C'est tout, merci. » (ordre libre) et demander du geste : qui parle ?",
        "note": "Pour chaque extrait, la réponse libre, puis la réponse au choix de l'image et le nombre d'écoutes (enregistrés par le support) ; critère local de 02 : au moins deux moments reconnus au premier passage (seuil à ajuster après essai). Pour A, B, C, noter si l'apprenant regardait l'écran : le film peut afficher des sous-titres, ces trois résultats restent formatifs. Seul l'extrait D est une écoute sans texte.",
        "a_corriger": "Le sens. Si l'apprenant choisit « commander » pour D : « Vous avez entendu « carte ». Ici, le serveur demande comment payer. » Ne comparer « la carte » (menu) et « par carte » (paiement) que si l'apprenant fait lui-même la confusion ; pas de traduction unique de « carte ».",
        "si_temps_manque": "Supprimer d'abord le pas 2.B.6 et le pas 2.D.7, puis l'extrait C (« L'addition » reste une phrase à reconnaître, vue en S1). Garder l'extrait D si le paiement est au programme de S3 et S5.",
        "a_savoir": "Dans un café classique, on paie souvent après avoir bu : « L'addition, s'il vous plaît » = à table, à reconnaître seulement. Palier « Plus simple » : extraits A et B avec 2 images ; C et D en écoute avec images (aucune mesure)."
      }
    },
    {
      "id": "s3",
      "titre": "Je réponds au serveur",
      "duree_min": 7,
      "etape": "Étape 4 sur 7",
      "objectif": "Le serveur pose trois questions. Vous apprenez une réponse pour chaque question.",
      "note_ecran": "Trois fiches. Dans l'interface on dit « le texte », jamais « carte » (le mot est déjà pris par « par carte »).",
      "pas": [
        {
          "type": "ecoute",
          "id": "3.1.1",
          "trace": "s3.c1.ecoute",
          "son": "ech-prenez-cafe",
          "consigne": "c-s3-ecoute",
          "lignes": [
            "Écoutez le serveur et la cliente.",
            "Vous pouvez écouter plusieurs fois."
          ],
          "bouton": "ecouter",
          "texte_visible": false,
          "variantes": [
            {
              "si": {
                "palier": [
                  "simple"
                ]
              },
              "set": {
                "texte_visible": true,
                "images_boisson": [
                  "img-un-cafe",
                  "img-un-the"
                ],
                "texte_visible_repliques": [
                  {
                    "role": "Le serveur",
                    "texte": "Qu'est-ce que vous prenez ?"
                  },
                  {
                    "role": "La cliente",
                    "texte": "Un café, s'il vous plaît."
                  }
                ]
              }
            }
          ]
        },
        {
          "type": "choix_images",
          "id": "3.1.2",
          "item": "S3-C1",
          "trace": "s3.c1.sens",
          "consigne": "c-e-moment",
          "question": "Qu'est-ce que la personne fait ? Sélectionnez l'image.",
          "choix": [
            {
              "image": "img-f-commander",
              "libelle": "commander (= demander une boisson)",
              "valeur": "commander"
            },
            {
              "image": "img-f-finir",
              "libelle": "finir la commande",
              "valeur": "finir"
            },
            {
              "image": "img-f-payer",
              "libelle": "payer",
              "valeur": "payer"
            }
          ],
          "bonne": [
            "img-f-commander"
          ],
          "retour": {
            "prefixe_si_bonne": "Oui.",
            "commun": "La cliente commande : elle demande un café."
          }
        },
        {
          "type": "carte_roles",
          "id": "3.1.3",
          "trace": "s3.c1.dit",
          "consigne": "c-s3-lisez",
          "personnel": {
            "libelle": "le_serveur_dit",
            "texte": "Qu'est-ce que vous prenez ?",
            "son": "pers1-prenez",
            "role": "le serveur"
          },
          "vous": {
            "libelle": "vous_pouvez_dire",
            "texte": "Un café, s'il vous plaît.",
            "son": "cli1-un-cafe-svp",
            "role": "la cliente"
          },
          "lignes": [
            "1. Lisez la phrase.",
            "2. Écoutez la phrase.",
            "3. Dites la réponse à voix haute."
          ],
          "bouton": "je_l_ai_dit",
          "un_peu_plus_lent": true,
          "glose": null,
          "image": null,
          "enregistrement": {
            "cle": "s3-fiche-1",
            "secondes": 15,
            "facultatif": true
          }
        },
        {
          "type": "aide_langue",
          "id": "3.1.aide",
          "aide": "s3",
          "apres": "3.1.3"
        },
        {
          "type": "question_serveur",
          "id": "3.1.4",
          "item": "S3-P1",
          "trace": "s3.c1.parole",
          "image": "img-un-the",
          "consigne": "c-s3-change-1",
          "lignes": [
            "Maintenant, vous voulez un thé.",
            "Changez un seul mot.",
            "1. Écoutez le serveur.",
            "2. Répondez à voix haute."
          ],
          "serveur": {
            "texte": "Qu'est-ce que vous prenez ?",
            "son": "pers1-prenez",
            "role": "serveur"
          },
          "reponses": [
            {
              "valeur": "repondu",
              "libelle": "j_ai_repondu"
            }
          ],
          "reponses_possibles": {
            "liste": [
              {
                "texte": "Un thé, s'il vous plaît.",
                "son": "cli1-un-the-svp"
              }
            ],
            "comparer": true
          },
          "sens_seul": "Le serveur doit comprendre : un thé.",
          "retour": {
            "formateur": "celui du formateur : le sens d'abord"
          },
          "enregistrement": {
            "cle": "s3-change-1",
            "secondes": 15,
            "facultatif": true
          }
        },
        {
          "type": "ecoute",
          "id": "3.2.1",
          "trace": "s3.c2.ecoute",
          "son": "ech-cest-tout",
          "consigne": "c-s3-ecoute",
          "lignes": [
            "Écoutez le serveur et la cliente.",
            "Vous pouvez écouter plusieurs fois."
          ],
          "bouton": "ecouter",
          "texte_visible": false,
          "variantes": [
            {
              "si": {
                "palier": [
                  "simple"
                ]
              },
              "set": {
                "texte_visible": true,
                "images_boisson": [
                  "img-un-cafe",
                  "img-un-the"
                ],
                "texte_visible_repliques": [
                  {
                    "role": "Le serveur",
                    "texte": "C'est tout ?"
                  },
                  {
                    "role": "La cliente",
                    "texte": "Oui, merci, c'est tout."
                  }
                ]
              }
            },
            {
              "si": {
                "palier": [
                  "simple"
                ]
              },
              "set": {
                "facultatif": true,
                "note_interne": "Palier « Plus simple » : fiche 2 seulement si le temps le permet."
              }
            }
          ]
        },
        {
          "type": "choix_images",
          "id": "3.2.2",
          "item": "S3-C2",
          "trace": "s3.c2.sens",
          "consigne": "c-e-moment",
          "question": "Qu'est-ce que la personne fait ? Sélectionnez l'image.",
          "choix": [
            {
              "image": "img-f-commander",
              "libelle": "commander (= demander une boisson)",
              "valeur": "commander"
            },
            {
              "image": "img-f-finir",
              "libelle": "finir la commande",
              "valeur": "finir"
            },
            {
              "image": "img-f-payer",
              "libelle": "payer",
              "valeur": "payer"
            }
          ],
          "bonne": [
            "img-f-finir"
          ],
          "retour": {
            "prefixe_si_bonne": "Oui.",
            "commun": "Le serveur demande : vous avez fini ? La cliente répond : oui, c'est tout."
          }
        },
        {
          "type": "carte_roles",
          "id": "3.2.3",
          "trace": "s3.c2.dit",
          "consigne": "c-s3-lisez",
          "personnel": {
            "libelle": "le_serveur_dit",
            "texte": "C'est tout ?",
            "son": "pers1-cest-tout",
            "role": "le serveur"
          },
          "vous": {
            "libelle": "vous_pouvez_dire",
            "texte": "Oui, merci, c'est tout.",
            "son": "cli1-oui-merci-cest-tout",
            "role": "la cliente"
          },
          "lignes": [
            "1. Lisez la phrase.",
            "2. Écoutez la phrase.",
            "3. Dites la réponse à voix haute."
          ],
          "bouton": "je_l_ai_dit",
          "un_peu_plus_lent": true,
          "glose": null,
          "image": null,
          "enregistrement": {
            "cle": "s3-fiche-2",
            "secondes": 15,
            "facultatif": true
          }
        },
        {
          "type": "aide_langue",
          "id": "3.2.aide",
          "aide": "s3",
          "apres": "3.2.3"
        },
        {
          "type": "question_serveur",
          "id": "3.2.4",
          "item": "S3-P2",
          "trace": "s3.c2.parole",
          "consigne": "c-s3-change-2",
          "lignes": [
            "Le serveur change sa question.",
            "1. Écoutez le serveur.",
            "2. Répondez à voix haute."
          ],
          "serveur": {
            "texte": "Autre chose ?",
            "son": "pers1-autre-chose",
            "role": "serveur"
          },
          "reponses": [
            {
              "valeur": "repondu",
              "libelle": "j_ai_repondu"
            }
          ],
          "apres_reponse": {
            "lignes": [
              {
                "role": "Le serveur dit :",
                "texte": "Autre chose ?"
              },
              {
                "role": "Vous pouvez dire :",
                "texte": "Non merci, c'est tout."
              }
            ],
            "note": "« C'est tout ? » → oui. « Autre chose ? » → non. Les deux réponses disent : j'ai fini."
          },
          "reponses_possibles": {
            "liste": [
              {
                "texte": "Non merci, c'est tout.",
                "son": "cli1-non-merci-cest-tout"
              }
            ],
            "comparer": true
          },
          "sens_seul": "« Autre chose ? » = le serveur demande une autre boisson. Vous avez fini ? Dites : « Non merci, c'est tout. »",
          "retour": {
            "formateur": "celui du formateur : le sens d'abord"
          },
          "enregistrement": {
            "cle": "s3-change-2",
            "secondes": 15,
            "facultatif": true
          }
        },
        {
          "type": "ecoute",
          "id": "3.3.1",
          "trace": "s3.c3.ecoute",
          "son": "ech-carte-especes",
          "consigne": "c-s3-ecoute",
          "lignes": [
            "Écoutez le serveur et la cliente.",
            "Vous pouvez écouter plusieurs fois."
          ],
          "bouton": "ecouter",
          "texte_visible": false,
          "variantes": [
            {
              "si": {
                "palier": [
                  "simple"
                ]
              },
              "set": {
                "forme": "ecoute_avec_images"
              }
            }
          ]
        },
        {
          "type": "choix_images",
          "id": "3.3.2",
          "si": {
            "palier": [
              "normal",
              "plus"
            ]
          },
          "item": "S3-C3",
          "trace": "s3.c3.sens",
          "consigne": "c-e-moment",
          "question": "Qu'est-ce que la personne fait ? Sélectionnez l'image.",
          "choix": [
            {
              "image": "img-f-commander",
              "libelle": "commander (= demander une boisson)",
              "valeur": "commander"
            },
            {
              "image": "img-f-finir",
              "libelle": "finir la commande",
              "valeur": "finir"
            },
            {
              "image": "img-f-payer",
              "libelle": "payer",
              "valeur": "payer"
            }
          ],
          "bonne": [
            "img-f-payer"
          ],
          "retour": {
            "prefixe_si_bonne": "Oui.",
            "commun": "Le serveur demande comment payer. La cliente paie par carte."
          }
        },
        {
          "type": "carte_roles",
          "id": "3.3.3",
          "si": {
            "palier": [
              "normal",
              "plus"
            ]
          },
          "trace": "s3.c3.dit",
          "consigne": "c-s3-lisez",
          "personnel": {
            "libelle": "le_serveur_dit",
            "texte": "Carte ou espèces ?",
            "son": "pers1-carte-ou-especes",
            "role": "le serveur"
          },
          "vous": {
            "libelle": "vous_pouvez_dire",
            "texte": "Par carte, s'il vous plaît.",
            "son": "cli1-par-carte-svp",
            "role": "la cliente"
          },
          "lignes": [
            "1. Lisez la phrase.",
            "2. Écoutez la phrase.",
            "3. Dites la réponse à voix haute."
          ],
          "bouton": "je_l_ai_dit",
          "un_peu_plus_lent": true,
          "glose": "par carte (= avec la carte bancaire)",
          "image": "img-carte-bancaire",
          "enregistrement": {
            "cle": "s3-fiche-3",
            "secondes": 15,
            "facultatif": true
          }
        },
        {
          "type": "aide_langue",
          "id": "3.3.aide",
          "si": {
            "palier": [
              "normal",
              "plus"
            ]
          },
          "aide": "s3",
          "apres": "3.3.3"
        },
        {
          "type": "choix_images",
          "id": "3.3.s",
          "si": {
            "palier": [
              "simple"
            ]
          },
          "trace": "s3.c3.sens_simple",
          "consigne": "c-s3-carte-simple",
          "question": "Le serveur dit : « Carte ou espèces ? » Sélectionnez l'image, ou dites un mot à voix haute.",
          "choix": [
            {
              "image": "img-carte-bancaire",
              "libelle": "par carte"
            },
            {
              "image": "img-especes",
              "libelle": "en espèces (= billets et pièces)"
            }
          ],
          "bonne": [],
          "retour": {
            "commun": "Le serveur demande comment payer. La cliente paie par carte."
          },
          "note_interne": "Pas de bonne réponse : le serveur donne le choix ; l'apprenant sélectionne l'image ou dit « Carte » à voix haute."
        },
        {
          "type": "question_serveur",
          "id": "3.3.4",
          "si": {
            "palier": [
              "normal",
              "plus"
            ]
          },
          "item": "S3-P3",
          "trace": "s3.c3.parole",
          "image": "img-especes",
          "consigne": "c-s3-change-3",
          "lignes": [
            "Maintenant, vous payez avec des billets.",
            "Changez la réponse.",
            "1. Écoutez le serveur.",
            "2. Répondez à voix haute."
          ],
          "glose": "espèces (= billets et pièces)",
          "serveur": {
            "texte": "Carte ou espèces ?",
            "son": "pers1-carte-ou-especes",
            "role": "serveur"
          },
          "reponses": [
            {
              "valeur": "repondu",
              "libelle": "j_ai_repondu"
            }
          ],
          "reponses_possibles": {
            "liste": [
              {
                "texte": "En espèces.",
                "son": "cli1-en-especes"
              }
            ],
            "comparer": true
          },
          "apres_reponse": {
            "comparaison_cote_a_cote": [
              "Par carte",
              "En espèces"
            ]
          },
          "sens_seul": "Le serveur doit comprendre : des billets, pas la carte.",
          "retour": {
            "formateur": "celui du formateur : le sens d'abord"
          },
          "enregistrement": {
            "cle": "s3-change-3",
            "secondes": 15,
            "facultatif": true
          }
        },
        {
          "type": "texte",
          "id": "3.4.intro",
          "consigne": "c-s3-sans-texte",
          "lignes": [
            "Maintenant, sans le texte et sans image.",
            "Écoutez le serveur.",
            "Répondez à voix haute."
          ],
          "aides_discretes": [
            "revoir_le_texte",
            "aide_langue"
          ],
          "si": {
            "palier": [
              "normal",
              "plus"
            ]
          }
        },
        {
          "type": "question_serveur",
          "id": "3.4.1",
          "si": {
            "palier": [
              "normal",
              "plus"
            ]
          },
          "trace": "s3.ferme.q1",
          "serveur": {
            "texte": "Vous désirez ?",
            "son": "pers1-vous-desirez",
            "role": "serveur"
          },
          "reponses": [
            {
              "valeur": "repondu",
              "libelle": "j_ai_repondu"
            },
            {
              "valeur": "relance",
              "libelle": "je_demande_de_repeter"
            }
          ],
          "relance": true,
          "reponses_possibles": {
            "liste": [
              {
                "texte": "Un café, s'il vous plaît.",
                "son": "cli1-un-cafe-svp"
              },
              {
                "texte": "Un thé, s'il vous plaît.",
                "son": "cli1-un-the-svp"
              }
            ]
          },
          "sens_seul": "« Vous désirez ? » = « Qu'est-ce que vous prenez ? ». Vous commandez.",
          "revoir_le_texte": {
            "trace": "s3.ferme.texte_revu"
          },
          "enregistrement": {
            "cle": "s3-q1",
            "secondes": 15,
            "facultatif": true
          }
        },
        {
          "type": "question_serveur",
          "id": "3.4.2",
          "si": {
            "palier": [
              "normal",
              "plus"
            ]
          },
          "trace": "s3.ferme.q2",
          "serveur_tirage": [
            {
              "texte": "C'est tout ?",
              "son": "pers1-cest-tout",
              "reponses_possibles": [
                {
                  "texte": "Oui, merci, c'est tout.",
                  "son": "cli1-oui-merci-cest-tout"
                }
              ]
            },
            {
              "texte": "Autre chose ?",
              "son": "pers1-autre-chose",
              "reponses_possibles": [
                {
                  "texte": "Non merci, c'est tout.",
                  "son": "cli1-non-merci-cest-tout"
                }
              ]
            }
          ],
          "reponses": [
            {
              "valeur": "repondu",
              "libelle": "j_ai_repondu"
            },
            {
              "valeur": "relance",
              "libelle": "je_demande_de_repeter"
            }
          ],
          "relance": true,
          "reponses_possibles": {
            "aussi": [
              "C'est tout, merci."
            ]
          },
          "note_interne": "« Oui, merci, c'est tout. » seulement après « C'est tout ? » ; « Non merci, c'est tout. » seulement après « Autre chose ? » (A2).",
          "enregistrement": {
            "cle": "s3-q2",
            "secondes": 15,
            "facultatif": true
          }
        },
        {
          "type": "question_serveur",
          "id": "3.4.s",
          "si": {
            "palier": [
              "simple"
            ]
          },
          "trace": "s3.ferme.q1_simple",
          "consigne": "c-s3-sans-texte-s",
          "images": [
            "img-un-cafe",
            "img-un-the"
          ],
          "lignes": [
            "Maintenant, sans le texte.",
            "Écoutez le serveur.",
            "Répondez à voix haute."
          ],
          "serveur": {
            "texte": "Qu'est-ce que vous prenez ?",
            "son": "pers1-prenez",
            "role": "serveur"
          },
          "reponses": [
            {
              "valeur": "repondu",
              "libelle": "j_ai_repondu"
            },
            {
              "valeur": "relance",
              "libelle": "je_demande_de_repeter"
            }
          ],
          "relance": true,
          "reponses_possibles": {
            "liste": [
              {
                "texte": "Un café, s'il vous plaît.",
                "son": "cli1-un-cafe-svp"
              },
              {
                "texte": "Un thé, s'il vous plaît.",
                "son": "cli1-un-the-svp"
              }
            ]
          },
          "enregistrement": {
            "cle": "s3-qs",
            "secondes": 15,
            "facultatif": true
          }
        },
        {
          "type": "question_serveur",
          "id": "3.4.plus",
          "si": {
            "palier": [
              "plus"
            ]
          },
          "trace": "s3.ferme.q3",
          "serveur": {
            "texte": "Vous payez comment ?",
            "son": "pers1-vous-payez-comment",
            "role": "serveur"
          },
          "reponses": [
            {
              "valeur": "repondu",
              "libelle": "j_ai_repondu"
            },
            {
              "valeur": "relance",
              "libelle": "je_demande_de_repeter"
            }
          ],
          "relance": true,
          "reponses_possibles": {
            "liste": [
              {
                "texte": "Par carte, s'il vous plaît.",
                "son": "cli1-par-carte-svp"
              },
              {
                "texte": "En espèces.",
                "son": "cli1-en-especes"
              }
            ]
          },
          "enregistrement": {
            "cle": "s3-qplus",
            "secondes": 15,
            "facultatif": true
          }
        },
        {
          "type": "question_serveur",
          "id": "3.4.deux",
          "si": {
            "palier": [
              "plus"
            ],
            "option": "commande_pour_deux"
          },
          "trace": "s3.pour_deux",
          "facultatif": true,
          "lignes": [
            "Une collègue est avec vous.",
            "Commandez pour deux."
          ],
          "serveur": {
            "texte": "Pour moi, un thé.",
            "son": null,
            "role": "la collègue (jouée par le formateur)"
          },
          "reponses": [
            {
              "valeur": "repondu",
              "libelle": "j_ai_repondu"
            }
          ],
          "reponses_possibles": {
            "liste": [
              {
                "texte": "Un café pour moi et un thé pour elle, s'il vous plaît.",
                "son": "cli1-cafe-moi-the-elle"
              }
            ]
          },
          "note_interne": "Désactivée par défaut (B0 17) : à activer par le formateur après validation de l'usage. « Un café pour moi » ne commande pas pour deux. v3 : la collègue (jouée par le formateur) n'a pas de son : aucune voix n'a été choisie (option désactivée par défaut) ; voir le rapport.",
          "consigne": "c-s3-deux",
          "enregistrement": {
            "cle": "s3-qdeux",
            "secondes": 15,
            "facultatif": true
          }
        },
        {
          "type": "aide_langue",
          "id": "3.4.aide",
          "aide": "s3",
          "apres": "3.4.1"
        }
      ],
      "carte_formateur": {
        "dit": "Les trois questions des fiches, puis au pas 3.4 « Vous désirez ? » et « C'est tout ? » ou « Autre chose ? », sans montrer le texte. Il joue le serveur à tous les pas « question du serveur ».",
        "note": "Réponse adaptée au rôle sur deux tours (critère local de 02) ; article et préposition gardés (« un café », « par carte », « en espèces ») ; texte revu ou non ; demande de répétition.",
        "a_corriger": "D'abord le sens : produit, moyen de paiement ou rôle si le sens change (ex. « Oui » après « Autre chose ? »). Ensuite seulement, un point de prononciation qui gêne la compréhension. Rien d'autre.",
        "si_temps_manque": "Garder les fiches 1 et 2 ; faire la fiche 3 en écoute avec images ; garder au moins une question du pas 3.4.",
        "a_savoir": "« Un café pour moi » ne commande pas pour deux. « Vous désirez ? » (3.4.1), « Autre chose ? » (3.2.4, 3.4.2) et « Vous payez comment ? » (palier « Un peu plus ») sont des formulations créées ici (à valider par deux francophones) ; d'autres sont possibles (« Et avec ça ? », « Vous voulez autre chose ? »). « Non merci, c'est tout » répond à « Autre chose ? », jamais à « C'est tout ? » (là : « Oui »). Si un ou deux posent problème, voir la carte de S5. Palier « Plus simple » : fiche 1 seulement, puis fiche 2 si le temps le permet ; le texte est visible dès l'écoute. Petit groupe : par deux, l'apprenant-serveur lit la ligne « Le serveur dit », le formateur fait le pas 3.4."
      }
    },
    {
      "id": "s4",
      "titre": "Je dis ma commande sans m'arrêter",
      "duree_min": 5,
      "etape": "Étape 5 sur 7",
      "objectif": "Vous dites votre commande sans vous arrêter au milieu. Le serveur comprend.",
      "note_ecran": "Un seul point : « s'il vous plaît » d'un seul tenant, dans la demande. Aucune règle sur la voix, aucune marque dans le texte, aucune courbe, aucune note.",
      "pas": [
        {
          "type": "film_extrait",
          "id": "4.1",
          "trace": "s4.fini",
          "extrait": "film-p4",
          "consigne": "c-s4-ecoute",
          "lignes": [
            "1. Écoutez la femme du film."
          ],
          "bouton": "ecouter",
          "question": {
            "lignes": [
              "2. Elle a fini de commander ?",
              "Cliquez sur votre réponse."
            ],
            "choix": [
              {
                "valeur": "oui",
                "libelle": "Oui"
              },
              {
                "valeur": "non",
                "libelle": "Non, elle veut autre chose"
              }
            ],
            "bonne": "oui",
            "retour": {
              "oui": "Oui. Elle a fini : elle dit « s'il vous plaît » à la fin.",
              "non": "Écoutez encore. Elle dit « s'il vous plaît », et elle a fini.",
              "bouton_non": {
                "libelle": "ecouter_encore",
                "extrait": "film-p4"
              }
            },
            "consigne": "c-s4-fini"
          }
        },
        {
          "type": "dialogue_devoile",
          "id": "4.2",
          "consigne": "c-s4-ensemble",
          "etiquette": "film",
          "repliques": [
            {
              "role": "La femme",
              "couleur": "client",
              "texte": "Un café noir pour moi, s'il vous plaît.",
              "extrait": "film-p4"
            }
          ],
          "boutons": [
            "reecouter"
          ],
          "lignes_apres": [
            "« S'il vous plaît » va ensemble. Ne vous arrêtez pas au milieu."
          ],
          "aucune_marque": true,
          "note_interne": "Aucune barre, aucune flèche, aucun soulignement dans la phrase.",
          "bouton": "suite"
        },
        {
          "type": "dire",
          "id": "4.3",
          "item": "S4-P1",
          "trace": "s4.imitation",
          "consigne": "c-s4-dites",
          "lignes": [
            "Dites la phrase à voix haute."
          ],
          "boutons": [
            "j_ai_dit_la_phrase"
          ],
          "enregistrement": {
            "cle": "s4-phrase",
            "secondes": 10,
            "facultatif": true
          },
          "retour": {
            "formateur": "celui du formateur",
            "seul_apres_enregistrement": {
              "lignes": [
                "Écoutez-vous. « S'il vous plaît » : ça va ensemble ?"
              ],
              "boutons": [
                "oui",
                "pas_encore"
              ],
              "pas_encore": "Écoutez encore la cliente. Puis dites la phrase encore une fois à voix haute."
            },
            "seul_sans_enregistrement": "pas de question : Suite"
          },
          "variantes": [
            {
              "si": {
                "palier": [
                  "simple"
                ]
              },
              "set": {
                "modeles": [
                  {
                    "role": "la cliente",
                    "texte": "Un café, s'il vous plaît.",
                    "son": "cli1-un-cafe-svp",
                    "visible": true
                  }
                ],
                "note_interne": "Plus simple : on dit le modèle court, pas la phrase longue du film."
              }
            }
          ],
          "modeles": [
            {
              "role": "la femme du film",
              "texte": "Un café noir pour moi, s'il vous plaît.",
              "extrait": "film-p4",
              "visible": true
            }
          ]
        },
        {
          "type": "aide_langue",
          "id": "4.3.aide",
          "aide": "s4",
          "apres": "4.3"
        },
        {
          "type": "choix_images",
          "id": "4.4",
          "trace": "s4.commande_choix",
          "consigne": "c-s4-vous",
          "question": "Maintenant, vous. Vous voulez quoi ? Sélectionnez une image.",
          "choix": [
            {
              "image": "img-un-the",
              "libelle": "un thé"
            },
            {
              "image": "img-un-cafe",
              "libelle": "un café"
            },
            {
              "image": "img-jus-orange",
              "libelle": "un jus d'orange"
            }
          ],
          "bonne": [],
          "sans_retour": true,
          "texte_phrase_visible": false,
          "variantes": [
            {
              "si": {
                "palier": [
                  "simple"
                ]
              },
              "set": {
                "choix": [
                  {
                    "image": "img-un-the",
                    "libelle": "un thé"
                  },
                  {
                    "image": "img-un-cafe",
                    "libelle": "un café"
                  }
                ],
                "voir_la_phrase_avant": true
              }
            },
            {
              "si": {
                "palier": [
                  "plus"
                ]
              },
              "set": {
                "choix": [
                  {
                    "image": "img-un-the",
                    "libelle": "un thé"
                  },
                  {
                    "image": "img-un-cafe",
                    "libelle": "un café"
                  },
                  {
                    "image": "img-jus-orange",
                    "libelle": "un jus d'orange"
                  },
                  {
                    "image": "img-croissant",
                    "libelle": "un croissant"
                  }
                ],
                "choix_nombre": 2
              }
            }
          ]
        },
        {
          "type": "dire",
          "id": "4.4.d",
          "item": "S4-P2",
          "trace": "s4.commande",
          "consigne": "c-s4-vous-dire",
          "lignes": [
            "Dites votre commande à voix haute.",
            "Ne vous arrêtez pas au milieu."
          ],
          "boutons": [
            "j_ai_dit_ma_commande"
          ],
          "enregistrement": {
            "cle": "s4-commande",
            "secondes": 10,
            "facultatif": true
          },
          "aucun_texte_avant": true,
          "reponse_possible": {
            "bouton": "voir_une_reponse_possible",
            "selon_image": {
              "img-un-the": {
                "texte": "Un thé, s'il vous plaît.",
                "son": "cli1-un-the-svp"
              },
              "img-un-cafe": {
                "texte": "Un café, s'il vous plaît.",
                "son": "cli1-un-cafe-svp"
              },
              "img-jus-orange": {
                "texte": "Un jus d'orange, s'il vous plaît.",
                "son": "cli1-un-jus-dorange-svp"
              }
            }
          },
          "retour": {
            "formateur": "le formateur dit ce qu'il a compris (« D'accord : un thé. »)",
            "seul": {
              "lignes": [
                "Comparez avec votre réponse."
              ],
              "boutons": [
                "j_ai_dit_ca_ou_presque",
                "pas_encore"
              ]
            }
          },
          "variantes": [
            {
              "si": {
                "palier": [
                  "plus"
                ]
              },
              "set": {
                "reponse_possible.selon_image": null,
                "reponse_possible.exemple": "Un café et un croissant, s'il vous plaît."
              }
            }
          ]
        },
        {
          "type": "dire",
          "id": "4.5",
          "trace": "s4.geste",
          "facultatif": true,
          "consigne": "c-s4-geste",
          "lignes": [
            "Si vous voulez, redites votre commande à voix haute.",
            "Faites un geste de la main.",
            "Un seul geste pour toute la phrase."
          ],
          "boutons": [
            "c_est_fait",
            "je_passe"
          ],
          "retour": null,
          "note_interne": "Aucune promesse (« c'est mieux avec le geste » n'est écrit nulle part). v3 : réponse possible (modèle sonore) comme au pas 4.4.d, selon l'image choisie.",
          "enregistrement": {
            "cle": "s4-geste",
            "secondes": 15,
            "facultatif": true
          },
          "reponse_possible": {
            "bouton": "voir_une_reponse_possible",
            "selon_image": {
              "img-un-the": {
                "texte": "Un thé, s'il vous plaît.",
                "son": "cli1-un-the-svp"
              },
              "img-un-cafe": {
                "texte": "Un café, s'il vous plaît.",
                "son": "cli1-un-cafe-svp"
              },
              "img-jus-orange": {
                "texte": "Un jus d'orange, s'il vous plaît.",
                "son": "cli1-un-jus-dorange-svp"
              }
            }
          }
        }
      ],
      "carte_formateur": {
        "dit": "Fait écouter le film (p4) ; au pas 4.4, répond en serveur : « D'accord : un thé. »",
        "note": "Le serveur comprend-il la commande et la fin de la demande ? (jugement humain ; pas de mesure de hauteur). Grille « groupe ciblé » : 0 = coupures qui empêchent de comprendre ; 1 = compris, avec hésitation à l'intérieur ; 2 = d'un seul tenant, sans coupure gênante. Ne comptent pas comme coupure : le silence avant de répondre ; une pause entre « Un café » et « s'il vous plaît ».",
        "a_corriger": "« S'il vous plaît » coupé au milieu : « Je vous rejoue toute la phrase. [rejouer l'extrait] Redites-la, « s'il vous plaît » avec le reste. » Puis accepter sans autre commentaire dès que « s'il vous plaît » est d'un seul tenant ; un tour de plus au besoin ; un seul point. Phrase déjà intelligible : « D'accord : un thé. Merci. » — on ne corrige pas la mélodie ; on passe. Si chaque mot est appuyé séparément mais compris : le noter, sans l'attribuer à la langue de l'apprenant.",
        "si_temps_manque": "Supprimer d'abord le pas 4.5 (geste et deuxième fois), puis le pas 4.3 ; garder 4.1 et 4.4.",
        "a_savoir": "Hypothèse à vérifier à l'écoute de l'extrait p4 : la fin de la demande peut durer un peu plus longtemps (allongement final de groupe). Ce n'est ni une règle, ni une montée obligatoire. Le statut de l'accent initial est discuté ; ne pas le présenter comme fait. Les frontières de groupe aident l'accès aux mots. Pause : sa place compte plus que sa durée. Ne faites pas copier la mélodie. Geste : facultatif, aucune promesse de gain. Aucune barre ni marque dans le texte avant écoute experte. Mesure automatique : une seule pause dans l'extrait, entre « moi » et « s'il vous plaît » (0,47 s), à confirmer à l'oreille. Le retour du pas 4.1 s'appuie sur le sens (« s'il vous plaît » = formule de clôture), pas sur la voix."
      }
    },
    {
      "id": "s5",
      "titre": "Je commande et je paie",
      "duree_min": 10,
      "etape": "Étape 6 sur 7",
      "objectif": "Vous parlez au serveur. Vous commandez. Vous répondez. Si vous ne comprenez pas, demandez de répéter (= dire encore).",
      "note_ecran": "Trois conversations, avec de moins en moins d'aide : texte visible, puis images seulement, puis rien. Les questions du serveur sont sur sa carte privée (formateur.cartes_privees_s5) ; jamais sur l'écran de l'apprenant.",
      "pas": [
        {
          "type": "dire",
          "id": "5.0",
          "trace": "s5.pardon",
          "image": "img-pardon",
          "consigne": "c-s5-pardon",
          "lignes": [
            "Vous ne comprenez pas le serveur ?",
            "Demandez de répéter (= dire encore)."
          ],
          "modeles": [
            {
              "role": "la cliente",
              "texte": "Pardon, vous pouvez répéter, s'il vous plaît ?",
              "son": "cli1-pardon-repeter"
            }
          ],
          "lignes_apres": [
            "1. Écoutez la phrase.",
            "2. Dites-la à voix haute."
          ],
          "boutons": [
            "je_l_ai_dit"
          ],
          "retour": null,
          "enregistrement": {
            "cle": "s5-pardon",
            "secondes": 15,
            "facultatif": true
          }
        },
        {
          "type": "conversation",
          "id": "5.1",
          "item": "S5-P1",
          "trace": "s5.c1",
          "numero": 1,
          "image": "img-comptoir",
          "consigne": "c-s5-conv1",
          "lignes": [
            "Conversation 1. Vous voulez un café.",
            "Le serveur pose une question.",
            "Écoutez bien. Répondez à voix haute."
          ],
          "aide_visible": {
            "type": "texte",
            "phrases": [
              "Un café, s'il vous plaît.",
              "Oui, merci, c'est tout."
            ],
            "rappel_pardon": "Vous ne comprenez pas ? « Pardon, vous pouvez répéter, s'il vous plaît ? »",
            "rappel_pardon_son": "cli1-pardon-repeter"
          },
          "tours": [
            {
              "sons": [
                "pers1-bonjour",
                "pers1-prenez"
              ],
              "carte": "c1.t1",
              "image_relance": "img-f-commander"
            },
            {
              "sons": [
                "pers1-cest-tout"
              ],
              "carte": "c1.t2",
              "image_relance": "img-f-finir"
            },
            {
              "sons": [
                "pers1-tres-bien-merci"
              ],
              "carte": "c1.t3",
              "image_relance": null,
              "fin": true
            }
          ],
          "reponses_possibles_fin": null,
          "fin": {
            "bouton": "conversation_finie"
          },
          "seul": {
            "boutons": [
              "j_ai_repondu",
              "reecouter",
              "je_demande_de_repeter"
            ],
            "invite": "a_vous_repondez",
            "relance": [
              "0,9x",
              "image"
            ]
          },
          "groupe": {
            "carte_serveur_apprenant": true
          },
          "retour_pendant": null,
          "variantes": [
            {
              "si": {
                "mode": [
                  "formateur",
                  "groupe",
                  "seul"
                ]
              },
              "set": {
                "note_seul": "Les réponses possibles s'affichent à la fin de chaque conversation, pas après chaque tour."
              }
            }
          ],
          "enregistrement": {
            "cle": "s5-c1",
            "secondes": 30,
            "facultatif": true
          },
          "note_interne": "v3 : l'objet `seul` (boutons « Écouter le serveur », « J'ai répondu », « Je demande de répéter », relance) s'applique à tous les modes."
        },
        {
          "type": "texte",
          "id": "5.2",
          "si": {
            "mode": [
              "formateur",
              "groupe"
            ]
          },
          "trace": "s5.c1.une_chose",
          "lignes": [
            "Écoutez votre formateur : une seule chose à changer."
          ],
          "bouton": "suite",
          "consigne": "c-s5-formateur"
        },
        {
          "type": "dire",
          "id": "5.2.seul",
          "trace": "s5.c1.une_chose",
          "lignes": [
            "Regardez les réponses possibles.",
            "Choisissez une phrase.",
            "Redites-la à voix haute."
          ],
          "modeles": [
            {
              "role": "la cliente",
              "texte": "Un café, s'il vous plaît.",
              "son": "cli1-un-cafe-svp"
            },
            {
              "role": "la cliente",
              "texte": "Oui, merci, c'est tout.",
              "son": "cli1-oui-merci-cest-tout"
            }
          ],
          "boutons": [
            "je_redis_une_phrase",
            "c_est_bon"
          ],
          "consigne": "c-s5-seul",
          "enregistrement": {
            "cle": "s5-redire",
            "secondes": 15,
            "facultatif": true
          },
          "note_interne": "v3 : plus de restriction au mode seul (les modèles sonores sont proposés dans tous les modes ; le formateur peut parler lui-même)."
        },
        {
          "type": "aide_langue",
          "id": "5.1.aide",
          "aide": "s5",
          "apres": "5.1.t1"
        },
        {
          "type": "conversation",
          "id": "5.3",
          "item": "S5-P2",
          "trace": "s5.c2",
          "numero": 2,
          "consigne": "c-s5-conv2",
          "lignes": [
            "Conversation 2. Regardez vos deux images.",
            "Ne les montrez pas au serveur.",
            "Commandez. Puis répondez à voix haute."
          ],
          "aide_visible": {
            "type": "images_secretes",
            "images_fixes": [
              "img-un-the"
            ],
            "image_tiree_au_sort": [
              "img-carte-bancaire",
              "img-especes"
            ],
            "phrases": [],
            "rappel_pardon": "Pardon, vous pouvez répéter, s'il vous plaît ?",
            "rappel_pardon_son": "cli1-pardon-repeter"
          },
          "tours": [
            {
              "sons": [
                "pers1-prenez"
              ],
              "carte": "c2.t1",
              "image_relance": "img-f-commander"
            },
            {
              "sons": [
                "pers1-carte-ou-especes"
              ],
              "carte": "c2.t2",
              "image_relance": "img-f-payer"
            },
            {
              "sons": [
                "pers1-tres-bien-merci"
              ],
              "carte": "c2.t3",
              "image_relance": null,
              "fin": true
            }
          ],
          "fin": {
            "bouton": "conversation_finie"
          },
          "verif": {
            "lignes": [
              "Regardez vos images.",
              "Le serveur a compris la même chose ?"
            ],
            "boutons": [
              "oui",
              "non"
            ],
            "non": {
              "retour": "Dites encore votre commande ou votre paiement à voix haute.",
              "rejouer_le_tour": true,
              "une_fois": true
            },
            "trace": "s5.c2.compris_pareil",
            "consigne": "c-s5-verif"
          },
          "reponses_possibles_fin": [
            {
              "apres": "commande",
              "liste": [
                {
                  "texte": "Un thé, s'il vous plaît.",
                  "son": "cli1-un-the-svp"
                }
              ],
              "apres_sons": [
                "pers1-prenez"
              ]
            },
            {
              "apres": "paiement",
              "liste": [
                {
                  "texte": "Par carte, s'il vous plaît.",
                  "son": "cli1-par-carte-svp"
                },
                {
                  "texte": "En espèces.",
                  "son": "cli1-en-especes"
                }
              ],
              "apres_sons": [
                "pers1-carte-ou-especes"
              ]
            }
          ],
          "seul": {
            "boutons": [
              "j_ai_repondu",
              "reecouter",
              "je_demande_de_repeter"
            ],
            "invite": "a_vous_repondez",
            "relance": [
              "0,9x",
              "image"
            ]
          },
          "groupe": {
            "carte_serveur_apprenant": true
          },
          "variantes": [
            {
              "si": {
                "palier": [
                  "simple"
                ]
              },
              "set": {
                "aide_visible.type": "images_et_debut_de_phrase",
                "aide_visible.phrases": [
                  "Un … , s'il vous plaît."
                ],
                "tours": [
                  {
                    "sons": [
                      "pers1-prenez"
                    ],
                    "carte": "c2.t1",
                    "image_relance": "img-f-commander"
                  },
                  {
                    "sons": [
                      "pers1-cest-tout"
                    ],
                    "carte": "c2.s2",
                    "image_relance": "img-f-finir"
                  },
                  {
                    "sons": [
                      "pers1-carte-ou-especes"
                    ],
                    "carte": "c2.t2",
                    "image_relance": "img-f-payer",
                    "reponse": "toucher_l_image_ou_un_mot"
                  },
                  {
                    "sons": [
                      "pers1-tres-bien-merci"
                    ],
                    "carte": "c2.t3",
                    "image_relance": null,
                    "fin": true
                  }
                ]
              }
            },
            {
              "si": {
                "palier": [
                  "plus"
                ]
              },
              "set": {
                "aide_visible.images_fixes": [
                  "img-deux-thes"
                ],
                "tours": [
                  {
                    "sons": [
                      "pers1-prenez"
                    ],
                    "carte": "c2.t1",
                    "image_relance": "img-f-commander"
                  },
                  {
                    "sons": [
                      "pers1-trois-euros"
                    ],
                    "carte": "c2.plus.prix",
                    "image_relance": "img-f-payer",
                    "reponse": "toucher_une_image",
                    "images": [
                      "img-2-euros",
                      "img-3-euros"
                    ],
                    "bonne": "img-3-euros",
                    "a_reconnaitre_seulement": true
                  },
                  {
                    "sons": [
                      "pers1-carte-ou-especes"
                    ],
                    "carte": "c2.t2",
                    "image_relance": "img-f-payer"
                  },
                  {
                    "sons": [
                      "pers1-tres-bien-merci"
                    ],
                    "carte": "c2.t3",
                    "image_relance": null,
                    "fin": true
                  }
                ],
                "reponses_possibles_fin": [
                  {
                    "apres": "commande",
                    "liste": [
                      {
                        "texte": "Deux thés, s'il vous plaît.",
                        "son": "cli1-deux-thes-svp"
                      }
                    ],
                    "apres_sons": [
                      "pers1-prenez"
                    ]
                  },
                  {
                    "apres": "paiement",
                    "liste": [
                      {
                        "texte": "Par carte, s'il vous plaît.",
                        "son": "cli1-par-carte-svp"
                      },
                      {
                        "texte": "En espèces.",
                        "son": "cli1-en-especes"
                      }
                    ],
                    "apres_sons": [
                      "pers1-carte-ou-especes"
                    ]
                  }
                ]
              }
            }
          ],
          "enregistrement": {
            "cle": "s5-c2",
            "secondes": 30,
            "facultatif": true
          },
          "note_interne": "v3 : l'objet `seul` (boutons « Écouter le serveur », « J'ai répondu », « Je demande de répéter », relance) s'applique à tous les modes. I2 (QA v3) : chaque entrée de reponses_possibles_fin est montrée juste après « J'ai répondu » au tour dont le son est dans apres_sons (ou apres)."
        },
        {
          "type": "conversation",
          "id": "5.4",
          "item": "S5-P3",
          "trace": "s5.c3",
          "numero": 3,
          "consigne": "c-s5-conv3",
          "lignes": [
            "Conversation 3. Sans texte, sans image.",
            "Vous voulez un café.",
            "Écoutez bien le serveur. Répondez à voix haute."
          ],
          "aide_visible": {
            "type": "rien",
            "rappel_pardon": null
          },
          "tours": [
            {
              "sons": [
                "pers1-prenez"
              ],
              "carte": "c3.t1",
              "image_relance": "img-f-commander"
            },
            {
              "sons": [
                "pers1-un-the"
              ],
              "carte": "c3.t2",
              "image_relance": null,
              "malentendu": "confirmation_erronee"
            },
            {
              "sons": [
                "pers1-cest-tout"
              ],
              "carte": "c3.t3",
              "image_relance": "img-f-finir",
              "ordre_ab": "premier_A_second_B"
            },
            {
              "sons": [
                "pers1-carte-ou-especes"
              ],
              "carte": "c3.t4",
              "image_relance": "img-f-payer",
              "ordre_ab": "second_A_premier_B"
            },
            {
              "sons": [
                "pers1-tres-bien-merci"
              ],
              "carte": "c3.t5",
              "image_relance": null,
              "fin": true
            }
          ],
          "ordre": {
            "defaut": "A",
            "A": [
              "c3.t3",
              "c3.t4"
            ],
            "B": [
              "c3.t4",
              "c3.t3"
            ],
            "mode_seul": "tirage_au_sort",
            "choix": "formateur"
          },
          "enregistrement": {
            "cle": "s5-c3",
            "secondes": 30,
            "facultatif": true
          },
          "reparation": [
            "resolue",
            "non_resolue",
            "non_sollicitee"
          ],
          "reponses_possibles_fin": [
            {
              "apres": "pers1-un-the",
              "liste": [
                {
                  "texte": "Non, un café, s'il vous plaît.",
                  "son": "cli1-non-un-cafe-svp"
                }
              ],
              "aussi": [
                "Un café."
              ],
              "sens": "Le serveur a compris « un thé ». Vous dites « non » et vous redites votre boisson."
            },
            {
              "apres": "pers1-cest-tout",
              "liste": [
                {
                  "texte": "Oui, merci, c'est tout.",
                  "son": "cli1-oui-merci-cest-tout"
                }
              ]
            },
            {
              "apres": "pers1-carte-ou-especes",
              "liste": [
                {
                  "texte": "Par carte, s'il vous plaît.",
                  "son": "cli1-par-carte-svp"
                },
                {
                  "texte": "En espèces.",
                  "son": "cli1-en-especes"
                }
              ]
            }
          ],
          "fin": {
            "bouton": "conversation_finie",
            "message": "fin_conversations"
          },
          "seul": {
            "boutons": [
              "j_ai_repondu",
              "reecouter",
              "je_demande_de_repeter"
            ],
            "invite": "a_vous_repondez",
            "relance": [
              "0,9x",
              "image"
            ]
          },
          "groupe": {
            "carte_serveur_apprenant": false
          },
          "variantes": [
            {
              "si": {
                "palier": [
                  "simple"
                ]
              },
              "set": {
                "tours": [
                  {
                    "sons": [
                      "pers1-prenez"
                    ],
                    "carte": "c3.t1",
                    "image_relance": "img-f-commander"
                  },
                  {
                    "sons": [
                      "pers1-un-the"
                    ],
                    "carte": "c3.t2",
                    "image_relance": null,
                    "malentendu": "confirmation_erronee",
                    "acceptees": [
                      "Non, un café.",
                      "Un café.",
                      "Pardon ?"
                    ]
                  },
                  {
                    "sons": [
                      "pers1-cest-tout"
                    ],
                    "carte": "c3.t3",
                    "image_relance": "img-f-finir"
                  },
                  {
                    "sons": [
                      "pers1-tres-bien-merci"
                    ],
                    "carte": "c3.t5",
                    "image_relance": null,
                    "fin": true
                  }
                ],
                "ordre": null,
                "fin.message": "fin_conversations_simple",
                "reponses_possibles_fin": [
                  {
                    "apres": "pers1-un-the",
                    "liste": [
                      {
                        "texte": "Non, un café, s'il vous plaît.",
                        "son": "cli1-non-un-cafe-svp"
                      }
                    ],
                    "aussi": [
                      "Un café."
                    ],
                    "sens": "Le serveur a compris « un thé ». Vous dites « non » et vous redites votre boisson."
                  },
                  {
                    "apres": "pers1-cest-tout",
                    "liste": [
                      {
                        "texte": "Oui, merci, c'est tout.",
                        "son": "cli1-oui-merci-cest-tout"
                      }
                    ]
                  }
                ],
                "note_interne": "Plus simple : « Pardon ? » remplace la phrase longue si besoin."
              }
            },
            {
              "si": {
                "palier": [
                  "plus"
                ]
              },
              "set": {
                "tours": [
                  {
                    "sons": [
                      "pers1-prenez"
                    ],
                    "carte": "c3.t1",
                    "image_relance": "img-f-commander"
                  },
                  {
                    "sons": [
                      "pers1-un-the"
                    ],
                    "carte": "c3.t2",
                    "image_relance": null,
                    "malentendu": "confirmation_erronee"
                  },
                  {
                    "sons": [
                      "pers1-cest-tout"
                    ],
                    "carte": "c3.t3",
                    "image_relance": "img-f-finir",
                    "ordre_ab": "premier_A_second_B"
                  },
                  {
                    "sons": [
                      "pers1-vous-payez-comment"
                    ],
                    "carte": "c3.t4",
                    "image_relance": "img-f-payer",
                    "ordre_ab": "second_A_premier_B",
                    "remplace": "pers1-carte-ou-especes"
                  },
                  {
                    "sons": [
                      "pers1-tres-bien-merci"
                    ],
                    "carte": "c3.t5",
                    "image_relance": null,
                    "fin": true
                  }
                ]
              }
            }
          ],
          "note_interne": "v3 : l'objet `seul` (boutons « Écouter le serveur », « J'ai répondu », « Je demande de répéter », relance) s'applique à tous les modes."
        },
        {
          "type": "conversation",
          "id": "5.5",
          "si": {
            "palier": [
              "plus"
            ]
          },
          "trace": "s5.defi",
          "facultatif": true,
          "jamais_dans_le_seuil": true,
          "numero": 4,
          "consigne": "c-s5-defi",
          "lignes": [
            "Un exercice plus difficile (= un défi), si vous voulez. Vous voulez un thé."
          ],
          "boutons_depart": [
            "je_fais_le_defi",
            "je_passe"
          ],
          "attendu_apprenant": "Un thé, s'il vous plaît.",
          "tours": [
            {
              "sons": [
                "pers1-plus-de-cafe-noir"
              ],
              "carte": "defi.t1",
              "image_relance": null
            }
          ],
          "apres_premier_essai": {
            "bouton": "voir_une_image",
            "images": [
              "img-plus-de-the",
              "img-un-cafe"
            ],
            "note_interne": "Pictogramme « plus de thé » : img-plus-de-the (existe)."
          },
          "reponses_possibles_fin": [
            {
              "apres": "pers1-plus-de-cafe-noir",
              "liste": [
                {
                  "texte": "Oui, un café, d'accord.",
                  "son": "cli1-un-cafe-long-daccord"
                },
                {
                  "texte": "Oui, merci.",
                  "son": "cli1-oui-merci"
                },
                {
                  "texte": "Non merci.",
                  "son": "cli1-non-merci"
                }
              ],
              "sens": "« Il n'y a plus de thé » = le thé, c'est fini. Le serveur propose un café."
            }
          ],
          "seul": {
            "boutons": [
              "j_ai_repondu",
              "reecouter",
              "je_demande_de_repeter"
            ],
            "invite": "a_vous_repondez",
            "relance": [
              "0,9x",
              "image"
            ]
          },
          "enregistrement": {
            "cle": "s5-defi",
            "secondes": 30,
            "facultatif": true
          },
          "note_interne": "v3 : l'objet `seul` (boutons « Écouter le serveur », « J'ai répondu », « Je demande de répéter », relance) s'applique à tous les modes."
        }
      ],
      "carte_formateur": {
        "dit": "Le serveur, avec la carte privée (conversation 1 : « C'est tout ? » ; conversation 2 : « Carte ou espèces ? » ; conversation 3 : « Un thé ? » après la commande, puis ordre A ou B). Ne montre jamais sa carte. Après « Pardon, vous pouvez répéter… » : redit plus lentement et plus clairement ; si besoin reformule (« Vous voulez autre chose ? », « Vous payez par carte ou en espèces ? »), sans donner la réponse. Au pas 5.3, dit ce qu'il a compris (« Un thé, en espèces. ») et l'apprenant montre ses images.",
        "note": "L'achat est-il mené, ou le malentendu réparé ? Nombre de relances et d'aides (pas la vitesse seule). Réparation après « Un thé ? » : résolue / non résolue / non sollicitée. Si l'apprenant corrige tout de suite, c'est réussi ; ne pas compter l'absence de « Pardon… » comme un manque. Grille sens transmis / réponse adaptée / groupe ciblé (0/1/2).",
        "a_corriger": "Un seul point (pas 5.2). Le sens d'abord : boisson, quantité, paiement, oui/non. Sinon, la coupure à l'intérieur de « par carte » ou de « s'il vous plaît ». Une pause pour attendre le serveur n'est pas un défaut. « un » (voyelle nasale) et « vous » : n'en parler que si le sens devient ambigu, sans supposer la langue de l'apprenant ; si « deux » est mal reconnu, comparer deux prises du mot dans la phrase.",
        "si_temps_manque": "Garder au moins une conversation (la 3, ou la 1 au palier « Plus simple »). Supprimer d'abord le pas 5.2 écrit, puis la conversation 2. Ne jamais ajouter le défi à l'exercice de base.",
        "a_savoir": "L'ordre B (payer puis « C'est tout ? ») est moins courant dans un vrai café ; il sert à vérifier que l'apprenant écoute la question au lieu de réciter. La tâche « Un thé ? » (confirmation erronée) est jouée en conversation 3 pour tous les paliers, y compris « Plus simple » (avec « Pardon ? » accepté) : elle mesure la réparation d'un malentendu, pas toutes les stratégies face à un son mal entendu ; le dossier 02 la décrit dans le paragraphe du défi facultatif. Petit groupe : l'apprenant-serveur ouvre « Carte du serveur — ne la montrez pas » sur son appareil (non évalué). Défi (palier « Un peu plus ») : « Il n'y a plus de thé. Un café ? »."
      }
    },
    {
      "id": "s6",
      "titre": "J'écoute deux nouvelles personnes",
      "duree_min": 5,
      "etape": "Étape 7 sur 7",
      "objectif": "Vous écoutez un nouveau dialogue. Vous dites ce que veut la cliente. Puis vous voyez ce que vous avez fait.",
      "note_ecran": "Le dialogue de S6 n'est jamais entendu avant cet écran (le moteur ne le charge pas avant l'ouverture de S6).",
      "pas": [
        {
          "type": "ecoute_sans_texte",
          "id": "6.1",
          "item": "S6-C1",
          "trace": "s6",
          "son": "s6-dialogue",
          "unique": false,
          "condition": "audio_sans_texte",
          "image": "img-comptoir-2",
          "consigne": "c-s6-ecoute",
          "question": "À la fin, la cliente veut combien de cafés ?",
          "e1": {
            "lignes": [
              "Vous êtes au café.",
              "Écoutez deux nouvelles personnes : une serveuse et une cliente.",
              "À la fin, la cliente veut combien de cafés ?",
              "Vous pouvez écouter plusieurs fois."
            ],
            "bouton": "ecouter"
          },
          "e2": {
            "saisie": "nombre",
            "nombre_max": 4,
            "consigne": "c-e-nombre-s6",
            "lignes": [
              "Dites le nombre à voix haute. Puis sélectionnez le bon nombre."
            ],
            "boutons": [
              "chiffre_1",
              "chiffre_2",
              "chiffre_3",
              "chiffre_4",
              "je_ne_sais_pas"
            ]
          },
          "e3": {
            "consigne": "c-e-images-s6",
            "lignes": [
              "Regardez les deux images. Sélectionnez la bonne réponse."
            ],
            "images": [
              {
                "image": "img-un-cafe",
                "libelle": "un café",
                "valeur": "un"
              },
              {
                "image": "img-deux-cafes",
                "libelle": "deux cafés",
                "valeur": "deux"
              }
            ],
            "ordre": "fixe"
          },
          "e4": {
            "consigne": null,
            "lignes": [],
            "bouton": null,
            "inutilise": true
          },
          "e5": {
            "etiquette": "cree",
            "repliques": [
              {
                "role": "La serveuse",
                "couleur": "personnel",
                "texte": "Un café et un thé ?"
              },
              {
                "role": "La cliente",
                "couleur": "client",
                "texte": "Non, deux cafés, s'il vous plaît."
              },
              {
                "role": "La serveuse",
                "couleur": "personnel",
                "texte": "Deux cafés, d'accord."
              }
            ],
            "boutons": [
              "reecouter",
              "la_cliente"
            ],
            "son_cliente": "s6-r2",
            "retour": {
              "commun": "La cliente dit « Non ». Elle change : deux cafés.",
              "rappel_reponses": "Vos réponses : 1re réponse : … · avec les images : … · nombre d'écoutes : …",
              "note_interne": "Le même retour pour tous, sans « juste » ni « faux »."
            }
          },
          "bonne": {
            "valeur": "deux",
            "image": "img-deux-cafes",
            "libelle": "deux cafés"
          },
          "variantes": [
            {
              "si": {
                "mode": [
                  "groupe"
                ]
              },
              "set": {
                "e2.lignes": [
                  "Ne parlez pas. Sélectionnez le bon nombre."
                ],
                "e2.consigne": "c-e-nombre-groupe-s6"
              }
            }
          ]
        },
        {
          "type": "aide_langue",
          "id": "6.1.aide",
          "aide": "s6",
          "apres": "6.1.e2"
        },
        {
          "type": "aide_langue",
          "id": "6.1.changement",
          "aide": "changement_apres_non",
          "apres": "6.1.e5"
        },
        {
          "type": "question_serveur",
          "id": "6.6",
          "item": "S6-P1",
          "trace": "s6.parole",
          "image": "img-serveuse",
          "consigne": "c-s6-vous",
          "lignes": [
            "1. Écoutez la serveuse.",
            "2. Répondez à voix haute.",
            "Vous pouvez demander de répéter."
          ],
          "serveur": {
            "texte": "Et pour vous ?",
            "son": "s6-question-vous",
            "role": "serveuse"
          },
          "reponses": [
            {
              "valeur": "repondu",
              "libelle": "j_ai_repondu"
            },
            {
              "valeur": "repete",
              "libelle": "j_ai_demande_de_repeter",
              "effet": "redit_une_fois_puis_boutons_reviennent"
            },
            {
              "valeur": "rien",
              "libelle": "je_n_ai_pas_repondu"
            }
          ],
          "enregistrement": {
            "cle": "s6-parole",
            "secondes": 15,
            "facultatif": true
          },
          "retour": {
            "formateur": "la serveuse confirme (« Un thé, d'accord. »)",
            "seul": "bloc « Réponses possibles » (tous les modes en v3)"
          },
          "reponses_possibles": {
            "apres_toucher": true,
            "liste": [
              {
                "texte": "Un café, s'il vous plaît.",
                "son": "cli1-un-cafe-svp"
              },
              {
                "texte": "Un thé, s'il vous plaît.",
                "son": "cli1-un-the-svp"
              }
            ],
            "comparer": true
          },
          "variantes": [
            {
              "si": {
                "palier": [
                  "simple"
                ]
              },
              "set": {
                "images_aide_apres_essai": [
                  "img-un-cafe",
                  "img-un-the"
                ]
              }
            }
          ]
        },
        {
          "type": "bilan",
          "id": "6.7",
          "ref": "bilan",
          "trace": "bilan",
          "consigne": "c-bilan"
        }
      ],
      "carte_formateur": {
        "dit": "Laisse l'apprenant lancer le dialogue et le réécouter librement, sans commentaire. Pose « Et pour vous ? » (ou fait jouer la question de la nouvelle voix). Au pas 6.6 la serveuse confirme : « Un thé, d'accord. »",
        "note": "Choix final compris à la 1re réponse ou après les images ; nombre d'écoutes ; degré d'aide à part ; réponse à la question simple. Les réponses sont enregistrées par le support ; le formateur ajoute la réponse libre entendue.",
        "a_corriger": "Aucun avant le pas 6.5. Ensuite, un seul commentaire sur le sens : « La cliente a changé après « non ». »",
        "si_temps_manque": "Ne jamais supprimer les pas 6.1 à 6.5. Raccourcir le bilan (partie « J'écoute » seulement) et renvoyer « Ce que je sais dire » à l'écran « Après le cours ».",
        "a_savoir": "Pas de « deux cafés » en exemple pendant S1 à S5. À dire dans tout compte rendu : c'est un transfert proche (même construction qu'au début, autres voix, autre produit) ; un seul dialogue ne montre pas une compréhension générale ; début et fin sont deux formes parallèles, à comparer avec prudence ; aucun groupe de comparaison.",
        "validite": "Tant que audio/humain/s6-dialogue.mp3 n'existe pas, le test « voix humaine nouvelle » manque."
      }
    },
    {
      "id": "apres",
      "titre": "Après le cours : je continue",
      "duree_min": 5,
      "duree_texte": "3 à 5 minutes dans 2 jours, 3 à 5 minutes dans 7 jours. Un bloc de 5 à 8 minutes le jour même, si l'apprenant veut.",
      "etape": "Après le cours",
      "objectif": "Vous revenez deux fois, pour quelques minutes. Vous retrouvez vos phrases sans regarder. Vous écoutez des voix nouvelles.",
      "pas": [
        {
          "type": "rappels",
          "id": "P.0",
          "consigne": "c-apres-debut",
          "lignes": [
            "Revenez deux fois.",
            "Dans 2 jours : 3 à 5 minutes.",
            "Dans 7 jours : 3 à 5 minutes."
          ],
          "rendez_vous": [
            {
              "id": "j2",
              "jours": 2,
              "modele": "dans_2_jours"
            },
            {
              "id": "j7",
              "jours": 7,
              "modele": "dans_7_jours"
            }
          ],
          "blocs_a_ouvrir": [
            "bloc_aujourdhui",
            "bloc_2_jours",
            "bloc_7_jours"
          ],
          "etats": [
            "etat_a_faire",
            "etat_fait_le"
          ],
          "verrou_par_date": false,
          "note_interne": "Les blocs ne sont pas verrouillés par la date ; la date réelle est enregistrée. QA v3 M4 : le son c-apres-debut dit les parties fixes du texte affiché (les dates varient et ne sont pas lues) ; `lignes` n'est pas rendu par le moteur."
        },
        {
          "type": "aide_langue",
          "id": "P.0.aide",
          "aide": "apres",
          "apres": null
        },
        {
          "type": "rappels",
          "id": "P.A",
          "id_bloc": "aujourdhui",
          "titre": "bloc_aujourdhui",
          "titre_long": "Aujourd'hui, si je veux : deux dialogues en plus",
          "duree_texte": "5 à 8 minutes",
          "facultatif": true,
          "lignes": [
            "Deux dialogues nouveaux, avec des voix nouvelles."
          ],
          "boutons": [
            "je_commence",
            "plus_tard"
          ],
          "serie": {
            "A": [
              "b-t1",
              "b-t2"
            ],
            "B": [
              "b-d1",
              "b-d2"
            ],
            "nom": "paire de sortie"
          },
          "fin": "Merci. Vous avez fini ces dialogues. Vous pouvez fermer cette page.",
          "reponses_par_dialogue": true,
          "total": false,
          "trace": [
            "b-t1",
            "b-t2"
          ],
          "consigne": "c-apres-bloc-a"
        },
        {
          "type": "rappels",
          "id": "P.B",
          "id_bloc": "j2",
          "titre": "bloc_2_jours",
          "duree_texte": "3 à 5 minutes",
          "etapes": [
            {
              "id": "j2.1",
              "titre": "Je retrouve mes phrases, avec une voix nouvelle",
              "duree_texte": "2 minutes",
              "consigne": "c-apres-phrases",
              "trace": "j2.rappel",
              "lignes": [
                "Une nouvelle serveuse vous parle.",
                "1. Écoutez la serveuse.",
                "2. Répondez à voix haute.",
                "Ne regardez pas vos phrases."
              ],
              "tours": [
                {
                  "n": 1,
                  "son": "j2-prenez",
                  "bouton": "ecouter_la_serveuse",
                  "reponse": [
                    {
                      "texte": "Un café, s'il vous plaît.",
                      "son": "cli1-un-cafe-svp"
                    }
                  ]
                },
                {
                  "n": 2,
                  "son": "j2-cest-tout",
                  "bouton": "ecouter",
                  "reponse": [
                    {
                      "texte": "Oui, merci, c'est tout.",
                      "son": "cli1-oui-merci-cest-tout"
                    }
                  ]
                },
                {
                  "n": 3,
                  "son": "j2-carte-ou-especes",
                  "bouton": "ecouter",
                  "reponse": [
                    {
                      "texte": "Par carte, s'il vous plaît.",
                      "son": "cli1-par-carte-svp"
                    },
                    {
                      "texte": "En espèces.",
                      "son": "cli1-en-especes"
                    }
                  ],
                  "reponse_par_image": {
                    "palier": [
                      "simple"
                    ],
                    "images": [
                      "img-carte-bancaire",
                      "img-especes"
                    ]
                  }
                },
                {
                  "n": 4,
                  "son": null,
                  "image": "img-pardon",
                  "lignes": [
                    "Vous ne comprenez pas la serveuse.",
                    "Vous dites quoi ?"
                  ],
                  "reponse": [
                    {
                      "texte": "Pardon, vous pouvez répéter, s'il vous plaît ?",
                      "son": "cli1-pardon-repeter"
                    }
                  ],
                  "si": {
                    "palier": [
                      "normal",
                      "plus"
                    ]
                  },
                  "consigne": "c-apres-pardon"
                }
              ],
              "apres_chaque_tour": [
                "voir_une_reponse_possible",
                "j_ai_dit_ca_ou_presque",
                "pas_encore"
              ],
              "retour": {
                "avant_essai": null,
                "apres_pas_encore": "Écoutez la phrase. Dites-la à voix haute. Vous la retrouverez dans 7 jours."
              },
              "note_interne": "Plus simple : tours 1 à 3 ; le tour 3 (paiement) se répond par une image ; le tour 4 (phrase longue) est retiré."
            },
            {
              "id": "j2.2",
              "titre": "J'écoute deux dialogues nouveaux",
              "duree_texte": "2 à 3 minutes",
              "lignes": [
                "Écoutez deux dialogues nouveaux."
              ],
              "serie": {
                "A": [
                  "b-t1",
                  "b-t2"
                ],
                "B": [
                  "b-d1",
                  "b-d2"
                ],
                "regles": [
                  "Si le bloc A n'a pas été fait : la paire de sortie.",
                  "Si le bloc A a été fait et que la vérification du début (S0, pas 0.7) n'a pas eu lieu : l'autre paire (D ou T).",
                  "Si les deux paires sont déjà entendues : message « pas_de_nouveau_dialogue »."
                ]
              },
              "message_si_rien": "pas_de_nouveau_dialogue",
              "consigne": "c-apres-dialogues"
            }
          ],
          "fin": {
            "modele": "merci_revenez_le",
            "date": "j7",
            "bouton": "copier_le_texte",
            "note_interne": "Texte à variable : pas de son (interface.apres_le_cours.merci_revenez_le)."
          }
        },
        {
          "type": "rappels",
          "id": "P.C",
          "id_bloc": "j7",
          "titre": "bloc_7_jours",
          "duree_texte": "3 à 5 minutes",
          "etapes": [
            {
              "id": "j7.1",
              "titre": "Je retrouve mes phrases, dans un autre ordre",
              "duree_texte": "2 minutes",
              "consigne": "c-apres-phrases-j7",
              "trace": "j7.rappel",
              "lignes": [
                "Un nouveau serveur vous parle.",
                "Vous voulez un café.",
                "1. Écoutez le serveur.",
                "2. Répondez à voix haute.",
                "Ne regardez pas vos phrases."
              ],
              "tours": [
                {
                  "n": 1,
                  "son": "j7-prenez",
                  "bouton": "ecouter",
                  "reponse": [
                    {
                      "texte": "Un café, s'il vous plaît.",
                      "son": "cli1-un-cafe-svp"
                    }
                  ]
                },
                {
                  "n": 2,
                  "son": "j7-un-the",
                  "bouton": "ecouter",
                  "reponse": [
                    {
                      "texte": "Non, un café, s'il vous plaît.",
                      "son": "cli1-non-un-cafe-svp"
                    }
                  ]
                },
                {
                  "n": 3,
                  "son": "j7-carte-ou-especes",
                  "bouton": "ecouter",
                  "reponse": [
                    {
                      "texte": "Par carte, s'il vous plaît.",
                      "son": "cli1-par-carte-svp"
                    },
                    {
                      "texte": "En espèces.",
                      "son": "cli1-en-especes"
                    }
                  ],
                  "reponse_par_image": {
                    "palier": [
                      "simple"
                    ],
                    "images": [
                      "img-carte-bancaire",
                      "img-especes"
                    ]
                  },
                  "variantes": [
                    {
                      "si": {
                        "palier": [
                          "plus"
                        ]
                      },
                      "set": {
                        "son": "j7-vous-payez-comment"
                      }
                    }
                  ]
                },
                {
                  "n": 4,
                  "son": "j7-cest-tout",
                  "bouton": "ecouter",
                  "reponse": [
                    {
                      "texte": "Oui, merci, c'est tout.",
                      "son": "cli1-oui-merci-cest-tout"
                    }
                  ]
                }
              ],
              "apres_chaque_tour": [
                "voir_une_reponse_possible",
                "j_ai_dit_ca_ou_presque",
                "pas_encore"
              ],
              "retour": {
                "avant_essai": null,
                "apres_pas_encore": "Écoutez la phrase. Dites-la à voix haute. Vous la retrouverez au prochain cours."
              },
              "note_interne": "Plus simple : tours 1, 2 et 4 ; le tour 3 (paiement) se répond par une image. Plus : le tour 3 devient « Vous payez comment ? »."
            },
            {
              "id": "j7.2",
              "titre": "J'écoute deux dialogues nouveaux",
              "duree_texte": "2 à 3 minutes",
              "serie": {
                "A": [
                  "b-t3",
                  "b-t4"
                ],
                "B": [
                  "b-t3",
                  "b-t4"
                ]
              },
              "variantes": [
                {
                  "si": {
                    "palier": [
                      "plus"
                    ]
                  },
                  "set": {
                    "serie.variante_t4": {
                      "de": "b-t4",
                      "vers": "b-t4-un-seul",
                      "si": "un_seul_vu"
                    }
                  }
                }
              ],
              "note_interne": "Jamais le dialogue de S6 répété.",
              "consigne": "c-apres-dialogues",
              "lignes": [
                "Écoutez deux dialogues nouveaux."
              ]
            }
          ],
          "fin": {
            "texte": "Merci. Vous avez fini le cours. Vous pouvez fermer cette page.",
            "recap_par_dialogue": "le nom de l'image choisie à la 1re écoute, aux images, à la 2e écoute, et « Dans le dialogue : … »",
            "total": false,
            "bouton": "copier_le_texte"
          }
        },
        {
          "type": "liens",
          "id": "P.D",
          "titre": "aller_plus_loin",
          "liens": [
            {
              "libelle": "regarder_tout_le_film",
              "url": "https://youtu.be/HNBQOEb_O5k"
            },
            {
              "libelle": "me_presenter",
              "url": "https://orionside.github.io/Atelier_Formation_Francais/Atelier_Rendez_Vous_A1/"
            }
          ],
          "note_interne": "Ces deux liens n'existent nulle part ailleurs dans le parcours."
        }
      ],
      "carte_formateur": {
        "dit": "Donne les deux dates à la fin du cours. Ne fait pas réécouter les dialogues de la banque en cours. Il peut faire J2.1 ou J7.1 en direct au début du cours suivant.",
        "note": "Les réponses dialogue par dialogue (jamais « 1/1 » ni un pourcentage) ; pour chacune : réponse à la 1re écoute, avec images, après réécoute, et les aides ; la date réelle de chaque bloc.",
        "a_corriger": "Aucun pendant les blocs. Au cours suivant : un seul point, tiré des réponses « Pas encore ».",
        "si_temps_manque": "Le bloc A est le premier à laisser ; garder les rendez-vous à 2 et à 7 jours.",
        "a_savoir": "Alternance des formes : forme A = D au début (S0 pas 0.7) et T à la sortie ; forme B = T au début et D à la sortie. T3 et T4 restent pour le rendez-vous à 7 jours dans les deux formes. Le réglage « Forme A / Forme B » est dans l'espace formateur ; l'apprenant ne le voit pas. Palier « Plus simple » : b-d2 et b-t2 (paiement) sont « à reconnaître ». Si le bloc A est fait le jour même, la voix du pas J2.1 n'est plus tout à fait nouvelle.",
        "validite": "Limites : petit effectif, pas de groupe de comparaison, délais de 2 et 7 jours proposés et non démontrés comme les meilleurs ; cette banque ne mesure pas l'accès à une conversation spontanée longue. T1 et T3 ne suivent pas le motif « Non, deux… » : les garder."
      }
    }
  ],
  "aides": {
    "statut_relecture": "non_relu_par_un_natif",
    "avertissement": "Textes rédigés et relus par un agent, pas par un locuteur natif. Le dossier 02 (§1 et M14) exige une relecture par un médiateur compétent dans chaque langue : elle reste à faire. Voir la clé « relecture ».",
    "langues": {
      "es": "espagnol d'Espagne (castillan), registre usted",
      "it": "italien standard, registre Lei"
    },
    "conventions": [
      "Les mots français cités dans un texte espagnol ou italien sont entre « » : le moteur peut les baliser lang=fr.",
      "Apostrophes droites et espaces ordinaires avant ? et ! dans les fragments français : le moteur peut les convertir à l'affichage.",
      "Clés es / it = texte montré à l'apprenant. Clés *_fr et tout le bloc diagnostic_sons (sauf indication_es / indication_it) = texte pour le formateur.",
      "null = pas de piège connu, ne rien afficher."
    ],
    "regles": [
      "L'aide est choisie par l'apprenant (aucune / español / italiano). Elle n'est jamais déduite de la nationalité ni du prénom.",
      "Le bouton d'aide n'apparaît qu'après un premier essai en français. Écrans sans écoute (accueil, après le cours) : bouton disponible tout de suite, le texte français reste affiché en premier.",
      "S0 et S6 : aucune aide ni aucune entrée du glossaire avant que la première réponse soit enregistrée. En S6, le glossaire ne s'ouvre qu'après la révélation du texte.",
      "S1 et S2 : les entrées du glossaire qui traduisent une phrase écoutée ne s'ouvrent qu'après la réponse à cette phrase.",
      "Une aide de consigne dit quoi faire. Elle ne contient jamais la réponse d'une écoute. Les textes qui donnent un sens ou une réponse sont rangés à part (aides_apres_reponse).",
      "Chaque usage d'une aide est consigné (colonne « aide » séparée de la colonne « exactitude », dossier 02 §6).",
      "Mêmes objectifs en français pour tous : l'aide traduit la tâche et le sens, pas la réponse attendue en français.",
      "Les indications sur les sons sont pour le formateur. Elles ne sont pas affichées par défaut à l'apprenant et ne servent qu'après observation de CETTE personne."
    ],
    "consignes": {
      "accueil": {
        "fr_reference": "Mission de la séance (cadre §2) : « Au café : comprendre, commander et payer ».",
        "es": "En esta clase: entender, pedir y pagar en un café, en francés. Inténtelo siempre primero en francés; esta ayuda es opcional.",
        "it": "In questa lezione: capire, ordinare e pagare al bar, in francese. Provi sempre prima in francese; questo aiuto è facoltativo.",
        "moment": "immediat"
      },
      "s0": {
        "fr_reference": "02 S0 (v3) : « Vous êtes au café. Écoutez deux personnes. À la fin, combien de thés sont commandés ? Vous pouvez écouter plusieurs fois. Dites le nombre à voix haute. Puis sélectionnez le bon nombre. Puis répondez au serveur avec les mots que vous connaissez. Vous pouvez dire : Pardon ? »",
        "es": "Escuche a dos personas en un café: al final, ¿cuántos tés se piden? Puede escuchar varias veces. Después, diga el número en voz alta y seleccione el número correcto. Luego responda al camarero en francés con las palabras que sepa; puede decir «Pardon ?».",
        "it": "Ascolti due persone al bar: alla fine, quanti tè vengono ordinati? Può ascoltare più volte. Poi dica il numero ad alta voce e selezioni il numero giusto. Infine risponda al cameriere in francese con le parole che conosce; può dire «Pardon ?».",
        "moment": "apres_reponse_enregistree",
        "v3": "modifiée en v3 (alignée sur la consigne) : à relire par un natif"
      },
      "s1": {
        "fr_reference": "02 S1 : « Deux personnes parlent au café. Qui parle au serveur ? Qu'est-ce qui est commandé ? Vous n'avez pas besoin de comprendre tous les mots. »",
        "es": "Mire y escuche la escena del café: ¿quién habla con el camarero y qué se pide? Seleccione las imágenes que correspondan. No hace falta entender todas las palabras.",
        "it": "Guardi e ascolti la scena al bar: chi parla con il cameriere e che cosa viene ordinato? Selezioni le immagini corrispondenti. Non è necessario capire tutte le parole.",
        "moment": "apres_premier_essai",
        "v3": "modifiée en v3 (alignée sur la consigne) : à relire par un natif"
      },
      "s2": {
        "fr_reference": "02 S2 (v3) : « Écoutez la phrase (autant de fois que vous voulez). Sélectionnez l'image : la personne demande-t-elle une boisson, demande-t-elle si la commande est finie, ou demande-t-elle le paiement ? »",
        "es": "Escuche cada frase tantas veces como quiera. Después, seleccione la imagen: la persona pide una bebida, pregunta si el pedido está completo o habla del pago.",
        "it": "Ascolti ogni frase quante volte vuole. Poi selezioni l'immagine: la persona ordina una bevanda, chiede se l'ordinazione è completa o parla del pagamento.",
        "moment": "apres_premier_essai",
        "v3": "modifiée en v3 (alignée sur la consigne) : à relire par un natif"
      },
      "s3": {
        "fr_reference": "02 S3, déroulement : entendre la question et la réponse, lire la carte, remplacer UNE information, fermer la carte et répondre.",
        "es": "Escuche la pregunta y responda en voz alta con la frase de la ficha. Después, cambie una sola cosa (por ejemplo, la bebida) y responda en voz alta sin mirar la ficha.",
        "it": "Ascolti la domanda e risponda ad alta voce con la frase della scheda. Poi cambi una sola cosa (per esempio la bevanda) e risponda ad alta voce senza guardare la scheda.",
        "moment": "apres_premier_essai",
        "v3": "modifiée en v3 (alignée sur la consigne) : à relire par un natif"
      },
      "s4": {
        "fr_reference": "02 S4 : « Écoutez la demande. À quel moment la personne a-t-elle fini de commander ? Réécoutez. Dites votre commande en gardant les mots utiles ensemble. »",
        "es": "Escuche: ¿cuándo ha terminado de pedir la persona? Después, diga su pedido en voz alta y diga todo seguido «s'il vous plaît».",
        "it": "Ascolti: quando ha finito di ordinare la persona? Poi dica la Sua ordinazione ad alta voce e dica «s'il vous plaît» tutto di seguito.",
        "moment": "apres_premier_essai",
        "v3": "modifiée en v3 (alignée sur la consigne) : à relire par un natif"
      },
      "s5": {
        "fr_reference": "02 S5 : « Vous voulez un café. Le serveur peut poser une autre question. Écoutez, répondez et demandez de répéter si nécessaire. »",
        "es": "Usted quiere un café: pídalo y responda en voz alta a lo que le pregunte el camarero. Si no entiende, pida que se lo repitan: «Pardon, vous pouvez répéter, s'il vous plaît ?».",
        "it": "Lei vuole un caffè: lo ordini e risponda ad alta voce alle domande del cameriere. Se non capisce, chieda di ripetere: «Pardon, vous pouvez répéter, s'il vous plaît ?».",
        "moment": "apres_premier_essai",
        "v3": "modifiée en v3 (alignée sur la consigne) : à relire par un natif"
      },
      "s6": {
        "fr_reference": "02 S6 : « À la fin, combien de cafés sont commandés ? » puis question du formateur « Et pour vous ? ».",
        "es": "Escuche un diálogo nuevo, sin texto: al final, ¿cuántos cafés se piden? Puede escuchar varias veces. Después, diga el número en voz alta y seleccione el número correcto. Luego responda en voz alta a la pregunta que le hagan.",
        "it": "Ascolti un dialogo nuovo, senza testo: alla fine, quanti caffè vengono ordinati? Può ascoltare più volte. Poi dica il numero ad alta voce e selezioni il numero giusto. Infine risponda ad alta voce alla domanda che Le viene fatta.",
        "moment": "apres_reponse_enregistree",
        "v3": "modifiée en v3 (alignée sur la consigne) : à relire par un natif"
      },
      "apres": {
        "fr_reference": "Cadre §2 et 02 M12 : rappels à J+2 et J+7, 3 à 5 minutes, facultatifs, avec un dialogue nouveau (banque T1–T4, D1–D2).",
        "es": "Dentro de 2 días y dentro de 7 días, vuelva unos minutos: escuche un diálogo nuevo y responda sin leer. Es opcional.",
        "it": "Tra 2 giorni e tra 7 giorni, torni per qualche minuto: ascolti un dialogo nuovo e risponda senza leggere. È facoltativo.",
        "moment": "immediat"
      }
    },
    "aides_apres_reponse": [
      {
        "id": "par_carte_sens",
        "sequences": [
          "S2",
          "S3"
        ],
        "origine": "02 §1, aide déjà rédigée, corrigée ici",
        "version_02_es": "Escucha la expresión completa: “par carte” indica cómo pagar. No necesitas entender todas las palabras.",
        "version_02_it": "Ascolta l'espressione completa: “par carte” indica come pagare. Non devi capire tutte le parole.",
        "es": "Escuche la expresión completa: «par carte» indica cómo se paga. No hace falta entender todas las palabras.",
        "it": "Ascolti l'espressione completa: «par carte» indica come si paga. Non è necessario capire tutte le parole.",
        "corrections_fr": [
          "ES : tutoiement (Escucha, necesitas) remplacé par usted (Escuche) ; « No necesitas » devient « No hace falta », plus courant en Espagne et sans pronom.",
          "IT : tutoiement (Ascolta, devi) remplacé par Lei (Ascolti) ; « Non devi capire » devient « Non è necessario capire », car « Non deve capire » peut se lire « vous ne devez pas comprendre ».",
          "ES et IT : « cómo pagar / come pagare » devient « cómo se paga / come si paga » (retouche de naturel, facultative).",
          "Guillemets anglais remplacés par « »."
        ],
        "moment_fr": "Seulement après la réponse de l'apprenant : cette phrase donne le sens de « par carte », donc la réponse à la question de S2 sur ce tour."
      },
      {
        "id": "carte_comment_payer",
        "sequences": [
          "S2"
        ],
        "origine": "02 S2, retour correctif « Vous avez entendu carte ; ici, le serveur demande comment payer. Regardons ce qui précède. »",
        "es": "Ha oído «carte»: aquí el camarero pregunta cómo quiere pagar. Fíjese en lo que se dice antes.",
        "it": "Ha sentito «carte»: qui il cameriere chiede come vuole pagare. Guardi che cosa viene detto prima.",
        "moment_fr": "Après une réponse erronée sur « Carte ou espèces ? »."
      },
      {
        "id": "cest_tout_roles",
        "sequences": [
          "S2",
          "S3"
        ],
        "origine": "02 S2, difficulté : question du serveur / réponse du client",
        "es": "«C'est tout ?» es la pregunta del camarero; «Oui, merci, c'est tout» es la respuesta del cliente.",
        "it": "«C'est tout ?» è la domanda del cameriere; «Oui, merci, c'est tout» è la risposta del cliente.",
        "moment_fr": "Après la réponse de l'apprenant sur ce tour."
      },
      {
        "id": "changement_apres_non",
        "sequences": [
          "S6"
        ],
        "origine": "02 S6, retour « la cliente a changé le choix après non »",
        "es": "La clienta ha cambiado el pedido después de «Non»: cuente lo que dice al final.",
        "it": "La cliente ha cambiato l'ordinazione dopo «Non»: conti quello che dice alla fine.",
        "moment_fr": "En S6, seulement après la révélation du texte. Jamais en S0 (02 : noter l'erreur sans enseigner encore)."
      }
    ],
    "glossaire": [
      {
        "id": "au_cafe",
        "fr": "au café (le lieu)",
        "es": "en una cafetería / en un bar",
        "it": "al bar",
        "piege_es": "«café» es el lugar y también la bebida.",
        "piege_it": "In Francia «café» è il locale (il bar) e anche la bevanda.",
        "piege_fr": "Même mot pour le lieu et la boisson ; en Italie le lieu se dit « bar ».",
        "sequences": [
          "accueil",
          "S0"
        ],
        "statut": "cadre"
      },
      {
        "id": "roles",
        "fr": "le serveur / la serveuse ; le client / la cliente",
        "es": "el camarero / la camarera ; el cliente / la clienta",
        "it": "il cameriere / la cameriera ; il cliente / la cliente",
        "piege_es": null,
        "piege_it": null,
        "piege_fr": null,
        "sequences": [
          "S0",
          "S1",
          "S2",
          "S3",
          "S5",
          "S6"
        ],
        "statut": "cadre"
      },
      {
        "id": "bonjour",
        "fr": "Bonjour.",
        "es": "Buenos días. / Hola.",
        "it": "Buongiorno.",
        "piege_es": "Se dice siempre al llegar, antes de pedir.",
        "piege_it": "Si dice sempre arrivando, prima di ordinare.",
        "piege_fr": "Se dit en arrivant, avant de commander.",
        "sequences": [
          "accueil",
          "S5"
        ],
        "statut": "cadre"
      },
      {
        "id": "quest_ce_que_vous_prenez",
        "fr": "Qu'est-ce que vous prenez ?",
        "es": "¿Qué va a tomar?",
        "it": "Che cosa prende?",
        "piege_es": "«prendre» es «tomar»; no es «prender».",
        "piege_it": "«vous» qui è il «Lei»: una sola persona.",
        "piege_fr": "ES : prendre = tomar, pas prender (allumer, attacher). IT : vous = Lei de politesse.",
        "sequences": [
          "S3",
          "S5"
        ],
        "statut": "script_02"
      },
      {
        "id": "et_pour_vous",
        "fr": "Et pour vous ?",
        "es": "¿Y para usted?",
        "it": "E per Lei?",
        "piege_es": "«vous» aquí es «usted» (una sola persona), no «vosotros».",
        "piege_it": "«vous» qui è «Lei» (una sola persona), non «voi».",
        "piege_fr": "Vous de politesse adressé à une seule personne.",
        "sequences": [
          "S0",
          "S6"
        ],
        "statut": "script_02"
      },
      {
        "id": "ou",
        "fr": "ou (café ou thé ?)",
        "es": "o",
        "it": "o",
        "piege_es": "Suena como la «u» española, pero significa «o».",
        "piege_it": "Si dice come la «u» italiana, ma vuol dire «o».",
        "piege_fr": "S'entend comme le u espagnol ou italien, mais signifie « o ».",
        "sequences": [
          "S0",
          "S2",
          "S3"
        ],
        "statut": "script_02"
      },
      {
        "id": "un",
        "fr": "un (1)",
        "es": "un / uno",
        "it": "un / uno",
        "piege_es": "Se escribe igual que en español, pero no suena igual: escuche bien el modelo.",
        "piege_it": "Si scrive come in italiano, ma non si dice allo stesso modo: ascolti bene il modello.",
        "piege_fr": "Même graphie, autre son : renvoyer à l'écoute du modèle (voir diagnostic_sons « un »).",
        "sequences": [
          "S0",
          "S3",
          "S4",
          "S5",
          "S6"
        ],
        "statut": "script_02"
      },
      {
        "id": "deux",
        "fr": "deux (2)",
        "es": "dos",
        "it": "due",
        "piege_es": "No confunda «deux» (dos) con «des» (unos) ni con «de».",
        "piege_it": "Non confonda «deux» (due) con «des» (dei, alcuni) né con «de».",
        "piege_fr": "deux (nombre) à ne pas confondre avec des / de.",
        "sequences": [
          "S0",
          "S6"
        ],
        "statut": "script_02"
      },
      {
        "id": "un_cafe",
        "fr": "un café",
        "es": "un café solo",
        "it": "un caffè (espresso)",
        "piege_es": "En Francia, «un café» es un café solo y corto; con leche hay que pedirlo de otra manera.",
        "piege_it": "In Francia «un café» è un espresso, spesso un po' più lungo di quello italiano.",
        "piege_fr": "Au comptoir en France, « un café » = expresso noir. ES : pas de lait. IT : souvent un peu plus long qu'en Italie.",
        "sequences": [
          "S0",
          "S3",
          "S4",
          "S5",
          "S6"
        ],
        "statut": "script_02"
      },
      {
        "id": "cafe_noir",
        "fr": "un café noir",
        "es": "un café solo",
        "it": "un caffè (senza latte)",
        "piege_es": "En España no se dice «café negro»: se dice «café solo».",
        "piege_it": "È il caffè normale, senza latte.",
        "piege_fr": "ES : l'équivalent d'Espagne est « café solo », pas « café negro ».",
        "sequences": [
          "S1",
          "S2",
          "S4"
        ],
        "statut": "film"
      },
      {
        "id": "cafe_long",
        "fr": "un café long / un café allongé",
        "es": "un café solo largo (parecido a un americano)",
        "it": "un caffè lungo",
        "piege_es": "Es un café solo con más agua; no lleva leche.",
        "piege_it": "In Francia è più lungo del «lungo» italiano, quasi un americano.",
        "piege_fr": "Café noir avec plus d'eau. ES : pas de lait. IT : plus long que le « lungo » italien.",
        "sequences": [
          "S1",
          "S5"
        ],
        "statut": "film"
      },
      {
        "id": "the",
        "fr": "un thé",
        "es": "un té",
        "it": "un tè",
        "piege_es": "La «h» no suena: se dice casi como «té».",
        "piege_it": "La «h» non si pronuncia: si dice quasi come «tè».",
        "piege_fr": "Le h ne se prononce pas ; mot presque identique dans les trois langues.",
        "sequences": [
          "S0",
          "S3",
          "S4"
        ],
        "statut": "script_02"
      },
      {
        "id": "croissant",
        "fr": "un croissant",
        "es": "un cruasán",
        "it": "un cornetto / una brioche",
        "piege_es": "La «t» final no suena.",
        "piege_it": "In Francia «brioche» è un altro dolce: al bar dica «croissant».",
        "piege_fr": "ES : t final muet. IT : « brioche » désigne en France une autre viennoiserie.",
        "sequences": [
          "S1",
          "S3"
        ],
        "statut": "film"
      },
      {
        "id": "jus_d_orange",
        "fr": "un jus d'orange",
        "es": "un zumo de naranja",
        "it": "un succo d'arancia",
        "piege_es": "La «j» francesa es suave, no es la jota española, y la «s» de «jus» no suena.",
        "piege_it": "Può essere in bottiglia; la spremuta fresca si chiama «orange pressée».",
        "piege_fr": "ES : j doux, s muet. IT : jus (souvent en bouteille) ≠ spremuta (orange pressée).",
        "sequences": [
          "S1"
        ],
        "statut": "film"
      },
      {
        "id": "pour_moi",
        "fr": "pour moi",
        "es": "para mí",
        "it": "per me",
        "piege_es": null,
        "piege_it": null,
        "piege_fr": null,
        "sequences": [
          "S2",
          "S3"
        ],
        "statut": "film"
      },
      {
        "id": "s_il_vous_plait",
        "fr": "s'il vous plaît",
        "es": "por favor",
        "it": "per favore / per cortesia",
        "piege_es": "Son tres palabras, pero se dicen juntas; en francés se dice casi siempre al pedir algo.",
        "piege_it": "Sono tre parole, ma si dicono insieme; non significa «se Le piace».",
        "piege_fr": "Trois mots écrits, une seule unité à l'oral ; presque systématique dans une demande. IT : ne se traduit pas mot à mot.",
        "sequences": [
          "S0",
          "S2",
          "S3",
          "S4",
          "S5",
          "S6"
        ],
        "statut": "film"
      },
      {
        "id": "cest_tout_question",
        "fr": "C'est tout ?",
        "es": "¿Eso es todo?",
        "it": "È tutto? / Basta così?",
        "piege_es": "Para terminar se responde «Oui»: es al revés que con «¿Algo más?».",
        "piege_it": "Per chiudere si risponde «Oui»: è il contrario di «Altro?».",
        "piege_fr": "Pour clore on répond oui, alors qu'à « ¿Algo más? » / « Altro? » on répond non.",
        "sequences": [
          "S2",
          "S3",
          "S5"
        ],
        "statut": "film"
      },
      {
        "id": "cest_tout_reponse",
        "fr": "Oui, merci, c'est tout. / Non merci, c'est tout.",
        "es": "Sí, gracias, eso es todo. / No, gracias, nada más.",
        "it": "Sì, grazie, è tutto. / No grazie, basta così.",
        "piege_es": "«tout» se dice como el «tu» español; la «t» final no suena.",
        "piege_it": "«tout» si dice come il «tu» italiano; la «t» finale non si pronuncia.",
        "piege_fr": "tout : t final muet, voyelle du u espagnol / italien.",
        "sequences": [
          "S2",
          "S3",
          "S5"
        ],
        "statut": "film"
      },
      {
        "id": "oui_non_merci",
        "fr": "Oui, merci. / Non merci.",
        "es": "Sí, gracias. / No, gracias.",
        "it": "Sì, grazie. / No, grazie.",
        "piege_es": null,
        "piege_it": null,
        "piege_fr": null,
        "sequences": [
          "S3",
          "S5"
        ],
        "statut": "script_02"
      },
      {
        "id": "aussi",
        "fr": "aussi (un croissant aussi)",
        "es": "también",
        "it": "anche",
        "piege_es": "No es «así».",
        "piege_it": "Va dopo la parola: «un croissant aussi» = «anche un croissant».",
        "piege_fr": "ES : ne pas confondre avec así. IT : aussi se place après le mot, anche avant.",
        "sequences": [
          "S3"
        ],
        "statut": "script_02"
      },
      {
        "id": "tres_bien",
        "fr": "Très bien.",
        "es": "Muy bien. / Perfecto.",
        "it": "Benissimo. / Perfetto.",
        "piege_es": "Aquí «très» significa «muy»; no es el número «tres».",
        "piege_it": "Qui «très» vuol dire «molto»; non è il numero «tre».",
        "piege_fr": "très ressemble à tres / tre (= 3) : piège direct dans une question de quantité (S0, S6). Ici le serveur confirme la commande.",
        "sequences": [
          "S0",
          "S6"
        ],
        "statut": "script_02"
      },
      {
        "id": "carte_ou_especes",
        "fr": "Carte ou espèces ?",
        "es": "¿Con tarjeta o en efectivo?",
        "it": "Carta o contanti?",
        "piege_es": null,
        "piege_it": null,
        "piege_fr": null,
        "sequences": [
          "S2",
          "S3",
          "S5"
        ],
        "statut": "film"
      },
      {
        "id": "vous_payez",
        "fr": "Vous payez par carte ? / Vous payez comment ?",
        "es": "¿Paga con tarjeta? / ¿Cómo va a pagar?",
        "it": "Paga con la carta? / Come paga?",
        "piege_es": null,
        "piege_it": null,
        "piege_fr": null,
        "sequences": [
          "apres_cours"
        ],
        "statut": "extension"
      },
      {
        "id": "par_carte",
        "fr": "par carte",
        "es": "con tarjeta",
        "it": "con la carta",
        "piege_es": "Aquí «carte» es la tarjeta del banco; no es una carta de correo.",
        "piege_it": "Qui «carte» è la carta di pagamento; non vuol dire «carta» (foglio).",
        "piege_fr": "ES : carte de paiement = tarjeta ; carta = lettre ou menu. IT : carta = aussi papier.",
        "sequences": [
          "S2",
          "S3",
          "S5"
        ],
        "statut": "script_02"
      },
      {
        "id": "la_carte",
        "fr": "la carte (du café)",
        "es": "la carta (la lista con los precios)",
        "it": "il menù / il listino",
        "piege_es": "«la carte» = la carta del bar; «par carte» = con tarjeta.",
        "piege_it": "«la carte» = il menù; «par carte» = con la carta (pagamento).",
        "piege_fr": "À n'afficher que si le sens est ambigu pour cet apprenant (02 S2) : la carte = menu, par carte = paiement.",
        "sequences": [
          "S2",
          "S3"
        ],
        "statut": "sur_observation"
      },
      {
        "id": "en_especes",
        "fr": "en espèces",
        "es": "en efectivo",
        "it": "in contanti",
        "piege_es": "No es «en especie»: aquí se paga con monedas y billetes.",
        "piege_it": "Non c'entra con «specie» né con «spezie»: sono monete e banconote.",
        "piege_fr": "ES : « pagar en especie » = payer en nature, le contraire. IT : rien à voir avec specie (sorte) ni spezie (épices).",
        "sequences": [
          "S2",
          "S3",
          "S5"
        ],
        "statut": "film"
      },
      {
        "id": "l_addition",
        "fr": "L'addition, s'il vous plaît.",
        "es": "La cuenta, por favor.",
        "it": "Il conto, per favore.",
        "piege_es": "No es una suma: es la cuenta. Se pide en la mesa, al final.",
        "piege_it": "Non è l'addizione di matematica: è il conto. Si chiede al tavolo, alla fine.",
        "piege_fr": "Faux ami avec adición / addizione (calcul). À reconnaître seulement : scène à table du film, pas le comptoir.",
        "sequences": [
          "S1",
          "S2"
        ],
        "statut": "film"
      },
      {
        "id": "pardon_repeter",
        "fr": "Pardon, vous pouvez répéter, s'il vous plaît ?",
        "es": "Perdone, ¿puede repetir, por favor?",
        "it": "Scusi, può ripetere, per favore?",
        "piege_es": "También puede decir solo «Pardon ?».",
        "piege_it": "Può dire anche solo «Pardon ?».",
        "piege_fr": "La forme courte « Pardon ? » suffit (02 S0).",
        "sequences": [
          "S0",
          "S5",
          "S6"
        ],
        "statut": "script_02"
      },
      {
        "id": "voici",
        "fr": "Voici.",
        "es": "Aquí tiene.",
        "it": "Ecco (a Lei).",
        "piege_es": "Lo dice quien le da algo (el café, el cambio); usted puede responder «Merci».",
        "piege_it": "Lo dice chi Le dà qualcosa (il caffè, il resto); può rispondere «Merci».",
        "piege_fr": "Dit par la personne qui donne quelque chose ; on répond merci.",
        "sequences": [
          "S5"
        ],
        "statut": "hors_scripts_02"
      },
      {
        "id": "je_vous_en_prie",
        "fr": "Je vous en prie.",
        "es": "De nada. / No hay de qué.",
        "it": "Prego.",
        "piege_es": "Es la respuesta a «Merci»; no significa «se lo ruego».",
        "piege_it": "È la risposta a «Merci», come «prego»; non vuol dire «La prego».",
        "piege_fr": "Réponse à merci ; ne pas traduire mot à mot (prier).",
        "sequences": [
          "S5"
        ],
        "statut": "hors_scripts_02"
      },
      {
        "id": "bonne_journee",
        "fr": "Bonne journée !",
        "es": "¡Que tenga un buen día!",
        "it": "Buona giornata!",
        "piege_es": "Se dice al irse; al llegar se dice «Bonjour».",
        "piege_it": "Si dice andando via; arrivando si dice «Bonjour».",
        "piege_fr": "Se dit en partant ; bonjour se dit en arrivant.",
        "sequences": [
          "S5"
        ],
        "statut": "hors_scripts_02"
      },
      {
        "id": "d_accord",
        "fr": "D'accord.",
        "es": "De acuerdo. / Vale.",
        "it": "D'accordo. / Va bene.",
        "piege_es": null,
        "piege_it": null,
        "piege_fr": null,
        "sequences": [
          "S5"
        ],
        "statut": "extension"
      },
      {
        "id": "il_n_y_a_plus",
        "fr": "Il n'y a plus de café noir.",
        "es": "Ya no queda café solo.",
        "it": "Non c'è più caffè.",
        "piege_es": "Aquí «plus» quiere decir «ya no hay», no «más».",
        "piege_it": "Qui «plus» vuol dire «non ce n'è più», non «di più».",
        "piege_fr": "plus = ne… plus (il n'en reste pas), pas « davantage ». Défi facultatif du palier « un peu plus ».",
        "sequences": [
          "S5"
        ],
        "statut": "extension"
      },
      {
        "id": "un_seul",
        "fr": "un seul",
        "es": "solo uno",
        "it": "uno solo",
        "piege_es": "No es «un café solo»: «un seul» quiere decir «solo uno».",
        "piege_it": null,
        "piege_fr": "ES : seul ≠ solo du « café solo » (café noir). Banque T4 seulement.",
        "sequences": [
          "apres_cours"
        ],
        "statut": "extension"
      },
      {
        "id": "sur_place_a_emporter",
        "fr": "sur place / à emporter",
        "es": "para tomar aquí / para llevar",
        "it": "da consumare qui / da portare via",
        "piege_es": null,
        "piege_it": null,
        "piege_fr": "Absent des scripts du dossier 02 : à n'afficher que si l'atelier l'utilise.",
        "sequences": [],
        "statut": "hors_scripts_02"
      }
    ],
    "interface": {
      "aide_en_espagnol": {
        "fr": "Aide en espagnol",
        "es": "Ayuda en español",
        "it": "Aiuto in spagnolo"
      },
      "aide_en_italien": {
        "fr": "Aide en italien",
        "es": "Ayuda en italiano",
        "it": "Aiuto in italiano"
      },
      "pas_d_aide": {
        "fr": "Pas d'aide",
        "es": "Sin ayuda",
        "it": "Nessun aiuto"
      },
      "voir_l_aide": {
        "fr": "Voir l'aide",
        "es": "Ver la ayuda",
        "it": "Mostra l'aiuto"
      },
      "cacher_l_aide": {
        "fr": "Cacher l'aide",
        "es": "Ocultar la ayuda",
        "it": "Nascondi l'aiuto"
      },
      "essayer_d_abord": {
        "fr": "Essayez d'abord en français.",
        "es": "Primero, inténtelo en francés.",
        "it": "Prima provi in francese."
      },
      "selecteur_recommande": {
        "note_fr": "Dans le sélecteur, écrire chaque langue dans sa propre langue, pour que l'apprenant la reconnaisse sans lire le français.",
        "options": [
          {
            "valeur": "aucune",
            "libelle": "Pas d'aide"
          },
          {
            "valeur": "es",
            "libelle": "Ayuda en español"
          },
          {
            "valeur": "it",
            "libelle": "Aiuto in italiano"
          }
        ]
      }
    },
    "points_de_vigilance": [
      "« Très bien » dans les scripts S0 et S6 (« Deux thés, très bien. » / « Deux cafés, très bien. ») ressemble à tres / tre (= 3), dans une question qui porte sur un nombre. Les scripts sont devenus « Deux thés, d'accord. » / « Deux cafés, d'accord. » (A2) : « très » est évité parce qu'il peut s'entendre tres/tre (= 3). Une réponse « trois » doit être consignée à part et ne pas être lue comme un échec sur « deux ». Hypothèse non observée : à signaler dans l'espace formateur.",
      "« C'est tout ? » se clôt par oui ; les questions habituelles en Espagne et en Italie (« ¿Algo más? », « Altro? ») se closent par non. Une réponse « non » peut donc vouloir dire « j'ai fini ».",
      "L'aide du dossier 02 §1 (« par carte » indique comment payer) donne le sens : elle est rangée dans aides_apres_reponse, pas dans les consignes.",
      "Les consignes ES / IT traduisent les consignes françaises du dossier 02. Si le texte français final de l'atelier change (boutons, ordre, mots), les réaligner.",
      "Cartes de S3 : « ficha » / « scheda », pour éviter le choc avec « tarjeta » / « carta » du paiement.",
      "Glossaire : entrées de statut « hors_scripts_02 », « extension » et « sur_observation » à n'afficher que si l'écran correspondant existe.",
      "Si le formateur ne lit pas l'italien, la clé piege_fr sert de contrôle du sens ; elle ne remplace pas la relecture native."
    ],
    "relecture": {
      "faite_par_l_agent": [
        "Cohérence usted (ES) et Lei (IT) dans tous les textes ; les deux aides du dossier 02 §1 étaient au tutoiement.",
        "Castillan d'Espagne : zumo, camarero, tarjeta, en efectivo, cruasán, vale, pretérito perfecto (« ha terminado », « ha oído ») ; « jugo », « mesero », « café negro » évités.",
        "Italien : tè invariable au pluriel, majuscule de courtoisie (Lei, Le, Sua), « Non è necessario » plutôt que « Non deve ».",
        "Aucune consigne ne contient la réponse d'une écoute ; les textes qui donnent un sens sont séparés.",
        "Aucun alphabet phonétique dans les textes ES / IT."
      ],
      "limite": "Cette relecture est celle d'un agent. Elle ne remplace pas la relecture par un locuteur natif de chaque langue, exigée par le dossier 02 (§1, M14). Statut à garder : non_relu_par_un_natif.",
      "a_verifier_par_un_natif_es": [
        "« un café solo largo (parecido a un americano) » pour café long / allongé : l'usage varie selon les régions d'Espagne.",
        "« ¡Que tenga un buen día! » pour « Bonne journée ! » : ou « ¡Que pase un buen día! ».",
        "« golpes de voz » pour dire « syllabes » en mots simples : clair, ou préférer « sílabas » ?",
        "« ficha » pour les cartes de S3.",
        "« pregunta si el pedido está completo » (S2) : naturel ?",
        "« como una jota muy suave » pour le r français : utile ou trompeur ?",
        "« en una cafetería / en un bar » pour « au café ».",
        "Piège « en especie » : compris d'un adulte non juriste ?",
        "« responda » ou « conteste » ; tournure « se piden » en S0 et S6."
      ],
      "a_verifier_par_un_natif_it": [
        "« al bar » pour « au café » ; « ordinazione » ou « ordine ».",
        "Boutons « Mostra l'aiuto » / « Nascondi l'aiuto » (forme habituelle des boutons) à côté de textes en Lei ; autre choix : « Vedi l'aiuto ».",
        "« Benissimo. / Perfetto. » pour « Très bien. » ; « È tutto? / Basta così? » pour « C'est tout ? ».",
        "« un cornetto / una brioche » : usage régional ; « In Francia brioche è un altro dolce ».",
        "« caffè lungo » et l'affirmation « più lungo del lungo italiano » ; « spremuta » = « orange pressée ».",
        "« erre moscia » pour le r français : compris, et sans nuance moqueuse ?",
        "« Ecco (a Lei). » pour « Voici. ».",
        "« scheda » pour les cartes de S3.",
        "Majuscule de courtoisie (Lei, Le, Sua) : à garder dans une interface ?",
        "« Lo dica tutto di seguito » : place du pronom et naturel."
      ],
      "a_verifier_dans_les_deux_langues": [
        "Chaque aide face au texte français FINAL de l'écran, une fois l'atelier écrit.",
        "Qu'aucune aide ni entrée du glossaire ne s'ouvre avant la réponse en S0, S1, S2 et S6.",
        "Chaque indication sur un son, dite à voix haute à une vraie personne : comprise du premier coup ?",
        "Les affirmations d'usage en France (café un peu plus long qu'en Italie, jus en bouteille).",
        "Longueur des textes sur un écran de téléphone."
      ]
    },
    "non_couvert": [
      "Questions de la banque (T1–T4, D1–D2) en espagnol et en italien : A3 n'en contient pas (seule source ES/IT). Le bouton « aide » de la banque ne montre que la consigne de l'écran « après le cours ».",
      "Question d'effort et « le plus difficile » (A4 §1.9) en espagnol et en italien : absentes de A3, non incluses."
    ],
    "relecture_v3": "Aides ES/IT modifiées en v3 (s0, s1, s2, s3, s4, s5, s6) : alignées sur les nouvelles consignes (« à voix haute », « sélectionnez », écoute libre), registre usted / Lei. Traductions écrites par l'agent, À RELIRE PAR UN NATIF (espagnol et italien) avant usage."
  },
  "banque": {
    "regle": "Écoute d'un dialogue, modèle v3 : B.1 j'écoute (réécoute libre, bouton « Je réponds »), B.2 je réponds (clavier de chiffres ou « C'est dit »), B.3 je choisis l'image (+ tuile « Je ne sais pas »), B.4 supprimé (aucun texte), B.5 dialogue et retour. Aucun retour avant B.5. Bouton d'écoute du dialogue à chaque fenêtre, « ← Revenir » de B.2 à B.5. Le nombre d'écoutes avant chaque réponse est compté dans le suivi du formateur.",
    "etapes": {
      "b1": {
        "lignes": [
          "Écoutez deux personnes au café.",
          "Vous pouvez écouter plusieurs fois.",
          "La question arrive après."
        ],
        "consigne": "c-b-ecoute",
        "bouton": "ecouter"
      },
      "b2": {
        "lignes": [
          "Dites votre réponse à voix haute."
        ],
        "boutons": [
          "c_est_dit",
          "je_ne_sais_pas"
        ],
        "boutons_nombre": [
          "chiffre_1",
          "chiffre_2",
          "chiffre_3",
          "chiffre_4",
          "je_ne_sais_pas"
        ],
        "consigne_nombre": "c-e-nombre",
        "lignes_nombre": [
          "Dites le nombre à voix haute. Puis sélectionnez le bon nombre."
        ]
      },
      "b3": {
        "lignes": [
          "Sélectionnez la bonne réponse."
        ],
        "consigne": "c-e-reponse"
      },
      "b4": {
        "consigne": null,
        "lignes": [],
        "bouton": null,
        "inutilise": true
      },
      "b5": {
        "etiquette": "cree",
        "boutons": [
          "reecouter"
        ]
      }
    },
    "dialogues": {
      "b-d1": {
        "id": "b-d1",
        "son": "b-d1",
        "source": "N",
        "question_apres_ecoute": true,
        "consigne_ecoute": "c-b-ecoute",
        "images": [
          {
            "image": "img-fini",
            "libelle": "Il a fini."
          },
          {
            "image": "img-encore",
            "libelle": "Encore quelque chose."
          }
        ],
        "saisie": "dit",
        "etiquette": "cree",
        "forme": "D",
        "rang": 1,
        "consigne_question": "c-b-fini-ou-encore",
        "question": "Le client a fini ? Ou il veut encore quelque chose ?",
        "bonne": "img-encore",
        "valeur_bonne": "encore",
        "texte_final": {
          "repliques": [
            {
              "role": "La serveuse",
              "texte": "C'est tout ?"
            },
            {
              "role": "Le client",
              "texte": "Non, un thé aussi, s'il vous plaît."
            }
          ],
          "retour": "La serveuse demande : « C'est tout ? » Le client dit non et ajoute un thé."
        },
        "calendrier": {
          "forme_A": "début",
          "forme_B": "sortie"
        }
      },
      "b-d2": {
        "id": "b-d2",
        "son": "b-d2",
        "source": "N",
        "question_apres_ecoute": true,
        "consigne_ecoute": "c-b-ecoute",
        "images": [
          {
            "image": "img-carte-bancaire",
            "libelle": "par carte"
          },
          {
            "image": "img-especes",
            "libelle": "en espèces (= billets et pièces)"
          }
        ],
        "saisie": "dit",
        "etiquette": "cree",
        "forme": "D",
        "rang": 2,
        "consigne_question": "c-b-paie",
        "question": "Le client paie comment ?",
        "bonne": "img-carte-bancaire",
        "valeur_bonne": "carte",
        "a_reconnaitre_au_palier_simple": true,
        "texte_final": {
          "repliques": [
            {
              "role": "La serveuse",
              "texte": "Vous payez en espèces ?"
            },
            {
              "role": "Le client",
              "texte": "Non, par carte."
            }
          ],
          "retour": "La serveuse demande : « en espèces ? » Le client dit non : il paie par carte."
        },
        "calendrier": {
          "forme_A": "début",
          "forme_B": "sortie"
        }
      },
      "b-t1": {
        "id": "b-t1",
        "son": "b-t1",
        "source": "N",
        "question_apres_ecoute": true,
        "consigne_ecoute": "c-b-ecoute",
        "images": [
          {
            "image": "img-fini",
            "libelle": "Il a fini."
          },
          {
            "image": "img-encore",
            "libelle": "Encore quelque chose."
          }
        ],
        "saisie": "dit",
        "etiquette": "cree",
        "forme": "T",
        "rang": 1,
        "consigne_question": "c-b-fini-ou-encore",
        "question": "Le client a fini ? Ou il veut encore quelque chose ?",
        "bonne": "img-encore",
        "valeur_bonne": "encore",
        "texte_final": {
          "repliques": [
            {
              "role": "La serveuse",
              "texte": "C'est tout ?"
            },
            {
              "role": "Le client",
              "texte": "Non, un croissant aussi, s'il vous plaît."
            }
          ],
          "retour": "La serveuse demande : « C'est tout ? » Le client dit non et ajoute un croissant."
        },
        "calendrier": {
          "forme_A": "sortie",
          "forme_B": "début"
        }
      },
      "b-t2": {
        "id": "b-t2",
        "son": "b-t2",
        "source": "N",
        "question_apres_ecoute": true,
        "consigne_ecoute": "c-b-ecoute",
        "images": [
          {
            "image": "img-carte-bancaire",
            "libelle": "par carte"
          },
          {
            "image": "img-especes",
            "libelle": "en espèces (= billets et pièces)"
          }
        ],
        "saisie": "dit",
        "etiquette": "cree",
        "forme": "T",
        "rang": 2,
        "consigne_question": "c-b-paie",
        "question": "Le client paie comment ?",
        "bonne": "img-especes",
        "valeur_bonne": "especes",
        "a_reconnaitre_au_palier_simple": true,
        "texte_final": {
          "repliques": [
            {
              "role": "La serveuse",
              "texte": "Vous payez par carte ?"
            },
            {
              "role": "Le client",
              "texte": "Non, en espèces."
            }
          ],
          "retour": "La serveuse demande : « par carte ? » Le client dit non : il paie en espèces."
        },
        "calendrier": {
          "forme_A": "sortie",
          "forme_B": "début"
        }
      },
      "b-t3": {
        "id": "b-t3",
        "son": "b-t3",
        "source": "N",
        "question_apres_ecoute": true,
        "consigne_ecoute": "c-b-ecoute",
        "images": [
          {
            "image": "img-un-cafe",
            "libelle": "un café"
          },
          {
            "image": "img-cafe-et-croissant",
            "libelle": "un café et un croissant"
          }
        ],
        "saisie": "dit",
        "etiquette": "cree",
        "forme": "T",
        "rang": 3,
        "consigne_question": "c-b-t3",
        "question": "À la fin, le client prend quoi ?",
        "bonne": "img-un-cafe",
        "valeur_bonne": "un cafe",
        "texte_final": {
          "repliques": [
            {
              "role": "Le client",
              "texte": "Un café, s'il vous plaît."
            },
            {
              "role": "Le serveur",
              "texte": "Et un croissant ?"
            },
            {
              "role": "Le client",
              "texte": "Non merci, c'est tout."
            }
          ],
          "retour": "Le serveur propose un croissant. Le client dit non : il prend un café seulement."
        },
        "calendrier": {
          "forme_A": "7 jours",
          "forme_B": "7 jours"
        }
      },
      "b-t4": {
        "id": "b-t4",
        "son": "b-t4",
        "source": "N",
        "question_apres_ecoute": true,
        "consigne_ecoute": "c-b-ecoute",
        "images": [
          {
            "image": "img-un-the",
            "libelle": "un thé"
          },
          {
            "image": "img-deux-thes",
            "libelle": "deux thés"
          }
        ],
        "saisie": "nombre",
        "etiquette": "cree",
        "forme": "T",
        "rang": 4,
        "consigne_question": "c-b-t4",
        "question": "Le client veut combien de thés ?",
        "bonne": "img-un-the",
        "valeur_bonne": "un",
        "texte_final": {
          "repliques": [
            {
              "role": "Le client",
              "texte": "Pour moi, un thé."
            },
            {
              "role": "Le serveur",
              "texte": "Deux thés ?"
            },
            {
              "role": "Le client",
              "texte": "Non, un thé."
            }
          ],
          "retour": "Le serveur demande : « Deux thés ? » Le client dit non : il veut un thé."
        },
        "calendrier": {
          "forme_A": "7 jours",
          "forme_B": "7 jours"
        },
        "consigne_images": "c-b-t4-images"
      },
      "b-t4-un-seul": {
        "id": "b-t4-un-seul",
        "son": "b-t4-un-seul",
        "source": "N",
        "question_apres_ecoute": true,
        "consigne_ecoute": "c-b-ecoute",
        "images": [
          {
            "image": "img-un-the",
            "libelle": "un thé"
          },
          {
            "image": "img-deux-thes",
            "libelle": "deux thés"
          }
        ],
        "saisie": "nombre",
        "etiquette": "cree",
        "forme": "T",
        "rang": 4,
        "variante_de": "b-t4",
        "condition_usage": "seulement si « un seul » a été vu avec le formateur (palier « Un peu plus »)",
        "consigne_question": "c-b-t4",
        "question": "Le client veut combien de thés ?",
        "bonne": "img-un-the",
        "valeur_bonne": "un",
        "texte_final": {
          "repliques": [
            {
              "role": "Le client",
              "texte": "Pour moi, un thé."
            },
            {
              "role": "Le serveur",
              "texte": "Deux thés ?"
            },
            {
              "role": "Le client",
              "texte": "Non, un seul, s'il vous plaît."
            }
          ],
          "retour": "Le serveur demande : « Deux thés ? » Le client dit non : il veut un thé."
        },
        "calendrier": {
          "forme_A": "7 jours",
          "forme_B": "7 jours"
        },
        "consigne_images": "c-b-t4-images"
      }
    },
    "calendrier": {
      "forme_A": {
        "debut": [
          "b-d1",
          "b-d2"
        ],
        "sortie": [
          "b-t1",
          "b-t2"
        ],
        "j7": [
          "b-t3",
          "b-t4"
        ],
        "defaut": true
      },
      "forme_B": {
        "debut": [
          "b-t1",
          "b-t2"
        ],
        "sortie": [
          "b-d1",
          "b-d2"
        ],
        "j7": [
          "b-t3",
          "b-t4"
        ]
      },
      "moments": {
        "debut": "S0, pas 0.7 (facultatif, hors des 45 minutes ; accès dans l'espace formateur « avant le cours »)",
        "sortie": "bloc A le jour même, sinon pas J2.2",
        "j7": "pas J7.2"
      },
      "alternance_rang": "rang d'inscription impair : forme D avant, T après ; rang pair : T avant, D après (A4 §5.1)."
    }
  },
  "rappels": {
    "principe": "Deux rendez-vous courts, facultatifs. Les blocs ne sont pas verrouillés par la date ; la date réelle est enregistrée.",
    "aujourdhui": {
      "libelle": "Aujourd'hui, si je veux",
      "duree": "5 à 8 minutes",
      "contenu": [
        "b-t1",
        "b-t2"
      ],
      "variante_forme_B": [
        "b-d1",
        "b-d2"
      ]
    },
    "j2": {
      "jours": 2,
      "libelle": "Dans 2 jours",
      "duree": "3 à 5 minutes",
      "contenu": [
        "j2.1",
        "j2.2"
      ],
      "sons": [
        "j2-prenez",
        "j2-cest-tout",
        "j2-carte-ou-especes"
      ],
      "voix": "personnel-3",
      "banque": "paire de sortie si le bloc A n'a pas été fait ; sinon l'autre paire ; sinon « Pas de nouveau dialogue aujourd'hui. Rendez-vous dans 5 jours. »"
    },
    "j7": {
      "jours": 7,
      "libelle": "Dans 7 jours",
      "duree": "3 à 5 minutes",
      "contenu": [
        "j7.1",
        "j7.2"
      ],
      "sons": [
        "j7-prenez",
        "j7-un-the",
        "j7-carte-ou-especes",
        "j7-cest-tout",
        "j7-vous-payez-comment"
      ],
      "voix": "personnel-4",
      "banque": [
        "b-t3",
        "b-t4"
      ]
    },
    "date_exemple": "Pour un cours le 6 octobre : « Dans 2 jours : jeudi 8 octobre — 3 à 5 minutes » · « Dans 7 jours : mardi 13 octobre — 3 à 5 minutes ».",
    "liens_facultatifs": {
      "film": "https://youtu.be/HNBQOEb_O5k",
      "ancien_atelier": "https://orionside.github.io/Atelier_Formation_Francais/Atelier_Rendez_Vous_A1/"
    }
  },
  "formateur": {
    "interface": {
      "note_interne": "Libellés propres à scripts/formateur.js (espace et vue formateur). Jamais affichés à l'apprenant.",
      "panneau_titre": "Réservé au formateur",
      "message_reserve": "Cet espace est réservé au formateur.",
      "continuer": "Je suis le formateur : continuer",
      "fermer": "Fermer",
      "annuler": "Annuler",
      "ouvrir_espace": "Espace formateur",
      "nav_titre": "Navigation du formateur",
      "ecran_apprenant": "Écran de l'apprenant :",
      "ecran_precedent": "Écran précédent",
      "ecran_suivant": "Écran suivant",
      "ecran_choisir": "Choisir l'écran",
      "onglet_deroule": "Déroulé",
      "onglet_avant": "Avant le cours",
      "onglet_sons": "Sons",
      "onglet_fiche": "Fiche imprimable",
      "onglet_pilote": "Pilote",
      "onglet_suivi": "Suivi",
      "carte_dit": "Je dis ou je joue",
      "carte_note": "Je note",
      "carte_a_corriger": "Le point unique à corriger",
      "carte_si_temps_manque": "Si le temps manque",
      "carte_a_savoir": "À savoir",
      "carte_validite": "Validité",
      "ordre_titre": "Ordre des deux dernières questions de la conversation 3",
      "ordre_A": "Ordre A",
      "ordre_B": "Ordre B",
      "ordre_A_court": "ordre A",
      "ordre_B_court": "ordre B",
      "conversation": "Conversation",
      "il_veut": "Il veut :",
      "aide_apprenant": "Aide de l'apprenant :",
      "apres_conversation": "Après :",
      "confirmation_erronee": "Confirmation erronée",
      "regle_pardon": "Après « Pardon, vous pouvez répéter… »",
      "reformulations": "Reformulations possibles",
      "paliers_s5_simple": "Palier « Plus simple »",
      "paliers_s5_plus": "Palier « Un peu plus »",
      "petit_groupe": "Petit groupe : l'apprenant-serveur",
      "pas_de_reponse": "Pas de réponse",
      "grille_condition": "Condition :",
      "grille_seul": "En mode seul, la parole n'est pas vérifiée : l'apprenant clique lui-même sur « J'ai parlé » et « J'ai dit la phrase comme la réponse possible ». Aucune note du formateur.",
      "grille_clavier": "Clavier : 0, 1, 2 remplissent Sens, puis Réponse, puis Groupe ; r réglé, p pas réglé, a aucun ; x pas de réponse ; + une relance.",
      "court": {
        "sens": [
          "pas compris",
          "produit oui, reste flou",
          "tout y est"
        ],
        "reponse_adaptee": [
          "à côté",
          "incomplète",
          "utilisable"
        ],
        "groupe": [
          "haché",
          "une hésitation dedans",
          "d'un seul tenant"
        ]
      },
      "relances": "Relances",
      "demande_repeter": "A demandé de répéter",
      "mot_souffle": "Mot soufflé",
      "descripteurs": "?  Descripteurs",
      "note": "Note",
      "entendue_titre": "Réponse libre entendue (passage 1)",
      "entendue_aide": "Cliquez sur ce que vous avez entendu, tout de suite. La page ne demande jamais « juste » ou « faux ».",
      "entendue_court": "entendu",
      "valeurs": {
        "1": "un",
        "2": "deux",
        "3": "trois",
        "4": "quatre",
        "un": "un",
        "deux": "deux",
        "trois": "trois",
        "quatre": "quatre",
        "autre": "autre",
        "rien": "rien",
        "ne_sais_pas": "je ne sais pas",
        "nsp": "je ne sais pas",
        "dit": "idée dite",
        "carte": "par carte",
        "especes": "en espèces",
        "termine": "il termine",
        "ajoute": "il ajoute quelque chose",
        "cafe_seul": "un café, c'est tout",
        "cafe_et_croissant": "un café et un croissant"
      },
      "avant_45": "Avant le cours (hors des 45 minutes)",
      "prevu": "prévu",
      "deroule_titre": "Déroulé minute par minute",
      "deroule_aide": "Les durées de la colonne « minutes » sont celles du plan. La dernière colonne montre la durée réelle de chaque écran, sans couleur ni jugement.",
      "deroule_chrono": "Le chronomètre tourne sans rien montrer à l'apprenant. Il se met en pause quand la page est cachée.",
      "col_minutes": "Minutes",
      "col_sequence": "Séquence",
      "col_contenu": "Contenu",
      "col_si_temps": "Si le temps manque",
      "col_duree_reelle": "Durée réelle",
      "gestion_temps": "Gestion du temps",
      "gestion_temps_lignes": [
        "Ne jamais supprimer S0 ni les pas 6.1 à 6.5 de S6.",
        "Si le temps manque : couper dans la colonne « Si le temps manque », de haut en bas, dans l'ordre du tableau.",
        "L'accueil, la banque « avant le cours » et « après le cours » sont hors des 45 minutes.",
        "Une réduction de parcours décidée en cours de séance se note avec son motif (onglet « Avant le cours »)."
      ],
      "provisoire": "(provisoire, à piloter)",
      "avant_titre": "Avant le cours",
      "apprenant": "Prénom ou code de l'apprenant (facultatif)",
      "apprenant_aide": "Un code (P01, P02…) est préférable à un nom. Il sert seulement à nommer les fichiers d'export.",
      "banque_titre": "Les deux dialogues en plus : forme de départ",
      "alternance_explication": "L'ordre alterne d'un apprenant à l'autre : un apprenant sur deux commence par D, l'autre par T. Ainsi chaque forme est entendue autant de fois au début qu'à la fin.",
      "forme_titre": "Forme au début du cours",
      "forme_A": "D au début, T à la fin",
      "forme_B": "T au début, D à la fin",
      "rang": "Rang d'inscription de l'apprenant",
      "rang_aide": "Rang impair : D au début. Rang pair : T au début.",
      "rang_appliquer": "Choisir la forme d'après le rang",
      "rang_invalide": "Écrivez un rang : 1, 2, 3…",
      "verification_debut": "Activer « Deux dialogues en plus » au début",
      "lancer_paire": "Lancer maintenant la paire du début (écran S0)",
      "lancer_paire_fait": "La paire du début est activée. Écran S0.",
      "apercu_titre": "Dialogues de chaque moment (écoute pour vous)",
      "moment_debut": "Au début",
      "moment_sortie": "À la fin",
      "moment_j7": "Une semaine après",
      "ecouter": "Écouter",
      "options_titre": "Options de séance",
      "commande_pour_deux": "Commande pour deux (palier « Un peu plus »)",
      "un_seul_vu": "« Un seul » a été vu : utiliser la variante de T4",
      "montage_titre": "Montage",
      "montage_A": "A : deux fenêtres sur mon ordinateur",
      "montage_B": "B : l'apprenant sur son appareil",
      "montage_aide": "A : la fenêtre ?vue=formateur suit l'écran de l'apprenant. B : je note dans ma propre page ou sur la fiche papier.",
      "lieu_titre": "Où je saisis mes notes",
      "lieu_seconde_fenetre": "Seconde fenêtre",
      "lieu_second_appareil": "Second appareil",
      "lieu_papier": "Papier",
      "lieu_meme_ecran": "Même écran",
      "lieu_aide": "« Même écran » : la grille est vue de l'apprenant, ce qui sera écrit dans l'export.",
      "preparation": "Temps de préparation (minutes)",
      "perimetre_titre": "Réduire le parcours (commande + clôture)",
      "perimetre_reduire": "Réduire le parcours",
      "perimetre_effet": "Les items non proposés sont notés « non proposé » dans l'export : ils ne ressemblent pas à un échec. À décider avant S0.",
      "perimetre_motif": "Motif",
      "perimetre_motif_aide": "À écrire avant de regarder les résultats.",
      "perimetre_motif_defaut": "pré-A1 : commande + clôture seulement",
      "sons_titre": "Sons du cours",
      "sons_bandeau": "Dialogues créés pour le cours. Voix de synthèse, non validées à l'écoute. Tant que audio/humain/ est vide, le test “voix humaine nouvelle” manque.",
      "sons_chargement": "Lecture de la liste des sons…",
      "manifeste_absent": "Le fichier audio/manifest.json n'a pas pu être lu. La liste vient de contenu.js ; l'écoute peut échouer.",
      "humain_compte": "Fichiers de voix humaine trouvés : {n}.",
      "voix_j7_manque": "Les voix de la semaine après sont déjà utilisées dans la séance : la voix nouvelle à 7 jours manque.",
      "hors_manifeste": "Ce son n'est pas dans le manifeste audio.",
      "validateur": "Mon nom (validateur)",
      "validateur_aide": "Il est écrit avec la date dans chaque avis d'écoute. Sans nom, rien n'est noté.",
      "filtre_dialogues": "Dialogues d'abord",
      "filtre_a_valider": "Pas encore validés",
      "exporter_validation": "Exporter ma validation (JSON)",
      "validation_exportee": "Fichier de validation téléchargé.",
      "compteur": "Validés à l'écoute : {v} · À refaire : {r} · Pas encore écoutés : {n} · Sons : {t}",
      "genre_son": {
        "g_dialogue": "Dialogue",
        "g_replique": "Réplique",
        "g_consigne": "Consigne",
        "g_extrait_de_dialogue": "Réplique découpée",
        "g_autre": "Son"
      },
      "voix": "Voix :",
      "remarque": "Remarque",
      "valide_a_l_ecoute": "Validé à l'écoute",
      "a_refaire": "À refaire",
      "nom_requis": "Écrivez d'abord votre nom (champ « Mon nom »).",
      "par": "par",
      "statut_valide": "Validé à l'écoute le",
      "statut_a_refaire": "À refaire",
      "statut_perime": "Le fichier a changé depuis l'écoute : à réécouter.",
      "statut_non_valide": "Non validé à l'écoute (voix de synthèse)",
      "enregistrer_ma_voix": "Enregistrer ma propre voix",
      "enregistrer": "Enregistrer",
      "voix_convertir": "Le fichier téléchargé s'appelle {id}.webm ou {id}.m4a. Il faut le convertir en MP3, puis le déposer dans audio/humain/ sous le nom {id}.mp3.",
      "fiche_onglet_titre": "Fiche imprimable (une page)",
      "fiche_titre": "Fiche de séance du formateur",
      "imprimer": "Imprimer la fiche",
      "imprimer_aide": "Seule la fiche est imprimée (A4 paysage). Ne la montrez pas à l'apprenant : elle contient les cartes privées.",
      "impression_indisponible": "L'impression n'est pas disponible dans ce navigateur.",
      "critere": "Critère",
      "pilote_titre": "Pilote : protocole, limites, notes",
      "pilote_avant": "Avant",
      "pilote_pendant": "Pendant",
      "pilote_regle": "Règle d'or",
      "pilote_j7": "J+7",
      "pilote_double": "Double notation",
      "pilote_rapporter": "Comment rapporter",
      "pilote_criteres": "Critères figés avant le pilote",
      "pilote_date_signature": "Date : ____________  Signature : ____________",
      "col_moment": "Moment",
      "col_je_fais": "Ce que je fais",
      "col_je_note": "Ce que je note",
      "col_critere": "Critère proposé",
      "col_lire": "Où le lire",
      "points_ouverts": "Points ouverts",
      "diagnostic_sons": "Sons difficiles (hypothèses, après observation seulement)",
      "suivi_titre": "Suivi item par item",
      "suivi_aide": "Chaque item se lit seul, dans ses conditions. Aucun total, aucun pourcentage, aucune comparaison automatique.",
      "suivi_comprehension": "Écoute : ce qui a été répondu, et les aides",
      "suivi_deux_colonnes": "La colonne « Aides » est à part : une réponse après les images ou après le texte ne se lit pas comme une réponse au passage 1.",
      "suivi_vide": "Rien n'est noté pour le moment.",
      "suivi_paroles": "Prises de parole (grille 0/1/2, « — » = non noté)",
      "suivi_durees": "Durée réelle par écran",
      "suivi_pas_de_duree": "Aucune durée enregistrée : le chronomètre est dans la fenêtre de l'apprenant.",
      "col_item": "Item",
      "col_aides": "Aides",
      "cond": {
        "p1": "Passage 1",
        "apres_images": "Après les images",
        "apres_reecoute": "Après la réécoute (non proposé en v3)",
        "apres_texte": "Après le texte"
      },
      "grille_sens": "Sens",
      "grille_reponse": "Réponse",
      "grille_groupe": "Groupe",
      "grille_malentendu": "Malentendu",
      "reparation": {
        "resolu": "réglé",
        "non_resolu": "pas réglé",
        "non_sollicite": "aucun"
      },
      "mode": {
        "formateur": "avec mon formateur",
        "groupe": "en petit groupe",
        "seul": "seul(e)"
      },
      "palier": {
        "plus_simple": "plus simple",
        "normal": "normal",
        "un_peu_plus": "un peu plus"
      },
      "aide": {
        "aucune": "aucune",
        "es": "español",
        "it": "italiano"
      },
      "export_formateur": "Exporter le journal complet",
      "export_formateur_aide": "Ce journal contient la grille et vos notes : ne le donnez pas à l'apprenant.",
      "export_texte": "Voir et copier le texte",
      "export_csv": "Télécharger le fichier CSV",
      "export_json": "Télécharger le fichier JSON",
      "export_titre": "AU CAFÉ — JOURNAL DU FORMATEUR",
      "export_date": "Date :",
      "export_code": "Code :",
      "export_cours": "Cours :",
      "export_niveau": "Niveau :",
      "export_aide": "Aide :",
      "export_pas_examen": "Ce n'est pas un examen. Il n'y a pas de note.",
      "export_comprehension": "J'ÉCOUTE (réponses et aides, item par item)",
      "export_non_propose": "pas proposé aujourd'hui",
      "export_pas_de_reponse": "pas de réponse",
      "export_non_observee": "idée dite à voix haute, non notée",
      "export_attendue": "réponse attendue",
      "export_autre": "autre réponse",
      "export_bonne": "attendue :",
      "export_ecoutes": "Écoutes :",
      "export_aides": "Aides :",
      "export_aucune": "aucune",
      "export_relances": "formateur a répété",
      "export_rien": "Aucune réponse d'écoute enregistrée.",
      "export_autres_reponses": "Autres réponses enregistrées par la page (voir le JSON) :",
      "export_forme": "forme au début / à la fin",
      "export_voix": "voix :",
      "export_voix_humaines": "humaines",
      "export_voix_synthese": "synthèse, non validées à l'écoute ; test voix humaine nouvelle non fait",
      "export_non_note": "non noté",
      "export_temps": "TEMPS RÉEL PAR ÉCRAN (minutes)",
      "aide_images": "images",
      "aide_texte": "texte",
      "aide_lente": "voix lente",
      "nouvelle_seance": "Nouvelle séance",
      "nouvelle_seance_aide": "Efface les réponses, le journal et la grille de cette séance. Les avis d'écoute des sons sont gardés.",
      "confirm_propose_export": "Vous allez effacer la séance en cours. Voulez-vous d'abord exporter le journal complet ?",
      "confirm_exporter": "Exporter d'abord (JSON)",
      "confirm_exporte": "Fichier téléchargé. Vous pouvez effacer.",
      "confirm_effacer": "Passer à l'effacement",
      "confirm_derniere": "Dernière confirmation : les réponses, le journal et la grille de cette séance seront effacés. Cela ne peut pas être défait.",
      "confirm_oui": "Oui, effacer et commencer une nouvelle séance",
      "confirm_fait": "La séance est effacée. Une nouvelle séance peut commencer."
    },
    "titre": "Espace formateur",
    "vue": {
      "principe": "Vue formateur = la même page ouverte avec ?vue=formateur (2e fenêtre, 2e onglet ou 2e appareil). Dans le même navigateur, elle suit l'écran de l'apprenant par l'événement storage ; sur un autre appareil, le formateur choisit l'écran lui-même. La vue apprenant ne montre jamais les cartes privées, et n'a ni bouton ni lien vers l'espace formateur : le bouton « Formateur » n'existe que dans cette vue. Une fiche imprimable (une page) reprend les cartes privées et la grille.",
      "avertissement_partage_ecran": "Cette carte est privée : ne la montrez pas."
    },
    "reglages": {
      "forme_banque": {
        "valeurs": [
          "A",
          "B"
        ],
        "defaut": "A",
        "note": "A = D au début, T à la sortie ; B = T au début, D à la sortie."
      },
      "verification_debut": {
        "defaut": false,
        "note": "Active le pas 0.7 (« Deux dialogues en plus »), hors des 45 minutes ; accès « avant le cours »."
      },
      "ordre_s5": {
        "valeurs": [
          "A",
          "B"
        ],
        "defaut": "A",
        "note": "Ordre des deux dernières questions de la conversation 3."
      },
      "commande_pour_deux": {
        "defaut": false,
        "note": "Palier « Un peu plus » : à activer après validation de l'usage."
      },
      "un_seul_vu": {
        "defaut": false,
        "note": "T4 : utiliser b-t4-un-seul seulement si « un seul » a été vu."
      },
      "perimetre_reduit": {
        "note": "Pré-A1 : « Réduire le parcours » avant S0 ; le motif est noté dans le journal."
      }
    },
    "deroule": [
      {
        "de": -1,
        "a": 0,
        "ecran": "accueil",
        "titre": "Accueil",
        "contenu": "Trois choix (mode, niveau, langue d'aide), le micro, « Bonjour ! ». Hors des 45 minutes.",
        "si_temps_manque": "Rien à supprimer."
      },
      {
        "de": 0,
        "a": 3,
        "ecran": "s0",
        "titre": "J'écoute deux personnes",
        "contenu": "Écoute sans texte du dialogue d'ouverture (écoute libre, réponse au clavier puis aux images ; le nombre d'écoutes est compté), puis « Et pour vous, café ou thé ? ». Rien n'est révélé : « Merci. Vous verrez la bonne réponse à la fin du cours. »",
        "si_temps_manque": "Ne jamais supprimer S0."
      },
      {
        "de": 3,
        "a": 9,
        "ecran": "s1",
        "titre": "Je regarde une scène au café",
        "contenu": "Scène du film (une première vision, une seconde), qui parle, quels produits, la fin.",
        "si_temps_manque": "Supprimer la 2e vision (pas 1.4) ou passer au chemin court."
      },
      {
        "de": 9,
        "a": 18,
        "ecran": "s2",
        "titre": "J'écoute : on commande, on finit ou on paie ?",
        "contenu": "Quatre extraits (A, B, C du film ; D créé) : 1. écouter (autant de fois que l'on veut), 2. sélectionner l'image : commander, finir la commande, payer. Pas 2.B.6 et 2.D.7.",
        "si_temps_manque": "Supprimer 2.B.6 et 2.D.7, puis l'extrait C."
      },
      {
        "de": 18,
        "a": 25,
        "ecran": "s3",
        "titre": "Je réponds au serveur",
        "contenu": "Trois fiches (commander, finir, payer) : écouter, choisir le moment, lire et dire, changer une chose ; puis questions sans texte.",
        "si_temps_manque": "Fiches 1 et 2 ; la 3 en écoute avec images ; au moins une question du pas 3.4."
      },
      {
        "de": 25,
        "a": 30,
        "ecran": "s4",
        "titre": "Je dis ma commande sans m'arrêter",
        "contenu": "« S'il vous plaît » d'un seul tenant : écouter, voir la phrase, dire, commander avec une image.",
        "si_temps_manque": "Supprimer le pas 4.5, puis 4.3 ; garder 4.1 et 4.4."
      },
      {
        "de": 30,
        "a": 40,
        "ecran": "s5",
        "titre": "Je commande et je paie",
        "contenu": "Trois conversations avec la carte privée du serveur : texte, images secrètes, rien. « Un thé ? » en conversation 3.",
        "si_temps_manque": "Garder au moins une conversation ; supprimer d'abord le pas 5.2, puis la conversation 2."
      },
      {
        "de": 40,
        "a": 45,
        "ecran": "s6",
        "titre": "J'écoute deux nouvelles personnes",
        "contenu": "Nouveau dialogue (nouvelles voix), écoute libre, réponse au clavier puis aux images, « Et pour vous ? », bilan.",
        "si_temps_manque": "Jamais 6.1 à 6.5 ; raccourcir le bilan."
      },
      {
        "de": 45,
        "a": null,
        "ecran": "apres",
        "titre": "Après le cours",
        "contenu": "Rendez-vous à 2 et 7 jours (3 à 5 minutes chacun) ; bloc facultatif le jour même (5 à 8 minutes).",
        "si_temps_manque": "Le bloc du jour même est le premier à laisser."
      }
    ],
    "cartes_privees_s5": {
      "titre": "Carte du serveur (privée)",
      "avertissement": "Ne la montrez pas. Jamais rendue dans la page de l'apprenant : vue formateur (?vue=formateur) ou fiche imprimable.",
      "ordre_defaut": "A",
      "ordre_A": "« C'est tout ? » puis « Carte ou espèces ? »",
      "ordre_B": "« Carte ou espèces ? » puis « C'est tout ? » (option du formateur ; en mode seul, tirage au sort)",
      "conversations": {
        "conv1": {
          "aide_apprenant": "deux phrases écrites + la phrase « Pardon… »",
          "il_veut": "un café",
          "tours": [
            {
              "id": "c1.t1",
              "dit": "Bonjour ! Qu'est-ce que vous prenez ?",
              "sons": [
                "pers1-bonjour",
                "pers1-prenez"
              ]
            },
            {
              "id": "c1.t2",
              "dit": "C'est tout ?",
              "sons": [
                "pers1-cest-tout"
              ]
            },
            {
              "id": "c1.t3",
              "dit": "Très bien, merci.",
              "sons": [
                "pers1-tres-bien-merci"
              ]
            }
          ]
        },
        "conv2": {
          "aide_apprenant": "deux images secrètes, pas de texte + la phrase « Pardon… »",
          "il_veut": "un thé ; paiement tiré au sort (carte ou espèces)",
          "tours": [
            {
              "id": "c2.t1",
              "dit": "Qu'est-ce que vous prenez ?",
              "sons": [
                "pers1-prenez"
              ]
            },
            {
              "id": "c2.t2",
              "dit": "Carte ou espèces ?",
              "sons": [
                "pers1-carte-ou-especes"
              ]
            },
            {
              "id": "c2.t3",
              "dit": "Très bien, merci.",
              "sons": [
                "pers1-tres-bien-merci"
              ]
            }
          ],
          "apres": "Dit ce qu'il a compris (« Un thé, en espèces. ») ; l'apprenant montre ses images : c'est pareil ?"
        },
        "conv3": {
          "aide_apprenant": "rien",
          "il_veut": "un café",
          "tours": [
            {
              "id": "c3.t1",
              "dit": "Qu'est-ce que vous prenez ?",
              "sons": [
                "pers1-prenez"
              ]
            },
            {
              "id": "c3.t2",
              "dit": "Un thé ?",
              "sons": [
                "pers1-un-the"
              ],
              "note": "Confirmation erronée : à dire après la commande « un café »."
            },
            {
              "id": "c3.t3-t4",
              "dit": "ordre A : « C'est tout ? » puis « Carte ou espèces ? » — ordre B : « Carte ou espèces ? » puis « C'est tout ? »",
              "sons": [
                "pers1-cest-tout",
                "pers1-carte-ou-especes"
              ]
            },
            {
              "id": "c3.t5",
              "dit": "Très bien, merci.",
              "sons": [
                "pers1-tres-bien-merci"
              ]
            }
          ]
        }
      },
      "paliers": {
        "simple": "Commande et fin de commande seulement. Conversation 2 : « Qu'est-ce que vous prenez ? », « C'est tout ? », puis « Carte ou espèces ? » (l'apprenant sélectionne l'image ou dit « Carte »). Conversation 3 : « Qu'est-ce que vous prenez ? », « Un thé ? » (réponses reçues : « Non, un café. », « Un café. », « Pardon ? »), « C'est tout ? ». Pas de défi.",
        "plus": "Conversation 2 : image secrète « deux thés » ; après la commande le serveur dit « Ça fait trois euros. » (à reconnaître seulement : l'apprenant sélectionne 2 € ou 3 €). Conversation 3 : « Vous payez comment ? » remplace « Carte ou espèces ? ». Défi (facultatif) : l'apprenant commande un thé ; le serveur dit « Il n'y a plus de thé. Un café ? ». Le montant « trois euros » est à adapter aux produits."
      },
      "reformulations_apres_pardon": [
        "Vous voulez autre chose ?",
        "Vous payez par carte ou en espèces ?"
      ],
      "regle_pardon": "Après « Pardon, vous pouvez répéter… » : redit plus lentement et plus clairement ; reformule si besoin ; ne donne pas la réponse.",
      "petit_groupe": "L'apprenant-serveur ouvre sur son appareil « Carte du serveur — ne la montrez pas » (les questions à lire, avec ▶ pour les entendre d'abord) ; non évalué."
    },
    "grille": {
      "titre": "Grille du formateur (0/1/2)",
      "situation": "Au comptoir, l'apprenant commande, répond à « C'est tout ? » puis à « Carte ou espèces ? ». On note ce qu'un francophone qui ne voit pas la carte comprendrait. On ne note ni l'accent, ni la mélodie, ni la vitesse.",
      "statut": "Outil local, non étalonné ; une note dépend du juge. Seuils provisoires, à piloter.",
      "criteres": [
        {
          "id": "sens",
          "nom": "Sens transmis",
          "question": "Est-ce que je sais ce qu'il veut ?",
          "niveaux": [
            {
              "valeur": 0,
              "descripteur": "Produit erroné ou non identifiable.",
              "exemple": "Sa carte montre un café ; il dit « un thé » et ne se corrige pas. Ou un mot qu'on ne reconnaît pas."
            },
            {
              "valeur": 1,
              "descripteur": "Produit identifiable, mais quantité ou paiement ambigu.",
              "exemple": "Dit « café » pour deux cafés : on ne sait pas combien. À « Carte ou espèces ? » : « Oui… payer » : on ne sait pas comment."
            },
            {
              "valeur": 2,
              "descripteur": "Éléments clés corrects.",
              "exemple": "« Un café, s'il vous plaît. » · « Deux thés. » · « Par carte. »"
            }
          ],
          "note": "Choix libre (S0-P1, S6-P1) : il n'y a pas de « bon » produit ; on note si le produit dit est identifiable."
        },
        {
          "id": "reponse",
          "nom": "Réponse adaptée",
          "question": "Est-ce qu'il répond à ce que je viens de dire ?",
          "niveaux": [
            {
              "valeur": 0,
              "descripteur": "Hors fonction.",
              "exemple": "À « C'est tout ? » : « Par carte. » À « Carte ou espèces ? » : « Un café. »"
            },
            {
              "valeur": 1,
              "descripteur": "Fonction juste, information manquante.",
              "exemple": "À « Carte ou espèces ? » : « Oui. » À « Et pour vous, café ou thé ? » : « Oui, s'il vous plaît. »"
            },
            {
              "valeur": 2,
              "descripteur": "Réponse utilisable : je peux servir ou encaisser.",
              "exemple": "« Oui, merci, c'est tout. » · « Non, un croissant aussi. » · « En espèces. »"
            }
          ],
          "note": "« Pardon, vous pouvez répéter ? » n'est pas un 0 : cliquer sur +1 à « A demandé de répéter », répéter, puis noter la réponse qui suit."
        },
        {
          "id": "groupe",
          "nom": "Groupe ciblé",
          "question": "Est-ce que la formule tient ensemble ?",
          "niveaux": [
            {
              "valeur": 0,
              "descripteur": "Coupures qui empêchent d'interpréter.",
              "exemple": "« Un… ca… (long arrêt)… s'il… » : on ne sait pas si la commande est finie."
            },
            {
              "valeur": 1,
              "descripteur": "Interprétable, avec une hésitation à l'intérieur.",
              "exemple": "« Un café, s'il… s'il vous plaît. » · « Par… carte. »"
            },
            {
              "valeur": 2,
              "descripteur": "Unité courte interprétable, sans coupure gênante.",
              "exemple": "« Un café, s'il vous plaît » d'un seul tenant."
            }
          ],
          "note": "Ne comptent pas comme coupure : le silence avant de répondre ; une pause entre « Un café » et « s'il vous plaît ». Laisser « — » si la production est trop courte pour juger (« Oui. »)."
        }
      ],
      "malentendu": {
        "nom": "Malentendu (réparation)",
        "note": "Trois états, pas une note.",
        "etats": [
          {
            "valeur": "resolu",
            "bouton": "réglé",
            "quand": "Il y a eu un malentendu, et l'échange repart sur la bonne commande.",
            "exemple": "Il dit « un café » ; je dis « Un thé ? » ; il dit « Non, un café, s'il vous plaît. »"
          },
          {
            "valeur": "non_resolu",
            "bouton": "pas réglé",
            "quand": "Il y a eu un malentendu, et la commande reste fausse ou l'échange s'arrête.",
            "exemple": "Je dis « Un thé ? » ; il dit « Oui » ou se tait."
          },
          {
            "valeur": "non_sollicite",
            "bouton": "aucun",
            "quand": "Pas de malentendu dans cet échange. Ne compte ni en bien ni en mal.",
            "exemple": "Il commande, je comprends, il paie."
          }
        ]
      },
      "interface": {
        "ligne_titre": "S5 · échange 3 · sans carte",
        "touches": [
          "Pas de réponse",
          "Sens 0/1/2",
          "Réponse 0/1/2",
          "Groupe 0/1/2",
          "Malentendu réglé / pas réglé / aucun",
          "Relances − 0 +",
          "A demandé de répéter − 0 +",
          "mot soufflé",
          "?",
          "Note"
        ],
        "regles": [
          "Boutons de 44 px de côté au moins ; un seul bouton actif par ligne ; cliquer encore sur le bouton actif l'efface (retour à « — »).",
          "Clavier : 0 1 2 remplissent Sens, puis Réponse, puis Groupe ; r réglé, p pas réglé, a aucun ; x pas de réponse ; + relance.",
          "[ ? ] ouvre les descripteurs et exemples. [ Note ] : une ligne de texte libre.",
          "La page remplit seule : condition, images ou carte visibles, aide ES/IT ouverte, voix lente, palier, heure.",
          "« Pas de réponse » grise les trois lignes (critères null).",
          "Saisie du passage 1 (compréhension) : un bouton par valeur — exemple S0 : [ un ] [ deux ] [ autre ] [ rien ] — jamais « juste / faux »."
        ],
        "bandeau": "Notez tout de suite, avant de corriger. Ne montrez pas cette fenêtre."
      },
      "mode_seul": {
        "nom": "Auto-déclaration (mode seul) — sans valeur de mesure",
        "questions": [
          {
            "q": "J'ai parlé :",
            "reponses": [
              "oui",
              "non"
            ]
          },
          {
            "q": "J'ai dit la phrase comme la réponse possible :",
            "reponses": [
              "oui",
              "non",
              "je ne sais pas"
            ]
          }
        ],
        "note": "Ces réponses n'entrent dans aucune comparaison."
      },
      "absences": {
        "non_donnee": "l'apprenant n'a pas répondu ou a sélectionné « Je ne sais pas »",
        "non_observee": "personne n'était là pour entendre la réponse libre",
        "non_propose": "l'item n'a pas été proposé (périmètre réduit)",
        "ligne_absente": "partie non faite"
      }
    },
    "protocole_pilote": {
      "titre": "Protocole du pilote (résumé d'une page)",
      "statut": "Aucune donnée réelle. Critères proposés, non étalonnés : à piloter.",
      "avant": [
        "Figer les critères : dater et signer le tableau des critères avant le premier apprenant ; après cette date, on ne change ni critère, ni registre, ni audio.",
        "Fixer l'ordre des formes par le rang d'inscription : rang impair → forme D avant, T après ; rang pair → T avant, D après. J+7 : T3 et T4 pour tous.",
        "Fixer le palier et le périmètre avant S0 (pré-A1 : bouton « Réduire le parcours »).",
        "Préparer : code apprenant (P01…), deux fenêtres, casque ou haut-parleur testé, fiche imprimée, accord de l'apprenant pour enregistrer trois réponses (S0-P1, S5-P3, S6-P1). Sans accord : pas d'enregistrement, pas de double notation, le dire dans le compte rendu.",
        "Noter le temps de préparation (minutes)."
      ],
      "pendant": [
        {
          "moment": "Avant le cours (≈ 4 min, hors des 45)",
          "je_fais": "Forme D ou T, déroulé standard.",
          "je_note": "Valeur dite au passage 1, tout de suite. Aucun retour avant le texte."
        },
        {
          "moment": "S0",
          "je_fais": "Dialogue, puis « Et pour vous, café ou thé ? ». Je ne corrige pas.",
          "je_note": "Valeur du passage 1 ; grille de S0-P1 ; relances."
        },
        {
          "moment": "S1–S2",
          "je_fais": "La page enregistre les choix.",
          "je_note": "Seulement S2-C4 (valeur dite) et les faits marquants."
        },
        {
          "moment": "S3–S4",
          "je_fais": "Je joue le serveur.",
          "je_note": "Grille si j'ai le temps ; sinon rien (cases laissées « — »)."
        },
        {
          "moment": "S5",
          "je_fais": "Trois échanges. Dernier échange : je dis « Un thé ? » après un café.",
          "je_note": "Grille de S5-P3 avant de donner mon retour ; malentendu ; relances ; mot soufflé."
        },
        {
          "moment": "S6",
          "je_fais": "Dialogue inédit, puis « Et pour vous ? ». Puis l'apprenant répond à « Ce cours, pour moi… ».",
          "je_note": "Comme S0."
        },
        {
          "moment": "Après le cours (≈ 4 min)",
          "je_fais": "L'autre forme, déroulé standard.",
          "je_note": "Comme avant le cours."
        },
        {
          "moment": "Dans les 10 minutes",
          "je_fais": "Je complète la fiche, j'exporte le journal complet, je range les trois sons.",
          "je_note": "Écarts au protocole, incidents de son, aides données hors page."
        }
      ],
      "regle_d_or": "Je note ce que j'entends, au moment où je l'entends ; je ne complète rien de mémoire le lendemain.",
      "j_plus_7": "5 à 8 minutes, de préférence au début du cours suivant, avec moi : T3 puis T4, déroulé standard. Dialogues non identiques à ceux de la séance, voix non entendues jusque-là. Si l'apprenant le fait seul, le passage 1 est non_observee : le dire. Si les voix humaines manquent, écrire : « voix de synthèse non validées à l'écoute ; test voix humaine nouvelle non fait ». T4 : si « un seul » n'a pas été rencontré, utiliser « Non, un thé ».",
      "double_notation": "Les trois productions enregistrées sont renommées avec un code neutre et notées par un second francophone, avec la grille, sans voir mes notes. À défaut de second juge : je renote moi-même, sans mes premières notes, au moins 7 jours plus tard, et je l'appelle « accord avec moi-même ». Un désaccord n'est jamais effacé.",
      "rapporter": [
        "Item par item, apprenant par apprenant : jamais « 1/1 = 100 % », jamais de moyenne de grille.",
        "Conditions identiques seulement : même cle_condition.",
        "S0 et S6 : « deux dialogues parallèles, non identiques » ; écrire ce qui est observé sur chacun, sans conclure à un progrès général.",
        "Formes D et T : rapporter par forme ; dire combien d'apprenants ont eu chaque ordre.",
        "Double notation : par critère, « notes identiques sur n productions sur N », puis la liste de chaque désaccord. Pas de coefficient.",
        "Pas de cause : « Sans groupe de comparaison, ces observations décrivent ce qui s'est passé avec n apprenants ; elles ne montrent pas que la séance en est la cause. »",
        "Toujours dire : n, palier, périmètre réduit ou non, voix (synthèse ou humaine), écarts au protocole, items non proposés, durée réelle par séquence, temps de préparation, effort déclaré."
      ],
      "criteres_figes": {
        "mention": "Propositions de 02, non étalonnées : seuils provisoires, à piloter. La page n'affiche pas de « critère atteint » global.",
        "lignes": [
          {
            "sequence": "S0",
            "critere": "Choix final identifié ; tentative de réponse adaptée ; aides consignées.",
            "lire_dans": "S0-C1 : trois lignes ; S0-P1 : production, reponse_adaptee."
          },
          {
            "sequence": "S1",
            "critere": "Une action et un produit identifiés, aide notée.",
            "lire_dans": "S1-C1, S1-C2 à p1 (film : sous-titres non contrôlés)."
          },
          {
            "sequence": "S2",
            "critere": "Au moins deux fonctions reconnues au premier passage.",
            "lire_dans": "S2-C1 à C3 à p1 — condition film, pas « sans texte »."
          },
          {
            "sequence": "S3",
            "critere": "Réponse de rôle juste dans deux tours.",
            "lire_dans": "S3-P1, S3-P2 : reponse_adaptee."
          },
          {
            "sequence": "S4",
            "critere": "L'interlocuteur comprend la commande et la fin du tour.",
            "lire_dans": "S4-P1 : sens, groupe."
          },
          {
            "sequence": "S5",
            "critere": "L'achat est mené ou le malentendu réglé.",
            "lire_dans": "S5-P3 : sens, reponse_adaptee, reparation ; à côté : relances, mot_souffle."
          },
          {
            "sequence": "S6",
            "critere": "Choix final compris au passage 1 ou après réécoute ; réponse à une relance simple.",
            "lire_dans": "S6-C1 : dire à quelle condition ; S6-P1."
          },
          {
            "sequence": "Banque",
            "critere": "Majorité d'actions correctes sans texte sur 3 à 5 micro-échanges.",
            "lire_dans": "Avec 2 items par forme, la « majorité » n'a pas de sens : rapporter chaque item."
          }
        ]
      },
      "fiche_observation": {
        "entete": "Atelier « Au café » — fiche de séance · Code · Date · Rang · Forme avant : D / T · Palier · Périmètre réduit · Aide choisie (après l'item) · Montage A / B · Enregistrement accepté · Préparation (min)",
        "mode_emploi": "Écrire la valeur dite (ex. « un », « deux », « rien »), pas « juste / faux ». Aides : Im (images) · Tx (texte) · L1 (ES/IT) · 0,9 (voix lente). Grille : 0, 1, 2 ou « — ». Malentendu : R (réglé) · N (pas réglé) · A (aucun).",
        "colonnes": [
          "Item",
          "Passage 1 (valeur dite)",
          "Après images",
          "Après réécoute (non proposé en v3)",
          "Écoutes (nombre avant la réponse)",
          "Aides",
          "Relances",
          "Sens",
          "Réponse",
          "Groupe",
          "Malentendu",
          "Durée",
          "Note"
        ],
        "items": [
          "AVANT 1 (D1 / T1)",
          "AVANT 2 (D2 / T2)",
          "S0-C1 combien de thés",
          "S0-P1 « Et pour vous ? »",
          "S1-C1 action (film)",
          "S1-C2 produit (film)",
          "S2-C1 phrase 1 (film)",
          "S2-C2 phrase 2 (film)",
          "S2-C3 phrase 3 (film)",
          "S2-C4 carte ou espèces",
          "S3-P1 remplace un produit",
          "S3-P2 autre question",
          "S4-P1 commande d'un seul tenant",
          "S5-P1 échange guidé",
          "S5-P2 produit changé",
          "S5-P3 sans carte + « Un thé ? »",
          "S6-C1 combien de cafés",
          "S6-P1 « Et pour vous ? »",
          "APRÈS 1 (T1 / D1)",
          "APRÈS 2 (T2 / D2)"
        ],
        "pied": "Mot soufflé (items) · A demandé de répéter : ___ fois · Effort déclaré : 1 2 3 4 5 · Le plus difficile : écouter / parler / les deux / rien · Écarts au protocole",
        "impression": "@media print { @page { size: A4 landscape; margin: 10mm } }, corps 9 pt, une seule page."
      }
    },
    "limites": {
      "titre": "Ce que ce suivi ne mesure pas",
      "lignes": [
        "Il ne mesure pas la compréhension d'une conversation spontanée, longue ou à débit ordinaire : seulement quelques échanges courts, lents et joués.",
        "S0 et S6 sont deux dialogues voisins mais différents ; un item ne fait pas un niveau. Aucun total, aucun pourcentage.",
        "La grille 0/1/2 est un outil local, non étalonné ; une note dépend du juge. Elle ne mesure ni l'accent, ni la mélodie, ni la fluidité.",
        "Sans groupe de comparaison et avec peu d'apprenants, ces observations ne prouvent pas que la séance cause un progrès. L'effort déclaré n'est pas une mesure de charge cognitive.",
        "Le film n'est jamais un test « sans texte » ; tant que les voix sont de synthèse, le test « voix humaine nouvelle » manque ; en mode seul, la parole n'est pas vérifiée."
      ],
      "seuils": "Tous les seuils des cartes sont provisoires (à piloter). Aucun n'est étalonné."
    },
    "note_voix": {
      "titre": "Note sur les voix",
      "statut": "Dialogues créés pour le cours. La voix du serveur (personnel-1) est une voix de synthèse fournie par le formateur (« voix de synthèse serveur au restaurant »). Les consignes, les retours lus et la cliente d'entraînement (consigne, cliente-1) utilisent la « voix féminine n° 2 » fournie par le formateur, déjà utilisée dans l'atelier Alimentation du futur bis v4 et déclarée par lui voix de synthèse. Les autres voix sont inventées par synthèse. Aucune voix de personne réelle n'a été clonée. Tout reste non validé à l'écoute.",
      "regles": [
        "Chaque son créé porte « Dialogue créé pour le cours » et le statut non_valide_a_l_ecoute jusqu'à validation à l'écoute (validé le … par …).",
        "Remplaçables par des voix humaines : le moteur lit d'abord audio/humain/<id>.mp3 s'il existe.",
        "La page ne suppose aucun nombre de voix : elle lit le manifeste (audio/manifest.json). Si une seule paire de voix sert toute la banque, l'espace formateur affiche « la voix nouvelle à 7 jours manque ».",
        "Tant que audio/humain/ est vide, le test « voix humaine nouvelle » manque (S6, banque).",
        "Débit d'origine ; le ralenti est de 0,9× au minimum, fait par le lecteur (pas de second fichier).",
        "Les répliques isolées s0-r2 et s6-r2 sont découpées dans la même prise que leur dialogue.",
        "La voix des consignes (consigne) est la même que celle de la cliente d'entraînement (cliente-1) : risque de confusion « qui parle » juste avant S0 et S6. Compte des voix = clips unitaires (114), hors les 12 dialogues entiers.",
        "Dans « Qui parle ? » (S2), les deux phrases sont dites par deux voix différentes (personnel-1 : « C'est tout ? », cliente-1 : « C'est tout, merci. ») : à valider à l'écoute (la première doit s'entendre comme une question, la seconde comme une réponse) ; sinon retirer ce pas du mode seul.",
        "L'espace formateur liste les sons avec leur statut, permet d'écouter, de marquer « validé / à refaire » et d'exporter cette validation en JSON (avis liés à l'empreinte du fichier).",
        "v3 : consignes et retours lus plus lentement (débit visé 3,3 à 4,2 syllabes par seconde, vraies pauses entre les phrases). À régénérer.",
        "v3 : chaque texte de retour fixe a son son (type « retour », identifiant r-<écran>-<n>), à la voix des consignes.",
        "v3 : aucun son n'est réservé à un mode (le serveur parle en mode formateur, groupe et seul)."
      ],
      "voix_utilisees": [
        {
          "voix": "client-3",
          "usages": 4
        },
        {
          "voix": "client-4",
          "usages": 6
        },
        {
          "voix": "cliente-1",
          "usages": 21
        },
        {
          "voix": "cliente-2",
          "usages": 2
        },
        {
          "voix": "consigne",
          "usages": 128
        },
        {
          "voix": "personnel-1",
          "usages": 18
        },
        {
          "voix": "personnel-2",
          "usages": 3
        },
        {
          "voix": "personnel-3",
          "usages": 7
        },
        {
          "voix": "personnel-4",
          "usages": 8
        }
      ],
      "note_fichier": "NOTE_VOIX.md n'existait pas à la rédaction de ce fichier."
    },
    "note_linguistique": {
      "titre": "Note linguistique (formateur)",
      "registre": "Au comptoir d'un café en France en 2026 : vous. Jamais tu avec un serveur inconnu. Aides ES/IT : registre usted / Lei.",
      "paiement": "Dans un café classique, on paie souvent après avoir bu ; le scénario « commande puis paiement immédiat » correspond plutôt à un coffee-shop, une boulangerie ou une commande à emporter. « L'addition, s'il vous plaît » = à table, à reconnaître seulement ; au comptoir on dit plutôt « Je vous dois combien ? », « C'est combien ? », « Ça fait combien ? ».",
      "dix_lignes": [
        "Bonjour d'abord : en France on salue avant de commander ; l'absence est plus choquante qu'un accent. Tout script client commence en vrai par « Bonjour ».",
        "« Je veux un café » : trop direct. Préférer « Un café, s'il vous plaît », « Je voudrais… », « Je vais prendre… ».",
        "Tutoiement : vous au comptoir ; tu ne s'emploie pas avec un serveur inconnu.",
        "À reconnaître plus tard (hors séance) : « Ce sera tout ? », « Et avec ça ? », « Je vous écoute » ; « Sans contact ? », « Carte ? », « en liquide » ; « Je vous dois combien ? » / « Ça fait combien ? » ; « très bien », « parfait », « c'est noté ». Déjà dans la séance, créées et à valider par deux francophones : « Vous désirez ? » (S3.4.1), « Autre chose ? » (S3.2.4, S3.4.2), « Vous payez comment ? » (palier « Un peu plus »).",
        "« Un café » = expresso ; « un expresso », « un allongé / un long » existent mais le sens varie selon l'établissement ; « café noir » = sans lait (film).",
        "Comptoir : dans un café classique on paie souvent après avoir bu ; le scénario « commande puis paiement immédiat » = coffee-shop, boulangerie, à emporter.",
        "« L'addition » = à table ; ne pas la faire dire au comptoir avant paiement.",
        "« Non merci, c'est tout » répond à « Autre chose ? », jamais à « C'est tout ? » (là : « Oui »).",
        "« Carte » : menu ou paiement ; le contexte tranche (« Carte ou espèces ? » = paiement).",
        "Tous les scripts N sont des dialogues créés : naturel jugé par locuteur, non attesté en corpus ; à faire valider par deux francophones de France."
      ],
      "decisions": [
        "« Deux thés, très bien. » / « Deux cafés, très bien. » remplacés par « Deux thés, d'accord. » / « Deux cafés, d'accord. » (très ressemble à tres / tre = 3 dans une question de quantité) ; « très bien » reste dans « Très bien, merci. » de S5 (aucune quantité) et est une forme à reconnaître plus tard.",
        "« café noir » et « café long » : gardés uniquement dans le film ; aucun son créé ne les contient. Le défi de S5 est « Il n'y a plus de thé. Un café ? ».",
        "« Trois euros, s'il vous plaît. » remplacé par « Ça fait trois euros. » ; le montant est à adapter aux produits.",
        "« un seul » (T4) : variante gardée seulement si vue ; par défaut « Non, un thé. ».",
        "« espèces » gardé (forme standard, dans le film) ; « en liquide » à reconnaître plus tard seulement.",
        "Alternatives à « Autre chose ? » et « Vous désirez ? » : « Et avec ça ? », « Vous voulez autre chose ? », « Je vous écoute »."
      ],
      "statut": "Naturel jugé par locuteur (A2) ; aucune concordance de corpus interrogée ; à faire valider par deux francophones de France."
    },
    "mesures_film": {
      "titre": "Mesures du film : ce qui est montré et pourquoi",
      "avertissement": "MESURES AUTOMATIQUES (Praat, YIN, Whisper, reconnaissance de sons) — pas une écoute experte. Le formateur (francophone) doit confirmer à l'oreille avant tout usage dans le support.",
      "ce_qui_est_montre": [
        "À l'apprenant : rien de mesuré. Aucune courbe, aucun chiffre, aucune barre dans le texte, aucune marque de groupe avant écoute experte.",
        "Le seul fait acoustique retenu pour le formateur : dans « Un café noir pour moi | s'il vous plaît » (film-p4), une seule pause mesurée, de 0,47 s, entre « moi » et « s'il vous plaît » (présente aux trois seuils de détection). « Un café noir | pour moi » : aucune pause ; « noir » 1,35× plus long et descendant, « pour moi » dans un registre très bas (voix peut-être craquée).",
        "La fin de « plaît » monte peut-être (Praat +5,6 ; YIN +1,9 demi-tons), non fiable : ne pas en faire une règle et ne pas faire copier la mélodie.",
        "Groupes montrables au formateur (groupes_fiables : vrai) : film-p4 « Un café noir pour moi | s'il vous plaît » ; film-p5 « C'est tout ? | Oui, merci, c'est tout » ; film-Bdif « Carte ou espèces ? | Espèces, espèces ». Non fiables : film-p6 « L'addition s'il vous plaît » (aucune pause, aucun changement de niveau) et la réplique « un café long et un jus d'orange, s'il vous plaît » (non utilisée).",
        "Les mesures sont automatiques (Praat, YIN, Whisper, reconnaissance de sons), pas une écoute experte : à confirmer à l'oreille avant tout usage dans le support."
      ],
      "pourquoi": "Pour dire « s'il vous plaît » d'un seul tenant (S4), on n'a besoin que de la place de la pause et du sens ; aucune règle de hauteur n'est affirmée (hypothèse d'allongement final : ni règle, ni montée obligatoire).",
      "debit": "Scène du café : 75 à 83 mots/minute selon la façon de compter (la note « ≈ 87 mots/min » de l'ancien support vise le film entier et n'est pas reproduite).",
      "extraits": {
        "film-p4": {
          "debut": 145.9,
          "fin": 148.58,
          "texte": "Un café noir pour moi, s'il vous plaît.",
          "groupes": [
            "Un café noir pour moi",
            "s'il vous plaît"
          ],
          "groupes_fiables": true,
          "groupes_ambigus": [
            "Un café noir | pour moi (aucune pause ; « noir » 1,35× plus long et descendant ; « pour moi » dans un registre très bas, voir remarques)"
          ],
          "pauses": [
            {
              "place": "entre « moi » et « s'il vous plaît »",
              "duree_s": 0.47,
              "note": "0,30 s à 0,52 s selon le seuil ; présente aux 3 seuils"
            }
          ],
          "remarques": "Premier son à 146,55 ; bruit léger (+5 dB) entre 146,05 et 146,50, ce n'est pas le « Un ». « Et moi » du client démarre à 148,64 : la fin doit rester ≤ 148,58 (le p4 déclaré, 148,66, l'inclut déjà). « pour moi s'il vous » sont mesurés à 70-85 Hz alors que « Un café noir » est à 170-265 Hz : voix craquée ou erreur de mesure (YIN ne détecte rien) ; ne pas en tirer de contour."
        },
        "film-p5": {
          "debut": 154.83,
          "fin": 157.48,
          "texte": "C'est tout ? — Oui, merci, c'est tout.",
          "groupes": [
            "C'est tout ?",
            "Oui, merci, c'est tout"
          ],
          "groupes_fiables": true,
          "groupes_ambigus": [
            "Oui | merci | c'est tout : les deux virgules ne correspondent à aucune pause ≥ 150 ms ni à un allongement"
          ],
          "pauses": [
            {
              "place": "entre la question du serveur et la réponse du client",
              "duree_s": 0.5,
              "note": "silence entre deux répliques"
            }
          ],
          "remarques": "« Parfait » (serveur) occupe 154,59–155,02 avec un pic fort à 154,85 : le début recommandé 154,83 respecte la marge de 0,5 s mais laisse entendre ce pic si le lecteur ne perd pas 0,35 s. Compromis alternatif : 155,00 (marge 0,33 s : non conforme). Pour éviter ce problème, préférer les deux sous-extraits ci-dessous. Débit calculé sur la parole seule (7 syllabes en 1,25 s)."
        },
        "film-p6": {
          "debut": 191.64,
          "fin": 193.5,
          "texte": "L'addition, s'il vous plaît.",
          "groupes": [
            "L'addition s'il vous plaît"
          ],
          "groupes_fiables": false,
          "groupes_ambigus": [
            "L'addition | s'il vous plaît : aucune pause, aucun changement de niveau de hauteur ; seul « tion » est un peu plus long (1,48×)"
          ],
          "pauses": [],
          "remarques": "Fond sonore continu d'environ 55 dB sur 191–192,1 (ambiance, non identifiée) : la parole commence à 192,19. Whisper entend « La mission » pour « L'addition » (turbo « L » 191,6). Le début 191,64 est conforme (marge 0,55 s)."
        },
        "film-Bdif": {
          "debut": 199.43,
          "fin": 205.4,
          "texte": "Carte ou espèces ? — Espèces, espèces.",
          "groupes": [
            "Carte ou espèces ?",
            "Espèces, espèces"
          ],
          "groupes_fiables": true,
          "groupes_ambigus": [
            "Espèces | espèces : coupure de ≈ 0,06–0,14 s seulement (sous le seuil de 150 ms)"
          ],
          "pauses": [
            {
              "place": "entre la question du serveur et la réponse du client",
              "duree_s": 3.38,
              "note": "aucun mot détecté ; ambiance seule"
            }
          ],
          "remarques": "Le son du film contient une COUPURE NUMÉRIQUE (silence absolu) de 199,12 à 199,74 s : un début à 198,84 (extrait déclaré) fait entendre 0,3 s d'ambiance, 0,6 s de silence, puis « Carte » à 199,93. Le début recommandé 199,43 tombe dans ce silence (0,31 s de silence total au démarrage, aucune parole avant 199,93) ; avec la perte de ~0,35 s du lecteur, l'extrait démarre pratiquement sur l'ambiance. Whisper place « Carte » à 199,44 : faux (acoustique 199,93). « voilà monsieur » (serveur) commence à 206,97 : la fin 205,40 est sûre. Débit sur la parole seule (8 syllabes en 1,55 s)."
        }
      },
      "film_B": {
        "debut": 137.44,
        "fin": 212.4,
        "declare": [
          136.9,
          212.4
        ],
        "remarques": "Premier son de parole (« Bonjour madame ») à 138,17, juste après un silence numérique de 0,73 s ; Whisper le place à 137,76 (0,4 s trop tôt). Dernier mot (« au revoir ») fini à ≈ 212,05."
      },
      "attention_marges": [
        "film-p5 : « Parfait » du serveur occupe 154,59–155,02 avec un pic à 154,85 ; le début 154,83 respecte la marge de 0,5 s mais peut laisser entendre ce pic. Sous-extraits possibles (non utilisés ici) : p5_question et p5_reponse.",
        "film-Bdif : le son du film contient une coupure numérique (silence absolu) de 199,12 à 199,74 s ; le début recommandé 199,43 tombe dans ce silence : l'extrait démarre pratiquement sur l'ambiance.",
        "Qui dit quoi : « la femme » (café noir) et « l'homme » (café long, jus d'orange) viennent des sous-titres ; les autres répliques restent « un client » (les mesures indiquent « la cliente » ou « le client » d'après le film, non vérifié à l'oreille)."
      ]
    },
    "statut": {
      "titre": "Statut du dossier",
      "lignes": [
        "Dialogues créés, voix de synthèse non validées à l'écoute.",
        "Aides ES/IT non relues par un locuteur natif.",
        "Aucun résultat d'apprenant n'existe ; rien n'a été essayé avec des apprenants.",
        "Mesures du film automatiques, à confirmer à l'oreille ; sous-titres du lecteur YouTube non contrôlés (extraits A à D).",
        "Seuils et critères provisoires, à piloter.",
        "Écart assumé : l'aide en espagnol ou en italien de l'écran d'accueil est proposée avant tout essai en français (cet écran n'a pas d'écoute) ; partout ailleurs, l'aide vient après un premier essai.",
        "Aides ES/IT modifiées en v3 : à relire par un natif (espagnol, italien).",
        "Voix, consignes et retours de la v3 : à régénérer (voix du serveur fournie par le formateur, débit plus lent) ; non validés à l'écoute tant que ce n'est pas fait."
      ],
      "mention_aides_es_it": "Aides ES/IT non relues par un locuteur natif (relecture exigée par le dossier de conception : médiateur compétent dans chaque langue)."
    },
    "points_ouverts_03": [
      "Écouter et valider les prises exactes du film/Qwen réutilisées, avec au moins une personne compétente pour accent, rythme, intonation et registre ; le manifeste seul ne suffit pas.",
      "Produire et valider les audios N du diagnostic, de la pratique et du transfert ; vérifier droits du film, consentement et conditions de partage des nouveaux enregistrements.",
      "Vérifier en classe qui utilise le site : L1 déclarée, niveau réel, taille du groupe, accompagnement, casque, environnement sonore, connexion, micro autorisé ou non. Adapter le budget de 45 min sur mesure réelle.",
      "Contrôler le libellé et le registre de chaque nouveau tour auprès de francophones de France et, si possible, d'un corpus de service écoutable plus récent ; la boulangerie de 2006 n'établit pas le café actuel.",
      "Tester navigation complète clavier/mobile, contrôle effectif des sous-titres, micro/import et gestion des sons concurrents avant usage autonome.",
      "Piloter S0–S6 auprès d'apprenants adultes ES/IT identifiés individuellement ; comparer compréhension, production, interaction, temps et effort, y compris item/voix nouveaux et maintien différé. Publier séparément les résultats si recueillis ; aucun n'existe dans ce dossier."
    ],
    "points_ouverts_suivi": [
      "Questions et choix de S1 (S1-C1 action, S1-C2 produit) : identifiants et réponses attendues fixés à partir de 02 S1 et de la transcription du film ; ici S1-C1 = la fin de la scène (l'addition), S1-C2 = les produits.",
      "Montage A (deux fenêtres, événement storage) : proposé, non testé dans un navigateur ; à vérifier sur Safari et Chrome, et avec un partage de fenêtre Teams.",
      "Banque avant le cours : l'accès « avant le cours » doit exister dans l'espace formateur, sinon l'alternance D/T est impossible.",
      "J+7 n'est pas contrebalancé (T3/T4 pour tous) et ses items diffèrent de ceux de la sortie : on observe une réussite différée sur items nouveaux, pas un « maintien » au sens strict.",
      "Deux choix = une chance sur deux aux conditions « après images » et « après réécoute » ; seul le passage 1 en réponse libre échappe au hasard, et il exige un formateur.",
      "Comptage des écoutes du film : seuls les boutons de la page sont comptés ; une relecture par les commandes YouTube échappe au journal.",
      "Descripteurs et exemples de la grille : rédigés sans exemple audio ancré ; à compléter par deux ou trois sons de référence par niveau après production.",
      "Traductions ES/IT : non relues par un locuteur compétent.",
      "Aucune donnée réelle : aucune valeur ne doit être citée comme résultat."
    ],
    "diagnostic_sons": {
      "avertissement": "Pour le formateur seulement ; à n'utiliser qu'après observation de cette personne ; hypothèses, pas des diagnostics.",
      "liste": [
        {
          "id": "deux",
          "cible_fr": "la voyelle de « deux » (≠ « de », « des », « du », ≠ dos / due)",
          "ou_dans_la_seance": "S0 « deux thés » ; S6 « deux cafés » ; banque T4 « Deux thés ? ».",
          "ce_qui_peut_arriver": "« deux » entendu ou dit comme « de », « des » ou « du », ou remplacé par dos / due : le nombre se perd. Hypothèse, à vérifier pour chaque personne.",
          "observer": {
            "duree_s": 20,
            "materiel": "Voix du formateur, sans texte. Mot « croissants » exprès, pour ne pas entraîner S6 (« deux cafés »).",
            "prise_1": "Deux croissants, s'il vous plaît.",
            "prise_2": "Un café et deux croissants.",
            "question": "Après chaque prise : « Combien de croissants ? » Réponse avec les doigts.",
            "essai_parle": "L'apprenant dit « Deux croissants, s'il vous plaît ». Le formateur montre avec les doigts le nombre compris.",
            "lecture": "Vrai problème seulement si le nombre est faux aux deux prises, ou si le nombre dit par l'apprenant n'est pas compris. Une seule erreur : rejouer une fois, sans aide. En cas de doute, troisième prise « Des croissants, s'il vous plaît » et question « Un nombre : oui ou non ? »."
          },
          "indication_es": "Diga la «e» de «café» y, sin mover la lengua, redondee los labios como para decir «o».",
          "indication_it": "Dica una «e» e, senza muovere la lingua, arrotondi le labbra come per dire «o».",
          "limite": "Seulement si le sens devient ambigu (nombre perdu ou confondu). Un « deux » approximatif mais compris comme 2 ne se corrige pas à ce niveau.",
          "sources": [
            "37",
            "13",
            "W2"
          ],
          "portee_sources": "[37] : 36 adultes hispanophones novices, contraste entre deux voyelles voisines de celle de « deux », en syllabes isolées ; cela montre une zone sonore nouvelle pour ce public, pas une confusion de « deux » dans un dialogue. [13] : résumé seul, aucun résultat précis invoqué. W2 relie des difficultés à l'absence de ces voyelles en espagnol, chez des étudiants de niveau B2. Italophones : aucune source du dossier 01 sur cette voyelle, et aucune source en ligne vérifiée ; simple hypothèse (voyelle absente de l'italien standard)."
        },
        {
          "id": "un",
          "cible_fr": "la voyelle nasale de « un », sans [n] ajouté à la fin",
          "ou_dans_la_seance": "« Un café, s'il vous plaît » ; « Un café et un thé ? » ; « un croissant aussi ».",
          "ce_qui_peut_arriver": "Voyelle ordinaire suivie d'un [n] (« oun », « an-n ») : l'auditeur peut entendre « une » ou hésiter. Dans la séance, « un » s'oppose à « deux » : le sens est rarement en jeu.",
          "observer": {
            "duree_s": 20,
            "materiel": "Voix du formateur, sans texte.",
            "prise_1": "Un thé, s'il vous plaît.",
            "prise_2": "Un croissant et un café.",
            "question": "Après chaque prise : « Combien ? » Réponse avec les doigts ou en montrant les images.",
            "essai_parle": "L'apprenant dit « Un café, s'il vous plaît ». Le formateur redit ce qu'il a compris : nombre et produit.",
            "lecture": "Vrai problème seulement si l'auditeur ne retrouve pas « un » (il entend « une », « on » ou un autre mot), ou si l'apprenant le demande lui-même. Sinon ne rien corriger."
          },
          "indication_es": "Diga una «e» con la boca abierta, dejando salir el aire también por la nariz, y termine sin subir la lengua: no se oye ninguna «n».",
          "indication_it": "Dica una «e» aperta, facendo uscire l'aria anche dal naso, e finisca senza alzare la lingua: non si sente nessuna «n».",
          "limite": "Seulement si le sens devient ambigu. Ordre imposé par 02 §1 : d'abord faire entendre la voyelle dans la formule entière, puis un essai guidé. Ne pas en faire une règle « jamais de n » : devant une voyelle (« un allongé »), un [n] s'entend. Adapter l'indication à la voix du modèle : beaucoup de francophones disent « un » comme le « in » de « vin ».",
          "sources": [
            "36",
            "12",
            "W1",
            "W2"
          ],
          "portee_sources": "[36] : 10 apprenants italophones instruits et 10 témoins, lecture à voix haute avant et après une leçon ; plusieurs façons de remplacer les voyelles nasales, progrès du groupe instruit ; rien sur la conversation. [12] : 25 italophones, lien entre vocabulaire et prononciation, pas une règle pour un individu. W2 (hispanophones de niveau B2 à Bogotá) décrit le remplacement par voyelle + consonne nasale ; autre public que le nôtre."
        },
        {
          "id": "vous_vu",
          "cible_fr": "« vous » / « vu » (les voyelles écrites « ou » et « u »)",
          "ou_dans_la_seance": "« s'il vous plaît », « vous pouvez répéter », « Et pour vous ? », « C'est tout » ; « jus d'orange » pour l'autre voyelle.",
          "ce_qui_peut_arriver": "« ou » lu en deux voyelles (« o-u »), ou « vous » dit avec la voyelle de « vu » par excès de correction ; à l'inverse « jus » dit « jou ». Dans les phrases de la séance, aucune paire de ce type ne change le sens.",
          "observer": {
            "duree_s": 20,
            "materiel": "Voix du formateur, sans texte, puis le texte de la phrase.",
            "prise_1": "Et pour vous ?",
            "prise_2": "Vous payez par carte ?",
            "question": "L'apprenant répond ou se montre du doigt : il comprend qu'on lui parle.",
            "essai_parle": "L'apprenant dit « Pardon, vous pouvez répéter, s'il vous plaît ? » sans texte, puis une fois avec le texte sous les yeux.",
            "lecture": "Si « vous » ne se déforme qu'avec le texte, c'est un effet de lecture : cacher le texte et repartir de l'écoute. Vrai problème seulement si l'auditeur ne reconnaît plus « vous » ou « jus »."
          },
          "indication_es": "En «vous», «ou» es una sola vocal, igual que la «u» de «tú»; para la «u» de «jus», diga «i» y redondee los labios sin mover la lengua.",
          "indication_it": "In «vous», «ou» è una sola vocale, uguale alla «u» di «tu»; per la «u» di «jus», dica «i» e arrotondi le labbra senza muovere la lingua.",
          "limite": "Seulement si le sens devient ambigu ; 02 S5 demande d'observer « vous » sans correction exhaustive. Un « vous » dit avec un b au début reste compris : ne pas corriger.",
          "sources": [
            "11",
            "18",
            "W1",
            "W2"
          ],
          "portee_sources": "[11] : étudiants hispanophones, corpus, production des deux voyelles fermées arrondies ; lu sur notice et résumé. Le résumé en ligne (W1) dit ce contraste « difficile à acquérir » pour ce public ; il ne dit rien d'un dialogue de café ni d'un débutant. Italophones : aucune source du dossier 01. [18] : revue sur l'effet de l'écrit, qui peut aider ou gêner selon la tâche."
        },
        {
          "id": "the_des",
          "cible_fr": "« thé » / « des »",
          "ou_dans_la_seance": "S0 « un thé », « deux thés » ; S3 et S4 « Un thé, s'il vous plaît ».",
          "ce_qui_peut_arriver": "Risque faible en principe : t et d existent en espagnol et en italien. Cas plausibles : « deux thés » compris « des thés » (voir la fiche « deux ») ; « th » lu à l'anglaise ou comme le z castillan ; mot très court non repéré.",
          "observer": {
            "duree_s": 20,
            "materiel": "Voix du formateur, sans texte ; images café / thé / croissant.",
            "prise_1": "Un thé, s'il vous plaît.",
            "prise_2": "Un café et un thé.",
            "question": "Après chaque prise, l'apprenant montre les images de ce qui est commandé.",
            "essai_parle": "L'apprenant dit « Un thé, s'il vous plaît ». Le formateur montre l'image comprise.",
            "lecture": "Vrai problème seulement si la boisson n'est pas reconnue aux deux prises, ou si l'auditeur entend autre chose que la boisson."
          },
          "indication_es": "Es casi la palabra española «té»: la «h» no suena y la «t» se dice con la punta de la lengua contra los dientes.",
          "indication_it": "È quasi la parola italiana «tè»: la «h» non si pronuncia e la «t» è quella italiana.",
          "limite": "Seulement si le sens devient ambigu. Ne pas travailler la différence de voyelle entre « thé » et « tè » italien : elle ne change pas le sens.",
          "sources": [
            "18"
          ],
          "portee_sources": "Aucune source du dossier 01 ne porte sur ce point : il est gardé parce que S0 repose sur « thé ». [18] ne vaut que pour le risque de lecture (« th »)."
        },
        {
          "id": "r_carte",
          "cible_fr": "le r de « carte »",
          "ou_dans_la_seance": "« par carte », « Carte ou espèces ? » ; aussi « croissant », « merci », « pardon », « répéter », « très bien ».",
          "ce_qui_peut_arriver": "À l'oral : r roulé à l'avant de la bouche, qui reste compris. À l'écoute : le r français, peu audible après une voyelle, peut empêcher de reconnaître « carte ».",
          "observer": {
            "duree_s": 20,
            "materiel": "Voix du formateur, sans texte ; images terminal de paiement / pièces et billets.",
            "prise_1": "Par carte, s'il vous plaît.",
            "prise_2": "Carte ou espèces ?",
            "question": "Après chaque prise, l'apprenant montre l'image ou les images entendues.",
            "essai_parle": "L'apprenant dit « Par carte, s'il vous plaît ». Le formateur montre l'image comprise.",
            "lecture": "Si « carte » n'est pas reconnu à l'écoute aux deux prises : c'est un travail d'écoute (rejouer, puis montrer le mot), pas d'articulation. Si le mot dit par l'apprenant est compris, ne rien corriger, même avec un r roulé."
          },
          "indication_es": "No necesita la «r» francesa para que le entiendan; si quiere probarla, deje la punta de la lengua quieta abajo y haga un roce muy suave al fondo de la boca, como una jota muy suave.",
          "indication_it": "Non Le serve la «r» francese per farsi capire; se vuole provarla, tenga la punta della lingua ferma in basso e faccia un leggero fruscio in fondo alla bocca, come la «erre moscia».",
          "limite": "Seulement si le sens devient ambigu, donc presque jamais pour l'oral. À proposer si l'apprenant le demande.",
          "sources": [
            "W3"
          ],
          "portee_sources": "Aucune source du dossier 01 sur ce son. W3 est une page de phonétique corrective (avis d'un spécialiste, pas une étude) : un r roulé « est compréhensible en français et n'entrave pas la communication »."
        },
        {
          "id": "s_il_vous_plait",
          "cible_fr": "« s'il vous plaît » d'un seul tenant",
          "ou_dans_la_seance": "Toutes les demandes ; travaillé en S4.",
          "ce_qui_peut_arriver": "Trois mots écrits dits en trois morceaux, avec une pause ou un appui sur chaque mot ; « plaît » lu en deux voyelles. Ne pas attribuer ce comportement d'office à la langue de la personne (02 S4).",
          "observer": {
            "duree_s": 20,
            "materiel": "Voix du formateur ou modèle de S4 déjà vérifié, sans texte.",
            "prise_1": "Un café, s'il vous plaît.",
            "prise_2": "Un thé, s'il vous plaît.",
            "question": "Après chaque prise : « La personne a fini de commander ? » Réponse oui / non.",
            "essai_parle": "L'apprenant dit « Un thé, s'il vous plaît ». Le formateur note si une pause à l'intérieur de la formule lui a fait croire que la demande était finie, ou a gêné la compréhension.",
            "lecture": "Vrai problème seulement si la coupure gêne l'interprétation. Si « plaît » est lu en deux voyelles : cacher le texte et rejouer tout le groupe dans la demande (02 S4)."
          },
          "indication_es": "Dígalo todo seguido, como si fuera una sola palabra, sin parar entre «s'il», «vous» y «plaît».",
          "indication_it": "Lo dica tutto di seguito, come se fosse una sola parola, senza fermarsi tra «s'il», «vous» e «plaît».",
          "limite": "Seulement si le sens devient ambigu. Formule comprise : ne pas imposer une copie de la mélodie. Aucune consigne sur « la dernière syllabe » ni sur une montée (M06, M07).",
          "sources": [
            "7",
            "29",
            "30"
          ],
          "portee_sources": "[7] : 15 apprenants mexicains de niveau A2/B1, questions lues ; des différences de découpage, que la langue maternelle n'expliquait pas toutes ; ce n'est pas une étude sur des débutants. [29] et [30] décrivent l'accent de mot en espagnol et en italien ; ils ne disent rien d'apprenants de français. L'idée d'un appui sur chaque mot reste une hypothèse."
        },
        {
          "id": "especes",
          "cible_fr": "« espèces » en deux syllabes, sans fin ajoutée",
          "ou_dans_la_seance": "« Carte ou espèces ? » ; « En espèces, s'il vous plaît » ; banque T2 « Non, en espèces ».",
          "ce_qui_peut_arriver": "Lecture à l'espagnole en trois syllabes, fin écrite prononcée (proche de « especies »), « c » dit comme le z castillan. Lecture à l'italienne : « c » dit comme dans « cena », voyelle ajoutée après le dernier son, ou début raccourci sous l'effet de « specie ». Hypothèses de lecture, non observées.",
          "precision_mandat": "Le mot français commence déjà par une voyelle : il n'y a pas de voyelle initiale « ajoutée » à surveiller ici. L'ajout d'un « e » devant s + consonne concerne des mots comme « spécial », absents de la séance.",
          "observer": {
            "duree_s": 20,
            "materiel": "Voix du formateur ; images terminal de paiement / pièces et billets ; puis le mot écrit.",
            "prise_1": "Carte ou espèces ?",
            "prise_2": "En espèces, s'il vous plaît.",
            "question": "Après chaque prise, l'apprenant montre l'image ou les images entendues.",
            "essai_parle": "L'apprenant dit « En espèces, s'il vous plaît » juste après l'écoute, sans texte ; puis une fois avec le mot écrit sous les yeux.",
            "lecture": "Si la déformation n'apparaît qu'avec le texte : effet de lecture, cacher le mot et repartir de l'écoute, sans explication. Vrai problème seulement si l'auditeur ne reconnaît pas « espèces » même sans texte."
          },
          "indication_es": "Son solo dos golpes de voz: la «c» suena como una «s» y las dos últimas letras («es») no se pronuncian.",
          "indication_it": "Sono solo due sillabe: la «c» si dice «s» (non come in «cena»), le ultime due lettere («es») non si pronunciano e dopo non si aggiunge nessuna vocale.",
          "limite": "Seulement si le sens devient ambigu. L'apprenant peut aussi choisir « Par carte » : ne pas insister.",
          "sources": [
            "18",
            "W2"
          ],
          "portee_sources": "[18] : revue ; l'écrit peut aider ou gêner la prononciation selon la tâche. W2 signale des consonnes finales prononcées et un « e » ajouté devant s initial (« spectaculaire ») chez des étudiants hispanophones de niveau B2 ; ce second point ne concerne pas « espèces ». Voyelle finale ajoutée par un italophone : aucune source du dossier 01, simple hypothèse."
        }
      ]
    },
    "sons": {
      "note": "Liste, statut et avis d'écoute : lus dans « sons » et dans le manifeste audio ; avis exportables en JSON (clé rendez-vous-a1-v3-studio). Liste des sons à produire : specs/C1_sons_v3.json."
    },
    "changements_v3": {
      "titre": "Ce qui a changé en v3",
      "lignes": [
        "Réécoute libre : le bouton « Écouter » reste visible et on peut réécouter autant de fois que l'on veut ; plus de passage automatique après un son. Le nombre d'écoutes avant chaque réponse est compté à la place de la « troisième réponse » (plus de réécoute identique obligatoire).",
        "Retour en arrière : bouton « ← Revenir » dans chaque activité à plusieurs fenêtres ; « Retour » n'est plus jamais bloqué.",
        "Audio partout : chaque consigne, chaque retour (correction, explication, message de fin), chaque question du serveur et chaque réplique du film affichée a son bouton d'écoute ; aucun son n'est réservé à un mode. Le serveur parle dans tous les modes.",
        "Illustrations en couleurs, tuile « Je ne sais pas » de même taille que les images de réponse.",
        "Vocabulaire : plus de « touchez » (« Sélectionnez… », « Cliquez sur « … » », « Dites … à voix haute »), plus de « montrez avec les doigts », plus de « dans votre langue ». Plus aucune étiquette de provenance (voix de machine, dialogue créé, extrait du film) dans la page de l'apprenant : l'information reste ici et dans audio/manifest.json.",
        "S0 : message de fin qui dit quoi faire, affiché une seule fois et qui nomme le bouton réellement actif (« Merci. Vous verrez la bonne réponse à la fin du cours. Cliquez sur « Suite ». »).",
        "S2 : deux gestes par phrase (1. écouter, 2. sélectionner l'image) ; plus de fenêtre « Dites votre idée ».",
        "Aides ES/IT alignées sur les consignes modifiées : à relire par un natif.",
        "Contre-relecture du 07/10/2026 : chaque question ou consigne affichée a son bouton d'écoute ; chaque retour a le sien (2.D et 6.1 : un retour = une zone) ; « Ne regardez pas l'écran » retiré ; tuile « Je ne sais pas » dans tous les choix d'images à bonne réponse ; en S5 le modèle à comparer s'affiche juste après « J'ai répondu » ; enregistrement facultatif et modèle dans les rappels à 2 et 7 jours."
      ]
    }
  },
  "bilan": {
    "titre": "Ce que j'ai fait aujourd'hui",
    "avertissement": "Ce sont deux dialogues différents. Les voix changent. La boisson change. Ce n'est pas un examen. Il n'y a pas de note.",
    "blocs": [
      {
        "id": "ecoute",
        "titre": "J'écoute deux personnes",
        "sections": [
          {
            "id": "debut",
            "titre": "Au début du cours",
            "question": "Question : combien de thés ?",
            "item": "S0-C1",
            "dialogue": "s0-dialogue",
            "mot_unique": "thés"
          },
          {
            "id": "fin",
            "titre": "À la fin du cours",
            "question": "Question : combien de cafés ?",
            "item": "S6-C1",
            "dialogue": "s6-dialogue",
            "mot_unique": "cafés"
          }
        ],
        "lignes": [
          {
            "cle": "p1",
            "etiquette": "À la première écoute"
          },
          {
            "cle": "img",
            "etiquette": "Avec les images"
          },
          {
            "cle": "re",
            "etiquette": "",
            "inutilise": true
          },
          {
            "cle": "ecoutes",
            "etiquette": "Nombre d'écoutes avant ma réponse"
          }
        ],
        "phrases": {
          "correcte": {
            "p1": "j'ai répondu « {valeur} ». C'est la bonne réponse.",
            "img": "j'ai choisi « {valeur} ». C'est la bonne réponse.",
            "re": "j'ai choisi « {valeur} ». C'est la bonne réponse."
          },
          "incorrecte": {
            "p1": "j'ai répondu « {valeur} ». La bonne réponse : « {attendue} ».",
            "img": "j'ai choisi « {valeur} ». La bonne réponse : « {attendue} ».",
            "re": "j'ai choisi « {valeur} ». La bonne réponse : « {attendue} »."
          },
          "non_donnee": {
            "p1": "je n'ai pas répondu. La bonne réponse : « {attendue} ».",
            "img": "j'ai choisi « je ne sais pas ». La bonne réponse : « {attendue} ».",
            "re": "j'ai choisi « je ne sais pas ». La bonne réponse : « {attendue} »."
          },
          "idee": {
            "p1": "j'avais une idée. Ma réponse n'est pas notée."
          },
          "ne_sais_pas": {
            "p1": "je ne savais pas."
          },
          "absente": {
            "p1": "je n'ai pas fait cette partie.",
            "img": "je n'ai pas fait cette partie.",
            "re": "je n'ai pas fait cette partie."
          },
          "ecoutes": {
            "nombre": "j'ai écouté {n} fois avant de répondre.",
            "absente": "je n'ai pas fait cette partie."
          }
        },
        "valeurs_en_mots": {
          "un": "un",
          "deux": "deux",
          "un the": "un thé",
          "deux thes": "deux thés",
          "un cafe": "un café",
          "deux cafes": "deux cafés"
        },
        "mode_groupe": {
          "remplacer": [
            "j'ai",
            "nous avons"
          ],
          "sous_titre": "Réponses du groupe"
        },
        "dialogue_debut": {
          "acces": "voir_dialogue_debut",
          "son": "s0-dialogue",
          "etiquette": "cree",
          "repliques": [
            {
              "role": "Le serveur",
              "couleur": "personnel",
              "texte": "Un café et un thé ?"
            },
            {
              "role": "La cliente",
              "couleur": "client",
              "texte": "Non, deux thés, s'il vous plaît."
            },
            {
              "role": "Le serveur",
              "couleur": "personnel",
              "texte": "Deux thés, d'accord."
            }
          ],
          "boutons": [
            "reecouter",
            "la_cliente"
          ],
          "son_cliente": "s0-r2"
        },
        "note_v3": "v3 : la ligne `re` (deuxième écoute) n'existe plus (condition « apres_reecoute » = non proposé) ; le nombre d'écoutes (`ecoutes`) la remplace."
      },
      {
        "id": "cours",
        "titre": "J'écoute pendant le cours",
        "note_interne": "Une ligne par question, première écoute seulement.",
        "lignes_modeles": [
          "Le film : que font les deux personnes ? J'ai choisi « {valeur} ». {C'est la bonne réponse. | La bonne réponse : « {attendue} ».}",
          "Phrase {1|2|3} du film : j'ai choisi « {valeur} ». {C'est la bonne réponse. | La bonne réponse : « {attendue} ».}",
          "Carte ou espèces ? À la première écoute : {ligne}. Avec les images : {ligne}."
        ],
        "valeurs_en_mots": {
          "commander": "commander",
          "finir": "demander si c'est tout",
          "payer": "demander à payer",
          "carte": "par carte",
          "especes": "en espèces"
        },
        "items": [
          "S1-C1",
          "S2-C1",
          "S2-C2",
          "S2-C3",
          "S2-C4"
        ]
      },
      {
        "id": "parle",
        "titre": "Je parle",
        "lignes": [
          "J'ai répondu au serveur : {n} fois."
        ],
        "lignes_si_n_positif": [
          "J'ai demandé de répéter : {n} fois. C'est normal."
        ],
        "par_mode": {
          "formateur": "Mon formateur a écouté. Je peux lui poser des questions.",
          "seul": "J'ai parlé seul(e). Personne n'a écouté. Ce n'est pas vérifié."
        },
        "grille_visible": false
      },
      {
        "id": "sait_dire",
        "titre": "Ce que je sais dire",
        "boutons": [
          "je_sais_le_dire",
          "pas_encore"
        ],
        "lignes": [
          {
            "id": "commander",
            "textes": [
              "Un café, s'il vous plaît."
            ],
            "sons": [
              "cli1-un-cafe-svp"
            ]
          },
          {
            "id": "fin_commande",
            "textes": [
              "Oui, merci, c'est tout.",
              "Non merci, c'est tout."
            ],
            "sons": [
              "cli1-oui-merci-cest-tout",
              "cli1-non-merci-cest-tout"
            ]
          },
          {
            "id": "payer",
            "textes": [
              "Par carte, s'il vous plaît.",
              "En espèces."
            ],
            "sons": [
              "cli1-par-carte-svp",
              "cli1-en-especes"
            ]
          },
          {
            "id": "repeter",
            "textes": [
              "Pardon, vous pouvez répéter, s'il vous plaît ?"
            ],
            "sons": [
              "cli1-pardon-repeter"
            ]
          }
        ],
        "si_toutes_pas_encore": "c_est_normal_revoir",
        "variantes": [
          {
            "si": {
              "palier": [
                "simple"
              ]
            },
            "set": {
              "affiche": [
                "commander",
                "fin_commande"
              ],
              "titre_reste": "pour_la_prochaine_fois",
              "reste": [
                "payer",
                "repeter"
              ]
            }
          },
          {
            "si": {
              "palier": [
                "plus"
              ]
            },
            "set": {
              "ajoute": [
                {
                  "id": "vous_payez_comment",
                  "textes": [
                    "Vous payez comment ? → Par carte, s'il vous plaît. / En espèces."
                  ],
                  "sons": [
                    "pers1-vous-payez-comment",
                    "cli1-par-carte-svp",
                    "cli1-en-especes"
                  ]
                },
                {
                  "id": "defi",
                  "textes": [
                    "Le défi : « Il n'y a plus de thé. Un café ? »"
                  ],
                  "sons": [
                    "pers1-plus-de-cafe-noir"
                  ]
                }
              ]
            }
          }
        ],
        "note_interne": "Pas de verdict. Ligne ajoutée à A4 §3 : elle vient de A1 (pas 6.7, partie 2) et n'est pas contredite par A4."
      },
      {
        "id": "aides",
        "titre": "Mes aides",
        "phrases": [
          "J'ai utilisé : {le texte}{, l'aide en espagnol | l'aide en italien}{, la voix lente}.",
          "Je n'ai pas utilisé d'aide.",
          "Utiliser une aide, c'est normal."
        ]
      },
      {
        "id": "avis",
        "titre": "Mon avis",
        "question": "Ce cours, pour moi, c'était :",
        "reponses": [
          {
            "valeur": 1,
            "libelle": "très facile"
          },
          {
            "valeur": 2,
            "libelle": "facile"
          },
          {
            "valeur": 3,
            "libelle": "ni facile, ni difficile"
          },
          {
            "valeur": 4,
            "libelle": "difficile"
          },
          {
            "valeur": 5,
            "libelle": "très difficile"
          }
        ],
        "question_2": "Le plus difficile pour moi :",
        "reponses_2": [
          {
            "valeur": "ecouter",
            "libelle": "écouter"
          },
          {
            "valeur": "parler",
            "libelle": "parler"
          },
          {
            "valeur": "les_deux",
            "libelle": "les deux"
          },
          {
            "valeur": "rien",
            "libelle": "rien"
          }
        ],
        "facultatif": true,
        "note_interne": "Traduction ES/IT de cette question : absente de A3 (seule source ES/IT) ; non incluse."
      }
    ],
    "export": {
      "bouton": "exporter",
      "note": "exporter_note",
      "seul": {
        "lignes": [
          "Vous pouvez montrer cette page à votre formateur."
        ]
      }
    },
    "suite": {
      "bouton": "apres_le_cours",
      "lignes": [
        "Merci. C'est la fin du cours. Cliquez sur « Après le cours »."
      ]
    }
  },
  "export": {
    "schema": "impact60.rdv-a1-v3.journal/1",
    "actions": [
      "copier_le_texte",
      "telecharger_csv",
      "telecharger_json"
    ],
    "note": "Vos réponses restent sur cet appareil. Rien n'est envoyé tout seul. Les sons ne sont pas dans ces fichiers.",
    "depuis_apprenant": "texte sans partie formateur ; CSV et JSON passés par versionApprenant() (notes des juges et notes libres retirées, export.notations_exclues: true)",
    "depuis_formateur": "« Exporter le journal complet » : tout",
    "noms_fichiers": [
      "rendez-vous-a1-v3_{code}_{AAAA-MM-JJ}.csv",
      "rendez-vous-a1-v3_{code}_{AAAA-MM-JJ}.json"
    ],
    "texte_gabarit": [
      "AU CAFÉ — MES RÉPONSES",
      "Date : {JJ/MM/AAAA} · Code : {code | —}",
      "Cours : {avec mon formateur | en petit groupe | seul(e)} · Niveau : {plus simple | normal | un peu plus} · Aide : {aucune | español | italiano}",
      "Ce n'est pas un examen. Il n'y a pas de note.",
      "",
      "AUTRES DIALOGUES — AVANT LE COURS ({JJ/MM/AAAA}, {mode})          ← bloc présent seulement si fait",
      "Question : {question}",
      "1re réponse, sans image : {valeur} — bonne réponse",
      "Avec les images : {valeur} — autre réponse (bonne réponse : {attendue})",
      "Nombre d'écoutes avant la réponse : {n}",
      "Écoutes : {n} · Aides : {aucune | images, texte, español, voix lente, mon formateur a répété {n} fois}",
      "",
      "J'ÉCOUTE — AU DÉBUT (dialogue 1)",
      "Question : À la fin, combien de thés ?",
      "{2 lignes de réponse} · Nombre d'écoutes : {n}",
      "Écoutes : {n} · Aides : {…}",
      "",
      "J'ÉCOUTE — PENDANT LE COURS",
      "Question : {question} (film)",
      "1re réponse : {valeur} — {…}",
      "Écoutes : {n} · Aides : {…}",
      "…",
      "",
      "J'ÉCOUTE — À LA FIN (dialogue 2, différent du dialogue 1)",
      "Question : À la fin, combien de cafés ?",
      "{2 lignes de réponse} · Nombre d'écoutes : {n}",
      "Écoutes : {n} · Aides : {…}",
      "",
      "AUTRES DIALOGUES — APRÈS LE COURS ({JJ/MM/AAAA}, {mode})",
      "…",
      "AUTRES DIALOGUES — UNE SEMAINE APRÈS ({JJ/MM/AAAA}, {mode})",
      "…",
      "",
      "JE PARLE",
      "Réponses au serveur : {n} · J'ai demandé de répéter : {n} fois",
      "{mode seul : « Personne n'a écouté : ce n'est pas vérifié. »}",
      "",
      "MON AVIS",
      "Ce cours, pour moi : {très facile | facile | ni facile, ni difficile | difficile | très difficile | pas de réponse}",
      "",
      "TEMPS (minutes)",
      "AVANT {m} · S0 {m} · S1 {m} · S2 {m} · S3 {m} · S4 {m} · S5 {m} · S6 {m} · APRES {m} · total {m}"
    ],
    "autres_formes_de_ligne": [
      "{condition} : réponse non notée (j'avais une idée | je ne savais pas)",
      "{condition} : pas fait"
    ],
    "texte_gabarit_note": "La ligne « Écoutes / Aides » compte tout le travail sur l'item, avant et après les réponses (lu dans evenements).",
    "partie_formateur_gabarit": [
      "— PARTIE FORMATEUR (ne pas présenter comme un résultat) —",
      "Protocole A4-1 · critères figés le {JJ/MM/AAAA} · forme avant {D|T} / après {T|D}",
      "Périmètre : {complet | réduit — {motif} — non proposés : {items}}",
      "PRODUCTIONS (grille 0/1/2 ; « — » = non noté)",
      "{item} · {condition} · juge {F1|J2} ({direct|differe_audio}) · sens {0|1|2|—} · réponse {0|1|2|—} · groupe {0|1|2|—} · malentendu {réglé|pas réglé|aucun|—} · relances {n} · mot soufflé {oui|non} · aides {…}",
      "{item} · pas de réponse",
      "NOTES",
      "{item} : {texte}",
      "Rappel : lecture item par item, mêmes conditions seulement ; pas de total, pas de pourcentage."
    ],
    "csv": {
      "separateur": ";",
      "encodage": "UTF-8 avec BOM",
      "fins_de_ligne": "CRLF",
      "booleens": [
        "oui",
        "non"
      ],
      "regle": "Une ligne par information et par condition (type C) ; une ligne par production et par juge (type P). Aucune ligne de total.",
      "colonnes": [
        "schema",
        "code",
        "date",
        "moment",
        "mode",
        "palier",
        "perimetre_reduit",
        "type",
        "sequence",
        "item",
        "information",
        "forme",
        "audio_id",
        "voix",
        "support",
        "condition",
        "texte_visible",
        "nb_choix",
        "retour_avant",
        "cle_condition",
        "reponse",
        "valeur",
        "attendue",
        "ecoutes",
        "aide_images",
        "aide_texte",
        "aide_langue",
        "voix_lente",
        "relances",
        "mot_souffle",
        "demandes_repetition",
        "production",
        "sens",
        "reponse_adaptee",
        "groupe",
        "reparation",
        "malentendu",
        "juge",
        "moment_notation",
        "auto_declaration",
        "auto_a_parle",
        "auto_compare",
        "saisi_par",
        "ecart_protocole",
        "horodatage",
        "note"
      ],
      "interdit": "Moyenne des colonnes sens / reponse_adaptee / groupe, pourcentage de « correcte », total par apprenant. Autorisé : filtrer par cle_condition, puis lire les lignes."
    },
    "json": "Le journal tel quel, indenté de 2 espaces. Pour fusionner plusieurs apprenants : concaténer les CSV (même en-tête), jamais additionner.",
    "mesures_automatiques": "aucune (A4 §6) : ni hauteur, ni pauses, ni vitesse, dans le journal ni dans l'export.",
    "note_v3": "v3 : condition `apres_reecoute` = non proposé ; champ `ecoutes` (nombre d'écoutes avant chaque réponse) à exporter."
  }
};
