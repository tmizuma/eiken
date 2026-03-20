-- passage_21: The Paradox of Global Supply Chains (経済 / word_number 1-600)

-- passages テーブル
INSERT INTO passages (id, title, topic, content, content_ja) VALUES
(21, 'The Paradox of Global Supply Chains', '経済',
'For much of the late twentieth century, the prevailing orthodoxy in international economics held that the globalization of supply chains was an unambiguous good. By dispersing manufacturing processes across multiple countries, corporations could exploit comparative advantages in labor costs, raw materials, and technical expertise, thereby reducing production expenses and delivering cheaper goods to consumers worldwide. This rationale underpinned a decades-long trend toward ever-greater integration of global trade networks. Yet a series of disruptions in the early twenty-first century has exposed the fragility of these intricate systems and compelled businesses and governments alike to reassess the risks inherent in far-flung supply chains.

The vulnerabilities of globalized production became starkly apparent during the onset of the COVID-19 pandemic in 2020. As factory shutdowns cascaded across Asia, European and North American manufacturers discovered that critical components — from semiconductor chips to pharmaceutical ingredients — were suddenly unavailable. Companies that had pursued relentless cost optimization by relying on single-source suppliers found themselves in a dire predicament, unable to pivot quickly enough to alternative providers. The resulting shortages sent prices soaring and laid bare the precarious nature of just-in-time inventory systems that had been extolled by management consultants for decades.

In the aftermath of these disruptions, a vigorous debate has emerged over the merits of reshoring — the practice of relocating manufacturing operations back to a company''s home country or to nearby allied nations. Advocates of reshoring argue that the short-term cost savings of offshore production are outweighed by the long-term risks of supply chain fragility. They contend that proximity to end markets reduces transportation costs, shortens delivery times, and provides a robust buffer against geopolitical shocks. Moreover, reshoring can revitalize domestic manufacturing sectors that have languished for years, creating employment opportunities in communities that bore the brunt of deindustrialization.

Skeptics, however, warn that the clamor for reshoring oversimplifies a complex economic calculus. Relocating production facilities requires enormous capital investment, and the higher labor costs in developed nations would inevitably be passed on to consumers in the form of elevated prices. Critics also note that complete self-sufficiency in manufacturing is neither feasible nor desirable in a world of [BLANK]. The interdependence that characterizes modern supply chains, they argue, also generates significant benefits: it fosters technology transfer between nations, encourages specialization, and creates mutual economic stakes that can serve as a deterrent against geopolitical conflict.

A more pragmatic approach, many analysts suggest, lies in diversification rather than wholesale retreat from global trade. Instead of concentrating production in a single low-cost country, companies can spread their sourcing across multiple regions, thereby mitigating the havoc that any single disruption might wreak. Governments can bolster this strategy by forging trade agreements with a broader array of partners and investing in domestic stockpiles of essential goods. The goal, in essence, is not to dismantle the global supply chain but to make it more resilient — a daunting undertaking, to be sure, but one that the sporadic crises of recent years have rendered unavoidable.',

'20世紀後半の大部分において、国際経済学の支配的な正統派は、サプライチェーンのグローバル化が明白な善であるとしていた。製造プロセスを複数の国に分散させることで、企業は労働コスト、原材料、技術的専門知識における比較優位を活用し、生産コストを削減して世界中の消費者により安い商品を届けることができた。この根拠は、グローバル貿易ネットワークのさらなる統合に向けた数十年にわたる傾向を支えていた。しかし、21世紀初頭の一連の混乱がこれらの複雑なシステムの脆弱性を露呈させ、企業も政府も広範に分散したサプライチェーンに内在するリスクの再評価を余儀なくされた。

グローバル化された生産の脆弱性は、2020年のCOVID-19パンデミックの発生時に明確に明らかになった。アジア全域で工場閉鎖が連鎖すると、ヨーロッパおよび北米の製造業者は、半導体チップから医薬品原料に至る重要な部品が突然入手不可能になったことを知った。単一の供給業者に依存して容赦ないコスト最適化を追求していた企業は、代替の供給業者に十分迅速に方向転換できず、深刻な窮地に陥った。結果として生じた不足は価格を急騰させ、数十年にわたり経営コンサルタントが絶賛してきたジャストインタイム在庫システムの不安定な本質をあらわにした。

これらの混乱の余波の中で、リショアリング——製造事業を企業の母国または近隣の同盟国に移転する慣行——の是非をめぐる活発な議論が浮上した。リショアリングの支持者は、オフショア生産の短期的なコスト削減はサプライチェーンの脆弱性という長期的なリスクに相殺されると主張する。彼らは、最終市場への近接性が輸送コストを削減し、納期を短縮し、地政学的ショックに対する堅固な緩衝を提供すると論じる。さらに、リショアリングは長年停滞してきた国内製造業を再活性化し、脱工業化の矛先を担ったコミュニティに雇用機会を創出することができる。

しかし懐疑論者は、リショアリングへの叫びが複雑な経済計算を単純化しすぎていると警告する。生産施設の移転には莫大な資本投資が必要であり、先進国のより高い労働コストは必然的に価格上昇という形で消費者に転嫁される。批判者はまた、相互依存的な専門化の世界において、製造業の完全な自給自足は実現可能でも望ましくもないと指摘する。現代のサプライチェーンを特徴づける相互依存は重大な利点も生み出すと彼らは主張する。それは国家間の技術移転を促進し、専門化を奨励し、地政学的紛争に対する抑止力として機能し得る相互の経済的利害関係を生み出す。

より実利的なアプローチは、多くのアナリストが示唆するように、グローバル貿易からの全面的な撤退ではなく多角化にある。単一の低コスト国に生産を集中させる代わりに、企業は調達を複数の地域に分散させ、単一の混乱がもたらしうる大損害を軽減することができる。政府はより広範なパートナーとの貿易協定を構築し、必需品の国内備蓄に投資することでこの戦略を強化できる。本質的に、目標はグローバルサプライチェーンを解体することではなく、それをより回復力のあるものにすることである——確かに手強い取り組みだが、近年の散発的な危機が避けられないものにした取り組みである。');

-- passage_questions テーブル (3問)
INSERT INTO passage_questions (id, passage_id, question_number, question_type, question_text, explanation, correct_choice) VALUES
(61, 21, 1, 'comprehension',
'What does the passage identify as a major consequence of the COVID-19 pandemic for global supply chains?',
'第2段落で、パンデミック中にアジアの工場閉鎖が連鎖し、半導体チップや医薬品原料などの重要部品が突然入手不可能になったと述べられている。単一供給業者に依存していた企業は「dire predicament（深刻な窮地）」に陥り、ジャストインタイム在庫システムの「precarious nature（不安定な本質）」が露呈した。選択肢1が「単一供給業者への依存の脆弱性を露呈した」と正確に要約。選択肢2は「貿易量が増加」で逆。選択肢3は「サプライチェーンの強靭さが証明された」で逆。選択肢4は「即座にリショアリングが起きた」で本文はリショアリングを「議論」として紹介している。',
1),
(62, 21, 2, 'comprehension',
'According to the passage, what argument do skeptics of reshoring make?',
'第4段落で、懐疑論者はリショアリングが複雑な経済計算を単純化しすぎていると主張し、生産施設の移転に莫大な資本投資が必要であること、先進国のより高い労働コストが消費者に転嫁されること、そして現代のサプライチェーンの相互依存が技術移転の促進や地政学的紛争の抑止力など重大な利点も生むと論じている。選択肢4が「グローバルな相互依存は技術移転や紛争抑止など重大な利点を生む」と正確に述べている。選択肢1は「リショアリングは常に成功する」で懐疑論者の立場と逆。選択肢2は「パンデミックの影響は誇張されている」で本文にそのような主張なし。選択肢3は「低コスト国にのみ利益がある」で本文にない。',
4),
(63, 21, 3, 'fill_in_blank',
'Choose the best option to fill in the blank [BLANK] in the passage.',
'空所は第4段落にあり、「製造業の完全な自給自足は[BLANK]の世界においてfeasibleでもdesirableでもない」という文脈。この段落では、現代サプライチェーンの相互依存が技術移転や専門化を促進し、相互の経済的利害を生むと述べている。自給自足が不可能な理由として、世界が相互依存的な専門化で成り立っていることが最も適切。選択肢2「interdependent specialization」が文脈に合致。選択肢1「unlimited resources」は現実と逆。選択肢3「diminishing trade volumes」は本文の主張と矛盾。選択肢4「identical production capabilities」は専門化の概念と逆。',
2);

-- question_choices テーブル (各問4択)
INSERT INTO question_choices (question_id, choice_number, choice_text) VALUES
(61, 1, 'It revealed the vulnerability of relying on single-source suppliers for critical components'),
(61, 2, 'It led to an immediate and permanent increase in global trade volumes'),
(61, 3, 'It demonstrated that just-in-time inventory systems were fundamentally resilient'),
(61, 4, 'It caused most multinational corporations to immediately reshore their operations'),
(62, 1, 'Reshoring has always proven successful whenever it has been attempted'),
(62, 2, 'The impact of the pandemic on supply chains has been greatly exaggerated'),
(62, 3, 'Globalized production benefits only low-cost manufacturing nations'),
(62, 4, 'Global interdependence generates significant benefits including technology transfer and conflict deterrence'),
(63, 1, 'unlimited resources'),
(63, 2, 'interdependent specialization'),
(63, 3, 'diminishing trade volumes'),
(63, 4, 'identical production capabilities');

-- passage_words テーブル (使用した単語のマッピング)
INSERT INTO passage_words (passage_id, word_id)
SELECT 21, id FROM words WHERE word_number IN (32, 37, 84, 103, 156, 165, 168, 177, 181, 242, 337, 343, 347, 371, 551, 554, 557, 574, 576, 593);
