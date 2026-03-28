INSERT INTO vocab_quizzes (id, quiz_number, word_range) VALUES (2, 2, '1~600');

INSERT INTO vocab_questions (id, quiz_id, question_number, sentence, explanation, correct_choice, correct_word_id) VALUES
(11, 2, 1, 'He finally decided to ( ) the subject of a pay raise during his meeting with the manager.', '1. abolish（廃止する）、2. condone（見逃す）、3. broach（切り出す）が正解。短文は「彼はマネージャーとの会議で昇給の話題をついに切り出すことにした」の意。4. forsake（見捨てる）。', 3, 1114),
(12, 2, 2, 'The government agreed to ( ) the refugees who had been stranded abroad for over a decade.', '1. extradite（引き渡す）、2. repatriate（本国へ送還する）が正解。短文は「政府は10年以上海外で足止めされていた難民を本国に送還することに同意した」の意。3. naturalize（帰化させる）、4. deport（国外追放する）。', 2, 1372),
(13, 2, 3, 'Several southern states threatened to ( ) from the union over disagreements about federal policy.', '1. converge（集まる）、2. comply（従う）、3. abstain（棄権する）、4. secede（分離独立する）が正解。短文は「いくつかの南部の州が連邦政策をめぐる対立から連邦からの分離独立を示唆した」の意。', 4, 1446),
(14, 2, 4, 'After the scandal, the executive was ( ) to a minor position in a remote branch office.', '1. relegated（格下げされた）が正解。短文は「スキャンダルの後、その幹部は地方の支店の小さなポストに格下げされた」の意。2. elevated（昇進させた）、3. nominated（指名した）、4. dispatched（派遣した）。', 1, 1130),
(15, 2, 5, 'The military launched a ( ) strike against the enemy''s missile sites before they could be activated.', '1. retrospective（回顧的な）、2. preemptive（先制の）が正解。短文は「軍はミサイル基地が稼働する前に先制攻撃を行った」の意。3. provisional（暫定的な）、4. peripheral（周辺的な）。', 2, 647),
(16, 2, 6, 'The ( ) warehouse on the outskirts of town had been abandoned for over twenty years.', '1. pristine（手つかずの）、2. adjacent（隣接した）、3. derelict（放置された）が正解。短文は「町の外れにあるその放置された倉庫は20年以上も放棄されていた」の意。4. pivotal（中心的な）。', 3, 1268),
(17, 2, 7, 'The lighthearted ( ) between the two colleagues helped relieve the tension in the office.', '1. grievance（不満）、2. scrutiny（精査）、3. turmoil（混乱）、4. banter（軽口）が正解。短文は「二人の同僚の間の軽口がオフィスの緊張を和らげた」の意。', 4, 1283),
(18, 2, 8, 'The bold use of color in the painting served to ( ) the contrast between light and shadow.', '1. accentuate（際立たせる）が正解。短文は「絵画における大胆な色使いが光と影のコントラストを際立たせた」の意。2. diminish（減少させる）、3. obscure（曖昧にする）、4. replicate（複製する）。', 1, 1151),
(19, 2, 9, 'The ( ) mansion had broken windows, a sagging roof, and weeds growing through the floorboards.', '1. opulent（豪華な）、2. dilapidated（荒れ果てた）が正解。短文は「その荒れ果てた邸宅は窓が割れ、屋根がたわみ、床板から雑草が生えていた」の意。3. fortified（要塞化された）、4. secluded（隔離された）。', 2, 1195),
(20, 2, 10, 'After years of hard work, she wanted to slow down and ( ) the simple pleasures of life.', '1. forsake（見捨てる）、2. squander（浪費する）、3. savor（堪能する）が正解。短文は「何年もの努力の後、彼女はペースを落として人生のささやかな楽しみを堪能したかった」の意。4. endure（耐える）。', 3, 1106);

INSERT INTO vocab_question_choices (question_id, choice_number, choice_word, choice_meaning) VALUES
(11, 1, 'abolish', '廃止する'),
(11, 2, 'condone', '見逃す'),
(11, 3, 'broach', '切り出す'),
(11, 4, 'forsake', '見捨てる'),
(12, 1, 'extradite', '引き渡す'),
(12, 2, 'repatriate', '本国へ送還する'),
(12, 3, 'naturalize', '帰化させる'),
(12, 4, 'deport', '国外追放する'),
(13, 1, 'converge', '集まる'),
(13, 2, 'comply', '従う'),
(13, 3, 'abstain', '棄権する'),
(13, 4, 'secede', '分離独立する'),
(14, 1, 'relegated', '格下げされた'),
(14, 2, 'elevated', '昇進させた'),
(14, 3, 'nominated', '指名した'),
(14, 4, 'dispatched', '派遣した'),
(15, 1, 'retrospective', '回顧的な'),
(15, 2, 'preemptive', '先制の'),
(15, 3, 'provisional', '暫定的な'),
(15, 4, 'peripheral', '周辺的な'),
(16, 1, 'pristine', '手つかずの'),
(16, 2, 'adjacent', '隣接した'),
(16, 3, 'derelict', '放置された'),
(16, 4, 'pivotal', '中心的な'),
(17, 1, 'grievance', '不満'),
(17, 2, 'scrutiny', '精査'),
(17, 3, 'turmoil', '混乱'),
(17, 4, 'banter', '軽口、冗談の言い合い'),
(18, 1, 'accentuate', '際立たせる、強調する'),
(18, 2, 'diminish', '減少させる'),
(18, 3, 'obscure', '曖昧にする'),
(18, 4, 'replicate', '複製する'),
(19, 1, 'opulent', '豪華な'),
(19, 2, 'dilapidated', '荒れ果てた、老朽化した'),
(19, 3, 'fortified', '要塞化された'),
(19, 4, 'secluded', '隔離された'),
(20, 1, 'forsake', '見捨てる'),
(20, 2, 'squander', '浪費する'),
(20, 3, 'savor', '堪能する、かみしめる'),
(20, 4, 'endure', '耐える');

INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 2, 11 FROM words WHERE word_number = 225;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 2, 12 FROM words WHERE word_number = 483;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 2, 13 FROM words WHERE word_number = 57;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 2, 14 FROM words WHERE word_number = 241;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 2, 15 FROM words WHERE word_number = 171;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 2, 16 FROM words WHERE word_number = 379;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 2, 17 FROM words WHERE word_number = 394;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 2, 18 FROM words WHERE word_number = 262;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 2, 19 FROM words WHERE word_number = 306;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 2, 20 FROM words WHERE word_number = 217;
