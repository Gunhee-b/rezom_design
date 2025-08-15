import axios, { AxiosHeaders } from 'axios'
import { token } from './token'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const at = token.get()
  if (at) {
    const h = new AxiosHeaders(config.headers || {})
    h.set('Authorization', `Bearer ${at}`)
    config.headers = h
  }
  return config
})

let isRefreshing = false
let waiters: Array<() => void> = []

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const { config, response } = error
    const url = (config?.url || '').toString()

    // refresh/logout 또는 명시적 플래그는 재시도 금지
    const skipRefresh =
      (config as any)?._noRefresh ||
      url.includes('/auth/refresh') ||
      url.includes('/auth/logout')

    const hasAccess = !!token.get()

    if (!response || response.status !== 401 || skipRefresh || (config as any)?._retry || !hasAccess) {
      return Promise.reject(error)
    }

    ;(config as any)._retry = true

    if (isRefreshing) {
      await new Promise<void>((res) => waiters.push(res))
    } else {
      isRefreshing = true
      try {
        const { data } = await api.post('/auth/refresh', {}, { _noRefresh: true as any })
        if (data?.accessToken) token.set(data.accessToken)
      } catch {
        // ✅ refresh 실패: 세션 정리 → 이후 요청은 401로 떨어지고 UI는 로그인 유도
        token.clear()
        localStorage.removeItem('authed')
        isRefreshing = false
        waiters.forEach((fn) => fn())
        waiters = []
        return Promise.reject(error)
      }
      isRefreshing = false
      waiters.forEach((fn) => fn())
      waiters = []
    }

    return api(config)
  }
)
