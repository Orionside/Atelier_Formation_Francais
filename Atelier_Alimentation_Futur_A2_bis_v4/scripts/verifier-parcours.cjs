/* Vérification hors navigateur : parcours, corrections masquées et couverture des lectures. */
const {JSDOM,VirtualConsole}=require('/Users/toufik/impact60_mesure/tests/node_modules/jsdom');
const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const src=fs.readFileSync(path.join(root,'index.html'),'utf8').replace(/<script src="(contenu\.js|audio\/catalogue\.js)(?:\?[^\"]*)?"><\/script>/g,(_,file)=>'<script>'+fs.readFileSync(path.join(root,file),'utf8')+'</script>');
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!/Not implemented|Could not load/.test(e.message))errors.push(e.message);});
const manifest=JSON.parse(fs.readFileSync(path.join(root,'audio/qwen3-tts/manifest.json'),'utf8'));
const dom=new JSDOM(src,{url:'https://orionside.github.io/Atelier_Formation_Francais/Atelier_Alimentation_Futur_A2_bis_v4/',runScripts:'dangerously',virtualConsole:vc,pretendToBeVisual:true,beforeParse(w){
 w.fetch=()=>Promise.resolve({ok:true,json:()=>Promise.resolve(manifest)});
 w.scrollTo=()=>{};w.HTMLMediaElement.prototype.pause=()=>{};w.HTMLMediaElement.prototype.load=()=>{};
 w.localStorage.setItem('impact60-alimentation-futur-a2-bis-v4',JSON.stringify({m:{t1:{pausesMin:5,segment:2,melodie:10},t2:{pausesMin:7,segment:1,melodie:7},essai1:{pausesMin:5,segment:2,melodie:10}}}));
}});
const w=dom.window,d=w.document;
const rail=()=>[...d.querySelectorAll('.rl')];const norm=s=>s.replace(/[«»↗↘…\[\]]/g,'').replace(/\s+/g,' ').replace(/\s*([.,!?;:])\s*/g,'$1 ').trim();
assert.equal(rail().length,9,'accueil, sept étapes, formateur');
const linked=new Set(),catalogue=w.impactAudioCatalogue(w.IMPACT60);
(async function(){
for(let i=0;i<9;i++){
 rail()[i].click();
 await new Promise(resolve=>setTimeout(resolve,0));
 for(const b of d.querySelectorAll('[data-audio-id]')){
  assert(catalogue[b.dataset.audioId],'identifiant audio connu');linked.add(b.dataset.audioId);
  const owner=b.parentElement.firstElementChild;
  if(owner.textContent.trim() && owner!==b && !owner.querySelector('[data-audio-id]') && b.parentElement.classList.contains('audio-line'))assert.equal(norm(owner.textContent),norm(catalogue[b.dataset.audioId].display_text),'écrit et lecture : '+b.dataset.audioId);
 }
 if(i===2){
  assert.equal(d.querySelectorAll('.mcq').length,4,'quatre questions de compréhension');
  for(const c of d.querySelectorAll('.mcq')){
   const correction=c.querySelector('[data-audio-id$="-explication"]');assert(correction.closest('[hidden]'),'correction masquée avant réponse');
  }
 }
 if(i===3){
  assert.equal(d.querySelectorAll('.pc').length,6,'six cartes');
  const bridge=[...d.querySelectorAll('details')].find(e=>e.textContent.includes(w.IMPACT60.manuel.titre));
  assert(bridge && !bridge.open && bridge.firstElementChild.tagName==='SUMMARY','activités du manuel repliées');
  const recall=[...d.querySelectorAll('button')].find(b=>b.textContent==='Vérifier sans regarder');recall.click();
  for(const b of d.querySelectorAll('[data-audio-id]'))linked.add(b.dataset.audioId);
  assert.equal(d.querySelectorAll('.pc-hidden[hidden]').length,6,'rappel sans dévoiler les phrases');
  [...d.querySelectorAll('button')].find(b=>b.textContent==='Voir la phrase').click();assert.equal(d.querySelectorAll('.pc-hidden[hidden]').length,5,'dévoilement individuel');
 }
 if(i===5){
  const question=[...d.querySelectorAll('button')].find(b=>b.textContent===w.IMPACT60.entrainement.boutonObjection);
  for(let j=0;j<4;j++){w.Math.random=()=>j/4;question.click();for(const b of d.querySelectorAll('[data-audio-id]'))linked.add(b.dataset.audioId);}
  assert(!d.querySelector('.objection').hidden,'question du collègue révélée au clic');
 }
}
rail()[6].click();
assert(!/mieux/.test(d.querySelector('main').textContent),'mesures sans jugement automatique');
assert.equal(errors.length,0,errors.join('\n'));
console.log('Parcours : neuf écrans, quatre questions, six cartes, rappel, compléments repliés, masquage, mesures neutres : conformes.');
console.log(linked.size+' lectures reliées à leurs textes dans le parcours.');
console.log('Lectures non observées : '+Object.keys(catalogue).filter(id=>!linked.has(id)).join(', '));
if(Object.keys(manifest.clips).length===Object.keys(catalogue).length)assert.equal(linked.size,Object.keys(catalogue).length,'toutes les lectures sont accessibles');
dom.window.close();
})().catch(e=>{console.error(e);dom.window.close();process.exitCode=1;});
