/* Atelier statique. Aucun service externe, aucune reconnaissance ni note de prononciation. */
(() => {
'use strict';
const D=window.BON_SEJOUR,A=window.ATELIER_AUDIO,main=document.querySelector('main');
const key='bon-sejour-a1-v1',labels=['Je recommence','Avec une aide','Sans aide'];
let state={step:0,index:{},ratings:{},choices:{},voice:'f',theme:'light',scenario:0,role:'client',turn:0};
try{const s=JSON.parse(localStorage.getItem(key));if(s&&typeof s==='object'){
 if(Number.isInteger(s.step)&&s.step>=0&&s.step<D.steps.length)state.step=s.step;
 for(const k of ['index','ratings','choices'])if(s[k]&&typeof s[k]==='object'&&!Array.isArray(s[k]))state[k]=s[k];
 if(['f','m'].includes(s.voice))state.voice=s.voice;if(['light','dark'].includes(s.theme))state.theme=s.theme;
}}catch{}
let storageOK=true,view=0,audio=null,cancelAudio=null,recorder=null,stream=null,timer=null,recording=false,recordPending=false,clips=[],recordURL=null;
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
const button=(text,fn,cls='')=>{const b=el('button',cls,text);b.type='button';b.onclick=fn;return b;};
const announce=t=>{document.querySelector('#announcer').textContent=t;};
function save(){try{localStorage.setItem(key,JSON.stringify(state));}catch{storageOK=false;announce('Le navigateur ne garde pas la progression. Téléchargez votre bilan avant de fermer.');}}
function stopSound(except=null){document.querySelectorAll('audio').forEach(a=>{if(a!==except)a.pause();});if(audio){audio.pause();audio.onended=null;audio.onerror=null;audio.remove();audio=null;}if(cancelAudio){cancelAudio(false);cancelAudio=null;}}
function stopRecord(){clearTimeout(timer);if(recorder&&recorder.state==='recording')recorder.stop();if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}recording=false;}
function stopAll(){stopSound();stopRecord();}
document.querySelector('#stop').onclick=()=>{stopAll();announce('Son arrêté.');};
document.documentElement.dataset.theme=state.theme;
document.querySelector('#theme').onclick=()=>{state.theme=state.theme==='light'?'dark':'light';document.documentElement.dataset.theme=state.theme;save();};
function go(step){view++;stopAll();if(recordURL){URL.revokeObjectURL(recordURL);recordURL=null;}state.step=step;save();render();main.focus();window.scrollTo({top:0,behavior:'auto'});}
function nav(){const n=document.querySelector('#nav');n.replaceChildren();let done=0;
 D.steps.forEach(([id,title],i)=>{const practiced=Object.keys(state.ratings).some(k=>k.startsWith(id+'/'));if(i&&practiced)done++;
 const b=button('',()=>go(i),(i===state.step?'active ':'')+(practiced?'done':''));b.append(el('span','num',practiced?'✓':String(i)),el('span','',title));if(i===state.step)b.setAttribute('aria-current','step');n.append(b);});
 document.querySelector('#progress-label').textContent=`${done} étape${done>1?'s':''} essayée${done>1?'s':''} sur 8`;
 document.querySelector('#progress').value=done;document.querySelector('#progress').setAttribute('aria-label',`${done} étapes essayées sur huit`);
}
function heading(title,intro){main.append(el('p','eyebrow',`BON SÉJOUR ! · ${state.step?'ÉTAPE '+state.step+' / 8':'MON ATELIER ORAL'}`),el('h2','',title),el('p','intro',intro));}
function pending(){if(!A.ready){const p=el('p','pending','Version de préparation : les deux voix demandées restent à identifier. Les écoutes seront disponibles après leur intégration. Vous pouvez déjà pratiquer à voix haute et vous enregistrer.');main.append(p);}}
function sound(items,label='▶ Écouter',rate=1){const b=button(label,async()=>{
 stopSound();stopRecord();const token=view;
 for(const item of items){if(token!==view)break;const c=A.clips[item.id+'-'+(item.voice||state.voice)];if(!c){status('Cet audio n’est pas encore disponible.');return;}
 const ok=await new Promise(resolve=>{cancelAudio=resolve;const player=el('audio');player.id='modele-audio';player.hidden=true;player.src=c.file;document.body.append(player);audio=player;player.playbackRate=rate;player.preservesPitch=true;
 player.onended=()=>{if(audio===player)audio=null;player.remove();if(cancelAudio===resolve)cancelAudio=null;resolve(true);};player.onerror=()=>{if(audio===player)audio=null;player.remove();if(cancelAudio===resolve)cancelAudio=null;status('Ce son ne se charge pas. Réessayez.');resolve(false);};
 player.play().then(()=>{if(token===view)status('Écoutez, puis parlez.');}).catch(()=>{player.remove();if(audio===player)audio=null;if(cancelAudio===resolve)cancelAudio=null;if(token===view)status('Le son ne démarre pas. Touchez à nouveau Écouter.');resolve(false);});});if(!ok||token!==view)break;
 }
 });b.disabled=!A.ready||items.some(i=>!A.clips[i.id+'-'+(i.voice||state.voice)]);return b;}
function status(t){const s=main.querySelector('.sound-status');if(s)s.textContent=t;announce(t);}
function audioTools(parent,items){const bar=el('div','toolbar');bar.append(sound(items),sound(items,'▶ Un peu plus lent',.9));parent.append(bar);const stat=el('p','sound-status');stat.setAttribute('role','status');parent.append(stat);}
function chooseVoice(parent){const row=el('div','row'),l=el('label','muted','Voix du modèle '),select=el('select');select.setAttribute('aria-label','Voix du modèle');
 for(const [v,t]of [['f','Féminine'],['m','Masculine']]){const o=el('option','',t);o.value=v;select.append(o);}select.value=state.voice;
 select.onchange=()=>{view++;stopAll();state.voice=select.value;save();render();};l.append(select);row.append(l);parent.append(row);}
const shapes={
bed:'<path d="M15 65h90v25M15 85v15M105 85v15M22 65V42h35v23M57 45h40l8 20M25 50h20"/>',
pool:'<path d="M12 70q10-10 20 0t20 0t20 0t20 0t20 0M12 90q10-10 20 0t20 0t20 0t20 0t20 0M38 70V24q0-14 14-14M66 70V24q0-14 14-14M38 34h28M38 51h28"/>',
phone:'<rect x="40" y="10" width="45" height="85" rx="7"/><path d="M49 21h27M59 84h7"/>',
plug:'<path d="M42 45V28h32v17M48 28V12M68 28V12M42 45q0 20 17 20v12q0 20 25 20M20 68h18"/>',
glasses:'<circle cx="32" cy="56" r="21"/><circle cx="89" cy="56" r="21"/><path d="M53 54q7-8 15 0M11 53 5 33M110 53l5-20"/>',
key:'<circle cx="37" cy="35" r="23"/><circle cx="37" cy="35" r="7"/><path d="M53 51l43 43M74 73l13-13M85 84l13-13"/>',
wallet:'<rect x="15" y="28" width="88" height="59" rx="8"/><path d="M20 28V20h71v8M76 49h32v20H76Z"/><circle cx="88" cy="59" r="2"/>',
purse:'<path d="M37 22 20 75q-4 20 15 20h53q20 0 15-20L86 22ZM38 23l24-14 23 14"/><circle cx="61" cy="8" r="3"/>',
credit:'<rect x="12" y="25" width="100" height="62" rx="8"/><path d="M12 42h100M26 61h20M27 75h25M71 75h20"/>',
passport:'<rect x="30" y="10" width="65" height="85" rx="5"/><circle cx="62" cy="50" r="19"/><path d="M44 50h36M62 31q-15 19 0 38q15-19 0-38M46 80h30"/>',
bottle:'<path d="M48 12h26v16l8 10v56H40V38l8-10ZM40 56h42M49 12V5h24v7"/>',
case:'<rect x="25" y="28" width="72" height="60" rx="9"/><path d="M45 28V14h30v14M42 40v35M78 40v35M40 88v10M82 88v10"/>',
tv:'<rect x="15" y="18" width="94" height="62" rx="6"/><path d="M62 80v16M39 96h47"/>',
wifi:'<path d="M15 36q47-40 94 0M30 53q32-28 63 0M47 72q16-16 31 0"/><circle cx="62" cy="91" r="4"/>',
cup:'<path d="M25 43h56v27q-5 24-28 24T25 70ZM81 49h13q25 18-13 23M15 99h85M40 10q-15 12 0 23M65 10q-15 12 0 23"/>',
car:'<path d="m20 55 15-31h52l15 31v30H20ZM20 55h82M38 24v31M84 24v31M20 70h14M88 70h14M30 85v12M90 85v12"/>',
bath:'<path d="M12 58h98v12q0 20-22 20H35q-23 0-23-20ZM26 58V20q0-18 24-8M29 90v8M93 90v8M47 10v16M42 35v3M52 35v3"/>',
snow:'<path d="M62 10v85M20 30l84 45M20 75l84-45M48 18l14 13 14-13M49 87l13-13 13 13M22 44l15-5 1-15M23 61l14 5 1 15M103 44l-15-5-1-15M103 61l-15 5-1 15"/>',
lift:'<rect x="23" y="10" width="78" height="86" rx="4"/><path d="M61 10v86M34 44l13-15 13 15M67 64l12 15 12-15"/>',
tissue:'<path d="M17 53h89v41H17ZM37 53l-8-25 22 5 11-21 23 33-3 8M48 65h28"/>',
gum:'<rect x="20" y="32" width="65" height="36" rx="3"/><path d="M27 43h45M27 56h35M85 43l24 11-8 20-20-7"/>',
hotel:'<path d="M21 97V30h80v67M14 97h95M46 97V74h30v23M36 47h9M76 47h9M36 62h9M76 62h9M44 15h34M61 5v20"/>'
};
function pic(type){const p=el('div','illustration');p.innerHTML=`<svg viewBox="0 0 124 110" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${shapes[type]||shapes.hotel}</svg>`;return p;}
function recordBox(parent){const token=view,box=el('div','record'),b=button('● Enregistrer ma voix',async()=>{
 if(recording){stopRecord();return;}if(recordPending)return;
 if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){msg.textContent='Le micro ne marche pas ici. Répondez à voix haute.';return;}
 stopSound();recordPending=true;b.disabled=true;msg.textContent='Autorisez le micro si le navigateur le demande.';
 try{const acquired=await navigator.mediaDevices.getUserMedia({audio:true});if(token!==view){acquired.getTracks().forEach(t=>t.stop());return;}stream=acquired;clips=[];recorder=new MediaRecorder(stream);
 const activeRecorder=recorder;recorder.ondataavailable=e=>{if(e.data.size&&token===view)clips.push(e.data);};recorder.onstop=()=>{if(token!==view)return;
 if(recordURL)URL.revokeObjectURL(recordURL);recordURL=URL.createObjectURL(new Blob(clips,{type:activeRecorder.mimeType}));playback.src=recordURL;playback.hidden=false;b.textContent='● Recommencer l’enregistrement';msg.textContent='Écoutez-vous. Comparez avec le modèle. Il n’y a pas de note automatique.';};
 recorder.start();recording=true;b.textContent='■ Arrêter l’enregistrement';msg.textContent='Parlez. Touchez Arrêter quand vous avez fini.';timer=setTimeout(()=>stopRecord(),90000);
 }catch{msg.textContent='Le micro n’est pas disponible. Répondez à voix haute.';}finally{recordPending=false;b.disabled=false;}
 });const msg=el('p','muted','Facultatif. Votre voix reste ici et disparaît quand vous quittez cette activité.'),playback=el('audio');msg.setAttribute('role','status');playback.controls=true;playback.hidden=true;
 playback.onplay=()=>{stopSound(playback);stopRecord();};box.append(b,msg,playback);parent.append(box);}
