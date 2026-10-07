/* ======================================================================
   Atelier « Au café » (Rendez-vous A1 v2) — ESPACE FORMATEUR
   window.FORMATEUR = { init(api), carteEcran(idEcran), ouvrirEspace(opts), surChangementEcran(idEcran) }

   Rôle : tout ce que le formateur voit et note, jamais l'apprenant.
     - vue formateur (?vue=formateur) : carte de chaque écran, cartes privées de S5, grille 0/1/2 ;
     - espace formateur (fenêtre) : déroulé, avant le cours, sons, fiche imprimable, pilote, suivi.
   Tout texte vient de CONTENU (formateur, export…). Les libellés d'interface propres à ce fichier
   sont dans CONTENU.formateur.interface. Aucune mesure sur la voix, aucun total, aucun pourcentage.

   État partagé (Socle.etat(), enregistré par Socle.sauver) :
     grille      { "S5-P3": {production, sens, reponse_adaptee, groupe, reparation, relances, demandes_repetition,
                             mot_souffle, note, juge, moment_notation, t}, "S0-C1": {entendue:{valeur, t}} }
     options     { forme_banque:"A"|"B", verification_debut, ordre_s5:"A"|"B", commande_pour_deux, un_seul_vu,
                   perimetre_reduit, perimetre_motif, rang, preparation_min, montage, lieu_saisie }
     apprenant   texte (prénom ou code, facultatif)
     durees      { ecran: {actif_s, visites, debut, fin} }
   Ces quatre clés doivent figurer dans Socle.demarrer({etat:{grille:{}, options:{}, apprenant:"", durees:{}}}),
   sinon le socle ne les relit pas après un rechargement de la page.
   ====================================================================== */
