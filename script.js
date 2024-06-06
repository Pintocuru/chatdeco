////////////////////////////////////////////////////////////
// スイカ🍉ジェネレーター Gousei Suika Generator for わんコメ v0.1 240603
////////////////////////////////////////////////////////////

// コメントしてからBotが反応するまでの遅延(ミリ秒)、小さすぎるとBotが機能しない場合があります
const basicdelay = 1500;

// コメントするキャラクター設定
const CHARACTER = {
  // 合成大西瓜(スイカゲーム)
  Suika: { name: "", icon: "" },
  // イカゲーム
  오징어: { name: "", icon: "" },
}


const LIMIT = 30;
const app = Vue.createApp({
  setup() {
    document.body.removeAttribute("hidden");
  },
  data() {
    return {
      comments: [],
      visit: { ID0: { num: 0 }, }, // コメントしたユーザー情報
      score: [
        { name: 'おふとん', score: 2000 },
        { name: 'もこもこ', score: 1800 },
        { name: 'じゅん', score: 1600 },
      ],
    };
  },
  mounted() {
    OneSDK.setup({
      mode: "diff",
      commentLimit: LIMIT,
      disabledDelay: true,
    });
    const queue = [];
    OneSDK.subscribe({
      action: "comments",
      callback: (comments) => {
        const now = new Date(); // 時間取得
        comments.forEach((comment) => {
          // 名前check
          syokencheck(comment)

          // ユーザーのDeathがtrueならreturn
          if (deathcheck(comment)) return

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

              // POINTがスコア

              // スコア更新ならハイスコア情報を発火

              // POINTが0なら、ユーザーにdeathを付与する

            }
          }
        });
      },
    });

    // コメントを定期的に表示し、一定時間経過後に自動的に削除する
    let time = 0;
    let plustime = 0;
    const check = () => {
      const now = Date.now();
      if (time + INTERVAL < now) {
        if (queue.length !== 0) {
          time = now;
          const comment = queue.shift();
          // スピーチの長さによって生存時間を延長
          if (comment.data.speechText.length >= 30) { plustime = (comment.data.speechText.length - 30) * 100; }
          this.comments.shift();
          this.comments.push(comment);
        } else if (now - time > LIFE_TIME + plustime) {
          this.comments.shift();
        }
      }
      requestAnimationFrame(check);
    };
    OneSDK.connect();
    check();
  },
  methods: {
    // visitに名前がなければ名前を記録する
    syokencheck(comment) {
      // metaがないテストコメント、externalはreturn
      if ( !comment.meta || comment.data.liveId === "external") { return; }

      const userId = comment.data.userId;
      const userName = comment.data.name;

      // visitに名前がなければ名前を記録する
      if (!this.visit[userId]) {
        this.visit[userId] = { name: userName };
      } else {
        // ユーザーIDがすでに存在する場合は、名前を上書きする
        this.visit[userId].name = userName;
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

  },
});
OneSDK.ready().then(() => {
  app.mount("#container");
});



// modeを参照してMessageを取得する
// data = {user,tc}
function GetMessage(data, mode, price = 0) {
  // ギフトがあるならdonationを参照する
  if (price) mode = gift;

  // COMMON > OMIKUJIの順番に参照、なければreturn
  const objset = DATAOBJ.COMMON_SWITCH?.[mode] ? DATAOBJ.COMMON[mode] : DATAOBJ.OMIKUJI?.[mode];
  if (!objset) return;

  // ranを参照しランダムに選び、objをディープコピー
  const obj = JSON.parse(JSON.stringify(objset[superlottery(objset)]));

  // funcIDがあるなら任意コード実行
  let AAA;
  if (obj.funcID) {
    const userCode = DATAOBJ.FUNKS?.[obj.funcID];
    if (userCode) {
      // userCodeをDOMPurifyを使用して安全に処理
      const purifiedCode = DOMPurify.sanitize(userCode, { SAFE_FOR_JQUERY: true });
      const func = new Function(purifiedCode);
      AAA = func();
    }
  }
  // <<user>><<tc>><<AAA>>を書き換え
  if (Array.isArray(obj.message)) {
    // 配列の各要素に対して処理を行う
    obj.message.forEach((item, index) => {
      // オブジェクトのキー名を置換する
      const replacedItem = {};
      for (const key in item) {
        let replacedKey = key.replace(/<<user>>/g, data.user !== undefined ? data.user : "(error)");
        replacedKey = replacedKey.replace(/<<tc>>/g, data.tc !== undefined ? data.tc : "(error)");
        replacedKey = replacedKey.replace(/<<AAA>>/g, AAA !== undefined ? AAA : "(error)");

        replacedItem[replacedKey] = item[key];
      }
      // 置換されたオブジェクトを元の配列に置き換える
      obj.message[index] = replacedItem;
    });
  } else {
    // 配列でない場合の処理
    obj.message = obj.message
      .replace(/<<user>>/g, data.user !== undefined ? data.user : "(error)")
      .replace(/<<tc>>/g, data.tc !== undefined ? data.tc : "(error)")
      .replace(/<<AAA>>/g, AAA !== undefined ? AAA : "(error)");
  }

  // objを返す
  return obj

}

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
      come === "🍉" ||
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
      ID = 99; mode = 0;

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
  let WORDARR = []

  // 1.いちご・ぶどう・デコポン・かき・りんごの抽選
  const farfruits = [
    // 🍓いちご：3点(2/3:15回)
    { chance: 67, times: 15, points: 3, party:"🍓"},
    // 🍇ぶどう：10点(1/2:15回)
    { chance: 50, times: 15, points: 10, party: "🍇" },
    // 🍊デコポン：30点(1/2:10回)
    { chance: 50, times: 10, points: 30, party: "🍊" },
    // 🦪かき：100点(1/3:8回)
    { chance: 50, times: 8, points: 100, party: "🦪" },
    // 🍎りんご：200点(2/3:5回)
    { chance: 67, times: 5, points: 200, party: "🍎" },
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
        WORDARR.push([party, 0]);
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

  // 2.ライフ制(❤5)当選時得点を足しライフ減少。なしから順次判定、0になるまで繰り返す
  let life = 5;
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
    { chance: 100, points: 2000, damage: 0, party: "🍉" },
  ];

  while (life > 0) {
    for (const { chance, points: pointsToAdd, damage, party } of secfruits) {
      // 当選時:得点を計算し🍐なしへ戻る
      if (chance > Math.random() * 100) {
        POINT += pointsToAdd;
        life -= damage;
        WORDARR.push([party, 0]); // 該当するフルーツを落とす
        break;

     // 非当選時:chanceを参照にfruitsを落とす
     } else if (chance < Math.random() * 50) {
        WORDARR.push([party, 0]);
      }
    }
  }

  // 結果をコメント表示、returnでポイントを返す
  post_WordParty(WORDARR)
  post_onecome("Suika", [[`${User}の得点は ${POINT}Point!`, 5]])
  return POINT

}

