import Json, { JsonList } from '../json';
import { tail, take, takeRight, zip } from 'lodash';

export function Part1({ input }: { input: string }) {
  function find(grid: string[][], target: string[], x: number, y: number, dx: number, dy: number): boolean {
    for (let i = 0; i < target.length; i++) {
      if (x < 0 || x >= grid[0].length) return false;
      if (y < 0 || y >= grid.length) return false;
      if (grid[y][x] !== target[i]) return false;
      x += dx;
      y += dy;
    }
    return true;
  }

  const target = 'XMAS'.split('');
  const parsed = input.split('\r\n').map((i) => i.split(''));
  const dirs = [
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
  ];
  let found = 0;
  for (let y = 0; y < parsed.length; y++) {
    for (let x = 0; x < parsed[y].length; x++) {
      for (let [dx, dy] of dirs) {
        if (find(parsed, target, x, y, dx, dy)) {
          found++;
        }
      }
    }
  }
  return <Json>{found}</Json>;
}
export function Part2({ input }: { input: string }) {
  const dirs = [
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
  ];
  function find(grid: string[][], x: number, y: number): number {
    // look for the A in the center
    if (parsed[y][x] !== 'A') return 0;

    // ok, so now we need to find 'M' in two second-adjacent directions, and 'S' on the other two
    const m = dirs
      .map(([dx, dy]) => parsed[y + dy][x + dx] === 'M')
      .map((i, ix) => ({ i, ix }))
      .filter((i) => i.i)
      .map((i) => i.ix);
    if (m.length < 2) return 0;
    const s = dirs
      .map(([dx, dy]) => parsed[y + dy][x + dx] === 'S')
      .map((i, ix) => ({ i, ix }))
      .filter((i) => i.i)
      .map((i) => i.ix);
    if (s.length < 2) return 0;

    // try each pairing of Ms - make sure they're off by 2
    let count = 0;
    for (const m1 of m) {
      // ah, only diagonals count!
      if (m1 !== 1 && m1 !== 3 && m1 !== 5 && m1 !== 7) continue;
      for (const m2 of m) {
        if (m1 >= m2) continue;
        const mDiff = (8 + m1 - m2) % 8;
        // Ms have to be at a right angle
        if (mDiff !== 2 && mDiff !== 6) continue;

        // try each pairing of Ss - make sure they're off by 2
        for (const s1 of s) {
          for (const s2 of s) {
            if (s1 >= s2) continue;
            const sDiff = (8 + s1 - s2) % 8;
            // Ss have to be at a right angle
            if (sDiff !== 2 && sDiff !== 6) continue;
            // each M has to be at a right angle or across from an S
            const dDiff = (8 + m1 - s2) % 8;
            if (dDiff !== 2 && dDiff !== 4 && dDiff !== 6) continue;
            count++;
            // console.log({ x, y, m1, m2, s1, s2 });
          }
        }
      }
    }

    if (count > 1) {
      console.log({ x, y, count });
    }

    return count;
  }

  const parsed = input.split('\r\n').map((i) => i.split(''));

  let found = 0;
  const loc: [number, number, any][] = [];
  for (let y = 1; y < parsed.length - 1; y++) {
    for (let x = 1; x < parsed[y].length - 1; x++) {
      const r = find(parsed, x, y);
      if (r) {
        loc.push([x, y, r]);
        found += r;
      }
    }
  }
  // return <JsonList>{loc}</JsonList>;
  // 1886 is too high
  // 1889 is too high
  // 2063 is too high
  return <Json>{found}</Json>;
}
