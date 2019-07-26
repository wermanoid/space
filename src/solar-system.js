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
      result[j] = Number(result[j] || 0) + Number(arr[j] || 0);
    }
  }
  return result;
};

const getAngle = (oId1, oId2) => {
  const [x1, y1, z1] = positions[oId1];
  const [x2, y2, z2] = positions[oId2];
  return Math.atan2(y1 - y2, x1 - x2) + Math.PI;
};

const get3DDistance = ([x1, y1, z1], [x2, y2, z2]) =>
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);

const prettyForce = f => Math.round(f * 1e-20 * 100) / 100;
const roundTrigonometry = x => (Math.abs(x) < 1e-5 ? 0 : x);

const getForce = (fromId, toId) => {
  const [x1, y1, z1] = positions[fromId];
  const [x2, y2, z2] = positions[toId];
  disances[fromId] = disances[fromId] || {};

  const distanceSquare = (x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2;
  disances[fromId][toId] = Math.sqrt(distanceSquare);
  const F = (G * masses[fromId] * masses[toId]) / distanceSquare; // memoize G * masses[oId1] * masses[oId2] ?
  const angle = getAngle(fromId, toId);
  // console.log(angle, (angle * 180) / Math.PI);
  return {
    F,
    angle,
    forceVector: [
      F * roundTrigonometry(Math.cos(angle)),
      F * roundTrigonometry(Math.sin(angle)),
      0
    ]
  };
};

// Mm*am = GMeMm/r1**2 + GMsMm/r2**2

const updateForces = oIds => {
  for (let i = 0; i < oIds.length; i++) {
    const id = oIds[i];
    forces[id] = forces[id] || {};
    forceVectors[id] = forceVectors[id] || {};
    forces[id][id] = [0, 0, 0];
    forceVectors[id][id] = [0, 0, 0];

    for (let j = 0; j < i; j++) {
      const id2 = oIds[j];
      const { angle, F, forceVector } = getForce(id, id2);

      forces[id][id2] = [F, angle];
      forceVectors[id][id2] = forceVector;
      forces[id2][id] = [F, angle + Math.PI];
      forceVectors[id2][id] = forceVector;
      // console.log(id, id2, forceVectors[id][id2]);
      // console.log(id2, id, forceVectors[id2][id]);
    }
  }
};

const getAccelerations = (fromId, toId) => {
  return forceVectors[fromId][toId].map(f => f / masses[fromId]);
  // return forceVectors[fromId][toId] / masses[fromId];
};

const updateAccelerations = oIds => {
  for (let i = 0; i < oIds.length; i++) {
    const id = oIds[i];
    accelerations[id] = accelerations[id] || [];
    accelerations[id][id] = [0, 0, 0];
    for (let j = 0, id2 = oIds[0]; j < oIds.length; id2 = oIds[j], j++) {
      accelerations[id2] = accelerations[id2] || [];
      accelerations[id][id2] = getAccelerations(id, id2);
      accelerations[id2][id] = getAccelerations(id2, id);
    }
    id === 2 && console.log(accelerations[2]);
  }
};

const updateVelocities = (t, ids) => {
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const accelTotal = zipSum(...Object.values(accelerations[id]));
    id === 2 && console.log("total acc", accelTotal, velocities[id]);

    velocities[id] = zipSum(velocities[id], accelTotal.map(a => a * t));

    id === 2 && console.log("velocity final", velocities[id]);
  }
};

const updatePositions = (ids, root) => {
  const [rootX, rootY] = positions[root] || [0, 0, 0];
  const [scaledRootX, scaledRootY] = scaledPositions[root] || [0, 0, 0];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];

    const [distance, angle] = directions[id];
    const scaled = distance * (positionScales[id] || 1);
    positions[id] = [
      rootX + distance * roundTrigonometry(Math.cos(angle)),
      rootY + distance * roundTrigonometry(Math.sin(angle)),
      0
    ];

    scaledPositions[id] = [
      scaledRootX + scaled * roundTrigonometry(Math.cos(angle)),
      scaledRootY + scaled * roundTrigonometry(Math.sin(angle)),
      0
    ];
  }
};

const updateRelativePositions = ids => {
  for (let i = 0; i < ids.length; i++) {
    const rootId = ids[i];
    const sattelites = relatives[rootId] || [];
    updatePositions(sattelites, rootId);
  }
};

const updateDirections = (t, ids, root) => {
  // root >= 0 && console.log(t, ids, root);
  const rootPosition = positions[root] || [0, 0, 0];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const initialPosition = positions[id];

    root >= 0 && console.log("iDirection", directions[id]);

    const deltaPosition = velocities[id].map(v => v * t);

    // console.log(id, "iVelocity", velocities[id]);

    const newPosition = zipSum(initialPosition, deltaPosition);
    root >= 0 && console.log(id, "iPositions", newPosition, positions[id]);
    positions[id] = newPosition;
    const updatedAngle = getAngle(root || 0, id);
    const updatedDistance = get3DDistance(newPosition, rootPosition);
    id === "2" &&
      console.log(directions[id][0], (directions[id][1] * 180) / Math.PI);
    id === "2" && console.log(updatedDistance, (updatedAngle * 180) / Math.PI);
    directions[id] = [updatedDistance, updatedAngle];
  }
};

