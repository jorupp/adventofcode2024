import input from './input.txt';
import example1 from './example1.txt';
import example2 from './example2.txt';
import { Part1, Part2 } from './component';

export default async function () {
  return (
    <>
      <h3>Example (1)</h3>
      <Part1 {...{ input: example1 }} count={1} />
      <h3>Example 2 (6)</h3>
      <Part1 {...{ input: example2 }} count={6} />
      <h3>Example 2 (25)</h3>
      <Part1 {...{ input: example2 }} count={25} />
      <h3>Part 1</h3>
      <Part1 {...{ input }} count={25} />
      <h3>Part 2</h3>
      <Part1 {...{ input }} count={75} />
    </>
  );
}
