import { forEach } from "lodash/fp";

const rad360 = 2 * Math.PI;

export const renderCircle = ctx => ([x, y], r) => {
  ctx.beginPath();
  ctx.ellipse(x, y, r, r, 0, 0, rad360);
  ctx.stroke();
};

export const createCircleRenderer = ctx => {
  const renderer = renderCircle(ctx);
  const render = forEach(([coords, radius]) => {
    renderer(coords, radius);
  });

  return cList => {
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "orange";
    render(cList);
    ctx.restore();
  };
};
