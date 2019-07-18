// import { map, forEach } from "lodash/fp";

import { createGridRenderer } from "./utils/grid";
import { createFpsRenderer } from "./utils/fps";
// import { createCircleRenderer } from "./utils/circle";

const objects = {
  lastId: 0,
  velocityVectors: [],
  objectMasses: [],
  objectPositions: [],
  objectSizes: []
};

const addObject = (mass, velocity, position, radius) => {
  const oId = objects.lastId++;
  objects.velocityVectors[oId] = velocity;
  objects.objectMasses[oId] = mass;
  objects.objectPositions[oId] = position;
  objects.objectSizes[oId] = radius;
  return oId;
};

export const animate = canvas => {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.globalCompositeOperation = "destination-over";
  const { width, height } = ctx.canvas;

  addObject(1e7, [0, 0], [10, 10], 5);
  addObject(1e7, [0, 0], [50, 10], 5);
  addObject(1e7, [0, 0], [10, 50], 5);
  addObject(1e7, [0, 0], [100, 10], 5);

  const renderGrid = createGridRenderer(ctx, 20);
  const renderFps = createFpsRenderer(ctx);

  const update = ts => {
    ctx.clearRect(0, 0, width, height);
    renderFps(ts);
    renderGrid();
    requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
};

// import { map, forEach } from "lodash";

// import { createRenderer } from "./utils/trace";
// import { createHistory } from "./utils/history";
// import { move } from "./utils/planet";

// const storage = {
//   objects: 0,
//   circles: {},
//   coords: {},
//   histories: createHistory(50, 1),
//   speed: {} // px / sec
// };

// const rad360 = 2 * Math.PI;

// export const addCircle = (x, y, r, sX, sY) => {
//   const id = storage.objects;
//   storage.circles[id] = r;
//   storage.coords[id] = [500 + x, 200 + y];
//   storage.speed[id] = [sX, sY];
//   storage.objects += 1;
// };

// export const drawCircle = (ctx, [x, y], r) => {
// ctx.beginPath();
// ctx.ellipse(x, y, r, r, 0, 0, rad360);
// ctx.stroke();
// };

// let lastDate = Date.now();
// const fps = ctx => {
//   ctx.save();
//   ctx.font = "bold 24px verdana, sans-serif ";
//   ctx.textAlign = "start";
//   ctx.textBaseline = "bottom";
//   ctx.fillStyle = "white";
//   const actual = Date.now();
//   ctx.fillText(Math.round(1000 / (actual - lastDate)), 960, 600);
//   ctx.fillStyle = "red";
//   ctx.fillText("FPS", 940, 580);
//   lastDate = actual;
//   ctx.restore();
// };

// const updateCoords = (mW, mH, rule) => delta => {
//   // const ms = delta / 1000;
//   // const updVectors = map(storage.speed, ([sX, sY], index) => {
//   //   return [index, ms * sX, ms * sY];
//   // });
//   storage.histories.lock();
//   const pos = rule.next().value;
//   storage.coords[1] = pos;
//   storage.histories.push(pos);
//   // forEach(updVectors, ([index, dX, dY]) => {
//   //   const [x, y] = storage.coords[index];
//   //   storage.coords[index] = [x + dX, y + dY];
//   //   storage.histories.push([x, y]);
//   // });
//   storage.histories.unlock();

//   forEach(storage.coords, ([x, y], index) => {
//     if (x > mW || x < 0) storage.speed[index][0] *= -1;
//     if (y > mH || y < 0) storage.speed[index][1] *= -1;
//   });
// };

// const renderGrid = ctx => {
//   const { width, height } = ctx.canvas;
//   const step = 20;
//   ctx.save();
//   ctx.beginPath();
//   for (let x = 0.5; x < width; x += step) {
//     ctx.moveTo(x, 0);
//     ctx.lineTo(x, height);
//   }

//   for (let y = 0.5; y < height; y += step) {
//     ctx.moveTo(0, y);
//     ctx.lineTo(width, y);
//   }
//   ctx.strokeStyle = "#777";
//   ctx.stroke();

//   ctx.restore();
// };

// const render = ctx => {
//   ctx.save();
//   ctx.lineWidth = 2;
//   ctx.strokeStyle = "orange";
//   forEach(storage.circles, (circle, index) => {
//     drawCircle(ctx, storage.coords[index], circle);
//   });
//   ctx.restore();
// };

// let last = Date.now();
// export const animate = canvas => {
// if (!canvas) return;
// const ctx = canvas.getContext("2d");
// ctx.globalCompositeOperation = "destination-over";
// const { width, height } = ctx.canvas;

//   addCircle(0, 0, 20, 0, 0);
//   addCircle(0, 100, 5, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50);
//   const calc = move(storage.coords[0][0], storage.coords[0][1]);
//   const upd = updateCoords(width, height, calc);

//   const renderTraces = createRenderer(ctx);

//   const run = stamp => {
//     ctx.clearRect(0, 0, width, height);

//     fps(ctx);
//     render(ctx);
//     renderTraces(storage.histories);
//     renderGrid(ctx);

//     requestAnimationFrame(run);
//   };

//   setInterval(() => {
//     const stamp = Date.now();
//     upd(stamp - last);
//     last = stamp;
//   }, 16);

//   requestAnimationFrame(run);
// };
