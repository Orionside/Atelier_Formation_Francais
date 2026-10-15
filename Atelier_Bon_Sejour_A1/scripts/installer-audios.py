"""Installer un catalogue complet après confirmation des deux voix, sans voix de secours.
Usage : python3 scripts/installer-audios.py /chemin/catalogue.json
Catalogue : {voices:{f:{label,reference_sha256},m:{label,reference_sha256}},
 clips:{'<id>':{'file':'chemin relatif au catalogue.mp3'}}}
Les fichiers sont contrôlés avant toute modification du manifeste actif.
"""
import hashlib,json,re,shutil,subprocess,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def main():
    if len(sys.argv)!=2: raise SystemExit(__doc__)
    source=Path(sys.argv[1]).resolve(); catalog=json.loads(source.read_text())
    plan=json.loads((ROOT/'audio/plan.json').read_text()); rows=plan['clips']
    voices=catalog['voices']
    for v in ['f','m']:
        assert voices[v].get('label'),f'Nom de la voix {v} absent'
        assert re.fullmatch(r'[0-9a-f]{64}',voices[v].get('reference_sha256','')),f'Empreinte de référence {v} absente'
    approved=catalog.get('references_confirmees') is True
    assert approved,'Confirmer les deux références dans le catalogue : references_confirmees=true'
    files={}; checks=[]
    for row in rows:
        id=row['id']; assert re.fullmatch(r'[a-z0-9-]+',id)
        incoming=Path(catalog['clips'][id]['file'])
        if not incoming.is_absolute():incoming=source.parent/incoming
        assert incoming.is_file(),f'Audio absent : {id}'
        result=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','json',str(incoming)],check=True,capture_output=True,text=True)
        duration=float(json.loads(result.stdout)['format']['duration']); assert .15<duration<120,f'Durée invalide : {id}'
        files[id]=incoming;checks.append({'id':id,'duration':round(duration,3),'sha256':hashlib.sha256(incoming.read_bytes()).hexdigest()})
    dest=ROOT/'audio/sons';dest.mkdir(exist_ok=True)
    clips={}
    for row in rows:
        id=row['id']; ext=files[id].suffix.lower();assert ext in ['.mp3','.wav','.m4a','.ogg','.webm']
        target=dest/(id+ext);shutil.copy2(files[id],target);clips[id]={'file':'audio/sons/'+target.name,'text':row['text'],'voice':row['voice']}
    manifest={'version':1,'ready':True,'voices':voices,'clips':clips}
    staged=ROOT/'audio/manifest.js.tmp';staged.write_text('window.ATELIER_AUDIO = '+json.dumps(manifest,ensure_ascii=False)+';\n');staged.replace(ROOT/'audio/manifest.js')
    (ROOT/'audio/verification.json').write_text(json.dumps({'files':checks,'limite':'Contrôle de présence et durée. Vérification à l’oreille encore nécessaire.'},ensure_ascii=False,indent=2)+'\n')
    print(f'{len(clips)} fichiers installés. Contrôler à l’oreille avant diffusion.')
if __name__=='__main__':main()
