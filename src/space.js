import { random } from "lodash/fp";
// import { createGridRenderer } from "./utils/grid";
import { createFpsRenderer } from "./utils/fps";
import {
  sun,
  earth,
  moon,
  mars,
  venus,
  mercury,
  saturn,
  jupiter
} from "./utils/object";
import { addObject } from "./data-storage";

// import { createCircleRenderer } from "./utils/circle";

import { solarSystem } from "./solar-system";
import { renderSystem } from "./render-system";

const sunId = addObject(sun, {
  direction: [0, 0],
  velocity: [0, 0, 0],
  scalePosition: 1e-9,
  scaleRadius: 5e-8
});

const mercuryId = addObject(mercury, {
  direction: [57.91 * 1e6, 90], //random(0, 360)], // km, angle
  velocity: [48000, 0, 0],
  scalePosition: 1e-9,
  scaleRadius: 3e-6
});

const venusId = addObject(venus, {
  direction: [108.2 * 1e6, 90], //random(0, 360)], // km, angle
  velocity: [35000, 0, 0],
  scalePosition: 1e-9,
  scaleRadius: 3e-6
});

const earthId = addObject(earth, {
  direction: [149.6 * 1e6, 90], //random(0, 360)], // km, angle
  velocity: [29000, 0, 0],
  scalePosition: 1e-9,
  scaleRadius: 3e-6
});

const moonId = addObject(moon, {
  direction: [384400, 270], // random(0, 360)], // km, angle
  velocity: [1000, 0, 0],
  scalePosition: 5e-8,
  scaleRadius: 4e-6
});

const marsId = addObject(mars, {
  direction: [227.9 * 1e6, 90], //random(0, 360)], // km, angle
  velocity: [22000, 0, 0],
  scalePosition: 1e-9,
  scaleRadius: 3e-6
});

const jupiterId = addObject(jupiter, {
  direction: [778.5 * 1e6, 90], // km, angle
  velocity: [12500, 0, 0],
  scalePosition: 4e-10,
  scaleRadius: 4e-7
});

const saturnId = addObject(saturn, {
  direction: [1.434 * 1e9, 90], // km, angle
  velocity: [10000, 0, 0],
  scalePosition: 2.8e-10,
  scaleRadius: 4e-7
});

const objects = [
  sunId,
  mercuryId,
  venusId,
  earthId,
  marsId,
  jupiterId,
  saturnId
];

const relatives = [[earthId, moonId]];

export const animate = canvas => {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.globalCompositeOperation = "destination-over";
  const { width, height } = ctx.canvas;

  objects.forEach(id => {
    solarSystem.add(id);
    renderSystem.add(id);
  });

  relatives.forEach(([root, ...sattelites]) => {
    solarSystem.addRelative(root, sattelites);
    sattelites.forEach(id => renderSystem.add(id));
  });

  solarSystem.update(0);
  // solarSystem.update(100);
  renderSystem.use(ctx);

  const renderFps = createFpsRenderer(ctx);

  const update = ts => {
    ctx.clearRect(0, 0, width, height);

    renderFps(ts);
    renderSystem.render();
    solarSystem.update((1 / 8) * 24 * 60 * 60);

    // renderGrid();
    requestAnimationFrame(update);
  };

  // window.exe = () => {
  //   update(100);
  // };

  // setInterval(() => {
  //   ctx.clearRect(0, 0, width, height);
  //   renderSystem.render();
  //   solarSystem.update(1 * 24 * 60 * 60);
  // }, 500);

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
