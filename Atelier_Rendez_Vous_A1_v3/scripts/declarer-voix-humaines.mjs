#!/usr/bin/env node
/* Déclare dans audio/manifest.json les voix humaines déposées dans audio/humain/.

   À lancer depuis le dossier de l'atelier, après avoir ajouté ou retiré un fichier :
     node scripts/declarer-voix-humaines.mjs

   Pour chaque fichier audio/humain/<id>.mp3 dont l'identifiant existe dans le manifeste, le script écrit
   clips[id].humain = {file, sha256, statut:"non_valide_a_l_ecoute"} ; il retire la déclaration d'un fichier disparu.
   « humain_liste_complete » reste à true : la page ne cherche alors que les fichiers déclarés (aucune requête perdue).
   Le statut d'écoute n'est jamais changé ici : il se règle dans l'espace formateur, onglet « Sons ». */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const cheminManifeste = join(racine, "audio", "manifest.json");
const dossier = join(racine, "audio", "humain");
const manifeste = JSON.parse(readFileSync(cheminManifeste, "utf8"));
const presents = existsSync(dossier) ? readdirSync(dossier).filter((f) => f.toLowerCase().endsWith(".mp3")) : [];
const ids = new Set(presents.map((f) => f.slice(0, -4)));
let ajoutes = 0, retires = 0;
const inconnus = [];

for (const id of ids) {
  const clip = manifeste.clips[id];
  if (!clip) { inconnus.push(id); continue; }
  const sha256 = createHash("sha256").update(readFileSync(join(dossier, id + ".mp3"))).digest("hex");
  const ancien = clip.humain;
  if (!ancien || ancien.sha256 !== sha256) {
    clip.humain = { file: `audio/humain/${id}.mp3`, sha256, statut: "non_valide_a_l_ecoute" };
    ajoutes++;
  }
}
for (const [id, clip] of Object.entries(manifeste.clips)) {
  if (clip.humain && !ids.has(id)) { delete clip.humain; retires++; }
}
manifeste.humain_liste_complete = true;
writeFileSync(cheminManifeste, JSON.stringify(manifeste, null, 1) + "\n", "utf8");

console.log(`${presents.length} fichier(s) dans audio/humain/ ; ${ajoutes} déclaré(s) ou mis à jour ; ${retires} retiré(s).`);
if (inconnus.length) console.log("Identifiants inconnus du manifeste (fichiers ignorés) : " + inconnus.join(", "));
console.log("Pensez à changer le « ?v= » dans index.html et VERSION dans scripts/index.js après une mise à jour publiée.");
