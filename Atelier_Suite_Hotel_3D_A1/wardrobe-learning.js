// Même sélection au pointeur, au clavier et dans la liste de secours.
export function canLearnWardrobeItem(root,state,dynamic){
 if(!root?.userData.wardrobeItem||!state.wardrobeOpen||state.wardrobeMoving)return false;
 const i=root.userData.drawerIndex;
 return i===undefined||root.userData.vid==='tiroirs'||(!!dynamic.wardDrawers[i]?.open&&!dynamic.wardDrawers[i]?.moving);
}
export function createWardrobeLearning({roots,vocab,state,dynamic,say,markSeen}){
 const wardrobe=()=>roots.find(r=>r.userData.wardrobe);
 const accessible=root=>canLearnWardrobeItem(root,state,dynamic);
 function items(source=wardrobe()){
  const result=[],keys=new Set();
  for(const root of roots){
   if(!root.userData.wardrobeItem||!vocab[root.userData.vid])continue;
   let p=root;while(p&&p!==source)p=p.parent;if(!p)continue;
   const key=root.userData.vid+':'+(root.userData.drawerIndex??'');
   if(keys.has(key))continue;keys.add(key);result.push(root);
  }
  return result;
 }
 function html(source,{expanded=false}={}){
  const list=items(source);if(!list.length)return '';
  return `<details class="wardrobe-inventory" ${expanded?'open':''}><summary>Les objets de l’armoire</summary><div class="wardrobe-selection" hidden><p class="wardrobe-selected-word" aria-live="polite"></p><p class="wardrobe-selected-phrase"></p><div class="card-actions"><button class="btn" data-ward-listen="word">Écouter le mot choisi</button><button class="btn" data-ward-listen="sentence">Écouter sa phrase</button><button class="btn" data-ward-closeup>Voir cet objet de près</button></div></div><p>Choisissez un objet pour écouter son nom. Ouvrez un tiroir pour découvrir son contenu.</p><div class="wardrobe-items">${list.map(root=>{
   const d=root.userData,v=vocab[d.vid],i=d.drawerIndex;
   const label=d.vid==='tiroirs'?'Le tiroir '+(i+1):v.w+(i===undefined?'':' · tiroir '+(i+1));
   return `<button class="btn" data-ward-item="${root.uuid}" aria-pressed="false">${label}</button>`;
  }).join('')}</div></details>`;
 }
 function refresh(){
  document.querySelectorAll('[data-ward-item]').forEach(b=>{const root=roots.find(r=>r.uuid===b.dataset.wardItem);b.disabled=!root||!accessible(root);b.title=b.disabled?'Ouvrez complètement les portes et, si nécessaire, le tiroir.':'';});
 }
 function choose(root,parent){
  if(!root?.userData.wardrobeItem||!accessible(root))return false;
  const v=vocab[root.userData.vid],panel=parent.querySelector('.wardrobe-selection');if(!v||!panel)return false;
  panel.hidden=false;panel.dataset.selected=root.uuid;
  panel.closest('details').open=true;
  panel.querySelector('.wardrobe-selected-word').textContent=v.w;
  panel.querySelector('.wardrobe-selected-phrase').textContent=v.ex;
  panel.scrollIntoView({block:'nearest',behavior:'instant'});
  parent.querySelectorAll('[data-ward-item]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.wardItem===root.uuid||((roots.find(r=>r.uuid===b.dataset.wardItem)?.userData.vid===v.id)&&(roots.find(r=>r.uuid===b.dataset.wardItem)?.userData.drawerIndex===root.userData.drawerIndex)))));
  markSeen(v.id);say('w_'+v.id);return true;
 }
 function bind(parent,source,inspect){
  parent.querySelectorAll('[data-ward-item]').forEach(b=>b.onclick=()=>choose(roots.find(r=>r.uuid===b.dataset.wardItem),parent));
  parent.querySelectorAll('[data-ward-listen]').forEach(b=>b.onclick=()=>{const root=roots.find(r=>r.uuid===parent.querySelector('.wardrobe-selection')?.dataset.selected);if(root)say((b.dataset.wardListen==='word'?'w_':'e_')+root.userData.vid);});
  const view=parent.querySelector('[data-ward-closeup]');if(view)view.onclick=()=>{const root=roots.find(r=>r.uuid===parent.querySelector('.wardrobe-selection')?.dataset.selected);if(root)inspect(root,vocab[root.userData.vid]);};
  refresh();
 }
 return {html,bind,choose,refresh,wardrobe,accessible,entry:root=>vocab[root.userData.vid]};
}
