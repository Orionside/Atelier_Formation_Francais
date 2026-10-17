import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RGBELoader} from 'three/addons/loaders/RGBELoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
import {Reflector} from 'three/addons/objects/Reflector.js';

const base='assets/photoreal/',loader=new GLTFLoader().setMeshoptDecoder(MeshoptDecoder),textures=new THREE.TextureLoader();
const library=new Map();
export async function preparePhotoreal(MAT,renderer,scene,pmrem,LOW){
 const sets={};
 await Promise.all(['oak_veneer_01','teak_veneer','Fabric061'].map(async id=>{
  const maps={};await Promise.all(['diff','nor_gl','rough'].map(async kind=>{const t=await textures.loadAsync(base+id+'/'+kind+'.webp');t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());if(kind==='diff')t.colorSpace=THREE.SRGBColorSpace;maps[kind]=t;}));sets[id]=maps;
 }));
 sets.Fabric061.diff=await textures.loadAsync(base+'Fabric061/white.webp');sets.Fabric061.diff.colorSpace=THREE.SRGBColorSpace;sets.Fabric061.diff.wrapS=sets.Fabric061.diff.wrapT=THREE.RepeatWrapping;sets.Fabric061.diff.anisotropy=8;
 function use(mat,id,{repeat=[1,1],color=0xffffff,normal=.3,...options}={}){
  const maps=sets[id];for(const [slot,key] of [['map','diff'],['normalMap','nor_gl'],['roughnessMap','rough']]){const t=maps[key].clone();t.repeat.set(...repeat);t.needsUpdate=true;mat[slot]=t;}
  mat.bumpMap=null;mat.color.set(color);mat.normalScale?.set(normal,normal);Object.assign(mat,options);mat.needsUpdate=true;
 }
 use(MAT.walnut,'oak_veneer_01',{repeat:[2.5,1.8],color:0x917558,roughness:.62});
 use(MAT.oakFurn,'oak_veneer_01',{roughness:.6});
 use(MAT.linen,'Fabric061',{repeat:[5,5],normal:.14,roughness:.98,sheen:.4});
 use(MAT.boucle,'Fabric061',{repeat:[4,4],normal:.4,roughness:.96});
 use(MAT.towel,'Fabric061',{repeat:[7,9],normal:.65,roughness:1});
 use(MAT.velvetMustard,'Fabric061',{repeat:[4,4],color:0xa38653,normal:.24});
 use(MAT.velvetTeal,'Fabric061',{repeat:[4,4],color:0x356562,normal:.24});
 for(const mat of [MAT.carpet,MAT.rug,MAT.rugBath])use(mat,'Fabric061',{repeat:[14,14],color:mat===MAT.carpet?0x8f8777:0xc8c3b3,normal:.7,roughness:1});
 use(MAT.lampOn,'Fabric061',{repeat:[3,2],normal:.16,roughness:.97});
 MAT.linen.color.set(0xfaf9f4);MAT.boucle.color.set(0xc6bfb0);MAT.towel.color.set(0xfdfbf4);
 MAT.chrome.envMap=null;MAT.chrome.envMapIntensity=.9;
 MAT.glass.color.set(0xffffff);MAT.glass.opacity=.035;MAT.glass.envMapIntensity=.18;
 MAT.ceiling.emissiveIntensity=0;MAT.ceiling.normalMap=MAT.plaster.normalMap;MAT.ceiling.normalScale=new THREE.Vector2(.08,.08);
 const [panorama,hdri]=await Promise.all([textures.loadAsync(base+(LOW?'seaview-mobile.webp':'seaview.webp')),new RGBELoader().loadAsync(base+'seaview.hdr')]);
 panorama.colorSpace=THREE.SRGBColorSpace;panorama.mapping=THREE.EquirectangularReflectionMapping;panorama.anisotropy=4;
 // La moitié maritime du panorama est orientée vers la baie, à l'infini.
 scene.background=new THREE.Color(0xc4dfed);
 const backdrop=new THREE.Mesh(new THREE.SphereGeometry(1800,96,48),new THREE.MeshBasicMaterial({map:panorama,side:THREE.BackSide,depthWrite:false,fog:false,toneMapped:false}));
 backdrop.name='Panorama photographique maritime';backdrop.renderOrder=-2;scene.add(backdrop);
 hdri.mapping=THREE.EquirectangularReflectionMapping;const env=pmrem.fromEquirectangular(hdri).texture;scene.environment=env;hdri.dispose();
 await Promise.all(['duvet','pillow','cushion','sofa','lounger'].map(async id=>{const a=await loader.loadAsync(base+'models/'+id+'.glb');library.set(id,a.scene);}));
 return {sets,use,env};
}
function clone(o,MAT){
 const n=o.isMesh?new THREE.Mesh(o.geometry,o.material):new THREE.Group();n.position.copy(o.position);n.quaternion.copy(o.quaternion);n.scale.copy(o.scale);
 if(n.isMesh){const key=o.material.name;n.material=({linen:MAT.linen,teal:MAT.velvetTeal,ochre:MAT.velvetMustard,oak:MAT.oakFurn,upholstery:MAT.boucle,brass:MAT.brass,metal:MAT.blackMetal})[key]||o.material;n.castShadow=true;n.receiveShadow=true;}
 for(const c of o.children)n.add(clone(c,MAT));return n;
}
export function installPhotoreal({INTER,STATIC,MAT,REAL,reg,B,C,G,DYN},prepared){
 const roots=id=>INTER.filter(r=>r.userData.vid===id);
 const model=id=>clone(library.get(id),MAT);
 function bind(r){r.traverse(m=>{if(m.isMesh)m.userData.root=r;});}
 function replace(r,n){r.clear();r.add(n);delete r.userData.inspectionSource;bind(r);}
 for(const r of roots('canape')){replace(r,model('sofa'));r.userData.inspectionYaw=.3;}
 // Même palette contemporaine dans les deux espaces d'accueil.
 for(const r of roots('canape_hall')){for(const s of r.children.filter(c=>c.isGroup&&Math.abs(c.position.z)>1))replace(s,model('sofa'));bind(r);}
 const duvets=roots('couette');if(duvets[0])replace(duvets[0],model('duvet'));
 for(const root of roots('oreillers')){
  root.clear();for(const [x,z,lean]of [[-.78,-.46,.12],[-.78,.46,.17],[-.57,-.43,.30],[-.57,.43,.34]]){
   const p=G(root,x,.91,z);p.rotation.z=-lean;const n=model('pillow');n.rotation.x=Math.PI/2;const turn=G(p);turn.rotation.y=Math.PI/2;turn.add(n);
  }bind(root);
 }
 for(const root of roots('coussins')){
  root.clear();for(const [z,col]of [[-.28,MAT.velvetMustard],[.28,MAT.velvetTeal]]){const p=G(root,-.4,.89,z);const n=model('cushion');n.rotation.x=Math.PI/2;const turn=G(p);turn.rotation.y=Math.PI/2;turn.rotation.z=-.15;turn.add(n);n.traverse(m=>{if(m.isMesh)m.material=col;});}bind(root);
 }
 for(const r of roots('transats')){r.clear();for(const z of [-3.75,-4.65]){const p=G(r,-3.3,0,z);p.add(model('lounger'));}bind(r);}
 // Lin des voilages : trame photographique, transparence modérée.
 for(const r of roots('rideaux'))r.traverse(m=>{if(m.isMesh){m.material.normalMap=MAT.linen.normalMap;m.material.normalScale=new THREE.Vector2(.08,.08);m.material.roughness=1;}});
 // Le chêne du bureau possède des chants, une vraie ouverture de tiroir et des traverses.
 for(const r of roots('bureau')){
  for(const x of [-.78,.78]){B(.055,.62,.045,MAT.oakFurn,x,.08,-.19,r,{r:.006});B(.055,.62,.045,MAT.oakFurn,x,.08,.19,r,{r:.006});}
  B(1.60,.06,.045,MAT.oakFurn,0,.23,.19,r,{r:.006});B(.52,.008,.004,MAT.blackMetal,-.62,.548,-.254,r);
  B(1.72,.018,.51,MAT.oakFurn,0,.744,0,r,{r:.004});bind(r);
 }
 // Micro-joints et chants de panneaux, sans surcharger la lecture du vocabulaire.
 const head=roots('tete_lit')[0];if(head){for(const z of [-1.4,-.95,-.5,-.05,.4,.85,1.3])B(.003,2.45,.006,MAT.blackMetal,.027,-1.225,z,head);bind(head);}
 // Une photo de mer encadrée remplace les aplats abstraits.
 const sea=new THREE.TextureLoader().load(base+'art-sea.webp');sea.colorSpace=THREE.SRGBColorSpace;
 for(const r of roots('tableau'))r.traverse(m=>{if(m.isMesh&&m.geometry?.type==='PlaneGeometry'&&m.material.map){m.material=m.material.clone();m.material.map=sea;m.material.bumpMap=null;m.material.roughness=.78;m.material.needsUpdate=true;}});
 // Les grands placages de la terrasse emploient un teck, pas le parquet intérieur.
 STATIC.updateMatrixWorld(true);STATIC.traverse(m=>{if(!m.isMesh)return;const p=m.getWorldPosition(new THREE.Vector3());if(p.z<-3.08&&p.z>-5.5&&m.material.map===MAT.oak.map){m.material=m.material.clone();prepared.use(m.material,'teak_veneer',{roughness:.82});}});
 for(const r of INTER)bindPreserving(r);
 function bindPreserving(r){r.traverse(m=>{if(m.isMesh&&!m.userData.root)m.userData.root=r;});}
}

