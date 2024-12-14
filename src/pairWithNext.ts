import { tail, take, zip } from 'lodash';

export function pairWithNext<T>(input: T[]): [T, T][] {
  return zip(tail(input), take(input, input.length - 1)) as [T, T][];
}
