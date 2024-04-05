// ライブラリの使用
const draggable = window['vuedraggable'];
const vuetify = Vuetify.createVuetify();

const app = Vue.createApp({
  data: () => ({
    tab: 'CHARACTER', // ナビゲーション BASIC_deco
    images_dir: "", // 画像ディレクトリ
    selectgridcols: "pattern2", // アイテムの並べ方
    gridcols: {
      pattern1: { name: "pattern1", cols: 12, sm: 12, md: 12, lg: 6, height: 50, icon: "mdi-view-list" },
      pattern2: { name: "pattern2", cols: 12, sm: 6, md: 4, lg: 3, height: 100, icon: "mdi-view-grid" },
      pattern3: { name: "pattern3", cols: 4, sm: 3, md: 2, lg: 1, height: 100, icon: "mdi-view-module" },
    },
    snackbar: { copy: false, clear: false, new: false, newstop: false }, // スナックバー
    dialog: Array(60).fill(false), // ダイアログ
    repeatOptions: ['repeat', 'no-repeat', 'repeat-x', 'repeat-y'], // 背景画像の選択肢

    // わんコメテンプレート
    OnecomeSelect: "テンプレートを選択",
    Onecometemplate: {
      "テンプレートを選択": { "name": "テンプレートを選択", "img": "./_lib/basic_deco/thumb.png" },
      "(設定ファイルのみ)": { "name": "(設定ファイルのみ)", "img": "./_lib/basic_deco/thumb.png" },
      "basic": { "name": "basic", "img": "./_lib/basic_deco/thumb.png" },
      "cool-pop": { "name": "cool-pop", "img": "./_lib/cool-pop_deco/thumb.png" },
      "diagonal-right": { "name": "diagonal-right", "img": "./_lib/diagonal-right_deco/thumb.png" },
      "diagonal": { "name": "diagonal", "img": "./_lib/diagonal_deco/thumb.png" },
      "retro": { "name": "retro", "img": "./_lib/retro_deco/thumb.png" },
      "slim": { "name": "slim", "img": "./_lib/slim_deco/thumb.png" }
    },

    // 各テンプレート
    TEMPLATEOBJ: {
      TEXTCOLOR: ELDERTEMPLATE.TEXTCOLOR,
      BACKCOLOR: ELDERTEMPLATE.BACKCOLOR,
      GRADATION: ELDERTEMPLATE.GRADATION,
      IMAGES: ELDERTEMPLATE.IMAGES,
    },
    DATAOBJ: __USER__DATAOBJ,
    tmp: {},
  }),
  created() {
    // CHARACTERを配列にしてtmpに入れる
    this.tmp = this.Object2Array(JSON.parse(JSON.stringify(this.DATAOBJ)));
    console.log(this.tmp.CHARACTER);
    /*
    // 画像ディレクトリを返す
    //this.get_images_dir();
 
    // userData.jsがなければテンプレを読む
    if (typeof __USER__DATAOBJ !== 'undefined') {
      // userData.js
      this.presetDATAOBJ(__USER__DATAOBJ)
      Swal.fire({
        imageUrl: `./img/${this.imgRandom()}`,
        imageAlt: "チャットデコレーション!",
        title: "userData.js を読み込んだよ",
        text: "カスタムデータをセットしたよ",
        focusConfirm: false,
      });
    } else {
      // 初期起動、またはuserData.jsなし
      this.presetDATAOBJ(ELDERTEMPLATE)
      Swal.fire({
        imageUrl: `./img/${this.imgRandom()}`,
        imageAlt: "Custom image",
        title: "Welcome to チャットデコレーション!",
        text: "初期設定をセットしたよ。カスタムデータは、Generator.htmlと同じディレクトリに userData.jsを置いてね。",
        focusConfirm: false,
      });
    }
*/
  },



  methods: {
    // CHARACTER がObjectなら配列にする
    Object2Array(data) {
      const images = ["CHARACTER",];
      for (const image of images) {
        const isArray = Array.isArray(data[image]);
        if (!isArray) {
          // Object を配列に変換
          const arr = Object.values(data[image]);
          data[image] = arr;
        }
      }
      return data
    },

    // ran の数値を合計したものと、引数に対しての％を返す(basicのみ)
    sumRanValues(num) {
      const total = this.DATAOBJ.BASIC_IMAGES.reduce((sum, obj) => sum + (obj.hasOwnProperty('ran') ? parseInt(obj.ran) : 0), 0);
      return Math.round((num / total) * 100);
    },
    // BASIC/USER:空のデータを追加
    NullAddImage(mode) {
      let template;
      if (mode === "BASIC_IMAGES") {
        template = {
          ran: 1,
          img: "none",
          text: "none",
          back: "none",
          gradation: "none",
        };
      } else {
        template = {
          username: ["ユーザー"],
          img: "none",
          text: "none",
          back: "none",
          gradation: "none",
        };

      }
      // テンプレートを追加
      const sourceArray = this.getIMAGES(mode);
      if (sourceArray.length < 50) {
        sourceArray.unshift(template);
        this.snackbar.new = true; // snackbarを表示
      } else {
        this.snackbar.newstop = true; // snackbarを表示     
      }
    },
  },
});


