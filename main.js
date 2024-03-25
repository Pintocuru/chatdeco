const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// jsonデータ保存フラグ
let saveflag = false;
let DATAOBJ = {};



app.on('ready', () => {
 // ファイルを読み込む
 const filePath = path.join(__dirname, '_lib', '__user__.json');
 try {
  DATAOBJ = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log("'__user__.json を読み込んだよ。");
 } catch (error) {
  console.error('__user__.jsonを読み込めませんでした。プリセットデータを読み込みます。');
 }
});

// GUIの形状を指定
const createWindow = () => {
 const win = new BrowserWindow({
  width: 1000,
  height: 760,
  webPreferences: {
   nodeIntegration: false,
   contextIsolation: true, // レンダラー側からNode.jsへの直接のアクセスを制限する
   preload: path.join(__dirname, 'preload.js'),
  }
 })
 // Vue.js アプリケーションの読み込み
 win.loadFile('main.html');

 // Vue.js アプリケーション内で Electron モジュールへのアクセスを提供
 win.webContents.on('did-finish-load', () => {
  win.webContents.send('electron-ready');
 });
}

// GUI生成
app.whenReady().then(() => {
 createWindow()
 app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
   createWindow()
  }
 })
})
// ウィンドウを閉じたらアプリを終了させる
app.on('window-all-closed', () => {
 // __user__.jsonにデータを書き込む
 write__user__(() => {
  // 実行後、アプリを終了する
  clearInterval(savetimer);
  app.quit();
 });
})


// タイマーの処理
const savetimer = setInterval(() => {
 // 実行するならfalseに戻す
 if (!saveflag) return
 saveflag = false
 // __user__.jsonにデータを書き込む
 write__user__();
}, 10000);

// __user__.jsonにデータを書き込む
function write__user__() {
 const userJsonPath = path.join(__dirname, './_lib/__user__.json');
 fs.writeFile(userJsonPath, JSON.stringify(DATAOBJ, null, 2), (err) => {
  if (err) {
   console.error('Error writing to __user__.json:', err);
   return;
  }
  console.log('__user__.jsonにデータを書き込みました。');
 });
};


// DATAOBJをVuetifyに送る
ipcMain.handle('getDATAOBJ', () => {
 return DATAOBJ
});


// 読み込み:Vuetify側で読んだjsonファイルの中身を返す
ipcMain.handle('jsonfile_readme', (event, filePath) => {
 try {
  // ファイルの内容を同期的に読み込む
  const data = fs.readFileSync(filePath, 'utf-8');
  return data; // ファイル内容を返す
 } catch (error) {
  console.error('Error reading fileなの:', error);
  return null;
 }
});


// saveflagフラグを拾う
ipcMain.handle('objsaveflag', (event, boolean, obj) => {
 // DATAOBJが更新されたら、フラグを立てる
 saveflag = boolean;
 DATAOBJ = JSON.parse(obj);
});



// テンプレートファイル書き出し
ipcMain.handle('makeTemplate', async (event, temp) => {
 // __user__.jsonにデータを書き込む
 write__user__();

 // _libからファイルをコピー
 const sourceFolder = path.join(__dirname, '_lib', `${temp}_deco`);
 const files = ['index.html', 'style.css', 'thumb.png'];
 const destinationFolder = process.cwd();
 let flag = false; // 上書き確認フラグ
 for (const file of files) {
  const sourceFile = path.join(sourceFolder, file);
  const destinationFile = path.join(destinationFolder, file);
  if (!flag && fs.existsSync(destinationFile)) {
   const confirm = dialog.showMessageBoxSync({
    type: 'question',
    buttons: ['Yes', 'No'],
    defaultId: 0, // デフォルトで選択されるボタンのインデックス (0: Yes, 1: No)
    title: 'ファイルの上書き確認',
    message: `${file} が既に存在します。上書きしますか？`,
   });
   if (confirm === 1) {
    // 「No」が選択された場合は中止
    console.log('コピーを中止しました。');
    return;
   }
   // 保存フラグ
   flag = true;
  }
  fs.copyFileSync(sourceFile, destinationFile);
  console.log(`${file} をコピーしました。`);
 }
 // __user__.jsにデータを書き込む
 const jsonSource = path.join(__dirname, 'userData.js');
 fs.writeFile(jsonSource, 'const DATAOBJ =' + JSON.stringify(DATAOBJ, null, 2), (err) => {
  if (err) {
   console.error('Error writing to userData.js:', err);
   return;
  }
 console.log(`__user__.js を保存しました。`);
 });
});







// ファイルの相対パスを返す
ipcMain.handle('getRelative', (event, filepath) => {
 // 画像ファイルの相対パスを取得
 const appPath = app.getAppPath();
 return path.relative(appPath, filepath);
});




function getfilename(prefix, fileName) {
 // ファイル名組み立て
 const folderPath = path.join(__dirname, './img');
 // ファイル名の候補を取得
 const fileCandidates = files.filter(file => file.startsWith(prefix));

 // 候補が存在する場合   + path.extname(fileName)
 if (fileCandidates.length > 0) {
  // ファイル名候補をループ
  for (let i = 1; i < fileCandidates.length + 1; i++) {
   const candidate = fileCandidates[i];
   const filePath = path.join(folderPath, candidate);

   // ファイルが存在する場合
   if (fs.existsSync(filePath)) {
    // ファイル名を返却
    return candidate;
   }
  }
 }

 // ファイルが見つからなかった場合
 return null;

}
