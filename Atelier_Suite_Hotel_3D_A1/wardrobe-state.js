// Les contraintes restent actives pendant toute la course des portes et des tiroirs.
export function createWardrobeController(state, dynamic, animate, changed = () => {}) {
  const drawers = () => dynamic.wardDrawers || [];
  function act(action) {
    if (action === 'wardrobe') {
      if (state.wardrobeMoving) return 'Les portes sont en mouvement. Attendez un instant.';
      if (state.wardrobeOpen && drawers().some(d => d.open || d.moving || d.group.position.z !== d.closedZ))
        return 'Fermez d’abord les trois tiroirs avant de fermer les portes de l’armoire.';
      state.wardrobeOpen = !state.wardrobeOpen;
      state.wardrobeMoving = true;
      let remaining = dynamic.wardDoors.length;
      for (const door of dynamic.wardDoors) animate(door.hinge.rotation.y,
        state.wardrobeOpen ? door.s * Math.PI/2 : 0, .9,
        value => door.hinge.rotation.y = value,
        () => { door.hinge.rotation.y=state.wardrobeOpen ? door.s*Math.PI/2 : 0;
          if (--remaining === 0) { state.wardrobeMoving = false; changed(); } });
      changed();
      return null;
    }
    const index = Number(action.split(':')[1]), drawer = drawers()[index];
    if (!drawer) return null;
    if (!state.wardrobeOpen || state.wardrobeMoving)
      return 'Ouvrez d’abord complètement les portes de l’armoire.';
    if (drawer.moving) return 'Le tiroir est en mouvement. Attendez un instant.';
    drawer.open = !drawer.open;
    drawer.moving = true;
    animate(drawer.group.position.z, drawer.closedZ - (drawer.open ? .39 : 0), .65,
      value => drawer.group.position.z = value,
      () => { drawer.group.position.z=drawer.closedZ-(drawer.open ? .39 : 0);drawer.moving = false; changed(); });
    changed();
    return null;
  }
  function controls() {
    return [{action:'wardrobe', label:state.wardrobeOpen ? 'Fermer les portes' : 'Ouvrir les portes',
      disabled:!!state.wardrobeMoving || (state.wardrobeOpen && drawers().some(d => d.open || d.moving))},
    ...drawers().map((d,i) => ({action:'drawer:'+i,
      label:(d.open ? 'Fermer' : 'Ouvrir')+' le tiroir '+(i+1),
      disabled:!state.wardrobeOpen || !!state.wardrobeMoving || !!d.moving}))];
  }
  return {act, controls};
}
