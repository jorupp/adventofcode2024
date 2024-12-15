import Json, { JsonList } from '../json';
import { tail, take, takeRight, zip } from 'lodash';

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const vDirections = [
  [0, 1],
  [0, -1],
];
const hDirections = [
  [1, 0],
  [-1, 0],
];

function getValue<V>(map: V[][], [x, y]: [number, number], fallback: V): V {
  return map[y]?.[x] ?? fallback;
}

function getRegions(map: string[][]) {
  // start out with region -1 for each cell
  const regions = map.map((row, y) => row.map((cell, x) => -1));
  let region = 0;

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (regions[y][x] !== -1) continue; // already filled in
      const value = map[y][x];
      regions[y][x] = region;

      function fillRegion(x: number, y: number) {
        for (const [dx, dy] of directions) {
          const [nx, ny] = [x + dx, y + dy];
          if (getValue(regions, [nx, ny], -1) !== -1) {
            continue;
          }
          if (getValue(map, [nx, ny], '.') !== value) {
            continue;
          }
          regions[ny][nx] = region;
          fillRegion(nx, ny);
        }
      }
      fillRegion(x, y);

      region++;
    }
  }
  return { maxRegion: region - 1, regions };
}

export function Part1({ input }: { input: string }) {
  const map = input.split('\r\n').map((i) => i.split('').filter(Boolean));
  const { maxRegion, regions } = getRegions(map);

  const regionInfo: { area: number; perimeter: number }[] = [];

  // we have all the regions, now we need to figure out the area and perimeter of each region
  for (let r = 0; r <= maxRegion; r++) {
    let area = 0;
    let perimeter = 0;

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (regions[y][x] !== r) continue; // not this region
        const value = map[y][x];
        area++;

        for (const [dx, dy] of directions) {
          const [nx, ny] = [x + dx, y + dy];
          if (getValue(map, [nx, ny], '.') !== value) {
            perimeter++;
          }
        }
      }
    }
    regionInfo.push({ area, perimeter });
  }

  const regionCosts = regionInfo.map(({ area, perimeter }) => area * perimeter);
  const totalCost = regionCosts.reduce((acc, curr) => acc + curr, 0);

  return (
    <>
      {/* <JsonList>{regions}</JsonList> */}
      {/* <JsonList>{regionInfo}</JsonList>
      <JsonList>{regionCosts}</JsonList> */}
      <Json>{totalCost}</Json>
    </>
  );
}
export function Part2({ input }: { input: string }) {
  const map = input.split('\r\n').map((i) => i.split('').filter(Boolean));
  const { maxRegion, regions } = getRegions(map);

  const regionInfo: { plant: string; area: number; perimeter: number }[] = [];

  // we have all the regions, now we need to figure out the area and perimeter of each region
  for (let r = 0; r <= maxRegion; r++) {
    let area = 0;
    let seenValue: string = '';
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (regions[y][x] !== r) continue; // not this region
        area++;
        seenValue = map[y][x];
      }
    }

    let perimeter = 0;
    // go over each vertical facing counting the number of changes from no-border to border
    for (let y = 0; y < map.length; y++) {
      for (const [dx, dy] of vDirections) {
        let last = false;
        for (let x = 0; x < map[y].length; x++) {
          if (regions[y][x] !== r) {
            // not this region
            last = false;
            continue;
          }
          const value = map[y][x];
          const [nx, ny] = [x + dx, y + dy];
          if (getValue(map, [nx, ny], '.') === value) {
            last = false;
          } else {
            if (!last) {
              perimeter++;
            }
            last = true;
          }
        }
      }
    }
    // now do the same for horizontal
    for (let x = 0; x < map[0].length; x++) {
      for (const [dx, dy] of hDirections) {
        let last = false;
        for (let y = 0; y < map.length; y++) {
          if (regions[y][x] !== r) {
            // not this region
            last = false;
            continue;
          }
          const value = map[y][x];
          const [nx, ny] = [x + dx, y + dy];
          if (getValue(map, [nx, ny], '.') === value) {
            last = false;
          } else {
            if (!last) {
              perimeter++;
            }
            last = true;
          }
        }
      }
    }

    regionInfo.push({ plant: seenValue, area, perimeter });
  }

  const regionCosts = regionInfo.map(({ area, perimeter }) => area * perimeter);
  const totalCost = regionCosts.reduce((acc, curr) => acc + curr, 0);
  return (
    <>
      {/* <JsonList>{regions}</JsonList>
      <JsonList>{regionInfo}</JsonList>
      <JsonList>{regionCosts}</JsonList> */}
      <Json>{totalCost}</Json>
    </>
  );
}
