/**
 * @jest-environment node
 */

import { Suite } from 'benchmark';
import { times, get } from 'lodash/fp';

import { sum, Vector3D } from './vector';

describe('Vector', () => {
  it('should sum all 3D vectors', () => {
    const vectors: Vector3D[] = [[1, 1, 1], [2, 2, 2], [3, 3, 3]];

    expect(sum(...vectors)).toEqual([6, 6, 6]);
  });

  it('benchmark', () => {
    const suite = new Suite('Vector', {
      minSamples: 10000,
      maxTime: 60,
      async: true,
      delay: 1,
    });

    const data = times((n: number): Vector3D => [n, n, n], 100);

    return new Promise(r => {
      suite
        .add('vectors sum', () => {
          sum(...data);
        })
        .on('cycle', (event: { target: string }) => {
          console.log(String(event.target));
        })
        .on('complete', () => {
          console.log('Fastest is ' + suite.filter('fastest').map(get('name')));
          r();
        })
        .run();
    });
  });
});
