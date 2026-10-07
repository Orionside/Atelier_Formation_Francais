/* ======================================================================
   ATELIER « AU CAFÉ » — JOURNAL DE SUIVI ET EXPORT (adaptation en script de navigateur
   de specs/a4_outils/a4_journal.mjs, voir A4_evaluation_et_suivi.md §1, §3, §4)

   Ce fichier transforme l'état du socle (rep, journal, notes, durees, suivi…) en « journal »
   (format d'export), puis en texte, en CSV et en JSON. Aucune mesure sur la voix, aucun score,
   aucun total de réponses, aucun pourcentage : le journal garde l'exactitude (colonne « reponse »)
   et les aides (colonnes « aide_… ») séparées, et chaque ligne se lit seule.

   Différences avec le script de référence :
   - conditions du socle : p1 · apres_images · apres_reecoute · apres_texte (codes A4) ;
   - les registres sont indexés par la « trace » des blocs de contenu.js (s0, s2a, s2d.choix_final…) ;
   - l'exactitude vient du champ « juste » noté par le moteur au moment de la réponse ;
   - la banque (b-d1…b-t4) est lue dans CONTENU.banque.
   Scripts classiques (pas de module). Compatible Safari iOS récent.
   ====================================================================== */
var JOURNAL = (function(){
"use strict";

var SCHEMA = "impact60.rdv-a1-v2.journal/1";
var PROTOCOLE = "A4-1";

/* Valeur d'une image touchée : « img-homme-et-femme » → « homme_et_femme » */
function valeurImage(id){ return String(id || "").replace(/^img-/, "").replace(/-/g, "_"); }

/* Registre des informations de compréhension. Clé = trace du bloc.
   code   : identifiant A4 (S0-C1…), pour la colonne « item » ;
   suit   : trace sous laquelle les aides sont notées (journal.note) ;
   p1     : forme de la réponse au passage 1 : "clavier" (chiffres), "idee" (idée dite), null (pas de passage 1) ;
   choix  : réponses proposées en images ; attendue : réponses acceptées (valeurs) ; attendue_p1 : bonne réponse au clavier. */
var ITEMS_C = {
  "s0":   {code:"S0-C1", sequence:"S0", suit:"s0", audio_id:"s0-dialogue", support:"audio_seul", information:"quantite_finale", p1:"clavier", choix:["un","deux"], attendue:["deux"], attendue_p1:["2"], question:"À la fin, la cliente veut combien de thés ?"},
  "s1.qui": {code:"s1.qui", sequence:"S1", suit:"s1.qui", audio_id:"film-B", support:"film_youtube", information:"qui_commande", p1:null, choix:["homme","femme","homme_et_femme"], attendue:["homme_et_femme"], question:"Qui parle au serveur ?"},
  "s1.produits": {code:"S1-C2", sequence:"S1", suit:"s1.produits", audio_id:"film-B", support:"film_youtube", information:"produits", p1:null, multi:true, choix:["un_cafe","un_the","jus_orange","croissant","eau","sandwich"], attendue:["un_cafe","jus_orange","croissant"], question:"Ils commandent quoi ?"},
  "s1.fin": {code:"S1-C1", sequence:"S1", suit:"s1.fin", audio_id:"film-B", support:"film_youtube", information:"demande_finale", p1:null, choix:["addition","un_cafe_plus"], attendue:["addition"], question:"À la fin, ils demandent quoi ?"},
  "s2a":  {code:"S2-C1", sequence:"S2", suit:"s2a", audio_id:"film-p4", support:"film_youtube", information:"moment", p1:"idee", choix:["commander","finir","payer"], attendue:["commander"], question:"C'est quel moment ? (phrase 1 du film)"},
  "s2b":  {code:"S2-C2", sequence:"S2", suit:"s2b", audio_id:"film-p5", support:"film_youtube", information:"moment", p1:"idee", choix:["commander","finir","payer"], attendue:["finir"], question:"C'est quel moment ? (phrase 2 du film)"},
  "s2c":  {code:"S2-C3", sequence:"S2", suit:"s2c", audio_id:"film-p6", support:"film_youtube", information:"moment", p1:"idee", choix:["commander","finir","payer"], attendue:["payer"], question:"C'est quel moment ? (phrase 3 du film)"},
  "s2.qui_parle.q": {code:"s2.qui_parle.q", sequence:"S2", suit:"s2.qui_parle", audio_id:"qui-cest-tout-question", support:"audio_seul", information:"qui_parle", p1:null, choix:["serveur","client"], attendue:["serveur"], question:"« C'est tout ? » : qui parle ?"},
  "s2.qui_parle.r": {code:"s2.qui_parle.r", sequence:"S2", suit:"s2.qui_parle", audio_id:"qui-cest-tout-reponse", support:"audio_seul", information:"qui_parle", p1:null, choix:["serveur","client"], attendue:["client"], question:"« C'est tout, merci. » : qui parle ?"},
  "s2d":  {code:"S2-C4", sequence:"S2", suit:"s2d", audio_id:"ech-carte-especes", support:"audio_seul", information:"moment", p1:"idee", choix:["commander","finir","payer"], attendue:["payer"], question:"C'est quel moment ? (deux autres personnes)"},
  "s2d.choix_final": {code:"s2d.choix_final", sequence:"S2", suit:"S2-C4", audio_id:"ech-carte-especes", support:"audio_seul", information:"moyen_paiement", p1:null, choix:["carte","especes"], attendue:["carte"], question:"La cliente paie comment ?"},
  "s2.film_paiement": {code:"s2.film_paiement", sequence:"S2", suit:"s2.film_paiement", audio_id:"film-Bdif", support:"film_youtube", information:"moyen_paiement", p1:null, choix:["carte","especes"], attendue:["especes"], question:"Dans le film, ils paient comment ?"},
  "s6":   {code:"S6-C1", sequence:"S6", suit:"s6", audio_id:"s6-dialogue", support:"audio_seul", information:"quantite_finale", p1:"clavier", choix:["un","deux"], attendue:["deux"], attendue_p1:["2"], question:"À la fin, la cliente veut combien de cafés ?"}
};
/* Moments (A4 §3.2) : choix de l'écran de départ pour les réponses de S3 */
["s3.c1.sens:S3-C1:commander", "s3.c2.sens:S3-C2:finir", "s3.c3.sens:S3-C3:payer"].forEach(function(x){
  var p = x.split(":");
  ITEMS_C[p[0]] = {code:p[1], sequence:"S3", suit:p[0], audio_id:"", support:"audio_seul", information:"moment", p1:null, choix:["commander","finir","payer"], attendue:[p[2]], question:"C'est quel moment ?"};
});
/* Banque (lue dans CONTENU.banque) : information de chaque dialogue */
var INFO_BANQUE = {"b-d1":"intention", "b-d2":"moyen_paiement", "b-t1":"intention", "b-t2":"moyen_paiement", "b-t3":"produit_final", "b-t4":"quantite_finale", "b-t4-un-seul":"quantite_finale"};
var CODE_BANQUE = {"b-d1":"D1-C1", "b-d2":"D2-C1", "b-t1":"T1-C1", "b-t2":"T2-C1", "b-t3":"T3-C1", "b-t4":"T4-C1", "b-t4-un-seul":"T4-C1"};
/* Valeur d'une image de la banque : « un/deux » pour les questions de nombre, sinon l'identifiant de l'image */
function valeurBanque(d, image){
  if(d.saisie === "nombre") return /deux/.test(image) ? "deux" : "un";
  return valeurImage(image);
}
function brancherBanque(C){
  var D = (C && C.banque && C.banque.dialogues) || {};
  Object.keys(D).forEach(function(id){
    var d = D[id];
    ITEMS_C[id] = {code:CODE_BANQUE[id] || id, sequence:"BANQUE", forme:d.forme === "T" && (d.rang === 3 || d.rang === 4) ? "J7" : d.forme, suit:id, audio_id:d.son || id, support:"audio_seul",
      information:INFO_BANQUE[id] || "intention", p1:d.saisie === "nombre" ? "clavier" : "idee",
      choix:(d.images || []).map(function(i){ return valeurBanque(d, i.image); }),
      attendue:[valeurBanque(d, d.bonne)], attendue_p1:d.saisie === "nombre" ? [valeurBanque(d, d.bonne) === "un" ? "1" : "2"] : null, question:d.question || ""};
  });
  aliasItems();
}

/* Les réponses sont rangées sous l'identifiant A4 (S0-C1, D1-C1…) quand il existe : c'est ce que lit formateur.js.
   Chaque entrée reçoit donc un alias sous son code ; « suit » = identifiant sous lequel les aides sont notées. */
var SUIT_CODE = {"s2d.choix_final":"S2-C4"};
function aliasItems(){
  Object.keys(ITEMS_C).forEach(function(k){
    var it = ITEMS_C[k];
    if(!/^[A-Z]\d-C\d$/.test(k)){
      it.suit = SUIT_CODE[k] || (/^[A-Z]\d-C\d$/.test(it.code) ? it.code : it.suit);
      if(/^[A-Z]\d-C\d$/.test(it.code) && !ITEMS_C[it.code]) ITEMS_C[it.code] = it;
    }
  });
  Object.keys(ITEMS_P).forEach(function(k){ var it = ITEMS_P[k]; if(/^[A-Z]\d-P\d$/.test(it.code) && !ITEMS_P[it.code]) ITEMS_P[it.code] = it; });
}
/* Prises de parole. socle = à noter à chaque séance du pilote. */
var ITEMS_P = {
  "s0.parole":     {code:"S0-P1", sequence:"S0", condition:"question_directe", tache:"Répondre à « Et pour vous, café ou thé ? »", socle:true},
  "s3.c1.parole":  {code:"S3-P1", sequence:"S3", condition:"cartes_visibles", tache:"Carte 1 : changer une seule chose", socle:false},
  "s3.c2.parole":  {code:"S3-P2", sequence:"S3", condition:"cartes_visibles", tache:"Carte 2 : changer une seule chose", socle:false},
  "s3.c3.parole":  {code:"S3-P3", sequence:"S3", condition:"cartes_visibles", tache:"Carte 3 : changer une seule chose", socle:false},
  "s3.ferme.q1":   {code:"s3.ferme.q1", sequence:"S3", condition:"sans_carte", tache:"Sans le texte : question 1", socle:false},
  "s3.ferme.q1_simple": {code:"s3.ferme.q1", sequence:"S3", condition:"sans_carte", tache:"Sans le texte : question 1 (palier plus simple)", socle:false},
  "s3.ferme.q2":   {code:"s3.ferme.q2", sequence:"S3", condition:"sans_carte", tache:"Sans le texte : question 2", socle:false},
  "s3.ferme.q3":   {code:"s3.ferme.q3", sequence:"S3", condition:"sans_carte", tache:"Sans le texte : question 3 (palier un peu plus)", socle:false},
  "s3.pour_deux":  {code:"s3.pour_deux", sequence:"S3", condition:"sans_carte", tache:"Commande pour deux (option du formateur)", socle:false},
  "s4.imitation":  {code:"S4-P1", sequence:"S4", condition:"apres_modele", tache:"Dire la phrase du film d'un seul tenant", socle:false},
  "s4.commande":   {code:"S4-P2", sequence:"S4", condition:"apres_modele", tache:"Dire sa commande, les mots ensemble", socle:false},
  "s5.c1":         {code:"S5-P1", sequence:"S5", condition:"cartes_visibles", tache:"Échange guidé (commande + « C'est tout ? »)", socle:false},
  "s5.c2":         {code:"S5-P2", sequence:"S5", condition:"information_cachee", tache:"Échange, produit changé (+ « Carte ou espèces ? »)", socle:false},
  "s5.c3":         {code:"S5-P3", sequence:"S5", condition:"sans_carte", tache:"Dernier échange sans carte (+ « Un thé ? »)", socle:true},
  "s5.defi":       {code:"S5-P4", sequence:"S5", condition:"sans_carte", tache:"Défi « Il n'y a plus de thé » (palier « un peu plus »)", socle:false},
  "s6.parole":     {code:"S6-P1", sequence:"S6", condition:"question_directe", tache:"Répondre à « Et pour vous ? »", socle:true}
};

aliasItems();
/* ---------------- libellés pour le texte d'export ---------------- */
var LIB_VALEUR = {
  "1":"un", "2":"deux", "3":"trois", "4":"quatre", un:"un", deux:"deux", nsp:"je ne sais pas", dit:"idée dite à voix haute", rien:"—",
  commander:"commander", finir:"finir la commande", payer:"payer", carte:"par carte", especes:"en espèces",
  homme:"l'homme", femme:"la femme", homme_et_femme:"l'homme et la femme", un_cafe:"un café", un_the:"un thé", jus_orange:"un jus d'orange",
  croissant:"un croissant", eau:"un verre d'eau", sandwich:"un sandwich", addition:"l'addition", un_cafe_plus:"un autre café",
  serveur:"le serveur", client:"le client", fini:"il a fini", encore:"il veut encore quelque chose", cafe_et_croissant:"un café et un croissant"
};
var LIB_COND = {p1:"1re écoute", apres_images:"Avec les images", apres_reecoute:"2e écoute", apres_texte:"Avec le texte"};
var LIB_MODE = {formateur:"avec mon formateur", groupe:"en petit groupe", seul:"seul(e)"};
var LIB_PALIER = {simple:"plus simple", normal:"normal", plus:"un peu plus"};
var LIB_LANGUE = {aucune:"aucune", es:"español", it:"italiano"};
var LIB_EFFORT = {1:"très facile", 2:"facile", 3:"ni facile, ni difficile", 4:"difficile", 5:"très difficile"};
var LIB_REPARATION = {resolu:"réglé", non_resolu:"pas réglé", non_sollicite:"aucun"};

function libValeur(v){
  if(Array.isArray(v)) return v.map(libValeur).join(", ");
  if(typeof v === "string" && v.indexOf("+") > 0) return v.split("+").map(libValeur).join(", ");
  return LIB_VALEUR[v] != null ? LIB_VALEUR[v] : String(v);
}
function libAttendue(trace){ var it = ITEMS_C[trace]; return it.attendue.map(libValeur).join(it.multi ? ", " : " / "); }
function dateFr(iso){ var p = String(iso).slice(0, 10).split("-"); return p[2] + "/" + p[1] + "/" + p[0]; }
function jourIso(d){ d = d || new Date(); var m = d.getMonth() + 1, j = d.getDate(); return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (j < 10 ? "0" : "") + j; }

/* ---------------- calculs ---------------- */
/* Exactitude : calculée à partir de la valeur et du « juste » noté par le moteur ; jamais saisie à la main. */
function exactitude(valeur, juste){
  if(valeur === null || valeur === undefined || valeur === "" || valeur === "nsp" || valeur === "rien") return "non_donnee";
  if(valeur === "dit") return "non_observee";
  if(juste === true) return "correcte";
  if(juste === false) return "incorrecte";
  return "non_observee";
}
/* Écoutes et aides notées pour une trace (journal.note du socle : {t, e, i, ev, d}). */
function aidesAvant(evenements, ecran, suit, t){
  var b = {ecoutes:0, images:false, texte:false, langue:"aucune", voix_lente:false, relances:0, retour:false, incident:false, consigne_lue:0, repetitions:0};
  (evenements || []).forEach(function(x){
    if(x.e !== ecran || x.i !== suit || (t && x.t > t)) return;
    if(x.ev === "ecoute" || x.ev === "reecoute") b.ecoutes++;
    if(x.ev === "lent") b.voix_lente = true;
    if(x.ev === "images") b.images = true;
    if(x.ev === "texte") b.texte = true;
    if(x.ev === "aide_langue") b.langue = String(x.d || "es").split(":")[0];   /* détail noté : « es:avant_img » (langue : moment) */
    if(x.ev === "relance") b.relances++;
    if(x.ev === "repetition") b.repetitions++;
    if(x.ev === "retour") b.retour = true;
    if(x.ev === "son_absent") b.incident = true;
    if(x.ev === "consigne_lue") b.consigne_lue++;
  });
  return b;
}
function cleConditionC(o){
  var a = o.aides || {};
  return [o.condition, o.support, (o.nb_choix ? "choix" + o.nb_choix : "libre"), "txt_" + o.texte_visible, "ec" + (o.ecoutes >= 3 ? "3+" : o.ecoutes),
    "img" + (a.images ? 1 : 0), "tx" + (a.texte ? 1 : 0), "l1" + (a.langue && a.langue !== "aucune" ? 1 : 0), "lent" + (a.voix_lente ? 1 : 0),
    "rel" + (a.relances > 0 ? 1 : 0), "ret" + (o.retour_avant ? 1 : 0), o.palier, o.saisi_par].join("|");
}
function cleConditionP(p){
  var a = p.aides || {};
  return [p.condition, "img" + (a.images ? 1 : 0), "tx" + (a.texte ? 1 : 0), "l1" + (a.langue && a.langue !== "aucune" ? 1 : 0),
    "lent" + (a.voix_lente ? 1 : 0), "souffle" + (a.mot_souffle ? 1 : 0), "rel" + (p.relances > 0 ? 1 : 0), p.palier].join("|");
}
/* Moment d'une ligne : banque dans S0 = « depart » ; bloc « aujourd'hui » et J+2 = « sortie » ; bloc J+7 = « j7 » */
function momentDe(ecran, trace){
  var it = ITEMS_C[trace];
  if(!it || it.sequence !== "BANQUE") return "seance";
  if(ecran === "S0") return "depart";
  if(ecran === "APRES.j7") return "j7";
  return "sortie";
}

/* Construit le journal à partir de l'état du socle. */
function construireJournal(etat, C){
  var s = etat.suivi || {}, ev = etat.journal || [], comp = [], prod = [];
  var code = etat.apprenant || "";
  function lignesDe(cle){ return etat.rep[cle]; }
  Object.keys(etat.rep || {}).forEach(function(cle){
    var k = cle.indexOf("/"), ecran = cle.slice(0, k), trace = cle.slice(k + 1), lignes = lignesDe(cle);
    if(ITEMS_C[trace]){
      var it = ITEMS_C[trace];
      lignes.forEach(function(r){
        var a = aidesAvant(ev, ecran, it.suit, r.t), m = momentDe(ecran, trace);
        var libre = r.cond === "p1" && it.p1 !== null;
        var o = {item:it.code, trace:trace, ecran:ecran, sequence:it.sequence, moment:m, forme:it.forme || null, information:it.information, audio_id:it.audio_id,
          voix:it.support === "film_youtube" ? "film" : "synthese", support:it.support, condition:r.cond,
          texte_visible:it.support === "film_youtube" ? "non_controle" : (a.texte ? "oui" : "non"),
          nb_choix:libre ? 0 : it.choix.length, retour_avant:a.retour, valeur:r.valeur, attendue:(libre && it.attendue_p1) ? it.attendue_p1 : it.attendue,
          ecoutes:a.ecoutes, aides:{images:a.images, texte:a.texte, langue:a.langue, voix_lente:a.voix_lente, relances:a.relances},
          palier:r.palier || etat.palier, saisi_par:etat.mode === "groupe" ? "groupe" : "apprenant", ecart_protocole:a.incident ? "son_absent" : null, t:r.t};
        o.reponse = exactitude(r.valeur, r.juste);
        o.auto_declaration = (etat.mode === "seul" && o.reponse === "non_observee") ? "idee" : (etat.mode === "seul" && r.valeur === "nsp" ? "ne_sais_pas" : null);
        o.cle_condition = cleConditionC(o);
        comp.push(o);
      });
    } else if(ITEMS_P[trace]){
      var ip = ITEMS_P[trace], n = (etat.notes && etat.notes[trace]) || {}, tout = aidesAvant(ev, ecran, trace, null), der = lignes[lignes.length - 1];
      var touches = lignes.filter(function(r){ return r.cond === "parole"; }), cmp = lignes.filter(function(r){ return r.cond === "compare"; });
      var cmpFin = cmp.length ? cmp[cmp.length - 1].valeur : null;
      var p = {item:ip.code, trace:trace, ecran:ecran, sequence:ip.sequence, moment:"seance", tache:ip.tache, condition:ip.condition,
        production:touches.some(function(r){ return r.valeur === "repondu" || r.valeur === "pardon"; }) ? "faite" : "aucune",
        auto:etat.mode === "seul" ? {a_parle:touches.some(function(r){ return r.valeur === "repondu"; }) ? "oui" : "non",
          compare:cmpFin === "oui" ? "oui" : cmpFin === "pas_encore" ? "non" : null} : null,
        malentendu:n.malentendu || "aucun", relances:tout.relances,
        demandes_repetition:touches.filter(function(r){ return r.valeur === "pardon"; }).length + tout.repetitions,
        nb_reponses:touches.filter(function(r){ return r.valeur === "repondu"; }).length,
        aides:{images:tout.images, texte:tout.texte || ev.some(function(x){ return x.e === ecran && x.i === trace && x.ev === "carte"; }), langue:tout.langue, voix_lente:tout.voix_lente,
          mot_souffle:ev.some(function(x){ return x.e === ecran && x.i === trace && x.ev === "mot_souffle"; })},
        notations:Array.isArray(n.notations) ? n.notations.slice() : [],
        enregistrement:ev.some(function(x){ return x.e === ecran && x.i === trace && x.ev === "enregistre"; }) ? {fait:true, duree_s:null, fichier:null} : {fait:false, duree_s:null, fichier:null},
        palier:der.palier || etat.palier, ecart_protocole:null, note:n.remarque || null, t:der.t};
      p.cle_condition = cleConditionP(p);
      prod.push(p);
    }
  });
  function parT(a, b){ return a.t < b.t ? -1 : a.t > b.t ? 1 : 0; }
  var prevus = (C && C.meta && C.meta.durees_min) || {};
  var durees = Object.keys(etat.durees || {}).map(function(id){
    var d = etat.durees[id];
    return {sequence:id === "accueil" ? "ACCUEIL" : id === "apres" ? "APRES" : id.toUpperCase(), prevu_s:(prevus[id] || 0) * 60, actif_s:Math.round(d.actif_s || 0), visites:d.visites || 0};
  });
  var eff = etat.avis || {};
  return {
    schema:SCHEMA,
    atelier:{id:"rendez-vous-a1-v2", version_contenu:(C && C.version) || "", protocole:PROTOCOLE, criteres_figes_le:null},
    apprenant:{code:code, rang_pilote:null, langue_declaree:null},
    seance:{id:(code || "moi") + "-" + (s.date || ""), date:s.date || jourIso(), mode:etat.mode, palier_depart:s.palier_depart || etat.palier, langue_aide:etat.aide,
      langue_aide_choisie_apres:s.aide_choisie_apres || null, forme_depart:(etat.options && etat.options.forme_depart) || "D", montage:null, grille_visible_apprenant:false,
      voix_humaines_disponibles:!!s.voix_humaines, juges:[]},
    passations:[{moment:"seance", date:s.date || jourIso(), mode:etat.mode}],
    perimetre:{reduit:false, items_non_proposes:[], motif:null},
    durees:durees,
    comprehension:comp.sort(parT), production:prod.sort(parT),
    effort:eff.effort ? {question:"ce_cours_pour_moi", echelle:"1_5", valeur:eff.effort, le_plus_difficile:eff.difficile || null, saisi_par:"apprenant"} : null,
    descriptions_approx:null, notes_formateur:[], evenements:ev
  };
}

/* ---------------- texte lisible (« Exporter mes réponses ») ---------------- */
function libCond(o){ return (o.condition === "p1" && o.nb_choix > 0) ? "Ma réponse" : (LIB_COND[o.condition] || o.condition) + (o.condition === "p1" ? ", sans image" : ""); }
function ligneReponse(o){
  var c = libCond(o);
  if(o.reponse === "correcte") return c + " : " + libValeur(o.valeur) + " — bonne réponse";
  if(o.reponse === "incorrecte") return c + " : " + libValeur(o.valeur) + " — autre réponse (bonne réponse : " + o.attendue.map(libValeur).join(" / ") + ")";
  if(o.reponse === "non_donnee") return c + " : pas de réponse (bonne réponse : " + o.attendue.map(libValeur).join(" / ") + ")";
  if(o.reponse === "non_observee") return c + " : réponse non notée (j'avais une idée)";
  return c + " : pas fait";
}
function ligneAides(j, o){
  var b = aidesAvant(j.evenements, o.ecran, ITEMS_C[o.trace].suit, null), L = [];
  if(b.images) L.push("images");
  if(b.texte) L.push("texte");
  if(b.langue !== "aucune") L.push(LIB_LANGUE[b.langue] || b.langue);
  if(b.voix_lente) L.push("voix lente");
  if(b.relances > 0) L.push("mon formateur a répété " + b.relances + " fois");
  return "Écoutes : " + b.ecoutes + " · Aides : " + (L.length ? L.join(", ") : "aucune");
}
function blocItem(L, j, trace, moment){
  var rows = (j.comprehension || []).filter(function(o){ return o.trace === trace && o.moment === moment; });
  if(!rows.length) return;
  L.push("Question : " + ITEMS_C[trace].question + (ITEMS_C[trace].support === "film_youtube" ? " (film)" : ""));
  rows.forEach(function(o){ L.push(ligneReponse(o)); });
  L.push(ligneAides(j, rows[0]));
}
function versTexte(j, pourFormateur){
  var L = [], s = j.seance;
  function traces(filtre){ return Object.keys(ITEMS_C).filter(filtre); }
  function banque(moment, titre){
    var l = traces(function(t){ return ITEMS_C[t].sequence === "BANQUE" && (j.comprehension || []).some(function(o){ return o.trace === t && o.moment === moment; }); });
    if(!l.length) return;
    L.push(""); L.push(titre + " (" + dateFr(s.date) + ", " + LIB_MODE[s.mode] + ")");
    l.forEach(function(t){ blocItem(L, j, t, moment); });
  }
  L.push("AU CAFÉ — MES RÉPONSES");
  L.push("Date : " + dateFr(s.date) + " · Code : " + ((j.apprenant && j.apprenant.code) || "—"));
  L.push("Cours : " + LIB_MODE[s.mode] + " · Niveau : " + LIB_PALIER[s.palier_depart] + " · Aide : " + LIB_LANGUE[s.langue_aide]);
  L.push("Ce n'est pas un examen. Il n'y a pas de note.");
  banque("depart", "AUTRES DIALOGUES — AVANT LE COURS");
  L.push(""); L.push("J'ÉCOUTE — AU DÉBUT (dialogue 1)"); blocItem(L, j, "S0-C1", "seance");
  L.push(""); L.push("J'ÉCOUTE — PENDANT LE COURS");
  traces(function(t){ return ["S1", "S2", "S3"].indexOf(ITEMS_C[t].sequence) >= 0; }).forEach(function(t){ blocItem(L, j, t, "seance"); });
  L.push(""); L.push("J'ÉCOUTE — À LA FIN (dialogue 2, différent du dialogue 1)"); blocItem(L, j, "S6-C1", "seance");
  banque("sortie", "AUTRES DIALOGUES — APRÈS LE COURS");
  banque("j7", "AUTRES DIALOGUES — UNE SEMAINE APRÈS");
  var faites = 0, dem = 0;
  (j.production || []).forEach(function(p){ faites += p.nb_reponses || 0; dem += p.demandes_repetition || 0; });
  L.push(""); L.push("JE PARLE");
  L.push("Réponses au serveur : " + faites + " · J'ai demandé de répéter : " + dem + " fois");
  if(s.mode === "seul") L.push("Personne n'a écouté : ce n'est pas vérifié.");
  L.push(""); L.push("MON AVIS");
  L.push("Ce cours, pour moi : " + (j.effort && j.effort.valeur ? LIB_EFFORT[j.effort.valeur] : "pas de réponse"));
  L.push(""); L.push("TEMPS (minutes)");
  var tot = 0;
  L.push((j.durees || []).map(function(d){ tot += d.actif_s; return d.sequence + " " + Math.round(d.actif_s / 60); }).join(" · ") + (j.durees && j.durees.length ? " · " : "") + "durée " + Math.round(tot / 60));
  if(!pourFormateur) return L.join("\n");
  L.push(""); L.push("— PARTIE FORMATEUR (ne pas présenter comme un résultat) —");
  L.push("Protocole " + j.atelier.protocole + " · forme au début " + s.forme_depart + " · voix : " + (s.voix_humaines_disponibles ? "humaines" : "synthèse, non validées à l'écoute"));
  L.push("Périmètre : " + (j.perimetre.reduit ? "réduit — " + j.perimetre.motif : "complet"));
  L.push("PRISES DE PAROLE (grille 0/1/2 ; « — » = non noté)");
  function v(x){ return x === null || x === undefined ? "—" : x; }
  (j.production || []).forEach(function(p){
    var a = p.aides, aid = [];
    if(a.images) aid.push("images"); if(a.texte) aid.push("texte"); if(a.langue !== "aucune") aid.push(LIB_LANGUE[a.langue]); if(a.voix_lente) aid.push("voix lente");
    var fin = " · relances " + p.relances + " · « Pardon ? » " + p.demandes_repetition + " · mot soufflé " + (a.mot_souffle ? "oui" : "non") + " · aides " + (aid.length ? aid.join(", ") : "aucune");
    if(p.production === "aucune"){ L.push(p.item + " · " + p.condition + " · pas de réponse" + fin); return; }
    if(!(p.notations || []).length){ L.push(p.item + " · " + p.condition + " · non noté" + fin); return; }
    p.notations.forEach(function(n){
      L.push(p.item + " · " + p.condition + " · juge " + n.juge + " (" + n.moment_notation + ") · sens " + v(n.sens) + " · réponse " + v(n.reponse_adaptee) + " · groupe " + v(n.groupe) + " · malentendu " + (n.reparation ? LIB_REPARATION[n.reparation] : "—") + fin);
    });
  });
  L.push("Rappel : lecture item par item, mêmes conditions seulement ; pas de total, pas de pourcentage.");
  return L.join("\n");
}

/* ---------------- CSV : une ligne par information et par condition ; une ligne par prise de parole et par juge ---------------- */
var COLONNES_DEFAUT = ["schema","code","date","moment","mode","palier","perimetre_reduit","type","sequence","item","information","forme","audio_id","voix","support","condition","texte_visible","nb_choix","retour_avant","cle_condition","reponse","valeur","attendue","ecoutes","aide_images","aide_texte","aide_langue","voix_lente","relances","mot_souffle","demandes_repetition","production","sens","reponse_adaptee","groupe","reparation","malentendu","juge","moment_notation","auto_declaration","auto_a_parle","auto_ressemble","saisi_par","ecart_protocole","horodatage","note"];
function versCSV(j, avecNotations, colonnes){
  colonnes = colonnes || COLONNES_DEFAUT;
  function on(b){ return b ? "oui" : "non"; }
  function cell(x){ if(x === null || x === undefined) return ""; var s = Array.isArray(x) ? x.join("|") : String(x); return /[";\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
  var base = {schema:j.schema, code:(j.apprenant && j.apprenant.code) || "", perimetre_reduit:on(j.perimetre.reduit), mode:j.seance.mode}, R = [];
  (j.comprehension || []).forEach(function(o){
    var a = o.aides || {};
    R.push(Object.assign({}, base, {date:o.t.slice(0, 10), moment:o.moment, palier:o.palier, type:"C", sequence:o.sequence, item:o.item, information:o.information, forme:o.forme,
      audio_id:o.audio_id, voix:o.voix, support:o.support, condition:o.condition, texte_visible:o.texte_visible, nb_choix:o.nb_choix, retour_avant:on(o.retour_avant), cle_condition:o.cle_condition,
      reponse:o.reponse, valeur:o.valeur, attendue:o.attendue, ecoutes:o.ecoutes, aide_images:on(a.images), aide_texte:on(a.texte), aide_langue:a.langue, voix_lente:on(a.voix_lente),
      relances:a.relances, auto_declaration:o.auto_declaration, saisi_par:o.saisi_par, ecart_protocole:o.ecart_protocole, horodatage:o.t}));
  });
  (j.production || []).forEach(function(p){
    var a = p.aides || {};
    var commun = Object.assign({}, base, {date:p.t.slice(0, 10), moment:p.moment, palier:p.palier, type:"P", sequence:p.sequence, item:p.item, information:"prise_de_parole", voix:"direct", support:"direct",
      condition:p.condition, cle_condition:p.cle_condition, aide_images:on(a.images), aide_texte:on(a.texte), aide_langue:a.langue, voix_lente:on(a.voix_lente), relances:p.relances,
      mot_souffle:on(a.mot_souffle), demandes_repetition:p.demandes_repetition, production:p.production, malentendu:p.malentendu,
      auto_a_parle:p.auto ? p.auto.a_parle : null, auto_compare:p.auto ? p.auto.compare : null, ecart_protocole:p.ecart_protocole, horodatage:p.t, note:avecNotations ? p.note : null});
    var notes = avecNotations ? (p.notations || []) : [];
    if(!notes.length){ R.push(Object.assign({}, commun, {saisi_par:"apprenant"})); return; }
    notes.forEach(function(n){ R.push(Object.assign({}, commun, {sens:n.sens, reponse_adaptee:n.reponse_adaptee, groupe:n.groupe, reparation:n.reparation, juge:n.juge, moment_notation:n.moment_notation, saisi_par:"juge", horodatage:n.t || p.t})); });
  });
  return "﻿" + [colonnes.join(";")].concat(R.map(function(r){ return colonnes.map(function(c){ return cell(r[c]); }).join(";"); })).join("\r\n") + "\r\n";
}

/* Copie du journal pour l'écran de l'apprenant : sans notes de juges ni remarques du formateur. */
function versionApprenant(j){
  var c = JSON.parse(JSON.stringify(j));
  c.export = {vue:"apprenant", notations_exclues:true};
  (c.production || []).forEach(function(p){ p.notations = []; p.note = null; });
  c.notes_formateur = [];
  return c;
}

return {SCHEMA:SCHEMA, PROTOCOLE:PROTOCOLE, ITEMS_C:ITEMS_C, ITEMS_P:ITEMS_P, COLONNES_DEFAUT:COLONNES_DEFAUT, valeurImage:valeurImage, CODE_BANQUE:CODE_BANQUE, valeurBanque:valeurBanque, brancherBanque:brancherBanque,
  exactitude:exactitude, aidesAvant:aidesAvant, construireJournal:construireJournal, versTexte:versTexte, versCSV:versCSV, versionApprenant:versionApprenant,
  libValeur:libValeur, jourIso:jourIso, dateFr:dateFr, LIB_VALEUR:LIB_VALEUR};
})();
if(typeof window !== "undefined") window.JOURNAL = JOURNAL;
