import {
  BoxBufferGeometry,
  BufferGeometry,
  Material,
  MeshLambertMaterial,
  SphereBufferGeometry,
  MeshStandardMaterial,
  PlaneGeometry,
  MeshBasicMaterial,
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
  graphics.addGeomerty(0, new BoxBufferGeometry(10, 10, 10).translate(0, 0, 5));
  graphics.addGeomerty(
    1,
    new BoxBufferGeometry(10, 10, 1).translate(0, 0, 0.5)
  );

  graphics.addGeomerty(2, new PlaneGeometry(10, 10));

  graphics.addMaterial(
    0,
    new MeshLambertMaterial({
      color: 0x333333,
      flatShading: true,
    })
  );
  graphics.addMaterial(
    1,
    new MeshLambertMaterial({
      color: 0x999999,
      flatShading: true,
    })
  );

  graphics.addMaterial(
    2,
    new MeshBasicMaterial({
      color: 0xeeeeee,
      transparent: true,
      opacity: 0.4,
    })
  );

  return graphics;
};
