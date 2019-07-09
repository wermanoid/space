const minR = 30;
const maxR = 250;

const eccentricity = (maxR - minR) / (maxR + minR);

export const move = function*(sX, sY) {
  let teta = 0;
  const dTeta = 0.01 * Math.PI;
  const p = minR * (1 + eccentricity);

  while (true) {
    const actual = p / (1 + eccentricity * Math.cos(teta));
    const x = sX + actual * Math.cos(teta);
    const y = sY + actual * Math.sin(teta);
    teta += dTeta;
    yield [x, y];
  }
};
