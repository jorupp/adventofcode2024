import Json, { JsonList } from '../json';
import { tail, take, takeRight, zip } from 'lodash';

export function Part1({ input }: { input: string }) {
  const parsed = input.split('\r\n');
  const rules = parsed
    .filter((i) => i.includes('|'))
    .map((i) => i.split('|'))
    .reduce((acc, curr) => {
      if (!acc[curr[0]]) acc[curr[0]] = {};
      acc[curr[0]][curr[1]] = true;
      return acc;
    }, {} as Record<string, Record<string, boolean>>);
  const updates = parsed.filter((i) => i.includes(',')).map((i) => i.split(','));

  function isValid(update: string[]) {
    const seen: string[] = [];
    for (const v of update) {
      const rule = rules[v];
      if (rule) {
        if (seen.some((i) => rule[i])) {
          return false;
        }
      }
      seen.push(v);
    }
    return true;
  }
  const validUpdates = updates.filter(isValid);
  const middles = validUpdates.map((i) => i[Math.floor(i.length / 2)]);
  const sum = middles.reduce((acc, curr) => acc + Number(curr), 0);

  return (
    <>
      {/* <Json>{middles}</Json> */}
      <Json>{sum}</Json>
      {/* <JsonList>{validUpdates}</JsonList> */}
    </>
  );
}
export function Part2({ input }: { input: string }) {
  const parsed = input.split('\r\n');
  const rules = parsed
    .filter((i) => i.includes('|'))
    .map((i) => i.split('|'))
    .reduce((acc, curr) => {
      if (!acc[curr[0]]) acc[curr[0]] = {};
      acc[curr[0]][curr[1]] = true;
      return acc;
    }, {} as Record<string, Record<string, boolean>>);
  const afterRules = parsed
    .filter((i) => i.includes('|'))
    .map((i) => i.split('|'))
    .reduce((acc, curr) => {
      if (!acc[curr[1]]) acc[curr[1]] = {};
      acc[curr[1]][curr[0]] = true;
      return acc;
    }, {} as Record<string, Record<string, boolean>>);
  const updates = parsed.filter((i) => i.includes(',')).map((i) => i.split(','));

  function isValid(update: string[]) {
    const seen: string[] = [];
    for (const v of update) {
      const rule = rules[v];
      if (rule) {
        if (seen.some((i) => rule[i])) {
          return false;
        }
      }
      seen.push(v);
    }
    return true;
  }
  function canAdd(remainingPages: string[], nextPage: string) {
    const rule = afterRules[nextPage];
    if (!rule) return true;
    return !remainingPages.some((i) => rule[i]);
  }

  function makeValid(update: string[]) {
    const added: string[] = [];
    const remaining: string[] = [...update];

    while (remaining.length) {
      for (let i = 0; i < remaining.length; i++) {
        const r = remaining[i];
        if (canAdd(remaining, r)) {
          added.push(r);
          remaining.splice(i, 1);
          i--;
        }
      }
    }

    return added;
  }

  const invalidUpdates = updates.filter((i) => !isValid(i));
  const nowValidUpdates = invalidUpdates.map(makeValid);
  const middles = nowValidUpdates.map((i) => i[Math.floor(i.length / 2)]);
  const sum = middles.reduce((acc, curr) => acc + Number(curr), 0);

  return (
    <>
      {/* <Json>{middles}</Json> */}
      <Json>{sum}</Json>
      {/* <JsonList>{validUpdates}</JsonList> */}
    </>
  );
}
