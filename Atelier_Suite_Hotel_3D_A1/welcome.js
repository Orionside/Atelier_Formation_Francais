import * as THREE from 'three';

const photo='assets/characters/louise-receptionniste-v1.webp';

export async function prepareReceptionist(renderer){
 const texture=await new THREE.TextureLoader().loadAsync(photo);
 texture.colorSpace=THREE.SRGBColorSpace;
 texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
 // Les zones transparentes ne doivent pas intercepter les clics sur le décor.
 const canvas=document.createElement('canvas');
 canvas.width=texture.image.width;canvas.height=texture.image.height;
 const context=canvas.getContext('2d',{willReadFrequently:true});
 context.drawImage(texture.image,0,0);
 return {texture,alpha:context.getImageData(0,0,canvas.width,canvas.height).data,width:canvas.width,height:canvas.height};
}

export function installReceptionist(root,prepared){
 const {texture,alpha,width,height}=prepared;
 root.clear();delete root.userData.head;
 root.userData.photographic=true;
 root.userData.dynamicVisual=true;
 root.userData.photo=photo;
 root.rotation.y=Math.PI;
 const bodyHeight=1.80;
 const material=new THREE.MeshBasicMaterial({map:texture,transparent:true,alphaTest:.35,side:THREE.DoubleSide,toneMapped:false});
 const body=new THREE.Mesh(new THREE.PlaneGeometry(bodyHeight*width/height,bodyHeight),material);
 body.name='Louise · réceptionniste';body.position.y=bodyHeight/2;
 body.userData.root=root;
 const raycast=body.raycast;
 body.raycast=function(raycaster,hits){
  const candidates=[];raycast.call(this,raycaster,candidates);
  for(const hit of candidates){
   const x=Math.min(width-1,Math.max(0,Math.floor(hit.uv.x*width)));
   const y=Math.min(height-1,Math.max(0,Math.floor((1-hit.uv.y)*height)));
   if(alpha[(y*width+x)*4+3]>=90)hits.push(hit);
  }
 };
 root.add(body);
}
