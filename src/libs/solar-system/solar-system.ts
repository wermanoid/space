import * as data from '#lib/data-system';
import { ObjectId } from '#lib/types';
import { coordinatesUpdaterFactory } from './positioning';

export interface SolarSystem {
  roots: ObjectId[];
  objects: ObjectId[];
  all: ObjectId[];
  relatives: Record<ObjectId, ObjectId[]>;
  add(id: ObjectId): void;
  addRelative(id: ObjectId, relatives: ObjectId[]): void;
  update(t: number): void;
}

export const create = (): SolarSystem => {
  const updatePositions = coordinatesUpdaterFactory(
    data.distances,
    data.scales,
    data.coordinates
  );

  return {
    roots: [],
    relatives: {},
    objects: [] as ObjectId[],
    all: [] as ObjectId[],
    add(id: ObjectId) {
      this.objects.push(id);
      this.all.push(id);
    },
    addRelative(rootId: ObjectId, relatives: ObjectId[]) {
      this.roots.push(rootId);
      this.relatives[rootId] = [...relatives];
      relatives.forEach(id => {
        this.all.push(id);
        // velocities[id] = zipSum(velocities[id], velocities[root]);
      });
    },
    update(t: number) {
      updatePositions(this.objects);
      for (let i = 0; i < this.roots.length; i++) {
        const root = this.roots[i];
        updatePositions(this.relatives[root], root);
      }
    },
  };
};
