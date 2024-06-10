////////////////////////////////////////////////////////////
// スイカ🍉ジェネレーター Gousei Suika Generator for わんコメ v0.2 240610
////////////////////////////////////////////////////////////

// ランキング:下位何位まで表示させるか
const rankLimit = 10;

// 「スイカ」のおみくじができる最大回数(0でOFF)
const maxDraws = 0;

// 候補となる名前の配列(スイカゲームの有名プレイヤー等を入れています)
const candidateNames = [
  'てい', 'ポッピィー', 'おふとん', 'もこもこ', 'じゅん', 'たかゆき', 'すいすい',
  'たいよう', 'ふわみ', 'いろは', 'なな', 'きよし', 'おとは', 'こはく', 'さくら',
];


////////////////////////////////////////////////////////////
//
//
// 【秘密のカスタマイズ】
// ここから下は、分かる人だけ設定して下さい
//
//
////////////////////////////////////////////////////////////


// イカゲームのスイッチ(0:OFF 1:Death機能ありON 2:Death機能なしON)
const squid_switch = 0;
// コメントしてからBotが反応するまでの遅延(秒)、小さすぎるとBotが機能しない場合があります
const basicdelay = 1;
// わんコメのどのID枠に投稿するか(空白の場合、一番上のID枠に投稿/わからない場合、空白のままでOK)
let activeFrameId = ""

// コメントするキャラクター設定
const CHARACTER = {
  // 合成大西瓜(スイカゲーム)
  Suika: { name: "ポッピィー", icon: "../../custom/gousei_suika/img/icon_suika.png" },
  // イカゲーム
  오징어: { name: "アナウンス", icon: "../../custom/gousei_suika/img/icon_ika.png" },
}


