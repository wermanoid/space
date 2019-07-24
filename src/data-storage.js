function* objectIdGen() {
  let i = 0;
  while (true) {
    yield i;
    i += 1;
  }
}

const idGen = objectIdGen();
const getId = () => idGen.next().value;

export const positions = []; // objectId -> [x,y,z] position in km or m
export const scaledPositions = {};
export const positionScales = {};

export const accelerations = {};
export const velocities = {};
export const masses = {};

export const forces = {};
export const forceVectors = {};

export const radiuses = {};
export const radiusScales = {};

export const disances = {}; // needed????

export const directions = {}; // objectId -> [km or m, angle]
export const relatives = {}; // objectId -> rootObjectId
export const relativeDirections = {}; // objectId -> [km or m, angle]

export const toIds = Object.keys;

export const toRad = degree => (degree / 180) * Math.PI;

export const addObject = (
  object,
  { direction, relative, velocity, scaleRadius, scalePosition } = {}
) => {
  const oId = getId();
  // positions[oId] = position.map(p => p * 1e3); // km to m

  velocities[oId] = velocity;
  radiuses[oId] = object.radius * 1e3;
  masses[oId] = object.mass;
  scaleRadius && (radiusScales[oId] = scaleRadius);
  scalePosition && (positionScales[oId] = scalePosition);

  if (!direction) return oId;

  const result = [direction[0] * 1e3, toRad(direction[1])]; // [meter, rad];

  if (relative >= 0) {
    relatives[oId] = relative;
    relativeDirections[oId] = result;
  } else {
    directions[oId] = result;
  }
  return oId;
};
