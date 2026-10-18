import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

const P=Math.PI,base='assets/atelier18/',loader=new THREE.TextureLoader();
export async function prepareAtelier(MAT,renderer,LOW){
 const sets={};
 await Promise.all(['terry_cloth','cotton_jersey','wool_boucle','rough_linen','velour_velvet'].map(async id=>{
  const maps={};await Promise.all(['neutral','nor_gl','rough'].map(async kind=>{const t=await loader.loadAsync(base+id+'/'+kind+(LOW?'-mobile':'')+'.webp');t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());if(kind==='neutral')t.colorSpace=THREE.SRGBColorSpace;maps[kind]=t;}));sets[id]=maps;
 }));
 function texture(mat,id,repeat,color,normal=.3){
  for(const [slot,key]of [['map','neutral'],['normalMap','nor_gl'],['roughnessMap','rough']]){mat[slot]=sets[id][key].clone();mat[slot].repeat.set(...repeat);mat[slot].needsUpdate=true;}
  mat.bumpMap=null;mat.color.set(color);mat.normalScale=new THREE.Vector2(normal,normal);mat.needsUpdate=true;return mat;
 }
 texture(MAT.towel,'terry_cloth',[1.6,2.3],0xffffff,.65);MAT.towel.roughness=1;MAT.towel.sheen=.7;
 texture(MAT.linen,'cotton_jersey',[3,3],0xffffff,.12);MAT.linen.roughness=.94;MAT.linen.sheen=.45;
 texture(MAT.boucle,'rough_linen',[3,3],0xd9d0be,.30);
 texture(MAT.velvetMustard,'velour_velvet',[2,2],0xc6a04a,.20);texture(MAT.velvetTeal,'velour_velvet',[2,2],0x35615c,.20);
 texture(MAT.rug,'wool_boucle',[6,7],0xb9b19c,.85);MAT.rug.roughness=1;
 texture(MAT.rugBath,'terry_cloth',[3,3],0xeee9df,.65);
 for(const m of [MAT.plaster,MAT.plasterWarm])texture(m,'rough_linen',[7,7],m===MAT.plaster?0xf0eae0:0xe7ddcd,.075);
 const cottonHem=texture(new THREE.MeshPhysicalMaterial({roughness:.95,sheen:.45,side:THREE.DoubleSide}),'cotton_jersey',[3,3],0xf7f3e8,.16);
 const upholstered=texture(new THREE.MeshPhysicalMaterial({roughness:.96,sheen:.55,side:THREE.DoubleSide}),'rough_linen',[5,4],0xc4b89e,.3);
 const botany=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(base+'foliage.glb');
 return {texture,cottonHem,upholstered,foliage:botany.scene.getObjectByName('anthurium_botany_01_a')};
}

