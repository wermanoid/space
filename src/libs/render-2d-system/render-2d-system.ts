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
    const metrics = [[0, 0, 100], [0, 100, 0], [100, 0, 0], [20, 100, 20]];
    let zTeta = toRad(22);
    const zPhi = toRad(0);
    const zRotation = 45;
    const xRotation = toRad(zRotation);
    const yRotation = toRad(zRotation + 90);

    const rotate = () => {
      ctx.clearRect(0, 0, width, height);
      metrics.forEach(([x, y, z], idx) => {
        const length = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
        const xyLength = Math.sqrt(x ** 2 + y ** 2);

        const hProjection = x * Math.cos(xRotation) + y * Math.cos(yRotation);

        const vProjection = -(
          z * Math.cos(zTeta) +
          xyLength *
            Math.sin(zTeta) *
            Math.abs(Math.sin(Math.atan(Number(y / x) || 0) + xRotation))
        );
        // -(z + xyLength * Math.sin(Math.acos(xyLength / length))) *
        // Math.cos(zTeta);

        console.log(
          [x, y, z],
          Math.abs(Math.cos(Math.atan(y / x) + Math.PI / 4)),
          (Math.atan(y / x) * 180) / Math.PI
        );

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(zeroX, zeroY);
        ctx.lineTo(
          zeroX + Math.round(hProjection),
          zeroY + Math.round(vProjection)
        );
        ctx.strokeStyle = colors[idx];
        ctx.stroke();
        ctx.restore();
      });
      zTeta += toRad(0.2);
      requestAnimationFrame(rotate);
    };

    rotate();

    // ctx.save();
    // ctx.beginPath();
    // ctx.moveTo(zeroX, zeroY);
    // ctx.lineTo(zeroX + 150, zeroY);
    // ctx.strokeStyle = 'lime';
    // ctx.stroke();
    // ctx.restore();

    // ctx.save();
    // ctx.beginPath();
    // ctx.moveTo(zeroX, zeroY);
    // ctx.lineTo(zeroX + 1, zeroY + 1);
    // ctx.strokeStyle = 'red';
    // ctx.stroke();
    // ctx.restore();
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
