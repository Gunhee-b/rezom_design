import { useEffect, useState } from 'react';
import { VineSprite } from '@/widgets/mindmap/VineSprite';

type Pt = { x: number; y: number };

type Props = {
  /** 시작점 엘리먼트가 있으면 이걸 우선 사용 */
  fromEl?: Element | null;
  /** 없을 때만 selector로 fallback */
  fromSelector?: string;

  toEl: HTMLElement | null;
  show: boolean;

  bow?: number;
  mirror?: boolean;
  startOffset?: Pt;
  endOffset?: Pt;
  scale?: number;
  /** vine.svg 내부 기준점 보정(0~1). 없으면 하단 중앙 */
  anchor?: { x: number; y: number };
};

const center = (el: Element | null): Pt | null => {
  if (!el) return null;
  const r = (el as HTMLElement).getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

const add = (p: Pt | null, off?: Pt) =>
  p ? { x: p.x + (off?.x ?? 0), y: p.y + (off?.y ?? 0) } : null;

export default function OverlayVine({
  fromEl,
  fromSelector,
  toEl,
  show,
  bow = 0,
  mirror = false,
  startOffset,
  endOffset,
  scale = 1,
  anchor,
}: Props) {
  const [a, setA] = useState<Pt | null>(null);
  const [b, setB] = useState<Pt | null>(null);
  const [vw, setVw] = useState<number>(window.innerWidth);
  const [vh, setVh] = useState<number>(window.innerHeight);

  useEffect(() => {
    let mo: MutationObserver | null = null;

    const measure = () => {
      const from = fromEl ?? (fromSelector ? document.querySelector(fromSelector) : null);
      setA(add(center(from), startOffset));
      setB(add(center(toEl), endOffset));
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };

    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, { passive: true });

    if (!fromEl && fromSelector) {
      mo = new MutationObserver(measure);
      mo.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
      mo?.disconnect();
    };
  }, [fromEl, fromSelector, toEl, startOffset, endOffset]);

  if (!show || !a || !b) return null;

  return (
    <svg
      className="pointer-events-none fixed inset-0 z-[35]"
      viewBox={`0 0 ${vw} ${vh}`}
      width="100vw"
      height="100vh"
      aria-hidden
    >
      <VineSprite a={a} b={b} bow={bow} mirror={mirror} scale={scale} anchor={anchor} />
    </svg>
  );
}
