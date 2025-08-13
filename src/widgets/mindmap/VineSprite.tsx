import React from 'react';

export type Pt = { x: number; y: number };

type Props = {
  a: Pt;               // 시작점 (각도 계산용)
  b: Pt;               // 끝점 (덩굴 이미지가 붙을 위치)
  scale?: number;      // 크기 배율
  bow?: number;        // 회전 보정 각도(도)
  mirror?: boolean;    // 좌우 반전
  rotate?: number;     // 추가 회전(도)
  /** 이미지 내부에서 b에 붙일 기준점(정규화 좌표, 0~1). 기본 하단 중앙 */
  anchor?: { x: number; y: number };

  /** 화면 좌표에서의 미세 이동(px) */
  dx?: number;
  dy?: number;
};

export function VineSprite({
  a, b,
  scale = 1,
  bow = 0,
  mirror = false,
  rotate = 0,
  anchor = { x: 0.5, y: 1 },
  dx = 0,
  dy = 0,
}: Props) {
  const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;

  // 프로젝트에 맞게 조절 가능한 기본 에셋 크기
  const VW = 80;
  const VH = 300;

  const w = VW * scale * (mirror ? -1 : 1);
  const h = VH * scale;

  // 기준점 b를 화면 좌표계에서 미세 이동
  const tx = b.x + dx;
  const ty = b.y + dy;

  const totalRot = ang + bow + rotate;

  // anchor 기준 내부 이동량
  const ax = -(w * anchor.x);
  const ay = -(h * anchor.y);

  return (
    <g
      data-sprite="vine"
      transform={`translate(${tx}, ${ty}) rotate(${totalRot}) translate(${ax}, ${ay})`}
      style={{ pointerEvents: 'none' }}
    >
      <image
        href="/vine.svg"
        width={Math.abs(w)}
        height={h}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
}

export default VineSprite;
