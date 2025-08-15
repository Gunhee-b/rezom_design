// src/shared/lib/token.ts
const KEY = 'access_token'

let accessToken: string | null = typeof window !== 'undefined'
  ? localStorage.getItem(KEY)
  : null

export const token = {
  get() { return accessToken },
  set(v: string | null) {
    accessToken = v
    try {
      if (v) localStorage.setItem(KEY, v)
      else localStorage.removeItem(KEY)
    } catch {}
  },
  clear() { this.set(null) },
}
