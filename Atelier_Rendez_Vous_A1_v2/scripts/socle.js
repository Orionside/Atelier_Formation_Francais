/* ======================================================================
   ATELIER RENDEZ-VOUS A1 v2 — SOCLE DU MOTEUR (A5)
   Fonctions utilitaires extraites de l'ancien moteur (Atelier_Rendez_Vous_A1/index.html)
   et nettoyées. Aucun écran ici : le moteur des écrans S0–S6 s'appuie sur ce socle.

   Ce qui a été volontairement LAISSÉ DE CÔTÉ (décisions P0 M08 et M09) :
   - le calcul de mélodie (YIN, courbes, « votre mélodie ressemble… ») ;
   - les mesures de pauses et leurs tuiles « moins = mieux », les flèches ▲ ▼.

   Mode d'emploi (dans index.html, après contenu.js et audio/catalogue.js) :
     Socle.demarrer({ cle:"rendez-vous-a1-v2", version:"20261006-1",
                      video:{url:"https://youtu.be/HNBQOEb_O5k"} });
   Vérification : node --check A5_socle.js ; essais sans navigateur : A5_test_socle.js
   ====================================================================== */
var Socle = (function(){
"use strict";

/* ---------------- configuration ---------------- */
var CFG = {
  cle: "rendez-vous-a1-v2",          /* clé localStorage de l'atelier */
  cleTheme: "impact60-theme",        /* partagée avec les autres ateliers du même site */
  version: "",                       /* paramètre ?v= anti-cache (même valeur que dans index.html) */
  video: {url:"", zone:"zoneFilm", hote:"", langue:"fr"},
  audio: {humain:"audio/humain/", synthese:"audio/synthese/", manifeste:"audio/manifest.json", ext:".mp3"},
  etat: null                         /* champs d'état supplémentaires (facultatif) */
};
/* Tous les textes vus par l'apprenant : phrases très courtes, sans jargon. Remplaçables par demarrer({textes:…}). */
var TXT = {
  ecouter: "Écouter",
  arreter: "Arrêter",
  chargement: "Un instant…",
  lent: "Un peu plus lent",
  boucle: "En boucle",
  filmTitre: "Le film",
  filmNote: "Avec image. Des mots écrits peuvent apparaître.",
  filmFermer: "Fermer le film",
  filmBloque: "Le film ne s'ouvre pas ici.",
  filmHorsLigne: "Pas d'internet : le film ne peut pas s'ouvrir.",
  filmNeDemarrePas: "Le film ne démarre pas. Touchez ▶ dans le film, ou",
  filmOuvrir: "ouvrez le film sur YouTube",
  sonAbsent: "Ce son ne marche pas pour le moment.",
  enregistrer: "Enregistrer ma voix",
  recommencer: "Recommencer",
  microConsigne: "Facultatif. Dites votre phrase, puis touchez « Arrêter ».",
  microDemande: "Autorisez le micro si le navigateur le demande…",
  microEnCours: "J'enregistre… Parlez.",
  microFini: "C'est fini. Vous pouvez vous écouter.",
  microRefuse: "Le micro ne marche pas ici. Ce n'est pas grave : répondez à voix haute.",
  sansMicro: "Je réponds sans enregistrer",
  confidentialite: "Votre voix reste sur cet appareil. Elle disparaît quand vous fermez la page.",
  importer: "Choisir un fichier audio",
  telecharger: "Télécharger le son",
  copier: "Copier",
  fermer: "Fermer",
  copie: "Copié.",
  copieManuelle: "Texte sélectionné : faites Cmd+C (Mac) ou Ctrl+C (PC).",
  exportTitre: "Copier mes réponses",
  exportAide: "Copiez ce texte et envoyez-le à votre formateur. Il contient des mots et des chiffres, jamais votre voix.",
  stockageBloque: "Ce navigateur ne garde pas vos réponses : elles seront perdues si vous fermez la page. Utilisez « Copier mes réponses » avant de partir.",
  apercu: "Aperçu : ici, le film et le micro sont bloqués."
};
var LENT = 0.9;   /* jamais en dessous : en dessous, la voix devient artificielle (cadre §3) */

/* ---------------- stockage (localStorage protégé) ---------------- */
function lsGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
function lsSet(k, v){ try{ localStorage.setItem(k, v); return true; }catch(e){ return false; } }
function lsDel(k){ try{ localStorage.removeItem(k); }catch(e){} }
function copie(o){ return JSON.parse(JSON.stringify(o)); }
/* Un « magasin » = un objet d'état relu au démarrage et réécrit à chaque changement.
   Une valeur enregistrée d'un autre type que la valeur par défaut est ignorée (ancien format, fichier abîmé). */
function creerMagasin(cle, defauts){
  var ok = lsSet(cle + "-probe", "1"); lsDel(cle + "-probe");
  var etat = copie(defauts), brut = lsGet(cle);
  if(brut){
    try{
      var p = JSON.parse(brut);
      if(p && typeof p === "object"){
        for(var k in etat){
          if(p[k] != null && typeof p[k] === typeof etat[k] && Array.isArray(p[k]) === Array.isArray(etat[k])) etat[k] = p[k];
        }
      }
    }catch(e){}
  }
  var minuterie = null;
  var M = {
    cle: cle, ok: ok, etat: etat,
    sauver: function(){ clearTimeout(minuterie); return lsSet(cle, JSON.stringify(M.etat)); },
    sauverBientot: function(){ clearTimeout(minuterie); minuterie = setTimeout(M.sauver, 300); },
    effacer: function(){ clearTimeout(minuterie); M.etat = copie(defauts); lsDel(cle); return M.etat; }
  };
  return M;
}
/* État de l'atelier v2. Rien de sonore ici : seulement des choix, des réponses et le journal des aides. */
var ETAT_DEFAUT = {
  v: 2,
  ecran: 0,
  mode: "formateur",      /* "formateur" | "groupe" | "seul" */
  palier: "normal",       /* "simple" | "normal" | "plus" */
  aide: "aucune",         /* "aucune" | "es" | "it" — choisie par l'apprenant, jamais déduite */
  rep: {},                /* réponses : "ecran/item" → [{t, cond, valeur, juste}] */
  fait: {},               /* écrans terminés */
  notes: {},              /* grille 0/1/2 et remarques du formateur */
  journal: []             /* événements d'aide, voir plus bas */
};
var MAGASIN = null;
function etat(){ return MAGASIN.etat; }

/* ---------------- outils ---------------- */
function el(tag, cls, txt){ var n = document.createElement(tag); if(cls) n.className = cls; if(txt != null) n.textContent = txt; return n; }
/* html() : seulement pour du texte venant de contenu.js (jamais une saisie de l'utilisateur : voir echapper). */
function html(tag, cls, h){ var n = document.createElement(tag); if(cls) n.className = cls; if(h != null) n.innerHTML = h; return n; }
function echapper(s){ return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function bouton(cls, texte, action){ var b = el("button", cls, texte); b.type = "button"; if(action) b.addEventListener("click", action); return b; }
function appuye(b){ return b.getAttribute("aria-pressed") === "true"; }
function dureeTxt(s){ s = Math.round(s); var m = Math.floor(s/60), r = s%60; return m ? m + " min" + (r ? " " + (r<10?"0":"") + r : "") : r + " s"; }
function mmss(s){ s = Math.max(0, Math.round(s)); var m = Math.floor(s/60), r = s%60; return m+":"+(r<10?"0":"")+r; }
function norm(s){ return (s||"").toString().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]/g," ").replace(/\s+/g," ").trim(); }
function fmt(n, d){ return (n == null || isNaN(n)) ? "—" : n.toFixed(d == null ? 1 : d).replace(".", ","); }
function sansBalises(s){ return String(s || "").replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim(); }
/* Typographie française : pas de guillemet ni de ponctuation haute seuls en début ou fin de ligne */
function espacesFr(racine){
  var w = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT, null), n;
  while((n = w.nextNode())){
    var t = n.nodeValue, u = t.replace(/« /g, "« ").replace(/ »/g, " »").replace(/ ([:;?!])/g, " $1");
    if(u !== t) n.nodeValue = u;
  }
}
/* Annonce pour les lecteurs d'écran (zone aria-live unique, invisible à l'écran). */
var zoneAnnonce = null;
function annoncer(texte){
  if(!zoneAnnonce){
    zoneAnnonce = el("div", "sr"); zoneAnnonce.id = "annonce";
    zoneAnnonce.setAttribute("aria-live", "polite"); zoneAnnonce.setAttribute("role", "status");
    document.body.appendChild(zoneAnnonce);
  }
  zoneAnnonce.textContent = "";
  setTimeout(function(){ zoneAnnonce.textContent = texte; }, 30);
}
/* Zone de retour visible : role=status, donc lue sans déplacer le focus. */
function zoneRetour(cls){ var p = el("p", "retour" + (cls ? " " + cls : "")); p.setAttribute("role", "status"); p.hidden = true; return p; }
function montrerRetour(zone, h, cls){ zone.className = "retour" + (cls ? " " + cls : ""); zone.innerHTML = h; zone.hidden = false; espacesFr(zone); }

