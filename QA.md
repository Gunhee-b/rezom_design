# QA Guide: Define/Top-5/Write Flow

## Shell Commands for Testing

### Setup
```bash
export BASE=http://localhost:3000
# login → TOKEN (reuse your existing method)
```

### 1. Create question with exactly one keyword
```bash
curl -s -X POST "$BASE/questions" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
 -d '{"title":"Test Live Update Question","content":"Body","tags":["t"],"conceptSlug":"language-definition","keywords":["Impact"]}'
```

### 2. Set Top-5
```bash
curl -s -X POST "$BASE/admin/define/language-definition/top5" \
 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
 -d '{"questionIds":[<replace-with-real-ids-up-to-5>] }'
```

### 3. Read public views
```bash
curl "$BASE/define/language-definition/top5"
curl "$BASE/define/concepts/language-definition/keywords"
curl "$BASE/define/language-definition/questions/<one-id>"
```

## Manual Acceptance Criteria

### Admin Question Creation
- [ ] Admin cannot submit without exactly one keyword (UI blocks) and server rejects when invalid.

### Top-5 Management
- [ ] Top-5 saved and persists order; /define shows exactly those nodes around center.
- [ ] /define center node text is "Definition".
- [ ] Changing Top-5 in Admin updates /define after save (or cache purge/SSE).

### Question Detail Flow
- [ ] Clicking a node opens detail "Q" with full admin-authored content.
- [ ] Clicking "Write" on detail shows the same question on /write.

### Compatibility
- [ ] Daily question flow unchanged elsewhere.

## Test Flow Example

1. **Admin creates questions**: Use the curl command to create test questions with single keywords
2. **Admin sets Top-5**: Use the admin curl command to set which questions appear in the define graph
3. **User visits /define/language-definition**: Should see "Definition" center node with 5 keyword nodes around it
4. **User clicks keyword node**: Should open question detail modal with full content
5. **User clicks "Write" in detail**: Should navigate to /write with question context preserved
6. **User writes response**: Should return to /define with proper context after submission

## Verification Points

- **API endpoints return correct data**: Use curl commands to verify data structure
- **UI reflects Top-5 changes**: Graph updates when admin modifies Top-5 selection
- **Context preservation**: Question context flows properly from define → detail → write → back
- **Real-time updates**: SSE updates work when questions/keywords change
- **Fallback behavior**: Daily questions still work in other parts of the app