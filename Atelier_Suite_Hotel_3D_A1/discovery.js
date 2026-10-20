import * as THREE from 'three';
/* Repères en HTML : vraies cibles de 44 px, clavier, détection des murs occultants. */
export function createDiscovery({scene,camera,roots,vocab,select,visible,blocked}){
 const layer=document.createElement('div');layer.id='objectLabels';layer.setAttribute('aria-label','Objets visibles dans la pièce');document.body.append(layer);
 const toggle=document.querySelector('#btnLabels');let enabled=true,last=0;const buttons=new Map(),bounds=new Map(),ray=new THREE.Raycaster(),pos=new THREE.Vector3(),dir=new THREE.Vector3(),ndc=new THREE.Vector3(),eye=new THREE.Vector3();
 toggle.onclick=()=>{enabled=!enabled;toggle.setAttribute('aria-pressed',String(enabled));toggle.textContent=enabled?'Masquer les repères':'Repérer les objets';layer.hidden=!enabled;};
 ray.camera=camera;
 const generic=new Set(['sol','mur','plafond','couloir','reception','salle_bains','mer','montagne','plage','piscine','balcon','canape_hall','palmiers']);
 function anchor(root){let a=bounds.get(root);if(a)return a;root.updateWorldMatrix(true,true);const b=new THREE.Box3().setFromObject(root),point=b.getCenter(new THREE.Vector3());if(root.userData.vid==='receptionniste')point.y=b.min.y+(b.max.y-b.min.y)*.83;a={local:root.worldToLocal(point),size:b.getSize(new THREE.Vector3())};bounds.set(root,a);return a;}
 function occluded(root,point){dir.copy(point).sub(eye);const distance=dir.length();ray.set(eye,dir.divideScalar(distance));ray.far=distance+.05;for(const h of ray.intersectObject(scene,true)){if(!h.object.isMesh||!visible(h.object)||h.object.userData.pass||h.object.material?.transparent&&h.object.material.opacity<.5)continue;const owner=h.object.userData.root;if(owner===root||h.object===root)return false;if(h.distance<distance-.06)return true;return false;}return false;}
 return function update(now){if(now-last<250)return;last=now;const hidden=!enabled||blocked();layer.hidden=hidden;if(hidden)return;eye.copy(camera.position);const pane=document.querySelector('#fiche');const left=pane&&!pane.hidden&&!pane.classList.contains('folded')?Math.min(390,pane.getBoundingClientRect().right+15):14;const candidates=[];
  for(const root of roots){const id=root.userData.vid,v=vocab[id];if(!v||generic.has(id)||!visible(root))continue;const a=anchor(root);root.localToWorld(pos.copy(a.local));const distance=pos.distanceTo(eye);if(distance>8||distance<.3)continue;ndc.copy(pos).project(camera);if(ndc.z<0||ndc.z>1||Math.abs(ndc.x)>.90||Math.abs(ndc.y)>.80)continue;
   const x=(ndc.x*.5+.5)*innerWidth,y=(-ndc.y*.5+.5)*innerHeight;if(x<left||x>innerWidth-20||y<105||y>innerHeight-115)continue;candidates.push({root,v,distance,x,y,point:pos.clone()});
  }
  candidates.sort((a,b)=>a.distance-b.distance);const used=[],shown=new Set(),words=new Set();
  for(const c of candidates){if(used.length>=9)break;if(words.has(c.v.id)||used.some(a=>Math.abs(a.x-c.x)<155&&Math.abs(a.y-c.y)<54)||occluded(c.root,c.point))continue;used.push(c);words.add(c.v.id);shown.add(c.root);let b=buttons.get(c.root);if(!b){b=document.createElement('button');b.className='object-label';b.type='button';b.textContent=c.v.w;b.setAttribute('aria-label','Découvrir : '+c.v.w);b.onclick=e=>{e.stopPropagation();select(c.root);};layer.append(b);buttons.set(c.root,b);}b.hidden=false;b.style.left=Math.max(left+80,Math.min(innerWidth-90,c.x))+'px';b.style.top=c.y+'px';}
  for(const [root,b] of buttons)if(!shown.has(root))b.hidden=true;
 };
}
