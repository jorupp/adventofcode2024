import { readFile } from "fs/promises";
import { Part1, Part2 } from "./component";

export default async function () {
  const input = await readFile("input.txt", "utf8");

  return (
    <>
      <Part1 {...{ input }} />
      {/* <Part2 {...{input}} /> */}
    </>
  );
}
