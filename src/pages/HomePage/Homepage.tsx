import { useCallback, useEffect, useRef, useState } from 'react';
import { MindmapCanvas } from '@/widgets/mindmap/MindmapCanvas';
import { homeSchema } from './home.schema';
import { TOKENS } from '@/shared/theme/tokens';
import LoginSection from '@/molecules/LoginSection';
import Backdrop from '@/atoms/Backdrop';
import { idFor } from '@/shared/schema/rules';

export default function HomePage() {
  const [openLogin, setOpenLogin] = useState(false);
  const [logoFontPx, setLogoFontPx] = useState<number>(TOKENS.typography.logo.size);
  const [authed, setAuthed] = useState(() => localStorage.getItem('authed') === '1');

  const loginBtnRef = useRef<HTMLButtonElement>(null);

  // 🔹 Mindmap 노드 DOM 참조 저장소 (렌더와 분리: ref)
  const nodeElMapRef = useRef<Record<string, Element | null>>({});
  // 화면에서 참조할 readonly 상태
  const [nodeElMap, setNodeElMap] = useState<Record<string, Element | null>>({});

  // ✅ 무한루프 방지: null 무시 + 동일 엘리먼트 중복 업데이트 금지 + 안정 콜백
  const handleNodeMount = useCallback((id: string, el: Element | null) => {
    if (!el) return; // cleanup(null)은 무시
    if (nodeElMapRef.current[id] === el) return; // 동일 참조면 무시
    nodeElMapRef.current = { ...nodeElMapRef.current, [id]: el };
    setNodeElMap(nodeElMapRef.current);
  }, []);

  // 로고 텍스트 실높이 측정(없으면 조용히 무시)
  useEffect(() => {
    const sel = 'svg [data-role="logo-text"]';
    let mo: MutationObserver | null = null;

    const measure = () => {
      const t = document.querySelector<SVGGraphicsElement>(sel);
      if (!t) return;
      const h = t.getBoundingClientRect().height;
      setLogoFontPx(Math.max(24, Math.min(72, Math.round(h))));
    };

    measure();
    addEventListener('resize', measure);
    mo = new MutationObserver(measure);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      removeEventListener('resize', measure);
      mo?.disconnect();
    };
  }, []);

  // 캔버스용 파생 스키마: 배경은 Backdrop에서 처리
  // 참고) 기준 비교가 필요하면 sprites 주석 해제하여 캔버스 내부 vine을 확인
  const derivedSchema = {
    ...homeSchema,
    background: undefined,
    sprites: homeSchema.sprites, // vine을 항상 표시
    edges: authed ? homeSchema.edges : homeSchema.edges.filter(e => e.style !== 'green'),
  };

  const handleLoginSuccess = () => {
    localStorage.setItem('authed', '1');
    setAuthed(true);
    setOpenLogin(false);
  };

  return (
    <main className="relative min-h-screen">
      {/* 1) 배경 */}
      <Backdrop />

      {/* 2) 캔버스 */}
      <div className="relative z-10 pt-6">
        <MindmapCanvas schema={derivedSchema} onNodeMount={handleNodeMount} />
      </div>

      {/* 3) 로그인 섹션 */}
      <section className="relative z-30">
        <LoginSection
          ref={loginBtnRef}
          open={openLogin}
          onToggle={() => setOpenLogin(v => !v)}
          onSuccess={handleLoginSuccess}
          buttonFontPx={logoFontPx * 0.5}
          panelScale={0.2}
        />
      </section>
    </main>
  );
}