const LIMIT = 30;
const app = Vue.createApp({
  setup() {
    document.body.removeAttribute("hidden");
  },
  data() {
    return {
      comments: [],
      showComment: {},
      showCommentflag: false,
      showCommentTimeout: null,
      visit: { ID0: { num: 0 }, }, // コメントしたユーザー情報
      players: [],
      playersTimeout: null,
      totalPoint: 0,
      totalCount: 0,
    };
  },
  created() {
    // data.playersにランダムな既存プレイヤーを入れる
    this.initializePlayers();
  },
  mounted() {
    OneSDK.setup({
      mode: "diff",
      commentLimit: LIMIT,
      disabledDelay: true,
    });
    OneSDK.subscribe({
      action: "comments",
      callback: (comments) => {
        const now = new Date(); // 時間取得
        comments.forEach((comment) => {
          // 名前check
          this.syokencheck(comment)

          // ユーザーのDeathがtrueならreturn
          if (this.deathcheck(comment)) return

          // maxDrawsを超えているならreturn
          if (this.maxDrawscheck(comment)) return

          // 再読み込みのコメントには反応せず、直近のコメントにだけ反応させる
          // FirstCounterでないなら、おみくじ判定
          const timestamp = new Date(comment.data.timestamp);
          const diff = now - timestamp;
          if (diff < 500 && comment.data.userId !== "FirstCounter") {
            // インスタンス発行
            const ins = new commentins(comment);
            // おみくじcheck
            const omi = ins.omiset();

            // おみくじ発火
            if (omi) {
              // おみくじ結果を発火後、ポイントを取得
              const POINT = ins.omikuji(omi);
              // totalに加算する
              this.totalCount++
              this.totalPoint += POINT

              // POINTが0なら、ユーザーにdeathを付与する
              if (POINT === 0 && squid_switch !== 2) {
                if (!comment.meta || comment.data.liveId === "external") { return; }
                const userId = comment.data.userId;
                this.visit[userId].death = true;
              } else {
                // スコア更新+POINTがスコア更新ならハイスコア情報を発火
                this.addscore(comment.data.name, POINT)
              }
            }
          }
        });
      },
    });
    OneSDK.connect();
  },
  computed: {
    // 上位 rankLimit スコアを返す
    topThreePlayers() {
      return this.players
        .sort((a, b) => b.score - a.score)
        .slice(0, rankLimit);
    },
    // 総スコア/総回数の平均点を算出
    averagePoint() {
      return this.totalCount > 0 ? (this.totalPoint / this.totalCount).toFixed(0) : 0;
    },
  },
  methods: {
    // data.playersにランダムな既存プレイヤーを入れる
    initializePlayers() {
      const usedNames = []; // 使用済みの名前を格納する配列
      // 異なる名前を選んでplayersに追加(10個まで)
      for (let i = 0; i < Math.min(rankLimit, 10); i++) {
        let randomName;
        do {
          // 候補から重複しない名前をランダムに選ぶ
          randomName = candidateNames[Math.floor(Math.random() * candidateNames.length)];
        } while (usedNames.includes(randomName));

        // 選んだ名前を使用済み配列に追加
        usedNames.push(randomName);

        // playersに追加
        this.players.push({ name: randomName, score: 2200 - i * 200 });
      }
    },

    // visitにおみくじ回数を記録する
    syokencheck(comment) {
      // metaがないテストコメント、externalはreturn
      if (!comment.meta || comment.data.liveId === "external") { return; }

      const userId = comment.data.userId;
      const userName = comment.data.name;

      // visitに名前がなければ名前を記録する
      if (!this.visit[userId]) {
        this.visit[userId] = { name: userName, draws :1};
      } else {
        // ユーザーIDがすでに存在する場合は、名前を上書きする
        this.visit[userId].name = userName;
        this.visit[userId].draws ++;
      }
    },
    // visitにdeathがあるかcheck
    deathcheck(comment) {
      // metaがないテストコメント、externalは常時false
      if (!comment.meta || comment.data.liveId === "external") { return false }

      // deathプロパティが存在しないならfalse あるならtrueを返す
      const userId = comment.data.userId;
      if (!this.visit[userId]) return false;
      return !!this.visit[userId].death;
    },
    // maxDrawsを超えていないかcheck
    maxDrawscheck(comment) {
      // maxDrawsが0なら無制限なのでreturn
      if (!maxDraws) { return false }
      // metaがないテストコメント、externalは常時false
      if (!comment.meta || comment.data.liveId === "external") { return false }

      // maxDrawsより超えているならtrue返す(もし存在しないならreturn)
      const userId = comment.data.userId;
      if (!this.visit[userId]) return false;
      const draws = this.visit[userId].draws 
      return draws > maxDraws
    },
    // スコアを追加し、上位n位かを確認する
    addscore(userName, score) {
      // 得点を追加
      const newPlayer = { name: userName, score };
      const updatedPlayers = [...this.players, newPlayer].sort((a, b) => b.score - a.score);
      const updatedTopThree = updatedPlayers.slice(0, rankLimit);

      // 今回の得点を表示
      this.showComment = newPlayer
      this.showCommentmethods()

      // 現在のランキングと相違があるなら、演出を行う
      if (JSON.stringify(updatedTopThree) !== JSON.stringify(this.topThreePlayers)) {
        // 今回の順位を取得
        const playerRank = updatedPlayers.findIndex(p => p === newPlayer) + 1;
        const newRecord = playerRank === 1 ? "【記録更新】": ""

        // 記録更新WordPerty+メッセージ
        if (playerRank === 1) post_WordParty([["!newRecord1", 7], ["!newRecord2", 7]])
        post_onecome("Suika", [[`${newRecord}${userName}の${score}は ${playerRank}位だよ。`, 7]])
      }
      // 結果報告と同じタイミングでランキング更新 (上位n位まで)
      this.playersTimeout = setTimeout(() => {
        this.players = updatedPlayers.slice(0, rankLimit);
      }, 3500 + (basicdelay * 1000));
    },
    // 今回のスコア表示時間を設定
    showCommentmethods() {
      this.showCommentflag = false;
      clearTimeout(this.showCommentTimeout);
      this.showCommentTimeout = setTimeout(() => {
        this.showCommentflag = true;
        setTimeout(() => {
          this.showCommentflag = false;
        }, 5000);
      }, 3500 + (basicdelay * 1000));
    }
  },
});
OneSDK.ready().then(() => {
  app.mount("#container");
});


//////////////////////////////////
// コメントのインスタンス化
//////////////////////////////////
class commentins {
  constructor(comment) {
    this.comment = comment;
  }
  // おみくじ判定
  omiset() {
    // FirstCounterは弾く
    if (this.comment.data.userId == "FirstCounter") return;

    // 変数の宣言 負荷軽減のため、コメントは通常と短縮版を用意する
    let ID, mode;
    const comment = this.comment.data.comment;
    const come = this.comment.data.comment.substring(0, 15);

    // ID:1 合成大西瓜
    if (
      come.startsWith("西瓜") ||
      come.startsWith("すいか") ||
      come.startsWith("スイカ") ||
      come.toLowerCase().startsWith("suika") ||
      come.toLowerCase().startsWith("suica") ||
      come.toLowerCase().startsWith("Watermelon") ||
      come === "🍉" ||
      come === "🎃" ||
      comment.includes("合成大西瓜") ||
      comment.includes("スイカゲーム")
    ) {
      ID = 1; mode = 0;

      /*
            // ID:1-1 カボチャゲーム
          } else if (
            come.startsWith("南瓜") ||
            come.startsWith("かぼちゃ") ||
            come.startsWith("カボチャ") ||
            come === "🎃"
          ) {
            ID = 1; mode = 1;
      
            // ID:2 クジラゲーム
          } else if (
            come.startsWith("クジラ") ||
            come.startsWith("くじら") ||
            come.startsWith("鯨") ||
            come === "🐋" ||
            come === "🐳"
          ) {
            ID = 2; mode = 0;
      
            // ID:3 北海道ゲーム
            // ID:4 お金ゲーム
            // ↑今後追加予定
      
            // ID:98 惑星ゲーム
          } else if (
            come.startsWith("惑星") ||
            come === "🪐" ||
            come === "🌍️" ||
            come === "🌎️" ||
            come === "🌏️" ||
            come === "☀" ||
            come === "🌞"
          ) {
            ID = 98; mode = 0;
      */
      // ID:99 イカゲーム
    } else if (
      come === "イカゲーム"
    ) {
      // switchが0ならreturn
      if (squid_switch === 0) {
        return;
      } else {
        ID = 99; mode = 0;
      }
      // おみくじでなければ終了
    } else {
      return;
    }
    // IDとmodeを返す
    return { ID: ID, mode: mode };
  }