function ratings(parent,id){const row=el('div','ratings');row.setAttribute('aria-label','Mon essai oral');const full=D.steps[state.step][0]+'/'+id;
 labels.forEach((l,i)=>{const b=button(l,()=>{state.ratings[full]={level:i,date:new Date().toISOString()};save();nav();for(const c of row.children)c.setAttribute('aria-pressed',String(c===b));announce('Essai ajouté au carnet.');});b.setAttribute('aria-pressed',String(state.ratings[full]?.level===i));row.append(b);});parent.append(row);}
function home(){heading('Je parle français à l’hôtel.','Après votre classe d’une heure, retrouvez les mots et les phrases. Faites une petite séance, puis revenez demain.');
 const c=el('section','card hero'),left=el('div');left.append(el('span','badge','3 petites séances · environ 10 minutes chacune'),el('h3','big','Écoutez.\nEssayez.\nRecommencez.'));
 const ol=el('ol','steps');for(const t of ['Dites la réponse à voix haute.','Ouvrez le modèle pour vérifier.','Dites la phrase avec une autre information.'])ol.append(el('li','',t));left.append(ol,button('Commencer : l’hôtel',()=>go(1),'primary'));const art=el('div','hero-art');art.append(pic('hotel'));c.append(left,art);main.append(c);
 const r=el('div','routine');for(const [n,t]of [['Aujourd’hui','L’hôtel, mes objets, mes phrases.'],['Demain','Mes questions, les sons, le dialogue.'],['Dans trois jours','À la réception, puis mon séjour.']]){const d=el('div');d.append(el('strong','',n),document.createTextNode(t));r.append(d);}main.append(r);
 pending();main.append(el('p','muted','Les boutons « Avec une aide » et « Sans aide » décrivent votre essai. Ils ne donnent pas une note de prononciation.'));
}
const pools={hotel:D.hotel,objets:D.objects,phrases:D.constructions,questions:D.questions,sons:D.phonetics};
let numberMode=false;
function indexFor(id,list){return Math.max(0,Math.min(Number.isInteger(state.index[id])?state.index[id]:0,list.length-1));}
function exercise(){const id=D.steps[state.step][0],modeKey=id+((id==='phrases'&&numberMode)?'n':'');let list=pools[id];if(id==='phrases'&&numberMode)list=D.numbers;
 const idx=indexFor(modeKey,list),item=list[idx];const intros={hotel:'Regardez le dessin. Dites un mot, puis une phrase sur l’hôtel.',objets:'Dites le nom de l’objet. Puis faites une phrase vraie pour vous.',phrases:'Dites une phrase entière. Ensuite, regardez le modèle.',questions:'Posez la question ou donnez une réponse complète.',sons:'Écoutez, reliez les mots, puis répétez sans regarder.'};heading(D.steps[state.step][1],intros[id]);pending();
 if(id==='hotel'&&idx===0){const h=el('div','hotel');for(const [n,t]of [['Caribeach','Fort-de-France · Martinique'],['Ce qui est indiqué','Piscine · climatisation · minibar · WiFi gratuit'],['Le petit déjeuner','Compris dans le prix'],['Le prix du document','154 € par nuit · exemple du manuel']]){const d=el('div');d.append(el('strong','',n),document.createTextNode(t));h.append(d);}main.append(h);}
 if(id==='phrases'){const r=el('div','row');r.append(button(numberMode?'Revenir aux phrases':'Les nombres de 0 à 99',()=>{numberMode=!numberMode;view++;stopAll();render();}));const details=el('details');details.append(el('summary','','Aide : le verbe avoir'));const con=el('div','conjugation');for(const t of ['j’ai','tu as','il / elle / on a','nous avons','vous avez','ils / elles ont'])con.append(el('div','',t));details.append(con);main.append(r,details);}
 const c=el('section','card');c.append(el('div','label',`CARTE ${idx+1} / ${list.length}`));if(item.icon)c.append(pic(item.icon));c.append(el('p','prompt',item.prompt));
 const tools=el('div','toolbar'),hint=el('p','hint',item.hint);hint.hidden=true;
 tools.append(button('Un début de phrase',()=>{hint.hidden=!hint.hidden;}));c.append(tools,hint);chooseVoice(c);
 audioTools(c,[{id:item.id+'-model'}]);if(item.word){c.querySelector('.toolbar:last-of-type')?.prepend(sound([{id:item.id+'-word'}],'▶ Le mot'));}
 const reveal=button('J’ai essayé → Voir le modèle',()=>{answer.hidden=!answer.hidden;reveal.setAttribute('aria-expanded',String(!answer.hidden));reveal.textContent=answer.hidden?'J’ai essayé → Voir le modèle':'Masquer le modèle';});reveal.setAttribute('aria-expanded','false');
 const answer=el('div','answer');answer.hidden=true;answer.append(el('p','',item.model));if(item.negative)answer.append(el('p','',item.negative));answer.append(el('p','tip',item.tip));c.append(reveal,answer);
 const transfer=id==='hotel'?'À vous : décrivez un autre hôtel avec cette phrase.':id==='objets'?'À vous : dites oui ou non pour cet objet. Puis posez la question à un ami.':id==='sons'?'À vous : répétez une fois sans le texte.':'À vous : changez un mot et dites une nouvelle phrase.';
 c.append(el('p','tip',transfer));if(item.negative)c.append(sound([{id:item.id+'-negative'}],'▶ La phrase avec « pas de »'));
 recordBox(c);ratings(c,item.id);main.append(c);pager(idx,list.length,()=>{state.index[modeKey]=idx-1;view++;stopAll();save();render();},()=>{state.index[modeKey]=idx+1;view++;stopAll();save();render();});
}
function pager(idx,len,prev,next){const p=el('div','pager'),b=button('← Carte précédente',prev);b.disabled=idx===0;p.append(b);
 if(idx<len-1)p.append(button('Carte suivante →',next,'primary'));else p.append(button('Étape suivante →',()=>go(Math.min(8,state.step+1)),'primary'));main.append(p);}
