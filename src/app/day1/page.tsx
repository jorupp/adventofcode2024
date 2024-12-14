import input from './input.txt';
import { Part1, Part2 } from './component';

export default async function () {
  return (
    <>
      <h3>Part 1</h3>
      <Part1 {...{ input }} />
      <h3>Part 2</h3>
      <Part2 {...{ input }} />
    </>
  );
}
