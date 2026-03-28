INSERT INTO vocab_quizzes (id, quiz_number, word_range) VALUES (15, 15, '300~500');

INSERT INTO vocab_questions (id, quiz_id, question_number, sentence, explanation, correct_choice, correct_word_id) VALUES
(141, 15, 1, 'The new software module serves as a useful ( ) to the existing system, enhancing its overall functionality.', '1. adjunct（付属物）が正解。短文は「新しいソフトウェアモジュールは既存システムへの有用な付属物として機能し、全体的な機能性を向上させている」の意。2. antithesis（対極）、3. catalyst（触媒）、4. deterrent（抑止力）。', 1, 1249),
(142, 15, 2, 'Economic growth in the region has remained ( ) for years due to a lack of foreign investment.', '1. volatile（不安定な）、2. stagnant（停滞した）が正解。短文は「その地域の経済成長は外国投資の不足により何年も停滞したままだ」の意。3. robust（力強い）、4. resilient（回復力のある）。', 2, 1292),
(143, 15, 3, 'The manager was absolutely ( ) when he discovered that confidential data had been leaked to the press.', '1. elated（有頂天の）、2. bewildered（困惑した）、3. livid（激怒した）が正解。短文は「機密データがマスコミに漏洩したことを知ったとき、管理者は激怒した」の意。4. nonchalant（無頓着な）。', 3, 1377),
(144, 15, 4, 'The memorial ceremony was a fitting ( ) to the soldiers who had sacrificed their lives for the nation.', '1. rebuke（叱責）、2. parody（パロディー）、3. travesty（歪曲）、4. homage（敬意）が正解。短文は「追悼式典は国のために命を捧げた兵士たちへのふさわしい敬意の表れだった」の意。', 4, 1214),
(145, 15, 5, 'The president''s reassuring speech helped to ( ) the public''s fears about the economic crisis.', '1. dispel（払いのける）が正解。短文は「大統領の安心させる演説は経済危機に対する国民の不安を払いのけるのに役立った」の意。2. exacerbate（悪化させる）、3. engender（引き起こす）、4. perpetuate（永続させる）。', 1, 1201),
(146, 15, 6, 'Residents complained about the ( ) noise from the construction site that went on day and night.', '1. intermittent（断続的な）、2. incessant（絶え間のない）が正解。短文は「住民は昼も夜も続く建設現場からの絶え間のない騒音について苦情を述べた」の意。3. subdued（控えめな）、4. negligible（取るに足らない）。', 2, 1285),
(147, 15, 7, 'After the volcanic eruption, the once thriving village was left completely ( ).', '1. congested（混雑した）、2. secluded（人里離れた）、3. desolate（荒れ果てた）が正解。短文は「火山噴火の後、かつて繁栄していた村は完全に荒れ果てた状態になった」の意。4. fortified（要塞化された）。', 3, 1361),
(148, 15, 8, 'The politician''s speech was full of ( ), subtly suggesting his opponent was involved in corruption without saying so directly.', '1. platitude（月並みな言葉）、2. eloquence（雄弁）、3. hyperbole（誇張）、4. innuendo（ほのめかし）が正解。短文は「その政治家の演説はほのめかしに満ちており、直接言わずに相手が汚職に関わっていることを巧みに示唆していた」の意。', 4, 1313),
(149, 15, 9, 'The decision to relocate the office seemed entirely ( ), as no clear rationale was given to the employees.', '1. arbitrary（恣意的な）が正解。短文は「オフィスの移転の決定は完全に恣意的に見え、従業員に明確な理由は示されなかった」の意。2. unanimous（全員一致の）、3. pragmatic（実用的な）、4. judicious（賢明な）。', 1, 1291),
(150, 15, 10, 'The flowers began to ( ) in the scorching afternoon sun, their petals drooping toward the ground.', '1. flourish（繁栄する）、2. wilt（しおれる）が正解。短文は「花々は灼熱の午後の日差しでしおれ始め、花弁が地面に向かって垂れ下がった」の意。3. germinate（発芽する）、4. blossom（花が咲く）。', 2, 1320);

INSERT INTO vocab_question_choices (question_id, choice_number, choice_word, choice_meaning) VALUES
(141, 1, 'adjunct', '付属物、補助的なもの'),
(141, 2, 'antithesis', '対極、正反対'),
(141, 3, 'catalyst', '触媒、きっかけ'),
(141, 4, 'deterrent', '抑止力、妨げ'),
(142, 1, 'volatile', '不安定な、変わりやすい'),
(142, 2, 'stagnant', '停滞した、よどんだ'),
(142, 3, 'robust', '力強い、頑健な'),
(142, 4, 'resilient', '回復力のある、弾力的な'),
(143, 1, 'elated', '有頂天の、大喜びの'),
(143, 2, 'bewildered', '困惑した、当惑した'),
(143, 3, 'livid', '激怒した、怒り狂った'),
(143, 4, 'nonchalant', '無頓着な、平然とした'),
(144, 1, 'rebuke', '叱責、非難'),
(144, 2, 'parody', 'パロディー、風刺'),
(144, 3, 'travesty', '歪曲、茶番'),
(144, 4, 'homage', '敬意、尊敬'),
(145, 1, 'dispel', '払いのける、一掃する'),
(145, 2, 'exacerbate', '悪化させる'),
(145, 3, 'engender', '引き起こす、生じさせる'),
(145, 4, 'perpetuate', '永続させる、不朽にする'),
(146, 1, 'intermittent', '断続的な、間欠的な'),
(146, 2, 'incessant', '絶え間のない、ひっきりなしの'),
(146, 3, 'subdued', '控えめな、抑えた'),
(146, 4, 'negligible', '取るに足らない、微々たる'),
(147, 1, 'congested', '混雑した、密集した'),
(147, 2, 'secluded', '人里離れた、隠れた'),
(147, 3, 'desolate', '荒れ果てた、人けのない'),
(147, 4, 'fortified', '要塞化された、強化された'),
(148, 1, 'platitude', '月並みな言葉、陳腐な表現'),
(148, 2, 'eloquence', '雄弁、能弁'),
(148, 3, 'hyperbole', '誇張、誇張法'),
(148, 4, 'innuendo', 'ほのめかし、当てこすり'),
(149, 1, 'arbitrary', '恣意的な、任意の'),
(149, 2, 'unanimous', '全員一致の'),
(149, 3, 'pragmatic', '実用的な、現実的な'),
(149, 4, 'judicious', '賢明な、思慮深い'),
(150, 1, 'flourish', '繁栄する、栄える'),
(150, 2, 'wilt', 'しおれる、ぐったりする'),
(150, 3, 'germinate', '発芽する、芽生える'),
(150, 4, 'blossom', '花が咲く、開花する');

INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 15, 141 FROM words WHERE word_number = 360;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 15, 142 FROM words WHERE word_number = 403;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 15, 143 FROM words WHERE word_number = 488;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 15, 144 FROM words WHERE word_number = 325;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 15, 145 FROM words WHERE word_number = 312;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 15, 146 FROM words WHERE word_number = 396;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 15, 147 FROM words WHERE word_number = 472;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 15, 148 FROM words WHERE word_number = 424;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 15, 149 FROM words WHERE word_number = 402;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 15, 150 FROM words WHERE word_number = 431;
