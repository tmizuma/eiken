INSERT INTO vocab_quizzes (id, quiz_number, word_range) VALUES (11, 11, '300~500');

INSERT INTO vocab_questions (id, quiz_id, question_number, sentence, explanation, correct_choice, correct_word_id) VALUES
(101, 11, 1, 'The critic made a ( ) remark about the singer''s off-key performance, drawing laughter from the audience.', '1. derisive（嘲笑的な）が正解。短文は「批評家は歌手の音程が外れた演奏について嘲笑的な発言をし、観客の笑いを誘った」の意。2. cordial（心からの、親切な）、3. emphatic（断固とした）、4. provisional（暫定的な）。', 1, 1338),
(102, 11, 2, 'The witness began to ( ) under the pressure of cross-examination, struggling to maintain composure.', '1. converge（集まる）、2. languish（衰える）、3. falter（口ごもる）が正解。短文は「証人は反対尋問のプレッシャーの下で口ごもり始め、冷静さを保つのに苦労した」の意。4. reiterate（繰り返す）。', 3, 1317),
(103, 11, 3, 'Her parents tried to ( ) her from dropping out of college, urging her to reconsider.', '1. absolve（免除する）、2. dissuade（思いとどまらせる）が正解。短文は「両親は彼女を大学中退から思いとどまらせようとし、再考を促した」の意。3. ostracize（追放する）、4. galvanize（奮起させる）。', 2, 1329),
(104, 11, 4, 'The influence of social media on modern culture has become so ( ) that it is nearly impossible to escape.', '1. lucrative（もうかる）、2. sporadic（散発的な）、3. fraudulent（詐欺の）、4. pervasive（行き渡った）が正解。短文は「現代文化におけるソーシャルメディアの影響は非常に広く行き渡っており、逃れることはほぼ不可能だ」の意。', 4, 1296),
(105, 11, 5, 'The jury''s verdict resulted in the ( ) of the defendant, who had maintained his innocence throughout the trial.', '1. indictment（起訴）、2. probation（保護観察）、3. acquittal（無罪判決）が正解。短文は「陪審の評決は被告の無罪判決という結果になり、被告は裁判中一貫して無実を主張していた」の意。4. litigation（訴訟）。', 3, 1210),
(106, 11, 6, 'The discovery of ancient ruins beneath the city ( ) both archaeologists and the general public.', '1. placated（なだめた）、2. antagonized（敵意を抱かせた）、3. astounded（びっくり仰天させた）が正解。短文は「都市の地下で古代遺跡が発見され、考古学者と一般市民の両方をびっくり仰天させた」の意。4. exonerated（無罪にした）。', 3, 1246),
(107, 11, 7, 'The old mansion had an ( ) appearance, with overgrown weeds and peeling paint on every wall.', '1. ornate（華麗な）、2. unkempt（だらしない）が正解。短文は「その古い邸宅は雑草が生い茂り、すべての壁のペンキがはがれた、だらしない外観だった」の意。3. pristine（手付かずの）、4. austere（質素な）。', 2, 1193),
(108, 11, 8, 'His apology seemed ( ), as if he were merely going through the motions without any real sincerity.', '1. meticulous（几帳面な）、2. vociferous（声高な）、3. tenacious（粘り強い）、4. perfunctory（いい加減な）が正解。短文は「彼の謝罪はいい加減なものに見え、本当の誠意なく形だけのように見えた」の意。', 4, 1371),
(109, 11, 9, 'The ( ) child kept asking questions about everything she saw at the science museum.', '1. inquisitive（好奇心の強い）が正解。短文は「好奇心の強い子供は科学博物館で見たものすべてについて質問し続けた」の意。2. docile（従順な）、3. petulant（気難しい）、4. listless（無気力な）。', 1, 1388),
(110, 11, 10, 'She could not help but ( ) when the nurse inserted the needle into her arm.', '1. gloat（ほくそ笑む）、2. wince（たじろぐ）が正解。短文は「看護師が腕に針を刺したとき、彼女はたじろがずにはいられなかった」の意。3. scoff（あざ笑う）、4. brood（くよくよ考える）。', 2, 1194);

INSERT INTO vocab_question_choices (question_id, choice_number, choice_word, choice_meaning) VALUES
(101, 1, 'derisive', '嘲笑的な、あざけりの'),
(101, 2, 'cordial', '心からの、親切な'),
(101, 3, 'emphatic', '断固とした'),
(101, 4, 'provisional', '暫定的な'),
(102, 1, 'converge', '集まる、合流する'),
(102, 2, 'languish', '衰える、活気を失う'),
(102, 3, 'falter', '口ごもる、勢いがなくなる'),
(102, 4, 'reiterate', '繰り返す'),
(103, 1, 'absolve', '免除する、赦免する'),
(103, 2, 'dissuade', '思いとどまらせる'),
(103, 3, 'ostracize', '追放する、排斥する'),
(103, 4, 'galvanize', '奮起させる'),
(104, 1, 'lucrative', 'もうかる、有利な'),
(104, 2, 'sporadic', '散発的な'),
(104, 3, 'fraudulent', '詐欺の、不正な'),
(104, 4, 'pervasive', '行き渡った、まん延した'),
(105, 1, 'indictment', '起訴、告発'),
(105, 2, 'probation', '保護観察、執行猶予'),
(105, 3, 'acquittal', '無罪判決、無罪放免'),
(105, 4, 'litigation', '訴訟'),
(106, 1, 'placated', 'なだめた'),
(106, 2, 'antagonized', '敵意を抱かせた'),
(106, 3, 'astounded', 'びっくり仰天させた'),
(106, 4, 'exonerated', '無罪にした'),
(107, 1, 'ornate', '華麗な、装飾的な'),
(107, 2, 'unkempt', 'だらしない、手入れされていない'),
(107, 3, 'pristine', '手付かずの、原始のままの'),
(107, 4, 'austere', '質素な、厳格な'),
(108, 1, 'meticulous', '几帳面な、細心の'),
(108, 2, 'vociferous', '声高な、やかましい'),
(108, 3, 'tenacious', '粘り強い、執拗な'),
(108, 4, 'perfunctory', 'いい加減な、通り一遍の'),
(109, 1, 'inquisitive', '好奇心の強い、詮索好きな'),
(109, 2, 'docile', '従順な、おとなしい'),
(109, 3, 'petulant', '気難しい、短気な'),
(109, 4, 'listless', '無気力な、気だるい'),
(110, 1, 'gloat', 'ほくそ笑む'),
(110, 2, 'wince', 'たじろぐ、顔をしかめる'),
(110, 3, 'scoff', 'あざ笑う、嘲る'),
(110, 4, 'brood', 'くよくよ考える');

INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 11, 101 FROM words WHERE word_number = 449;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 11, 102 FROM words WHERE word_number = 428;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 11, 103 FROM words WHERE word_number = 440;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 11, 104 FROM words WHERE word_number = 407;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 11, 105 FROM words WHERE word_number = 321;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 11, 106 FROM words WHERE word_number = 357;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 11, 107 FROM words WHERE word_number = 304;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 11, 108 FROM words WHERE word_number = 482;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 11, 109 FROM words WHERE word_number = 499;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 11, 110 FROM words WHERE word_number = 305;
