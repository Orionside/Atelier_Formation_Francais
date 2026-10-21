import * as THREE from 'three';
import {addWardrobePhotoItems,addOrganizedClothes} from './wardrobe-interior.js?v=20261021-2';

const BASE='assets/references20/';
// Le masque de clic suit le même détourage que le matériau, pour laisser les clés accessibles.
function photographRaycast(object,texture,kind){
 const canvas=document.createElement('canvas');canvas.width=texture.image.width;canvas.height=texture.image.height;
 const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(texture.image,0,0);
 const pixels=context.getImageData(0,0,canvas.width,canvas.height).data,raycast=object.raycast;
 const linear=v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;};
 const smooth=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t);};
 object.raycast=function(ray,hits){
  const candidates=[];raycast.call(this,ray,candidates);
  for(const hit of candidates){
   const x=Math.min(canvas.width-1,Math.max(0,Math.floor(hit.uv.x*canvas.width))),y=Math.min(canvas.height-1,Math.max(0,Math.floor((1-hit.uv.y)*canvas.height))),index=(y*canvas.width+x)*4;
   const r=linear(pixels[index]),g=linear(pixels[index+1]),b=linear(pixels[index+2]),hi=Math.max(r,g,b),lo=Math.min(r,g,b);
   if(kind==='vase'?Math.max(smooth(.045,.10,hi-lo),1-smooth(.28,.42,hi))>=.05:lo<=.97)hits.push(hit);
  }
 };
}
export async function prepareFurniture20(){
 const loader=new THREE.TextureLoader(),textures={};
 await Promise.all(Object.entries({wardrobe:'armoire-madox.jpg',rack:'porte-valise.webp',vase:'vase-tulipes.jpg',keys:'cles.jpg'}).map(async([id,file])=>{
  const t=await loader.loadAsync(BASE+file);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;textures[id]=t;
 }));return textures;
}

