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
  toIds,
  forceVectors,
  velocities
} from "./data-storage";

const G = 6.67 * 1e-11; // m**3 / (kg * s**2)
// const AU = 149597870700; // m

const zipSum = (...arrs) => {
  const result = [];
  for (let i = 0; i < arrs.length; i++) {
    const arr = arrs[i];
    if (!arr || arr.length === 0) continue;
    for (let j = 0; j < arr.length; j++) {
      // console.log(arr[j]);
      result[j] = (result[j] || 0) + arr[j];
    }
  }
  return result;
};

const getAngle = (oId1, oId2) => {
  const [x1, y1, z1] = positions[oId1] || [0, 0, 0];
  const [x2, y2, z2] = positions[oId2] || [0, 0, 0];
  return Math.atan2(y1 - y2, x1 - x2);
};

const getForce = (oId1, oId2) => {
  const [x1, y1, z1] = positions[oId1] || [0, 0, 0];
  const [x2, y2, z2] = positions[oId2] || [0, 0, 0];
  disances[oId1] = disances[oId1] || {};

  const distanceSquare = (x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2;
  disances[oId1][oId2] = Math.sqrt(distanceSquare);
  const F = (G * masses[oId1] * masses[oId2]) / distanceSquare; // memoize G * masses[oId1] * masses[oId2] ?
  const angle = Math.atan2(y1 - y2, x1 - x2);
  return {
    F,
    forceVector: [F * Math.cos(angle), F * Math.sin(angle), 0]
  };
};

const getAccelerations = (fromId, toId) => {
  return forces[fromId][toId] / masses[fromId];
};

const updateForces = oIds => {
  for (let i = 0; i < oIds.length; i++) {
    forces[i] = forces[i] || [];
    forces[i][i] = 0;
    const temp = [];
    for (let j = 0; j < i; j++) {
      const force = getForce(oIds[i], oIds[j]);
      forces[i][j] = forces[j][i] = force.F;
      temp[j] = force.forceVector;
    }
    forceVectors[i] = zipSum(...temp);
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
const os = ["sun", "earth", "moon", "venus", "mercury"];
const updateAll = (t, ids) => {
  if (t === 0) return;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    if (!directions[id]) continue;

    const speeds = accelerations[id].map(a => a * t);
    const speedVectors = speeds.map((s, tId) => {
      const angle = getAngle(tId, id);
      return [s * Math.cos(angle), s * Math.sin(angle), 0];
      // console.log(s, os[i], os[tId], );
    });
    const path = zipSum(...speedVectors, velocities[id]).map(s => s * t);
    velocities[id] = zipSum(...speedVectors, velocities[id]);
    const [distance, angle] = directions[id];

    positions[id] = [
      distance * Math.cos(angle) + path[0],
      distance * Math.sin(angle) + path[1],
      0
    ];
    const [x2, y2] = positions[id];
    const updDistance = Math.sqrt((x2 - 0) ** 2 + (y2 - 0) ** 2 + 0);
    const angle2 = getAngle(0, id) - Math.PI;
    directions[id] = [updDistance, angle2];
  }
};

const updateAllRelatives = (t, ids) => {
  if (t === 0) return;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const root = relatives[id];
    if (!relativeDirections[id]) continue;

    const speeds = accelerations[id].map((a, n) => a * t);
    const speedVectors = speeds.map((s, tId) => {
      const angle = getAngle(tId, id);
      return [s * Math.cos(angle), s * Math.sin(angle), 0];
      // console.log(s, os[i], os[tId], );
    });
    const path = zipSum(...speedVectors, velocities[id]).map(s => s * t);
    // console.table(speedVectors);
    velocities[id] = zipSum(...speedVectors, velocities[id]);
    // const [distance, angle] = directions[id];
    const [distance, angle] = relativeDirections[id];
    const [rootX, rootY] = positions[root];

    positions[id] = [
      rootX + distance * Math.cos(angle) + path[0],
      rootY + distance * Math.sin(angle) + path[1],
      0
    ];
    const [x2, y2] = positions[id];
    const updDistance = Math.sqrt((x2 - rootX) ** 2 + (y2 - rootY) ** 2 + 0);
    const angle2 = getAngle(root, id) - Math.PI;
    // console.log(id, updDistance, angle2);
    relativeDirections[id] = [updDistance, angle2];
  }
};

export const solarSystem = {
  objects: [],
  add(id) {
    this.objects.push(id);
  },
  update(t) {
    console.time("update");
    updateAll(t, toIds(directions));
    updateAllRelatives(t, toIds(relatives));
    updatePositions(toIds(directions));
    updateRelativePositions(toIds(relatives));
    updateForces(this.objects);
    updateAccelerations(this.objects);
    console.timeEnd("update");
  },
  render() {}
};
