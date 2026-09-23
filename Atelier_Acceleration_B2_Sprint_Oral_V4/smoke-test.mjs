import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(root, "index.html"), "utf8");
const app = readFileSync(join(root, "app.js"), "utf8");
const css = readFileSync(join(root, "styles.css"), "utf8");

assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
assert.match(html, /lang="fr"/);
assert.match(html, /<script src="app\.js" defer><\/script>/);
assert.ok(existsSync(join(root, "GUIDE_EXPERIMENTATION.md")));
assert.ok(css.length > 10_000, "La feuille de style semble incomplète.");

const steps = [...html.matchAll(/data-step="(\d)"/g)].map(match => Number(match[1]));
assert.deepEqual(steps, [0, 1, 2, 3, 4, 5, 6, 7]);

const referencedIds = [...app.matchAll(/getElementById\("([^"]+)"\)/g)].map(match => match[1]);
const declaredIds = new Set([...`${html}\n${app}`.matchAll(/id="([^"]+)"/g)].map(match => match[1]));
const missingIds = [...new Set(referencedIds)].filter(id => !declaredIds.has(id));
assert.deepEqual(missingIds, [], `Identifiants DOM manquants : ${missingIds.join(", ")}`);

for (const asset of ["styles.css", "app.js"]) {
  assert.ok(existsSync(join(root, asset)), `Ressource manquante : ${asset}`);
}

assert.doesNotMatch(html, /<script[^>]+src="https?:/i, "Aucun script tiers ne doit être chargé au démarrage.");
assert.match(app, /youtube-nocookie\.com/, "L’intégration vidéo doit utiliser le domaine YouTube sans cookies.");
assert.match(app, /getUserMedia/, "L’enregistreur local est absent.");
assert.match(app, /localStorage/, "La persistance locale est absente.");

console.log("Smoke test OK · 8 étapes · ressources locales · confidentialité vérifiée");