function listen(){heading('Je comprends à la réception.','Écoutez le dialogue sans lire. Choisissez une réponse. Puis dites la phrase correcte à voix haute.');pending();
 const c=el('section','card');c.append(el('span','badge','Dialogue créé pour cet atelier'));audioTools(c,D.dialogue.map(t=>({id:t.id,voice:t.voice})));
 const transcript=el('details');transcript.append(el('summary','','Après l’écoute : lire le dialogue'));for(const t of D.dialogue){const p=el('p');p.append(el('strong','',t.role+' : '),document.createTextNode(t.text));transcript.append(p);}c.append(transcript);
 const idx=indexFor('ecoute',D.listening),q=D.listening[idx];c.append(el('p','label',`QUESTION ${idx+1} / ${D.listening.length}`),el('p','prompt',q.prompt));const ch=el('div','choices'),feedback=el('p','feedback');feedback.hidden=true;feedback.setAttribute('role','status');
 q.choices.forEach((choice,i)=>{const b=button(choice,()=>{state.choices[q.id]=i;save();feedback.hidden=false;feedback.textContent=(i===q.correct?'Oui. ':'Réessayez. ')+q.explain+' Dites cette information à voix haute.';for(const x of ch.children)x.setAttribute('aria-pressed',String(x===b));});b.setAttribute('aria-pressed',String(state.choices[q.id]===i));ch.append(b);});c.append(ch,feedback);recordBox(c);ratings(c,q.id);main.append(c);pager(idx,D.listening.length,()=>{state.index.ecoute=idx-1;view++;stopAll();save();render();},()=>{state.index.ecoute=idx+1;view++;stopAll();save();render();});
}
function turnsFor(s){const doc=s.document==='un passeport'?'Oui, j’ai un passeport.':'Non, je n’ai pas de passeport. J’ai une carte d’identité.';return [
 ['f','Bonjour.'],['m',`Bonjour. J’ai une réservation au nom de ${s.person}.`],
 ['f',`Une chambre ${s.type} pour ${s.nights} ${s.nights==='une'?'nuit':'nuits'} ?`],['m',`Oui, pour ${s.people} ${s.people==='une'?'personne':'personnes'}.`],
 ['f','Est-ce que vous avez un passeport ?'],['m',doc],
 ['f',`Merci. Vous avez la chambre ${s.room}. Voici la clé.`],['m','Est-ce que le petit déjeuner est compris ?'],
 ['f',s.breakfast?'Oui, il est compris.':'Non, il est en supplément.'],['m','Est-ce qu’il y a un parking ?'],
 ['f',s.parking?'Oui, il y a un parking.':'Non, il n’y a pas de parking.'],['m','Merci. Je paie par carte.']
 ].map(([voice,text],i)=>({id:`role-${D.scenarios.indexOf(s)}-${i}`,voice,text}));}
