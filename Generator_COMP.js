





// draggable用
app.component(
 'draggable', draggable,
),


 // リスト表示
 app.component('grid_v-card', {
  props: ['select'],
  emits: ['dialogbtn'],
  template: `
    <v-col :cols="Pattern.cols" :sm="Pattern.sm" :md="Pattern.md" :lg="Pattern.lg">
     <v-card :height="Pattern.height" @click="$emit('dialogbtn')">
      <slot></slot>
     </v-card>
    </v-col>
  `,
  computed: {
   Pattern() {
    return this[this.select];
   }
  },
  data() {
   return {
    pattern1: { name: "pattern1", cols: 12, sm: 12, md: 12, lg: 6, height: 50, icon: "mdi-view-list" },
    pattern2: { name: "pattern2", cols: 12, sm: 6, md: 4, lg: 3, height: 100, icon: "mdi-view-grid" },
    pattern3: { name: "pattern3", cols: 4, sm: 3, md: 2, lg: 1, height: 100, icon: "mdi-view-module" },
   };
  },
 })




// マウント
app.use(vuetify).mount('#app');