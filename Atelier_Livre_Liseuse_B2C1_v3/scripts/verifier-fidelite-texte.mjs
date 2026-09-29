#!/usr/bin/env node
// Vérifie l'identité lexicale entre la lecture et l'écrit, en ignorant seulement
// la typographie non prononcée et la mise en lettres des nombres.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const entries=JSON.parse(fs.readFileSync(path.join(root,'audio/catalogue-qwen3tts.json'),'utf8')).entries;

function lexical(s){
  return s.toLowerCase()
    .replace(/([+−])(\d+(?:,\d+)?)/g,(_,sign,number)=>{
      const names=['zéro','un','deux','trois','quatre','cinq','six','sept','huit','neuf'];
      return (sign==='+'?'plus ':'moins ')+number.split(',')
        .map(part=>part.split('').map(d=>names[Number(d)]).join(' ')).join(' virgule ');
    })
    .replace(/\b1re\b/g,'première').replace(/\b3e\b/g,'troisième')
    .replace(/\b1\s*%/g,'un pour cent').replace(/\b40\s*%/g,'quarante pour cent')
    .replace(/\b99\s*%/g,'quatre vingt dix neuf pour cent')
    .replace(/espagnol\(e\)/g,'espagnole')
    .replace(/sûr·e/g,'sûre').replace(/seul·e/g,'seule')
    .replace(/\b1\s+min\s+30\b/g,'une minute trente')
    .replace(/\b1\s+min\s+15\b/g,'une minute quinze')
    .replace(/\b1\s+min\b/g,'une minute')
    .replace(/\b1\s+minute\b/g,'une minute')
    .replace(/\b5\s+min\b/g,'cinq minutes')
    .replace(/\bmin\b/g,'minute')
    .replace(/\b1\b/g,'un').replace(/\b2\b/g,'deux')
    .replace(/\b3\b/g,'trois').replace(/\b4\b/g,'quatre')
    .replace(/\b5\b/g,'cinq').replace(/\b6\b/g,'six')
    .replace(/\b7\b/g,'sept').replace(/\b10\b/g,'dix')
    .replace(/\b11\b/g,'onze').replace(/\bminutes\b/g,'minute')
    .replace(/\b45\b/g,'quarante cinq')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[↗↘…\[\]]/g,'')
    .replace(/[^a-z0-9]+/g,' ').trim();
}

const mismatches=entries.filter(x=>
  lexical(x.display_text)!==lexical(x.tts_text) ||
  (x.segments && (
    lexical(x.tts_text)!==lexical(x.segments.map(s=>s.text).join(' ')) ||
    x.segments.filter(s=>s.lang==='es-ES').length!==1 ||
    x.segments.some(s=>!['fr-FR','es-ES'].includes(s.lang))
  )));
console.log(`${entries.length} entrées vérifiées ; ${mismatches.length} divergence(s) lexicale(s)`);
for(const x of mismatches){
  console.error(`${x.id}\n  écrit : ${x.display_text}\n  lu    : ${x.tts_text}`);
}
if(mismatches.length)process.exitCode=1;
