const LIMIT = 30;
const app = Vue.createApp({
  setup() {
    document.body.removeAttribute("hidden");
  },
  data() {
    return {
      comments: [],
      isHidden: false,
      waitingList: [],
    };
  },
  methods: {
    // OBSの非表示を監視
    isHiddenStatus() {
      return this.isHidden;
    },
  },
  async created() {
    // Xmin毎にコメント
    const min = Math.max(posttime_min || 0.99, 0.99);
    if (min >= 1) { await posttime(); }
    const timer = setInterval(async () => {
      if (min >= 1) { await posttime(); }
    }, min * 60 * 1000);
  },
  beforeDestroy() {
    // タイマーを停止
    clearInterval(this.timer);
  },
  mounted() {
    // 表示時間
    const WAIT_DURATION = OneSDK.getStyleVariable("--lcv-wait-duration", 100, parseInt);
    const INTERVAL = OneSDK.getStyleVariable("--lcv-enter-duration", 160, parseInt) + WAIT_DURATION;
    const LIFE_TIME = OneSDK.getStyleVariable("--lcv-lifetime", 20000, parseInt) + WAIT_DURATION;
    // CHARACTER のキー名を取得
    const CHARACTERkeys = Object.keys(CHARACTER);

    commentIndex = 0;
    OneSDK.setup({
      mode: "diff",
      commentLimit: LIMIT,
      disabledDelay: true,
    });
    const queue = [];
    OneSDK.subscribe({
      action: "comments",
      callback: (comments) => {
        // OBS・ブラウザが非表示ならreturn
        if (this.isHidden) { return; }
        const now = new Date(); // 時間取得
        comments.forEach((comment) => {
          const timestamp = new Date(comment.data.timestamp);
          const diff = now - timestamp;
          // 再読み込みのコメントには反応せず、直近のコメントにだけ反応させる
          if (diff < 500 && comment.data.userId !== "FirstCounter") {
            // インスタンス発行
            const ins = new commentins(comment);
            // 初見check
            ins.syoken();
          }
          // FirstCounterを表示/nightbot_switchが1ならNightbotも表示
          if (comment.length !== 0 && (comment.data.userId === "FirstCounter" | CHARACTERkeys.includes(comment.data.name))) {
            // コメントしたキャラに合わせて、commentにcssデータを注入
            comment.css = CHARACTER[comment.data.name];
            queue.push(...comments);
            // 初見判定ちゃんでないなら、このタイミングでキャラクターを出す
            if (comment.data.userId !== "FirstCounter") {
              post_WordParty([{ [CHARACTER[comment.data.name].defaultchara]: -5000 }])
            }
          }
        });
      },
    });
    // 参加型管理を監視
    let cache = new Map()
    commentIndex_wait = 0
    OneSDK.subscribe({
      action: 'waitingList',
      callback: (waitingList) => {
        const newCache = new Map()
        waitingList.forEach(List => {
          const index = cache.get(List.id)
          if (isNaN(index)) {
            // 新しく参加希望があるなら反応させる
            const obj = GetMessage({ user: List.username }, "waiting");
            if (obj) {
              if (!obj.img) { obj.img = CHARACTER[obj.chara].defaultchara }
              post_WordParty(obj.img);
              post_onecome(obj.chara, obj.message);
            }
            List.commentIndex = commentIndex_wait
            newCache.set(List.id, commentIndex_wait)
            ++commentIndex_wait
          } else {
            List.commentIndex = index
            newCache.set(List.id, index)
          }
        })
        cache = newCache
        this.waitingList = waitingList
      }
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
      // Promiseを返す関数を定義
      const runWorker = () => {
        return new Promise((resolve, reject) => {
          const purifiedCode = DOMPurify.sanitize(userCode, { SAFE_FOR_JQUERY: true });
          const worker = new Worker(URL.createObjectURL(new Blob([`(function () { ${purifiedCode} })()`], { type: 'text/javascript' })));

          // Worker の処理結果を待ち受ける
          worker.onmessage = (event) => {
            clearTimeout(timeoutTimer);
            resolve(event.data);
          };

          // Worker でエラーが発生した場合の処理
          worker.onerror = (error) => {
            clearTimeout(timeoutTimer);
            reject("コードの実行中にエラーが発生しました: " + error.message);
          };

          // タイムアウト用のタイマーを設定
          const timeoutTimer = setTimeout(() => {
            worker.terminate();
            reject("処理がタイムアウトしました");
          }, 1000);
        });
      };

      // Workerの処理を非同期で実行
      try {
        AAA = runWorker();
      } catch (error) {
        console.error(error);
      }
    }
  }
  // <<user>><<tc>><<AAA>>を書き換え
  obj.message = obj.message
    .replace(/<<user>>/g, data.user !== undefined ? data.user : "(error)")
    .replace(/<<tc>>/g, data.tc !== undefined ? data.tc : "(error)")
    .replace(/<<AAA>>/g, AAA !== undefined ? AAA : "(error)");

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
  syoken() {
    // 初見判定ちゃんは弾く
    if (this.comment.data.userId == "FirstCounter") return;
    // わんコメのコメントテスターであれば、仮のmetaデータを入れる
    const meta = this.comment.meta || { interval: 99999, tc: 10, no: 2 };
    let mode;
    let price = 0;
    // THRESHOLDが1日未満なら「久しぶり」が機能しない
    const THRESHOLD = 1000 * 60 * 60 * 24 * (day || 0); // dayがない場合はOFF
    const again_flag = THRESHOLD < 1000 * 60 * 60 * 24 ? 0 : 1;

    // ギフト(最も優先される)
    if (this.comment.data.price && gift_switch) {
      mode = "gift";
      price = this.comment.data.price
      // unitが$ならpriceを100倍(えっ、1ドル100円ですか?)
      if ((this.comment.data.unit === "$" || 0)) price *= 100;

      // おみくじモード(初見判定よりもおみくじが優先される)
    } else {
      mode = (function (comment) {
        const obj = DATAOBJ.OMIKUJI_SWITCH || {};
        const mode = Object.keys(obj).find(key => obj[key].test(comment));
        return mode || undefined;
      })(this.comment.data.comment);
    }

    // 該当するおみくじがなければ初見判定
    if (!mode) {
      // meta.intervalが0なら初見
      if (meta?.interval === 0 || testSwitch === 3) {
        mode = "syoken";

        // 初見ではないのに初見と言う奴に贈る言葉(初回から5回までは無効)
      } else if (this.comment.data.comment.includes("初見") && (!meta || meta.tc > 5) && syoken_sagi_switch) {
        mode = "syoken_sagi";

        // meta.intervalが1000*60*60*24*day以上なら久しぶり
      } else if (again_flag && (meta?.interval || 0) > THRESHOLD || testSwitch === 2) {
        mode = "again";

        // meta.noが1なら今日始めて
      } else if ((meta?.no || 0) === 1 || testSwitch === 1) {
        mode = "hi";

        // そうでないならreturn
      } else {
        return;
      }
    }
    // botがコメントをする
    const user = this.comment.data.displayName || "名無しさん"; // 名前
    const tc = (this.comment.meta && this.comment.meta.tc) || 0; // コメント回数
    const obj = GetMessage({ user: user, tc: tc }, mode, price);

    // コメント無効化等でundefinedになってないなら表示
    if (obj) {
      if (!obj.img) { obj.img = CHARACTER[obj.chara].defaultchara }
      post_WordParty(obj.img);
      post_onecome(obj.chara, obj.message);
    }
  }
}


// タイマー機能
async function posttime() {
  const obj = GetMessage({}, "timer");
  if (!obj.img) { obj.img = CHARACTER[obj.chara].defaultchara }
  post_WordParty(obj.img);
  post_onecome(obj.chara, obj.message);
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
function post_onecome(chara, Obj) {
  // Objが配列でない場合は配列に変換
  if (!Array.isArray(Obj)) {
    Obj = [{ [Obj]: 0 }];
  }
  for (const obj of Obj) {
    const message = Object.keys(obj)[0];
    const waitTime = Math.max(basicdelay + obj[message], 0);
    post_onecome_go(waitTime, chara, message);
  }
}
// コメント投稿の実行
async function post_onecome_go(waitTime, chara, message) {
  // ID生成(コメントが上書きされないためのもの)
  const id = new Date().getTime().toString() + Math.floor(Math.random() * 1000000)
  // iconががあるなら、アイコンを追加
  const charaicon = CHARACTER[chara].icon;
  if (!charaicon) charaicon = "";
  // HTTP POST
  await delaytime(waitTime);
  const onecome = {
    service: { id: activeFrameId, },
    comment: { userId: "FirstCounter", id: id, name: chara, comment: message, profileImage: charaicon },
  };
  OneSDK.post("http://localhost:11180/api/comments", onecome);
}

// Wordparty Obj
// ↓使用例: 1.5秒後に、WordPartyに「初見」で反応する演出が出ます
// post_WordParty([{"初見":1500},]);
function post_WordParty(Obj) {
  // Objが配列でない場合は配列に変換
  if (!Array.isArray(Obj)) {
    Obj = [{ [Obj]: 0 }];
  }
  for (const obj of Obj) {
    const pattern = Object.keys(obj)[0];
    const waitTime = Math.max(basicdelay + obj[pattern], 0);
    post_WordParty_go(waitTime, pattern);
  }
}
// Wordpartyの実行
async function post_WordParty_go(waitTime, pattern) {
  await delaytime(waitTime);
  await OneSDK.post("http://localhost:11180/api/reactions", {
    reactions: [{ key: pattern, value: 1, },]
  });
}

// 遅延function
async function delaytime(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
