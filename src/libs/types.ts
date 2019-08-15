import { Vector3D } from '#lib/vector';

export type ObjectId = number;

/**
 * Spherical coordinates type wrapper
 * @type {Distance3D}
 * @property {number} [0] - r, radius/distance
 * @property {number} [1] - θ, inclination (angle to z-axis)
 * @property {number} [2] - φ, azimuth (angle to x-axis)
 */

export type Distance3D = Vector3D;
/**
 * 3D point coordinates wrapper
 * @type {Point3D}
 * @property {number} [0] - x
 * @property {number} [1] - y
 * @property {number} [2] - z
 */
export type Point3D = Vector3D;

export interface SpaceObject {
  name: string;
  mass: number;
  radius: number;
  velocity: Vector3D;
  distance: Distance3D;
  scale?: {
    radius?: number;
    distance?: number;
  };
  sattelites?: SpaceObject[];
}
