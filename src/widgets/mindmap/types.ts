// src/widgets/mindmap/types.ts

export type Percent = number; // 0~100
export type Point = { x: Percent; y: Percent };

// ─ Nodes
export interface NodeBase extends Point {
  id: string;
  to?: string;
  ariaLabel?: string;
  disabled?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

// ellipse: kind 생략 가능, oval 별칭도 허용
export interface EllipseNode extends NodeBase {
  kind?: 'ellipse' | 'oval';
}

// 중앙 로고
export interface LogoNode extends NodeBase {
  kind: 'logo';
}

// 텍스트 전용 라벨
export interface LabelNode extends NodeBase {
  kind: 'label';
  label: string;
  fontSize?: number;
  fontWeight?: number;
}

// 위치 기준용(표시 X)
export interface AnchorNode extends NodeBase {
  kind: 'anchor';
}

export type Node = EllipseNode | LogoNode | LabelNode | AnchorNode;

// ─ Edges
export type EdgeStyle = 'thin' | 'thick' | 'green' | 'brown' | 'default';

export interface Edge {
  id: string;
  from: string;
  to: string;
  style: EdgeStyle;
  curvature?: number;
}

// ─ Sprites (vine)
export type SpriteDecl =
  | {
      id: string;
      type: 'vine';
      from: string;
      to: string;
      // 옵션(있어도 되고 없어도 됨): 위치/크기 미세조정
      scale?: number;   // 기본 1
      dx?: number;      // px
      dy?: number;      // px
      rotate?: number;  // deg
    };

// ─ View
export interface ViewSchema {
  background?: 'paperGloss' | string;
  nodes: Node[];
  edges: Edge[];
  sprites?: SpriteDecl[];
}
