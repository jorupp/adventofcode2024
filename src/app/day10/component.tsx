import Json, { JsonList } from '../json';
import { tail, take, takeRight, zip } from 'lodash';

const dirs = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

export function Part1({ input }: { input: string }) {
  const map = input.split('\r\n').map((i) => i.split('').filter(Boolean).map(Number));

  function processAll(v: number, callback: (x: number, y: number) => void) {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === v) {
          callback(x, y);
        }
      }
    }
  }

  let previous = new Map<string, Set<string>>();
  processAll(9, (x, y) => {
    const key = `${x},${y}`;
    previous.set(key, new Set([key]));
  });

  // now, do 8-0
  for (let v = 8; v >= 0; v--) {
    const current = new Map<string, Set<string>>();
    processAll(v, (x, y) => {
      const key = `${x},${y}`;
      const currentSet = new Set<string>();
      current.set(key, currentSet);
      for (const [dx, dy] of dirs) {
        const nextX = x + dx;
        const nextY = y + dy;
        const nextKey = `${nextX},${nextY}`;
        if (previous.has(nextKey)) {
          for (const prevKey of previous.get(nextKey)!) {
            currentSet.add(prevKey);
          }
        }
      }
    });

    // console.log({ v, current });

    previous = current;
  }

  const score = [...previous.values()].map((i) => i.size).reduce((acc, curr) => acc + curr, 0);

  return (
    <>
      <Json>{score}</Json>
      {/* <Json>{previous.size}</Json> */}
    </>
  );
}
export function Part2({ input }: { input: string }) {
  const map = input.split('\r\n').map((i) => i.split('').filter(Boolean).map(Number));

  function processAll(v: number, callback: (x: number, y: number) => void) {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === v) {
          callback(x, y);
        }
      }
    }
  }

  let previous = new Map<string, number>();
  processAll(9, (x, y) => {
    const key = `${x},${y}`;
    previous.set(key, 1);
  });

  // now, do 8-0
  for (let v = 8; v >= 0; v--) {
    const current = new Map<string, number>();
    processAll(v, (x, y) => {
      const key = `${x},${y}`;
      let currentCount = 0;
      for (const [dx, dy] of dirs) {
        const nextX = x + dx;
        const nextY = y + dy;
        const nextKey = `${nextX},${nextY}`;
        if (previous.has(nextKey)) {
          currentCount += previous.get(nextKey)!;
        }
      }
      current.set(key, currentCount);
    });

    // console.log({ v, current });

    previous = current;
  }

  const score = [...previous.values()].reduce((acc, curr) => acc + curr, 0);

  return (
    <>
      <Json>{score}</Json>
      {/* <Json>{previous.size}</Json> */}
    </>
  );
}
