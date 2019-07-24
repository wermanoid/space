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
  scaledPositions,
  velocities
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

const zipSum = (...arrs) => {
  const result = [];
  for (let i = 0; i < arrs.length; i++) {
    const arr = arrs[i];
    if (!arr || arr.length === 0) continue;
    for (let j = 0; j < arr.length; j++) {
      result[j] = (result[j] || 0) + arr[j];
    }
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
  // let id;
  for (let i = 0, id = ids[0]; i < ids.length; i++, id = ids[i]) {
    // const id = ids[i];
    const shift = zipSum(scaledPositions[id], zero);
    const radius = Math.round((radiuses[id] * (radiusScales[id] || 1)) / 2);
    coords[id] = shift;
    renderer(shift, radius);
  }
  ctx.restore();
};

const getAngle = (oId1, oId2) => {
  const [x1, y1, z1] = positions[oId1];
  const [x2, y2, z2] = positions[oId2];
  return Math.atan2(y1 - y2, x1 - x2) + Math.PI;
};

const renderForceVectors = (ctx, ids) => {
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
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.stroke();

  ctx.beginPath();
  const xx = v => (Number.isNaN(v) ? 0 : v);
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const objectsList = Object.keys(forces[id]);
    for (let j = 0; j < objectsList.length; j++) {
      const id2 = objectsList[j];
      if (id !== id2) {
        const force = forces[id][id2]
          .map(f => Math.sign(f) * Math.log10(Math.abs(f)))
          .map(xx);
        const [x0, y0] = coords[id];
        const [x1, y1] = coords[id2];
        // const angle = getAngle(id2, id);
        const angle = Math.atan2(y0 - y1, x0 - x1) + Math.PI;
        console.log(force);
        ctx.moveTo(x0, y0);
        ctx.lineTo(
          x0 + Math.cos(angle) * Math.abs(force[0]),
          y0 + Math.sin(angle) * Math.abs(force[1])
        );
      }
    }
  }
  ctx.strokeStyle = "red";
  ctx.stroke();

  ctx.restore();
};

const renderVelocityVectors = (ctx, ids) => {
  ctx.save();
  ctx.beginPath();

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const [vX, vY] = velocities[id] || [0, 0];
    const [x0, y0] = coords[id] || [0, 0];
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0 + vX / 1000, y0 + vY / 1000);
  }

  ctx.strokeStyle = "lime";
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
    renderForceVectors(this.ctx, this.objects);
    renderVelocityVectors(this.ctx, this.objects);
  }
};
