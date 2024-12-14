import Json, { JsonList } from '../json';
import { tail, take, takeRight, zip } from 'lodash';

type Operators = Record<string, (a: number, b: number) => number>;
// const operators: Record<string, (a: number, b: number) => number> = {
//   '+': (a, b) => a + b,
//   '*': (a, b) => a * b,
// };

// kinda surprised this just worked for both.  Maybe this was easier than I thought, or starting from the end gave better early-abort scenarios?
function findEquation(inverseOperators: Operators, values: number[], result: number) {
  // console.log({ values, result });
  if (values.length === 1) {
    return values[0] === result ? true : false;
  }
  const last = values[values.length - 1];
  const rest = take(values, values.length - 1);
  for (const operator in inverseOperators) {
    const newResult = inverseOperators[operator](result, last);
    if (newResult < 0 || Math.floor(newResult) !== newResult) {
      // this result can't be valid
      // console.log('invalid result', {
      //   operator,
      //   result,
      //   last,
      //   newResult,
      // });
      continue;
    }
    if (findEquation(inverseOperators, rest, newResult)) {
      return true;
    }
  }
  // console.log('no valid equation found', { values, result, last, rest });
  return false;
}

export function Part1({ input }: { input: string }) {
  // work the equation from right to left with inverse operators
  const inverseOperators: Record<string, (a: number, b: number) => number> = {
    '+': (a, b) => a - b,
    '*': (a, b) => a / b,
  };
  const parsed = input.split('\r\n').map((i) => {
    const [left, rest] = i.split(/: /);
    return {
      result: parseInt(left),
      values: rest.split(' ').map(Number),
    };
  });

  const found = parsed.filter((i) => findEquation(inverseOperators, i.values, i.result));
  const sum = found.reduce((acc, curr) => acc + curr.result, 0);

  return <Json>{sum}</Json>;
}
export function Part2({ input }: { input: string }) {
  // work the equation from right to left with inverse operators
  const inverseOperators: Record<string, (a: number, b: number) => number> = {
    '+': (a, b) => a - b,
    '*': (a, b) => a / b,
    '||': (a, b) =>
      a.toString().endsWith(b.toString())
        ? parseInt(a.toString().substring(0, a.toString().length - b.toString().length), 10)
        : 0.01, // return a decimal to indicate it's invalid
  };
  const parsed = input.split('\r\n').map((i) => {
    const [left, rest] = i.split(/: /);
    return {
      result: parseInt(left),
      values: rest.split(' ').map(Number),
    };
  });

  const found = parsed.filter((i) => findEquation(inverseOperators, i.values, i.result));
  const sum = found.reduce((acc, curr) => acc + curr.result, 0);

  return (
    <>
      <JsonList>{found}</JsonList>
      <Json>{sum}</Json>
    </>
  );
}
