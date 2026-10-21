// Même sélection au pointeur, au clavier et dans la liste de secours.
export function canLearnWardrobeItem(root,state,dynamic){
 if(!root?.userData.wardrobeItem||!state.wardrobeOpen||state.wardrobeMoving)return false;
 const i=root.userData.drawerIndex;
 return i===undefined||root.userData.vid==='tiroirs'||(!!dynamic.wardDrawers[i]?.open&&!dynamic.wardDrawers[i]?.moving);
}
export function createWardrobeLearning({roots,vocab,state,dynamic,say,markSeen,learningEntry}){
 const wardrobe=()=>roots.find(r=>r.userData.wardrobe);
 const accessible=root=>canLearnWardrobeItem(root,state,dynamic);
 function items(source=wardrobe()){
  const result=[],keys=new Set();
  for(const root of roots){
   if(!root.userData.wardrobeItem||!root.visible||!vocab[root.userData.vid]||root.userData.variantId&&!root.userData.variantId.startsWith('coussins_'))continue;
   let p=root;while(p&&p!==source)p=p.parent;if(!p)continue;
   const key=root.userData.vid+':'+(root.userData.variantId??root.userData.drawerIndex??'');
   if(keys.has(key))continue;keys.add(key);result.push(root);
  }
  return result;
 }
 function html(source,{expanded=false}={}){
  const list=items(source);if(!list.length)return '';
  return `${source.userData.wardrobe?'<button class="btn wardrobe-practice" data-ward-colors>Pratiquer les vêtements et les couleurs</button>':''}<details class="wardrobe-inventory" ${expanded?'open':''}><summary>Les objets de l’armoire</summary><div class="wardrobe-selection" hidden><p class="wardrobe-selected-word" aria-live="polite"></p><p class="wardrobe-selected-phrase"></p><div class="card-actions"><button class="btn" data-ward-listen="word">Écouter le mot choisi</button><button class="btn" data-ward-listen="sentence">Écouter sa phrase</button><button class="btn" data-ward-closeup>Voir cet objet de près</button>${source.userData.wardrobe?'<button class="btn" data-ward-colors data-ward-color-return hidden>Choisir un autre vêtement</button>':''}</div></div><p>Choisissez un objet pour écouter son nom. Ouvrez un tiroir pour découvrir son contenu.</p><div class="wardrobe-items">${list.map(root=>{
   const d=root.userData,v=learningEntry(root),i=d.drawerIndex;
   const label=d.vid==='tiroirs'?'Le tiroir '+(i+1):(d.variantId?v.label:v.w)+(i===undefined?'':' · tiroir '+(i+1));
   return `<button class="btn" data-ward-item="${root.uuid}" aria-pressed="false">${label}</button>`;
  }).join('')}</div>${source.userData.wardrobe?colorChoices():''}</details>`;
 }
 function colorChoices(){
  const clothes=roots.filter(r=>r.userData.variantId&&learningEntry(r)?.garment);
  return `<div class="wardrobe-colors"><h3>Les vêtements et les couleurs</h3><p>Choisissez un vêtement. Dites sa couleur, puis écoutez la phrase.</p>${['chemises','pantalon','vestes','robes'].map(id=>`<p class="wardrobe-family">${vocab[id].w}</p><div class="wardrobe-items">${clothes.filter(r=>r.userData.vid===id).map(r=>{const v=learningEntry(r);return `<button class="btn" data-ward-item="${r.uuid}" aria-pressed="false"><span class="color-swatch" style="--swatch:#${v.hex.toString(16).padStart(6,'0')}"></span>${v.label}</button>`;}).join('')}</div>`).join('')}</div>`;
 }
 function refresh(){
  document.querySelectorAll('[data-ward-item]').forEach(b=>{const root=roots.find(r=>r.uuid===b.dataset.wardItem);b.disabled=!root||!accessible(root);b.title=b.disabled?'Ouvrez complètement les portes et, si nécessaire, le tiroir.':'';});
  document.querySelectorAll('[data-ward-colors]').forEach(b=>{b.disabled=!state.wardrobeOpen||state.wardrobeMoving;b.title=b.disabled?'Ouvrez complètement les portes pour pratiquer.':'';});
 }
 function choose(root,parent){
  if(!root?.userData.wardrobeItem||!accessible(root))return false;
  const v=learningEntry(root),panel=parent.querySelector('.wardrobe-selection');if(!v||!panel)return false;
  panel.hidden=false;panel.dataset.selected=root.uuid;
  panel.closest('details').open=true;
  panel.querySelector('.wardrobe-selected-word').textContent=v.w;
  panel.querySelector('.wardrobe-selected-phrase').textContent=v.ex;
  const colorReturn=panel.querySelector('[data-ward-color-return]');if(colorReturn)colorReturn.hidden=!v.garment;
  panel.scrollIntoView({block:'nearest',behavior:'instant'});
  parent.querySelectorAll('[data-ward-item]').forEach(b=>{const item=roots.find(r=>r.uuid===b.dataset.wardItem);b.setAttribute('aria-pressed',String(item===root||(!item?.userData.variantId&&item?.userData.vid===v.id&&item?.userData.drawerIndex===root.userData.drawerIndex)));});
  markSeen(v.id);say(v.wordAudio);return true;
 }
 function bind(parent,source,inspect){
  parent.querySelectorAll('[data-ward-colors]').forEach(b=>b.onclick=()=>{const inventory=parent.querySelector('.wardrobe-inventory'),colors=parent.querySelector('.wardrobe-colors');if(inventory&&colors){inventory.open=true;colors.scrollIntoView({block:'start',behavior:'instant'});colors.querySelector('button')?.focus({preventScroll:true});}});
  parent.querySelectorAll('[data-ward-item]').forEach(b=>b.onclick=()=>choose(roots.find(r=>r.uuid===b.dataset.wardItem),parent));
  parent.querySelectorAll('[data-ward-listen]').forEach(b=>b.onclick=()=>{const root=roots.find(r=>r.uuid===parent.querySelector('.wardrobe-selection')?.dataset.selected);if(root){const v=learningEntry(root);say(b.dataset.wardListen==='word'?v.wordAudio:v.sentenceAudio);}});
  const view=parent.querySelector('[data-ward-closeup]');if(view)view.onclick=()=>{const root=roots.find(r=>r.uuid===parent.querySelector('.wardrobe-selection')?.dataset.selected);if(root)inspect(root,learningEntry(root));};
  refresh();
 }
 return {html,bind,choose,refresh,wardrobe,accessible,entry:learningEntry};
}
