from pathlib import Path
root=Path(__file__).resolve().parents[2];src=root/'Atelier_GLP1_Oral_B2_v2';out=root/'Atelier_GLP1_UIUX_Comparatifs_v1'
s=(src/'index.html').read_text()
start=s.index('<link rel="preconnect"');end=s.index('<style>',start);s=s[:start]+s[end:]
s=s.replace('</style>','</style>\n<link rel="stylesheet" href="ui.css">',1)
s=s.replace('src="contenu.js','src="../Atelier_GLP1_Oral_B2_v2/contenu.js').replace('src="audio/','src="../Atelier_GLP1_Oral_B2_v2/audio/')
s=s.replace('var KEY = "impact60-" + M.id','var KEY = "glp-ux-" + UX_VARIANT + "-" + M.id')
s=s.replace('var src=clip.file;','var src=(window.GLP_UX_AUDIO_IDS && window.GLP_UX_AUDIO_IDS[id])?clip.file:(clip.file.startsWith("../")?clip.file:"../Atelier_GLP1_Oral_B2_v2/"+clip.file);')
s=s.replace('video.src="video/glp1.mp4"','video.src="../Atelier_GLP1_Oral_B2_v2/video/glp1.mp4"')
s=s.replace('Étapes terminées','Étapes parcourues')
s=s.replace('(on?"Arrêter : ":"Écouter : ")+clip.display_text','(on?"Arrêter : ":"Écouter : ")+(b.dataset.uxLabel || clip.display_text)')
s=s.replace('render();\n})();','\n/* Extensions de comparaison, séparées du support source. */\n'+(out/'scripts/ui-extension.js').read_text()+'\nrender();\n})();')
s=s.replace('<script>\n(function(){','<script src="audio/catalogue.js"></script>\n<script src="audio/manifest.js"></script>\n<script src="atelier-data.js"></script>\n<script>\n(function(){',1)
for variant,file in [('focus','focus.html'),('oral','atelier.html')]:
 page=s.replace('var C = window.IMPACT60;','var UX_VARIANT="'+variant+'";\nvar C = window.IMPACT60;')
 (out/file).write_text(page)
print('Deux versions séparées construites.')
