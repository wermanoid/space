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
    const [x, y, z] = vectors[i];
    resultX += x;
    resultY += y;
    resultZ += z;
  }
  return createVector(resultX, resultY, resultZ);
};
