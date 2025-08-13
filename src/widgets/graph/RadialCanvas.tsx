import { motion } from 'framer-motion'
import { useMemo } from 'react'
import type { NodeSpec, EdgeSpec } from '@/data/homeSchema'

type Props = {
  nodes: NodeSpec[]
  edges: EdgeSpec[]
  width?: number
  height?: number
  center?: { x: number; y: number }
}

export default function RadialCanvas({
  nodes, edges,
  width = 1200, height = 800,
  center = { x: 600, y: 420 }, // 약간 아래로 내려 균형 맞춤
}: Props) {
  const pos = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>()
    nodes.forEach(n => m.set(n.id, {
      x: center.x + n.r * Math.cos(n.angle),
      y: center.y + n.r * Math.sin(n.angle),
    }))
    return m
  }, [nodes, center])

  const curve = (a:{x:number;y:number}, b:{x:number;y:number}, organic=false) => {
    const mx = (a.x + b.x)/2
    const my = (a.y + b.y)/2
    const dx = b.x - a.x, dy = b.y - a.y
    const n = Math.hypot(dx, dy) || 1
    const off = organic ? Math.min(80, n*0.18) : n*0.12
    const nx = -dy / n, ny = dx / n
    const c1x = (a.x + mx)/2 + nx*off, c1y = (a.y + my)/2 + ny*off
    const c2x = (b.x + mx)/2 - nx*off, c2y = (b.y + my)/2 - ny*off
    return `M ${a.x} ${a.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${b.x} ${b.y}`
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {/* edges */}
      {edges.map((e, i) => {
        const a = pos.get(e.from), b = pos.get(e.to)
        if (!a || !b) return null
        const isVine = e.style === 'vine'
        const d = curve(a, b, isVine)
        return (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke="currentColor"
            className={isVine ? 'text-green-600' : 'text-neutral-400/70'}
            strokeWidth={isVine ? 4 : 2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, delay: i*0.05 }}
          />
        )
      })}

      {/* nodes */}
      {nodes.map(n => {
        const p = pos.get(n.id)!
        return (
          <g key={n.id} transform={`translate(${p.x}, ${p.y})`}>
            <motion.ellipse
              rx={92} ry={54}
              className="fill-white/80 stroke-neutral-400"
              strokeWidth={2}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
            />
            <text
              y={6}
              textAnchor="middle"
              className="font-title text-[18px] fill-black"
            >
              {n.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
