import Json, { JsonList } from '../json';
import { range, reverse, tail, take, takeRight, zip } from 'lodash';

function createDrive(parsed: number[]) {
  const size = parsed.reduce((acc, curr) => acc + curr, 0);
  const drive = Array.from({ length: size }, () => -1);
  let ix = 0;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < parsed[i]; j++) {
      drive[ix] = i / 2;
      ix++;
    }
    i++;
    if (i === size) {
      break;
    }
    for (let j = 0; j < parsed[i]; j++) {
      drive[ix] = -1;
      ix++;
    }
  }
  return drive;
}

interface Space {
  start: number;
  size: number;
}
interface Used extends Space {
  fileId: number;
}

function createDrive2(parsed: number[]) {
  const used: Used[] = [];
  const free: Space[] = [];
  let ix = 0;
  for (let i = 0; i < parsed.length; i++) {
    used.push({ fileId: i / 2, start: ix, size: parsed[i] });
    ix += parsed[i];
    i++;
    if (i === parsed.length) {
      break;
    }
    free.push({ start: ix, size: parsed[i] });
    ix += parsed[i];
  }
  return { used: reverse(used), free };
}

export function Part1({ input }: { input: string }) {
  const parsed = input.split('').map(Number);

  const drive = createDrive(parsed);
  let ix = 0;
  let rix = drive.length - 1;
  while (ix <= rix) {
    // copy one block
    if (drive[ix] === -1) {
      drive[ix] = drive[rix];
      drive[rix] = -1;
      ix++;
      rix--;
    }
    // skip occupied blocks from start
    while (drive[ix] !== -1) {
      ix++;
    }
    // skip empty blocks from end
    while (drive[rix] === -1) {
      rix--;
    }
  }
  const checksum = drive.map((i, ix) => (i >= 0 ? i * ix : 0)).reduce((acc, curr) => acc + curr, 0);

  return (
    <>
      <Json>{checksum}</Json>
      {/* <Json>{parsed}</Json>
      <Json>{drive}</Json> */}
      {/* <JsonList>{parsed}</JsonList> */}
    </>
  );
}
export function Part2({ input }: { input: string }) {
  const parsed = input.split('').map(Number);
  // used is in order from back to front, free is in order front to back
  const { used, free } = createDrive2(parsed);
  for (const file of used) {
    const freeSpot = free.find((i) => i.size >= file.size && i.start <= file.start);
    if (freeSpot) {
      file.start = freeSpot.start;
      freeSpot.start += file.size;
      freeSpot.size -= file.size;
    }
  }

  const checksum = used
    .flatMap((i) => range(0, i.size).map((ix) => i.fileId * (ix + i.start)))
    .reduce((acc, curr) => acc + curr, 0);

  return (
    <>
      <Json>{checksum}</Json>
      {/* <Json>{parsed}</Json>
      <Json>{drive}</Json> */}
      {/* <JsonList>{parsed}</JsonList> */}
    </>
  );
}
