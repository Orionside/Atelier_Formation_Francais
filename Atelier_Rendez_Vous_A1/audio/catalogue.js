/* Textes pédagogiques prédéfinis. Le film et ses courbes restent des modèles humains. */
(function(root){
  function clean(s){
    return String(s || "").replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
  }
  function catalogue(C){
    var entries = {}, S = C.sujet, P = C.prononciation, T = C.entrainement;
    function add(id, display, role, reveal, oral){
      if(entries[id]) throw Error("Identifiant audio dupliqué : " + id);
      entries[id] = {id:id, display_text:clean(display), tts_text:clean(oral || display),
        role:role || "consigne", reveal:reveal || "visible",
        file:"audio/qwen3-tts/" + id + ".mp3"};
    }
    add("accueil-objectif", C.meta.objectif, "objectif");
    add("situation-lieu", S.lieu, "contexte");
    add("situation-qui", S.qui + " dit :", "contexte");
    add("situation-dialogue", S.dit, "dialogue");
    add("situation-vous", S.vous, "contexte");
    add("situation-consigne", S.consigne + " En 1 minute.", "consigne", "visible",
      "Présentez-vous, puis commandez. En une minute.");
    add("situation-question", "Vous préférez imaginer une autre rencontre ? (facultatif) " + S.perso.question, "question");
    S.plan.forEach(function(x,i){
      add("plan-"+(i+1)+"-titre",x.titre,"titre");
      add("plan-"+(i+1)+"-exemple",x.aide,"exemple","visible",
        ["Bonjour ! Je m'appelle… Et vous ?","Je suis espagnole. J'habite à…",
         "Un café pour moi, s'il vous plaît.","L'addition, s'il vous plaît."][i]);
    });
    add("avant-consigne","Présentez-vous et commandez, sans préparer. Les erreurs ne sont pas un problème. À la fin du cours, vous recommencerez.","consigne");
    C.difficultes.forEach(function(x,i){ add("difficulte-"+(i+1),x,"option","visible",
      x.replace("sûr·e", "sûre")); });
    add("ecoute-consigne","Deux extraits courts. Pour chaque extrait : devinez, écoutez, répondez, réécoutez.","consigne");
    C.ecoute.forEach(function(x){
      var p="ecoute-"+x.id.toLowerCase();
      add(p+"-pourquoi","Pourquoi cet extrait ? "+x.pourquoi,"explication");
      add(p+"-devine",x.devine,"consigne");
      x.questions.forEach(function(q,i){
        var k=p+"-q"+(i+1);
        add(k,q.q,"question");
        q.options.forEach(function(o,j){add(k+"-option-"+(j+1),o,"option");});
        add(k+"-explication",q.explication,"correction","apres_reponse");
      });
      x.trous.forEach(function(t,i){
        var k=p+"-trou-"+(i+1);
        add(k,(t.avant+" […] "+t.apres).replace(/\s+([.,!?])/g,"$1"),"phrase_a_completer","avant_correction",
          (t.avant+"… "+t.apres).replace(/\s+([.,!?])/g,"$1"));
        add(k+"-aide","Aide : "+t.aide,"aide");
        add(k+"-solution",(t.avant+" "+t.solution+" "+t.apres).replace(/\s+([.,!?])/g,"$1"),"correction","apres_verification",
          (t.avant+" "+t.solution+" "+t.apres).replace(/\s+([.,!?])/g,"$1"));
      });
      add(p+"-difficile",x.difficile.texte,"explication");
    });
    add("phrases-consigne","Six phrases de la vidéo pour se présenter et commander au café. Écoutez, répétez, puis dites votre propre phrase.","consigne");
    add("phrases-rappel","Lisez à quoi sert la phrase. Dites-la à voix haute. Puis cliquez sur Voir la phrase.","consigne");
    var forms=[
      "Je suis… Et toi ? Et vous ?", "Je suis espagnol. Je suis espagnole.",
      "Comment tu t'appelles ? Je m'appelle…", "Un café pour moi, s'il vous plaît.",
      "C'est tout ? Oui, merci, c'est tout.", "L'addition, s'il vous plaît."
    ];
    C.phrases.forEach(function(p,i){
      add("phrase-"+p.id+"-utilite",p.sert,"explication");
      add("phrase-"+p.id+"-forme",p.forme,"modele","visible",forms[i]);
      add("phrase-"+p.id+"-exemple",p.exemple,"exemple");
      add("phrase-"+p.id+"-avous","Dites votre phrase à voix haute, avec vos informations.","consigne");
    });
    add("melodie-intro",P.intro,"explication","visible",
      clean(P.intro).replace(/[↗↘]/g,""));
    P.regle.forEach(function(x,i){add("melodie-regle-"+(i+1),x,"explication","visible",
      clean(x).replace(/\s*[↗↘]/g,""));});
    add("melodie-attention","Attention : "+P.attention,"explication","visible",
      "Attention : "+clean(P.attention).replace(/[↗↘]/g,""));
    P.perception.forEach(function(x,i){
      add("melodie-exercice-"+(i+1),x.consigne,"consigne");
      add("melodie-exercice-"+(i+1)+"-explication",x.explication,"correction","apres_reponse");
    });
    P.etapes.forEach(function(x,i){add("melodie-etape-"+(i+1),x,"consigne","visible",
      clean(x).replace("seul·e","seule"));});
    add("entrainement-consigne","Le même sujet, trois fois, de plus en plus court. Avant chaque essai, ajoutez une chose.","consigne");
    add("entrainement-preparation","Notez seulement des mots-clés, pas de phrases.","consigne");
    T.essais.forEach(function(x,i){
      add("essai-"+(i+1),x.consigne,"consigne");
      if(x.ajout) add("essai-"+(i+1)+"-ajout",x.ajout,"consigne","visible",
        clean(x.ajout).replace(/\.\s*\.\s*Et/, ". Et").replace(/[↗↘]/g,""));
    });
    T.objections.forEach(function(x,i){add("serveur-question-"+(i+1),x,"question","apres_clic");});
    add("apres-consigne","Le même sujet qu'au début. Parlez une minute, sans vos notes.","consigne");
    add("apres-bilan","Réécoutez-vous et cochez.","consigne");
    add("objectif-consigne","Choisissez une phrase utile. Dites-la cette semaine, dans une situation réelle.","consigne");
    C.semaine.forEach(function(x,i){add("semaine-"+(i+1),x.jour+" : "+x.tache,"consigne");});
    // Repères d'interface facultatifs : panneau replié, jamais une correction cachée.
    function extra(section,id,display,oral){
      add("ui-"+id,display,"interface","visible",oral || clean(display).replace(/[↗↘]/g,""));
      entries["ui-"+id].section=section;
    }
    [
      ["accueil-titre",C.meta.titreSeance],
      ["accueil-sujet","Le sujet du jour"],
      ["accueil-ou","Où ?"],
      ["accueil-qui","Qui parle ?"],
      ["accueil-vous","Vous"],
      ["accueil-avous","À vous"],
      ["accueil-personnaliser","Vous préférez imaginer une autre rencontre ?"],
      ["accueil-personnaliser-exemple",S.perso.exemple],
      ["accueil-personnaliser-note","Vous pouvez aussi garder la situation proposée. Le champ est facultatif."],
      ["accueil-programme","Le programme"],
      ["accueil-micro","Le cours utilise le micro de votre ordinateur. Autorisez-le quand le navigateur le demande."]
    ].forEach(function(x){extra("start",x[0],x[1]);});
    [
      ["avant-titre","Je parle 1 minute","Je parle une minute."],
      ["avant-plan","Vous pouvez suivre ce plan"],
      ["avant-enregistrer","Enregistrez-vous"],
      ["avant-pendant","Pendant cette minute…"],
      ["avant-difficultes","Touchez ce qui est vrai pour vous."],
      ["avant-rec-note","Parlez sans vous arrêter. Les erreurs ne sont pas un problème. L'enregistrement s'arrête seul après 1 minute.","Parlez sans vous arrêter. Les erreurs ne sont pas un problème. L'enregistrement s'arrête seul après une minute."]
    ].forEach(function(x){extra("avant",x[0],x[1],x[2]);});
    [
      ["ecoute-titre","J'écoute la vidéo"],
      ["ecoute-avant","Avant d'écouter : devinez"],
      ["ecoute-repondre","Écoutez l'extrait, puis répondez"],
      ["ecoute-completer","Écoutez encore, puis complétez"],
      ["ecoute-difficile","Le passage difficile"],
      ["ecoute-verifier","Vérifier"]
    ].forEach(function(x){extra("ecoute",x[0],x[1]);});
    C.ecoute.forEach(function(x,i){extra("ecoute","extrait-"+(i+1),"Extrait "+(i+1)+" · "+x.titre,
      "Extrait "+(i+1)+". "+x.titre);});
    [
      ["phrases-titre","6 phrases utiles","Six phrases utiles."],
      ["phrases-apprendre","Apprendre"],
      ["phrases-rappel","Vérifier sans regarder"],
      ["phrases-video","Dans la vidéo"],
      ["phrases-situation","Dans votre situation"],
      ["phrases-avous","À vous"],
      ["phrases-voir","Voir la phrase"],
      ["phrases-connue","Je la connais"],
      ["phrases-revoir","À revoir"],
      ["phrases-saisie","Ma phrase (facultatif)"]
    ].forEach(function(x){extra("phrases",x[0],x[1],x[2]);});
    [
      ["melodie-titre","La mélodie du français"],
      ["melodie-regle","La règle"],
      ["melodie-trouvez","Écoutez et trouvez"],
      ["melodie-repetez","Répétez comme dans la vidéo"],
      ["melodie-signes","Les signes"],
      ["melodie-verifier","Vérifier"]
    ].forEach(function(x){extra("melodie",x[0],x[1]);});
    P.legende.forEach(function(x,i){extra("melodie","legende-"+(i+1),x[1]);});
    [
      ["entrainement-titre","Je m'entraîne 3 fois","Je m'entraîne trois fois."],
      ["entrainement-preparer","Préparez (1 minute)","Préparez. Une minute."],
      ["entrainement-question",T.boutonObjection],
      ["entrainement-bilan","Vos 3 essais en chiffres","Vos trois essais en chiffres."]
    ].forEach(function(x){extra("entrainement",x[0],x[1],x[2]);});
    T.essais.forEach(function(x,i){extra("entrainement","essai-titre-"+(i+1),
      "Essai "+(i+1)+" · "+(x.duree===90?"1 min 30":x.duree===75?"1 min 15":"1 min"),
      "Essai "+(i+1)+". "+(x.duree===90?"Une minute trente":x.duree===75?"Une minute quinze":"Une minute"));});
    [
      ["apres-titre","Je reparle 1 minute","Je reparle une minute."],
      ["apres-enregistrer","Enregistrez-vous"],
      ["apres-comparaison","Début et fin du cours"]
    ].forEach(function(x){extra("apres",x[0],x[1],x[2]);});
    [
      ["objectif-titre","Mon objectif de la semaine"],
      ["objectif-phrase","Ma phrase de la semaine"],
      ["objectif-quand","Quand ?"],
      ["objectif-exacte","Ma phrase exacte"],
      ["objectif-programme","10 minutes par jour (facultatif)","Dix minutes par jour, facultatif."],
      ["objectif-envoyer","Envoyer mon travail au formateur"],
      ["objectif-confidentialite","Vos réponses restent dans ce navigateur. Copiez-les et envoyez-les à votre formateur."],
      ["objectif-plusloin","Pour aller plus loin (facultatif)"],
      ["objectif-apres","Seulement après le cours, si vous voulez pratiquer davantage."],
      ["objectif-video",C.meta.plusLoin[0].label,"Regarder la vidéo en entier. Cinq minutes."]
    ].forEach(function(x){extra("objectif",x[0],x[1],x[2]);});
    extra("form","titre","Espace formateur");
    extra("form","intro","Déroulé minuté et conseils de conduite.");
    extra("form","deroule","Déroulé (45 minutes)","Déroulé. Quarante-cinq minutes.");
    C.formateur.deroule.forEach(function(x,i){extra("form","role-"+(i+1),x.role);});
    extra("form","notes","Notes");
    C.formateur.notes.forEach(function(x,i){extra("form","note-"+(i+1),x);});
    [
      ["nav-commencer","Commencer"], ["nav-retour","Retour"],
      ["nav-suivant","Étape suivante"], ["nav-terminer","Terminer le cours"],
      ["nav-reponses","Copier mes réponses"], ["nav-theme","Thème"],
      ["nav-effacer","Tout effacer"], ["nav-vitesse","Voix lente"]
    ].forEach(function(x){extra("navigation",x[0],x[1],x[2]);});
    // Chaque glose castillane est une unité vocale es-ES distincte. Les autres
    // mots gardent la voix française ; le changement de langue ne doit jamais
    // dépendre d'une détection automatique au milieu d'un texte français.
    function bilingue(id, avant, espagnol, apres){
      var parts=[{lang:"fr-FR",text:avant},{lang:"es-ES",text:espagnol}];
      if(apres) parts.push({lang:"fr-FR",text:apres});
      var mots=function(s){return (s.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu)||[]).join("|");};
      if(mots(entries[id].tts_text)!==mots(parts.map(function(x){return x.text;}).join(" ")))
        throw Error("Segments bilingues différents du texte oral : "+id);
      entries[id].segments=parts;
    }
    bilingue("ecoute-a-trou-1-aide","Aide : le verbe « parler ». En espagnol :","hablar");
    bilingue("ecoute-a-trou-2-aide","Aide : pas beaucoup. En espagnol :","un poco");
    bilingue("ecoute-b-trou-1-aide","Aide : je vous donne. En espagnol :","aquí tiene");
    bilingue("ecoute-b-trou-2-aide","Aide : une réponse polie à « merci ». En espagnol :","de nada");
    bilingue("ecoute-b-q2-explication",
      "Le serveur demande : « Carte ou espèces ? » Réponse : « Espèces. » Cela veut dire : avec des billets et des pièces. En espagnol :",
      "en efectivo");
    bilingue("melodie-attention",
      "Attention : La dernière syllabe du mot est plus longue : Adrienne, hongroise, français. En espagnol :",
      "francés",
      "C'est pareil ! Toutes les questions ne montent pas. Dans la vidéo, « Et toi ? » reste plat. Les flèches montrent la mélodie mesurée dans la vidéo.");
    return entries;
  }
  root.impactAudioCatalogue=catalogue;
})(typeof window === "undefined" ? globalThis : window);
