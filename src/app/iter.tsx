'use client';

import { ReactNode, useState } from 'react';

export default function Iter<T>({ data, children }: { data: T[]; children: (i: T, idx: number) => ReactNode }) {
  const [index, setIndex] = useState(0);
  return (
    <>
      <p>{index}</p>

      <input
        type="range"
        min="0"
        max={data.length - 1}
        value={index}
        onChange={(e) => setIndex(Number(e.target.value))}
      />
      {children(data[index], index)}
    </>
  );
}

export function IterStrings({ children }: { children: string[] }) {
  return <Iter data={children}>{(i) => <pre>{i}</pre>}</Iter>;
}