function roleplay(){const s=D.scenarios[state.scenario],turns=turnsFor(s),mine=state.role==='client'?'m':'f',learner=turns.filter(t=>t.voice===mine),idx=Math.min(state.turn,learner.length-1),turn=learner[idx],abs=turns.indexOf(turn),partner=abs>0?turns[abs-1]:null;
 heading('À la réception, c’est à moi.','Votre partenaire parle. Répondez à voix haute. Le modèle reste caché jusqu’à votre essai.');pending();
 const options=el('div','row'),scenarioSelect=el('select');scenarioSelect.setAttribute('aria-label','Situation');D.scenarios.forEach((s,i)=>{const o=el('option','',s.name);o.value=i;scenarioSelect.append(o);});scenarioSelect.value=state.scenario;scenarioSelect.onchange=()=>{view++;stopAll();state.scenario=Number(scenarioSelect.value);state.turn=0;render();};
 const roleSelect=el('select');roleSelect.setAttribute('aria-label','Mon rôle');for(const [v,t]of [['client','Je suis le client / la cliente'],['reception','Je suis à la réception']]){const o=el('option','',t);o.value=v;roleSelect.append(o);}roleSelect.value=state.role;roleSelect.onchange=()=>{view++;stopAll();state.role=roleSelect.value;state.turn=0;render();};options.append(scenarioSelect,roleSelect);main.append(options);
 const card=el('section','card');card.append(el('span','badge','Situation inventée'),el('p','hint',`${s.person} · ${s.type} · ${s.people} personne(s) · ${s.nights} nuit(s) · chambre ${s.room} · ${s.document} · petit déjeuner ${s.breakfast?'compris':'en supplément'} · parking ${s.parking?'oui':'non'}`),el('p','label',`MON TOUR ${idx+1} / ${learner.length}`));
 if(partner){card.append(el('p','prompt','Écoutez votre partenaire.'));audioTools(card,[partner]);const text=el('p','hint',partner.text);text.hidden=true;card.append(button('Lire la phrase du partenaire',()=>{text.hidden=!text.hidden;}),text);}else card.append(el('p','prompt','Vous commencez. Saluez le client.'));
 const purpose=mine==='m'?['Annoncez votre réservation et votre nom.','Confirmez le nombre de personnes.','Dites quel document vous avez.','Posez une question sur le petit déjeuner.','Posez une question sur le parking.','Remerciez et dites comment vous payez.'][idx]:['Saluez le client.','Vérifiez le type de chambre et le nombre de nuits.','Demandez un passeport.','Donnez le numéro de chambre et la clé.','Répondez pour le petit déjeuner.','Répondez pour le parking.'][idx];
 card.append(el('p','prompt',purpose));const answer=el('div','answer',turn.text);answer.hidden=true;card.append(button('Après mon essai : le modèle',()=>{answer.hidden=!answer.hidden;}),answer,sound([turn],'▶ Écouter mon modèle'));recordBox(card);ratings(card,`scenario-${state.scenario}-${state.role}-${idx}`);main.append(card);
 const p=el('div','pager'),prev=button('← Tour précédent',()=>{view++;stopAll();state.turn--;render();});prev.disabled=idx===0;p.append(prev,button(idx<learner.length-1?'Mon tour suivant →':'Rejouer la scène',()=>{view++;stopAll();state.turn=idx<learner.length-1?idx+1:0;render();},'primary'),button('Mon séjour →',()=>go(8)));main.append(p);
}
function mission(){heading('Mon séjour : je parle sans modèle.','Choisissez des informations imaginaires. Préparez votre arrivée. Puis faites la scène à voix haute.');
 const c=el('section','card');c.append(el('span','badge','Une réservation d’entraînement'),el('p','muted','Utilisez un nom inventé. Ce formulaire reste sur cette page ; il n’envoie pas de réservation.'));
 const form=el('form','form');let fields={};function field(name,title,values){const l=el('label','',title),input=el('select');for(const [v,t]of values){const o=el('option','',t);o.value=v;input.append(o);}input.name=name;fields[name]=input;l.append(input);form.append(l);}
 field('nom','Nom de la réservation',[['Martin','Martin'],['Lopez','Lopez'],['Diallo','Diallo']]);field('prenom','Prénom',[['Alex','Alex'],['Léa','Léa'],['Sam','Sam']]);field('type','Chambre',[['simple','simple'],['double','double']]);field('personnes','Personnes',[['une','1'],['deux','2']]);field('nuits','Nuits',[['une','1'],['deux','2'],['trois','3']]);field('document','Document',[['un passeport','un passeport'],['une carte d’identité','une carte d’identité']]);field('arrivee','Date d’arrivée',[['douze avril','12 avril'],['quinze avril','15 avril'],['vingt avril','20 avril']]);
 const extra=el('details','wide');extra.append(el('summary','','Les autres cases du formulaire du manuel'));extra.append(el('p','muted','Adresse, téléphone, e-mail, date de départ, demandes particulières. En classe, utilisez des coordonnées inventées. Ici, aucune coordonnée personnelle n’est nécessaire.'));form.append(extra);const submit=el('button','primary wide','Ma fiche est prête → parler');submit.type='submit';form.append(submit);c.append(form);
 const output=el('div');form.onsubmit=e=>{e.preventDefault();const v=Object.fromEntries(Object.entries(fields).map(([k,input])=>[k,input.value]));if((v.type==='simple'&&v.personnes==='deux')||(v.type==='double'&&v.personnes==='une')){status('Pour cet exercice : une chambre simple pour une personne, ou double pour deux personnes.');return;}
 output.replaceChildren();output.append(el('h3','','À vous !'),el('p','hint',`${v.prenom} ${v.nom} · ${v.type} · ${v.personnes} personne(s) · ${v.nuits} nuit(s) · arrivée le ${v.arrivee} · ${v.document}`));
 const ol=el('ol','steps');for(const t of ['Saluez et annoncez votre réservation.','Dites votre nom, le nombre de personnes et de nuits.','Dites ce que vous avez et ce que vous n’avez pas.','Posez deux questions : petit déjeuner et parking.','Remerciez. Dites : « Je paie par carte. »'])ol.append(el('li','',t));output.append(ol);
 const d=el('details');d.append(el('summary','','Après mon essai : un exemple'));d.append(el('p','',`Bonjour. J’ai une réservation au nom de ${v.nom}. Une chambre ${v.type} pour ${v.personnes} ${v.personnes==='une'?'personne':'personnes'}, pour ${v.nuits} ${v.nuits==='une'?'nuit':'nuits'}. J’arrive le ${v.arrivee}. J’ai ${v.document}. Est-ce que le petit déjeuner est compris ? Est-ce qu’il y a un parking ? Merci. Je paie par carte.`));output.append(d);recordBox(output);ratings(output,'arrivee');};c.append(output,el('p','sound-status'));main.append(c);
 const personal=el('section','card');personal.append(el('h3','','Mon mini-défi'),el('p','prompt','Décrivez votre hôtel idéal. Dites trois services, un service absent et votre avis. Puis dites deux objets que vous avez et un objet que vous n’avez pas.'));
 const help=el('details');help.append(el('summary','','Un exemple après mon essai'),el('p','','Il y a une piscine. Il y a un minibar. Il y a la climatisation. Il n’y a pas de salle de sport. La chambre est grande. Ce n’est pas cher. J’ai un portable et des clés. Je n’ai pas de passeport.'));personal.append(help);recordBox(personal);ratings(personal,'hotel-ideal');main.append(personal,button('Voir mon carnet',openJournal));
}
function render(){if(recordURL){URL.revokeObjectURL(recordURL);recordURL=null;}nav();main.replaceChildren();if(state.step===0)home();else if(state.step<=5)exercise();else if(state.step===6)listen();else if(state.step===7)roleplay();else mission();}
function openJournal(){stopAll();const box=document.querySelector('#journal-content');box.replaceChildren();const rated=Object.entries(state.ratings);const retry=rated.filter(([,r])=>r.level<2);box.append(el('p','',`${rated.length} essais notés par vous. ${retry.length} à reprendre.`));if(!storageOK)box.append(el('p','pending','La sauvegarde dans ce navigateur ne marche pas. Téléchargez votre bilan.'));
 for(const [id,title]of D.steps.slice(1)){const rs=rated.filter(([k])=>k.startsWith(id+'/'));const entry=el('div','entry');entry.append(el('strong','',title),el('p','muted',`${rs.length} essai(s) · ${rs.filter(([,r])=>r.level===2).length} sans aide`),button('Reprendre cette étape',()=>{document.querySelector('#notebook').close();const firstRetry=rs.find(([,r])=>r.level<2);if(pools[id]&&firstRetry){const idx=pools[id].findIndex(c=>c.id===firstRetry[0].split('/')[1]);if(idx>=0){state.index[id]=idx;numberMode=false;}}go(D.steps.findIndex(s=>s[0]===id));}));box.append(entry);}
 document.querySelector('#notebook').showModal();}
document.querySelector('#journal').onclick=openJournal;document.querySelector('#close-journal').onclick=()=>document.querySelector('#notebook').close();
document.querySelector('#export').onclick=()=>{const lines=['BON SÉJOUR ! — Bilan de pratique A1','Date : '+new Date().toLocaleDateString('fr-FR'),'Les niveaux sont déclarés par l’apprenant, sans évaluation automatique.',''];for(const [k,r]of Object.entries(state.ratings))lines.push(k+' : '+(labels[r.level]||'À reprendre'));lines.push('','Compréhension du dialogue original :');for(const q of D.listening){const choice=state.choices[q.id];if(Number.isInteger(choice)&&q.choices[choice])lines.push(q.prompt+' '+q.choices[choice]+' — '+(choice===q.correct?'correct':'à reprendre'));}const url=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'})),a=el('a');a.href=url;a.download='bilan-bon-sejour-a1.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
window.addEventListener('pagehide',stopAll);save();render();
})();
