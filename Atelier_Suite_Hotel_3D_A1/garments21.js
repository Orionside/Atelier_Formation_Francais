import * as THREE from 'three';

// Des silhouettes distinctes, avec col, boutons, revers, coutures et épaisseur de tissu.
export function installColorGarments({ward,variants,MAT,B,C,G,REAL,reg}){
 const width=2.9-.055,H=2.9*956/1293,bottom=.07;
 const xFromPhoto=x=>(.5-(x-119)/1279)*width;
 const wood=new THREE.MeshBasicMaterial({map:MAT.oakFurn.map,color:0xddc29a});
 for(const [x,y,w,h] of [[313,439,263,509],[600,439,312,339]]){
  B(w/1279*width,h/937*(H-.045),.006,wood,xFromPhoto(x+w/2),bottom+H/2+(.5-(y+h-85)/937)*(H-.045),.239,ward);
 }
 const all=G(ward);reg(all,'vetements');Object.assign(all.userData,{wardrobeItem:true,colorFamily:true,inspectionYaw:Math.PI,inspectionPitch:.08});
 for(const family of ['chemises','pantalon','vestes','robes']){
  const entries=variants.filter(v=>v.vid===family&&v.garment);
  const px={vestes:387,robes:520,chemises:682,pantalon:842}[family];
  const group=G(all,xFromPhoto(px),1.10,.025);reg(group,family);
  Object.assign(group.userData,{wardrobeItem:true,inspectionYaw:Math.PI,inspectionPitch:.08,colorFamily:true});
  entries.forEach((v,i)=>{
   const item=G(group,(i-1)*.075,(i-1)*-.013,-.075+i*.065,Math.PI+(i-1)*.17);
   const mat=MAT.linen.clone();mat.color.set(v.hex);mat.roughness=.88;mat.sheen=.35;
   const seam=mat.clone();seam.color.multiplyScalar(.70);
   const points=v.garment==='pantalon'?[[-.115,.31],[.115,.31],[.13,-.36],[.025,-.36],[0,.075],[-.025,-.36],[-.13,-.36]]:
    v.garment==='robe'?[[-.075,.30],[-.125,.265],[-.12,.14],[-.067,.07],[-.17,-.40],[.17,-.40],[.067,.07],[.12,.14],[.125,.265],[.075,.30],[.035,.23],[-.035,.23]]:
    [[-.055,.30],[-.13,.255],[-.205,-.035],[-.15,-.06],[-.10,.13],[-.102,-.27],[.102,-.27],[.10,.13],[.15,-.06],[.205,-.035],[.13,.255],[.055,.30],[.028,.245],[-.028,.245]];
   const shape=new THREE.Shape();points.forEach(([x,y],n)=>n?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();
   const geo=new THREE.ExtrudeGeometry(shape,{depth:.012,bevelEnabled:true,bevelSize:.004,bevelThickness:.004,bevelSegments:2,curveSegments:12});
   const positions=geo.attributes.position;
   for(let n=0;n<positions.count;n++){const x=positions.getX(n),y=positions.getY(n);positions.setZ(n,positions.getZ(n)+.004*Math.sin(x*35+y*12));}
   geo.computeVertexNormals();const cloth=new THREE.Mesh(geo,mat);cloth.castShadow=cloth.receiveShadow=true;item.add(cloth);
   // Le cintre reste dans le vêtement, avec un crochet fin à la hauteur de la tringle.
   REAL.tube(item,[[-.10,.263,-.002],[0,.312,-.002],[.10,.263,-.002]],.004,MAT.oakFurn,20);
   REAL.tube(item,[[0,.312,0],[0,.353,0],[.014,.367,0],[.025,.352,0]],.002,MAT.chrome,16);
   if(v.garment==='pantalon'){
    B(.23,.018,.016,seam,0,.292,.012,item,{r:.003});
    for(const x of [-.076,.076])REAL.tube(item,[[x,.285,.020],[x*.75,.12,.021],[x,-.34,.019]],.001,seam,20);
    B(.03,.018,.004,MAT.chrome,0,.292,.022,item,{r:.002});
   }else if(v.garment==='robe'){
    B(.137,.014,.018,seam,0,.069,.008,item,{r:.004});
    for(const x of [-.11,-.065,.065,.11])REAL.tube(item,[[x*.45,.06,.019],[x*.8,-.12,.02],[x,-.38,.02]],.001,seam,24);
   }else{
    const lapel=v.garment==='veste';
    for(const side of [-1,1]){
     const collar=new THREE.Shape();collar.moveTo(side*.008,.248);collar.lineTo(side*.052,.295);collar.lineTo(side*(lapel?.080:.060),lapel?.14:.23);collar.lineTo(side*.026,lapel?.17:.214);collar.closePath();
     const c=new THREE.Mesh(new THREE.ExtrudeGeometry(collar,{depth:.007,bevelEnabled:false}),seam);c.position.z=.014;item.add(c);
     B(lapel?.053:.045,lapel?.010:.043,.003,seam,side*.060,lapel?-.14:.08,.022,item,{r:.003});
     REAL.tube(item,[[side*.102,-.25,.021],[side*.096,.08,.021],[side*.133,.247,.019]],.001,seam,24);
    }
    for(let n=0;n<(lapel?3:6);n++){
     const button=new THREE.Mesh(new THREE.SphereGeometry(.003,10,8),lapel?MAT.blackMetal:MAT.linen);button.scale.z=.4;button.position.set(0,.16-n*(lapel?.115:.068),.023);item.add(button);
    }
    REAL.tube(item,[[0,.22,.020],[0,-.25,.020]],.001,seam,20);
   }
   reg(item,family);Object.assign(item.userData,{wardrobeItem:true,variantId:v.id,inspectionYaw:0,inspectionPitch:.08});
  });
 }
}