// ID:99 イカゲーム 
function ID99(User, mode = 0) {

  // 1/456で勝利(45,600,000,000pt)、それ以外は0pt
  let MSG 
  let POINT = 0
  const ran = (Math.random() * 456) | 0;
  if (ran === 0){
    MSG = `${User}はイカゲームで勝利し、スイカゲームでは到底得られないスコア「45600000000」を獲得した。`
    POINT = 45600000000
  } else if(ran < 20){
    MSG = `${User}のスイカはナイフで執拗に抉られ、真っ赤な汁を吹き出して割れた。`
  } else if (ran < 50) {
    MSG = `${User}のスイカは空を踏み抜き、地面に叩きつけられて割れた。`
  } else if (ran < 100) {
    MSG = `${User}のスイカは偽物をつかまされ、果てには自らスイカを割った。`
  } else if (ran < 150) {
    MSG = `${User}のスイカは抵抗虚しく、奈落の底に引きずれ込まれ割れた。`
  } else if (ran < 200) {
    MSG = `${User}のスイカはキャンディーを激しく叩きつけられ消滅した。`
  } else if (ran < 280) {
    MSG = `${User}のスイカはガリガリと針で突き刺され、真っ赤な汁を吹き出して割れた。`
  } else if (ran < 350) {
    MSG = `${User}のスイカは転がり落ち、壁に激突して割れた。`
  } else  {
    MSG = `${User}のスイカは他のスイカの重さに耐えられず、押しつぶされて割れた。`
  }

  // 結果をコメント表示、returnでポイントを返す
  post_onecome("오징어", [[MSG, 5]])
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

// Singlelottery
// 配列から抽選を行います
// Singlelottery([3,1,5,4,2]])
function Singlelottery(arr) {
  // 引数が配列でない場合は undefined を返す
  if (!Array.isArray(arr)) return undefined;
  // 母数の計算
  let sum = 0;
  for (let i = 0; i < arr.length; i++) sum += arr[i];
  // 抽選
  const randomValue = Math.floor(Math.random() * sum);
  // 配列を見て該当する箇所を特定
  let cumulativeSum = 0;
  for (let i = 0; i < arr.length; i++) {
    cumulativeSum += arr[i];
    if (randomValue < cumulativeSum) {
      return i; // 抽選結果を返す
    }
  }
}

// superlottery
// Objに入ってるranから抽選を行います
function superlottery(Obj, mode = 0) {
  let den = 0; let ran; let num = 0;
  if (Array.isArray(Obj[0].ran)) {
    for (let i = 0; i < Obj.length; i++) den += Obj[i].ran[mode];
    ran = Math.random() * den;
    for (let i = 0; i < Obj.length; i++) {
      num += Obj[i].ran[mode];
      if (ran < num) return i; // 抽選結果を返す
    }
  } else {
    for (let i = 0; i < Obj.length; i++) den += Obj[i].ran;
    ran = Math.random() * den;
    for (let i = 0; i < Obj.length; i++) {
      num += Obj[i].ran;
      if (ran < num) return i; // 抽選結果を返す
    }
  }
}

// pricelottery
// priceに合わせてranを変動させ、抽選を行います
function pricelottery(Obj, price = 1) {
  let den = 0; let ran; let num = 0;

  for (let i = 0; i < Obj.length; i++) {
    if ((Obj[i].price ?? false) <= price && (Obj[i].priceLimit ?? 99999999) >= price) {
      Obj[i].check = true;
      Obj[i].den = (Obj[i].ran * Obj[i].price * Obj[i].price);
      den += Obj[i].den;
    } else {
      Obj[i].check = false;
    }
  }
  ran = Math.random() * den;
  for (let i = 0; i < Obj.length; i++) {
    if (Obj[i].check) {
      num += Obj[i].den;
      if (ran < num) return i; // 抽選結果を返す
    }
  }
  // どこにも当選しない場合は-1を返す
  return -1;
}
