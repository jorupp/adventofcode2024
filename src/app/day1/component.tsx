export function Part1({ input }: { input: string }) {
  const parsed = input.split('\n').map((i) => i.split(/\s/).filter(Boolean).map(Number));
  const list1 = parsed.map((i) => i[0]).sort();
  const list2 = parsed.map((i) => i[1]).sort();
  const distances = list1.map((i, idx) => Math.abs(i - list2[idx]));
  const sum = distances.reduce((acc, curr) => acc + curr, 0);
  return <div>{sum}</div>;
}

export function Part2({ input }: { input: string }) {
  const parsed = input.split('\n').map((i) => i.split(/\s/).filter(Boolean).map(Number));
  const list1 = parsed.map((i) => i[0]).sort();
  const list2 = parsed.map((i) => i[1]).sort();
  const freqs = list2.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  const values = list1.map((i) => i * freqs[i] || 0);
  const sum = values.reduce((acc, curr) => acc + curr, 0);
  return <div>{sum}</div>;
}
