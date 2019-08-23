import { Polygon } from './adapter-3d';

export interface PolygonsShape {
  vertexes: Polygon[];
  fill: string;
}

const VERTEX_IN_BYTES_LENGTH = 3 * Float32Array.BYTES_PER_ELEMENT;
const extend = (buffer: ArrayBuffer, extendSize: number) => {
  const tmp = new Uint8Array(buffer.byteLength + extendSize);
  tmp.set(new Uint8Array(buffer), 0);
  return tmp.buffer;
};

export class PolygonRenderer {
  public buffer = new ArrayBuffer(0);
  public coordsArray = new Float32Array(this.buffer);
  public positions = new ArrayBuffer(0);
  public pX = new Float32Array(this.positions);
  public pY = new Float32Array(this.positions);
  public colors: string[] = [];

  public update(
    projector: (x: number, y: number, z: number) => [number, number],
    zeroX: number,
    zeroY: number
  ) {
    const coords = this.coordsArray;
    const psX = this.pX;
    const psY = this.pY;
    let start = 0;
    let tmp: any = null;
    let coorrds: any = null;
    for (let i = 0; i * 3 < coords.length; i++) {
      start = i * 3;
      tmp = coords.slice(start, start + 3);
      coorrds = projector.apply(null, tmp);
      // tslint:disable-next-line: no-bitwise
      psX[i] = (coorrds[0] + zeroX + 0.5) << 0;
      // tslint:disable-next-line: no-bitwise
      psY[i] = (coorrds[1] + zeroY + 0.5) << 0;
    }
  }

  public render(ctx: CanvasRenderingContext2D) {
    const psX: Float32Array = this.pX;
    const psY: Float32Array = this.pY;
    const colors = this.colors;

    ctx.save();
    for (let i = 0; i < colors.length; i++) {
      ctx.beginPath();
      ctx.fillStyle = colors[i];
      const start = i * 3;
      const end = start + 3;
      const xPos = psX.slice(start, end);
      const yPos = psY.slice(start, end);

      ctx.moveTo(xPos[0], yPos[0]);
      ctx.lineTo(xPos[1], yPos[1]);
      ctx.lineTo(xPos[2], yPos[2]);

      ctx.fill();
    }
    ctx.restore();
  }

  public push(polygon: PolygonsShape) {
    const offset = this.coordsArray.length;
    this.buffer = extend(
      this.buffer,
      3 * VERTEX_IN_BYTES_LENGTH * polygon.vertexes.length
    );

    const resArray = (this.coordsArray = new Float32Array(this.buffer));

    this.positions = extend(
      this.positions,
      2 * VERTEX_IN_BYTES_LENGTH * polygon.vertexes.length
    );

    const singleCoordinateArraySize = this.coordsArray.length / 3;
    this.pX = new Float32Array(this.positions, 0, singleCoordinateArraySize);
    this.pY = new Float32Array(
      this.positions,
      singleCoordinateArraySize * Float32Array.BYTES_PER_ELEMENT,
      singleCoordinateArraySize
    );

    for (let i = 0; i < polygon.vertexes.length; i++) {
      this.colors[this.colors.length] = polygon.fill;
      const vert = polygon.vertexes[i];
      const shift = offset + i * 9;
      resArray.set(vert[0], shift);
      resArray.set(vert[1], shift + 3);
      resArray.set(vert[2], shift + 6);
    }
  }
}
