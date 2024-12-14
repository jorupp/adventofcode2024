import Json, { JsonList } from '../json';
import { tail, take, takeRight, zip } from 'lodash';

export function Part1({ input }: { input: string }) {
  const map = input.split('\r\n').map((i) => i.split(''));
  const antennas: Record<string, [number, number][]> = {};
  map.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === '.') return;
      if (!antennas[cell]) antennas[cell] = [];
      antennas[cell].push([x, y]);
    });
  });
  const maxX = map[0].length - 1;
  const maxY = map.length - 1;
  const antiNodes = new Set<string>();
  function addAntiNode(x: number, y: number) {
    if (x < 0 || y < 0 || x > maxX || y > maxY) return;
    antiNodes.add(`${x},${y}`);
  }
  for (const [antenna, coords] of Object.entries(antennas)) {
    for (const [x1, y1] of coords) {
      for (const [x2, y2] of coords) {
        if (x1 === x2 && y1 === y2) continue;
        const dX = x2 - x1;
        const dY = y2 - y1;
        // TODO: can there not be an antinode _between_ two antennas?
        addAntiNode(x1 - dX, y1 - dY);
        addAntiNode(x2 + dX, y2 + dY);
      }
    }
  }

  return (
    <>
      <Json>{antiNodes.size}</Json>
    </>
  );
}
export function Part2({ input }: { input: string }) {
  const map = input.split('\r\n').map((i) => i.split(''));
  const antennas: Record<string, [number, number][]> = {};
  map.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === '.') return;
      if (!antennas[cell]) antennas[cell] = [];
      antennas[cell].push([x, y]);
    });
  });
  const maxX = map[0].length - 1;
  const maxY = map.length - 1;
  const antiNodes = new Set<string>();
  for (const [antenna, coords] of Object.entries(antennas)) {
    function addAntiNode(x: number, y: number): boolean {
      if (x < 0 || y < 0 || x > maxX || y > maxY) return false;
      // console.log({ antenna, x, y });
      antiNodes.add(`${x},${y}`);
      return true;
    }
    // console.log('checking', antenna, coords);
    for (const [x1, y1] of coords) {
      for (const [x2, y2] of coords) {
        if (x1 === x2 && y1 === y2) continue;
        let dX = x2 - x1;
        let dY = y2 - y1;
        // console.log({ x1, y1, x2, y2, dX, dY });
        for (let i = 2; i < Math.min(dX, dY); i++) {
          // console.log({ i });
          if (dX % i === 0 && dY % i === 0) {
            dX /= i;
            dY /= i;
            // try this factor again
            // TODO: ug, had this in the wrong spot - need to figure out how to deal with infinite loops quicker with next
            i--;
          }
        }
        // console.log({ dX, dY });
        let x = x1;
        let y = y1;
        while (addAntiNode(x, y)) {
          x += dX;
          y += dY;
        }
        x = x1;
        y = y1;
        while (addAntiNode(x, y)) {
          x -= dX;
          y -= dY;
        }
      }
    }
  }

  return (
    <>
      <Json>{antiNodes.size}</Json>
    </>
  );
}
