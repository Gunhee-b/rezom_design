import React, { useEffect, useRef } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { api } from '@/shared/lib/axios'
import { token } from '@/shared/lib/token'

const client = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
})

export function Providers({ children }: { children: React.ReactNode }) {
  const didRun = useRef(false)                       // ✅ StrictMode에서 2중 실행 방지

  useEffect(() => {
    if (didRun.current) return
    didRun.current = true

    const hasAccess = !!token.get()
    const authed = localStorage.getItem('authed') === '1'

    // ✅ 토큰 & authed 둘 다 있을 때만 조용히 시도
    if (!hasAccess || !authed) return

    // 원치 않으면 다음 줄 주석: 부팅시 silent refresh 자체 비활성화 가능
    api.post('/auth/refresh', {}, { _noRefresh: true as any })
      .then((res) => {
        const at = res?.data?.accessToken
        if (at) token.set(at)
      })
      .catch(() => {
        // refresh 실패 시 조용히 무시(여기서 콘솔 에러 안 남김)
        // 실제 보호는 axios 인터셉터에서 처리
      })
  }, [])

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
