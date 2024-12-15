import Json, { JsonList } from '../json';
import { tail, take, takeRight, takeRightWhile, takeWhile, zip } from 'lodash';

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
  const parsed = input.split('\r\n').map((i) => i.split(/\s/).filter(Boolean).map(Number));
  return (
    <>
      <Json>{'a'}</Json>
      <JsonList>{parsed}</JsonList>
    </>
  );
}
