# Eiken (英検一級 Reading Practice) - Project Overview

## Project Description
This is a web application for EIKEN Grade 1 (英検一級) reading comprehension practice. It includes vocabulary learning and reading comprehension exercises.

## Tech Stack
- **Frontend**: Next.js 16.2.0 (App Router) with React 19.2.4, TypeScript
- **Database**: SQLite (better-sqlite3)
- **Styling**: Tailwind CSS with @tailwindcss/postcss
- **Utilities**: stemmer (word stemming for linking word occurrences)
- **Deployment**: Node.js based

## Database Schema (SQLite)

### Core Tables:

1. **words** - Vocabulary words (2000 words total)
   - id (PK, auto-increment)
   - word_number (1-2000, unique)
   - word (English word)
   - meaning (Japanese meaning)
   - pronunciation (IPA format)
   - katakana (katakana reading)
   - example1_en, example1_ja (example sentence 1)
   - example2_en, example2_ja (example sentence 2)
   - **learned (0/1 flag)** - marks words as memorized
   - created_at

2. **word_synonyms** - Many-to-many mapping of synonyms
   - word_id, synonym_word_id (foreign keys to words)
   - Unique constraint prevents duplicate mappings

3. **word_antonyms** - Many-to-many mapping of antonyms
   - word_id, antonym_word_id (foreign keys to words)
   - Similar structure to word_synonyms

4. **passages** - Reading comprehension passages
   - id (PK)
   - title, topic (e.g., "政治", "科学")
   - content (English text, ~500-800 words)
   - content_ja (Japanese translation)
   - **done (0/1 flag)** - marks passages as completed
   - created_at

5. **passage_questions** - Questions for each passage (3 per passage)
   - id (PK)
   - passage_id (FK)
   - question_number (1, 2, or 3)
   - question_type ('comprehension' or 'fill_in_blank')
   - question_text, explanation
   - correct_choice (1-4)

6. **question_choices** - Multiple choice options (4 per question)
   - id (PK)
   - question_id (FK)
   - choice_number (1-4)
   - choice_text

7. **passage_words** - Maps which words appear in which passages
   - passage_id, word_id (FKs)
   - Used for displaying related words in passage explanations

### Indexes:
- idx_words_word, idx_words_meaning, idx_words_learned
- idx_word_synonyms_word_id, idx_word_synonyms_synonym_word_id
- idx_word_antonyms_word_id, idx_word_antonyms_antonym_word_id
- idx_passage_questions_passage_id, idx_question_choices_question_id
- idx_passage_words_passage_id, idx_passage_words_word_id

## Project Structure

```
app/src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (home/dashboard)
│   ├── words/
│   │   ├── page.tsx (word list page)
│   │   └── [id]/
│   │       ├── page.tsx (word detail page)
│   │       └── learn-button.tsx
│   ├── passages/
│   │   ├── page.tsx (passage list page)
│   │   └── [id]/
│   │       ├── page.tsx (passage quiz page)
│   │       └── result/
│   │           ├── page.tsx (results/explanation page)
│   │           └── done-button.tsx
│   └── api/
│       ├── words/
│       │   ├── route.ts (GET - list words with filtering)
│       │   └── [id]/learn/route.ts (POST - toggle learned status)
│       ├── passages/
│       │   ├── [id]/route.ts (GET - fetch passage data)
│       │   └── [id]/done/route.ts (POST - toggle done status)
│       └── passages-list/route.ts (GET - list passages with filtering)
└── lib/
    ├── db.ts (database initialization)
    └── render-content.tsx (utility for rendering content with word links)
```
