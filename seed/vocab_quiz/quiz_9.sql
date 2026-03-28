INSERT INTO vocab_quizzes (id, quiz_number, word_range) VALUES (9, 9, '300~500');

INSERT INTO vocab_questions (id, quiz_id, question_number, sentence, explanation, correct_choice, correct_word_id) VALUES
(81, 9, 1, 'The refugees survived on ( ) rations of bread and water for weeks before aid finally arrived.', '1. meager（不十分な、乏しい）が正解。短文は「難民たちは援助がようやく届くまで何週間もわずかなパンと水の配給で生き延びた」の意。2. ample（十分な）、3. sporadic（散発的な）、4. surplus（余剰の）。', 1, 1269),
(82, 9, 2, 'Security forces managed to ( ) the assassination plot just hours before the president''s public appearance.', '1. abet（そそのかす）、2. thwart（阻止する）が正解。短文は「治安部隊は大統領の公の場への出席のわずか数時間前に暗殺計画を阻止した」の意。3. expedite（促進する）、4. perpetrate（犯す）。', 2, 1309),
(83, 9, 3, 'The city plans to ( ) the aging waterfront district, transforming it into a vibrant commercial hub.', '1. demolish（取り壊す）、2. evacuate（避難させる）、3. revamp（改修する、刷新する）が正解。短文は「市は老朽化した臨海地区を改修し、活気ある商業の中心地に変貌させる計画だ」の意。4. subsidize（助成する）。', 3, 1259),
(84, 9, 4, 'After months of unsuccessful job hunting, he grew increasingly ( ) about his prospects.', '1. resilient（回復力のある）、2. pragmatic（実用的な）、3. nonchalant（無頓着な）、4. despondent（失望した）が正解。短文は「何ヶ月も就職活動がうまくいかず、彼は自分の見通しについてますます落胆するようになった」の意。', 4, 1386),
(85, 9, 5, 'Many citizens viewed the new curfew as an unnecessary ( ) on their personal freedom.', '1. imposition（押しつけ）が正解。短文は「多くの市民は新しい夜間外出禁止令を個人の自由に対する不要な押しつけだと見なした」の意。2. infringement（侵害）、3. exemption（免除）、4. concession（譲歩）。', 1, 1355),
(86, 9, 6, 'Rescue workers had to ( ) through waist-deep floodwater to reach the stranded villagers.', '1. trudge（とぼとぼ歩く）、2. wade（水の中を歩く）が正解。短文は「救助隊員は取り残された村人のもとへ到達するために腰まである洪水の水の中を歩かなければならなかった」の意。3. scramble（よじ登る）、4. stagger（よろめく）。', 2, 1387),
(87, 9, 7, 'The diplomatic ( ) nearly derailed the peace talks and caused an international incident.', '1. blunder（へま、不手際）が正解。短文は「その外交上の失態は和平交渉を台無しにしかけ、国際問題を引き起こした」の意。2. maneuver（策略）、3. overture（提案）、4. quandary（苦境）。', 1, 1339),
(88, 9, 8, 'She loved to ( ) her designer handbags, making sure everyone in the office noticed them.', '1. hoard（溜め込む）、2. covet（切望する）、3. flaunt（見せびらかす）が正解。短文は「彼女はブランドのハンドバッグを見せびらかすのが好きで、オフィスの全員に気づいてもらえるようにしていた」の意。4. squander（浪費する）。', 3, 1258),
(89, 9, 9, 'The politician made a ( ) attempt to defend the policy, showing no remorse for the controversy it had caused.', '1. meticulous（几帳面な）、2. tentative（暫定的な）、3. prudent（慎重な）、4. brazen（厚かましい）が正解。短文は「その政治家はその政策が引き起こした論争に何の反省も見せず、厚かましくもそれを擁護しようとした」の意。', 4, 1381),
(90, 9, 10, 'The expedition team took three weeks to ( ) the vast desert on foot, enduring extreme heat and sandstorms.', '1. circumvent（回避する）、2. traverse（横切る、越える）が正解。短文は「探検隊は極度の暑さと砂嵐に耐えながら3週間かけて広大な砂漠を徒歩で横断した」の意。3. encompass（包含する）、4. navigate（航行する）。', 2, 1373);

INSERT INTO vocab_question_choices (question_id, choice_number, choice_word, choice_meaning) VALUES
(81, 1, 'meager', '不十分な、乏しい'),
(81, 2, 'ample', '十分な'),
(81, 3, 'sporadic', '散発的な'),
(81, 4, 'surplus', '余剰の'),
(82, 1, 'abet', 'そそのかす'),
(82, 2, 'thwart', '阻止する'),
(82, 3, 'expedite', '促進する'),
(82, 4, 'perpetrate', '犯す'),
(83, 1, 'demolish', '取り壊す'),
(83, 2, 'evacuate', '避難させる'),
(83, 3, 'revamp', '改修する、刷新する'),
(83, 4, 'subsidize', '助成する'),
(84, 1, 'resilient', '回復力のある'),
(84, 2, 'pragmatic', '実用的な'),
(84, 3, 'nonchalant', '無頓着な'),
(84, 4, 'despondent', '失望した、落胆した'),
(85, 1, 'imposition', '押しつけ、無理強い'),
(85, 2, 'infringement', '侵害'),
(85, 3, 'exemption', '免除'),
(85, 4, 'concession', '譲歩'),
(86, 1, 'trudge', 'とぼとぼ歩く'),
(86, 2, 'wade', '水の中を歩く'),
(86, 3, 'scramble', 'よじ登る'),
(86, 4, 'stagger', 'よろめく'),
(87, 1, 'blunder', 'へま、不手際'),
(87, 2, 'maneuver', '策略'),
(87, 3, 'overture', '提案'),
(87, 4, 'quandary', '苦境'),
(88, 1, 'hoard', '溜め込む'),
(88, 2, 'covet', '切望する'),
(88, 3, 'flaunt', '見せびらかす'),
(88, 4, 'squander', '浪費する'),
(89, 1, 'meticulous', '几帳面な'),
(89, 2, 'tentative', '暫定的な'),
(89, 3, 'prudent', '慎重な'),
(89, 4, 'brazen', '厚かましい、図々しい'),
(90, 1, 'circumvent', '回避する'),
(90, 2, 'traverse', '横切る、越える'),
(90, 3, 'encompass', '包含する'),
(90, 4, 'navigate', '航行する');

INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 9, 81 FROM words WHERE word_number = 380;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 9, 82 FROM words WHERE word_number = 420;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 9, 83 FROM words WHERE word_number = 370;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 9, 84 FROM words WHERE word_number = 497;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 9, 85 FROM words WHERE word_number = 466;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 9, 86 FROM words WHERE word_number = 498;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 9, 87 FROM words WHERE word_number = 450;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 9, 88 FROM words WHERE word_number = 369;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 9, 89 FROM words WHERE word_number = 492;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 9, 90 FROM words WHERE word_number = 484;
