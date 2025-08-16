import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { createQuestion } from '@/shared/api/questions'
import { getDailyQuestion, type DailyQuestionResponse, extractDailyText } from '@/shared/api/questions'

export default function WritePage() {
  const nav = useNavigate()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const { data: dq, isLoading: dqLoading } = useQuery<DailyQuestionResponse>({
    queryKey: ['daily-question'],
    queryFn: getDailyQuestion,
  })
  const dailyText = extractDailyText(dq?.question) || ''

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErr(null)
    try {
      const q = await createQuestion({ title, body })
      nav(`/users/me/questions?created=${q.id}`, { replace: true })
    } catch (e: any) {
      setErr(e?.message || '작성에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="mb-1 text-xs font-medium text-emerald-700">오늘의 질문</div>
        {dqLoading ? (
          <div className="h-6 w-3/4 animate-pulse rounded bg-emerald-200" />
        ) : dailyText ? (
          <p className="whitespace-pre-wrap text-emerald-900">{dailyText}</p>
        ) : (
          <p className="text-emerald-900/70">오늘의 질문을 불러오지 못했습니다.</p>
        )}
      </div>

      <h1 className="mb-4 text-2xl font-semibold">새 글 작성</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="내용"
          rows={10}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-white disabled:opacity-60"
          >
            {saving ? '작성 중…' : '작성'}
          </button>
          {!dqLoading && dailyText && (
            <button
              type="button"
              className="text-sm text-emerald-700 underline"
              onClick={() => setTitle((t) => t || dailyText)}
            >
              질문을 제목으로 채우기
            </button>
          )}
        </div>
        {err && <p className="text-sm text-red-600">{err}</p>}
      </form>
    </div>
  )
}
