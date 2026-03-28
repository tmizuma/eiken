INSERT INTO vocab_quizzes (id, quiz_number, word_range) VALUES (8, 8, '300~500');

INSERT INTO vocab_questions (id, quiz_id, question_number, sentence, explanation, correct_choice, correct_word_id) VALUES
(71, 8, 1, 'The government issued an ( ) to the rebel forces, demanding their unconditional surrender within 48 hours.', '1. ultimatum（最後通告）が正解。短文は「政府は反乱軍に最後通告を発し、48時間以内の無条件降伏を要求した」の意。2. affidavit（宣誓供述書）、3. embargo（禁輸）、4. amnesty（恩赦）。', 1, 1221),
(72, 8, 2, 'After weighing the pros and cons, she decided to ( ) for early retirement rather than continue working.', '1. vie（競う）、2. opt（選ぶ）が正解。短文は「利点と欠点を検討した後、彼女は働き続けるよりも早期退職を選ぶことにした」の意。3. atone（償う）、4. vouch（保証する）。', 2, 1229),
(73, 8, 3, 'The governor granted a last-minute ( ), sparing the prisoner from execution just hours before the scheduled time.', '1. reprieve（一時的な猶予）が正解。短文は「知事は土壇場で猶予を与え、予定時刻のわずか数時間前に囚人を処刑から救った」の意。2. pardon（恩赦）、3. verdict（判決）、4. sanction（制裁）。', 1, 1322),
(74, 8, 4, 'With billions of dollars at ( ), the merger negotiations between the two corporations became increasingly tense.', '1. large（大量の）、2. risk（危険）、3. hand（手元に）、4. stake（利害関係）が正解。短文は「数十億ドルの利害関係がかかっており、2社間の合併交渉はますます緊迫した」の意。', 4, 1260),
(75, 8, 5, 'The chairman''s inappropriate ( ) during the memorial service offended many of the grieving attendees.', '1. levity（軽率さ、場違いな陽気さ）が正解。短文は「追悼式での議長の場違いな軽率さは、悲しみに暮れる出席者の多くを不快にした」の意。2. brevity（簡潔さ）、3. gravity（重大さ）、4. novelty（目新しさ）。', 1, 1316),
(76, 8, 6, 'The workers protested against the ( ) wages they received for such physically demanding labor.', '1. exorbitant（法外な）、2. nominal（名目上の）、3. paltry（わずかな）が正解。短文は「労働者たちはそのような肉体的にきつい労働に対して受け取るわずかな賃金に抗議した」の意。4. lucrative（もうかる）。', 3, 1197),
(77, 8, 7, 'Under mounting political pressure, the aging monarch chose to ( ) the throne in favor of his eldest son.', '1. usurp（奪う）、2. abdicate（放棄する）が正解。短文は「高まる政治的圧力の下、高齢の君主は長男に王位を譲ることを選んだ」の意。3. bestow（授ける）、4. reclaim（取り戻す）。', 2, 1356),
(78, 8, 8, 'The research team continued to ( ) with the ethical dilemmas posed by advances in genetic engineering.', '1. tamper（いじくる）、2. tinker（いじくり回す）、3. flounder（もがく）、4. grapple（取り組む）が正解。短文は「研究チームは遺伝子工学の進歩がもたらす倫理的ジレンマに取り組み続けた」の意。', 4, 1376),
(79, 8, 9, 'The ambassador conveyed the president''s deepest ( ) to the families of the victims.', '1. condolences（哀悼）が正解。短文は「大使は犠牲者の家族に大統領の深い哀悼の意を伝えた」の意。2. commendations（表彰）、3. grievances（不満）、4. sentiments（感情）。', 1, 1204),
(80, 8, 10, 'Great teachers ( ) a love of learning in their students that lasts well beyond the classroom.', '1. invoke（発動する）、2. elicit（引き出す）、3. instill（教え込む、植え付ける）が正解。短文は「偉大な教師は教室をはるかに超えて続く学びへの愛を生徒たちに植え付ける」の意。4. extract（抽出する）。', 3, 1227);

INSERT INTO vocab_question_choices (question_id, choice_number, choice_word, choice_meaning) VALUES
(71, 1, 'ultimatum', '最後通告'),
(71, 2, 'affidavit', '宣誓供述書'),
(71, 3, 'embargo', '禁輸'),
(71, 4, 'amnesty', '恩赦'),
(72, 1, 'vie', '競う'),
(72, 2, 'opt', '選ぶ、選択する'),
(72, 3, 'atone', '償う'),
(72, 4, 'vouch', '保証する'),
(73, 1, 'reprieve', '一時的な猶予'),
(73, 2, 'pardon', '恩赦'),
(73, 3, 'verdict', '判決'),
(73, 4, 'sanction', '制裁'),
(74, 1, 'large', '大量の'),
(74, 2, 'risk', '危険'),
(74, 3, 'hand', '手元に'),
(74, 4, 'stake', '利害関係'),
(75, 1, 'levity', '軽率さ、場違いな陽気さ'),
(75, 2, 'brevity', '簡潔さ'),
(75, 3, 'gravity', '重大さ'),
(75, 4, 'novelty', '目新しさ'),
(76, 1, 'exorbitant', '法外な'),
(76, 2, 'nominal', '名目上の'),
(76, 3, 'paltry', 'わずかな'),
(76, 4, 'lucrative', 'もうかる'),
(77, 1, 'usurp', '奪う'),
(77, 2, 'abdicate', '放棄する'),
(77, 3, 'bestow', '授ける'),
(77, 4, 'reclaim', '取り戻す'),
(78, 1, 'tamper', 'いじくる'),
(78, 2, 'tinker', 'いじくり回す'),
(78, 3, 'flounder', 'もがく'),
(78, 4, 'grapple', '取り組む'),
(79, 1, 'condolences', '哀悼、弔意'),
(79, 2, 'commendations', '表彰'),
(79, 3, 'grievances', '不満'),
(79, 4, 'sentiments', '感情'),
(80, 1, 'invoke', '発動する'),
(80, 2, 'elicit', '引き出す'),
(80, 3, 'instill', '教え込む、植え付ける'),
(80, 4, 'extract', '抽出する');

INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 8, 71 FROM words WHERE word_number = 332;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 8, 72 FROM words WHERE word_number = 340;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 8, 73 FROM words WHERE word_number = 433;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 8, 74 FROM words WHERE word_number = 371;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 8, 75 FROM words WHERE word_number = 427;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 8, 76 FROM words WHERE word_number = 308;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 8, 77 FROM words WHERE word_number = 467;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 8, 78 FROM words WHERE word_number = 487;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 8, 79 FROM words WHERE word_number = 315;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 8, 80 FROM words WHERE word_number = 338;
