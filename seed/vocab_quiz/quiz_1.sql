INSERT INTO vocab_quizzes (id, quiz_number, word_range) VALUES (1, 1, '1~600');

INSERT INTO vocab_questions (id, quiz_id, question_number, sentence, explanation, correct_choice, correct_word_id) VALUES
(1, 1, 1, 'The comedian''s joke was taken as a personal ( ) by the politician, who stormed out of the event.', '1. affront（侮辱）が正解。短文は「コメディアンの冗談は政治家にとって個人的な侮辱と受け取られた」の意。2. artifact（人工遺物）、3. ailment（軽い病気）、4. alliance（同盟）。', 1, 1461),
(2, 1, 2, 'The activist tried to ( ) the public into demanding stricter environmental regulations.', '1. garnish（飾る）、2. goad（駆り立てる）が正解。短文は「活動家はより厳格な環境規制を求めるよう大衆を駆り立てようとした」の意。3. grapple（取り組む）、4. galvanize（刺激する）。', 2, 1402),
(3, 1, 3, 'The ( ) of angry protesters outside the parliament building could be heard from several blocks away.', '1. quarrel（口論）、2. nuance（ニュアンス）、3. clamor（騒音、騒ぎ）が正解。短文は「議事堂の外で怒った抗議者たちの騒ぎが数ブロック先からも聞こえた」の意。4. candor（率直さ）。', 3, 32),
(4, 1, 4, 'The teacher issued a severe ( ) to the students who had been caught cheating on the exam.', '1. compliment（褒め言葉）、2. increment（増加）、3. prognosis（予後）、4. reprimand（叱責）が正解。短文は「教師は試験でカンニングが発覚した生徒たちに厳しい叱責を行った」の意。', 4, 635),
(5, 1, 5, 'The manager ( ) dismissed the employee''s suggestion without even considering it.', '1. brusquely（ぶっきらぼうに）が正解。短文は「マネージャーは従業員の提案を考慮もせずぶっきらぼうに退けた」の意。2. graciously（丁重に）、3. tentatively（暫定的に）、4. profusely（豊富に）。', 1, 1398),
(6, 1, 6, 'The United Nations imposed a trade ( ) on the country in response to its nuclear weapons program.', '1. subsidy（補助金）、2. embargo（通商停止）が正解。短文は「国連はその国の核兵器計画に対し貿易禁止を課した」の意。3. dividend（配当金）、4. tariff（関税）。', 2, 1263),
(7, 1, 7, 'Many consumers are willing to pay a ( ) for organic produce because they believe it is healthier.', '1. deficit（赤字）、2. rebate（割戻し）、3. premium（割増金）が正解。短文は「多くの消費者はオーガニック製品の方が健康的だと信じ、割増金を払ってもいいと思っている」の意。4. quota（割り当て）。', 3, 1223),
(8, 1, 8, 'Years of research finally ( ) in a groundbreaking discovery that changed the field of medicine.', '1. fluctuated（変動した）、2. deteriorated（悪化した）、3. stagnated（停滞した）、4. culminated（最高潮に達した）が正解。短文は「何年もの研究がついに画期的な発見に結実し、医学の分野を変えた」の意。', 4, 139),
(9, 1, 9, 'The hikers found themselves in a dangerous ( ) when the bridge they needed to cross collapsed.', '1. predicament（窮地）が正解。短文は「ハイカーたちは渡る必要のあった橋が崩壊し、危険な窮地に陥った」の意。2. spectacle（光景）、3. endeavor（努力）、4. jurisdiction（管轄）。', 1, 653),
(10, 1, 10, 'She ( ) left the confidential document on her desk, where anyone could see it.', '1. deliberately（故意に）、2. inadvertently（うっかり）が正解。短文は「彼女はうっかり機密文書を誰でも見られる机の上に置いてしまった」の意。3. meticulously（几帳面に）、4. adamantly（断固として）。', 2, 138);

INSERT INTO vocab_question_choices (question_id, choice_number, choice_word, choice_meaning) VALUES
(1, 1, 'affront', '侮辱'),
(1, 2, 'artifact', '人工遺物'),
(1, 3, 'ailment', '軽い病気'),
(1, 4, 'alliance', '同盟'),
(2, 1, 'garnish', '飾る'),
(2, 2, 'goad', 'けしかける、駆り立てる'),
(2, 3, 'grapple', '取り組む'),
(2, 4, 'galvanize', '刺激する'),
(3, 1, 'quarrel', '口論'),
(3, 2, 'nuance', 'ニュアンス'),
(3, 3, 'clamor', '騒音、騒ぎ'),
(3, 4, 'candor', '率直さ'),
(4, 1, 'compliment', '褒め言葉'),
(4, 2, 'increment', '増加'),
(4, 3, 'prognosis', '予後'),
(4, 4, 'reprimand', '叱責'),
(5, 1, 'brusquely', 'ぶっきらぼうに'),
(5, 2, 'graciously', '丁重に'),
(5, 3, 'tentatively', '暫定的に'),
(5, 4, 'profusely', '豊富に'),
(6, 1, 'subsidy', '補助金'),
(6, 2, 'embargo', '通商停止、貿易禁止'),
(6, 3, 'dividend', '配当金'),
(6, 4, 'tariff', '関税'),
(7, 1, 'deficit', '赤字'),
(7, 2, 'rebate', '割戻し'),
(7, 3, 'premium', '割増金、プレミアム'),
(7, 4, 'quota', '割り当て'),
(8, 1, 'fluctuated', '変動した'),
(8, 2, 'deteriorated', '悪化した'),
(8, 3, 'stagnated', '停滞した'),
(8, 4, 'culminated', '最高潮に達した'),
(9, 1, 'predicament', '窮地、困難な状況'),
(9, 2, 'spectacle', '光景'),
(9, 3, 'endeavor', '努力'),
(9, 4, 'jurisdiction', '管轄'),
(10, 1, 'deliberately', '故意に'),
(10, 2, 'inadvertently', 'うっかり、不注意に'),
(10, 3, 'meticulously', '几帳面に'),
(10, 4, 'adamantly', '断固として');

INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 1, 1 FROM words WHERE word_number = 72;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 1, 2 FROM words WHERE word_number = 513;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 1, 3 FROM words WHERE word_number = 32;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 1, 4 FROM words WHERE word_number = 159;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 1, 5 FROM words WHERE word_number = 509;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 1, 6 FROM words WHERE word_number = 374;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 1, 7 FROM words WHERE word_number = 334;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 1, 8 FROM words WHERE word_number = 139;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 1, 9 FROM words WHERE word_number = 177;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 1, 10 FROM words WHERE word_number = 138;
