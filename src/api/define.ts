// src/api/define.ts
import { api } from './client';

export type Concept = {
  id: number;
  slug: string;
  title: string;
  description?: string | null;
  createdById?: number | null;
  createdAt: string;
  updatedAt: string;
};

export type Suggestion = {
  id: number;
  conceptId: number;
  createdById?: number | null;
  keywords: string[];
  prompt?: string | null;
  suggestion: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  linkedQuestionId?: number | null;
  createdAt: string;
  updatedAt: string;
};

export type Question = {
  id: number;
  authorId: number;
  categoryId: number;
  title: string;
  body: string;
  tags: string[];
  isDaily: boolean;
  createdAt: string;
  updatedAt: string;
};

// 개념 상세 + 그래프(이웃, 엣지) — 필요 시 타입 확장
export async function getConcept(slug: string) {
  return api<{ concept: Concept; neighbors: Concept[]; edges: any[] }>(
    `/define/concepts/${slug}`,
    { withCredentials: true }
  );
}

// 제안 목록
export async function listSuggestions(slug: string) {
  return api<Suggestion[]>(`/define/concepts/${slug}/suggestions`, {
    withCredentials: true,
  });
}

// 제안 생성 (쿠키 CSRF + withCredentials)
export async function postSuggest(slug: string, keywords: string[]) {
  return api<Suggestion>(`/define/concepts/${slug}/suggest`, {
    method: 'POST',
    json: { keywords },
    withCsrf: true,
    withCredentials: true,
  });
}

// 제안 승인 → 질문 생성 (권한 필요: Bearer + CSRF + 쿠키)
export async function approveSuggestion(
  slug: string,
  suggestionId: number,
  accessToken: string
) {
  return api<Question>(`/define/concepts/${slug}/approve`, {
    method: 'POST',
    json: { suggestionId },
    withCsrf: true,
    withCredentials: true,
    accessToken, // Authorization: Bearer ...
  });
}

// 질문 목록
// src/api/define.ts
export async function listQuestions(
    slug: string,
    opts?: number | { limit?: number }
  ) {
    const limit = typeof opts === 'number' ? opts : opts?.limit ?? 10;
    return api<Question[]>(
      `/define/concepts/${slug}/questions`,
      { query: { limit }, withCredentials: true }
    );
}