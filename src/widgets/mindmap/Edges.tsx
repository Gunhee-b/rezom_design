// src/widgets/mindmap/Edges.tsx
import React from 'react';
import type { Edge } from './types';
import { TOKENS } from '@/shared/theme/tokens';

type Props = {
  edges: Edge[];
  getOpt: (id: string) => { x: number; y: number } | undefined;
  hasId: (id: string) => boolean;
};

export function Edges({ edges, getOpt, hasId }: Props) {
  const S = TOKENS.edge;

  return (
    <g data-layer="edges">
      {edges.map((e) => {
        if (!hasId(e.from) || !hasId(e.to)) return null;
        const a = getOpt(e.from)!;
        const b = getOpt(e.to)!;
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        const dx = b.y - a.y;
        const dy = a.x - b.x;
        const k = e.curvature ?? 0;
        const cx = mx + dx * k;
        const cy = my + dy * k;
        const d = `M ${a.x},${a.y} Q ${cx},${cy} ${b.x},${b.y}`;

        const style = (S as any)[e.style] ?? S.default;

        return (
          <path
            key={e.id}
            d={d}
            fill="none"
            stroke={style.color}
            strokeWidth={style.width}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </g>
  );
}
