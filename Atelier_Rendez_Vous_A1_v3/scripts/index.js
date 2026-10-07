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

var VERSION = "20261007-v3";                /* même valeur que le ?v= de index.html */
var CLE_STOCKAGE = "rendez-vous-a1-v3";     /* clé de stockage de la v3 (la v2 garde la sienne) */
var VUE_FORMATEUR = /[?&]vue=formateur(&|$)/.test(location.search);
var MANQUES = [];                            /* libellés d'interface introuvables (contrôlé par les tests) */
var ERREURS = [];                            /* erreurs attrapées pendant le rendu d'un bloc (contrôlé par les tests) */

/* Libellés de la v3 : lus dans CONTENU.interface.v3.<clé>, avec ces textes en repli (convention C0 §3.5).
   Les clés « bilan_… » et « rec_consigne » sont des repli du moteur seulement : le contenu peut les redéfinir. */
var LIBELLES_V3 = {
  ecouter: "Écouter", ecouter_encore: "Écouter encore", je_reponds: "Je réponds", revenir: "← Revenir", suite: "Suite",
  ecouter_le_serveur: "Écouter le serveur", ecouter_le_modele: "Écouter le modèle", m_enregistrer: "M'enregistrer", arreter: "Arrêter",
  m_ecouter: "M'écouter", comparer: "Écoutez le modèle. Comparez avec votre voix.", je_ne_sais_pas: "Je ne sais pas", regarder: "Regarder",
  ecouter_la_reponse: "Écouter la réponse",
  fin_s0: "Merci. Vous verrez la bonne réponse à la fin du cours. Cliquez sur « Suite ».",
  fenetre: "Fenêtre {n} sur {total}",
  rec_consigne: "Facultatif. Cliquez sur « M'enregistrer », puis dites votre phrase à voix haute.",
  bilan_p1: "À la première réponse", bilan_images: "Avec les images"
};

/* ======================================================================
   1. BASES
   ====================================================================== */