export function installFurniture20({INTER,MAT,B,C,L,G,REAL,reg,DYN,ST},textures){
 const roots=id=>INTER.filter(r=>r.userData.vid===id);
 const bind=r=>r.traverse(o=>{if(o.isMesh||o.isSprite)o.userData.root=r;});
 const reference=(r,file)=>{r.userData.referencePhoto=BASE+file;};
 function clear(r){
  for(let i=INTER.length-1;i>=0;i--){let p=INTER[i];while(p&&p!==r)p=p.parent;if(p===r&&INTER[i]!==r)INTER.splice(i,1);}
  r.clear();delete r.userData.inspectionSource;
 }
 function crop(texture,x,y,w,h){const t=texture.clone();t.repeat.set(w/1528,h/1080);t.offset.set(x/1528,1-(y+h)/1080);t.needsUpdate=true;return t;}
 function photograph(parent,w,h,map,x,y,z){
  const material=new THREE.MeshBasicMaterial({map,toneMapped:false,side:THREE.DoubleSide});
  const plane=new THREE.Mesh(new THREE.PlaneGeometry(w,h),material);plane.position.set(x,y,z);plane.rotation.y=Math.PI;parent.add(plane);return plane;
 }
 const lightWood=MAT.oakFurn.clone();lightWood.color.set(0xe5c99a);lightWood.roughness=.55;
 const innerWood=lightWood.clone();innerWood.color.set(0xc8a677);
 const chrome=MAT.chrome.clone();chrome.roughness=.24;
 const dark=new THREE.MeshStandardMaterial({color:0x4d3b28,roughness:.9});
 const ward=roots('armoire')[0];
 if(ward){
  clear(ward);ward.position.x=-2.95;
  const W=2.9,H=W*956/1293,bottom=.07;
  // La photographie fournie est conservée comme intérieur : disposition et bois exacts.
  photograph(ward,W-.055,H-.045,crop(textures.wardrobe,119,85,1279,937),0,bottom+H/2,.251);
  addWardrobePhotoItems({ward,texture:textures.wardrobe,reg,G,photograph,crop,W,H,bottom});
  for(const x of [-W/2+.012,W/2-.012])B(.025,H,.59,lightWood,x,bottom,0,ward);
  for(const y of [bottom,bottom+H-.025])B(W,.025,.59,lightWood,0,y,0,ward);
  for(const x of [.414,-.612])B(.018,H-.055,.54,lightWood,x,bottom+.025,.015,ward);
  for(const y of [1.54,1.84]){const shelf=G(ward);B(W-.07,.018,.52,lightWood,0,y,.025,shelf);reg(shelf,'etageres');shelf.userData.wardrobeItem=true;}
  // Niches des tiroirs : le fond photographique est masqué lorsqu'un tiroir sort.
  B(.697,.52,.016,dark,-1.032,.145,-.223,ward);
  DYN.wardDrawers=[];
  const faces=[[1074,787,291,59],[1074,858,291,63],[1074,930,291,59]];
  for(let i=0;i<3;i++){
   const y=.149+(2-i)*.165,drawer=G(ward,-1.032,y,-.263);
   drawer.userData.dynamicVisual=true;
   const w=.654,d=.47,h=.145;
   B(w,.013,d,innerWood,0,.012,d/2,drawer);
   for(const x of [-w/2+.009,w/2-.009])B(.016,h-.02,d,lightWood,x,.025,d/2,drawer);
   B(w-.025,h-.035,.016,lightWood,0,.025,d-.008,drawer);
   B(w,h,.019,lightWood,0,0,0,drawer);
   photograph(drawer,w,h,crop(textures.wardrobe,...faces[i]),0,h/2,-.0105);
   for(const x of [-w/2-.012,w/2+.012]){B(.007,.015,d,chrome,x,.04,d/2,drawer);B(.007,.011,.30,chrome,x,.065,.12,drawer);}
   DYN.wardDrawers.push({group:drawer,closedZ:drawer.position.z,open:false,moving:false});
   reg(drawer,'tiroirs',{act:'drawer:'+i});reference(drawer,'armoire-madox.jpg');
   const items=addOrganizedClothes({drawer,index:i,MAT,B,G,REAL,reg});
   Object.assign(drawer.userData,{wardrobeItem:true,drawerIndex:i,inspectionPitch:1.05,inspectionYaw:Math.PI});
   bind(drawer);for(const item of items)bind(item);
  }
  // Le coffre occupe une niche au-dessus des tiroirs, posé sur une étagère pleine.
  // Son panneau de fond masque les serviettes de la photographie dans cette seule niche.
  B(.70,.326,.018,innerWood,-1.032,.646,.222,ward);
  const safeShelf=G(ward);B(.70,.025,.54,lightWood,-1.032,.646,.012,safeShelf);reg(safeShelf,'etageres');safeShelf.userData.wardrobeItem=true;
  const safe=G(ward,-1.032,.674,-.012);
  B(.49,.245,.36,MAT.blackMetal,0,0,0,safe,{r:.012});
  B(.447,.207,.012,MAT.blackMetal,0,.019,-.185,safe,{r:.008});
  B(.116,.076,.008,MAT.chrome,-.091,.092,-.195,safe,{r:.005});
  for(let row=0;row<3;row++)for(let col=0;col<3;col++)B(.019,.014,.004,MAT.blackMetal,-.125+col*.034,.101+row*.018,-.201,safe,{r:.002});
  B(.023,.078,.018,MAT.chrome,.112,.085,-.202,safe,{r:.006});
  reg(safe,'coffre');safe.userData.wardrobeItem=true;safe.userData.inspectionYaw=Math.PI;
  DYN.wardDoors=[];
  for(const [hx,s]of [[-W/2,1],[W/2,-1]]){
   const hinge=G(ward,hx,bottom,-.32),width=W/2;hinge.userData.dynamicVisual=true;
   const glass=new THREE.MeshPhysicalMaterial({color:0xe7f2ed,transparent:true,opacity:.12,roughness:.08,metalness:.08,depthWrite:false,side:THREE.DoubleSide});
   B(width-.045,H-.065,.006,glass,s*width/2,.032,0,hinge);
   for(const x of [s*.012,s*(width-.012)])B(.024,H,.038,lightWood,x,0,0,hinge);
   for(const y of [0,H-.024])B(width,.024,.038,lightWood,s*width/2,y,0,hinge);
   B(.012,.28,.025,chrome,s*(width-.065),.85,-.029,hinge,{r:.005});
   for(const y of [.22,1.10,H-.22])C(.009,.009,.055,chrome,s*.025,y,.012,hinge,{seg:12});
   DYN.wardDoors.push({hinge,s});
  }
  ward.userData.inspectionYaw=Math.PI;ward.userData.inspectionPitch=.32;ward.userData.wardrobe=true;reference(ward,'armoire-madox.jpg');
  bind(ward);
  for(const r of INTER.filter(r=>r!==ward)){let p=r.parent;while(p&&p!==ward)p=p.parent;if(p===ward)bind(r);}
 }
 // Porte-valise de la référence : panneaux en noyer, plateau et neuf bandes inox.
 const rack=roots('porte_bagages')[0];if(rack){clear(rack);rack.position.x=-1.06;const wood=MAT.walnut.clone();wood.color.set(0x5c4233);
  B(.76,.045,.49,wood,0,.47,0,rack,{r:.003});
  for(const x of [-.354,.354]){B(.045,.47,.49,wood,x,0,0,rack);B(.065,.47,.055,wood,x,0,-.222,rack);}
  B(.67,.37,.025,wood,0,.10,.227,rack);
  for(let i=0;i<9;i++)B(.012,.005,.421,chrome,-.30+i*.075,.515,0,rack,{r:.002});
  rack.userData.inspectionYaw=Math.PI+.38;rack.userData.inspectionPitch=.33;reference(rack,'porte-valise.webp');bind(rack);
  for(const suitcase of roots('valise'))if(Math.abs(suitcase.position.x+1.4)<.01&&suitcase.position.z<4)suitcase.position.x=-1.06;
 }
 // Image exacte du bouquet. La transparence se calcule sur le fond neutre de la photo.
 const flowers=roots('fleurs').find(r=>Math.abs(r.position.x-1.7)<.01&&Math.abs(r.position.z-3.3)<.01);
 if(flowers){clear(flowers);flowers.position.y=.817;flowers.position.z=3.20;
  const mat=new THREE.SpriteMaterial({map:textures.vase,transparent:true,depthWrite:false,toneMapped:false});
  mat.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
   float hi=max(diffuseColor.r,max(diffuseColor.g,diffuseColor.b));
   float lo=min(diffuseColor.r,min(diffuseColor.g,diffuseColor.b));
   diffuseColor.a*=max(smoothstep(.045,.10,hi-lo),1.-smoothstep(.28,.42,hi));
   if(diffuseColor.a<.05)discard;`);};
  mat.customProgramCacheKey=()=> 'tulips-neutral-background-v1';
  const bouquet=new THREE.Sprite(mat);bouquet.scale.set(.57,.57,1);bouquet.center.set(.5,0);photographRaycast(bouquet,textures.vase,'vase');flowers.add(bouquet);reg(flowers,'fleurs');reference(flowers,'vase-tulipes.jpg');
  const vase=G(flowers);B(.19,.25,.15,new THREE.MeshBasicMaterial({visible:false}),0,0,0,vase);reg(vase,'vase');vase.userData.photo=BASE+'vase-tulipes.jpg';
  flowers.userData.photo=BASE+'vase-tulipes.jpg';bind(flowers);bind(vase);
 }
 // Clés photographiques sur le vide-poche, avec le porte-clés brun et l'anneau argenté.
 const keys=INTER.find(r=>r.userData.obj==='cles');if(keys){clear(keys);keys.position.set(2.17,.849,3.26);keys.rotation.y=.42;
  const mat=new THREE.MeshBasicMaterial({map:textures.keys,transparent:true,side:THREE.DoubleSide,toneMapped:false});
  mat.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
   if(min(diffuseColor.r,min(diffuseColor.g,diffuseColor.b))>.97)discard;`);};mat.customProgramCacheKey=()=> 'keys-white-background-v1';
  const photo=new THREE.Mesh(new THREE.PlaneGeometry(.15,.17),mat);photo.rotation.x=-Math.PI/2;photographRaycast(photo,textures.keys,'keys');keys.add(photo);reference(keys,'cles.jpg');keys.userData.photo=BASE+'cles.jpg';bind(keys);
  keys.visible=!ST.found.cles;
 }
}
