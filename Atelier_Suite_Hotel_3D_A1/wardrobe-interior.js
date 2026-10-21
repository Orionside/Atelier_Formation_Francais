// Coordonnées dans la photographie Madox originale. Chaque élément a son propre lexique.
export const WARDROBE_REGIONS = [
 ['coussins',171,158,223,36],['oreillers',148,195,425,46],
 ['boites_rangement',601,160,422,80],['draps',1045,194,337,49],
 ['serviettes',180,320,386,46],['coussins',599,310,229,51],
 ['serviettes',850,333,167,33],['oreillers',1060,267,322,98],
 ['cintres',341,402,232,38],['cintres',600,401,294,38],
 ['vetements',317,441,255,503],['chemises',604,441,306,329],
 ['cravates',913,442,115,292],['valise',1053,436,136,223],
 ['pantalon',1198,408,169,216],['boites_rangement',1216,628,140,30],
 ['serviettes',152,435,147,50],['serviettes',157,575,145,85],
 ['mallette',160,738,147,112],['pulls',151,895,153,107],
 ['boites_rangement',333,852,133,150],['oreillers',614,794,406,55],
 ['boites_rangement',600,892,420,117],['penderie',334,384,690,18]
];

export function addWardrobePhotoItems({ward,texture,reg,G,photograph,crop,W,H,bottom}){
 const width=W-.055,height=H-.045;
 for(const [id,x,y,w,h] of WARDROBE_REGIONS){
  const group=G(ward,(.5-(x+w/2-119)/1279)*width,bottom+H/2+(.5-(y+h/2-85)/937)*height,.248);
  photograph(group,w/1279*width,h/937*height,crop(texture,x,y,w,h),0,0,0);
  reg(group,id);group.userData.wardrobeItem=true;group.userData.inspectionYaw=Math.PI;group.userData.photoRegion=[id,x,y,w,h];
  if(id==='coussins')group.userData.variantId=y<200?'coussins_noirs_blancs':'coussins_gris';
 }
}

export function addOrganizedClothes({drawer,index,MAT,B,G,REAL,reg}){
 const cream=MAT.linen.clone();cream.color.set(0xd9d1bd);cream.roughness=.98;
 const colors=[0x354653,0xe1d7c6,0x657870,0x8f9699,0x424650,0xb3a38c];
 const clothes=G(drawer,0,.029,.247);
 // Deux colonnes et trois rangées, avec cloisons en textile clair et rebords cousus.
 B(.611,.012,.425,cream,0,0,0,clothes,{r:.004});
 for(const x of [-.305,0,.305])B(.006,.075,.425,cream,x,.008,0,clothes,{r:.002});
 for(const z of [-.212,-.071,.071,.212])B(.61,.075,.005,cream,0,.008,z,clothes,{r:.002});
 const roots=[];
 for(let k=0;k<6;k++){
  const item=G(clothes,k%2? .153:-.153,.013,(Math.floor(k/2)-1)*.142);
  const mat=MAT.linen.clone();mat.color.set(colors[(k+index*2)%colors.length]);mat.roughness=.95;
  const trim=mat.clone();trim.color.multiplyScalar(.76);
  if(index<2){
   // Sous-vêtements unisexes pliés : ceinture, deux jambes et coutures, sans dentelle.
   B(.239,.026,.078,mat,0,.004,-.014,item,{r:.012});
   for(const x of [-.061,.061]){
    B(.113,.027,.059,mat,x,.005,.034,item,{r:.012});
    REAL.tube(item,[[x-.048,.032,.055],[x,.034,.06],[x+.048,.032,.055]],.0014,trim,12);
   }
   REAL.cloth(item,1,1,[0,0,0],(u,v)=>[(u-.5)*.234,.033+Math.sin(u*Math.PI*3)*.002+Math.sin(v*Math.PI)*.004,-.046+v*.080],mat,18,12);
   B(.24,.013,.022,trim,0,.026,-.048,item,{r:.004});
   for(const z of [-.053,-.044])REAL.tube(item,[[-.114,.040,z],[0,.041,z],[.114,.040,z]],.0008,cream,14);
   B(.017,.001,.012,cream,.080,.040,-.048,item,{r:.001});
  }else{
   // Paires de chaussettes pliées : chaque paire occupe un compartiment distinct.
   for(let pair=0;pair<2;pair++){
    const sock=G(item,pair*.014-.007,.016+pair*.018,0);
    REAL.tube(sock,[[-.071,0,-.035],[-.014,.003,-.035],[.018,.002,-.015],[.026,.001,.026],[.074,0,.030]],.023,mat,28);
    B(.045,.026,.046,trim,-.068,-.013,-.035,sock,{r:.008});
    for(let rib=0;rib<6;rib++)B(.001,.002,.038,mat,-.086+rib*.007,.014,-.035,sock);
   }
  }
  reg(item,index<2?'sous_vetements':'chaussettes');
  Object.assign(item.userData,{wardrobeItem:true,drawerIndex:index,inspectionSource:clothes,inspectionPitch:1.05,inspectionYaw:0});
  roots.push(item);
 }
 return roots;
}
