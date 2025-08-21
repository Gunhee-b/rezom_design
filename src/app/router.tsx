import { createBrowserRouter, Navigate } from 'react-router-dom'
import HomePage from '@/pages/HomePage/Homepage'
import ProfilePage from '@/pages/Profile/ProfilePage'
import WritingHubPage from '@/pages/WritingHub/WritingHubPage'
import DefinePage from '@/pages/Define/DefinePage'
import DefineTopicPage from '@/pages/DefineTopic/DefineTopicPage'
import WritePage from '@/pages/Write/WritePage'
import QuestionDetail from '@/pages/Questions/Detail'
import E2EFlow from '@/pages/Dev/E2EFlow'
import RequireAuth from '@/shared/router/RequireAuth'
import MyQuestions from '@/pages/Questions/MyQuestions'              // (기존 페이지: 유지)
import RouteErrorBoundary from '@/app/RouteErrorBoundary'
import MyQuestionsPage from '@/pages/MyQuestions/MyQuestionsPage'    // (새 목록형 페이지)
import RegisterPage from '@/pages/Auth/RegisterPage'

export const router = createBrowserRouter([
  // 공개 홈
  {
    path: '/',
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/sign-up',
    element: <RegisterPage />,
    errorElement: <RouteErrorBoundary />,
  },

  // 보호 구간
  {
    path: '/',
    element: <RequireAuth />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: 'profile', element: <ProfilePage />, errorElement: <RouteErrorBoundary /> },
      { path: 'writinghub', element: <WritingHubPage />, errorElement: <RouteErrorBoundary /> },
      { path: 'define', element: <DefinePage />, errorElement: <RouteErrorBoundary /> },
      { path: 'define/:slug', element: <DefineTopicPage />, errorElement: <RouteErrorBoundary /> },
      { path: 'write', element: <WritePage />, errorElement: <RouteErrorBoundary /> },

      // ✅ 새 경로: /users/me/questions (목록형)
      { path: 'users/me/questions', element: <MyQuestionsPage />, errorElement: <RouteErrorBoundary /> },

      // (선택) 이전 경로들 유지/리다이렉트
      { path: 'my-questions', element: <Navigate to="/users/me/questions" replace /> },
      { path: 'my-questions/:id', element: <Navigate to="/users/me/questions" replace /> },

      // (기존 상세 페이지는 공개/보호 중 어디 둘지 정책에 맞게)
    ],
  },

  // 기타 페이지 (공개)
  { path: '/metaphor', element: <div className="p-8">Metaphor</div> },
  { path: '/analyze', element: <div className="p-8">Analyze the World</div> },
  { path: '/free-insight', element: <div className="p-8">Free Insight</div> },
  { path: '/todays-question', element: <div className="p-8">Today</div> },
  { path: '/recommended', element: <div className="p-8">Recommended</div> },

  // 질문 상세 (정책에 따라 보호 구간으로 옮겨도 됨)
  { path: '/questions/:id', element: <QuestionDetail />, errorElement: <RouteErrorBoundary /> },

  // 개발용
  { path: '/dev/e2e', element: <E2EFlow />, errorElement: <RouteErrorBoundary /> },

  // 404
  { path: '*', element: <RouteErrorBoundary /> },
])
