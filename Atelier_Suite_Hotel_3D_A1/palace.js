import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

/* Assets CC0 auto-hébergés. Le modèle chargé est aussi celui du gros plan. */
const models=new Map(),textureLoader=new THREE.TextureLoader();
const ids=['sofa_02','ArmChair_01','modern_arm_chair_01','modern_coffee_table_01','side_table_01','potted_plant_01','potted_plant_02','potted_plant_04','dining_chair_02','modern_ceiling_lamp_01','desk_lamp_arm_01'];
const loader=new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
export async function loadPalaceAssets(progress){
 let complete=0;const failures=[];
 await Promise.all(ids.map(async id=>{try{const asset=await loader.loadAsync(`assets/models/${id}.glb`);asset.scene.traverse(m=>{if(m.isMesh){m.castShadow=true;m.receiveShadow=true;const ms=Array.isArray(m.material)?m.material:[m.material];for(const mat of ms){for(const t of [mat.map,mat.normalMap,mat.roughnessMap,mat.metalnessMap,mat.aoMap])if(t)t.anisotropy=8;mat.envMapIntensity=.8;}}});models.set(id,asset.scene);}catch(e){failures.push(id);console.error('Chargement du mobilier',id,e.message);}progress?.(++complete,ids.length);}));
 return {loaded:models.size,failures};
}
export async function photographicMaterials(MAT,renderer){
 const max=renderer.capabilities.getMaxAnisotropy();
 async function maps(id,repeat=[1,1]){const out={};await Promise.all(['diff','nor_gl','rough'].map(async kind=>{const t=await textureLoader.loadAsync(`assets/materials/${id}/${kind}.webp`);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(...repeat);t.anisotropy=Math.min(8,max);if(kind==='diff')t.colorSpace=THREE.SRGBColorSpace;out[kind==='diff'?'map':kind==='nor_gl'?'normalMap':'roughnessMap']=t;}));return out;}
 const [wood,leather,marble,plaster,cotton]=await Promise.all([maps('wood_floor'),maps('brown_leather',[2,2]),maps('marble_01'),maps('white_plaster_02'),maps('fabric_pattern_05',[5,5])]);
 function apply(mat,m,options={}){Object.assign(mat,m,options);mat.needsUpdate=true;}
 apply(MAT.oak,wood,{roughness:.62,clearcoat:.12});apply(MAT.oakFurn,wood,{roughness:.58});apply(MAT.walnut,wood,{roughness:.55});MAT.walnut.color.set(0x6b5038);MAT.oakFurn.color.set(0xcbbb9d);
 apply(MAT.leather,leather,{roughness:.78});apply(MAT.marble,marble,{roughness:.20,clearcoat:.22});apply(MAT.marbleDark,marble,{roughness:.25});MAT.marbleDark.color.set(0x303635);
 apply(MAT.stone,marble,{roughness:.7});MAT.stone.color.set(0xb2a48c);apply(MAT.stoneWall,marble,{roughness:.63});MAT.stoneWall.color.set(0xc7b99e);
 // Peinture d'hôtel propre : seul le microrelief photographique reste visible.
 apply(MAT.plaster,plaster,{map:null,roughness:.94,normalScale:new THREE.Vector2(.12,.12)});MAT.plaster.color.set(0xf2eee7);
 apply(MAT.plasterWarm,plaster,{map:null,roughness:.94,normalScale:new THREE.Vector2(.12,.12)});MAT.plasterWarm.color.set(0xece4d7);
 // Relief photographique de coton ; sa couleur reste blanche pour la couette.
 MAT.linen.normalMap=cotton.normalMap;MAT.linen.normalScale=new THREE.Vector2(.3,.3);MAT.linen.roughnessMap=cotton.roughnessMap;MAT.linen.needsUpdate=true;
 MAT.boucle.normalMap=cotton.normalMap;MAT.boucle.normalScale=new THREE.Vector2(.42,.42);MAT.boucle.needsUpdate=true;
 for(const mat of [MAT.carpet,MAT.rug,MAT.rugBath]){mat.normalMap=cotton.normalMap;mat.normalScale=new THREE.Vector2(.45,.45);mat.roughnessMap=cotton.roughnessMap;mat.needsUpdate=true;}
 MAT.lampOn.map=cotton.map;MAT.lampOn.normalMap=cotton.normalMap;MAT.lampOn.needsUpdate=true;
}
function cloneVisual(o){if(o.isLight)return null;const n=o.isMesh?new THREE.Mesh(o.geometry,o.material):new THREE.Group();n.position.copy(o.position);n.quaternion.copy(o.quaternion);n.scale.copy(o.scale);n.visible=o.visible;for(const c of o.children){const q=cloneVisual(c);if(q)n.add(q);}if(n.isMesh){n.castShadow=true;n.receiveShadow=true;}return n;}
export function installPalace(api){
 const {INTER,STATIC,MAT,B,C,L,G,REAL,reg,DYN,LOW}=api,PI=Math.PI;
 const roots=id=>INTER.filter(r=>r.userData.vid===id);
 const bind=r=>r.traverse(m=>{if(m.isMesh&&(!m.userData.root||!m.userData.root.userData.vid&&!m.userData.root.userData.obj))m.userData.root=r;});
 function model(id,size,offset=[0,0,0],ry=0){const source=models.get(id);if(!source)return null;const n=cloneVisual(source),g=new THREE.Group();g.add(n);n.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(n),s=b.getSize(new THREE.Vector3()),c=b.getCenter(new THREE.Vector3());n.position.sub(new THREE.Vector3(c.x,b.min.y,c.z));g.scale.set(size[0]/s.x,size[1]/s.y,size[2]/s.z);g.rotation.y=ry;const anchor=new THREE.Group();anchor.position.set(...offset);anchor.add(g);return anchor;}
 function replace(r,id,size,offset=[0,0,0],ry=0){const n=model(id,size,offset,ry);if(!n)return;for(const c of [...r.children])r.remove(c);r.add(n);delete r.userData.inspectionSource;r.userData.asset=id;r.userData.inspectionYaw=.35;bind(r);}
 for(const r of roots('canape'))replace(r,'sofa_02',[2.3,.93,.87]);
 for(const r of roots('canape_hall')){const groups=r.children.filter(c=>c.isGroup&&Math.abs(c.position.z)>1);for(const so of groups)replace(so,'sofa_02',[2.4,.95,.9]);bind(r);}
 // Ces scans regardent vers +Z ; la scène place ses assises face à -Z.
 // Corriger le modèle local conserve les ancrages, les obstacles et les cibles.
 for(const [i,r] of roots('fauteuil').entries())replace(r,i%2?'modern_arm_chair_01':'ArmChair_01',[.79,1.02,.78],[0,0,0],PI);
 for(const r of roots('chaise'))replace(r,r.userData.outdoor?'modern_arm_chair_01':'dining_chair_02',r.userData.outdoor?[.57,.93,.58]:[.49,1.03,.52],[0,0,0],PI);
 for(const r of roots('table_basse'))replace(r,'modern_coffee_table_01',[1.06,.435,.78]);
 for(const r of roots('lampe_bureau')){const lights=r.children.filter(c=>c.isLight);replace(r,'desk_lamp_arm_01',[.28,.47,.32]);for(const l of lights)r.add(l);}
 for(const r of roots('suspension'))replace(r,'modern_ceiling_lamp_01',[.45,1.05,.45],[0,-1.10,0]);
 for(const r of roots('table_nuit')){for(const child of [...r.children]){if(!child.isGroup)continue;const n=model('side_table_01',[.5,.55,.55]);if(n){child.clear();child.add(n);}}bind(r);}
 for(const [i,r] of roots('plante').entries()){const s=r.userData.plantScale||1;replace(r,s<.6?'potted_plant_04':i%2?'potted_plant_02':'potted_plant_01',s<.6?[.27,.45,.27]:[.66*s,1.65*s,.67*s]);}
 // Carte-clé de format bancaire : bord mince, angles arrondis, deux faces imprimées.
 for(const r of roots('cle')){r.clear();const width=.0856,height=.05398,thickness=.00085,rad=.0032;
  const shape=new THREE.Shape(),x=-width/2,y=-height/2;shape.moveTo(x+rad,y);shape.lineTo(x+width-rad,y);shape.quadraticCurveTo(x+width,y,x+width,y+rad);shape.lineTo(x+width,y+height-rad);shape.quadraticCurveTo(x+width,y+height,x+width-rad,y+height);shape.lineTo(x+rad,y+height);shape.quadraticCurveTo(x,y+height,x,y+height-rad);shape.lineTo(x,y+rad);shape.quadraticCurveTo(x,y,x+rad,y);
  const body=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:thickness,bevelEnabled:true,bevelSize:.00012,bevelThickness:.0001,bevelSegments:2,curveSegments:16,steps:1}),new THREE.MeshPhysicalMaterial({color:0xeee5ce,roughness:.35,clearcoat:.3}));body.rotation.x=-PI/2;r.add(body);
  function face(front){const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=646;const c=canvas.getContext('2d');const gradient=c.createLinearGradient(0,0,1024,646);gradient.addColorStop(0,'#193b3d');gradient.addColorStop(1,'#071e24');c.fillStyle=gradient;c.fillRect(0,0,1024,646);
   c.strokeStyle='#c6ac76';c.lineWidth=2;c.strokeRect(35,35,954,576);c.textAlign='center';c.fillStyle='#d9c18f';
   if(front){c.font='46px Georgia';c.fillText('P A L A C E  H Ô T E L',512,158);c.font='25px sans-serif';c.fillText('FORT-DE-FRANCE',512,211);c.font='150px Georgia';c.fillText('14',512,419);c.font='22px sans-serif';c.fillText('SUITE · PREMIER ÉTAGE',512,477);c.font='26px Georgia';c.fillText('Bienvenue chez vous',512,561);
    for(let i=0;i<3;i++){c.beginPath();c.arc(883,538,12+i*10,-Math.PI/2,Math.PI/2);c.stroke();}
   }else{c.fillStyle='#080b0c';c.fillRect(0,80,1024,115);c.fillStyle='#d9c18f';c.font='34px Georgia';c.fillText('Palace Hôtel',512,300);c.font='24px sans-serif';c.fillText('Présentez votre carte devant le lecteur.',512,373);c.fillText('Merci de rapporter la carte à la réception.',512,430);c.fillText('Réception · composez le 9',512,548);}
   const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;const geo=new THREE.ShapeGeometry(shape,20),uv=geo.attributes.uv,p=geo.attributes.position;for(let i=0;i<p.count;i++)uv.setXY(i,p.getX(i)/width+.5,p.getY(i)/height+.5);const m=new THREE.Mesh(geo,new THREE.MeshPhysicalMaterial({map:t,roughness:.36,clearcoat:.25}));m.rotation.x=front?-PI/2:PI/2;m.position.y=front?thickness+.00012:-.00012;r.add(m);
  }face(true);face(false);r.userData.inspectionPitch=.7;r.userData.inspectionYaw=0;bind(r);}
 // Dormant, joints, paumelles et lecteur RFID : la porte n'est plus une planche.
 const d=DYN.door;if(d){
  for(const c of [...d.children])if(c.isMesh&&c.geometry?.parameters?.width===.14)d.remove(c);
  for(const side of [-1,1]){B(.78,1.23,.008,MAT.walnut,-.5,.83,side*.031,d,{r:.005});B(.78,.52,.008,MAT.walnut,-.5,.17,side*.031,d,{r:.005});
   const lock=G(d,-.88,.88,side*.042);B(.065,.28,.017,MAT.brass,0,0,0,lock,{r:.012});B(.053,.11,.008,MAT.blackMetal,0,.15,side*.013,lock,{r:.007});const led=C(.003,.003,.002,new THREE.MeshStandardMaterial({color:0x50ba86,emissive:0x50ba86,emissiveIntensity:1}),0,.225,side*.02,lock,{seg:12});led.rotation.x=PI/2;lock.userData.inspectionYaw=side<0?PI+.25:.25;reg(lock,'serrure',{act:'door'});
   const handle=G(d,-.88,1.02,side*.065);REAL.tube(handle,[[0,0,0],[0,0,side*.045],[.10,0,side*.045]],.009,MAT.brass,16);reg(handle,'poignee',{act:'door'});
  }
  for(const y of [.3,1.15,2.05])C(.009,.009,.11,MAT.brass,.0,y,.025,d,{seg:16});
  for(const x of [2.56,3.64])B(.075,2.33,.19,MAT.walnut,x,0,3.48,STATIC,{r:.003});B(1.155,.075,.19,MAT.walnut,3.1,2.28,3.48,STATIC,{r:.003});
  for(const x of [2.61,3.59])B(.009,2.25,.018,MAT.blackMetal,x,0,3.49,STATIC);bind(d);
 }
 // Literie : couette continue drapée, côtés souples, couture et retombée au pied.
 const duvet=roots('couette')[0];if(duvet){duvet.clear();const fn=(u,v)=>{const x=-.49+u*1.57,z=(v-.5)*2.17,edge=Math.max(0,Math.abs(z)-.86)/.225,foot=Math.max(0,x-.91)/.17;const y=.704-.30*Math.pow(Math.max(edge,foot),.8)+Math.sin(u*16+v*9)*.009+Math.sin(v*52+u*5)*.006;return[x,y,z];};REAL.cloth(duvet,1.57,2.17,[0,0,0],fn,MAT.linen,90,100);for(const v of [0,1])REAL.tube(duvet,Array.from({length:60},(_,i)=>fn(i/59,v)),.0025,MAT.linen,60);REAL.cloth(duvet,.22,2.0,[-.49,.72,0],(u,v)=>[u*.22,Math.sin(u*PI)*.018,(v-.5)*2],MAT.linen,30,60);bind(duvet);}
 for(const r of roots('couette').slice(1)){if(!r.isMesh)continue;const geo=new THREE.PlaneGeometry(.48,2.18,30,70),p=geo.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),z=-p.getY(i),edge=Math.max(0,Math.abs(z)-.86)/.23;p.setXYZ(i,x,.01-.32*Math.pow(edge,.8)+Math.sin(z*31+x*8)*.005,z);}geo.computeVertexNormals();r.geometry=geo;r.position.y=.73;r.material=MAT.velvetMustard;}
 // Bouilloire chromée : bec, couvercle, poignée creuse et socle d'alimentation.
 for(const r of roots('bouilloire')){const h=G(r);REAL.tube(h,[[.04,.12,0],[.10,.15,0],[.14,.17,0]],.016,MAT.chrome,24);REAL.tube(h,[[-.045,.17,0],[-.12,.18,0],[-.13,.06,0],[-.05,.04,0]],.012,MAT.blackMetal,32);C(.051,.051,.009,MAT.chrome,0,.204,0,h,{seg:40});C(.016,.016,.012,MAT.blackMetal,0,.213,0,h,{seg:20});C(.079,.079,.012,MAT.blackMetal,0,-.008,0,h,{seg:40});bind(r);}
 // Bordures cousues des oreillers et petites coutures sur le cuir.
 for(const root of roots('oreillers'))for(const pillow of root.children){const p=pillow.geometry?.parameters;if(!p)continue;const g=G(pillow);REAL.tube(g,[[-p.width*.5,0,-p.depth*.42],[-p.width*.5,p.height*.4,-p.depth*.35],[-p.width*.5,p.height*.43,p.depth*.35],[-p.width*.5,0,p.depth*.42],[-p.width*.5,-p.height*.4,p.depth*.35],[-p.width*.5,-p.height*.43,-p.depth*.35],[-p.width*.5,0,-p.depth*.42]],.002,MAT.linen,60);bind(root);}
 // Prises, interrupteurs et garnitures métalliques à hauteur réelle.
 for(const [x,z,ry] of [[2.42,3.39,PI],[-4.37,-1.55,PI/2],[.68,3.38,PI]]){const r=G(STATIC,x,.98,z,ry);B(.085,.085,.008,MAT.white,0,0,0,r,{r:.007});B(.055,.06,.006,MAT.lacquer,0,.012,-.009,r,{r:.003});reg(r,'interrupteur',{act:'lamp:chevet'});}
 for(const [x,z,ry] of [[-4.36,1.16,PI/2],[.45,3.39,PI],[3.91,.77,-PI/2]]){const r=G(STATIC,x,.30,z,ry);B(.09,.09,.01,MAT.white,0,0,0,r,{r:.007});const recess=C(.026,.026,.003,MAT.lacquer,0,.045,-.007,r,{seg:32});recess.rotation.x=PI/2;for(const xx of [-.009,.009]){const hole=C(.0035,.0035,.004,MAT.blackMetal,xx,.045,-.011,r,{seg:12});hole.rotation.x=PI/2;}reg(r,'prise');}
 // Éclairage de fenêtre : réflection physique sur les surfaces et reliefs.
 RectAreaLightUniformsLib.init();const area=new THREE.RectAreaLight(0xfff1db,3.5,7,2.5);area.position.set(0,1.6,-2.8);area.lookAt(0,1.4,2);STATIC.add(area);
 for(const r of INTER)bind(r);
}
