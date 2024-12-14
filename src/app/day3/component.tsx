import Json, { JsonList } from '../json';
import { tail, take, takeRight, zip } from 'lodash';

export function Part1({ input }: { input: string }) {
  const re = /mul\((\d+),(\d+)\)/g;
  const parsed = input.matchAll(re);
  const data = [...parsed].map((i) => parseInt(i[1], 10) * parseInt(i[2], 10));
  const sum = data.reduce((acc, curr) => acc + curr, 0);
  return <Json>{sum}</Json>;
}
export function Part2({ input }: { input: string }) {
  const re = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g;
  const parsed = [...input.matchAll(re)].map((i) => [...i].map((ii) => ii?.toString()));
  // return <JsonList>{parsed}</JsonList>;

  let enabled = true;
  let sum = 0;
  for (const p of parsed) {
    if (p[0] === 'do()') {
      enabled = true;
    } else if (p[0] === "don't()") {
      enabled = false;
    } else if (enabled) {
      sum += parseInt(p[1], 10) * parseInt(p[2], 10);
    }
  }
  return <Json>{sum}</Json>;
}
