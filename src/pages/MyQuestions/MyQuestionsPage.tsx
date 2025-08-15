import { useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useMyQuestions } from '@/features/questions/hooks'

export default function MyQuestionsPage() {
  const [sp] = useSearchParams()
  const created = sp.get('created') // 새로 만든 글 ID

  const { data, isLoading, error, refetch } = useMyQuestions()

  // 방금 작성 후 도착했다면 목록 새로고침
  useEffect(() => { if (created) refetch() }, [created, refetch])

  if (isLoading) return <div className="p-6">불러오는 중…</div>
  if (error) return <div className="p-6 text-red-600">목록을 가져오지 못했습니다.</div>

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">내가 쓴 글</h1>

      {!data?.length && <p className="text-neutral-500">아직 작성한 글이 없습니다.</p>}

      <ul className="space-y-3">
        {data?.map((q) => {
          const isNew = created && String(q.id) === created
          return (
            <li
              key={q.id}
              className={`rounded-lg border p-4 ${isNew ? 'border-emerald-500 bg-emerald-50' : 'border-neutral-200 bg-white'}`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">{q.title}</h2>
                {isNew && <span className="text-sm text-emerald-700">작성됨</span>}
              </div>
              <p className="mt-1 line-clamp-2 text-neutral-700">{q.body}</p>
              {/* 상세 페이지가 있으면 링크 걸어두세요 */}
              <div className="mt-2 text-sm">
                <Link to={`/questions/${q.id}`} className="text-emerald-700 hover:underline">자세히</Link>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
