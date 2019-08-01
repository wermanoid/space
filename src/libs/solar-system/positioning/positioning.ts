import { createVector, sum, Vector3D } from '#lib/vector';
import { ObjectId, Distance3D, Point3D } from '#lib/types';

function getRelativeCoordinates(distance: Distance3D, scale: number): Vector3D {
  const dist = distance[0] * scale;
  const teta = distance[1];
  const phi = distance[2];
  const xyProjection = Math.sin(teta);

  return [
    dist * Math.cos(phi) * xyProjection,
    dist * Math.sin(phi) * xyProjection,
    dist * Math.cos(teta),
  ];
}

export const coordinatesUpdaterFactory = (
  distances: Record<ObjectId, Distance3D>,
  scales: Record<ObjectId, number>,
  coordinates: Record<ObjectId, Point3D>
) => (rootId: ObjectId, ids: ObjectId[]) => {
  const rootCoord = (coordinates[rootId] =
    coordinates[rootId] || createVector());
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const shift = getRelativeCoordinates(distances[id], scales[id]);
    coordinates[id] = sum(rootCoord, shift);
  }
};
