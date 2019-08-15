import { createVector, sum, Vector3D } from '#lib/vector';
import { ObjectId, Distance3D, Point3D } from '#lib/types';
import { DataStore } from '#lib/data-system';

const roundTrigonometry = (x: number) => (Math.abs(x) < 1e-5 ? 0 : x);

function getRelativeCoordinates(distance: Distance3D, scale: number): Vector3D {
  const dist = distance[0] * scale;
  const teta = distance[1];
  const phi = distance[2];
  const xyProjection = Math.sin(teta);

  return [
    dist * roundTrigonometry(Math.cos(phi)) * xyProjection,
    dist * roundTrigonometry(Math.sin(phi)) * xyProjection,
    dist * roundTrigonometry(Math.cos(teta)),
  ];
}

export const coordinatesUpdaterFactory = (
  distances: Record<ObjectId, Distance3D>,
  scales: Record<ObjectId, number>,
  coordinates: Record<ObjectId, Point3D>
) => (ids: ObjectId[], rootId?: ObjectId) => {
  const rootCoord = coordinates[rootId!] || createVector();
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const shift = getRelativeCoordinates(distances[id], scales[id]);
    coordinates[id] = sum(rootCoord, shift);
  }
};

export class PositioningSystem {
  public readonly store: DataStore;
  public objects: ObjectId[] = [];
  /** RootId => List of sattelites ids */
  public relatives: Array<[ObjectId, ObjectId[]]> = [];

  constructor(store: DataStore) {
    this.store = store;
  }

  public update() {
    // this.recalculateCoordinates(this.objects);
    // const relatives = this.relatives;
    // for (let i = 0; i < relatives.length; i++) {
    //   const relative = relatives[i];
    //   this.recalculateCoordinates(relative[1], relative[0]);
    // }
    // this.recalculateSystemCenter();
  }

  // private recalculateCoordinates(objects: ObjectId[], rootId?: ObjectId) {
  //   const { distances, coordinates, dScales, systemCenter } = this.store;
  //   const rootCoord = coordinates[rootId!] || [0, 0, 0];
  //   for (let i = 0; i < objects.length; i++) {
  //     const id = objects[i];
  //     const shift = getRelativeCoordinates(distances[id], dScales[id]);
  //     console.log(systemCenter);
  //     coordinates[id] = sum(rootCoord, shift);
  //   }
  // }

  // // TODO: REFACTOR!!!
  // private recalculateSystemCenter() {
  //   if (!this.store.systemCenter) {
  //     this.store.systemCenter = [0, 0, 0];
  //     return;
  //   }

  //   const { coordinates, masses, fullMass } = this.store;
  //   const root = this.objects[0];
  //   const [dX, dY, dZ] = coordinates[root];
  //   const arms: Vector3D[] = this.objects.map(oId => {
  //     const [x, y, z] = coordinates[oId];
  //     const mass = masses[oId];
  //     return [(x - dX) * mass, (y - dY) * mass, (z - dZ) * mass];
  //   });
  //   const [cX, cY, cZ] = sum(...arms);
  //   this.store.systemCenter = [
  //     cX / fullMass + dX,
  //     cY / fullMass + dY,
  //     cZ / fullMass + dZ,
  //   ].map(Math.round) as Vector3D;

  //   // console.log(this.store.systemCenter);
  // }
}
