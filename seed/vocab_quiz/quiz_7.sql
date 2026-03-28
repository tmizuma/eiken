INSERT INTO vocab_quizzes (id, quiz_number, word_range) VALUES (7, 7, '300~500');

INSERT INTO vocab_questions (id, quiz_id, question_number, sentence, explanation, correct_choice, correct_word_id) VALUES
(61, 7, 1, 'The police used tear gas to ( ) the crowd of protesters blocking the main road.', '1. disperse（追い散らす）が正解。短文は「警察は催涙ガスを使って主要道路を塞いでいる抗議者の群衆を追い散らした」の意。2. detain（拘留する）、3. mobilize（動員する）、4. provoke（挑発する）。', 1, 1235),
(62, 7, 2, 'Her three-year ( ) as ambassador to Japan was marked by significant diplomatic achievements.', '1. tenure（在職期間）、2. stint（期間、任期）が正解。短文は「彼女の3年間の駐日大使としての任期は重要な外交的成果で特徴づけられた」の意。3. sojourn（滞在）、4. sabbatical（研究休暇）。', 2, 1215),
(63, 7, 3, 'She felt ( ) about accepting the promotion, as it would mean relocating far from her aging parents.', '1. adamant（断固とした）、2. complacent（自己満足の）、3. ambivalent（相反する感情を持った）が正解。短文は「彼女はその昇進を受け入れることに相反する感情を持っていた。それは年老いた両親から遠く離れることを意味するからだ」の意。4. indifferent（無関心な）。', 3, 1198),
(64, 7, 4, 'He ( ) his fists in frustration when he learned that his flight had been canceled yet again.', '1. brandished（振り回した）、2. fumbled（手探りした）、3. flailed（振り回した）、4. clenched（握りしめた）が正解。短文は「フライトが再びキャンセルされたと知り、彼は苛立ちで拳を握りしめた」の意。', 4, 1314),
(65, 7, 5, 'The company staged a ( ) trial to train its legal team before the actual court proceedings began.', '1. mock（模擬の）が正解。短文は「会社は実際の裁判手続きが始まる前に法務チームを訓練するために模擬裁判を行った」の意。2. bogus（偽の）、3. token（形だけの）、4. cursory（大ざっぱな）。', 1, 1326),
(66, 7, 6, 'She could not help but ( ) whenever she recalled the embarrassing speech she had given at the banquet.', '1. scoff（あざ笑う）、2. cringe（身が縮む）が正解。短文は「宴会で行った恥ずかしいスピーチを思い出すたびに、彼女は身が縮む思いをせずにはいられなかった」の意。3. sneer（嘲笑する）、4. flinch（たじろぐ）。', 2, 1334),
(67, 7, 7, 'The organization''s finances are entirely ( ); every transaction is documented and publicly accessible.', '1. clandestine（秘密の）、2. provisional（暫定的な）、3. aboveboard（公正明大な）が正解。短文は「その組織の財政は完全に公正明大である。すべての取引が記録され、一般に公開されている」の意。4. tentative（暫定的な）。', 3, 1366),
(68, 7, 8, 'After the earthquake, rescue teams worked tirelessly to search for survivors beneath the ( ).', '1. debris（がれき）、2. rubble（がれき、瓦礫）が正解。短文は「地震の後、救助隊は瓦礫の下の生存者を探すために休みなく働いた」の意。3. remnant（残り）、4. wreckage（残骸）。', 2, 1213),
(69, 7, 9, 'The billionaire''s ( ) lifestyle, complete with a private yacht and multiple mansions, drew public criticism.', '1. opulent（豪華な）が正解。短文は「自家用ヨットや複数の邸宅を備えたその億万長者の豪華な生活様式は世間の批判を招いた」の意。2. frugal（質素な）、3. lavish（ぜいたくな）、4. ostentatious（見せびらかしの）。', 1, 1261),
(70, 7, 10, 'The bombing was widely condemned as an act of ( ) against the civilian population.', '1. clemency（寛大さ）、2. litigation（訴訟）、3. diplomacy（外交）、4. reprisal（報復）が正解。短文は「その爆撃は民間人に対する報復行為として広く非難された」の意。', 4, 1360);

INSERT INTO vocab_question_choices (question_id, choice_number, choice_word, choice_meaning) VALUES
(61, 1, 'disperse', '追い散らす'),
(61, 2, 'detain', '拘留する'),
(61, 3, 'mobilize', '動員する'),
(61, 4, 'provoke', '挑発する'),
(62, 1, 'tenure', '在職期間'),
(62, 2, 'stint', '期間、任期'),
(62, 3, 'sojourn', '滞在'),
(62, 4, 'sabbatical', '研究休暇'),
(63, 1, 'adamant', '断固とした'),
(63, 2, 'complacent', '自己満足の'),
(63, 3, 'ambivalent', '相反する感情を持った'),
(63, 4, 'indifferent', '無関心な'),
(64, 1, 'brandished', '振り回した'),
(64, 2, 'fumbled', '手探りした'),
(64, 3, 'flailed', '激しく振った'),
(64, 4, 'clenched', '握りしめた'),
(65, 1, 'mock', '模擬の'),
(65, 2, 'bogus', '偽の'),
(65, 3, 'token', '形だけの'),
(65, 4, 'cursory', '大ざっぱな'),
(66, 1, 'scoff', 'あざ笑う'),
(66, 2, 'cringe', '身が縮む'),
(66, 3, 'sneer', '嘲笑する'),
(66, 4, 'flinch', 'たじろぐ'),
(67, 1, 'clandestine', '秘密の'),
(67, 2, 'provisional', '暫定的な'),
(67, 3, 'aboveboard', '公正明大な'),
(67, 4, 'tentative', '暫定的な'),
(68, 1, 'debris', '破片、がれき'),
(68, 2, 'rubble', 'がれき、瓦礫'),
(68, 3, 'remnant', '残り'),
(68, 4, 'wreckage', '残骸'),
(69, 1, 'opulent', '豪華な'),
(69, 2, 'frugal', '質素な'),
(69, 3, 'lavish', 'ぜいたくな'),
(69, 4, 'ostentatious', '見せびらかしの'),
(70, 1, 'clemency', '寛大さ'),
(70, 2, 'litigation', '訴訟'),
(70, 3, 'diplomacy', '外交'),
(70, 4, 'reprisal', '報復、仕返し');

INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 7, 61 FROM words WHERE word_number = 346;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 7, 62 FROM words WHERE word_number = 326;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 7, 63 FROM words WHERE word_number = 309;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 7, 64 FROM words WHERE word_number = 425;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 7, 65 FROM words WHERE word_number = 437;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 7, 66 FROM words WHERE word_number = 445;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 7, 67 FROM words WHERE word_number = 477;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 7, 68 FROM words WHERE word_number = 324;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 7, 69 FROM words WHERE word_number = 372;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 7, 70 FROM words WHERE word_number = 471;
