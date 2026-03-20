-- word_synonyms (word_number 501-1000 担当分)
-- 少なくとも一方の単語が word_number 501-1000 に含まれるペア
-- 両方が word_number 1-500 のペアは除外

INSERT OR IGNORE INTO word_synonyms (word_id, synonym_word_id) VALUES
-- dearth (wn=516, id=1405) <-> scarcity (wn=968, id=1907) 不足、欠乏
(1405, 1907),
(1907, 1405),
-- dearth (wn=516, id=1405) <-> paucity (wn=1139, id=239) 不足、欠乏
(1405, 239),
(239, 1405),
-- scarcity (wn=968, id=1907) <-> paucity (wn=1139, id=239) 不足、欠乏
(1907, 239),
(239, 1907),
-- diminish (wn=550, id=1439) <-> wane (wn=54, id=1443) 衰える、減少する
(1439, 1443),
(1443, 1439),
-- diminish (wn=550, id=1439) <-> dwindle (wn=65, id=1454) 減少する
(1439, 1454),
(1454, 1439),
-- diminish (wn=550, id=1439) <-> abate (wn=104, id=104) 弱まる、和らぐ
(1439, 104),
(104, 1439),
-- covert (wn=568, id=1507) <-> clandestine (wn=169, id=645) 秘密の
(1507, 645),
(645, 1507),
-- covert (wn=568, id=1507) <-> furtive (wn=899, id=1838) 内密の、こっそりした
(1507, 1838),
(1838, 1507),
-- covert (wn=568, id=1507) <-> surreptitiously (wn=733, id=1672) ひそかに
(1507, 1672),
(1672, 1507),
-- furtive (wn=899, id=1838) <-> clandestine (wn=169, id=645) 秘密の
(1838, 645),
(645, 1838),
-- furtive (wn=899, id=1838) <-> surreptitiously (wn=733, id=1672) ひそかに
(1838, 1672),
(1672, 1838),
-- plight (wn=570, id=1509) <-> predicament (wn=177, id=653) 窮地、苦境
(1509, 653),
(653, 1509),
-- plight (wn=570, id=1509) <-> quandary (wn=76, id=1465) 困惑、窮地
(1509, 1465),
(1465, 1509),
-- ubiquitous (wn=577, id=1516) <-> pervasive (wn=407, id=1296) 至る所に存在する
(1516, 1296),
(1296, 1516),
-- banal (wn=580, id=1519) <-> mundane (wn=140, id=140) ありふれた、陳腐な
(1519, 140),
(140, 1519),
-- banal (wn=580, id=1519) <-> trite (wn=912, id=1851) 陳腐な
(1519, 1851),
(1851, 1519),
-- banal (wn=580, id=1519) <-> clichéd (wn=808, id=1747) 陳腐な
(1519, 1747),
(1747, 1519),
-- trite (wn=912, id=1851) <-> clichéd (wn=808, id=1747) 陳腐な
(1851, 1747),
(1747, 1851),
-- trite (wn=912, id=1851) <-> mundane (wn=140, id=140) ありふれた
(1851, 140),
(140, 1851),
-- insipid (wn=947, id=1886) <-> banal (wn=580, id=1519) 面白くない、陳腐な
(1886, 1519),
(1519, 1886),
-- burgeon (wn=594, id=1533) <-> flourish (wn=1255, id=355) 急成長する、繁栄する
(1533, 355),
(355, 1533),
-- expedite (wn=604, id=1543) <-> facilitate (wn=1698, id=812) 促進する
(1543, 812),
(812, 1543),
-- arduous (wn=608, id=1547) <-> grueling (wn=163, id=639) 骨の折れる、厳しい
(1547, 639),
(639, 1547),
-- arduous (wn=608, id=1547) <-> onerous (wn=1047, id=97) 骨の折れる
(1547, 97),
(97, 1547),
-- arduous (wn=608, id=1547) <-> strenuous (wn=1476, id=559) 激しい、骨の折れる
(1547, 559),
(559, 1547),
-- arduous (wn=608, id=1547) <-> laborious (wn=1116, id=216) 手間のかかる
(1547, 216),
(216, 1547),
-- demoralize (wn=611, id=1550) <-> dishearten → (no direct match, skip)
-- fraudulent (wn=612, id=1551) <-> bogus (wn=787, id=1726) 偽の
(1551, 1726),
(1726, 1551),
-- fraudulent (wn=612, id=1551) <-> counterfeit (wn=545, id=1434) 偽の
(1551, 1434),
(1434, 1551),
-- fraudulent (wn=612, id=1551) <-> sham (wn=916, id=1855) 偽の
(1551, 1855),
(1855, 1551),
-- counterfeit (wn=545, id=1434) <-> bogus (wn=787, id=1726) 偽の
(1434, 1726),
(1726, 1434),
-- counterfeit (wn=545, id=1434) <-> sham (wn=916, id=1855) 偽の
(1434, 1855),
(1855, 1434),
-- bogus (wn=787, id=1726) <-> sham (wn=916, id=1855) 偽の
(1726, 1855),
(1855, 1726),
-- frenetic (wn=505, id=1394) <-> frantic (wn=613, id=1552) 慌ただしい、取り乱した
(1394, 1552),
(1552, 1394),
-- turbulent (wn=621, id=1560) <-> chaotic (wn=1851, id=952) 混乱した
(1560, 952),
(952, 1560),
-- encroach (wn=581, id=1520) <-> infringe (wn=647, id=1586) 侵害する
(1520, 1586),
(1586, 1520),
-- jeopardy (wn=626, id=1565) <-> perilous (wn=1999, id=1088) 危険
(1565, 1088),
(1088, 1565),
-- disintegration (wn=627, id=1566) <-> dissolution (wn=1940, id=1034) 崩壊、分解
(1566, 1034),
(1034, 1566),
-- prudence (wn=639, id=1578) <-> circumspect (wn=883, id=1822) 慎重さ
(1578, 1822),
(1822, 1578),
-- regenerate (wn=651, id=1590) <-> rejuvenate (wn=902, id=1841) 再生する、若返らせる
(1590, 1841),
(1841, 1590),
-- regenerate (wn=651, id=1590) <-> revitalize (wn=337, id=1226) 再生する
(1590, 1226),
(1226, 1590),
-- rejuvenate (wn=902, id=1841) <-> revitalize (wn=337, id=1226) 若返らせる、再活性化する
(1841, 1226),
(1226, 1841),
-- resuscitate (wn=858, id=1797) <-> rejuvenate (wn=902, id=1841) 蘇生/再生
(1797, 1841),
(1841, 1797),
-- repeal (wn=672, id=1611) <-> revoke (wn=944, id=1883) 廃止する
(1611, 1883),
(1883, 1611),
-- repeal (wn=672, id=1611) <-> rescind (wn=965, id=1904) 廃止する、撤廃する
(1611, 1904),
(1904, 1611),
-- repeal (wn=672, id=1611) <-> nullify (wn=409, id=1298) 無効にする
(1611, 1298),
(1298, 1611),
-- revoke (wn=944, id=1883) <-> rescind (wn=965, id=1904) 無効にする
(1883, 1904),
(1904, 1883),
-- revoke (wn=944, id=1883) <-> nullify (wn=409, id=1298) 無効にする
(1883, 1298),
(1298, 1883),
-- rescind (wn=965, id=1904) <-> nullify (wn=409, id=1298) 無効にする
(1904, 1298),
(1298, 1904),
-- negate (wn=548, id=1437) <-> nullify (wn=409, id=1298) 無効にする
(1437, 1298),
(1298, 1437),
-- ardent (wn=674, id=1613) <-> fervent (wn=51, id=1440) 熱心な
(1613, 1440),
(1440, 1613),
-- ardent (wn=674, id=1613) <-> avid (wn=14, id=14) 熱心な
(1613, 14),
(14, 1613),
-- ardent (wn=674, id=1613) <-> zeal (wn=489, id=1378) 熱意
(1613, 1378),
(1378, 1613),
-- zeal (wn=489, id=1378) <-> zest (wn=721, id=1660) 熱意
(1378, 1660),
(1660, 1378),
-- zest (wn=721, id=1660) <-> fervor (wn=1439, id=525) 熱情
(1660, 525),
(525, 1660),
-- transient (wn=681, id=1620) <-> transitory (wn=816, id=1755) 一時的な
(1620, 1755),
(1755, 1620),
-- transient (wn=681, id=1620) <-> ephemeral (wn=1495, id=576) 一時的な
(1620, 576),
(576, 1620),
-- transitory (wn=816, id=1755) <-> ephemeral (wn=1495, id=576) 一時的な
(1755, 576),
(576, 1755),
-- affable (wn=685, id=1624) <-> amiable (wn=769, id=1708) 愛想のよい
(1624, 1708),
(1708, 1624),
-- affable (wn=685, id=1624) <-> gregarious (wn=40, id=40) 社交的な
(1624, 40),
(40, 1624),
-- amiable (wn=769, id=1708) <-> gregarious (wn=40, id=40) 人当たりのよい
(1708, 40),
(40, 1708),
-- affable (wn=685, id=1624) <-> congenial (wn=794, id=1733) 感じのよい
(1624, 1733),
(1733, 1624),
-- amiable (wn=769, id=1708) <-> congenial (wn=794, id=1733) 感じのよい
(1708, 1733),
(1733, 1708),
-- arcane (wn=689, id=1628) <-> cryptic (wn=297, id=1186) 難解な
(1628, 1186),
(1186, 1628),
-- arcane (wn=689, id=1628) <-> inscrutable (wn=70, id=1459) 不可解な
(1628, 1459),
(1459, 1628),
-- arcane (wn=689, id=1628) <-> enigmatic (wn=1197, id=297) 謎めいた
(1628, 297),
(297, 1628),
-- contrition (wn=699, id=1638) <-> remorse (wn=81, id=1470) 悔恨
(1638, 1470),
(1470, 1638),
-- contrition (wn=699, id=1638) <-> compunction (wn=122, id=122) 良心の呵責
(1638, 122),
(122, 1638),
-- impasse (wn=377, id=1266) <-> deadlock (wn=720, id=1659) 行き詰まり
(1266, 1659),
(1659, 1266),
-- deadlock (wn=720, id=1659) <-> standstill (wn=1922, id=1017) 行き詰まり
(1659, 1017),
(1017, 1659),
-- avenge (wn=726, id=1665) <-> retaliation (wn=148, id=148) 復讐、報復
(1665, 148),
(148, 1665),
-- avenge (wn=726, id=1665) <-> reprisal (wn=471, id=1360) 報復
(1665, 1360),
(1360, 1665),
-- painstaking (wn=734, id=1673) <-> meticulous (wn=26, id=26) 細心の注意を払った
(1673, 26),
(26, 1673),
-- painstaking (wn=734, id=1673) <-> conscientious (wn=1046, id=96) 念入りの
(1673, 96),
(96, 1673),
-- grudge (wn=740, id=1679) <-> animosity (wn=152, id=628) 恨み、敵意
(1679, 628),
(628, 1679),
-- grudge (wn=740, id=1679) <-> enmity (wn=194, id=670) 恨み、敵意
(1679, 670),
(670, 1679),
-- grudge (wn=740, id=1679) <-> malice (wn=1351, id=444) 悪意
(1679, 444),
(444, 1679),
-- thrifty (wn=745, id=1684) <-> frugal (wn=218, id=1107) 倹約な
(1684, 1107),
(1107, 1684),
-- sumptuous (wn=759, id=1698) <-> opulent (wn=372, id=1261) 豪華な
(1698, 1261),
(1261, 1698),
-- sumptuous (wn=759, id=1698) <-> lavish (wn=462, id=1351) 豪華な
(1698, 1351),
(1351, 1698),
-- assiduous (wn=757, id=1696) <-> meticulous (wn=26, id=26) 勤勉な、細心の
(1696, 26),
(26, 1696),
-- profusion (wn=761, id=1700) <-> glut (wn=220, id=1109) 多数、供給過剰
(1700, 1109),
(1109, 1700),
-- insurgency (wn=778, id=1717) <-> insurrection (wn=1028, id=78) 反乱
(1717, 78),
(78, 1717),
-- insurgency (wn=778, id=1717) <-> uprising (wn=1745, id=855) 反乱
(1717, 855),
(855, 1717),
-- insurgency (wn=778, id=1717) <-> revolt (wn=1775, id=883) 反乱
(1717, 883),
(883, 1717),
-- dormant (wn=799, id=1738) <-> latent (wn=1057, id=157) 休止状態の、潜在的な
(1738, 157),
(157, 1738),
-- haven (wn=800, id=1739) <-> sanctuary (wn=1387, id=477) 避難所
(1739, 477),
(477, 1739),
-- haven (wn=800, id=1739) <-> asylum (wn=15, id=15) 保護、避難所
(1739, 15),
(15, 1739),
-- redress (wn=810, id=1749) <-> rectify (wn=905, id=1844) 正す、補償
(1749, 1844),
(1844, 1749),
-- imprudent (wn=817, id=1756) <-> rash (wn=1844, id=946) 軽率な
(1756, 946),
(946, 1756),
-- intrinsic (wn=822, id=1761) <-> inherent (wn=1722, id=834) 固有の、本来の
(1761, 834),
(834, 1761),
-- intrinsic (wn=822, id=1761) <-> innately (wn=739, id=1678) 生来の
(1761, 1678),
(1678, 1761),
-- disparage (wn=824, id=1763) <-> denigrate (wn=330, id=1219) けなす
(1763, 1219),
(1219, 1763),
-- disparage (wn=824, id=1763) <-> vilify (wn=990, id=1929) 中傷する
(1763, 1929),
(1929, 1763),
-- disparage (wn=824, id=1763) <-> defame (wn=1032, id=82) 中傷する
(1763, 82),
(82, 1763),
-- vilify (wn=990, id=1929) <-> denigrate (wn=330, id=1219) 中傷する
(1929, 1219),
(1219, 1929),
-- vilify (wn=990, id=1929) <-> defame (wn=1032, id=82) 中傷する
(1929, 82),
(82, 1929),
-- denounce (wn=971, id=1910) <-> decry (wn=381, id=1270) 非難する
(1910, 1270),
(1270, 1910),
-- denounce (wn=971, id=1910) <-> censure (wn=1095, id=195) 非難する
(1910, 195),
(195, 1910),
-- volatile (wn=829, id=1768) <-> erratic (wn=279, id=1168) 変わりやすい、不安定な
(1768, 1168),
(1168, 1768),
-- volatile (wn=829, id=1768) <-> fickle (wn=272, id=1161) 変わりやすい
(1768, 1161),
(1161, 1768),
-- volatile (wn=829, id=1768) <-> capricious (wn=1175, id=275) 気まぐれな
(1768, 275),
(275, 1768),
-- precarious (wn=84, id=1473) <-> volatile (wn=829, id=1768) 不安定な
(1473, 1768),
(1768, 1473),
-- appease (wn=832, id=1771) <-> placate (wn=16, id=16) なだめる
(1771, 16),
(16, 1771),
-- appease (wn=832, id=1771) <-> mollify (wn=125, id=125) なだめる
(1771, 125),
(125, 1771),
-- appease (wn=832, id=1771) <-> assuage (wn=255, id=1144) 和らげる
(1771, 1144),
(1144, 1771),
-- instigate (wn=833, id=1772) <-> foment (wn=928, id=1867) 扇動する
(1772, 1867),
(1867, 1772),
-- instigate (wn=833, id=1772) <-> incite (wn=1859, id=960) 扇動する
(1772, 960),
(960, 1772),
-- foment (wn=928, id=1867) <-> incite (wn=1859, id=960) 扇動する
(1867, 960),
(960, 1867),
-- resilient (wn=841, id=1780) <-> tenacious (wn=36, id=36) 回復力/粘り強い
(1780, 36),
(36, 1780),
-- illustrious (wn=846, id=1785) <-> eminent (wn=478, id=1367) 著名な
(1785, 1367),
(1367, 1785),
-- illustrious (wn=846, id=1785) <-> renowned (wn=1879, id=978) 著名な
(1785, 978),
(978, 1785),
-- gallant (wn=848, id=1787) <-> valiant (wn=201, id=1090) 勇敢な
(1787, 1090),
(1090, 1787),
-- gallant (wn=848, id=1787) <-> intrepid (wn=960, id=1899) 勇敢な
(1787, 1899),
(1899, 1787),
-- intrepid (wn=960, id=1899) <-> valiant (wn=201, id=1090) 勇敢な
(1899, 1090),
(1090, 1899),
-- forlorn (wn=850, id=1789) <-> despondent (wn=497, id=1386) 孤独な、落胆した
(1789, 1386),
(1386, 1789),
-- forlorn (wn=850, id=1789) <-> desolate (wn=472, id=1361) 孤独な
(1789, 1361),
(1361, 1789),
-- morose (wn=911, id=1850) <-> somber (wn=252, id=1141) 不機嫌な、陰気な
(1850, 1141),
(1141, 1850),
-- dreary (wn=910, id=1849) <-> somber (wn=252, id=1141) 陰うつな
(1849, 1141),
(1141, 1849),
-- dreary (wn=910, id=1849) <-> morose (wn=911, id=1850) 陰うつな、不機嫌な
(1849, 1850),
(1850, 1849),
-- usurp (wn=856, id=1795) <-> wrest (wn=819, id=1758) 不法に奪う、力ずくで奪う
(1795, 1758),
(1758, 1795),
-- exasperate (wn=857, id=1796) <-> incense (wn=1011, id=61) 激怒させる
(1796, 61),
(61, 1796),
-- propitious (wn=863, id=1802) <-> auspicious (wn=109, id=109) 好都合な、幸先のよい
(1802, 109),
(109, 1802),
-- hamper (wn=867, id=1806) <-> hinder (wn=1831, id=934) 妨げる
(1806, 934),
(934, 1806),
-- hamper (wn=867, id=1806) <-> stymie (wn=1584, id=708) 妨害する
(1806, 708),
(708, 1806),
-- hamper (wn=867, id=1806) <-> thwart (wn=420, id=1309) 阻止する
(1806, 1309),
(1309, 1806),
-- fortify (wn=871, id=1810) <-> bolster (wn=242, id=1131) 強化する
(1810, 1131),
(1131, 1810),
-- fortify (wn=871, id=1810) <-> reinforce (wn=1738, id=849) 強化する
(1810, 849),
(849, 1810),
-- relinquish (wn=877, id=1816) <-> abdicate (wn=467, id=1356) 放棄する
(1816, 1356),
(1356, 1816),
-- relinquish (wn=877, id=1816) <-> forgo (wn=801, id=1740) 控える、放棄する
(1816, 1740),
(1740, 1816),
-- relinquish (wn=877, id=1816) <-> waive (wn=553, id=1492) 放棄する
(1816, 1492),
(1492, 1816),
-- forgo (wn=801, id=1740) <-> waive (wn=553, id=1492) 放棄する
(1740, 1492),
(1492, 1740),
-- forgo (wn=801, id=1740) <-> abdicate (wn=467, id=1356) 放棄する
(1740, 1356),
(1356, 1740),
-- benevolent (wn=879, id=1818) <-> altruistic (wn=75, id=1464) 慈悲深い、利他的
(1818, 1464),
(1464, 1818),
-- venerable (wn=885, id=1824) <-> revere (wn=1268, id=368) 尊敬すべき/崇敬する
(1824, 368),
(368, 1824),
-- irate (wn=101, id=101) <-> indignant (wn=948, id=1887) 激怒した、憤慨した
(101, 1887),
(1887, 101),
-- livid (wn=488, id=1377) <-> indignant (wn=948, id=1887) 激怒した
(1377, 1887),
(1887, 1377),
-- irascible (wn=901, id=1840) <-> irate (wn=101, id=101) 怒りっぽい/激怒した
(1840, 101),
(101, 1840),
-- allure (wn=897, id=1836) <-> entice (wn=29, id=29) 魅力/誘惑する
(1836, 29),
(29, 1836),
-- deplorable (wn=458, id=1347) <-> atrocious (wn=755, id=1694) ひどい
(1347, 1694),
(1694, 1347),
-- deplorable (wn=458, id=1347) <-> abominable (wn=892, id=1831) ひどい
(1347, 1831),
(1831, 1347),
-- atrocious (wn=755, id=1694) <-> abominable (wn=892, id=1831) ひどい
(1694, 1831),
(1831, 1694),
-- dilapidated (wn=306, id=1195) <-> decrepit (wn=914, id=1853) 老朽化した
(1195, 1853),
(1853, 1195),
-- superfluous (wn=921, id=1860) <-> extraneous (wn=1085, id=185) 余分な
(1860, 185),
(185, 1860),
-- enthrall (wn=922, id=1861) <-> mesmerize (wn=416, id=1305) 魅了する
(1861, 1305),
(1305, 1861),
-- enthrall (wn=922, id=1861) <-> enchant (wn=1086, id=186) 魅了する
(1861, 186),
(186, 1861),
-- enthrall (wn=922, id=1861) <-> dazzle (wn=775, id=1714) 魅了/驚嘆させる
(1861, 1714),
(1714, 1861),
-- dazzle (wn=775, id=1714) <-> mesmerize (wn=416, id=1305) 魅了する
(1714, 1305),
(1305, 1714),
-- sluggish (wn=919, id=1858) <-> lethargic (wn=5, id=5) 鈍い、無気力な
(1858, 5),
(5, 1858),
-- sluggish (wn=919, id=1858) <-> languid (wn=1063, id=163) 緩慢な、気だるい
(1858, 163),
(163, 1858),
-- aggravate (wn=540, id=1429) <-> exacerbate (wn=233, id=1122) 悪化させる
(1429, 1122),
(1122, 1429),
-- mitigate (wn=975, id=1914) <-> alleviate (wn=95, id=1484) 和らげる
(1914, 1484),
(1484, 1914),
-- mitigate (wn=975, id=1914) <-> assuage (wn=255, id=1144) 和らげる
(1914, 1144),
(1144, 1914),
-- mitigate (wn=975, id=1914) <-> ameliorate (wn=1623, id=743) 改善する
(1914, 743),
(743, 1914),
-- feasible (wn=549, id=1438) <-> viable (wn=1764, id=873) 実現可能な
(1438, 873),
(873, 1438),
-- onset (wn=554, id=1493) <-> inception (wn=349, id=1238) 始まり
(1493, 1238),
(1238, 1493),
-- demise (wn=543, id=1432) <-> cessation (wn=240, id=1129) 終結、停止
(1432, 1129),
(1129, 1432),
-- swindle (wn=468, id=1357) <-> defraud (wn=688, id=1627) だます、詐取する
(1357, 1627),
(1627, 1357),
-- swindle (wn=468, id=1357) <-> dupe (wn=777, id=1716) だます
(1357, 1716),
(1716, 1357),
-- defraud (wn=688, id=1627) <-> dupe (wn=777, id=1716) だます
(1627, 1716),
(1716, 1627),
-- libel (wn=531, id=1420) <-> slur (wn=464, id=1353) 名誉毀損/中傷
(1420, 1353),
(1353, 1420),
-- confiscate (wn=238, id=1127) <-> expropriate (wn=753, id=1692) 没収する
(1127, 1692),
(1692, 1127),
-- degenerate (wn=772, id=1711) <-> deteriorate (wn=1269, id=369) 悪化する
(1711, 369),
(369, 1711),
-- sever (wn=730, id=1669) <-> rupture (wn=1222, id=322) 断つ/破裂
(1669, 322),
(322, 1669),
-- vacillate (wn=955, id=1894) <-> waver (wn=1624, id=744) ぐらつく、動揺する
(1894, 744),
(744, 1894),
-- vacillate (wn=955, id=1894) <-> falter (wn=428, id=1317) ぐらつく
(1894, 1317),
(1317, 1894),
-- ponder (wn=636, id=1575) <-> contemplate (wn=1360, id=452) 熟考する
(1575, 452),
(452, 1575),
-- ponder (wn=636, id=1575) <-> cogitate (wn=1132, id=232) 熟考する
(1575, 232),
(232, 1575),
-- acclaim (wn=984, id=1923) <-> accolade (wn=49, id=49) 称賛
(1923, 49),
(49, 1923),
-- acclaim (wn=984, id=1923) <-> extol (wn=37, id=37) 称賛する
(1923, 37),
(37, 1923),
-- laudable (wn=705, id=1644) <-> exemplary (wn=391, id=1280) 称賛に値する、模範的な
(1644, 1280),
(1280, 1644),
-- ecstatic (wn=952, id=1891) <-> euphoric (wn=282, id=1171) 有頂天の
(1891, 1171),
(1171, 1891),
-- ecstatic (wn=952, id=1891) <-> elated (wn=1178, id=278) 有頂天の
(1891, 278),
(278, 1891),
-- ecstatic (wn=952, id=1891) <-> jubilant (wn=1611, id=732) 歓喜の
(1891, 732),
(732, 1891),
-- ecstatic (wn=952, id=1891) <-> rapture (wn=1457, id=541) 有頂天/歓喜
(1891, 541),
(541, 1891),
-- incapacitate (wn=991, id=1930) <-> cripple (wn=1280, id=379) 機能を奪う
(1930, 379),
(379, 1930),
-- calamity (wn=992, id=1931) <-> catastrophe (wn=1871, id=971) 災難
(1931, 971),
(971, 1931),
-- calamity (wn=992, id=1931) <-> fiasco (wn=73, id=1462) 災難/大失敗
(1931, 1462),
(1462, 1931),
-- calamity (wn=992, id=1931) <-> debacle (wn=128, id=128) 大失敗
(1931, 128),
(128, 1931),
-- overt (wn=258, id=1147) <-> explicit (wn=601, id=1540) 公然の、あからさまな
(1147, 1540),
(1540, 1147),
-- stringent (wn=354, id=1243) <-> rigorous (wn=974, id=1913) 厳格な
(1243, 1913),
(1913, 1243),
-- snag (wn=506, id=1395) <-> impediment (wn=385, id=1274) 障害
(1395, 1274),
(1274, 1395),
-- snag (wn=506, id=1395) <-> hitch (wn=1399, id=488) 障害
(1395, 488),
(488, 1395),
-- renunciation (wn=918, id=1857) <-> abdication (wn=467, id=1356) 放棄
(1857, 1356),
(1356, 1857),
-- renunciation (wn=918, id=1857) <-> relinquish (wn=877, id=1816) 放棄
(1857, 1816),
(1816, 1857),
-- destitute (wn=606, id=1545) <-> impoverish (wn=1367, id=459) 困窮した/貧乏にする
(1545, 459),
(459, 1545),
-- pitiable/deplorable (wn=592, id=1531) dire <-> deplorable (wn=458, id=1347) ひどい、悲惨な
-- dire (wn=592, id=1531) <-> deplorable (wn=458, id=1347) 悲惨な
(1531, 1347),
(1347, 1531),
-- plummet (wn=616, id=1555) <-> soar (wn=1249, id=349) は反語なので除外
-- squalid (wn=715, id=1654) <-> sordid (wn=1105, id=205) 不潔な
(1654, 205),
(205, 1654),
-- ubiquitous (wn=577, id=1516) <-> rife (wn=802, id=1741) 広まった
(1516, 1741),
(1741, 1516),
-- pervasive (wn=407, id=1296) <-> rife (wn=802, id=1741) 広まった
(1296, 1741),
(1741, 1296),
-- pitiable → harrowing (wn=491, id=1380) <-> dire (wn=592, id=1531) 悲惨な
(1380, 1531),
(1531, 1380),
-- mayhem (wn=44, id=44) <-> turmoil (wn=244, id=1133) → both 1-500, skip
-- havoc (wn=347, id=1236) <-> turmoil (wn=244, id=1133) → both 1-500, skip
-- incumbent on → pivotal (wn=603, id=1542) <-> paramount (wn=1252, id=352) 重要な
(1542, 352),
(352, 1542),
-- pivotal (wn=603, id=1542) <-> momentous (wn=359, id=1248) 重大な
(1542, 1248),
(1248, 1542),
-- wary (wn=1892, id=990) <-> circumspect (wn=883, id=1822) 慎重な
(990, 1822),
(1822, 990),
-- wary (wn=1892, id=990) <-> prudence (wn=639, id=1578) 用心深い
(990, 1578),
(1578, 990),
-- nebulous (wn=931, id=1870) <-> ambiguity (wn=1298, id=395) 漠然とした
(1870, 395),
(395, 1870),
-- procrastinate (wn=930, id=1869) <-> dawdle (wn=290, id=1179) 先延ばし/ぐずぐずする
(1869, 1179),
(1179, 1869),
-- undermine (wn=967, id=1906) <-> subvert (wn=172, id=648) 弱体化させる
(1906, 648),
(648, 1906),
-- imperative (wn=976, id=1915) <-> requisite (wn=390, id=1279) 必要不可欠な
(1915, 1279),
(1279, 1915),
-- imperative (wn=976, id=1915) <-> indispensable (wn=1770, id=878) 不可欠な
(1915, 878),
(878, 1915),
-- imperative (wn=976, id=1915) <-> mandatory (wn=1724, id=836) 必須の
(1915, 836),
(836, 1915),
-- concoct (wn=956, id=1895) <-> fabricate (wn=1356, id=449) でっち上げる
(1895, 449),
(449, 1895);
