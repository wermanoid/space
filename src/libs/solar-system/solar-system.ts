import { ObjectId } from '#lib/types';
import { PositioningSystem } from './positioning';
import { DataStore } from '#lib/data-system';

// export interface SolarSystem {
//   positioning: PositioningSystem;
//   objects: ObjectId[];
//   add(id: SpaceObject): ObjectId;
//   addRelative(id: ObjectId, relatives: ObjectId[]): void;
//   update(t: number): void;
// }

// export const create = (): SolarSystem => {
//   const updatePositions = coordinatesUpdaterFactory(
//     data.distances,
//     data.scales,
//     data.coordinates
//   );

//   const store = new data.DataStore();

//   return {
//     positioning: new PositioningSystem(store),
//     objects: [],
//     add(object: SpaceObject) {
//       const id = store.addObject(object);
//       this.objects.push(id);
//       if (object.sattelites) {
//         const satteliteIds = object.sattelites.map(sattelite => {
//           return this.add(sattelite);
//         });
//         this.positioning.relatives.push([id, satteliteIds]);
//       }
//       return id;
//     },
//     addRelative(rootId: ObjectId, relatives: ObjectId[]) {
//       // this.roots.push(rootId);
//       // this.relatives[rootId] = [...relatives];
//       // relatives.forEach(id => {
//       //   this.all.push(id);
//       //   // velocities[id] = zipSum(velocities[id], velocities[root]);
//       // });
//     },
//     update(t: number) {
//       // updatePositions(this.objects);
//       // for (let i = 0; i < this.roots.length; i++) {
//       //   const root = this.roots[i];
//       //   updatePositions(this.relatives[root], root);
//       // }
//     },
//   };
// };

export class SolarSystem {
  public readonly positionig: PositioningSystem;

  public objects: ObjectId[] = [];

  constructor(store: DataStore) {
    this.positionig = new PositioningSystem(store);
  }

  public add(id: ObjectId, sattelites?: ObjectId[]) {
    this.objects.push(id);
    // this.positionig.add(id, sattelites);
  }

  public update(delta: number) {
    this.positionig.update();
  }
}
