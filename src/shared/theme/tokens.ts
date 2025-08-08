// src/shared/theme/tokens.ts
export const TOKENS = {
  colors: {
    ink: '#111',
    gray: '#9E9E9E',
    white: '#fff',
    green: '#1B5E20',
    brown: '#5D4037',
  },
  node: {
    radius: { sm: 70, md: 95, lg: 120 },
    strokeWidth: 3,
    label: { size: 18, lineHeight: 22, weight: 600 },
  },
  // ✅ Edge 스타일 맵 추가
  edge: {
    map: {
      green:  { stroke: '#1B5E20', width: 8 },
      brown:  { stroke: '#5D4037', width: 8 },
      thin:   { stroke: '#9E9E9E', width: 2 },
      default:{ stroke: '#9E9E9E', width: 2 },
    },
  },
  // ✅ 기본 곡률 추가
  curve: { k: 0.18 },
  typography: { logo: { size: 56, weight: 800 } },
  animation: { vineDraw: 0.9 },
  viewBox: { w: 1000, h: 700 },
} as const; 

export type EdgeStyle = keyof typeof TOKENS.edge.map; // 'green' | 'brown' | 'thin' | 'default'