import { Point3D } from '#lib/types';

export type Dot = Point3D;
export type Line = [Point3D, Point3D];
export type Polygon = [Point3D, Point3D, Point3D];

export type Texture = Dot | Line | Polygon;

export const toRad = (n: number) => (n * Math.PI) / 180;
export const deg90 = Math.PI / 2;
export class Adapter3d {
  public rollAngle: number = 0;
  public pitchAngle: number = 0;
  public yawAngleX: number = 0;
  public yawAngleY: number = toRad(90);

  /**
   * Rotate projection around Z axis
   * @param {number} angle Angle in radians
   */
  public yaw = (angle: number) => {
    this.yawAngleX = angle;
    this.yawAngleY = angle + deg90;
  };
  /**
   * Rotate projection around X axis
   * @param {number} angle Angle in radians
   */
  public roll = (angle: number) => {
    this.rollAngle = angle;
  };

  /**
   * Rotate projection around Y axis
   * @param {number} angle Angle in radians
   */
  public pitch = (angle: number) => {
    this.pitchAngle = angle;
  };

  public getProjector = () => {
    const yawAngleX = this.yawAngleX;
    const yawAngleY = this.yawAngleY;
    const rollAngle = this.rollAngle;
    const pitchAngle = this.pitchAngle;
    return ([x, y, z]: Point3D): [number, number] => {
      const xyLength = Math.sqrt(x ** 2 + y ** 2);

      const hProjection = Math.round(
        x * Math.cos(yawAngleX) + y * Math.cos(yawAngleY)
      );

      const vProjection = -Math.round(
        Math.sin(rollAngle) *
          xyLength *
          Math.sin((Math.sign(y) * Math.acos(x / xyLength) || 0) + yawAngleX) +
          z * Math.cos(rollAngle)
      );

      const l = Math.sqrt(hProjection ** 2 + vProjection ** 2);
      const ang =
        (Math.sign(vProjection) || 1) * Math.acos(hProjection / l) || 0;
      return [l * Math.cos(ang + pitchAngle), l * Math.sin(ang + pitchAngle)];
    };
  };
}
