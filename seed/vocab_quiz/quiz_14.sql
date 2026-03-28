INSERT INTO vocab_quizzes (id, quiz_number, word_range) VALUES (14, 14, '300~500');

INSERT INTO vocab_questions (id, quiz_id, question_number, sentence, explanation, correct_choice, correct_word_id) VALUES
(131, 14, 1, 'The ( ) businesswoman anticipated the market downturn and shifted her investments well in advance.', '1. astute（鋭い）が正解。短文は「その鋭敏な実業家は市場の低迷を予見し、事前に投資を切り替えた」の意。2. callous（冷淡な）、3. hapless（不運な）、4. brash（生意気な）。', 1, 1315),
(132, 14, 2, 'The court ruling effectively ( ) the contract, rendering all its terms void.', '1. ratified（批准した）、2. nullified（無効にした）が正解。短文は「裁判所の判決は事実上契約を無効にし、すべての条項を無効とした」の意。3. amended（修正した）、4. stipulated（規定した）。', 2, 1298),
(133, 14, 3, 'The only ( ) on the otherwise flawless diamond was a tiny scratch visible under magnification.', '1. veneer（外見）、2. remnant（残り）、3. blemish（欠点、傷）が正解。短文は「その他の点では完璧なダイヤモンドの唯一の傷は、拡大鏡でのみ見える小さな引っかき傷だった」の意。4. patina（緑青）。', 3, 1196),
(134, 14, 4, 'The volunteer''s ( ) dedication to the community earned her widespread recognition and numerous awards.', '1. sporadic（散発的な）、2. tentative（暫定的な）、3. nominal（名目上の）、4. exemplary（模範的な）が正解。短文は「そのボランティアの模範的な地域への献身は広く認められ、多くの賞を受けた」の意。', 4, 1280),
(135, 14, 5, 'Driving without a valid license is a serious ( ) that can result in heavy fines.', '1. infraction（違反）が正解。短文は「有効な免許証なしでの運転は重大な違反であり、高額の罰金につながりうる」の意。2. grievance（苦情）、3. precedent（前例）、4. prerogative（特権）。', 1, 1207),
(136, 14, 6, 'The scientist''s ( ) of the complex theory made it accessible even to non-specialists.', '1. distortion（歪曲）、2. elucidation（解明）が正解。短文は「その科学者による複雑な理論の解明は、専門家でない人にも理解しやすいものにした」の意。3. fabrication（捏造）、4. extrapolation（推定）。', 2, 1382),
(137, 14, 7, 'Living conditions in the refugee camp were ( ), with inadequate sanitation and scarce food supplies.', '1. idyllic（牧歌的な）、2. feasible（実行可能な）、3. deplorable（ひどい）が正解。短文は「難民キャンプの生活環境はひどく、衛生設備が不十分で食料も乏しかった」の意。4. commendable（称賛に値する）。', 3, 1347),
(138, 14, 8, 'The teenager''s act of ( ) against her strict parents included dyeing her hair bright pink.', '1. clemency（寛大さ）、2. prudence（慎重さ）、3. reverence（崇敬）、4. defiance（反抗的態度）が正解。短文は「厳格な両親に対するその10代の少女の反抗的行動には、髪を鮮やかなピンクに染めることも含まれていた」の意。', 4, 1281),
(139, 14, 9, 'Interest on the savings account will ( ) over time, gradually increasing the total balance.', '1. accrue（たまる）が正解。短文は「普通預金口座の利息は時間とともに徐々にたまり、総残高を増やしていく」の意。2. fluctuate（変動する）、3. depreciate（減価する）、4. stagnate（停滞する）。', 1, 1321),
(140, 14, 10, 'The opposition party sought to ( ) the prime minister''s reputation by spreading unverified rumors.', '1. bolster（強化する）、2. denigrate（けなす）が正解。短文は「野党は未確認の噂を広めて首相の評判をけなそうとした」の意。3. vindicate（正当性を証明する）、4. commemorate（記念する）。', 2, 1219);

INSERT INTO vocab_question_choices (question_id, choice_number, choice_word, choice_meaning) VALUES
(131, 1, 'astute', '鋭い、鋭敏な'),
(131, 2, 'callous', '冷淡な、無神経な'),
(131, 3, 'hapless', '不運な、ついていない'),
(131, 4, 'brash', '生意気な、厚かましい'),
(132, 1, 'ratified', '批准した、承認した'),
(132, 2, 'nullified', '無効にした、破棄した'),
(132, 3, 'amended', '修正した、改正した'),
(132, 4, 'stipulated', '規定した、明記した'),
(133, 1, 'veneer', '外見、うわべ'),
(133, 2, 'remnant', '残り、名残'),
(133, 3, 'blemish', '欠点、傷'),
(133, 4, 'patina', '緑青、古びた趣'),
(134, 1, 'sporadic', '散発的な、まれな'),
(134, 2, 'tentative', '暫定的な、仮の'),
(134, 3, 'nominal', '名目上の、ほんのわずかな'),
(134, 4, 'exemplary', '模範的な、りっぱな'),
(135, 1, 'infraction', '違反、侵害'),
(135, 2, 'grievance', '苦情、不満'),
(135, 3, 'precedent', '前例、先例'),
(135, 4, 'prerogative', '特権、権利'),
(136, 1, 'distortion', '歪曲、ゆがみ'),
(136, 2, 'elucidation', '解明、明快な説明'),
(136, 3, 'fabrication', '捏造、でっち上げ'),
(136, 4, 'extrapolation', '推定、外挿'),
(137, 1, 'idyllic', '牧歌的な、平和な'),
(137, 2, 'feasible', '実行可能な、もっともな'),
(137, 3, 'deplorable', 'ひどい、悲惨な'),
(137, 4, 'commendable', '称賛に値する、立派な'),
(138, 1, 'clemency', '寛大さ、慈悲'),
(138, 2, 'prudence', '慎重さ、分別'),
(138, 3, 'reverence', '崇敬、畏敬'),
(138, 4, 'defiance', '反抗的態度、反抗'),
(139, 1, 'accrue', 'たまる、生じる'),
(139, 2, 'fluctuate', '変動する、上下する'),
(139, 3, 'depreciate', '減価する、価値が下がる'),
(139, 4, 'stagnate', '停滞する、よどむ'),
(140, 1, 'bolster', '強化する、支える'),
(140, 2, 'denigrate', 'けなす、中傷する'),
(140, 3, 'vindicate', '正当性を証明する'),
(140, 4, 'commemorate', '記念する、追悼する');

INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 14, 131 FROM words WHERE word_number = 426;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 14, 132 FROM words WHERE word_number = 409;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 14, 133 FROM words WHERE word_number = 307;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 14, 134 FROM words WHERE word_number = 392;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 14, 135 FROM words WHERE word_number = 318;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 14, 136 FROM words WHERE word_number = 493;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 14, 137 FROM words WHERE word_number = 458;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 14, 138 FROM words WHERE word_number = 391;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 14, 139 FROM words WHERE word_number = 432;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 14, 140 FROM words WHERE word_number = 330;