export function installAtelier({STATIC,INTER,MAT,REAL,B,C,L,S,G,reg,DYN,LIGHTS,LOW},materials){
 const roots=id=>INTER.filter(r=>r.userData.vid===id),V=THREE.Vector3;
 const metal=new THREE.MeshPhysicalMaterial({color:0x242a28,metalness:.65,roughness:.33});
 const brushed=new THREE.MeshPhysicalMaterial({color:0xc5c5bd,metalness:.95,roughness:.27});
 const ceramic=new THREE.MeshPhysicalMaterial({color:0xece6d9,roughness:.24,clearcoat:.65,clearcoatRoughness:.15});
 const hem=materials.cottonHem;
 const bind=r=>r.traverse(o=>{if(o.isMesh&&!o.userData.root)o.userData.root=r;});
 const clear=r=>{r.clear();delete r.userData.inspectionSource;};
 const tube=(parent,points,r,mat,n=32)=>REAL.tube(parent,points,r,mat,n);
 function surface(parent,nu,nv,fn,mat){return REAL.cloth(parent,1,1,[0,0,0],fn,mat,nu,nv);}
 function rod(parent,a,b,r,mat){const d=new V(...b).sub(new V(...a)),m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,d.length(),12),mat);m.position.copy(new V(...a).add(new V(...b)).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new V(0,1,0),d.normalize());parent.add(m);return m;}
 function puff(parent,w,h,d,mat,x,y,z,tilt=.15,flange=false){
  const g=G(parent,x,y,z);g.rotation.z=tilt;const N=LOW?32:52,M=LOW?24:40,vertices=[],uv=[],indices=[];
  for(const side of [1,-1])for(let j=0;j<=M;j++)for(let i=0;i<=N;i++){
   const u=i/N*2-1,v=j/M*2-1,e=Math.max(0,(1-Math.abs(u)**6)*(1-Math.abs(v)**6)),bulge=d*.5*Math.pow(e,.46);
   const wrinkle=(.004*Math.sin(v*46+u*8)*Math.exp(-Math.pow((Math.abs(u)-.88)/.17,2))+.004*Math.sin(u*52+v*7)*Math.exp(-Math.pow((Math.abs(v)-.88)/.16,2)))*e;
   vertices.push(side*(.003+bulge+wrinkle),v*h*.5*(1-.025*Math.abs(u)**8),u*w*.5*(1-.045*Math.abs(v)**8));uv.push(i/N,j/M);
  }
  const count=(N+1)*(M+1);
  for(let s=0;s<2;s++)for(let j=0;j<M;j++)for(let i=0;i<N;i++){const a=s*count+j*(N+1)+i;const q=[a,a+N+1,a+1,a+1,a+N+1,a+N+2];indices.push(...(s?q.reverse():q));}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();g.add(new THREE.Mesh(geo,mat));
  const edge=[];for(let i=0;i<=160;i++){const a=i/160*P*2,c=Math.cos(a),s=Math.sin(a);edge.push([.004,Math.sign(s)*Math.abs(s)**.30*h*.5,Math.sign(c)*Math.abs(c)**.30*w*.5]);}
  tube(g,edge,.0018,hem,160);
  if(flange){surface(g,64,8,(u,v)=>{const a=u*P*2,c=Math.cos(a),s=Math.sin(a),ex=v*.025;return[-.001+Math.sin(a*12)*ex*.10,Math.sign(s)*Math.abs(s)**.30*(h*.5+ex),Math.sign(c)*Math.abs(c)**.30*(w*.5+ex)];},MAT.linen);}
  return g;
 }
 // Literie : quatre oreillers distincts, taies à volant et deux coussins jaunes.
 for(const r of roots('oreillers')){clear(r);for(const [x,y,z,tilt]of [[-.82,.98,-.48,.15],[-.82,.98,.48,.18],[-.59,.88,-.47,.26],[-.59,.88,.47,.28]])puff(r,.78,.51,.22,MAT.linen,x,y,z,tilt,true);r.userData.inspectionYaw=-P/2+.12;bind(r);}
 for(const r of roots('coussins')){clear(r);for(const z of [-.29,.29])puff(r,.45,.43,.17,MAT.velvetMustard,-.30,.88,z,.27);r.userData.inspectionYaw=-P/2+.12;bind(r);}
 for(const r of roots('couette').slice(0,1)){
  r.updateWorldMatrix(true,true);r.traverse(o=>{if(!o.isMesh)return;o.geometry=o.geometry.clone();const old=o.geometry.attributes.position,array=new Float32Array(old.count*3);
   for(let i=0;i<old.count;i++){array[i*3]=old.getX(i);array[i*3+1]=old.getY(i);array[i*3+2]=old.getZ(i);}o.geometry.setAttribute('position',new THREE.BufferAttribute(array,3));o.geometry.deleteAttribute('normal');const pos=o.geometry.attributes.position;
   const matrix=new THREE.Matrix4().copy(r.matrixWorld).invert().multiply(o.matrixWorld),inverse=matrix.clone().invert(),point=new V();
   for(let i=0;i<pos.count;i++){point.fromBufferAttribute(pos,i).applyMatrix4(matrix);const {x,y,z}=point;if(y>.675&&x>-.50&&x<1.02){const a=Math.min(1,(y-.675)/.055),cell=Math.sin((x+.51)*P*3.0)**2*Math.sin((z+1.22)*P*1.65)**2;point.y=y*(1-a)+a*(.760+(y-.715)*.25+.075*cell);}point.applyMatrix4(inverse);pos.setXYZ(i,point.x,point.y,point.z);}
   o.geometry.computeVertexNormals();});
  surface(r,44,70,(u,v)=>{const x=-.51+u*.25,z=(v-.5)*1.96;return[x,.802+Math.sin(u*P)*.024+.005*Math.sin(v*37+u*9),z];},MAT.linen);r.userData.inspectionPitch=.62;bind(r);
 }
 // La tête de lit devient un panneau capitonné ; les anciens blocs sont retirés.
 const head=roots('tete_lit')[0];if(head){const parent=head.parent;for(const c of [...parent.children])if(c.isMesh&&c.material===MAT.boucle&&c!==head){c.geometry.computeBoundingBox();const s=c.geometry.boundingBox.getSize(new V());if(s.x<.2&&s.y>1&&s.z<.5)parent.remove(c);}
  for(const c of [...head.children])head.remove(c);
  const w=2.42,h=1.30,cy=-.22;
  function tuft(u,v){let dent=0;for(let j=0;j<4;j++)for(let i=0;i<6;i++){const uu=(i+.5+(j%2)*.3)/6,vv=(j+.45)/4;dent+=.063*Math.exp(-(((u-uu)*w/.065)**2+((v-vv)*h/.065)**2));}return .095-dent+.005*Math.sin(u*P*18)*Math.sin(v*P*12);}
  surface(head,108,70,(u,v)=>[tuft(u,v),cy+(v-.5)*h,(u-.5)*w],materials.upholstered);
  for(let j=0;j<4;j++)for(let i=0;i<6;i++){const u=(i+.5+(j%2)*.3)/6,v=(j+.45)/4;if(u>1)continue;const b=S(.012,materials.upholstered,tuft(u,v)+.003,cy+(v-.5)*h,(u-.5)*w,head,{sc:[.4,1,1],seg:12,seg2:8});}
  const border=[];for(let i=0;i<=160;i++){const a=i/160*P*2;border.push([.050,cy+Math.sign(Math.sin(a))*Math.abs(Math.sin(a))**.15*h*.5,Math.sign(Math.cos(a))*Math.abs(Math.cos(a))**.15*w*.5]);}tube(head,border,.006,materials.upholstered,160);head.userData.inspectionYaw=-P/2+.12;bind(head);
 }
 // Tapis de laine : véritable surface bouclée, épaisseur et finition surjetée.
 for(const r of roots('tapis')){r.geometry.computeBoundingBox();const s=r.geometry.boundingBox.getSize(new V());r.geometry=new RoundedBoxGeometry(s.x,.026,s.z,3,.012);r.position.y=.016;r.material=MAT.rug;
  for(const side of [-1,1])tube(r,[[side*(s.x/2-.015),.009,-s.z/2+.02],[side*(s.x/2-.015),.010,s.z/2-.02]],.004,hem,32);
  for(const side of [-1,1])tube(r,[[-s.x/2+.02,.010,side*(s.z/2-.015)],[s.x/2-.02,.010,side*(s.z/2-.015)]],.004,hem,32);bind(r);
 }
 // Table de nuit à deux tiroirs : joints, poignées creuses, chants et pieds.
 for(const r of roots('table_nuit')){for(const n of r.children.filter(c=>c.isGroup)){clear(n);B(.50,.045,.55,MAT.walnut,0,.51,0,n,{r:.009});B(.48,.44,.52,MAT.oakFurn,0,.065,0,n,{r:.008});
   for(const y of [.09,.30]){B(.018,.195,.488,MAT.walnut,.250,y,0,n,{r:.004});tube(n,[[.270,y+.105,-.07],[.285,y+.105,-.07],[.285,y+.105,.07],[.270,y+.105,.07]],.004,brushed,20);}
   for(const x of [-.20,.20])for(const z of [-.22,.22])C(.012,.016,.065,metal,x,0,z,n,{seg:16});}r.userData.inspectionSource=r.children[0];r.userData.inspectionYaw=-P/2+.20;bind(r);}
 // Abat-jour en lin : bords roulés, intérieur, ampoule et pied céramique émaillée.
 for(const r of roots('lampe_chevet')){let i=0;for(const g of r.children.filter(c=>c.isGroup)){
  const entry=LIGHTS.chevet?.[i++];g.clear();C(.10,.10,.012,MAT.brass,0,0,0,g,{seg:48});L([[0,0],[.065,0],[.080,.025],[.076,.11],[.055,.19],[.03,.24],[.024,.28]],ceramic,0,.012,0,g,{seg:64});C(.007,.007,.09,brushed,0,.28,0,g,{seg:20});
  const shade=MAT.lampOn.clone();shade.map=MAT.linen.map;shade.normalMap=MAT.linen.normalMap;shade.emissiveIntensity=0;C(.105,.165,.24,shade,0,.34,0,g,{seg:64,open:true,cast:false});
  for(const [y,rad]of [[.34,.165],[.58,.105]]){const rim=new THREE.Mesh(new THREE.TorusGeometry(rad,.0024,8,64),hem);rim.rotation.x=P/2;rim.position.y=y;g.add(rim);}for(const a of [0,P*2/3,P*4/3])rod(g,[0,.36,0],[Math.cos(a)*.16,.342,Math.sin(a)*.16],.0015,brushed);
  if(entry){g.add(entry.light);entry.light.position.set(0,.41,0);entry.mat=shade;}
 }bind(r);}
 // Bureau Charme : 120 × 45 × 75 cm, deux niches et tiroir central.
 for(const r of roots('bureau')){clear(r);const dark=MAT.walnut.clone();dark.color.set(0x3a2a20);const niche=new THREE.MeshStandardMaterial({color:0x34616a,roughness:.66});
  B(1.20,.027,.45,MAT.oakFurn,0,.723,0,r,{r:.006});B(1.20,.018,.45,dark,0,.555,0,r,{r:.003});B(.018,.15,.45,dark,-.591,.573,0,r);B(.018,.15,.45,dark,.591,.573,0,r);B(1.17,.15,.014,dark,0,.573,.218,r);
  for(const x of [-.34,.34])B(.016,.15,.435,dark,x,.573,0,r);for(const x of [-.465,.465]){B(.23,.003,.415,niche,x,.575,0,r);B(.23,.13,.005,niche,x,.581,.208,r);}
  B(.65,.144,.019,MAT.walnut,0,.578,-.226,r,{r:.003});B(.105,.035,.006,brushed,0,.636,-.239,r,{r:.003});
  for(const x of [-.565,.565])for(const z of [-.185,.185]){const leg=B(.048,.56,.048,dark,x,.012,z,r,{r:.007});leg.rotation.z=-Math.sign(x)*.018;B(.052,.060,.052,brushed,x,0,z,r,{r:.004});}
  for(const z of [-.185,.185]){B(1.09,.055,.035,dark,0,.51,z,r,{r:.008});for(const side of [-1,1]){const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(-side*.12,0);sh.quadraticCurveTo(-side*.022,-.015,0,-.12);sh.closePath();const support=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:.035,bevelEnabled:true,bevelSize:.002,bevelThickness:.002,bevelSegments:2,curveSegments:24}),dark);support.position.set(side*.54,.555,z-.0175);r.add(support);}}r.userData.inspectionYaw=P+.25;bind(r);
 }
 for(const r of roots('telephone'))if(r.position.z<5){r.position.x=-.42;r.position.y=.754;}
 for(const r of roots('wifi'))if(r.position.z<5){r.position.x=.12;r.position.y=.754;}
 // Lampe d'architecte noire : deux bras parallèles, articulations, ressorts et abat-jour creux.
 for(const r of roots('lampe_bureau')){const entry=LIGHTS.bureau?.[0];r.position.x=.43;r.position.y=.754;clear(r);C(.084,.090,.018,metal,0,0,0,r,{seg:64});C(.018,.024,.035,brushed,0,.018,0,r,{seg:32});
  const a=[0,.055,0],b=[-.035,.25,.07],c=[.020,.44,-.055];for(const dx of [-.012,.012]){rod(r,[a[0]+dx,a[1],a[2]],[b[0]+dx,b[1],b[2]],.004,metal);rod(r,[b[0]+dx,b[1],b[2]],[c[0]+dx,c[1],c[2]],.004,metal);}
  for(const pt of [a,b,c]){const q=C(.013,.013,.036,brushed,...pt,r,{seg:24});q.rotation.z=P/2;}
  for(const dx of [-.022,.022]){const points=[];for(let i=0;i<=100;i++){const t=i/100;points.push([dx+Math.sin(t*P*26)*.004,.07+t*.15,.012+t*.043+Math.cos(t*P*26)*.004]);}tube(r,points,.0011,brushed,100);}
  const shade=G(r,...c);shade.rotation.x=-.32;L([[.013,.10],[.035,.075],[.071,.025],[.072,.008],[.069,.005],[.064,.013],[.030,.069],[.010,.092]],metal,0,-.09,0,shade,{seg:64});
  const inner=new THREE.MeshStandardMaterial({color:0xf5eee0,roughness:.65,side:THREE.DoubleSide});C(.012,.065,.077,inner,0,-.085,0,shade,{seg:48,open:true});const bulb=new THREE.MeshStandardMaterial({color:0xfff2cf,emissive:0xffcf7d,emissiveIntensity:0,roughness:.30});S(.018,bulb,0,-.060,0,shade,{seg:24,seg2:16});
  tube(r,[[0,.012,.01],[.03,.002,.09],[.08,-.005,.12],[.1,-.08,.12]],.002,metal,30);
  if(entry){r.add(entry.light);entry.light.position.set(.02,.37,-.06);entry.mat=bulb;entry.max=1.25;}r.userData.inspectionYaw=P/2+.15;bind(r);
 }
 // Climatiseur split : capot, joint inférieur, prise d'air et ailettes mobiles.
 const ac=DYN.ac?.flap.parent;if(ac){const flap=DYN.ac.flap,disp=DYN.ac.disp;clear(ac);const shell=new THREE.MeshPhysicalMaterial({color:0xf1f0eb,roughness:.28,clearcoat:.25});B(.86,.278,.210,shell,0,0,0,ac,{r:.035,seg:5});B(.80,.024,.008,MAT.blackMetal,0,.032,-.106,ac,{r:.006});
  for(let i=0;i<22;i++)B(.025,.002,.13,metal,-.37+i*.035,.274,.012,ac);for(const x of [-.40,.40])B(.001,.19,.16,hem,x,.045,.002,ac);
  ac.add(flap,disp);flap.position.set(0,.044,-.110);flap.clear();B(.78,.009,.070,shell,0,0,-.025,flap,{r:.003});for(let i=0;i<14;i++)B(.002,.022,.055,metal,-.35+i*.053,-.010,.020,flap);disp.position.set(.29,.16,-.108);ac.userData.inspectionYaw=P+.20;bind(ac);
 }
 // Valises rigides : coque striée, renforts cuir, double zip, serrure et quatre roulettes doubles.
 for(const r of roots('valise')){clear(r);const shell=new THREE.MeshPhysicalMaterial({color:0xddd2b7,roughness:.43,clearcoat:.20,normalMap:MAT.leather.normalMap,normalScale:new THREE.Vector2(.10,.10)});const leather=MAT.leather.clone();leather.color.set(0x69432a);
  B(.41,.56,.25,shell,0,.055,0,r,{r:.055,seg:6});for(const side of [-1,1]){
   for(let i=-5;i<=5;i++)B(.009,.44,.004,shell,i*.029,.113,side*.126,r,{r:.003});
   for(const x of [-.167,.167])for(const y of [.095,.515]){B(.071,.078,.007,leather,x,y,side*.125,r,{r:.022});S(.003,brushed,x,y+.035,side*.132,r,{seg:10,seg2:6});}
  }
  const edge=[];for(let i=0;i<=120;i++){const t=i/120*P*2;edge.push([Math.sign(Math.cos(t))*Math.abs(Math.cos(t))**.18*.208,.336+Math.sign(Math.sin(t))*Math.abs(Math.sin(t))**.18*.278,0]);}
  for(const z of [-.005,.005])tube(r,edge.map(p=>[p[0],p[1],z]),.002,metal,120);
  for(const x of [-.075,.075]){C(.007,.007,.31,brushed,x,.58,.080,r,{seg:16});B(.024,.07,.036,leather,x,.555,.078,r,{r:.009});}B(.18,.024,.035,leather,0,.87,.08,r,{r:.012});
  tube(r,[[-.08,.617,0],[-.07,.645,0],[.07,.645,0],[.08,.617,0]],.012,leather,32);
  for(const x of [-.15,.15])for(const z of [-.08,.08]){B(.026,.025,.034,metal,x,.029,z,r,{r:.008});for(const side of [-1,1]){const wheel=C(.025,.025,.014,metal,x+side*.012,.026,z,r,{seg:28});wheel.rotation.z=P/2;const axle=C(.009,.009,.015,brushed,x+side*.012,.026,z,r,{seg:16});axle.rotation.z=P/2;}}
  const lock=G(r,.207,.37,0);B(.008,.095,.052,metal,0,0,0,lock,{r:.004});for(let i=0;i<3;i++)B(.010,.014,.013,brushed,.006,.019+i*.020,0,lock,{r:.003});for(const y of [.30,.33])B(.026,.045,.003,brushed,.205,y,-.031,r,{r:.005});r.userData.inspectionYaw=.35;bind(r);
 }
 // Armoire : placage chaud, verres fumés, deux vantaux fonctionnels, étagères et LED intégrées.
 for(const r of roots('placard')){const keep=r.children.filter(c=>c.userData.vid||DYN.wardDoors.some(d=>d.hinge===c));for(const c of [...r.children])if(!keep.includes(c))r.remove(c);
  for(const x of [-1.18,1.18])B(.04,2.60,.60,MAT.walnut,x,0,0,r,{r:.004});for(const y of [.035,2.56])B(2.32,.035,.60,MAT.walnut,0,y,0,r,{r:.003});B(2.32,2.50,.024,MAT.oakFurn,0,.07,.278,r);B(.025,2.45,.55,MAT.walnut,.48,.10,0,r);
  rod(r,[-1.12,2.16,0],[.43,2.16,0],.012,brushed);
  for(const c of keep)if(c.userData.vid==='cintres'){c.position.x=-.29;c.scale.x=.74;}
  for(const y of [.24,.51,.78]){B(.63,.026,.53,MAT.oakFurn,.82,y,0,r,{r:.002});B(.59,.21,.018,MAT.walnut,.82,y+.026,-.245,r,{r:.004});B(.18,.012,.024,brushed,.82,y+.16,-.262,r,{r:.003});}
  const led=new THREE.MeshStandardMaterial({color:0xffecc6,emissive:0xffd59a,emissiveIntensity:1.5});for(const x of [-1.14,.45,1.14]){B(.008,2.25,.009,led,x,.24,-.23,r,{r:.002});const light=new THREE.PointLight(0xffdfab,.28,1.7,2);light.position.set(x,1.5,-.20);r.add(light);}
  for(const {hinge,s}of DYN.wardDoors){hinge.clear();hinge.userData.dynamicVisual=true;const glass=new THREE.MeshPhysicalMaterial({color:0x5f5140,roughness:.12,metalness:.1,transparent:true,opacity:.13,depthWrite:false});
   for(const x of [s*.025,s*1.155])B(.045,2.52,.045,MAT.walnut,x,0,0,hinge,{r:.004});for(const y of [.015,2.465])B(1.18,.055,.045,MAT.walnut,s*.59,y,0,hinge,{r:.003});B(1.09,2.40,.006,glass,s*.59,.06,0,hinge);B(.018,.48,.026,brushed,s*1.09,.96,-.035,hinge,{r:.005});
   for(const y of [.3,1.3,2.3])C(.009,.009,.07,brushed,s*.035,y,.02,hinge,{seg:16});}
  r.userData.inspectionYaw=P+.20;bind(r);
 }
 // Console et vide-poche : objets identifiés individuellement, formes creuses.
 let consoleRoot;STATIC.traverse(o=>{if(o.isGroup&&Math.abs(o.position.x-1.95)<.001&&Math.abs(o.position.z-3.3)<.001&&o.children.length===2)consoleRoot=o;});
 if(consoleRoot){const r=consoleRoot;clear(r);for(const x of [-.38,.38])for(const z of [-.11,.11])B(.035,.14,.035,metal,x,0,z,r,{r:.006});B(.90,.65,.30,MAT.walnut,0,.14,0,r,{r:.012});B(.92,.027,.32,MAT.marble,0,.79,0,r,{r:.008});
  for(const x of [-.222,.222]){B(.438,.59,.018,MAT.oakFurn,x,.17,-.157,r,{r:.003});for(let i=0;i<12;i++)B(.012,.57,.007,MAT.walnut,x-.20+i*.036,.18,-.170,r,{r:.003});B(.012,.15,.023,brushed,x+(x<0?.18:-.18),.40,-.181,r,{r:.003});}r.userData.inspectionYaw=P+.25;reg(r,'console');bind(r);
  const parent=r.parent;for(const o of [...parent.children])if(o.isMesh&&Math.abs(o.position.x-2.15)<.001&&Math.abs(o.position.z-3.3)<.001)parent.remove(o);
  const tray=G(parent,2.17,.817,3.26),glaze=new THREE.MeshPhysicalMaterial({color:0x276d70,roughness:.18,clearcoat:.95,clearcoatRoughness:.08,side:THREE.DoubleSide});tray.userData.inspectionPitch=.70;
  surface(tray,80,20,(u,v)=>{const a=u*P*2,rr=v;return[Math.cos(a)*.115*rr,.004+.030*Math.pow(rr,5),Math.sin(a)*.082*rr];},glaze);surface(tray,80,8,(u,v)=>{const a=u*P*2,rr=.98+v*.035;return[Math.cos(a)*.115*rr,.034-v*.024,Math.sin(a)*.082*rr];},glaze);reg(tray,'vide_poche');bind(tray);
 }
 // Bouquet tropical : feuilles nervurées, anthuriums et oiseaux de paradis en volume.
 const leafMat=new THREE.MeshPhysicalMaterial({color:0x305d2c,roughness:.44,clearcoat:.24,side:THREE.DoubleSide});
 const orange=new THREE.MeshPhysicalMaterial({color:0xe88424,roughness:.48,side:THREE.DoubleSide});const purple=new THREE.MeshPhysicalMaterial({color:0x3d4275,roughness:.4,side:THREE.DoubleSide});const red=new THREE.MeshPhysicalMaterial({color:0x9e302c,roughness:.38,clearcoat:.3,side:THREE.DoubleSide});
 for(const r of roots('fleurs')){clear(r);if(Math.abs(r.position.x-1.7)<.01&&Math.abs(r.position.z-3.3)<.01)r.position.y=.817;const vase=G(r),glass=new THREE.MeshPhysicalMaterial({color:0xe5eeeb,roughness:.10,transmission:.88,thickness:.004,attenuationDistance:100,ior:1.46,side:THREE.DoubleSide});
  L([[0,0],[.078,0],[.083,.01],[.078,.25],[.073,.275],[.068,.277],[.069,.26],[.072,.015],[0,.015]],glass,0,0,0,vase,{seg:64});C(.073,.073,.15,new THREE.MeshPhysicalMaterial({color:0xdbebe6,transmission:.9,roughness:.06,attenuationDistance:100,ior:1.33,thickness:.12}),0,.017,0,vase,{seg:48});reg(vase,'vase');bind(vase);
  for(let i=0;i<9;i++){const a=i*2.399,h=.35+(i%4)*.075,x=Math.cos(a)*.15,z=Math.sin(a)*.13;const stem=tube(r,[[0,.03,0],[x*.35,.27,z*.35],[x,h,z]],.0025,leafMat,24);stem.userData.replacedFoliage=true;
   const leaf=G(r,x,h,z,a);leaf.userData.replacedFoliage=true;leaf.rotation.x=-.45;surface(leaf,18,32,(u,v)=>{const width=Math.sin(v*P)**.72*.115;return[(u-.5)*width,.055*Math.sin(v*P)-v*.20,-v*.34];},leafMat);tube(leaf,[[0,0,0],[0,.013,-.16],[0,-.20,-.34]],.0009,leafMat,24);
  }
  for(let i=0;i<3;i++){const x=(i-1)*.10,z=Math.sin(i*3)*.06,h=.52+i*.095;tube(r,[[x*.3,.02,z*.3],[x*.5,.31,z*.5],[x,h,z]],.003,leafMat,36);const flower=G(r,x,h,z,-.7+i*.65);
   surface(flower,30,12,(u,v)=>[(u-.5)*.25,.025*Math.sin(v*P)+Math.sin(u*P)*.025,(v-.5)*Math.sin(u*P)*.045],leafMat);
   for(let k=0;k<4;k++)surface(flower,12,22,(u,v)=>{const w=.016*Math.sin(v*P)**.7;return[(u-.5)*w+v*(.065+k*.018),v*(.13-k*.017),.005+k*.006+Math.sin(v*P)*.012];},k===3?purple:orange);
  }
  for(const [x,h,z,a]of [[-.14,.39,-.03,-.5],[.13,.45,.02,.5],[.02,.36,.13,0]]){tube(r,[[0,.03,0],[x*.7,.28,z*.7],[x,h,z]],.0025,leafMat,28);const f=G(r,x,h,z,a);f.rotation.x=-.65;
   surface(f,28,28,(u,v)=>{const t=v*P,half=.072*Math.sin(t)**.65*(1+.22*Math.sin(t*2));return[(u-.5)*half*2,.015*Math.sin(t)-.010*Math.cos(u*P*2),-.13*v];},red);tube(f,[[0,.012,-.03],[0,.018,-.075],[0,.02,-.10]],.004,new THREE.MeshStandardMaterial({color:0xe4c263,roughness:.65}),22);
  }r.userData.inspectionYaw=.25;bind(r);
 }
 // Éponge : panneaux d'un même vêtement, col plat et ceinture ruban plutôt que cordes.
 function robe(r){
  clear(r);const inWardrobe=r.parent.userData.vid==='placard';if(inWardrobe){r.rotation.y=0;r.position.y=.72;}const g=G(r,inWardrobe?0:.13,0,0,inWardrobe?0:-P/2);const terry=MAT.towel;
  const front=(u,v,side)=>{const y=1.77-v*1.13,waist=1-.10*Math.exp(-Math.pow((v-.43)/.17,2)),outer=side*(.255+.042*v)*waist,inner=side*(.085*Math.max(0,1-v*2.4)-.035*v);return[inner+(outer-inner)*u,y,-.105-(.005+v*.007)*Math.sin(u*P*4+v*1.3)-.005*Math.sin(u*14+v*18)*Math.exp(-Math.pow((v-.48)/.12,2))];};
  surface(g,40,72,(u,v)=>[(u-.5)*(.51+.09*v),1.77-v*1.13,.085+.016*Math.sin(u*P*9+v)],terry);
  for(const side of [-1,1]){surface(g,40,72,(u,v)=>front(u,v,side),terry);surface(g,18,56,(u,v)=>[side*(.255+.042*v),1.77-v*1.13,-.105+u*.19+.003*Math.sin(v*17)],terry);surface(g,24,24,(u,v)=>[side*(.085+u*.18),1.79-u*.06+.006*Math.sin(v*P),-.105+v*.19],terry);
   const path=new THREE.CatmullRomCurve3([new V(side*.22,1.73,0),new V(side*.32,1.62,0),new V(side*.36,1.39,-.02),new V(side*.39,1.16,-.04)]),N=48,K=22,pos=[],uv=[],ix=[];
   const frames=path.computeFrenetFrames(N,false);for(let i=0;i<=N;i++)for(let j=0;j<=K;j++){const t=i/N,a=j/K*P*2,p=path.getPointAt(t),rad=(.105-.032*t)*(1+.012*Math.sin(t*P*9));p.addScaledVector(frames.normals[i],Math.cos(a)*rad);p.addScaledVector(frames.binormals[i],Math.sin(a)*rad);pos.push(...p);uv.push(j/K,i/N);if(i<N&&j<K){const q=i*(K+1)+j;ix.push(q,q+K+1,q+1,q+1,q+K+1,q+K+2);}}
   const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(ix);geo.computeVertexNormals();g.add(new THREE.Mesh(geo,terry));
   C(.075,.076,.038,hem,side*.39,1.132,-.04,g,{seg:40,open:true});
   surface(g,24,25,(u,v)=>[side*(.085+u*.145),1.10-v*.17,-.127-Math.sin(u*P)*Math.sin(v*P)*.004],terry);tube(g,[[side*.085,1.103,-.134],[side*.16,1.105,-.136],[side*.23,1.103,-.134]],.002,hem,24);
   const collar=new THREE.CatmullRomCurve3([new V(side*.025,1.79,.07),new V(side*.105,1.78,-.01),new V(side*.115,1.68,-.145),new V(side*.07,1.46,-.16),new V(side*.018,1.28,-.16)]);
   surface(g,14,64,(u,v)=>{const p=collar.getPoint(v),w=.080+.024*Math.sin(v*P);return[p.x+side*(u-.5)*w,p.y,p.z-.014*Math.sin(u*P)];},terry);
  }
  surface(g,72,6,(u,v)=>[Math.cos(u*P*2)*.252,1.255+(v-.5)*.052,Math.sin(u*P*2)*.128-.010],hem);
  for(const side of [-1,1]){surface(g,30,5,(u,v)=>[side*Math.sin(u*P)*.115,1.25+Math.sin(u*P*2)*.034+(v-.5)*.042,-.160-Math.sin(u*P)*.026],hem);surface(g,8,38,(u,v)=>[side*(.012+.07*v)+(u-.5)*.04,1.25-v*.27,-.173-.015*Math.sin(v*P*2+u)],hem);}
  const hanger=G(g,0,1.79,.035);tube(hanger,[[-.22,-.07,0],[0,.038,0],[.22,-.07,0]],.012,MAT.oakFurn,32);tube(hanger,[[0,.03,0],[0,.09,0],[.03,.12,0],[.035,.09,0]],.003,brushed,24);r.userData.inspectionYaw=inWardrobe?P:-P/2;r.userData.inspectionPitch=.10;bind(r);
 }
 for(const r of roots('peignoir'))robe(r);
 for(const r of roots('serviettes')){
  if(r.position.x<5)continue;clear(r);for(const z of [-.6,0,.6])for(let k=0;k<2;k++){
   const t=G(r,0,k*.085,z);for(let layer=0;layer<3;layer++){const h=.024,w=.42,d=.37,g=new RoundedBoxGeometry(w,h,d,4,.010);const p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),zz=p.getZ(i);p.setY(i,y+.0018*Math.sin(x*27+zz*13));}g.computeVertexNormals();const m=new THREE.Mesh(g,terryClone());m.position.y=.012+layer*.023;t.add(m);}
   for(const dz of [-.12,-.10]){surface(t,32,3,(u,v)=>[(u-.5)*.40,.073+.0005*v,dz+v*.011],hem);}tube(t,[[-.20,.026,.186],[0,.023,.190],[.20,.026,.186]],.0018,hem,40);
  }r.userData.inspectionSource=r.children[0];r.userData.inspectionPitch=.55;bind(r);
 }
 function terryClone(){const m=MAT.towel.clone();for(const k of ['map','normalMap','roughnessMap']){m[k]=MAT.towel[k].clone();m[k].repeat.set(1,1);}return m;}
}

