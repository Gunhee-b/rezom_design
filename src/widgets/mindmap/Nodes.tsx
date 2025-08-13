import type { Node } from "./types";
import { motion } from "framer-motion";
import { TOKENS } from "@/shared/theme/tokens";
import { useMemo } from "react";

export function Nodes({
  nodes,
  map,
  onNodeMount,
}: {
  nodes: Node[];
  map: (p: { x: number; y: number }) => { x: number; y: number };
  onNodeMount?: (id: string, el: Element | null) => void;
}) {
  // id별 ref 콜백을 메모이즈해 불필요한 ref 해제/재설정을 줄임
  const refHandlers = useMemo(() => {
    const m = new Map<string, (el: Element | null) => void>();
    nodes.forEach(n => {
      if ((n as any).kind === "anchor") return;
      m.set(n.id, (el) => onNodeMount?.(n.id, el));
    });
    return m;
  }, [nodes, onNodeMount]);

  return (
    <g data-layer="nodes">
      {nodes.map((n) => {
        if ((n as any).kind === "anchor") return null; // 위치 기준용은 렌더 X
        const p = map({ x: n.x, y: n.y });

        let content: JSX.Element;
        if (n.kind === "logo") {
          content = (
            <g>
              <text
                data-role="logo-text"
                textAnchor="middle"
                className="node-label"
                style={{ fontSize: TOKENS.typography.logo.size, fontWeight: 800, fill: "#111" }}
              >
                ReZom
              </text>
            </g>
          );
        } else if (n.kind === "label") {
          content = (
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              className="node-label"
              style={{
                fontSize: n.fontSize ?? TOKENS.node.label.size,
                fontWeight: n.fontWeight ?? 700,
                fill: "#111",
                whiteSpace: "pre-line",
              }}
            >
              {n.label}
            </text>
          );
        } else {
          const r =
            n.size === "lg" ? TOKENS.node.radius.lg :
            n.size === "sm" ? TOKENS.node.radius.sm :
            TOKENS.node.radius.md;

          content = (
            <g>
              <ellipse rx={r} ry={Math.round(r * 0.68)} fill="white" stroke="#9E9E9E" strokeWidth={3} />
              {n.label && (
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="node-label"
                  style={{ fontSize: 18, fontWeight: 700, fill: "#111", whiteSpace: "pre-line" }}
                >
                  {n.label}
                </text>
              )}
            </g>
          );
        }

        const inner = (
          <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }}>
            <g transform={`translate(${p.x}, ${p.y})`}>{content}</g>
          </motion.g>
        );

        const anchor = (n as any).to ? (
          <a href={(n as any).to} aria-label={(n as any).ariaLabel || (n as any).label}>
            {inner}
          </a>
        ) : (
          inner
        );

        return (
          <g
            key={n.id}
            data-node-id={n.id}
            ref={refHandlers.get(n.id) ?? undefined}
          >
            {anchor}
          </g>
        );
      })}
    </g>
  );
}
