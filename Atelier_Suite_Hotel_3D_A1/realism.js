/* Modèles détaillés originaux : proportions, tombé textile et détails fonctionnels. */
export function realism(THREE, api) {
 const {B,C,L,S,G,mesh,MAT,TEX,LOW}=api, PI=Math.PI, V=THREE.Vector3;
 const thread=new THREE.MeshStandardMaterial({color:0xe5ddca,roughness:1});
 const hem=new THREE.MeshStandardMaterial({color:0xe6e0d5,roughness:.94});
 function tube(parent,points,r,mat,segments=32){const curve=new THREE.CatmullRomCurve3(points.map(p=>new V(...p)));const m=mesh(new THREE.TubeGeometry(curve,LOW?Math.ceil(segments*.65):segments,r,LOW?6:10,false),mat);parent.add(m);return m;}
 function cloth(parent,w,h,position,fn,mat=MAT.towel,nu=48,nv=56){const geo=new THREE.PlaneGeometry(w,h,LOW?24:nu,LOW?28:nv);const p=geo.attributes.position;for(let i=0;i<p.count;i++){const u=p.getX(i)/w+.5,v=.5-p.getY(i)/h;const q=fn(u,v);p.setXYZ(i,...q);}geo.computeVertexNormals();const m=mesh(geo,mat);m.position.set(...position);parent.add(m);return m;}
 function patch(parent,points,mat,depth=.012){const sh=new THREE.Shape();sh.moveTo(...points[0]);for(const p of points.slice(1))sh.lineTo(...p);sh.closePath();const geo=new THREE.ExtrudeGeometry(sh,{depth,bevelEnabled:true,bevelSize:.007,bevelThickness:.005,bevelSegments:3,steps:1});const m=mesh(geo,mat);parent.add(m);return m;}
 function foldedTowel(parent,x,y,z,w=.45,d=.35){const g=G(parent,x,y,z);const h=.055;
  // Trois couches distinctes, légèrement comprimées, arrondies par la souplesse du tissu.
  for(let k=0;k<3;k++){const m=B(w-(k%2)*.008,h*.58,d,MAT.towel,0,k*.021,0,g,{r:.015,seg:4});m.rotation.y=(k-1)*.007;}
  const seamPoints=[[-w*.46,.066,-d*.47],[0,.067,-d*.47],[w*.46,.066,-d*.47],[w*.48,.065,0],[w*.46,.066,d*.47],[0,.065,d*.47],[-w*.46,.066,d*.47],[-w*.48,.065,0],[-w*.46,.066,-d*.47]];tube(g,seamPoints,.0015,thread);
  // Bande de tissage plate près du bord, liserés parallèles.
  B(w-.014,.002,.038,hem,0,.071,-d*.28,g,{r:.001});for(const dz of [-.015,.015])tube(g,[[-w*.48,.073,-d*.28+dz],[w*.48,.073,-d*.28+dz]],.001,thread,8);
  // Bord replié visible, joint entre les deux faces du pli.
  tube(g,[[-w*.47,.027,d*.5],[0,.025,d*.505],[w*.47,.027,d*.5]],.0014,hem,16);return g;}
 function hangingTowel(parent,x,y,z,ry=0){const g=G(parent,x,y,z,ry),w=.55,h=.94;
  tube(g,[[-w*.5-.045,.008,-.014],[w*.5+.045,.008,-.014]],.014,MAT.chrome,12);tube(g,[[-w*.5,.005,.002],[w*.5,.005,.002]],.021,MAT.towel,12);
  const surface=(u,v)=>[(u-.5)*w,-v*h,.025+Math.sin(u*PI*8)*(.016+.012*v)+Math.sin(v*PI)*.012];
  cloth(g,w,h,[0,0,0],surface);cloth(g,w,h*.72,[0,-.006,-.024],(u,v)=>[(u-.5)*w,-v*h*.72,-.015+Math.sin(u*PI*8)*.01]);
  for(const u of [0,1])tube(g,Array.from({length:25},(_,i)=>surface(u,i/24)),.002,thread);
  for(const v of [.84,.88,.99])tube(g,Array.from({length:33},(_,i)=>surface(i/32,v).map((q,j)=>j===2?q+.002:q)),v===.99?.002:.003,hem);
  return g;}
 function bathrobe(parent,x,y,z,ry=0,scale=1){const g=G(parent,x,y,z,ry);g.scale.setScalar(scale);
  // Corps souple ouvert en V ; dos creux, deux pans croisés à l'avant.
  const body=(front)=>cloth(g,.62,1.12,[0,0,0],(u,v)=>{const width=.23+.065*v+.016*Math.cos(v*PI*2);const xx=(u-.5)*2*width;const fold=Math.sin(u*PI*11+v*.5)*(.009+v*.012);return [xx,1.76-v*1.12,(front?-.105:.085)+fold];});body(false);
  for(const side of [-1,1]){cloth(g,.35,1.12,[0,0,0],(u,v)=>{const outer=side*(.23+.065*v);const inner=side*(.105*(1-v)*Math.max(0,1-v*2.7)-.035*v);return [inner+(outer-inner)*u,1.76-v*1.12,-.116-Math.sin(u*PI*5+v)*.012-(side===1?.009:0)];});}
  // Coutures latérales et épaules : volume continu du vêtement.
  for(const side of [-1,1]){cloth(g,.22,1.12,[0,0,0],(u,v)=>[side*(.23+.065*v+Math.sin(u*PI)*.012),1.76-v*1.12,-.116+u*.202+Math.sin(v*PI*9)*.004]);cloth(g,.15,.21,[0,0,0],(u,v)=>[side*(.10+u*.135),1.77-Math.sin(v*PI)*.01,-.116+v*.202]);}
  // Épaules inclinées et deux manches tubulaires, poignets ouverts.
  for(const side of [-1,1]){const arm=new THREE.CatmullRomCurve3([new V(side*.20,1.73,0),new V(side*.34,1.60,.005),new V(side*.40,1.37,-.02),new V(side*.43,1.16,-.055)]);
   const geo=new THREE.TubeGeometry(arm,LOW?20:36,.105,LOW?12:20,false);const p=geo.attributes.position;for(let i=0;i<p.count;i++){p.setZ(i,p.getZ(i)+Math.sin(p.getY(i)*46)*.005);}geo.computeVertexNormals();g.add(mesh(geo,MAT.towel));
   const cuff=C(.108,.108,.055,hem,side*.43,1.13,-.055,g,{open:true,seg:28});cuff.rotation.z=side*.14;
   // Deux poches plaquées avec bord ouvert et surpiqûres.
   const pocket=patch(g,[[side*.075,1.13],[side*.235,1.12],[side*.23,.94],[side*.09,.94]],MAT.towel,.008);pocket.position.z=-.142;
   tube(g,[[side*.075,1.13,-.151],[side*.235,1.12,-.151]],.004,hem,8);
   tube(g,[[side*.09,1.11,-.153],[side*.10,.954,-.153],[side*.218,.954,-.153],[side*.227,1.10,-.153]],.0012,thread,20);
  }
  // Col châle épais : suit la nuque puis descend le long des deux pans.
  for(const side of [-1,1]){tube(g,[[side*.035,1.79,.065],[side*.105,1.79,.01],[side*.115,1.74,-.14],[side*.105,1.61,-.155],[side*.07,1.44,-.16],[side*.025,1.30,-.165]],.034,hem,40);}
  tube(g,[[-.035,1.79,.065],[0,1.795,.065],[.035,1.79,.065]],.034,hem,16);
  // Ceinture plate autour de la taille et nœud reconnaissable à deux boucles.
  cloth(g,1,.055,[0,0,0],(u,v)=>[Math.cos(u*PI*2)*.263,1.23+v*.055,Math.sin(u*PI*2)*.13-.012],hem,64,4);
  for(const side of [-1,1])tube(g,[[0,1.258,-.157],[side*.085,1.30,-.19],[side*.14,1.25,-.19],[side*.05,1.23,-.174],[0,1.258,-.157]],.013,hem);
  tube(g,[[0,1.25,-.17],[-.035,1.12,-.19],[-.08,.98,-.17]],.018,hem);tube(g,[[.02,1.25,-.18],[.09,1.10,-.18],[.095,1.00,-.15]],.018,hem);
  tube(g,[[-.29,.65,-.12],[-.14,.636,-.13],[0,.64,-.128],[.14,.636,-.14],[.29,.65,-.12]],.003,hem);
  // Boucle de suspension, crochet métallique.
  tube(g,[[-.03,1.78,.075],[0,1.86,.08],[.03,1.78,.075]],.007,hem);tube(g,[[0,1.86,.08],[0,1.90,.1],[0,1.91,.135],[0,1.87,.16]],.008,MAT.chrome);
  return g;}
 function slippers(parent,x,y,z,ry=0){const g=G(parent,x,y,z,ry);for(const side of [-1,1]){const f=G(g,side*.095,0,side*.025);const sole=S(1,MAT.white,0,.023,0,f,{sc:[.066,.023,.15],seg:32,seg2:16});
   cloth(f,.14,.17,[0,0,0],(u,v)=>{const a=u*PI;return [Math.cos(a)*.065,.035+Math.sin(a)*.065,-.135+v*.16];},MAT.towel,28,24);
   tube(f,Array.from({length:25},(_,i)=>[Math.cos(i/24*PI)*.067,.036+Math.sin(i/24*PI)*.067,.025]),.003,hem);tube(f,Array.from({length:49},(_,i)=>[Math.cos(i/48*PI*2)*.064,.024,Math.sin(i/48*PI*2)*.145]),.002,thread);
  }return g;}
 function hairdryer(parent){const g=G(parent);const body=L([[0,0],[.055,0],[.062,.025],[.06,.13],[.04,.18],[.028,.22],[.027,.25],[.022,.25],[.022,.22],[.045,.13],[0,.13]],MAT.white,0,0,0,g,{seg:40});body.rotation.z=-PI/2;body.position.set(-.23,.04,0);
  const dark=new THREE.MeshStandardMaterial({color:0x323737,roughness:.45});const grill=C(.051,.051,.008,dark,-.23,.036,0,g,{seg:40});grill.rotation.z=PI/2;for(let i=-3;i<=3;i++)tube(g,[[-.235,.043+i*.011,-.04],[-.235,.043+i*.011,.04]],.002,MAT.chrome,8);
  const handle=B(.048,.16,.052,MAT.white,-.16,-.13,0,g,{r:.018});handle.rotation.z=-.22;B(.012,.028,.043,dark,-.184,-.075,0,g,{r:.003});
  const cord=[];for(let i=0;i<=90;i++){const t=i/90;cord.push([-.15+Math.sin(t*PI*20)*.015,-.14-t*.35,Math.cos(t*PI*20)*.015]);}tube(g,cord,.004,dark,120);tube(g,[[-.15,-.49,0],[-.08,-.56,0],[-.025,-.48,0],[-.01,-.20,0]],.004,dark);return g;}
 function cup(parent,x,y,z,scale=1){const g=G(parent,x,y,z);g.scale.setScalar(scale);L([[0,0],[.034,0],[.045,.008],[.049,.074],[.046,.08],[.041,.078],[.039,.016],[.01,.009],[0,.009]],MAT.ceramic,0,0,0,g,{seg:40});tube(g,[[.044,.065,0],[.077,.073,0],[.087,.045,0],[.075,.02,0],[.044,.024,0]],.006,MAT.ceramic);C(.066,.055,.008,MAT.ceramic,0,-.008,0,g,{seg:40});return g;}
 function prepareTextures(){const make=(paint,size=512,repeat=1,srgb=true)=>{const c=document.createElement('canvas');c.width=c.height=size;const ctx=c.getContext('2d');paint(ctx,size);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(repeat,repeat);if(srgb)t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t;};
  TEX.terry=make((c,n)=>{c.fillStyle='#ede9df';c.fillRect(0,0,n,n);let sd=17;const rand=()=>((sd=(sd*16807)%2147483647)/2147483647);for(let i=0;i<19000;i++){const x=rand()*n,y=rand()*n;const k=210+rand()*38;c.strokeStyle=`rgb(${k},${k-2},${k-7})`;c.lineWidth=.65+rand()*.8;c.beginPath();c.ellipse(x,y,1+rand()*1.3,2+rand()*1.7,rand()*PI,0,PI*1.8);c.stroke();}},512,3);
  TEX.terryBump=make((c,n)=>{c.fillStyle='#999';c.fillRect(0,0,n,n);let sd=27;for(let i=0;i<16000;i++){sd=sd*16807%2147483647;const x=(sd%512);sd=sd*16807%2147483647;const y=sd%512;c.strokeStyle=i%2?'#ddd':'#777';c.lineWidth=1;c.beginPath();c.ellipse(x,y,1.5,2.6,.3,0,PI*1.8);c.stroke();}},512,3,false);
  TEX.walnut=make((c,n)=>{c.fillStyle='#9e7957';c.fillRect(0,0,n,n);let sd=73;for(let i=0;i<800;i++){sd=sd*16807%2147483647;const x=sd%512;c.strokeStyle=`rgba(60,34,15,${.025+(i%6)*.008})`;c.lineWidth=.4+(i%4)*.35;c.beginPath();for(let j=0;j<=32;j++){const yy=j*n/32,xx=x+Math.sin(j*.3+x*.05)*2.7;j?c.lineTo(xx,yy):c.moveTo(xx,yy);}c.stroke();}},512,1);
  TEX.marble=make((c,n)=>{c.fillStyle='#eae5db';c.fillRect(0,0,n,n);let sd=79;for(let k=0;k<10;k++){c.strokeStyle=k<3?'rgba(118,112,101,.12)':'rgba(148,139,122,.08)';c.lineWidth=k<3?1.2:.7;let x=(k*79)%n;c.beginPath();c.moveTo(x,0);for(let i=1;i<=45;i++){sd=sd*16807%2147483647;x+=(sd%100-50)*.13;c.lineTo(x,i*n/45);}c.stroke();}},1024,1);
 }
 function softenTextile(m){if(!m.geometry?.isBufferGeometry||!m.geometry.attributes?.position)return;const p=m.geometry.attributes.position;const geo=m.geometry;
  if(!/RoundedBox/.test(geo.type))return; // Les drapés explicites possèdent déjà leurs plis.
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const f=Math.sin(x*33+z*7)*Math.sin(z*28+y*3);const d=geo.parameters;const a=m.material===MAT.linen&&Math.max(d.width||0,d.depth||0)>1?.012:.0035;p.setXYZ(i,x,y+f*a,z+Math.sin(y*29+x*7)*a*.65);}geo.computeVertexNormals();}
 function details(INTER,STATIC){
  const roots=(id)=>INTER.filter(r=>r.userData.vid===id);const clear=r=>{while(r.children.length)r.remove(r.children[0]);};const rebound=r=>r.traverse(m=>{if(m.isMesh)m.userData.root=r;});
  for(const r of roots('serviettes')){clear(r);if(r.position.x<5){hangingTowel(r,.09,1.18,0,-PI/2);}else{for(const z of [-.6,0,.6])for(let i=0;i<2;i++)foldedTowel(r,0,i*.083,z,.42,.38);}r.userData.inspectionYaw=PI/2;r.userData.inspectionPitch=r.position.x>5?.6:.16;if(r.position.x>5)r.userData.inspectionSource=r.children[0];rebound(r);}
  for(const r of roots('peignoir')){clear(r);bathrobe(r,.13,0,0,-PI/2);r.userData.inspectionYaw=-PI/2;rebound(r);}
  for(const r of roots('chaussons')){r.userData.inspectionPitch=.70;clear(r);slippers(r,0,0,0,PI/2);rebound(r);}
  for(const r of roots('seche_cheveux')){clear(r);hairdryer(r);rebound(r);}
  for(const r of roots('robinet')){clear(r);for(const z of [-.55,.55]){C(.04,.045,.025,MAT.chrome,.19,.87,z,r,{seg:28});tube(r,[[.19,.89,z],[.19,1.12,z],[.17,1.19,z],[.08,1.21,z],[-.06,1.17,z],[-.08,1.12,z]],.018,MAT.chrome,44);B(.065,.014,.025,MAT.chrome,.19,1.16,z+.08,r,{r:.005});}rebound(r);}
  for(const r of roots('tasses')){r.userData.inspectionPitch=.42;clear(r);B(.26,.016,.25,MAT.walnut,0,0,0,r,{r:.006});cup(r,0,.025,-.07,.8);cup(r,0,.025,.07,.8);rebound(r);}
  // Petites pièces fonctionnelles : une télécommande se distingue d'un pavé noir.
  for(const r of roots('telecommande')){for(let row=0;row<6;row++)for(let col=-1;col<=1;col++){const b=S(.0033,row===0&&col===-1?MAT.coral:MAT.white,col*.012,.0105,-.056+row*.019,r,{sc:[1,.35,1],seg:8,seg2:6});}rebound(r);}
  for(const r of roots('valise')){for(const side of [-1,1]){C(.005,.005,.30,MAT.chrome,side*.07,.71,0,r,{seg:12});}B(.17,.02,.03,MAT.blackMetal,0,1.00,0,r,{r:.009});tube(r,[[-.226,.055,-.13],[-.232,.36,-.13],[-.21,.71,-.13],[.21,.71,-.13],[.232,.36,-.13],[.226,.055,-.13]],.002,MAT.blackMetal);for(const x of [-.17,.17])for(const z of [-.09,.09]){const wheel=C(.026,.026,.02,MAT.blackMetal,x,.025,z,r,{seg:20});wheel.rotation.z=PI/2;}rebound(r);}
  // Cartes, passeport, savon : détails sémantiques, jamais de données personnelles réelles.
  for(const r of roots('savon')){for(const z of [.12,.2]){const ring=C(.011,.011,.006,MAT.brass,.02,.16,z,r,{seg:16});B(.052,.006,.009,MAT.brass,0,.19,z,r,{r:.002});}rebound(r);}
  for(const r of roots('toilettes')){ // Siège annulaire et creux visibles.
   const lid=r.children.find(m=>m.isMesh&&m.geometry.type==='RoundedBoxGeometry');
   if(lid){}const ring=mesh(new THREE.TorusGeometry(.17,.027,12,48),MAT.ceramic);ring.rotation.x=PI/2;ring.scale.y=1.35;ring.position.set(0,.465,-.025);r.add(ring);rebound(r);
  }
  for(const r of roots('telephone')){for(let row=0;row<4;row++)for(let col=-1;col<=1;col++)B(.011,.003,.009,MAT.white,col*.021,.039,-.004+row*.017,r,{r:.002});tube(r,[[-.075,.045,0],[-.11,.04,-.04],[-.13,.012,-.06],[-.12,-.01,.08]],.004,MAT.blackMetal);rebound(r);}

  // Détails lisibles des objets personnels, sans agrandir artificiellement leurs dimensions dans la pièce.
  for(const r of INTER.filter(r=>r.userData.obj==='chargeur')){for(const x of [-.011,.011])C(.0025,.0025,.017,MAT.chrome,x,.029,.002,r,{seg:12});B(.017,.006,.004,MAT.blackMetal,0,.01,-.024,r,{r:.001});rebound(r);}
  for(const r of INTER.filter(r=>r.userData.obj==='portable')){const lens=G(r,0,.010,0);for(const x of [-.021,-.007])C(.004,.004,.002,MAT.chrome,x,.002,-.058,lens,{seg:16});B(.012,.001,.002,MAT.white,0,.010,.06,r,{r:.001});rebound(r);}
  for(const r of INTER.filter(r=>r.userData.obj==='portefeuille')){tube(r,[[-.052,.022,-.04],[-.052,.022,.04],[.052,.022,.04],[.052,.022,-.04]],.0007,hem,32);B(.001,.009,.085,MAT.leather,.060,.006,0,r);rebound(r);}
  for(const r of INTER.filter(r=>r.userData.obj==='mouchoirs')){for(const m of [...r.children])if(m.geometry?.type==='ConeGeometry')r.remove(m);cloth(r,.09,.11,[0,.091,0],(u,v)=>[(u-.5)*.09,v*.10,Math.sin(u*PI*4+v)*.008+v*.015],MAT.linen,24,24);rebound(r);}
  for(const r of roots('papier_toilette')){tube(r,[[-.10,.0,-.05],[-.1,-.025,-.05],[-.1,-.09,-.047]],.002,MAT.white);const strip=cloth(r,.09,.12,[-.1,0,0],(u,v)=>[0,-.04-v*.12,(u-.5)*.09+.05+v*.015],MAT.linen,16,24);rebound(r);}
  // Machine à café : grille d'égouttage, commandes et tasse sous la buse.
  for(const r of roots('machine_cafe')){for(let i=0;i<5;i++)B(.11,.002,.004,MAT.blackMetal,-.08,.082,-.035+i*.017,r,{r:.001});for(const z of [-.06,.06]){const b=S(.012,MAT.chrome,-.122,.255,z,r,{sc:[.25,1,1],seg:16});}const c=cup(r,-.09,.085,0,.58);rebound(r);}
  // Documents : couverture, emblème, pages et carte d'identité fictive.
  for(const id of ['passeport','carte_identite'])for(const r of roots(id)){const canvas=document.createElement('canvas');canvas.width=256;canvas.height=384;const c=canvas.getContext('2d');c.fillStyle=id==='passeport'?'#531e30':'#e9f0ef';c.fillRect(0,0,256,384);c.strokeStyle='#cbae65';c.lineWidth=4;c.strokeRect(12,12,232,360);c.fillStyle=id==='passeport'?'#d9c584':'#28505a';c.textAlign='center';c.font='22px sans-serif';c.fillText(id==='passeport'?'PASSEPORT':'IDENTITÉ',128,62);if(id==='passeport'){c.beginPath();c.arc(128,175,58,0,PI*2);c.stroke();for(const x of [105,128,151]){c.beginPath();c.ellipse(128,175,Math.abs(x-128)+11,58,0,0,PI*2);c.stroke();}for(const y of [150,175,200]){c.beginPath();c.moveTo(70,y);c.lineTo(185,y);c.stroke();}}else{c.fillRect(24,115,74,90);for(let i=0;i<5;i++)c.fillRect(112,124+i*18,115-i*8,4);c.font='17px sans-serif';c.fillText('EXEMPLE FICTIF',128,292);}const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;const label=mesh(new THREE.PlaneGeometry(id==='passeport'?.087:.080,id==='passeport'?.120:.050),new THREE.MeshStandardMaterial({map:t,roughness:.6}));label.rotation.x=-PI/2;label.position.y=id==='passeport'?.0065:.0025;r.add(label);rebound(r);}
  // Papiers, cintres et textiles de mobilier : surpiqûres et finitions.
  for(const r of roots('cintres')){clear(r);for(let i=0;i<6;i++){const h=G(r,-.62+i*.23,2.0,.02,PI/2);tube(h,[[-.20,-.10,0],[0,.045,0],[.20,-.10,0],[-.20,-.10,0]],.009,MAT.walnut,24);tube(h,[[0,.04,0],[0,.10,0],[.035,.15,0],[.045,.12,0],[.02,.10,0]],.004,MAT.chrome,24);}rebound(r);}
  for(const r of roots('coffre')){for(let row=0;row<4;row++)for(let col=0;col<3;col++)B(.012,.012,.003,MAT.chrome,.094+col*.020,.11+row*.019,-.193,r,{r:.0015});rebound(r);}
  for(const r of roots('receptionniste')){const head=r.userData.head;if(head){const hair=head.children.find(m=>m.isMesh&&m.material===MAT.hair);if(hair){hair.scale.z=.78;hair.position.z=.045;}S(.014,MAT.skin,0,-.012,-.100,head,{sc:[.65,1.3,1.2]});for(const side of [-1,1]){S(.017,MAT.skin,side*.09,0,0,head,{sc:[.55,1.15,.7]});tube(head,[[side*.023,.027,-.095],[side*.039,.031,-.095],[side*.05,.025,-.089]],.002,MAT.hair,12);}}rebound(r);}


  // Petit déjeuner : croissants effilés en couches et vraie anse sur la tasse.
  for(const r of roots('cafe')){clear(r);cup(r,0,.008,0,.78);C(.030,.030,.0015,new THREE.MeshPhysicalMaterial({color:0x3c2415,roughness:.22,clearcoat:.6}),0,.060,0,r,{seg:40});rebound(r);}
  for(const r of roots('croissants')){clear(r);C(.105,.095,.008,MAT.ceramic,0,0,0,r,{seg:48});for(const [x,z,ry] of [[-.014,-.035,.25],[.012,.038,-.35]]){const g=G(r,x,.030,z,ry),N=LOW?32:56,K=16,pos=[],uv=[],colors=[],indices=[];
   for(let i=0;i<=N;i++)for(let j=0;j<=K;j++){const u=i/N,v=j/K,theta=(u-.5)*PI*1.42;const radius=.021*Math.pow(Math.sin(u*PI),.65)*(1+.085*Math.cos(u*PI*18))+.001;const a=v*PI*2;pos.push(Math.sin(theta)*(.046+Math.cos(a)*radius),Math.sin(a)*radius*.78,-Math.cos(theta)*(.046+Math.cos(a)*radius));uv.push(u,v);const browned=.65+.14*Math.sin(a)+.10*Math.cos(u*PI*18);colors.push(browned,.40+.18*Math.sin(a)+.06*Math.cos(u*PI*18),.12+.10*Math.sin(a));if(i<N&&j<K){const k=i*(K+1)+j;indices.push(k,k+K+1,k+1,k+1,k+K+1,k+K+2);}}
   const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geo.setIndex(indices);geo.computeVertexNormals();g.add(mesh(geo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.72,side:THREE.DoubleSide})));}r.userData.inspectionPitch=.65;rebound(r);}
  for(const r of roots('jus_orange')){const rim=mesh(new THREE.TorusGeometry(.031,.0014,8,40),MAT.glass);rim.rotation.x=PI/2;rim.position.y=.122;r.add(rim);rebound(r);}
  for(const r of roots('fruits')){const darkStem=new THREE.MeshStandardMaterial({color:0x67442b,roughness:.85});tube(r,[[-.07,.14,.02],[-.075,.16,.02]],.0025,darkStem,8);tube(r,[[.06,.14,-.04],[.06,.16,-.035]],.0025,darkStem,8);rebound(r);}

  // Chaque matériau textile reçoit un vrai micro-relief, les autres objets gardent leurs interactions.
  STATIC.traverse(m=>{if(m.isMesh&&[MAT.linen,MAT.boucle,MAT.towel,MAT.velvetTeal,MAT.velvetMustard].includes(m.material))softenTextile(m);});
 }
 return {prepareTextures,details,bathrobe,foldedTowel,hangingTowel,slippers,cup,tube,cloth};
}
