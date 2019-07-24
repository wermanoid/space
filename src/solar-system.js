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
    forces[id][id] = [0, 0, 0];
    // const temp = [];
    for (let j = 0; j < i; j++) {
      const id2 = oIds[j];
      const force = getForce(id, id2);
      // console.log(`${id} => ${id2}: ${prettyForce(force.F)}`);
      // console.log(`${id} => ${id2}`, force.forceVector);
      forces[id][id2] = force.forceVector;
      forces[id2][id] = force.forceVector; //.map(f => -f);
      // id === 2 && console.log(id, id2, force.F * 1e-21);
    }
    // console.table(forces);
    // console.log(`Result ${id}`, forceVectors[id]);

    // if (id === 2) {
    //   console.log("Forces:");
    //   console.table(forces.map(t => t.map(prettyForce)));
    // }
    // id === 2 &&
    //   console.log(
    //     "Sum force:",
    //     forceVectors[2].map(prettyForce)
    //     // ((Math.atan2(1 - 46, 1 - 46) + Math.PI) / Math.PI) * 180
    //   );
    // id === 2 && console.log(forceVectors[2].map(f => f * 1e-21));
  }
};

const getAccelerations = (fromId, toId) => {
  // console.log(forces[fromId][toId]);
  return forces[fromId][toId].map(f => f / masses[fromId]);
  // return forceVectors[fromId][toId] / masses[fromId];
};

const updateAccelerations = oIds => {
  for (let i = 0; i < oIds.length; i++) {
    const id = oIds[i];
    accelerations[id] = accelerations[id] || [];
    accelerations[id][id] = 0;
    for (let j = 0; j < oIds.length; j++) {
      const id2 = oIds[j];
      accelerations[id2] = accelerations[id2] || [];
      accelerations[id][id2] = getAccelerations(oIds[id], oIds[id2]);
      accelerations[id2][id] = getAccelerations(oIds[id2], oIds[id]);
    }
    // console.log(accelerations[1][0]);
    // console.log(accelerations[0][1]);
  }
};

const objToArrayOfValues = o => Object.values(o); //.map(key => o[key])

const updateVelocities = (t, ids) => {
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const total = zipSum(...objToArrayOfValues(accelerations[id]));
    velocities[id] = zipSum(velocities[id], total.map(a => a * t));
    // console.log(id, velocities[id]);
    // console.log(id, velocities[id]);
  }
};

const updatePositions = ids => {
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];

    const [distance, angle] = directions[id];
    const scaled = distance * (positionScales[id] || 1);
    positions[id] = [
      distance * roundTrigonometry(Math.cos(angle)),
      distance * roundTrigonometry(Math.sin(angle)),
      0
    ];
    scaledPositions[id] = [
      scaled * roundTrigonometry(Math.cos(angle)),
      scaled * roundTrigonometry(Math.sin(angle)),
      0
    ];
  }
};

const updateDirections = (t, ids) => {
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    // const initialDirection = directions[id];
    const initialPosition = positions[id];
    const deltaPosition = velocities[id].map(v => v * t);
    const newPosition = zipSum(initialPosition, deltaPosition);
    positions[id] = newPosition;
    // id === 1 && console.log(initialPosition, positions[id]);
    const updatedAngle = getAngle(0, id);
    // console.log(id, (updatedAngle * 180) / Math.PI);
    const updatedDistance = get3DDistance(newPosition, [0, 0, 0]);
    // console.log(id, updatedDistance);
    // id === 1 && console.log((updatedDistance - initialDirection[0]) * 1e-9);
    // id === 1 &&
    //   console.log(
    //     (initialDirection[1] * 180) / Math.PI,
    //     (updatedAngle * 180) / Math.PI
    //   );
    directions[id] = [updatedDistance, updatedAngle];
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
    // console.log("here", id);
    positions[id] = [
      distance * Math.cos(angle) + path[0],
      distance * Math.sin(angle) + path[1],
      0
    ];
    const [x2, y2] = positions[id];
    const updDistance = Math.sqrt((x2 - 0) ** 2 + (y2 - 0) ** 2);
    const angle2 = getAngle(0, id);
    directions[id] = [updDistance, angle2];
  }
};

const updateAllRelatives = (t, ids) => {
  if (t === 0) return;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const root = relatives[id];
  }
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
};

export const solarSystem = {
  objects: [],
  add(id) {
    this.objects.push(id);
  },
  update(t) {
    console.time("update");
    // updateAll(t, toIds(directions));
    // updateAllRelatives(t, toIds(relatives));
    updatePositions(this.objects);
    // updateRelativePositions(toIds(relatives));
    updateForces(this.objects);
    updateAccelerations(this.objects);
    updateVelocities(t, this.objects);
    updateDirections(t, this.objects);
    console.timeEnd("update");
  },
  render() {}
};