// Index stable de géométries : utilisé par les UV d'éclairage préparés dans Cycles.
export function indexLightingMeshes(STATIC){let i=0;STATIC.traverse(o=>{if(o.isMesh)o.userData.pmId='pm_'+String(i++).padStart(5,'0');});}
export async function applyBakedLighting(STATIC,LOW){
 const settings=await fetch(base+'lighting/settings.json?v=final5').then(r=>{if(!r.ok)throw new Error('Cartes d’éclairage indisponibles');return r.json();});
 const [data,...maps]=await Promise.all([loader.loadAsync(base+'lighting/geometry.glb?v=final5'),...['suite','lobby'].map(id=>textures.loadAsync(base+'lighting/'+settings[id][LOW?'mobile':'file']+'?v=final5'))]);
 const lightTextures={suite:maps[0],lobby:maps[1]};for(const t of maps){t.channel=1;t.flipY=false;t.colorSpace=THREE.SRGBColorSpace;}
 const byId=new Map();data.scene.updateMatrixWorld(true);STATIC.updateMatrixWorld(true);data.scene.traverse(o=>{if(o.isMesh&&o.userData.pmId)byId.set(o.userData.pmId,{object:o,region:o.userData.lightRegion});});
 let n=0;
 STATIC.traverse(o=>{
  const b=byId.get(o.userData?.pmId);if(!b)return;
  const geometry=b.object.geometry.clone();
  // Les positions quantifiées doivent devenir flottantes avant un changement de repère.
  for(const key of ['position','normal']){
   const a=geometry.getAttribute(key),array=new Float32Array(a.count*3);
   for(let i=0;i<a.count;i++){array[i*3]=a.getX(i);array[i*3+1]=a.getY(i);array[i*3+2]=a.getZ(i);}
   geometry.setAttribute(key,new THREE.BufferAttribute(array,3));
  }
  geometry.applyMatrix4(new THREE.Matrix4().copy(o.matrixWorld).invert().multiply(b.object.matrixWorld));
  geometry.computeBoundingBox();o.geometry.computeBoundingBox();
  const before=o.geometry.boundingBox,after=geometry.boundingBox;
  if(before.getCenter(new THREE.Vector3()).distanceTo(after.getCenter(new THREE.Vector3()))>.05)throw new Error('La géométrie d’éclairage ne correspond pas à '+o.userData.pmId);
  o.geometry=geometry;
  const ms=Array.isArray(o.material)?o.material:[o.material];
  o.material=ms.map(original=>{
   const material=original.clone();material.lightMap=lightTextures[b.region];material.lightMapIntensity=Math.PI*settings[b.region].gain;material.envMapIntensity=.08;material.unbakedMaterial=original;
   const vertexLighting=geometry.hasAttribute('_irradiance');if(vertexLighting)material.lightMap=null;
   material.onBeforeCompile=shader=>{
    if(vertexLighting){shader.vertexShader='attribute vec3 _irradiance;\nvarying vec3 vBakedIrradiance;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvBakedIrradiance=_irradiance*4.0;');shader.fragmentShader='varying vec3 vBakedIrradiance;\n'+shader.fragmentShader;}
    // Le soleil et la baie sont précalculés ; les lampes ponctuelles restent actives.
    const direct=THREE.ShaderChunk.lights_fragment_begin.replace('getDirectionalLightInfo( directionalLight, directLight );','getDirectionalLightInfo( directionalLight, directLight );\ndirectLight.color=vec3(0.0);').replace('RE_Direct_RectArea( rectAreaLight,','rectAreaLight.color=vec3(0.0);\nRE_Direct_RectArea( rectAreaLight,');
    shader.fragmentShader=shader.fragmentShader.replace('#include <lights_fragment_begin>',direct).replace('#include <lights_fragment_end>','#include <lights_fragment_end>'+(vertexLighting?'\nreflectedLight.indirectDiffuse+=vBakedIrradiance*diffuseColor.rgb;':''));
   };
   material.customProgramCacheKey=()=>vertexLighting?'palace-cycles-vertex-v2':'palace-cycles-map-v2';material.needsUpdate=true;return material;
  });
  if(o.material.length===1)o.material=o.material[0];n++;
 });
 return n;
}

