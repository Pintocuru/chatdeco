////////////////////////////////////////////////////////////
// チャットデコレーション! Chat Decoration! for わんコメ v0.3 240325
////////////////////////////////////////////////////////////
/*
使い方:
#deco または#1(数値) で、このチャットにデコレーションができます。
*/


// #decoでデコレーションできる権限(0:だれでも 1:メンバー以上 2:モデレーター以上 3:配信者のみ 4:!deco機能OFF)
const Userlevel = DATAOBJ.preferences.Userlevel;

// チャットした全員にデフォルトでデコを付与する(0:OFF 1:ON 2:毎回ランダムにする)
const defaultALLdeco = DATAOBJ.preferences.defaultALLdeco;

// アナウンスを有効にするか(デコレーションした時に告知が入ります)
// 0:OFF 1:最初のアナウンスのみ 2:ON
const enableAnnounce = DATAOBJ.preferences.enableAnnounce;

// 画像ディレクトリ
const url = new URL(document.URL);
const directory = url.pathname.substring(0, url.pathname.lastIndexOf('/'));
const images_dir = `${directory}./`;

// #deco
const BASIC_IMAGES = DATAOBJ.BASIC_IMAGES
const ROLE_IMAGES = DATAOBJ.ROLE_IMAGES
const USER_IMAGES = DATAOBJ.USER_IMAGES
const TEXTCOLOR = DATAOBJ.TEXTCOLOR
const BACKCOLOR = DATAOBJ.BACKCOLOR
const GRADATION = DATAOBJ.GRADATION
const IMAGES = DATAOBJ.IMAGES


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
   return DATAOBJ.BASIC_IMAGES;
  case 'ROLE_IMAGES':
   return DATAOBJ.ROLE_IMAGES;
  case 'USER_IMAGES':
   return DATAOBJ.USER_IMAGES;
  default:
   throw new Error(`Invalid mode: ${mode}`);
 }
}