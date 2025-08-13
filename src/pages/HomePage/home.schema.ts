import type { ViewSchema } from '@/widgets/mindmap/types';
import { idFor } from '@/shared/schema/rules';
import { i } from 'framer-motion/client';

const P = 'home';

export const homeSchema: ViewSchema = {
  background: 'paperGloss',     // ✅ 글레어 배경 켜기
  nodes: [
    { id: idFor(P, 'logo'), kind: 'logo', x: 50, y: 55 },

    // 일반 노드는 kind 생략(=ellipse)
    { id: idFor(P, 'about'),  label: 'About',                 x: 20, y: 18, size: 'md', to: idFor(P, '/about') },
    { id: idFor(P, 'define'),   label: 'Language\ndefinition',  x: 12, y: 62, size: 'md', to: idFor(P, '/define') },
    { id: idFor(P, 'todays'), label: "Today's\nQuestion",     x: 45, y: 30, size: 'md', to: idFor(P, '/todays-question') },
    { id: idFor(P, 'metaphor'), label: 'Description\nby Metaphor', x: 80, y: 12, size: 'md', to: idFor(P, '/metaphor') },
    { id: idFor(P, 'analyze'),  label: 'Analyzing\nthe World', x: 88, y: 40, size: 'md', to: idFor(P, '/analyze') },
    { id: idFor(P, 'free'),     label: 'Free Insight',        x: 22, y: 82, size: 'md', to: idFor(P, '/free-insight') },
    { id: idFor(P, 'profile'),  label: 'Profile',             x: 60, y: 78, size: 'md', to: idFor(P, '/profile') },
    { id: idFor(P, 'reco'),     label: 'Recommended\nQuestions', x: 83, y: 86, size: 'md', to: idFor(P, '/recommend') },
    { id: idFor(P, 'login-anchor'), kind: 'anchor', x: 50, y: 93 },  // ✅ 화면 하단 Login 근처
  ],
  edges: [
    { id: idFor(P, 'vine'),   from: idFor(P, 'todays'), to: idFor(P, 'profile'), style: 'green', curvature: 0.22 },
    { id: idFor(P, 'line-1'), from: idFor(P, 'todays'), to: idFor(P, 'analyze'), style: 'thin',  curvature: 0.25 },
    { id: idFor(P, 'line-2'), from: idFor(P, 'todays'), to: idFor(P, 'about'),   style: 'thin',  curvature: -0.25 },
    { id: idFor(P, 'line-3'), from: idFor(P, 'profile'), to: idFor(P, 'reco'),   style: 'thin',  curvature: 0.2 },
    { id: idFor(P, 'line-4'), from: idFor(P, 'about'),   to: idFor(P, 'define'),   style: 'thin',  curvature: 0.35 },
    { id: idFor(P, 'line-5'), from: idFor(P, 'free'),    to: idFor(P, 'profile'),style: 'thin',  curvature: -0.25 },
  ],
  sprites: [
    { id: idFor(P, 'vine-login'), type: 'vine', from: idFor(P, 'logo'), to: idFor(P, 'login-anchor'), scale: 1.6,   // 크기 키우기
      dx: -3,       // 로고쪽으로 약간 왼쪽
      dy: -6,       // 로고쪽으로 약간 위
      rotate: 0,
    },
  ],
};