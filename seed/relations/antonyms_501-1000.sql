-- word_antonyms (word_number 501-1000 担当分)
-- 少なくとも一方の単語が word_number 501-1000 に含まれるペア
-- 両方が word_number 1-500 のペアは除外

INSERT OR IGNORE INTO word_antonyms (word_id, antonym_word_id) VALUES
-- covert (wn=568, id=1507) <-> overt (wn=258, id=1147) 密かな vs 公然の
(1507, 1147),
(1147, 1507),
-- covert (wn=568, id=1507) <-> explicit (wn=601, id=1540) 密かな vs あからさまな
(1507, 1540),
(1540, 1507),
-- furtive (wn=899, id=1838) <-> overt (wn=258, id=1147) 内密の vs 公然の
(1838, 1147),
(1147, 1838),
-- tacit (wn=410, id=1299) <-> explicit (wn=601, id=1540) 暗黙の vs 明白な
(1299, 1540),
(1540, 1299),
-- implicit (wn=1409, id=497) <-> explicit (wn=601, id=1540) 暗黙の vs 明白な
(497, 1540),
(1540, 497),
-- diminish (wn=550, id=1439) <-> augment (wn=120, id=120) 減少する vs 増加する
(1439, 120),
(120, 1439),
-- diminish (wn=550, id=1439) <-> amplify (wn=1320, id=416) 減少する vs 拡大する
(1439, 416),
(416, 1439),
-- thrifty (wn=745, id=1684) <-> lavish (wn=462, id=1351) 倹約な vs ぜいたくな
(1684, 1351),
(1351, 1684),
-- thrifty (wn=745, id=1684) <-> opulent (wn=372, id=1261) 倹約な vs 豪華な
(1684, 1261),
(1261, 1684),
-- thrifty (wn=745, id=1684) <-> sumptuous (wn=759, id=1698) 倹約な vs 豪華な
(1684, 1698),
(1698, 1684),
-- frugal (wn=218, id=1107) <-> sumptuous (wn=759, id=1698) 倹約な vs 豪華な
(1107, 1698),
(1698, 1107),
-- plummet (wn=616, id=1555) <-> soar (wn=1249, id=349) 急落する vs 急上昇する
(1555, 349),
(349, 1555),
-- plummet (wn=616, id=1555) <-> skyrocket (wn=1833, id=936) 急落する vs 急騰する
(1555, 936),
(936, 1555),
-- plummet (wn=616, id=1555) <-> surge (wn=1253, id=353) 急落する vs 急騰する
(1555, 353),
(353, 1555),
-- transient (wn=681, id=1620) <-> perennial (wn=473, id=1362) 一時的な vs 絶え間ない
(1620, 1362),
(1362, 1620),
-- transitory (wn=816, id=1755) <-> perennial (wn=473, id=1362) 一時的な vs 絶え間ない
(1755, 1362),
(1362, 1755),
-- expedite (wn=604, id=1543) <-> hamper (wn=867, id=1806) 促進する vs 妨げる
(1543, 1806),
(1806, 1543),
-- expedite (wn=604, id=1543) <-> hinder (wn=1831, id=934) 促進する vs 妨げる
(1543, 934),
(934, 1543),
-- facilitate (wn=1698, id=812) <-> hamper (wn=867, id=1806) 促進する vs 妨げる
(812, 1806),
(1806, 812),
-- burgeon (wn=594, id=1533) <-> wane (wn=54, id=1443) 急成長する vs 衰える
(1533, 1443),
(1443, 1533),
-- burgeon (wn=594, id=1533) <-> dwindle (wn=65, id=1454) 急成長する vs 減少する
(1533, 1454),
(1454, 1533),
-- burgeon (wn=594, id=1533) <-> diminish (wn=550, id=1439) 急成長する vs 減少する
(1533, 1439),
(1439, 1533),
-- demoralize (wn=611, id=1550) <-> embolden (wn=1427, id=514) 士気をくじく vs 勇気づける
(1550, 514),
(514, 1550),
-- aggravate (wn=540, id=1429) <-> mitigate (wn=975, id=1914) 悪化させる vs 和らげる
(1429, 1914),
(1914, 1429),
-- aggravate (wn=540, id=1429) <-> alleviate (wn=95, id=1484) 悪化させる vs 軽減する
(1429, 1484),
(1484, 1429),
-- exacerbate (wn=233, id=1122) <-> mitigate (wn=975, id=1914) 悪化させる vs 和らげる
(1122, 1914),
(1914, 1122),
-- dearth (wn=516, id=1405) <-> profusion (wn=761, id=1700) 不足 vs 多数
(1405, 1700),
(1700, 1405),
-- dearth (wn=516, id=1405) <-> glut (wn=220, id=1109) 不足 vs 供給過剰
(1405, 1109),
(1109, 1405),
-- scarcity (wn=968, id=1907) <-> profusion (wn=761, id=1700) 不足 vs 多数
(1907, 1700),
(1700, 1907),
-- scarcity (wn=968, id=1907) <-> glut (wn=220, id=1109) 不足 vs 供給過剰
(1907, 1109),
(1109, 1907),
-- verbose (wn=847, id=1786) <-> succinct (wn=317, id=1206) 冗長な vs 簡潔な
(1786, 1206),
(1206, 1786),
-- verbose (wn=847, id=1786) <-> terse (wn=1066, id=166) 冗長な vs 素っ気ない
(1786, 166),
(166, 1786),
-- verbose (wn=847, id=1786) <-> brevity (wn=284, id=1173) 冗長 vs 簡潔さ
(1786, 1173),
(1173, 1786),
-- intrinsic (wn=822, id=1761) <-> extrinsic (wn=1125, id=225) 固有の vs 外的な
(1761, 225),
(225, 1761),
-- intrinsic (wn=822, id=1761) <-> extraneous (wn=1085, id=185) 固有の vs 非本質的な
(1761, 185),
(185, 1761),
-- dormant (wn=799, id=1738) <-> active → no exact match in list
-- fortify (wn=871, id=1810) <-> undermine (wn=967, id=1906) 強化する vs 弱体化する
(1810, 1906),
(1906, 1810),
-- bolster (wn=242, id=1131) <-> undermine (wn=967, id=1906) 強化する vs 弱体化する
(1131, 1906),
(1906, 1131),
-- reinforce (wn=1738, id=849) <-> undermine (wn=967, id=1906) 強化する vs 弱体化する
(849, 1906),
(1906, 849),
-- rejuvenate (wn=902, id=1841) <-> deteriorate (wn=1269, id=369) 若返らせる vs 悪化する
(1841, 369),
(369, 1841),
-- rejuvenate (wn=902, id=1841) <-> degenerate (wn=772, id=1711) 若返らせる vs 悪化する
(1841, 1711),
(1711, 1841),
-- revitalize (wn=337, id=1226) <-> degenerate (wn=772, id=1711) 再活性化 vs 悪化する
(1226, 1711),
(1711, 1226),
-- illustrious (wn=846, id=1785) <-> obscurity (wn=579, id=1518) 著名な vs 無名
(1785, 1518),
(1518, 1785),
-- eminent (wn=478, id=1367) <-> obscurity (wn=579, id=1518) 高名な vs 無名
(1367, 1518),
(1518, 1367),
-- renowned (wn=1879, id=978) <-> obscurity (wn=579, id=1518) 名高い vs 無名
(978, 1518),
(1518, 978),
-- resilient (wn=841, id=1780) <-> volatile (wn=829, id=1768) 回復力がある vs 不安定な
(1780, 1768),
(1768, 1780),
-- superfluous (wn=921, id=1860) <-> requisite (wn=390, id=1279) 余分な vs 必要不可欠な
(1860, 1279),
(1279, 1860),
-- superfluous (wn=921, id=1860) <-> imperative (wn=976, id=1915) 余分な vs 必須な
(1860, 1915),
(1915, 1860),
-- superfluous (wn=921, id=1860) <-> indispensable (wn=1770, id=878) 余分な vs 不可欠な
(1860, 878),
(878, 1860),
-- apathetic (wn=52, id=1441) <-> ardent (wn=674, id=1613) 無関心な vs 熱心な
(1441, 1613),
(1613, 1441),
-- sluggish (wn=919, id=1858) <-> nimble (wn=1039, id=89) 鈍い vs 素早い
(1858, 89),
(89, 1858),
-- imprudent (wn=817, id=1756) <-> prudence (wn=639, id=1578) 軽率な vs 思慮深い
(1756, 1578),
(1578, 1756),
-- imprudent (wn=817, id=1756) <-> circumspect (wn=883, id=1822) 軽率な vs 慎重な
(1756, 1822),
(1822, 1756),
-- benevolent (wn=879, id=1818) <-> malevolent (wn=1159, id=259) 慈悲深い vs 悪意のある
(1818, 259),
(259, 1818),
-- benevolent (wn=879, id=1818) <-> malice (wn=1351, id=444) 慈悲深い vs 悪意
(1818, 444),
(444, 1818),
-- propitious (wn=863, id=1802) <-> dire (wn=592, id=1531) 好都合な vs 悲惨な
(1802, 1531),
(1531, 1802),
-- destitute (wn=606, id=1545) <-> affluent (wn=1898, id=995) 困窮した vs 裕福な
(1545, 995),
(995, 1545),
-- destitute (wn=606, id=1545) <-> opulent (wn=372, id=1261) 困窮した vs 豪華な
(1545, 1261),
(1261, 1545),
-- banal (wn=580, id=1519) <-> prodigious (wn=1152, id=252) 平凡な vs 並外れた
(1519, 252),
(252, 1519),
-- ecstatic (wn=952, id=1891) <-> despondent (wn=497, id=1386) 有頂天 vs 意気消沈
(1891, 1386),
(1386, 1891),
-- ecstatic (wn=952, id=1891) <-> morose (wn=911, id=1850) 有頂天 vs 不機嫌な
(1891, 1850),
(1850, 1891),
-- ecstatic (wn=952, id=1891) <-> forlorn (wn=850, id=1789) 有頂天 vs みじめな
(1891, 1789),
(1789, 1891),
-- euphoric (wn=282, id=1171) <-> morose (wn=911, id=1850) 有頂天 vs 不機嫌な
(1171, 1850),
(1850, 1171),
-- acclaim (wn=984, id=1923) <-> disparage (wn=824, id=1763) 称賛 vs けなす
(1923, 1763),
(1763, 1923),
-- acclaim (wn=984, id=1923) <-> vilify (wn=990, id=1929) 称賛 vs 中傷する
(1923, 1929),
(1929, 1923),
-- acclaim (wn=984, id=1923) <-> denounce (wn=971, id=1910) 称賛 vs 非難する
(1923, 1910),
(1910, 1923),
-- extol (wn=37, id=37) <-> disparage (wn=824, id=1763) 絶賛する vs けなす
(37, 1763),
(1763, 37),
-- extol (wn=37, id=37) <-> vilify (wn=990, id=1929) 絶賛する vs 中傷する
(37, 1929),
(1929, 37),
-- extol (wn=37, id=37) <-> denounce (wn=971, id=1910) 絶賛する vs 非難する
(37, 1910),
(1910, 37),
-- usurp (wn=856, id=1795) <-> relinquish (wn=877, id=1816) 奪う vs 放棄する
(1795, 1816),
(1816, 1795),
-- instigate (wn=833, id=1772) <-> appease (wn=832, id=1771) 扇動する vs なだめる
(1772, 1771),
(1771, 1772),
-- foment (wn=928, id=1867) <-> appease (wn=832, id=1771) 助長する vs なだめる
(1867, 1771),
(1771, 1867),
-- feasible (wn=549, id=1438) <-> futile (wn=1294, id=392) 実現可能な vs 無益な
(1438, 392),
(392, 1438);
