import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/HomePage/Homepage'
import ProfilePage from '@/pages/Profile/ProfilePage'
import WritingHubPage from '@/pages/WritingHub/WritingHubPage'
import DefinePage from '@/pages/Define/DefinePage'
import DefineTopicPage from '@/pages/DefineTopic/DefineTopicPage'
import WritePage from '@/pages/Write/WritePage'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage/> },
  { path: '/profile', element: <ProfilePage/> },
  { path: '/writinghub', element: <WritingHubPage/> },
  { path: '/define', element: <DefinePage/> },
  { path: '/define/:slug', element: <DefineTopicPage/> },
  { path: '/write', element: <WritePage/> },
  { path: '/metaphor', element: <div className="p-8">Metaphor</div> },
  { path: '/analyze', element: <div className="p-8">Analyze the World</div> },
  { path: '/free-insight', element: <div className="p-8">Free Insight</div> },
  { path: '/todays-question', element: <div className="p-8">Today</div> },
  { path: '/recommended', element: <div className="p-8">Recommended</div> },
])