export function finishTextiles(INTER,MAT){
 const duvets=INTER.filter(r=>r.userData.vid==='couette'),source=duvets[0];if(!source)return;
 const parent=source.parent;parent.updateWorldMatrix(true,true);const inverse=parent.matrixWorld.clone().invert(),bins=new Map(),step=.025,point=new THREE.Vector3();
 source.traverse(m=>{if(!m.isMesh)return;const p=m.geometry.getAttribute('position'),matrix=new THREE.Matrix4().multiplyMatrices(inverse,m.matrixWorld);for(let i=0;i<p.count;i++){point.fromBufferAttribute(p,i).applyMatrix4(matrix);const x=Math.round(point.x/step),z=Math.round(point.z/step),key=x+','+z;const a=bins.get(key);if(!a||point.y>a.y)bins.set(key,{x:point.x,y:point.y,z:point.z});}});
 function height(x,z){let sum=0,weight=0;const bx=Math.round(x/step),bz=Math.round(z/step);for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const a=bins.get((bx+i)+','+(bz+j));if(!a)continue;const w=1/Math.max(.000025,(a.x-x)**2+(a.z-z)**2);sum+=a.y*w;weight+=w;}return weight?sum/weight:.68;}
 for(const r of duvets.slice(1)){if(!r.isMesh)continue;const geo=new THREE.PlaneGeometry(.47,2.30,28,100),p=geo.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),z=-p.getY(i);p.setXYZ(i,x,height(r.position.x+x,z)+.012-r.position.y,z);}geo.computeVertexNormals();r.geometry=geo;r.material=MAT.velvetMustard;r.material.side=THREE.DoubleSide;}
}

export function installMirror(DYN,MAT,LOW){
 const root=DYN.mirror;if(!root)return;
 for(const child of [...root.children])if(child.isMesh&&child.material===MAT.mirror)root.remove(child);
 const mirror=new Reflector(new THREE.PlaneGeometry(2.02,1.12),{color:0xffffff,textureWidth:LOW?512:1024,textureHeight:LOW?256:512,clipBias:.003});
 mirror.rotation.y=-Math.PI/2;mirror.position.x=-.027;mirror.userData.root=root;
 mirror.material.unbakedMaterial=new THREE.MeshStandardMaterial({color:0xffffff,metalness:1,roughness:.03,envMapIntensity:1.1});
 const renderReflection=mirror.onBeforeRender;let last=-Infinity;
 mirror.onBeforeRender=function(renderer,scene,camera,...args){if(scene.overrideMaterial)return;const now=performance.now();if(now-last<(LOW?400:160))return;last=now;renderReflection.call(this,renderer,scene,camera,...args);};
 root.add(mirror);
}
