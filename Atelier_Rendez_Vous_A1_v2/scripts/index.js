/* ======================================================================
   ATELIER « AU CAFÉ — COMPRENDRE, COMMANDER ET PAYER » (A1) — MOTEUR DES ÉCRANS
   Scripts classiques (pas de module), sans dépendance. S'appuie sur :
     window.CONTENU (contenu.js, données seulement), window.PICTOS (pictos.js),
     window.Socle (socle.js : sons, film, micro, journal, export), window.JOURNAL (journal.js),
     window.FORMATEUR (formateur.js, facultatif : l'atelier fonctionne sans lui).
   Tout texte vu par l'apprenant vient de CONTENU (interface, écrans, aides, bilan).
   Aucune mesure automatique de la voix : ni courbe, ni chiffre, ni verdict (erreurs P0 de l'ancien atelier).

   Plan du fichier :
     1. bases (libellés, état, images, conditions si/variantes)
     2. coque de la page (barre du haut, étapes, bandeau des réglages, pied de page)
     3. écran : rendu pas à pas, navigation Retour / Suite (K8), chronomètre discret
     4. blocs simples (texte, réglages, aide dans ma langue, carte de rôles, choix d'images, film, dialogue…)
     5. écoute sans texte (schéma E, K3) et question du serveur (K4)
     6. conversations de S5, bilan de S6, export, après le cours
     7. démarrage et interface avec l'espace formateur
   ====================================================================== */
