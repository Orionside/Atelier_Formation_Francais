"""Comparer trois références synthétiques : fidélité, débit et hauteur, sans test d'âge perceptif."""
from pathlib import Path
import json,re,sys,unicodedata
import numpy as np
import mlx_whisper
from scipy.io import wavfile
from scipy.signal import resample_poly
sys.path.insert(0,str(Path.home()/'impact60_mesure'))
import melodie as MEL
root=Path(__file__).resolve().parents[1]
d=root/'audio/voix-reference/candidates'
f=json.loads((d/'candidates.json').read_text())
whisper=Path.home()/'.cache/huggingface/hub/models--mlx-community--whisper-large-v3-turbo/snapshots/a4aaeec0636e6fef84abdcbe3544cb2bf7e9f6fb'
def words(s):return re.findall(r'[a-z0-9]+',''.join(c for c in unicodedata.normalize('NFKD',s.lower()) if not unicodedata.combining(c)))
def wer(a,b):
 r=list(range(len(b)+1))
 for i,x in enumerate(a,1):
  n=[i]
  for j,y in enumerate(b,1):n.append(min(r[j]+1,n[-1]+1,r[j-1]+(x!=y)))
  r=n
 return r[-1]/max(1,len(a))
out=[]
for k,c in f['candidates'].items():
 text=mlx_whisper.transcribe(str(d/(k+'.wav')),path_or_hf_repo=str(whisper),language='fr',verbose=None)['text'].strip()
 sr,x=wavfile.read(d/(k+'.wav'));x=x.astype(np.float32)/32768
 if sr!=16000:x=resample_poly(x,16000,sr)
 pitch=MEL.f0_yin(x);v=pitch[pitch>0];st=12*np.log2(v/np.median(v))
 item={'candidate':k,'instruction':c['instruct'],'transcription':text,'wer':wer(words(f['texte']),words(text)),
 'duration_s':c['duree_s'],'words_per_minute':round(len(words(text))*60/c['duree_s']),
 'median_f0_hz':round(float(np.median(v))), 'f0_range_semitones':round(float(np.percentile(st,95)-np.percentile(st,5)),1)}
 out.append(item);print(json.dumps(item,ensure_ascii=False),flush=True)
(root/'audio/voix-reference/comparaison.json').write_text(json.dumps({'limitation':'Mesures et reconnaissance automatique : aucune certification perceptive du timbre, de l’accent ou de l’âge.', 'candidates':out},ensure_ascii=False,indent=2)+'\n')
