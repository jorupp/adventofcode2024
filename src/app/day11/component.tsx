import Json, { JsonList } from '../json';
import { tail, take, takeRight, zip } from 'lodash';

export function Part1({ input, count }: { input: string; count: number }) {
  const parsed = input.split(/\s/).filter(Boolean).map(Number);

  // observation - stones don't interact with each other - we can do a memoized recursive function
  const memo = new Map<string, number>();
  function getCountAfterBlinks(value: number, blinks: number): number {
    const key = `${value},${blinks}`;
    if (memo.has(key)) {
      return memo.get(key)!;
    }

    if (blinks === 0) {
      return 1; // one stone left
    }
    if (value === 0) {
      return getCountAfterBlinks(1, blinks - 1);
    }
    const strValue = value.toString();
    if (strValue.length % 2 === 0) {
      const newValue =
        getCountAfterBlinks(Number(strValue.substring(0, strValue.length / 2)), blinks - 1) +
        getCountAfterBlinks(Number(strValue.substring(strValue.length / 2)), blinks - 1);
      memo.set(key, newValue);
      return newValue;
    }
    {
      const newValue = getCountAfterBlinks(value * 2024, blinks - 1);
      memo.set(key, newValue);
      return newValue;
    }
  }

  const totalCount = parsed.map((i) => getCountAfterBlinks(i, count)).reduce((acc, curr) => acc + curr, 0);

  return (
    <>
      <Json>{totalCount}</Json>
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
