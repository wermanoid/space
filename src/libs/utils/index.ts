export const cos = (rad: number, precision: number = 1e-5) => {
  const x = Math.cos(rad);
  if (Math.abs(x) < precision) return 0;
  return x;
  // return Math.abs(x) < precision ? 0 : x;
};

export const sin = (rad: number, precision: number = 1e-5) => {
  const x = Math.sin(rad);
  if (Math.abs(x) < precision) return 0;
  return x;
  // return Math.abs(x) < precision ? 0 : x;
};