/* ---------------- thème clair / sombre ---------------- */
function themeAppliquer(){
  var t = lsGet(CFG.cleTheme);
  if(t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t);
}
function themeBasculer(){
  var racine = document.documentElement, cur = racine.getAttribute("data-theme");
  if(!cur) cur = (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
  var suivant = cur === "dark" ? "light" : "dark";
  racine.setAttribute("data-theme", suivant); lsSet(CFG.cleTheme, suivant);
  return suivant;
}

/* ================= un seul son à la fois =================
   Chaque source sonore déclare comment la faire taire. Avant de jouer, une source appelle
   Regie.prendre(nom) : toutes les sources s'arrêtent (le son précédent, le film, les réécoutes
   d'enregistrements, et l'enregistrement au micro en cours, qui est conservé). */
var Regie = (function(){
  var arrets = {};
  return {
    declarer: function(nom, f){ arrets[nom] = f; },
    prendre: function(nom, sauf){ for(var k in arrets){ try{ arrets[k](sauf); }catch(e){} } },
    faireTaire: function(saufNom, sauf){ for(var k in arrets){ if(k !== saufNom){ try{ arrets[k](sauf); }catch(e){} } } }
  };
})();
/* VUE : numéro de l'écran affiché. Une réponse tardive (chargement du film) destinée à un écran
   déjà quitté est ignorée. Le moteur appelle Socle.nouvelleVue() à chaque changement d'écran. */
var VUE = 0;
function nouvelleVue(){ VUE++; toutArreter(); return VUE; }
function toutArreter(){ Regie.prendre(null); }

/* ================= le film : lecteur YouTube officiel =================
   Lecture d'un extrait entre deux bornes au centième. Aucun extrait n'est copié.
   Règles de l'API YouTube respectées : lecteur d'au moins 200 × 200 px, toujours visible
   quand il joue, AUCUN élément posé devant lui (ni cache, ni bandeau, ni bouton). */
var VIDEO = "", VIDEO_ID = null, ZONE = null;
var YT_ETAT = {lecteur:null, pret:false, creation:false, echecLe:0, erreur:null, attente:[], seg:null, boucle:false,
  sondage:null, proprio:null, lente:undefined, sousTitres:false, coupures:0, derniereCoupe:0, coupesExtrait:0, tenaces:false};
function lienVideo(a){ return VIDEO + (VIDEO.indexOf("?") > -1 ? "&" : "?") + "t=" + Math.floor(a); }
function zoneFilm(){
  if(ZONE) return ZONE;
  var z = document.getElementById(CFG.video.zone);
  if(!z){
    z = el("section", "film-zone"); z.id = CFG.video.zone;
    var m = document.querySelector("main");
    if(m && m.parentNode) m.parentNode.insertBefore(z, m); else document.body.appendChild(z);
  }
  z.hidden = true; z.setAttribute("aria-label", TXT.filmTitre);
  var barre = el("div", "film-barre");
  barre.appendChild(el("span", "film-titre", TXT.filmTitre));
  barre.appendChild(el("span", "film-note", TXT.filmNote));      /* étiquette honnête : jamais « sans texte » */
  barre.appendChild(bouton("btn btn-ghost small", TXT.filmFermer, function(){ filmArreter("arret"); z.hidden = true; }));
  var cadre = el("div", "film-cadre"); cadre.id = "filmCadre";
  z.appendChild(barre); z.appendChild(cadre);                    /* la barre est AU-DESSUS du lecteur, jamais dessus */
  ZONE = z; return z;
}
function nouvelleFente(){
  var cadre = zoneFilm().querySelector(".film-cadre"); cadre.innerHTML = "";
  var f = el("div"); f.id = "ytSlot"; cadre.appendChild(f);
}
/* --- sous-titres ---
   cc_load_policy ne sait que FORCER l'affichage (valeur 1) ; il n'existe pas de valeur « jamais ».
   Sans ce paramètre, YouTube suit la préférence de la personne (compte ou dernier choix mémorisé).
   Parade : dès que le module « captions » se charge (événement onApiChange) et à chaque départ,
   on vide la piste et on décharge le module. Ces deux appels ne sont pas garantis par la
   documentation : c'est un « au mieux ». Les mots INCRUSTÉS dans l'image du film ne peuvent
   pas être retirés. L'interface ne dit donc jamais « sans texte » pour le film. */
function couperSousTitres(){
  var p = YT_ETAT.lecteur; if(!p || YT_ETAT.sousTitres) return;
  try{ p.setOption("captions", "track", {}); }catch(e){}
  try{ p.unloadModule("captions"); }catch(e){}
  try{ p.unloadModule("cc"); }catch(e){}
  YT_ETAT.coupures++; YT_ETAT.derniereCoupe = Date.now();
}
/* onApiChange : YouTube vient de charger (ou de décharger) un module. Si c'est « captions », on coupe tout de suite.
   Garde-fou : au plus 8 coupures par extrait. Si YouTube les rallume à chaque fois, on arrête de lutter
   (YT_ETAT.tenaces = true) et le moteur note « sous-titres du film » parmi les aides. */
function surChangementApi(){
  var p = YT_ETAT.lecteur; if(!p) return;
  var modules = null; try{ modules = p.getOptions ? p.getOptions() : null; }catch(e){}
  var connu = !!(modules && modules.indexOf);
  if(connu && modules.indexOf("captions") < 0) return;                            /* module absent : rien à couper */
  if(YT_ETAT.sousTitres){ try{ p.setOption("captions", "track", {languageCode: CFG.video.langue}); }catch(e){} return; }
  if(!connu && Date.now() - YT_ETAT.derniereCoupe < 150) return;                  /* décharger déclenche aussi cet événement */
  if(YT_ETAT.coupesExtrait >= 8){ YT_ETAT.tenaces = true; return; }
  YT_ETAT.coupesExtrait++;
  couperSousTitres();
}
/* Aide choisie APRÈS la première réponse : afficher les sous-titres de YouTube (dans son lecteur, à sa façon). */
function filmSousTitres(voulus){
  YT_ETAT.sousTitres = !!voulus;
  var p = YT_ETAT.lecteur; if(!p) return;
  if(voulus){
    try{ p.loadModule("captions"); }catch(e){}
    try{ p.setOption("captions", "track", {languageCode: CFG.video.langue}); }catch(e){}
  } else couperSousTitres();
}
/* true = une piste est affichée ; false = aucune ; null = impossible de le savoir (cas fréquent). Indice seulement. */
function filmSousTitresActifs(){
  var p = YT_ETAT.lecteur; if(!p || !p.getOptions || !p.getOption) return null;
  try{
    var modules = p.getOptions();
    if(!modules || modules.indexOf("captions") < 0) return false;
    var piste = p.getOption("captions", "track");
    return !!(piste && (piste.languageCode || piste.vss_id));
  }catch(e){ return null; }
}
function filmCharger(cb){
  if(YT_ETAT.pret) return cb(true);
  if(!VIDEO_ID) return cb(false, "sans_video");
  if(navigator.onLine === false) return cb(false, "hors_ligne");                  /* inutile d'attendre 8 s */
  if(YT_ETAT.echecLe && Date.now() - YT_ETAT.echecLe < 3000) return cb(false, "indisponible");
  YT_ETAT.attente.push(cb);
  if(YT_ETAT.attente.length > 1) return;
  zoneFilm().hidden = false;
  var fini = function(ok, pourquoi){
    clearTimeout(delai);
    if(!ok) YT_ETAT.echecLe = Date.now();
    var w = YT_ETAT.attente; YT_ETAT.attente = []; w.forEach(function(f){ f(ok, pourquoi); });
  };
  var delai = setTimeout(function(){ if(!YT_ETAT.pret) fini(false, "delai"); }, 8000);
  if(YT_ETAT.creation) return;              /* lecteur déjà demandé (réseau lent) : on attend encore, sans en créer un second */
  function creer(){
    if(YT_ETAT.creation) return;
    try{
      nouvelleFente();
      var options = {
        videoId: VIDEO_ID, width: "100%", height: "100%",
        /* pas de cc_load_policy (voir plus haut) ; modestbranding n'a plus d'effet depuis 2023 */
        playerVars: {playsinline:1, rel:0, controls:1, iv_load_policy:3, hl:"fr", origin: location.origin},
        events: {
          onReady: function(e){
            YT_ETAT.pret = true; YT_ETAT.erreur = null;
            couperSousTitres();
            fini(true);
          },
          onApiChange: surChangementApi,
          onStateChange: function(e){
            if(e && (e.data === 1 || e.data === 3)) couperSousTitres();
            /* lecture lancée à la main dans le lecteur : les autres sons se taisent */
            if(e && e.data === 1 && !YT_ETAT.proprio) Regie.faireTaire("film");
          },
          onError: function(e){
            YT_ETAT.erreur = e ? e.data : -1;
            if(!YT_ETAT.pret){ YT_ETAT.creation = false; fini(false, "erreur_video"); return; }
            var f = YT_ETAT.surEchec; filmArreter("echec"); if(f) f("erreur_video");
          }
        }
      };
      if(CFG.video.hote) options.host = CFG.video.hote;      /* p. ex. https://www.youtube-nocookie.com (à essayer par un humain) */
      YT_ETAT.lecteur = new YT.Player("ytSlot", options);
      YT_ETAT.creation = true;
    }catch(e){ YT_ETAT.creation = false; fini(false, "erreur"); }
  }
  if(window.YT && window.YT.Player){ creer(); return; }
  window.onYouTubeIframeAPIReady = creer;
  var ancien = document.getElementById("ytApi"); if(ancien) ancien.remove();
  var sc = document.createElement("script"); sc.id = "ytApi"; sc.src = "https://www.youtube.com/iframe_api";
  sc.onerror = function(){ sc.remove(); fini(false, "bloque"); };
  document.head.appendChild(sc);
}
function filmArreter(raison){
  clearInterval(YT_ETAT.sondage); YT_ETAT.sondage = null;
  try{ if(YT_ETAT.lecteur){ YT_ETAT.lecteur.pauseVideo(); YT_ETAT.lecteur.setVolume(100); } }catch(e){}
  var pr = YT_ETAT.proprio; YT_ETAT.proprio = null; YT_ETAT.surEchec = null;
  if(pr) pr(false, raison || "arret");
}
function filmCacher(){ filmArreter("arret"); if(ZONE) ZONE.hidden = true; }
/* a, b : bornes en secondes (au centième). r : {boucle, taux}. proprio(etat, raison) : le bouton qui a lancé.
   surEntendu() : appelé quand le son de l'extrait commence VRAIMENT (c'est là qu'on note une écoute au journal). */
function filmJouer(a, b, r, proprio, surEchec, surEntendu){
  r = r || {};
  Regie.prendre("film");
  var p = YT_ETAT.lecteur, taux = r.taux || 1;
  YT_ETAT.seg = [a, b]; YT_ETAT.boucle = !!r.boucle; YT_ETAT.proprio = proprio; YT_ETAT.surEchec = surEchec;
  zoneFilm().hidden = false;
  /* On ne se fie pas à la position seule : juste après seekTo, YouTube renvoie la position
     demandée même si la vidéo n'a pas démarré. La lecture n'est « commencée » que si le
     lecteur est en état LECTURE (1) ET que le temps avance réellement.
     Volume à 0 jusqu'au début exact de la phrase (pas de mute/unMute : Chrome peut mettre
     en pause une vidéo dont le son est réactivé par script). */
  var entendu = false, t0 = 0, relance = false, tPrec = -1, tBouge = 0, recoupe = 0, signale = false;
  function depart(){
    entendu = false; relance = false; t0 = Date.now(); tPrec = -1; tBouge = Date.now();
    YT_ETAT.coupesExtrait = 0; YT_ETAT.tenaces = false;
    try{ p.unMute(); p.setVolume(0); p.setPlaybackRate(taux); p.seekTo(a, true); p.playVideo(); }catch(e){}
    couperSousTitres();
  }
  function echec(pourquoi){ filmArreter("echec"); if(surEchec) surEchec(pourquoi); }
  function lacher(raison){ clearInterval(YT_ETAT.sondage); YT_ETAT.sondage = null; try{ p.setVolume(100); }catch(e){}
    var pr = YT_ETAT.proprio; YT_ETAT.proprio = null; YT_ETAT.surEchec = null; if(pr) pr(false, raison); }
  depart();
  proprio(true);
  YT_ETAT.sondage = setInterval(function(){
    var t = 0, st = -1;
    try{ t = p.getCurrentTime(); st = p.getPlayerState(); }catch(e){}
    var maintenant = Date.now();
    if(Math.abs(t - tPrec) > 0.01){ tBouge = maintenant; tPrec = t; }
    var joue = (st === 1) && (maintenant - tBouge < 700);
    if(!entendu){
      if(joue && t >= a - 0.03 && t < b){
        try{ p.setVolume(100); }catch(e){}
        entendu = true; recoupe = maintenant + 1000; couperSousTitres();
        if(!signale){ signale = true; if(surEntendu) surEntendu(); }
        return;
      }
      if(!relance && maintenant - t0 > 2500){ relance = true; try{ p.seekTo(a, true); p.playVideo(); }catch(e){} }
      if(maintenant - t0 > 7000) echec("ne_demarre_pas");       /* la vidéo ne démarre pas : on le dit */
      return;
    }
    if(recoupe && maintenant > recoupe){ recoupe = 0; couperSousTitres(); }   /* le module peut se charger après le départ */
    if(t >= b){ if(YT_ETAT.boucle) depart(); else filmArreter("fin"); return; }
    if(st === 2){ lacher("pause"); return; }                    /* mise en pause dans le lecteur */
    if(t < a - 1.5){ lacher("deplace"); return; }               /* l'utilisateur a déplacé la lecture */
    if(maintenant - tBouge > 5000) echec("fige");               /* lecture figée (réseau) */
  }, 30);
}
/* Vitesse lente du film : seulement si YouTube propose une vitesse entre 0,85 et 0,95. */
function filmVitesseLente(){
  if(YT_ETAT.lente !== undefined) return YT_ETAT.lente;
  var r = null;
  try{ (YT_ETAT.lecteur.getAvailablePlaybackRates() || []).forEach(function(x){ if(x >= 0.85 && x < 1 && (r === null || Math.abs(x-LENT) < Math.abs(r-LENT))) r = x; }); }catch(e){}
  YT_ETAT.lente = r;
  return r;
}

/* ================= fichiers audio : voix humaine d'abord, synthèse ensuite =================
   Un seul élément <audio> pour toute la page : sur iPhone, c'est le premier appel à play()
   fait dans un clic qui « débloque » l'élément ; les lectures suivantes (repli, répliques
   enchaînées) passent ensuite sans nouveau clic. */
var AUDIO_EL = new Audio(); AUDIO_EL.preload = "auto";
var MANIFESTE = null, MANIFESTE_PROMESSE = Promise.resolve(null);
var CONNU = {};          /* id → "humain" | "synthese" : ce qui a réellement marché dans cette session */
var PRECHARGE = {};      /* id → {src, url} : sons gardés en mémoire pour une séance hors réseau */
var lecture = null, minuterieSuite = null;
function chargerManifeste(){
  var url = CFG.audio.manifeste + (CFG.version ? "?v=" + encodeURIComponent(CFG.version) : "");
  if(typeof fetch !== "function"){ MANIFESTE_PROMESSE = Promise.resolve(null); return MANIFESTE_PROMESSE; }
  MANIFESTE_PROMESSE = fetch(url, {cache:"no-cache"})
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(m){ MANIFESTE = m && m.clips ? m : null; return MANIFESTE; })
    .catch(function(){ MANIFESTE = null; return null; });
  try{ var s = sessionStorage.getItem(CFG.cle + "-sources"); if(s) CONNU = JSON.parse(s) || {}; }catch(e){ CONNU = {}; }
  return MANIFESTE_PROMESSE;
}
/* Lecture tolérante d'une entrée du manifeste : nouveau format {synthese:{…}, humain:{…}} ou ancien format à plat. */
function lireClip(id){
  var c = MANIFESTE && MANIFESTE.clips && MANIFESTE.clips[id];
  if(!c) return null;
  var syn = c.synthese || (c.file ? c : null), hum = c.humain || null;
  return {
    texte: c.texte != null ? c.texte : c.display_text,
    synthese: syn ? {file: syn.file, sha256: syn.sha256, statut: syn.statut || syn.status || "non_valide_a_l_ecoute"} : null,
    humain: hum ? {file: hum.file, sha256: hum.sha256, statut: hum.statut || hum.status || "non_valide_a_l_ecoute", voix: hum.voix} : null
  };
}
function memoriser(id, src){
  CONNU[id] = src;
  try{ sessionStorage.setItem(CFG.cle + "-sources", JSON.stringify(CONNU)); }catch(e){}
}
/* Liste ordonnée des adresses à essayer. Calcul immédiat (pas de promesse) : play() doit partir dans le clic.
   - manifeste lu, voix humaine déclarée → humain, puis synthèse ;
   - manifeste lu et « humain_liste_complete » → synthèse seule (aucune requête perdue, aucune erreur 404) ;
   - sinon (manifeste absent ou liste non garantie) → on essaie humain une fois par session, puis synthèse. */
