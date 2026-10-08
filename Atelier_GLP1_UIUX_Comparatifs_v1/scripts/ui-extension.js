/* Une seule tâche active ; toutes les ressources restent accessibles à la demande. */
var UX_UNITS={};var UX_PARTS={};
var originalRender=render;
function uxButton(text,fn,cls){var b=el('button','btn '+(cls||''),text);b.type='button';b.addEventListener('click',fn);return b;}
function uxText(tag,text,cls){return audible(el(tag,cls||null,text),'ux-'+audioHash(text));}
function uxStop(){if(activeRecStop)activeRecStop();ytStop();audioStop();pauseLearnerAudio();}
function uxPager(items,holder,key,label){
 if(items.length<2)return;
 var initial=state.a['ux-unit-'+key]||0,idx=Math.min(items.length-1,initial);
 var bar=el('nav','ux-pager');bar.setAttribute('aria-label',label);
 var prev=uxButton('Précédent',function(){show(idx-1);});var next=uxButton('Suivant',function(){show(idx+1);});
 var info=el('span','ux-page-number');info.setAttribute('aria-live','polite');
 var all=uxButton('Tout voir',function(){uxStop();var expanded=all.getAttribute('aria-pressed')==='true';all.setAttribute('aria-pressed',expanded?'false':'true');all.textContent=expanded?'Tout voir':'Une à la fois';items.forEach(function(x,i){x.hidden=expanded?i!==idx:false;});});all.setAttribute('aria-pressed','false');
 bar.append(prev,info,next,all);holder.before(bar);
 function show(n){uxStop();idx=Math.max(0,Math.min(items.length-1,n));state.a['ux-unit-'+key]=idx;save();items.forEach(function(x,i){x.hidden=i!==idx;});prev.disabled=idx===0;next.disabled=idx===items.length-1;all.setAttribute('aria-pressed','false');all.textContent='Tout voir';info.textContent=label+' '+(idx+1)+' / '+items.length;bar.scrollIntoView({block:'nearest'});}
 show(idx);UX_UNITS[key]={show:show,items:items};
}
function uxDisclosure(nodes,title,before){
 if(!nodes.length)return;var box=el('details','ux-help');box.appendChild(el('summary',null,title));before.before(box);nodes.forEach(function(n){box.appendChild(n);});return box;
}
function uxInlinePlayer(){
 var slot=document.getElementById('ux-media-place');var box=ensureFloat();if(slot)slot.appendChild(box);
 box.classList.add('ux-inline-player');
}
function uxReadingTools(){
 var rail=document.querySelector('.rail');if(!document.getElementById('ux-plan')){
 var plan=el('details','ux-menu');plan.id='ux-plan';plan.appendChild(el('summary',null,'Plan et outils'));rail.before(plan);plan.appendChild(rail);
 var top=document.querySelector('.topbar-in'),tools=el('details','ux-tools');tools.appendChild(el('summary',null,'Réglages'));top.appendChild(tools);
 ['exportBtn','paceBtn','themeBtn'].forEach(function(id){tools.appendChild(document.getElementById(id));});
 var link=el('a','btn','Comparer les versions');link.href='index.html';tools.appendChild(link);
 var skip=el('a','ux-skip','Aller à l’activité');skip.href='#main';document.body.prepend(skip);
 document.querySelector('.brand b').textContent='GLP-1 · '+(UX_VARIANT==='focus'?'Focus':'Boucle orale');
 document.querySelector('.brand span').textContent='Séance '+GLP_SESSION+' sur 3 · B2';
 document.getElementById('main').setAttribute('tabindex','-1');
 }
 var current=STEPS[state.step];document.querySelector('.brand span').textContent='Séance '+GLP_SESSION+' · '+current.t;
}
function uxAudioFurniture(){
 main.querySelectorAll('.audio-circle').forEach(function(b){var prev=b.previousElementSibling;
 if(prev&&/^H[234]$/.test(prev.tagName))b.classList.add('ux-secondary-audio');
 });
 main.querySelectorAll('h2,h3,h4').forEach(function(h){var b=h.nextElementSibling;if(b&&b.classList.contains('audio-circle')&&!h.parentElement.classList.contains('audio-line')&&!h.parentElement.classList.contains('ux-unit-head')){var row=el('div','ux-heading-line');h.before(row);row.append(h,b);}});
 // Les noms accessibles des modèles cachés ne dévoilent plus leur texte avant l’écoute.
 main.querySelectorAll('.audio-line').forEach(function(line){
 var label=line.querySelector('span'),b=line.querySelector('.audio-circle');
 if(label&&b&&/Écouter le partenaire|Écouter le nouvel exemple|Écouter le modèle/.test(label.textContent)){b.dataset.uxLabel=label.textContent;b.title=label.textContent;b.setAttribute('aria-label',label.textContent);}
 });
 main.querySelectorAll('input:not([type=checkbox]),textarea').forEach(function(n){if(!n.hasAttribute('aria-label'))n.setAttribute('aria-label',n.placeholder||'Ma réponse');});
}
function uxFocusContent(){
 var section=main.querySelector('.step'),id=STEPS[state.step].id;
 // Sans modifier les phrases ni les questions : seule la présentation change.
 var list=section.querySelector('.pc-list');if(list)uxPager(Array.from(list.children),list,'phrases','Phrase');
 if(id==='ecoute'){
 var hint=section.querySelector(':scope>p.note');if(hint){var hintAudio=hint.nextElementSibling;uxDisclosure(hintAudio&&hintAudio.classList.contains('audio-circle')?[hint,hintAudio]:[hint],'Repérer les voix',hint);}
 var cards=Array.from(section.querySelectorAll(':scope>.card'));
 uxPager(cards,cards[0],'ecoute','Extrait');
 cards.forEach(function(c){var why=c.querySelector('.why')?.closest('.audio-line');if(why)uxDisclosure([why],'Pourquoi cet extrait ?',c.querySelector('h3'));
 var heading=c.querySelector('h3'),titleAudio=heading.nextElementSibling;var unitHead=el('div','ux-unit-head');c.insertBefore(unitHead,c.firstChild);unitHead.appendChild(heading);if(titleAudio&&titleAudio.classList.contains('audio-circle'))unitHead.appendChild(titleAudio);
 var film=c.querySelector('.listen-wrap');if(film)c.insertBefore(film,unitHead.nextSibling);
 });
 }
 if(id==='start'){
 var cards=Array.from(section.querySelectorAll(':scope>.card'));if(cards[1])uxDisclosure([cards[1]],'Voir le programme',cards[1]);
 var perso=section.querySelector('.perso');if(perso)uxDisclosure([perso],'Choisir une autre situation',perso);
 }
 if(id==='avant'){
 var cards=Array.from(section.querySelectorAll(':scope>.card'));if(cards[1])uxDisclosure([cards[1]],'Un plan si vous en avez besoin',cards[1]);
 }
 if(id==='melodie'||id==='entrainement'||id==='apres'){
 var cards=Array.from(section.querySelectorAll(':scope>.card'));if(cards.length>1)uxPager(cards,cards[0],id,'Activité');
 }
 // Raccourci fiable et local au média ; le lecteur ne recouvre plus la question.
 if(id!=='start'&&id!=='form'){
 var media=el('div','ux-media-place');media.id='ux-media-place';media.setAttribute('aria-label','Lecteur de l’activité');section.insertBefore(media,section.querySelector('.stepnav'));
 uxInlinePlayer();
 main.querySelectorAll('.listen-wrap button').forEach(function(b){b.addEventListener('click',function(){setTimeout(uxInlinePlayer,0);});});
 }
}
function uxOralPhrases(s){
 s.appendChild(head(stepEyebrow('phrases'),'Je transforme une phrase en conversation','Comprenez le sens, écoutez la forme, puis dites votre propre message. Choisissez un seul point à améliorer.'));
 var deck=el('div','ux-oral-deck');s.appendChild(deck);
 C.phrases.slice(0,3).forEach(function(p,i){
 var t=window.GLP_UX_TARGETS[GLP_SESSION-1][i],key='oral-'+GLP_SESSION+'-'+i;
 var box=el('article','ux-oral-card');box.appendChild(uxText('h3',p.sert));
 var tabs=el('div','ux-cycle');tabs.setAttribute('role','group');tabs.setAttribute('aria-label','Étapes de la pratique');box.appendChild(tabs);
 var phases=['Comprendre','Entendre','Reprendre','Formuler','Converser'];var panels=[];var controls=[];
 function panel(){var x=el('div','ux-phase');box.appendChild(x);panels.push(x);return x;}
 var meaning=panel();meaning.appendChild(uxText('p',t.q,'ux-instruction'));
 meaning.appendChild(uxText('p','Dites d’abord ce que vous comprenez, puis comparez.'));
 var answers=el('div','opts');answers.hidden=true;var feedback=uxText('p',t.feedback,'ux-feedback');feedback.hidden=true;
 t.options.forEach(function(txt,j){var a=uxButton(txt,function(){answers.querySelectorAll('button.opt').forEach(function(b){b.removeAttribute('aria-pressed');});a.setAttribute('aria-pressed','true');feedback.hidden=false;feedback.firstElementChild.textContent=(j===0?'Sens conservé. ':'À reprendre. ')+t.feedback;},'opt');answers.appendChild(audible(a,'ux-'+audioHash(txt)));});
 meaning.appendChild(uxButton('Comparer après ma réponse orale',function(){answers.hidden=false;this.hidden=true;}));meaning.append(answers,feedback);
 var hear=panel();hear.appendChild(uxText('p','Écoutez sans lire. Dites l’idée, puis affichez la phrase si nécessaire.','ux-instruction'));
 hear.appendChild(filmClip(p.film.debut,p.film.fin,'Voix du reportage'));
 var script=el('details','ux-help');script.appendChild(el('summary',null,'Voir la phrase après l’écoute'));script.appendChild(uxText('p',p.film.texte));hear.appendChild(script);
 hear.appendChild(uxText('p','Le modèle suivant est une formulation pédagogique. Il sert à votre propre conversation.'));
 var line=el('div','audio-line');line.appendChild(el('span',null,'Écouter le modèle'));line.appendChild(speechBtn(null,null,p.forme));hear.appendChild(line);
 var model=el('details','ux-help');model.appendChild(el('summary',null,'Voir le modèle'));model.appendChild(uxText('p',p.forme));hear.appendChild(model);
 var repeat=panel();repeat.appendChild(uxText('p',t.focus,'ux-instruction'));
 var grouped=el('p','ux-groups');t.groups.forEach(function(g,j){if(j)grouped.appendChild(document.createTextNode(' '));grouped.appendChild(el('span',null,g));});repeat.appendChild(grouped);
 repeat.appendChild(uxText('p','Écoutez la phrase entière. Répétez après l’audio, puis réécoutez votre essai. Gardez le sens et un rythme compréhensible.'));
 repeat.appendChild(audible(el('span',null,'Écouter le modèle'),null));repeat.lastChild.lastChild.replaceWith(speechBtn(null,null,p.forme));
 repeat.appendChild(recorder(key+'-echo',20,{metrics:false}));
 var form=panel();form.appendChild(uxText('p',t.mission,'ux-instruction'));form.appendChild(uxText('p','Préparez trois mots-clés. Parlez sans regarder le modèle.'));
 var input=lineBox(key+'-mots','Trois mots-clés');input.setAttribute('aria-label','Trois mots-clés');form.appendChild(input);form.appendChild(recorder(key+'-message',30,{metrics:false}));
 var help=el('details','ux-help');help.appendChild(el('summary',null,'Une aide après mon essai'));help.appendChild(uxText('p',p.exemple));form.appendChild(help);
 var talk=panel();talk.appendChild(uxText('p','Répondez à votre partenaire, puis posez-lui une question. Si un mot vous manque, expliquez autrement.','ux-instruction'));
 var q=C.dialogue[i];var qline=el('div','audio-line');qline.appendChild(el('span',null,'Écouter le partenaire'));qline.appendChild(speechBtn(null,null,q.question));talk.appendChild(qline);
 var qtext=el('details','ux-help');qtext.appendChild(el('summary',null,'Afficher la réplique après l’écoute'));qtext.appendChild(uxText('p',q.question));talk.appendChild(qtext);
 talk.appendChild(recorder(key+'-interaction',30,{metrics:false}));
 talk.appendChild(checklist(key+'-bilan',['Mon partenaire peut résumer mon idée.','Je réponds à sa relance.','Je peux reformuler et continuer.']));
 talk.appendChild(uxText('p','Choisissez un seul point pour la reprise : le sens, un son gênant, ou la fin des groupes.'));
 phases.forEach(function(name,j){var b=uxButton(name,function(){activate(j);});controls.push(b);tabs.appendChild(b);});
 function activate(j){uxStop();panels.forEach(function(x,k){x.hidden=k!==j;});controls.forEach(function(b,k){b.setAttribute('aria-pressed',k===j?'true':'false');});state.a['ux-part-'+key]=j;save();}
 activate(state.a['ux-part-'+key]||0);deck.appendChild(box);
 });
 uxPager(Array.from(deck.children),deck,'oral-phrases','Fonction');
 var resources=el('details','ux-help');resources.appendChild(el('summary',null,'Trois expressions pour continuer l’échange'));C.phrases.slice(3).forEach(function(p){resources.appendChild(phraseCard(p,0));});s.appendChild(resources);
}
if(UX_VARIANT==='oral')R.phrases=uxOralPhrases;
render=function(){originalRender();uxReadingTools();uxFocusContent();uxAudioFurniture();
 main.querySelectorAll('.session-nav a').forEach(function(a){a.href=(UX_VARIANT==='focus'?'focus.html':'atelier.html')+'?seance='+new URL(a.href).searchParams.get('seance');});
 if(typeof window.GLP_UX_AFTER_RENDER==='function')window.GLP_UX_AFTER_RENDER(main);
};
