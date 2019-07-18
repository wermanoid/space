export const createFpsRenderer = ctx => {
  const { width, height } = ctx.canvas;
  let last = performance.now();
  let fps = 0;
  return timestamp => {
    const val = Math.round(1000 / (timestamp - last));
    fps = Math.abs(val - fps) > 2.5 ? val : fps;
    ctx.save();
    ctx.font = "bold 24px verdana, sans-serif ";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "white";
    ctx.fillText(fps, width - 40, height);
    ctx.fillStyle = "red";
    ctx.fillText("FPS", width - 60, height - 20);
    ctx.restore();
    last = timestamp;
  };
};
