import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createLearningContext} from '../learning-context.js';

const base=new URL('../',import.meta.url);
const html=fs.readFileSync(new URL('index.html',base),'utf8');
const data=JSON.parse(html.match(/<script[^>]+id="data"[^>]*>(.*?)<\/script>/s)[1]);
const clips=JSON.parse(fs.readFileSync(new URL('audio/manifest.json',base),'utf8')).clips;
const entry=createLearningContext(data);
const root=(vid,variantId)=>({userData:{vid,variantId}});
assert.equal(entry(root('coussins')).ex,'Les coussins sont jaunes.');
assert.equal(entry(root('coussins','coussins_gris')).ex,'Les coussins sont gris.');
assert.equal(entry(root('coussins','coussins_noirs_blancs')).ex,'Les coussins sont noirs et blancs.');
assert.equal(entry(root('coussins')).ex,'Les coussins sont jaunes.','La sélection d’un coussin de l’armoire ne modifie pas le lit.');
assert.equal(entry(root('mur')).ex,'Voici un mur.');
assert.equal(entry(root('armoire')).ex,'L’armoire est grande. Les vêtements sont dans l’armoire.');
assert.equal(entry(root('tapis')).wordAudio,'w_tapis');
assert.equal(entry(undefined),null);
assert.equal(new Set(data.variants.map(v=>v.id)).size,data.variants.length);
const garments=data.variants.filter(v=>v.garment);
assert.equal(garments.length,12);
assert.deepEqual(new Set(garments.map(v=>v.garment)),new Set(['chemise','pantalon','veste','robe']));
for(const v of data.variants){
 const selected=entry(root(v.vid,v.id));
 assert.equal(selected.id,v.vid);
 assert.equal(clips[selected.wordAudio]?.text,selected.w,`${v.id} : nom et lecture`);
 assert.equal(clips[selected.sentenceAudio]?.text,selected.ex,`${v.id} : phrase et lecture`);
 if(v.garment)assert.equal(selected.label,selected.w+' '+selected.color);
}
const sources=JSON.parse(fs.readFileSync(new URL('assets/coherence21/sources.json',base),'utf8'));
for(const file of sources.files)assert(fs.statSync(new URL('assets/coherence21/'+file.file,base)).size>1000);
console.log('Phrases selon l’objet sélectionné, retour aux phrases générales, 12 vêtements colorés et 14 variantes reliées à leurs vrais MP3 : valides.');
