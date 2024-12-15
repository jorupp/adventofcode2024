import input from './input.txt';
import example1 from './example1.txt';
import example2 from './example2.txt';
import example3 from './example3.txt';
import example4 from './example4.txt';
import example5 from './example5.txt';
import { Part1, Part2 } from './component';

export default async function () {
  return (
    <>
      {/* <h3>Example 1</h3>
      <Part1 {...{ input: example1 }} />
      <h3>Example 2</h3>
      <Part1 {...{ input: example2 }} />
      <h3>Example 3</h3>
      <Part1 {...{ input: example3 }} />
      <h3>Part 1</h3>
      <Part1 {...{ input }} /> */}
      {/* <h3>Example 1</h3>
      <Part2 {...{ input: example1 }} />
      <h3>Example 2</h3>
      <Part2 {...{ input: example2 }} />
      <h3>Example 4</h3>
      <Part2 {...{ input: example4 }} />
      <h3>Example 5</h3>
      <Part2 {...{ input: example5 }} /> */}
      <h3>Example 3</h3>
      <Part2 {...{ input: example3 }} />
      <h3>Part 2</h3>
      <Part2 {...{ input }} />
    </>
  );
}
