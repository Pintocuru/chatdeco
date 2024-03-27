////////////////////////////////////////////////////////////
// チャットデコレーション! Chat Decoration! for わんコメ v0.3 240325
////////////////////////////////////////////////////////////
/*
使い方:
#deco または#1(数値) で、このチャットにデコレーションができます。
*/

// userData.js から読み込む
const preferences = __USER__DATAOBJ.preferences;
const BASIC_IMAGES = __USER__DATAOBJ.BASIC_IMAGES
const ROLE_IMAGES = __USER__DATAOBJ.ROLE_IMAGES
const USER_IMAGES = __USER__DATAOBJ.USER_IMAGES
const TEXTCOLOR = __USER__DATAOBJ.TEXTCOLOR
const BACKCOLOR = __USER__DATAOBJ.BACKCOLOR
const GRADATION = __USER__DATAOBJ.GRADATION
const IMAGES = __USER__DATAOBJ.IMAGES

// 画像ディレクトリ
const url = new URL(document.URL);
const directory = url.pathname.substring(0, url.pathname.lastIndexOf('/'));
const images_dir = `${directory}./img/`;


// #decoでデコレーションできる権限(0:だれでも 1:メンバー以上 2:モデレーター以上 3:配信者のみ 4:!deco機能OFF)
const Userlevel = preferences.Userlevel;

// チャットした全員にデフォルトでデコを付与する(0:OFF 1:ON 2:毎回ランダムにする)
const defaultALLdeco = preferences.defaultALLdeco;

// アナウンスを有効にするか(デコレーションした時に告知が入ります)
// 0:OFF 1:最初のアナウンスのみ 2:ON
const enableAnnounce = preferences.enableAnnounce;



// デコレーションセット
function deco_data(mode, index) {
 // IMAGESデータ呼び出し
 const DECO = getIMAGES(mode)[index]
 // 番外を呼び出そうとしたときはreturn
 if (DECO === undefined) return;
 
 // x_objに当てはめる
 const t_obj = TEXTCOLOR[DECO.text];
 const b_obj = BACKCOLOR[DECO.back];
 const g_obj = GRADATION[DECO.gradation];
 const i_obj = IMAGES[DECO.img];

 let text = t_obj.color;
 let back = b_obj.color;
 let gradation = g_obj.color;
 const imgcheck = i_obj.color;
 let img = imgcheck.length !== 0 ? `url('${images_dir}${imgcheck}')` : "";

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
  "--lcv-comment-shadow": "none",
  "--lcv-text-color": text,
  "--lcv-background-color": back,
  backgroundImage: img + dot + gradation,
  "background-position-x": i_positionX + dot + g_positionX,
  "background-position-y": i_positionY + dot + g_positionY,
  backgroundSize: `${i_sizeX} ${i_sizeY} ${dot} ${g_sizeX} ${g_sizeY}`,
  backgroundRepeat: i_repeat + dot + g_repeat,
 }
}


function getIMAGES(mode) {
 switch (mode) {
  case 'BASIC_IMAGES':
   return BASIC_IMAGES;
  case 'ROLE_IMAGES':
   return ROLE_IMAGES;
  case 'USER_IMAGES':
   return USER_IMAGES;
  default:
   throw new Error(`Invalid mode: ${mode}`);
 }
}