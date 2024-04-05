const ELDERTEMPLATE = {
 PREFERENCES: {
  testSwitch: 0,// テストスイッチ
  activeFrameId: "",// 投稿する枠のID
  basicdelay: 1500,// コメントしてからBotが反応するまでの遅延
  posttime_min: 5,// 定期botがメッセージを話す間隔(分)
  day: 7,// 「久しぶり」と反応する日数
 },
 CHARACTER: {
  "ゆっくり霊夢": { defaultchara: "!reimu01", icon: "../../custom/FirstCounter/icon_reimu.png", "--lcv-name-color": "#FFC107", "--lcv-text-color": "#ECEFF1", "--lcv-background-color": "#FF4081" },
  "ゆっくり魔理沙": { defaultchara: "!marisa01", icon: "../../custom/FirstCounter/icon_marisa.png", "--lcv-name-color": "#FFE082", "--lcv-text-color": "#333333", "--lcv-background-color": "#FF8F00" },
  "Nightbot": { defaultchara: "!reimu11", "--lcv-name-color": "#FFC107", "--lcv-text-color": "#FFFFFF", "--lcv-background-color": "#36506C" },
 },
 COMMON_SWITCH: {
  timer: 5,
  gift: true,
  greeting_syoken: true,
  greeting_again: 7,
  greeting_hi: true,
  greeting_sagi: true,
  engagement: true,
 },
 COMMON: {
  timer: [
   { ran: 5, chara: "ゆっくり霊夢", message: "チャンネル登録・高評価押してくれると、主が喜ぶわ。ゆっくりしていってね。", img: "!reimu11", },
   { ran: 4, chara: "ゆっくり霊夢", message: "主はTwitterで積極的に活動中!フォローして頂けると主の感激の涙で川ができるそうよ。", img: "!reimu01", },
   { ran: 3, chara: "ゆっくり魔理沙", message: "discordで活動中!主は配信中はいつも入っているぜ。友達になって欲しいんだぜ", img: "!marisa01", },
  ],

  gift: [
   { ran: 4, price: 1, chara: "ゆっくり霊夢", message: "<<user>>さん、<<price>>ポイントのギフトありがとう!これからも配信続けていくわ。応援してね!", img: [{ "!saisen_haikei": -500 }, { "!saisen_hako": -200 }, { "!reimu11": 0 },], },
   { ran: 1, price: 1, chara: "ゆっくり魔理沙", message: "やったぜ!<<user>>さんから<<price>>ポイントのギフトを頂いたぜ。これを元手に配信に精を出すぜ。ありがとだぜ!", img: [{ "!saisen_haikei": -500 }, { "!kinoko": -200 }, { "!marisa11": 0 },], },
   { ran: 1, price: 500, priceLimit: 999, chara: "ゆっくり霊夢", message: "<<user>>さん、<<price>>ポイントのギフトありがとう!これからも配信続けていくわ。応援してね!", img: [{ "!saisen_haikei": -500 }, { "!saisen_hako": -200 }, { "!reimu11": 0 },], },
   { ran: 1, price: 1000, priceLimit: 1999, chara: "ゆっくり霊夢", message: "<<user>>さん、<<price>>ポイントのギフトありがとう!これからも配信続けていくわ。応援してね!", img: [{ "!saisen_haikei": -500 }, { "!saisen_hako": -200 }, { "!reimu11": 0 },], },
   { ran: 1, price: 2000, priceLimit: 4999, chara: "ゆっくり霊夢", message: "<<user>>さん、<<price>>ポイントのギフトありがとう!これからも配信続けていくわ。応援してね!", img: [{ "!saisen_haikei": -500 }, { "!saisen_hako": -200 }, { "!reimu11": 0 },], },
   { ran: 1, price: 5000, priceLimit: 9999, chara: "ゆっくり霊夢", message: "<<user>>さん、<<price>>ポイントのギフトありがとう!これからも配信続けていくわ。応援してね!", img: [{ "!saisen_haikei": -500 }, { "!saisen_hako": -200 }, { "!reimu11": 0 },], },
   { ran: 1, price: 10000, chara: "ゆっくり霊夢", message: "<<user>>さん、<<price>>ポイントのギフトありがとう!これからも配信続けていくわ。応援してね!", img: [{ "!saisen_haikei": -500 }, { "!saisen_hako": -200 }, { "!reimu11": 0 },], },
  ],
  // 初見
  greeting_syoken: [
   { ran: 5, chara: "ゆっくり霊夢", message: [{ ["<<user>>さん、初めまして!ゆっくりしていってね。"]: 1500 },], img: [{ "!初見": 0 }, { "!reimu11": 1500 },], },
   { ran: 4, chara: "ゆっくり霊夢", message: [{ ["<<user>>さん、初見ありがとう!"]: 1500, },], img: [{ "!初見": 0 }, { "!reimu11": 1500 },], },
   { ran: 3, chara: "ゆっくり魔理沙", message: [{ ["おっ、<<user>>さんが初めてのコメントだぜ!"]: 1500, },], img: [{ "!初見": 0 }, { "!marisa02": 1500 },], },
  ],
  // 久しぶり
  greeting_again: [
   { ran: 5, chara: "ゆっくり霊夢", message: "<<user>>さん、久しぶり!また会えたね。", img: "!reimu11", },
   { ran: 4, chara: "ゆっくり霊夢", message: "<<user>>さんが久々に来たよ", img: "!reimu02", },
   { ran: 3, chara: "ゆっくり魔理沙", message: "おっ、<<user>>さんだぜ。久しぶり!", img: "!marisa11", },
  ],
  // いつもの挨拶
  greeting_hi: [
   { ran: 5, chara: "ゆっくり霊夢", message: "<<user>>さん、こんにちは!ゆっくりしていってね。", img: "!reimu11", },
   { ran: 4, chara: "ゆっくり霊夢", message: "<<user>>さん、また来てくれたね。ようこそ。", img: "!reimu11", },
   { ran: 3, chara: "ゆっくり魔理沙", message: "おっ、<<user>>さんだ。これで<<tc>>回目のコメントだぜ", img: "!marisa11", },
  ],
  // 初見詐欺(OFFにする場合は、↑のsyoken_sagi_switch を0にする)
  greeting_sagi: [
   { ran: 5, chara: "ゆっくり霊夢", message: [{ ["<<user>>さん、あなた初見じゃないでしょ。"]: 1500 },], img: [{ "!初見": 0 }, { "!reimu21": 1500 },], },
   { ran: 4, chara: "ゆっくり霊夢", message: [{ ["<<user>>さん、初めまし…あなた初見ではないわね?"]: 1500 },], img: [{ "!初見": 0 }, { "!reimu22": 1500 },], },
   { ran: 3, chara: "ゆっくり魔理沙", message: [{ ["おい!<<user>>さん!初見ちゃうやろ!"]: 1500 },], img: [{ "!初見": 0 }, { "!marisa22": 1500 },], },
  ],

  // 参加　engagement
  engagement: [
   { ran: 5, chara: "ゆっくり霊夢", message: "<<user>>さんが参加してくれるそうよ。よろしくね。", img: [{ "!挑戦者": -1000 }, { "!reimu11": 0 },], },
   { ran: 4, chara: "ゆっくり霊夢", message: "<<user>>さん、参加ありがとう！", img: [{ "!挑戦者": -1000 }, { "!reimu12": 0 },], },
   { ran: 3, chara: "ゆっくり魔理沙", message: "おっ、<<user>>さんやるのか！よろしく頼むぜ！", img: [{ "!挑戦者": -1000 }, { "!marisa11": 0 },], },
  ],
 },
 OMIKUJI_SWITCH: {
  omikuji: new RegExp("^(おみくじ|omikuji|御神籤)"),
  janken: new RegExp("^(じゃんけん|ジャンケン|janken)"),
  test: new RegExp("^(てすと|テスト|test)"),
 },
 OMIKUJI: {
  // おみくじ
  omikuji: [
   { ran: 7, chara: "ゆっくり霊夢", message: "<<user>>さんの運勢は【大吉】努力が実を結び、幸運が訪れるって。積極的に行動すると良いことがあるわ。", img: [{ "!omikuji_huru": -1500 }, { "!omikuji_01": -500 }, { "!reimu02": 0 },], },
   { ran: 6, chara: "ゆっくり霊夢", message: "<<user>>さんの運勢は【大吉】人との縁が幸運を呼び込みそう。感謝の気持ちを忘れないことが大事よ。", img: [{ "!omikuji_huru": -1500 }, { "!omikuji_01": -500 }, { "!reimu12": 0 },], },
   { ran: 5, chara: "ゆっくり霊夢", message: "<<user>>さんの運勢は【大吉】健康運が特に好調ね。心身ともに充実した日々になるわ。", img: [{ "!omikuji_huru": -1500 }, { "!omikuji_01": -500 }, { "!reimu11": 0 },], },
   { ran: 9, chara: "ゆっくり霊夢", message: "<<user>>さんの運勢は【吉】積極的に行動すると運気は上がるわ。新しい挑戦はチャンスよ。", img: [{ "!omikuji_huru": -1500 }, { "!omikuji_02": -500 }, { "!reimu12": 0 },], },
   { ran: 8, chara: "ゆっくり霊夢", message: "<<user>>さんの運勢は【吉】周囲の人々に感謝の気持ちを忘れずにね。", img: [{ "!omikuji_huru": -1500 }, { "!omikuji_02": -500 }, { "!reimu11": 0 },], },
   { ran: 7, chara: "ゆっくり霊夢", message: "<<user>>さんの運勢は【吉】今後の展望は明るめね。夢に向かって突き進めばいいことがあるわ。", img: [{ "!omikuji_huru": -1500 }, { "!omikuji_02": -500 }, { "!reimu02": 0 },], },
   { ran: 8, chara: "ゆっくり霊夢", message: "<<user>>さんの運勢は【中吉】思いがけない幸運があるかも。チャンスを逃さないようにね。", img: [{ "!omikuji_huru": -1500 }, { "!omikuji_03": -500 }, { "!reimu11": 0 },], },
   { ran: 7, chara: "ゆっくり霊夢", message: "<<user>>さんの運勢は【中吉】周囲の人との協力が大切よ。助けを求めることを恐れないで。", img: [{ "!omikuji_huru": -1500 }, { "!omikuji_03": -500 }, { "!reimu01": 0 },], },
   { ran: 6, chara: "ゆっくり霊夢", message: "<<user>>さんの運勢は【中吉】自分の直感を信じていいわ。大きな成長が待ってるそうよ。", img: [{ "!omikuji_huru": -1500 }, { "!omikuji_03": -500 }, { "!reimu02": 0 },], },
   { ran: 6, chara: "ゆっくり霊夢", message: "<<user>>さんの運勢は【小吉】いまは焦らず、一歩ずつ進むことね。努力すれば、願いは叶うと出ているわ。", img: [{ "!omikuji_huru": -1500 }, { "!omikuji_04": -500 }, { "!reimu11": 0 },], },
   { ran: 5, chara: "ゆっくり霊夢", message: "<<user>>さんの運勢は【小吉】いまは慎重に行動が必要な時。きっと吉へと導かれるわ。慌てない事が大切よ。", img: [{ "!omikuji_huru": -1500 }, { "!omikuji_04": -500 }, { "!reimu01": 0 },], },
   { ran: 4, chara: "ゆっくり霊夢", message: "<<user>>さんの運勢は【小吉】健康面に注意して。規則正しい生活が運気を呼び込むわ。", img: [{ "!omikuji_huru": -1500 }, { "!omikuji_04": -500 }, { "!reimu02": 0 },], },
   { ran: 5, chara: "ゆっくり霊夢", message: "<<user>>さんの運勢は【末吉】油断が思わぬ結果に繋がるわ。慎重に行動して。", img: [{ "!omikuji_huru": -1500 }, { "!omikuji_05": -500 }, { "!reimu22": 0 },], },
   { ran: 4, chara: "ゆっくり霊夢", message: "<<user>>さんの運勢は【末吉】今は試練の時期ね。乗り越えれば、大きな成長が待ってるわ。", img: [{ "!omikuji_huru": -1500 }, { "!omikuji_05": -500 }, { "!reimu01": 0 },], },
   { ran: 3, chara: "ゆっくり霊夢", message: "<<user>>さんの運勢は【末吉】新しいことより、今の事を見直すといい事があるわ。", img: [{ "!omikuji_huru": -1500 }, { "!omikuji_05": -500 }, { "!reimu12": 0 },], },
   { ran: 4, chara: "ゆっくり霊夢", message: "<<user>>さんの運勢は【凶】運気はやや下がり気味。慎重に行動するといいわ。", img: [{ "!omikuji_huru": -1500 }, { "!omikuji_06": -500 }, { "!reimu22": 0 },], },
   { ran: 3, chara: "ゆっくり霊夢", message: "<<user>>さんの運勢は【凶】周囲の人とのトラブルに注意して。喧嘩になったら、頭を冷やすことね。", img: [{ "!omikuji_huru": -1500 }, { "!omikuji_06": -500 }, { "!reimu23": 0 },], },
   { ran: 2, chara: "ゆっくり霊夢", message: "<<user>>さんの運勢は【凶】健康面に注意が必要ね。体調管理をしっかり。乳酸菌とってるぅ？", img: [{ "!omikuji_huru": -1500 }, { "!omikuji_06": -500 }, { "!reimu12": 0 },], },
   { ran: 2, chara: "ゆっくり魔理沙", message: "<<user>>さんの運勢は【残念賞】笑いすぎに注意だぜ。腹筋が崩壊するかもしれないぜ。", img: [{ "!omikuji_huru": -1500 }, { "!omikuji_07": -500 }, { "!marisa11": 0 },], },
   { ran: 2, chara: "ゆっくり魔理沙", message: "<<user>>さんの運勢は【残念賞】終わったわ、風が強すぎるぜ。強すぎてお亡くなりだぜ。", img: [{ "!omikuji_huru": -1500 }, { "!omikuji_07": -500 }, { "!marisa21": 0 },], },
   { ran: 2, chara: "ゆっくり魔理沙", message: "<<user>>さんの運勢は【残念賞】陰謀論に注意だぜ。ネットde真実なんてないぜ。幅広い情報収集が大切だぜ。", img: [{ "!omikuji_huru": -1500 }, { "!omikuji_07": -500 }, { "!marisa22": 0 },], },
   { ran: 1, chara: "ゆっくり魔理沙", message: "<<user>>さんの運勢は【残念賞】女子高生とか好きだからって理由で先生になっちゃいけないぜ。奥さんは美人だぜ。", img: [{ "!omikuji_huru": -1500 }, { "!omikuji_07": -500 }, { "!marisa21": 0 },], },
  ],
  // じゃんけん
  janken: [
   { ran: 18, chara: "ゆっくり霊夢", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の勝ち!負けは次につながるチャンスです!ネバーギブアップ!"]: 4500 },], img: [{ "!janken_1": 500 }, { "!reimu02": 0 }, { "!janken_lose": 2000 }, { "!reimu12": 4500 },], },
   { ran: 17, chara: "ゆっくり霊夢", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の勝ち!じゃんけんの向こう側に何があるか、考えてみてください。"]: 4500 },], img: [{ "!janken_1": 500 }, { "!reimu02": 0 }, { "!janken_lose": 2000 }, { "!reimu12": 4500 },], },
   { ran: 2, chara: "ゆっくり魔理沙", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の勝ち!マリサ キリサメの心なんて読めるわけがない、そう思ってないですか。あきらめへん人だけに見える景色があるはずです。"]: 4500 },], img: [{ "!janken_1": 500 }, { "!marisa02": 0 }, { "!janken_lose": 2000 }, { "!marisa12": 4500 },], },
   { ran: 18, chara: "ゆっくり霊夢", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の勝ち!いい勝負でしたね!でも結果が伴わないと、全く意味がありません。"]: 4500 },], img: [{ "!janken_1": 500 }, { "!reimu02": 0 }, { "!janken_lose": 2000 }, { "!reimu12": 4500 },], },
   { ran: 2, chara: "ゆっくり魔理沙", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の勝ち!ちゃんと分析してます?じっくり結果に向き合ってください。"]: 4500 },], img: [{ "!janken_1": 500 }, { "!marisa02": 0 }, { "!janken_lose": 2000 }, { "!marisa12": 4500 },], },
   { ran: 17, chara: "ゆっくり霊夢", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の勝ち!何事も準備がすべて。それを怠っている事がバレてますよ。"]: 4500 },], img: [{ "!janken_1": 500 }, { "!reimu02": 0 }, { "!janken_lose": 2000 }, { "!reimu12": 4500 },], },
   { ran: 2, chara: "ゆっくり魔理沙", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の勝ち!ここは練習ではありません。全身全霊で俺と向き合ってください。"]: 4500 },], img: [{ "!janken_1": 500 }, { "!marisa02": 0 }, { "!janken_lose": 2000 }, { "!marisa12": 4500 },], },

   { ran: 18, chara: "ゆっくり霊夢", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の勝ち!たかがじゃんけん、そう思ってないですか？それやったら明日も、俺が勝ちますよ。"]: 4500 },], img: [{ "!janken_2": 500 }, { "!reimu02": 0 }, { "!janken_lose": 2000 }, { "!reimu12": 4500 },], },
   { ran: 17, chara: "ゆっくり霊夢", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の勝ち!ウラのウラのウラまで読む訓練をしてくださいね。どこまで読もうとするかで結果が変わってきます。"]: 4500 },], img: [{ "!janken_2": 500 }, { "!reimu02": 0 }, { "!janken_lose": 2000 }, { "!reimu12": 4500 },], },
   { ran: 2, chara: "ゆっくり魔理沙", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の勝ち!自信を持って勝負にしっかりと向き合える、そう思えるまで、準備してください。"]: 4500 },], img: [{ "!janken_2": 500 }, { "!marisa02": 0 }, { "!janken_lose": 2000 }, { "!marisa12": 4500 },], },
   { ran: 18, chara: "ゆっくり霊夢", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の勝ち!運を味方につけるのは、地道な努力ですよ。"]: 4500 },], img: [{ "!janken_2": 500 }, { "!reimu02": 0 }, { "!janken_lose": 2000 }, { "!reimu12": 4500 },], },
   { ran: 2, chara: "ゆっくり魔理沙", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の勝ち!ただの運やと思ってませんか?運も実力のうち!聞いたことありますよね?"]: 4500 },], img: [{ "!janken_2": 500 }, { "!marisa02": 0 }, { "!janken_lose": 2000 }, { "!marisa12": 4500 },], },
   { ran: 17, chara: "ゆっくり霊夢", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の勝ち!あなたの考えてる事ぐらい、俺にはお見通しです。"]: 4500 },], img: [{ "!janken_2": 500 }, { "!reimu02": 0 }, { "!janken_lose": 2000 }, { "!reimu12": 4500 },], },
   { ran: 2, chara: "ゆっくり魔理沙", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の勝ち!その程度の、気持ちで勝てるとでも思ったんですか?ちゃんと練習してきてください。"]: 4500 },], img: [{ "!janken_2": 500 }, { "!marisa02": 0 }, { "!janken_lose": 2000 }, { "!marisa12": 4500 },], },

   { ran: 18, chara: "ゆっくり霊夢", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の勝ち!なんで負けたか、明日まで考えといてください。そしたら何かが見えてくるはずです。"]: 4500 },], img: [{ "!janken_3": 500 }, { "!reimu02": 0 }, { "!janken_lose": 2000 }, { "!reimu12": 4500 },], },
   { ran: 17, chara: "ゆっくり霊夢", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の勝ち!どんな事でも絶対に勝つんや!というメンタリティーが大事ですよ。"]: 4500 },], img: [{ "!janken_3": 500 }, { "!reimu02": 0 }, { "!janken_lose": 2000 }, { "!reimu12": 4500 },], },
   { ran: 2, chara: "ゆっくり魔理沙", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の勝ち!複雑に考えてないですか?答えはシンプルです。マリサ キリサメの心を読む、それだけです。"]: 4500 },], img: [{ "!janken_3": 500 }, { "!marisa02": 0 }, { "!janken_lose": 2000 }, { "!marisa12": 4500 },], },
   { ran: 18, chara: "ゆっくり霊夢", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の勝ち!動揺してませんか?運が大事な時こそ集中力が物を言いますよ!"]: 4500 },], img: [{ "!janken_3": 500 }, { "!reimu02": 0 }, { "!janken_lose": 2000 }, { "!reimu12": 4500 },], },
   { ran: 2, chara: "ゆっくり魔理沙", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の勝ち!正確にはじゃんけんを味方につけた俺の勝ち!"]: 4500 },], img: [{ "!janken_3": 500 }, { "!marisa02": 0 }, { "!janken_lose": 2000 }, { "!marisa12": 4500 },], },
   { ran: 17, chara: "ゆっくり霊夢", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の勝ち!それで勝てると思ってるんやったら、俺がずっと勝ちますよ!"]: 4500 },], img: [{ "!janken_3": 500 }, { "!reimu02": 0 }, { "!janken_lose": 2000 }, { "!reimu12": 4500 },], },
   { ran: 2, chara: "ゆっくり魔理沙", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の勝ち!1年間何やってたんですか？この結果はじゃんけんに対する意識の差です。"]: 4500 },], img: [{ "!janken_3": 500 }, { "!marisa02": 0 }, { "!janken_lose": 2000 }, { "!marisa12": 4500 },], },

   { ran: 2, chara: "ゆっくり霊夢", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の負け!やるやん。明日は俺にリベンジさせて。"]: 4500 },], img: [{ "!janken_4": 500 }, { "!reimu02": 0 }, { "!janken_win": 2000 }, { "!reimu11": 4500 },], },
   { ran: 2, chara: "ゆっくり霊夢", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の負け!やるやん!でも、今度は絶対、俺が勝つから!また明日やろう!"]: 4500 },], img: [{ "!janken_4": 500 }, { "!reimu02": 0 }, { "!janken_win": 2000 }, { "!reimu11": 4500 },], },
   { ran: 2, chara: "ゆっくり霊夢", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の負け!明日、俺が勝つからまたやろう!"]: 4500 },], img: [{ "!janken_4": 500 }, { "!reimu02": 0 }, { "!janken_win": 2000 }, { "!reimu11": 4500 },], },
   { ran: 2, chara: "ゆっくり霊夢", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の負け!やるやん。今日は負けを認めます。ただ、勝ち逃げは許しませんよ。"]: 4500 },], img: [{ "!janken_4": 500 }, { "!reimu02": 0 }, { "!janken_win": 2000 }, { "!reimu11": 4500 },], },
   { ran: 1, chara: "ゆっくり魔理沙", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の負け!やるやん。明日は俺にリベンジさせて。"]: 4500 },], img: [{ "!janken_4": 500 }, { "!marisa02": 0 }, { "!janken_win": 2000 }, { "!marisa11": 4500 },], },
   { ran: 1, chara: "ゆっくり魔理沙", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の負け!やるやん!でも、今度は絶対、俺が勝つから!また明日やろう!"]: 4500 },], img: [{ "!janken_4": 500 }, { "!marisa02": 0 }, { "!janken_win": 2000 }, { "!marisa11": 4500 },], },
   { ran: 1, chara: "ゆっくり魔理沙", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の負け!明日、俺が勝つからまたやろう!"]: 4500 },], img: [{ "!janken_4": 500 }, { "!marisa02": 0 }, { "!janken_win": 2000 }, { "!marisa11": 4500 },], },
   { ran: 1, chara: "ゆっくり魔理沙", message: [{ ["じゃんけんぽん!"]: 0 }, { ["俺の負け!やるやん。今日は負けを認めます。ただ、勝ち逃げは許しませんよ。"]: 4500 },], img: [{ "!janken_4": 500 }, { "!marisa02": 0 }, { "!janken_win": 2000 }, { "!marisa11": 4500 },], },
  ],

  // test
  test: [
   { ran: 2, chara: "ゆっくり霊夢", funcID: "hoge", message: "<<user>>さんの資金は<<AAA>>ですぞ", },
  ],

 },
 FUNKS:{
  hoge: `
  const X = [{ hoge: 100 }, { hoge: 200 }, { hoge: 300 }];
  return X[Math.floor(Math.random() * X.length)].hoge;
 `,
  huga: `
  let X = 0;
  for(;;){X+=1;}
  return X[Math.floor(Math.random() * X.length)].hoge;
 `,
 },
}