function candidats(id){
  if(PRECHARGE[id]) return [PRECHARGE[id]];
  var c = lireClip(id), v = CFG.version ? "?v=" + encodeURIComponent(CFG.version) : "", L = [];
  function adresse(src, info){
    return ((info && info.file) || (CFG.audio[src] + id + CFG.audio.ext)) + (info && info.sha256 ? "?v=" + info.sha256.slice(0, 12) : v);
  }
  var essayerHumain = c && c.humain ? true
    : (MANIFESTE && MANIFESTE.humain_liste_complete === true) ? false
    : CONNU[id] !== "synthese";
  if(essayerHumain) L.push({src:"humain", url: adresse("humain", c && c.humain)});
  L.push({src:"synthese", url: adresse("synthese", c && c.synthese)});
  return L;
}
/* Source probable d'un son : pour l'étiquette « voix humaine » / « voix de synthèse ». null = pas encore connue. */
function sonSource(id){
  if(CONNU[id]) return CONNU[id];
  var c = lireClip(id);
  if(c && c.humain) return "humain";
  if(MANIFESTE && MANIFESTE.humain_liste_complete === true) return "synthese";
  return null;
}
function sonStatut(id){
  var c = lireClip(id), s = sonSource(id) || "synthese";
  return c && c[s] ? c[s].statut : "non_valide_a_l_ecoute";
}
function lancer(L){
  var c = L.liste[L.k], taux = L.r.lent ? LENT : 1;
  AUDIO_EL.loop = !!L.r.boucle && !L.apres;
  AUDIO_EL.src = c.url;
  AUDIO_EL.defaultPlaybackRate = taux; AUDIO_EL.playbackRate = taux;
  try{ AUDIO_EL.preservesPitch = true; AUDIO_EL.webkitPreservesPitch = true; AUDIO_EL.mozPreservesPitch = true; }catch(e){}
  var pr = null; try{ pr = AUDIO_EL.play(); }catch(e){}
  if(pr && pr.catch) pr.catch(function(e){
    if(lecture !== L || L.liste[L.k] !== c) return;             /* une autre lecture a pris la place */
    var nom = e && e.name;
    if(nom === "AbortError" || nom === "NotSupportedError") return;   /* l'événement « error » s'occupe du repli */
    echouer(L);                                                 /* lecture refusée par le navigateur */
  });
}
function echouer(L){
  if(lecture !== L) return;
  lecture = null; clearTimeout(minuterieSuite);
  try{ AUDIO_EL.pause(); }catch(e){}
  if(L.proprio) L.proprio(false, "echec");
  if(L.surEchec) L.surEchec(L.id);
}
AUDIO_EL.addEventListener("playing", function(){
  var L = lecture; if(!L || L.entendu) return;
  L.entendu = true;
  var src = L.liste[L.k].src; memoriser(L.id, src);
  if(L.surEntendu) L.surEntendu(src, L.id);
});
AUDIO_EL.addEventListener("ended", function(){
  var L = lecture; if(!L) return;
  if(L.apres){ L.apres(); return; }
  lecture = null; if(L.proprio) L.proprio(false, "fin");
});
AUDIO_EL.addEventListener("error", function(){
  var L = lecture; if(!L) return;
  if(!L.entendu && L.k < L.liste.length - 1){
    /* fichier humain absent (code 4) : on passe à la synthèse, sans message, et on s'en souvient */
    var code = AUDIO_EL.error ? AUDIO_EL.error.code : 4;
    if(L.liste[L.k].src === "humain" && code === 4) memoriser(L.id, "synthese");
    L.k++; lancer(L); return;
  }
  echouer(L);
});
function sonArreter(raison){
  var L = lecture; lecture = null; clearTimeout(minuterieSuite);
  try{ AUDIO_EL.pause(); AUDIO_EL.currentTime = 0; }catch(e){}
  if(L && L.proprio) L.proprio(false, raison || "arret");
}
/* r : {lent, boucle}. proprio(etat, raison) ; raison = "fin" quand le son est allé jusqu'au bout. */
function sonJouer(id, r, proprio, surEchec, surEntendu){
  Regie.prendre("audio");
  var L = {id:id, liste:candidats(id), k:0, r:r || {}, entendu:false, proprio:proprio, surEchec:surEchec, surEntendu:surEntendu};
  lecture = L;
  if(proprio) proprio(true);
  lancer(L);
}
/* Dialogue : plusieurs fichiers l'un après l'autre (une réplique = un fichier), avec un court silence.
   surReplique(i) est appelé au début de chaque réplique, puis surReplique(-1) à la fin :
   à l'écran, « qui parle » ne s'affiche que si le moteur le décide (après la réponse). */