// Détails sous le millimètre et feuillage scanné : ajoutés après les index d'éclairage.
export function finishAtelier({INTER,MAT,LOW},materials){
 const V=THREE.Vector3;
 if(materials.foliage)for(const r of INTER.filter(r=>r.userData.vid==='fleurs')){
  for(const c of [...r.children])if(c.userData.replacedFoliage)r.remove(c);
  const plant=materials.foliage.clone(true);plant.position.set(0,0,0);const group=new THREE.Group();group.add(plant);group.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(group),size=box.getSize(new V()),center=box.getCenter(new V());plant.position.sub(new V(center.x,box.min.y,center.z));group.scale.setScalar(.50/Math.max(size.x,size.z));group.position.y=.22;r.add(group);
  group.traverse(o=>{if(!o.isMesh)return;o.material=o.material.clone();o.material.envMapIntensity=.65;for(const t of [o.material.map,o.material.normalMap,o.material.roughnessMap])if(t)t.anisotropy=8;o.castShadow=true;o.receiveShadow=true;o.userData.root=r;});
 }
 const loop=new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new V(-.0008,.0001,0),new V(0,.00125,.0002),new V(.0008,.0001,0)]),4,.00023,3,false);
 const fiber=new THREE.MeshPhysicalMaterial({color:0xe8e3d8,roughness:1,sheen:.6,sheenColor:new THREE.Color(0xf3ecdf)});
 for(const r of INTER.filter(r=>r.userData.vid==='serviettes'&&r.position.x>5))for(const towel of r.children.filter(c=>c.isGroup)){
  const count=LOW?850:4200,tufts=new THREE.InstancedMesh(loop,fiber,count),dummy=new THREE.Object3D(),color=new THREE.Color();let seed=9271,used=0;const rand=()=>{seed=seed*16807%2147483647;return seed/2147483647;};
  for(let i=0;i<count;i++){const x=(rand()-.5)*.405,z=(rand()-.5)*.354;if(z>-.122&&z<-.087)continue;dummy.position.set(x,.0705+.0018*Math.sin(x*27+z*13),z);dummy.rotation.y=rand()*P*2;dummy.scale.setScalar(.7+rand()*.6);dummy.updateMatrix();tufts.setMatrixAt(used,dummy.matrix);const shade=.84+rand()*.16;color.setRGB(shade,shade,shade);tufts.setColorAt(used,color);used++;}
  tufts.count=used;tufts.instanceMatrix.needsUpdate=true;tufts.instanceColor.needsUpdate=true;tufts.castShadow=false;tufts.receiveShadow=true;tufts.raycast=()=>{};tufts.userData.root=r;tufts.computeBoundingBox();tufts.computeBoundingSphere();towel.add(tufts);
 }
}