/* Tous les libellés de CONTENU.interface dans une seule table (le groupe « v3 » est lu à part, par T). */
var LIB = {};
var LIB_V3 = (C.interface && C.interface.v3 && typeof C.interface.v3 === "object") ? C.interface.v3 : {};
Object.keys(C.interface).forEach(function(g){
  var o = C.interface[g];
  if(g !== "v3" && o && typeof o === "object") Object.keys(o).forEach(function(k){ if(!(k in LIB)) LIB[k] = o[k]; });
});
/* Ordre de recherche : CONTENU.interface.v3, puis le repli LIBELLES_V3, puis les anciens groupes de l'interface. */
function T(cle, vars){
  var t = (typeof LIB_V3[cle] === "string") ? LIB_V3[cle] : (cle in LIBELLES_V3 ? LIBELLES_V3[cle] : LIB[cle]);
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
/* Tuile « Je ne sais pas » : même taille et même style que les images de réponse (.vignette), avec sa propre image ;
   si l'image img-je-ne-sais-pas n'existe pas encore dans PICTOS, un grand « ? » tient sa place. */
var IMG_NSP = "img-je-ne-sais-pas";
function tuileNSP(){
  var b = el("button", "vignette vignette-nsp"); b.type = "button"; b.setAttribute("aria-pressed", "false");
  b.setAttribute("data-image", IMG_NSP); b.setAttribute("data-valeur", "nsp"); b.setAttribute("aria-label", T("je_ne_sais_pas"));
  var p = picto(IMG_NSP);
  if(p) b.appendChild(p);
  else { var q = el("span", "nsp-point", "?"); q.setAttribute("aria-hidden", "true"); b.appendChild(q); }
  b.appendChild(el("span", "vignette-nsp-lib", T("je_ne_sais_pas")));
  return b;
}
/* Images à sélectionner. choix : [{image, libelle, valeur}]. Le mot écrit est caché jusqu'à la réponse (conception du socle).
   o.nsp : ajoute la tuile « Je ne sais pas » après les images (v.nsp). Un choix dont l'image est img-je-ne-sais-pas devient lui-même cette tuile. */
function vignettes(choix, nom, multi, o){
  o = o || {};
  var total = choix.length + (o.nsp ? 1 : 0);
  var box = el("div", "choix-images" + (total > 2 ? " trois" : ""));
  box.setAttribute("role", "group"); box.setAttribute("aria-label", nom || "");
  var bs = choix.map(function(c){
    if(c.image === IMG_NSP){ var t = tuileNSP(); box.appendChild(t); return t; }
    var b = el("button", "vignette"); b.type = "button"; b.setAttribute("aria-pressed", "false");
    b.setAttribute("data-image", c.image); b.setAttribute("aria-label", altDe(c.image));
    var p = picto(c.image); if(p) b.appendChild(p);
    var m = el("span", "vignette-mot", c.libelle || ""); m.hidden = true; b.appendChild(m);
    box.appendChild(b); return b;
  });
  var nsp = null;
  if(o.nsp){ nsp = tuileNSP(); box.appendChild(nsp); }
  function tous(){ return nsp ? bs.concat([nsp]) : bs; }
  return {
    box: box, boutons: bs, choix: choix, nsp: nsp, tous: tous,
    /* révèle les mots, marque la ou les bonnes réponses (si on en connaît) et fige */
    finir: function(bonnes){
      bs.forEach(function(b, i){
        var m = b.querySelector(".vignette-mot");
        if(m) m.hidden = !choix[i].libelle;
        if(bonnes && bonnes.indexOf(choix[i].image) >= 0) b.classList.add("attendue");
      });
      tous().forEach(function(b){ b.disabled = true; });
    },
    figer: function(){ tous().forEach(function(b){ b.disabled = true; }); }
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
/* Étiquette de provenance (« voix de machine », « extrait du film »…) : seulement en vue formateur (R1). Vue apprenant : chaîne vide. */
function etiquette(cle){
  if(!VUE_FORMATEUR) return "";
  var t = cle === "film" ? LIB.etiquette_film : LIB.etiquette_cree;
  return typeof t === "string" ? t : "";
}
/* Ligne d'étiquette à poser au-dessus d'un dialogue : rien du tout si le libellé est vide. */
function balise(cle){ var t = etiquette(cle); return t ? el("p", "listen-tag", t) : null; }
function poser(parent, noeud){ if(noeud) parent.appendChild(noeud); return noeud; }

/* ---------- sons des retours (R20, convention C0 §3.1) ----------
   Index « texte normalisé → identifiant » de tous les sons de type « retour » ; une seule fonction pose un retour et son bouton d'écoute. */
function normRetour(h){
  return String(S.sansBalises ? S.sansBalises(String(h)) : String(h).replace(/<[^>]*>/g, ""))
    .replace(/[\u00a0\u202f\u2009]/g, " ").replace(/[’‘]/g, "'").replace(/\s+/g, " ").replace(/\s+([?!:;»])/g, "$1").replace(/«\s+/g, "«").trim().toLowerCase();
}
var SONS_RETOUR = (function(){
  var idx = {};
  Object.keys(C.sons || {}).forEach(function(id){
    var x = C.sons[id];
    if(x && x.type === "retour" && typeof x.texte === "string"){ var k = normRetour(x.texte); if(k && !(k in idx)) idx[k] = id; }
  });
  return idx;
})();
function sonDuRetour(texte){ return SONS_RETOUR[normRetour(texte)] || null; }
/* Affiche un retour dans la zone « zone » (déjà placée dans la page) et, si un son de même texte existe, son bouton d'écoute juste après. */
function afficherRetour(zone, texte, cls, ctx){
  S.montrerRetour(zone, texte, cls);
  if(zone._sonRetour){ zone._sonRetour.remove(); zone._sonRetour = null; }
  zone._sonRetour = ajouterSonRetour(zone, texte, ctx);
  return zone;
}
/* Bouton d'écoute posé juste après « noeud » quand un son de type « retour » a le même texte ; renvoie le bouton (ou null). */
function ajouterSonRetour(noeud, texte, ctx){
  var id = sonDuRetour(texte);
  if(!id || !noeud.parentNode) return null;
  var bt = S.boutonSon(id, nu("ecouter_la_reponse"), {texte: sonTexte(id), couleur: "consigne", sansLent: true, etiquette: "",
    surEntendu: function(){ if(ctx && ctx.note) ctx.note("retour_ecoute", id); }});
  bt.classList.add("retour-son");
  noeud.parentNode.insertBefore(bt, noeud.nextSibling);
  return bt;
}
/* Crée la zone, la place dans « parent », puis affiche le retour : pour les messages qui n'avaient pas de zone préparée. */
function poserRetour(parent, texte, cls, ctx){
  var z = S.zoneRetour(); parent.appendChild(z);
  return afficherRetour(z, texte, cls, ctx);
}
function nomRole(r){ return r; }

/* ======================================================================
   2. COQUE DE LA PAGE
   ====================================================================== */
var ECRANS = C.ecrans;
function indexEcran(id){ for(var i = 0; i < ECRANS.length; i++) if(ECRANS[i].id === id) return i; return -1; }
var courant = null;                 /* écran affiché : {ec, idx, id, pas, …} */
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
    var open = coque.reglages.hidden; coque.reglages.hidden = !open; br.setAttribute("aria-expanded", open ? "true" : "false");
  });
  br.setAttribute("aria-controls", "panneau-reglages"); br.setAttribute("aria-expanded", coque.reglages.hidden ? "false" : "true");
  br.id = "btn-reglages";
  b.appendChild(br);
}
/* Réglage à trois positions (mode, palier, langue d'aide) : modifiable à tout moment. */
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
  var X = {ec: ec, id: ec.id, idx: idx, ecr: codeEcran(ec.id), pas: [], partage: {}, tout: !!opts.tout, aidesDef: prep.aides};
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
  X.btnRetour = bouton("btn", T("etape_precedente"), function(){
    if(X.idx > 0) allerEcran(X.idx - 1, {manuel: true});     /* jamais bloqué */
  });
  X.btnRetour.hidden = idx === 0;
  X.btnSuite = bouton("btn btn-primary", T("etape_suivante"), function(){
    if(X.btnSuite.disabled) return;
    E().fait[ec.id] = true; S.sauver();
    allerEcran(X.idx + 1);
  });
  X.btnSuite.disabled = true;
  if(ec.id === "s6") X.btnSuite.textContent = (C.bilan && C.bilan.suite && T(C.bilan.suite.bouton)) || T("apres_le_cours");
  if(ec.id === "apres") X.btnSuite.hidden = true;
  nav.appendChild(X.btnRetour); nav.appendChild(X.btnSuite);
  sec.appendChild(nav);
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
  /* toute consigne affichée a son bouton d'écoute : filet de sécurité si un type de bloc l'a oublié (R4) */
  if(corps && p.b.consigne && C.sons && C.sons[p.b.consigne] && !corps.querySelector('[data-audio-id="' + p.b.consigne + '"]')){
    try{ var cs = ctx.consigne(); if(cs) corps.insertBefore(cs, corps.firstChild); }catch(err4){ ERREURS.push({pas: p.id, type: p.b.type, err: err4}); }
  }
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
    /* bouton « Écouter la consigne » (K1) : une aide comptée à part */
    consigne: function(){ return ctx.consigneDe(b.consigne); },
    /* bouton d'écoute d'une consigne quelconque (celle du bloc ou une consigne imbriquée : court, question, verif, tours, étapes…) */
    consigneDe: function(id){
      if(!id || !C.sons[id]) return null;
      return S.boutonSon(id, nu("ecouter_la_consigne"), {texte: sonTexte(id), couleur: "consigne", sansLent: true, etiquette: "",
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
  if(b.role === "retour"){
    var r = el("div", "retour info"); r.setAttribute("role", "status"); lignes(r, b.lignes); n.appendChild(r);
    /* son du retour : le texte entier, sinon chaque ligne qui a son propre son */
    if(!ajouterSonRetour(r, (b.lignes || []).join(" "), ctx)){
      var apres = r;
      (b.lignes || []).forEach(function(l){ var bs = ajouterSonRetour(apres, l, ctx); if(bs) apres = bs; });
    }
  }
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

/* --- écoute d'un dialogue créé, sans question (S3.n.1) : écoutes libres, on avance par le bouton « Suite » (R6) --- */
R.ecoute = function(b, ctx){
  var n = el("div", "pas-corps");
  var c = ctx.consigne(); if(c) n.appendChild(c);
  lignes(n, b.lignes);
  var s = C.sons[b.son];
  var texteVisible = b.texte_visible && b.texte_visible_repliques;
  if(b.images_boisson){
    var duo = vignettes(b.images_boisson.map(function(i){ return {image: i, libelle: ""}; }), "");
    duo.figer(); n.appendChild(duo.box);
    ctx.note("images");
  }
  if(texteVisible){
    n.appendChild(noeudDialogue(b.texte_visible_repliques.map(function(r){ return Object.assign({}, r, {couleur: /serveu/i.test(r.role) ? "personnel" : "client"}); })));
    ctx.note("texte", "aide");
  }
  /* un dialogue = un seul fichier assemblé (audio/synthese/<id>.mp3) ; aucune suite automatique à la fin du son */
  n.appendChild(S.boutonSon(b.son, nu(b.bouton || "ecouter"), {
    etiquette: etiquette("cree"),
    surEntendu: function(){ ctx.note("ecoute"); },
    surAide: function(a){ ctx.note(a === "lent" ? "lent" : a); },
    surEchec: function(){ ctx.note("son_absent"); }
  }));
  if(VUE_FORMATEUR && s && s.repliques){ var src = el("div", "formateur-seulement"); src.appendChild(el("p", "small", T("pour_le_formateur"))); s.repliques.forEach(function(r){ src.appendChild(el("p", "small", r.role + " : " + r.texte)); }); n.appendChild(src); }
  boutonSuiteDuPas(b, ctx, n, "suite");
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
  poser(n, noeudRec(b, ctx, ctx.trace));                  /* « M'enregistrer » puis « M'écouter » : facultatif, toujours visible */
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
  var bonnes = b.bonne || [];
  var v = vignettes(choix, b.question, false, {nsp: bonnes.length > 0});     /* I5 : « Je ne sais pas » partout où il y a une bonne réponse à trouver */
  var ret = S.zoneRetour();
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
      if(!b.sans_retour && b.retour){ afficherRetour(ret, texteRetour(b.retour, juste), juste === false ? "info" : "ok"); }
      if(juste === false) ctx.faux = true;
      ctx.fait();
    });
  });
  if(v.nsp) v.nsp.addEventListener("click", function(){
    v.nsp.setAttribute("aria-pressed", "true");
    ctx.rep("p1", "nsp", null);
    v.finir(bonnes);
    if(!b.sans_retour && b.retour){ afficherRetour(ret, texteRetour(b.retour, null), "info", ctx); }
    ctx.faux = true;
    ctx.fait();
  });
  n.appendChild(v.box); n.appendChild(ret);
  return n;
};
/* « Qui parle ? » (S2.B.6) : deux phrases, dans un ordre tiré au sort ; un bouton d'écoute par phrase, dans tous les modes (R21). */
function choixQuiParle(b, ctx, n){
  var ordre = b.sequence.map(function(s, i){ return i; });
  if(b.ordre_phrases === "alea" && hasard(2)) ordre.reverse();
  n.appendChild(paragraphe(b.question, "consigne"));
  var restantes = ordre.length, ret = S.zoneRetour();
  ordre.forEach(function(k, rang){
    var s = b.sequence[k], bloc = el("div", "qui-phrase");
    var tete = el("div", "row");
    tete.appendChild(el("strong", null, nu(s.libelle)));
    tete.appendChild(S.boutonSon(s.son, nu(s.libelle), {texte: sonTexte(s.son), sansLent: true, etiquette: etiquette("cree"),
      surEntendu: function(){ ctx.note("ecoute", s.son); }, surEchec: function(){ ctx.note("son_absent"); }}));
    bloc.appendChild(tete);
    var v = vignettes(b.choix, nu(s.libelle), false, {nsp: true});                /* I5 */
    function repondu(){
      if(--restantes === 0){
        n.appendChild(noeudDialogue((b.texte_apres || []).map(function(r){ return Object.assign({}, r, {couleur: r.couleur || (/serveur/i.test(r.role) ? "personnel" : "client")}); })));
        ctx.note("texte", null, "s2.qui_parle.q"); ctx.note("qui_parle", null, "s2.qui_parle.q");
        if(b.retour) afficherRetour(ret, texteRetour(b.retour, true), "info", ctx);
        ctx.fait();
      }
    }
    v.boutons.forEach(function(bt, i){
      bt.addEventListener("click", function(){
        bt.setAttribute("aria-pressed", "true");
        var juste = b.choix[i].image === s.bonne;
        var suf = /reponse/.test(s.son) ? "r" : "q";
        ctx.rep("p1", valeurChoix(b.choix[i]), juste, "s2.qui_parle." + suf);
        v.finir([s.bonne]);
        repondu();
      });
    });
    v.nsp.addEventListener("click", function(){
      v.nsp.setAttribute("aria-pressed", "true");
      ctx.rep("p1", "nsp", null, "s2.qui_parle." + (/reponse/.test(s.son) ? "r" : "q"));
      v.finir([s.bonne]);
      repondu();
    });
    bloc.appendChild(v.box); n.appendChild(bloc);
  });
  n.appendChild(ret);
  return n;
}

