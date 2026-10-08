import json
from pathlib import Path
import mlx_whisper
r=mlx_whisper.transcribe('/Users/toufik/impact60_mesure/travail/glp1-source.mp4',path_or_hf_repo='mlx-community/whisper-large-v3-turbo',language='fr',word_timestamps=True,condition_on_previous_text=False,verbose=None)
Path('/Users/toufik/impact60_mesure/travail/glp1-transcription-verifiee.json').write_text(json.dumps(r,ensure_ascii=False,indent=2))
for s in r['segments']:print(round(s['start'],2),round(s['end'],2),s['text'],flush=True)
