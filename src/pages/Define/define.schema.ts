import type { ViewSchema } from '@/widgets/mindmap/types';

export const defineSchema: ViewSchema = {
  nodes: [
    // 중앙 큰 타이틀(ellipse)
    { id: 'title', x: 50, y: 48, label: 'Language\ndefinition', size: 'lg' , to: '/'},

    // 상단 3개
    { id: 'happiness', x: 12, y: 18, label: 'Happiness', size: 'sm', to: '/define/happiness' },
    { id: 'success',   x: 52, y: 10, label: 'Success',   size: 'sm', to: '/define/success' },
    { id: 'art',       x: 86, y: 28, label: 'Art',       size: 'sm', to: '/define/art' },
    { id: 'obsession', x: 26, y: 78, label: 'Obsession', size: 'sm', to: '/define/obsession' },
    { id: 'direction', x: 86, y: 78, label: 'Direction', size: 'sm', to: '/define/direction' },
  ],
  edges: [
    // 이미지 느낌의 초록 "줄기"를 두 구간으로 구성
    { id: 'vine1', from: 'obsession', to: 'title', style: 'green', curvature: 0.16 },
    { id: 'vine2', from: 'title',     to: 'art',   style: 'green', curvature: 0.12 },

    // 분위기용 얇은 회색 곡선(선택 사항)
    { id: 'thin1', from: 'happiness', to: 'title',   style: 'thin', curvature: -0.08 },
    { id: 'thin2', from: 'direction', to: 'title',   style: 'thin', curvature: 0.10 },
    { id: 'thin3', from: 'success',   to: 'art',     style: 'thin', curvature: -0.06 },
  ],
};