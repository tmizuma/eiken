INSERT INTO vocab_quizzes (id, quiz_number, word_range) VALUES (4, 4, '1~600');

INSERT INTO vocab_questions (id, quiz_id, question_number, sentence, explanation, correct_choice, correct_word_id) VALUES
(31, 4, 1, 'Working mothers often have to ( ) the demands of their career and family responsibilities.', '1. delegate（委任する）、2. juggle（やり繰りする）が正解。短文は「働く母親はしばしばキャリアと家庭の責任の両立をやり繰りしなければならない」の意。3. consolidate（統合する）、4. relinquish（放棄する）。', 2, 1539),
(32, 4, 2, 'The bright neon sign on the quiet residential street was considered ( ) by the neighbors.', '1. discreet（控えめな）、2. inconspicuous（目立たない）、3. obtrusive（押しつけがましい）が正解。短文は「静かな住宅街の派手なネオンサインは近隣住民から押しつけがましいとみなされた」の意。4. subdued（抑えた）。', 3, 668),
(33, 4, 3, 'The smell of freshly baked bread ( ) the entire building, making everyone hungry.', '1. permeated（浸透した）が正解。短文は「焼きたてのパンの香りが建物全体に行き渡り、全員を空腹にさせた」の意。2. evaporated（蒸発した）、3. contracted（収縮した）、4. fluctuated（変動した）。', 1, 1135),
(34, 4, 4, 'The driver had to ( ) sharply to avoid hitting the deer that suddenly appeared on the road.', '1. accelerate（加速する）、2. brake（ブレーキをかける）、3. reverse（後退する）、4. swerve（急に向きを変える）が正解。短文は「運転手は突然道路に現れた鹿をよけるために急にハンドルを切らなければならなかった」の意。', 4, 1300),
(35, 4, 5, 'The ( ) soldiers continued fighting despite being heavily outnumbered by the enemy forces.', '1. valiant（勇敢な）が正解。短文は「勇敢な兵士たちは敵に大幅に数で劣りながらも戦い続けた」の意。2. reluctant（渋る）、3. complacent（自己満足の）、4. negligent（怠慢な）。', 1, 1090),
(36, 4, 6, 'The economic crisis triggered a mass ( ) of skilled workers from the country to find employment abroad.', '1. influx（流入）、2. exodus（大量流出）が正解。短文は「経済危機により、海外で職を求める熟練労働者の大量流出が起きた」の意。3. upheaval（大変動）、4. impasse（行き詰まり）。', 2, 1456),
(37, 4, 7, 'The morning fog began to ( ) as the sun rose higher, revealing the beautiful valley below.', '1. intensify（強まる）、2. accumulate（蓄積する）、3. dissipate（消え去る）が正解。短文は「太陽が高く昇るにつれて朝霧が消え去り、下の美しい谷が姿を現した」の意。4. condense（凝縮する）。', 3, 1244),
(38, 4, 8, 'The suspect''s alibi sounded ( ) enough to convince the jury of his innocence.', '1. dubious（疑わしい）、2. absurd（ばかげた）、3. ambiguous（曖昧な）、4. plausible（もっともらしい）が正解。短文は「容疑者のアリバイは陪審員に無実を確信させるほどもっともらしく聞こえた」の意。', 4, 1423),
(39, 4, 9, 'The heavy fines are intended to serve as a ( ) against illegal dumping of industrial waste.', '1. deterrent（阻止するもの）が正解。短文は「高額の罰金は産業廃棄物の不法投棄に対する抑止力として機能することを意図している」の意。2. catalyst（触媒）、3. incentive（動機）、4. remedy（救済策）。', 1, 657),
(40, 4, 10, 'The ruling party was divided into rival ( ) that could not agree on the direction of economic policy.', '1. coalition（連合）、2. faction（派閥）が正解。短文は「与党は経済政策の方向性で合意できない対立する派閥に分裂していた」の意。3. consortium（共同事業体）、4. constituency（選挙区）。', 2, 1431);

INSERT INTO vocab_question_choices (question_id, choice_number, choice_word, choice_meaning) VALUES
(31, 1, 'delegate', '委任する'),
(31, 2, 'juggle', 'やり繰りする'),
(31, 3, 'consolidate', '統合する'),
(31, 4, 'relinquish', '放棄する'),
(32, 1, 'discreet', '控えめな'),
(32, 2, 'inconspicuous', '目立たない'),
(32, 3, 'obtrusive', '押しつけがましい'),
(32, 4, 'subdued', '抑えた'),
(33, 1, 'permeated', '浸透した'),
(33, 2, 'evaporated', '蒸発した'),
(33, 3, 'contracted', '収縮した'),
(33, 4, 'fluctuated', '変動した'),
(34, 1, 'accelerate', '加速する'),
(34, 2, 'brake', 'ブレーキをかける'),
(34, 3, 'reverse', '後退する'),
(34, 4, 'swerve', '急に向きを変える'),
(35, 1, 'valiant', '勇敢な、勇ましい'),
(35, 2, 'reluctant', '渋る'),
(35, 3, 'complacent', '自己満足の'),
(35, 4, 'negligent', '怠慢な'),
(36, 1, 'influx', '流入'),
(36, 2, 'exodus', '大量流出'),
(36, 3, 'upheaval', '大変動'),
(36, 4, 'impasse', '行き詰まり'),
(37, 1, 'intensify', '強まる'),
(37, 2, 'accumulate', '蓄積する'),
(37, 3, 'dissipate', '消え去る'),
(37, 4, 'condense', '凝縮する'),
(38, 1, 'dubious', '疑わしい'),
(38, 2, 'absurd', 'ばかげた'),
(38, 3, 'ambiguous', '曖昧な'),
(38, 4, 'plausible', 'もっともらしい'),
(39, 1, 'deterrent', '阻止するもの、抑止力'),
(39, 2, 'catalyst', '触媒'),
(39, 3, 'incentive', '動機'),
(39, 4, 'remedy', '救済策'),
(40, 1, 'coalition', '連合'),
(40, 2, 'faction', '派閥、党派'),
(40, 3, 'consortium', '共同事業体'),
(40, 4, 'constituency', '選挙区');

INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 4, 31 FROM words WHERE word_number = 600;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 4, 32 FROM words WHERE word_number = 192;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 4, 33 FROM words WHERE word_number = 246;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 4, 34 FROM words WHERE word_number = 411;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 4, 35 FROM words WHERE word_number = 201;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 4, 36 FROM words WHERE word_number = 67;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 4, 37 FROM words WHERE word_number = 355;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 4, 38 FROM words WHERE word_number = 534;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 4, 39 FROM words WHERE word_number = 181;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 4, 40 FROM words WHERE word_number = 542;
