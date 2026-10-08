"""Contrôle des fichiers et reconnaissance française ; les alertes ne jugent pas le naturel."""
import hashlib,json,re,subprocess,sys,unicodedata
from pathlib import Path
import numpy as np
ROOT=Path(__file__).resolve().parent.parent
def words(n):
    small=['zéro','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze','treize','quatorze','quinze','seize']
    if n<17:return small[n]
    if n<20:return 'dix '+small[n-10]
    if n<70:
        tens=['','','vingt','trente','quarante','cinquante','soixante'];a,b=divmod(n,10)
        return tens[a]+(' et un' if b==1 else ' '+small[b] if b else '')
    if n<80:return 'soixante '+('et ' if n==71 else '')+words(n-60)
    if n<100:return 'quatre vingt'+(' '+words(n-80) if n>80 else '')
    if n<1000:
        a,b=divmod(n,100);return (words(a)+' ' if a>1 else '')+'cent'+(' '+words(b) if b else '')
    if n<1000000:
        a,b=divmod(n,1000);return (words(a)+' ' if a>1 else '')+'mille'+(' '+words(b) if b else '')
    return 'un million' if n==1000000 else str(n)
def norm(s):
    s=s.lower().replace('b-y-d','b y d').replace('glp-1','g l p un').replace('glp1','g l p un').replace('byd','b y d').replace('b2','b deux').replace('cent quinze milles','cent quinze mille')
    s=re.sub(r'\b(\d{1,3})[ ,.](\d{3})\b',lambda m:m[1]+m[2],s)
    s=re.sub(r'\b\d+\b',lambda m:words(int(m[0])),s)
    s=unicodedata.normalize('NFD',s);s=''.join(x for x in s if not unicodedata.combining(x))
    return re.sub(r'[^a-z]+',' ',s).split()
def distance(a,b):
    v=list(range(len(b)+1))
    for i,x in enumerate(a,1):
        row=[i]
        for j,y in enumerate(b,1):row.append(min(row[-1]+1,v[j]+1,v[j-1]+(x!=y)))
        v=row
    return v[-1]/max(1,len(a))
manifest=json.loads((ROOT/'audio/qwen3-tts/manifest.json').read_text())
expected=json.loads((ROOT/'audio/catalogue.json').read_text())['entries']
report_path=ROOT/'audio/verification.json'
report=json.loads(report_path.read_text()) if report_path.exists() else {'clips':{}}
seen={};alerts=[]
if '--texte' in sys.argv:import mlx_whisper
for i,e in enumerate(expected,1):
    p=ROOT/e['file'];m=manifest['clips'].get(e['id']);assert m and p.exists(),e['id']+' absent'
    sha=hashlib.sha256(p.read_bytes()).hexdigest();assert sha==m['sha256'],e['id']+' empreinte'
    old=report['clips'].get(e['id'])
    if old and old.get('sha256')==sha and old.get('expected')==e['tts_text'] and ('--texte' not in sys.argv or 'recognized' in old):
        seen[sha]=old
        if old.get('alert'):alerts.append(e['id'])
        continue
    if sha in seen:item={**seen[sha],'id':e['id'],'expected':e['tts_text']}
    else:
        decoded=subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-i',str(p),'-f','f32le','-ac','1','-ar','16000','pipe:1'],capture_output=True,check=True)
        sound=np.frombuffer(decoded.stdout,dtype=np.float32);rms=float(np.sqrt(np.mean(sound**2)))
        assert len(sound)>1600 and rms>1e-4,e['id']+' vide ou silencieux'
        item={'id':e['id'],'sha256':sha,'expected':e['tts_text'],'duration_s':round(len(sound)/16000,2),'rms':round(rms,5)}
        if '--texte' in sys.argv:
            result=mlx_whisper.transcribe(sound,path_or_hf_repo='mlx-community/whisper-large-v3-turbo',language='fr',condition_on_previous_text=False,temperature=0.,verbose=None)
            recognized=result['text'].strip();a,b=norm(e['tts_text']),norm(recognized);wer=distance(a,b)
            item.update(recognized=recognized,word_error_rate=round(wer,3),alert=wer>.2 or (len(a)<6 and wer>.34))
        seen[sha]=item
    report['clips'][e['id']]=item
    if item.get('alert'):alerts.append(e['id'])
    report_path.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(f'[{i}/{len(expected)}] {e["id"]}: '+(f'WER {item["word_error_rate"]:.2f}' if 'word_error_rate' in item else 'fichier OK')+(' — à revoir' if item.get('alert') else ''),flush=True)
report['alerts']=alerts;report['summary']={'count':len(expected),'alerts':len(alerts),'audio_seconds':round(sum(report['clips'][e['id']]['duration_s'] for e in expected),1)}
report_path.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(report['summary'],flush=True)
