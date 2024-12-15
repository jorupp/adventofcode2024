export function parseData(input: string) {
  const re = /p=(\d+),(\d+) v=([-0-9]+),([-0-9]+)/g;
  const parsed = input.matchAll(re);
  const data = [...parsed].map((i) => ({
    p: { x: parseInt(i[1], 10), y: parseInt(i[2], 10) },
    v: { x: parseInt(i[3], 10), y: parseInt(i[4], 10) },
  }));

  return data;
}
export type Data = ReturnType<typeof parseData>[0];
export function evaluateLocations(data: Data[], width: number, height: number, duration: number) {
  // double-% to avoid negative numbers
  return data.map((i) => ({
    x: (width + ((i.p.x + i.v.x * duration) % width)) % width,
    y: (height + ((i.p.y + i.v.y * duration) % height)) % height,
  }));
}
