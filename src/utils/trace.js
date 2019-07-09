import { map, forEach, memoize } from "lodash";

const rad360 = 2 * Math.PI;
const traceLength = 20;
const getHistoryColor = memoize(
  a => `rgba(255,255,255,${1 - (traceLength - a) / traceLength})`
);

const drawDot = (ctx, [x, y], color) => {
  ctx.save();
  ctx.lineWidth = 1;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, 1, 1, 0, 0, rad360);
  ctx.fill();
  ctx.restore();
};

function renderItem({ item: [x, y], color }) {
  this.fillStyle = color; //getHistoryColor(index);
  this.beginPath();
  this.ellipse(x, y, 1, 1, 0, 0, rad360);
  this.fill();
}

export const createRenderer = ctx => {
  const render = renderItem.bind(ctx);
  return histories => {
    const vals = histories.read();
    ctx.save();
    ctx.lineWidth = 1;

    forEach(
      map(vals, ({ item, index }) => ({ item, color: getHistoryColor(index) })),
      render
    );

    ctx.restore();
  };
};
