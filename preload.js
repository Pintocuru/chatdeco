const { contextBridge, ipcRenderer } = require('electron');

// API設定
contextBridge.exposeInMainWorld('electron', {

 // メインプロセスからのデータを受け取り、ブラウザ側に渡す
 getDATAOBJ: () => {
  return ipcRenderer.invoke('getDATAOBJ');
 },

 // 読み込み:Vuetify側で読んだjsonファイルの中身を返す
 jsonfile_readme: async (filePath) => {
  try {
   const fileContents = await ipcRenderer.invoke('jsonfile_readme', filePath.path);
   return fileContents;
  } catch (error) {
   console.error('Error reading fileですわ:', error);
   return null;
  }
 },



 initData: async () => {
  try {
   // JSONファイルの読み込み
   const filePath = path.join(__dirname, '_lib', '__user__.json');
   const data = fs.readFileSync(filePath, 'utf-8');
   return JSON.parse(data);
  } catch (error) {
   console.error('__user__.jsonを読み込めませんでした。プリセットデータを読み込みます。');
   return null;
  }
 },
 // objsaveflag
 objsaveflag: async (boolean, obj) => ipcRenderer.invoke('objsaveflag', boolean, obj),

  // 相対パスをgetする
 getRelative: async (filepath) => {
  try {
   return await ipcRenderer.invoke('getRelative', filepath);
  } catch (err) {
   console.error(err);
  }
 },

 // JSONを基に__user__.js作成と各テンプレートをコピー
 makeTemplate: async (temp) => {
  try {
   const response = await ipcRenderer.invoke('makeTemplate',temp);
   return response;
  } catch (error) {
   console.error('Error invoking makeTemplate:', error);
   throw error;
  }
 },



});
