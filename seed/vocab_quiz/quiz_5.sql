INSERT INTO vocab_quizzes (id, quiz_number, word_range) VALUES (5, 5, '1~600');

INSERT INTO vocab_questions (id, quiz_id, question_number, sentence, explanation, correct_choice, correct_word_id) VALUES
(41, 5, 1, 'The mountain road became extremely ( ) after the heavy snowfall, forcing authorities to close it.', '1. scenic（景色のよい）、2. congested（混雑した）、3. treacherous（危険な）が正解。短文は「大雪の後、山道は非常に危険になり、当局はそれを閉鎖せざるを得なかった」の意。4. barren（不毛の）。', 3, 1255),
(42, 5, 2, 'Foreign agents were accused of attempting to ( ) the democratic institutions of the country.', '1. fortify（強化する）、2. subvert（転覆させる）が正解。短文は「外国の工作員がその国の民主的制度を覆そうとしたとして告発された」の意。3. endorse（支持する）、4. inaugurate（就任させる）。', 2, 648),
(43, 5, 3, 'The child had an ( ) ability to predict exactly what her parents were going to say next.', '1. uncanny（不思議な）が正解。短文は「その子供は両親が次に何を言うか正確に予測する不思議な能力を持っていた」の意。2. mediocre（平凡な）、3. innate（生まれつきの）、4. erratic（不規則な）。', 1, 1408),
(44, 5, 4, 'The young athlete''s remarkable performance has ( ) that of many seasoned veterans in the sport.', '1. paralleled（匹敵した）、2. undermined（弱体化させた）、3. complemented（補完した）、4. eclipsed（上回った）が正解。短文は「その若いアスリートの素晴らしいパフォーマンスはスポーツの多くのベテラン選手を上回った」の意。', 4, 1503),
(45, 5, 5, 'The empire sought to ( ) the neighboring territory to expand its access to natural resources.', '1. annex（併合する）が正解。短文は「帝国は天然資源へのアクセスを拡大するために隣接する領土を併合しようとした」の意。2. evacuate（避難させる）、3. partition（分割する）、4. blockade（封鎖する）。', 1, 113),
(46, 5, 6, 'After hiking for hours in the scorching heat, the cold spring water was enough to ( ) their thirst.', '1. stimulate（刺激する）、2. quench（癒す）が正解。短文は「灼熱の中何時間もハイキングした後、冷たい湧き水は彼らの渇きを癒すのに十分だった」の意。3. amplify（増幅する）、4. suppress（抑える）。', 2, 1200),
(47, 5, 7, 'The burglars ( ) the entire house, leaving drawers open and belongings scattered everywhere.', '1. surveyed（調査した）、2. renovated（改装した）、3. ransacked（くまなく探した）が正解。短文は「泥棒は家中をくまなく探し回り、引き出しを開けたまま持ち物をいたるところに散乱させた」の意。4. appraised（評価した）。', 3, 9),
(48, 5, 8, 'Children who grow up in unstable environments often develop a ( ) for risk-taking behavior.', '1. aversion（嫌悪）、2. aptitude（適性）、3. immunity（免疫）、4. propensity（傾向）が正解。短文は「不安定な環境で育った子供はリスクを取る行動への傾向を持ちやすい」の意。', 4, 28),
(49, 5, 9, 'The doctor could barely read the patient''s name, which had been ( ) on the registration form.', '1. scrawled（走り書きされた）が正解。短文は「医師は登録用紙に走り書きされた患者の名前がほとんど読めなかった」の意。2. engraved（刻まれた）、3. illustrated（図解された）、4. transcribed（書き写された）。', 1, 1165),
(50, 5, 10, 'The translation was praised for its remarkable ( ) to the original text, preserving both meaning and tone.', '1. proximity（近さ）、2. fidelity（忠実さ）が正解。短文は「その翻訳は意味と語調の両方を保持し、原文への見事な忠実さで称賛された」の意。3. resemblance（類似）、4. compliance（遵守）。', 2, 1222);

INSERT INTO vocab_question_choices (question_id, choice_number, choice_word, choice_meaning) VALUES
(41, 1, 'scenic', '景色のよい'),
(41, 2, 'congested', '混雑した'),
(41, 3, 'treacherous', '危険な'),
(41, 4, 'barren', '不毛の'),
(42, 1, 'fortify', '強化する'),
(42, 2, 'subvert', '転覆させる'),
(42, 3, 'endorse', '支持する'),
(42, 4, 'inaugurate', '就任させる'),
(43, 1, 'uncanny', '不思議な、神秘的な'),
(43, 2, 'mediocre', '平凡な'),
(43, 3, 'innate', '生まれつきの'),
(43, 4, 'erratic', '不規則な'),
(44, 1, 'paralleled', '匹敵した'),
(44, 2, 'undermined', '弱体化させた'),
(44, 3, 'complemented', '補完した'),
(44, 4, 'eclipsed', '上回った'),
(45, 1, 'annex', '併合する'),
(45, 2, 'evacuate', '避難させる'),
(45, 3, 'partition', '分割する'),
(45, 4, 'blockade', '封鎖する'),
(46, 1, 'stimulate', '刺激する'),
(46, 2, 'quench', '渇きを癒す'),
(46, 3, 'amplify', '増幅する'),
(46, 4, 'suppress', '抑える'),
(47, 1, 'surveyed', '調査した'),
(47, 2, 'renovated', '改装した'),
(47, 3, 'ransacked', 'くまなく探した'),
(47, 4, 'appraised', '評価した'),
(48, 1, 'aversion', '嫌悪'),
(48, 2, 'aptitude', '適性'),
(48, 3, 'immunity', '免疫'),
(48, 4, 'propensity', '傾向、性癖'),
(49, 1, 'scrawled', '走り書きされた'),
(49, 2, 'engraved', '刻まれた'),
(49, 3, 'illustrated', '図解された'),
(49, 4, 'transcribed', '書き写された'),
(50, 1, 'proximity', '近さ'),
(50, 2, 'fidelity', '忠実さ、誠実さ'),
(50, 3, 'resemblance', '類似'),
(50, 4, 'compliance', '遵守');

INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 5, 41 FROM words WHERE word_number = 366;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 5, 42 FROM words WHERE word_number = 172;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 5, 43 FROM words WHERE word_number = 519;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 5, 44 FROM words WHERE word_number = 564;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 5, 45 FROM words WHERE word_number = 113;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 5, 46 FROM words WHERE word_number = 311;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 5, 47 FROM words WHERE word_number = 9;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 5, 48 FROM words WHERE word_number = 28;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 5, 49 FROM words WHERE word_number = 276;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 5, 50 FROM words WHERE word_number = 333;