  // ID**のおみくじファンクションを実行
  omikuji(omi) {
    const User = this.comment.data.displayName;
    const functions = window[`ID${omi.ID}`]; // 関数を直接取得
    return functions?.call(null, User, omi.mode); // 関数を実行する
  }
}

// ID:1 合成大西瓜 
function ID1(User, mode = 0) {

  // 演出用
  let WORDARR = [["🍒", 1], ["!パパッ", 8.5],]

  // 1.いちご・ぶどう・デコポン・かき・りんごの抽選
  const farfruits = [
    // 🍓いちご：3点(2/3:15回)
    { chance: 67, times: 15, points: 1, party: "🍓" },
    // 🍇ぶどう：10点(1/2:15回)
    { chance: 50, times: 15, points: 3, party: "🍇" },
    // 🍊デコポン：30点(1/2:10回)
    { chance: 50, times: 10, points: 10, party: "🍊" },
    // 🦪かき：100点(1/3:8回)
    { chance: 50, times: 8, points: 20, party: "🦪" },
    // 🍎りんご：200点(2/3:5回)
    { chance: 67, times: 5, points: 50, party: "🍎" },
  ];
  let POINT = playGachaGame(farfruits);

  // 1次：いちご～りんごの抽選
  function playGachaGame(gachas) {
    let totalPoints = 0;
    // ポイントの
    for (const { chance, times, points, party } of gachas) {
      const { pointsEarned, wins } = playGacha(chance, times, points);
      totalPoints += pointsEarned;
      // winsの半分を切り捨てて、その数だけWORDARRに絵文字を追加する
      const halfWins = Math.floor(wins / 2);
      for (let i = 0; i < halfWins; i++) {
        WORDARR.push([party, 1]);
      }
    }
    return totalPoints;
  }
  // ↑の1回毎の抽選
  function playGacha(chance, times, points) {
    let pointsEarned = 0;
    let wins = 0;
    for (let i = 0; i < times; i++) {
      if (Math.random() * 100 < chance) {
        pointsEarned += points;
        wins++;
      }
    }
    return { pointsEarned, wins };
  }

  // 2.ライフ制(❤3)当選時得点を足しライフ減少。なしから順次判定、0になるまで繰り返す
  let life = 3;
  const secfruits = [
    // 🍐なし：500点(1/4:-1)
    { chance: 25, points: 300, damage: 1, party: "🍐" },
    // 🍍パイナップル：600点(1/4:-1)
    { chance: 25, points: 400, damage: 1, party: "🍍" },
    // 🍑もも：800点(1/3:-2)
    { chance: 33, points: 500, damage: 2, party: "🍑" },
    // 🍈メロン：1000点(1/3:-2)
    { chance: 33, points: 700, damage: 2, party: "🍈" },
    // 🍉スイカ：1500点(1/2:-3)
    { chance: 50, points: 1000, damage: 3, party: "🍉" },
    // 🍉🍉ダブル：3000点(1/1:-0)
    { chance: 100, points: 1000, damage: 0, party: "🍉" },
  ];

  while (life > 0) {
    for (const { chance, points: pointsToAdd, damage, party } of secfruits) {
      // 当選時:得点を計算し🍐なしへ戻る
      if (chance > Math.random() * 100) {
        POINT += pointsToAdd;
        life -= damage;
        WORDARR.push([party, 1]); // 該当するフルーツを落とす
        break;

        // 非当選時:chanceを参照にfruitsを落とす
      } else if (chance < Math.random() * 50) {
        WORDARR.push([party, 1]);
      }
    }
  }
  // 0.7～1.3倍する
  const randomMultiplier = 0.7 + Math.random() * 0.6;
  POINT = Math.ceil(POINT * randomMultiplier);

  // 結果をコメント表示、returnでポイントを返す
  post_WordParty(WORDARR)
  post_onecome("Suika", [[`${User}の得点は${POINT}!`, 3.5]])
  return POINT

}

