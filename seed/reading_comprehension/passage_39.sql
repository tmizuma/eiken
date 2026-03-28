INSERT INTO passages (id, title, topic, word_range, content, content_ja) VALUES (39, 'The History of Cryptography', 'フリー', '1~600',
'Throughout history, the desire to transmit information securely has driven the development of increasingly sophisticated methods of encryption. From the rudimentary ciphers employed by Julius Caesar, who famously shifted each letter of the alphabet by three positions to conceal military dispatches, to the elaborate mechanical devices of the twentieth century, cryptography has played a pivotal role in warfare, diplomacy, and commerce. Yet it is the modern era—marked by the advent of digital communication—that has elevated cryptography from a niche military discipline to an indispensable component of mundane daily life, underpinning everything from online banking to private messaging.

The impending transformation began in earnest during World War II, when the stakes of cryptographic success or failure reached unprecedented heights. Germany''s Enigma machine, a device of remarkable versatility, generated ciphers that its operators believed to be unbreakable. The machine''s rotors could produce an astronomical number of possible configurations, and the settings were changed daily, creating a barrage of fresh challenges for Allied codebreakers. At Bletchley Park in England, a team led by the mathematician Alan Turing mounted a valiant effort to crack Enigma. Turing''s work, which built upon earlier reconnaissance by Polish cryptanalysts who had first penetrated simpler versions of the machine, resulted in the development of the Bombe—an electromechanical device that could systematically test potential rotor settings. Historians estimate that the intelligence derived from breaking Enigma shortened the war by as much as two years, salvaging countless lives that would otherwise have been lost.

The postwar decades witnessed a fundamental shift in cryptographic philosophy. During the 1970s, two researchers at Stanford University, Whitfield Diffie and Martin Hellman, broached an idea that would irreparably alter the field: public-key cryptography. Traditional cryptographic systems had always required that both parties share a secret key in advance—a logistical challenge that grew increasingly unwieldy as communication networks expanded. Diffie and Hellman proposed a revolutionary alternative in which each user possesses a pair of mathematically related keys: one public, which can be freely distributed, and one private, which must remain confidential. A message encrypted with the recipient''s public key can only be decrypted with the corresponding private key, [BLANK]. This elegant solution to the key-distribution problem brought the fruition of secure digital communication within reach for ordinary citizens, not merely governments and militaries.

The implications of public-key cryptography were swiftly realized in the commercial sphere. The RSA algorithm, developed by Ron Rivest, Adi Shamir, and Leonard Adleman in 1977, provided a practical implementation that became the backbone of internet security. Today, every time a consumer enters credit card information on a website, the transaction is protected by encryption protocols that descend directly from the principles Diffie and Hellman articulated. Governments, however, have not always basked in the democratization of strong encryption. Law enforcement agencies have repeatedly argued that unbreakable encryption allows fugitives and accomplices to communicate beyond the reach of lawful surveillance, and they have sought to compel technology companies to build so-called "backdoors" into their products. Critics of such proposals contend that any deliberately introduced vulnerability would inevitably be exploited by belligerent actors—hostile governments and cybercriminals alike—thereby undermining the very security the backdoors are intended to preserve.

The tension between privacy and security shows no sign of abating. As quantum computing advances, researchers warn that the mathematical problems upon which current encryption systems rely could become tractable, rendering today''s most robust ciphers obsolete. In response, cryptographers are racing to develop quantum-resistant algorithms, a preemptive measure designed to ensure that the digital infrastructure upon which modern society depends does not become fatally compromised. The history of cryptography, it seems, is far from a settled narrative; it is an ongoing contest between those who seek to encrypt information and those who endeavor to decrypt it, each advance by one side piquing the ingenuity of the other.',

'歴史を通じて、情報を安全に伝達したいという欲求が、ますます高度な暗号化手法の発展を推進してきた。軍事通信を隠すためにアルファベットの各文字を3つずらすことで有名なジュリアス・シーザーが用いた初歩的な暗号から、20世紀の精巧な機械装置に至るまで、暗号技術は戦争、外交、商業において極めて重要な役割を果たしてきた。しかし、デジタル通信の出現によって特徴づけられる現代こそが、暗号技術をニッチな軍事分野からオンラインバンキングやプライベートメッセージまであらゆるものを支える平凡な日常生活の不可欠な要素へと昇格させた。

差し迫った変革は第二次世界大戦中に本格的に始まり、暗号の成功と失敗の利害が前例のない高みに達した。ドイツのエニグマ暗号機は驚くべき汎用性を持つ装置であり、運用者が解読不能と信じる暗号を生成した。ローターは天文学的な数の構成を生み出すことができ、設定は毎日変更され、連合国の暗号解読者に新たな課題の集中砲火を浴びせた。イングランドのブレッチリー・パークでは、数学者アラン・チューリング率いるチームがエニグマ解読に勇敢な努力を傾けた。チューリングの研究は、より単純なバージョンの機械を最初に突破したポーランドの暗号解析者による先行の偵察に基づいており、ボンベ——潜在的なローター設定を体系的にテストできる電気機械装置——の開発をもたらした。歴史家はエニグマの解読から得られた諜報が戦争を最大2年短縮し、そうでなければ失われていたであろう無数の命を救い出したと推定している。

戦後の数十年間は暗号哲学の根本的な転換を目撃した。1970年代、スタンフォード大学の2人の研究者、ウィットフィールド・ディフィーとマーティン・ヘルマンは、この分野を修復できないほどに変える考えを切り出した。公開鍵暗号である。従来の暗号システムは常に両当事者が事前に秘密鍵を共有することを必要としていた——これは通信ネットワークが拡大するにつれてますます扱いにくくなる物流上の課題であった。ディフィーとヘルマンは、各ユーザーが数学的に関連した一対の鍵を持つという革命的な代替案を提案した。一つは自由に配布できる公開鍵、もう一つは機密のままでなければならない秘密鍵である。受信者の公開鍵で暗号化されたメッセージは対応する秘密鍵でのみ復号でき、事前に秘密を共有する必要を排除する。この鍵配布問題への優雅な解決策は、安全なデジタル通信の達成を政府や軍だけでなく一般市民の手の届くところにもたらした。

公開鍵暗号の意義は商業分野で迅速に実現された。1977年にロン・リベスト、アディ・シャミア、レオナルド・エーデルマンが開発したRSAアルゴリズムは、インターネットセキュリティのバックボーンとなる実用的な実装を提供した。今日、消費者がウェブサイトでクレジットカード情報を入力するたびに、その取引はディフィーとヘルマンが明確にした原則から直接派生した暗号化プロトコルによって保護されている。しかし、政府は強力な暗号化の民主化を必ずしも歓迎してこなかった。法執行機関は、解読不能な暗号化が逃亡犯や共犯者に合法的な監視の手の届かないところで通信することを許すと繰り返し主張し、テクノロジー企業にいわゆる「バックドア」を製品に組み込むよう強制しようとしてきた。そのような提案の批判者は、意図的に導入された脆弱性は必然的に好戦的なアクター——敵対的な政府やサイバー犯罪者——によって悪用され、バックドアが保持しようとするまさにそのセキュリティを損なうと主張している。

プライバシーとセキュリティの間の緊張は和らぐ兆しを見せていない。量子コンピューティングが進歩するにつれて、研究者たちは現在の暗号システムが依存する数学的問題が解きやすくなり、今日の最も堅牢な暗号が時代遅れになる可能性があると警告している。これに対応して、暗号学者は量子耐性アルゴリズムの開発を急いでいる。これは現代社会が依存するデジタルインフラが致命的に危険にさらされないことを確保するために設計された先制的な措置である。暗号の歴史は、定まった物語にはほど遠いようである。それは情報を暗号化しようとする者とそれを解読しようとする者の間の進行中の争いであり、一方の各前進が他方の創意を刺激する。');

INSERT INTO passage_questions (id, passage_id, question_number, question_type, question_text, explanation, correct_choice) VALUES
(115, 39, 1, 'comprehension',
 'According to the passage, what was significant about the work done at Bletchley Park during World War II?',
 '第2段落で、チューリング率いるチームがエニグマ暗号を解読するためにボンベを開発し、歴史家はこれが戦争を最大2年短縮し無数の命を救ったと推定していると述べられている。選択肢3がこの内容に合致する。選択肢1はポーランドの暗号解析者の功績を無視している。選択肢2は具体的に述べられていない。選択肢4はチューリングがエニグマ自体を設計したとする誤りである。',
 3),
(116, 39, 2, 'comprehension',
 'What concern do critics raise about the proposal to build encryption backdoors for law enforcement?',
 '第4段落後半で、バックドア提案の批判者は、意図的に導入された脆弱性が敵対的な政府やサイバー犯罪者などの好戦的なアクターによって悪用され、保護しようとするセキュリティそのものが損なわれると主張していると述べられている。選択肢2がこの内容に合致する。',
 2),
(117, 39, 3, 'fill_in_blank',
 'Choose the best option to fill in the blank [BLANK] in the passage.',
 '空所は公開鍵暗号の仕組みの説明の中にある。直前で「受信者の公開鍵で暗号化されたメッセージは対応する秘密鍵でのみ復号できる」と述べ、直後で「この鍵配布問題への優雅な解決策」と続く。公開鍵暗号の核心的利点は、事前に秘密を共有する必要がないことであるため、選択肢4が最も適切である。',
 4);

INSERT INTO question_choices (question_id, choice_number, choice_text) VALUES
(115, 1, 'British codebreakers independently developed their techniques without any prior knowledge from other nations.'),
(115, 2, 'The Enigma machine was captured intact, allowing the Allies to immediately read all German communications.'),
(115, 3, 'The codebreaking efforts there produced intelligence that is believed to have significantly shortened the war.'),
(115, 4, 'Alan Turing designed the Enigma machine before later working to break its codes.'),
(116, 1, 'Backdoors would make encryption technology too expensive for ordinary consumers to use.'),
(116, 2, 'Any intentional weakness in encryption would likely be exploited by hostile actors, undermining overall security.'),
(116, 3, 'Law enforcement agencies lack the technical expertise to use backdoors effectively.'),
(116, 4, 'Technology companies would lose their intellectual property rights if forced to modify their products.'),
(117, 1, 'making it possible for governments to monitor all digital communications when necessary'),
(117, 2, 'provided that both parties have agreed upon the algorithm in advance'),
(117, 3, 'although the computational cost of this process remains prohibitively high for most users'),
(117, 4, 'thereby eliminating the need to share a secret in advance');

INSERT INTO passage_words (passage_id, word_id) SELECT 39, id FROM words WHERE word_number IN (140, 146, 196, 180, 201, 227, 179, 170, 225, 174, 183, 153, 188, 184, 171, 211, 209);
