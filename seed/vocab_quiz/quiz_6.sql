INSERT INTO vocab_quizzes (id, quiz_number, word_range) VALUES (6, 6, '300~500');

INSERT INTO vocab_questions (id, quiz_id, question_number, sentence, explanation, correct_choice, correct_word_id) VALUES
(51, 6, 1, 'The journalist decided to ( ) deeper into the financial records to uncover any hidden irregularities.', '1. dabble（かじる）、2. delve（掘り下げる）が正解。短文は「そのジャーナリストは隠れた不正を暴くために財務記録をさらに深く掘り下げることにした」の意。3. digress（脱線する）、4. dwindle（減少する）。', 2, 1240),
(52, 6, 2, 'The engineer managed to ( ) an ingenious device that could filter pollutants from the air.', '1. construe（解釈する）、2. condone（容認する）、3. contrive（考案する）が正解。短文は「そのエンジニアは空気から汚染物質を除去できる独創的な装置を考案した」の意。4. concede（認める）。', 3, 1352),
(53, 6, 3, 'Many locals regarded the sudden appearance of ravens in the square as a bad ( ).', '1. omen（前兆）が正解。短文は「多くの地元の人々は広場にカラスが突然現れたのを悪い前兆だとみなした」の意。2. ordeal（厳しい試練）、3. onset（始まり）、4. outcry（抗議の叫び）。', 1, 1354),
(54, 6, 4, 'His severe stutter proved to be a significant ( ) to his career as a public speaker.', '1. momentum（勢い）、2. accolade（称賛）、3. precedent（前例）、4. impediment（障害）が正解。短文は「彼のひどい吃音は演説家としてのキャリアにおける重大な障害となった」の意。', 4, 1274),
(55, 6, 5, 'Volunteers spent the weekend ( ) the neighborhood, urging residents to vote in the upcoming election.', '1. canvassing（訪ねて回る）が正解。短文は「ボランティアたちは週末を費やして近隣を訪ね回り、住民に来たる選挙で投票するよう求めた」の意。2. convening（招集する）、3. conspiring（共謀する）、4. concurring（同意する）。', 1, 1311),
(56, 6, 6, 'He ( ) admitted that he had forgotten their wedding anniversary entirely.', '1. emphatically（断固として）、2. sheepishly（きまり悪そうに）が正解。短文は「彼はきまり悪そうに結婚記念日を完全に忘れていたことを認めた」の意。3. reluctantly（嫌々ながら）、4. vehemently（激しく）。', 2, 1192),
(57, 6, 7, 'The coach ( ) the players to give their utmost effort in the championship match.', '1. reproached（非難した）、2. implored（懇願した）、3. exhorted（強く勧めた）が正解。短文は「コーチは選手たちに決勝戦で最大限の努力をするよう強く勧めた」の意。4. beseeched（嘆願した）。', 3, 1307),
(58, 6, 8, 'The heavy rain began to ( ) the distinction between the river and the surrounding marshland.', '1. bolster（強化する）、2. breach（破る）、3. broach（切り出す）、4. blur（ぼやけさせる）が正解。短文は「大雨が川と周囲の湿地帯との区別をぼやけさせ始めた」の意。', 4, 1264),
(59, 6, 9, 'After a prolonged ( ) of insomnia, she finally sought professional medical advice.', '1. bout（期間、発作）が正解。短文は「長期にわたる不眠の期間の後、彼女はようやく専門的な医学的助言を求めた」の意。2. brunt（矛先）、3. bane（悩みの種）、4. boon（恩恵）。', 1, 1272),
(60, 6, 10, 'Critics dismissed the film as ( ), saying it failed to offer anything original or thought-provoking.', '1. prolific（多作な）、2. austere（厳格な）、3. mediocre（平凡な）が正解。短文は「批評家たちはその映画を平凡だと切り捨て、独創的で考えさせられるものは何もなかったと述べた」の意。4. volatile（不安定な）。', 3, 1276);

INSERT INTO vocab_question_choices (question_id, choice_number, choice_word, choice_meaning) VALUES
(51, 1, 'dabble', 'かじる、手を出す'),
(51, 2, 'delve', '掘り下げる、深く調べる'),
(51, 3, 'digress', '脱線する'),
(51, 4, 'dwindle', '減少する'),
(52, 1, 'construe', '解釈する'),
(52, 2, 'condone', '容認する'),
(52, 3, 'contrive', '考案する'),
(52, 4, 'concede', '認める'),
(53, 1, 'omen', '前兆、前触れ'),
(53, 2, 'ordeal', '厳しい試練'),
(53, 3, 'onset', '始まり'),
(53, 4, 'outcry', '抗議の叫び'),
(54, 1, 'momentum', '勢い'),
(54, 2, 'accolade', '称賛'),
(54, 3, 'precedent', '前例'),
(54, 4, 'impediment', '障害、支障'),
(55, 1, 'canvassing', '訪ねて回ること'),
(55, 2, 'convening', '招集すること'),
(55, 3, 'conspiring', '共謀すること'),
(55, 4, 'concurring', '同意すること'),
(56, 1, 'emphatically', '断固として'),
(56, 2, 'sheepishly', 'きまり悪そうに'),
(56, 3, 'reluctantly', '嫌々ながら'),
(56, 4, 'vehemently', '激しく'),
(57, 1, 'reproached', '非難した'),
(57, 2, 'implored', '懇願した'),
(57, 3, 'exhorted', '強く勧めた'),
(57, 4, 'beseeched', '嘆願した'),
(58, 1, 'bolster', '強化する'),
(58, 2, 'breach', '破る'),
(58, 3, 'broach', '切り出す'),
(58, 4, 'blur', 'ぼやけさせる'),
(59, 1, 'bout', '期間、発作'),
(59, 2, 'brunt', '矛先'),
(59, 3, 'bane', '悩みの種'),
(59, 4, 'boon', '恩恵'),
(60, 1, 'prolific', '多作な'),
(60, 2, 'austere', '厳格な'),
(60, 3, 'mediocre', '平凡な'),
(60, 4, 'volatile', '不安定な');

INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 6, 51 FROM words WHERE word_number = 351;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 6, 52 FROM words WHERE word_number = 463;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 6, 53 FROM words WHERE word_number = 465;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 6, 54 FROM words WHERE word_number = 385;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 6, 55 FROM words WHERE word_number = 422;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 6, 56 FROM words WHERE word_number = 303;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 6, 57 FROM words WHERE word_number = 418;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 6, 58 FROM words WHERE word_number = 375;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 6, 59 FROM words WHERE word_number = 383;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 6, 60 FROM words WHERE word_number = 387;
