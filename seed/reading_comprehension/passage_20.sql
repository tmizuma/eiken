INSERT INTO passages (id, title, topic, content, content_ja) VALUES (20, 'The Global Supply Chain Crisis and Its Lasting Impact', '経済',
'When the COVID-19 pandemic swept across the world in 2020, it exposed vulnerabilities in global supply chains that economists had long warned about but few had taken seriously. The just-in-time manufacturing model, pioneered by Toyota in the 1970s and subsequently adopted by industries worldwide, had been extolled for decades as the pinnacle of efficiency. By minimizing inventory and relying on precise delivery schedules, companies could reduce costs and augment profits. Yet this system, it turned out, was precarious — built on the assumption that disruptions would be minor and temporary.

The onset of the pandemic shattered that assumption. Factory shutdowns in China, where much of the world''s manufacturing is concentrated, triggered a cascade of shortages that reverberated through every sector of the global economy. Semiconductor chips, essential components in everything from automobiles to household appliances, became especially scarce. By mid-2021, automakers including Ford and General Motors were forced to idle production lines, forfeiting billions of dollars in revenue. The dearth of available chips was so severe that delivery times for new vehicles stretched to months, and used car prices surged to unprecedented levels.

The crisis also laid bare the detrimental consequences of over-reliance on a single region for critical goods. The concept of "reshoring" — bringing manufacturing back to domestic soil — gained considerable momentum. The United States passed the CHIPS and Science Act in 2022, allocating over fifty billion dollars to bolster domestic semiconductor production. The European Union launched a similar initiative, and Japan offered substantial subsidies to entice chipmakers like Taiwan Semiconductor Manufacturing Company to build factories on its territory.

Yet reshoring is neither simple nor inexpensive. Building a modern semiconductor fabrication plant costs upward of ten billion dollars and takes several years. Moreover, the requisite workforce — engineers and technicians with highly specialized skills — cannot be cultivated overnight. Critics contend that [BLANK], as the interdependencies that define modern manufacturing are too deeply entrenched to unravel quickly.

The shipping industry, another critical link in the supply chain, faced its own turmoil. The blockage of the Suez Canal by the container ship Ever Given in March 2021, though lasting only six days, caused an estimated nine to ten billion dollars in delayed trade per day. Freight rates, which had been stagnant for years, skyrocketed, imposing additional costs on businesses already struggling with sporadic shortages. These costs were inevitably passed on to consumers, contributing to the surge in inflation that plagued economies throughout 2022 and 2023.

Looking ahead, most analysts agree that the era of purely cost-driven supply chain design is over. Companies are now investing in diversification, redundancy, and digital tools to gauge risks more effectively. The pandemic served as a stark reminder that efficiency without resilience is a liability, not an asset.',

'2020年にCOVID-19パンデミックが世界を席巻したとき、経済学者たちが長らく警告していたものの、ほとんど誰も真剣に受け止めていなかったグローバルサプライチェーンの脆弱性が露呈した。1970年代にトヨタが先駆けとなり、その後世界中の産業に採用されたジャストインタイム製造モデルは、何十年もの間、効率性の頂点として絶賛されてきた。在庫を最小限にし、正確な配送スケジュールに依存することで、企業はコストを削減し利益を増大させることができた。しかし、このシステムは不安定であることが判明した——混乱は軽微で一時的なものであるという前提の上に構築されていたのだ。

パンデミックの開始がその前提を打ち砕いた。世界の製造業の多くが集中する中国での工場閉鎖が、世界経済のあらゆるセクターに波及する連鎖的な不足を引き起こした。自動車から家電製品まであらゆるものに不可欠な部品である半導体チップが特に不足した。2021年半ばまでに、フォードやゼネラルモーターズなどの自動車メーカーは生産ラインの停止を余儀なくされ、数十億ドルの収益を失った。利用可能なチップの不足は非常に深刻で、新車の納期は数ヶ月に延び、中古車価格は前例のない水準にまで急騰した。

この危機は、重要物資の単一地域への過度の依存がもたらす有害な結果も明らかにした。「リショアリング」——製造を国内に戻す——という概念がかなりの勢いを得た。アメリカは2022年にCHIPS・科学法を可決し、国内の半導体生産を強化するために500億ドル以上を割り当てた。欧州連合も同様の取り組みを開始し、日本は台湾積体電路製造（TSMC）のようなチップメーカーを自国領土に工場建設で誘致するため、相当額の補助金を提供した。

しかし、リショアリングは単純でも安価でもない。最新の半導体製造工場の建設には100億ドル以上の費用がかかり、数年を要する。さらに、必要不可欠な労働力——高度に専門的な技能を持つエンジニアや技術者——は一夜にして育成できない。批判者たちは、完全なリショアリングは現実的な目標というよりも政治的な修辞に過ぎないと主張する。現代の製造業を定義する相互依存関係は、迅速に解きほぐすにはあまりにも深く根付いているからだ。

サプライチェーンのもう一つの重要な環である海運業界も、独自の混乱に直面した。2021年3月にコンテナ船エバーギブンがスエズ運河を塞いだ事件は、わずか6日間であったにもかかわらず、一日あたり推定90億～100億ドルの貿易遅延を引き起こした。何年も停滞していた運賃は急騰し、すでに散発的な不足に苦しんでいた企業にさらなるコストを課した。これらのコストは必然的に消費者に転嫁され、2022年と2023年を通じて各国経済を悩ませたインフレの高進に寄与した。

今後を見据えると、ほとんどのアナリストは、純粋にコスト重視のサプライチェーン設計の時代は終わったと認識している。企業は現在、リスクをより効果的に評価するために多角化、冗長性、デジタルツールに投資している。パンデミックは、レジリエンスなき効率性は資産ではなく負債であるという厳然たる教訓を残した。');

INSERT INTO passage_questions (id, passage_id, question_number, question_type, question_text, explanation, correct_choice) VALUES
(58, 20, 1, 'comprehension', 'What does the passage identify as the fundamental weakness of the just-in-time manufacturing model?', '第1段落で、ジャストインタイム製造モデルは「混乱は軽微で一時的なものであるという前提の上に構築されていた」（built on the assumption that disruptions would be minor and temporary）と述べられており、大規模な混乱に対して脆弱であったことが根本的な弱点として示されている。', 1),
(59, 20, 2, 'fill_in_blank', 'Which of the following best fits in the blank [BLANK]?', '空所は第4段落にあり、リショアリングの困難さについて論じる文脈の中にある。前後の文で建設費用の高さ、所要時間の長さ、専門労働力の不足が述べられ、続く文で「相互依存関係があまりにも深く根付いている」とあることから、完全なリショアリングは現実的目標というより政治的修辞であるという内容が最も適切である。', 3),
(60, 20, 3, 'comprehension', 'According to the passage, what lesson did the pandemic teach about supply chain management?', '最終段落で「パンデミックは、レジリエンスなき効率性は資産ではなく負債であるという厳然たる教訓を残した」（efficiency without resilience is a liability, not an asset）と述べられている。', 2);

INSERT INTO question_choices (question_id, choice_number, choice_text) VALUES
(58, 1, 'It was built on the assumption that major disruptions would not occur.'),
(58, 2, 'It required too many workers to operate factories around the clock.'),
(58, 3, 'It depended on digital technologies that were not yet fully developed.'),
(58, 4, 'It concentrated all manufacturing in a single country for cost savings.'),
(59, 1, 'developing countries will resist any attempt to relocate factories away from their borders'),
(59, 2, 'the environmental impact of building new factories will outweigh the economic benefits'),
(59, 3, 'full reshoring is more of a political talking point than a realistic goal'),
(59, 4, 'consumers are unwilling to pay the higher prices that domestic manufacturing entails'),
(60, 1, 'Companies should stockpile as many goods as possible to prepare for future crises.'),
(60, 2, 'Efficiency must be balanced with resilience to withstand unexpected disruptions.'),
(60, 3, 'Digital tools alone can prevent all future supply chain disruptions.'),
(60, 4, 'Governments should take direct control of supply chains during emergencies.');

INSERT INTO passage_words (passage_id, word_id) SELECT 20, id FROM words WHERE word_number IN (6, 37, 84, 103, 117, 120, 136, 137, 144, 242, 390, 402, 516, 554, 557, 560, 575, 587);
