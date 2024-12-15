import input from './input.txt';
import example1 from './example1.txt';
import { Part1, Part2 } from './component';

export default async function () {
  return (
    <>
      {/* <h3>Example</h3>
      <Part1 {...{ input: example1 }} />
      <h3>Part 1</h3>
      <Part1 {...{ input }} /> */}
      <h3>Part 2 example</h3>
      <Part2 {...{ input: example1 }} />
      <h3>Part 2</h3>
      <Part2 {...{ input }} />
    </>
  );
}
