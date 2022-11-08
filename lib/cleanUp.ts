import { getCtrAdmin } from '../internal/utils';

export function addCleanUpFunctionToCtr(ctr: any, f: Function) {
  const ctrAdmin = getCtrAdmin(ctr);
  ctrAdmin.cleanUpFunctions = ctrAdmin.cleanUpFunctions ?? [];
  ctrAdmin.cleanUpFunctions.push(f);
}

export function cleanUpCtr(ctr: any) {
  const ctrAdmin = getCtrAdmin(ctr);
  ctrAdmin.cleanUpFunctions = ctrAdmin.cleanUpFunctions ?? [];
  ctrAdmin.cleanUpFunctions.forEach((x: Function) => x());
  ctrAdmin.cleanUpFunctions = [];
}