/* --- plusieurs images à sélectionner, puis « J'ai fini » (S1.3) --- */
R.choix_multiple = function(b, ctx){
  var n = el("div", "pas-corps");
  var c = ctx.consigne(); if(c) n.appendChild(c);
  n.appendChild(paragraphe(b.question, "consigne"));
  var v = vignettes(b.choix, b.question, false, {nsp: true});               /* I5 : « Je ne sais pas » est exclusif des images */
  var choisis = [], ret = S.zoneRetour(), nspChoisi = false;
  v.boutons.forEach(function(bt, i){
    bt.addEventListener("click", function(){
      if(nspChoisi){ nspChoisi = false; v.nsp.setAttribute("aria-pressed", "false"); }
      var k = choisis.indexOf(i);
      if(k >= 0){ choisis.splice(k, 1); bt.setAttribute("aria-pressed", "false"); } else { choisis.push(i); bt.setAttribute("aria-pressed", "true"); }
    });
  });
  v.nsp.addEventListener("click", function(){
    nspChoisi = !nspChoisi; v.nsp.setAttribute("aria-pressed", nspChoisi ? "true" : "false");
    if(nspChoisi){ choisis.length = 0; v.boutons.forEach(function(x){ x.setAttribute("aria-pressed", "false"); }); }
  });
  var fin = bouton("btn btn-primary", T(b.bouton_fin), function(){
    fin.disabled = true;
    var imgs = choisis.map(function(i){ return b.choix[i].image; });
    var bons = imgs.filter(function(x){ return b.bonne.indexOf(x) >= 0; });
    var juste = imgs.length > 0 && bons.length === imgs.length;
    ctx.rep("p1", nspChoisi ? "nsp" : imgs.map(J.valeurImage).join("+"), imgs.length ? juste : null);
    v.finir(null);
    var r = b.retour, t = [r.intro];
    if(bons.length) t.push(r.trouves.replace("{liste}", bons.map(function(x){ return b.choix.filter(function(cc){ return cc.image === x; })[0].libelle; }).join(", ")));
    imgs.forEach(function(x){ if(r.hors_film && r.hors_film[x]) t.push(r.hors_film[x]); });
    afficherRetour(ret, t.join(" "), "info");
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

/* --- extrait du film (jamais présenté comme « sans texte ») ; on ne passe jamais au pas suivant à la fin du son : un bouton fait avancer (R6) --- */
function bornes(cle){ return C.video.extraits[cle]; }
function barreFilm(cle, libelle, o){
  var b = bornes(cle); o = o || {};
  if(!b){ if(window.console) console.warn("Extrait du film introuvable : " + cle); return el("span", "extrait-absent"); }
  if(o.etiquette === undefined) o.etiquette = etiquette("film");       /* vue apprenant : aucune mention (R1, R14) */
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
    surEchec: function(){ ctx.note("film_absent"); n.appendChild(el("p", "alerte", T("film_indisponible"))); n.appendChild(continuerSansSon(function(){ apres(); })); },
    surAide: function(a){ if(a === "lent") ctx.note("lent"); }
  };
  var apresFait = false, btnAvance = null;
  function apres(){
    if(apresFait) return; apresFait = true;
    if(btnAvance) btnAvance.disabled = true;
    if(b.question) questionFilm();
    else {
      if(b.repliques_apres){
        zoneApres.appendChild(noeudDialogue(b.repliques_apres));
        ctx.note("texte");
      }
      if(b.retour){ poserRetour(zoneApres, b.retour, "info", ctx); }
      terminer();
    }
  }
  /* S4.1 : « Elle a fini de commander ? » Oui / Non, puis retour */
  function questionFilm(){
    var q = b.question, ret = S.zoneRetour(), reps = el("div", "reponses");
    poser(zoneApres, ctx.consigneDe(q.consigne));
    lignes(zoneApres, q.lignes);
    var essais = 0;
    q.choix.forEach(function(c){
      var bt = el("button", "reponse", c.libelle); bt.type = "button"; bt.setAttribute("aria-pressed", "false");
      bt.addEventListener("click", function(){
        Array.prototype.forEach.call(reps.querySelectorAll("button"), function(x){ x.setAttribute("aria-pressed", "false"); });
        bt.setAttribute("aria-pressed", "true"); essais++;
        var juste = c.valeur === q.bonne;
        ctx.rep("p1", c.valeur, juste);
        afficherRetour(ret, q.retour[c.valeur], juste ? "ok" : "info", ctx);
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
    poser(zoneCourt, ctx.consigneDe(court.consigne));
    lignes(zoneCourt, court.lignes);
    var ret = S.zoneRetour(), v = vignettes(court.choix, court.lignes[0], false, {nsp: true});   /* I5 */
    zoneCourt.appendChild(barreFilm(court.extrait, nu("regarder"), {surEntendu: function(){ ctx.note("ecoute", null, court.trace); }, sansLent: true,
      surEchec: function(){ ctx.note("film_absent"); }}));
    v.boutons.forEach(function(bt, i){
      bt.addEventListener("click", function(){
        bt.setAttribute("aria-pressed", "true");
        var juste = court.bonne.indexOf(court.choix[i].image) >= 0;
        ctx.rep("p1", valeurChoix(court.choix[i]), juste, court.trace);
        v.finir(court.bonne); afficherRetour(ret, court.retour, "ok", ctx);
        if(court.ensuite){ zoneCourt.appendChild(barreFilm(court.ensuite.extrait, nu(court.ensuite.bouton), {sansLent: true})); }
        if(!fini){ entendu = true; apres(); }
      });
    });
    v.nsp.addEventListener("click", function(){
      v.nsp.setAttribute("aria-pressed", "true");
      ctx.rep("p1", "nsp", null, court.trace);
      v.finir(court.bonne); afficherRetour(ret, court.retour, "info", ctx);
      if(court.ensuite){ zoneCourt.appendChild(barreFilm(court.ensuite.extrait, nu(court.ensuite.bouton), {sansLent: true})); }
      if(!fini){ entendu = true; apres(); }
    });
    zoneCourt.appendChild(v.box); zoneCourt.appendChild(ret);
    if(b.voir_toute_la_scene){
      var vs = bouton("btn small btn-ghost", T(b.voir_toute_la_scene.bouton), function(){ vs.disabled = true; zoneLong.appendChild(barreFilm(b.extrait, nu("regarder"), o)); });
      zoneCourt.appendChild(vs);
    }
    n.appendChild(zoneCourt);
  }
  /* bouton pour avancer (« Je réponds » s'il y a une question, sinon « Suite ») : jamais de passage automatique après le film */
  if(!(ouvreParCourt && !b.question)){
    btnAvance = bouton("btn btn-primary", T(b.question ? "je_reponds" : "suite"), function(){ apres(); });
    n.appendChild(btnAvance);
  }
  n.appendChild(zoneApres);
  return n;
};

/* --- dialogue dévoilé : répliques avec rôle ; CHAQUE réplique qui porte un champ « extrait » a son bouton « Regarder » (R17) --- */
function noeudDialogue(repliques, o){
  o = o || {};
  var d = el("div", "dialogue");
  repliques.forEach(function(r){
    var rep = el("div", "replique " + (r.couleur === "personnel" ? "personnel" : "client"));
    rep.appendChild(el("span", "replique-qui", nomRole(r.role)));
    rep.appendChild(el("span", "replique-texte", r.texte));
    if(r.extrait){
      rep.appendChild(barreFilm(r.extrait, nu("regarder"), {sansLent: true, surEntendu: function(){ if(o.surEcoute) o.surEcoute(r); }}));
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
    poser(zone, balise(b.etiquette));
    zone.appendChild(noeudDialogue(b.repliques, {surEcoute: function(){ ctx.note("reecoute"); }}));
    ctx.note("texte"); ctx.note("qui_parle");
    if(b.lignes_apres) lignes(zone, b.lignes_apres, "note");
  }
  if(b.acces){
    var bt = bouton("btn", T(b.acces.bouton), function(){ bt.disabled = true; montrer(); ctx.fait(); });
    n.appendChild(bt);
  } else { montrer(); if(b.bouton) boutonSuiteDuPas(b, ctx, zone); else ctx.fait(); }
  n.appendChild(zone);
  return n;
};

/* --- l'apprenant dit une phrase (modèle, commande, geste) --- 
   Dans TOUS les modes : ① écouter (serveur ou modèle), ② enregistrement facultatif toujours visible
   (« M'enregistrer », « Arrêter », « M'écouter »), ③ « J'ai répondu », ④ le modèle (texte + son) et « Écoutez le modèle. Comparez avec votre voix. »
   Aucune note automatique, aucune mesure de la voix, aucun compte à rebours. */
function noeudRec(b, ctx, trace){
  var r = b.enregistrement;
  if(r === false) return null;
  r = r || {};
  var cle = r.cle || ("rec-" + String(trace || ctx.trace).replace(/[^A-Za-z0-9_.-]/g, "-"));
  var rec = S.enregistreur(cle, 120, {libelle: nu("m_enregistrer"), sansBoutonSans: true, consigne: T("rec_consigne"),
    surReponse: function(t){
      ctx.note(t === "sans_micro" ? "sans_micro" : "enregistre", null, trace);
      /* « M'écouter » : l'enregistrement se réécoute avec le lecteur sous le bouton */
      var sortie = rec && rec.querySelector(".rec-out");
      if(sortie && t !== "sans_micro" && !sortie.querySelector(".m-ecouter")){
        var lib = el("p", "m-ecouter small", nu("m_ecouter")); sortie.insertBefore(lib, sortie.firstChild);
        var au = sortie.querySelector("audio"); if(au) au.setAttribute("aria-label", nu("m_ecouter"));
      }
    }});
  return rec;
}
/* Bouton « Écouter le serveur » : son du bloc, réécoute libre, « un peu plus lent » disponible. */
function boutonServeur(q, ctx, trace){
  if(!q || !q.son) return null;
  return S.boutonSon(q.son, q.role === "serveuse" ? nu("ecouter_la_serveuse") : nu("ecouter_le_serveur"), {texte: q.texte, couleur: "cree", sansLent: false, etiquette: etiquette("cree"),
    surEntendu: function(){ ctx.note("ecoute", null, trace); }, surAide: function(a){ ctx.note(a === "lent" ? "lent" : a, null, trace); },
    surEchec: function(){ ctx.note("son_absent", null, trace); }});
}
function phraseComparer(){ return el("p", "consigne comparer", T("comparer")); }
R.dire = function(b, ctx){
  var n = el("div", "pas-corps");
  entete(b, ctx, n);
  lignes(n, b.lignes);
  /* ① écouter : le serveur du bloc, s'il parle, puis les modèles */
  var bs = boutonServeur(b.serveur, ctx, ctx.trace); if(bs) n.appendChild(bs);
  (b.modeles || []).forEach(function(m){
    var r = el("div", "role vous");
    r.appendChild(el("span", "role-qui", m.role));
    if(m.visible !== false) r.appendChild(el("p", "role-phrase", m.texte));
    if(m.son) r.appendChild(S.boutonSon(m.son, nu("ecouter"), {texte: m.texte, noeud: r, sansLent: false, etiquette: etiquette("cree"),
      surEntendu: function(){ ctx.note("ecoute", m.son); }, surAide: function(a){ ctx.note(a === "lent" ? "lent" : a); }, surEchec: function(){ ctx.note("son_absent"); }}));
    else if(m.extrait) r.appendChild(barreFilm(m.extrait, nu("regarder"), {sansLent: true, surEntendu: function(){ ctx.note("ecoute"); }}));
    n.appendChild(r);
  });
  if(b.lignes_apres) lignes(n, b.lignes_apres);
  /* ② enregistrement facultatif, toujours visible */
  var rec = noeudRec(b, ctx, ctx.trace); if(rec) n.appendChild(rec);
  var zoneApres = el("div", "apres-dire"); n.appendChild(zoneApres);
  var reps = el("div", "reponses");
  var phraseImage = null, compare = false;
  /* ③ « J'ai répondu » (ou le bouton du bloc) */
  (b.boutons && b.boutons.length ? b.boutons : ["j_ai_repondu"]).forEach(function(k){
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
  /* ④ le modèle : texte + son de chaque réponse possible, puis la phrase « comparer » */
  function suiteDire(k){
    var rp = b.reponse_possible;
    if(rp && k !== "je_passe"){
      var cible = null;
      if(rp.selon_image && courant.partage.image) cible = rp.selon_image[courant.partage.image];
      var z = el("div", "role vous");
      if(cible){
        z.appendChild(el("p", "role-phrase", cible.texte)); ctx.note("texte", "aide");
        z.appendChild(S.boutonSon(cible.son, T("ecouter_le_modele"), {texte: cible.texte, noeud: z, sansLent: false, etiquette: etiquette("cree"), surEntendu: function(){ ctx.note("ecoute", cible.son); }, surEchec: function(){ ctx.note("son_absent"); }}));
        zoneApres.appendChild(z);
      } else if(rp.exemple){
        z.appendChild(el("p", "role-phrase", rp.exemple)); ctx.note("texte", "aide"); zoneApres.appendChild(z);
      } else if(rp.selon_image){
        /* I3 : l'image du pas 4.4 n'est pas connue (page rechargée, pas rouvert) : on montre tous les modèles, jamais « Comparez » sans modèle */
        ctx.note("texte", "aide");
        zoneApres.appendChild(blocPossibles(null, Object.keys(rp.selon_image).map(function(k){ return rp.selon_image[k]; }), ctx, ctx.trace));
      }
    }
    /* modèles dont le texte était caché : on les montre maintenant, avec leur son */
    if(k !== "je_passe" && !compare){
      (b.modeles || []).filter(function(m){ return m.visible === false && m.son; }).forEach(function(m){
        var z2 = el("div", "role vous"); z2.appendChild(el("p", "role-phrase", m.texte));
        z2.appendChild(S.boutonSon(m.son, T("ecouter_le_modele"), {texte: m.texte, noeud: z2, sansLent: false, etiquette: etiquette("cree"), surEntendu: function(){ ctx.note("ecoute", m.son); }, surEchec: function(){ ctx.note("son_absent"); }}));
        zoneApres.appendChild(z2);
      });
      if(!zoneApres.querySelector(".comparer")){ compare = true; zoneApres.appendChild(phraseComparer()); }
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
   5. ÉCOUTE D'UN DIALOGUE (modèle v3), QUESTION DU SERVEUR ET CONVERSATIONS
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
    revele: !!b.revele_dans, avecTexte: !!(b.e4 && b.e4.avec_texte), questionApres: false};
}
/* Dialogue de la banque, mis dans la forme du schéma E (la question n'arrive qu'à la fenêtre « Je réponds »). */
function normaliserBanque(id){
  var d = C.banque.dialogues[id], et = C.banque.etapes, nombre = d.saisie === "nombre";
  var imgs = d.images.map(function(i){ return {image: i.image, libelle: i.libelle, valeur: J.valeurBanque(d, i.image)}; });
  return {trace: J.CODE_BANQUE[id] || id, son: d.son, consigne: et.b1.consigne, question: d.question, questionApres: true,
    e1: {lignes: et.b1.lignes, bouton: et.b1.bouton},
    /* I1 : la question affichée aux fenêtres ② et ③ est lue par le même son que la consigne (« consigne_question » ; « consigne_images » pour une question de quantité) */
    e2: {saisie: d.saisie, nombre_max: 4, consigne: nombre ? (d.consigne_question || et.b2.consigne_nombre) : d.consigne_question, lignes: nombre ? (et.b2.lignes_nombre || et.b2.lignes) : et.b2.lignes, boutons: nombre ? et.b2.boutons_nombre : et.b2.boutons},
    e3: {consigne: (nombre ? d.consigne_images : d.consigne_question) || et.b3.consigne, lignes: et.b3.lignes, images: imgs},
    e4: {consigne: et.b4 && et.b4.consigne, lignes: et.b4 && et.b4.lignes, bouton: et.b4 && et.b4.bouton},
    e5: {etiquette: d.etiquette, repliques: d.texte_final.repliques.map(function(r){ return {role: r.role, couleur: /serv/i.test(r.role) ? "personnel" : "client", texte: r.texte, extrait: r.extrait}; }),
      boutons: et.b5 && et.b5.boutons, retour: {commun: d.texte_final.retour}},
    bonne: {valeur: J.valeurBanque(d, d.bonne), image: d.bonne}};
}
R.ecoute_sans_texte = function(b, ctx){ return composantE(normaliserE(b), ctx); };

/* Écoute d'un dialogue, modèle v3 (C0 §2) : fenêtres ① J'écoute → ② Je réponds (clavier de chiffres, seulement pour une question de quantité)
   → ③ Je choisis l'image (+ tuile « Je ne sais pas ») → [question de suite éventuelle] → ④ texte du dialogue et retour
   (S0 : seulement le message « fin_s0 », rien n'est corrigé).
   - Le bouton d'écoute du dialogue est dans TOUTES les fenêtres ; écoutes illimitées ; « un peu plus lent » seulement en ④.
   - Aucun passage automatique après un son : on avance avec « Je réponds » / « Suite ».
   - « ← Revenir » (fenêtres ② à ④) revient à la fenêtre précédente. Une réponse peut être changée tant que ④ n'est pas atteinte ;
     le journal garde la première réponse (p1, ou apres_images) et note le changement (« reponse_changee »).
   - Chaque réponse enregistrée porte le nombre d'écoutes faites avant elle (champ « ecoutes »).
   - Une activité terminée se rouvre en lecture (texte, sons), sans effacer les réponses. */
function composantE(sp, ctx){
  var ecr = sp.ecr || ctx.ecr, cle = ecr + "/" + sp.trace;
  var boite = el("div", "ecoute-e"), zone = el("div", "e-zone"); zone.tabIndex = -1; boite.appendChild(zone);
  var e1 = sp.e1 || {}, e2 = sp.e2 || {}, e3 = sp.e3 || {images: []};
  var avecClavier = e2.saisie === "nombre";
  var condImg = avecClavier ? "apres_images" : "p1";            /* sans clavier, la première image choisie est la réponse « p1 » */
  var fen = ["ecoute"]; if(avecClavier) fen.push("clavier"); fen.push("images"); if(sp.suite) fen.push("suite"); fen.push("fin");
  var st = {k: 0, ecoutes: 0, reps: {}, logue: {}, atteint: false, termine: false, imagesNotees: false};
  var reouverture = !!E().deja[cle];
  /* les écoutes déjà faites (écran quitté puis rouvert) continuent d'être comptées */
  st.ecoutes = S.journal.lignes(ecr, sp.trace).filter(function(x){ return x.ev === "ecoute" || x.ev === "reecoute"; }).length;
  function note(ev, d, item){ S.journal.note(ecr, item || sp.trace, ev, d); }
  /* enregistre une réponse en y ajoutant le nombre d'écoutes faites avant elle */
  function rep(c, v, j, item){
    S.journal.reponse(ecr, item || sp.trace, c, v, j);
    var L = S.journal.reponses(ecr, item || sp.trace); if(L.length) L[L.length - 1].ecoutes = st.ecoutes;
    S.sauverBientot();
  }
  /* première réponse : journal.reponse ; réponses suivantes (changement d'avis) : une note, la première reste dans le journal */
  function donner(champ, cond, val, juste, item){
    var anc = st.reps[champ]; st.reps[champ] = val;
    if(st.logue[champ]){ if(anc !== val) note("reponse_changee", cond + ":" + anc + ">" + val, item); return; }
    st.logue[champ] = true; rep(cond, val, juste, item);
  }
  /* réponses déjà données (activité rouverte ou page rechargée) */
  function restaurer(champ, cond, item){
    var L = S.journal.reponses(ecr, item || sp.trace).filter(function(x){ return x.cond === cond; })[0];
    if(L){ st.logue[champ] = true; st.reps[champ] = L.valeur; }
  }
  if(avecClavier){ restaurer("p1", "p1"); restaurer("img", "apres_images"); } else restaurer("img", "p1");
  if(sp.suite) restaurer("suite", "p1", sp.suite.trace);
  function vider(focus){ zone.innerHTML = ""; if(focus){ try{ zone.focus({preventScroll: true}); }catch(e){} } }
  function consigneDe(id){
    if(!id || !C.sons[id]) return null;
    return S.boutonSon(id, nu("ecouter_la_consigne"), {texte: sonTexte(id), couleur: "consigne", sansLent: true, etiquette: "", surEntendu: function(){ note("consigne_lue"); }});
  }
  /* le bouton d'écoute du dialogue : le même dans toutes les fenêtres ; compte les écoutes */
  function ecoute(libelle, avecLent){
    var wrap = el("div", "e-lecture");
    wrap.appendChild(ecouteur(sp, {libelle: libelle, sansLent: !avecLent,
      surEntendu: function(){ st.ecoutes++; note("ecoute"); },
      surEchec: function(){ note("son_absent"); },
      surAide: function(a){ if(a === "lent") note("lent"); }}));
    return wrap;
  }
  function sourceFormateur(){
    if(!VUE_FORMATEUR) return null;
    var s = C.sons[sp.son], reps = s && s.repliques;
    var t = reps ? reps.map(function(r){ return r.role + " : " + r.texte; }).join(" — ") : (sp.extrait && C.video.extraits_meta && C.video.extraits_meta[sp.extrait] ? C.video.extraits_meta[sp.extrait].texte : "");
    return t ? formateurLigne(t) : null;
  }
  function juste(champ){
    var v = st.reps[champ];
    if(v == null || v === "nsp") return null;
    if(champ === "p1" && avecClavier) return v === NOMBRES[sp.bonne.valeur];
    if(champ === "suite") return v === sp.suite.bonne.valeur;
    return v === sp.bonne.valeur;
  }
  function aller(k){ st.k = k; afficher(true); }
  /* barre du bas : « ← Revenir » (fenêtres ② à ④) et le bouton qui fait avancer */
  function barre(nom, pret){
    var r = el("div", "row e-nav");
    if(st.k > 0) r.appendChild(bouton("btn e-revenir", T("revenir"), function(){ aller(st.k - 1); }));
    if(nom !== "fin"){
      var lib = (nom === "ecoute" && !st.atteint) ? T("je_reponds") : T("suite");
      var go = bouton("btn btn-primary e-avance", lib, function(){ if(!go.disabled) aller(st.k + 1); });
      go.disabled = !(pret || st.atteint);
      r.appendChild(go);
      barre.go = go;
    }
    zone.appendChild(r);
  }
  function question(){ if(sp.question) zone.appendChild(paragraphe(sp.question, "consigne")); }
  /* ---------- ① J'écoute ---------- */
  function fEcoute(){
    ctx.stade("e1");
    if(sp.image) zone.appendChild(figure(sp.image));
    poser(zone, consigneDe(sp.consigne));
    lignes(zone, e1.lignes);
    zone.appendChild(ecoute(T("ecouter"), false));
    var sf = sourceFormateur(); if(sf) zone.appendChild(sf);
    barre("ecoute", true);
  }
  /* ---------- ② Je réponds : clavier de chiffres ---------- */
  function fClavier(){
    ctx.stade("e2");
    question();
    poser(zone, consigneDe(e2.consigne));
    lignes(zone, e2.lignes);
    zone.appendChild(ecoute(T("ecouter_encore"), false));
    var box = el("div", "reponses"); box.setAttribute("role", "group");
    var liste = (e2.boutons && e2.boutons.length) ? e2.boutons.slice() : ["chiffre_1", "chiffre_2", "chiffre_3", "chiffre_4"];
    if(liste.indexOf("je_ne_sais_pas") < 0) liste.push("je_ne_sais_pas");
    liste.forEach(function(k){
      var v = /^chiffre_/.test(k) ? k.replace("chiffre_", "") : k === "je_ne_sais_pas" ? "nsp" : "dit";
      var bt = el("button", "reponse", T(k)); bt.type = "button"; bt.setAttribute("data-valeur", k);
      bt.setAttribute("aria-pressed", st.reps.p1 === v ? "true" : "false"); bt.disabled = st.atteint;
      bt.addEventListener("click", function(){
        Array.prototype.forEach.call(box.querySelectorAll("button"), function(x){ x.setAttribute("aria-pressed", "false"); });
        bt.setAttribute("aria-pressed", "true");
        donner("p1", "p1", v, v === "nsp" ? null : v === NOMBRES[sp.bonne.valeur]);
        if(barre.go) barre.go.disabled = false;
      });
      box.appendChild(bt);
    });
    zone.appendChild(box);
    barre("clavier", st.reps.p1 != null);
  }
  /* ---------- ③ Je choisis l'image (+ « Je ne sais pas ») ---------- */
  function choixImages(images, champ, cond, item, nom, surChoix){
    var v = vignettes(images, "", false, {nsp: true});
    function marquer(bt){ v.tous().forEach(function(x){ x.setAttribute("aria-pressed", x === bt ? "true" : "false"); }); }
    v.boutons.forEach(function(bt, i){
      if(st.reps[champ] != null && images[i].valeur === st.reps[champ]) bt.setAttribute("aria-pressed", "true");
      bt.addEventListener("click", function(){
        marquer(bt);
        donner(champ, cond, images[i].valeur, images[i].valeur === (champ === "suite" ? sp.suite.bonne.valeur : sp.bonne.valeur), item);
        if(surChoix) surChoix(images[i]);
        if(barre.go) barre.go.disabled = false;
      });
    });
    v.nsp.addEventListener("click", function(){
      marquer(v.nsp); donner(champ, cond, "nsp", null, item);
      if(surChoix) surChoix(null);
      if(barre.go) barre.go.disabled = false;
    });
    if(st.reps[champ] === "nsp") v.nsp.setAttribute("aria-pressed", "true");
    if(st.atteint) v.figer();
    zone.appendChild(v.box);
    return v;
  }
  function fImages(){
    ctx.stade("e3"); ctx.signal("e2");
    if(!st.imagesNotees){ st.imagesNotees = true; note("images"); }
    question();
    poser(zone, consigneDe(e3.consigne));
    lignes(zone, e3.lignes);
    /* palier « plus simple » : le texte du dialogue est une aide visible avant le choix */
    if(sp.avecTexte && sp.e5 && sp.e5.repliques){ zone.appendChild(noeudDialogue(sp.e5.repliques)); note("texte", "aide"); }
    zone.appendChild(ecoute(T("ecouter_encore"), false));
    choixImages(e3.images || [], "img", condImg, null, "images");
    barre("images", st.reps.img != null);
  }
  /* ---------- question de suite (« La cliente paie comment ? ») ---------- */
  function fSuite(){
    var q = sp.suite;
    ctx.stade("e3"); ctx.signal("question_suite");
    note("images", null, sp.trace);
    poser(zone, consigneDe(q.consigne));
    lignes(zone, q.lignes);
    zone.appendChild(ecoute(T("ecouter_encore"), false));
    choixImages(q.images || [], "suite", "p1", q.trace, "suite", function(im){
      st.paiementImage = im ? im.image : null;
      if(!im || im.valeur !== q.bonne.valeur){ if(ctx.p) ctx.p.faux = true; majAides(); }
    });
    if(st.reps.suite != null && st.reps.suite !== "nsp"){ var d = (q.images || []).filter(function(x){ return x.valeur === st.reps.suite; })[0]; if(d) st.paiementImage = d.image; }
    barre("suite", st.reps.suite != null);
  }
  /* ---------- ④ le texte du dialogue, qui parle, et le retour ---------- */
  function fFin(){
    ctx.stade("e5"); ctx.signal("e5");
    var e = sp.e5;
    var premiere = !st.termine;
    if(e){
      poser(zone, balise(e.etiquette));
      zone.appendChild(noeudDialogue(e.repliques));
    }
    var bars = el("div", "e-barres");
    bars.appendChild(ecoute(T("ecouter_encore"), true));              /* « un peu plus lent » : seulement ici */
    if(e && e.son_cliente) bars.appendChild(S.boutonSon(e.son_cliente, nu("la_cliente"), {texte: sonTexte(e.son_cliente), couleur: "cree", etiquette: etiquette("cree"), surEntendu: function(){ note("reecoute", e.son_cliente); }}));
    zone.appendChild(bars);
    if(e && e.images){
      var im = el("div", "choix-images");
      e.images.forEach(function(id){ var f = el("figure", "contexte"); var p = picto(id, "moyen"); if(p) f.appendChild(p); if(sp.suite) { var l = (sp.suite.images || []).filter(function(x){ return x.image === id; })[0]; if(l) f.appendChild(el("figcaption", "small", l.libelle)); } im.appendChild(f); });
      zone.appendChild(im);
    }
    var ret = S.zoneRetour(); zone.appendChild(ret);
    if(!e){
      /* S0 : rien n'est corrigé. Le message de fin (« fin_s0 », qui nomme le bouton « Suite ») s'affiche UNE seule fois, au pas 0.5 qui porte ce bouton (B1, QA v3) */
      ret.remove();
    } else {
      var r = e.retour || {}, t = "", bonne = juste("img") === true, suiteRetours = [];
      if(e.retour_moment){
        var rm = e.retour_moment;
        t = bonne ? rm.si_bonne : rm.sinon;
        if(!bonne && rm.bouton_sinon) bars.appendChild(S.boutonSon(rm.bouton_sinon.son, nu(rm.bouton_sinon.libelle), {texte: sonTexte(rm.bouton_sinon.son), couleur: "cree", etiquette: etiquette("cree"), sansLent: true}));
      } else if(r.texte != null) t = texteRetour({prefixe_si_bonne: r.prefixe_si_bonne, commun: r.texte}, bonne);
      else if(r.commun) t = r.commun;
      if(r.rappel_reponses){
        var fmt = function(champ, premier){
          var v = st.reps[champ];
          if(v == null) return "—";
          if(v === "nsp") return T("je_ne_sais_pas").toLowerCase();
          var im2 = (e3.images || []).filter(function(x){ return x.valeur === v; })[0];
          return (champ === "p1" && avecClavier) ? J.libValeur(v) : (im2 ? im2.libelle : v);
        };
        var vals = avecClavier ? [fmt("p1"), fmt("img")] : [fmt("img")];
        var k = 0; var rr = r.rappel_reponses.replace(/…/g, function(){ var x = vals[k++]; return x == null ? "—" : x; });
        suiteRetours.push(rr);                                       /* B3 : « Vos réponses » dans son propre paragraphe (texte variable : pas de son) */
      }
      if(e.retour_paiement && st.paiementImage && e.retour_paiement[st.paiementImage]){
        var rp = e.retour_paiement[st.paiementImage]; suiteRetours.splice(0, 0, rp.texte);   /* B2 : un retour = une zone = son bouton d'écoute */
        if(rp.bouton) bars.appendChild(S.boutonSon(rp.bouton.son, nu(rp.bouton.libelle), {texte: sonTexte(rp.bouton.son), couleur: "cree", etiquette: etiquette("cree"), sansLent: true}));
      }
      if(t) afficherRetour(ret, t, "info", ctx); else if(suiteRetours.length) { afficherRetour(ret, suiteRetours.shift(), "info", ctx); } else ret.remove();
      var dernier = ret._sonRetour || ret;
      suiteRetours.forEach(function(x){
        var z2 = S.zoneRetour(); dernier.parentNode.insertBefore(z2, dernier.nextSibling);
        afficherRetour(z2, x, "info", ctx); dernier = z2._sonRetour || z2;
      });
    }
    barre("fin", true);
    if(premiere){
      st.termine = true; st.atteint = true;
      if(!reouverture){
        E().deja[cle] = {t: new Date().toISOString(), etape: "fin"}; S.sauverBientot();
        if(e){ note("texte", "e5"); note("qui_parle"); }
        note("ecoutes_total", String(st.ecoutes));                  /* total des écoutes, noté une fois à la fin */
      }
      ctx.fait();
    }
  }
  var fenetres = {ecoute: fEcoute, clavier: fClavier, images: fImages, suite: fSuite, fin: fFin};
  function afficher(focus){
    try{ S.toutArreter(); }catch(e){}                              /* changer de fenêtre coupe le son en cours, jamais l'inverse */
    vider(focus);
    var ind = el("p", "fenetre muted small", T("fenetre", {n: st.k + 1, total: fen.length})); zone.appendChild(ind);
    fenetres[fen[st.k]]();
  }
  /* activité déjà terminée : on la rouvre directement sur la dernière fenêtre, en lecture (réponses intactes) */
  if(reouverture){ st.atteint = true; st.k = fen.length - 1; }
  afficher(false);
  return boite;
}

/* --- série de la banque (S0.7, après le cours) : une écoute après l'autre --- */
function ctxBanque(ecr, surFait){
  return {ecr: ecr, p: {faux: false}, stade: function(){}, signal: function(){}, fait: surFait, note: function(){}, rep: function(){}};
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

/* --- question du serveur ---
   Dans TOUS les modes : ① « Écouter le serveur » (réécoute libre), ② enregistrement facultatif toujours visible,
   ③ bouton de réponse (« J'ai répondu »), ④ après la réponse : le modèle (texte + son) et la phrase « Écoutez le modèle. Comparez avec votre voix. » */
function rejouer(ids, lent){
  var rien = function(){};
  if(ids.length === 1) S.sons.jouer(ids[0], {lent: lent}, rien, rien, null);
  else S.sons.jouerSuite(ids, {lent: lent}, rien, null, rien, null);
}
function blocPossibles(rp, liste, ctx, trace){
  var z = el("div", "possibles card douce");
  z.appendChild(el("h3", "sous-titre", T("reponses_possibles")));
  (liste || []).forEach(function(r){
    var l = el("div", "possible"); l.appendChild(el("p", "role-phrase", r.texte));
    if(r.son) l.appendChild(S.boutonSon(r.son, T("ecouter_le_modele"), {texte: r.texte, couleur: "cree", sansLent: false, etiquette: etiquette("cree"),
      surEntendu: function(){ ctx.note("ecoute", r.son, trace); }, surAide: function(a){ if(a === "lent") ctx.note("lent", null, trace); }, surEchec: function(){ ctx.note("son_absent", null, trace); }}));
    z.appendChild(l);
  });
  if(rp && rp.aussi && rp.aussi.length){ z.appendChild(el("p", "note", T("aussi_possible") + " " + rp.aussi.map(function(a){ return "« " + a + " »"; }).join(" · "))); }
  return z;
}
function apresReponse(ar){
  var z = el("div", "apres-reponse");
  if(ar.lignes) z.appendChild(noeudDialogue(ar.lignes.map(function(l){ return Object.assign({}, l, {couleur: l.couleur || (/serveur/i.test(l.role) ? "personnel" : "client")}); })));
  if(ar.comparaison_cote_a_cote){ var d = el("div", "deux-images"); ar.comparaison_cote_a_cote.forEach(function(t){ d.appendChild(el("p", "card douce role-phrase", t)); }); z.appendChild(d); }
  if(ar.note) z.appendChild(el("p", "note", ar.note));
  return z;
}
R.question_serveur = function(b, ctx){
  var n = el("div", "pas-corps"), mode = E().mode;
  entete(b, ctx, n); lignes(n, b.lignes);
  if(b.glose) n.appendChild(paragraphe(b.glose, "note"));
  var q = b.serveur, rpListe = b.reponses_possibles && b.reponses_possibles.liste;
  if(b.serveur_tirage){ var pick = b.serveur_tirage[hasard(b.serveur_tirage.length)]; q = {texte: pick.texte, son: pick.son, role: "serveur"}; rpListe = pick.reponses_possibles; }
  q = q || {};
  var rp = b.reponses_possibles;
  if(VUE_FORMATEUR && q.texte) n.appendChild(formateurLigne(q.texte));
  var aide = b.images_aide || b.images;
  if(aide){ var va = vignettes(aide.map(function(i){ return {image: i, libelle: ""}; }), ""); va.figer(); n.appendChild(va.box); ctx.note("images"); }
  var zq = el("div", "zone-question"), zr = el("div", "zone-reponses"), za = el("div", "zone-apres");
  n.appendChild(zq); n.appendChild(zr); n.appendChild(za);
  var relances = 0, termine = false, boutons = [];
  /* ① écouter le serveur */
  poser(zq, boutonServeur(q, ctx, ctx.trace));
  /* ② enregistrement facultatif, toujours visible */
  poser(zr, noeudRec(b, ctx, ctx.trace));
  /* ③ la réponse */
  var box = el("div", "reponses"); box.setAttribute("role", "group"); zr.appendChild(box);
  (b.reponses && b.reponses.length ? b.reponses : [{valeur: "repondu", libelle: "j_ai_repondu"}]).forEach(function(r){
    var bt = el("button", "reponse", T(r.libelle)); bt.type = "button"; bt.setAttribute("data-valeur", r.valeur); boutons.push(bt);
    bt.addEventListener("click", function(){ clic(r, bt); });
    box.appendChild(bt);
  });
  function clic(r, bt){
    if(termine) return;
    var v = r.valeur;
    if(v === "relance"){                                   /* « Je demande de répéter » : 0,9×, puis une image s'ajoute */
      relances++; ctx.note("repetition");
      if(q.son) rejouer([q.son], true);
      if(relances >= 2 && b.image && !za.querySelector(".relance-image")){ var f = figure(b.image); f.classList.add("relance-image"); za.appendChild(f); ctx.note("images"); }
      return;
    }
    if(v === "pardon" || v === "repete"){ ctx.rep("parole", "pardon", null); ctx.note("repetition"); if(q.son) rejouer([q.son], false); return; }
    termine = true;
    boutons.forEach(function(x){ x.disabled = true; }); bt.setAttribute("aria-pressed", "true");
    ctx.rep("parole", v === "je_commence" ? "repondu" : v, null);
    /* ④ après la réponse */
    if(b.apres_reponse) za.appendChild(apresReponse(b.apres_reponse));
    if(b.images_aide_apres_essai){ var vv = vignettes(b.images_aide_apres_essai.map(function(i){ return {image: i, libelle: ""}; }), ""); vv.figer(); za.appendChild(vv.box); ctx.note("images"); }
    if(mode === "seul" && b.sens_seul) za.appendChild(el("p", "note", b.sens_seul));
    var fini = function(){ if(r.effet === "ouvre_s0_et_lance_le_chrono"){ ctx.fait(); E().fait[courant.id] = true; allerEcran("s0"); } else ctx.fait(); };
    var retour = b.retour && b.retour.tous;
    if(rpListe && rpListe.length){
      za.appendChild(blocPossibles(rp, rpListe, ctx, ctx.trace));
      if(retour) poserRetour(za, retour, "info", ctx);
      za.appendChild(phraseComparer());
      /* le message de fin vient en dernier et nomme le bouton réellement actif : « Je commence » si un pas suit (série de la banque), sinon le pied de page (B1) */
      if(rp && rp.message_final){
        var suivantPas = ctx.X && ctx.p && ctx.X.pas[ctx.p.i + 1];
        poserRetour(za, (suivantPas && rp.message_final_si_suite) || rp.message_final, "info", ctx);
      }
      fini();
      return;
    }
    if(retour) poserRetour(za, retour, "info", ctx);
    fini();
  }
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
    if(avh.rappel_pardon_son && C.sons[avh.rappel_pardon_son]) av.appendChild(S.boutonSon(avh.rappel_pardon_son, T("ecouter_le_modele"), {texte: sonTexte(avh.rappel_pardon_son), couleur: "cree", sansLent: false, etiquette: etiquette("cree"),
      surEntendu: function(){ ctx.note("ecoute", avh.rappel_pardon_son); }, surEchec: function(){ ctx.note("son_absent"); }}));
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
  /* ① « Écouter le serveur » : à chaque tour, dans tous les modes, réécoute libre */
  function jouerBouton(t){
    var ids = son(t);
    var o = {couleur: "cree", sansLent: true, etiquette: etiquette("cree"), surEntendu: function(){ ctx.note("ecoute"); }, surEchec: function(){ ctx.note("son_absent"); }};
    if(ids.length === 1) return S.boutonSon(ids[0], T("ecouter_le_serveur"), o);
    return S.boutonDialogue(ids.map(function(i){ return {id: i}; }), T("ecouter_le_serveur"), o);
  }
  var NS = /^(toucher|selectionner|choisir)_/;
  function tour(i){
    if(i >= tours.length){ finale(); return; }
    var t = tours[i], w = el("div", "conv-tour"); zt.appendChild(w);
    var relances = 0;
    poser(w, ctx.consigneDe(t.consigne));
    w.appendChild(jouerBouton(t));
    if(t.fin){ tour(i + 1); return; }
    var h = el("div", "a-vous"); h.appendChild(el("p", "consigne", T("a_vous_repondez"))); w.appendChild(h);
    var box = el("div", "reponses"); box.setAttribute("role", "group");
    var liste = ["j_ai_repondu", "je_demande_de_repeter"];
    var uneImage = NS.test(String(t.reponse || "")) && /_une_image$/.test(String(t.reponse));
    var images = t.images || (NS.test(String(t.reponse || "")) && /_l_image_ou_un_mot$/.test(String(t.reponse)) && avh && avh.image_tiree_au_sort ? avh.image_tiree_au_sort : null);
    if(images){
      var v = vignettes(images.map(function(id){ return {image: id, libelle: ""}; }), "");
      v.boutons.forEach(function(bt, k){
        bt.addEventListener("click", function(){
          bt.setAttribute("aria-pressed", "true"); v.figer();
          var juste = t.bonne ? images[k] === t.bonne : null;
          ctx.rep("image", J.valeurImage(images[k]), juste, ctx.trace);
          if(t.a_reconnaitre_seulement || uneImage){ boutons.forEach(function(x){ x.disabled = true; }); tour(i + 1); }
        });
      });
      w.appendChild(v.box);
    }
    var boutons = [];
    liste.forEach(function(k){
      var bt = el("button", "reponse", T(k)); bt.type = "button"; bt.setAttribute("data-valeur", k); boutons.push(bt);
      bt.addEventListener("click", function(){
        if(k === "je_demande_de_repeter"){
          relances++; rep2.n++; ctx.note("repetition");
          rejouer(son(t), true);
          if(relances >= 2 && t.image_relance && !w.querySelector(".relance-image")){ var f = figure(t.image_relance); f.classList.add("relance-image"); w.appendChild(f); ctx.note("images"); }
          return;
        }
        boutons.forEach(function(x){ x.disabled = true; }); bt.setAttribute("aria-pressed", "true");
        ctx.rep("parole", "repondu", null);
        montrerModeles(t, w);                      /* I2 : tout de suite après « J'ai répondu », le modèle de CE tour (texte + « Écouter le modèle ») */
        tour(i + 1);
      });
      box.appendChild(bt);
    });
    w.appendChild(box);
  }
  /* modèles à comparer : une entrée « reponses_possibles_fin » est montrée au tour dont le son du serveur est « apres » (ou l'un des « apres_sons »),
     juste après « J'ai répondu » ; les entrées qui ne correspondent à aucun tour sont montrées à la fin (I2, QA v3). */
  var dejaMontres = [];
  function entreesDuTour(t){
    var ids = son(t) || [];
    return (b.reponses_possibles_fin || []).filter(function(r){
      var cibles = r.apres_sons || [r.apres];
      return cibles.some(function(c){ return ids.indexOf(c) >= 0; });
    });
  }
  function montrerModeles(t, w){
    var es = entreesDuTour(t).filter(function(r){ return dejaMontres.indexOf(r) < 0; });
    if(!es.length) return;
    var z = el("div", "possibles-tour");
    es.forEach(function(r){
      dejaMontres.push(r);
      z.appendChild(blocPossibles({aussi: r.aussi}, r.liste, ctx, ctx.trace));
      if(r.sens) z.appendChild(el("p", "note", r.sens));
    });
    z.appendChild(phraseComparer());
    w.appendChild(z);
  }
  /* ④ à la fin : les réponses possibles pas encore montrées (texte + son) puis la phrase « comparer », dans tous les modes */
  function finale(){
    var restants = (b.reponses_possibles_fin || []).filter(function(r){ return dejaMontres.indexOf(r) < 0; });
    if(b.reponses_possibles_fin && b.reponses_possibles_fin.length && !restants.length){
      fin();
    } else if(restants.length){
      var tout = el("div", "possibles-fin");
      restants.forEach(function(r){
        tout.appendChild(blocPossibles({aussi: r.aussi}, r.liste, ctx, ctx.trace));
        if(r.sens) tout.appendChild(el("p", "note", r.sens));
      });
      zf.appendChild(tout);
      zf.appendChild(phraseComparer());
      fin();
    } else if(b.verif && mode !== "seul"){
      var v = b.verif, rr = el("div", "reponses"), ret = S.zoneRetour(), fait = false;
      poser(zf, ctx.consigneDe(v.consigne));
      lignes(zf, v.lignes);
      v.boutons.forEach(function(k){
        var bt = el("button", "reponse", T(k)); bt.type = "button";
        bt.addEventListener("click", function(){
          Array.prototype.forEach.call(rr.querySelectorAll("button"), function(x){ x.disabled = true; });
          ctx.rep("verif", k, null, v.trace);
          if(k === "non" && v.non) afficherRetour(ret, v.non.retour, "info", ctx);
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
        if(msg) poserRetour(zf, msg, "ok", ctx);
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
  /* ② enregistrement facultatif, toujours visible, sous les tours */
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
  var P = bloc.phrases, cat;
  /* ligne « Nombre d'écoutes avant ma réponse » : nombre d'écoutes noté avec la première réponse */
  if(cle === "ecoutes"){
    var rr = derniere(ecr, sec.item, "p1") || derniere(ecr, sec.item, "apres_images");
    var PE = P.ecoutes || {nombre: "j'ai écouté {n} fois avant de répondre.", absente: P.absente.p1};
    return etiquette + " : " + pasDeJe(!rr ? PE.absente : PE.nombre.replace("{n}", typeof rr.ecoutes === "number" ? rr.ecoutes : "—"));
  }
  var cond = {p1: "p1", img: "apres_images"}[cle];
  var r = derniere(ecr, sec.item, cond);
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
    /* v3 : première réponse = l'image du moment ; ensuite l'image du moyen de paiement (question de suite) */
    var P = BI.blocs[0].phrases;
    var pm = derniere("S2", item, "p1") || derniere("S2", item, "apres_images");
    var fin = derniere("S2", "s2d.choix_final", "p1") || derniere("S2", "s2d.choix_final", "apres_images");
    var l1 = !pm ? P.absente.p1 : pm.valeur === "nsp" ? P.ne_sais_pas.p1 : "j'ai choisi « " + (W[pm.valeur] || pm.valeur) + " ». " + suffixe(pm.juste, W[bE.bonne.valeur]);
    var l2 = !fin ? P.absente.img : fin.valeur === "nsp" ? P.non_donnee.img.replace("{attendue}", W.carte) : pasDeJe(P[fin.juste ? "correcte" : "incorrecte"].img.replace("{valeur}", W[fin.valeur === "especes" ? "especes" : "carte"]).replace("{attendue}", W.carte));
    return "Carte ou espèces ? " + T("bilan_p1") + " : " + pasDeJe(l1) + " " + T("bilan_images") + " : " + l2;
  }
  var r2 = derniere("S2", item, "p1") || derniere("S2", item, "apres_images") || derniere("S2", item, "apres_texte");
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
        /* v3 : « à la première réponse » et « avec les images » ; plus de ligne « à la deuxième écoute » */
        bl.lignes.forEach(function(l){
          if(l.cle === "re" || l.inutilise) return;
          ul.appendChild(el("li", null, ligneEcoute(bl, sec, l.cle, l.cle === "p1" ? T("bilan_p1") : l.cle === "img" ? T("bilan_images") : l.etiquette)));
        });
        s.appendChild(ul);
      });
      var dd = bl.dialogue_debut, zd = el("div", "dialogue-debut");
      var bt = bouton("btn small", T(dd.acces), function(){
        bt.disabled = true;
        poser(zd, balise(dd.etiquette));
        zd.appendChild(noeudDialogue(dd.repliques));
        zd.appendChild(S.boutonSon(dd.son, T("ecouter"), {couleur: "cree", etiquette: etiquette("cree"), surEntendu: function(){ ctx.note("reecoute", dd.son, "S0-C1"); }}));
        if(dd.son_cliente) zd.appendChild(S.boutonSon(dd.son_cliente, nu("la_cliente"), {texte: sonTexte(dd.son_cliente), couleur: "cree", etiquette: etiquette("cree")}));
      });
      s.appendChild(bt); s.appendChild(zd);
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
  if(BI.suite && BI.suite.lignes && BI.suite.lignes.length){ var fb = el("div", "bilan-suite"); n.appendChild(fb); BI.suite.lignes.forEach(function(l){ poserRetour(fb, l, "ok", ctx); }); }
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
    if(tous && toutes.length){ afficherRetour(msg, T(bl.si_toutes_pas_encore), "info"); } else { msg.hidden = true; if(msg._sonRetour){ msg._sonRetour.remove(); msg._sonRetour = null; } }
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
      if(aPasEncore && etape.retour && etape.retour.apres_pas_encore){ poserRetour(zone, etape.retour.apres_pas_encore, "info"); }
      fin(); return;
    }
    var t = tours[i], w = el("div", "rappel-tour card douce"); zone.appendChild(w);
    if(t.image){ w.appendChild(figure(t.image)); }
    if(t.consigne && ctx) poser(w, ctx.consigneDe(t.consigne));
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
      /* B5 : l'apprenant dit une phrase : enregistrement facultatif toujours visible (« M'enregistrer » / « M'écouter »), puis le modèle à comparer */
      if(ctx){ var recT = noeudRec({enregistrement: {cle: "rappel-" + String(etape.id || etape.trace).replace(/[^A-Za-z0-9_.-]/g, "-") + "-t" + (t.n || (i + 1)), secondes: 30, facultatif: true}}, ctx, etape.trace || etape.id); if(recT) w.appendChild(recT); }
      etape.apres_chaque_tour.forEach(function(k){
        var bt = el("button", "reponse", T(k)); bt.type = "button";
        bt.addEventListener("click", function(){
          if(k === "voir_une_reponse_possible"){
            bt.disabled = true; zone2.appendChild(blocPossibles(null, t.reponse, ctx, etape.trace || etape.id)); zone2.appendChild(phraseComparer());
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
    if(msg) poserRetour(zone, msg, "ok");
    marquerRappel(b.id_bloc);
    if(f && f.bouton){ zone.appendChild(bouton("btn small", T(f.bouton), function(){ ouvrirExport(); })); }
  }
  function serie(def, ids){
    if(!ids){ poserRetour(zone, T("pas_de_nouveau_dialogue"), "info"); return finEtape(); }
    zone.appendChild(el("p", "note", T("deux_dialogues_nouveaux")));
    jouerSerie(zone, ids, ecr, null, finEtape);
  }
  var etapes = b.etapes ? b.etapes.slice() : null, ie = 0;
  function finEtape(){ if(etapes && ie < etapes.length) etape(); else finBloc(); }
  function etape(){
    var e = etapes[ie++];
    if(e.consigne) poser(zone, ctx.consigneDe(e.consigne));
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
    cle: CLE_STOCKAGE, version: VERSION, video: {url: C.meta.video.url},
    etat: {options: {}, grille: {}, apprenant: "", durees: {}, ecran_id: "accueil",
      suivi: {date: "", palier_depart: "", aide_choisie_apres: ""}, avis: {}, deja: {}, sait_dire: {}, rappels: {}},
    /* textes du socle remplacés : plus de mention de provenance du film (vue apprenant), plus de « touchez » */
    textes: {filmNote: VUE_FORMATEUR ? T("note_film") : "", sonAbsent: T("son_pas_disponible"), microRefuse: T("micro_refuse"), exportTitre: T("exporter"),
      filmBloque: T("film_indisponible"), filmHorsLigne: T("pas_de_reseau"),
      filmNeDemarrePas: "Le film ne démarre pas. Cliquez sur ▶ dans le film, ou",
      enregistrer: nu("m_enregistrer"), arreter: nu("arreter"), microConsigne: T("rec_consigne"),
      microFini: "C'est fini. Cliquez sur la lecture pour vous écouter."}
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
  MANQUES: MANQUES, ERREURS: ERREURS, T: T, blocs: R
};
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer); else demarrer();
})();
