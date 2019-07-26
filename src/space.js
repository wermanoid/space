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

import { solarSystem } from "./solar-system";
import { renderSystem } from "./render-system";

const sunId = addObject(sun, {
  direction: [0, 0],
  velocity: [0, 0, 0],
  scalePosition: 1e-9,
  scaleRadius: 5e-8
});

const mercuryId = addObject(mercury, {
  direction: [57.91 * 1e6, 180], //random(0, 360)], // km, angle
  velocity: [0, 48000, 0],
  scalePosition: 1e-9,
  scaleRadius: 3e-6
});

const venusId = addObject(venus, {
  direction: [108.2 * 1e6, 0], //random(0, 360)], // km, angle
  velocity: [0, -35000, 0],
  scalePosition: 1e-9,
  scaleRadius: 3e-6
});

const earthId = addObject(earth, {
  direction: [149.6 * 1e6, 270], //random(0, 360)], // km, angle
  velocity: [-30000, 0, 0],
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
  renderSystem.use(ctx);

  const renderFps = createFpsRenderer(ctx);

  const update = ts => {
    ctx.clearRect(0, 0, width, height);

    renderFps(ts);
    renderSystem.render();
    solarSystem.update((1 / 12) * 24 * 60 * 60);

    requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
};
