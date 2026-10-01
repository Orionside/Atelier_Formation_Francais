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
      S.consigne + " En une minute.");
    add("situation-question", "Vous préférez un autre sujet ? (facultatif) " + S.perso.question, "question");
    S.plan.forEach(function(x,i){
      add("plan-"+(i+1)+"-titre",x.titre,"titre");
      add("plan-"+(i+1)+"-exemple",x.aide,"exemple");
    });
    add("avant-consigne","Parlez de vos habitudes et de ce qui change, sans préparer. Les erreurs ne sont pas un problème. À la fin du cours, vous recommencerez.","consigne");
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
    add("phrases-consigne","Six phrases de la vidéo pour dire ce qui change et expliquer pourquoi. Écoutez, répétez, puis dites votre propre phrase.","consigne");
    add("phrases-rappel","Lisez à quoi sert la phrase. Dites-la à voix haute. Puis cliquez sur Voir la phrase.","consigne");
    // Forme dite : sans les points de suspension du début ni la barre « / » des deux variantes.
    function formeOrale(f){return clean(f).replace(/^…\s*/,"").replace(/\s*\/\s*…?\s*/g," ");}
    C.phrases.forEach(function(p,i){
      add("phrase-"+p.id+"-utilite",p.sert,"explication");
      add("phrase-"+p.id+"-forme",p.forme,"modele","visible",formeOrale(p.forme));
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
    add("apres-consigne","Le même sujet qu'au début. Parlez une minute, avec vos mots-clés si nécessaire.","consigne");
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
      ["accueil-personnaliser","Vous préférez un autre sujet ?"],
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
      ["objectif-video",C.meta.plusLoin[0].label,"Regarder la vidéo en entier. Une minute quarante-deux."]
    ].forEach(function(x){extra("objectif",x[0],x[1],x[2]);});
    extra("form","titre","Espace formateur");
    extra("form","intro","Déroulé minuté et conseils de conduite.");
    extra("form","deroule","Déroulé (45 minutes)","Déroulé. Quarante-cinq minutes.");
    // Les rôles et les notes du formateur ne sont pas lus : ils s'adressent au formateur
    // francophone et contiennent des chiffres, des sigles et des renvois de pages.
    extra("form","notes","Notes");
    [
      ["nav-commencer","Commencer"], ["nav-retour","Retour"],
      ["nav-suivant","Étape suivante"], ["nav-terminer","Terminer le cours"],
      ["nav-reponses","Copier mes réponses"], ["nav-theme","Thème"],
      ["nav-effacer","Tout effacer"], ["nav-vitesse","Voix lente"]
    ].forEach(function(x){extra("navigation",x[0],x[1],x[2]);});
    // Nombres dits en toutes lettres dans l'audio (l'écrit garde les chiffres de la vidéo).
    entries["ecoute-a-difficile"].tts_text=entries["ecoute-a-difficile"].tts_text
      .replace("8,5 milliards","huit virgule cinq milliards").replace("en 2030","en deux mille trente");
    // « 1 minute » est toujours dit « une minute » (une synthèse lit parfois « un minute »).
    Object.keys(entries).forEach(function(id){
      entries[id].tts_text=entries[id].tts_text.replace(/\b1 minute\b/g,"une minute");
      if(entries[id].segments) entries[id].segments.forEach(function(s){s.text=s.text.replace(/\b1 minute\b/g,"une minute");});
    });
    C.ecoute.forEach(function(e){e.trous.forEach(function(t,i){
      var id="ecoute-"+e.id.toLowerCase()+"-trou-"+(i+1);
      entries[id].segments=[{lang:"fr-FR",text:clean(t.avant)+"…"}];
      if(clean(t.apres).replace(/[.,!?]/g,"").trim())entries[id].segments.push({lang:"fr-FR",text:clean(t.apres)});
      entries[id].pause_s=0.8;
    });});
    ["p2","p4","p6"].forEach(function(id){
      var p=C.phrases.filter(function(p){return p.id===id;})[0];
      entries["phrase-"+id+"-forme"].segments=p.forme.split("/").map(function(s){return {lang:"fr-FR",text:formeOrale(s)};});
      entries["phrase-"+id+"-forme"].pause_s=0.4;
    });
    entries["phrase-p2-exemple"].segments=[{lang:"fr-FR",text:"Je mange de plus en plus de légumes."},{lang:"fr-FR",text:"Et de moins en moins de viande."}];
    entries["phrase-p2-exemple"].pause_s=0.4;
    C.phrases.forEach(function(p){add("phrase-"+p.id+"-film",p.film.texte,"citation_video");});
    C.manuel.activites.forEach(function(a,i){
      add("manuel-"+i+"-titre",a.titre,"titre");
      add("manuel-"+i+"-consigne",a.consigne,"consigne");
      a.exemples.forEach(function(x,j){add("manuel-"+i+"-exemple-"+j,x,"exemple");});
    });
    add("manuel-titre",C.manuel.titre,"titre");add("manuel-intro",C.manuel.intro,"consigne");
    C.formateur.deroule.forEach(function(r,i){add("form-role-"+i,r.role,"formateur");});
    C.formateur.notes.forEach(function(n,i){add("form-note-"+i,n,"formateur");});
    return entries;
  }
  root.impactAudioCatalogue=catalogue;
})(typeof window === "undefined" ? globalThis : window);
