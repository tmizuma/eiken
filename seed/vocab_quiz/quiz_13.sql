INSERT INTO vocab_quizzes (id, quiz_number, word_range) VALUES (13, 13, '300~500');

INSERT INTO vocab_questions (id, quiz_id, question_number, sentence, explanation, correct_choice, correct_word_id) VALUES
(121, 13, 1, 'The ( ) of proving the product''s safety lies squarely with the manufacturer, not the consumer.', '1. onus（責任）が正解。短文は「製品の安全性を証明する責任は消費者ではなく製造者にある」の意。2. crux（核心）、3. gist（要点）、4. boon（恩恵）。', 1, 1303),
(122, 13, 2, 'Negotiations between the two nations reached an ( ), with neither side willing to make concessions.', '1. overture（提案）、2. impasse（行き詰まり）が正解。短文は「両国間の交渉は行き詰まりに達し、どちらの側も譲歩する意思がなかった」の意。3. accord（合意）、4. upheaval（激変）。', 2, 1266),
(123, 13, 3, 'Unlike her reserved twin sister, Maria was a natural ( ) who thrived in social gatherings.', '1. recluse（世捨て人）、2. prodigy（天才）、3. extrovert（外向性の人）が正解。短文は「控えめな双子の姉妹と違い、マリアは社交の場で活躍する生まれながらの外向性の人だった」の意。4. maverick（異端者）。', 3, 1348),
(124, 13, 4, 'Residents ( ) the decision to close the local library, calling it a devastating blow to the community.', '1. heralded（予告した）、2. sanctioned（承認した）、3. endorsed（支持した）、4. bemoaned（嘆いた）が正解。短文は「住民は地元の図書館を閉鎖する決定を嘆き、地域社会への壊滅的な打撃だと述べた」の意。', 4, 1265),
(125, 13, 5, 'When accused of being unfair, the teacher ( ) that the grading criteria had been applied equally to all students.', '1. retorted（言い返した）が正解。短文は「不公平だと非難されたとき、教師は採点基準は全生徒に平等に適用されたと言い返した」の意。2. muttered（つぶやいた）、3. conceded（認めた）、4. insinuated（ほのめかした）。', 1, 1319),
(126, 13, 6, 'The contractor completely ( ) the renovation, resulting in leaking pipes and crooked walls.', '1. expedited（迅速に処理した）、2. botched（しくじった）が正解。短文は「請負業者はリフォームを完全にしくじり、水漏れする配管と曲がった壁という結果になった」の意。3. streamlined（合理化した）、4. outsourced（外部委託した）。', 2, 1271),
(127, 13, 7, 'After the earthquake, rescue teams spent weeks clearing the ( ) from collapsed buildings.', '1. surplus（余剰）、2. residue（残留物）、3. debris（がれき）が正解。短文は「地震後、救助隊は倒壊した建物からがれきを撤去するのに数週間を費やした」の意。4. sediment（堆積物）。', 3, 1225),
(128, 13, 8, 'The tabloid newspaper published ( ) details of the crime, shocking many of its readers.', '1. mundane（ありふれた）、2. abstract（抽象的な）、3. cursory（大ざっぱな）、4. lurid（恐ろしい）が正解。短文は「タブロイド紙はその犯罪の恐ろしい詳細を掲載し、多くの読者に衝撃を与えた」の意。', 4, 1306),
(129, 13, 9, 'Friends and family held an all-night ( ) at the hospital, anxiously awaiting news of the patient''s condition.', '1. vigil（寝ずの番）が正解。短文は「友人や家族は病院で一晩中寝ずの番をし、患者の容態の知らせを心配しながら待っていた」の意。2. tirade（長広舌）、3. charade（見せかけ）、4. tribunal（裁判所）。', 1, 1191),
(130, 13, 10, 'For an experienced programmer like her, fixing the minor bug was a ( ).', '1. fiasco（大失敗）、2. cinch（たやすいこと）が正解。短文は「彼女のような経験豊富なプログラマーにとって、その小さなバグを直すことはたやすいことだった」の意。3. quandary（困惑）、4. ordeal（試練）。', 2, 1304);

INSERT INTO vocab_question_choices (question_id, choice_number, choice_word, choice_meaning) VALUES
(121, 1, 'onus', '責任、義務'),
(121, 2, 'crux', '核心、要点'),
(121, 3, 'gist', '要点、骨子'),
(121, 4, 'boon', '恩恵、ありがたいもの'),
(122, 1, 'overture', '提案、申し入れ'),
(122, 2, 'impasse', '行き詰まり、難局'),
(122, 3, 'accord', '合意、一致'),
(122, 4, 'upheaval', '激変、大変動'),
(123, 1, 'recluse', '世捨て人、隠遁者'),
(123, 2, 'prodigy', '天才、神童'),
(123, 3, 'extrovert', '外向性の人、社交的な人'),
(123, 4, 'maverick', '異端者、一匹狼'),
(124, 1, 'heralded', '予告した、布告した'),
(124, 2, 'sanctioned', '承認した、認可した'),
(124, 3, 'endorsed', '支持した、推薦した'),
(124, 4, 'bemoaned', '嘆いた、不満に思った'),
(125, 1, 'retorted', '言い返した、切り返した'),
(125, 2, 'muttered', 'つぶやいた'),
(125, 3, 'conceded', '認めた、譲歩した'),
(125, 4, 'insinuated', 'ほのめかした、暗示した'),
(126, 1, 'expedited', '迅速に処理した'),
(126, 2, 'botched', 'しくじった、やり損なった'),
(126, 3, 'streamlined', '合理化した'),
(126, 4, 'outsourced', '外部委託した'),
(127, 1, 'surplus', '余剰、過剰'),
(127, 2, 'residue', '残留物、残り'),
(127, 3, 'debris', '破片、がれき'),
(127, 4, 'sediment', '堆積物、沈殿物'),
(128, 1, 'mundane', 'ありふれた、日常的な'),
(128, 2, 'abstract', '抽象的な'),
(128, 3, 'cursory', '大ざっぱな、ざっとした'),
(128, 4, 'lurid', '恐ろしい、どぎつい'),
(129, 1, 'vigil', '寝ずの番、見張り'),
(129, 2, 'tirade', '長広舌、激しい非難'),
(129, 3, 'charade', '見せかけ、茶番'),
(129, 4, 'tribunal', '裁判所、法廷'),
(130, 1, 'fiasco', '大失敗、惨事'),
(130, 2, 'cinch', 'たやすいこと、朝飯前'),
(130, 3, 'quandary', '困惑、板挟み'),
(130, 4, 'ordeal', '試練、苦しい体験');

INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 13, 121 FROM words WHERE word_number = 414;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 13, 122 FROM words WHERE word_number = 377;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 13, 123 FROM words WHERE word_number = 459;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 13, 124 FROM words WHERE word_number = 376;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 13, 125 FROM words WHERE word_number = 430;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 13, 126 FROM words WHERE word_number = 382;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 13, 127 FROM words WHERE word_number = 336;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 13, 128 FROM words WHERE word_number = 417;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 13, 129 FROM words WHERE word_number = 302;
INSERT INTO vocab_used_words (word_id, quiz_id, question_id) SELECT id, 13, 130 FROM words WHERE word_number = 415;
