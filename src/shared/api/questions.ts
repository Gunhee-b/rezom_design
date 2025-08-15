import { api } from '@/shared/lib/axios'

export type Question = { id: number; title: string; body: string; authorId: number; createdAt?: string }
export type QuestionCreateDto = { title: string; body: string; categoryId?: number }

export async function createQuestion(dto: QuestionCreateDto): Promise<Question> {
  const { data } = await api.post('/questions', dto, {
    _noRefresh: !localStorage.getItem('access_token'), // 토큰 없으면 재시도 금지
  })
  return data
}

export async function getQuestion(id: number): Promise<Question> {
  const { data } = await api.get(`/questions/${id}`)
  return data
}

// ✅ 이 함수 이름이 hooks에서 쓰는 것과 정확히 일치해야 합니다.
export async function listMyQuestions(): Promise<Question[]> {
  const { data } = await api.get('/users/me/questions')
  return data
}
