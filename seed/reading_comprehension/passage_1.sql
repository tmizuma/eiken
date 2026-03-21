-- Passage 1: 教育 - The Finnish Education Model
INSERT INTO passages (id, title, topic, content, content_ja) VALUES (
1,
'The Finnish Education Model: Lessons in Equity and Excellence',
'教育',
'For decades, Finland has been held up as a paragon of educational excellence, consistently ranking among the top performers in international assessments such as the Programme for International Student Assessment (PISA). What makes Finland''s approach so remarkable is not the rigor of its testing regime—in fact, the country has largely eschewed standardized testing—but rather its fervent commitment to equity and the holistic development of every child.

The Finnish model rests on several salient principles. First, all teachers in Finland are required to hold a master''s degree, and admission to teacher training programs is fiercely competitive, with acceptance rates often hovering around ten percent. This ensures that teaching remains a prestigious and lucrative profession, attracting adept candidates who might otherwise pursue careers in law or medicine. The rationale behind this approach is straightforward: investing in the quality of educators yields robust returns in student outcomes.

Second, Finland provides children with considerable latitude in how they learn. Rather than subjecting students to grueling schedules packed with academic drills, Finnish schools emphasize play, creativity, and collaborative problem-solving. Students typically do not begin formal schooling until the age of seven, and homework loads remain minimal throughout primary education. Critics initially lambasted this approach as frivolous, arguing that it would produce mediocre results. Yet the evidence has consistently corroborated the opposite conclusion: Finnish students outperform their peers in nations that impose far more stringent academic demands.

A third pillar of the Finnish system is its commitment to disseminating resources equitably across all schools, regardless of geographic location or socioeconomic composition. Unlike many countries where funding disparities engender stark inequalities, Finland ensures that [BLANK]. Special education services, school meals, and mental health support are universally available, eliminating many of the impediments that disadvantage children in other systems.

However, the Finnish model is not without its challenges. In recent years, Finland''s PISA scores have shown a modest decline, prompting educators to delve into potential causes. Some analysts point to the burgeoning influence of digital technology, which may have eroded students'' attention spans and reading habits. Others note that increasing immigration has introduced new linguistic and cultural complexities that the system was not originally designed to address. Despite these concerns, Finland''s educational infrastructure remains remarkably resilient, and policymakers continue to revamp curricula to meet evolving needs.

The broader lesson from Finland''s experience is that educational excellence need not come at the expense of student well-being. By fostering an environment in which teachers are respected, students are given autonomy, and resources are distributed fairly, Finland has demonstrated that equity and achievement are not mutually exclusive but rather mutually reinforcing.',
'数十年にわたり、フィンランドは教育の優秀さの模範として称えられ、PISA（国際学力調査）などの国際評価で常に上位にランクインしてきた。フィンランドのアプローチが際立っているのは、テスト制度の厳しさではなく——実際、同国は標準化されたテストをほぼ避けてきた——むしろ、公平性とすべての子どもの全人的発達に対する熱心な取り組みにある。

フィンランドモデルはいくつかの顕著な原則に基づいている。第一に、フィンランドのすべての教師は修士号を取得することが求められ、教員養成課程への入学は極めて競争が激しく、合格率はしばしば約10パーセントにとどまる。これにより、教職は名声があり収入の高い職業であり続け、法律や医学の道に進む可能性のある優秀な候補者を引きつけている。このアプローチの根拠は明快で、教育者の質への投資が生徒の成果において力強いリターンをもたらすということである。

第二に、フィンランドは子どもたちに学び方において相当な自由を与えている。学業訓練で詰め込まれた厳しいスケジュールを課すのではなく、フィンランドの学校は遊び、創造性、協働的な問題解決を重視している。生徒は通常7歳まで正式な学校教育を始めず、初等教育を通じて宿題の量は最小限にとどまる。批評家たちは当初、このアプローチを軽率だと酷評し、平凡な結果しか生まないと主張した。しかし、証拠は一貫して逆の結論を裏付けてきた。フィンランドの生徒は、はるかに厳格な学業要求を課す国の同級生を上回る成績を収めているのである。

フィンランドの制度の第三の柱は、地理的位置や社会経済的構成に関係なく、すべての学校に資源を公平に広める取り組みである。資金格差が著しい不平等を生み出す多くの国とは異なり、フィンランドは[BLANK]を確保している。特別支援教育、学校給食、メンタルヘルスサポートは普遍的に利用可能であり、他の制度で子どもたちを不利にする障害の多くを排除している。

しかし、フィンランドモデルに課題がないわけではない。近年、フィンランドのPISAスコアは緩やかな低下を示しており、教育者たちは潜在的な原因を掘り下げている。一部のアナリストは、デジタル技術の急速に発展する影響が生徒の集中力と読書習慣を侵食した可能性を指摘している。他のアナリストは、移民の増加により、制度が当初想定していなかった新たな言語的・文化的複雑さが生じていると指摘している。こうした懸念にもかかわらず、フィンランドの教育インフラは驚くほど強靭であり、政策立案者は変化するニーズに対応するためにカリキュラムを刷新し続けている。

フィンランドの経験からの広い教訓は、教育の卓越性は生徒の幸福を犠牲にする必要がないということである。教師が尊敬され、生徒に自律性が与えられ、資源が公正に分配される環境を育むことで、フィンランドは公平性と達成が相互に排他的ではなく、相互に強化し合うことを示してきた。'
);

