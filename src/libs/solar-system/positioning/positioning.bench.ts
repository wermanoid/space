import { times, reduce, identity } from 'lodash/fp';

import { ObjectId, Distance3D, Point3D } from '#lib/types';

import { coordinatesUpdaterFactory } from './positioning';

type Distances = Record<ObjectId, Distance3D>;
type Scales = Record<ObjectId, number>;
type Coords = Record<ObjectId, Point3D>;

const fillNumbers = times<number>(identity);
const size = 100;
const distances = reduce(
  (acc: Distances, n: number) => ({ ...acc, [n]: [n, n, n] }),
  {},
  fillNumbers(size)
);
const scales = reduce(
  (acc: Scales, n: number) => ({ ...acc, [n]: 0.5 }),
  {},
  fillNumbers(size)
);
const coords: Coords = {};

const upd = coordinatesUpdaterFactory(distances, scales, coords);

const [root, ...rest] = fillNumbers(size);

// [v0] #system [Positioning] x 47,355 ops/sec
// [v1] #system [Positioning] x 64,267 ops/sec
export default [
  {
    name: '#system [Positioning]',
    fn: () => {
      upd(rest, root);
    },
  },
];