const updateRelativeDirections = (t, ids) => {
  for (let i = 0; i < ids.length; i++) {
    const rootId = ids[i];
    const sattelites = relatives[rootId] || [];
    updateDirections(t, sattelites, rootId);
  }
};

// const updateRelativePositions = ids => {
//   for (let i = 0; i < ids.length; i++) {
//     const id = ids[i];
//     const root = relatives[id];
//     // console.log(ids, id, root, relativeDirections, positions[root]);
//     const [distance, angle] = relativeDirections[id];
//     const [rootX, rootY] = positions[root];
//     const scale = positionScales[id] || 1;
//     const rootScale = positionScales[root] || 1;
//     const position = [
//       rootX + distance * Math.cos(angle),
//       rootY + distance * Math.sin(angle),
//       0
//     ];
//     positions[id] = position;
//     scaledPositions[id] = [
//       rootScale * (rootX + scale * distance * Math.cos(angle)),
//       rootScale * (rootY + scale * distance * Math.sin(angle)),
//       0
//     ];
//   }
// };
// const os = ["sun", "earth", "moon", "venus", "mercury"];
// const updateAll = (t, ids) => {
//   if (t === 0) return;
//   for (let i = 0; i < ids.length; i++) {
//     const id = ids[i];
//     if (!directions[id]) continue;

//     const speeds = accelerations[id].map(a => a * t);
//     const speedVectors = speeds.map((s, tId) => {
//       const angle = getAngle(tId, id);
//       return [s * Math.cos(angle), s * Math.sin(angle), 0];
//       // console.log(s, os[i], os[tId], );
//     });
//     const path = zipSum(...speedVectors, velocities[id]).map(s => s * t);
//     velocities[id] = zipSum(...speedVectors, velocities[id]);
//     const [distance, angle] = directions[id];
//     // console.log("here", id);
//     positions[id] = [
//       distance * Math.cos(angle) + path[0],
//       distance * Math.sin(angle) + path[1],
//       0
//     ];
//     const [x2, y2] = positions[id];
//     const updDistance = Math.sqrt((x2 - 0) ** 2 + (y2 - 0) ** 2);
//     const angle2 = getAngle(0, id);
//     directions[id] = [updDistance, angle2];
//   }
// };

// const updateAllRelatives = (t, ids) => {
//   if (t === 0) return;
//   for (let i = 0; i < ids.length; i++) {
//     const id = ids[i];
//     const root = relatives[id];
//   }
// console.table(forces.map(f => f.map(e => Math.round(e * 1e-20 * 100) / 100)));
// console.table(
//   positions.map(f => f.map(e => Math.round(e * 1e-8 * 100) / 100))
// );
// for (let i = 0; i < ids.length; i++) {
//   const id = ids[i];
//   const root = relatives[id];
//   if (!relativeDirections[id]) continue;
//   const speeds = accelerations[id].map((a, n) => a * t);
//   const speedVectors = speeds.map((s, tId) => {
//     const angle = getAngle(tId, id);
//     return [s * Math.cos(angle), s * Math.sin(angle), 0];
//     // console.log(s, os[i], os[tId], );
//   });
//   const path = zipSum(...speedVectors, velocities[id]).map(s => s * t);
//   // console.table(speedVectors);
//   velocities[id] = zipSum(...speedVectors, velocities[id]);
//   // const [distance, angle] = directions[id];
//   const [distance, angle] = relativeDirections[id];
//   const [rootX, rootY] = positions[root];
//   positions[id] = [
//     rootX + distance * Math.cos(angle) + path[0],
//     rootY + distance * Math.sin(angle) + path[1],
//     0
//   ];
//   const [x2, y2] = positions[id];
//   const updDistance = Math.sqrt((x2 - rootX) ** 2 + (y2 - rootY) ** 2 + 0);
//   const angle2 = getAngle(root, id);
//   // console.log(id, updDistance, angle2);
//   relativeDirections[id] = [updDistance, angle2];
// }
// };

export const solarSystem = {
  objects: [],
  roots: [],
  all: [],
  add(id) {
    this.objects.push(id);
    this.all.push(id);
  },
  addRelative(root, sattelites) {
    this.roots.push(root);
    relatives[root] = [...sattelites];
    sattelites.forEach(id => this.all.push(id));
  },
  update(t) {
    console.time("update");
    // updateAll(t, toIds(directions));
    // updateAllRelatives(t, toIds(relatives));
    updatePositions(this.objects);
    updateRelativePositions(this.roots);
    // updateRelativePositions(toIds(relatives));
    updateForces(this.all);
    updateAccelerations(this.all);
    updateVelocities(t, this.all);
    updateDirections(t, this.objects);
    updateRelativeDirections(t, this.roots);
    console.timeEnd("update");
  }
};
