import * as three from 'three';

export class GraphicsSystem {
  public geometries: Record<string, three.Geometry> = {};
  public materials: Record<string, three.Material> = {};

  public addGeomerty(name: string, geometry: three.Geometry) {
    this.geometries[name] = geometry;
  }
  public addMaterial(name: string, material: three.Material) {
    this.materials[name] = material;
  }
}
