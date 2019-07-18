const createObject = (radius, earthRadius, mass, earthMass, satellites) => ({
  radius,
  mass,
  earthMass,
  earthRadius,
  ...(satellites && { satellites })
});

export const sun = createObject(696342, 109.3, 198855 * 1e25, 333000);

export const uranus = createObject(25362, 3.981, 86832 * 1e21, 14.536);

export const neptune = createObject(24622, 3.856, 103430 * 1e21, 17.147);

export const venus = createObject(6051.8, 0.9499, 4868.5 * 1e21, 0.815);

export const mars = createObject(3389.5, 0.532, 641.85 * 1e21, 0.107);

export const ganymede = createObject(2634.1, 0.4135, 148.2 * 1e21, 0.0248);

export const titan = createObject(2574.73, 0.4037, 134.5 * 1e21, 0.0225);

export const mercury = createObject(2439.7, 0.3829, 330.2 * 1e21, 0.0553);

export const callisto = createObject(2410.3, 0.3783, 107.6 * 1e21, 0.018);

export const io = createObject(1821.6, 0.2859, 89.3 * 1e21, 0.015);

export const moon = createObject(1737.1, 0.2727, 73.5 * 1e21, 0.0123);

export const europa = createObject(1560.8, 0.245, 48 * 1e21, 0.008035);

export const earth = createObject(6371, 1, 5973.6 * 1e21, 1, [moon]);

export const jupiter = createObject(69911, 10.97, 1898600 * 1e21, 317.83, [
  io,
  europa,
  ganymede
]);

export const saturn = createObject(58232, 9.14, 568460 * 1e21, 95.162, [
  null,
  null,
  null,
  null,
  null,
  titan
]);
