INSERT INTO vocab_quizzes (id, quiz_number, word_range) VALUES (10, 10, '300~500');

INSERT INTO vocab_questions (id, quiz_id, question_number, sentence, explanation, correct_choice, correct_word_id) VALUES
(91, 10, 1, 'His ( ) insistence that his theory was the only correct interpretation alienated many of his colleagues.', '1. dogmatic（独断的な）が正解。短文は「自分の理論だけが唯一正しい解釈だという彼の独断的な主張は多くの同僚を遠ざけた」の意。2. pragmatic（実用的な）、3. emphatic（断固とした）、4. sporadic（散発的な）。', 1, 1350),
(92, 10, 2, 'The hurricane wreaked ( ) on the coastal community, destroying homes and infrastructure alike.', '1. turmoil（混乱）、2. havoc（大損害、大混乱）が正解。短文は「そのハリケーンは沿岸のコミュニティに大損害をもたらし、住宅もインフラも同様に破壊した」の意。3. mayhem（大混乱）、4. carnage（大虐殺）。', 2, 1236),
(93, 10, 3, 'Critics dismissed the sequel as a mere ( ) of the original film, lacking any fresh ideas.', '1. parody（パロディ）、2. excerpt（抜粋）、3. rehash（焼き直し）が正解。短文は「批評家たちはその続編を新しいアイデアのないオリジナル映画の単なる焼き直しだと切り捨てた」の意。4. homage（オマージュ）。', 3, 1323),
(94, 10, 4, 'It later ( ) that the CEO had been aware of the safety violations for over a year before they were reported.', '1. ensued（続いて起こった）、2. elapsed（経過した）、3. subsided（収まった）、4. transpired（明らかになった）が正解。短文は「その後、CEOが安全違反について報告される1年以上前から知っていたことが明らかになった」の意。', 4, 1365),
(95, 10, 5, 'The poker player tried to ( ) his opponents into folding by placing an enormous bet.', '1. bluff（はったりをかける）が正解。短文は「そのポーカープレイヤーは巨額のベットを置くことで相手にはったりをかけて降りさせようとした」の意。2. beguile（だます）、3. swindle（詐取する）、4. deceive（欺く）。', 1, 1363),
(96, 10, 6, 'The documentary aims to ( ) viewers about the devastating effects of deforestation on biodiversity.', '1. bewilder（困惑させる）、2. enlighten（啓発する）が正解。短文は「そのドキュメンタリーは森林破壊が生物多様性に及ぼす壊滅的な影響について視聴者を啓発することを目的としている」の意。3. entertain（楽しませる）、4. provoke（挑発する）。', 2, 1253),
(97, 10, 7, 'The ( ) tribes of Central Asia have maintained their traditional way of life for centuries.', '1. nomadic（遊牧の）が正解。短文は「中央アジアの遊牧民族は何世紀にもわたって伝統的な生活様式を維持してきた」の意。2. indigenous（先住の）、3. reclusive（隠遁した）、4. sedentary（定住の）。', 1, 1234),
(98, 10, 8, 'The city has experienced a remarkable ( ) in tourism since the new international airport opened last year.', '1. downturn（低迷）、2. fluctuation（変動）、3. resurgence（復活、再起）が正解。短文は「その都市は昨年新しい国際空港が開港して以来、観光の著しい復活を経験している」の意。4. stagnation（停滞）。', 3, 1239),
(99, 10, 9, 'Public enthusiasm for the project began to ( ) once the true costs became apparent.', '1. surge（急増する）、2. ebb（衰退する）が正解。短文は「本当のコストが明らかになると、そのプロジェクトへの市民の熱意は衰退し始めた」の意。3. fluctuate（変動する）、4. intensify（強まる）。', 2, 1328),
(100, 10, 10, 'The teenager would always ( ) in his chair during dinner, much to his parents'' annoyance.', '1. recline（もたれかかる）、2. fidget（そわそわする）、3. lurch（よろめく）、4. slouch（前かがみになる）が正解。短文は「そのティーンエイジャーは夕食中にいつも椅子で前かがみになり、両親を苛立たせた」の意。', 4, 1358);

INSERT INTO vocab_question_choices (question_id, choice_number, choice_word, choice_meaning) VALUES
(91, 1, 'dogmatic', '独断的な'),
(91, 2, 'pragmatic', '実用的な'),
(91, 3, 'emphatic', '断固とした'),
(91, 4, 'sporadic', '散発的な'),
(92, 1, 'turmoil', '混乱'),
(92, 2, 'havoc', '大損害、大混乱'),
(92, 3, 'mayhem', '大混乱'),
(92, 4, 'carnage', '大虐殺'),
(93, 1, 'parody', 'パロディ'),
(93, 2, 'excerpt', '抜粋'),
(93, 3, 'rehash', '焼き直し'),
(93, 4, 'homage', 'オマージュ'),
(94, 1, 'ensued', '続いて起こった'),
(94, 2, 'elapsed', '経過した'),
(94, 3, 'subsided', '収まった'),
(94, 4, 'transpired', '明らかになった'),
(95, 1, 'bluff', 'はったりをかける'),
(95, 2, 'beguile', 'だます'),
(95, 3, 'swindle', '詐取する'),
(95, 4, 'deceive', '欺く'),
(96, 1, 'bewilder', '困惑させる'),
(96, 2, 'enlighten', '啓発する'),
(96, 3, 'entertain', '楽しませる'),
(96, 4, 'provoke', '挑発する'),
(97, 1, 'nomadic', '遊牧の'),
(97, 2, 'indigenous', '先住の'),
(97, 3, 'reclusive', '隠遁した'),
(97, 4, 'sedentary', '定住の'),
(98, 1, 'downturn', '低迷'),
(98, 2, 'fluctuation', '変動'),
(98, 3, 'resurgence', '復活、再起'),
(98, 4, 'stagnation', '停滞'),
(99, 1, 'surge', '急増する'),
(99, 2, 'ebb', '衰退する'),
(99, 3, 'fluctuate', '変動する'),
(99, 4, 'intensify', '強まる'),
(100, 1, 'recline', 'もたれかかる'),
(100, 2, 'fidget', 'そわそわする'),
(100, 3, 'lurch', 'よろめく'),
(100, 4, 'slouch', '前かがみになる');

INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 10, 91 FROM words WHERE word_number = 461;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 10, 92 FROM words WHERE word_number = 347;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 10, 93 FROM words WHERE word_number = 434;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 10, 94 FROM words WHERE word_number = 476;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 10, 95 FROM words WHERE word_number = 474;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 10, 96 FROM words WHERE word_number = 364;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 10, 97 FROM words WHERE word_number = 345;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 10, 98 FROM words WHERE word_number = 350;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 10, 99 FROM words WHERE word_number = 439;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 10, 100 FROM words WHERE word_number = 469;
