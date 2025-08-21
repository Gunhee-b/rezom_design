// src/pages/Define/DefinePage.tsx
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  // ✅ Daily Question API 호출/파싱 유틸
  getDailyQuestion,
  extractDailyText,
  type DailyQuestionResponse,
} from '@/shared/api/questions'
import { MindmapCanvas } from '@/widgets/mindmap/MindmapCanvas'
import { defineSchema } from './define.schema'

export default function DefinePage() {
  // ✅ 1) Daily Question 가져오기
  const { data } = useQuery<DailyQuestionResponse>({
    queryKey: ['daily-question'],   // 캐시 키
    queryFn: getDailyQuestion,      // 실제 API 호출 함수
    // staleTime, refetchInterval 등을 원하면 여기 옵션 추가 가능
  })

  // ✅ 2) 응답에서 텍스트만 안전하게 추출
  const dailyText = extractDailyText(data?.question)

  // ✅ 3) 스키마 복사 후 ‘센터 노드(title)’의 label만 교체
  // define.schema.ts 를 보면 노드 속성은 label만 사용하고 있고,
  // 센터 노드는 idFor(P,'title')로 생성됨. (id가 ':title'로 끝남)
  const schema = useMemo(() => {
    // 원본 불변성 유지: 깊은 복사
    const s = JSON.parse(JSON.stringify(defineSchema)) as typeof defineSchema

    // 센터 노드 찾기: id가 ':title'로 끝나는 노드
    const center = s.nodes.find(n => n.id.endsWith(':title'))
    if (center && dailyText) {
      // ✅ MindmapCanvas는 label을 그리므로 label만 바꿔주면 됨
      center.label = dailyText
    }

    return s
  }, [dailyText])

  return (
    <div className="pt-6">
      {/* ✅ key에 dailyText를 넣어 질문이 바뀔 때 SVG가 깔끔히 리렌더 */}
      <MindmapCanvas key={dailyText || 'no-daily'} schema={schema} />
    </div>
  )
}