function sonJouerSuite(ids, r, proprio, surReplique, surEchec, surEntendu){
  r = r || {};
  var i = 0, silence = r.silence == null ? 350 : r.silence, sources = [];
  Regie.prendre("audio");
  function terminer(etatFin, raison){ clearTimeout(minuterieSuite); if(surReplique) surReplique(-1); if(proprio) proprio(etatFin, raison); }
  function un(){
    if(surReplique) surReplique(i);
    var L = {id:ids[i], liste:candidats(ids[i]), k:0, r:{lent:r.lent}, entendu:false,
      proprio: function(e, raison){ if(!e) terminer(false, raison); },
      surEchec: surEchec,
      surEntendu: function(src){ sources.push(src); if(i === 0 && surEntendu) surEntendu(src, ids[0]); },
      apres: function(){
        if(i >= ids.length - 1){
          if(r.boucle){ i = 0; minuterieSuite = setTimeout(function(){ if(lecture === L) un(); }, silence * 2); return; }
          lecture = null; terminer(false, "fin"); return;
        }
        i++;
        minuterieSuite = setTimeout(function(){ if(lecture === L) un(); }, silence);
      }};
    lecture = L; lancer(L);
  }
  if(proprio) proprio(true);
  un();
}
/* Séance hors réseau : garder les sons en mémoire tant que l'onglet reste ouvert (rien n'est écrit sur le disque). */
function sonPrecharger(ids, progres){
  var fait = 0, absents = [];
  function un(id){
    var L = candidats(id), k = 0;
    function essai(){
      if(k >= L.length){ absents.push(id); return Promise.resolve(); }
      var c = L[k++];
      return fetch(c.url).then(function(r){ if(!r.ok) throw 0; return r.blob(); })
        .then(function(b){ PRECHARGE[id] = {src:c.src, url:URL.createObjectURL(b)}; memoriser(id, c.src); }, essai);
    }
    return essai().then(function(){ fait++; if(progres) progres(fait, ids.length); });
  }
  return ids.reduce(function(p, id){ return p.then(function(){ return un(id); }); }, Promise.resolve())
    .then(function(){ return {prets: ids.length - absents.length, absents: absents}; });
}

