export type Vector3D = [number, number, number];

export const createVector = (
  x: number = 0,
  y: number = 0,
  z: number = 0
): Vector3D => [x, y, z];

export const sum = (...vectors: Vector3D[]): Vector3D => {
  let resultX = 0;
  let resultY = 0;
  let resultZ = 0;
  for (let i = 0; i < vectors.length; i++) {
    const v = vectors[i];
    resultX += v[0];
    resultY += v[1];
    resultZ += v[2];
  }
  return createVector(resultX, resultY, resultZ);
};

export const dot = ([x, y, z]: Vector3D, multiplier: number): Vector3D => {
  return createVector(x * multiplier, y * multiplier, z * multiplier);
};

export const distanceSquare = (
  [x1, y1, z1]: Vector3D,
  [x2, y2, z2]: Vector3D
) => (x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2;

export const distance = (v1: Vector3D, v2: Vector3D): number =>
  Math.sqrt(distanceSquare(v1, v2));

export const getAngleXY = (
  [x1, y1]: Vector3D,
  [x2, y2]: Vector3D,
  rotation: number = 0
) => Math.atan2(y1 - y2, x1 - x2) + rotation;
