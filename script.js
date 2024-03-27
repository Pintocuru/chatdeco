////////////////////////////////////////////////////////////
// チャットデコレーション! Chat Decoration! for わんコメ v0.3 240325
////////////////////////////////////////////////////////////
const LIMIT = 30
const app = Vue.createApp({
 setup() {
  document.body.removeAttribute('hidden')
 },
 data() {
  return {
   comments: [],
   visit: {},
  }
 },
 methods: {
  getClassName(comment) {
   if (comment.commentIndex % 2 === 0) {
    return 'comment even'
   }
   return 'comment odd'
  },
  // Userlevelを取得(0:一般 1:メンバー 2:モデレーター 3:配信者)
  getUserlevel(data) {
   return (data.isOwner ? 3 : data.isModerator ? 2 : data.isMember ? 1 : 0);
  },
  // 各コメントのStyleをdecoによって変える
  getStyle(comment) {
   // スパチャの情報があればそれを返す
   const Style = OneSDK.getCommentStyle(comment);
   if ('--lcv-background-color' in Style) { return Style; }
   // CSSがあるなら付与する
   console.log(comment.css);
   if (comment.css) { return comment.css; }
  },
  // フォントのサイズ(倍率)を変える
  getfontsize(css) {
   if (css == undefined) { return {}; }
   if (css.hasOwnProperty("fontsize")) { return { "font-size": css.fontsize }; } else { return {} }
  },
  // コメントを参照しVisitに追加(再読み込み用)
  async visitfirstget() {
   const comments = OneSDK.get("http://localhost:11180/api/comments");
   comments.then(response => {
    // userIdを抽出
    this.visit = response.data.reduce((acc, comment) => {
     const key = comment.data.userId;
     const name = comment.data.name;
     const existingObj = acc.find(obj => obj[key]?.name === name);
     if (!existingObj) {
      acc.push({ [key]: { name: name } });
     }
     return acc;
    }, []);
   })
  },
  // visitにデータが無ければ新規追加
  visitcheck(comment) {
   const userId = comment.data.userId;
   if (!this.visit.hasOwnProperty(userId)) {
    this.visit[userId] = { name: comment.data.displayName };
    // defaultALLdecoが1なら、このタイミングでbasicのデコを付与する(ranの影響を受ける)
    if (defaultALLdeco === 1) this.deco2visit(comment, "")

    // USERが該当する、そうでないならロールが該当する#decoをチェック
    let decoKey;

    // USER_IMAGES(個別ユーザー)
    decoKey = USER_IMAGES.find(array => array.username.includes(comment.data.displayName));
    // decoKeyがあるなら、visitにdecoデータを追加
    if (decoKey !== undefined) {
     this.visit[comment.data.userId].deco = deco_data("USER_IMAGES", decoKey);
     return;
    }

    // ROLE_IMAGES(ユーザーレベル)
    const Userlevel = this.getUserlevel(comment.data);
    decoKey = Object.keys(ROLE_IMAGES).find(key => String(ROLE_IMAGES[key].userlevel) === String(Userlevel));

    // decoKeyがあるなら、visitにdecoデータを追加
    if (decoKey !== undefined) {
     this.visit[comment.data.userId].deco = deco_data("ROLE_IMAGES", decoKey);
    }
   }
  },
  // #decoが先頭に付いているなら、デコレーションを付与
  deco2visit(comment, deconumber) {
   // #0なら、USER_IMAGESを参照
   if (deconumber === 0){
    // USER_IMAGES(個別ユーザー)
    const decoKey = USER_IMAGES.find(array => array.username.includes(comment.data.displayName));
    // decoKeyがあるなら、visitにdecoデータを追加
    if (decoKey !== undefined) {
     this.visit[comment.data.userId].deco = deco_data("USER_IMAGES", decoKey);
    }   
    return;
   }

   // 特定のdecoがあればそれを、なければランダムでvisitに格納
   const decoKey = deconumber ? deconumber : objlottery(BASIC_IMAGES,"key");
   this.visit[comment.data.userId].deco = deco_data("BASIC_IMAGES", decoKey);


   // deco変更のアナウンス(直近でなければスキップ、アナウンス自体のデコ変更は告知しない)
   const diff = new Date() - new Date(comment.data.timestamp);
   if (diff < 2000 && comment.data.userId !== "PinLib" && enableAnnounce === 2) {
    this.post_announce(`${comment.data.displayName}さんのデコレーションを変更したよ。`, 2);
   }
  },
  // アナウンスでわんコメに投稿する
  post_announce(message, num) {
   if (enableAnnounce < num) { return; }
   post_onecome(["アナウンス", `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>bullhorn</title><path d="M12,8H4A2,2 0 0,0 2,10V14A2,2 0 0,0 4,16H5V20A1,1 0 0,0 6,21H8A1,1 0 0,0 9,20V16H12L17,20V4L12,8M21.5,12C21.5,13.71 20.54,15.26 19,16V8C20.53,8.75 21.5,10.3 21.5,12Z" fill="rgb(33, 33, 33)" /></svg>`], message, 500)
  },
 },
 mounted() {
  // !decoが有効であることをアナウンス
  if (Userlevel <= 2) {
   const plustalk = Userlevel === 2 ? "モデレーターは、" : Userlevel === 1 ? "メンバーは、" : "";
   this.post_announce(`${plustalk}このチャット欄に !deco で、デコレーションができるよ。`, 1);
  }
  // visitデータを取得
  this.visitfirstget();
  let cache = new Map()
  commentIndex = 0
  OneSDK.setup({
   commentLimit: LIMIT
  })
  OneSDK.subscribe({
   action: 'comments',
   callback: (comments) => {
    const newCache = new Map()
    comments.forEach(comment => {
     const index = cache.get(comment.data.id)
     if (isNaN(index)) {
      // visit check
      this.visitcheck(comment);
      const checkword = new RegExp(/^(?:#|＃)(?:deco|deko|でこ|デコ)\s*/);
      const match = comment.data.comment.match(/[#＃](\d{1,2})/);
      const checknumber = match ? Number(match[1]) : null;
      // defaultALLdecoが2なら、basicの#decoを付与する(ranの影響を受ける)
      if (checknumber == null && defaultALLdeco === 2) {
       this.deco2visit(comment, "")
       // コメントに#decoが先頭に付いているなら、デコレーションを付与
      } else if (checkword.test(comment.data.comment) && this.getUserlevel(comment.data) >= Userlevel) {
       this.deco2visit(comment, "")
       // #の後に数値が入るなら、数値に対応した#decoを適用する
      } else if (checknumber){
       this.deco2visit(comment, checknumber)      
      }
      // decoに合わせたCSSの変更
      const deco = this.visit[comment.data.userId]?.deco;
      comment.css = deco || "";
      // profileImageがあるなら、アイコンを書き換える
      if (deco?.profileImage) {
       comment.data.profileImage = deco.profileImage;
      }

      comment.commentIndex = commentIndex
      newCache.set(comment.data.id, commentIndex)
      ++commentIndex
     } else {
      comment.commentIndex = index
      newCache.set(comment.data.id, index)
     }
    })
    cache = newCache
    this.comments = comments
   }
  })
  OneSDK.connect()
 },
})
OneSDK.ready().then(() => {
 app.mount("#container");
})
