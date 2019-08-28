import {
  BoxBufferGeometry,
  BufferGeometry,
  Material,
  MeshLambertMaterial,
} from 'three';

export class GraphicsSystem {
  public geometries: Record<string, BufferGeometry> = {};
  public materials: Record<string, Material> = {};

  public addGeomerty(name: string, geometry: BufferGeometry) {
    this.geometries[name] = geometry;
  }
  public addMaterial(name: string, material: Material & { color?: any }) {
    this.materials[name] = material;
    material.color && material.color.convertSRGBToLinear();
  }
}

export const loadGraphics = () => {
  const graphics = new GraphicsSystem();
  graphics.addGeomerty(
    'block',
    new BoxBufferGeometry(10, 10, 10).translate(0, 0, 5)
  );
  graphics.addGeomerty(
    'plate',
    new BoxBufferGeometry(10, 10, 1).translate(0, 0, 0.5)
  );

  graphics.addMaterial(
    'stone',
    new MeshLambertMaterial({
      color: 0x333333,
    })
  );
  graphics.addMaterial(
    'quartz',
    new MeshLambertMaterial({
      color: 0x999999,
    })
  );

  return graphics;
};
