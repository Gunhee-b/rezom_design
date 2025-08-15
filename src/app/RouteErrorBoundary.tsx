import { isRouteErrorResponse, useRouteError, Link } from 'react-router-dom'

export default function RouteErrorBoundary() {
  const err = useRouteError()
  if (isRouteErrorResponse(err)) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold">{err.status} {err.statusText}</h1>
        <p className="mt-2 text-neutral-600">요청하신 페이지를 찾을 수 없습니다.</p>
        <Link to="/" className="mt-4 inline-block text-emerald-700 underline">홈으로</Link>
      </div>
    )
  }
  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold">문제가 발생했어요</h1>
      <Link to="/" className="mt-4 inline-block text-emerald-700 underline">홈으로</Link>
    </div>
  )
}
