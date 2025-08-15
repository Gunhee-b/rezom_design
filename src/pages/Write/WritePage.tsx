import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createQuestion } from '@/shared/api/questions'

export default function WritePage() {
  const nav = useNavigate() // ✅ nav 정의
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [saving, setSaving] = useState(false)            // ✅ setSaving 정의
  const [err, setErr] = useState<string | null>(null)    // ✅ setErr 정의

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setErr(null)
    try {
      const q = await createQuestion({ title, body /*, categoryId: 1*/ })
      nav(`/users/me/questions?created=${q.id}`, { replace: true })
    } catch (err: any) {
      setErr(err?.message || '작성에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-bold">새 글 작성</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="min-h-[160px] w-full rounded border px-3 py-2"
          placeholder="내용"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
        <button
          disabled={saving}
          className="rounded bg-emerald-600 px-4 py-2 text-white disabled:opacity-60"
        >
          {saving ? '저장 중…' : '작성'}
        </button>
        {err && <p className="text-sm text-red-600">{err}</p>}
      </form>
    </main>
  )
}
