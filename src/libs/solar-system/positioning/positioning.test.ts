import { createVector } from '#lib/vector';

import { coordinatesUpdaterFactory } from './positioning';

const toRad = (deg: number) => (deg / 180) * Math.PI;

describe('positioning #system', () => {
  it('should', () => {
    const distances = {
      0: createVector(),
      1: createVector(5, toRad(45), toRad(-45)),
      2: createVector(5, toRad(90), toRad(90)),
    };

    const scales = { 0: 1, 1: 1, 2: 1 };
    const coordinates = {};

    const update = coordinatesUpdaterFactory(distances, scales, coordinates);

    update(0, [1, 2]);

    console.log(coordinates);
  });
});
