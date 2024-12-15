import Iter, { IterStrings } from '../iter';
import Json, { JsonList } from '../json';
import { tail, take, takeRight, takeRightWhile, takeWhile, uniqBy, zip } from 'lodash';

const dirs: Record<string, [number, number]> = {
  '^': [0, -1],
  v: [0, 1],
  '>': [1, 0],
  '<': [-1, 0],
};

export function Part1({ input }: { input: string }) {
  const parsed = input.split('\r\n');
  const map = takeWhile(parsed, (i) => i !== '').map((i) => i.split(''));
  const moves = takeRightWhile(parsed, (i) => i !== '').flatMap((i) => i.split(''));

  function findRobot(map: string[][]): [number, number] {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === '@') {
          // map[y][x] = '.';
          return [x, y];
        }
      }
    }
    throw new Error('Robot not found');
  }

  function processMove(map: string[][], pos: [number, number], move: [number, number]): [boolean, number, number] {
    const [dx, dy] = move;
    const [x, y] = pos;
    const [nx, ny] = [x + dx, y + dy];
    if (map[ny][nx] === '#') {
      return [false, x, y];
    }
    if (map[ny][nx] === '.') {
      map[ny][nx] = map[y][x];
      map[y][x] = '.';
      return [true, nx, ny];
    }
    const result = processMove(map, [nx, ny], move);
    if (result[0]) {
      map[ny][nx] = map[y][x];
      map[y][x] = '.';
      return [true, nx, ny];
    }
    return [false, x, y];
  }

  const maps: string[] = [];
  let robot = findRobot(map);
  for (const move of moves) {
    const result = processMove(map, robot, dirs[move]);
    if (result[0]) {
      robot = [result[1], result[2]];
    }
    // maps.push(map.map((i) => i.join('')).join('\n'));
  }

  let gps = 0;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 'O') {
        gps += y * 100 + x;
      }
    }
  }

  return (
    <>
      <Json>{gps}</Json>
      {/* <JsonList>{map}</JsonList>
      {maps.map((i) => (
        <pre>
          <code>{i}</code>
        </pre>
      ))} */}
    </>
  );
}
export function Part2({ input }: { input: string }) {
  const parsed = input
    .replaceAll('#', '##')
    .replaceAll('O', '[]')
    .replaceAll('.', '..')
    .replaceAll('@', '@.')
    .split('\r\n');
  const map = takeWhile(parsed, (i) => i !== '').map((i) => i.split(''));
  const moves = takeRightWhile(parsed, (i) => i !== '').flatMap((i) => i.split(''));

  function findRobot(map: string[][]): [number, number] {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === '@') {
          // map[y][x] = '.';
          return [x, y];
        }
      }
    }
    throw new Error('Robot not found');
  }

  function canMove(map: string[][], pos: [number, number], move: [number, number]): [number, number][] | undefined {
    // figure out if we can move - if so, return the top-left coordinate of boxes to be moved - if we can't move, return undefined
    if (move[1] === 0) throw new Error('this algorithm only works for vertical moves');
    const [, dy] = move;
    const [x, y] = pos;
    const boxes: [number, number][] = [];
    let ny = y + dy;
    if (map[ny][x] === '.') {
      // we can move, but there's no boxes impacted
      return [];
    }
    if (map[ny][x] === '#') {
      // we can't move
      return undefined;
    }
    const dependencies: [number, number][] =
      map[ny][x] === '['
        ? [
            [x, ny],
            [x + 1, ny],
          ]
        : [
            [x - 1, ny],
            [x, ny],
          ];
    const results = dependencies.map((i) => canMove(map, i, move));
    if (results.some((i) => i === undefined)) {
      // one of the dependencies can't move, so we can't move
      return undefined;
    }
    // ok, both can move, so let's build up the list, adding the left side of the box we pushed to the end
    // TODO: maybe collapse to unique here?
    return [...(results.flat() as [number, number][]), map[ny][x] === '[' ? [x, ny] : [x - 1, ny]];
  }

  function processMove(map: string[][], pos: [number, number], move: [number, number]): [boolean, number, number] {
    // if this is a left/right move, we can use the simple algorithm we used before
    if (move[1] === 0) {
      const [dx, dy] = move;
      const [x, y] = pos;
      const [nx, ny] = [x + dx, y + dy];
      if (map[ny][nx] === '#') {
        return [false, x, y];
      }
      if (map[ny][nx] === '.') {
        map[ny][nx] = map[y][x];
        map[y][x] = '.';
        return [true, nx, ny];
      }
      const result = processMove(map, [nx, ny], move);
      if (result[0]) {
        map[ny][nx] = map[y][x];
        map[y][x] = '.';
        return [true, nx, ny];
      }
      return [false, x, y];
    }

    // otherwise, we need a more complex algorithm to track the series of lines of adjacent boxes that will move too
    {
      const result = canMove(map, pos, move);
      if (result === undefined) {
        return [false, pos[0], pos[1]];
      }
      // ok, we can move, now we have to actually do it
      const [, dy] = move;
      const boxes = uniqBy(result, (i) => i.join(','));
      // _assuming_ uniqBy preserves order, so we can just move them in order
      for (const box of boxes) {
        const [x, y] = box;
        map[y + dy][x] = map[y][x];
        map[y + dy][x + 1] = map[y][x + 1];
        map[y][x] = '.';
        map[y][x + 1] = '.';
      }
      // now move the robot
      {
        const [x, y] = pos;
        map[y + dy][x] = map[y][x];
        map[y][x] = '.';
        return [true, x, y + dy];
      }
    }
  }

  // function processMove(map: string[][], pos: [number, number], move: [number, number]): [boolean, number, number] {
  //   const [dx, dy] = move;
  //   const [x, y] = pos;
  //   const [nx, ny] = [x + dx, y + dy];
  //   if (map[ny][nx] === '#') {
  //     return [false, x, y];
  //   }
  //   if (map[ny][nx] === '.') {
  //     map[ny][nx] = map[y][x];
  //     map[y][x] = '.';
  //     return [true, nx, ny];
  //   }
  //   const result = processMove(map, [nx, ny], move);
  //   if (result[0]) {
  //     map[ny][nx] = map[y][x];
  //     map[y][x] = '.';
  //     return [true, nx, ny];
  //   }
  //   return [false, x, y];
  // }

  const maps: string[] = [];
  let robot = findRobot(map);
  for (const move of moves) {
    const result = processMove(map, robot, dirs[move]);
    if (result[0]) {
      robot = [result[1], result[2]];
    }
    // maps.push(map.map((i) => i.join('')).join('\n'));
  }

  let gps = 0;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === '[') {
        gps += y * 100 + x;
      }
    }
  }

  return (
    <>
      <Json>{gps}</Json>
      {/* <IterStrings>{maps}</IterStrings> */}
      {/* <Json>{robot}</Json>
      <JsonList>{map}</JsonList>
      <Json>{moves}</Json> */}
    </>
  );
}
