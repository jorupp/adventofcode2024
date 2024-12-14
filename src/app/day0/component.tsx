import Json, { JsonList } from '../json';
import { tail, take, takeRight, zip } from 'lodash';

export function Part1({ input }: { input: string }) {
  const parsed = input.split('\n').map((i) => i.split(/\s/).filter(Boolean).map(Number));
  return <JsonList>{parsed}</JsonList>;
}
export function Part2({ input }: { input: string }) {
  const parsed = input.split('\n').map((i) => i.split(/\s/).filter(Boolean).map(Number));
  return <JsonList>{parsed}</JsonList>;
}
