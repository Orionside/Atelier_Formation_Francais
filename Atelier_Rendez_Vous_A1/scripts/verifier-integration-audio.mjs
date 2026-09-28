#!/usr/bin/env node
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const context={window:{}};
vm.createContext(context);
for(const file of ['contenu.js','audio/catalogue.js']){
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
}
const current=context.window.impactAudioCatalogue(context.window.IMPACT60);
const catalogue=JSON.parse(fs.readFileSync(path.join(root,'audio/catalogue-qwen3tts.json'),'utf8'));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'audio/qwen3-tts/manifest.json'),'utf8'));
const errors=[];
const entries=new Map(catalogue.entries.map(x=>[x.id,x]));
if(entries.size!==catalogue.entries.length)errors.push('Identifiants dupliqués');
for(const [id,clip] of Object.entries(current)){
  const entry=entries.get(id),record=manifest.clips[id];
  if(!entry||!record){errors.push(`Entrée ou MP3 manquant : ${id}`);continue;}
  if(entry.display_text!==clip.display_text||entry.tts_text!==clip.tts_text||
     record.display_text!==clip.display_text||record.tts_text!==clip.tts_text){
    errors.push(`Texte périmé : ${id}`);
  }
  const file=path.join(root,record.file);
  if(!fs.existsSync(file)){errors.push(`Fichier absent : ${id}`);continue;}
  const digest=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  if(digest!==record.sha256)errors.push(`Empreinte incorrecte : ${id}`);
}
for(const id of Object.keys(manifest.clips))if(!current[id])errors.push(`MP3 orphelin : ${id}`);
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
if(!html.includes('<script src="audio/catalogue.js"></script>')||
   !html.includes('audio/qwen3-tts/manifest.json'))errors.push('Lecteur non relié au catalogue');
console.log(`${Object.keys(current).length} entrées ; ${Object.keys(manifest.clips).length} MP3 ; ${errors.length} erreur(s)`);
for(const error of errors)console.error(error);
if(errors.length)process.exitCode=1;
