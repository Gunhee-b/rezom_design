import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDailyQuestion, extractDailyText, type DailyQuestionResponse } from '@/shared/api/questions'
import { MindmapCanvas } from '@/widgets/mindmap/MindmapCanvas'
import { defineSchema } from './define.schema'

export default function DefinePage() {
  const { data } = useQuery<DailyQuestionResponse>({
    queryKey: ['daily-question'],
    queryFn: getDailyQuestion,
  })
  const dailyText = extractDailyText(data?.question)

  const schema = useMemo(() => {
    const s: any = JSON.parse(JSON.stringify(defineSchema))
    const qNode = s?.nodes?.find(
      (n: any) => n?.id?.toLowerCase?.() === 'q' || n?.title === 'Q'
    )
    if (qNode && dailyText) {
      if ('label' in qNode) qNode.label = dailyText
      else if ('title' in qNode) qNode.title = dailyText
      else if ('text' in qNode) qNode.text = dailyText
    }
    return s
  }, [dailyText])

  return (
    <div className="pt-6">
      <MindmapCanvas key={dailyText || 'no-daily'} schema={schema} />
    </div>
  )
}
