import { createVector } from '#lib/vector';
import { sin, cos } from '#lib/utils';

import { ObjectId, Distance3D, Point3D } from '../types';

export const coordinatesUpdaterFactory = (
  distances: Record<ObjectId, Distance3D>,
  scales: Record<ObjectId, number>,
  coordinates: Record<ObjectId, Point3D>
) => (rootId: ObjectId, ids: ObjectId[]) => {
  const [rX, rY, rZ] = (coordinates[rootId] =
    coordinates[rootId] || createVector());
  let i = 0;
  while (i < ids.length) {
    const id = ids[i++];
    const [distance, teta, phi] = distances[id];
    const scale = scales[id];
    coordinates[id] = createVector(
      rX + scale * distance * cos(phi) * sin(teta),
      rY + scale * distance * sin(phi) * sin(teta),
      rZ + scale * distance * cos(teta)
    );
  }
};
