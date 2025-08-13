export type NodeSpec = { id: string; label: string; r: number; angle: number };
export type EdgeSpec = { from: string; to: string; style?: 'vine' | 'thin' };

export const nodes: NodeSpec[] = [
  { id: 'logo', label: 'ReZom', r: 0, angle: 0 },

  // 좌상단 클러스터
  { id: 'about', label: 'About', r: 260, angle: -2.4 },                 // 대략  -137°
  { id: 'lang', label: 'Language definition', r: 340, angle: -2.8 },    // 대략  -160°
  // 중앙 상단
  { id: 'today', label: "Today's Question", r: 220, angle: -1.2 },      // 대략   -69°
  // 우상단 클러스터
  { id: 'metaphor', label: 'Description by Metaphor', r: 320, angle: -0.3 }, // -17°
  { id: 'analyze', label: 'Analyzing the World', r: 300, angle: 0.2 },       //  11°
  // 우하단
  { id: 'reco', label: 'Recommended Questions', r: 330, angle: 0.7 },        //  40°
  // 하단 중앙
  { id: 'profile', label: 'Profile', r: 260, angle: 0.9 },                    //  52°
];

export const edges: EdgeSpec[] = [
  // 얇은 연결(회로 느낌)
  { from: 'about', to: 'today', style: 'thin' },
  { from: 'today', to: 'metaphor', style: 'thin' },
  { from: 'metaphor', to: 'analyze', style: 'thin' },
  { from: 'lang', to: 'about', style: 'thin' },
  { from: 'lang', to: 'reco', style: 'thin' },
  { from: 'reco', to: 'profile', style: 'thin' },

  // 초록 덩굴(굵고 유기적) — 중심을 통과: today → logo → profile
  { from: 'today', to: 'logo', style: 'vine' },
  { from: 'logo', to: 'profile', style: 'vine' },
];
