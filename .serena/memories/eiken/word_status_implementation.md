# Word Status Implementation (memorized/learned)

## Database Level
- **Column**: `words.learned` (INTEGER, default 0)
- **Values**: 0 = not learned, 1 = learned/memorized
- **Index**: `idx_words_learned` for efficient filtering

## Backend Implementation

### API Route: `/api/words/[id]/learn` (POST)
- **Location**: `/app/src/app/api/words/[id]/learn/route.ts`
- **Function**: Toggles the learned status
- **Logic**:
  1. Fetch current word with: `SELECT id, learned FROM words WHERE id = ?`
  2. Calculate new status: `newLearned = word.learned ? 0 : 1`
  3. Update database: `UPDATE words SET learned = ? WHERE id = ?`
  4. Returns JSON response: `{ learned: newLearned }`

### API Route: `/api/words` (GET)
- **Location**: `/app/src/app/api/words/route.ts`
- **Query Parameters**:
  - `page` (default 1)
  - `q` (search query for word or meaning)
  - `hide_learned` (="1" to filter)
- **Filtering Logic**:
  - If `hide_learned=1`: adds `learned = 0` to WHERE clause
  - Search applies to: `word LIKE ? OR meaning LIKE ?`
- **Pagination**: 100 words per page
- **Returns**:
  - `words[]`: array of words with id, word_number, word, meaning, learned, passage_count
  - `totalCount`: total matching words

## Frontend Implementation

### Word List Page (`/words`)
- **Component**: `/app/src/app/words/page.tsx`
- **State Management**:
  - `words[]`: fetched word list
  - `hideLearned`: boolean for filter toggle
  - `query`: search input
  - `page`: current page
- **Features**:
  - Search box for word/meaning lookup
  - Toggle checkbox: "覚えた単語を非表示" (hide learned words)
  - Table with columns: No., English word, Meaning, Passage count, Action button
  - Each row shows `opacity-50` styling if learned
  - Toggle button: shows "v" (checkmark) if learned, "覚えた" (learned) if not
  - Pagination with 100 words per page

### Word Detail Page (`/words/[id]`)
- **Component**: `/app/src/app/words/[id]/page.tsx`
- **Features**:
  - Displays full word information (meaning, pronunciation, katakana, examples)
  - Shows related synonyms and antonyms
  - Shows passages containing the word (via stemmer-based matching)
  - **LearnButton component** in top-right
- **Stemmer Integration**:
  - Uses `stemmer` package to match word variants in passages
  - Filters all passages where word stem matches content stems
  - Example: "learn" stems to same form as "learning", "learned", etc.

### Learn Button Component
- **Component**: `/app/src/app/words/[id]/learn-button.tsx`
- **Props**: `wordId`, `initialLearned` (0 or 1)
- **Behavior**:
  - Client-side state with `useState`
  - Calls `POST /api/words/{wordId}/learn` on click
  - Updates button state based on response
  - Shows different styling:
    - **Not learned**: Blue button "覚えた!" (Got it!)
    - **Learned**: Gray button "✓ 覚えた" (checkmark + learned)
  - Disables button during loading

### Toggling Mechanism in List
- **Location**: `words/page.tsx` line 76-82
- **Function**: `toggleLearn(wordId)`
- **Flow**:
  1. POST to `/api/words/{wordId}/learn`
  2. Get response with new `learned` value
  3. Update local state: `setWords(prev => prev.map(w => w.id === wordId ? {...w, learned: data.learned} : w))`
  4. Instant UI feedback without page reload

## URL Parameters for Filtering
- Base: `/words`
- With search: `/words?q=search_term`
- Hide learned: `/words?hide_learned=1`
- With pagination: `/words?page=2`
- Combined: `/words?q=test&hide_learned=1&page=1`

## Key Features
1. **Toggle behavior**: Single status tracked, not multiple levels
2. **Instant update**: Frontend updates immediately without full page reload
3. **Persistent filtering**: Checkbox state preserved in URL params
4. **Search and filter together**: Can search AND hide learned words simultaneously
5. **Passage integration**: Shows word count in passages on word list
6. **Stemmer-based linking**: Word matches account for different forms (learn/learning/learned)
