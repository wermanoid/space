export const createGridRenderer = (ctx, step = 20) => {
  const { width, height } = ctx.canvas;

  return () => {
    ctx.save();
    ctx.beginPath();
    for (let x = 0.5; x < width; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }

    for (let y = 0.5; y < height; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.strokeStyle = "#777";
    ctx.stroke();

    ctx.restore();
  };
};
