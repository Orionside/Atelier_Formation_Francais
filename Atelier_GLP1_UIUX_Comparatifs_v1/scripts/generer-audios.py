"""Production locale Qwen3-TTS : reprise exacte des lectures compatibles, génération des textes nouveaux.
Exécuter avec ~/impact60_mesure/.venv-qwen3tts/bin/python. Reprenable sans refaire les MP3 existants.
La référence vocale reste locale dans le support Alimentation bis v5 et n'est pas copiée ni publiée.
"""
import hashlib,json,re,shutil,subprocess,time,sys
from pathlib import Path
import numpy as np
from scipy.io import wavfile
ROOT=Path(__file__).resolve().parent.parent
if '--verify' in sys.argv:
    subprocess.run(['/Users/toufik/.hermes/workspaces/default/.venv-transcription/bin/python',str(ROOT/'scripts/verifier-audios.py'),'--texte'],check=True)
    sys.exit(0)
forced=set(sys.argv[sys.argv.index('--regen')+1].split(',')) if '--regen' in sys.argv else set()
seed=int(sys.argv[sys.argv.index('--seed')+1]) if '--seed' in sys.argv else 29
REF=ROOT.parent/'Atelier_Alimentation_Futur_A2_bis_v5'
WORK=Path('/Users/toufik/impact60_mesure/travail/production_glp1_uiux_v1')
WORK.mkdir(parents=True,exist_ok=True)
OUT=ROOT/'audio/qwen3-tts';OUT.mkdir(parents=True,exist_ok=True)
MODEL='mlx-community/Qwen3-TTS-12Hz-1.7B-Base-8bit'
def norm(s):return re.sub(r'\s+',' ',s.replace('’',"'").replace('«','').replace('»','').replace('…','')).strip().lower()
entries=json.loads((ROOT/'audio/catalogue.json').read_text())['entries']
reusable={}
for parent in [REF,ROOT.parent/'Atelier_BYD_Oceans_B2_v4']:
    source=json.loads((parent/'audio/qwen3-tts/manifest.json').read_text())
    for x in source['clips'].values():
        if 'tts_text' in x:reusable[norm(x['tts_text'])]=(parent/x['file'],x)
manifest_path=OUT/'manifest.json'
manifest=json.loads(manifest_path.read_text()) if manifest_path.exists() else {'parameters':{'model':MODEL,'voice':'voix française féminine de référence 2','reference_sha256':hashlib.sha256((REF/'audio/voix-reference/reference.wav').read_bytes()).hexdigest(),'language':'French','format':'MP3 192 kb/s','phrases_a_trous':'lecture complète avec solution à la demande du formateur'},'clips':{}}
def save():
    manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    (ROOT/'audio/manifest.js').write_text('Object.assign(window.GLP_AUDIO_MANIFEST.clips,'+json.dumps(manifest['clips'],ensure_ascii=False)+');\n')
done={}
for e in entries:
    dest=OUT/(e['id']+'.mp3');old=manifest['clips'].get(e['id'])
    if e['id'] not in forced and dest.exists() and old and old.get('tts_text')==e['tts_text']:done[norm(e['tts_text'])]=dest
todo=[]
for e in entries:
    dest=OUT/(e['id']+'.mp3');old=manifest['clips'].get(e['id']);key=norm(e['tts_text'])
    if e['id'] not in forced and dest.exists() and old and old.get('tts_text')==e['tts_text']:continue
    origin='nouvelle génération'
    if e['id'] not in forced and key in done:
        if done[key]!=dest:shutil.copyfile(done[key],dest)
        origin='même texte déjà produit'
    elif e['id'] not in forced and key in reusable and reusable[key][0].exists():
        shutil.copyfile(reusable[key][0],dest);origin='lecture Qwen référence identique'
    else:todo.append(e);continue
    manifest['clips'][e['id']]={**e,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'production':origin}
    done[key]=dest
save();print(f'{len(manifest["clips"])}/{len(entries)} lectures disponibles ; {len(todo)} entrées nouvelles avant dédoublonnage.',flush=True)
if todo:
    import mlx.core as mx
    from mlx_audio.tts.utils import load_model
    model=load_model(MODEL)
    for i,e in enumerate(todo,1):
        start=time.time();dest=OUT/(e['id']+'.mp3');key=norm(e['tts_text'])
        if e['id'] not in forced and key in done:shutil.copyfile(done[key],dest)
        else:
            # Split long teacher notes by sentence to avoid clipped ends.
            pieces=re.split(r'(?<=[.!?])\s+',e['tts_text']);chunks=[];current=''
            for sentence in pieces:
                if len(current)+len(sentence)>240 and current:chunks.append(current);current=''
                current=(current+' '+sentence).strip()
            if current:chunks.append(current)
            signals=[];rate=24000
            for part in chunks:
                mx.random.seed(seed)
                cap=int(12.5*(0.14*len(re.findall(r'[^\W\d_]',part))+3))+15
                generated=list(model.generate(text=part,lang_code='French',ref_audio=str(REF/'audio/voix-reference/reference.wav'),ref_text=None,temperature=.9,top_k=50,top_p=1.,repetition_penalty=1.05,max_tokens=cap,stream=False,verbose=False))
                rate=generated[0].sample_rate
                signal=np.concatenate([np.asarray(s.audio,dtype=np.float32).reshape(-1) for s in generated]);signals.extend([signal,np.zeros(int(rate*.3),dtype=np.float32)])
                mx.clear_cache()
            sound=np.concatenate(signals)
            wav=WORK/(e['id']+'.wav');wavfile.write(wav,rate,(np.clip(sound,-1,1)*32767).astype(np.int16))
            subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(wav),'-af','loudnorm=I=-18:TP=-2:LRA=11','-codec:a','libmp3lame','-b:a','192k',str(dest)],check=True)
        manifest['clips'][e['id']]={**e,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'production':'Qwen3-TTS Base, référence 2, empreinte vocale seule','seed':seed}
        done[key]=dest;save();print(f'[{len(manifest["clips"])}/{len(entries)}] {e["id"]} ({time.time()-start:.1f}s)',flush=True)
manifest['clips']={k:v for k,v in manifest['clips'].items() if k in {e['id'] for e in entries}}
save()
print('Toutes les lectures sont produites.',flush=True)
