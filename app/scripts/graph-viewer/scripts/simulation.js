/* =======================================================================
  SIMULATION
======================================================================= */
/** Applique une itération de la simulation de forces. */
function tick() {
  const repulsion = 2200;
  const centerPull = 0.0035;
  const damping = 0.86;

  // Répulsion entre toutes les paires de nœuds.
  for (let i = 0; i < nodes.length; i += 1) {
    const left = nodes[i];
    for (let j = i + 1; j < nodes.length; j += 1) {
      const right = nodes[j];
      let dx = right.position.x - left.position.x;
      let dy = right.position.y - left.position.y;
      let distanceSquared = dx * dx + dy * dy;

      // Écarte deux nœuds confondus avec un décalage aléatoire.
      if (distanceSquared < 1) {
        dx = (random() - 0.5) * 2;
        dy = (random() - 0.5) * 2;
        distanceSquared = dx * dx + dy * dy;
      }
      const distance = Math.sqrt(distanceSquared);
      const force = (repulsion / distanceSquared) * alpha;
      const fx = (dx / distance) * force;
      const fy = (dy / distance) * force;
      left.position.vx -= fx;
      left.position.vy -= fy;
      right.position.vx += fx;
      right.position.vy += fy;
    }
  }

  for (const edge of edges) {
    const source = positions.get(edge.from);
    const target = positions.get(edge.to);
    if (!source || !target) continue;

    // Ressorts des arêtes, avec une longueur propre à chaque relation.
    let strength = 0.05;
    let length = 60;
    if (edge.relation === 'related') {
      strength = 0.012;
      length = 120;
    } else if (edge.relation === 'uses-term') {
      strength = 0.018;
      length = 55;
    } else if (edge.relation === 'context') {
      strength = 0.03;
      length = 90;
    }

    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const distance = Math.sqrt(dx * dx + dy * dy) || 1;
    const force = (distance - length) * strength * alpha;
    const fx = (dx / distance) * force;
    const fy = (dy / distance) * force;
    source.vx += fx;
    source.vy += fy;
    target.vx -= fx;
    target.vy -= fy;
  }

  for (const entry of nodes) {
    const position = entry.position;

    // Les nœuds épinglés ne bougent pas.
    if (position.pinned) continue;

    // Rappel vers le centre, amortissement et intégration.
    position.vx += -position.x * centerPull * alpha;
    position.vy += -position.y * centerPull * alpha;
    position.vx *= damping;
    position.vy *= damping;
    position.x += position.vx;
    position.y += position.vy;

    // Contient les nœuds non épinglés dans le cadre.
    const distance = Math.sqrt(position.x * position.x + position.y * position.y);
    if (distance > 480) {
      position.x = (position.x / distance) * 480;
      position.y = (position.y / distance) * 480;
      position.vx *= 0.4;
      position.vy *= 0.4;
    }
  }

  // Refroidit progressivement la simulation.
  alpha *= 0.994;
  if (alpha < 0.006) alpha = 0.006;
}
