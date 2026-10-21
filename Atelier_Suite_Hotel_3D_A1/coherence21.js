import * as THREE from 'three';
import {installColorGarments} from './garments21.js?v=20261021-3';

const BASE='assets/coherence21/';
const samples=new WeakMap();
function photoRaycast(object,texture,cutWhite=false){
 let sample=samples.get(texture);
 if(!sample){const canvas=document.createElement('canvas');canvas.width=texture.image.width;canvas.height=texture.image.height;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(texture.image,0,0);sample={w:canvas.width,h:canvas.height,pixels:ctx.getImageData(0,0,canvas.width,canvas.height).data};samples.set(texture,sample);}
 const original=object.raycast;
 const linear=x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;};
 object.raycast=function(ray,hits){const candidates=[];original.call(this,ray,candidates);for(const hit of candidates){if(!hit.uv)continue;const x=Math.min(sample.w-1,Math.max(0,Math.floor(hit.uv.x*sample.w))),y=Math.min(sample.h-1,Math.max(0,Math.floor((1-hit.uv.y)*sample.h))),i=(y*sample.w+x)*4;let alpha=sample.pixels[i+3]/255;if(cutWhite){const neutral=Math.min(linear(sample.pixels[i]),linear(sample.pixels[i+1]),linear(sample.pixels[i+2])),t=Math.min(1,Math.max(0,(neutral-.70)/.21));alpha*=1-t*t*(3-2*t);}if(alpha>=.08)hits.push(hit);}};
}
export async function prepareCoherence21(MAT,renderer){
 const textures={},loader=new THREE.TextureLoader();
 await Promise.all(Object.entries({socks:'chaussettes.webp',croissant:'croissant.webp',water:'bouteille.webp',fruit:'corbeille.webp',art:'amandier.webp',wall:'chevron.webp',stone:'pierre-terrasse.webp'}).map(async([id,file])=>{
  const t=await loader.loadAsync(BASE+file);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());textures[id]=t;
 }));
 for(const [material,texture,repeat] of [[MAT.plaster,textures.wall,[1.2,1.2]],[MAT.plasterWarm,textures.wall,[1.2,1.2]],[MAT.render,textures.stone,[1,1]]]){
  const map=texture.clone();map.wrapS=map.wrapT=THREE.RepeatWrapping;map.repeat.set(...repeat);map.needsUpdate=true;
  material.map=map;material.color.set(0xffffff);material.normalMap=null;material.bumpMap=map;material.bumpScale=texture===textures.stone?.018:.002;material.roughness=.92;
 }
 return textures;
}

