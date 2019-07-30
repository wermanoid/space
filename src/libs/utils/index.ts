import { round } from 'lodash';

export const cos = (rad: number, precision: number = 5) => {
  // const x = Math.cos(rad);
  // return Math.abs(x) < precision ? 0 : x;
  return round(Math.cos(rad), precision);
};
export const sin = (rad: number, precision: number = 5) => {
  // const x = Math.sin(rad);
  // return Math.abs(x) < precision ? 0 : x;
  return round(Math.sin(rad), precision);
};
