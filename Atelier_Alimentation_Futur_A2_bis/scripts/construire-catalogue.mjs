#!/usr/bin/env node
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const context = {window:{}};
vm.createContext(context);
for (const file of ['contenu.js', 'audio/catalogue.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, {filename:file});
}
const clips = context.window.impactAudioCatalogue(context.window.IMPACT60);
const entries = Object.values(clips);
for (const entry of entries) {
  if (!/^[a-z0-9-]+$/.test(entry.id) || !entry.tts_text || !entry.display_text) throw Error(entry.id);
}
const output = path.join(root, 'audio/catalogue-qwen3tts.json');
fs.writeFileSync(output, JSON.stringify({atelier:'Alimentation du futur A2+ bis', entries}, null, 2)+'\n');
console.log(`${entries.length} segments : ${output}`);
