import { DataStore } from '#lib/data-system';

const toRad = (n: number) => (n / 180) * Math.PI;

export type SolarObjects = string;
export const initialize = (store: DataStore): Record<SolarObjects, number> => {
  const sun = store.addObject({
    name: 'sun',
    mass: 198855 * 1e25, // kg
    distance: [0, toRad(90), 0],
    radius: 696342 * 1e3, // m
    velocity: [0, 0, 0],
    scale: {
      radius: 5e-8,
      distance: 1e-9,
    },
  });

  const sun2 = store.addObject({
    name: 'sun-2',
    mass: 198855 * 1e25, // kg
    distance: [100 * 1e9, toRad(90), 0],
    radius: 696342 * 1e3, // m
    velocity: [0, 0, 0],
    scale: {
      radius: 5e-8,
      distance: 1e-9,
    },
  });

  const earth = store.addObject({
    name: 'earth',
    mass: 5973.6 * 1e21,
    distance: [149.6 * 1e9, toRad(90), toRad(270)], // m, teta, phi
    radius: 6371 * 1e3, // m
    velocity: [30000, 0, 0], // m/s
    scale: {
      radius: 3e-6,
      distance: 1e-9,
    },
  });

  const moon = store.addObject({
    name: 'moon',
    mass: 73.5 * 1e21,
    distance: [384400 * 1e3, toRad(90), toRad(270)], // m, teta, phi
    radius: 1737.1 * 1e3, // m
    velocity: [30000, 0, 0], // m/s
    scale: {
      radius: 4e-6,
      distance: 5e-8,
    },
  });

  return {
    sun2,
    sun,
    earth,
    moon,
  };
};
