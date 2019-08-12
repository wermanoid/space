import { createVector } from '#lib/vector';

import { coordinatesUpdaterFactory } from './positioning';
import { Distance3D, ObjectId } from '#lib/types';

const toRad = (deg: number) => (deg / 180) * Math.PI;

describe('positioning #system', () => {
  it('should', () => {
    const distances: Record<ObjectId, Distance3D> = {
      0: createVector<Distance3D>(2, 0, 0),
      1: createVector<Distance3D>(5, toRad(45), toRad(-45)),
      2: createVector<Distance3D>(5, toRad(90), toRad(90)),
    };

    const scales = { 0: 1, 1: 1, 2: 1 };
    const coordinates = {};

    const update = coordinatesUpdaterFactory(distances, scales, coordinates);

    update([0]);
    update([1, 2], 0);

    expect(coordinates).toHaveProperty('0');
    expect(coordinates).toHaveProperty('1');
    expect(coordinates).toHaveProperty('2');
  });
});
