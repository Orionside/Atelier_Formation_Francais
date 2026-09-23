(function () {
  "use strict";

  const STORAGE_KEY = "acceleration-b2-sprint-oral-v4";
  const stepMeta = [
    ["Mesure à froid", "5 min"],
    ["Paradoxe", "7 min"],
    ["Donnée prudente", "6 min"],
    ["Blocs actifs", "9 min"],
    ["Prosodie", "8 min"],
    ["Boucle 3/2/1", "12 min"],
    ["Interaction", "8 min"],
    ["Preuve & transfert", "5 min"]
  ];

  const roles = {
    direction: {
      label: "Direction / management",
      preview: "Décider d’une règle d’équipe qui protège l’attention sans ralentir l’activité.",
      title: "CODIR : faut-il répondre aux messages en moins d’une heure ?",
      context: "Une nouvelle règle promet plus de réactivité. Vous craignez qu’elle fragmente l’attention et réduise la qualité des décisions.",
      prompt: "En 90 secondes : prenez position, donnez un exemple, nuancez une donnée et proposez une règle alternative.",
      objection: "Nos clients veulent une réponse immédiate. Une plage sans messages va nous faire perdre en réactivité."
    },
    juridique: {
      label: "Avocat·e / juriste senior",
      preview: "Encadrer la disponibilité implicite et défendre une règle sans fragiliser la relation client.",
      title: "Cabinet : la disponibilité permanente est-elle un service ?",
      context: "Les outils accélèrent les échanges, mais chaque gain de temps crée de nouvelles demandes et une attente de réponse continue.",
      prompt: "En 90 secondes : distinguez fait, interprétation et réserve, puis recommandez une règle de disponibilité.",
      objection: "Dans notre métier, être joignable à tout moment fait partie de la valeur perçue par le client."
    },
    clinique: {
      label: "Responsable d’essais cliniques",
      preview: "Réduire les interruptions tout en sécurisant les décisions et les délais internationaux.",
      title: "Essai multicentrique : plus d’alertes, plus de contrôle ?",
      context: "Un tableau de bord en temps réel promet de sécuriser le suivi. L’équipe reçoit pourtant davantage d’alertes et change sans cesse de priorité.",
      prompt: "En 90 secondes : expliquez le paradoxe, citez la donnée avec prudence et proposez un protocole d’escalade.",
      objection: "Plus d’alertes signifie que les risques sont vus plus tôt : je ne comprends pas pourquoi il faudrait les limiter."
    }
  };

  const chunks = [
    {
      id: "paradox",
      function: "Nommer le paradoxe",
      form: "Ce n’est paradoxal qu’en apparence : …",
      examples: {
        direction: "Ce n’est paradoxal qu’en apparence : répondre plus vite peut ralentir les décisions de fond.",
        juridique: "Ce n’est paradoxal qu’en apparence : gagner du temps sur la revue crée de nouvelles attentes de disponibilité.",
        clinique: "Ce n’est paradoxal qu’en apparence : davantage d’alertes peut retarder le traitement des risques prioritaires."
      }
    },
    {
      id: "correlation",
      function: "Montrer une corrélation",
      form: "Plus…, plus… / Plus…, moins…",
      examples: {
        direction: "Plus on exige des réponses immédiates, moins on laisse de place aux décisions réfléchies.",
        juridique: "Plus les échanges sont rapides, plus l’obligation de disponibilité paraît aller de soi.",
        clinique: "Plus les alertes se multiplient, moins l’équipe distingue l’urgent de l’important."
      }
    },
    {
      id: "evidence",
      function: "Rapporter sans suraffirmer",
      form: "Les données citées suggèrent que…",
      examples: {
        direction: "Les données citées suggèrent que les interruptions réduisent la continuité de l’attention.",
        juridique: "Les données citées suggèrent qu’une sollicitation continue augmente le coût des changements de tâche.",
        clinique: "Les données citées suggèrent que la fragmentation de l’attention peut fragiliser la priorisation."
      }
    },
    {
      id: "caution",
      function: "Introduire une réserve",
      form: "Cela étant, …",
      examples: {
        direction: "Cela étant, la rapidité reste nécessaire pour les demandes réellement critiques.",
        juridique: "Cela étant, certains dossiers justifient évidemment une disponibilité immédiate.",
        clinique: "Cela étant, une alerte de sécurité ne peut pas attendre la prochaine plage de traitement."
      }
    },
    {
      id: "action",
      function: "Proposer sans imposer",
      form: "Il faudrait peut-être…",
      examples: {
        direction: "Il faudrait peut-être définir deux plages de réponse et un canal réservé aux urgences.",
        juridique: "Il faudrait peut-être convenir avec le client de critères explicites d’urgence.",
        clinique: "Il faudrait peut-être classer les alertes par risque et fixer un protocole d’escalade."
      }
    }
  ];

  const defaultState = { step: 0, role: null, completed: {}, values: {}, checks: {}, scales: {}, chunks: {}, recordings: {}, transfer: false };
  let state = loadState();
  let activeRecording = null;
  const audioBlobs = {};

  function loadState() {
    try { return { ...defaultState, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") }; }
    catch (_) { return { ...defaultState }; }
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) { /* navigation privée */ }
  }
  function formatTime(seconds) {
    const value = Math.max(0, Math.ceil(seconds));
    return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
  }

  function renderNav() {
    const nav = document.getElementById("stepNav");
    nav.innerHTML = "";
    stepMeta.forEach((item, index) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = state.completed[index] ? "is-done" : "";
      if (index === state.step) button.setAttribute("aria-current", "step");
      button.innerHTML = `<span class="nav-num">${state.completed[index] ? "✓" : String(index + 1).padStart(2, "0")}</span><span>${item[0]}</span><span class="nav-time">${item[1]}</span>`;
      button.addEventListener("click", () => goToStep(index));
      li.appendChild(button);
      nav.appendChild(li);
    });
  }

  function goToStep(index) {
    state.step = Math.min(7, Math.max(0, index));
    saveState();
    document.querySelectorAll(".step").forEach((step, i) => { step.hidden = i !== state.step; });
    document.getElementById("prevStep").disabled = state.step === 0;
    document.getElementById("nextStep").textContent = state.step === 7 ? "Terminer la séance ✓" : "Étape terminée →";
    renderNav();
    renderProgress();
    document.getElementById("stage").focus({ preventScroll: true });
    window.scrollTo({ top: document.querySelector(".dashboard").offsetTop - 72, behavior: "smooth" });
  }

  function renderProgress() {
    const done = Object.values(state.completed).filter(Boolean).length;
    document.getElementById("progressLabel").textContent = `${done} étape${done > 1 ? "s" : ""} sur 8`;
    document.getElementById("progressBar").style.width = `${done / 8 * 100}%`;
    document.getElementById("dashSamples").textContent = `${["baseline", "exit"].filter(key => state.recordings[key]).length}/2`;
    document.getElementById("dashRounds").textContent = `${["round1", "round2", "round3"].filter(key => state.recordings[key]).length}/3`;
    document.getElementById("dashChunks").textContent = `${Object.values(state.chunks).filter(Boolean).length}/5`;
    document.getElementById("dashTransfer").textContent = state.transfer ? "Oui" : "—";
  }

  function selectRole(role) {
    state.role = role;
    saveState();
    document.querySelectorAll("[data-role]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.role === role)));
    const data = roles[role];
    document.getElementById("rolePreview").textContent = data.preview;
    document.getElementById("coldTitle").textContent = data.title;
    document.getElementById("coldContext").textContent = data.context;
    document.getElementById("coldPrompt").textContent = data.prompt;
    document.getElementById("startButton").disabled = false;
    updateRoleDependentContent();
  }

  function updateRoleDependentContent() {
    if (!state.role) return;
    const data = roles[state.role];
    document.querySelectorAll("[data-role-title]").forEach(node => { node.textContent = data.title; });
    document.querySelectorAll("[data-role-context]").forEach(node => { node.textContent = data.context; });
    document.querySelectorAll("[data-role-prompt]").forEach(node => { node.textContent = data.prompt; });
    document.querySelectorAll("[data-role-objection]").forEach(node => { node.textContent = `« ${data.objection} »`; });
    document.querySelectorAll("[data-chunk-example]").forEach(node => {
      const chunk = chunks.find(item => item.id === node.dataset.chunkExample);
      if (chunk) {
        const example = chunk.examples[state.role];
        node.textContent = example;
        const speakButton = node.closest(".chunk-card")?.querySelector(".speak-button");
        if (speakButton) speakButton.dataset.speak = example;
      }
    });
  }

  function hydrateInputs() {
    document.querySelectorAll("[data-save]").forEach(field => {
      field.value = state.values[field.dataset.save] || "";
      field.addEventListener("input", () => { state.values[field.dataset.save] = field.value; saveState(); });
    });
    document.querySelectorAll("[data-check]").forEach(field => {
      field.checked = Boolean(state.checks[field.dataset.check]);
      field.addEventListener("change", () => { state.checks[field.dataset.check] = field.checked; saveState(); });
    });
    document.querySelectorAll('input[type="range"]').forEach(field => {
      const group = field.closest("[data-rating-group]")?.dataset.ratingGroup;
      const key = `${group}-${field.dataset.field}`;
      if (state.values[key]) field.value = state.values[key];
      const output = field.parentElement.querySelector("output");
      const update = () => { output.textContent = `${field.value}/5`; state.values[key] = field.value; saveState(); };
      field.addEventListener("input", update); update();
    });
    document.querySelectorAll("[data-scale]").forEach(scale => {
      const key = scale.dataset.scale;
      scale.querySelectorAll("button").forEach(button => {
        button.setAttribute("aria-pressed", String(state.scales[key] === button.textContent));
        button.addEventListener("click", () => {
          state.scales[key] = button.textContent; saveState();
          scale.querySelectorAll("button").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
        });
      });
    });
  }

  function initClips() {
    document.querySelectorAll(".clip-card").forEach(card => {
      const facade = card.querySelector(".clip-facade");
      card.querySelector(".load-clip").addEventListener("click", () => {
        const iframe = document.createElement("iframe");
        iframe.title = "Extrait de la vidéo ARTE";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        iframe.src = `https://www.youtube-nocookie.com/embed/9cO5bDqQKMM?start=${card.dataset.videoStart}&end=${card.dataset.videoEnd}&autoplay=1&rel=0&cc_lang_pref=fr`;
        facade.replaceChildren(iframe);
      });
    });
  }

  function initSpeech() {
    document.querySelectorAll(".speak-button").forEach(button => button.addEventListener("click", () => {
      if (!("speechSynthesis" in window)) return;
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(button.dataset.speak);
      utterance.lang = "fr-FR"; utterance.rate = .88;
      speechSynthesis.speak(utterance);
    }));
  }

  function initRecorders() {
    document.querySelectorAll("[data-recorder]").forEach(box => {
      const button = box.querySelector(".button--record");
      if (!button) return;
      button.addEventListener("click", () => activeRecording?.box === box ? stopRecording() : startRecording(box));
      if (state.recordings[box.dataset.recorder]) renderStoredResult(box, state.recordings[box.dataset.recorder]);
    });
  }

  async function startRecording(box) {
    if (activeRecording) stopRecording();
    if (!navigator.mediaDevices?.getUserMedia || !("MediaRecorder" in window)) {
      box.querySelector(".recorder__result").textContent = "L’enregistrement n’est pas disponible dans ce navigateur. Utilisez le dictaphone de votre appareil.";
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find(type => MediaRecorder.isTypeSupported(type));
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      const chunks = [];
      const limit = Number(box.dataset.limit || 90);
      const startedAt = performance.now();
      recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      recorder.onstop = () => finishRecording(box, chunks, recorder.mimeType, stream, (performance.now() - startedAt) / 1000);
      recorder.start(100);
      box.querySelector(".button--record").textContent = "Arrêter";
      box.querySelector(".button--record").classList.add("is-recording");
      const tick = window.setInterval(() => {
        const remaining = limit - (performance.now() - startedAt) / 1000;
        box.querySelector(".recorder__time").textContent = formatTime(remaining);
        if (remaining <= 0) stopRecording();
      }, 200);
      activeRecording = { box, recorder, stream, tick, limit };
    } catch (_) {
      box.querySelector(".recorder__result").textContent = "Microphone non autorisé. Vous pouvez poursuivre sans enregistrer ou modifier l’autorisation du navigateur.";
    }
  }

  function stopRecording() {
    if (!activeRecording) return;
    clearInterval(activeRecording.tick);
    activeRecording.recorder.stop();
    activeRecording = null;
  }

  async function finishRecording(box, chunks, mimeType, stream, duration) {
    stream.getTracks().forEach(track => track.stop());
    const key = box.dataset.recorder;
    const blob = new Blob(chunks, { type: mimeType || "audio/webm" });
    audioBlobs[key] = blob;
    const metrics = await analyseAudio(blob).catch(() => ({ duration }));
    state.recordings[key] = { duration: metrics.duration || duration, pausesPerMinute: metrics.pausesPerMinute ?? null, meanRun: metrics.meanRun ?? null, date: new Date().toISOString() };
    saveState();
    box.querySelector(".button--record").textContent = "Réenregistrer";
    box.querySelector(".button--record").classList.remove("is-recording");
    box.querySelector(".recorder__time").textContent = formatTime(Number(box.dataset.limit || 90));
    renderStoredResult(box, state.recordings[key], blob);
    renderProgress();
    updateMeasurementTables();
  }

  async function analyseAudio(blob) {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const buffer = await context.decodeAudioData(await blob.arrayBuffer());
    const samples = buffer.getChannelData(0);
    const frame = Math.max(1, Math.round(buffer.sampleRate * .02));
    const energies = [];
    for (let i = 0; i + frame < samples.length; i += frame) {
      let sum = 0;
      for (let j = i; j < i + frame; j++) sum += samples[j] * samples[j];
      energies.push(Math.sqrt(sum / frame));
    }
    const ordered = [...energies].sort((a, b) => a - b);
    const noise = ordered[Math.floor(ordered.length * .2)] || 0;
    const peak = ordered[Math.floor(ordered.length * .9)] || .01;
    const threshold = noise + (peak - noise) * .22;
    const voiced = energies.map(value => value > threshold);
    let pauses = 0, pauseFrames = 0, speechFrames = 0, runs = [], currentSpeech = 0;
    for (const isVoice of voiced) {
      if (isVoice) { speechFrames++; currentSpeech++; if (pauseFrames >= 13 && currentSpeech === 1) pauses++; pauseFrames = 0; }
      else { if (currentSpeech) { runs.push(currentSpeech * .02); currentSpeech = 0; } pauseFrames++; }
    }
    if (currentSpeech) runs.push(currentSpeech * .02);
    const duration = buffer.duration;
    await context.close();
    return { duration, pausesPerMinute: duration ? pauses / duration * 60 : 0, meanRun: runs.length ? runs.reduce((a, b) => a + b, 0) / runs.length : 0, speechRatio: duration ? speechFrames * .02 / duration : 0 };
  }

  function renderStoredResult(box, metrics, blob) {
    const result = box.querySelector(".recorder__result");
    if (!result) return;
    result.innerHTML = `<div class="audio-proof"><strong>${Math.round(metrics.duration || 0)} s enregistrées</strong><span>${metrics.pausesPerMinute == null ? "mesure acoustique indisponible" : `${metrics.pausesPerMinute.toFixed(1).replace(".", ",")} pauses/min · segments moyens ${metrics.meanRun.toFixed(1).replace(".", ",")} s`}</span></div>`;
    if (blob) {
      const audio = document.createElement("audio"); audio.controls = true; audio.src = URL.createObjectURL(blob);
      const download = document.createElement("a"); download.className = "button button--quiet"; download.textContent = "Télécharger l’audio"; download.download = `${box.dataset.recorder}.webm`; download.href = audio.src;
      result.append(audio, download);
    } else {
      result.insertAdjacentHTML("beforeend", "<small>L’audio n’est pas conservé après rechargement ; seules les mesures le sont.</small>");
    }
  }

  function recorderMarkup(key, limit, label) {
    return `<div class="recorder recorder--inline" data-recorder="${key}" data-limit="${limit}">
      <div><p class="card-kicker">${label}</p><p>Parlez sans lire. Vos notes restent des mots-clés.</p></div>
      <div class="recorder__controls"><button class="button button--record" type="button">Enregistrer</button><span class="recorder__time">${formatTime(limit)}</span></div>
      <div class="recorder__result" aria-live="polite"></div>
    </div>`;
  }

  function renderDynamicSections() {
    document.getElementById("chunkDeck").innerHTML = `
      <p class="step__intro">À ce niveau, la fluidité progresse plus vite avec des blocs prêts à l’emploi qu’avec des listes de mots isolés. Produisez un exemple professionnel pour chaque bloc.</p>
      <div class="chunk-grid">${chunks.map((chunk, index) => `
        <article class="chunk-card" data-chunk-card="${chunk.id}">
          <div class="chunk-card__top"><span>0${index + 1}</span><span>${chunk.function}</span></div>
          <h3>${chunk.form}</h3>
          <p class="model-sentence" data-chunk-example="${chunk.id}">${chunk.examples.direction}</p>
          <label>Votre phrase<textarea data-save="chunk-${chunk.id}" placeholder="Une phrase directement réutilisable cette semaine…"></textarea></label>
          <div class="chunk-card__actions">
            <button class="button button--quiet speak-button" type="button" data-speak="${chunk.examples.direction.replace(/"/g, "&quot;")}">Écouter un modèle</button>
            <label class="mastery"><input type="checkbox" data-chunk="${chunk.id}"> Je peux l’utiliser sans lire</label>
          </div>
        </article>`).join("")}</div>
      <div class="micro-challenge"><strong>Défi de rappel · 45 secondes</strong><p>Masquez l’écran. Dites les cinq débuts de phrase, puis un exemple adapté à votre métier.</p></div>`;

    document.getElementById("pronunciationLab").innerHTML = `
      <p class="step__intro">Cible unique : <strong>allonger la dernière syllabe du groupe rythmique</strong>. L’objectif est la compréhensibilité, pas l’effacement de l’accent.</p>
      <article class="prosody-card">
        <p class="card-kicker">Votre phrase-outil</p>
        <p class="prosody-line">Plus on multiplie les a<strong>LERTES</strong> ↗ <span>|</span> moins on protège l’atten<strong>TION</strong> ↘</p>
        <div class="prosody-legend"><span><i class="dot dot--orange"></i>allonger la fin</span><span><i class="dot dot--green"></i>aucune pause dans le groupe</span></div>
        <button class="button button--quiet speak-button" type="button" data-speak="Plus on multiplie les alertes, moins on protège l’attention.">Écouter à vitesse naturelle</button>
      </article>
      <ol class="shadowing-steps">
        <li><strong>Percevoir</strong><span>Écoutez sans lire et tapez le rythme avec la main.</span></li>
        <li><strong>Murmurer</strong><span>Reproduisez seulement la mélodie et les deux fins longues.</span></li>
        <li><strong>Parler avec le modèle</strong><span>Deux répétitions, sans pause avant « moins ».</span></li>
        <li><strong>Transférer</strong><span>Remplacez « alertes » et « attention » par les mots de votre situation.</span></li>
      </ol>
      ${recorderMarkup("pronunciation", 30, "Votre phrase · 30 s")}
      <fieldset class="pron-check"><legend>Après réécoute</legend>
        <label><input type="checkbox" data-check="pron-endings"> Les deux fins de groupe sont audibles.</label>
        <label><input type="checkbox" data-check="pron-flow"> Je ne coupe pas à l’intérieur d’un groupe.</label>
        <label><input type="checkbox" data-check="pron-melody"> La voix descend clairement à la fin.</label>
      </fieldset>`;

    document.getElementById("fluencyLoop").innerHTML = `
      <p class="step__intro">Répétez le même message en réduisant le temps. Ne cherchez pas de nouvelles idées : rendez la formulation plus disponible et plus nette.</p>
      <article class="task-card"><p class="card-kicker">Votre mission</p><h3 data-role-title>Situation professionnelle</h3><p data-role-context>Choisissez un profil.</p><p class="prompt" data-role-prompt></p></article>
      <label class="notes-label">Vos quatre repères — pas de phrases rédigées<textarea data-save="fluencyNotes" placeholder="position · donnée · réserve · action"></textarea></label>
      <div class="round-stack">
        <article><span class="round-badge">Tour 1 · 3:00</span><h3>Tout dire</h3><p>Installez le raisonnement complet, même avec des hésitations.</p>${recorderMarkup("round1", 180, "Message complet")}</article>
        <article><span class="round-badge">Tour 2 · 2:00</span><h3>Mieux structurer</h3><p>Placez « plus…, moins… » et une réserve. Supprimez un détail secondaire.</p>${recorderMarkup("round2", 120, "Message resserré")}</article>
        <article><span class="round-badge">Tour 3 · 1:00</span><h3>Décider</h3><p>Gardez uniquement position, preuve prudente et recommandation.</p>${recorderMarkup("round3", 60, "Message essentiel")}</article>
      </div>
      <section class="measurement-panel"><div><p class="card-kicker">Trace observable</p><h3>Évolution entre les tours</h3></div><div id="roundComparison"></div></section>`;

    document.getElementById("rolePlay").innerHTML = `
      <p class="step__intro">Votre interlocuteur vous interrompt. Répondez sans abandonner votre structure.</p>
      <article class="objection-card"><p class="card-kicker">Objection métier</p><blockquote data-role-objection>Choisissez un profil.</blockquote></article>
      <div class="response-frame">
        <article><span>Accueillir</span><strong>Je vous rejoins sur…</strong></article>
        <article><span>Nuancer</span><strong>En revanche…</strong></article>
        <article><span>Proposer</span><strong>Il faudrait peut-être…</strong></article>
      </div>
      ${recorderMarkup("roleplay", 120, "Réponse à l’objection · 2 min")}
      <section class="feedback-grid">
        <label><span>À garder</span><textarea data-save="feedbackKeep" placeholder="Une formulation efficace…"></textarea></label>
        <label><span>À réparer</span><textarea data-save="feedbackRepair" placeholder="Une rupture de rythme ou une tournure…"></textarea></label>
        <label><span>À transférer</span><textarea data-save="feedbackTransfer" placeholder="La phrase que je réutiliserai…"></textarea></label>
      </section>`;

    document.getElementById("exitLab").innerHTML = `
      <p class="step__intro">Reprenez exactement la mission initiale, sans notes. La comparaison vaut plus que l’impression générale de « s’être amélioré ».</p>
      <article class="task-card task-card--accent"><p class="card-kicker">Même situation</p><h3 data-role-title>Situation professionnelle</h3><p data-role-context></p><p class="prompt" data-role-prompt></p></article>
      ${recorderMarkup("exit", 90, "Échantillon B · 90 s maximum")}
      <section class="measurement-panel"><div><p class="card-kicker">Avant / après</p><h3>Indicateurs acoustiques</h3></div><div id="exitComparison"></div></section>
      <section class="rubric-card">
        <div><p class="card-kicker">Grille commune</p><h3>Écoutez A puis B</h3><p>0 = absent · 1 = fragile · 2 = partiel · 3 = maîtrisé · 4 = transférable.</p></div>
        <div class="rubric-table" id="rubricTable"></div>
        <p class="rubric-total" id="rubricTotal">Écart global : —</p>
      </section>
      <section class="transfer-card">
        <p class="card-kicker">Retour sur investissement immédiat</p><h3>Votre prochaine occasion réelle</h3>
        <div class="transfer-fields">
          <label>Situation et date<input type="text" data-save="transferWhen" placeholder="Ex. CODIR de jeudi, point sur les délais"></label>
          <label>Phrase exacte<textarea data-save="transferSentence" placeholder="Il faudrait peut-être…"></textarea></label>
        </div>
        <div class="retention-plan">
          <label><input type="checkbox" data-check="retention-j1"> <strong>J+1</strong> · 3 minutes de shadowing</label>
          <label><input type="checkbox" data-check="retention-j7"> <strong>J+7</strong> · 60 secondes sans notes</label>
          <label><input type="checkbox" data-check="retention-j21"> <strong>J+21</strong> · nouvelle situation, mêmes cinq blocs</label>
        </div>
        <button class="button button--primary" id="confirmTransfer" type="button">Valider mon transfert</button>
      </section>
      <details class="trainer-panel"><summary>Espace formateur · conduite des 60 minutes</summary>
        <div class="trainer-timeline">
          <p><strong>0–5</strong><span>Mesure à froid. Aucune correction.</span></p>
          <p><strong>5–18</strong><span>Deux micro-écoutes. Faire verbaliser où l’écoute décroche.</span></p>
          <p><strong>18–35</strong><span>Cinq blocs + une cible prosodique. Rappel avant explication.</span></p>
          <p><strong>35–47</strong><span>Boucle 3/2/1. Un seul apport entre deux tours.</span></p>
          <p><strong>47–55</strong><span>Objection métier. Retour sur deux points maximum.</span></p>
          <p><strong>55–60</strong><span>Mesure finale, comparaison et occasion réelle datée.</span></p>
        </div>
        <div class="feedback-rule"><strong>Ordre du retour :</strong> message → interaction → fluidité → prononciation. Ne corrigez pas pendant la prise de parole ; notez, puis faites reformuler.</div>
      </details>`;

    renderRubric();
    updateRoleDependentContent();
  }

  function initDynamicControls() {
    document.querySelectorAll("[data-chunk]").forEach(check => {
      check.checked = Boolean(state.chunks[check.dataset.chunk]);
      check.closest(".chunk-card").classList.toggle("is-mastered", check.checked);
      check.addEventListener("change", () => {
        state.chunks[check.dataset.chunk] = check.checked;
        check.closest(".chunk-card").classList.toggle("is-mastered", check.checked);
        saveState(); renderProgress();
      });
    });
    document.getElementById("confirmTransfer").addEventListener("click", event => {
      const ready = Boolean((state.values.transferWhen || "").trim() && (state.values.transferSentence || "").trim());
      if (!ready) { event.currentTarget.textContent = "Ajoutez une situation et une phrase"; return; }
      state.transfer = true; saveState(); renderProgress();
      event.currentTarget.textContent = "Transfert planifié ✓";
    });
    if (state.transfer) document.getElementById("confirmTransfer").textContent = "Transfert planifié ✓";
  }

  const rubricItems = [
    ["position", "Position claire"], ["evidence", "Donnée prudente"], ["nuance", "Nuance / réserve"],
    ["action", "Recommandation"], ["prosody", "Groupes rythmiques"], ["interaction", "Réponse à l’objection"]
  ];

  function renderRubric() {
    const table = document.getElementById("rubricTable");
    table.innerHTML = `<div class="rubric-row rubric-head"><span>Critère</span><span>A · début</span><span>B · fin</span></div>${rubricItems.map(([id, label]) => `
      <div class="rubric-row"><span>${label}</span><select data-rubric="before-${id}" aria-label="${label}, début">${[0,1,2,3,4].map(n => `<option value="${n}">${n}</option>`).join("")}</select><select data-rubric="after-${id}" aria-label="${label}, fin">${[0,1,2,3,4].map(n => `<option value="${n}">${n}</option>`).join("")}</select></div>`).join("")}`;
    table.querySelectorAll("select").forEach(select => {
      select.value = state.values[`rubric-${select.dataset.rubric}`] ?? "0";
      select.addEventListener("change", () => { state.values[`rubric-${select.dataset.rubric}`] = select.value; saveState(); updateRubricTotal(); });
    });
    updateRubricTotal();
  }

  function updateRubricTotal() {
    const before = rubricItems.reduce((sum, [id]) => sum + Number(state.values[`rubric-before-${id}`] || 0), 0);
    const after = rubricItems.reduce((sum, [id]) => sum + Number(state.values[`rubric-after-${id}`] || 0), 0);
    const delta = after - before;
    document.getElementById("rubricTotal").textContent = `Début ${before}/24 · Fin ${after}/24 · Écart ${delta > 0 ? "+" : ""}${delta}`;
  }

  function comparisonMarkup(keys) {
    const labels = { baseline: "Début", exit: "Fin", round1: "3 min", round2: "2 min", round3: "1 min" };
    if (!keys.some(key => state.recordings[key])) return "<p class=\"empty-state\">Les indicateurs apparaîtront après vos enregistrements.</p>";
    return `<div class="metric-table"><div class="metric-row metric-head"><span>Indicateur</span>${keys.map(key => `<span>${labels[key]}</span>`).join("")}</div>
      <div class="metric-row"><span>Durée</span>${keys.map(key => `<span>${state.recordings[key] ? `${Math.round(state.recordings[key].duration)} s` : "—"}</span>`).join("")}</div>
      <div class="metric-row"><span>Pauses / min</span>${keys.map(key => `<span>${state.recordings[key]?.pausesPerMinute == null ? "—" : state.recordings[key].pausesPerMinute.toFixed(1).replace(".", ",")}</span>`).join("")}</div>
      <div class="metric-row"><span>Segment continu moyen</span>${keys.map(key => `<span>${state.recordings[key]?.meanRun == null ? "—" : `${state.recordings[key].meanRun.toFixed(1).replace(".", ",")} s`}</span>`).join("")}</div></div>
      <p class="measurement-note">Indicateurs acoustiques locaux : utilisez-les comme tendance, pas comme note de langue.</p>`;
  }

  function updateMeasurementTables() {
    const rounds = document.getElementById("roundComparison");
    const exit = document.getElementById("exitComparison");
    if (rounds) rounds.innerHTML = comparisonMarkup(["round1", "round2", "round3"]);
    if (exit) exit.innerHTML = comparisonMarkup(["baseline", "exit"]);
  }

  function buildExport() {
    const role = state.role ? roles[state.role].label : "non choisi";
    const lines = [
      "SPRINT ORAL B2 · ACCÉLÉRATION", `Date : ${new Date().toLocaleString("fr-FR")}`, `Profil : ${role}`, "",
      "PREUVE DE PROGRESSION"
    ];
    ["baseline", "exit", "round1", "round2", "round3", "roleplay"].forEach(key => {
      const item = state.recordings[key];
      if (item) lines.push(`${key} : ${Math.round(item.duration)} s · ${item.pausesPerMinute == null ? "pauses non mesurées" : `${item.pausesPerMinute.toFixed(1)} pauses/min`} · segment ${item.meanRun == null ? "—" : `${item.meanRun.toFixed(1)} s`}`);
    });
    lines.push("", "BLOCS ACTIFS");
    chunks.forEach(chunk => lines.push(`${state.chunks[chunk.id] ? "[x]" : "[ ]"} ${chunk.form}${state.values[`chunk-${chunk.id}`] ? ` — ${state.values[`chunk-${chunk.id}`]}` : ""}`));
    const before = rubricItems.reduce((sum, [id]) => sum + Number(state.values[`rubric-before-${id}`] || 0), 0);
    const after = rubricItems.reduce((sum, [id]) => sum + Number(state.values[`rubric-after-${id}`] || 0), 0);
    lines.push("", "GRILLE", `Début : ${before}/24 · Fin : ${after}/24 · Écart : ${after - before}`);
    lines.push("", "TRANSFERT", `Situation : ${state.values.transferWhen || "—"}`, `Phrase : ${state.values.transferSentence || "—"}`, `Plan validé : ${state.transfer ? "oui" : "non"}`);
    lines.push("", "RETOUR", `À garder : ${state.values.feedbackKeep || "—"}`, `À réparer : ${state.values.feedbackRepair || "—"}`, `À transférer : ${state.values.feedbackTransfer || "—"}`);
    return lines.join("\n");
  }

  function initExport() {
    const dialog = document.getElementById("exportDialog");
    const text = document.getElementById("exportText");
    document.getElementById("exportButton").addEventListener("click", () => { text.value = buildExport(); dialog.showModal(); });
    document.getElementById("copyExport").addEventListener("click", async event => {
      try { await navigator.clipboard.writeText(text.value); event.currentTarget.textContent = "Copié ✓"; }
      catch (_) { text.select(); event.currentTarget.textContent = "Sélectionné · Ctrl/Cmd+C"; }
    });
    document.getElementById("downloadExport").addEventListener("click", () => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(new Blob([text.value], { type: "text/plain;charset=utf-8" }));
      link.download = "bilan-sprint-oral-b2.txt"; link.click(); URL.revokeObjectURL(link.href);
    });
  }

  function init() {
    renderDynamicSections(); renderNav(); renderProgress(); hydrateInputs(); initClips(); initSpeech(); initDynamicControls(); initRecorders(); initExport(); updateMeasurementTables();
    document.querySelectorAll("[data-role]").forEach(button => button.addEventListener("click", () => selectRole(button.dataset.role)));
    if (state.role) selectRole(state.role);
    document.getElementById("startButton").addEventListener("click", () => goToStep(0));
    document.getElementById("prevStep").addEventListener("click", () => goToStep(state.step - 1));
    document.getElementById("nextStep").addEventListener("click", () => {
      state.completed[state.step] = true; saveState();
      if (state.step < 7) goToStep(state.step + 1); else renderProgress();
    });
    document.querySelectorAll(".reveal-button").forEach(button => button.addEventListener("click", () => {
      document.getElementById(button.dataset.reveal).hidden = false; button.hidden = true;
    }));
    goToStep(state.step);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
