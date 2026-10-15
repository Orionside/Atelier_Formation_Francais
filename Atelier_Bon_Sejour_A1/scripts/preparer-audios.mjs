// Exporte tous les textes à faire enregistrer/générer avec les deux références confirmées.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'contenu.js'),'utf8'),sandbox);
const d=sandbox.window.BON_SEJOUR,rows=[];
function add(id,text,voice){rows.push({id:id+'-'+voice,text,voice,prosody:text.trim().endsWith('?')?'question':'énoncé'});}
for(const list of [d.hotel,d.objects,d.constructions,d.questions,d.phonetics,d.numbers])for(const c of list)for(const v of ['f','m']){
 add(c.id+'-model',c.model,v);if(c.word)add(c.id+'-word',c.word,v);if(c.negative)add(c.id+'-negative',c.negative,v);
}
for(const c of d.dialogue)add(c.id,c.text,c.voice);
// Le même constructeur de répliques que le parcours : extraction de sa fonction pure.
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const fn=app.slice(app.indexOf('function turnsFor(s){'),app.indexOf('\nfunction roleplay(){'));
const scope={D:d};vm.runInNewContext(fn,scope);
d.scenarios.forEach(s=>scope.turnsFor(s).forEach(c=>add(c.id,c.text,c.voice)));
if(new Set(rows.map(c=>c.id)).size!==rows.length)throw Error('Identifiant audio dupliqué');
vm.runInNewContext(fs.readFileSync(path.join(root,'audio','manifest.js'),'utf8'),sandbox);
const audio=sandbox.window.ATELIER_AUDIO;
const plan={version:1,status:audio.ready?'produit_controle':'references_a_confirmer',voices:audio.ready?audio.voices:{f:{label:'Voix féminine demandée',reference:null},m:{label:'Voix masculine demandée',reference:null}},clips:rows};
fs.writeFileSync(path.join(root,'audio','plan.json'),JSON.stringify(plan,null,2)+'\n');
console.log(`${rows.length} fichiers attendus. ${audio.ready?'Deux références intégrées et audios disponibles.':'Les références doivent être confirmées avant la production.'}`);