(function(){
"use strict";

var C = window.CONTENU, S = window.Socle, J = window.JOURNAL, PICTOS = window.PICTOS || {};
if(!C || !S || !J){ if(window.console) console.error("Atelier : contenu.js, socle.js ou journal.js manque."); return; }

var VERSION = "20261007-3";                 /* même valeur que le ?v= de index.html */
var VUE_FORMATEUR = /[?&]vue=formateur(&|$)/.test(location.search);
var MANQUES = [];                            /* libellés d'interface introuvables (contrôlé par les tests) */
var ERREURS = [];                            /* erreurs attrapées pendant le rendu d'un bloc (contrôlé par les tests) */

/* ======================================================================
   1. BASES
   ====================================================================== */
/* Tous les libellés de CONTENU.interface dans une seule table. */
var LIB = {};
Object.keys(C.interface).forEach(function(g){
  var o = C.interface[g];
  if(o && typeof o === "object") Object.keys(o).forEach(function(k){ if(!(k in LIB)) LIB[k] = o[k]; });
});
function T(cle, vars){
  var t = LIB[cle];
  if(t == null){ if(MANQUES.indexOf(cle) < 0) MANQUES.push(cle); t = String(cle).replace(/_/g, " "); }
  if(vars) Object.keys(vars).forEach(function(k){ t = t.split("{" + k + "}").join(vars[k]); });
  return t;
}
/* Libellé sans le symbole de tête (le socle ajoute déjà ▶ ■ ●) */
function nu(cle, vars){ return T(cle, vars).replace(/^(?:[▶■●]|🔊)\s*/u, ""); }

function E(){ return S.etat(); }
function el(tag, cls, txt){ return S.el(tag, cls, txt); }
function bouton(cls, txt, fn){ return S.bouton(cls, txt, fn); }
function copie(o){ return JSON.parse(JSON.stringify(o)); }
function hasard(n){ return Math.floor(Math.random() * n); }
function codeEcran(id){ return id === "accueil" ? "ACCUEIL" : id === "apres" ? "APRES" : String(id).toUpperCase(); }
function traceDe(b){ var t = b.trace; return Array.isArray(t) ? t[0] : (t || b.id); }
function reduit(){ return !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches); }

/* --- conditions « si » et variantes (B1 §2) --- */
function siOk(si){
  if(!si) return true;
  var e = E();
  if(si.mode && si.mode.indexOf(e.mode) < 0) return false;
  if(si.palier && si.palier.indexOf(e.palier) < 0) return false;
  if(si.option && !(e.options && e.options[si.option])) return false;
  return true;
}
function poserChemin(obj, chemin, valeur){
  var p = chemin.split("."), o = obj;
  for(var i = 0; i < p.length - 1; i++){ if(o[p[i]] == null || typeof o[p[i]] !== "object") o[p[i]] = {}; o = o[p[i]]; }
  if(valeur === null) delete o[p[p.length - 1]]; else o[p[p.length - 1]] = copie(valeur);
}
/* Copie du bloc avec les variantes qui s'appliquent (mode, palier, options), dans l'ordre. */
function avecVariantes(b){
  var r = copie(b);
  (b.variantes || []).forEach(function(v){
    if(siOk(v.si)) Object.keys(v.set || {}).forEach(function(k){ poserChemin(r, k, v.set[k]); });
  });
  delete r.variantes;
  return r;
}

/* --- images --- */
function altDe(id){ return (PICTOS[id] && PICTOS[id].alt) || (C.images[id] && C.images[id].alt) || String(id); }
function picto(id, taille){
  var d = PICTOS[id]; if(!d) return null;
  var tmp = document.createElement("div"); tmp.innerHTML = d.svg;
  var svg = tmp.firstChild;
  svg.setAttribute("class", "picto" + (taille ? " " + taille : ""));
  svg.setAttribute("aria-hidden", "true"); svg.setAttribute("focusable", "false"); svg.setAttribute("data-image", id);
  return svg;
}
/* Image de contexte (le café, le comptoir…) : jamais une image de réponse. */
function figure(id, taille){
  var f = el("figure", "contexte"); f.setAttribute("role", "img"); f.setAttribute("aria-label", altDe(id));
  var p = picto(id, taille || "moyen"); if(p) f.appendChild(p);
  return f;
}
/* Images à toucher. choix : [{image, libelle, valeur}]. Le mot écrit est caché jusqu'à la réponse (conception du socle). */
function vignettes(choix, nom, multi){
  var box = el("div", "choix-images" + (choix.length > 2 ? " trois" : ""));
  box.setAttribute("role", "group"); box.setAttribute("aria-label", nom || "");
  var bs = choix.map(function(c){
    var b = el("button", "vignette"); b.type = "button"; b.setAttribute("aria-pressed", "false");
    b.setAttribute("data-image", c.image); b.setAttribute("aria-label", altDe(c.image));
    var p = picto(c.image); if(p) b.appendChild(p);
    var m = el("span", "vignette-mot", c.libelle || ""); m.hidden = true; b.appendChild(m);
    box.appendChild(b); return b;
  });
  return {
    box: box, boutons: bs, choix: choix,
    /* révèle les mots, marque la ou les bonnes réponses (si on en connaît) et fige */
    finir: function(bonnes){
      bs.forEach(function(b, i){
        b.querySelector(".vignette-mot").hidden = !choix[i].libelle;
        if(bonnes && bonnes.indexOf(choix[i].image) >= 0) b.classList.add("attendue");
        b.disabled = true;
      });
    },
    figer: function(){ bs.forEach(function(b){ b.disabled = true; }); }
  };
}

/* --- texte de CONTENU : lignes, gloses au toucher des mots du glossaire (A1 §0.4) --- */
var GLOSES = (function(){
  var g = {};
  Object.keys(C.glossaire || {}).forEach(function(k){
    k.split(" / ").forEach(function(m){
      g[m.toLowerCase()] = C.glossaire[k];
      var nu0 = m.replace(/^(le|la|l')\s*/i, ""); if(nu0 && nu0 !== m) g[nu0.toLowerCase()] = C.glossaire[k];
    });
  });
  return g;
})();
var GLOSE_RE = (function(){
  var mots = Object.keys(GLOSES).sort(function(a, b){ return b.length - a.length; })
    .map(function(m){ return m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); });
  return mots.length ? new RegExp("(^|[^A-Za-zÀ-ÿ'’])(" + mots.join("|") + ")(?![A-Za-zÀ-ÿ])", "gi") : null;
})();
/* Crée un paragraphe ; le premier mot du glossaire de chaque paragraphe devient un bouton qui montre sa glose. */
function paragraphe(texte, cls){
  var p = el("p", cls || null);
  if(!GLOSE_RE || /\(=/.test(texte)){ p.textContent = texte; return p; }      /* déjà expliqué dans la phrase */
  GLOSE_RE.lastIndex = 0;
  var m = GLOSE_RE.exec(texte);
  if(!m){ p.textContent = texte; return p; }
  var debut = m.index + m[1].length, mot = m[2];
  p.appendChild(document.createTextNode(texte.slice(0, debut)));
  var b = el("button", "mot", mot); b.type = "button"; b.setAttribute("aria-expanded", "false");
  var g = null;
  b.addEventListener("click", function(){
    if(g){ g.remove(); g = null; b.setAttribute("aria-expanded", "false"); return; }
    g = el("span", "glose", " " + GLOSES[mot.toLowerCase()]); g.setAttribute("role", "status");
    b.insertAdjacentElement("afterend", g); b.setAttribute("aria-expanded", "true");
  });
  p.appendChild(b);
  p.appendChild(document.createTextNode(texte.slice(debut + mot.length)));
  return p;
}
function lignes(parent, liste, cls){
  (liste || []).forEach(function(l){ parent.appendChild(paragraphe(l, cls)); });
  return parent;
}
function sonTexte(id){ var s = C.sons[id]; return s ? s.texte : undefined; }
function etiquette(cle){ return cle === "film" ? T("etiquette_film") : T("etiquette_cree"); }
function nomRole(r){ return r; }

/* ======================================================================
   2. COQUE DE LA PAGE
   ====================================================================== */
var ECRANS = C.ecrans;
function indexEcran(id){ for(var i = 0; i < ECRANS.length; i++) if(ECRANS[i].id === id) return i; return -1; }
var courant = null;                 /* écran affiché : {ec, idx, id, pas, …} */
var verrou = false;                 /* vrai pendant une écoute sans texte (E1 à E4) : Retour et réglages inactifs */
var coque = {};                     /* nœuds de la coque : topbar, etapes, bandeau, reglages, pied, app */
var suivreEleve = true;             /* vue formateur : suit l'écran de l'apprenant */

function monterCoque(){
  var app = document.getElementById("app");
  app.setAttribute("tabindex", "-1");
  var skip = el("a", "skip", T("aller_au_contenu")); skip.href = "#app";
  skip.addEventListener("click", function(e){ e.preventDefault(); app.focus(); });
  document.body.insertBefore(skip, document.body.firstChild);

  /* barre du haut : titre + thème */
  var top = el("header", "topbar"), tin = el("div", "topbar-in");
  var brand = el("div", "brand"); brand.appendChild(el("b", null, C.meta.titre)); brand.appendChild(el("span", null, C.meta.sous_titre));
  tin.appendChild(brand);
  tin.appendChild(bouton("btn small btn-ghost", T("theme_bascule"), function(){ S.theme.basculer(); }));
  top.appendChild(tin);
  document.body.insertBefore(top, skip.nextSibling);
  coque.topbar = top;

  /* panneau des réglages (caché), dans le flux sous la barre */
  var reg = el("section", "reglages"); reg.id = "panneau-reglages"; reg.hidden = true;
  reg.setAttribute("aria-label", T("reglages_titre"));
  top.insertAdjacentElement("afterend", reg);
  coque.reglages = reg;

  /* mise en page : étapes à gauche (en haut sur téléphone), colonne de contenu */
  var shell = el("div", "shell"), col = el("div", "colonne");
  app.parentNode.insertBefore(shell, app);
  coque.etapes = el("nav", "etapes"); coque.etapes.setAttribute("aria-label", T("les_etapes"));
  coque.bandeau = el("div", "bandeau" + (VUE_FORMATEUR ? " formateur" : ""));
  shell.appendChild(coque.etapes); shell.appendChild(col);
  col.appendChild(coque.bandeau); col.appendChild(app);
  coque.app = app;

  /* pied de page : bouton « Formateur » (seulement dans la vue formateur, ?vue=formateur) et « Tout effacer » */
  var pied = el("footer", "pied-page");
  coque.btnFormateur = bouton("btn small btn-ghost", T("formateur"), function(){
    if(window.FORMATEUR && FORMATEUR.ouvrirEspace) try{ FORMATEUR.ouvrirEspace(); }catch(e){ if(window.console) console.error(e); }
  });
  coque.btnFormateur.hidden = !(VUE_FORMATEUR && window.FORMATEUR && FORMATEUR.ouvrirEspace);
  /* vue apprenant : le bouton n'existe pas du tout dans la page */
  if(VUE_FORMATEUR) pied.appendChild(coque.btnFormateur);
  pied.appendChild(bouton("btn small btn-ghost", T("tout_effacer"), demanderEffacer));
  pied.appendChild(el("span", "muted small version", C.meta.titre + " · " + C.version));
  col.appendChild(pied);
  coque.pied = pied;

  majEtapes(); majBandeau(); majReglagesPanneau();
}

/* --- barre d'étapes --- */
function numEtape(i){ var id = ECRANS[i].id; return id === "accueil" ? "0" : id === "apres" ? "+" : String(i); }
function pointMax(){
  var e = E(), m = courant ? courant.idx : 0;
  ECRANS.forEach(function(ec, i){ if(e.fait[ec.id] && i + 1 > m) m = Math.min(i + 1, ECRANS.length - 1); });
  return m;
}
function majEtapes(){
  var n = coque.etapes; n.innerHTML = "";
  var e = E(), cur = courant ? courant.idx : 0, max = pointMax();
  var bt = el("button", "etapes-bouton"); bt.type = "button"; bt.setAttribute("aria-expanded", n.classList.contains("ouverte") ? "true" : "false");
  bt.appendChild(el("span", "etapes-num", numEtape(cur)));
  bt.appendChild(el("span", "etapes-titre", ECRANS[cur].titre));
  bt.appendChild(el("span", "etapes-chevron", "▾"));
  bt.addEventListener("click", function(){ var o = n.classList.toggle("ouverte"); bt.setAttribute("aria-expanded", o ? "true" : "false"); });
  n.appendChild(bt);
  var fil = el("div", "etapes-fil"); fil.setAttribute("aria-hidden", "true");
  ECRANS.forEach(function(ec, i){ var d = document.createElement("i"); if(e.fait[ec.id]) d.className = "fait"; if(i === cur) d.className = "ici"; fil.appendChild(d); });
  n.appendChild(fil);
  var ol = el("ol", "etapes-liste");
  ECRANS.forEach(function(ec, i){
    var li = document.createElement("li");
    var b = el("button", "etape" + (e.fait[ec.id] ? " faite" : "")); b.type = "button";
    if(i === cur) b.setAttribute("aria-current", "step");
    b.appendChild(el("span", "etape-num", numEtape(i)));
    b.appendChild(el("span", "etape-titre", ec.titre));
    b.appendChild(el("span", "etape-temps", T("duree_min", {n: ec.duree_min})));
    var permis = VUE_FORMATEUR || i <= max;
    if(!permis) b.disabled = true;
    b.addEventListener("click", function(){
      if(verrou){ messageVerrou(); return; }
      if(i !== cur) allerEcran(i, {manuel: true});
    });
    li.appendChild(b); ol.appendChild(li);
  });
  n.appendChild(ol);
}

/* --- bandeau des réglages --- */
var NOMS_MODE = {formateur: "mode_formateur", groupe: "mode_groupe", seul: "mode_seul"};
var NOMS_PALIER = {simple: "palier_simple", normal: "palier_normal", plus: "palier_plus"};
var NOMS_AIDE = {aucune: "aide_aucune", es: "aide_es", it: "aide_it"};
function majBandeau(){
  var b = coque.bandeau, e = E(); b.innerHTML = "";
  function item(titre, val){ var s = el("span", "bandeau-item"); s.appendChild(el("b", null, titre)); s.appendChild(document.createTextNode(" " + val)); b.appendChild(s); }
  item(T("bandeau_mode"), T(NOMS_MODE[e.mode]));
  item(T("bandeau_niveau"), T(NOMS_PALIER[e.palier]));
  item(T("bandeau_aide"), T(NOMS_AIDE[e.aide]));
  if(VUE_FORMATEUR) item(T("vue_formateur"), "");
  var br = bouton("btn small", T("reglages"), function(){
    if(verrou){ messageVerrou(); return; }
    var open = coque.reglages.hidden; coque.reglages.hidden = !open; br.setAttribute("aria-expanded", open ? "true" : "false");
  });
  br.setAttribute("aria-controls", "panneau-reglages"); br.setAttribute("aria-expanded", coque.reglages.hidden ? "false" : "true");
  br.id = "btn-reglages";
  b.appendChild(br);
}
/* Réglage à trois positions (mode, palier, langue d'aide) : modifiable à tout moment, sauf pendant une écoute sans texte. */
function groupeSeg(cle, titre, valeurs, noms, surChoix){
  var g = el("div", "reglages-groupe"); g.appendChild(el("div", "reglages-titre", titre));
  var seg = el("div", "seg"); seg.setAttribute("role", "group"); seg.setAttribute("aria-label", titre);
  valeurs.forEach(function(v){
    var bt = bouton(null, T(noms[v]), function(){ surChoix(v); });
    bt.setAttribute("aria-pressed", E()[cle] === v ? "true" : "false"); bt.setAttribute("data-valeur", v);
    seg.appendChild(bt);
  });
  g.appendChild(seg);
  return g;
}
function changerReglage(cle, v){
  var e = E(); if(e[cle] === v) return;
  var avant = e[cle];
  e[cle] = v;
  if(cle === "palier"){ S.journal.note("SEANCE", "palier", "palier_change", avant + ">" + v); }          /* un changement de palier change ce qu'on peut comparer */
  if(cle === "aide" && v !== "aucune" && courant){ e.suivi.aide_choisie_apres = courant.id; }
  S.sauver();
  majBandeau(); majReglagesPanneau(); majAides();
  if(cle !== "aide" && courant && courant.id !== "accueil") allerEcran(courant.idx, {reglage: true});    /* le palier et le mode changent les pas */
}
function majReglagesPanneau(){
  var r = coque.reglages; r.innerHTML = "";
  r.appendChild(groupeSeg("mode", T("mode_titre"), ["formateur", "groupe", "seul"], NOMS_MODE, function(v){ changerReglage("mode", v); }));
  r.appendChild(groupeSeg("palier", T("palier_titre"), ["simple", "normal", "plus"], NOMS_PALIER, function(v){ changerReglage("palier", v); }));
  r.appendChild(groupeSeg("aide", T("aide_titre"), ["aucune", "es", "it"], NOMS_AIDE, function(v){ changerReglage("aide", v); }));
  var f = bouton("btn small", T("fermer"), function(){ r.hidden = true; var b = document.getElementById("btn-reglages"); if(b){ b.setAttribute("aria-expanded", "false"); b.focus(); } });
  r.appendChild(f);
}
/* Quand l'écoute est en cours, Retour, étapes et réglages ne répondent pas : message simple. */
function messageVerrou(){
  S.annoncer(T("retour_bloque"));
  if(courant && courant.msgVerrou){ courant.msgVerrou.textContent = T("retour_bloque"); courant.msgVerrou.hidden = false; S.espacesFr(courant.msgVerrou); }
}
function poserVerrou(on){
  verrou = !!on;
  document.body.classList.toggle("ecoute-en-cours", verrou);
  if(courant && courant.btnRetour){ courant.btnRetour.setAttribute("aria-disabled", verrou ? "true" : "false"); courant.btnRetour.classList.toggle("inactif", verrou); }
  Array.prototype.forEach.call(coque.etapes.querySelectorAll(".etape"), function(b){ if(verrou) b.setAttribute("aria-disabled", "true"); else b.removeAttribute("aria-disabled"); });
  if(!verrou && courant && courant.msgVerrou) courant.msgVerrou.hidden = true;
}
/* « Tout effacer » : double confirmation, avec proposition d'export avant (A4 §1.1) */
function demanderEffacer(){
  if(document.getElementById("confirmer-effacer")) return;
  var box = el("div", "card attente"); box.id = "confirmer-effacer"; box.setAttribute("role", "alertdialog"); box.setAttribute("aria-label", T("tout_effacer"));
  box.appendChild(el("p", "consigne", T("confirmer_effacer")));
  var r = el("div", "row");
  r.appendChild(bouton("btn", T("exporter"), function(){ ouvrirExport(); }));
  r.appendChild(bouton("btn", T("annuler"), function(){ box.remove(); }));
  r.appendChild(bouton("btn btn-primary", T("oui_effacer"), function(){ S.effacerTout(); try{ location.reload(); }catch(e){} }));
  box.appendChild(r);
  coque.pied.parentNode.insertBefore(box, coque.pied);
  box.querySelector("button").focus();
}

/* ======================================================================
   3. ÉCRAN : RENDU PAS À PAS, NAVIGATION, CHRONOMÈTRE
   ====================================================================== */
var chrono = {id: null, debut: 0};
function chronoCumuler(){
  if(chrono.id && chrono.debut){
    var d = E().durees[chrono.id]; if(d) d.actif_s = (d.actif_s || 0) + (Date.now() - chrono.debut) / 1000;
    chrono.debut = Date.now();
  }
}
function chronoDemarrer(id){
  chronoCumuler(); chrono.id = id; chrono.debut = Date.now();
  var D = E().durees; if(!D[id]) D[id] = {actif_s: 0, visites: 0};
  D[id].visites++;
}
document.addEventListener("visibilitychange", function(){
  if(document.hidden){ chronoCumuler(); chrono.debut = 0; try{ S.sauver(); }catch(e){} }
  else if(chrono.id) chrono.debut = Date.now();
});
window.addEventListener("pagehide", function(){ chronoCumuler(); try{ S.sauver(); }catch(e){} });

/* Un pas est obligatoire sauf s'il est facultatif ou d'un type qui ne bloque jamais. */
var NON_BLOQUANTS = {rappels: 1, liens: 1, bilan: 1, serie_banque: 1};
function estObligatoire(b){ return !b.facultatif && !NON_BLOQUANTS[b.type]; }

function preparer(ec){
  var liste = [], aides = [], prec = null;
  ec.pas.forEach(function(b0){
    if(!siOk(b0.si)) return;
    var b = avecVariantes(b0);
    if(b.type === "aide_langue"){ aides.push({b: b, apresPas: prec}); }
    else { liste.push(b); prec = b; }
  });
  return {liste: liste, aides: aides};
}

/* --- préchargement discret des sons de l'écran courant et du suivant (après le rendu, sans message) ---
   Le suivant n'est pas préchargé s'il s'agit de S6 : ses sons restent isolés jusqu'à l'écran S6. */
var PRECHARGES = {};
var CLES_SON = /^(son|sons|son_cliente|dialogue|consigne|consigne_[a-z0-9_]+)$/;
function sonsDeEcran(ec, ids){
  (function marcher(n){
    if(Array.isArray(n)){ n.forEach(marcher); return; }
    if(!n || typeof n !== "object") return;
    Object.keys(n).forEach(function(k){
      var v = n[k];
      if(CLES_SON.test(k)){ (Array.isArray(v) ? v : [v]).forEach(function(x){ if(typeof x === "string" && C.sons && C.sons[x] && ids.indexOf(x) < 0) ids.push(x); }); }
      if(v && typeof v === "object") marcher(v);
    });
  })(ec);
  return ids;
}
function precharger(idx){
  try{
    if(!S.sons || !S.sons.precharger) return;
    var cx = navigator.connection; if(cx && cx.saveData) return;
    var ids = sonsDeEcran(ECRANS[idx], []);
    var suiv = ECRANS[idx + 1];
    if(suiv && !/^s6$/i.test(suiv.id)) sonsDeEcran(suiv, ids);
    ids = ids.filter(function(id){ return !PRECHARGES[id]; }).slice(0, 60);
    if(!ids.length) return;
    ids.forEach(function(id){ PRECHARGES[id] = true; });
    var r = S.sons.precharger(ids);
    if(r && r.catch) r.catch(function(){});
  }catch(e){}
}
function programmerPrechargement(idx){
  var go = function(){ precharger(idx); };
  try{ if(window.requestIdleCallback) window.requestIdleCallback(go, {timeout: 3000}); else setTimeout(go, 600); }catch(e){}
}

function allerEcran(cible, opts){
  opts = opts || {};
  var idx = typeof cible === "number" ? cible : indexEcran(cible);
  if(idx < 0 || idx >= ECRANS.length) return;
  S.nouvelleVue();                       /* coupe tout son et tout film, invalide les réponses tardives */
  poserVerrou(false);
  var ec = ECRANS[idx], e = E();
  if(!opts.reglage && !window.FORMATEUR){ chronoDemarrer(ec.id); }   /* si l'espace formateur existe, c'est lui qui tient le chronomètre */
  if(!opts.suivi){
    e.ecran = idx; e.ecran_id = ec.id;
    if(!e.suivi.date) e.suivi.date = J.jourIso();
    if(!e.suivi.palier_depart) e.suivi.palier_depart = e.palier;
    S.sauver();                          /* l'autre fenêtre (vue formateur) suit par l'événement « storage » */
  }
  if(opts.manuel && VUE_FORMATEUR) suivreEleve = false;
  if(opts.suivi) suivreEleve = true;
  if(coque.reglages) coque.reglages.hidden = true;
  monterEcran(ec, idx, opts);
  majEtapes(); majBandeau();
  if(!opts.tout && !opts.reglage){
    S.annoncer(ec.etape + " — " + ec.titre);
    var h = coque.app.querySelector("h1"); if(h) try{ h.focus(); }catch(err){}
    try{ window.scrollTo(0, 0); }catch(err2){}
  }
  if(window.FORMATEUR && FORMATEUR.surChangementEcran){ try{ FORMATEUR.surChangementEcran(ec.id); }catch(err3){ if(window.console) console.error(err3); } }
  if(!opts.tout && !opts.reglage) programmerPrechargement(idx);
}

function monterEcran(ec, idx, opts){
  var app = coque.app; app.innerHTML = "";
  var prep = preparer(ec);
  var X = {ec: ec, id: ec.id, idx: idx, ecr: codeEcran(ec.id), pas: [], partage: {}, tout: !!opts.tout, aidesDef: prep.aides, verrous: 0};
  courant = X;
  var sec = el("section", "ecran"); sec.setAttribute("aria-labelledby", "titre-ecran"); sec.setAttribute("data-ecran", ec.id);
  var tete = el("header", "ecran-tete");
  var sur = el("p", "surtitre");
  sur.appendChild(el("span", null, ec.etape)); sur.appendChild(el("span", null, T("duree_min", {n: ec.duree_min})));
  var h = el("h1", null, ec.titre); h.id = "titre-ecran"; h.tabIndex = -1;
  tete.appendChild(sur); tete.appendChild(h);
  if(ec.objectif) tete.appendChild(paragraphe(ec.objectif, "lede"));
  sec.appendChild(tete);

  /* vue formateur : la carte de l'écran vient de l'espace formateur. Jamais rendue pour l'apprenant. */
  if(VUE_FORMATEUR && window.FORMATEUR && FORMATEUR.carteEcran){
    try{ var carte = FORMATEUR.carteEcran(ec.id); if(carte) sec.appendChild(carte); }catch(err){ if(window.console) console.error(err); }
  }

  var liste = el("div", "pas-liste"); sec.appendChild(liste); X.liste = liste;
  X.pas = prep.liste.map(function(b, i){
    return {b: b, i: i, id: b.id, fait: false, monte: false, oblig: estObligatoire(b), noeud: null, zone: null, aides: [], stade: "", faux: false};
  });
  /* aide dans ma langue : rattachée au pas qui porte l'identifiant le plus long préfixe de « apres » (B1 §2) */
  prep.aides.forEach(function(a){
    var cible = null, suite = "fait";
    if(a.b.apres == null){ cible = X.pas.filter(function(p){ return p.b === a.apresPas; })[0] || X.pas[0]; suite = "monte"; }
    else {
      var cands = X.pas.filter(function(p){ return a.b.apres === p.id || a.b.apres.indexOf(p.id + ".") === 0; })
        .sort(function(p, q){ return q.id.length - p.id.length; });
      if(cands.length){ cible = cands[0]; suite = a.b.apres === cible.id ? "fait" : a.b.apres.slice(cible.id.length + 1); }
    }
    if(cible) cible.aides.push({b: a.b, suite: suite, montre: false, noeud: null});
  });

  /* navigation Retour / Suite (K8) */
  var nav = el("nav", "pied-nav"); nav.setAttribute("aria-label", T("navigation_titre"));
  X.btnRetour = bouton("btn", T("retour"), function(){
    if(verrou){ messageVerrou(); return; }
    if(X.idx > 0) allerEcran(X.idx - 1, {manuel: true});
  });
  X.btnRetour.hidden = idx === 0;
  X.btnSuite = bouton("btn btn-primary", T("suite"), function(){
    if(X.btnSuite.disabled) return;
    E().fait[ec.id] = true; S.sauver();
    allerEcran(X.idx + 1);
  });
  X.btnSuite.disabled = true;
  if(ec.id === "s6") X.btnSuite.textContent = (C.bilan && C.bilan.suite && T(C.bilan.suite.bouton)) || T("apres_le_cours");
  if(ec.id === "apres") X.btnSuite.hidden = true;
  nav.appendChild(X.btnRetour); nav.appendChild(X.btnSuite);
  X.msgVerrou = el("p", "retour attention"); X.msgVerrou.setAttribute("role", "status"); X.msgVerrou.hidden = true;
  sec.appendChild(X.msgVerrou); sec.appendChild(nav);
  app.appendChild(sec);
  avancer(X, true);
}

/* Monte les pas dans l'ordre jusqu'au premier pas obligatoire pas encore fait. */
function avancer(X, initial){
  if(X.tout){ X.pas.forEach(function(p){ monterPas(X, p, initial); }); }
  else {
    for(var i = 0; i < X.pas.length; i++){
      var p = X.pas[i]; monterPas(X, p, initial && i === 0);
      if(p.oblig && !p.fait) break;
    }
  }
  var ok = X.pas.every(function(p){ return !p.oblig || p.fait; }) && X.pas.every(function(p){ return p.monte; });
  X.btnSuite.disabled = !ok;
}

function monterPas(X, p, sansFocus){
  if(p.monte) return;
  p.monte = true;
  var w = el("div", "pas"); w.setAttribute("data-pas", p.id); w.setAttribute("data-type", p.b.type); w.tabIndex = -1;
  var ctx = creerCtx(X, p, w);
  var fn = R[p.b.type], corps = null;
  try{ corps = fn ? fn(p.b, ctx) : null; }
  catch(err){ ERREURS.push({pas: p.id, type: p.b.type, err: err}); if(window.console) console.error("Pas " + p.id + " (" + p.b.type + ") :", err); }
  if(corps) w.appendChild(corps);
  p.zone = el("div", "aides-zone"); w.appendChild(p.zone);
  X.liste.appendChild(w);
  p.noeud = w; p.ctx = ctx;
  p.aides.forEach(function(a){ a.noeud = boutonAide(X, p, a); p.zone.appendChild(a.noeud); a.noeud.hidden = true; });
  majAides();
  signaler(X, p, "monte");
  if(p.faitTot){ p.faitTot = false; ctx.fait(); }
  if(!sansFocus && X.liste.children.length > 1){
    try{ w.focus({preventScroll: true}); }catch(e){ try{ w.focus(); }catch(e2){} }
    if(w.scrollIntoView) try{ w.scrollIntoView({block: "start", behavior: reduit() ? "auto" : "smooth"}); }catch(e3){}
  }
}
function creerCtx(X, p, w){
  var b = p.b;
  var ctx = {
    X: X, p: p, bloc: b, noeud: w, ecr: X.ecr, trace: b.item || traceDe(b), faux: false,
    fait: function(){
      if(p.fait) return;
      if(!p.noeud){ p.faitTot = true; return; }          /* fini pendant le montage : pris en compte juste après */
      p.fait = true; w.classList.add("fait");
      signaler(X, p, "fait");
      avancer(X);
    },
    note: function(ev, d, item){ return S.journal.note(X.ecr, item || ctx.trace, ev, d); },
    rep: function(cond, valeur, juste, item){ S.journal.reponse(X.ecr, item || ctx.trace, cond, valeur, juste); },
    signal: function(etape){ signaler(X, p, etape); },
    stade: function(s){ p.stade = s; },
    verrou: function(on){
      if(on && !p.verrou){ p.verrou = true; X.verrous++; }
      if(!on && p.verrou){ p.verrou = false; X.verrous--; }
      poserVerrou(X.verrous > 0);
    },
    /* bouton « Écouter la consigne » (K1) : une aide comptée à part */
    consigne: function(){
      if(!b.consigne || !C.sons[b.consigne]) return null;
      return S.boutonSon(b.consigne, nu("ecouter_la_consigne"), {texte: sonTexte(b.consigne), couleur: "consigne", sansLent: true, etiquette: "",
        surEntendu: function(){ ctx.note("consigne_lue"); }});
    }
  };
  return ctx;
}

/* --- aide dans ma langue (K6) --- */
function textesAide(cle){
  var A = C.aides, o = A.consignes && A.consignes[cle];
  if(!o) o = (A.aides_apres_reponse || []).filter(function(x){ return x.id === cle; })[0];
  return o || null;
}
function boutonAide(X, p, a){
  var wrap = el("div", "aide-wrap");
  var bt = bouton("btn small btn-ghost aide-bouton", "", null);
  bt.setAttribute("aria-expanded", "false"); bt.setAttribute("data-aide", a.b.aide);
  var panneau = null;
  bt.addEventListener("click", function(){
    var lg = E().aide; if(lg === "aucune") return;
    if(panneau){ panneau.remove(); panneau = null; bt.setAttribute("aria-expanded", "false"); return; }
    var t = textesAide(a.b.aide); if(!t) return;
    panneau = el("div", "aide-langue");
    var pp = el("p", null, t[lg] || ""); pp.setAttribute("lang", lg); panneau.appendChild(pp);
    panneau.appendChild(bouton("btn small", T("fermer_l_aide"), function(){ panneau.remove(); panneau = null; bt.setAttribute("aria-expanded", "false"); bt.focus(); }));
    wrap.appendChild(panneau); bt.setAttribute("aria-expanded", "true");
    /* moment de l'aide (A1 K3) : avant les images, avant la réécoute, ou après */
    var m = p.stade === "e3" ? "avant_img" : p.stade === "e4" ? "avant_re" : "apres";
    S.journal.note(X.ecr, traceDe(p.b), "aide_langue", lg + ":" + m);
  });
  wrap.appendChild(bt);
  wrap._bt = bt; wrap._a = a;
  return wrap;
}
/* Montre ou cache les boutons d'aide selon la langue choisie et le moment atteint. */
function majAides(){
  if(!courant) return;
  var lg = E().aide;
  courant.pas.forEach(function(p){
    p.aides.forEach(function(a){
      if(!a.noeud) return;
      var libelle = lg === "es" ? T("ayuda_es") : lg === "it" ? T("aiuto_it") : "";
      a.noeud._bt.textContent = libelle;
      a.noeud.hidden = !(lg !== "aucune" && a.montre && (!a.b.si_reponse_fausse || p.faux));
      if(a.noeud.hidden){ var pn = a.noeud.querySelector(".aide-langue"); if(pn) pn.remove(); }
    });
  });
}
/* Un pas a atteint une étape (« e2 », « fait »…) : les aides rattachées à cette étape deviennent disponibles. */
function signaler(X, p, etape){
  p.aides.forEach(function(a){
    if(a.suite === etape || (etape === "fait" && a.suite !== "monte")) a.montre = true;
    if(etape === "monte" && a.suite === "monte") a.montre = true;
  });
  majAides();
}

/* ======================================================================
   4. BLOCS SIMPLES
   ====================================================================== */
var R = {};
function entete(b, ctx, corps){
  if(b.image) corps.appendChild(figure(b.image));
  var c = ctx.consigne(); if(c) corps.appendChild(c);
}
function boutonSuiteDuPas(b, ctx, corps, cle){
  var bt = bouton("btn btn-primary", T(cle || b.bouton || "suite"), function(){ bt.disabled = true; ctx.fait(); });
  corps.appendChild(bt);
  return bt;
}

/* --- texte : lignes, image(s), bouton pour continuer ; sert aussi de retour (role « retour ») --- */
R.texte = function(b, ctx){
  var n = el("div", "pas-corps");
  entete(b, ctx, n);
  if(b.images){
    var duo = el("div", "deux-images");
    b.images.forEach(function(im){
      var f = el("figure", "contexte"); var p = picto(im.image, "moyen"); if(p) f.appendChild(p);
      f.appendChild(el("figcaption", "small", im.legende || "")); duo.appendChild(f);
    });
    n.appendChild(duo);
  }
  if(b.role === "retour"){ var r = el("div", "retour info"); r.setAttribute("role", "status"); lignes(r, b.lignes); n.appendChild(r); }
  else lignes(n, b.lignes);
  if((b.aides_discretes || []).indexOf("revoir_le_texte") >= 0) n.appendChild(revoirTexte(ctx));
  boutonSuiteDuPas(b, ctx, n);
  return n;
};
/* « Revoir le texte » (S3, pas 3.4) : les phrases des trois fiches, à la demande ; consigné comme aide. */
function revoirTexte(ctx){
  var zone = el("div", "revoir"), ouvert = null;
  var bt = bouton("btn small btn-ghost", T("revoir_le_texte"), function(){
    if(ouvert){ ouvert.remove(); ouvert = null; return; }
    ouvert = el("div", "card douce");
    ECRANS.filter(function(x){ return x.id === "s3"; })[0].pas.forEach(function(q){
      if(q.type === "carte_roles"){ ouvert.appendChild(el("p", "small", q.personnel.texte + " → " + q.vous.texte)); }
    });
    zone.appendChild(ouvert);
    var item = "s3.ferme.texte_revu";
    S.journal.note(ctx.ecr, item, "texte", "revoir");
  });
  zone.appendChild(bt);
  return zone;
}

/* --- réglages de l'accueil : mode, palier, langue d'aide (A1 §0.1) --- */
R.reglages = function(b, ctx){
  var n = el("div", "pas-corps");
  var c = ctx.consigne(); if(c) n.appendChild(c);
  b.groupes.forEach(function(g){
    var bloc = el("div", "reglages-groupe");
    var titre = el("h2", "reglages-titre", T(g.question)); bloc.appendChild(titre);
    if(g.note) bloc.appendChild(el("p", "note", T(g.note)));
    var zone;
    if(g.cle === "mode"){
      zone = el("div", "choix-images trois"); zone.setAttribute("role", "group"); zone.setAttribute("aria-label", T(g.question));
    } else { zone = el("div", "seg"); zone.setAttribute("role", "group"); zone.setAttribute("aria-label", T(g.question)); }
    g.options.forEach(function(o){
      var bt;
      if(g.cle === "mode"){
        bt = el("button", "vignette"); bt.type = "button";
        var pi = o.image ? picto(o.image) : null; if(pi) bt.appendChild(pi);
        bt.appendChild(el("span", "vignette-mot", T(o.libelle)));
        bt.setAttribute("aria-label", T(o.libelle));
      } else {
        bt = bouton(null, T(o.libelle), null);
        if(o.sous_titre) bt.appendChild(el("small", "sous", T(o.sous_titre)));
      }
      bt.type = "button"; bt.setAttribute("data-valeur", o.valeur);
      bt.setAttribute("aria-pressed", E()[g.cle] === o.valeur ? "true" : "false");
      bt.addEventListener("click", function(){
        Array.prototype.forEach.call(zone.querySelectorAll("button"), function(x){ x.setAttribute("aria-pressed", "false"); });
        bt.setAttribute("aria-pressed", "true");
        changerReglage(g.cle, o.valeur);
      });
      zone.appendChild(bt);
    });
    bloc.appendChild(zone); n.appendChild(bloc);
  });
  boutonSuiteDuPas(b, ctx, n);
  return n;
};

/* --- écoute d'un dialogue créé, sans question (S3.n.1) --- */
R.ecoute = function(b, ctx){
  var n = el("div", "pas-corps");
  var c = ctx.consigne(); if(c) n.appendChild(c);
  lignes(n, b.lignes);
  var s = C.sons[b.son], reps = (s && s.repliques) || [{id: b.son}];
  var fini = false;
  var texteVisible = b.texte_visible && b.texte_visible_repliques;
  if(b.images_boisson){
    var duo = vignettes(b.images_boisson.map(function(i){ return {image: i, libelle: ""}; }), "");
    duo.figer(); n.appendChild(duo.box);
    ctx.note("images");
  }
  if(texteVisible){
    var d = el("div", "dialogue");
    b.texte_visible_repliques.forEach(function(r){
      var rep = el("div", "replique " + (/serveu/i.test(r.role) ? "personnel" : "client"));
      rep.appendChild(el("span", "replique-qui", r.role)); rep.appendChild(el("span", "replique-texte", r.texte)); d.appendChild(rep);
    });
    n.appendChild(d); ctx.note("texte", "aide");
  }
  /* un dialogue = un seul fichier assemblé (audio/synthese/<id>.mp3) */
  var barre = S.boutonSon(b.son, nu(b.bouton || "ecouter"), {
    etiquette: etiquette("cree"),
    surEntendu: function(){ ctx.note("ecoute"); },
    surAide: function(a){ ctx.note(a === "lent" ? "lent" : a); },
    surFin: function(){ if(!fini){ fini = true; ctx.fait(); } },
    surEchec: function(){ ctx.note("son_absent"); if(!fini && !b.facultatif){ n.appendChild(continuerSansSon(function(){ fini = true; ctx.fait(); })); } }
  });
  n.appendChild(barre);
  var sourceTexte = el("div", "formateur-seulement"); if(!VUE_FORMATEUR) sourceTexte = null;
  if(sourceTexte && s && s.repliques){ sourceTexte.appendChild(el("p", "small", T("pour_le_formateur"))); s.repliques.forEach(function(r){ sourceTexte.appendChild(el("p", "small", r.role + " : " + r.texte)); }); n.appendChild(sourceTexte); }
  return n;
};
function continuerSansSon(fn){
  var b = bouton("btn small", T("continuer_sans_son"), function(){ b.disabled = true; fn(); });
  return b;
}

/* --- carte de rôles (S3) : « Le serveur dit » / « Vous pouvez dire » --- */
R.carte_roles = function(b, ctx){
  var n = el("div", "pas-corps");
  entete(b, ctx, n);
  lignes(n, b.lignes);
  var carte = el("div", "role-carte");
  [["personnel", b.personnel], ["vous", b.vous]].forEach(function(x){
    var r = x[1]; var rr = el("div", "role " + x[0]);
    rr.appendChild(el("span", "role-qui", T(r.libelle)));
    rr.appendChild(el("p", "role-phrase", r.texte));
    rr.appendChild(S.boutonSon(r.son, nu("ecouter"), {texte: r.texte, noeud: rr, sansLent: !b.un_peu_plus_lent, couleur: "cree", etiquette: etiquette("cree"),
      surEntendu: function(){ ctx.note("ecoute", r.son); }, surAide: function(a){ ctx.note(a === "lent" ? "lent" : a); },
      surEchec: function(){ ctx.note("son_absent"); }}));
    carte.appendChild(rr);
  });
  n.appendChild(carte);
  if(b.glose) n.appendChild(el("p", "note", b.glose));
  /* la fiche est un texte visible : trace « carte » pour la prise de parole qui suit */
  ctx.note("carte", null, String(ctx.trace).replace(/^s3\.c(\d)\.dit$/, "S3-P$1"));
  boutonSuiteDuPas(b, ctx, n);
  return n;
};

/* --- choix d'une image (une seule réponse) --- */
function valeurChoix(c){ return c.valeur || J.valeurImage(c.image); }
/* Retour d'un choix : « Oui. » seulement si la réponse est la bonne ; le même message pour toutes les réponses. */
function texteRetour(retour, juste){
  if(!retour) return "";
  var t = retour.commun || "";
  if(retour.prefixe_si_bonne && juste) t = retour.prefixe_si_bonne + " " + t;
  return t;
}
R.choix_images = function(b, ctx){
  var n = el("div", "pas-corps");
  var c = ctx.consigne(); if(c) n.appendChild(c);
  if(b.image) n.appendChild(figure(b.image));
  if(b.sequence) return choixQuiParle(b, ctx, n);
  n.appendChild(paragraphe(b.question, "consigne"));
  var choix = b.choix, nbPris = b.choix_nombre || 1, pris = [];
  var v = vignettes(choix, b.question);
  var ret = S.zoneRetour();
  var bonnes = b.bonne || [];
  var item = ctx.trace;
  /* palier « plus simple » : voir la phrase avant de parler (S4.4) */
  if(b.voir_la_phrase_avant){
    var ph = el("div"); var bp = bouton("btn small btn-ghost", T("voir_la_phrase"), function(){
      var q = ECRANS.filter(function(x){ return x.id === "s4"; })[0];
      ph.appendChild(el("p", "note", "« Un thé, s'il vous plaît. » · « Un café, s'il vous plaît. »")); bp.disabled = true; ctx.note("texte", "aide");
    }); ph.appendChild(bp); n.appendChild(ph);
  }
  v.boutons.forEach(function(bt, i){
    bt.addEventListener("click", function(){
      if(nbPris > 1){                                  /* choix de plusieurs images (palier « un peu plus », S4.4) */
        if(pris.indexOf(i) >= 0) return;
        pris.push(i); bt.setAttribute("aria-pressed", "true");
        if(pris.length < nbPris) return;
      } else bt.setAttribute("aria-pressed", "true");
      var valeurs = (nbPris > 1 ? pris : [i]).map(function(k){ return valeurChoix(choix[k]); });
      var juste = bonnes.length ? (nbPris > 1 ? null : bonnes.indexOf(choix[i].image) >= 0) : null;
      ctx.rep("p1", valeurs.join("+"), juste);
      if(b.item && ctx.ecr === "S4"){ ctx.p.choisi = nbPris > 1 ? choix[pris[0]].image : choix[i].image; courant.partage.image = ctx.p.choisi; }
      v.finir(bonnes.length ? bonnes : null);
      if(!b.sans_retour && b.retour){ S.montrerRetour(ret, texteRetour(b.retour, juste), juste === false ? "info" : "ok"); }
      if(juste === false) ctx.faux = true;
      ctx.fait();
    });
  });
  n.appendChild(v.box); n.appendChild(ret);
  return n;
};
/* « Qui parle ? » (S2.B.6) : deux phrases, dans un ordre tiré au sort ; les sons ne se jouent qu'en mode seul. */
function choixQuiParle(b, ctx, n){
  var ordre = b.sequence.map(function(s, i){ return i; });
  if(b.ordre_phrases === "alea" && hasard(2)) ordre.reverse();
  n.appendChild(paragraphe(b.question, "consigne"));
  var restantes = ordre.length, ret = S.zoneRetour();
  ordre.forEach(function(k, rang){
    var s = b.sequence[k], bloc = el("div", "qui-phrase");
    var tete = el("div", "row");
    tete.appendChild(el("strong", null, nu(s.libelle)));
    if(E().mode === "seul" || b.sons_modes.indexOf(E().mode) >= 0){
      tete.appendChild(S.boutonSon(s.son, nu(s.libelle), {texte: sonTexte(s.son), sansLent: true, etiquette: etiquette("cree"),
        surEntendu: function(){ ctx.note("ecoute", s.son); }, surEchec: function(){ ctx.note("son_absent"); }}));
    }
    bloc.appendChild(tete);
    var v = vignettes(b.choix, nu(s.libelle));
    v.boutons.forEach(function(bt, i){
      bt.addEventListener("click", function(){
        bt.setAttribute("aria-pressed", "true");
        var juste = b.choix[i].image === s.bonne;
        var suf = /reponse/.test(s.son) ? "r" : "q";
        ctx.rep("p1", valeurChoix(b.choix[i]), juste, "s2.qui_parle." + suf);
        v.finir([s.bonne]);
        if(--restantes === 0){
          var d = el("div", "dialogue");
          (b.texte_apres || []).forEach(function(r){
            var rep = el("div", "replique " + (/serveur/i.test(r.role) ? "personnel" : "client"));
            rep.appendChild(el("span", "replique-qui", r.role)); rep.appendChild(el("span", "replique-texte", r.texte)); d.appendChild(rep);
          });
          n.appendChild(d);
          ctx.note("texte", null, "s2.qui_parle.q"); ctx.note("qui_parle", null, "s2.qui_parle.q");
          if(b.retour) S.montrerRetour(ret, texteRetour(b.retour, true), "info");
          ctx.fait();
        }
      });
    });
    bloc.appendChild(v.box); n.appendChild(bloc);
  });
  n.appendChild(ret);
  return n;
}

/* --- plusieurs images à toucher, puis « J'ai fini » (S1.3) --- */
R.choix_multiple = function(b, ctx){
  var n = el("div", "pas-corps");
  var c = ctx.consigne(); if(c) n.appendChild(c);
  n.appendChild(paragraphe(b.question, "consigne"));
  var v = vignettes(b.choix, b.question);
  var choisis = [], ret = S.zoneRetour();
  v.boutons.forEach(function(bt, i){
    bt.addEventListener("click", function(){
      var k = choisis.indexOf(i);
      if(k >= 0){ choisis.splice(k, 1); bt.setAttribute("aria-pressed", "false"); } else { choisis.push(i); bt.setAttribute("aria-pressed", "true"); }
    });
  });
  var fin = bouton("btn btn-primary", T(b.bouton_fin), function(){
    fin.disabled = true;
    var imgs = choisis.map(function(i){ return b.choix[i].image; });
    var bons = imgs.filter(function(x){ return b.bonne.indexOf(x) >= 0; });
    var juste = imgs.length > 0 && bons.length === imgs.length;
    ctx.rep("p1", imgs.map(J.valeurImage).join("+"), imgs.length ? juste : null);
    v.finir(null);
    var r = b.retour, t = [r.intro];
    if(bons.length) t.push(r.trouves.replace("{liste}", bons.map(function(x){ return b.choix.filter(function(cc){ return cc.image === x; })[0].libelle; }).join(", ")));
    imgs.forEach(function(x){ if(r.hors_film && r.hors_film[x]) t.push(r.hors_film[x]); });
    S.montrerRetour(ret, t.join(" "), "info");
    var tab = el("div", "choix-images trois");
    (b.tableau_film || []).forEach(function(p){
      var f = el("figure", "contexte"); var pi = picto(p.image, "moyen"); if(pi) f.appendChild(pi); f.appendChild(el("figcaption", "small", p.libelle)); tab.appendChild(f);
    });
    n.appendChild(tab);
    ctx.fait();
  });
  n.appendChild(v.box); n.appendChild(fin); n.appendChild(ret);
  return n;
};

/* --- extrait du film (étiquette « Extrait du film » ; jamais présenté comme « sans texte ») --- */
function bornes(cle){ return C.video.extraits[cle]; }
function barreFilm(cle, libelle, o){
  var b = bornes(cle); o = o || {};
  return S.extraitFilm(b[0], b[1], libelle, o);
}
R.film_extrait = function(b, ctx){
  var n = el("div", "pas-corps");
  entete(b, ctx, n);
  lignes(n, b.lignes);
  if(b.question_avant) n.appendChild(paragraphe(b.question_avant, "consigne"));
  var entendu = false, fini = false, zoneApres = el("div", "apres-film");
  function terminer(){ if(fini) return; fini = true; ctx.fait(); }
  var o = {
    surEntendu: function(){ entendu = true; ctx.note("ecoute"); },
    surFin: function(){ if(entendu){ apres(); } },
    surEchec: function(){ ctx.note("film_absent"); n.appendChild(el("p", "alerte", T("film_indisponible"))); n.appendChild(continuerSansSon(function(){ apres(); })); },
    surAide: function(a){ if(a === "lent") ctx.note("lent"); }
  };
  var apresFait = false;
  function apres(){
    if(apresFait) return; apresFait = true;
    if(b.question) questionFilm();
    else {
      if(b.repliques_apres){
        var d = el("div", "dialogue");
        b.repliques_apres.forEach(function(r){
          var rep = el("div", "replique " + (r.couleur || "client")); rep.appendChild(el("span", "replique-qui", r.role)); rep.appendChild(el("span", "replique-texte", r.texte)); d.appendChild(rep);
        });
        zoneApres.appendChild(d); ctx.note("texte");
      }
      if(b.retour){ var rt = el("div", "retour info"); rt.setAttribute("role", "status"); rt.textContent = b.retour; S.espacesFr(rt); zoneApres.appendChild(rt); }
      terminer();
    }
  }
  /* S4.1 : « Elle a fini de commander ? » Oui / Non, puis retour */
  function questionFilm(){
    var q = b.question, ret = S.zoneRetour(), reps = el("div", "reponses");
    lignes(zoneApres, q.lignes);
    var essais = 0;
    q.choix.forEach(function(c){
      var bt = el("button", "reponse", c.libelle); bt.type = "button"; bt.setAttribute("aria-pressed", "false");
      bt.addEventListener("click", function(){
        Array.prototype.forEach.call(reps.querySelectorAll("button"), function(x){ x.setAttribute("aria-pressed", "false"); });
        bt.setAttribute("aria-pressed", "true"); essais++;
        var juste = c.valeur === q.bonne;
        ctx.rep("p1", c.valeur, juste);
        S.montrerRetour(ret, q.retour[c.valeur], juste ? "ok" : "info");
        if(!juste && q.retour.bouton_non && !zoneApres.querySelector(".encore")){
          var enc = barreFilm(q.retour.bouton_non.extrait, nu(q.retour.bouton_non.libelle), {sansLent: true, surEntendu: function(){ ctx.note("reecoute"); }});
          enc.classList.add("encore"); zoneApres.appendChild(enc);
        }
        terminer();
      });
      reps.appendChild(bt);
    });
    zoneApres.appendChild(reps); zoneApres.appendChild(ret);
  }
  /* S1.1 : « C'est trop long ? Un morceau court », ou (palier « plus simple ») morceau court d'abord */
  var court = b.court, ouvreParCourt = b.ouvre_par === "court" && court;
  var zoneLong = el("div", "film-long"), zoneCourt = el("div", "film-court");
  if(!ouvreParCourt){ zoneLong.appendChild(barreFilm(b.extrait, nu(b.bouton || "regarder"), o)); n.appendChild(zoneLong); }
  if(court){
    var cb = bouton("btn small btn-ghost", T(court.bouton), function(){ cb.disabled = true; montrerCourt(); });
    if(ouvreParCourt) { montrerCourt(); } else n.appendChild(cb);
  }
  function montrerCourt(){
    lignes(zoneCourt, court.lignes);
    var ret = S.zoneRetour(), v = vignettes(court.choix, court.lignes[0]);
    zoneCourt.appendChild(barreFilm(court.extrait, nu("regarder"), {surEntendu: function(){ ctx.note("ecoute", null, court.trace); }, sansLent: true,
      surEchec: function(){ ctx.note("film_absent"); }}));
    v.boutons.forEach(function(bt, i){
      bt.addEventListener("click", function(){
        bt.setAttribute("aria-pressed", "true");
        var juste = court.bonne.indexOf(court.choix[i].image) >= 0;
        ctx.rep("p1", valeurChoix(court.choix[i]), juste, court.trace);
        v.finir(court.bonne); S.montrerRetour(ret, court.retour, "ok");
        if(court.ensuite){ zoneCourt.appendChild(barreFilm(court.ensuite.extrait, nu(court.ensuite.bouton), {sansLent: true})); }
        if(!fini){ entendu = true; apres(); }
      });
    });
    zoneCourt.appendChild(v.box); zoneCourt.appendChild(ret);
    if(b.voir_toute_la_scene){
      var vs = bouton("btn small btn-ghost", T(b.voir_toute_la_scene.bouton), function(){ vs.disabled = true; zoneLong.appendChild(barreFilm(b.extrait, nu("regarder"), o)); });
      zoneCourt.appendChild(vs);
    }
    n.appendChild(zoneCourt);
  }
  n.appendChild(zoneApres);
  return n;
};

/* --- dialogue dévoilé : répliques avec rôle, étiquette de provenance et [▶] --- */
function noeudDialogue(repliques, o){
  o = o || {};
  var d = el("div", "dialogue");
  repliques.forEach(function(r){
    var rep = el("div", "replique " + (r.couleur === "personnel" ? "personnel" : "client"));
    rep.appendChild(el("span", "replique-qui", nomRole(r.role)));
    rep.appendChild(el("span", "replique-texte", r.texte));
    if(r.extrait && o.extraits){
      rep.appendChild(barreFilm(r.extrait, nu("regarder"), {sansLent: true, etiquette: "", surEntendu: function(){ if(o.surEcoute) o.surEcoute(); }}));
    }
    d.appendChild(rep);
  });
  return d;
}
R.dialogue_devoile = function(b, ctx){
  var n = el("div", "pas-corps");
  var c = ctx.consigne(); if(c) n.appendChild(c);
  var zone = el("div", "dialogue-zone");
  function montrer(){
    zone.appendChild(el("p", "listen-tag", etiquette(b.etiquette)));
    zone.appendChild(noeudDialogue(b.repliques, {extraits: true, surEcoute: function(){ ctx.note("reecoute"); }}));
    ctx.note("texte"); ctx.note("qui_parle");
    (b.boutons || []).forEach(function(k){
      if(k === "reecouter"){
        var prem = b.repliques.filter(function(r){ return r.extrait; })[0];
        if(prem) zone.appendChild(barreFilm(prem.extrait, nu("reecouter"), {sansLent: true, surEntendu: function(){ ctx.note("reecoute"); }}));
      }
    });
    if(b.lignes_apres) lignes(zone, b.lignes_apres, "note");
  }
  if(b.acces){
    var bt = bouton("btn", T(b.acces.bouton), function(){ bt.disabled = true; montrer(); ctx.fait(); });
    n.appendChild(bt);
  } else { montrer(); if(b.bouton) boutonSuiteDuPas(b, ctx, zone); else ctx.fait(); }
  n.appendChild(zone);
  return n;
};

/* --- l'apprenant dit une phrase (modèle, commande, geste) --- */
function noeudRec(b, ctx, trace){
  var r = b.enregistrement; if(!r) return null;
  return S.enregistreur(r.cle, r.secondes, {libelle: nu("m_enregistrer"), sansBoutonSans: true, consigne: T("rec_consigne"),
    surReponse: function(t){ ctx.note(t === "sans_micro" ? "sans_micro" : "enregistre", null, trace); }});
}
function aEnregistre(cle){ return !!(S.sonsSession && S.sonsSession[cle]); }
function blocComparer(ctx, trace, surFin, o){
  o = o || {};
  var z = el("div", "comparer");
  z.appendChild(el("p", "consigne", T("comparez")));
  var r = el("div", "reponses"), ret = S.zoneRetour();
  [["j_ai_dit_ca_ou_presque", "oui"], ["pas_encore", "pas_encore"]].forEach(function(x){
    var bt = el("button", "reponse", T(x[0])); bt.type = "button";
    bt.addEventListener("click", function(){
      ctx.rep("compare", x[1], null, trace);
      Array.prototype.forEach.call(r.querySelectorAll("button"), function(k){ k.disabled = true; });
      bt.setAttribute("aria-pressed", "true");
      if(x[1] === "pas_encore"){
        S.montrerRetour(ret, o.pasEncore || T("ecoutez_une_reponse"), "info");
        if(o.reessayer !== false){
          var rb = bouton("btn small", T("reessayer"), function(){ rb.remove(); ret.hidden = true; Array.prototype.forEach.call(r.querySelectorAll("button"), function(k){ k.disabled = false; k.setAttribute("aria-pressed", "false"); }); });
          z.appendChild(rb);
        }
      }
      if(surFin) surFin(x[1]);
    });
    r.appendChild(bt);
  });
  z.appendChild(r); z.appendChild(ret);
  return z;
}
R.dire = function(b, ctx){
  var n = el("div", "pas-corps");
  entete(b, ctx, n);
  lignes(n, b.lignes);
  var mode = E().mode;
  (b.modeles || []).forEach(function(m){
    var r = el("div", "role vous");
    r.appendChild(el("span", "role-qui", m.role));
    if(m.visible !== false) r.appendChild(el("p", "role-phrase", m.texte));
    if(m.son) r.appendChild(S.boutonSon(m.son, nu("ecouter"), {texte: m.texte, noeud: r, sansLent: false, etiquette: etiquette("cree"),
      surEntendu: function(){ ctx.note("ecoute", m.son); }, surAide: function(a){ ctx.note(a === "lent" ? "lent" : a); }, surEchec: function(){ ctx.note("son_absent"); }}));
    n.appendChild(r);
  });
  if(b.lignes_apres) lignes(n, b.lignes_apres);
  var rec = noeudRec(b, ctx, ctx.trace); if(rec) n.appendChild(rec);
  var zoneApres = el("div", "apres-dire"); n.appendChild(zoneApres);
  var reps = el("div", "reponses");
  var prof = b.retour || null;
  (b.boutons || []).forEach(function(k){
    var bt = el("button", "reponse", T(k)); bt.type = "button";
    bt.addEventListener("click", function(){
      Array.prototype.forEach.call(reps.querySelectorAll("button"), function(x){ x.disabled = true; });
      bt.setAttribute("aria-pressed", "true");
      var valeur = (k === "je_passe") ? "rien" : "repondu";
      if(k !== "je_redis_une_phrase") ctx.rep("parole", valeur, null);
      if(k === "je_redis_une_phrase"){ ctx.note("relance"); }
      suiteDire(k);
    });
    reps.appendChild(bt);
  });
  n.appendChild(reps);
  var phraseImage = null;
  function suiteDire(k){
    /* réponse possible selon l'image choisie (S4.4.d) : texte et [▶], après la tentative */
    var rp = b.reponse_possible;
    if(rp && k !== "je_passe"){
      var cible = null;
      if(rp.selon_image && courant.partage.image) cible = rp.selon_image[courant.partage.image];
      var z = el("div", "role vous");
      if(cible){
        var bt2 = bouton("btn small", T(rp.bouton), function(){
          bt2.disabled = true; z.appendChild(el("p", "role-phrase", cible.texte)); ctx.note("texte", "aide");
          z.appendChild(S.boutonSon(cible.son, nu("ecouter"), {texte: cible.texte, noeud: z, sansLent: false, etiquette: etiquette("cree"), surEntendu: function(){ ctx.note("ecoute", cible.son); }, surEchec: function(){ ctx.note("son_absent"); }}));
        });
        zoneApres.appendChild(bt2);
      } else if(rp.exemple){
        var bt3 = bouton("btn small", T(rp.bouton), function(){ bt3.disabled = true; z.appendChild(el("p", "role-phrase", rp.exemple)); ctx.note("texte", "aide"); });
        zoneApres.appendChild(bt3);
      }
      zoneApres.appendChild(z);
    }
    /* mode seul : « Comparez avec votre réponse », ou (S4.3) « Écoutez-vous : ça va ensemble ? » */
    if(mode === "seul" && prof && prof.seul_apres_enregistrement && b.enregistrement && aEnregistre(b.enregistrement.cle) && k !== "je_passe"){
      var q = prof.seul_apres_enregistrement, rt = S.zoneRetour(), rr = el("div", "reponses");
      lignes(zoneApres, q.lignes);
      q.boutons.forEach(function(kb){
        var x = el("button", "reponse", T(kb)); x.type = "button";
        x.addEventListener("click", function(){
          Array.prototype.forEach.call(rr.querySelectorAll("button"), function(y){ y.disabled = true; });
          ctx.rep("compare", kb === "oui" ? "oui" : "pas_encore", null);
          if(kb !== "oui"){
            S.montrerRetour(rt, q.pas_encore, "info");
            zoneApres.appendChild(barreFilm("film-p4", nu("ecouter_encore"), {sansLent: true, surEntendu: function(){ ctx.note("reecoute"); }}));
          }
          ctx.fait();
        });
        rr.appendChild(x);
      });
      zoneApres.appendChild(rr); zoneApres.appendChild(rt);
      return;
    }
    if(mode === "seul" && prof && prof.seul && prof.seul.boutons && k !== "je_passe"){
      lignes(zoneApres, prof.seul.lignes);
      zoneApres.appendChild(blocComparer(ctx, ctx.trace, function(){ ctx.fait(); }, {pasEncore: prof.seul.pas_encore && T(prof.seul.pas_encore)}));
      return;
    }
    if(k === "je_redis_une_phrase"){ reps.querySelectorAll("button").forEach(function(x){ x.disabled = false; x.setAttribute("aria-pressed", "false"); }); return; }
    ctx.fait();
  }
  return n;
};

/* --- serie de la banque (S0.7), facultative, hors des 45 minutes : option du formateur « verification_debut » --- */
R.serie_banque = function(b, ctx){
  var n = el("div", "pas-corps card douce");
  n.appendChild(el("h2", "sous-titre", b.titre));
  n.appendChild(el("p", "note", b.duree_texte));
  var forme = (E().options && E().options.forme_depart) === "B" ? "B" : "A";
  var ids = b.series[forme];
  var zone = el("div", "serie-zone");
  var go = bouton("btn", T("je_commence"), function(){ go.remove(); jouerSerie(zone, ids, "S0", ctx); });
  n.appendChild(go); n.appendChild(zone);
  return n;
};

/* ======================================================================
   5. ÉCOUTE SANS TEXTE (schéma E, K3) ET QUESTION DU SERVEUR (K4)
   ====================================================================== */
var NOMBRES = {un: "1", deux: "2", trois: "3", quatre: "4"};
function formateurLigne(texte){
  var d = el("div", "formateur-seulement"); d.appendChild(el("p", "small", T("pour_le_formateur") + " « " + texte + " »")); return d;
}
/* Bouton d'écoute d'un dialogue (UN fichier assemblé) ou d'un extrait du film. */
function ecouteur(sp, o){
  if(sp.extrait){
    return barreFilm(sp.extrait, o.libelle, {sansLent: true, surEntendu: o.surEntendu, surFin: o.surFin, surEchec: o.surEchec});
  }
  return S.boutonSon(sp.son, o.libelle, {couleur: "cree", sansLent: !!o.sansLent, etiquette: etiquette("cree"),
    surEntendu: o.surEntendu, surFin: o.surFin, surEchec: o.surEchec, surAide: o.surAide});
}
function normaliserE(b){
  return {trace: b.item || traceDe(b), son: b.son, extrait: b.extrait, image: b.image, consigne: b.consigne, question: b.question,
    e1: b.e1, e2: b.e2, e3: b.e3, e4: b.e4, e5: b.e5, suite: b.question_suite, bonne: b.bonne, forme: b.forme,
    avecImages: b.forme === "ecoute_avec_images", avecTexte: !!(b.e4 && b.e4.avec_texte), questionApres: false};
}
/* Dialogue de la banque, mis dans la forme du schéma E (la question n'arrive qu'après la 1re écoute). */
function normaliserBanque(id){
  var d = C.banque.dialogues[id], et = C.banque.etapes, nombre = d.saisie === "nombre";
  var imgs = d.images.map(function(i){ return {image: i.image, libelle: i.libelle, valeur: J.valeurBanque(d, i.image)}; });
  return {trace: J.CODE_BANQUE[id] || id, son: d.son, consigne: et.b1.consigne, question: d.question, questionApres: true,
    e1: {lignes: et.b1.lignes, bouton: et.b1.bouton},
    e2: {saisie: d.saisie, nombre_max: 4, consigne: nombre ? et.b2.consigne_nombre : d.consigne_question, lignes: et.b2.lignes, boutons: nombre ? et.b2.boutons_nombre : et.b2.boutons},
    e3: {lignes: et.b3.lignes, images: imgs},
    e4: {consigne: et.b4.consigne, lignes: et.b4.lignes, bouton: et.b4.bouton},
    e5: {etiquette: d.etiquette, repliques: d.texte_final.repliques.map(function(r){ return {role: r.role, couleur: /serv/i.test(r.role) ? "personnel" : "client", texte: r.texte}; }),
      boutons: et.b5.boutons, retour: {commun: d.texte_final.retour}},
    bonne: {valeur: J.valeurBanque(d, d.bonne), image: d.bonne}};
}
R.ecoute_sans_texte = function(b, ctx){ return composantE(normaliserE(b), ctx); };

function composantE(sp, ctx){
  var ecr = sp.ecr || ctx.ecr, cle = ecr + "/" + sp.trace;
  var boite = el("div", "ecoute-e"), zone = el("div", "e-zone"); zone.tabIndex = -1; boite.appendChild(zone);
  var st = {derniere: null, paiementImage: null, paiementFaux: false, passe: {}, reps: {}};
  function note(ev, d, item){ S.journal.note(ecr, item || sp.trace, ev, d); }
  function rep(c, v, j, item){ S.journal.reponse(ecr, item || sp.trace, c, v, j); }
  function vider(focus){ zone.innerHTML = ""; if(focus){ try{ zone.focus({preventScroll: true}); }catch(e){} } }
  function consigneDe(id){
    if(!id || !C.sons[id]) return null;
    return S.boutonSon(id, nu("ecouter_la_consigne"), {texte: sonTexte(id), couleur: "consigne", sansLent: true, etiquette: "", surEntendu: function(){ note("consigne_lue"); }});
  }
  function unefois(k, fn){ return function(){ if(st.passe[k]) return; st.passe[k] = true; fn.apply(null, arguments); }; }
  /* lecture : une seule fois ; si le son ne marche pas, on peut recommencer, puis continuer sans le son */
  function lecture(libelle, surEntendu, apres, sansLent){
    var entendu = false, wrap = el("div", "e-lecture"), fin = unefois("l" + libelle + Math.random(), apres);
    wrap.appendChild(ecouteur(sp, {libelle: libelle, sansLent: sansLent !== false,
      surEntendu: function(){ entendu = true; if(surEntendu) surEntendu(); },
      surFin: function(){ if(entendu) fin(); },
      surEchec: function(){
        note("son_absent");
        if(!wrap.querySelector(".sans-son")){ var c = continuerSansSon(function(){ fin(); }); c.classList.add("sans-son"); wrap.appendChild(c); }
      }, surAide: function(a){ if(a === "lent") note("lent"); }}));
    return wrap;
  }
  function sourceFormateur(){
    if(!VUE_FORMATEUR) return null;
    var s = C.sons[sp.son], reps = s && s.repliques;
    var t = reps ? reps.map(function(r){ return r.role + " : " + r.texte; }).join(" — ") : (sp.extrait && C.video.extraits_meta[sp.extrait] ? C.video.extraits_meta[sp.extrait].texte : "");
    return t ? formateurLigne(t) : null;
  }
  /* ---------- E1 : première écoute, une seule fois ---------- */
  function e1(){
    vider(); ctx.verrou(true); ctx.stade("e1");
    if(sp.image) zone.appendChild(figure(sp.image));
    var c = consigneDe(sp.consigne); if(c) zone.appendChild(c);
    lignes(zone, sp.e1.lignes);
    var suite = sp.avecImages ? imagesPendant : e2;
    zone.appendChild(lecture(nu(sp.e1.bouton || "ecouter"), function(){ note("ecoute"); }, suite, true));
    var sf = sourceFormateur(); if(sf) zone.appendChild(sf);
  }
  /* palier « plus simple » : écoute avec les images visibles (aucune mesure) */
  function imagesPendant(){
    vider(true); ctx.stade("e3"); note("images");
    lignes(zone, sp.e3.lignes);
    choix(sp.e3.images, "apres_images", function(){ suiteApresImages(); });
  }
  /* ---------- E2 : réponse libre, sans image ---------- */
  function e2(){
    vider(true); ctx.stade("e2");
    if(sp.questionApres && sp.question) zone.appendChild(paragraphe(sp.question, "consigne"));
    var c = consigneDe(sp.e2.consigne); if(c) zone.appendChild(c);
    lignes(zone, sp.e2.lignes);
    var box = el("div", "reponses"); box.setAttribute("role", "group");
    sp.e2.boutons.forEach(function(k){
      var bt = el("button", "reponse", T(k)); bt.type = "button"; bt.setAttribute("aria-pressed", "false"); bt.setAttribute("data-valeur", k);
      bt.addEventListener("click", function(){
        bt.setAttribute("aria-pressed", "true");
        Array.prototype.forEach.call(box.querySelectorAll("button"), function(x){ x.disabled = true; });
        var v = /^chiffre_/.test(k) ? k.replace("chiffre_", "") : k === "je_ne_sais_pas" ? "nsp" : "dit";
        var juste = null;
        if(sp.e2.saisie === "nombre" && v !== "nsp") juste = (v === NOMBRES[sp.bonne.valeur]);
        st.reps.p1 = v; rep("p1", v, juste);
        ctx.signal("e2");
        e3();
      });
      box.appendChild(bt);
    });
    zone.appendChild(box);
  }
  /* ---------- images à toucher (E3, E4) ---------- */
  function choix(images, cond, apres){
    var v = vignettes(images, "");
    var nsp = el("button", "reponse", T("je_ne_sais_pas")); nsp.type = "button";
    function fige(){ v.figer(); nsp.disabled = true; }
    v.boutons.forEach(function(bt, i){
      bt.addEventListener("click", function(){
        bt.setAttribute("aria-pressed", "true"); fige();
        var val = images[i].valeur, juste = val === sp.bonne.valeur;
        st.derniere = juste; st.reps[cond] = val; rep(cond, val, juste); apres(val, juste, images[i]);
      });
    });
    nsp.addEventListener("click", function(){ fige(); st.derniere = false; st.reps[cond] = "nsp"; rep(cond, "nsp", null); apres("nsp", false, null); });
    zone.appendChild(v.box);
    var r = el("div", "reponses"); r.appendChild(nsp); zone.appendChild(r);
  }
  function e3(){
    vider(true); ctx.stade("e3"); note("images");
    var c = consigneDe(sp.e3.consigne); if(c) zone.appendChild(c);
    lignes(zone, sp.e3.lignes);
    choix(sp.e3.images, "apres_images", function(){ if(sp.e4) e4(); else suiteApresImages(); });
  }
  /* ---------- E4 : réécoute identique, puis les mêmes images ---------- */
  function e4(){
    vider(true); ctx.stade("e4");
    var c = consigneDe(sp.e4.consigne); if(c) zone.appendChild(c);
    lignes(zone, sp.e4.lignes);
    if(sp.avecTexte && sp.e5){ zone.appendChild(noeudDialogue(sp.e5.repliques)); note("texte", "aide"); }
    var cond = sp.avecTexte ? "apres_texte" : "apres_reecoute";
    zone.appendChild(lecture(nu(sp.e4.bouton || "ecouter_encore"), function(){ note("reecoute"); }, function(){
      var z2 = el("div", "e-images"); zone.appendChild(z2);
      var avant = zone; /* les images arrivent sous le bouton */
      choix(sp.e3.images, cond, function(){ suiteApresImages(); });
    }, true));
  }
  function suiteApresImages(){ if(sp.suite) questionSuite(); else e5(); }
  /* ---------- question de suite (« La cliente paie comment ? ») ---------- */
  function questionSuite(){
    var q = sp.suite; vider(true);
    var c = consigneDe(q.consigne); if(c) zone.appendChild(c);
    lignes(zone, q.lignes);
    ctx.signal("question_suite");
    function images(){
      note("images", null, sp.trace);
      var v = vignettes(q.images, "");
      v.boutons.forEach(function(bt, i){
        bt.addEventListener("click", function(){
          bt.setAttribute("aria-pressed", "true"); v.figer();
          var juste = q.images[i].valeur === q.bonne.valeur;
          rep("apres_images", q.images[i].valeur, juste, q.trace);
          st.paiementImage = q.images[i].image;
          if(!juste){ ctx.p.faux = true; }
          majAides(); e5();
        });
      });
      zone.appendChild(v.box);
    }
    if(q.images_cachees){
      var r = el("div", "reponses");
      var dit = el("button", "reponse", T("c_est_dit")); dit.type = "button";
      dit.addEventListener("click", function(){ rep("p1", "dit", null, q.trace); e5(); });
      var voir = el("button", "reponse", T(q.acces_images || "voir_les_images")); voir.type = "button";
      voir.addEventListener("click", function(){ voir.disabled = true; dit.disabled = true; images(); });
      r.appendChild(dit); r.appendChild(voir); zone.appendChild(r);
    } else images();
  }
  /* ---------- E5 : le texte, les rôles, le retour ---------- */
  function e5(rejoue){
    vider(true); ctx.verrou(false); ctx.stade("e5");
    if(!rejoue){ E().deja[cle] = {t: new Date().toISOString(), etape: "fin"}; S.sauverBientot(); }
    var e = sp.e5;
    if(!e){ ctx.fait(); return; }
    if(!rejoue){ note("texte", "e5"); note("qui_parle"); }
    zone.appendChild(el("p", "listen-tag", etiquette(e.etiquette)));
    zone.appendChild(noeudDialogue(e.repliques));
    var bars = el("div", "e-barres");
    bars.appendChild(ecouteur(sp, {libelle: nu("reecouter"), sansLent: !!sp.extrait ? true : false, surEntendu: function(){ note("reecoute"); }, surAide: function(a){ if(a === "lent") note("lent"); }, surEchec: function(){ note("son_absent"); }}));
    if(e.son_cliente) bars.appendChild(S.boutonSon(e.son_cliente, nu("la_cliente"), {texte: sonTexte(e.son_cliente), couleur: "cree", etiquette: etiquette("cree"), surEntendu: function(){ note("reecoute", e.son_cliente); }}));
    zone.appendChild(bars);
    if(e.images){
      var im = el("div", "choix-images");
      e.images.forEach(function(id){ var f = el("figure", "contexte"); var p = picto(id, "moyen"); if(p) f.appendChild(p); if(sp.suite) { var l = sp.suite.images.filter(function(x){ return x.image === id; })[0]; if(l) f.appendChild(el("figcaption", "small", l.libelle)); } im.appendChild(f); });
      zone.appendChild(im);
    }
    var ret = S.zoneRetour(), r = e.retour || {}, t = "";
    if(e.retour_moment){
      var rm = e.retour_moment;
      t = st.derniere ? rm.si_bonne : rm.sinon;
      if(!st.derniere && rm.bouton_sinon) zone.appendChild(S.boutonSon(rm.bouton_sinon.son, nu(rm.bouton_sinon.libelle), {texte: sonTexte(rm.bouton_sinon.son), couleur: "cree", etiquette: etiquette("cree"), sansLent: true}));
    } else if(r.texte != null) t = texteRetour({prefixe_si_bonne: r.prefixe_si_bonne, commun: r.texte}, st.derniere);
    else if(r.commun) t = r.commun;
    if(r.rappel_reponses){
      var vals = [st.reps.p1, st.reps.apres_images, st.reps.apres_reecoute].map(function(v, i){
        if(v == null) return "—";
        if(v === "nsp") return T("je_ne_sais_pas").toLowerCase();
        var im = sp.e3.images.filter(function(x){ return x.valeur === v; })[0];
        return i === 0 ? J.libValeur(v) : (im ? im.libelle : v);
      });
      var k = 0; var rr = r.rappel_reponses.replace(/…/g, function(){ return vals[k++]; });
      t += (t ? " " : "") + rr;
    }
    if(e.retour_paiement && st.paiementImage && e.retour_paiement[st.paiementImage]){
      var rp = e.retour_paiement[st.paiementImage]; t += (t ? " " : "") + rp.texte;
      if(rp.bouton) zone.appendChild(S.boutonSon(rp.bouton.son, nu(rp.bouton.libelle), {texte: sonTexte(rp.bouton.son), couleur: "cree", etiquette: etiquette("cree"), sansLent: true}));
    }
    if(t){ S.montrerRetour(ret, t, "info"); zone.appendChild(ret); }
    ctx.signal("e5"); ctx.fait();
  }
  /* ---------- fin sans texte (S0) ---------- */
  /* « Déjà fait » : une écoute terminée ne se rejoue pas dans la même séance */
  if(E().deja[cle]){
    var d = el("div", "retour info"); d.setAttribute("role", "status"); d.textContent = T("etat_deja_fait"); zone.appendChild(d);
    var L = S.journal.reponses(ecr, sp.trace);
    if(L.length){
      var ul = el("ul", "deja");
      L.forEach(function(r){ var lib = r.cond === "p1" ? T("ecoute_1") : r.cond === "apres_images" ? T("avec_les_images") : r.cond === "apres_reecoute" ? T("ecoute_2") : r.cond; ul.appendChild(el("li", null, lib + " : " + J.libValeur(r.valeur))); });
      zone.appendChild(ul);
    }
    if(sp.e5) e5(true); else ctx.fait();
    return boite;
  }
  /* les images de réponse et le texte ne sont créés qu'à leur étape : rien dans le DOM avant */
  e1();
  return boite;
}

/* --- série de la banque (S0.7, après le cours) : une écoute sans texte après l'autre --- */
function ctxBanque(ecr, surFait){
  return {ecr: ecr, p: {faux: false}, stade: function(){}, signal: function(){}, verrou: function(on){ poserVerrou(on); }, fait: surFait, note: function(){}, rep: function(){}};
}
function jouerSerie(zone, ids, ecr, ctx, fin){
  var i = 0;
  function suivant(){
    if(i >= ids.length){ if(fin) fin(); else if(ctx) ctx.fait(); return; }
    var id = ids[i++], sp = normaliserBanque(id); sp.ecr = ecr;
    var w = el("div", "serie-item"); zone.appendChild(w);
    w.appendChild(composantE(sp, ctxBanque(ecr, function(){ suivant(); })));
  }
  suivant();
}

/* --- question du serveur (K4) --- */
function rejouer(ids, lent){
  var rien = function(){};
  if(ids.length === 1) S.sons.jouer(ids[0], {lent: lent}, rien, rien, null);
  else S.sons.jouerSuite(ids, {lent: lent}, rien, null, rien, null);
}
function cercle(){
  var s = el("span", "cercle"); s.setAttribute("aria-hidden", "true");
  s.innerHTML = '<svg viewBox="0 0 40 40" width="44" height="44" focusable="false"><circle cx="20" cy="20" r="16" class="cercle-fond"/><circle cx="20" cy="20" r="16" class="cercle-trait"/></svg>';
  return s;
}
function blocPossibles(rp, liste, ctx, trace){
  var z = el("div", "possibles card douce");
  z.appendChild(el("h3", "sous-titre", T("reponses_possibles")));
  (liste || []).forEach(function(r){
    var l = el("div", "possible"); l.appendChild(el("p", "role-phrase", r.texte));
    if(r.son) l.appendChild(S.boutonSon(r.son, nu("ecouter"), {texte: r.texte, couleur: "cree", sansLent: false, etiquette: etiquette("cree"),
      surEntendu: function(){ ctx.note("ecoute", r.son, trace); }, surAide: function(a){ if(a === "lent") ctx.note("lent", null, trace); }, surEchec: function(){ ctx.note("son_absent", null, trace); }}));
    z.appendChild(l);
  });
  if(rp && rp.aussi && rp.aussi.length){ z.appendChild(el("p", "note", T("aussi_possible") + " " + rp.aussi.map(function(a){ return "« " + a + " »"; }).join(" · "))); }
  return z;
}
function apresReponse(ar){
  var z = el("div", "apres-reponse");
  if(ar.lignes) z.appendChild(noeudDialogue(ar.lignes.map(function(l){ return {role: l.role, couleur: /serveur/i.test(l.role) ? "personnel" : "client", texte: l.texte}; })));
  if(ar.comparaison_cote_a_cote){ var d = el("div", "deux-images"); ar.comparaison_cote_a_cote.forEach(function(t){ d.appendChild(el("p", "card douce role-phrase", t)); }); z.appendChild(d); }
  if(ar.note) z.appendChild(el("p", "note", ar.note));
  return z;
}
R.question_serveur = function(b, ctx){
  var n = el("div", "pas-corps"), mode = E().mode;
  entete(b, ctx, n); lignes(n, b.lignes);
  if(b.glose) n.appendChild(paragraphe(b.glose, "note"));
  var q = b.serveur, rpListe = b.reponses_possibles && b.reponses_possibles.liste;
  if(b.serveur_tirage){ var pick = b.serveur_tirage[hasard(b.serveur_tirage.length)]; q = {texte: pick.texte, son: pick.son, role: "serveur", son_modes: b.serveur_modes_son}; rpListe = pick.reponses_possibles; }
  q = q || {};
  var modes = q.son_modes || ["seul"];
  var sonOk = !!q.son && modes.indexOf(mode) >= 0;
  var rp = b.reponses_possibles, avecRp = !!(rp && rp.modes.indexOf(mode) >= 0);
  if(VUE_FORMATEUR && q.texte) n.appendChild(formateurLigne(q.texte));
  var aide = b.images_aide || b.images;
  if(aide){ var va = vignettes(aide.map(function(i){ return {image: i, libelle: ""}; }), ""); va.figer(); n.appendChild(va.box); ctx.note("images"); }
  var zq = el("div", "zone-question"), zr = el("div", "zone-reponses"), za = el("div", "zone-apres");
  n.appendChild(zq); n.appendChild(zr); n.appendChild(za);
  var relances = 0, termine = false, boutons = [];
  function showReponses(){
    if(zr.firstChild) return;
    if(mode === "seul"){ var h = el("div", "a-vous"); h.appendChild(cercle()); h.appendChild(el("p", "consigne", T("a_vous_repondez"))); zr.appendChild(h); }
    if(b.enregistrement){ var rec = noeudRec(b, ctx, ctx.trace); if(rec) zr.appendChild(rec); }
    var box = el("div", "reponses"); box.setAttribute("role", "group"); zr.appendChild(box);
    var liste = b.reponses.slice();
    if(mode === "seul" && sonOk) liste.push({valeur: "reecouter", libelle: "reecouter"});
    liste.forEach(function(r){
      var bt = el("button", "reponse", T(r.libelle)); bt.type = "button"; bt.setAttribute("data-valeur", r.valeur); boutons.push(bt);
      bt.addEventListener("click", function(){ clic(r, bt); });
      box.appendChild(bt);
    });
  }
  function clic(r, bt){
    if(termine) return;
    var v = r.valeur;
    if(v === "reecouter"){ ctx.note("reecoute"); if(sonOk) rejouer([q.son], false); return; }
    if(v === "relance"){                                   /* « Je demande de répéter » : 0,9×, puis une image s'ajoute */
      relances++; ctx.note("repetition");
      if(sonOk && mode === "seul") rejouer([q.son], true);
      if(relances >= 2 && b.image && !za.querySelector(".relance-image")){ var f = figure(b.image); f.classList.add("relance-image"); za.appendChild(f); ctx.note("images"); }
      return;
    }
    if(v === "pardon" || v === "repete"){ ctx.rep("parole", "pardon", null); ctx.note("repetition"); if(sonOk && mode === "seul") rejouer([q.son], false); return; }
    termine = true;
    boutons.forEach(function(x){ x.disabled = true; }); bt.setAttribute("aria-pressed", "true");
    ctx.rep("parole", v === "je_commence" ? "repondu" : v, null);
    if(b.apres_reponse) za.appendChild(apresReponse(b.apres_reponse));
    if(b.images_aide_apres_essai){ var vv = vignettes(b.images_aide_apres_essai.map(function(i){ return {image: i, libelle: ""}; }), ""); vv.figer(); za.appendChild(vv.box); ctx.note("images"); }
    if(mode === "seul" && b.sens_seul) za.appendChild(el("p", "note", b.sens_seul));
    var fini = function(){ if(r.effet === "ouvre_s0_et_lance_le_chrono"){ ctx.fait(); E().fait[courant.id] = true; allerEcran("s0"); } else ctx.fait(); };
    var retour = b.retour && b.retour.tous;
    if(avecRp && rpListe && rpListe.length){
      za.appendChild(blocPossibles(rp, rpListe, ctx, ctx.trace));
      if(rp.message_final){ var mf = el("p", "retour info", rp.message_final); mf.setAttribute("role", "status"); za.appendChild(mf); }
      if(retour){ var rt = el("p", "retour info", retour); rt.setAttribute("role", "status"); za.appendChild(rt); }
      if(rp.comparer) za.appendChild(blocComparer(ctx, ctx.trace, function(){ ctx.fait(); }, {reessayer: rp.reessayer}));
      else fini();
      return;
    }
    if(retour){ var rt2 = el("p", "retour info", retour); rt2.setAttribute("role", "status"); S.espacesFr(rt2); za.appendChild(rt2); }
    fini();
  }
  if(mode === "seul" && sonOk){
    zq.appendChild(S.boutonSon(q.son, nu(q.role === "serveuse" ? "ecouter_la_serveuse" : "ecouter_le_serveur"), {texte: q.texte, couleur: "cree", sansLent: false, etiquette: etiquette("cree"),
      surEntendu: function(){ ctx.note("ecoute"); showReponses(); },
      surAide: function(a){ if(a === "lent") ctx.note("lent"); },
      surEchec: function(){ ctx.note("son_absent"); showReponses(); }}));
  } else showReponses();
  return n;
};

/* ======================================================================
   6. CONVERSATIONS DE S5
   ====================================================================== */
R.conversation = function(b, ctx){
  var n = el("div", "pas-corps"), mode = E().mode, P = courant.partage;
  entete(b, ctx, n); lignes(n, b.lignes);
  var corps = el("div", "conv-corps");
  var avh = b.aide_visible;
  if(avh && avh.type !== "rien"){
    var av = el("div", "card douce aide-visible");
    if(avh.images_fixes || avh.image_tiree_au_sort){
      var cle = "tire" + b.id, ims = (avh.images_fixes || []).slice();
      if(avh.image_tiree_au_sort){ if(P[cle] == null) P[cle] = avh.image_tiree_au_sort[hasard(avh.image_tiree_au_sort.length)]; ims.push(P[cle]); }
      var d = el("div", "choix-images");
      ims.forEach(function(id){ var f = el("figure", "contexte"); var p = picto(id, "moyen"); if(p){ f.appendChild(p); f.setAttribute("role", "img"); f.setAttribute("aria-label", altDe(id)); } d.appendChild(f); });
      av.appendChild(d); ctx.note("images");
    }
    (avh.phrases || []).forEach(function(t){ av.appendChild(el("p", "role-phrase", t)); });
    if(avh.type === "texte") ctx.note("carte");
    if(avh.rappel_pardon) av.appendChild(el("p", "note", avh.rappel_pardon));
    corps.appendChild(av);
  }
  /* ordre des tours (conversation 3 : A ou B) */
  var tours = b.tours.slice();
  if(b.ordre){
    var o = (E().options && E().options.ordre_s5) || b.ordre.defaut;
    if(mode === "seul" && b.ordre.mode_seul === "tirage_au_sort"){ if(!P.ordre) P.ordre = hasard(2) ? "B" : "A"; o = P.ordre; }
    if(o === "B"){
      var ix = []; tours.forEach(function(t, i){ if(t.ordre_ab) ix.push(i); });
      if(ix.length === 2){ var tmp = tours[ix[0]]; tours[ix[0]] = tours[ix[1]]; tours[ix[1]] = tmp; }
    }
  }
  var rec = noeudRec(b, ctx, ctx.trace);
  var zt = el("div", "conv-tours"), zf = el("div", "conv-fin"); corps.appendChild(zt);
  var rep2 = {n: 0};
  function son(t){ return t.sons; }
  function jouerBouton(t){
    var ids = son(t);
    var o = {couleur: "cree", sansLent: true, etiquette: etiquette("cree"), surEchec: function(){ ctx.note("son_absent"); }};
    if(ids.length === 1) return S.boutonSon(ids[0], nu("ecouter_le_serveur"), o);
    return S.boutonDialogue(ids.map(function(i){ return {id: i}; }), nu("ecouter_le_serveur"), o);
  }
  function tour(i){
    if(i >= tours.length){ finale(); return; }
    var t = tours[i], w = el("div", "conv-tour"); zt.appendChild(w);
    var relances = 0;
    var seulSon = mode === "seul";
    if(seulSon) w.appendChild(jouerBouton(t));
    if(t.fin){ if(!seulSon){} setTimeout(function(){}, 0); tour(i + 1); return; }
    var h = el("div", "a-vous"); if(seulSon) h.appendChild(cercle()); h.appendChild(el("p", "consigne", T("a_vous_repondez"))); w.appendChild(h);
    var box = el("div", "reponses"); box.setAttribute("role", "group");
    var liste = seulSon ? ((b.seul && b.seul.boutons) || ["j_ai_repondu", "reecouter", "je_demande_de_repeter"]) : ["j_ai_repondu", "j_ai_demande_de_repeter"];
    var images = t.images || (t.reponse === "toucher_l_image_ou_un_mot" && avh && avh.image_tiree_au_sort ? avh.image_tiree_au_sort : null);
    if(images){
      var v = vignettes(images.map(function(id){ return {image: id, libelle: ""}; }), "");
      v.boutons.forEach(function(bt, k){
        bt.addEventListener("click", function(){
          bt.setAttribute("aria-pressed", "true"); v.figer();
          var juste = t.bonne ? images[k] === t.bonne : null;
          ctx.rep("image", J.valeurImage(images[k]), juste, ctx.trace);
          if(t.a_reconnaitre_seulement || t.reponse === "toucher_une_image"){ boutons.forEach(function(x){ x.disabled = true; }); tour(i + 1); }
        });
      });
      w.appendChild(v.box);
    }
    var boutons = [];
    liste.forEach(function(k){
      var bt = el("button", "reponse", T(k)); bt.type = "button"; bt.setAttribute("data-valeur", k); boutons.push(bt);
      bt.addEventListener("click", function(){
        if(k === "reecouter"){ ctx.note("reecoute"); rejouer(son(t), false); return; }
        if(k === "je_demande_de_repeter" || k === "j_ai_demande_de_repeter"){
          relances++; rep2.n++; ctx.note("repetition");
          if(k === "je_demande_de_repeter") rejouer(son(t), true);
          if(relances >= 2 && t.image_relance && !w.querySelector(".relance-image")){ var f = figure(t.image_relance); f.classList.add("relance-image"); w.appendChild(f); ctx.note("images"); }
          return;
        }
        boutons.forEach(function(x){ x.disabled = true; }); bt.setAttribute("aria-pressed", "true");
        ctx.rep("parole", "repondu", null);
        tour(i + 1);
      });
      box.appendChild(bt);
    });
    w.appendChild(box);
  }
  function finale(){
    if(mode === "seul" && b.reponses_possibles_fin && b.reponses_possibles_fin.length){
      var tout = el("div", "possibles-fin");
      b.reponses_possibles_fin.forEach(function(r){
        tout.appendChild(blocPossibles({aussi: r.aussi}, r.liste, ctx, ctx.trace));
        if(r.sens) tout.appendChild(el("p", "note", r.sens));
      });
      zf.appendChild(tout);
      zf.appendChild(blocComparer(ctx, ctx.trace, function(){ fin(); }, {}));
    } else if(b.verif && mode !== "seul"){
      var v = b.verif, rr = el("div", "reponses"), ret = S.zoneRetour(), fait = false;
      lignes(zf, v.lignes);
      v.boutons.forEach(function(k){
        var bt = el("button", "reponse", T(k)); bt.type = "button";
        bt.addEventListener("click", function(){
          Array.prototype.forEach.call(rr.querySelectorAll("button"), function(x){ x.disabled = true; });
          ctx.rep("verif", k, null, v.trace);
          if(k === "non" && v.non) S.montrerRetour(ret, v.non.retour, "info");
          fin();
        });
        rr.appendChild(bt);
      });
      zf.appendChild(rr); zf.appendChild(ret);
    } else fin();
  }
  var fini = false;
  function fin(){
    if(fini) return; fini = true;
    if(b.apres_premier_essai){
      var ap = b.apres_premier_essai, zi = el("div");
      var bi = bouton("btn small", T(ap.bouton), function(){ bi.disabled = true; var v = vignettes(ap.images.map(function(i){ return {image: i, libelle: ""}; }), ""); v.figer(); zi.appendChild(v.box); ctx.note("images"); });
      zi.appendChild(bi); zf.appendChild(zi);
    }
    var fb = b.fin && b.fin.bouton;
    if(fb){
      var msg = b.fin.message ? T(b.fin.message) : null;
      var bt = bouton("btn btn-primary", T(fb), function(){
        bt.disabled = true;
        if(msg){ var m = el("p", "retour ok", msg); m.setAttribute("role", "status"); zf.appendChild(m); S.espacesFr(m); }
        ctx.fait();
      });
      zf.appendChild(bt);
    } else ctx.fait();
  }
  /* défi facultatif : [Je fais le défi] [Je passe] */
  if(b.boutons_depart){
    var dep = el("div", "reponses");
    corps.hidden = true;
    b.boutons_depart.forEach(function(k){
      var bt = el("button", "reponse", T(k)); bt.type = "button";
      bt.addEventListener("click", function(){
        Array.prototype.forEach.call(dep.querySelectorAll("button"), function(x){ x.disabled = true; });
        if(k === "je_passe"){ ctx.rep("parole", "rien", null); ctx.fait(); return; }
        corps.hidden = false; tour(0);
      });
      dep.appendChild(bt);
    });
    n.appendChild(dep);
  } else tour(0);
  if(rec) corps.appendChild(rec);
  corps.appendChild(zf);
  n.appendChild(corps);
  return n;
};

/* ======================================================================
   6 (suite). BILAN DE S6, EXPORT, APRÈS LE COURS, LIENS
   ====================================================================== */
var BI = C.bilan;
function trouverBloc(idEcran, item){
  var ec = ECRANS.filter(function(x){ return x.id === idEcran; })[0], r = null;
  if(ec) ec.pas.forEach(function(p){ if(p.item === item) r = p; });
  return r;
}
function derniere(ecr, item, cond){
  var L = S.journal.reponses(ecr, item).filter(function(r){ return r.cond === cond; });
  return L.length ? L[L.length - 1] : null;
}
function motsNombre(v){ return {"1": "un", "2": "deux", "3": "trois", "4": "quatre"}[v] || v; }
function pasDeJe(txt){ return E().mode === "groupe" ? txt.replace(/\bj'ai\b/g, BI.blocs[0].mode_groupe.remplacer[1]) : txt; }
/* Une ligne « À la première écoute : j'ai répondu « deux ». C'est la bonne réponse. » — exactitude seulement, aucune note. */
function ligneEcoute(bloc, sec, cle, etiquette){
  var ecr = sec.item.charAt(0) + sec.item.charAt(1), bE = trouverBloc(ecr.toLowerCase(), sec.item);
  var cond = {p1: "p1", img: "apres_images", re: "apres_reecoute"}[cle];
  var r = derniere(ecr, sec.item, cond), P = bloc.phrases, cat;
  var attenduP1 = motsNombre(bE.bonne.valeur), attenduImg = bE.bonne.libelle;
  function lib(v){ var im = bE.e3.images.filter(function(x){ return x.valeur === v; })[0]; return im ? im.libelle : v; }
  var txt;
  if(!r) txt = P.absente[cle];
  else if(r.valeur === "nsp") txt = (P.non_donnee[cle] || "").replace("{attendue}", cle === "p1" ? attenduP1 : attenduImg);
  else if(r.valeur === "dit") txt = P.idee.p1;
  else {
    cat = r.juste ? "correcte" : "incorrecte";
    txt = P[cat][cle].replace("{valeur}", cle === "p1" ? motsNombre(r.valeur) : lib(r.valeur)).replace("{attendue}", cle === "p1" ? attenduP1 : attenduImg);
  }
  return etiquette + " : " + pasDeJe(txt);
}
function ligneCours(item, ordre){
  var cours = BI.blocs[1], W = cours.valeurs_en_mots, ecr = item.slice(0, 2);
  var ABS = BI.blocs[0].phrases.absente.p1;
  function suffixe(juste, attendue){ return juste ? "C'est la bonne réponse." : "La bonne réponse : « " + attendue + " »."; }
  if(item === "S1-C1"){
    var r = derniere("S1", "S1-C1", "p1"); if(!r) return "Le film : " + ABS;
    var mot = W[r.valeur === "addition" ? "payer" : "commander"], att = W.payer;
    return "Le film : que font les deux personnes ? J'ai choisi « " + mot + " ». " + suffixe(r.juste, att);
  }
  var bE = trouverBloc("s2", item);
  if(item === "S2-C4"){
    var p1 = derniere("S2", item, "p1"), fin = derniere("S2", "s2d.choix_final", "apres_images"), P = BI.blocs[0].phrases;
    var l1 = !p1 ? P.absente.p1 : p1.valeur === "nsp" ? P.ne_sais_pas.p1 : P.idee.p1;
    var l2 = !fin ? P.absente.img : pasDeJe(P[fin.juste ? "correcte" : "incorrecte"].img.replace("{valeur}", W[fin.valeur === "especes" ? "especes" : "carte"]).replace("{attendue}", W.carte));
    return "Carte ou espèces ? À la première écoute : " + pasDeJe(l1) + " Avec les images : " + l2;
  }
  var r2 = derniere("S2", item, "apres_images") || derniere("S2", item, "apres_texte");
  var nph = ["S2-C1", "S2-C2", "S2-C3"].indexOf(item) + 1;
  if(!r2) return "Phrase " + nph + " du film : " + ABS;
  if(r2.valeur === "nsp") return "Phrase " + nph + " du film : j'ai choisi « je ne sais pas ». La bonne réponse : « " + W[bE.bonne.valeur] + " ».";
  return "Phrase " + nph + " du film : j'ai choisi « " + W[r2.valeur] + " ». " + suffixe(r2.juste, W[bE.bonne.valeur]);
}
function compter(ev){ return E().journal.filter(function(x){ return x.ev === ev; }).length; }
function nbReponses(){
  var n = 0, P = 0;
  Object.keys(E().rep).forEach(function(k){ E().rep[k].forEach(function(r){ if(r.cond === "parole"){ if(r.valeur === "repondu") n++; if(r.valeur === "pardon") P++; } }); });
  return {reponses: n, repetitions: P + compter("repetition")};
}
R.bilan = function(b, ctx){
  var n = el("div", "pas-corps bilan");
  var c = ctx.consigne(); if(c) n.appendChild(c);
  n.appendChild(el("h2", "sous-titre", BI.titre));
  n.appendChild(el("p", "note", BI.avertissement));
  if(E().mode === "groupe") n.appendChild(el("p", "note", BI.blocs[0].mode_groupe.sous_titre));
  BI.blocs.forEach(function(bl){
    var s = el("section", "card bilan-bloc"); s.setAttribute("data-bloc", bl.id);
    s.appendChild(el("h3", "sous-titre", bl.titre));
    if(bl.id === "ecoute"){
      bl.sections.forEach(function(sec){
        s.appendChild(el("h4", "sous-titre", sec.titre));
        s.appendChild(el("p", null, sec.question));
        var ul = el("ul");
        bl.lignes.forEach(function(l){ ul.appendChild(el("li", null, ligneEcoute(bl, sec, l.cle, l.etiquette))); });
        s.appendChild(ul);
      });
      var dd = bl.dialogue_debut, zd = el("div", "dialogue-debut");
      var bt = bouton("btn small", T(dd.acces), function(){
        bt.disabled = true;
        zd.appendChild(el("p", "listen-tag", etiquette(dd.etiquette)));
        zd.appendChild(noeudDialogue(dd.repliques));
        zd.appendChild(S.boutonSon(dd.son, nu("reecouter"), {couleur: "cree", etiquette: etiquette("cree"), surEntendu: function(){ ctx.note("reecoute", dd.son, "S0-C1"); }}));
        if(dd.son_cliente) zd.appendChild(S.boutonSon(dd.son_cliente, nu("la_cliente"), {texte: sonTexte(dd.son_cliente), couleur: "cree", etiquette: etiquette("cree")}));
      });
      s.appendChild(bt); s.appendChild(zd);
      s.appendChild(el("p", "note", BI.avertissement));
    } else if(bl.id === "cours"){
      var ul2 = el("ul"); bl.items.forEach(function(it){ ul2.appendChild(el("li", null, ligneCours(it))); }); s.appendChild(ul2);
    } else if(bl.id === "parle"){
      var N = nbReponses();
      s.appendChild(el("p", null, bl.lignes[0].replace("{n}", N.reponses)));
      if(N.repetitions >= 1) s.appendChild(el("p", null, bl.lignes_si_n_positif[0].replace("{n}", N.repetitions)));
      s.appendChild(el("p", null, E().mode === "seul" ? bl.par_mode.seul : bl.par_mode.formateur));
    } else if(bl.id === "sait_dire"){
      saitDire(s, bl);
    } else if(bl.id === "aides"){
      var u = [], ev = E().journal;
      if(ev.some(function(x){ return x.ev === "texte" && x.d !== "e5" && x.d !== "fin"; })) u.push("le texte");
      var lg = E().aide;
      if(lg !== "aucune" && ev.some(function(x){ return x.ev === "aide_langue"; })) u.push(lg === "es" ? "l'aide en espagnol" : "l'aide en italien");
      if(ev.some(function(x){ return x.ev === "lent"; })) u.push("la voix lente");
      s.appendChild(el("p", null, u.length ? "J'ai utilisé : " + u.join(", ") + "." : bl.phrases[1]));
      s.appendChild(el("p", "note", bl.phrases[2]));
    } else if(bl.id === "avis"){
      s.appendChild(el("p", "consigne", bl.question));
      s.appendChild(choixAvis(bl.reponses, "effort"));
      s.appendChild(el("p", "consigne", bl.question_2));
      s.appendChild(choixAvis(bl.reponses_2, "difficile"));
    }
    n.appendChild(s);
  });
  var ex = el("div", "card douce export-zone");
  ex.appendChild(bouton("btn btn-primary", T(BI.export.bouton), function(){ ouvrirExport(); }));
  ex.appendChild(el("p", "note", T(BI.export.note)));
  if(E().mode === "seul") ex.appendChild(el("p", "note", BI.export.seul.lignes[0]));
  n.appendChild(ex);
  return n;
};
function choixAvis(reps, cle){
  var box = el("div", "reponses"); box.setAttribute("role", "group");
  reps.forEach(function(r){
    var bt = el("button", "reponse", r.libelle); bt.type = "button"; bt.setAttribute("data-valeur", String(r.valeur));
    bt.setAttribute("aria-pressed", E().avis[cle === "effort" ? "effort" : "difficile"] === r.valeur ? "true" : "false");
    bt.addEventListener("click", function(){
      Array.prototype.forEach.call(box.querySelectorAll("button"), function(x){ x.setAttribute("aria-pressed", "false"); });
      bt.setAttribute("aria-pressed", "true"); E().avis[cle] = r.valeur; S.sauver();
    });
    box.appendChild(bt);
  });
  return box;
}
/* « Ce que je sais dire » : [Je sais le dire] / [Pas encore] pour chaque phrase, sans verdict */
function saitDire(s, bl){
  var pal = E().palier, lignes0 = bl.lignes.slice(), reste = [], ajoute = [];
  bl.variantes.forEach(function(v){
    if(v.si.palier.indexOf(pal) < 0) return;
    if(v.set.affiche){ reste = lignes0.filter(function(l){ return v.set.reste.indexOf(l.id) >= 0; }); lignes0 = lignes0.filter(function(l){ return v.set.affiche.indexOf(l.id) >= 0; }); }
    if(v.set.ajoute) ajoute = v.set.ajoute;
  });
  var toutes = lignes0.concat(ajoute), msg = el("p", "retour info"); msg.hidden = true; msg.setAttribute("role", "status");
  function maj(){
    var rep = toutes.map(function(l){ return E().sait_dire[l.id]; });
    var tous = rep.every(function(x){ return x === "pas_encore"; });
    if(tous && toutes.length){ msg.textContent = T(bl.si_toutes_pas_encore); msg.hidden = false; } else msg.hidden = true;
  }
  toutes.forEach(function(l){
    var li = el("div", "sait-dire");
    l.textes.forEach(function(t, i){
      var row = el("div", "row"); row.appendChild(el("span", "role-phrase", t));
      if(l.sons && l.sons[i]) row.appendChild(S.boutonSon(l.sons[i], nu("ecouter"), {texte: sonTexte(l.sons[i]), couleur: "cree", etiquette: ""}));
      li.appendChild(row);
    });
    var box = el("div", "reponses"); box.setAttribute("role", "group");
    [["je_sais_le_dire", "sais"], ["pas_encore", "pas_encore"]].forEach(function(k){
      var bt = el("button", "reponse", T(k[0])); bt.type = "button";
      bt.setAttribute("aria-pressed", E().sait_dire[l.id] === k[1] ? "true" : "false");
      bt.addEventListener("click", function(){
        Array.prototype.forEach.call(box.querySelectorAll("button"), function(x){ x.setAttribute("aria-pressed", "false"); });
        bt.setAttribute("aria-pressed", "true"); E().sait_dire[l.id] = k[1]; S.sauver(); maj();
      });
      box.appendChild(bt);
    });
    li.appendChild(box); s.appendChild(li);
  });
  if(reste.length){
    s.appendChild(el("h4", "sous-titre", T(bl.variantes[0].set.titre_reste)));
    reste.forEach(function(l){ l.textes.forEach(function(t){ s.appendChild(el("p", "role-phrase", t)); }); });
  }
  s.appendChild(msg); maj();
}

/* --- export : texte à copier, fichier CSV, fichier JSON (A4 §4). Rien n'est envoyé nulle part. --- */
function nomFichier(ext){
  var code = (E().apprenant || "moi").replace(/[^A-Za-z0-9_-]/g, "") || "moi";
  return C.meta.id + "_" + code + "_" + J.jourIso() + "." + ext;
}
function journalApprenant(){ return J.versionApprenant(J.construireJournal(E(), C)); }
function ouvrirExport(){
  var retour = document.activeElement, ja = journalApprenant();
  var texte = J.versTexte(ja, false);
  var mask = el("div", "mask"), mo = el("div", "modal");
  mo.setAttribute("role", "dialog"); mo.setAttribute("aria-modal", "true"); mo.setAttribute("aria-labelledby", "exportTitre2");
  var h = el("h2", null, T("exporter")); h.id = "exportTitre2"; mo.appendChild(h);
  var ta = document.createElement("textarea"); ta.id = "exportText"; ta.value = texte; ta.readOnly = true; ta.setAttribute("aria-label", T("exporter"));
  mo.appendChild(ta);
  var fait = el("span", "small muted", ""); fait.setAttribute("role", "status");
  var cp = bouton("btn btn-primary", T("copier_le_texte"), function(){
    var ok = function(){ fait.textContent = T("copie_ok"); S.annoncer(T("copie_ok")); };
    var manuel = function(){ ta.focus(); ta.select(); fait.textContent = T("copie_impossible"); };
    try{ navigator.clipboard.writeText(ta.value).then(ok, manuel); }catch(e){ manuel(); }
  });
  /* téléchargements CSV et JSON : seulement dans la vue formateur (l'apprenant garde « Copier mes réponses ») */
  var csv = VUE_FORMATEUR ? bouton("btn", T("telecharger_csv"), function(){ S.telecharger(nomFichier("csv"), J.versCSV(ja, false, C.export.csv.colonnes), "text/csv;charset=utf-8"); }) : null;
  var js = VUE_FORMATEUR ? bouton("btn", T("telecharger_json"), function(){ S.telecharger(nomFichier("json"), JSON.stringify(ja, null, 2), "application/json;charset=utf-8"); }) : null;
  var cl = bouton("btn", T("fermer"), fermer);
  function fermer(){ mask.remove(); document.removeEventListener("keydown", clavier, true); if(retour && retour.focus) retour.focus(); }
  function clavier(e){
    if(e.key === "Escape"){ fermer(); return; }
    if(e.key !== "Tab") return;
    var f = [ta, cp, csv, js, cl].filter(Boolean), i = f.indexOf(document.activeElement);
    if(e.shiftKey && i <= 0){ e.preventDefault(); cl.focus(); }
    else if(!e.shiftKey && (i === f.length - 1 || i < 0)){ e.preventDefault(); ta.focus(); }
  }
  mask.addEventListener("click", function(e){ if(e.target === mask) fermer(); });
  document.addEventListener("keydown", clavier, true);
  var r = el("div", "row"); [cp, csv, js, cl].forEach(function(x){ if(x) r.appendChild(x); }); r.appendChild(fait);
  mo.appendChild(r);
  mo.appendChild(el("p", "small muted", C.interface.export_fenetre.note));
  mask.appendChild(mo); document.body.appendChild(mask); cp.focus();
  return {fermer: fermer, zone: ta, texte: texte, csv: J.versCSV(ja, false, C.export.csv.colonnes), json: ja};
}

/* --- après le cours : rendez-vous à J+2 et J+7, banque, liens --- */
function dateRdv(jours){
  var d = new Date((E().suivi.date || J.jourIso()) + "T12:00:00"); d.setDate(d.getDate() + jours);
  var s = ""; try{ s = d.toLocaleDateString("fr-FR", {weekday: "long", day: "numeric", month: "long"}); }catch(e){ s = J.dateFr(J.jourIso(d)); }
  return s;
}
function marquerRappel(id){ E().rappels[id] = new Date().toISOString(); S.sauver(); }
function tourRappel(etape, ecr, ctx, fin){
  var zone = el("div", "rappel-tours"), tours = etape.tours.filter(function(t){ return siOk(t.si); }).map(avecVariantes), pas = 0;
  if(etape.lignes) lignes(zone, etape.lignes);
  var aPasEncore = false;
  function un(i){
    if(i >= tours.length){
      if(aPasEncore && etape.retour && etape.retour.apres_pas_encore){ var m = el("p", "retour info", etape.retour.apres_pas_encore); m.setAttribute("role", "status"); zone.appendChild(m); }
      fin(); return;
    }
    var t = tours[i], w = el("div", "rappel-tour card douce"); zone.appendChild(w);
    if(t.image){ w.appendChild(figure(t.image)); }
    if(t.lignes) lignes(w, t.lignes);
    if(t.son) w.appendChild(S.boutonSon(t.son, nu(t.bouton || "ecouter"), {texte: sonTexte(t.son), couleur: "cree", sansLent: true, etiquette: etiquette("cree"),
      surEntendu: function(){ S.journal.note(ecr, etape.trace || etape.id, "ecoute", t.son); }, surEchec: function(){ S.journal.note(ecr, etape.trace || etape.id, "son_absent"); }}));
    var termine = false;
    function suite(){ if(termine) return; termine = true; un(i + 1); }
    var parImage = t.reponse_par_image && t.reponse_par_image.palier.indexOf(E().palier) >= 0;
    if(parImage){
      var v = vignettes(t.reponse_par_image.images.map(function(x){ return {image: x, libelle: ""}; }), "");
      v.boutons.forEach(function(bt, k){ bt.addEventListener("click", function(){ bt.setAttribute("aria-pressed", "true"); v.figer(); S.journal.reponse(ecr, etape.trace || etape.id, "image", J.valeurImage(t.reponse_par_image.images[k]), null); suite(); }); });
      w.appendChild(v.box);
    } else {
      var zone2 = el("div"), box = el("div", "reponses");
      etape.apres_chaque_tour.forEach(function(k){
        var bt = el("button", "reponse", T(k)); bt.type = "button";
        bt.addEventListener("click", function(){
          if(k === "voir_une_reponse_possible"){
            bt.disabled = true; zone2.appendChild(blocPossibles(null, t.reponse, ctx, etape.trace || etape.id));
            S.journal.note(ecr, etape.trace || etape.id, "texte", "aide"); return;
          }
          Array.prototype.forEach.call(box.querySelectorAll("button"), function(x){ x.disabled = true; });
          S.journal.reponse(ecr, etape.trace || etape.id, "compare", k === "pas_encore" ? "pas_encore" : "oui", null);
          if(k === "pas_encore") aPasEncore = true;
          suite();
        });
        box.appendChild(bt);
      });
      w.appendChild(box); w.appendChild(zone2);
    }
  }
  un(0);
  return zone;
}
R.rappels = function(b, ctx){
  var n = el("div", "pas-corps");
  var c = ctx.consigne(); if(c) n.appendChild(c);
  if(b.rendez_vous){                                                   /* P.0 : index des rendez-vous */
    n.appendChild(el("h2", "sous-titre", T("revenez_deux_fois")));
    var ul = el("ul", "rdv");
    b.rendez_vous.forEach(function(rv){
      var li = el("li", null, T(rv.modele, {date: dateRdv(rv.jours)}));
      var fait = E().rappels[rv.id];
      li.appendChild(el("span", "etat", " — " + (fait ? T("etat_fait_le", {date: J.dateFr(fait)}) : T("etat_a_faire"))));
      ul.appendChild(li);
    });
    n.appendChild(ul);
    return n;
  }
  var sec = el("section", "card rappel-bloc"); sec.setAttribute("data-bloc", b.id_bloc);
  sec.appendChild(el("h2", "sous-titre", b.titre_long || T(b.titre)));
  sec.appendChild(el("p", "note", b.duree_texte));
  var ecr = "APRES." + b.id_bloc, zone = el("div", "rappel-zone");
  var go = bouton("btn", T("je_commence"), function(){ go.remove(); if(plus) plus.remove(); demarrer(); });
  var plus = b.boutons && b.boutons.indexOf("plus_tard") >= 0 ? bouton("btn btn-ghost", T("plus_tard"), function(){ go.remove(); plus.remove(); }) : null;
  sec.appendChild(go); if(plus) sec.appendChild(plus); sec.appendChild(zone);
  function finBloc(){
    var f = b.fin, msg = typeof f === "string" ? f : (f && (f.texte || (f.modele && T(f.modele, {date: dateRdv(f.date === "j7" ? 7 : 2)}))));
    if(msg){ var m = el("p", "retour ok", msg); m.setAttribute("role", "status"); S.espacesFr(m); zone.appendChild(m); }
    marquerRappel(b.id_bloc);
    if(f && f.bouton){ zone.appendChild(bouton("btn small", T(f.bouton), function(){ ouvrirExport(); })); }
  }
  function serie(def, ids){
    if(!ids){ var m = el("p", "retour info", T("pas_de_nouveau_dialogue")); zone.appendChild(m); return finEtape(); }
    zone.appendChild(el("p", "note", T("deux_dialogues_nouveaux")));
    jouerSerie(zone, ids, ecr, null, finEtape);
  }
  var etapes = b.etapes ? b.etapes.slice() : null, ie = 0;
  function finEtape(){ if(etapes && ie < etapes.length) etape(); else finBloc(); }
  function etape(){
    var e = etapes[ie++];
    if(e.tours){ zone.appendChild(el("h3", "sous-titre", e.titre)); zone.appendChild(tourRappel(e, ecr, ctx, finEtape)); return; }
    if(e.serie){
      zone.appendChild(el("h3", "sous-titre", e.titre || ""));
      var forme = (E().options && E().options.forme_banque) === "B" ? "B" : "A", ids;
      if(b.id_bloc === "j2"){
        var doneA = !!E().rappels.aujourdhui, doneDebut = !!(E().options && E().options.verification_debut);
        ids = !doneA ? e.serie[forme] : !doneDebut ? e.serie[forme === "A" ? "B" : "A"] : null;
      } else {
        ids = e.serie[forme].slice();
        if(E().palier === "plus" && E().options && E().options.un_seul_vu) ids = ids.map(function(x){ return x === "b-t4" ? "b-t4-un-seul" : x; });
      }
      serie(e, ids); return;
    }
    finEtape();
  }
  function demarrer(){
    if(etapes){ finEtape(); return; }
    /* bloc « aujourd'hui » : la paire de sortie (forme A) ou l'autre (forme B) */
    if(b.lignes) lignes(zone, b.lignes);
    var forme = (E().options && E().options.forme_banque) === "B" ? "B" : "A";
    jouerSerie(zone, b.serie[forme], ecr, null, finBloc);
  }
  n.appendChild(sec);
  return n;
};
R.liens = function(b, ctx){
  var n = el("div", "pas-corps");
  n.appendChild(el("h2", "sous-titre", T(b.titre)));
  var ul = el("ul", "liens");
  b.liens.forEach(function(l){
    var li = document.createElement("li"), a = el("a", null, T(l.libelle)); a.href = l.url; a.target = "_blank"; a.rel = "noopener"; li.appendChild(a); ul.appendChild(li);
  });
  n.appendChild(ul);
  return n;
};
/* Un type de bloc pas encore codé n'arrête jamais la page. */
["texte", "reglages", "aide_langue", "question_serveur", "ecoute_sans_texte", "serie_banque", "film_extrait", "choix_images", "choix_multiple", "dialogue_devoile",
 "ecoute", "carte_roles", "dire", "conversation", "bilan", "rappels", "liens"].forEach(function(t){ if(!R[t]) R[t] = function(b){ return el("p", "note", T("bloc_a_venir")); }; });
R.aide_langue = R.aide_langue || function(){ return null; };

/* ======================================================================
   7. DÉMARRAGE ET INTERFACE AVEC L'ESPACE FORMATEUR
   ====================================================================== */
function demarrer(){
  S.demarrer({
    cle: C.meta.id, version: VERSION, video: {url: C.meta.video.url},
    etat: {options: {}, grille: {}, apprenant: "", durees: {}, ecran_id: "accueil",
      suivi: {date: "", palier_depart: "", aide_choisie_apres: ""}, avis: {}, deja: {}, sait_dire: {}, rappels: {}},
    textes: {filmNote: T("note_film"), sonAbsent: T("son_pas_disponible"), microRefuse: T("micro_refuse"), exportTitre: T("exporter"),
      filmBloque: T("film_indisponible"), filmHorsLigne: T("pas_de_reseau")}
  });
  J.brancherBanque(C);
  if(VUE_FORMATEUR) document.body.classList.add("vue-formateur");
  monterCoque();
  S.avertissements(document.getElementById("app"), location.href);
  if(window.FORMATEUR && FORMATEUR.init){
    try{
      FORMATEUR.init({Socle: S, CONTENU: C, etat: function(){ return S.etat(); }, aller: allerEcran,
        ecranCourant: function(){ return courant ? courant.id : null; }, modeVue: VUE_FORMATEUR ? "formateur" : "apprenant"});
    }catch(err){ if(window.console) console.error(err); }
  }
  coque.btnFormateur.hidden = !(VUE_FORMATEUR && window.FORMATEUR && FORMATEUR.ouvrirEspace);
  var e = E(), i = typeof e.ecran === "number" && e.ecran >= 0 && e.ecran < ECRANS.length ? e.ecran : 0;
  allerEcran(i, {demarrage: true});
}
window.ATELIER = {
  allerEcran: allerEcran, ecranCourant: function(){ return courant ? courant.id : null; }, courant: function(){ return courant; },
  rendreTout: function(id){ allerEcran(id, {tout: true, reglage: true}); }, ouvrirExport: ouvrirExport,
  MANQUES: MANQUES, ERREURS: ERREURS, T: T, estVerrou: function(){ return verrou; }, blocs: R
};
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer); else demarrer();
})();
