"""Modérer les lectures longues de l'apprenante sans changer leur hauteur.

Le débit est une estimation par nombre de mots et durée complète ; il n'est pas
une mesure du débit articulatoire. La prosodie nécessite une appréciation humaine.
"""
from pathlib import Path
import hashlib,json,re,subprocess,tempfile
ROOT=Path(__file__).resolve().parents[1]
MF=ROOT/'audio/qwen3-tts/manifest.json'
data=json.loads(MF.read_text());changed=[]
POLICY='a2-bis-v1-175wpm'
for id,clip in data['clips'].items():
 path=ROOT/clip['file'];digest=hashlib.sha256(path.read_bytes()).hexdigest()
 if clip.get('pace',{}).get('policy')==POLICY and clip['sha256']==digest:continue
 words=re.findall(r"[\wÀ-ÿ]+(?:['’][\wÀ-ÿ]+)*",clip['tts_text'])
 rate=len(words)*60/clip['duration_s']
 # Les notes du formateur et les intitulés très courts conservent leur débit.
 if clip['role']=='formateur' or len(words)<8 or rate<=185:continue
 ratio=max(0.65,min(0.96,175/rate))
 with tempfile.TemporaryDirectory(prefix='tempo-a2-') as dirname:
  target=Path(dirname)/'clip.mp3'
  subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(path),'-af',f'atempo={ratio:.6f},asetpts=N/SR/TB','-codec:a','libmp3lame','-b:a','192k',str(target)],check=True)
  duration=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(target)],capture_output=True,text=True,check=True).stdout)
  target.replace(path)
 clip['pace']={'policy':POLICY,'atempo':round(ratio,6),'source_sha256':digest,'source_duration_s':clip['duration_s'],'estimated_words_per_minute_before':round(rate),'estimated_words_per_minute_after':round(len(words)*60/duration),'limitation':'Estimation incluant les pauses ; âge et naturel non évalués.'}
 clip['duration_s']=round(duration,3);clip['sha256']=hashlib.sha256(path.read_bytes()).hexdigest()
 changed.append(id);print(id,clip['pace']['estimated_words_per_minute_before'],'→',clip['pace']['estimated_words_per_minute_after'],flush=True)
MF.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print(len(changed),'lectures modérées, hauteur conservée.')