// ID:99 イカゲーム 
function ID99(User, mode = 0) {

  // 1/456で勝利(45,600,000,000pt)、それ以外は0pt
  let MSG
  let POINT = 0
  const ran = (Math.random() * 456) | 0;
  if (ran === 0) {
    MSG = `${User}はイカゲームで勝利し、スイカゲームでは到底得られないスコア「45600000000」を獲得した。`
    POINT = 45600000000
  } else if (ran < 20) {
    MSG = `${User}のスイカはナイフで執拗に抉られ、真っ赤な汁を吹き出し、割れた。`
  } else if (ran < 50) {
    MSG = `${User}のスイカは空を踏み抜き、地面に叩きつけられ、割れた。`
  } else if (ran < 100) {
    MSG = `${User}のスイカは偽物をつかまされ、その代償を負わされ、割れた。`
  } else if (ran < 150) {
    MSG = `${User}のスイカは抵抗虚しく、奈落の底に引きずれ込まれ、割れた。`
  } else if (ran < 200) {
    MSG = `${User}のスイカはキャンディーを激しく叩きつけられ、割れた。`
  } else if (ran < 280) {
    MSG = `${User}のスイカはガリガリと針で突き刺され、真っ赤な汁を吹き出し、割れた。`
  } else if (ran < 350) {
    MSG = `${User}のスイカは転がり落ち、壁に激突し、割れた。`
  } else {
    MSG = `${User}のスイカは他のスイカの重さに耐えられず、押しつぶされ、割れた。`
  }

  // 結果をコメント表示、returnでポイントを返す
  if (POINT !== 0) {
    post_WordParty([["!ヨンヒ人形2", 1], ["!教会の祈り", 2.8]])
  } else {
    post_WordParty([["!ヨンヒ人形1", 1], ["!拳銃", 3], ["!鳥の奇声", 3]])
  }
  post_onecome("오징어", [[MSG, 4]])
  return POINT
}



// onecome
// activeFrameIdが空なら、IDを取得する
if (!activeFrameId || activeFrameId === "") {
  const activeFrameId_obj = OneSDK.get("http://localhost:11180/api/services");
  activeFrameId_obj.then(response => {
    // 一番上にある枠のIDを取得
    activeFrameId = response.data[0].id;
  })
    .catch(error => {
      // エラー処理
      console.error(error);
    });
}

// ↓使用例: 1.5秒後に、「待ち受けキャラ名」の名前で、わんコメにコメントとして投稿します
// YouTubeやTwitch等のチャット欄には投稿されません
// post_onecome("ゆっくり霊夢","ゆっくりしていってね!");
function post_onecome(chara, arr) {

  // 配列でない場合は配列に変換
  arr = Array.isArray(arr) ? arr : [[arr, 0]];
  arr.forEach(([message, waitTime]) => post_onecome_go(message, basicdelay + waitTime, chara));
}
// コメント投稿の実行
async function post_onecome_go(message, waitTime, chara) {

  // ID生成(コメントが上書きされないためのもの)
  const id = new Date().getTime().toString() + Math.floor(Math.random() * 1000000)
  // iconががあるなら、アイコンを追加
  const charaicon = CHARACTER[chara]?.icon || "";

  // HTTP POST
  await delaytime(waitTime);
  const onecome = {
    service: { id: activeFrameId, },
    comment: { userId: "FirstCounter", id: id, name: CHARACTER[chara].name, comment: message, profileImage: charaicon },
  };
  OneSDK.post("http://localhost:11180/api/comments", onecome);
}

// Wordparty Obj
// ↓使用例: 1.5秒後に、WordPartyに「初見」で反応する演出が出ます
// post_WordParty([{"初見":1500},]);
function post_WordParty(arr) {
  // 配列でない場合は配列に変換
  arr = Array.isArray(arr) ? arr : [[arr, 0]];
  arr.forEach(([pattern, waitTime]) => post_WordParty_go(pattern, basicdelay + waitTime));

}
// Wordpartyの実行
async function post_WordParty_go(pattern, waitTime) {
  await delaytime(waitTime);
  await OneSDK.post("http://localhost:11180/api/reactions", {
    reactions: [{ key: pattern, value: 1, },]
  });
}

// 遅延function
async function delaytime(ms) {
  // 秒であれば1000倍にする
  ms = ms <= 30 ? ms * 1000 : ms;
  return new Promise((resolve) => setTimeout(resolve, Math.max(ms, 0)));
}
