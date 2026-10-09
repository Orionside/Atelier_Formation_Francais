const fs=require('fs'),path=require('path'),assert=require('assert'),crypto=require('crypto');
const {JSDOM,VirtualConsole}=require('/Users/toufik/impact60_mesure/tests/node_modules/jsdom');
const root=path.resolve(__dirname,'..');const raw=fs.readFileSync(path.join(root,'index.html'),'utf8');
const html=raw.replace(/<script src="([^"?]+)(?:\?[^\"]*)?"><\/script>/g,(_,f)=>'<script>'+fs.readFileSync(path.join(root,f),'utf8')+'</script>');
const observed=new Set();
for(let session=1;session<=3;session++){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!/Not implemented|Could not load/.test(e.message))errors.push(e.message);});
 const dom=new JSDOM(html,{url:'https://example.test/?seance='+session,runScripts:'dangerously',virtualConsole:vc,pretendToBeVisual:true,beforeParse(w){w.scrollTo=()=>{};w.HTMLMediaElement.prototype.pause=()=>{};w.HTMLMediaElement.prototype.load=()=>{};}});
 const w=dom.window,d=w.document,c=w.IMPACT60;assert(c.meta.id.endsWith('s'+session));
 const find=t=>[...d.querySelectorAll('button')].find(b=>b.textContent.trim()===t);
 function collect(){for(const b of d.querySelectorAll('.audio-circle')){assert(b.querySelector('svg'));assert(b.getAttribute('aria-label').startsWith('Écouter :'));assert(w.GLP_AUDIO_CATALOGUE[b.dataset.audioId]);observed.add(b.dataset.audioId);}}
 for(let i=0;i<9;i++){
  d.querySelectorAll('.rl')[i].click();collect();
  if(i===0){assert.equal(d.querySelectorAll('.session-nav a').length,3);assert.equal(d.querySelector('.session-nav a[aria-current]').href,'https://example.test/?seance='+session);}
  if(i===2){assert.equal(d.querySelectorAll('.mcq').length,6);assert.equal(d.querySelectorAll('.gap-row').length,3);
   for(const q of d.querySelectorAll('.mcq')){assert(q.querySelector('.opts').hidden,'choix masqués avant tentative orale');q.querySelector('.oral-reveal').click();assert(!q.querySelector('.opts').hidden);q.querySelector('.opt').click();assert(!q.querySelector('.expl').hidden);}
   for(const [j,g] of [...d.querySelectorAll('.gap-row')].entries()){const id=g.querySelector('.audio-circle').dataset.audioId;assert(w.GLP_AUDIO_CATALOGUE[id].tts_text.toLowerCase().includes(c.ecoute[j].trous[0].solution.toLowerCase()),'mot attendu lu');assert(g.querySelector('.gap-sol').closest('[hidden]'),'solution écrite masquée');}
   for(const b of d.querySelectorAll('.gaps>button'))b.click();collect();}
  if(i===3){for(let k=0;k<6;k++){const t=d.querySelectorAll('.pc .pc-more')[k];if(t&&t.getAttribute('aria-expanded')==='false')t.click();collect();}assert.equal(d.querySelectorAll('.pc').length,6);find('Vérifier sans regarder').click();collect();assert.equal(d.querySelectorAll('.pc-hidden[hidden]').length,6);find('Voir la phrase').click();assert.equal(d.querySelectorAll('.pc-hidden[hidden]').length,5);}
  if(i===4){assert.equal(d.querySelectorAll('.groupe-exemple').length,2);assert([...d.querySelectorAll('.groupe-texte')].every(x=>x.hidden),'texte des groupes masqué avant écoute');d.querySelector('.groupe-exemple>button.btn').click();assert(!d.querySelector('.groupe-segmente').hidden);}
  if(i===5){assert.equal(d.querySelectorAll('.dialogue-turn').length,3);assert([...d.querySelectorAll('.dialogue-turn details')].every(x=>!x.open));for(let j=0;j<4;j++){w.Math.random=()=>j/4;find(c.entrainement.boutonObjection).click();collect();}}
  if(i===6){assert(d.querySelector('details').textContent.replace(/\s+/g,' ').includes(c.transfert.audio.replace(/\s+/g,' ')));assert(!d.querySelector('details').open);assert(d.querySelector('#i-transfert-premiere'));assert(d.querySelector('#i-transfert-deuxieme'));for(const q of d.querySelectorAll('.mcq'))q.querySelector('.opt').click();collect();}
 }
 assert.equal(errors.length,0,errors.join('\n'));dom.window.close();
}
const catalogue=JSON.parse(fs.readFileSync(path.join(root,'audio/catalogue.json'),'utf8')).entries;
assert.equal(observed.size,catalogue.length);assert(!raw.includes('youtube.com/iframe_api'));assert(raw.includes('video/glp1.mp4'));assert(raw.includes('fp-video audio-only'));
if(process.argv.includes('--complet')){const m=JSON.parse(fs.readFileSync(path.join(root,'audio/qwen3-tts/manifest.json'),'utf8')).clips;assert.equal(Object.keys(m).length,catalogue.length);for(const e of catalogue){assert(m[e.id]);assert.equal(m[e.id].display_text,e.display_text);assert.equal(m[e.id].tts_text,e.tts_text);assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,e.file))).digest('hex'),m[e.id].sha256);}}
console.log('Trois séances, 27 écrans et états interactifs : OK. '+observed.size+' lectures couvertes.');console.log('Questions après réponse orale, neuf trous complets, rappel, groupes masqués, neuf échanges, transferts et sauvegardes séparées : OK.');
