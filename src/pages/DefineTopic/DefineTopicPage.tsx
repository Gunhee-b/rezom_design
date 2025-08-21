// src/pages/DefineTopic/DefineTopicPage.tsx
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MindmapCanvas } from '@/widgets/mindmap/MindmapCanvas'
import { TOPIC_PRESETS } from '@/data/presets/topic'
import { makeTopicSchema } from './makeTopicSchema'

// ✅ 최소 동작용 API 래퍼들 (앞서 만든 src/api/define.ts)
import {
  listSuggestions,
  listQuestions,
  postSuggest,
  approveSuggestion,
  type Suggestion,
  type Question,
} from '@/api/define'

// ✅ 클라이언트 로그인 상태 감지 (당신 프로젝트의 토큰 유틸)
import { token } from '@/shared/lib/token'

function cap(s: string) {
  return s.slice(0, 1).toUpperCase() + s.slice(1)
}

export default function DefineTopicPage() {
  const { slug = 'happiness' } = useParams<{ slug: string }>()
  const queryClient = useQueryClient()

  // ----- 기존 Mindmap 렌더링 -----
  const preset = TOPIC_PRESETS[slug.toLowerCase()] ?? TOPIC_PRESETS.happiness
  const schema = useMemo(
    () => makeTopicSchema(cap(slug), preset.question, preset.others),
    [slug, preset]
  )

  // ----- 로그인 여부 (미로그인 시 제안/승인 버튼 비활성) -----
  const authed = localStorage.getItem('authed') === '1' || !!token.get()

  // ----- 제안 입력 상태 -----
  const [kwInput, setKwInput] = useState('')
  const [submitErr, setSubmitErr] = useState<string | null>(null)

  // ----- 제안 목록 / 생성된 질문 목록 -----
  const { data: suggestions, isLoading: suggLoading } = useQuery<Suggestion[]>({
    queryKey: ['define', 'suggestions', slug],
    queryFn: () => listSuggestions(slug),
  })

  const { data: questions, isLoading: qLoading } = useQuery<Question[]>({
    queryKey: ['define', 'questions', slug, { limit: 20 }],
    queryFn: () => listQuestions(slug, { limit: 20 }),
  })

  // ----- 제안 생성 뮤테이션 -----
  const suggestMut = useMutation({
    mutationFn: async (keywords: string[]) => postSuggest(slug, keywords),
    onSuccess: () => {
      setKwInput('')
      setSubmitErr(null)
      queryClient.invalidateQueries({ queryKey: ['define', 'suggestions', slug] })
    },
    onError: (err: any) => {
      // 서버가 {"ok":false,"error":{"message":"Bad CSRF token"...}} 형식이면 메시지 노출
      const msg =
        err?.body?.error?.message ||
        err?.message ||
        '제안에 실패했습니다.'
      setSubmitErr(msg)
    },
  })

  // ----- (선택) 제안 승인: 관리자/권한자만 UI 제공 예정 -----
  const approveMut = useMutation({
    mutationFn: async (suggestionId: number) =>
      approveSuggestion(slug, suggestionId, token.get() ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['define', 'suggestions', slug] })
      queryClient.invalidateQueries({ queryKey: ['define', 'questions', slug] })
    },
  })

  // ✅ onSuggestSubmit: 존재하지 않던 메서드 구현
  async function onSuggestSubmit() {
    if (!authed) {
      setSubmitErr('로그인 후 이용 가능합니다.')
      return
    }
    const keywords = kwInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    if (keywords.length === 0) {
      setSubmitErr('키워드를 한 개 이상 입력해 주세요.')
      return
    }
    suggestMut.mutate(keywords)
  }

  return (
    <main className="min-h-screen bg-neutral-50 pt-6">
      {/* 상단 마인드맵 */}
      <MindmapCanvas schema={schema} />

      {/* 구분선 */}
      <hr className="mt-8 border-neutral-200" />

      {/* 새 질문 제안 섹션 */}
      <section className="mx-auto mt-6 max-w-3xl px-4">
        <h2 className="mb-2 text-lg font-semibold">새 질문 제안</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={kwInput}
            onChange={(e) => setKwInput(e.target.value)}
            placeholder="키워드를 콤마(,)로 구분해 입력 (예: art, obsession)"
            className="flex-1 rounded-md border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
            disabled={!authed || suggestMut.isPending}
          />
          <button
            className="rounded bg-emerald-600 px-4 py-2 text-white disabled:opacity-50"
            onClick={onSuggestSubmit}
            disabled={!authed || suggestMut.isPending}
          >
            {suggestMut.isPending ? '제안 중…' : '제안'}
          </button>
        </div>
        {!authed && (
          <p className="mt-2 text-sm text-neutral-500">
            로그인 후 이용 가능합니다.
          </p>
        )}
        {submitErr && (
          <p className="mt-2 text-sm text-red-600">{submitErr}</p>
        )}
        <p className="mt-2 text-xs text-neutral-400">
          ※ 브라우저 쿠키 + CSRF 더블서밋으로 인증됩니다.
        </p>
      </section>

      {/* 제안 목록 */}
      <section className="mx-auto mt-8 max-w-3xl px-4">
        <h3 className="mb-2 text-base font-semibold">제안 목록</h3>
        {suggLoading ? (
          <p className="text-sm text-neutral-500">불러오는 중…</p>
        ) : suggestions && suggestions.length > 0 ? (
          <ul className="space-y-2">
            {suggestions.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3"
              >
                <div>
                  <div className="font-medium">{s.suggestion}</div>
                  <div className="text-xs text-neutral-500">
                    keywords: {s.keywords.join(', ')} · status: {s.status}
                  </div>
                </div>
                {/* 관리자/권한자 영역: 일단 로그인 상태에서만 보이도록 */}
                <div className="flex items-center gap-2">
                  <button
                    className="rounded border px-3 py-1 text-sm disabled:opacity-50"
                    onClick={() => approveMut.mutate(s.id)}
                    disabled={!authed || approveMut.isPending}
                    title={!authed ? '로그인 필요' : '승인하여 질문 생성'}
                  >
                    {approveMut.isPending ? '승인 중…' : '승인'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-neutral-500">아직 제안이 없습니다.</p>
        )}
      </section>

      {/* 생성된 질문 목록 */}
      <section className="mx-auto mt-8 mb-16 max-w-3xl px-4">
        <h3 className="mb-2 text-base font-semibold">생성된 질문</h3>
        {qLoading ? (
          <p className="text-sm text-neutral-500">불러오는 중…</p>
        ) : questions && questions.length > 0 ? (
          <ul className="space-y-2">
            {questions.map((q) => (
              <li
                key={q.id}
                className="rounded-lg border border-neutral-200 bg-white px-4 py-3"
              >
                <div className="font-medium">{q.title}</div>
                {q.tags?.length ? (
                  <div className="mt-1 text-xs text-neutral-500">
                    tags: {q.tags.join(', ')}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-neutral-500">아직 생성된 질문이 없습니다.</p>
        )}
      </section>
    </main>
  )
}