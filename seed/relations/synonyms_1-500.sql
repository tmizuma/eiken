-- word_synonyms (word_number 1-500 担当分)
-- 各ペアは双方向で登録 (A→B, B→A)
INSERT OR IGNORE INTO word_synonyms (word_id, synonym_word_id) VALUES
-- squander (id=2, wn=2) ~ dissipate (id=1244, wn=355): 浪費する
(2, 1244),
(1244, 2),
-- lethargic (id=5, wn=5) ~ languid (id=163, wn=1063): 無気力な
(5, 163),
(163, 5),
-- lethargic (id=5, wn=5) ~ sluggish (id=1858, wn=919): 無気力な
(5, 1858),
(1858, 5),
-- pinnacle (id=6, wn=6) ~ zenith (id=24, wn=24): 頂点
(6, 24),
(24, 6),
-- pinnacle (id=6, wn=6) ~ apex (id=754, wn=1635): 頂点
(6, 754),
(754, 6),
-- allay (id=7, wn=7) ~ placate (id=16, wn=16): 鎮める/なだめる
(7, 16),
(16, 7),
-- allay (id=7, wn=7) ~ mollify (id=125, wn=125): 和らげる
(7, 125),
(125, 7),
-- allay (id=7, wn=7) ~ assuage (id=1144, wn=255): 和らげる
(7, 1144),
(1144, 7),
-- allay (id=7, wn=7) ~ alleviate (id=1484, wn=95): 軽減する
(7, 1484),
(1484, 7),
-- allay (id=7, wn=7) ~ mitigate (id=1914, wn=975): 和らげる
(7, 1914),
(1914, 7),
-- caustic (id=10, wn=10) ~ pungent (id=114, wn=114): 辛らつな
(10, 114),
(114, 10),
-- frivolous (id=11, wn=11) ~ flippant (id=295, wn=1195): 軽率な/ふまじめな
(11, 295),
(295, 11),
-- adept (id=13, wn=13) ~ adroit (id=669, wn=193): 巧みな
(13, 669),
(669, 13),
-- adept (id=13, wn=13) ~ astute (id=1315, wn=426): 鋭い/巧みな
(13, 1315),
(1315, 13),
-- adept (id=13, wn=13) ~ shrewd (id=493, wn=1404): 鋭い
(13, 493),
(493, 13),
-- avid (id=14, wn=14) ~ fervent (id=1440, wn=51): 熱心な
(14, 1440),
(1440, 14),
-- avid (id=14, wn=14) ~ ardent (id=1613, wn=674): 熱心な
(14, 1613),
(1613, 14),
-- placate (id=16, wn=16) ~ mollify (id=125, wn=125): なだめる
(16, 125),
(125, 16),
-- placate (id=16, wn=16) ~ assuage (id=1144, wn=255): 和らげる
(16, 1144),
(1144, 16),
-- placate (id=16, wn=16) ~ appease (id=1771, wn=832): なだめる
(16, 1771),
(1771, 16),
-- placate (id=16, wn=16) ~ pacify (id=442, wn=1349): なだめる
(16, 442),
(442, 16),
-- placate (id=16, wn=16) ~ conciliate (id=1370, wn=481): なだめる
(16, 1370),
(1370, 16),
-- pristine (id=17, wn=17) ~ immaculate (id=39, wn=39): 汚れていない
(17, 39),
(39, 17),
-- zenith (id=24, wn=24) ~ apex (id=754, wn=1635): 頂点
(24, 754),
(754, 24),
-- meticulous (id=26, wn=26) ~ fastidious (id=110, wn=110): 細心の注意を払った
(26, 110),
(110, 26),
-- meticulous (id=26, wn=26) ~ painstaking (id=1673, wn=734): 丹念な
(26, 1673),
(1673, 26),
-- propensity (id=28, wn=28) ~ penchant (id=1190, wn=301): 傾向/好み
(28, 1190),
(1190, 28),
-- propensity (id=28, wn=28) ~ predilection (id=296, wn=1196): 好み
(28, 296),
(296, 28),
-- entice (id=29, wn=29) ~ lure (id=769, wn=1651): 誘惑する
(29, 769),
(769, 29),
-- alienate (id=30, wn=30) ~ ostracize (id=41, wn=41): 疎外する/のけ者にする
(30, 41),
(41, 30),
-- exonerate (id=31, wn=31) ~ vindicate (id=108, wn=108): 無罪を証明する
(31, 108),
(108, 31),
-- exonerate (id=31, wn=31) ~ absolve (id=1169, wn=280): 罪を許す
(31, 1169),
(1169, 31),
-- tenacious (id=36, wn=36) ~ staunch (id=1485, wn=96): 粘り強い/忠実な
(36, 1485),
(1485, 36),
-- extol (id=37, wn=37) ~ acclaim (id=1923, wn=984): 絶賛する
(37, 1923),
(1923, 37),
-- extol (id=37, wn=37) ~ tout (id=150, wn=150): 褒めちぎる
(37, 150),
(150, 37),
-- aversion (id=38, wn=38) ~ animosity (id=628, wn=152): 嫌悪/敵意
(38, 628),
(628, 38),
-- aversion (id=38, wn=38) ~ disdain (id=1157, wn=268): 嫌悪/軽蔑
(38, 1157),
(1157, 38),
-- gregarious (id=40, wn=40) ~ extrovert (id=1348, wn=459): 社交的な
(40, 1348),
(1348, 40),
-- mayhem (id=44, wn=44) ~ commotion (id=663, wn=187): 大混乱/騒動
(44, 663),
(663, 44),
-- mayhem (id=44, wn=44) ~ havoc (id=1236, wn=347): 大混乱
(44, 1236),
(1236, 44),
-- mayhem (id=44, wn=44) ~ turmoil (id=1133, wn=244): 混乱/騒動
(44, 1133),
(1133, 44),
-- rebuke (id=48, wn=48) ~ reprimand (id=635, wn=159): 叱責する
(48, 635),
(635, 48),
-- rebuke (id=48, wn=48) ~ chastise (id=1389, wn=500): 厳しく非難する
(48, 1389),
(1389, 48),
-- rebuke (id=48, wn=48) ~ admonish (id=1138, wn=249): 忠告する/叱る
(48, 1138),
(1138, 48),
-- rebuke (id=48, wn=48) ~ berate (id=658, wn=182): きつく叱る
(48, 658),
(658, 48),
-- rebuke (id=48, wn=48) ~ lambaste (id=1477, wn=88): 酷評する
(48, 1477),
(1477, 48),
-- accolade (id=49, wn=49) ~ acclaim (id=1923, wn=984): 称賛
(49, 1923),
(1923, 49),
-- accolade (id=49, wn=49) ~ adulation (id=424, wn=1329): 称賛
(49, 424),
(424, 49),
-- fervent (id=1440, wn=51) ~ ardent (id=1613, wn=674): 熱心な
(1440, 1613),
(1613, 1440),
-- apathetic (id=1441, wn=52) ~ lethargic (id=5, wn=5): 無気力な
(1441, 5),
(5, 1441),
-- wane (id=1443, wn=54) ~ dwindle (id=1454, wn=65): 徐々に弱まる/減る
(1443, 1454),
(1454, 1443),
-- wane (id=1443, wn=54) ~ ebb (id=1328, wn=439): 衰退する
(1443, 1328),
(1328, 1443),
-- wane (id=1443, wn=54) ~ abate (id=104, wn=104): 弱まる
(1443, 104),
(104, 1443),
-- appall (id=1447, wn=58) ~ petrify (id=46, wn=46): ぞっとさせる
(1447, 46),
(46, 1447),
-- recuperate (id=1450, wn=61) ~ resuscitate (id=1797, wn=858): 回復する
(1450, 1797),
(1797, 1450),
-- dwindle (id=1454, wn=65) ~ diminish (id=1439, wn=550): 減少する
(1454, 1439),
(1439, 1454),
-- dwindle (id=1454, wn=65) ~ abate (id=104, wn=104): 弱まる/減る
(1454, 104),
(104, 1454),
-- corroborate (id=1458, wn=69) ~ substantiate (id=1120, wn=231): 裏づける
(1458, 1120),
(1120, 1458),
-- inscrutable (id=1459, wn=70) ~ cryptic (id=1186, wn=297): 不可解な
(1459, 1186),
(1186, 1459),
-- inscrutable (id=1459, wn=70) ~ enigmatic (id=297, wn=1197): 謎めいた
(1459, 297),
(297, 1459),
-- fiasco (id=1462, wn=73) ~ debacle (id=128, wn=128): 大失敗
(1462, 128),
(128, 1462),
-- aloof (id=1463, wn=74) ~ reclusive (id=1302, wn=413): 冷淡な/引きこもりがちな
(1463, 1302),
(1302, 1463),
-- altruistic (id=1464, wn=75) ~ benevolent (id=1818, wn=879): 利他的な/慈悲深い
(1464, 1818),
(1818, 1464),
-- quandary (id=1465, wn=76) ~ predicament (id=653, wn=177): 困惑/窮地
(1465, 653),
(653, 1465),
-- quandary (id=1465, wn=76) ~ dilemma (id=871, wn=1762): 困惑/板ばさみ
(1465, 871),
(871, 1465),
-- remorse (id=1470, wn=81) ~ compunction (id=122, wn=122): 良心の呵責
(1470, 122),
(122, 1470),
-- remorse (id=1470, wn=81) ~ contrition (id=1638, wn=699): 悔恨
(1470, 1638),
(1638, 1470),
-- delude (id=1471, wn=82) ~ dupe (id=1716, wn=777): だます
(1471, 1716),
(1716, 1471),
-- delude (id=1471, wn=82) ~ beguile (id=261, wn=1161): だます
(1471, 261),
(261, 1471),
-- precarious (id=1473, wn=84) ~ volatile (id=1768, wn=829): 不安定な
(1473, 1768),
(1768, 1473),
-- feign (id=1474, wn=85) ~ dissemble (id=522, wn=1436): 装う/偽る
(1474, 522),
(522, 1474),
-- lambaste (id=1477, wn=88) ~ berate (id=658, wn=182): 酷評する/叱る
(1477, 658),
(658, 1477),
-- lambaste (id=1477, wn=88) ~ slam (id=1719, wn=780): 酷評する
(1477, 1719),
(1719, 1477),
-- flagrant (id=1479, wn=90) ~ egregious (id=250, wn=1150): 目に余る
(1479, 250),
(250, 1479),
-- flout (id=1480, wn=91) ~ contravene (id=696, wn=1571): 無視する/違反する
(1480, 696),
(696, 1480),
-- inculcate (id=1481, wn=92) ~ instill (id=1227, wn=338): 教え込む
(1481, 1227),
(1227, 1481),
-- inculcate (id=1481, wn=92) ~ indoctrinate (id=1469, wn=80): 吹き込む
(1481, 1469),
(1469, 1481),
-- alleviate (id=1484, wn=95) ~ assuage (id=1144, wn=255): 和らげる
(1484, 1144),
(1144, 1484),
-- alleviate (id=1484, wn=95) ~ mitigate (id=1914, wn=975): 軽減する
(1484, 1914),
(1914, 1484),
-- alleviate (id=1484, wn=95) ~ mollify (id=125, wn=125): 和らげる
(1484, 125),
(125, 1484),
-- disseminate (id=1486, wn=97) ~ promulgate (id=735, wn=1614): 広める
(1486, 735),
(735, 1486),
-- baffle (id=1487, wn=98) ~ confound (id=1760, wn=821): 困惑させる
(1487, 1760),
(1760, 1487),
-- irate (id=101, wn=101) ~ livid (id=1377, wn=488): 激怒した
(101, 1377),
(1377, 101),
-- irate (id=101, wn=101) ~ indignant (id=1887, wn=948): 憤慨した
(101, 1887),
(1887, 101),
-- abate (id=104, wn=104) ~ diminish (id=1439, wn=550): 弱まる/減る
(104, 1439),
(1439, 104),
-- abate (id=104, wn=104) ~ ebb (id=1328, wn=439): 弱まる/衰退する
(104, 1328),
(1328, 104),
-- tarnish (id=107, wn=107) ~ blemish (id=1196, wn=307): 傷つける
(107, 1196),
(1196, 107),
-- tarnish (id=107, wn=107) ~ mar (id=1237, wn=348): 損なう
(107, 1237),
(1237, 107),
-- vindicate (id=108, wn=108) ~ absolve (id=1169, wn=280): 潔白を証明する
(108, 1169),
(1169, 108),
-- auspicious (id=109, wn=109) ~ propitious (id=1802, wn=863): 幸先のよい
(109, 1802),
(1802, 109),
-- conjecture (id=115, wn=115) ~ surmise (id=1936, wn=997): 推測する
(115, 1936),
(1936, 115),
-- conjecture (id=115, wn=115) ~ speculation (id=419, wn=1324): 推測
(115, 419),
(419, 115),
-- augment (id=120, wn=120) ~ bolster (id=1131, wn=242): 増大させる/強化する
(120, 1131),
(1131, 120),
-- compunction (id=122, wn=122) ~ contrition (id=1638, wn=699): 良心の呵責/悔恨
(122, 1638),
(1638, 122),
-- compunction (id=122, wn=122) ~ scruple (id=1095, wn=206): ためらい/良心のとがめ
(122, 1095),
(1095, 122),
-- diffident (id=124, wn=124) ~ reticent (id=224, wn=1124): 自信のない/口が重い
(124, 224),
(224, 124),
-- mollify (id=125, wn=125) ~ assuage (id=1144, wn=255): 和らげる
(125, 1144),
(1144, 125),
-- mollify (id=125, wn=125) ~ appease (id=1771, wn=832): なだめる
(125, 1771),
(1771, 125),
-- mollify (id=125, wn=125) ~ pacify (id=442, wn=1349): なだめる
(125, 442),
(442, 125),
-- mollify (id=125, wn=125) ~ conciliate (id=1370, wn=481): なだめる
(125, 1370),
(1370, 125),
-- torment (id=126, wn=126) ~ plague (id=136, wn=136): 苦しめる
(126, 136),
(136, 126),
-- detrimental (id=137, wn=137) ~ pernicious (id=213, wn=1113): 有害な
(137, 213),
(213, 137),
-- detrimental (id=137, wn=137) ~ inimical (id=742, wn=1622): 有害な
(137, 742),
(742, 137),
-- mundane (id=140, wn=140) ~ banal (id=1519, wn=580): 平凡な/陳腐な
(140, 1519),
(1519, 140),
-- mundane (id=140, wn=140) ~ trite (id=1851, wn=912): 平凡な/陳腐な
(140, 1851),
(1851, 140),
-- fluctuate (id=144, wn=144) ~ vacillate (id=1894, wn=955): 変動する/揺れる
(144, 1894),
(1894, 144),
-- contentious (id=147, wn=147) ~ controversial (id=818, wn=1704): 論争を呼ぶ
(147, 818),
(818, 147),
-- retaliation (id=148, wn=148) ~ reprisal (id=1360, wn=471): 報復
(148, 1360),
(1360, 148),
-- refute (id=627, wn=151) ~ rebut (id=661, wn=185): 反論する
(627, 661),
(661, 627),
-- animosity (id=628, wn=152) ~ enmity (id=670, wn=194): 敵意
(628, 670),
(670, 628),
-- animosity (id=628, wn=152) ~ malice (id=444, wn=1351): 悪意/敵意
(628, 444),
(444, 628),
-- reprimand (id=635, wn=159) ~ berate (id=658, wn=182): 叱責する
(635, 658),
(658, 635),
-- reprimand (id=635, wn=159) ~ chastise (id=1389, wn=500): 叱責する
(635, 1389),
(1389, 635),
-- grueling (id=639, wn=163) ~ arduous (id=1547, wn=608): 厳しい/骨の折れる
(639, 1547),
(1547, 639),
-- clandestine (id=645, wn=169) ~ covert (id=1507, wn=568): 秘密の
(645, 1507),
(1507, 645),
-- clandestine (id=645, wn=169) ~ furtive (id=1838, wn=899): 秘密の
(645, 1838),
(1838, 645),
-- consternation (id=651, wn=175) ~ dismay (id=709, wn=1586): 驚き/狼狽
(651, 709),
(709, 651),
-- predicament (id=653, wn=177) ~ plight (id=1509, wn=570): 窮地/苦境
(653, 1509),
(1509, 653),
-- berate (id=658, wn=182) ~ chastise (id=1389, wn=500): 叱る
(658, 1389),
(1389, 658),
-- belligerent (id=660, wn=184) ~ hostile (id=908, wn=1803): 好戦的な/敵意を持った
(660, 908),
(908, 660),
-- belligerent (id=660, wn=184) ~ antagonistic (id=1148, wn=259): 敵対的な
(660, 1148),
(1148, 660),
-- belligerent (id=660, wn=184) ~ truculent (id=174, wn=1074): 好戦的な
(660, 174),
(174, 660),
-- commotion (id=663, wn=187) ~ turmoil (id=1133, wn=244): 騒動
(663, 1133),
(1133, 663),
-- commotion (id=663, wn=187) ~ havoc (id=1236, wn=347): 大混乱
(663, 1236),
(1236, 663),
-- commotion (id=663, wn=187) ~ uproar (id=955, wn=1854): 大騒ぎ
(663, 955),
(955, 663),
-- adroit (id=669, wn=193) ~ astute (id=1315, wn=426): 鋭い/巧みな
(669, 1315),
(1315, 669),
-- adroit (id=669, wn=193) ~ shrewd (id=493, wn=1404): 抜け目のない
(669, 493),
(493, 669),
-- enmity (id=670, wn=194) ~ malice (id=444, wn=1351): 敵意/悪意
(670, 444),
(444, 670),
-- valiant (id=1090, wn=201) ~ intrepid (id=1899, wn=960): 勇敢な
(1090, 1899),
(1899, 1090),
-- valiant (id=1090, wn=201) ~ gallant (id=1787, wn=848): 勇敢な
(1090, 1787),
(1787, 1090),
-- frugal (id=1107, wn=218) ~ thrifty (id=1684, wn=745): 倹約的な
(1107, 1684),
(1684, 1107),
-- assuage (id=1144, wn=255) ~ appease (id=1771, wn=832): 和らげる/なだめる
(1144, 1771),
(1771, 1144),
-- assuage (id=1144, wn=255) ~ pacify (id=442, wn=1349): 和らげる/なだめる
(1144, 442),
(442, 1144),
-- assuage (id=1144, wn=255) ~ mitigate (id=1914, wn=975): 和らげる
(1144, 1914),
(1914, 1144),
-- overt (id=1147, wn=258) ~ explicit (id=1540, wn=601): 公然の/明白な
(1147, 1540),
(1540, 1147),
-- accentuate (id=1151, wn=262) ~ underscore (id=673, wn=1612): 強調する
-- Note: underscore id needs verification
-- Actually underscore doesn't appear in my lookup. Let me skip this one.
-- deplorable (id=1347, wn=458) ~ abject (id=1475, wn=86): 悲惨な
(1347, 1475),
(1475, 1347),
-- deplorable (id=1347, wn=458) ~ dire (id=1531, wn=592): 悲惨な
(1347, 1531),
(1531, 1347),
-- revamp (id=1259, wn=370) ~ revitalize (id=1226, wn=337): 刷新する/再活性化する
(1259, 1226),
(1226, 1259),
-- tacit (id=1299, wn=410) ~ implicit (id=497, wn=1409): 暗黙の
(1299, 497),
(497, 1299),
-- astute (id=1315, wn=426) ~ shrewd (id=493, wn=1404): 鋭い
(1315, 493),
(493, 1315),
-- vanity (id=1345, wn=456) ~ conceit (id=516, wn=1430): うぬぼれ
(1345, 516),
(516, 1345),
-- vanity (id=1345, wn=456) ~ hubris (id=428, wn=1334): 傲慢/うぬぼれ
(1345, 428),
(428, 1345),
-- omen (id=1354, wn=465) ~ harbinger (id=606, wn=1528): 前兆
(1354, 606),
(606, 1354),
-- eminent (id=1367, wn=478) ~ illustrious (id=1785, wn=846): 著名な
(1367, 1785),
(1785, 1367),
-- eminent (id=1367, wn=478) ~ renowned (id=978, wn=1879): 著名な
(1367, 978),
(978, 1367),
-- perfunctory (id=1371, wn=482) ~ cursory (id=305, wn=1205): 通り一遍の/大まかな
(1371, 305),
(305, 1371),
-- zeal (id=1378, wn=489) ~ fervor (id=525, wn=1439): 熱意
(1378, 525),
(525, 1378),
-- harrowing (id=1380, wn=491) ~ excruciating (id=671, wn=195): 悲惨な/激しい苦痛
(1380, 671),
(671, 1380),
-- brazen (id=1381, wn=492) ~ brash (id=1097, wn=208): 厚かましい
(1381, 1097),
(1097, 1381),
-- cajole (id=500, wn=1412) ~ coax (id=1342, wn=453): おだてる/説得する
(500, 1342),
(1342, 500),
-- momentous (id=1248, wn=359) ~ pivotal (id=1542, wn=603): 重大な
(1248, 1542),
(1542, 1248),
-- desolate (id=1361, wn=472) ~ bleak (id=391, wn=1293): 荒れ果てた
(1361, 391),
(391, 1361),
-- hoax (id=1245, wn=356) ~ sham (id=1855, wn=916): 偽物/いんちき
(1245, 1855),
(1855, 1245),
-- conciliate (id=1370, wn=481) ~ appease (id=1771, wn=832): なだめる
(1370, 1771),
(1771, 1370),
-- conciliate (id=1370, wn=481) ~ pacify (id=442, wn=1349): なだめる
(1370, 442),
(442, 1370),
-- disdain (id=1157, wn=268) ~ scorn (id=336, wn=1235): 軽蔑
(1157, 336),
(336, 1157),
-- havoc (id=1236, wn=347) ~ turmoil (id=1133, wn=244): 大混乱
(1236, 1133),
(1133, 1236),
-- bolster (id=1131, wn=242) ~ reinforce (id=850, wn=1738): 強化する
(1131, 850),
(850, 1131),
-- stringent (id=1243, wn=354) ~ rigorous (id=974, wn=1913): 厳格な
(1243, 974),
(974, 1243),
-- incessant (id=1285, wn=396) ~ relentless (id=680, wn=1619): 絶え間のない
(1285, 680),
(680, 1285),
-- negligent (id=1277, wn=388) ~ perfunctory (id=1371, wn=482): 怠慢な/いい加減な
(1277, 1371),
(1371, 1277),
-- perennial (id=1362, wn=473) ~ incessant (id=1285, wn=396): 絶え間ない
(1362, 1285),
(1285, 1362);
