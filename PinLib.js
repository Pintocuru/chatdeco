////////////////////////////////////////////////////////////
// PinLib わんコメ用ライブラリ 240303 ベータ版
// 無断転載OK 使う際は自己責任で
////////////////////////////////////////////////////////////

/*
【バージョンアップ情報】
ranlotteryの仕様変更(配列番号を返す→Objをまるっと返す)
アップデートの際は変更を願います
*/

// 設定できる変数
// 投稿の際、わんコメ枠のIDを指定する。
// 指定しない場合は、わんコメ枠の一番上にあるIDを取得します
//const FrameId = "";
// 基礎遅延:コード実行後、待機する時間(default:500ミリ秒)
// 遅延を入れないと、うまく投稿できない場合があります
//const basicdelay = 500;

////////////////////////////////////////////////////////////
// onecomeへの投稿系
////////////////////////////////////////////////////////////

// onecomeへコメント投稿する
// ↓使用例: 1.5秒後に、「待ち受けキャラ名」の名前で、わんコメにコメントとして投稿します
// YouTubeやTwitch等のチャット欄には投稿されません
// post_onecome("ゆっくり霊夢","ゆっくりしていってね!");
function post_onecome(chara, Obj, delay = 0) {
 // chara(0:キャラ名 1:アイコン 2:userId)
 const charaname = Array.isArray(chara) ? chara[0] : chara;
 const charaicon = Array.isArray(chara) ? chara[1] : "";
 const userId = Array.isArray(chara) ? chara[2] : "PinLib";
 // Objが配列でない場合は配列に変換
 if (!Array.isArray(Obj)) { Obj = [{ [Obj]: delay }]; }
 // Objからコメントと遅延を分ける
 for (const obj of Obj) {
  const message = Object.keys(obj)[0];
  const basicdelayValue = typeof basicdelay === 'undefined' ? 500 : basicdelay;
  const waitTime = Math.max(basicdelayValue + obj[message], 0);
  post_onecome_go(charaname, charaicon, userId, message, waitTime);
 }
}


// わんコメ枠の一番上にあるIDを取得
let defaultFrameId;
async function getFrameId() {
 if (typeof FrameId !== "undefined") {
  defaultFrameId = FrameId;
 } else {
  defaultFrameId = await OneSDK.get("http://localhost:11180/api/services").then(response => response.data[0].id);
 }
}
getFrameId();

// コメント投稿の実行
async function post_onecome_go(charaname, charaicon = "", userId = "PinLib", message, waitTime) {
 // ID生成(コメントが上書きされないためのもの)
 const id = new Date().getTime().toString() + Math.floor(Math.random() * 100000000)

 // HTTP POST
 await delaytime(waitTime);
 const onecome = {
  service: { id: defaultFrameId, },
  comment: { userId: userId, id: id, name: charaname, comment: message, profileImage: charaicon },
 };
 OneSDK.post("http://localhost:11180/api/comments", onecome);
}

// Wordparty Obj
// ↓使用例: 1.5秒後に、WordPartyに「初見」で反応する演出が出ます
// post_WordParty("初見",1500);
// post_WordParty([{"初見":1500},]);
function post_WordParty(Obj, delay = 0) {
 // Objが配列でない場合は配列に変換
 if (!Array.isArray(Obj)) {
  Obj = [{ [Obj]: delay }];
 }
 for (const obj of Obj) {
  const pattern = Object.keys(obj)[0];
  const waitTime = Math.max((basicdelay || 500) + obj[message], 0);
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


////////////////////////////////////////////////////////////
// lottery(抽選)系
////////////////////////////////////////////////////////////

// arraylottery
// 配列から抽選を行います
// arraylottery(["りんご","ばなな","みかん"])
// arraylottery([3,1,5,4,2]])
function arraylottery(arr) {
 // 引数が配列でない場合はそのまま返す
 if (!Array.isArray(arr)) return arr;
 // 文字列が1つでも入っているなら、すべてのranを1で処理する
 const hasString = arr.some((element) => typeof element === "string");
 if (hasString) {
  return arr[(Math.random() * arr.length) | 0];

  // 配列内の数値をすべて合計して母数にし、抽選する
 } else {
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
}

// ranlottery
// Objに入ってるranから抽選を行います
// hoge=[{ ran: 5, chara: "ゆっくり霊夢"},{ ran: 4, chara: "ゆっくり魔理沙"}]
// test = ranlottery(hoge).chara
function ranlottery(Obj, mode = 0) {
 // 引数が配列でない場合はそのまま返す
 if (!Array.isArray(Obj)) return Obj;
 let den = 0; let ran; let num = 0;
 // ranが[1,2]といった配列なら、modeを参照してranを選ぶ
 if (Array.isArray(Obj[0].ran)) {
  for (let i = 0; i < Obj.length; i++) den += Obj[i].ran?.[mode] ?? 1;
  ran = Math.random() * den;
  for (let i = 0; i < Obj.length; i++) {
   num += Obj[i].ran?.[mode] ?? 1;
   if (ran < num) return Obj[i]; // 抽選結果を返す
  }
 } else {
  for (let i = 0; i < Obj.length; i++) den += Obj[i]?.ran ?? 1;
  ran = Math.random() * den;
  for (let i = 0; i < Obj.length; i++) {
   num += Obj[i]?.ran ?? 1;
   if (ran < num) return Obj[i]; // 抽選結果を返す
  }
 }
}

// objlottery
// Objに入ってるranから抽選を行います(ranlotteryの改良版)
function objlottery(Obj, res = 0) {
 // 引数がObjectでない場合はそのまま返す
 if (typeof Obj !== 'object') return Obj;
 let den = 0; let ran; let num = 0;
 for (const key in Obj) den += Obj[key]?.ran ?? 1;
 ran = Math.random() * den;
 for (const key in Obj) {
  num += Obj[key]?.ran ?? 1;
  if (ran < num) return res === "key" ? key : Obj[key];
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