/* ================= barre d'écoute (commune au film et aux fichiers) ================= */
function barreEcoute(libelle, jouer, arreter, o){
  o = o || {};
  var w = el("div", "listen");
  var go = el("button", "listen-go" + (o.couleur ? " " + o.couleur : "")); go.type = "button";
  var ico = el("span", "listen-ico", "▶"); ico.setAttribute("aria-hidden", "true");
  var lib = el("span", "listen-lib", libelle);
  go.appendChild(ico); go.appendChild(lib);
  var lent = bouton("chip", TXT.lent); lent.setAttribute("aria-pressed", "false"); lent.title = "Vitesse 0,9";
  var boucle = bouton("chip", TXT.boucle); boucle.setAttribute("aria-pressed", "false");
  if(o.sansLent) lent.hidden = true;
  if(!o.avecBoucle) boucle.hidden = true;
  var enCours = false;
  function proprio(e, raison){
    var avant = enCours; enCours = !!e;
    ico.textContent = e === "attente" ? "…" : e ? "■" : "▶";
    lib.textContent = e === "attente" ? TXT.chargement : e ? TXT.arreter : libelle;
    go.classList.toggle("on", !!e);
    if(!e && avant && o.surFin) o.surFin(raison);       /* "fin" = écouté jusqu'au bout */
  }
  function reglages(){ return {lent: appuye(lent) && !lent.hidden, boucle: appuye(boucle) && !boucle.hidden}; }
  go.addEventListener("click", function(){
    if(enCours){ arreter(); if(enCours) proprio(false, "arret"); }
    else jouer(reglages(), proprio, lent);
  });
  [lent, boucle].forEach(function(b){ b.addEventListener("click", function(){
    b.setAttribute("aria-pressed", appuye(b) ? "false" : "true");
    if(b === lent && appuye(b) && o.surAide) o.surAide("lent");   /* une aide utilisée se note, elle ne se juge pas */
    if(enCours){ arreter(); if(enCours) proprio(false, "arret"); jouer(reglages(), proprio, lent); }
  }); });
  w.appendChild(go); w.appendChild(lent); w.appendChild(boucle);
  if(o.etiquette) w.appendChild(el("span", "listen-tag", o.etiquette));
  return w;
}
/* Bouton d'écoute d'un extrait du film. o : {sansLent, avecBoucle, etiquette, surEntendu, surFin, surAide, surEchec, repli}
   o.repli : nœud affiché si le film ne marche pas (p. ex. un boutonSon d'un dialogue créé, ou la phrase à dire). */
function extraitFilm(a, b, libelle, o){
  o = o || {};
  var vue = VUE, demande = 0;
  var msg = el("p", "alerte", ""); msg.hidden = true; msg.setAttribute("role", "status");
  if(o.repli) o.repli.hidden = true;
  function echec(texte, suite, pourquoi){
    var ouvrir = suite ? TXT.filmOuvrir : TXT.filmOuvrir.charAt(0).toUpperCase() + TXT.filmOuvrir.slice(1);
    msg.innerHTML = echapper(texte) + " <a href='" + echapper(lienVideo(a)) + "' target='_blank' rel='noopener'>" + echapper(ouvrir) + " (" + mmss(a) + ")</a>.";
    msg.hidden = false;
    if(o.repli) o.repli.hidden = false;
    if(o.surEchec) o.surEchec(pourquoi);
  }
  var barre = barreEcoute(libelle || TXT.ecouter, function(r, proprio, btnLent){
    msg.hidden = true;
    Regie.prendre("film");
    proprio("attente");
    var courante = ++demande;
    filmCharger(function(ok, pourquoi){
      if(vue !== VUE || courante !== demande){ proprio(false, "annule"); return; }
      if(!ok){ proprio(false, "echec"); echec(pourquoi === "hors_ligne" ? TXT.filmHorsLigne : TXT.filmBloque, false, pourquoi); return; }
      var lente = filmVitesseLente();
      btnLent.hidden = !lente || !!o.sansLent;
      filmJouer(a, b, {boucle:r.boucle, taux:(r.lent && lente) ? lente : 1}, proprio,
        function(p){ echec(TXT.filmNeDemarrePas, true, p); }, o.surEntendu);
    });
  }, function(){ demande++; filmArreter("arret"); },
  {couleur:"film", sansLent: o.sansLent || !(YT_ETAT.pret && filmVitesseLente()), avecBoucle:o.avecBoucle,
   etiquette: o.etiquette === undefined ? TXT.filmNote : o.etiquette, surFin:o.surFin, surAide:o.surAide});
  var boite = el("div", "listen-wrap"); boite.appendChild(barre); boite.appendChild(msg);
  if(o.repli) boite.appendChild(o.repli);
  return boite;
}
/* Bouton d'écoute d'un fichier audio. o : {texte, noeud, couleur, sansLent, avecBoucle, etiquette, surEntendu, surFin, surAide, surEchec}
   o.texte : texte affiché correspondant ; si le manifeste prouve que le son dit autre chose, le bouton est caché.
   o.noeud : élément surligné pendant la lecture. */
