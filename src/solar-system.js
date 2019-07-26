// import { memoize } from 'lodash';
// import { sun, earth, moon } from "./utils/object";

import {
  positions,
  disances,
  forces,
  masses,
  accelerations,
  directions,
  relativeDirections,
  relatives,
  positionScales,
  scaledPositions,
  toIds
} from "./data-storage";

const G = 6.67 * 1e-11; // m**3 / (kg * s**2)
// const AU = 149597870700; // m

const getForce = (oId1, oId2) => {
  const [x1, y1, z1] = positions[oId1] || [0, 0, 0];
  const [x2, y2, z2] = positions[oId2] || [0, 0, 0];
  disances[oId1] = disances[oId1] || {};

  const distanceSquare = (x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2;
  disances[oId1][oId2] = Math.sqrt(distanceSquare);
  return (G * masses[oId1] * masses[oId2]) / distanceSquare; // memoize G * masses[oId1] * masses[oId2] ?
};

const getAccelerations = (fromId, toId) => {
  return forces[fromId][toId] / masses[toId];
};

const updateForces = oIds => {
  for (let i = 0; i < oIds.length; i++) {
    forces[i] = forces[i] || {};
    forces[i][i] = 0;
    for (let j = 0; j < i; j++) {
      const force = getForce(oIds[i], oIds[j]);
      // console.log(ss[oIds[i]], "to", ss[oIds[j]], `${force / 1e22}*1e22 N`);
      forces[i][j] = forces[j][i] = force;
    }
  }
};

const updateAccelerations = oIds => {
  for (let i = 0; i < oIds.length; i++) {
    accelerations[i] = accelerations[i] || [];
    accelerations[i][i] = 0;
    for (let j = 0; j < oIds.length; j++) {
      accelerations[j] = accelerations[j] || [];
      const accel = getAccelerations(oIds[i], oIds[j]);
      accelerations[i][j] = accelerations[j][i] = accel;
    }
  }
};

const updatePositions = ids => {
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];

    const [distance, angle] = directions[id];
    const scaled = distance * (positionScales[id] || 1);
    positions[id] = [distance * Math.cos(angle), distance * Math.sin(angle), 0];
    scaledPositions[id] = [
      scaled * Math.cos(angle),
      scaled * Math.sin(angle),
      0
    ];
  }
};

const updateRelativePositions = ids => {
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const root = relatives[id];
    // console.log(ids, id, root, relativeDirections, positions[root]);
    const [distance, angle] = relativeDirections[id];
    const [rootX, rootY] = positions[root];
    const scale = positionScales[id] || 1;
    const rootScale = positionScales[root] || 1;
    const position = [
      rootX + distance * Math.cos(angle),
      rootY + distance * Math.sin(angle),
      0
    ];
    positions[id] = position;
    scaledPositions[id] = [
      rootScale * (rootX + scale * distance * Math.cos(angle)),
      rootScale * (rootY + scale * distance * Math.sin(angle)),
      0
    ];
  }
};

export const solarSystem = {
  objects: [],
  add(id) {
    this.objects.push(id);
  },
  update() {
    console.time("update");
    updatePositions(toIds(directions));
    updateRelativePositions(toIds(relatives));
    updateForces(this.objects);
    updateAccelerations(this.objects);
    console.timeEnd("update");
  },
  render() {}
};
