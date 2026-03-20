-- word_antonyms (word_number 1-500 担当分)
-- 各ペアは双方向で登録 (A→B, B→A)
INSERT OR IGNORE INTO word_antonyms (word_id, antonym_word_id) VALUES
-- lethargic (id=5, wn=5) ~ exuberant (id=1187, wn=298): 無気力な vs 元気いっぱいの
(5, 1187),
(1187, 5),
-- adept (id=13, wn=13) ~ inept (id=153, wn=1053): 巧みな vs 不器用な
(13, 153),
(153, 13),
-- avid (id=14, wn=14) ~ apathetic (id=1441, wn=52): 熱心な vs 無関心な
(14, 1441),
(1441, 14),
-- gregarious (id=40, wn=40) ~ aloof (id=1463, wn=74): 社交的な vs 冷淡な
(40, 1463),
(1463, 40),
-- gregarious (id=40, wn=40) ~ reclusive (id=1302, wn=413): 社交的な vs 引きこもりがちな
(40, 1302),
(1302, 40),
-- salient (id=43, wn=43) ~ inconspicuous (id=1267, wn=378): 顕著な vs 目立たない
(43, 1267),
(1267, 43),
-- apathetic (id=1441, wn=52) ~ fervent (id=1440, wn=51): 無関心な vs 熱心な
(1441, 1440),
(1440, 1441),
-- apathetic (id=1441, wn=52) ~ ardent (id=1613, wn=674): 無関心な vs 熱心な
(1441, 1613),
(1613, 1441),
-- wane (id=1443, wn=54) ~ burgeon (id=1533, wn=594): 衰える vs 急成長する
(1443, 1533),
(1533, 1443),
-- wane (id=1443, wn=54) ~ flourish (id=355, wn=1255): 衰える vs 栄える
(1443, 355),
(355, 1443),
-- wane (id=1443, wn=54) ~ augment (id=120, wn=120): 衰える vs 増大させる
(1443, 120),
(120, 1443),
-- altruistic (id=1464, wn=75) ~ selfish → not in list. Skip.
-- precarious (id=1473, wn=84) ~ stable → not in list. Skip.
-- abate (id=104, wn=104) ~ augment (id=120, wn=120): 弱まる vs 増大させる
(104, 120),
(120, 104),
-- abate (id=104, wn=104) ~ exacerbate (id=1122, wn=233): 弱まる vs 悪化させる
(104, 1122),
(1122, 104),
-- abate (id=104, wn=104) ~ intensify (id=862, wn=1752): 弱まる vs 強める
(104, 862),
(862, 104),
-- idyllic (id=105, wn=105) ~ squalid (id=1654, wn=715): のどかな vs 不潔な
(105, 1654),
(1654, 105),
-- tarnish (id=107, wn=107) ~ burnish (id=726, wn=1604): 光沢を失わせる vs 磨く
(107, 726),
(726, 107),
-- diffident (id=124, wn=124) ~ assertive (id=965, wn=1865): 自信のない vs 自信に満ちた
(124, 965),
(965, 124),
-- diffident (id=124, wn=124) ~ brash (id=1097, wn=208): 自信のない vs 厚かましい
(124, 1097),
(1097, 124),
-- resplendent (id=130, wn=130) ~ drab (id=1094, wn=205): きらびやかな vs さえない
(130, 1094),
(1094, 130),
-- detrimental (id=137, wn=137) ~ conducive (id=308, wn=1208): 有害な vs 資する
(137, 308),
(308, 137),
-- insurmountable (id=145, wn=145) ~ cinch (id=1304, wn=415): 克服できない vs たやすいこと
(145, 1304),
(1304, 145),
-- contentious (id=147, wn=147) → skip (no clear antonym in list)
-- frugal (id=1107, wn=218) ~ lavish (id=1351, wn=462): 倹約的な vs ぜいたくな
(1107, 1351),
(1351, 1107),
-- frugal (id=1107, wn=218) ~ opulent (id=1261, wn=372): 倹約的な vs 豪華な
(1107, 1261),
(1261, 1107),
-- frugal (id=1107, wn=218) ~ sumptuous (id=1698, wn=759): 倹約的な vs 豪華な
(1107, 1698),
(1698, 1107),
-- overt (id=1147, wn=258) ~ covert (id=1507, wn=568): 公然の vs 密かな
(1147, 1507),
(1507, 1147),
-- overt (id=1147, wn=258) ~ clandestine (id=645, wn=169): 公然の vs 秘密の
(1147, 645),
(645, 1147),
-- somber (id=1141, wn=252) ~ jovial (id=331, wn=1231): 陰気な vs 陽気な
(1141, 331),
(331, 1141),
-- somber (id=1141, wn=252) ~ exuberant (id=1187, wn=298): 陰気な vs 元気いっぱいの
(1141, 1187),
(1187, 1141),
-- disdain (id=1157, wn=268) ~ revere (id=369, wn=1268): 軽蔑 vs 崇敬する
(1157, 369),
(369, 1157),
-- fickle (id=1161, wn=272) ~ staunch (id=1485, wn=96): 気まぐれな vs 忠実な
(1161, 1485),
(1485, 1161),
-- placid (id=1163, wn=274) ~ turbulent (id=1560, wn=621): 穏やかな vs 動乱の
(1163, 1560),
(1560, 1163),
-- euphoric (id=1171, wn=282) ~ despondent (id=1386, wn=497): 有頂天の vs 落胆した
(1171, 1386),
(1386, 1171),
-- euphoric (id=1171, wn=282) ~ morose (id=1850, wn=911): 有頂天の vs 不機嫌な
(1171, 1850),
(1850, 1171),
-- exacerbate (id=1122, wn=233) ~ alleviate (id=1484, wn=95): 悪化させる vs 軽減する
(1122, 1484),
(1484, 1122),
-- exacerbate (id=1122, wn=233) ~ mitigate (id=1914, wn=975): 悪化させる vs 和らげる
(1122, 1914),
(1914, 1122),
-- exacerbate (id=1122, wn=233) ~ ameliorate (id=743, wn=1623): 悪化させる vs 改善する
(1122, 743),
(743, 1122),
-- exorbitant (id=1126, wn=237) ~ paltry (id=1197, wn=308): 法外な vs 取るに足りない
(1126, 1197),
(1197, 1126),
-- exorbitant (id=1126, wn=237) ~ meager (id=1269, wn=380): 法外な vs 不十分な
(1126, 1269),
(1269, 1126),
-- curtail (id=1128, wn=239) ~ augment (id=120, wn=120): 削減する vs 増大させる
(1128, 120),
(120, 1128),
-- curtail (id=1128, wn=239) ~ amplify (id=416, wn=1320): 削減する vs 拡大する
(1128, 416),
(416, 1128),
-- bolster (id=1131, wn=242) ~ undermine (id=1906, wn=967): 強化する vs 弱める
(1131, 1906),
(1906, 1131),
-- stringent (id=1243, wn=354) ~ lenient (id=412, wn=1316): 厳格な vs 寛大な
(1243, 412),
(412, 1243),
-- stringent (id=1243, wn=354) ~ lax (id=604, wn=1526): 厳格な vs ゆるい
(1243, 604),
(604, 1243),
-- benign (id=1251, wn=362) ~ malevolent (id=259, wn=1159): 穏やかな vs 悪意のある
(1251, 259),
(259, 1251),
-- benign (id=1251, wn=362) ~ pernicious (id=213, wn=1113): 良性の vs 有害な
(1251, 213),
(213, 1251),
-- benign (id=1251, wn=362) ~ lethal (id=1433, wn=544): 良性の vs 致命的な
(1251, 1433),
(1433, 1251),
-- accentuate (id=1151, wn=262) ~ downplay (id=372, wn=1272): 強調する vs 過小評価する
(1151, 372),
(372, 1151),
-- succinct (id=1206, wn=317) ~ verbose (id=1786, wn=847): 簡潔な vs 冗長な
(1206, 1786),
(1786, 1206),
-- denigrate (id=1219, wn=330) ~ extol (id=37, wn=37): けなす vs 絶賛する
(1219, 37),
(37, 1219),
-- denigrate (id=1219, wn=330) ~ acclaim (id=1923, wn=984): けなす vs 称賛する
(1219, 1923),
(1923, 1219),
-- impeccable (id=1257, wn=368) ~ shoddy (id=454, wn=1362): 完璧な vs 粗悪な
(1257, 454),
(454, 1257),
-- impeccable (id=1257, wn=368) ~ mediocre (id=1276, wn=387): 完璧な vs 平凡な
(1257, 1276),
(1276, 1257),
-- meager (id=1269, wn=380) ~ bountiful (id=476, wn=1386): 乏しい vs 豊富な
(1269, 476),
(476, 1269),
-- meager (id=1269, wn=380) ~ copious (id=1318, wn=429): 乏しい vs 多くの
(1269, 1318),
(1318, 1269),
-- meager (id=1269, wn=380) ~ lavish (id=1351, wn=462): 乏しい vs 豪華な
(1269, 1351),
(1351, 1269),
-- negligent (id=1277, wn=388) ~ meticulous (id=26, wn=26): 怠慢な vs 細心の
(1277, 26),
(26, 1277),
-- negligent (id=1277, wn=388) ~ assiduous (id=1696, wn=757): 怠慢な vs 勤勉な
(1277, 1696),
(1696, 1277),
-- exemplary (id=1280, wn=391) ~ deplorable (id=1347, wn=458): 模範的な vs 嘆かわしい
(1280, 1347),
(1347, 1280),
-- incessant (id=1285, wn=396) ~ sporadic (id=103, wn=103): 絶え間のない vs 散発的な
(1285, 103),
(103, 1285),
-- stagnant (id=1292, wn=403) ~ burgeon (id=1533, wn=594): 停滞した vs 急成長する
(1292, 1533),
(1533, 1292),
-- pertinent (id=1290, wn=401) ~ irrelevant (id=947, wn=1845): 関係のある vs 関連のない
(1290, 947),
(947, 1290),
-- tacit (id=1299, wn=410) ~ explicit (id=1540, wn=601): 暗黙の vs 明白な
(1299, 1540),
(1540, 1299),
-- reprehensible (id=1185, wn=296) ~ laudable (id=1644, wn=705): 非難に値する vs 称賛に値する
(1185, 1644),
(1644, 1185),
-- boisterous (id=1341, wn=452) ~ subdued (id=1544, wn=605): 騒がしい vs おとなしい
(1341, 1544),
(1544, 1341),
-- lavish (id=1351, wn=462) ~ thrifty (id=1684, wn=745): ぜいたくな vs 質素な
(1351, 1684),
(1684, 1351),
-- deplorable (id=1347, wn=458) ~ laudable (id=1644, wn=705): 嘆かわしい vs 称賛に値する
(1347, 1644),
(1644, 1347),
-- opulent (id=1261, wn=372) ~ destitute (id=1545, wn=606): 豪華な vs 極貧の
(1261, 1545),
(1545, 1261),
-- opulent (id=1261, wn=372) ~ meager (id=1269, wn=380): 豪華な vs 乏しい
(1261, 1269),
(1269, 1261),
-- aboveboard (id=1366, wn=477) ~ clandestine (id=645, wn=169): 公正な vs 秘密の
(1366, 645),
(645, 1366),
-- aboveboard (id=1366, wn=477) ~ covert (id=1507, wn=568): 公正な vs 密かな
(1366, 1507),
(1507, 1366),
-- aboveboard (id=1366, wn=477) ~ devious (id=1769, wn=830): 公正な vs 狡猾な
(1366, 1769),
(1769, 1366),
-- discerning (id=1368, wn=479) ~ gullible (id=21, wn=21): 洞察力のある vs だまされやすい
(1368, 21),
(21, 1368),
-- brazen (id=1381, wn=492) ~ demure (id=1325, wn=436): 厚かましい vs 控えめな
(1381, 1325),
(1325, 1381),
-- repel (id=1383, wn=494) ~ entice (id=29, wn=29): 追い払う vs 誘惑する
(1383, 29),
(29, 1383),
-- repel (id=1383, wn=494) ~ lure (id=769, wn=1651): 追い払う vs 誘い出す
(1383, 769),
(769, 1383),
-- despondent (id=1386, wn=497) ~ exuberant (id=1187, wn=298): 落胆した vs 元気いっぱいの
(1386, 1187),
(1187, 1386),
-- despondent (id=1386, wn=497) ~ jubilant (id=732, wn=1611): 落胆した vs 歓喜に満ちた
(1386, 732),
(732, 1386),
-- inquisitive (id=1388, wn=499) ~ apathetic (id=1441, wn=52): 好奇心の強い vs 無関心な
(1388, 1441),
(1441, 1388),
-- perfunctory (id=1371, wn=482) ~ meticulous (id=26, wn=26): いい加減な vs 細心の
(1371, 26),
(26, 1371),
-- perfunctory (id=1371, wn=482) ~ painstaking (id=1673, wn=734): いい加減な vs 丹念な
(1371, 1673),
(1673, 1371),
-- livid (id=1377, wn=488) ~ placid (id=1163, wn=274): 激怒した vs 穏やかな
(1377, 1163),
(1163, 1377),
-- flourish (id=355, wn=1255) ~ languish (id=632, wn=156): 栄える vs 停滞する
(355, 632),
(632, 355),
-- flourish (id=355, wn=1255) ~ wilt (id=1320, wn=431): 栄える vs しおれる
(355, 1320),
(1320, 355),
-- candid (id=1489, wn=100) ~ devious (id=1769, wn=830): 率直な vs 狡猾な
(1489, 1769),
(1769, 1489),
-- perennial (id=1362, wn=473) ~ transient (id=1620, wn=681): 絶え間ない vs 一時的な
(1362, 1620),
(1620, 1362),
-- perennial (id=1362, wn=473) ~ ephemeral (id=576, wn=1495): 絶え間ない vs つかの間の
(1362, 576),
(576, 1362),
-- robust (id=1232, wn=343) ~ flimsy (id=3, wn=3): 頑丈な vs 壊れやすい
(1232, 3),
(3, 1232),
-- drab (id=1094, wn=205) ~ ornate (id=1852, wn=913): 殺風景な vs 飾り立てた
(1094, 1852),
(1852, 1094),
-- uncouth (id=42, wn=42) ~ tactful (id=1337, wn=448): 無作法な vs 機転の利く
(42, 1337),
(1337, 42),
-- nonchalant (id=1178, wn=289) ~ fervent (id=1440, wn=51): 無頓着な vs 熱心な
(1178, 1440),
(1440, 1178),
-- proliferate (id=1340, wn=451) ~ dwindle (id=1454, wn=65): 急増する vs 減る
(1340, 1454),
(1454, 1340);
