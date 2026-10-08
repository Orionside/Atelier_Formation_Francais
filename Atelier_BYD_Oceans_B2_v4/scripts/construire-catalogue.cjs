const fs=require('fs'),path=require('path'),assert=require('assert');
const {JSDOM,VirtualConsole}=require('/Users/toufik/impact60_mesure/tests/node_modules/jsdom');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8').replace(/<script src="([^"?]+)(?:\?[^\"]*)?"><\/script>/g,(_,file)=>'<script>'+ (fs.existsSync(path.join(root,file))?fs.readFileSync(path.join(root,file),'utf8'):'')+'</script>');
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!/Not implemented|Could not load/.test(e.message))errors.push(e.message);});
const dom=new JSDOM(html,{url:'https://orionside.github.io/Atelier_Formation_Francais/Atelier_BYD_Oceans_B2_v4/',runScripts:'dangerously',virtualConsole:vc,pretendToBeVisual:true,beforeParse(w){w.scrollTo=()=>{};w.HTMLMediaElement.prototype.pause=()=>{};w.HTMLMediaElement.prototype.load=()=>{};}});
const w=dom.window,d=w.document;
function clickText(t){const b=[...d.querySelectorAll('button')].find(x=>x.textContent.trim()===t);if(b)b.click();return b;}
const used=new Set();function collect(){for(const b of d.querySelectorAll('[data-audio-id]'))used.add(b.dataset.audioId);}
for(let i=0;i<9;i++){
  d.querySelectorAll('.rl')[i].click();
  collect();
  if(i===2){for(const q of d.querySelectorAll('.mcq'))q.querySelector('.opt').click();for(const b of [...d.querySelectorAll('.gaps>button')])b.click();}
  if(i===3){clickText('Vérifier sans regarder');for(const b of [...d.querySelectorAll('.pc>button')])b.click();}
  if(i===4){for(const b of [...d.querySelectorAll('.groupe-exemple>button.btn')])b.click();}
  if(i===5){for(let j=0;j<4;j++){w.Math.random=()=>j/4;clickText(w.IMPACT60.entrainement.boutonObjection);collect();}}
  collect();
}
assert.equal(errors.length,0,errors.join('\n'));
const entries=Object.values(w.BYD_AUDIO_ENTRIES).filter(e=>used.has(e.id));
for(const e of entries){e.tts_text=e.tts_text.replace(/\b115\s*000\b/g,'cent quinze mille').replace(/\b12\s*500\b/g,'douze mille cinq cents').replace(/\b1\s*million\b/g,'un million').replace(/\b2024\b/g,'deux mille vingt-quatre').replace(/\b2021\b/g,'deux mille vingt et un').replace(/\b2026\b/g,'deux mille vingt-six').replace(/\b100\s*ans\b/g,'cent ans').replace(/\b25\s*ans\b/g,'vingt-cinq ans').replace(/\b40\s*%/g,'quarante pour cent').replace(/\b1\s*minute\b/g,'une minute').replace(/\b3\s*fois\b/g,'trois fois').replace(/\b6\s*expressions\b/g,'six expressions').replace(/\bB2\b/g,'B deux').replace(/\bBYD\b/g,'B Y D').replace(/\bCECRL\b/g,'cadre européen').replace(/\|/g,',').replace(/:\s*=/g,':').replace(/[…↗↘]/g,'').replace(/\s+/g,' ').trim();}
for(const e of entries){e.tts_text=e.tts_text.replace(/\b0:20\b/g,'vingt secondes').replace(/\b1:30\b/g,'une minute trente secondes').replace(/\b1:15\b/g,'une minute quinze secondes').replace(/\b1 min 30\b/g,'une minute trente secondes').replace(/\b1 min 15\b/g,'une minute quinze secondes').replace(/\b1 min\b/g,'une minute').replace(/\b25\s*000\b/g,'vingt-cinq mille').replace(/\b2008\b/g,'deux mille huit').replace(/\b90 secondes\b/g,'quatre-vingt-dix secondes').replace(/\b45 minutes\b/g,'quarante-cinq minutes').replace(/\b10 minutes\b/g,'dix minutes').replace(/\b6 phrases\b/g,'six phrases').replace(/\b3 essais\b/g,'trois essais').replace(/\b1\b/g,'un').replace(/\b2\b/g,'deux').replace(/\b3\b/g,'trois').replace(/\b4\b/g,'quatre').replace(/\s*·\s*/g,'. ');}
fs.mkdirSync(path.join(root,'audio'),{recursive:true});
const petits=['zéro','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze','treize','quatorze','quinze','seize','dix-sept','dix-huit','dix-neuf'];
function nombre(n){if(n<20)return petits[n];let base=['','','vingt','trente','quarante','cinquante','soixante'][Math.floor(n/10)];return base+(n%10?(n%10===1?' et un':'-'+petits[n%10]):'');}
for(const e of entries)e.tts_text=e.tts_text.replace(/\b(\d+) min\s*(\d+)\b/g,(_,m,s)=>nombre(+m)+' minute'+(+m>1?'s':'')+' '+nombre(+s)+' secondes').replace(/\bp([245])\b/g,(_,n)=>'carte '+nombre(+n)).replace(/\bv3\b/g,'version trois').replace(/trois min 07/g,'trois minutes sept secondes').replace(/trois min 39/g,'trois minutes trente-neuf secondes');
fs.writeFileSync(path.join(root,'audio/catalogue.json'),JSON.stringify({entries},null,2)+'\n');
fs.writeFileSync(path.join(root,'audio/catalogue.js'),'window.BYD_AUDIO_CATALOGUE = '+JSON.stringify(Object.fromEntries(entries.map(e=>[e.id,e])))+';\n');
console.log(entries.length+' lectures collectées sur les neuf écrans, corrections et quatre objections.');
dom.window.close();
