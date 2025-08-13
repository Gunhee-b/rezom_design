import React, { memo, useMemo } from 'react';
import type { ViewSchema } from './types';
import { Edges } from './Edges';
import { Nodes } from './Nodes';
import { mapPercentToPx, Pt } from '@/shared/lib/geo';
import { VineSprite } from './VineSprite';

type Props = {
  schema: ViewSchema;
  interactive?: boolean;
  onNodeMount?: (id: string, el: Element | null) => void;
};

const W = 1000;
const H = 700;

export const MindmapCanvas = memo(function MindmapCanvas({ schema, onNodeMount }: Props) {
  const map = (p: { x: number; y: number }) => ({
    x: mapPercentToPx(p.x, W),
    y: mapPercentToPx(p.y, H),
  });

  const { getOpt, hasId } = useMemo(() => {
    const idx = new Map<string, Pt>();
    for (const n of schema.nodes) idx.set(n.id, map({ x: n.x, y: n.y }));
    return {
      getOpt: (id: string): Pt | undefined => idx.get(id),
      hasId: (id: string) => idx.has(id),
    };
  }, [schema.nodes]);

  return (
    <div className="relative w-full h-[80vh]">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 w-full h-full"
        data-canvas-root
        aria-label={schema.background ?? 'mindmap'}
      >
        {/* 1) edges */}
        <Edges edges={schema.edges} getOpt={getOpt} hasId={hasId} />

        {/* 2) sprites (vine 등) - edges 위, nodes 아래 */}
        {schema.sprites?.map((s) => {
          if (s.type !== 'vine') return null;
          const a = getOpt(s.from);
          const b = getOpt(s.to);
          if (!a || !b) return null;
          return (
            <VineSprite
              key={s.id}
              a={a}
              b={b}
              scale={s.scale}
              dx={s.dx}
              dy={s.dy}
              rotate={s.rotate}
            />
          );
        })}

        {/* 3) nodes */}
        <Nodes nodes={schema.nodes} map={map} onNodeMount={onNodeMount} />
      </svg>
    </div>
  );
});