function boutonSon(id, libelle, o){
  o = o || {};
  var msg = el("p", "alerte", TXT.sonAbsent); msg.hidden = true; msg.setAttribute("role", "status");
  var barre = barreEcoute(libelle || TXT.ecouter, function(r, proprio){
    msg.hidden = true;
    sonJouer(id, r, function(e, raison){ proprio(e, raison); if(o.noeud) o.noeud.classList.toggle("speaking", !!e); },
      function(){ msg.hidden = false; if(o.surEchec) o.surEchec(id); }, o.surEntendu);
  }, function(){ sonArreter("arret"); },
  {couleur:o.couleur || "cree", sansLent:o.sansLent, avecBoucle:o.avecBoucle, etiquette:o.etiquette, surFin:o.surFin, surAide:o.surAide});
  var boite = el("div", "listen-wrap"); boite.dataset.audioId = id;
  boite.appendChild(barre); boite.appendChild(msg);
  if(o.texte != null) MANIFESTE_PROMESSE.then(function(){
    var c = lireClip(id);
    if(c && c.texte != null && sansBalises(c.texte) !== sansBalises(o.texte)){
      boite.hidden = true;
      if(window.console) console.warn("Son périmé (texte différent du manifeste) : " + id);
    }
  });
  return boite;
}
/* Bouton d'écoute d'un dialogue (suite de répliques). repliques : [{id, role, texte}].
   surReplique(i) permet au moteur de montrer qui parle — ou de ne rien montrer avant la réponse. */
function boutonDialogue(repliques, libelle, o){
  o = o || {};
  var ids = repliques.map(function(x){ return x.id; });
  var msg = el("p", "alerte", TXT.sonAbsent); msg.hidden = true; msg.setAttribute("role", "status");
  var barre = barreEcoute(libelle || TXT.ecouter, function(r, proprio){
    msg.hidden = true;
    sonJouerSuite(ids, {lent:r.lent, boucle:r.boucle, silence:o.silence}, proprio, o.surReplique,
      function(){ msg.hidden = false; if(o.surEchec) o.surEchec(); }, o.surEntendu);
  }, function(){ sonArreter("arret"); },
  {couleur:o.couleur || "cree", sansLent:o.sansLent, avecBoucle:o.avecBoucle, etiquette:o.etiquette, surFin:o.surFin, surAide:o.surAide});
  var boite = el("div", "listen-wrap"); boite.dataset.audioIds = ids.join(" ");
  boite.appendChild(barre); boite.appendChild(msg);
  return boite;
}

/* ================= enregistreur facultatif =================
   Les enregistrements restent dans la mémoire de la page (SONS_SESSION) : jamais dans
   localStorage, jamais envoyés. Ils disparaissent à la fermeture ou au rechargement.
   Micro refusé ou absent : la personne répond à voix haute, sans enregistrement. */
var SONS_SESSION = {};
var arretMicro = null;
function extensionSon(type){ return /mp4|m4a|aac/.test(type) ? ".m4a" : /ogg/.test(type) ? ".ogg" : /wav/.test(type) ? ".wav" : /mpeg|mp3/.test(type) ? ".mp3" : ".webm"; }
function oublierSon(cle){ var s = SONS_SESSION[cle]; if(s && s.url){ try{ URL.revokeObjectURL(s.url); }catch(e){} } delete SONS_SESSION[cle]; }
function oublierSons(){ Object.keys(SONS_SESSION).forEach(oublierSon); }
/* o : {libelle, consigne, surReponse(type), telecharger, nomFichier, importer, studio, sansBoutonSans}
   surReponse("enregistre" | "sans_micro" | "fichier") : le moteur note au journal et passe à la suite. */
function enregistreur(cle, secondes, o){
  o = o || {};
  var boite = el("div", "rec");
  var haut = el("div", "rec-top");
  var btn = bouton("btn-rec", o.libelle || TXT.enregistrer);
  var temps = el("span", "rec-time", "0:00 / " + mmss(secondes));
  var jauge = el("span", "rec-bar"), plein = el("i"); jauge.appendChild(plein); jauge.setAttribute("aria-hidden", "true");
  haut.appendChild(btn); haut.appendChild(temps); haut.appendChild(jauge);
  boite.appendChild(haut);
  var msg = el("p", "rec-msg", o.consigne || TXT.microConsigne); msg.setAttribute("role", "status");
  boite.appendChild(msg);
  var sortie = el("div", "rec-out"); boite.appendChild(sortie);
  var sans = bouton("btn", TXT.sansMicro, function(){ if(o.surReponse) o.surReponse("sans_micro"); });
  if(o.sansBoutonSans) sans.hidden = true;
  boite.appendChild(sans);
  var fichier = null;
  if(o.importer){
    var et = el("label", "rec-file"); et.appendChild(document.createTextNode(TXT.importer + " : "));
    fichier = document.createElement("input"); fichier.type = "file"; fichier.accept = "audio/*"; fichier.id = "fichier-" + cle;
    et.appendChild(fichier); boite.appendChild(et);
    fichier.addEventListener("change", function(){ if(fichier.files && fichier.files[0]) recevoir(fichier.files[0], "fichier"); });
  }
  boite.appendChild(el("p", "rec-note", TXT.confidentialite));

  var mr = null, morceaux = [], t0 = 0, tic = null, flux = null;
  function montrer(){
    sortie.innerHTML = "";
    var s = SONS_SESSION[cle]; if(!s) return;
    var au = document.createElement("audio"); au.controls = true; au.src = s.url; sortie.appendChild(au);
    if(o.telecharger){
      var dl = el("a", "btn small", TXT.telecharger);
      dl.href = s.url; dl.download = (o.nomFichier || (CFG.cle + "-" + cle)) + extensionSon(s.blob.type || "");
      sortie.appendChild(dl);
    }
  }
  function recevoir(blob, type){
    oublierSon(cle);
    SONS_SESSION[cle] = {blob: blob, url: URL.createObjectURL(blob)};
    msg.className = "rec-msg"; msg.textContent = TXT.microFini;
    montrer();
    if(o.surReponse) o.surReponse(type || "enregistre", blob);
  }
  function arreter(){
    clearInterval(tic);
    if(mr && mr.state !== "inactive"){ try{ mr.stop(); }catch(e){} }
    if(arretMicro === arreter) arretMicro = null;
    btn.classList.remove("on"); btn.textContent = TXT.recommencer;
  }
  function refuse(){
    msg.textContent = TXT.microRefuse; msg.className = "alerte";
    btn.hidden = true; temps.hidden = true; jauge.hidden = true;
    sans.hidden = false; sans.className = "btn btn-primary";
  }
  btn.addEventListener("click", function(){
    if(mr && mr.state === "recording"){ arreter(); return; }
    Regie.prendre("micro");                       /* les sons s'arrêtent ; un autre enregistrement en cours aussi */
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder){ refuse(); return; }
    msg.className = "rec-msg"; msg.textContent = TXT.microDemande;
    var demande = o.studio ? {audio:{echoCancellation:false, noiseSuppression:false, autoGainControl:false, channelCount:1}} : {audio:true};
    navigator.mediaDevices.getUserMedia(demande).then(function(s){
      flux = s; morceaux = [];
      var type = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"].filter(function(t){ return MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t); })[0];
      mr = type ? new MediaRecorder(s, {mimeType:type}) : new MediaRecorder(s);
      mr.ondataavailable = function(e){ if(e.data && e.data.size) morceaux.push(e.data); };
      mr.onstop = function(){
        if(arretMicro === arreter) arretMicro = null;
        flux.getTracks().forEach(function(t){ t.stop(); });        /* le voyant du micro s'éteint */
        recevoir(new Blob(morceaux, {type: mr.mimeType || "audio/webm"}), "enregistre");
      };
      Regie.prendre("micro");
      mr.start(250); t0 = Date.now();
      arretMicro = arreter;
      btn.classList.add("on"); btn.textContent = TXT.arreter;
      msg.textContent = TXT.microEnCours;
      tic = setInterval(function(){
        var e = (Date.now() - t0) / 1000;
        temps.textContent = mmss(e) + " / " + mmss(secondes);
        plein.style.width = Math.min(100, e / secondes * 100) + "%";
        if(e >= secondes) arreter();
      }, 200);
    }, refuse);
  });
  if(SONS_SESSION[cle]) montrer();
  return boite;
}