app.component('d_titlebar', {
  props: ['title'],
  emits: ['addbtn'],
  template: `
    <v-toolbar density="compact">
      <v-toolbar-title class="text-h5">{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn variant="elevated" color="primary" @click="$emit('addbtn')">
        <v-icon>mdi-plus</v-icon> 新規作成
        <v-tooltip activator="parent" location="bottom">{{ title }} に空のデータを追加します</v-tooltip>
      </v-btn>
    </v-toolbar>
    <br>
  `,
})




/*
    // 画像ディレクトリを返す
    get_images_dir() {
      const url = new URL(document.URL);
      const directory = url.pathname.substring(0, url.pathname.lastIndexOf('/'));
      this.images_dir = `${directory}./img/`;
    },
 
    // プリセットデータから読み込む　     
    presetDATAOBJ(Obj) {
      this.DATAOBJ = this.Object2Array(JSON.parse(JSON.stringify(Obj)));
      // text/back/gradation/img をtmpとして配列に変換
      this.STYLE2tmp();
    },
 
    // 設定をリセットする
    ResetDATAOBJ() {
      Swal.fire({
        title: `設定をリセットする`,
        text: "設定をリセットし、初期設定に戻します",
        icon: "warning",
        // 1番目ボタン
        confirmButtonText: "リセットする",
        confirmButtonColor: "",
        // 2番目ボタン
        showDenyButton: true,
        denyButtonText: "やめる",
        denyButtonColor: "",
      }).then((result) => {
        if (result.isConfirmed) {
          // ELDERTEMPLATE をプリセットデータに入れる
          this.presetDATAOBJ(ELDERTEMPLATE)
          // リセットしたことを報告
          Swal.fire({
            title: `リセット!`,
            text: "設定をリセットしたよ",
            icon: "success",
          }).then((result) => {
            this.tmp_updata()
            tab = 'BASIC_deco';
          });
        }
      });
    },
    // BASIC_IMAGES/USER_IMAGES がObjectなら配列にする
    Array2Object(data) {
      const images = ["BASIC_IMAGES", "USER_IMAGES"];
      for (const image of images) {
        const isObject = typeof data[image] === 'object' && !Array.isArray(data[image]);
        if (isObject) {
          // 配列を Object に変換
          const obj = data[image].reduce((acc, value, index) => {
            acc[index] = value;
            return acc;
          }, {});
          data[image] = obj;
        }
      }
      return data;
    },
 
 
    // text/back/gradation:tmpとして配列データを作成
    STYLE2tmp() {
      const objectToArray = obj => Object.keys(obj).map(key => ({ ...obj[key], key }));
      this.tmp.TEXTCOLOR = objectToArray(this.DATAOBJ.TEXTCOLOR);
      this.tmp.BACKCOLOR = objectToArray(this.DATAOBJ.BACKCOLOR);
      this.tmp.GRADATION = objectToArray(this.DATAOBJ.GRADATION);
      this.tmp.IMAGES = objectToArray(this.DATAOBJ.IMAGES);
    },
 
    // text/back/gradation:tmpの配列をObjectに戻してDATAOBJに入れる
    tmp2STYLE(style) {
      const resultObject = {};
      const array = this.tmp[style];
      for (const item of array) {
        const key = item.key;
        resultObject[key] = item;
      }
      // 結果をDATAOBJに代入
      this.DATAOBJ[style] = resultObject;
    },
 
 
    //// ファイル更新
    // tmpを更新、JSONを書き足す
    tmp_updata() {
      const styles = ["TEXTCOLOR", "BACKCOLOR", "GRADATION", "IMAGES"];
      styles.forEach(style => {
        this.tmp2STYLE(style);
      });
    },
 
    //// テンプレートファイル書き出し  
    outputTemplate() {
      // jsファイルを出力
      const jsonDataString = "const __USER__DATAOBJ =" + JSON.stringify(this.DATAOBJ);
      const blob = new Blob([jsonDataString], { type: 'application/javascript' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'userData.js';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
 
    //// ファイル呼び出し
    // BASIC/ROLE/USER:対象のObjectを取得
    getIMAGES(mode, type = "tmp") {
      switch (mode) {
        case 'BASIC_IMAGES':
          return this.DATAOBJ.BASIC_IMAGES;
        case 'ROLE_IMAGES':
          return this.DATAOBJ.ROLE_IMAGES;
        case 'USER_IMAGES':
          return this.DATAOBJ.USER_IMAGES;
        case 'TEXTCOLOR':
          return this[type === 'data' ? 'DATAOBJ' : 'tmp'].TEXTCOLOR;
        case 'BACKCOLOR':
          return this[type === 'data' ? 'DATAOBJ' : 'tmp'].BACKCOLOR;
        case 'GRADATION':
          return this[type === 'data' ? 'DATAOBJ' : 'tmp'].GRADATION;
        case 'IMAGES':
          return this[type === 'data' ? 'DATAOBJ' : 'tmp'].IMAGES;
        default:
          throw new Error(`Invalid mode: ${mode}`);
      }
    },
 
 
    // ランダムで画像を返す
    imgRandom() {
      const images = [
        'boy01_cap01.gif',
        'boy05_bee01.gif',
        'boy06_ninja01.gif',
        'boy09_cat02.gif',
        'girl02_longhair01.gif',
        'girl03_spacesuit01.gif',
        'girl07_longhair02.gif',
        'girl09_witch02.gif'
      ];
      return images[(Math.random() * images.length) | 0];
    },
 
    //// 設定画面表示
    // 設定に合わせたデコレーションの付与
    // 0:非表示
    // 1:グラデーション
    // 2:キャラ
    // 3:グラデーション+キャラ
    // 4:単色背景
    // 5:単色背景+キャラ 
    getDecorationStyle(key, edit = 0) {
      // DATAOBJがundefined/空ならreturn
      if (!this.DATAOBJ.BASIC_IMAGES || Object.keys(this.DATAOBJ.BASIC_IMAGES).length === 0) return;
 
      // keyが存在しない場合、BASIC/ROLE/USERにあるkeyをnoneに変換する
      this.check2None.call(this, key.text, 'TEXTCOLOR', 'text');
      this.check2None.call(this, key.back, 'BACKCOLOR', 'back');
      this.check2None.call(this, key.gradation, 'GRADATION', 'gradation');
      this.check2None.call(this, key.img, 'IMAGES', 'img');
 
      let mode = edit ? edit : 3;
      // x_objに当てはめる
      const t_obj = this.DATAOBJ.TEXTCOLOR[key.text];
      const b_obj = this.DATAOBJ.BACKCOLOR[key.back];
      const g_obj = this.DATAOBJ.GRADATION[key.gradation];
      const i_obj = this.DATAOBJ.IMAGES[key.img];
 
 
      let text = t_obj.color;
      let back = b_obj.color;
      let gradation = g_obj.color;
      const imgcheck = i_obj.color;
      let img = imgcheck.length !== 0 ? `url('${this.images_dir}${imgcheck}')` : "";
 
      if (mode === 0) {
        return;
      }
      // グラデーションのみOFF
      if (mode === 4 || mode === 5) {
        gradation = "";
      }
      // キャラOFF
      if (mode === 1 || mode === 4) {
        img = "";
      }
      // テキスト色・背景色・グラデーションOFF
      if (mode === 2) {
        text = "";
        back = "";
        gradation = "";
      }
 
      // imgのオプション
      const dot = gradation && img ? "," : "";
 
      const g_positionX = gradation.length !== 0 ? 100 + '%' : "";
      const g_positionY = gradation.length !== 0 ? 100 + '%' : "";
      const g_sizeX = gradation.length !== 0 ? 'auto' : "";
      const g_sizeY = gradation.length !== 0 ? 'auto' : "";
      const g_repeat = gradation.length !== 0 ? 'no-repeat' : "";
 
      const i_positionX = img.length !== 0 ? i_obj.positionX + '%' : "";
      const i_positionY = img.length !== 0 ? i_obj.positionY + '%' : "";
      const i_sizeX = img.length !== 0 ? i_obj.sizeXauto ? 'auto' : i_obj.sizeX + '%' : "";
      const i_sizeY = img.length !== 0 ? i_obj.sizeYauto ? 'auto' : i_obj.sizeY + '%' : "";
      const i_repeat = img.length !== 0 ? i_obj.repeat : "";
 
 
      return {
        color: text,
        backgroundColor: back,
        backgroundImage: img + dot + gradation,
        "background-position-x": i_positionX + dot + g_positionX,
        "background-position-y": i_positionY + dot + g_positionY,
        backgroundSize: `${i_sizeX} ${i_sizeY} ${dot} ${g_sizeX} ${g_sizeY}`,
        backgroundRepeat: i_repeat + dot + g_repeat,
      }
    },
 
    // keyが存在するかチェックし、なければnoneに変更する
    check2None(key, LEVEL, mode) {
      if (!this.DATAOBJ[LEVEL][key]) {
        // BASIC_IMAGES / USER_IMAGES(Array)
        const imageKeys = ['BASIC_IMAGES', 'USER_IMAGES'];
        imageKeys.forEach(keyName => {
          this.DATAOBJ[keyName].forEach(item => {
            if (item[mode] === key) item[mode] = 'none';
          });
        });
        // ROLE_IMAGES(Obj)
        const imageKeysobj = ['ROLE_IMAGES',];
        imageKeysobj.forEach(keyName => {
          Object.values(this.DATAOBJ[keyName]).forEach(item => {
            if (item[mode] === key) item[mode] = 'none';
          });
        });
      }
    },
 
    // GRADATION IMAGES の背景スタイル
    getBackgroundStyle(Obj, mode) {
      const sizeX = Obj.sizeXauto ? 'auto' : Obj.sizeX + '%';
      const sizeY = Obj.sizeYauto ? 'auto' : Obj.sizeY + '%';
      return {
        backgroundImage: mode === 'GRADATION' ? Obj.color : `url(${this.images_dir}${Obj.color})`,
        "background-position-x": Obj.positionX + '%',
        "background-position-y": Obj.positionY + '%',
        backgroundSize: `${sizeX} ${sizeY}`,
        backgroundRepeat: Obj.repeat,
      };
    },
 
    // ファイル名を取得
    getRelative(event, mode, index) {
      const target = this.getIMAGES(mode);
      target[index].color = event.target.files[0].name; // ファイル名を取得
    },
 
    // TEXT/BACK/GRADATION/IMAGES:Objectをテンプレートから選択して追加
    SelectNewImage(mode, value, key) {
      Swal.fire({
        title: `「${value.name}」を追加する`,
        text: `テンプレート「${value.name}」を追加します。`,
        icon: "info",
        // 1番目ボタン
        confirmButtonText: "OK!",
        confirmButtonColor: "",
        // 2番目ボタン
        showDenyButton: true,
        denyButtonText: "やめる",
        denyButtonColor: "",
      }).then((result) => {
        // デコレーション：   
        if (result.isConfirmed) {
          const template = JSON.parse(JSON.stringify(this.TEMPLATEOBJ[mode][key]));
          if (!template) {
            console.error(`テンプレートが見つかりません: mode = ${mode}, key = ${key}`);
          }
          // keyがある(素材である)なら、ユニークなキーを生成
          const searchObj = this.getIMAGES(mode, 'data');
          let newKey = key;
          let index = 1;
          while (searchObj[newKey]) {
            newKey = `user${index}`;
            index++;
          }
          template.key = newKey;
          // テンプレートを追加
          const sourceArray = this.getIMAGES(mode);
          if (sourceArray.length < 50) {
            sourceArray.splice(1, 0, template);
            this.tmp_updata(); // tmp->DATAOBJへ更新
            this.snackbar.new = true; // snackbarを表示
          } else {
            this.tmp_updata(); // tmp->DATAOBJへ更新
            this.snackbar.newstop = true; // snackbarを表示 
          }
        }
      });
    },
 
    // BASIC/USER/TEXT/BACK/GRADATION/IMAGES:Objectからプロパティを削除
    clearImageArr(mode, value, index) {
      Swal.fire({
        title: `${value.name ? value.name : "#" + (index + 1)} を消去する`,
        text: "この設定を消去しますか？",
        icon: "warning",
        // 1番目ボタン
        confirmButtonText: "OK",
        confirmButtonColor: "",
        // 2番目ボタン
        showDenyButton: true,
        denyButtonColor: "",
        denyButtonText: "キャンセル",
      }).then((result) => {
        if (result.isConfirmed) {
          const sourceArray = this.getIMAGES(mode);
          sourceArray.splice(index, 1);
          this.tmp_updata(); // tmp->DATAOBJへ更新
          this.snackbar.clear = true; // snackbarを表示
        }
      });
    },
 
 
    //// コンポーネント関係
    // 子コンポーネント:テキスト色/背景色/を変更
    handleCOLOR(mode, index, type, event) {
      this.DATAOBJ[mode][index][type] = event;
    },
 
  */


