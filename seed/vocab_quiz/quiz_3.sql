INSERT INTO vocab_quizzes (id, quiz_number, word_range) VALUES (3, 3, '1~600');

INSERT INTO vocab_questions (id, quiz_id, question_number, sentence, explanation, correct_choice, correct_word_id) VALUES
(21, 3, 1, 'The engineers ( ) tiny sensors into the fabric of the bridge to monitor structural integrity.', '1. extracted（抽出した）、2. suspended（吊り下げた）、3. embedded（埋め込んだ）が正解。短文は「技術者たちは構造的健全性を監視するため橋の素材に小さなセンサーを埋め込んだ」の意。4. draped（覆った）。', 3, 1241),
(22, 3, 2, 'The magician seemed to ( ) a bouquet of flowers out of thin air, delighting the audience.', '1. conjure（魔法のように出す）が正解。短文は「マジシャンは何もないところから花束を出し、観客を喜ばせた」の意。2. salvage（引き揚げる）、3. confiscate（没収する）、4. withhold（差し控える）。', 1, 1134),
(23, 3, 3, 'The organization was founded to combat racial ( ) and promote equality in the workplace.', '1. apathy（無関心）、2. bigotry（偏狭）が正解。短文は「その団体は人種的偏狭と戦い、職場での平等を促進するために設立された」の意。3. nostalgia（郷愁）、4. ambiguity（曖昧さ）。', 2, 119),
(24, 3, 4, 'The patient described the pain in his lower back as absolutely ( ), making it impossible to sleep.', '1. negligible（無視できる）、2. superficial（表面的な）、3. intermittent（断続的な）、4. excruciating（非常に激しい）が正解。短文は「患者は腰痛が非常に激しく眠れないと訴えた」の意。', 4, 671),
(25, 3, 5, 'The principal ( ) the students for repeatedly violating the school''s dress code.', '1. admonished（忠告した）が正解。短文は「校長は制服規則を繰り返し違反した生徒たちに訓戒を与えた」の意。2. commended（称賛した）、3. acquitted（無罪にした）、4. implored（懇願した）。', 1, 1138),
(26, 3, 6, 'She was completely ( ) when her phone rang loudly during the silent prayer ceremony.', '1. gratified（満足した）、2. mortified（恥をかかされた）が正解。短文は「静かな祈りの式典中に携帯が大音量で鳴り、彼女は完全に恥ずかしい思いをした」の意。3. bewildered（当惑した）、4. exhilarated（高揚した）。', 2, 1217),
(27, 3, 7, 'The senator did not make a direct accusation but ( ) that his opponent had accepted bribes.', '1. proclaimed（宣言した）、2. conceded（認めた）、3. insinuated（遠回しに言った）が正解。短文は「上院議員は直接の告発はしなかったが、対立候補が賄賂を受け取ったと遠回しに示唆した」の意。4. reiterated（繰り返した）。', 3, 1310),
(28, 3, 8, 'The couple dreamed of retiring to an ( ) village in the countryside, far from the noise of the city.', '1. austere（厳格な）、2. volatile（不安定な）、3. mundane（平凡な）、4. idyllic（牧歌的な）が正解。短文は「夫妻は都会の喧騒から離れた田舎の牧歌的な村に引退することを夢見ていた」の意。', 4, 105),
(29, 3, 9, 'Funding shortages have been a ( ) problem for public schools in the region for decades.', '1. perennial（いつまでも続く）が正解。短文は「資金不足はその地域の公立学校にとって何十年にもわたる絶え間ない問題であった」の意。2. sporadic（散発的な）、3. transient（一時的な）、4. nominal（名ばかりの）。', 1, 1362),
(30, 3, 10, 'The unexpected victory in the tournament significantly boosted the team''s ( ).', '1. stamina（持久力）、2. morale（士気）が正解。短文は「大会での予想外の勝利がチームの士気を大いに高めた」の意。3. prowess（優れた能力）、4. stature（名声）。', 2, 1119);

INSERT INTO vocab_question_choices (question_id, choice_number, choice_word, choice_meaning) VALUES
(21, 1, 'extracted', '抽出した'),
(21, 2, 'suspended', '吊り下げた'),
(21, 3, 'embedded', '埋め込んだ'),
(21, 4, 'draped', '覆った'),
(22, 1, 'conjure', '魔法のように出す'),
(22, 2, 'salvage', '引き揚げる'),
(22, 3, 'confiscate', '没収する'),
(22, 4, 'withhold', '差し控える'),
(23, 1, 'apathy', '無関心'),
(23, 2, 'bigotry', '偏狭、偏屈な考え'),
(23, 3, 'nostalgia', '郷愁'),
(23, 4, 'ambiguity', '曖昧さ'),
(24, 1, 'negligible', '無視できる'),
(24, 2, 'superficial', '表面的な'),
(24, 3, 'intermittent', '断続的な'),
(24, 4, 'excruciating', '非常に激しい'),
(25, 1, 'admonished', '忠告した、訓戒した'),
(25, 2, 'commended', '称賛した'),
(25, 3, 'acquitted', '無罪にした'),
(25, 4, 'implored', '懇願した'),
(26, 1, 'gratified', '満足した'),
(26, 2, 'mortified', '恥をかかされた'),
(26, 3, 'bewildered', '当惑した'),
(26, 4, 'exhilarated', '高揚した'),
(27, 1, 'proclaimed', '宣言した'),
(27, 2, 'conceded', '認めた'),
(27, 3, 'insinuated', '遠回しに言った'),
(27, 4, 'reiterated', '繰り返した'),
(28, 1, 'austere', '厳格な'),
(28, 2, 'volatile', '不安定な'),
(28, 3, 'mundane', '平凡な'),
(28, 4, 'idyllic', '牧歌的な、のどかな'),
(29, 1, 'perennial', 'いつまでも続く、絶え間ない'),
(29, 2, 'sporadic', '散発的な'),
(29, 3, 'transient', '一時的な'),
(29, 4, 'nominal', '名ばかりの'),
(30, 1, 'stamina', '持久力'),
(30, 2, 'morale', '士気、やる気'),
(30, 3, 'prowess', '優れた能力'),
(30, 4, 'stature', '名声');

INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 3, 21 FROM words WHERE word_number = 352;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 3, 22 FROM words WHERE word_number = 245;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 3, 23 FROM words WHERE word_number = 119;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 3, 24 FROM words WHERE word_number = 195;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 3, 25 FROM words WHERE word_number = 249;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 3, 26 FROM words WHERE word_number = 328;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 3, 27 FROM words WHERE word_number = 421;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 3, 28 FROM words WHERE word_number = 105;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 3, 29 FROM words WHERE word_number = 473;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 3, 30 FROM words WHERE word_number = 230;
