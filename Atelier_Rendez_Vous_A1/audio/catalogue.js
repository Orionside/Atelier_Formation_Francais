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
    add("situation-qui", S.qui, "contexte");
    add("situation-dialogue", S.dit, "dialogue");
    add("situation-vous", S.vous, "contexte");
    add("situation-consigne", S.consigne + " En 1 minute.", "consigne", "visible",
      "Présentez-vous, puis commandez. Vous avez une minute.");
    add("situation-question", S.perso.question, "question");
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
      add(p+"-pourquoi",x.pourquoi,"explication");
      add(p+"-devine",x.devine,"consigne");
      x.questions.forEach(function(q,i){
        var k=p+"-q"+(i+1);
        add(k,q.q,"question");
        q.options.forEach(function(o,j){add(k+"-option-"+(j+1),o,"option");});
        add(k+"-explication",q.explication,"correction","apres_reponse");
      });
      x.trous.forEach(function(t,i){
        var k=p+"-trou-"+(i+1);
        add(k,t.avant+" […] "+t.apres,"phrase_a_completer","avant_correction",
          (t.avant+"… "+t.apres).replace(/\s+([.,!?])/g,"$1"));
        var aideOrale = t.aide.replace(/\([^)]*\)/g, "").replace(/^=\s*/, "Cela veut dire : ").trim();
        add(k+"-aide",t.aide,"aide","visible",aideOrale);
        add(k+"-solution",t.avant+" "+t.solution+" "+t.apres,"correction","apres_verification",
          (t.avant+" "+t.solution+" "+t.apres).replace(/\s+([.,!?])/g,"$1"));
      });
      add(p+"-difficile",x.difficile.texte,"explication","visible",
        x.id==="B" ? "Carte ou espèces ? Espèces, espèces. Le serveur ne fait pas une phrase complète : c'est normal au café. Carte, c'est la carte bancaire. Espèces, ce sont les billets et les pièces. On répond avec un seul mot, ou : Par carte, s'il vous plaît." : undefined);
    });
    add("phrases-consigne","Six phrases de la vidéo pour se présenter et commander au café. Écoutez, répétez, puis dites votre propre phrase.","consigne");
    add("phrases-rappel","Lisez à quoi sert la phrase. Dites-la à voix haute. Puis cliquez sur Voir la phrase.","consigne");
    var forms=[
      "Je suis… Et toi ? Et vous ?", "Je suis espagnol. Je suis espagnole.",
      "Comment tu t'appelles ? Je m'appelle…", "Un café pour moi, s'il vous plaît.",
      "C'est tout ? Oui, merci, c'est tout.", "L'addition, s'il vous plaît."
    ];
    C.phrases.forEach(function(p,i){
      add("phrase-"+p.id+"-utilite",p.sert,"explication","visible",
        p.id==="p6" ? "Pour demander à payer. L'addition, c'est la somme à payer." : undefined);
      add("phrase-"+p.id+"-forme",p.forme,"modele","visible",forms[i]);
      add("phrase-"+p.id+"-exemple",p.exemple,"exemple");
      add("phrase-"+p.id+"-avous","Dites votre phrase à voix haute, avec vos informations.","consigne");
    });
    add("melodie-intro",P.intro,"explication","visible",
      "En français, la voix monte quand une autre information arrive, ou quand vous posez certaines questions. La voix descend quand la phrase est finie.");
    P.regle.forEach(function(x,i){add("melodie-regle-"+(i+1),x,"explication","visible",
      clean(x).replace(/\s*[↗↘]/g,""));});
    add("melodie-attention",P.attention,"explication","visible",
      "La dernière syllabe du mot est plus longue : Adrienne, hongroise, français. Attention : toutes les questions ne montent pas. Dans la vidéo, Et toi ? reste plat. Les flèches montrent la mélodie mesurée dans la vidéo.");
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
    add("apres-bilan","Quelles phrases utiles avez-vous dites ? Réécoutez-vous et cochez.","consigne");
    add("objectif-consigne","Choisissez une phrase utile. Dites-la cette semaine, dans une situation réelle.","consigne");
    C.semaine.forEach(function(x,i){add("semaine-"+(i+1),x.jour+" : "+x.tache,"consigne");});
    return entries;
  }
  root.impactAudioCatalogue=catalogue;
})(typeof window === "undefined" ? globalThis : window);
