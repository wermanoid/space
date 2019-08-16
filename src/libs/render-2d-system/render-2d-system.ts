import { DataStore } from '#lib/data-system';
import { ObjectId, Point3D } from '#lib/types';
import { sum, Vector3D } from '#lib/vector';

const rad360 = 2 * Math.PI;

export const renderCircle = (ctx: CanvasRenderingContext2D) => (
  [x, y]: Point3D,
  r: number
) => {
  ctx.beginPath();
  ctx.ellipse(x, y, r, r, 0, 0, rad360);
  ctx.stroke();
};

const toRad = (n: number) => (n * Math.PI) / 180;

export class Render2DSystem {
  public readonly store: DataStore;
  public objects: ObjectId[] = [];
  private ctx!: CanvasRenderingContext2D;
  private center!: [number, number];

  constructor(store: DataStore) {
    this.store = store;
  }

  public add(id: undefined | ObjectId | ObjectId[]) {
    if (id === undefined) {
      return;
    }
    if (id instanceof Array) {
      this.objects = this.objects.concat(id);
    } else {
      this.objects.push(id);
    }
  }

  public use(context: CanvasRenderingContext2D) {
    this.ctx = context;
    const { width, height } = context.canvas;
    this.center = [Math.round(width / 2), Math.round(height / 2)];
  }

  public update() {
    const ctx = this.ctx;
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);
    this.renderSpaceCoordinates();

    // this.renderObjects();
  }

  private renderSpaceCoordinates() {
    const ctx = this.ctx;
    const [zeroX, zeroY] = this.center;
    const { width, height } = ctx.canvas;

    const colors = ['cyan', 'coral', 'lime', 'white']; // z, y, x
    const metrics = [[0, 0, 100], [0, 100, 0], [100, 0, 0]];
    let zTeta = toRad(90);
    let zPhi = toRad(0);
    const zRotation = 0;
    const xRotation = toRad(zRotation);
    const yRotation = toRad(zRotation + 90);

    const cube = [
      // [1, 1, 1],
      // [-1, 1, 1],
      // [1, -1, 1],
      // [-1, -1, 1],
      [1, 1, 0],
      [-1, 1, 0],
      [1, -1, 0],
      [-1, -1, 0],
    ].map(xx => xx.map(i => i * 50));

    const toProjectionCoords = ([x, y, z]: any) => {
      const xyLength = Math.sqrt(x ** 2 + y ** 2);

      const hProjection = Math.round(
        x * Math.cos(xRotation) + y * Math.cos(yRotation)
      );

      // const vProjection = -Math.round(
      //   z * Math.cos(zTeta) +
      //     xyLength *
      //       Math.sin(zTeta) *
      //       Math.sin(Math.atan(Number(y / x) || 0) + xRotation)
      // );
      const vProjection = Math.round(
        xyLength * Math.sin(zTeta) + z * Math.cos(zTeta)
      );
      console.log([x, y], (Math.atan(Number(y / x) || 0) * 180) / Math.PI);

      const l = Math.sqrt(hProjection ** 2 + vProjection ** 2);
      const ang = (Math.sign(vProjection) || 1) * Math.acos(hProjection / l);
      return [l * Math.cos(ang + zPhi), l * Math.sin(ang + zPhi)];
    };

    console.log(cube);

    const rotate = () => {
      ctx.clearRect(0, 0, width, height);
      metrics.forEach(([x, y, z], idx) => {
        const [rotationX, rotationY] = toProjectionCoords([x, y, z]);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(zeroX, zeroY);
        ctx.lineTo(zeroX + rotationX, zeroY + rotationY);
        ctx.strokeStyle = colors[idx];
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
      });

      const coords = cube.map(toProjectionCoords);

      for (let i = 0; i < coords.length; i++) {
        for (let j = 0; j < coords.length; j++) {
          if (i === j) continue;
          const c0 = coords[j];
          const c1 = coords[i];
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(zeroX + c0[0], zeroY + c0[1]);
          ctx.lineTo(zeroX + c1[0], zeroY + c1[1]);
          ctx.strokeStyle = 'yellow';
          ctx.stroke();
          ctx.restore();
        }
      }

      zTeta += toRad(0.6);
      zPhi += toRad(0.05);
      if (zTeta >= Math.PI * 2) zTeta = 0;
      if (zPhi >= Math.PI * 2) zPhi = 0;
      // requestAnimationFrame(rotate);
    };

    const n = toProjectionCoords([-100, -100, 0]);
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(zeroX + n[0], zeroY + n[1], 5, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.restore();

    rotate();
  }

  private renderObjects = () => {
    const ids = this.objects;
    const ctx = this.ctx;
    const { coordinates, sizes, rScales } = this.store;
    const renderer = renderCircle(ctx);

    const { width, height } = ctx.canvas;
    const zero: Point3D = [Math.round(width / 2), Math.round(height / 2), 0];

    ctx.save();
    ctx.strokeStyle = 'orange';
    for (let i = 0, id = ids[0]; i < ids.length; i++, id = ids[i]) {
      const shift = sum(coordinates[id], zero);
      const radius = Math.round((sizes[id] * rScales[id]) / 2);
      renderer(shift, radius);
    }
    ctx.restore();
  };
}
