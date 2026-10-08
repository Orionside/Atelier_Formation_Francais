const fs=require('fs'),path=require('path'),assert=require('assert');
const {JSDOM,VirtualConsole}=require('/Users/toufik/impact60_mesure/tests/node_modules/jsdom');
const root=path.resolve(__dirname,'..');
const raw=fs.readFileSync(path.join(root,'index.html'),'utf8');
const html=raw.replace(/<script src="([^"?]+)(?:\?[^\"]*)?"><\/script>/g,(_,f)=>'<script>'+(fs.existsSync(path.join(root,f))?fs.readFileSync(path.join(root,f),'utf8'):'')+'</script>');
const entries={},observed=new Set(),errors=[];
for(let session=1;session<=3;session++){
 const vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!/Not implemented|Could not load/.test(e.message))errors.push(e.message);});
 const dom=new JSDOM(html,{url:'https://orionside.github.io/Atelier_Formation_Francais/Atelier_GLP1_Oral_B2_v2/?seance='+session,runScripts:'dangerously',virtualConsole:vc,pretendToBeVisual:true,beforeParse(w){w.scrollTo=()=>{};w.HTMLMediaElement.prototype.pause=()=>{};w.HTMLMediaElement.prototype.load=()=>{};}});
 const w=dom.window,d=w.document;const find=t=>[...d.querySelectorAll('button')].find(b=>b.textContent.trim()===t);
 function collect(){d.querySelectorAll('[data-audio-id]').forEach(b=>observed.add(b.dataset.audioId));Object.assign(entries,w.GLP_AUDIO_ENTRIES);}
 for(let i=0;i<9;i++){
  d.querySelectorAll('.rl')[i].click();collect();
  if(i===2||i===6){for(const q of d.querySelectorAll('.mcq'))q.querySelector('.opt').click();for(const b of d.querySelectorAll('.gaps>button'))b.click();}
  if(i===3){find('Vérifier sans regarder').click();for(const b of [...d.querySelectorAll('.pc>button')])b.click();}
  if(i===4)for(const b of [...d.querySelectorAll('.groupe-exemple>button.btn')])b.click();
  if(i===5)for(let j=0;j<4;j++){w.Math.random=()=>j/4;find(w.IMPACT60.entrainement.boutonObjection).click();collect();}
  collect();
 }
 assert.equal(errors.length,0,errors.join('\n'));dom.window.close();
}
function petit(n){const s=['zéro','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze','treize','quatorze','quinze','seize'];if(n<17)return s[n];if(n<20)return 'dix-'+s[n-10];if(n<70){let a=Math.floor(n/10),b=n%10;return ['','','vingt','trente','quarante','cinquante','soixante'][a]+(b===1?' et un':b?'-'+petit(b):'');}if(n<80)return 'soixante-'+petit(n-60);if(n<100)return 'quatre-vingt'+(n>80?'-'+petit(n-80):'s');if(n<1000){let a=Math.floor(n/100),b=n%100;return(a>1?petit(a)+' ':'')+'cent'+(b?' '+petit(b):'');}return String(n);}
const list=Object.values(entries).filter(e=>observed.has(e.id));
for(const e of list){e.tts_text=e.display_text.replace(/\bGLP[ -]?1\b/gi,'G L P un').replace(/B1\+/g,'B un plus').replace(/B2/g,'B deux').replace(/Qwen3-TTS Base|Qwen3-TTS|Qwen/g,'le moteur de synthèse').replace(/\b(\d+) min\s*(\d+)\b/g,(_,a,b)=>(+a===1?'une minute':petit(+a)+' minutes')+' '+petit(+b)+' secondes').replace(/\b(\d+) min\b/g,(_,a)=>(+a===1?'une minute':petit(+a)+' minutes')).replace(/\b(\d+) s\b/g,(_,a)=>petit(+a)+' secondes').replace(/\b1 minute\b/g,'une minute').replace(/\b\d{1,3}\b/g,n=>petit(+n)).replace(/[|↗↘…]/g,',').replace(/\s*·\s*/g,'. ').replace(/:\s*=/g,':').replace(/\s+/g,' ').trim();}
for(const e of list){if(e.id==='texte-8869817b')e.tts_text='La priorité est de demander une précision.';if(e.id==='texte-1fe08ad')e.tts_text='Le premier essai dure une minute et quinze secondes.';}
fs.writeFileSync(path.join(root,'audio/catalogue.json'),JSON.stringify({entries:list},null,2)+'\n');fs.writeFileSync(path.join(root,'audio/catalogue.js'),'window.GLP_AUDIO_CATALOGUE = '+JSON.stringify(Object.fromEntries(list.map(e=>[e.id,e])))+';\n');console.log(list.length+' lectures distinctes ; trois séances et tous les états collectés.');