/* ================= journal des aides =================
   journal.note(ecran, item, evenement, detail) : une ligne datée par aide réellement utilisée.
   L'exactitude d'une réponse se note À PART (journal.reponse) : « juste / à revoir » et
   « avec quelle aide » sont deux colonnes différentes (dossier 02 §6). */
var EVENEMENTS = {
  ecoute: "écoute", reecoute: "réécoute", lent: "plus lent", boucle: "en boucle", autre_voix: "autre voix",
  images: "images montrées", texte: "texte montré", qui_parle: "rôles montrés", sous_titres: "sous-titres du film",
  aide_langue: "aide dans ma langue", repetition: "« Pardon ? » demandé", relance: "relance du formateur",
  carte: "carte regardée", sans_micro: "réponse sans micro", enregistre: "réponse enregistrée",
  film_absent: "film indisponible", son_absent: "son indisponible"
};
var journal = {
  note: function(ecran, item, evenement, detail){
    var J = etat().journal, ligne = {t: new Date().toISOString(), e: String(ecran), i: String(item), ev: String(evenement)};
    if(detail != null) ligne.d = detail;
    J.push(ligne);
    if(J.length > 2000) J.splice(0, J.length - 2000);
    MAGASIN.sauverBientot();
    return ligne;
  },
  lignes: function(ecran, item){
    return etat().journal.filter(function(x){ return (ecran == null || x.e === String(ecran)) && (item == null || x.i === String(item)); });
  },
  compter: function(ecran, item, evenement){
    return journal.lignes(ecran, item).filter(function(x){ return x.ev === evenement; }).length;
  },
  /* condition : "passage1" | "images" | "passage2" | "texte" | "relance"… ; juste : true, false ou null (non jugé) */
  reponse: function(ecran, item, condition, valeur, juste){
    var k = ecran + "/" + item, R = etat().rep;
    (R[k] || (R[k] = [])).push({t: new Date().toISOString(), cond: condition, valeur: valeur, juste: juste == null ? null : !!juste});
    MAGASIN.sauver();
  },
  reponses: function(ecran, item){ return etat().rep[ecran + "/" + item] || []; },
  /* Résumé lisible, dans l'ordre : « S0 · dialogue : écoute ×1, images montrées ×1, réécoute ×1 » */
  texte: function(){
    var ordre = [], groupes = {};
    etat().journal.forEach(function(x){
      var k = x.e + " · " + x.i;
      if(!groupes[k]){ groupes[k] = {suite: [], n: {}}; ordre.push(k); }
      if(!groupes[k].n[x.ev]){ groupes[k].n[x.ev] = 0; groupes[k].suite.push(x.ev); }
      groupes[k].n[x.ev]++;
    });
    return ordre.map(function(k){
      return k + " : " + groupes[k].suite.map(function(ev){ return (EVENEMENTS[ev] || ev) + " ×" + groupes[k].n[ev]; }).join(", ");
    });
  },
  effacer: function(){ etat().journal = []; etat().rep = {}; MAGASIN.sauver(); }
};

/* ================= export : du texte et des chiffres, jamais de son ================= */
/* sections : [{titre, lignes:[…]}] fournies par le moteur ; le journal et les réponses sont ajoutés ici. */
function construireExport(entete, sections){
  var L = (entete || []).slice();
  L.push("Copié le " + new Date().toLocaleString("fr-FR"));
  var E = etat();
  L.push("Mode : " + E.mode + " · palier : " + E.palier + " · aide de langue : " + E.aide);
  (sections || []).forEach(function(s){ L.push(""); L.push("— " + s.titre + " —"); (s.lignes || []).forEach(function(x){ L.push(x); }); });
  L.push(""); L.push("— RÉPONSES (condition → réponse) —");
  Object.keys(E.rep).forEach(function(k){
    L.push(k + " : " + E.rep[k].map(function(r){
      return r.cond + " → " + r.valeur + (r.juste === true ? " (attendu)" : r.juste === false ? " (autre réponse)" : "");
    }).join(" ; "));
  });
  L.push(""); L.push("— AIDES UTILISÉES (dans l'ordre) —");
  journal.texte().forEach(function(x){ L.push(x); });
  L.push(""); L.push("Ce texte ne contient aucun enregistrement de voix.");
  return L.join("\n");
}
function ouvrirExport(texte, titre){
  var retour = document.activeElement;
  var mask = el("div", "mask"), mo = el("div", "modal");
  mo.setAttribute("role", "dialog"); mo.setAttribute("aria-modal", "true"); mo.setAttribute("aria-labelledby", "exportTitre");
  var h = el("h2", null, titre || TXT.exportTitre); h.id = "exportTitre"; mo.appendChild(h);
  mo.appendChild(el("p", "small muted", TXT.exportAide));
  var ta = document.createElement("textarea"); ta.id = "exportText"; ta.value = texte; ta.readOnly = true;
  ta.setAttribute("aria-label", titre || TXT.exportTitre); mo.appendChild(ta);
  var r = el("div", "row"), fait = el("span", "small muted", ""); fait.setAttribute("role", "status");
  var cp = bouton("btn btn-primary", TXT.copier, function(){
    var ok = function(){ fait.textContent = TXT.copie; };
    var manuel = function(){ ta.focus(); ta.select(); fait.textContent = TXT.copieManuelle; };
    try{ navigator.clipboard.writeText(ta.value).then(ok, manuel); }catch(e){ manuel(); }
  });
  var cl = bouton("btn", TXT.fermer, fermer);
  function fermer(){ mask.remove(); document.removeEventListener("keydown", clavier, true); if(retour && retour.focus) retour.focus(); }
  function clavier(e){
    if(e.key === "Escape"){ fermer(); return; }
    if(e.key !== "Tab") return;                       /* le focus reste dans la fenêtre */
    var f = [ta, cp, cl], i = f.indexOf(document.activeElement);
    if(e.shiftKey && i <= 0){ e.preventDefault(); cl.focus(); }
    else if(!e.shiftKey && (i === f.length - 1 || i < 0)){ e.preventDefault(); ta.focus(); }
  }
  mask.addEventListener("click", function(e){ if(e.target === mask) fermer(); });
  document.addEventListener("keydown", clavier, true);
  r.appendChild(cp); r.appendChild(cl); r.appendChild(fait); mo.appendChild(r);
  mask.appendChild(mo); document.body.appendChild(mask); cp.focus();
  return {fermer: fermer, zone: ta};
}
/* Téléchargement d'un fichier fabriqué dans la page (JSON du studio, enregistrement du formateur). */
function telecharger(nom, contenu, type){
  var blob = (typeof Blob !== "undefined" && contenu instanceof Blob) ? contenu : new Blob([contenu], {type: type || "text/plain;charset=utf-8"});
  var url = URL.createObjectURL(blob), a = el("a"); a.href = url; a.download = nom; a.hidden = true;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function(){ try{ URL.revokeObjectURL(url); }catch(e){} }, 1500);
}

