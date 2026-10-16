"""Contrôle autonome : couverture des textes, fichier, empreinte et décodage MP3."""
import hashlib,json,subprocess,re
from pathlib import Path
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'audio/manifest.json').read_text())
plan=json.loads((root/'audio/plan.json').read_text())
assert manifest['ready'] and len(manifest['clips'])==277
assert set(manifest['clips'])=={c['id'] for c in plan['clips']}
for c in plan['clips']:
 m=manifest['clips'][c['id']];path=(root/m['file']).resolve()
 assert path.is_relative_to(root) and m['text']==c['text'] and m['voice']==c['voice']
 assert hashlib.sha256(path.read_bytes()).hexdigest()==m['sha256'],c['id']
 subprocess.run(['ffmpeg','-v','error','-i',str(path),'-f','null','-'],check=True,capture_output=True)
for p in root.glob('*.html'):
 for link in re.findall(r'(?:src|href)="([^"#]+)"',p.read_text()):
  if not re.match('https?://',link):assert (root/link.split('?')[0]).exists(),link
code=(root/'app.js').read_text()
assert not any(t in code for t in ['SpeechSynthesisUtterance','speechSynthesis.speak','voix-standard','voix-fournies'])
print('277 textes, voix, empreintes et décodages valides ; aucun secours de voix système.')
