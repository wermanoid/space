import { DataStore } from '#lib/data-system';
import { ObjectId, Point3D } from '#lib/types';
import { sum } from '#lib/vector';

import { Adapter3d, Line, toRad, Dot } from './adapter-3d';
import { PolygonsShape, PolygonRenderer } from './polygon-renderer';

const rad360 = 2 * Math.PI;

export const renderCircle = (ctx: CanvasRenderingContext2D) => (
  [x, y]: Point3D,
  r: number
) => {
  ctx.beginPath();
  ctx.ellipse(x, y, r, r, 0, 0, rad360);
  ctx.stroke();
};

const cube: Point3D[] = [
  [1, 1, 1],
  [-1, 1, 1],
  [1, -1, 1],
  [-1, -1, 1],
  [1, 1, -1],
  [-1, 1, -1],
  [1, -1, -1],
  [-1, -1, -1],
].map<Point3D>(xx => xx.map(i => i * 50) as Point3D);

export interface LinesShape {
  edges: Line[];
  color: string;
  width?: number;
}

export interface CirclesShape {
  items: Array<[Dot, number]>;
  stroke?: string;
  fill?: string;
}

const cube3d: PolygonsShape[] = [
  {
    vertexes: [
      [[50, 50, 50], [-50, 50, 50], [50, -50, 50]],
      [[-50, -50, 50], [-50, 50, 50], [50, -50, 50]],
    ],
    fill: 'rgba(10, 10, 255, 0.4)',
  },
  {
    vertexes: [
      [[50, 50, -50], [-50, 50, -50], [50, -50, -50]],
      [[-50, -50, -50], [-50, 50, -50], [50, -50, -50]],
    ],
    fill: 'rgba(255, 10, 10, 0.4)',
  },
  {
    vertexes: [
      [[50, 50, 50], [-50, 50, -50], [-50, 50, 50]],
      [[50, 50, -50], [-50, 50, -50], [50, 50, 50]],
    ],
    fill: 'rgba(10, 255, 10, 0.4)',
  },
  {
    vertexes: [
      [[50, -50, 50], [-50, -50, -50], [-50, -50, 50]],
      [[50, -50, -50], [-50, -50, -50], [50, -50, 50]],
    ],
    fill: 'rgba(10, 255, 10, 0.4)',
  },
  {
    vertexes: [
      [[50, -50, 50], [50, 50, -50], [50, 50, 50]],
      [[50, -50, 50], [50, 50, -50], [50, -50, -50]],
    ],
    fill: 'rgba(12, 43, 53, 0.4)',
  },
  {
    vertexes: [
      [[-50, -50, 50], [-50, 50, -50], [-50, 50, 50]],
      [[-50, -50, 50], [-50, 50, -50], [-50, -50, -50]],
    ],
    fill: 'rgba(12, 43, 53, 0.4)',
  },
];

const shiftPolygons = (pArr: PolygonsShape[], shift: number, y, z) =>
  pArr.map(p => ({
    ...p,
    vertexes: p.vertexes.map(vArr =>
      vArr.map(vert => [vert[0] + shift, vert[1] + y, vert[2] + z])
    ),
  }));

export const createFpsRenderer = ctx => {
  const { width, height } = ctx.canvas;
  let last = performance.now();
  let fps = 0;
  return timestamp => {
    const val = Math.round(1000 / (timestamp - last));
    fps = Math.abs(val - fps) > 2.5 ? val : fps;
    ctx.save();
    ctx.font = 'bold 24px verdana, sans-serif ';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = 'black';
    ctx.fillText(fps, width - 40, height);
    ctx.fillStyle = 'red';
    ctx.fillText('FPS', width - 60, height - 20);
    ctx.restore();
    last = timestamp;
  };
};

export class Render2DSystem {
  public readonly store: DataStore;
  public objects: ObjectId[] = [];
  private ctx!: CanvasRenderingContext2D;
  private center!: [number, number];
  private adapter3d: Adapter3d;
  private coordsProjector!: (p: Point3D) => [number, number];
  private pren: any;

