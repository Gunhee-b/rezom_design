// src/molecules/LoginSection.tsx
import React, { forwardRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoginPanel from '@/features/auth/LoginPanel';

type Props = {
  open: boolean;
  onToggle: () => void;
  onSuccess?: () => void;
  /** 'Login' 텍스트 버튼의 폰트 크기(px). 보통 로고의 50%를 전달 */
  buttonFontPx: number;
  /** 패널 스케일. 0.2면 20% */
  panelScale?: number;
};

/**
 * Login 버튼 + 패널
 * - 버튼은 텍스트만(테두리/배경 없음)
 * - 클릭 시 패널이 부드럽게 등장
 * - ref는 버튼 요소에 연결(오버레이 라인에서 좌표 계산에 쓰임)
 */
const LoginSection = forwardRef<HTMLButtonElement, Props>(function LoginSection(
  { open, onToggle, onSuccess, buttonFontPx, panelScale = 0.2 },
  buttonRef
) {
  return (
    <section className="min-h-[50vh] flex flex-col items-center justify-start gap-6 pb-24">
      <button
        ref={buttonRef}
        type="button"
        onClick={onToggle}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggle()}
        aria-expanded={open}
        aria-controls="home-login-panel"
        className="mt-10 select-none cursor-pointer outline-none focus:ring-2 focus:ring-black rounded bg-transparent p-0 leading-none hover:opacity-80 transition"
        style={{ fontSize: `${buttonFontPx}px`, fontWeight: 800 }}
        title="Click to open login form"
      >
        Login
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="home-login-panel"
            key="home-login-panel"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="w-full flex justify-center"
          >
            <LoginPanel maxWidthPx={buttonFontPx * 2} scale={panelScale} onSuccess={onSuccess} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
});

export default LoginSection;