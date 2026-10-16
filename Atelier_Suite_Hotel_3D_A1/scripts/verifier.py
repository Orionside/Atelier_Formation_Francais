"""Contrôle autonome : couverture des textes, fichier, empreinte et décodage MP3."""
import hashlib,json,subprocess,re
from pathlib import Path
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'audio/manifest.json').read_text())
plan=json.loads((root/'audio/plan.json').read_text())
assert manifest['ready'] and len(manifest['clips'])==len(plan['clips'])==305
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
data=json.loads(re.search(r'<script[^>]+id="data"[^>]*>(.*?)</script>',(root/'index.html').read_text(),re.S)[1])
assert len(data['vocab'])==93
for v in data['vocab']:
 assert manifest['clips']['w_'+v['id']]['text']==v['w']
 assert manifest['clips']['e_'+v['id']]['text']==v['ex']
for p in [root/'index.html',root/'app.js',root/'audio/plan.json',root/'audio/manifest.json']:
 assert 'Caribeach' not in p.read_text() and 'CARIBEACH' not in p.read_text(),p
assets=json.loads((root/'assets/catalogue.json').read_text())
for asset in assets:
 assert asset['license']=='CC0-1.0'
 for file in ([asset['file']] if asset['type']=='model' else asset['maps'].values()):
  path=root/file;assert path.exists() and path.stat().st_size>100
 if asset['type']=='model':assert (root/asset['file']).read_bytes()[:4]==b'glTF'
print('305 textes, voix, empreintes et décodages valides ; 93 mots ; ressources PBR présentes ; aucun secours de voix système.')
