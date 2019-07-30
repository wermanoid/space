import { sum, Vector3D } from './vector';

describe('Vector', () => {
  it('should sum all 3D vectors', () => {
    const vectors: Vector3D[] = [[1, 1, 1], [2, 2, 2], [3, 3, 3]];

    expect(sum(...vectors)).toEqual([6, 6, 6]);
  });
});