/* ================= studio du formateur : données =================
   Avis d'écoute rangés à part (clé « …-studio ») : ils survivent à « Tout effacer » de l'apprenant.
   Un avis est lié à l'empreinte du fichier écouté : si le fichier change, l'avis devient « à réécouter ». */
var STUDIO = null;
function studioMagasin(){ return STUDIO || (STUDIO = creerMagasin(CFG.cle + "-studio", {validateur:"", avis:{}})); }
function empreinte(id, src){ var c = lireClip(id); return c && c[src] && c[src].sha256 ? c[src].sha256 : null; }
var studio = {
  nom: function(n){ var M = studioMagasin(); if(n != null){ M.etat.validateur = String(n).trim(); M.sauver(); } return M.etat.validateur; },
  /* verdict : "valide_a_l_ecoute" | "a_refaire" | null (effacer l'avis). Sans nom de validateur, rien n'est noté. */
  noter: function(id, verdict, note){
    var M = studioMagasin();
    if(verdict == null){ delete M.etat.avis[id]; M.sauver(); return null; }
    if(!M.etat.validateur) return null;
    var src = sonSource(id) || "synthese";
    M.etat.avis[id] = {etat: verdict, date: new Date().toISOString(), nom: M.etat.validateur, source: src, sha256: empreinte(id, src), note: note || ""};
    M.sauver();
    return M.etat.avis[id];
  },
  avis: function(id){
    var a = studioMagasin().etat.avis[id]; if(!a) return null;
    var actuel = empreinte(id, a.source), r = copie(a);
    r.perime = !!(a.sha256 && actuel && a.sha256 !== actuel);       /* le fichier a changé depuis l'écoute */
    return r;
  },
  exporter: function(){
    var M = studioMagasin();
    return JSON.stringify({atelier: CFG.cle, version: CFG.version, exporte_le: new Date().toISOString(),
      validateur: M.etat.validateur, avis: M.etat.avis}, null, 2);
  }
};

/* ================= avertissements de démarrage ================= */
function avertissements(avant, lien){
  var cible = avant || document.querySelector("main");
  function poser(n){ if(cible && cible.parentNode) cible.parentNode.insertBefore(n, cible); else document.body.appendChild(n); }
  if(!MAGASIN.ok) poser(el("div", "storewarn", TXT.stockageBloque));
  if(window.self !== window.top){
    var b = el("div", "storewarn", TXT.apercu + " ");
    if(lien){ var a = el("a", null, lien); a.href = lien; a.target = "_blank"; a.rel = "noopener"; b.appendChild(a); }
    poser(b);
  }
}

/* ================= démarrage ================= */
function fusion(cible, source){ for(var k in source){ if(source[k] && typeof source[k] === "object" && !Array.isArray(source[k]) && cible[k] && typeof cible[k] === "object") fusion(cible[k], source[k]); else cible[k] = source[k]; } }
function demarrer(config){
  config = config || {};
  if(config.textes) fusion(TXT, config.textes);
  var c = copie(config); delete c.textes; fusion(CFG, c);
  VIDEO = CFG.video.url || "";
  VIDEO_ID = (VIDEO.match(/(?:youtu\.be\/|[?&]v=|embed\/)([\w-]{11})/) || [])[1] || null;
  var defauts = copie(ETAT_DEFAUT); if(CFG.etat) fusion(defauts, CFG.etat);
  MAGASIN = creerMagasin(CFG.cle, defauts);
  themeAppliquer();
  chargerManifeste();
  return API;
}
Regie.declarer("audio", function(){ sonArreter("remplace"); });
Regie.declarer("film", function(){ filmArreter("remplace"); });
Regie.declarer("ecoutes", function(sauf){ Array.prototype.forEach.call(document.querySelectorAll("audio"), function(a){ if(a !== sauf){ try{ a.pause(); }catch(e){} } }); });
Regie.declarer("micro", function(){ if(arretMicro) arretMicro(); });
/* Réécoute d'un enregistrement (lecteur natif) : les autres sources se taisent. */
document.addEventListener("play", function(e){
  var t = e.target; if(t && t.tagName === "AUDIO" && t !== AUDIO_EL) Regie.prendre("ecoutes", t);
}, true);

var API = {
  demarrer: demarrer, config: CFG, textes: TXT, LENT: LENT,
  /* stockage */
  creerMagasin: creerMagasin, magasin: function(){ return MAGASIN; }, etat: etat,
  sauver: function(){ return MAGASIN.sauver(); }, sauverBientot: function(){ MAGASIN.sauverBientot(); },
  effacerTout: function(){ toutArreter(); oublierSons(); return MAGASIN.effacer(); },
  /* outils */
  el: el, html: html, echapper: echapper, bouton: bouton, appuye: appuye, dureeTxt: dureeTxt, mmss: mmss, norm: norm, fmt: fmt,
  sansBalises: sansBalises, espacesFr: espacesFr, annoncer: annoncer, zoneRetour: zoneRetour, montrerRetour: montrerRetour,
  theme: {appliquer: themeAppliquer, basculer: themeBasculer},
  /* sons */
  regie: Regie, nouvelleVue: nouvelleVue, toutArreter: toutArreter,
  film: {charger: filmCharger, jouer: filmJouer, arreter: filmArreter, cacher: filmCacher, vitesseLente: filmVitesseLente,
    sousTitres: filmSousTitres, sousTitresActifs: filmSousTitresActifs, couperSousTitres: couperSousTitres,
    lien: lienVideo, etat: YT_ETAT, zone: zoneFilm},
  sons: {jouer: sonJouer, jouerSuite: sonJouerSuite, arreter: sonArreter, candidats: candidats, source: sonSource, statut: sonStatut,
    clip: lireClip, precharger: sonPrecharger, manifeste: function(){ return MANIFESTE_PROMESSE; }, element: AUDIO_EL,
    oublierSources: function(){ CONNU = {}; try{ sessionStorage.removeItem(CFG.cle + "-sources"); }catch(e){} }},
  barreEcoute: barreEcoute, extraitFilm: extraitFilm, boutonSon: boutonSon, boutonDialogue: boutonDialogue,
  /* micro */
  enregistreur: enregistreur, sonsSession: SONS_SESSION, oublierSons: oublierSons,
  /* traces et export */
  journal: journal, EVENEMENTS: EVENEMENTS, construireExport: construireExport, ouvrirExport: ouvrirExport, telecharger: telecharger,
  studio: studio, avertissements: avertissements
};
return API;
})();
if(typeof window !== "undefined") window.Socle = Socle;
