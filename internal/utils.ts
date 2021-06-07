import { symbols } from "./symbols";

export function getOrCreate(obj: any, key: any, fn: Function) {
  if (!obj[key]) {
    obj[key] = fn();
  }
  return obj[key];
}

export function getCtrAdmin(ctr: any) {
  return getOrCreate(ctr, symbols.admin, () => ({}));
}
