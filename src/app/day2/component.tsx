import Json, { JsonList } from '../json';
import { tail, take, takeRight, zip } from 'lodash';

function isSafe(report: number[]) {
  if (report[0] === report[1]) return false;
  const dir = report[0] > report[1] ? -1 : 1;
  for (let i = 1; i < report.length; i++) {
    if (report[i] === report[i - 1]) return false;
    if ((report[i] - report[i - 1]) * dir <= 0) return false;
    if (Math.abs(report[i] - report[i - 1]) > 3) return false;
  }

  return true;
}

function isDeltasSafe(deltas: number[]) {
  if (deltas.every((i) => 1 <= i && i <= 3)) return true;
  if (deltas.every((i) => -3 <= i && i <= -1)) return true;
  return false;
}

function isSafeWithDampener(report: number[]) {
  const deltas = zip(take(report, report.length - 1), tail(report)).map(([a, b]) => b! - a!);

  // normal rules
  if (isDeltasSafe(deltas)) return true;

  // see if it'll work if we remove the first or last one
  if (isDeltasSafe(tail(deltas))) return true;
  if (isDeltasSafe(take(deltas, deltas.length - 1))) return true;

  // ok, removing the first or last one didn't work - let's figure out the overall direction of the list
  const dir = deltas.filter((i) => i > 0).length > deltas.length / 2 ? 1 : -1;
  // return [dir, deltas];
  const validDeltas = [dir * 1, dir * 2, dir * 3];
  const targetIx = deltas.findIndex((i) => !validDeltas.includes(i));
  if (targetIx === -1) {
    console.log('no target index - should not be possible', { report, deltas, dir, validDeltas, targetIx });
    return true;
  }
  if (targetIx !== 0) {
    // try merging with the previous one
    const merged = take(deltas, targetIx - 1)
      .concat([deltas[targetIx - 1] + deltas[targetIx]])
      .concat(takeRight(deltas, deltas.length - targetIx - 1));
    if (isDeltasSafe(merged)) return true;
  }
  if (targetIx !== deltas.length - 1) {
    // try merging with the next one
    const merged = take(deltas, targetIx)
      .concat([deltas[targetIx] + deltas[targetIx + 1]])
      .concat(takeRight(deltas, deltas.length - targetIx - 2));
    if (isDeltasSafe(merged)) return true;
  }
  return false;
}

export function Part1({ input }: { input: string }) {
  const parsed = input.split('\r\n').map((i) => i.split(/\s/).filter(Boolean).map(Number));
  return <Json>{parsed.filter(isSafe).length}</Json>;
}
export function Part2({ input }: { input: string }) {
  const parsed = input.split('\r\n').map((i) => i.split(/\s/).filter(Boolean).map(Number));
  // shortest one is 5
  return <Json>{parsed.filter(isSafeWithDampener).length}</Json>;
}