INSERT INTO passage_questions (id, passage_id, question_number, question_type, question_text, explanation, correct_choice) VALUES
(1, 1, 1, 'comprehension', 'According to the passage, what is one reason teaching is considered an attractive profession in Finland?', '第2段落で、フィンランドの教師は修士号が必要で、教員養成課程は合格率約10%と極めて競争が激しいこと、そして教職が「prestigious and lucrative profession」（名声があり収入の高い職業）であると述べられている。選択肢2が本文の内容と一致する。', 2),
(2, 1, 2, 'fill_in_blank', 'Which of the following best fits in the blank [BLANK] in paragraph 4?', '第4段落は、資源の公平な配分について述べている。「Unlike many countries where funding disparities engender stark inequalities」（資金格差が著しい不平等を生み出す多くの国とは異なり）という対比から、フィンランドでは裕福な地域も貧しい地域も同等の質の教育を受けられることが文脈に合う。選択肢3が最も適切。', 3),
(3, 1, 3, 'comprehension', 'What does the passage suggest about the recent challenges facing Finland''s education system?', '第5段落で、フィンランドのPISAスコアが緩やかに低下しており、デジタル技術の影響や移民増加による言語的・文化的複雑さが原因として挙げられている。しかし「Finland''s educational infrastructure remains remarkably resilient」とも述べられており、選択肢4が最も正確。', 4);

INSERT INTO question_choices (question_id, choice_number, choice_text) VALUES
(1, 1, 'Teachers receive extensive training in digital technology and innovation.'),
(1, 2, 'The profession offers competitive compensation and high social prestige.'),
(1, 3, 'Teachers are exempt from academic research requirements after graduation.'),
(1, 4, 'Finland offers teachers shorter working hours than other professions.'),
(2, 1, 'private institutions supplement public school funding in underperforming areas'),
(2, 2, 'parents contribute additional fees to maintain high educational standards'),
(2, 3, 'every school, whether in a wealthy urban district or a remote rural community, receives comparable funding and support'),
(2, 4, 'international organizations provide grants to schools with the lowest test scores'),
(3, 1, 'The education system has fundamentally collapsed due to immigration pressures.'),
(3, 2, 'Standardized testing has been reintroduced to reverse the decline in scores.'),
(3, 3, 'Finland has abandoned its commitment to equitable resource distribution.'),
(3, 4, 'While scores have dipped slightly, the system remains strong and continues to adapt.');

INSERT INTO passage_words (passage_id, word_id) SELECT 1, id FROM words WHERE word_number IN (1, 11, 13, 43, 51, 88, 97, 137, 163, 269, 343, 351, 354, 370, 385, 387, 528, 594);
