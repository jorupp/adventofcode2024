import Json, { JsonList } from '../json';
import { tail, take, takeRight, zip } from 'lodash';

const dirs = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

function findGuard(map: string[][]) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === '^') {
        return [x, y];
      }
    }
  }
  throw new Error('Guard not found');
}

export function Part1({ input }: { input: string }) {
  const map = input
    .split('\r\n')
    .map((i) => i.split(''))
    .filter((i) => !!i.length);
  let [x, y] = findGuard(map);
  map[y][x] = '.';
  const seen = new Set<string>();
  let dir = 0;
  let count = 0;
  while (x >= 0 && x < map[0].length && y >= 0 && y < map.length) {
    const key = `${x},${y}`;
    if (!seen.has(key)) {
      count++;
      seen.add(key);
    }
    while ((map[y + dirs[dir][1]]?.[x + dirs[dir][0]] || '.') === '#') {
      dir++;
      dir %= 4;
    }
    x += dirs[dir][0];
    y += dirs[dir][1];
  }

  return (
    <>
      {/* <Json>{[x, y]}</Json>
      <JsonList>{map}</JsonList> */}
      <Json>{count}</Json>
    </>
  );
}
export function Part2({ input }: { input: string }) {
  const map = input
    .split('\r\n')
    .map((i) => i.split(''))
    .filter((i) => !!i.length);
  function getObstructionCandidateLocations(map: string[][], x: number, y: number) {
    const locations: [number, number][] = [];
    const seen = new Set<string>();
    let dir = 0;
    let count = 0;
    while (x >= 0 && x < map[0].length && y >= 0 && y < map.length) {
      const key = `${x},${y}`;
      if (!seen.has(key)) {
        count++;
        seen.add(key);
        locations.push([x, y]);
      }
      while ((map[y + dirs[dir][1]]?.[x + dirs[dir][0]] || '.') === '#') {
        dir++;
        dir %= 4;
      }
      x += dirs[dir][0];
      y += dirs[dir][1];
    }
    return locations;
  }
  // using obX/obY instead of modifying map so we don't have to clone map for each attempt
  function doesMapLoop(map: string[][], x: number, y: number, obX: number, obY: number) {
    const seen = new Set<string>();
    let dir = 0;
    while (x >= 0 && x < map[0].length && y >= 0 && y < map.length) {
      const key = `${x},${y},${dir}`;
      if (!seen.has(key)) {
        seen.add(key);
      } else {
        return true;
      }

      while (true) {
        const newY = y + dirs[dir][1];
        const newX = x + dirs[dir][0];
        const mapSpot = newX == obX && newY == obY ? '#' : map[newY]?.[newX] || '.';
        if (mapSpot === '#') {
          dir++;
          dir %= 4;
        } else {
          break;
        }
      }

      x += dirs[dir][0];
      y += dirs[dir][1];
    }

    // console.log([...seen].length);
    return false;
  }

  let [x, y] = findGuard(map);
  map[y][x] = '.';
  const obstructions = getObstructionCandidateLocations(map, x, y);
  /// TODO: figure out why Next is loading this page 11 times
  // const numLoops = obstructions.reduce((a, [obX, obY]) => a + (doesMapLoop(map, x, y, obX, obY) ? 1 : 0), 0);

  return (
    <>
      {/* <JsonList>{obstructions}</JsonList> */}
      {/* <Json>{[x, y]}</Json>
      <JsonList>{map}</JsonList> */}
      {/* <Json>{numLoops}</Json> */}
    </>
  );
}
