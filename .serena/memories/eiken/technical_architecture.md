# Eiken App - Technical Architecture Summary

## Application Architecture

### Request Flow for Word Learning
1. **User clicks "覚えた" button** on word list or detail page
2. **Frontend** (`LearnButton` or `WordsContent`) calls:
   ```javascript
   POST /api/words/{wordId}/learn
   ```
3. **API Handler** (`route.ts`):
   - Queries current learned status
   - Toggles: `newLearned = word.learned ? 0 : 1`
   - Updates database
   - Returns `{ learned: newLearned }`
4. **Frontend** receives response and updates local state
5. **UI updates** without page reload (instant feedback)

### Request Flow for Passage Completion
1. **User completes quiz and views results**
2. **Result page** loads with `DoneButton` component
3. **User clicks** "完了にする" or "DONE" button
4. **Frontend** calls:
   ```javascript
   POST /api/passages/{passageId}/done
   ```
5. **API Handler**:
   - Queries current done status
   - Toggles: `newDone = row.done ? 0 : 1`
   - Updates database
   - Returns `{ done: newDone }`
6. **Frontend** updates button state
7. **Passage list** shows completion badge on next visit

## Database Query Optimization

### Word Listing with Passage Count
**Challenge**: Need passage count for each word in list view

**Solution**:
1. Fetch words matching filters
2. Collect all word IDs
3. Execute single GROUP BY query:
   ```sql
   SELECT word_id, COUNT(*) as cnt 
   FROM passage_words 
   WHERE word_id IN (?, ?, ...) 
   GROUP BY word_id
   ```
4. Build map: `new Map<word_id, count>`
5. Augment each word object with passage_count

**Efficiency**: One batched query instead of N+1 queries

### Passage Word Extraction in Result
**Challenge**: Display which vocabulary words appear in passage

**Solution**: Server-side approach in result page
1. Fetch all words from database (cached in memory)
2. Tokenize passage: `content.match(/\b[a-zA-Z]+\b/g)`
3. Create set of word stems from content
4. Filter words where stem matches
5. Render with word links using stemmer utility

**Alternative for rendering**: `renderContent` utility uses stemmer to link words

## Stemmer Usage

### What is Stemmer?
- Library: `stemmer` npm package
- Purpose: Reduce words to root form
- Example: "learning" → "learn", "learned" → "learn"
- Allows fuzzy matching of word variants

### Implementation Locations

1. **Word detail page** - Finding passages containing word:
   ```typescript
   const wordStem = stemmer(word.word.toLowerCase());
   const passages = allPassages.filter((p) => {
     const tokens = p.content.match(/\b[a-zA-Z]+\b/g) || [];
     return tokens.some((t) => stemmer(t.toLowerCase()) === wordStem);
   });
   ```

2. **Render content utility** - Highlighting words in passages:
   ```typescript
   const stemMap = new Map<string, WordMapping>();
   for (const w of words) {
     stemMap.set(stemmer(w.word.toLowerCase()), w);
   }
   // Later: match tokens by stem
   const stem = stemmer(token.toLowerCase());
   const matched = stemMap.get(stem);
   ```

## Technology Choices & Trade-offs

### SQLite vs SQL Server/PostgreSQL
- **Pros**: 
  - Single file deployment (no separate DB server)
  - Fast for moderate data (~2000 words, ~100 passages)
  - better-sqlite3 provides synchronous API
- **Cons**: 
  - Limited concurrency in write operations
  - WAL mode helps but still not ideal for high-traffic

### Next.js App Router
- **Pros**:
  - Type-safe API routes with request/response
  - Server components reduce client JS
  - File-based routing
  - Built-in async support
- **Routing Pattern**:
  - `/app/api/**/route.ts` for API endpoints
  - `/app/*/page.tsx` for pages
  - Suspense boundaries for loading states

### Stemmer-based Linking
- **Pros**: 
  - More accurate word highlighting than simple string matching
  - Handles plurals, verb forms naturally
- **Cons**:
  - Slight overhead (minimal for display use)
  - May occasionally match wrong words
- **Alternative rejected**: Exact word matching too restrictive

### Client-side State Updates
- **Pros**:
  - Instant user feedback (no page reload)
  - Better UX for toggle operations
  - Reduces backend load
- **Cons**:
  - If backend update fails silently, UI state becomes inconsistent
  - No error handling shown currently
- **Current approach**: Optimistic updates (assume success)

## Data Consistency Considerations

### Learned Status
- Stored in `words.learned` column
- Updated via atomic UPDATE statement
- No transaction wrapping (could be improved)
- Multiple toggles are safe (idempotent)

### Done Status
- Stored in `passages.done` column
- Similar atomic UPDATE
- Safe for concurrent requests
- No state machine (just 0/1 toggle)

### Related Data (synonyms, antonyms, passage_words)
- Set up with FOREIGN KEY constraints
- CASCADE DELETE on passage/word deletion
- No direct UI for creating/deleting relationships
- Populated via seed SQL files

## Performance Characteristics

### Word Listing (100 items per page)
- SQL: `SELECT * FROM words WHERE ... ORDER BY word_number LIMIT 100 OFFSET ?`
- Indexes: `idx_words_learned` helps with filter
- Passage count: Separate grouped query with IN clause
- Overall: O(n) where n=100 words per page

### Passage Listing (50 items per page)
- SQL: Filter by topic and/or done status, order by ID DESC
- Separate query for topic counts
- Word count calculated via string length formula (not accurate but fast)
- Overall: O(m) where m=50 passages per page

### Word Detail Page
- Load word: O(1) by ID
- Load synonyms: O(k) where k=number of synonyms (~2-5 typically)
- Load antonyms: O(a) where a=number of antonyms (~2-5)
- Load passages: O(p) scan of all passages, then filter with stemmer
  - Expensive operation but acceptable (few passages, cached in memory)

### Result Page
- Load passage and questions: O(1) + O(3) = O(1)
- Load all words for rendering: O(2000) - cached in memory
- Stemming logic: O(p) where p=words in passage (~50-200)
- Overall acceptable for single-use page

## Security Considerations (not implemented)
- No authentication/authorization
- No SQL injection protection (using parameterized queries though)
- No rate limiting on API endpoints
- No CORS configuration (assumes same-origin)
- Database file has no encryption

## Deployment Considerations
- SQLite file location: `../db/master.db` (relative to Next.js root)
- WAL files created on startup: `master.db-wal`, `master.db-shm`
- Must ensure write permissions in db directory
- Single process only (no horizontal scaling)

## Edge Cases Handled
1. **Empty search results**: Shows "該当する単語がありません。"
2. **Word not found on detail page**: Returns 404 via `notFound()`
3. **Passage not found**: Shows "データが見つかりません。"
4. **No related words**: Section hidden if synonyms/antonyms empty
5. **No passages containing word**: Section hidden if empty
6. **Question with no answers yet**: Submit button disabled until all answered

## Future Improvement Opportunities
1. Add error handling and retry logic for API failures
2. Implement undo/redo for learned status
3. Add statistics/analytics (e.g., learning progress)
4. Implement spaced repetition algorithm
5. Add word pronunciation audio
6. Batch operations (mark multiple words as learned)
7. Export/import learned words
8. Sync across devices
9. Add quizzes/flashcards mode
10. Improve word count calculation (use actual tokenization)