(function(){
"use strict";

var S = null, C = null, API = null;
var SCRIPT = (function(){ try{ return document.currentScript && document.currentScript.src || ""; }catch(e){ return ""; } })();
var PROPRES = ["grille", "options", "apprenant"];          /* clés écrites par le formateur : l'autre fenêtre ne les écrase pas */
var VOIX_HUMAINES = false;
var DERNIER = null, SUIVI_ECRAN = null;
var ESPACE = null;

/* ---------------- outils ---------------- */
function el(t, c, x){ return S.el(t, c, x); }
function btn(c, x, f){ return S.bouton(c, x, f); }
function F(){ return C.formateur; }
function I(chemin){
  var v = F().interface || {}, p = String(chemin).split(".");
  for(var i = 0; i < p.length; i++){ v = v == null ? null : v[p[i]]; }
  return v == null ? "[" + chemin + "]" : v;
}
function E(){ return S.etat(); }
function maintenant(){ return new Date().toISOString(); }
function dateFr(iso){ var p = String(iso).slice(0, 10).split("-"); return p[2] + "/" + p[1] + "/" + p[0]; }
function copie(o){ return JSON.parse(JSON.stringify(o)); }
function vue(){ return API && API.modeVue === "formateur" ? "formateur" : "apprenant"; }
function idDe(x){
  if(typeof x === "number") return C.ecrans[x] ? C.ecrans[x].id : null;
  if(x == null) return null;
  return String(x).toLowerCase();
}
function ecranDe(id){ for(var i = 0; i < C.ecrans.length; i++){ if(C.ecrans[i].id === id) return C.ecrans[i]; } return null; }
function humaniser(k){ var s = String(k).replace(/_/g, " "); return s.charAt(0).toUpperCase() + s.slice(1); }
function pause(n){ return String(n).replace(/\s([?!:;»])/g, " $1").replace(/(«)\s/g, "$1 "); }

/* ---------------- état du formateur ---------------- */
var OPTIONS_DEFAUT = {forme_banque: "A", verification_debut: false, ordre_s5: "A", commande_pour_deux: false, un_seul_vu: false,
  perimetre_reduit: false, perimetre_motif: "", rang: "", preparation_min: "", montage: "A", lieu_saisie: "seconde_fenetre"};
function options(){
  var e = E();
  if(!e.options || typeof e.options !== "object" || Array.isArray(e.options)) e.options = {};
  for(var k in OPTIONS_DEFAUT){ if(e.options[k] === undefined) e.options[k] = OPTIONS_DEFAUT[k]; }
  return e.options;
}
function grille(){
  var e = E();
  if(!e.grille || typeof e.grille !== "object" || Array.isArray(e.grille)) e.grille = {};
  return e.grille;
}
function durees(){
  var e = E();
  if(!e.durees || typeof e.durees !== "object" || Array.isArray(e.durees)) e.durees = {};
  return e.durees;
}
function sauver(){ S.sauver(); }

/* ---------------- registres (A4 §1.5) ---------------- */
var PROD = [
  {id: "S0-P1", ecran: "s0", condition: "question_directe"},
  {id: "S3-P1", ecran: "s3", condition: "cartes_visibles"},
  {id: "S3-P2", ecran: "s3", condition: "sans_carte"},
  {id: "S3-P3", ecran: "s3", condition: "cartes_visibles"},
  {id: "S4-P1", ecran: "s4", condition: "apres_modele"},
  {id: "S4-P2", ecran: "s4", condition: "apres_modele"},
  {id: "S5-P1", ecran: "s5", condition: "cartes_visibles"},
  {id: "S5-P2", ecran: "s5", condition: "information_cachee"},
  {id: "S5-P3", ecran: "s5", condition: "sans_carte"},
  {id: "S5-P4", ecran: "s5", condition: "sans_carte", palier: "plus"},
  {id: "S6-P1", ecran: "s6", condition: "question_directe"}
];
var AVEC = ["autre", "rien"];
var COMPR = {
  "S0-C1": {seq: "S0", ecran: "s0", info: "quantite_finale", support: "audio_seul", valeurs: ["un", "deux"].concat(AVEC), attendue: ["deux"]},
  "S2-C4": {seq: "S2", ecran: "s2", info: "moyen_paiement", support: "audio_seul", valeurs: ["carte", "especes"].concat(AVEC), attendue: ["carte"]},
  "S6-C1": {seq: "S6", ecran: "s6", info: "quantite_finale", support: "audio_seul", valeurs: ["un", "deux"].concat(AVEC), attendue: ["deux"]},
  "D1-C1": {seq: "BANQUE", info: "intention", forme: "D", support: "audio_seul", valeurs: ["termine", "ajoute"].concat(AVEC), attendue: ["ajoute"], son: "b-d1"},
  "D2-C1": {seq: "BANQUE", info: "moyen_paiement", forme: "D", support: "audio_seul", valeurs: ["carte", "especes"].concat(AVEC), attendue: ["carte"], son: "b-d2"},
  "T1-C1": {seq: "BANQUE", info: "intention", forme: "T", support: "audio_seul", valeurs: ["termine", "ajoute"].concat(AVEC), attendue: ["ajoute"], son: "b-t1"},
  "T2-C1": {seq: "BANQUE", info: "moyen_paiement", forme: "T", support: "audio_seul", valeurs: ["carte", "especes"].concat(AVEC), attendue: ["especes"], son: "b-t2"},
  "T3-C1": {seq: "BANQUE", info: "produit_final", forme: "J7", support: "audio_seul", valeurs: ["cafe_seul", "cafe_et_croissant"].concat(AVEC), attendue: ["cafe_seul"], son: "b-t3"},
  "T4-C1": {seq: "BANQUE", info: "quantite_finale", forme: "J7", support: "audio_seul", valeurs: ["un", "deux"].concat(AVEC), attendue: ["un"], son: "b-t4"}
};
var FILM = {"S1-C1": 1, "S1-C2": 1, "S2-C1": 1, "S2-C2": 1, "S2-C3": 1};
var CRITERES = ["sens", "reponse_adaptee", "groupe"];
var REPARATIONS = ["resolu", "non_resolu", "non_sollicite"];
var PERIMETRE_REDUIT = {paiement: "reporte", sequences_allegees: ["S2", "S5"], items_non_proposes: ["S2-C3", "S2-C4", "S5-P2"]};
var PALIERS = {simple: "plus_simple", normal: "normal", plus: "un_peu_plus"};
var CONDITIONS = {p1: "p1", passage1: "p1", apres_images: "apres_images", images: "apres_images",
  apres_reecoute: "apres_reecoute", passage2: "apres_reecoute", apres_texte: "apres_texte", texte: "apres_texte"};
var NOMBRES = {"1": "un", "2": "deux", "3": "trois", "4": "quatre"};

function libelleItem(id){
  var l = (F().protocole_pilote.fiche_observation.items || []).filter(function(x){ return x.indexOf(id + " ") === 0 || x === id; })[0];
  return l || id;
}
function banquePaires(){
  var o = options(), A = o.forme_banque !== "B";
  return {debut: A ? ["D1-C1", "D2-C1"] : ["T1-C1", "T2-C1"], sortie: A ? ["T1-C1", "T2-C1"] : ["D1-C1", "D2-C1"], j7: ["T3-C1", "T4-C1"]};
}
function itemsDeEcran(id){
  var paires = banquePaires(), pal = E().palier, r = {c: [], p: []};
  Object.keys(COMPR).forEach(function(k){ if(COMPR[k].ecran === id) r.c.push(k); });
  PROD.forEach(function(p){ if(p.ecran === id && (!p.palier || p.palier === pal)) r.p.push(p.id); });
  if(id === "s0" && options().verification_debut) r.c = r.c.concat(paires.debut);
  if(id === "apres") r.c = paires.sortie.concat(paires.j7);
  return r;
}
function momentDe(item){
  var p = banquePaires();
  if(COMPR[item] && COMPR[item].seq === "BANQUE"){
    if(p.j7.indexOf(item) >= 0) return "j7";
    if(p.debut.indexOf(item) >= 0 && options().verification_debut) return "depart";
    return "sortie";
  }
  return "seance";
}

/* ======================================================================
   1. VUE FORMATEUR : carte d'un écran
   ====================================================================== */
function bloc(titre, contenu, cls){
  var b = el("div", "carte-privee" + (cls ? " " + cls : ""));
  b.appendChild(el("h4", "fmt-sous-titre", titre));
  var p = el("p", "fmt-texte"); p.textContent = pause(contenu); b.appendChild(p);
  return b;
}
function carteTexte(ec){
  var cf = ec.carte_formateur || {};
  var d = el("details", "panneau-formateur"); d.open = true;
  d.appendChild(el("summary", null, I("panneau_titre")));
  var p = el("div", "prive");
  p.appendChild(el("p", "fmt-avertissement", F().vue.avertissement_partage_ecran));
  [["dit", "carte_dit"], ["note", "carte_note"], ["a_corriger", "carte_a_corriger"], ["si_temps_manque", "carte_si_temps_manque"],
   ["a_savoir", "carte_a_savoir"], ["validite", "carte_validite"]].forEach(function(c){
    if(cf[c[0]]) p.appendChild(bloc(I(c[1]), cf[c[0]], c[0] === "dit" ? "fmt-dit" : ""));
  });
  d.appendChild(p);
  return d;
}

/* --- cartes privées de S5 --- */
function sonTexte(id){ return C.sons[id] ? C.sons[id].texte : id; }
function cartesS5(){
  var K = F().cartes_privees_s5, o = options();
  var d = el("details", "panneau-formateur fmt-s5"); d.open = true;
  d.appendChild(el("summary", null, K.titre));
  var p = el("div", "prive");
  p.appendChild(el("p", "fmt-avertissement", K.avertissement));
  /* ordre A / B */
  var ligne = el("div", "row fmt-ordre");
  ligne.appendChild(el("span", "fmt-lib", I("ordre_titre")));
  var seg = el("div", "seg"); seg.setAttribute("role", "group"); seg.setAttribute("aria-label", I("ordre_titre"));
  [["A", K.ordre_A], ["B", K.ordre_B]].forEach(function(x){
    var b = btn(null, I("ordre_" + x[0]), function(){
      options().ordre_s5 = x[0]; sauver();
      var neuf = cartesS5(); d.parentNode.replaceChild(neuf, d); var f = neuf.querySelector('[data-ordre="' + x[0] + '"]'); if(f) f.focus();
    });
    b.dataset.ordre = x[0]; b.title = x[1]; b.setAttribute("aria-pressed", String((o.ordre_s5 || "A") === x[0])); seg.appendChild(b);
  });
  ligne.appendChild(seg); p.appendChild(ligne);
  p.appendChild(el("p", "fmt-note", pause((o.ordre_s5 || "A") === "B" ? K.ordre_B : K.ordre_A)));
  /* conversations */
  Object.keys(K.conversations).forEach(function(cle, n){
    var cv = K.conversations[cle], carte = el("div", "carte-privee fmt-conv");
    carte.appendChild(el("h4", "fmt-sous-titre", I("conversation") + " " + (n + 1)));
    var meta = el("p", "fmt-note"); meta.textContent = pause(I("il_veut") + " " + cv.il_veut + " · " + I("aide_apprenant") + " " + cv.aide_apprenant); carte.appendChild(meta);
    var ol = el("ol", "fmt-tours");
    cv.tours.forEach(function(t){
      if(t.id === "c3.t3-t4"){                                  /* ordre A ou B de la conversation 3 */
        var ids = t.sons.slice(); if((o.ordre_s5 || "A") === "B") ids.reverse();
        ids.forEach(function(sid){ var li = el("li", null); li.appendChild(el("span", "a-dire", pause(sonTexte(sid)))); ol.appendChild(li); });
        return;
      }
      var li = el("li", t.note ? "fmt-erreur" : null);
      li.appendChild(el("span", "a-dire", pause(t.dit)));
      if(t.note){ li.appendChild(el("span", "fmt-etiquette", I("confirmation_erronee"))); li.appendChild(el("span", "fmt-note", pause(t.note))); }
      ol.appendChild(li);
    });
    carte.appendChild(ol);
    if(cv.apres) carte.appendChild(el("p", "fmt-note", pause(I("apres_conversation") + " " + cv.apres)));
    p.appendChild(carte);
  });
  p.appendChild(bloc(I("regle_pardon"), K.regle_pardon));
  var ref = el("div", "carte-privee"); ref.appendChild(el("h4", "fmt-sous-titre", I("reformulations")));
  var ul = el("ul", "fmt-liste"); K.reformulations_apres_pardon.forEach(function(x){ ul.appendChild(el("li", null, pause(x))); }); ref.appendChild(ul); p.appendChild(ref);
  p.appendChild(bloc(I("paliers_s5_simple"), K.paliers.simple));
  p.appendChild(bloc(I("paliers_s5_plus"), K.paliers.plus));
  p.appendChild(bloc(I("petit_groupe"), K.petit_groupe));
  d.appendChild(p);
  return d;
}

/* --- grille 0/1/2 --- */
function vide(r){
  if(!r) return true;
  if(r.entendue) return false;
  return r.production !== "aucune" && CRITERES.every(function(k){ return r[k] == null; }) && r.reparation == null
    && !r.relances && !r.demandes_repetition && !r.mot_souffle && !r.note;
}
function nouveau(){
  return {production: "faite", sens: null, reponse_adaptee: null, groupe: null, reparation: null, relances: 0, demandes_repetition: 0,
    mot_souffle: false, note: "", juge: "F1", moment_notation: "direct", t: null};
}
function ecrire(item, champ, valeur){
  var G = grille(), r = G[item] || (G[item] = nouveau());
  r[champ] = valeur; r.t = maintenant();
  if(champ !== "production" && (CRITERES.indexOf(champ) >= 0 || champ === "reparation") && valeur != null) r.production = "faite";
  if(vide(r)) delete G[item];
  sauver();
}
function aideCriteres(){ return F().grille.criteres; }

function carteProd(item){
  var def = PROD.filter(function(p){ return p.id === item; })[0];
  var G = grille(), K = F().grille, crit = aideCriteres();
  var boite = el("section", "fmt-grille");
  boite.tabIndex = 0; boite.setAttribute("role", "group"); boite.setAttribute("aria-label", libelleItem(item));
  boite.dataset.item = item;
  var tete = el("div", "fmt-grille-tete");
  tete.appendChild(el("h4", "fmt-sous-titre", libelleItem(item)));
  var aucune = btn("btn small", I("pas_de_reponse"), function(){
    var r = G[item];
    if(r && r.production === "aucune"){ r.production = "faite"; r.t = maintenant(); if(vide(r)) delete G[item]; sauver(); }
    else { var n = G[item] || (G[item] = nouveau()); n.production = "aucune"; CRITERES.forEach(function(k){ n[k] = null; }); n.reparation = null; n.t = maintenant(); sauver(); }
    maj();
  });
  aucune.setAttribute("aria-pressed", "false"); aucune.dataset.cle = "aucune";
  tete.appendChild(aucune); boite.appendChild(tete);
  boite.appendChild(el("p", "fmt-note", I("grille_condition") + " " + def.condition.replace(/_/g, " ")));
  var lignes = [];
  crit.forEach(function(c, i){
    var champ = CRITERES[i], ligne = el("div", "fmt-ligne");
    var lib = el("div", "fmt-lib"); lib.appendChild(el("b", null, c.nom)); lib.appendChild(el("span", "fmt-q", pause(c.question))); ligne.appendChild(lib);
    var seg = el("div", "seg fmt-trois"); seg.setAttribute("role", "group"); seg.setAttribute("aria-label", c.nom);
    c.niveaux.forEach(function(nv, j){
      var b = btn(null, null, function(){
        var r = G[item], actif = r && r[champ] === nv.valeur;
        ecrire(item, champ, actif ? null : nv.valeur); maj(); S.annoncer(c.nom + " : " + (actif ? "—" : nv.valeur));
      });
      b.appendChild(el("b", null, String(nv.valeur))); b.appendChild(el("small", null, I("court." + champ + "." + j)));
      b.title = pause(nv.descripteur + " " + nv.exemple); b.setAttribute("aria-label", c.nom + " " + nv.valeur + " : " + nv.descripteur);
      b.setAttribute("aria-pressed", "false"); b.dataset.champ = champ; b.dataset.valeur = String(nv.valeur); seg.appendChild(b);
    });
    ligne.appendChild(seg); boite.appendChild(ligne); lignes.push(ligne);
  });
  var lm = el("div", "fmt-ligne"), libm = el("div", "fmt-lib"); libm.appendChild(el("b", null, K.malentendu.nom)); lm.appendChild(libm);
  var segm = el("div", "seg fmt-trois"); segm.setAttribute("role", "group"); segm.setAttribute("aria-label", K.malentendu.nom);
  K.malentendu.etats.forEach(function(et){
    var b = btn(null, et.bouton, function(){
      var r = G[item], actif = r && r.reparation === et.valeur;
      ecrire(item, "reparation", actif ? null : et.valeur); maj(); S.annoncer(K.malentendu.nom + " : " + (actif ? "—" : et.bouton));
    });
    b.title = pause(et.quand + " " + et.exemple); b.setAttribute("aria-pressed", "false"); b.dataset.champ = "reparation"; b.dataset.valeur = et.valeur; segm.appendChild(b);
  });
  lm.appendChild(segm); boite.appendChild(lm); lignes.push(lm);
  /* compteurs */
  var cpt = el("div", "row fmt-compteurs");
  function compteur(champ, titre){
    var c = el("div", "fmt-compteur"); c.appendChild(el("span", "fmt-lib", titre));
    var moins = btn("btn small", "−", function(){ var r = G[item]; if(r && r[champ] > 0){ ecrire(item, champ, r[champ] - 1); maj(); } });
    var val = el("output", "fmt-val", "0"); val.dataset.champ = champ;
    var plus = btn("btn small", "+", function(){ var r = G[item]; ecrire(item, champ, (r ? r[champ] : 0) + 1); maj(); });
    moins.setAttribute("aria-label", titre + " : moins"); plus.setAttribute("aria-label", titre + " : plus"); plus.dataset.plus = champ;
    c.appendChild(moins); c.appendChild(val); c.appendChild(plus); cpt.appendChild(c);
  }
  compteur("relances", I("relances")); compteur("demandes_repetition", I("demande_repeter"));
  var souffle = el("label", "chip fmt-souffle"); var cb = document.createElement("input"); cb.type = "checkbox";
  cb.addEventListener("change", function(){ ecrire(item, "mot_souffle", cb.checked); maj(); });
  souffle.appendChild(cb); souffle.appendChild(document.createTextNode(" " + I("mot_souffle"))); cpt.appendChild(souffle);
  boite.appendChild(cpt);
  /* aide et note */
  var pied = el("div", "row");
  var aide = btn("btn small", I("descripteurs"), function(){ pan.hidden = !pan.hidden; aide.setAttribute("aria-expanded", String(!pan.hidden)); });
  aide.setAttribute("aria-expanded", "false");
  var nb = btn("btn small", I("note"), function(){ champNote.hidden = !champNote.hidden; nb.setAttribute("aria-expanded", String(!champNote.hidden)); if(!champNote.hidden) champNote.focus(); });
  nb.setAttribute("aria-expanded", "false");
  pied.appendChild(aide); pied.appendChild(nb); boite.appendChild(pied);
  var champNote = document.createElement("input"); champNote.type = "text"; champNote.className = "fmt-champ"; champNote.hidden = true;
  champNote.setAttribute("aria-label", I("note") + " " + item);
  champNote.addEventListener("input", function(){ var r = G[item]; if(!r && !champNote.value) return; ecrire(item, "note", champNote.value); });
  boite.appendChild(champNote);
  var pan = el("div", "fmt-descripteurs"); pan.hidden = true;
  crit.forEach(function(c){
    pan.appendChild(el("h5", "fmt-sous-titre", c.nom + " — " + pause(c.question)));
    var ul = el("ul", "fmt-liste");
    c.niveaux.forEach(function(nv){ var li = el("li"); li.appendChild(el("b", null, nv.valeur + " ")); li.appendChild(document.createTextNode(pause(nv.descripteur + " " + nv.exemple))); ul.appendChild(li); });
    pan.appendChild(ul);
    if(c.note) pan.appendChild(el("p", "fmt-note", pause(c.note)));
  });
  pan.appendChild(el("h5", "fmt-sous-titre", K.malentendu.nom));
  var um = el("ul", "fmt-liste"); K.malentendu.etats.forEach(function(et){ var li = el("li"); li.appendChild(el("b", null, et.bouton + " ")); li.appendChild(document.createTextNode(pause(et.quand + " " + et.exemple))); um.appendChild(li); }); pan.appendChild(um);
  boite.appendChild(pan);

  function maj(){
    var r = G[item] || null, off = !!(r && r.production === "aucune");
    aucune.setAttribute("aria-pressed", String(off));
    Array.prototype.forEach.call(boite.querySelectorAll("button[data-champ]"), function(b){
      var v = r ? r[b.dataset.champ] : null;
      b.setAttribute("aria-pressed", String(!off && v != null && String(v) === b.dataset.valeur));
      b.disabled = off;
    });
    lignes.forEach(function(l){ l.classList.toggle("fmt-grise", off); });
    Array.prototype.forEach.call(boite.querySelectorAll("output[data-champ]"), function(o){ o.textContent = String(r ? r[o.dataset.champ] || 0 : 0); });
    cb.checked = !!(r && r.mot_souffle);
    if(document.activeElement !== champNote) champNote.value = r && r.note ? r.note : "";
  }
  /* clavier : 0 1 2, r p a, x, + */
  boite.addEventListener("keydown", function(e){
    var t = e.target;
    if(t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT")) return;
    if(e.ctrlKey || e.metaKey || e.altKey) return;
    var r = G[item], off = r && r.production === "aucune", k = e.key;
    if(k === "x"){ aucune.click(); e.preventDefault(); return; }
    if(off) return;
    if(k === "0" || k === "1" || k === "2"){
      var i = 0; while(i < 3 && r && r[CRITERES[i]] != null) i++;
      if(i < 3){ ecrire(item, CRITERES[i], +k); maj(); S.annoncer(crit[i].nom + " : " + k); }
      e.preventDefault();
    } else if(k === "r" || k === "p" || k === "a"){
      var v = {r: "resolu", p: "non_resolu", a: "non_sollicite"}[k];
      ecrire(item, "reparation", v); maj(); e.preventDefault();
    } else if(k === "+"){ ecrire(item, "relances", (r ? r.relances : 0) + 1); maj(); e.preventDefault(); }
  });
  maj();
  return boite;
}

function carteEntendue(item){
  var reg = COMPR[item], G = grille();
  var boite = el("section", "fmt-grille fmt-entendue"); boite.setAttribute("role", "group"); boite.setAttribute("aria-label", libelleItem(item)); boite.dataset.item = item;
  boite.appendChild(el("h4", "fmt-sous-titre", libelleItem(item)));
  boite.appendChild(el("p", "fmt-note", I("entendue_aide")));
  var seg = el("div", "seg"); seg.setAttribute("role", "group"); seg.setAttribute("aria-label", I("entendue_titre"));
  reg.valeurs.forEach(function(v){
    var b = btn(null, I("valeurs." + v), function(){
      var r = G[item], actif = r && r.entendue && r.entendue.valeur === v;
      if(actif){ delete G[item]; }
      else { G[item] = {entendue: {valeur: v, t: maintenant(), condition: "p1"}}; }
      sauver(); maj(); S.annoncer(I("entendue_titre") + " : " + (actif ? "—" : I("valeurs." + v)));
    });
    b.dataset.valeur = v; b.setAttribute("aria-pressed", "false"); seg.appendChild(b);
  });
  boite.appendChild(seg);
  function maj(){
    var r = G[item], v = r && r.entendue ? r.entendue.valeur : null;
    Array.prototype.forEach.call(seg.querySelectorAll("button"), function(b){ b.setAttribute("aria-pressed", String(b.dataset.valeur === v)); });
  }
  maj();
  return boite;
}

function panneauGrille(id){
  var it = itemsDeEcran(id), d = el("section", "fmt-grilles");
  if(!it.c.length && !it.p.length) return null;
  d.appendChild(el("h3", "fmt-titre-section", F().grille.titre));
  if(E().mode === "seul"){
    d.appendChild(el("p", "carte-privee", F().grille.mode_seul.nom));
    d.appendChild(el("p", "fmt-note", I("grille_seul")));
    return d;
  }
  d.appendChild(el("p", "fmt-avertissement", F().grille.interface.bandeau));
  it.c.forEach(function(x){ d.appendChild(carteEntendue(x)); });
  it.p.forEach(function(x){ d.appendChild(carteProd(x)); });
  d.appendChild(el("p", "fmt-note", I("grille_clavier")));
  return d;
}

/* --- navigation de la vue formateur --- */
function navigation(id){
  var n = el("nav", "fmt-nav"); n.setAttribute("aria-label", I("nav_titre"));
  var i = -1; C.ecrans.forEach(function(e, k){ if(e.id === id) i = k; });
  n.appendChild(el("span", "fmt-lib", I("ecran_apprenant") + " " + id.toUpperCase()));
  var prec = btn("btn small", I("ecran_precedent"), function(){ if(i > 0) API.aller(C.ecrans[i - 1].id); });
  var suiv = btn("btn small", I("ecran_suivant"), function(){ if(i < C.ecrans.length - 1) API.aller(C.ecrans[i + 1].id); });
  prec.disabled = i <= 0; suiv.disabled = i >= C.ecrans.length - 1;
  var sel = document.createElement("select"); sel.className = "fmt-choix"; sel.setAttribute("aria-label", I("ecran_choisir"));
  C.ecrans.forEach(function(e){ var o = el("option", null, e.id.toUpperCase() + (e.titre ? " · " + e.titre : "")); o.value = e.id; if(e.id === id) o.selected = true; sel.appendChild(o); });
  sel.addEventListener("change", function(){ API.aller(sel.value); });
  var esp = btn("btn small", I("ouvrir_espace"), function(){ ouvrirEspace({sansMessage: true}); });
  n.appendChild(prec); n.appendChild(sel); n.appendChild(suiv); n.appendChild(esp);
  return n;
}

function carteEcran(id){
  if(!API || vue() !== "formateur") return null;
  id = idDe(id); var ec = id && ecranDe(id);
  if(!ec) return null;
  var racine = el("div", "fmt-carte"); racine.dataset.ecran = id;
  racine.appendChild(navigation(id));
  racine.appendChild(carteTexte(ec));
  if(id === "s5") racine.appendChild(cartesS5());
  var g = panneauGrille(id); if(g) racine.appendChild(g);
  return racine;
}

/* ======================================================================
   2. SYNCHRONISATION ENTRE FENÊTRES, DURÉES
   ====================================================================== */
function surStockage(e){
  var cle = S.magasin() && S.magasin().cle;
  if(!cle || e.key !== cle || !e.newValue) return;
  var p; try{ p = JSON.parse(e.newValue); }catch(x){ return; }
  if(!p || typeof p !== "object") return;
  var etat = E();
  if(vue() === "formateur"){
    Object.keys(p).forEach(function(k){ if(PROPRES.indexOf(k) < 0) etat[k] = p[k]; });
    var id = idDe(etat.ecran);
    if(id && id !== DERNIER){ DERNIER = id; if(API.aller) API.aller(id); }
  } else {
    PROPRES.forEach(function(k){ if(p[k] !== undefined) etat[k] = p[k]; });
  }
}
function fermerChrono(){
  if(!SUIVI_ECRAN) return;
  var d = durees(), x = d[SUIVI_ECRAN.id] || (d[SUIVI_ECRAN.id] = {actif_s: 0, visites: 0, debut: null, fin: null});
  if(SUIVI_ECRAN.t0 != null){ x.actif_s = Math.round((x.actif_s + (Date.now() - SUIVI_ECRAN.t0) / 1000) * 10) / 10; SUIVI_ECRAN.t0 = null; }
  x.fin = maintenant();
}
function surChangementEcran(id){
  id = idDe(id); if(!id) return;
  if(vue() === "formateur"){ DERNIER = id; return; }                     /* le chronomètre est celui de l'apprenant */
  if(SUIVI_ECRAN && SUIVI_ECRAN.id === id) return;
  fermerChrono();
  var d = durees(), x = d[id] || (d[id] = {actif_s: 0, visites: 0, debut: null, fin: null});
  x.visites++; if(!x.debut) x.debut = maintenant();
  SUIVI_ECRAN = {id: id, t0: document.hidden ? null : Date.now()};
  S.sauverBientot();
}
function surVisibilite(){
  if(!SUIVI_ECRAN || vue() === "formateur") return;
  if(document.hidden){ fermerChrono(); } else { SUIVI_ECRAN.t0 = Date.now(); }
}

/* ======================================================================
   3. ESPACE FORMATEUR : fenêtre modale
   ====================================================================== */
var ONGLETS = ["deroule", "avant", "sons", "fiche", "pilote", "suivi"];

function focusables(racine){
  return Array.prototype.filter.call(racine.querySelectorAll('a[href], button, input, select, textarea, summary, audio[controls], [tabindex]:not([tabindex="-1"])'),
    function(n){ return !n.disabled && !n.hidden && !n.closest("[hidden]") && n.tabIndex !== -1; });
}
function ouvrirEspace(opt){
  if(!API) return null;
  opt = opt || {};
  if(ESPACE) ESPACE.fermer();
  var retour = document.activeElement;
  var mask = el("div", "fmt-mask"), mo = el("div", "fmt-modal");
  mo.setAttribute("role", "dialog"); mo.setAttribute("aria-modal", "true"); mo.setAttribute("aria-labelledby", "fmtTitre");
  mask.appendChild(mo);
  var ctl = {racine: mo, fermer: fermer, onglet: null, pret: Promise.resolve()};
  function fermer(){
    try{ S.toutArreter(); }catch(e){}
    document.removeEventListener("keydown", clavier, true);
    document.body.classList.remove("fmt-ouvert", "fmt-sur-fiche");
    if(mask.parentNode) mask.parentNode.removeChild(mask);
    if(ESPACE === ctl) ESPACE = null;
    if(retour && retour.focus && document.body.contains(retour)) retour.focus();
  }
  function clavier(e){
    var autre = document.querySelector(".mask");                 /* une autre fenêtre (export du socle) est au-dessus : on la laisse faire */
    if(autre) return;
    if(e.key === "Escape"){ e.preventDefault(); fermer(); return; }
    if(e.key !== "Tab") return;
    var f = focusables(mo); if(!f.length) return;
    var i = f.indexOf(document.activeElement);
    if(e.shiftKey && (i <= 0)){ e.preventDefault(); f[f.length - 1].focus(); }
    else if(!e.shiftKey && (i === f.length - 1 || i < 0)){ e.preventDefault(); f[0].focus(); }
  }
  mask.addEventListener("mousedown", function(e){ if(e.target === mask) fermer(); });
  document.addEventListener("keydown", clavier, true);
  document.body.appendChild(mask); document.body.classList.add("fmt-ouvert");
  ESPACE = ctl;

  function message(){
    mo.innerHTML = "";
    var h = el("h2", null, F().titre); h.id = "fmtTitre"; h.tabIndex = -1; mo.appendChild(h);
    mo.appendChild(el("p", "fmt-message", I("message_reserve")));
    var r = el("div", "row");
    var ok = btn("btn btn-primary", I("continuer"), contenu);
    r.appendChild(ok); r.appendChild(btn("btn", I("fermer"), fermer)); mo.appendChild(r);
    ok.focus();
  }
  function contenu(){
    mo.innerHTML = "";
    var tete = el("div", "fmt-tete");
    var h = el("h2", null, F().titre); h.id = "fmtTitre"; h.tabIndex = -1; tete.appendChild(h);
    tete.appendChild(btn("btn small", I("fermer"), fermer)); mo.appendChild(tete);
    var tl = el("div", "fmt-onglets"); tl.setAttribute("role", "tablist"); tl.setAttribute("aria-label", F().titre); mo.appendChild(tl);
    var corps = el("div", "fmt-corps"); mo.appendChild(corps);
    var boutons = {};
    ONGLETS.forEach(function(nom){
      var b = btn("fmt-onglet", I("onglet_" + nom), function(){ choisir(nom, true); });
      b.setAttribute("role", "tab"); b.id = "fmt-tab-" + nom; b.setAttribute("aria-controls", "fmt-pan-" + nom); b.dataset.onglet = nom;
      b.addEventListener("keydown", function(e){
        var i = ONGLETS.indexOf(nom), j = null;
        if(e.key === "ArrowRight") j = (i + 1) % ONGLETS.length; else if(e.key === "ArrowLeft") j = (i + ONGLETS.length - 1) % ONGLETS.length;
        else if(e.key === "Home") j = 0; else if(e.key === "End") j = ONGLETS.length - 1;
        if(j != null){ e.preventDefault(); choisir(ONGLETS[j], true); }
      });
      boutons[nom] = b; tl.appendChild(b);
    });
    function choisir(nom, focus){
      S.toutArreter();
      ONGLETS.forEach(function(n){ var a = n === nom; boutons[n].setAttribute("aria-selected", String(a)); boutons[n].tabIndex = a ? 0 : -1; boutons[n].classList.toggle("actif", a); });
      corps.innerHTML = "";
      var pan = el("div", "fmt-panneau fmt-panneau-" + nom); pan.setAttribute("role", "tabpanel"); pan.id = "fmt-pan-" + nom; pan.setAttribute("aria-labelledby", "fmt-tab-" + nom);
      corps.appendChild(pan);
      document.body.classList.toggle("fmt-sur-fiche", nom === "fiche");
      mask.dataset.onglet = nom;
      var p = RENDUS[nom](pan, choisir);
      ctl.pret = Promise.resolve(p);
      if(focus) boutons[nom].focus();
      S.annoncer(I("onglet_" + nom));
      return ctl.pret;
    }
    ctl.onglet = choisir;
    choisir(opt.onglet || "deroule", false);
    h.focus();
  }
  ctl.contenu = contenu;
  if(opt.sansMessage) contenu(); else message();
  return ctl;
}

/* ---------------- (a) déroulé ---------------- */
function titreSection(pan, x, niv){ var h = el("h" + (niv || 3), "fmt-titre-section", x); pan.appendChild(h); return h; }
function minutes(d){
  if(d.de < 0) return I("avant_45");
  return d.de + " – " + d.a + " min";
}
function dureeLigne(id){
  var x = durees()[id]; if(!x || !x.actif_s) return "—";
  var ec = ecranDe(id), prevu = ec && ec.duree_min != null ? ec.duree_min : null;
  return id.toUpperCase() + " · " + Math.max(1, Math.round(x.actif_s / 60)) + " min" + (prevu != null ? " (" + I("prevu") + " " + prevu + ")" : "");
}
function tableau(entetes, lignes, cls){
  var w = el("div", "tbl-wrap"), t = el("table", "tbl " + (cls || "")), th = el("thead"), tr = el("tr");
  entetes.forEach(function(h){ var c = el("th", null, h); c.scope = "col"; tr.appendChild(c); });
  th.appendChild(tr); t.appendChild(th);
  var tb = el("tbody");
  lignes.forEach(function(l){ var r = el("tr"); l.forEach(function(c){ var td = el("td"); if(c instanceof Node) td.appendChild(c); else td.textContent = c == null ? "" : c; r.appendChild(td); }); tb.appendChild(r); });
  t.appendChild(tb); w.appendChild(t); return w;
}
function ongletDeroule(pan, choisir){
  titreSection(pan, I("deroule_titre"));
  pan.appendChild(el("p", "fmt-note", I("deroule_aide")));
  var lignes = F().deroule.map(function(d){
    var ec = ecranDe(d.ecran);
    return [minutes(d), d.titre + (ec ? "" : ""), pause(d.contenu), pause(d.si_temps_manque), dureeLigne(d.ecran)];
  });
  pan.appendChild(tableau([I("col_minutes"), I("col_sequence"), I("col_contenu"), I("col_si_temps"), I("col_duree_reelle")], lignes));
  pan.appendChild(el("p", "fmt-note", I("deroule_chrono")));
  var r = el("div", "carte-privee"); r.appendChild(el("h4", "fmt-sous-titre", I("gestion_temps")));
  var ul = el("ul", "fmt-liste");
  I("gestion_temps_lignes").forEach(function(x){ ul.appendChild(el("li", null, pause(x))); });
  r.appendChild(ul); pan.appendChild(r);
  var seuils = el("p", "fmt-note", pause(F().limites.seuils) + " " + I("provisoire")); pan.appendChild(seuils);
}

/* ---------------- (b) avant le cours ---------------- */
function champTexte(pan, id, libelle, valeur, surChange, aide, type){
  var w = el("div", "fmt-champ-ligne"), l = el("label", "fmt-lib", libelle); l.htmlFor = id;
  var i = document.createElement("input"); i.type = type || "text"; i.id = id; i.className = "fmt-champ"; i.value = valeur == null ? "" : valeur;
  if(type === "number"){ i.min = "0"; i.inputMode = "numeric"; }
  i.addEventListener("input", function(){ surChange(i.value); });
  w.appendChild(l); w.appendChild(i);
  if(aide){ var a = el("p", "fmt-note", pause(aide)); a.id = id + "-aide"; i.setAttribute("aria-describedby", a.id); w.appendChild(a); }
  pan.appendChild(w); return i;
}
function interrupteur(pan, cle, libelle, note){
  var o = options(), b = btn("chip fmt-inter", libelle, function(){
    o[cle] = !o[cle]; b.setAttribute("aria-pressed", String(!!o[cle])); sauver();
  });
  b.setAttribute("aria-pressed", String(!!o[cle])); b.dataset.option = cle;
  var w = el("div", "fmt-inter-ligne"); w.appendChild(b); if(note) w.appendChild(el("p", "fmt-note", pause(note))); pan.appendChild(w); return b;
}
function segment(pan, titre, cle, valeurs, note, apres){
  var o = options(), w = el("div", "fmt-seg-ligne");
  w.appendChild(el("span", "fmt-lib", titre));
  var seg = el("div", "seg"); seg.setAttribute("role", "group"); seg.setAttribute("aria-label", titre);
  valeurs.forEach(function(v){
    var b = btn(null, v[1], function(){
      o[cle] = v[0]; sauver();
      Array.prototype.forEach.call(seg.children, function(x){ x.setAttribute("aria-pressed", String(x.dataset.v === v[0])); });
      if(apres) apres();
    });
    b.dataset.v = v[0]; b.setAttribute("aria-pressed", String(o[cle] === v[0])); seg.appendChild(b);
  });
  w.appendChild(seg); if(note) w.appendChild(el("p", "fmt-note", pause(note))); pan.appendChild(w); return seg;
}
function ongletAvant(pan, choisir){
  var o = options(), R = F().reglages;
  titreSection(pan, I("avant_titre"));
  champTexte(pan, "fmt-apprenant", I("apprenant"), E().apprenant || "", function(v){ E().apprenant = v.trim(); sauver(); }, I("apprenant_aide"));
  /* banque : forme de départ */
  titreSection(pan, I("banque_titre"), 4);
  pan.appendChild(el("p", "fmt-texte", pause(R.forme_banque.note)));
  pan.appendChild(el("p", "fmt-note", pause(I("alternance_explication") + " " + C.banque.calendrier.alternance_rang)));
  var apercu = el("div", "fmt-apercu");
  function majApercu(){
    apercu.innerHTML = "";
    var p = banquePaires();
    [["debut", "moment_debut"], ["sortie", "moment_sortie"], ["j7", "moment_j7"]].forEach(function(m){
      var c = el("div", "carte-privee"); c.appendChild(el("h5", "fmt-sous-titre", I(m[1])));
      p[m[0]].forEach(function(item){
        var reg = COMPR[item], ligne = el("div", "row"); ligne.appendChild(el("span", "fmt-code", item.replace("-C1", "")));
        var d = C.banque.dialogues[reg.son]; if(d) ligne.appendChild(S.boutonSon(d.son, I("ecouter"), {sansLent: false}));
        c.appendChild(ligne);
      });
      apercu.appendChild(c);
    });
  }
  segment(pan, I("forme_titre"), "forme_banque", [["A", I("forme_A")], ["B", I("forme_B")]], null, majApercu);
  var rang = champTexte(pan, "fmt-rang", I("rang"), o.rang, function(v){ o.rang = v; sauver(); }, I("rang_aide"), "number");
  var ap = btn("btn small", I("rang_appliquer"), function(){
    var n = parseInt(rang.value, 10); if(isNaN(n) || n < 1){ S.annoncer(I("rang_invalide")); return; }
    o.forme_banque = n % 2 === 1 ? "A" : "B"; sauver(); choisir("avant", false);
  });
  pan.appendChild(ap);
  interrupteur(pan, "verification_debut", I("verification_debut"), R.verification_debut.note);
  var lance = btn("btn", I("lancer_paire"), function(){
    options().verification_debut = true; sauver(); S.annoncer(I("lancer_paire_fait"));
    if(ESPACE) ESPACE.fermer(); if(API.aller) API.aller("s0");
  });
  pan.appendChild(lance);
  pan.appendChild(el("h5", "fmt-sous-titre", I("apercu_titre"))); pan.appendChild(apercu); majApercu();
  /* options de séance */
  titreSection(pan, I("options_titre"), 4);
  segment(pan, I("ordre_titre"), "ordre_s5", [["A", I("ordre_A")], ["B", I("ordre_B")]], R.ordre_s5.note);
  interrupteur(pan, "commande_pour_deux", I("commande_pour_deux"), R.commande_pour_deux.note);
  interrupteur(pan, "un_seul_vu", I("un_seul_vu"), R.un_seul_vu.note);
  segment(pan, I("montage_titre"), "montage", [["A", I("montage_A")], ["B", I("montage_B")]], I("montage_aide"));
  segment(pan, I("lieu_titre"), "lieu_saisie", [["seconde_fenetre", I("lieu_seconde_fenetre")], ["second_appareil", I("lieu_second_appareil")], ["papier", I("lieu_papier")], ["meme_ecran", I("lieu_meme_ecran")]], I("lieu_aide"));
  champTexte(pan, "fmt-prepa", I("preparation"), o.preparation_min, function(v){ o.preparation_min = v; sauver(); }, null, "number");
  /* périmètre réduit */
  titreSection(pan, I("perimetre_titre"), 4);
  pan.appendChild(el("p", "fmt-note", pause(R.perimetre_reduit.note)));
  interrupteur(pan, "perimetre_reduit", I("perimetre_reduire"), I("perimetre_effet"));
  champTexte(pan, "fmt-motif", I("perimetre_motif"), o.perimetre_motif, function(v){ o.perimetre_motif = v; sauver(); }, I("perimetre_motif_aide"));
}

/* ---------------- (c) sons ---------------- */
function infosSons(m){
  var clips = (m && m.clips) || {}, ids = [], vus = {};
  function ajoute(id){ if(!vus[id]){ vus[id] = 1; ids.push(id); } }
  Object.keys(C.sons).forEach(ajoute); Object.keys(clips).forEach(ajoute);
  return ids.map(function(id){
    var s = C.sons[id] || {}, c = clips[id] || {}, norm = S.sons.clip ? S.sons.clip(id) : null;
    var type = s.type || c.type || "";
    var voix = [];
    if(Array.isArray(c.voix)) c.voix.forEach(function(v){ voix.push(v.code || v); });
    else if(typeof c.voix === "string") voix.push(c.voix);
    if(!voix.length && s.voix) voix.push(s.voix);
    if(!voix.length && s.repliques) s.repliques.forEach(function(r){ if(voix.indexOf(r.voix) < 0) voix.push(r.voix); });
    var txt = (norm && norm.texte) || c.texte || s.texte || (s.repliques ? s.repliques.map(function(r){ return r.texte; }).join(" — ") : "");
    var role = s.role || (c.roles && c.roles.map(function(r){ return r.role; }).join(", ")) || (s.repliques ? s.repliques.map(function(r){ return r.role; }).filter(function(x, i, a){ return a.indexOf(x) === i; }).join(", ") : "");
    return {id: id, type: type, role: role, voix: voix, texte: txt, humain: !!(norm && norm.humain), horsManifeste: !!m && !clips[id], horsContenu: !C.sons[id], etiquette: s.etiquette || ""};
  });
}
function statutSon(id){
  var a = S.studio.avis(id);
  if(a){
    if(a.perime) return I("statut_perime");
    if(a.etat === "valide_a_l_ecoute") return I("statut_valide") + " " + dateFr(a.date) + " " + I("par") + " " + a.nom;
    if(a.etat === "a_refaire") return I("statut_a_refaire") + " (" + dateFr(a.date) + ", " + a.nom + ")";
  }
  return I("statut_non_valide");
}
function ongletSons(pan){
  titreSection(pan, I("sons_titre"));
  var ban = el("p", "fmt-bandeau"); ban.textContent = pause(I("sons_bandeau")); ban.setAttribute("role", "note"); pan.appendChild(ban);
  var rendu = el("div", "fmt-sons"); pan.appendChild(rendu);
  rendu.appendChild(el("p", "fmt-note", I("sons_chargement")));
  var p = S.sons.manifeste ? S.sons.manifeste() : null;
  return Promise.resolve(p).then(function(m){ construireSons(rendu, ban, m); }, function(){ construireSons(rendu, ban, null); });
}
function construireSons(rendu, ban, m){
  rendu.innerHTML = "";
  var infos = infosSons(m), D = {dialoguesDabord: true, aValider: false};
  if(m){
    var humains = Object.keys(m.clips || {}).filter(function(k){ var c = m.clips[k]; return c && c.humain; }).length;
    VOIX_HUMAINES = humains > 0;
    ban.appendChild(document.createTextNode(" " + I("humain_compte").replace("{n}", String(humains))));
    var voixJ7 = {}, voixAutres = {};
    infos.forEach(function(x){ var j7 = /^b-t[34](-|$)/.test(x.id);   /* les dialogues b-t3, b-t4 et leurs tours découpés (b-t3-t1…) */ x.voix.forEach(function(v){ (j7 ? voixJ7 : voixAutres)[v] = 1; }); });
    var nouvelles = Object.keys(voixJ7).filter(function(v){ return !voixAutres[v]; });
    if(Object.keys(voixJ7).length && !nouvelles.length) rendu.appendChild(el("p", "fmt-alerte", pause(I("voix_j7_manque"))));
  } else {
    rendu.appendChild(el("p", "fmt-alerte", pause(I("manifeste_absent"))));
  }
  /* validateur */
  var nom = champTexte(rendu, "fmt-validateur", I("validateur"), S.studio.nom(), function(v){ S.studio.nom(v); }, I("validateur_aide"));
  /* filtres + compteur */
  var barre = el("div", "row fmt-filtres");
  var f1 = btn("chip", I("filtre_dialogues"), function(){ D.dialoguesDabord = !D.dialoguesDabord; f1.setAttribute("aria-pressed", String(D.dialoguesDabord)); liste(); });
  f1.setAttribute("aria-pressed", "true"); f1.dataset.filtre = "dialogues";
  var f2 = btn("chip", I("filtre_a_valider"), function(){ D.aValider = !D.aValider; f2.setAttribute("aria-pressed", String(D.aValider)); liste(); });
  f2.setAttribute("aria-pressed", "false"); f2.dataset.filtre = "a_valider";
  var exp = btn("btn", I("exporter_validation"), function(){
    S.telecharger("validation-sons_" + maintenant().slice(0, 10) + ".json", S.studio.exporter(), "application/json");
    msg.textContent = I("validation_exportee");
  });
  barre.appendChild(f1); barre.appendChild(f2); barre.appendChild(exp); rendu.appendChild(barre);
  var compteur = el("p", "fmt-compteur-sons"); compteur.setAttribute("role", "status"); rendu.appendChild(compteur);
  var msg = el("p", "fmt-note"); msg.setAttribute("role", "status"); rendu.appendChild(msg);
  var zone = el("div", "fmt-liste-sons"); rendu.appendChild(zone);

  function compter(){
    var v = 0, r = 0;
    infos.forEach(function(x){ var a = S.studio.avis(x.id); if(a && !a.perime){ if(a.etat === "valide_a_l_ecoute") v++; else if(a.etat === "a_refaire") r++; } });
    compteur.textContent = I("compteur").replace("{v}", String(v)).replace("{r}", String(r)).replace("{n}", String(infos.length - v - r)).replace("{t}", String(infos.length));
  }
  function ligne(x){
    var a = el("article", "fmt-son"); a.dataset.id = x.id;
    var tete = el("div", "row fmt-son-tete");
    tete.appendChild(el("code", "fmt-code", x.id));
    tete.appendChild(el("span", "fmt-etiquette", I("genre_son.g_" + (x.type || "autre")) + (x.role ? " · " + x.role : "")));
    if(x.voix.length) tete.appendChild(el("span", "fmt-note", I("voix") + " " + x.voix.join(", ")));
    a.appendChild(tete);
    var t = el("p", "fmt-son-texte", pause(x.texte)); t.lang = "fr"; a.appendChild(t);
    if(x.horsManifeste) a.appendChild(el("p", "fmt-alerte", I("hors_manifeste")));
    var st = el("p", "fmt-son-statut", statutSon(x.id)); st.setAttribute("role", "status"); a.appendChild(st);
    var act = el("div", "row"); act.appendChild(S.boutonSon(x.id, I("ecouter"), {sansLent: false}));
    var note = document.createElement("input"); note.type = "text"; note.className = "fmt-champ"; note.setAttribute("aria-label", I("remarque") + " " + x.id);
    note.placeholder = I("remarque");
    var av = S.studio.avis(x.id); if(av) note.value = av.note || "";
    var bv = btn("btn small", I("valide_a_l_ecoute"), function(){ noter("valide_a_l_ecoute"); });
    var br = btn("btn small", I("a_refaire"), function(){ noter("a_refaire"); });
    bv.dataset.verdict = "valide_a_l_ecoute"; br.dataset.verdict = "a_refaire";
    function pressions(){
      var c = S.studio.avis(x.id);
      bv.setAttribute("aria-pressed", String(!!c && c.etat === "valide_a_l_ecoute" && !c.perime));
      br.setAttribute("aria-pressed", String(!!c && c.etat === "a_refaire" && !c.perime));
      st.textContent = statutSon(x.id);
    }
    function noter(verdict){
      var c = S.studio.avis(x.id), v = c && c.etat === verdict ? null : verdict;
      if(v && !S.studio.nom()){ msg.textContent = I("nom_requis"); nom.focus(); return; }
      var res = S.studio.noter(x.id, v, note.value);
      if(v && !res){ msg.textContent = I("nom_requis"); nom.focus(); return; }
      msg.textContent = ""; pressions(); compter();
    }
    note.addEventListener("change", function(){ var c = S.studio.avis(x.id); if(c) S.studio.noter(x.id, c.etat, note.value); });
    act.appendChild(bv); act.appendChild(br); a.appendChild(act); a.appendChild(note); pressions();
    /* enregistrer ma propre voix (créé à l'ouverture seulement) */
    var d = el("details", "fmt-voix"); d.appendChild(el("summary", null, I("enregistrer_ma_voix")));
    var cree = false;
    d.addEventListener("toggle", function(){
      if(!d.open || cree) return; cree = true;
      d.appendChild(el("p", "fmt-note", pause(I("voix_convertir").replace("{id}", x.id))));
      d.appendChild(S.enregistreur(x.id, 25, {studio: true, telecharger: true, nomFichier: x.id, libelle: I("enregistrer"), consigne: pause(x.texte), sansBoutonSans: true}));
    });
    a.appendChild(d);
    return a;
  }
  function liste(){
    zone.innerHTML = "";
    var l = infos.slice();
    if(D.dialoguesDabord) l.sort(function(a, b){ return (a.type === "dialogue" ? 0 : 1) - (b.type === "dialogue" ? 0 : 1); });
    if(D.aValider) l = l.filter(function(x){ var a = S.studio.avis(x.id); return !a || a.perime || a.etat !== "valide_a_l_ecoute"; });
    l.forEach(function(x){ zone.appendChild(ligne(x)); });
    compter();
  }
  liste();
}

/* ---------------- (d) fiche imprimable ---------------- */
function lignesFiche(item){
  var cols = F().protocole_pilote.fiche_observation.colonnes, code = item.split(" ")[0];
  var estP = /-P\d/.test(code), film = !!FILM[code], s2c4 = code === "S2-C4", aides = "Im Tx L1 0,9";
  return cols.map(function(c, i){
    if(i === 0) return item;
    if(estP && i >= 1 && i <= 4) return "▒";
    if(estP && i === 10) return "R N A";
    if(!estP && i >= 7 && i <= 10) return "▒";
    if(!estP && film && (i === 2 || i === 3)) return "▒";
    if(!estP && s2c4 && i === 3) return "▒";
    if(i === 5) return aides;
    return "";
  });
}
function ficheImprimable(){
  var f = el("div", "fmt-fiche"), P = F().protocole_pilote.fiche_observation, K = F().cartes_privees_s5;
  f.appendChild(el("h3", "fmt-titre-section", I("fiche_titre")));
  f.appendChild(el("p", "fmt-fiche-entete", pause(P.entete)));
  f.appendChild(el("p", "fmt-fiche-aide", pause(P.mode_emploi)));
  var haut = el("div", "fmt-fiche-haut");
  var s5 = el("div", "fmt-fiche-bloc"); s5.appendChild(el("h4", "fmt-sous-titre", K.titre));
  s5.appendChild(el("p", "fmt-avertissement", K.avertissement));
  Object.keys(K.conversations).forEach(function(cle, n){
    var cv = K.conversations[cle], p = el("p", "fmt-fiche-conv"), b = el("b", null, (n + 1) + ". ");
    p.appendChild(b);
    var parts = cv.tours.map(function(t){
      if(t.id === "c3.t3-t4") return I("ordre_A_court") + " : " + t.sons.map(sonTexte).join(" / ") + " — " + I("ordre_B_court") + " : " + t.sons.slice().reverse().map(sonTexte).join(" / ");
      return t.dit + (t.note ? " (" + I("confirmation_erronee") + ")" : "");
    });
    p.appendChild(document.createTextNode(pause(parts.join(" · ")) + " — " + I("il_veut") + " " + cv.il_veut));
    s5.appendChild(p);
  });
  haut.appendChild(s5);
  var gb = el("div", "fmt-fiche-bloc"); gb.appendChild(el("h4", "fmt-sous-titre", F().grille.titre));
  var lignesG = F().grille.criteres.map(function(c){ return [c.nom + " — " + c.question].concat(c.niveaux.map(function(n){ return n.valeur + " : " + n.descripteur; })); });
  gb.appendChild(tableau([I("critere"), "0", "1", "2"], lignesG, "fmt-fiche-grille"));
  gb.appendChild(el("p", "fmt-note", pause(F().grille.malentendu.nom + " : " + F().grille.malentendu.etats.map(function(e){ return e.bouton; }).join(" / "))));
  haut.appendChild(gb); f.appendChild(haut);
  f.appendChild(tableau(P.colonnes, P.items.map(lignesFiche), "fmt-fiche-obs"));
  f.appendChild(el("p", "fmt-fiche-pied", pause(P.pied)));
  return f;
}
function ongletFiche(pan){
  titreSection(pan, I("fiche_onglet_titre"));
  var r = el("div", "row fmt-pas-imprimer");
  r.appendChild(btn("btn btn-primary", I("imprimer"), function(){ try{ window.print(); }catch(e){ S.annoncer(I("impression_indisponible")); } }));
  pan.appendChild(r);
  pan.appendChild(el("p", "fmt-note fmt-pas-imprimer", pause(I("imprimer_aide"))));
  pan.appendChild(ficheImprimable());
}

/* ---------------- (e) pilote ---------------- */
function rendu(v, parent, niv){
  if(v == null) return;
  if(typeof v !== "object"){ parent.appendChild(el("p", "fmt-texte", pause(String(v)))); return; }
  if(Array.isArray(v)){
    if(!v.length) return;
    if(typeof v[0] === "object" && !Array.isArray(v[0])){
      var cles = []; v.forEach(function(o){ Object.keys(o).forEach(function(k){ if(cles.indexOf(k) < 0) cles.push(k); }); });
      parent.appendChild(tableau(cles.map(humaniser), v.map(function(o){ return cles.map(function(k){ var x = o[k]; return x == null ? "" : typeof x === "object" ? JSON.stringify(x) : pause(String(x)); }); })));
    } else {
      var ul = el("ul", "fmt-liste"); v.forEach(function(x){ ul.appendChild(el("li", null, pause(String(x)))); }); parent.appendChild(ul);
    }
    return;
  }
  Object.keys(v).forEach(function(k){
    if(k === "titre") return;
    var x = v[k];
    if(x == null) return;
    if(typeof x !== "object"){
      var p = el("p", "fmt-texte"); p.appendChild(el("b", null, humaniser(k) + " : ")); p.appendChild(document.createTextNode(pause(String(x)))); parent.appendChild(p);
    } else {
      parent.appendChild(el("h" + Math.min(6, niv + 1), "fmt-sous-titre", humaniser(k)));
      rendu(x, parent, niv + 1);
    }
  });
}
function section(pan, titre, donnees, ouvert){
  var d = el("details", "fmt-section"); if(ouvert) d.open = true;
  d.appendChild(el("summary", null, titre)); var c = el("div", "fmt-section-corps");
  rendu(donnees, c, 4); d.appendChild(c); pan.appendChild(d); return d;
}
function ongletPilote(pan){
  var P = F().protocole_pilote;
  titreSection(pan, I("pilote_titre"));
  pan.appendChild(el("p", "fmt-bandeau", pause(P.statut)));
  var d = el("details", "fmt-section"); d.open = true; d.appendChild(el("summary", null, P.titre));
  var c = el("div", "fmt-section-corps");
  c.appendChild(el("h4", "fmt-sous-titre", I("pilote_avant")));
  rendu(P.avant, c, 4);
  c.appendChild(el("h4", "fmt-sous-titre", I("pilote_pendant")));
  c.appendChild(tableau([I("col_moment"), I("col_je_fais"), I("col_je_note")], P.pendant.map(function(x){ return [pause(x.moment), pause(x.je_fais), pause(x.je_note)]; })));
  c.appendChild(bloc(I("pilote_regle"), P.regle_d_or));
  c.appendChild(bloc(I("pilote_j7"), P.j_plus_7));
  c.appendChild(bloc(I("pilote_double"), P.double_notation));
  c.appendChild(el("h4", "fmt-sous-titre", I("pilote_rapporter"))); rendu(P.rapporter, c, 4);
  c.appendChild(el("h4", "fmt-sous-titre", I("pilote_criteres")));
  c.appendChild(el("p", "fmt-note", pause(P.criteres_figes.mention + " " + I("provisoire"))));
  c.appendChild(tableau([I("col_sequence"), I("col_critere"), I("col_lire")], P.criteres_figes.lignes.map(function(x){ return [x.sequence, pause(x.critere), pause(x.lire_dans)]; })));
  c.appendChild(el("p", "fmt-texte", I("pilote_date_signature")));
  d.appendChild(c); pan.appendChild(d);
  var L = F().limites, dl = el("details", "fmt-section"); dl.open = true; dl.appendChild(el("summary", null, L.titre));
  var cl = el("div", "fmt-section-corps"), ol = el("ol", "fmt-liste"); L.lignes.forEach(function(x){ ol.appendChild(el("li", null, pause(x))); }); cl.appendChild(ol);
  cl.appendChild(el("p", "fmt-note", pause(L.seuils + " " + I("provisoire")))); dl.appendChild(cl); pan.appendChild(dl);
  section(pan, F().note_linguistique.titre, F().note_linguistique);
  section(pan, F().mesures_film.titre, F().mesures_film);
  section(pan, F().note_voix.titre, F().note_voix);
  section(pan, F().statut.titre, F().statut);
  section(pan, I("points_ouverts"), {contenu: F().points_ouverts_03, suivi: F().points_ouverts_suivi});
  if(F().diagnostic_sons) section(pan, I("diagnostic_sons"), F().diagnostic_sons);
}

/* ======================================================================
   4. SUIVI ET EXPORT (journal complet du formateur)
   ====================================================================== */
function codeApprenant(){ var a = E().apprenant; return a && String(a).trim() ? String(a).trim() : "moi"; }
function codeFichier(){ return codeApprenant().replace(/[^A-Za-z0-9_-]+/g, "_").slice(0, 40) || "moi"; }
function audioDe(item){
  if(COMPR[item] && COMPR[item].son) return COMPR[item].son;
  var r = null;
  C.ecrans.forEach(function(e){ (e.pas || []).forEach(function(p){ if(p.item === item && (p.son || p.extrait)) r = p.son || p.extrait; }); });
  return r;
}
function aidesAvant(ecran, item, t){
  var b = {ecoutes: 0, images: false, texte: false, langue: "aucune", voix_lente: false, relances: 0, retour: false};
  (E().journal || []).forEach(function(x){
    if(x.i !== item || (ecran && x.e !== ecran && x.e !== String(ecran).toUpperCase() && String(x.e).toLowerCase() !== String(ecran).toLowerCase()) || (t && x.t > t)) return;
    if(x.ev === "ecoute" || x.ev === "reecoute") b.ecoutes++;
    else if(x.ev === "lent") b.voix_lente = true;
    else if(x.ev === "images") b.images = true;
    else if(x.ev === "texte") b.texte = true;
    else if(x.ev === "aide_langue") b.langue = x.d || E().aide || "es";
    else if(x.ev === "relance") b.relances++;
    else if(x.ev === "retour") b.retour = true;
  });
  return b;
}
function exactitude(item, valeur, juste){
  var reg = COMPR[item];
  if(valeur == null || valeur === "" || valeur === "rien" || valeur === "nsp" || valeur === "ne_sais_pas") return "non_donnee";
  if(valeur === "dit") return "non_observee";
  var v = NOMBRES[String(valeur)] || String(valeur);
  if(reg && reg.attendue){ return reg.attendue.indexOf(v) >= 0 || reg.attendue.indexOf(S.norm(v)) >= 0 ? "correcte" : "incorrecte"; }
  if(juste === true) return "correcte";
  if(juste === false) return "incorrecte";
  return "non_donnee";
}
function sequenceDe(item){
  var m = /^S(\d)/.exec(item); if(m) return "S" + m[1];
  return COMPR[item] ? COMPR[item].seq : "";
}
function cleC(o){
  var a = o.aides || {};
  return [o.condition, o.support, o.nb_choix ? "choix" + o.nb_choix : "libre", "txt_" + o.texte_visible, "ec" + (o.ecoutes >= 3 ? "3+" : o.ecoutes),
    "img" + (a.images ? 1 : 0), "tx" + (a.texte ? 1 : 0), "l1" + (a.langue && a.langue !== "aucune" ? 1 : 0), "lent" + (a.voix_lente ? 1 : 0),
    "rel" + (a.relances > 0 ? 1 : 0), "ret" + (o.retour_avant ? 1 : 0), o.palier, o.saisi_par].join("|");
}
function cleP(p){
  var a = p.aides || {};
  return [p.condition, "img" + (a.images ? 1 : 0), "tx" + (a.texte ? 1 : 0), "l1" + (a.langue && a.langue !== "aucune" ? 1 : 0), "lent" + (a.voix_lente ? 1 : 0),
    "souffle" + (a.mot_souffle ? 1 : 0), "rel" + (p.relances > 0 ? 1 : 0), p.palier].join("|");
}
function construireJournal(){
  var e = E(), o = options(), date = maintenant().slice(0, 10), mode = e.mode || "formateur", palier = PALIERS[e.palier] || "normal";
  var comp = [], prod = [], autres = [];
  var A = o.forme_banque !== "B";
  Object.keys(e.rep || {}).forEach(function(cle){
    var k = cle.indexOf("/"), ecran = cle.slice(0, k), item = cle.slice(k + 1);
    (e.rep[cle] || []).forEach(function(r){
      if(!/^[A-Z]\d-C\d/.test(item)){ autres.push({cle: cle, condition: r.cond, valeur: r.valeur, t: r.t}); return; }
      var reg = COMPR[item] || {}, cond = CONDITIONS[r.cond] || r.cond, a = aidesAvant(ecran, item, r.t), film = !!FILM[item];
      var l = {item: item, sequence: sequenceDe(item), moment: momentDe(item), information: reg.info || null, audio_id: audioDe(item),
        voix: film ? "film" : (VOIX_HUMAINES ? "humaine" : "synthese"), support: film ? "film_youtube" : "audio_seul", condition: cond,
        texte_visible: film ? "non_controle" : (a.texte ? "oui" : "non"), nb_choix: cond === "p1" ? 0 : (reg.valeurs ? reg.valeurs.length - 2 : 2),
        retour_avant: a.retour, reponse: exactitude(item, r.valeur, r.juste), valeur: r.valeur == null ? null : r.valeur, attendue: reg.attendue || [],
        ecoutes: Math.max(1, a.ecoutes), aides: {images: a.images, texte: a.texte, langue: a.langue, voix_lente: a.voix_lente, relances: a.relances},
        palier: palier, saisi_par: mode === "groupe" ? "groupe" : "apprenant", ecart_protocole: null, t: r.t};
      if(reg.forme) l.forme = reg.forme;
      l.cle_condition = cleC(l); comp.push(l);
    });
  });
  Object.keys(grille()).forEach(function(item){
    var g = grille()[item];
    if(g.entendue && COMPR[item]){
      var reg = COMPR[item], a = aidesAvant(null, item, g.entendue.t), film = !!FILM[item];
      var l = {item: item, sequence: sequenceDe(item), moment: momentDe(item), information: reg.info, audio_id: audioDe(item), voix: VOIX_HUMAINES ? "humaine" : "synthese",
        support: "audio_seul", condition: "p1", texte_visible: "non", nb_choix: 0, retour_avant: false, reponse: exactitude(item, g.entendue.valeur),
        valeur: g.entendue.valeur, attendue: reg.attendue, ecoutes: 1, aides: {images: false, texte: false, langue: "aucune", voix_lente: false, relances: a.relances},
        palier: palier, saisi_par: "formateur", ecart_protocole: null, t: g.entendue.t};
      if(film) l.texte_visible = "non_controle";
      if(reg.forme) l.forme = reg.forme;
      l.cle_condition = cleC(l); comp.push(l);
    }
    var def = PROD.filter(function(p){ return p.id === item; })[0];
    if(def && !g.entendue){
      var tous = aidesAvant(null, item, null);
      var p = {item: item, sequence: sequenceDe(item), moment: "seance", tache: libelleItem(item), condition: def.condition, production: g.production || "faite",
        malentendu: g.reparation && g.reparation !== "non_sollicite" ? (item === "S5-P3" ? "confirmation_erronee" : "spontane") : "aucun",
        relances: g.relances || 0, demandes_repetition: g.demandes_repetition || 0,
        aides: {images: tous.images, texte: tous.texte, langue: tous.langue, voix_lente: tous.voix_lente, mot_souffle: !!g.mot_souffle},
        notations: [], auto: null, enregistrement: {fait: false, duree_s: null, fichier: null}, palier: palier, ecart_protocole: null, note: g.note || null, t: g.t || maintenant()};
      if(mode !== "seul"){
        p.notations.push({juge: g.juge || "F1", moment_notation: g.moment_notation || "direct",
          sens: p.production === "aucune" ? null : (g.sens == null ? null : g.sens), reponse_adaptee: p.production === "aucune" ? null : (g.reponse_adaptee == null ? null : g.reponse_adaptee),
          groupe: p.production === "aucune" ? null : (g.groupe == null ? null : g.groupe), reparation: p.production === "aucune" ? null : (g.reparation || null), t: g.t || maintenant()});
      }
      p.cle_condition = cleP(p); prod.push(p);
    }
  });
  var items_np = o.perimetre_reduit ? PERIMETRE_REDUIT.items_non_proposes : [];
  items_np.forEach(function(item){
    if(COMPR[item] && !comp.some(function(x){ return x.item === item; })) comp.push({item: item, sequence: sequenceDe(item), moment: "seance", condition: "p1", reponse: "non_propose", t: date + "T00:00:00.000Z"});
    if(/-P\d/.test(item) && !prod.some(function(x){ return x.item === item; })){
      var d = PROD.filter(function(p){ return p.id === item; })[0];
      prod.push({item: item, sequence: sequenceDe(item), moment: "seance", condition: d ? d.condition : null, production: "non_propose", notations: [], t: date + "T00:00:00.000Z"});
    }
  });
  function parT(a, b){ return a.t < b.t ? -1 : a.t > b.t ? 1 : 0; }
  var dur = Object.keys(durees()).map(function(id){
    var x = durees()[id], ec = ecranDe(id);
    return {sequence: id.toUpperCase(), prevu_s: ec && ec.duree_min != null ? ec.duree_min * 60 : null, debut: x.debut || null, fin: x.fin || null, actif_s: Math.round(x.actif_s || 0), visites: x.visites || 0};
  });
  var notes = [];
  Object.keys(grille()).forEach(function(item){ var g = grille()[item]; if(g.note) notes.push({sequence: sequenceDe(item), item: item, texte: g.note, t: g.t}); });
  return {
    schema: C.export.schema,
    atelier: {id: C.meta.id, version_contenu: C.version, protocole: "A4-1", criteres_figes_le: null},
    apprenant: {code: codeApprenant(), rang_pilote: o.rang === "" ? null : (parseInt(o.rang, 10) || null), langue_declaree: null},
    seance: {id: codeApprenant() + "-" + date, date: date, mode: mode, palier_depart: palier, langue_aide: e.aide || "aucune", langue_aide_choisie_apres: null,
      forme_depart: A ? "D" : "T", forme_sortie: A ? "T" : "D", montage: o.montage, lieu_saisie_formateur: o.lieu_saisie, grille_visible_apprenant: o.lieu_saisie === "meme_ecran",
      appareil: null, son: null, voix_humaines_disponibles: VOIX_HUMAINES, juges: ["F1"]},
    passations: [{moment: "seance", date: date, mode: mode, forme: null}],
    perimetre: {reduit: !!o.perimetre_reduit, decide_a: o.perimetre_reduit ? "avant_S0" : null, paiement: o.perimetre_reduit ? PERIMETRE_REDUIT.paiement : "production",
      sequences_allegees: o.perimetre_reduit ? PERIMETRE_REDUIT.sequences_allegees : [], items_non_proposes: items_np, motif: o.perimetre_reduit ? (o.perimetre_motif || I("perimetre_motif_defaut")) : null},
    durees: dur, preparation_formateur_min: o.preparation_min === "" ? null : (parseFloat(o.preparation_min) || null),
    comprehension: comp.sort(parT), production: prod.sort(parT), effort: null, descriptions_approx: null,
    notes_formateur: notes, reponses_autres: autres,
    evenements: (e.journal || []).map(function(x){ var r = {t: x.t, ecran: x.e, item: x.i, type: x.ev}; if(x.d != null) r.detail = x.d; return r; }),
    export: {vue: "formateur", mesures_automatiques: "aucune"}
  };
}
function libVal(v){ return v == null ? "—" : (I("valeurs." + v) !== "[valeurs." + v + "]" ? I("valeurs." + v) : String(v)); }
function texteExport(j){
  var L = [], s = j.seance, K = F();
  L.push(I("export_titre"));
  L.push(I("export_date") + " " + dateFr(s.date) + " · " + I("export_code") + " " + (j.apprenant.code || "—"));
  L.push(I("export_cours") + " " + I("mode." + s.mode) + " · " + I("export_niveau") + " " + I("palier." + s.palier_depart) + " · " + I("export_aide") + " " + I("aide." + s.langue_aide));
  L.push(I("export_pas_examen"));
  L.push(""); L.push(I("export_comprehension"));
  var vus = {}; j.comprehension.forEach(function(o){ (vus[o.item] = vus[o.item] || []).push(o); });
  Object.keys(vus).forEach(function(item){
    L.push(libelleItem(item));
    vus[item].forEach(function(o){
      var cnd = I("cond." + o.condition);
      if(o.reponse === "non_propose") L.push("  " + I("export_non_propose"));
      else if(o.reponse === "non_donnee") L.push("  " + cnd + " : " + I("export_pas_de_reponse"));
      else if(o.reponse === "non_observee") L.push("  " + cnd + " : " + I("export_non_observee"));
      else L.push("  " + cnd + " : " + libVal(o.valeur) + " — " + (o.reponse === "correcte" ? I("export_attendue") : I("export_autre") + " (" + I("export_bonne") + " " + (o.attendue || []).map(libVal).join(" / ") + ")"));
      var a = o.aides || {}, ai = [];
      if(a.images) ai.push(I("aide_images")); if(a.texte) ai.push(I("aide_texte")); if(a.langue && a.langue !== "aucune") ai.push(I("aide." + a.langue)); if(a.voix_lente) ai.push(I("aide_lente"));
      if(a.relances) ai.push(I("export_relances") + " " + a.relances);
      if(o.reponse !== "non_propose") L.push("    " + I("export_ecoutes") + " " + o.ecoutes + " · " + I("export_aides") + " " + (ai.length ? ai.join(", ") : I("export_aucune")));
    });
  });
  if(!j.comprehension.length) L.push(I("export_rien"));
  var reste = j.reponses_autres.length;
  if(reste) L.push(I("export_autres_reponses") + " " + reste);
  L.push(""); L.push(C.export.partie_formateur_gabarit[0]);
  L.push("Protocole " + j.atelier.protocole + " · " + I("export_forme") + " " + s.forme_depart + " / " + s.forme_sortie + " · " + I("export_voix") + " " + (s.voix_humaines_disponibles ? I("export_voix_humaines") : I("export_voix_synthese")));
  L.push("Périmètre : " + (j.perimetre.reduit ? "réduit — " + j.perimetre.motif + " — non proposés : " + j.perimetre.items_non_proposes.join(", ") : "complet"));
  L.push(C.export.partie_formateur_gabarit[3]);
  function v(x){ return x == null ? "—" : x; }
  j.production.forEach(function(p){
    if(p.production === "non_propose"){ L.push(p.item + " · " + I("export_non_propose")); return; }
    var a = p.aides, ai = [];
    if(a.images) ai.push(I("aide_images")); if(a.texte) ai.push(I("aide_texte")); if(a.langue && a.langue !== "aucune") ai.push(I("aide." + a.langue)); if(a.voix_lente) ai.push(I("aide_lente"));
    var fin = " · relances " + p.relances + " · « Pardon ? » " + p.demandes_repetition + " · mot soufflé " + (a.mot_souffle ? "oui" : "non") + " · aides " + (ai.length ? ai.join(", ") : I("export_aucune"));
    if(p.production === "aucune"){ L.push(p.item + " · pas de réponse" + fin); return; }
    if(!p.notations.length){ L.push(p.item + " · " + I("export_non_note") + fin); return; }
    p.notations.forEach(function(n){
      L.push(p.item + " · " + p.condition + " · juge " + n.juge + " (" + n.moment_notation + ") · sens " + v(n.sens) + " · réponse " + v(n.reponse_adaptee) + " · groupe " + v(n.groupe)
        + " · malentendu " + (n.reparation ? I("reparation." + n.reparation) : "—") + fin);
    });
  });
  if(j.notes_formateur.length){ L.push(C.export.partie_formateur_gabarit[6]); j.notes_formateur.forEach(function(n){ L.push((n.item || n.sequence || "") + " : " + n.texte); }); }
  if(j.durees.length){ L.push(I("export_temps")); L.push(j.durees.map(function(d){ return d.sequence + " " + Math.max(1, Math.round(d.actif_s / 60)); }).join(" · ")); }
  L.push(C.export.partie_formateur_gabarit[8]);
  return L.join("\n");
}
function csvExport(j){
  var cols = C.export.csv.colonnes, R = [];
  function on(b){ return b ? "oui" : "non"; }
  function cell(x){ if(x == null) return ""; var s = Array.isArray(x) ? x.join("|") : String(x); return /[";\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
  var base = {schema: j.schema, code: j.apprenant.code, perimetre_reduit: on(j.perimetre.reduit), mode: j.seance.mode};
  j.comprehension.forEach(function(o){
    var a = o.aides || {}, reg = COMPR[o.item] || {};
    R.push(Object.assign({}, base, {date: o.t.slice(0, 10), moment: o.moment, palier: o.palier, type: "C", sequence: o.sequence, item: o.item, information: o.information, forme: o.forme,
      audio_id: o.audio_id, voix: o.voix, support: o.support, condition: o.condition, texte_visible: o.texte_visible, nb_choix: o.nb_choix, retour_avant: o.retour_avant == null ? "" : on(o.retour_avant),
      cle_condition: o.cle_condition, reponse: o.reponse, valeur: o.valeur, attendue: o.attendue, ecoutes: o.ecoutes,
      aide_images: o.reponse === "non_propose" ? "" : on(a.images), aide_texte: o.reponse === "non_propose" ? "" : on(a.texte), aide_langue: a.langue, voix_lente: o.reponse === "non_propose" ? "" : on(a.voix_lente), relances: a.relances,
      saisi_par: o.saisi_par, ecart_protocole: o.ecart_protocole, horodatage: o.t}));
  });
  j.production.forEach(function(p){
    var a = p.aides || {};
    var debut = Object.assign({}, base, {date: p.t.slice(0, 10), moment: p.moment, palier: p.palier, type: "P", sequence: p.sequence, item: p.item, information: "production", condition: p.condition,
      production: p.production, horodatage: p.t});
    if(p.production === "non_propose"){ R.push(debut); return; }
    var commun = Object.assign(debut, {voix: "formateur_direct", support: "direct", cle_condition: p.cle_condition, aide_images: on(a.images), aide_texte: on(a.texte), aide_langue: a.langue,
      voix_lente: on(a.voix_lente), relances: p.relances, mot_souffle: on(a.mot_souffle), demandes_repetition: p.demandes_repetition, malentendu: p.malentendu, ecart_protocole: p.ecart_protocole, note: p.note});
    if(!p.notations.length){ R.push(Object.assign({}, commun, {saisi_par: "apprenant"})); return; }
    p.notations.forEach(function(n){ R.push(Object.assign({}, commun, {sens: n.sens, reponse_adaptee: n.reponse_adaptee, groupe: n.groupe, reparation: n.reparation, juge: n.juge, moment_notation: n.moment_notation, saisi_par: "juge", horodatage: n.t})); });
  });
  return "﻿" + [cols.join(";")].concat(R.map(function(r){ return cols.map(function(c){ return cell(r[c]); }).join(";"); })).join("\r\n") + "\r\n";
}
function nomFichier(ext){ return "rendez-vous-a1-v2_" + codeFichier() + "_" + maintenant().slice(0, 10) + "." + ext; }

/* --- (f) suivi --- */
function valeurEtJuste(r){ return libVal(r.valeur) + (r.juste === true ? " (" + I("export_attendue") + ")" : r.juste === false ? " (" + I("export_autre") + ")" : ""); }
function resumeAides(ecran, item){
  var n = {}, ordre = [];
  S.journal.lignes(ecran, item).forEach(function(x){ if(!n[x.ev]){ n[x.ev] = 0; ordre.push(x.ev); } n[x.ev]++; });
  return ordre.length ? ordre.map(function(ev){ return (S.EVENEMENTS[ev] || ev) + " ×" + n[ev]; }).join(", ") : "—";
}
function ongletSuivi(pan, choisir){
  titreSection(pan, I("suivi_titre"));
  pan.appendChild(el("p", "fmt-note", pause(I("suivi_aide"))));
  /* tableau de compréhension : exactitude (4 conditions) et aides, deux colonnes de nature différente */
  var items = {}, ordre = [];
  function item(cle){ if(!items[cle]){ items[cle] = {ecran: null, item: cle, conds: {}, entendue: null}; ordre.push(cle); } return items[cle]; }
  Object.keys(E().rep || {}).forEach(function(cle){
    var k = cle.indexOf("/"), ecran = cle.slice(0, k), id = cle.slice(k + 1);
    if(!/^[A-Z]\d-C\d/.test(id)) return;
    var x = item(id); x.ecran = ecran;
    (E().rep[cle] || []).forEach(function(r){ var c = CONDITIONS[r.cond] || r.cond; x.conds[c] = valeurEtJuste(r); });
  });
  Object.keys(grille()).forEach(function(id){ var g = grille()[id]; if(g.entendue && COMPR[id]){ var x = item(id); x.entendue = libVal(g.entendue.valeur); } });
  var tete = [I("col_item"), I("cond.p1"), I("cond.apres_images"), I("cond.apres_reecoute"), I("cond.apres_texte"), I("col_aides")];
  var lignes = ordre.map(function(id){
    var x = items[id], p1 = [x.entendue ? I("entendue_court") + " : " + x.entendue : null, x.conds.p1 || null].filter(Boolean).join(" · ") || "—";
    return [id, p1, x.conds.apres_images || "—", x.conds.apres_reecoute || "—", x.conds.apres_texte || "—", resumeAides(x.ecran, id)];
  });
  var h = el("h4", "fmt-sous-titre", I("suivi_comprehension")); pan.appendChild(h);
  pan.appendChild(el("p", "fmt-note", I("suivi_deux_colonnes")));
  if(lignes.length) pan.appendChild(tableau(tete, lignes, "fmt-suivi")); else pan.appendChild(el("p", "fmt-note", I("suivi_vide")));
  /* prises de parole */
  pan.appendChild(el("h4", "fmt-sous-titre", I("suivi_paroles")));
  var lp = Object.keys(grille()).filter(function(id){ return !grille()[id].entendue; }).map(function(id){
    var g = grille()[id], aucune = g.production === "aucune";
    function v(x){ return aucune || x == null ? "—" : String(x); }
    return [id, aucune ? I("pas_de_reponse") : "", v(g.sens), v(g.reponse_adaptee), v(g.groupe), aucune || !g.reparation ? "—" : I("reparation." + g.reparation), String(g.relances || 0), String(g.demandes_repetition || 0), g.mot_souffle ? "oui" : "non", g.note || ""];
  });
  if(lp.length) pan.appendChild(tableau([I("col_item"), "", I("grille_sens"), I("grille_reponse"), I("grille_groupe"), I("grille_malentendu"), I("relances"), I("demande_repeter"), I("mot_souffle"), I("note")], lp, "fmt-suivi"));
  else pan.appendChild(el("p", "fmt-note", I("suivi_vide")));
  /* durées */
  pan.appendChild(el("h4", "fmt-sous-titre", I("suivi_durees")));
  var ld = C.ecrans.map(function(e){ return dureeLigne(e.id); }).filter(function(x){ return x !== "—"; });
  if(ld.length){ var ul = el("ul", "fmt-liste"); ld.forEach(function(x){ ul.appendChild(el("li", null, x)); }); pan.appendChild(ul); } else pan.appendChild(el("p", "fmt-note", I("suivi_pas_de_duree")));
  /* export */
  pan.appendChild(el("h4", "fmt-sous-titre", I("export_formateur")));
  pan.appendChild(el("p", "fmt-note", pause(C.export.note + " " + I("export_formateur_aide"))));
  var r = el("div", "row fmt-export"), etat = el("p", "fmt-note"); etat.setAttribute("role", "status");
  r.appendChild(btn("btn btn-primary", I("export_texte"), function(){ S.ouvrirExport(texteExport(construireJournal()), I("export_formateur")); }));
  r.appendChild(btn("btn", I("export_csv"), function(){ S.telecharger(nomFichier("csv"), csvExport(construireJournal()), "text/csv;charset=utf-8"); etat.textContent = nomFichier("csv"); }));
  r.appendChild(btn("btn", I("export_json"), function(){ S.telecharger(nomFichier("json"), JSON.stringify(construireJournal(), null, 2), "application/json"); etat.textContent = nomFichier("json"); }));
  pan.appendChild(r); pan.appendChild(etat);
  /* nouvelle séance */
  pan.appendChild(el("h4", "fmt-sous-titre", I("nouvelle_seance")));
  pan.appendChild(el("p", "fmt-note", pause(I("nouvelle_seance_aide"))));
  var zone = el("div", "fmt-confirmation"); var ouvrir = btn("btn", I("nouvelle_seance"), function(){ confirmation(zone, ouvrir); });
  ouvrir.dataset.action = "nouvelle-seance"; pan.appendChild(ouvrir); pan.appendChild(zone);
}
function confirmation(zone, ouvrir){
  zone.innerHTML = ""; zone.setAttribute("role", "alertdialog"); zone.setAttribute("aria-label", I("nouvelle_seance"));
  zone.appendChild(el("p", "fmt-attention", pause(I("confirm_propose_export"))));
  var r = el("div", "row");
  var exp = btn("btn", I("confirm_exporter"), function(){ S.telecharger(nomFichier("json"), JSON.stringify(construireJournal(), null, 2), "application/json"); s2.textContent = I("confirm_exporte"); });
  var s2 = el("p", "fmt-note"); s2.setAttribute("role", "status");
  var efface = btn("btn btn-primary", I("confirm_effacer"), function(){
    zone.innerHTML = "";
    zone.appendChild(el("p", "fmt-attention", pause(I("confirm_derniere"))));
    var r2 = el("div", "row");
    var oui = btn("btn btn-primary", I("confirm_oui"), function(){
      S.effacerTout(); SUIVI_ECRAN = null; DERNIER = null;
      zone.innerHTML = ""; zone.appendChild(el("p", "fmt-note", I("confirm_fait"))); S.annoncer(I("confirm_fait"));
      if(API.aller) API.aller("accueil");
    });
    oui.dataset.action = "confirmer-effacement";
    var non = btn("btn", I("annuler"), function(){ zone.innerHTML = ""; ouvrir.focus(); });
    r2.appendChild(oui); r2.appendChild(non); zone.appendChild(r2); non.focus();
  });
  efface.dataset.action = "effacer";
  var ann = btn("btn", I("annuler"), function(){ zone.innerHTML = ""; ouvrir.focus(); });
  r.appendChild(exp); r.appendChild(efface); r.appendChild(ann); zone.appendChild(r); zone.appendChild(s2); exp.focus();
}

var RENDUS = {deroule: ongletDeroule, avant: ongletAvant, sons: ongletSons, fiche: ongletFiche, pilote: ongletPilote, suivi: ongletSuivi};

/* ======================================================================
   5. INITIALISATION
   ====================================================================== */
function chargerCss(){
  if(document.querySelector("link[data-formateur]")) return;
  var href = SCRIPT ? SCRIPT.replace(/formateur\.js/, "formateur.css") : "scripts/formateur.css";
  var l = document.createElement("link"); l.rel = "stylesheet"; l.href = href; l.setAttribute("data-formateur", "1");
  (document.head || document.documentElement).appendChild(l);
}
function init(api){
  API = api; S = api.Socle; C = api.CONTENU;
  if(!api.modeVue) API.modeVue = /[?&]vue=formateur\b/.test(location.search) ? "formateur" : "apprenant";
  chargerCss();
  options(); grille();
  if(vue() === "formateur") document.body.classList.add("vue-formateur");
  window.addEventListener("storage", surStockage);
  document.addEventListener("visibilitychange", surVisibilite);
  window.addEventListener("pagehide", function(){ if(vue() !== "formateur"){ fermerChrono(); try{ S.sauver(); }catch(e){} } });
  try{ var p = S.sons.manifeste && S.sons.manifeste(); if(p && p.then) p.then(function(m){ VOIX_HUMAINES = !!(m && Object.keys(m.clips || {}).some(function(k){ return m.clips[k] && m.clips[k].humain; })); }); }catch(e){}
  DERNIER = idDe(E().ecran);
  if(vue() !== "formateur" && DERNIER) surChangementEcran(DERNIER);
  return window.FORMATEUR;
}

window.FORMATEUR = {
  init: init, carteEcran: carteEcran, ouvrirEspace: ouvrirEspace, surChangementEcran: surChangementEcran,
  /* pour les tests et pour le moteur */
  _journal: function(){ return construireJournal(); }, _texte: function(){ return texteExport(construireJournal()); }, _csv: function(){ return csvExport(construireJournal()); }
};
})();
