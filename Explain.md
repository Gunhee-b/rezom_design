# Architecture Explanation: Define/Top-5/Write Flow

## Overview
This document explains the implementation of the admin-curated Top-5 questions system, which replaced the previous keyword-based approach for the Define page.

## System Architecture

### Data Flow
```
Admin Panel → Backend API → Database
     ↓            ↓            ↓
Create Question  Set Top-5   Store
(single keyword) questions   rankings
     ↓            ↓            ↓
Frontend ← Public API ← Cached Data
     ↓
Display Graph → Click Node → Show Detail → Write Answer
```

## Key Changes Implemented

### 1. Backend Contracts (✅ Completed)

#### Admin Endpoints
- **POST /admin/questions** - Create question with exactly one keyword
  - Validation: Must have `conceptSlug` and single keyword
  - Creates keyword if doesn't exist
  - Links question to keyword

- **POST /admin/define/:slug/top5** - Set Top-5 questions
  - Accepts array of questionIds
  - Updates ranking positions
  - Maintains order for display

#### Public Endpoints  
- **GET /define/:slug/top5** - Returns Top-5 questions in order
- **GET /define/:slug/questions/:id** - Get question detail with keyword
- **GET /define/concepts/:slug/keywords** - Returns keywords (Top-5 format preferred)

### 2. Frontend Refactoring (✅ Completed)

#### DefinePage.tsx Changes
```typescript
// Before: Used preset data
const preset = TOPIC_PRESETS[slug]

// After: Fetches Top-5 from API
const { data: keywords } = useQuery({
  queryKey: ['define', 'keywords', slug],
  queryFn: () => getKeywords(slug)
})
```

#### Graph Visualization
- **Center node**: Fixed "Definition" text (was dynamic)
- **Surrounding nodes**: Top-5 keywords from admin
- **Click behavior**: Opens question detail modal
- **Write node**: Passes question context

### 3. Question Detail Flow (✅ Completed)

#### QuestionDetailView Component
```typescript
// Handles question display in modal
- Shows full question content
- Displays keyword label  
- Write CTA button with context
- Stores context in sessionStorage as fallback
```

#### Navigation Flow
1. User clicks keyword node
2. Modal opens with question detail
3. User clicks "Write" 
4. Navigates to `/write?questionId=123&slug=language-definition`
5. Write page loads with question context

### 4. Write Page Updates (✅ Completed)

#### Precedence Logic
```typescript
// 1. URL parameters (highest priority)
const urlQuestionId = searchParams.get('questionId')
const urlSlug = searchParams.get('slug')

// 2. SessionStorage (fallback)
const sessionQuestionId = sessionStorage.getItem('lastQuestionId')
const sessionSlug = sessionStorage.getItem('lastConceptSlug')

// 3. Daily question (final fallback)
const { data: dailyQuestion } = useQuery(...)
```

#### UI Changes
- Question banner shows selected question
- "Fill with question" button works with current context
- Navigation returns to proper context after submission

## Data Models

### Question with Keyword
```typescript
interface QuestionDetail {
  id: number
  title: string
  content: string
  tags: string[]
  keywordLabel?: string  // Added for context
  conceptSlug: string
  createdAt: string
}
```

### Top-5 Format
```typescript
interface TopFiveKeyword {
  label: string      // Keyword text
  questionId: number // Associated question
  rank: number      // Position 1-5
}
```

### ConceptKeyword (Fallback)
```typescript
interface ConceptKeyword {
  id: number
  keyword: string
  position: number
  active: boolean
  currentQuestionId: number | null
}
```

## State Management

### URL State
- Primary source of truth for question context
- Example: `/define/language-definition?questionId=123`
- Persists across page refreshes

### SessionStorage
- Fallback when URL params not available
- Keys: `lastQuestionId`, `lastConceptSlug`
- Survives navigation but not tab close

### React Query Cache
- Caches API responses
- Invalidates on SSE updates
- Reduces unnecessary API calls

## Real-time Updates (SSE)

### Connection Management
```typescript
// useConceptUpdates hook
- Establishes SSE connection to backend
- Handles reconnection with 5-second delay
- Triggers query invalidation on updates
```

### Event Flow
1. Admin creates/updates question
2. Backend emits SSE event
3. Frontend receives update
4. Queries invalidated
5. UI refreshes automatically

## Migration Path

### From Keywords to Top-5
1. **Data compatibility**: System supports both formats
2. **Type guards**: Detect which format returned
3. **Gradual migration**: Can run both systems in parallel
4. **Fallback logic**: Uses ConceptKeyword if no Top-5

### Code Example
```typescript
// Type guard to detect format
function isTop5Format(data: any[]): data is TopFiveKeyword[] {
  return data.length > 0 && 'questionId' in data[0]
}

// Usage with fallback
const keywords = isTop5Format(data) 
  ? data  // Use Top-5 format
  : convertToTop5(data)  // Convert old format
```

## Performance Optimizations

### Caching Strategy
- Questions cached for 5 minutes
- Keywords cached until invalidation
- SSE triggers selective updates

### Bundle Size
- Lazy load question detail modal
- Code split admin routes
- Tree-shake unused preset data

### Network Optimization
- Batch API calls where possible
- Use field selection in queries
- Implement pagination for lists

## Security Considerations

### Admin Protection
- JWT authentication required
- ADMIN role verification
- CSRF token validation
- Rate limiting on mutations

### Data Validation
- Single keyword enforcement
- Question ID verification
- Slug format validation
- XSS prevention in content

## Testing Strategy

### Unit Tests
- Keyword validation logic
- Question precedence logic
- Type guard functions
- URL parameter parsing

### Integration Tests
- API endpoint contracts
- Database transactions
- SSE event flow
- Authentication flow

### E2E Tests
- Complete user journey
- Admin workflow
- Error handling
- Edge cases

## Future Enhancements

### Planned Features
1. **Keyword suggestions**: AI-powered keyword generation
2. **Question templates**: Reusable question formats
3. **Analytics**: Track which questions get most answers
4. **Bulk operations**: Set multiple Top-5s at once

### Technical Debt
1. **SSE scaling**: Move to Redis pub/sub for multiple servers
2. **Cache invalidation**: Implement more granular invalidation
3. **Type safety**: Generate types from OpenAPI schema
4. **Error boundaries**: Add more granular error handling

## Troubleshooting Guide

See `Debug.md` for detailed troubleshooting steps.

## Related Files

### Backend
- `/backend/src/modules/admin/admin.controller.ts` - Admin endpoints
- `/backend/src/modules/define/define.controller.ts` - Public endpoints
- `/backend/src/modules/define/define.service.ts` - Business logic

### Frontend
- `/frontend/src/pages/Define/DefinePage.tsx` - Main define page
- `/frontend/src/pages/Write/WritePage.tsx` - Write page with context
- `/frontend/src/components/QuestionDetailView.tsx` - Question modal
- `/frontend/src/hooks/useConceptUpdates.ts` - SSE hook

### Database
- `keyword` table - Stores keywords with positions
- `question` table - Questions with single keyword reference
- `concept_top_five` table - Top-5 rankings per concept