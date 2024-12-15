import Json, { JsonList } from '../json';
import { tail, take, takeRight, zip } from 'lodash';
import { evaluateLocations, parseData } from './shared';
import UI from './ui';

export function Part1({
  input,
  height,
  width,
  duration,
}: {
  input: string;
  height: number;
  width: number;
  duration: number;
}) {
  const data = parseData(input);
  const finalLocations = evaluateLocations(data, width, height, duration);

  let q1 = 0;
  let q2 = 0;
  let q3 = 0;
  let q4 = 0;
  // yes, we ignore the actual "middle" (shrug)
  const hMid = Math.floor(width / 2);
  const vMid = Math.floor(height / 2);
  for (const l of finalLocations) {
    if (l.x < hMid && l.y < vMid) {
      q1++;
    } else if (l.x > hMid && l.y < vMid) {
      q2++;
    } else if (l.x < hMid && l.y > vMid) {
      q3++;
    } else if (l.x > hMid && l.y > vMid) {
      q4++;
    }
  }

  return (
    <>
      {/* <Json>{{ height, width, duration }}</Json> */}
      {/* <JsonList>{data}</JsonList> */}
      {/* <JsonList>{finalLocations}</JsonList> */}
      {/* <Json>{{ q1, q2, q3, q4 }}</Json> */}
      <Json>{q1 * q2 * q3 * q4}</Json>
    </>
  );
}

export function Part2({ input, height, width }: { input: string; height: number; width: number }) {
  const data = parseData(input);

  return <UI {...{ data, height, width }} />;
}
