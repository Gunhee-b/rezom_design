# Debug Guide: Define/Top-5/Write Implementation

## Current Issues & Solutions

### 1. SSE Connection Loop
**Problem**: Backend logs show continuous GET requests to `/define/concepts/:slug/updates`
```
[req] GET /define/concepts/impact/updates ← http://localhost:5173
[req] GET /define/concepts/impact/updates ← http://localhost:5173
...
```

**Root Cause**: 
- Multiple browser tabs open with SSE connections
- Component re-renders causing new connections
- Failed connections immediately reconnecting

**Solution**:
```bash
# 1. Close all browser tabs for frontend/admin
# 2. Check for zombie connections
lsof -i :5173
lsof -i :5174

# 3. Restart frontend if needed
# 4. SSE hook already has 5-second reconnect delay to prevent loops
```

### 2. CORS Blocking Admin Interface
**Problem**: `[CORS] Blocked origin: http://localhost:5175`

**Root Cause**: Admin running on wrong port (5175 instead of 5174)

**Solution**:
- Ensure admin interface runs on port 5174
- Backend CORS config allows: 5173, 5174 (not 5175)
- Check `backend/src/main.ts` lines 22-27 for allowed origins

### 3. Admin Login Issues
**Problem**: Cannot login via admin interface

**Debug Steps**:
```bash
# 1. Test auth endpoint directly
curl -X POST "http://localhost:3000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# 2. Check CSRF token cookie
# Browser DevTools → Application → Cookies
# Look for X-CSRF-Token cookie

# 3. Verify admin role in database
# User must have role: 'ADMIN' to access admin endpoints
```

### 4. Question Context Not Persisting
**Problem**: Question context lost when navigating between pages

**Implementation**:
- URL params: `?questionId=123&slug=language-definition` (primary)
- SessionStorage: `lastQuestionId`, `lastConceptSlug` (fallback)
- Precedence: URL params → sessionStorage → daily question

**Debug**:
```javascript
// Check in browser console
sessionStorage.getItem('lastQuestionId')
sessionStorage.getItem('lastConceptSlug')
new URLSearchParams(window.location.search).get('questionId')
```

## API Endpoint Status

### Public Endpoints (Working)
- `GET /define/concepts/:slug/keywords` - Returns keywords/Top-5
- `GET /define/:slug/top5` - Returns Top-5 questions
- `GET /define/:slug/questions/:id` - Returns question detail
- `GET /define/concepts/:slug/updates` - SSE for live updates

### Admin Endpoints (Requires Auth + ADMIN role)
- `POST /admin/questions` - Create question with single keyword
- `POST /admin/define/:slug/top5` - Set Top-5 questions
- `PUT /define/concepts/:slug/keywords` - Update keywords

## Component Debug Points

### DefineTopicPage.tsx
```typescript
// Line 42-45: Check if keywords are loading
console.log('Keywords data:', keywords);
console.log('Is Top-5 format?', Array.isArray(keywords) && keywords[0]?.questionId);

// Line 60-86: Debug node click handling
const handleNodeClick = (nodeId, nodeData) => {
  console.log('Node clicked:', nodeId, nodeData);
  // Should have data-keyword-id and data-question-id
}
```

### WritePage.tsx
```typescript
// Line 23-24: Check precedence logic
console.log('URL questionId:', urlQuestionId);
console.log('Session questionId:', sessionQuestionId);
console.log('Target questionId:', targetQuestionId);

// Line 41-45: Verify question fetching
console.log('Fetching question:', targetSlug, targetQuestionId);
```

### useConceptUpdates.ts
```typescript
// Line 72-88: SSE error handling
eventSource.onerror = (event) => {
  console.error('SSE error:', event);
  // Check if reconnection loop occurring
}
```

## Quick Debug Commands

```bash
# Check all running processes
ps aux | grep -E "node|npm|vite"

# Monitor backend logs for errors
tail -f backend/logs/*.log

# Test SSE connection
curl -N "http://localhost:3000/define/concepts/language-definition/updates" &
sleep 5
kill %1

# Check port usage
netstat -an | grep -E "3000|5173|5174"

# Clear all browser storage (run in console)
localStorage.clear()
sessionStorage.clear()
document.cookie.split(";").forEach(c => 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
)
```

## Common Fix Procedures

### Reset Everything
```bash
# 1. Stop all services
pkill -f "npm|node|vite"

# 2. Clear node modules (if needed)
cd backend && rm -rf node_modules && npm install
cd ../frontend && rm -rf node_modules && npm install

# 3. Clear browser data
# Chrome: cmd+shift+delete → Clear all

# 4. Restart services
cd backend && npm run dev
cd frontend && npm run dev
cd admin && npm run dev -- --port 5174
```

### Verify Implementation
1. Open http://localhost:5173/define/language-definition
2. Should see "Definition" as center node
3. Click keyword node → opens question detail modal
4. Click "Write" → navigates to /write with context
5. Write page shows selected question banner
6. Submit → returns to define page

## Error Patterns

| Error | Likely Cause | Fix |
|-------|-------------|-----|
| `CORS Blocked origin` | Wrong port or missing origin | Check CORS config in main.ts |
| `401 Unauthorized` | Missing/expired token | Re-login and get new token |
| `Cannot read property 'id' of undefined` | Missing question data | Check API response format |
| `Too many SSE connections` | Tabs left open | Close all tabs, restart |
| `CSRF token mismatch` | Cookie not set/sent | Check cookie settings |

## Logs to Monitor

```bash
# Backend logs
tail -f backend/logs/error.log
tail -f backend/logs/combined.log

# Frontend console (in browser)
# Filter by: "SSE", "question", "define"

# Network tab
# Look for: 404s, 401s, CORS errors
```