// リスト表示
app.component('bannercard', {
  props: ['value',],
  data() {
    return {
      greetings: [
        { name: 'ユーザーネーム', comment: 'こんにちは！' },
        { name: 'ユーザーネーム', comment: 'こんばんは！' },
      ],
      cardStyle: {
        color: this.value['--lcv-name-color'], 
        backgroundColor: this.value['--lcv-background-color'],
        'border-radius': '20px', 
      },
      textcardStyle:{
        color: this.value['--lcv-text-color']
      }
    };
  },
  computed: {
    randomGreeting() {
      return this.greetings[Math.floor(Math.random() * this.greetings.length)];
    }
  },
  template: `
      <v-card :title="randomGreeting.name" height="120" block :style="cardStyle">
       <v-container>
        <p :style="textcardStyle">{{ randomGreeting.comment }}</p>
       </v-container>
      </v-card>
      <br>
     `
});


/*

コンポーネント

  'bannercard', {
  props: ['bannerstyle'],
  template: `
      <v-card title="ユーザーネーム" height="120" block :style="bannerstyle">
       <v-container>
        <p class="text-h6">こんにちは！</p>
       </v-container>
      </v-card>
      <br>
     `
},
  // BASIC/USER:タイトル+空のデータ追加ボタン
  'd_titlebar', {
  props: ['title'],
  emits: ['addbtn'],
  template: `
    <v-toolbar density="compact">
      <v-toolbar-title class="text-h5">{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn variant="elevated" color="primary" @click="$emit('addbtn')">
        <v-icon>mdi-plus</v-icon> 新規作成
        <v-tooltip activator="parent" location="bottom">{{ title }} に空のデータを追加します</v-tooltip>
      </v-btn>
    </v-toolbar>
    <br>
  `,
},


  // 保存:ファイルをダウンロードするボタン
  'd_downloadlink', {
  props: ['directory', 'filename'],
  template: `
     <v-card :href="filePath" target="_blank">
      <v-toolbar density="compact" variant="elevated" color="secondary">
       <v-toolbar-title class="text-h6">{{ filename }}</v-toolbar-title>
      </v-toolbar>
     </v-card>
 `,
  computed: {
    filePath() {
      return `_lib/${this.directory}/${this.filename}`;
    }
  }
},


  // 1-1_1-3:TEXTCOLORコンポーネント
  'd_textcolor', {
  props: ['target', 'colors'],
  template: `
<v-col cols="12" sm="6" md="3">
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" block>▼ 文字色 : {{ colors[target].name }}</v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(color, key) in colors" :key="key" @click="handleColorClick(key)">
        <v-list-item-title>{{ color.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</v-col>
  `,
  methods: {
    handleColorClick(key) {
      // 色が選択されたときに親コンポーネントにイベントを発行する
      this.$emit('selected', key);
    }
  }
},


  // 1-1_1-3:BACKCOLORコンポーネント
  'd_backcolor', {
  props: ['target', 'colors', 'btnstyle', 'liststyle'],
  template: `
<v-col cols="12" sm="6" md="3">
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" block :style="btnstyle">
       ▼ 背景色 : {{ colors[target].name }}
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(color, key) in colors" :key="key" @click="handleColorClick(key)" :style="{ color: liststyle, backgroundColor: color.color }">
        <v-list-item-title>{{ color.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</v-col>
  `,
  methods: {
    handleColorClick(key) {
      // 色が選択されたときに親コンポーネントにイベントを発行する
      this.$emit('selected', key);
    }
  }
},


  // 1-1_1-3:GRADATIONコンポーネント
  'd_gradation', {
  props: ['target', 'colors', 'btnstyle'],
  template: `
<v-col cols="12" sm="6" md="3">
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" block :style="btnstyle">
       ▼ グラデーション : {{ colors[target].name }}
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(color, key) in colors" :key="key" @click="handleColorClick(key)" :style="{ backgroundImage: colors[key].color, backgroundPosition: 'right', backgroundRepeat: 'no-repeat', backgroundSize: '50%' }">
        <v-list-item-title>{{ color.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</v-col>
  `,
  methods: {
    handleColorClick(key) {
      // 色が選択されたときに親コンポーネントにイベントを発行する
      this.$emit('selected', key);
    }
  }
},


  // 1-1_1-3:IMAGESコンポーネント
  'd_images', {
  props: ['target', 'colors', 'btnstyle', 'images_dir'],
  template: `
<v-col cols="12" sm="6" md="3">
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" block :style="btnstyle">
       ▼ キャラクター : {{ colors[target].name }}
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(color, key) in colors" :key="key" @click="handleColorClick(key)" :style="{ backgroundImage: 'url(' + images_dir + colors[key].color + ')', backgroundPosition: 'right', backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }">
        <v-list-item-title>{{ color.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</v-col>
  `,
  methods: {
    // 色が選択されたときに親コンポーネントにイベントを発行する
    handleColorClick(key) {
      this.$emit('selected', key);
    }
  }
},


  // 2-1_2-4:リストのtoolbarコンポーネント
  'd_list_toolbar', {
  props: ['element',],
  emits: ['clearbtn'],
  template: `
          <v-toolbar density="compact" color="transparent">
           <v-toolbar-title>
            <div class="text-h5">{{element.name}}</div>
           </v-toolbar-title>
           <template v-slot:append>
            <v-btn height="30" width="30" icon @click.stop="$emit('clearbtn')">
             <v-icon>mdi-close</v-icon>
             <v-tooltip activator="parent" location="bottom">この設定を消去</v-tooltip>
            </v-btn>
           </template>
          </v-toolbar>
     `,
},


  // 1-1_2-4:ダイアログコンポーネント
  'd_dialog_name', {
  props: ['dialogOpen', 'value'],
  data() {
    return {
      editedName: this.value.name,
      dialogOpen: false,
    };
  },
  template: `
<v-btn icon variant="text" @click="dialogOpen = true">
 <v-icon>mdi-pencil</v-icon>
 <v-tooltip activator="parent" location="bottom">名前を変更する</v-tooltip>
</v-btn>

<v-dialog v-model="dialogOpen" max-width="400">
  <v-card>
    <v-card-title>名前を編集する</v-card-title>
    <v-card-text>
      <v-text-field v-model="editedName" label="新しい名前"></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-row>
        <v-col cols="6">
          <v-btn variant="elevated" block color="primary" @click="submitName">送信</v-btn>
        </v-col>
        <v-col>
          <v-btn block @click="closeDialog">キャンセル</v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</v-dialog>
  `,
  methods: {
    submitName() {
      this.$emit('submit', this.editedName);
      this.closeDialog();
    },
    closeDialog() {
      this.dialogOpen = false;
    }
  }
},
*/

