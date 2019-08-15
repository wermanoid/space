import { Point3D, Distance3D, ObjectId, SpaceObject } from '#lib/types';
import { Vector3D, createVector } from '#lib/vector';

export const distances: Record<ObjectId, Distance3D> = {};
export const scales: Record<ObjectId, number> = {};
export const coordinates: Record<ObjectId, Point3D> = {};

export class DataStore {
  public names: string[] = [];
  public masses: number[] = [];
  public sizes: number[] = [];
  public distances: Distance3D[] = [];
  public coordinates: Point3D[] = [];
  public rScales: number[] = [];
  public dScales: number[] = [];
  public velocities: Vector3D[] = [];
  public forces: Vector3D[] = [];
  public accelerations: Vector3D[] = [];
  public systemCenter!: Point3D;
  public fullMass: number = 0;

  public addObject({
    name,
    mass,
    distance,
    radius,
    velocity,
    scale = {},
  }: SpaceObject) {
    const itemId = this.names.length;
    this.names.push(name);
    this.masses[itemId] = mass;
    this.sizes[itemId] = radius;
    this.velocities[itemId] = velocity;
    this.distances[itemId] = distance;
    this.rScales[itemId] = Number(scale.radius) || 1;
    this.dScales[itemId] = Number(scale.distance) || 1;
    this.forces[itemId] = createVector();
    this.accelerations[itemId] = createVector();

    this.fullMass += mass;

    return itemId;
  }
}
