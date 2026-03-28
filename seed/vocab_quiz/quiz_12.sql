INSERT INTO vocab_quizzes (id, quiz_number, word_range) VALUES (12, 12, '300~500');

INSERT INTO vocab_questions (id, quiz_id, question_number, sentence, explanation, correct_choice, correct_word_id) VALUES
(111, 12, 1, 'The patient began to ( ) in discomfort as the dentist prepared the drill.', '1. squirm（身をよじる）が正解。短文は「歯科医がドリルを準備するのを見て、患者は不快感から身をよじり始めた」の意。2. lurch（よろめく）、3. recline（もたれかかる）、4. stagger（よろめく）。', 1, 1364),
(112, 12, 2, 'The committee requested that only ( ) information be included in the final report.', '1. ambiguous（曖昧な）、2. pertinent（関係のある）が正解。短文は「委員会は最終報告書には関係のある情報だけを含めるよう求めた」の意。3. redundant（余分な）、4. confidential（機密の）。', 2, 1290),
(113, 12, 3, 'The mediator worked tirelessly to ( ) the opposing factions before the dispute escalated further.', '1. subjugate（征服する）、2. reprimand（叱責する）、3. conciliate（なだめる）が正解。短文は「調停者は紛争がさらに激化する前に、対立する派閥をなだめるために精力的に取り組んだ」の意。4. incriminate（罪を負わせる）。', 3, 1370),
(114, 12, 4, 'Only the most ( ) wine connoisseurs could detect the subtle differences between the two vintages.', '1. impetuous（衝動的な）、2. ostentatious（これ見よがしの）、3. complacent（自己満足した）、4. discerning（洞察力のある）が正解。短文は「最も目の肥えたワイン通だけが2つのヴィンテージの微妙な違いを見分けることができた」の意。', 4, 1368),
(115, 12, 5, 'The ( ) professor was invited to deliver the keynote address at the international conference.', '1. eminent（高名な）が正解。短文は「その高名な教授は国際会議で基調講演を行うよう招かれた」の意。2. negligent（怠慢な）、3. dormant（休眠状態の）、4. transient（一時的な）。', 1, 1367),
(116, 12, 6, 'A valid passport is ( ) for international travel; without one, you cannot cross the border.', '1. peripheral（周辺の）、2. obsolete（時代遅れの）、3. requisite（必要不可欠な）が正解。短文は「国際旅行には有効なパスポートが必要不可欠であり、それなしでは国境を越えることができない」の意。4. nominal（名目上の）。', 3, 1279),
(117, 12, 7, 'The politician publicly ( ) the allegations of corruption, calling them baseless fabrications.', '1. corroborated（裏付けた）、2. repudiated（否認した）が正解。短文は「その政治家は汚職の申し立てを公に否認し、根拠のない捏造だと述べた」の意。3. divulged（暴露した）、4. substantiated（立証した）。', 2, 1330),
(118, 12, 8, 'Investigators determined that the fraud had been ( ) by a senior executive within the company.', '1. mitigated（緩和した）、2. sanctioned（承認した）、3. perpetrated（犯した）が正解。短文は「捜査官はその詐欺が社内の上級幹部によって犯されたと断定した」の意。4. arbitrated（仲裁した）。', 3, 1301),
(119, 12, 9, 'The ( ) teenager towered over his classmates, standing nearly two meters tall.', '1. lanky（やせてひょろっとした）が正解。短文は「そのやせてひょろっとした10代の少年はクラスメートの上にそびえ立ち、身長は2メートル近くあった」の意。2. burly（たくましい）、3. stocky（ずんぐりした）、4. scrawny（やせこけた）。', 1, 1359),
(120, 12, 10, 'The puppies ( ) across the garden the moment the gate was opened.', '1. trudged（とぼとぼ歩いた）、2. prowled（うろついた）、3. meandered（ぶらぶら歩いた）、4. scampered（すばやく走った）が正解。短文は「門が開けられた瞬間、子犬たちは庭をすばやく走り回った」の意。', 4, 1384);

INSERT INTO vocab_question_choices (question_id, choice_number, choice_word, choice_meaning) VALUES
(111, 1, 'squirm', '身をよじる、もがく'),
(111, 2, 'lurch', 'よろめく、急に傾く'),
(111, 3, 'recline', 'もたれかかる、横たわる'),
(111, 4, 'stagger', 'よろめく、ふらつく'),
(112, 1, 'ambiguous', '曖昧な、多義的な'),
(112, 2, 'pertinent', '関係のある、適切な'),
(112, 3, 'redundant', '余分な、冗長な'),
(112, 4, 'confidential', '機密の、秘密の'),
(113, 1, 'subjugate', '征服する、従属させる'),
(113, 2, 'reprimand', '叱責する、譴責する'),
(113, 3, 'conciliate', 'なだめる、懐柔する'),
(113, 4, 'incriminate', '罪を負わせる、有罪にする'),
(114, 1, 'impetuous', '衝動的な、性急な'),
(114, 2, 'ostentatious', 'これ見よがしの、派手な'),
(114, 3, 'complacent', '自己満足した'),
(114, 4, 'discerning', '洞察力のある、目の肥えた'),
(115, 1, 'eminent', '高名な、著名な'),
(115, 2, 'negligent', '怠慢な、不注意な'),
(115, 3, 'dormant', '休眠状態の、活動していない'),
(115, 4, 'transient', '一時的な、つかの間の'),
(116, 1, 'peripheral', '周辺の、末梢の'),
(116, 2, 'obsolete', '時代遅れの、廃れた'),
(116, 3, 'requisite', '必要不可欠な'),
(116, 4, 'nominal', '名目上の、わずかな'),
(117, 1, 'corroborated', '裏付けた、確証した'),
(117, 2, 'repudiated', '否認した、拒絶した'),
(117, 3, 'divulged', '暴露した、漏らした'),
(117, 4, 'substantiated', '立証した、実証した'),
(118, 1, 'mitigated', '緩和した、軽減した'),
(118, 2, 'sanctioned', '承認した、認可した'),
(118, 3, 'perpetrated', '犯した、行った'),
(118, 4, 'arbitrated', '仲裁した、調停した'),
(119, 1, 'lanky', 'やせてひょろっとした'),
(119, 2, 'burly', 'たくましい、がっしりした'),
(119, 3, 'stocky', 'ずんぐりした'),
(119, 4, 'scrawny', 'やせこけた、貧弱な'),
(120, 1, 'trudged', 'とぼとぼ歩いた'),
(120, 2, 'prowled', 'うろついた、徘徊した'),
(120, 3, 'meandered', 'ぶらぶら歩いた'),
(120, 4, 'scampered', 'すばやく走った');

INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 12, 111 FROM words WHERE word_number = 475;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 12, 112 FROM words WHERE word_number = 401;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 12, 113 FROM words WHERE word_number = 481;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 12, 114 FROM words WHERE word_number = 479;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 12, 115 FROM words WHERE word_number = 478;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 12, 116 FROM words WHERE word_number = 390;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 12, 117 FROM words WHERE word_number = 441;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 12, 118 FROM words WHERE word_number = 412;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 12, 119 FROM words WHERE word_number = 470;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 12, 120 FROM words WHERE word_number = 495;
