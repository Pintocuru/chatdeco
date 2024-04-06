





// draggable用
app.component(
  'draggable', draggable,
),


  // 各ページのタイトルバー
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




// リスト表示
app.component('grid_v-card', {
  props: ['select', 'character'],
  data() {
    return {
      pattern: {
        pattern1: { name: "pattern1", cols: 12, sm: 12, md: 12, lg: 6, height: 50, icon: "mdi-view-list" },
        pattern2: { name: "pattern2", cols: 12, sm: 6, md: 4, lg: 3, height: 100, icon: "mdi-view-grid" },
        pattern3: { name: "pattern3", cols: 4, sm: 3, md: 2, lg: 1, height: 100, icon: "mdi-view-module" },
      },
    };
  },
  computed: {
    Pattern() {
      return this.pattern[this.select];
    },
    cardStyle() {
      return {
        color: this.character['--lcv-text-color'],
        backgroundColor: this.character['--lcv-background-color']
      };
    },
  },
  template: `
    <v-col :cols="Pattern.cols" :sm="Pattern.sm" :md="Pattern.md" :lg="Pattern.lg">
     <v-card :height="Pattern.height" :style="cardStyle">
      <slot></slot>
     </v-card>
    </v-col>
  `,
})




// フキダシテスト表示
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
      textcardStyle: {
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



// カラーテキストとダイアログ表示
app.component('color_choose', {
  props: ['color', 'colorname'],
  data() {
    return {
      dialog: false,
      selectedColor: this.color
    };
  },
  methods: {
    // OK:親へEmitで送信
    confirmColor() {
      this.$emit('color-selected', this.selectedColor);
      this.dialog = false;
    },
    // キャンセル
    cancelColor() {
      this.dialog = false;
    }
  },
  template: `
  <v-dialog v-model="dialog" max-width="500px">
    <template v-slot:activator="{ on }">
    <v-row>
    <v-col>
     <v-text-field v-model="color" :label="colorname"></v-text-field>
    </v-col>
     <v-col cols="auto">
      <v-btn icon :color="color" v-on:click="dialog = !dialog">
       <v-icon>mdi-palette</v-icon>
       <v-tooltip activator="parent" location="bottom">{{colorname}}を変更する</v-tooltip>
      </v-btn>
     </v-col>
    </v-row>
    </template>
    <v-card>
      <v-card-title>{{colorname}}を変更する</v-card-title>
      <v-card-text>
        <v-color-picker show-swatches v-model="selectedColor" />
      </v-card-text>
      <v-card-actions>
      <v-row>
       <v-col cols="6">
        <v-btn block variant="flat" color="primary" @click="confirmColor">OK</v-btn>
      </v-col>
       <v-col cols="6">
        <v-btn block @click="cancelColor">Cancel</v-btn>
      </v-col>
    </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
     `
});




// マウント
app.use(vuetify).mount('#app');