# Passage DONE Status Implementation

## Database Level
- **Column**: `passages.done` (INTEGER, default 0)
- **Values**: 0 = not done/incomplete, 1 = done/completed
- **Semantics**: Marks when a passage reading/comprehension exercise is completed
- **Index**: No explicit index on this column currently

## Backend Implementation

### API Route: `/api/passages/[id]/done` (POST)
- **Location**: `/app/src/app/api/passages/[id]/done/route.ts`
- **Function**: Toggles the done status
- **Logic**:
  1. Fetch current passage: `SELECT done FROM passages WHERE id = ?`
  2. Calculate new status: `newDone = row.done ? 0 : 1`
  3. Update database: `UPDATE passages SET done = ? WHERE id = ?`
  4. Returns JSON response: `{ done: newDone }`

### API Route: `/api/passages-list` (GET)
- **Location**: `/app/src/app/api/passages-list/route.ts`
- **Query Parameters**:
  - `page` (default 1)
  - `topic` (filter by topic: "政治", "科学", etc., or empty for all)
  - `done` (values: "", "0", "1" for filtering status)
- **Filtering Logic**:
  - `topic = ?` condition if topic is provided
  - `done = ?` condition if done is "0" or "1"
  - Both conditions combined with AND
- **Word Count Calculation**:
  - SQL: `LENGTH(content) - LENGTH(REPLACE(content, ' ', '')) + 1 as word_count`
  - Counts spaces to estimate word count
- **Pagination**: 50 passages per page
- **Returns**:
  - `passages[]`: array with id, title, topic, done, created_at, word_count
  - `totalCount`: total passages matching filters
  - `topicCounts[]`: array of {topic, cnt} for all topics

### API Route: `/api/passages/[id]` (GET)
- **Location**: `/app/src/app/api/passages/[id]/route.ts`
- **Purpose**: Fetches full passage data for quiz page
- **Returns**:
  - `id`, `title`, `content` (with [BLANK] placeholders)
  - `questions[]`: with question_number, question_type, question_text, choices
  - `words[]`: all words in database (for stemmer linking)
  - **Note**: Does NOT include `done` status (quiz page doesn't need it)

## Frontend Implementation

### Passages List Page (`/passages`)
- **Component**: `/app/src/app/passages/page.tsx`
- **State Management**:
  - `passages[]`: fetched passage list
  - `selectedTopic`: current topic filter
  - `doneFilter`: "" (all), "0" (incomplete), or "1" (done)
  - `page`: current page
- **Features**:
  - **Topic Filters**:
    - "すべて" (all) button - shows all
    - Individual topic buttons: "政治" (politics), "科学" (science), "環境" (environment), etc.
    - Each topic shows count: "政治 (15)"
    - Color-coded buttons (different color per topic)
  - **Done Status Filters**:
    - "全て" (all), "未完了" (incomplete), "DONE" (completed)
    - Three-button toggle
  - **Passage Display**:
    - Each passage is a clickable card
    - If done=1: shows green checkmark, grayed out with strikethrough
    - If done=0: normal styling, hover effect
    - Displays: topic badge, word count, created_at date
  - **Pagination**: 50 per page

### Passage Quiz Page (`/passages/[id]`)
- **Component**: `/app/src/app/passages/[id]/page.tsx`
- **Features**:
  - Displays English passage content
  - Quiz panel with 3 questions (multiple choice)
  - Each question is required before submit
  - Timer in header showing elapsed time
  - No interaction with done status on this page

### Passage Result Page (`/passages/[id]/result`)
- **Component**: `/app/src/app/passages/[id]/result/page.tsx`
- **Features**:
  - Shows correct answer count: "X/3 正解" (correct answers)
  - Displays full English content with word highlighting (stemmer-based)
  - Shows Japanese translation
  - Detailed explanation section:
    - For each question: shows user's answer, correct answer, explanation
    - Correct answers highlighted in green
    - Wrong answers highlighted in red
  - List of vocabulary words found in passage (~40-80 words typically)
  - **DoneButton component** in action area
  - Back to list link

### Done Button Component
- **Component**: `/app/src/app/passages/[id]/result/done-button.tsx`
- **Props**: `passageId`, `initialDone` (0 or 1)
- **Behavior**:
  - Client-side state with `useState`
  - Calls `POST /api/passages/{passageId}/done` on click
  - Updates button state based on response
  - Shows different styling:
    - **Not done**: Blue button "完了にする" (Mark as completed)
    - **Done**: Green background "DONE" with border
  - No loading state shown (simple toggle)

## Topic Color Scheme
- Colors defined in both normal and active states
- **Normal colors** (light backgrounds): bg-{color}-100, text-{color}-700
- **Active colors** (dark backgrounds): bg-{color}-600, text-white
- Topics: 政治(red), 経済(yellow), 科学(blue), 環境(green), 教育(purple), 心理(pink), 文化(orange), メディア(indigo), 歴史(amber), 生物(teal), フリー(slate)

## Result Page Data Preparation
- **Server-side word matching** in result page:
  1. Fetches all words from database
  2. Tokenizes passage content: `content.match(/\b[a-zA-Z]+\b/g)`
  3. Creates set of word stems from content
  4. Filters words to only those whose stems match content stems
  5. This set is passed to renderContent utility for linking

## URL Parameters for Filtering
- Base: `/passages`
- By topic: `/passages?topic=科学`
- By done status: `/passages?done=1` (completed) or `/passages?done=0` (incomplete)
- With pagination: `/passages?page=2`
- Combined: `/passages?topic=科学&done=0&page=1`

## Key Features
1. **Toggle behavior**: Simple binary state, no multi-level tracking
2. **Filter integration**: Can filter by both topic and completion status simultaneously
3. **Status persistence**: Visual feedback (checkmark, strikethrough) for done passages
4. **Counts per topic**: Dynamic calculation shown in filter buttons
5. **Word-count estimation**: SQL-based word count for display
6. **Stemmer-based word linking**: Result page intelligently highlights words in passage