  constructor(store: DataStore) {
    this.store = store;
    this.adapter3d = new Adapter3d();
    this.adapter3d.yaw(toRad(25));
    this.adapter3d.roll(toRad(15));
    this.coordsProjector = this.adapter3d.getProjector();

    this.pren = new PolygonRenderer();
    cube3d.forEach(p => this.pren.push(p));
    // shiftPolygons(cube3d, 200).forEach(p => this.pren.push(p));
    for (let i = 0; i < 5; i++) {
      shiftPolygons(
        cube3d,
        Math.random() * 400 - 200,
        Math.random() * 400 - 200,
        Math.random() * 400 - 200
      ).forEach(p => this.pren.push(p));
    }
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
    const { width, height } = ctx.canvas;

    const [zeroX, zeroY] = this.center;
    const colors = ['cyan', 'coral', 'lime', 'white']; // z, y, x
    const zero: Point3D = [0, 0, 0];
    const metrics: Array<[Point3D, Point3D]> = [
      [zero, [0, 0, 100]],
      [zero, [0, 100, 0]],
      [zero, [100, 0, 0]],
    ];

    const fps = createFpsRenderer(ctx);

    const rotate = timespan => {
      ctx.clearRect(0, 0, width, height);

      fps(timespan);

      this.renderLines([
        { edges: [metrics[0]], color: colors[0], width: 2 },
        { edges: [metrics[1]], color: colors[1], width: 2 },
        { edges: [metrics[2]], color: colors[2], width: 2 },
      ]);

      this.pren.update(this.adapter3d.getProjectorWithArgs(), zeroX, zeroY);
      this.pren.render(ctx);

      this.renderCircles([
        {
          items: cube.map((i: Point3D) => [i, 5]),
          fill: 'white',
        },
      ]);

      this.adapter3d.roll(this.adapter3d.rollAngle + toRad(0.7));
      this.adapter3d.pitch(this.adapter3d.pitchAngle + toRad(0.1));
      this.adapter3d.yaw(this.adapter3d.yawAngleX + toRad(0.3));
      this.coordsProjector = this.adapter3d.getProjector();

      requestAnimationFrame(rotate);
    };

    requestAnimationFrame(rotate);
  }

  private renderLines = (lines: LinesShape[]) => {
    const ctx = this.ctx;
    const [zeroX, zeroY] = this.center;
    const toProjection = this.coordsProjector;

    for (let i = 0; i < lines.length; i++) {
      const linesConfig = lines[i];
      ctx.save();
      ctx.strokeStyle = linesConfig.color;
      ctx.lineWidth = linesConfig.width || 1;
      for (let j = 0; j < linesConfig.edges.length; j++) {
        const [start, end] = linesConfig.edges[j].map(toProjection);
        ctx.beginPath();
        ctx.moveTo(zeroX + start[0], zeroY + start[0]);
        ctx.lineTo(zeroX + end[0], zeroY + end[1]);
        ctx.stroke();
      }
      ctx.restore();
    }
  };

  private renderCircles = (circles: CirclesShape[]) => {
    const ctx = this.ctx;
    const [zeroX, zeroY] = this.center;
    const toProjection = this.coordsProjector;

    for (let i = 0; i < circles.length; i++) {
      const sameColorCircles = circles[i];

      ctx.save();
      for (let j = 0; j < sameColorCircles.items.length; j++) {
        const circle = sameColorCircles.items[j];
        const [x, y] = toProjection(circle[0]);
        ctx.beginPath();
        ctx.ellipse(
          zeroX + x,
          zeroY + y,
          circle[1],
          circle[1],
          0,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = sameColorCircles.fill || '';
        ctx.strokeStyle = sameColorCircles.stroke || '';
        ctx.fill();
        ctx.stroke();
      }
    }
    ctx.restore();
  };

  private renderPolygons = (polygons: PolygonsShape[]) => {
    const ctx = this.ctx;
    const [zeroX, zeroY] = this.center;
    const toProjection = this.coordsProjector;

    for (let i = 0; i < polygons.length; i++) {
      const sameColorPolygons = polygons[i];
      ctx.save();
      for (let j = 0; j < sameColorPolygons.vertexes.length; j++) {
        const polygon = sameColorPolygons.vertexes[j];
        const [a, b, c] = polygon.map(toProjection);
        ctx.beginPath();
        ctx.fillStyle = sameColorPolygons.fill || 'rgba(255,255,255,0.3)';
        ctx.moveTo(a[0] + zeroX, a[1] + zeroY);
        ctx.lineTo(b[0] + zeroX, b[1] + zeroY);
        ctx.lineTo(c[0] + zeroX, c[1] + zeroY);
        ctx.fill();
      }
      ctx.restore();
    }
  };

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
