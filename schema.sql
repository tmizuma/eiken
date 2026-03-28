-- 英検一級 Reading Part 練習アプリ DB スキーマ
-- SQLite

PRAGMA foreign_keys = ON;

-- ============================================
-- 単語関連テーブル
-- ============================================

-- 単語テーブル
CREATE TABLE words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_number INTEGER NOT NULL UNIQUE,          -- eiken_grade_1.md の通し番号 (1~2000)
    word TEXT NOT NULL UNIQUE,                     -- 英単語
    meaning TEXT NOT NULL,                         -- 日本語の意味
    pronunciation TEXT NOT NULL,                   -- 発音記号 (IPA)
    katakana TEXT NOT NULL,                        -- カタカナ読み
    example1_en TEXT NOT NULL,                     -- 例文1 (英語)
    example1_ja TEXT NOT NULL,                     -- 例文1 (日本語訳)
    example2_en TEXT NOT NULL,                     -- 例文2 (英語)
    example2_ja TEXT NOT NULL,                     -- 例文2 (日本語訳)
    learned INTEGER NOT NULL DEFAULT 0,            -- 覚えたフラグ (0: 未, 1: 済)
    bookmarked INTEGER NOT NULL DEFAULT 0,          -- ブックマークフラグ (0: 未, 1: 済)
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 類義語マッピングテーブル (中間テーブル)
-- word_id の類義語が synonym_word_id
CREATE TABLE word_synonyms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER NOT NULL,
    synonym_word_id INTEGER NOT NULL,
    FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
    FOREIGN KEY (synonym_word_id) REFERENCES words(id) ON DELETE CASCADE,
    UNIQUE(word_id, synonym_word_id),
    CHECK(word_id != synonym_word_id)
);

-- 反語マッピングテーブル (中間テーブル)
-- word_id の反語が antonym_word_id
CREATE TABLE word_antonyms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER NOT NULL,
    antonym_word_id INTEGER NOT NULL,
    FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
    FOREIGN KEY (antonym_word_id) REFERENCES words(id) ON DELETE CASCADE,
    UNIQUE(word_id, antonym_word_id),
    CHECK(word_id != antonym_word_id)
);

-- ============================================
-- 長文・クイズ関連テーブル
-- ============================================

-- 長文テーブル
CREATE TABLE passages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,                           -- 長文タイトル (一覧表示用)
    topic TEXT NOT NULL DEFAULT '',                -- トピック (政治/科学/心理/文化 等)
    content TEXT NOT NULL,                         -- 英文本文 (500~800 words)
    content_ja TEXT NOT NULL,                      -- 英文の日本語訳
    word_range TEXT NOT NULL DEFAULT '',            -- 単語範囲 (例: "1~600")
    done INTEGER NOT NULL DEFAULT 0,              -- 完了フラグ (0: 未, 1: 済)
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 長文の設問テーブル (1長文につき3問: 内容理解2問 + 空所補充1問)
-- 空所補充問題では、passages.content 中の [BLANK] を選択肢の文で置き換える形式
CREATE TABLE passage_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    passage_id INTEGER NOT NULL,
    question_number INTEGER NOT NULL,              -- 問題番号 (1, 2, 3)
    question_type TEXT NOT NULL,                   -- 'comprehension' (内容理解) or 'fill_in_blank' (空所補充)
    question_text TEXT NOT NULL,                   -- 設問文
    explanation TEXT NOT NULL,                     -- 解説文
    correct_choice INTEGER NOT NULL,               -- 正解の選択肢番号 (1~4)
    FOREIGN KEY (passage_id) REFERENCES passages(id) ON DELETE CASCADE,
    UNIQUE(passage_id, question_number),
    CHECK(question_number BETWEEN 1 AND 3),
    CHECK(question_type IN ('comprehension', 'fill_in_blank')),
    CHECK(correct_choice BETWEEN 1 AND 4)
);

-- 選択肢テーブル (1設問につき4択)
CREATE TABLE question_choices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL,
    choice_number INTEGER NOT NULL,                -- 選択肢番号 (1, 2, 3, 4)
    choice_text TEXT NOT NULL,                     -- 選択肢テキスト
    FOREIGN KEY (question_id) REFERENCES passage_questions(id) ON DELETE CASCADE,
    UNIQUE(question_id, choice_number),
    CHECK(choice_number BETWEEN 1 AND 4)
);

-- 長文で使用されている英単語のマッピングテーブル
-- 解説ページで「この長文で使われている eiken_grade_1 の単語一覧」を表示するため
CREATE TABLE passage_words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    passage_id INTEGER NOT NULL,
    word_id INTEGER NOT NULL,
    FOREIGN KEY (passage_id) REFERENCES passages(id) ON DELETE CASCADE,
    FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
    UNIQUE(passage_id, word_id)
);

-- ============================================
-- インデックス
-- ============================================

CREATE INDEX idx_words_word ON words(word);
CREATE INDEX idx_words_meaning ON words(meaning);
CREATE INDEX idx_words_learned ON words(learned);
CREATE INDEX idx_words_bookmarked ON words(bookmarked);
CREATE INDEX idx_word_synonyms_word_id ON word_synonyms(word_id);
CREATE INDEX idx_word_synonyms_synonym_word_id ON word_synonyms(synonym_word_id);
CREATE INDEX idx_word_antonyms_word_id ON word_antonyms(word_id);
CREATE INDEX idx_word_antonyms_antonym_word_id ON word_antonyms(antonym_word_id);
CREATE INDEX idx_passage_questions_passage_id ON passage_questions(passage_id);
CREATE INDEX idx_question_choices_question_id ON question_choices(question_id);
CREATE INDEX idx_passage_words_passage_id ON passage_words(passage_id);
CREATE INDEX idx_passage_words_word_id ON passage_words(word_id);
