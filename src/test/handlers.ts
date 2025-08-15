// src/test/handlers.ts
import { http, HttpResponse } from 'msw'

// LoginSection에서 실제로 무엇을 호출하든 기본 200으로 받게 준비(통합 모드에선 끔)
export const handlers = [
  http.post('http://localhost:3000/auth/login', async () => {
    return HttpResponse.json({ accessToken: 'dummy' })
  }),
  http.get('http://localhost:3000/auth/me', async () => {
    return HttpResponse.json({ id: 1, name: 'tester' })
  }),
  http.post('http://localhost:3000/auth/logout', () => HttpResponse.json({ ok: true })),
]
