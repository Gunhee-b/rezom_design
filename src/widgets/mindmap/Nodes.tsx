import React, { memo } from 'react';
import { motion } from 'framer-motion';
import type { Node } from './types';
import { TOKENS } from '@/shared/theme/tokens';
import { MindNode } from '@/molecules/MindNode';
import { Logo } from '@/atoms/Logo';
import { resolveLink } from '@/shared/schema/rules';

type Props = {
  nodes: Node[];
  map: (p: { x: number; y: number }) => { x: number; y: number }; // % → px
};

export const Nodes = memo(function Nodes({ nodes, map }: Props) {
  return (
    <>
      {nodes.map((n) => {
        const p = map({ x: n.x, y: n.y });

        const content =
          n.kind === 'logo' ? (
            <Logo as="svg" roleAttr="logo-text" />
          ) : n.kind === 'label' ? (
            <text
              textAnchor="middle"
              style={{
                fontSize: (n as any).fontSize ?? TOKENS.node.label.size,
                fontWeight: (n as any).fontWeight ?? TOKENS.node.label.weight,
                fill: TOKENS.colors.ink,
              }}
            >
              {(n.label ?? '').split('\n').map((ln, i) => (
                <tspan key={i} x={0} dy={i === 0 ? 0 : TOKENS.node.label.lineHeight}>
                  {ln}
                </tspan>
              ))}
            </text>
          ) : (
            <MindNode r={TOKENS.node.radius[n.size ?? 'md']} label={n.label} />
          );

        const inner = (
          <motion.g
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            <g transform={`translate(${p.x}, ${p.y})`}>{content}</g>
          </motion.g>
        );

        return (
          <g key={n.id} data-node-id={n.id}>
            {n.to && !n.disabled ? (
              <a href={resolveLink(n.to)} aria-label={n.ariaLabel || n.label}>
                {inner}
              </a>
            ) : (
              inner
            )}
          </g>
        );
      })}
    </>
  );
});