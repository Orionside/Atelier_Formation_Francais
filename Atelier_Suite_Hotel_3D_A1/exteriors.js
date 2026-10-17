import * as THREE from 'three';
// Photos de vrais lieux, utilisées comme images de vocabulaire de l'hôtel fictif.
export function exteriorLearning({STATIC,INTER,MAT,G,B,C,REAL,reg,openModal,closeModal,inspectObject,VOC,say,stopAudio}){
 const ids=['piscine','palmiers','plage','mer','montagne'];
 for(const id of ids){const root=G(STATIC);root.userData.photo=`assets/photoreal/exteriors/${id}.webp`;reg(root,id);}
 // Un parasol replié, rangé sur le balcon : huit lés, armatures, virole et pied lesté.
 const umbrella=G(STATIC,-.95,0,-4.94),pole=MAT.oakFurn;C(.19,.22,.035,MAT.blackMetal,0,0,0,umbrella,{seg:48});C(.016,.02,2.27,pole,0,.025,0,umbrella,{seg:24});
 for(let i=0;i<8;i++){
  const a=i*Math.PI/4,cloth=REAL.cloth(umbrella,1,1,[0,0,0],(u,v)=>{const angle=a+u*Math.PI/4,r=.035+.15*Math.sin(v*Math.PI*.85)+.025*Math.sin(u*Math.PI);return[Math.cos(angle)*r,2.20-v*1.24,Math.sin(angle)*r];},MAT.linen,10,28);cloth.material=MAT.linen.clone();cloth.material.side=THREE.DoubleSide;
  REAL.tube(umbrella,[[Math.cos(a)*.025,2.2,Math.sin(a)*.025],[Math.cos(a)*.12,1.6,Math.sin(a)*.12],[Math.cos(a)*.12,.96,Math.sin(a)*.12]],.003,MAT.brass,20);
 }
 C(.16,.16,.035,MAT.velvetTeal,0,1.42,0,umbrella,{seg:48,open:true});C(.027,.027,.055,MAT.brass,0,2.23,0,umbrella,{seg:24});reg(umbrella,'parasol');umbrella.userData.inspectionYaw=.4;
 const button=document.createElement('button');button.className='exteriors-trigger btn';button.textContent='Les extérieurs';button.hidden=true;document.body.append(button);
 button.onclick=()=>{
  stopAudio();openModal(`<h2>Les extérieurs</h2><p class="lead">Choisissez une photo. Écoutez, puis dites une phrase.</p><div class="exterior-grid">${ids.map(id=>`<button class="exterior-tile" data-exterior="${id}"><img src="assets/photoreal/exteriors/${id}.webp" alt=""><span>${VOC[id].w}</span></button>`).join('')}<button class="exterior-tile exterior-object" data-exterior="parasol"><span class="object-caption">${VOC.parasol.w}</span><small>Voir de près</small></button></div>`,stopAudio);
  document.querySelectorAll('[data-exterior]').forEach(b=>b.onclick=()=>{const id=b.dataset.exterior;closeModal();inspectObject(INTER.find(r=>r.userData.vid===id),VOC[id]);say('w_'+id);});
 };
 return zone=>{button.hidden=zone!=='balcon';};
}
