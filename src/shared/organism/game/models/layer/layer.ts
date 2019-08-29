import { Group, Mesh } from 'three';

import { GraphicsSystem } from '../../systems/graphics';

export class LayerSystem {
  private layers: Uint32Array[] = [];
  private graphics: GraphicsSystem;

  constructor(graphics: GraphicsSystem) {
    this.graphics = graphics;
  }

  public add = (
    shapeArray: Uint32Array,
    materialArray: Uint32Array,
    { x, y }: { x: number; y: number } = { x: 10, y: 10 }
  ) => {
    const { geometries, materials } = this.graphics;
    const group = new Group();
    const items = [];
    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        const flatId = i * 10 + j;
        const tmp = new Mesh(
          geometries[shapeArray[flatId]],
          materials[materialArray[flatId]]
        );
        tmp.position.set((i - 5) * 10, (j - 5) * 10, 0);
        items[items.length] = tmp;
      }
    }
    group.add(...items);
    group.matrixAutoUpdate = false;
    return group;
  };
}