function photoMaterial(texture,cutWhite=false,sprite=false){
 const Type=sprite?THREE.SpriteMaterial:THREE.MeshBasicMaterial;
 const material=new Type({map:texture,transparent:true,alphaTest:.08,side:THREE.DoubleSide,toneMapped:false});
 if(cutWhite){
  material.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
   float neutral=min(diffuseColor.r,min(diffuseColor.g,diffuseColor.b));
   diffuseColor.a*=1.-smoothstep(.70,.91,neutral);
   if(diffuseColor.a<.08)discard;`);};
  material.customProgramCacheKey=()=> 'real-photo-white-background-v1';
 }
 return material;
}

export function installCoherence21({INTER,MAT,B,C,G,REAL,reg,OBST,variants},textures){
 const roots=id=>INTER.filter(r=>r.userData.vid===id);
 const rebind=root=>root.traverse(o=>{if(o.isMesh||o.isSprite)o.userData.root=root;});
 const plane=(root,texture,w,h,x,y,z,cutWhite=false)=>{
  const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),photoMaterial(texture,cutWhite));p.position.set(x,y,z);photoRaycast(p,texture,cutWhite);root.add(p);return p;
 };
 // Croissants photographiés sur une vraie assiette en volume ; deux pièces séparées.
 for(const root of roots('croissants')){
  root.clear();C(.12,.105,.010,MAT.ceramic,0,0,0,root,{seg:48});
  for(const [x,z,angle]of [[-.006,-.045,.12],[.008,.043,-.25]]){
   const p=plane(root,textures.croissant,.19,.126,x,.016,z,true);p.rotation.set(-Math.PI/2,0,angle);
  }
  root.userData.photo=BASE+'croissant.webp';rebind(root);
 }
 // Une corbeille photographique transparente, tournée vers le visiteur.
 for(const root of roots('fruits')){
  root.clear();const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:textures.fruit,transparent:true,alphaTest:.08,toneMapped:false}));
  sprite.scale.set(.48,.48*textures.fruit.image.height/textures.fruit.image.width,1);sprite.center.set(.5,0);root.add(sprite);
  photoRaycast(sprite,textures.fruit);
  root.userData.photo=BASE+'corbeille.webp';rebind(root);
 }
 const water=INTER.find(r=>r.userData.obj==='bouteille');
 if(water){
  water.clear();const sprite=new THREE.Sprite(photoMaterial(textures.water,true,true));
  sprite.scale.set(.29*textures.water.image.width/textures.water.image.height,.29,1);sprite.center.set(.5,0);water.add(sprite);photoRaycast(sprite,textures.water,true);
  // La photographie s’oriente vers le visiteur pour rester explicite depuis la table.
  water.userData.photo=BASE+'bouteille.webp';rebind(water);
 }
 // Le tableau reste dans son cadre. Le passe-partout préserve le format de l’œuvre.
 for(const root of roots('tableau')){root.userData.inspectionYaw=Math.PI;root.userData.inspectionPitch=.08;root.traverse(m=>{
  if(!m.isMesh||!m.material.map||!m.geometry.attributes.uv)return;
  m.geometry.computeBoundingBox();const size=m.geometry.boundingBox.getSize(new THREE.Vector3());if(size.x<.1||size.y<.1||size.z>.01)return;
  const canvas=document.createElement('canvas');canvas.width=Math.round(1024*size.x/Math.max(size.x,size.y));canvas.height=Math.round(1024*size.y/Math.max(size.x,size.y));
  const ctx=canvas.getContext('2d');ctx.fillStyle='#f4f0e6';ctx.fillRect(0,0,canvas.width,canvas.height);
  const image=textures.art.image,scale=Math.min(canvas.width*.90/image.width,canvas.height*.90/image.height),w=image.width*scale,h=image.height*scale;
  ctx.drawImage(image,(canvas.width-w)/2,(canvas.height-h)/2,w,h);
  const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=8;m.material.map=map;m.material.color.set(0xffffff);m.material.needsUpdate=true;
  if(m.material.unbakedMaterial){m.material.unbakedMaterial.map=map;m.material.unbakedMaterial.color.set(0xffffff);m.material.unbakedMaterial.needsUpdate=true;}
 });}
 // Photographie de chaussettes : deux chaussettes bleues par case, six paires.
 const sockImage=textures.socks.image,canvas=document.createElement('canvas');canvas.width=1024;canvas.height=512;
 const ctx=canvas.getContext('2d');
 // Le tiers gauche de la photo source est une chaussette entière, déjà détourée.
 const single=document.createElement('canvas');single.width=Math.ceil(sockImage.width*.58);single.height=sockImage.height;
 const singleContext=single.getContext('2d');singleContext.drawImage(sockImage,0,0);
 const pixels=singleContext.getImageData(0,0,single.width,single.height);
 for(let i=0;i<pixels.data.length;i+=4){const r=pixels.data[i],g=pixels.data[i+1],b=pixels.data[i+2];if(b<r*1.16||b<g*1.08)pixels.data[i+3]=0;}
 singleContext.putImageData(pixels,0,0);
 for(const [x,y,angle]of [[450,170,-Math.PI/2-.08],[580,320,-Math.PI/2+.08]]){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.drawImage(single,-140,-210,280,420);ctx.restore();}
 const socks=new THREE.CanvasTexture(canvas);socks.colorSpace=THREE.SRGBColorSpace;socks.anisotropy=8;
 for(const root of roots('chaussettes')){
  root.clear();const p=plane(root,socks,.22,.11,0,.028,0);p.rotation.x=-Math.PI/2;root.userData.photo=BASE+'chaussettes.webp';rebind(root);
 }
 const ward=roots('armoire')[0];
 if(ward){
  for(const r of INTER){
   if(!r.userData.photoRegion)continue;
   const [id,x,y]=r.userData.photoRegion;
   if((id==='vetements'||id==='chemises')&&x<1000&&y<800)r.visible=false;
  }
  installColorGarments({ward,variants,MAT,B,C,G,REAL,reg});
 }
 // Pied entièrement sur le tapis, au-dessus de son épaisseur et de sa bordure.
 const lamp=roots('lampadaire')[0];
 if(lamp){
  const point=lamp.getWorldPosition(new THREE.Vector3());point.z-=.25;
  const rug=roots('tapis').find(r=>{const b=new THREE.Box3().setFromObject(r);return point.x-.17>b.min.x&&point.x+.17<b.max.x&&point.z-.17>b.min.z&&point.z+.17<b.max.z;});
  if(!rug)throw new Error('Le pied du lampadaire doit reposer entièrement sur un tapis.');
  const box=new THREE.Box3().setFromObject(rug);point.y=box.max.y+.004;
  lamp.position.copy(lamp.parent.worldToLocal(point));
  const obstacle=OBST.find(b=>b.x1===.5&&b.x2===.9&&b.z1===.4&&b.z2===.8);if(obstacle){obstacle.z1-=.25;obstacle.z2-=.25;}
 }
}
