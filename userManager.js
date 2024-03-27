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
 
 // noneなら空白にする
 const text = TEXTCOLOR[DECO.text].color;
 const back = BACKCOLOR[DECO.back].color;
 const gradation = GRADATION[DECO.gradation].color;
 const imgcheck = IMAGES[key.img].color;
 const img = imgcheck.length !== 0 ? `url('${imgcheck}')` : "";
 const dot = gradation && img ? "," : "";

 return {
  "--lcv-comment-shadow": "none",
  "--lcv-text-color": text,
  "--lcv-background-color": back,
  backgroundImage: `${img}${dot}${gradation}`,
  backgroundPosition: "right",
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
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