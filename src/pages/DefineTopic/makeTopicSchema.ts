// src/pages/DefineTopic/makeTopicSchema.ts
import type { ViewSchema } from '@/widgets/mindmap/types';
import { TOKENS } from '@/shared/theme/tokens';

const enc = (s: string) => encodeURIComponent(s);

export function makeTopicSchema(topicLabel: string, question: string, others: string[]): ViewSchema {
  return {
    nodes: [
      // 좌상단: 토픽 키워드
      { id: 'topic', x: 16, y: 20, label: topicLabel, size: 'lg' , to: '/define'},

      // 우측 상단: Q + 질문(오벌 하나로 처리)
      { id: 'question', x: 76, y: 28, label: `"${question}"`, size: 'lg' },

      // 질문 위의 Q (label 노드)
      { id: 'q-label', kind: 'label', x: 76, y: 18, label: 'Q', fontSize: TOKENS.typography.logo.size, fontWeight: 800 },

      // Other’s 텍스트 라벨(ellipse X)
      { id: 'othersTitle', kind: 'label', x: 68, y: 56, label: "Other’s", fontSize: TOKENS.typography.logo.size * 0.6, fontWeight: 800 },

      // 하단 오른쪽: 다른 유저 키워드 3개
      { id: 'o1', x: 60, y: 78, label: `${others[0]}...`, size: 'sm' },
      { id: 'o2', x: 76, y: 74, label: `${others[1]}...`, size: 'sm' },
      { id: 'o3', x: 90, y: 80, label: `${others[2]}...`, size: 'sm' },

      // 좌하단: Write 버튼
      { id: 'write', x: 18, y: 80, label: 'Write', size: 'sm', to: `/write?q=${enc(question)}`},
    ],
    edges: [
      // 토픽에서 Q쪽으로 가는 얇은 곡선 (느낌선)
      { id: 'thin-1', from: 'topic', to: 'question', style: 'thin', curvature: 0.15 },

      // Write → Q : 초록 줄기
      { id: 'vine', from: 'write', to: 'question', style: 'green', curvature: -0.22 },

      // Other’s 묶음 가이드라인
      { id: 'thin-2', from: 'othersTitle', to: 'o1', style: 'thin', curvature: -0.10 },
      { id: 'thin-3', from: 'othersTitle', to: 'o2', style: 'thin', curvature: 0.08 },
      { id: 'thin-4', from: 'othersTitle', to: 'o3', style: 'thin', curvature: -0.06 },
    ],
  };
}