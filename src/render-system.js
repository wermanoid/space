import {
  positions,
  disances,
  forces,
  masses,
  accelerations,
  addObject,
  radiuses,
  radiusScales,
  positionScales,
  scaledPositions
} from "./data-storage";

import { renderCircle } from "./utils/circle";

// ** utils to move **
const zipMulitiply = (arr1, arr2) => {
  if (!arr1 || !arr2) return arr1 || arr2;
  const result = [];
  for (let i = 0; i < arr1.length; i++) {
    result.push(arr1[i] * arr2[i] || 0);
  }
  return result;
};

const zipSum = (arr1, arr2) => {
  if (!arr1 || !arr2) return arr1 || arr2;
  const result = [];
  for (let i = 0; i < arr1.length; i++) {
    result.push(arr1[i] + arr2[i] || 0);
  }
  return result;
};

// ** utils to move **

const coords = [];

const renderObjects = (ctx, ids) => {
  const renderer = renderCircle(ctx);
  const { width, height } = ctx.canvas;
  const zero = [Math.round(width / 2), Math.round(height / 2), 0];
  ctx.save();
  ctx.strokeStyle = "orange";
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const position = scaledPositions[id]; //zipMulitiply(positions[id], positionScales[id]);
    const shift = zipSum(position, zero);
    const radius = Math.round((radiuses[id] * (radiusScales[id] || 1)) / 2);
    // console.log(id, position, shift);
    coords[id] = shift;
    renderer(shift, radius);
  }
  ctx.restore();
};

const renderVectors = (ctx, ids) => {
  // console.table(forces.map(f => zipMulitiply(f, [1e-22, 1e-22, 1e-22])));
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const objectsList = Object.keys(forces[id]);
    for (let j = 0; j < objectsList.length; j++) {
      const [x0, y0] = coords[id];
      const [x1, y1] = coords[objectsList[j]];
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
    }
  }
  ctx.strokeStyle = "rgba(125,125,125,0.2)";
  ctx.stroke();

  ctx.beginPath();
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const objectsList = Object.keys(forces[id]);
    for (let j = 0; j < objectsList.length; j++) {
      if (id !== objectsList[j]) {
        const force = forces[id][objectsList[j]];
        const [x0, y0] = coords[id];
        const [x1, y1] = coords[objectsList[j]];
        // console.log(force * 1e-21);
        const angle = Math.atan2(y0 - y1, x0 - x1) - Math.PI;
        ctx.moveTo(x0, y0);
        ctx.lineTo(x0 + Math.cos(angle) * 50, y0 + Math.sin(angle) * 50);
      }
    }
  }
  ctx.strokeStyle = "red";
  ctx.stroke();

  ctx.restore();
};

export const renderSystem = {
  objects: [],
  ctx: null,
  add(id) {
    this.objects.push(String(id));
  },
  use(canvasContext) {
    this.ctx = canvasContext;
  },
  render() {
    renderObjects(this.ctx, this.objects);
    renderVectors(this.ctx, this.objects);
  }
};
