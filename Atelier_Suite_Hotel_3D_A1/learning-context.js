// Une phrase décrit l’exemplaire sélectionné, même si plusieurs objets partagent le même mot.
export function createLearningContext(data){
 const words=new Map(data.vocab.map(v=>[v.id,v]));
 const variants=new Map((data.variants||[]).map(v=>[v.id,v]));
 return root=>{
  const id=root?.userData.vid,base=words.get(id);if(!base)return null;
  const variant=variants.get(root.userData.variantId);
  return {...base,...variant,id,variantId:variant?.id,wordAudio:variant?.wordAudio||'w_'+id,sentenceAudio:variant?.sentenceAudio||'e_'+id};
 };
}
