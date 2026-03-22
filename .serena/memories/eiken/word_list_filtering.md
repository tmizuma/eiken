# Word List Page - Filtering Options & Functionality

## Page Location
`/app/src/app/words/page.tsx` (Client component with Suspense boundary)

## Available Filters

### 1. Search Filter
- **Input**: Text search box ("単語・意味を検索...")
- **Query Parameter**: `q=search_term`
- **Backend Logic** (in `/api/words`):
  ```sql
  WHERE (word LIKE '%{query}%' OR meaning LIKE '%{query}%')
  ```
- **Behavior**:
  - Case-insensitive LIKE matching
  - Matches either English word OR Japanese meaning
  - Applied to base filtered word list
  - Pagination resets to page 1 on new search
- **Example**:
  - Search "test" finds words containing "test" and meanings containing "test"
  - Search "試験" finds meanings containing "試験"

### 2. Hide Learned Filter
- **Control**: Checkbox "覚えた単語を非表示"
- **Query Parameter**: `hide_learned=1` (omitted if unchecked)
- **Backend Logic** (in `/api/words`):
  ```sql
  WHERE learned = 0
  ```
- **Behavior**:
  - Filters out all words where learned=1
  - Checkboxes state is toggled by function `toggleHideLearned()`
  - Resets to page 1 when toggled
  - Can be combined with search filter
- **Visual Effect**:
  - Learned words show with `opacity-50` in table rows
  - Button shows "v" (checkmark) for learned words

### 3. Pagination Filter
- **Control**: "前へ" (previous) and "次へ" (next) buttons
- **Query Parameter**: `page=N` (omitted if page=1)
- **Constants**: `PER_PAGE = 100`
- **Logic**:
  - `offset = (page - 1) * PER_PAGE`
  - `LIMIT 100 OFFSET offset`
- **Display**:
  - Shows record range: "{offset+1}-{Math.min(offset+100, totalCount)} 件中 {totalCount}件"
  - Example: "101-200件中500件" (showing records 101-200 of 500 total)
  - Buttons only appear when relevant (no prev button on page 1, no next on last page)

## Combined Filtering

### How Filters Work Together
1. **SQL WHERE clause construction**:
   - Start with empty conditions array
   - Add search condition if `q` is provided
   - Add hide_learned condition if filter is active
   - Combine with AND: `WHERE (word LIKE ? OR meaning LIKE ?) AND learned = 0`

2. **Order & Limit**:
   - Always ordered by: `ORDER BY word_number`
   - Pagination applied after filtering
   - Both COUNT and SELECT queries apply same filters

### Example Scenarios

**Scenario 1: Search for "water" while hiding learned words**
- URL: `/words?q=water&hide_learned=1`
- SQL: 
  ```sql
  SELECT * FROM words 
  WHERE (word LIKE '%water%' OR meaning LIKE '%water%') AND learned = 0
  ORDER BY word_number
  LIMIT 100 OFFSET 0
  ```
- Result: Only unlearned words containing "water"

**Scenario 2: Second page of results for "試験" without filtering learned**
- URL: `/words?q=試験&page=2`
- SQL:
  ```sql
  SELECT * FROM words 
  WHERE (word LIKE '%試験%' OR meaning LIKE '%試験%')
  ORDER BY word_number
  LIMIT 100 OFFSET 100
  ```
- Result: Words 101-200 matching "試験" in any state

**Scenario 3: Just hide learned words, no search**
- URL: `/words?hide_learned=1`
- SQL:
  ```sql
  SELECT * FROM words 
  WHERE learned = 0
  ORDER BY word_number
  LIMIT 100 OFFSET 0
  ```
- Result: All unlearned words in order

## Data Structure & Display

### Word Object in Response
```typescript
{
  id: number,                    // Database ID
  word_number: number,           // 1-2000 position
  word: string,                  // English word
  meaning: string,               // Japanese meaning
  learned: number,               // 0 or 1
  passage_count: number          // Count from passage_words table
}
```

### Table Columns
1. **No.**: `word_number` - Gray text, width fixed
2. **英単語**: `word` - Linked to `/words/{id}` detail page
3. **意味**: `meaning` - Gray text, shows Japanese meaning
4. **長文**: `passage_count` - Shows as link only if > 0, links to word detail
5. **Action**: Toggle button for learned status

### Learned Word Styling
- Row opacity set to 50% if `learned=1`
- Button shows checkmark "v" if learned
- Button shows "覚えた" if not learned
- Visual distinction helps user recognize already-learned vocabulary

## Frontend Implementation Details

### State Variables (in WordsContent)
```typescript
const page = Math.max(1, Number(searchParams.get("page")) || 1);
const query = searchParams.get("q") || "";
const hideLearnedParam = searchParams.get("hide_learned") === "1";

const [words, setWords] = useState<Word[]>([]);
const [totalCount, setTotalCount] = useState(0);
const [hideLearned, setHideLearned] = useState(hideLearnedParam);
const [searchInput, setSearchInput] = useState(query);
```

### Key Functions
- `fetchWords()`: Fetches from API with current filters
- `handleSearch(e)`: Form submission for search, resets to page 1
- `toggleHideLearned()`: Checkbox handler, resets to page 1
- `navigate(p, q, hl)`: Updates URL with search params and pushes router
- `toggleLearn(wordId)`: POST to learn API, updates local word state

### Effects
- `useEffect` depends on [fetchWords]: Re-fetches when filter/page changes
- `fetchWords` depends on [page, query, hideLearned]: Runs when any change

## Total Pagination Info
- Database has 2000 words total
- At 100 per page: 20 pages maximum
- Record display: Shows current range + total count
- Query params only included if non-default (q present, hide_learned=1, page>1)
