'use client';

import { useState } from 'react';
import Json, { JsonList } from '../json';
import { Data, evaluateLocations } from './shared';
import { range } from 'lodash';

export default function UI({ data, height, width }: { data: Data[]; height: number; width: number }) {
  const [duration, setDuration] = useState(0);
  const finalLocations = evaluateLocations(data, width, height, duration);
  const map = range(height).map((y) => range(width).map((x) => '.'));
  for (const l of finalLocations) {
    map[l.y][l.x] = '#';
  }
  // interesting durations:
  // 1802, 1803
  // 1904, 1905
  // 2005
  // 2106
  // 2207
  return (
    <div>
      <input
        type="range"
        min={1803}
        max={100000}
        step={101}
        value={duration}
        onChange={(e) => setDuration(parseInt(e.target.value, 10))}
      />
      <Json>{duration}</Json>
      <pre style={{ fontSize: '5px' }}>
        <code>{map.map((i) => i.join('')).join('\n')}</code>
      </pre>
    </div>
  );
}
