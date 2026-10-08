const fs=require('fs'),path=require('path'),assert=require('assert');
const {JSDOM,VirtualConsole}=require('/Users/toufik/impact60_mesure/tests/node_modules/jsdom');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8').replace(/<script src="([^"?]+)(?:\?[^\"]*)?"><\/script>/g,(_,file)=>'<script>'+fs.readFileSync(path.join(root,file),'utf8')+'</script>');
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!/Not implemented|Could not load/.test(e.message))errors.push(e.message);});
const dom=new JSDOM(html,{url:'file://'+root+'/index.html',runScripts:'dangerously',virtualConsole:vc,pretendToBeVisual:true,beforeParse(w){w.scrollTo=()=>{};w.HTMLMediaElement.prototype.pause=()=>{};w.HTMLMediaElement.prototype.load=()=>{};}});
const w=dom.window,d=w.document,catalogue=w.BYD_AUDIO_CATALOGUE;
const norm=s=>s.replace(/\s+/g,' ').trim();
const observed=new Set();
function button(t){return [...d.querySelectorAll('button')].find(x=>x.textContent.trim()===t);}
function collect(){for(const b of d.querySelectorAll('.audio-circle')){assert(b.querySelector('svg'),'icône SVG');assert(b.getAttribute('aria-label').startsWith('Écouter :'),'libellé accessible');assert(catalogue[b.dataset.audioId],b.dataset.audioId+' hors catalogue');observed.add(b.dataset.audioId);}}
for(let i=0;i<9;i++){
  d.querySelectorAll('.rl')[i].click();collect();
  if(i===2){
    assert.equal(d.querySelectorAll('.mcq').length,4);
    const gaps=[...d.querySelectorAll('.gap-row')];assert.equal(gaps.length,4);
    for(const [j,g] of gaps.entries()){
      const id=g.querySelector('.audio-circle').dataset.audioId;const t=w.IMPACT60.ecoute[Math.floor(j/2)].trous[j%2];
      assert(norm(catalogue[id].tts_text).includes(t.solution),'le mot manquant est lu avant vérification');
      assert(g.querySelector('.gap-sol').closest('[hidden]'),'solution écrite masquée');
    }
    for(const q of d.querySelectorAll('.mcq'))q.querySelector('.opt').click();
    for(const b of d.querySelectorAll('.gaps>button'))b.click();collect();
    assert.equal(d.querySelectorAll('.gap-row .gap-sol').length,4);
  }
  if(i===3){button('Vérifier sans regarder').click();collect();assert.equal(d.querySelectorAll('.pc-hidden[hidden]').length,6);button('Voir la phrase').click();assert.equal(d.querySelectorAll('.pc-hidden[hidden]').length,5);}
  if(i===4){assert.equal(d.querySelectorAll('.groupe-exemple').length,3);d.querySelector('.groupe-exemple>button.btn').click();assert(!d.querySelector('.groupe-segmente').hidden);}
  if(i===5){for(let j=0;j<4;j++){w.Math.random=()=>j/4;button(w.IMPACT60.entrainement.boutonObjection).click();collect();}}
}
assert.equal(errors.length,0,errors.join('\n'));
assert(!html.includes('youtube.com/iframe_api'),'lecture vidéo native');
assert(html.includes('video/byd.mp4'),'vidéo locale');
console.log('Neuf écrans et états interactifs sans erreur ; '+observed.size+' lectures accessibles.');
console.log('QCM, mots manquants lus, solutions écrites masquées, rappel, groupes, objections et boutons SVG : OK.');
if(process.argv.includes('--complet')){
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'audio/qwen3-tts/manifest.json'),'utf8')).clips;
  for(const [id,e] of Object.entries(catalogue)){
    assert(manifest[id],id+' absent du manifeste');
    assert.equal(manifest[id].display_text,e.display_text,id+' texte affiché');
    assert.equal(manifest[id].tts_text,e.tts_text,id+' texte lu');
    assert(fs.existsSync(path.join(root,e.file)),id+' fichier absent');
  }
  assert.equal(Object.keys(manifest).length,Object.keys(catalogue).length);
  console.log('Catalogue complet : chaque bouton possède son fichier et ses textes exacts.');
}
const missing=Object.keys(catalogue).filter(x=>!observed.has(x));if(missing.length)console.log('Non observés : '+missing.join(', '));
dom.window.close();
