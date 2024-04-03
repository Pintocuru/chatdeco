# 初見判定ちゃん First Counter for わんコメ v0.23

最終更新日：2024/02/23

配信者のためのコメントアプリ「わんコメ」で使用できる、テンプレート＋WordPartyです。

## このコードを利用するときは

- わんコメ(https://onecomme.com/) の利用規約に基づきます。
- わんコメの利用規約に基づき、コードに限っては商業利用も含め自由に利用することができます。
  - おみくじの一部のサンプル内容については元ネタがありますので、良識の範囲内でお使い下さい。
- このコードの使用に関連して生じた損害について一切の責任を負いません。このコードの使用は自己責任で行ってください。
- 現在はベータ版のため、コードの動作は保証しません。コードや仕様は予告なく変更される可能性があります。
- わんコメのテンプレート「flipboard」をベースに改変していますが、このテンプレに対して、わんコメのテンプレエディタは適用できません。各自でCSSファイルを改変して下さい。

## このテンプレートは何？

### 初見ありがとう!と挨拶してくれる!

- わんコメのデータを基に、**初見さんには「初見ありがとう!」を、久々の方には「久しぶり!」を、その日初めての方には「来てくれてありがとう!」の挨拶**をしてくれるBOTです。

### 同時接続数100人くらいまでの配信者にピッタリ！

- 視聴数が少なくても賑やかに！見ている人がコメントしたくなる「おみくじ機能」も搭載。
- 人が多いほどコメントが流れやすいので、同時接続数が多い配信には向かないかも…。

### おみくじ機能と多彩な演出が可能

- おみくじ機能。「おみくじ」や「じゃんけん」（ワードは変更可）とコメントすると、BOTがランダムに喋ってくれます。
- 喋るタイミングを任意に決められるので、わんコメの機能「WordParty」と組み合わせて、多彩な演出が可能です。
- わんコメの「参加型管理」で登録されると、「参加ありがとう」のコメントを返してくれます。

### 特定の人物のコメントを目立たせることも可能!

- NightbotやStreamlabsのChatbotといった、BOTのコメントを表示させたり、特定のユーザーのコメントを表示させ目立たせることができます。

### 告知がよく目立つタイマー機能

- 数分置きに視聴者にお知らせする、タイマー機能も付いています。

## 導入方法

### テンプレートをOBSに追加する

- わんコメの右上にある【…】(三点リーダー) ＞ フォルダを開く ＞ テンプレートフォルダ を選択
- customフォルダに、解答したフォルダ「FirstCounter」と「word-party_FirstCounter」を入れる
- 「FirstCounter」「word-party_FirstCounter」の両方のテンプレートをOBSに追加

### 【重要】OBSの設定・プロパティを変更する

- 追加したテンプレート「index.html」という名称から、わかりやすい名前に変更する(FirstCounter、WordParty等)
- プロパティから**「OBSで音声を制御する」と、「表示されていないときにソースをシャットダウンする」にチェック☑**を入れる
- OBSの音声ミキサーの【︙】(三点リーダー)＞「オーディオの詳細プロパティ」から、↑で変更したWordPartyの名称を探し、「音声モニタリング」の設定を「モニターと出力」に変更する
  - この設定をしていないと、**「配信者は聞こえるのに配信動画では音声が乗っていない」「タイマーやおみくじが二重三重に出てくる」「非表示にしてるのに勝手に音声が鳴る」といった不具合**が出ます。

## 使い方・カスタマイズ

### _\_user__.jsをテキストエディタで編集する

- そのままでも一応使えますが、**カスタマイズ推奨**です。
- 「FirstCounter」フォルダに入っている、「_\_user__.js」というファイルを、テキストエディターで開きます。
- testSwitch = 0; を testSwitch = 1; にすると、わんコメのコメントテスターで反応します。テスト結果を見ながら、OBSに追加したソースのプロパティを変更しましょう。(本番の際は0に戻すことを忘れずに)
- 目安としては、幅550、高さ860です(画面が1920x1080の場合)

### カスタマイズ：会話するキャラクター

- 喋らせるキャラクターのフキダシを設定できます。
- 変更できるのは、名前の色、テキスト、フキダシの色です。
  - defaultchara:標準で出てくるキャラ画像(WordPartyで出現)
  - --lcv-name-color:名前の色
  - --lcv-text-color:コメントの色
  - --lcv-background-color:フキダシの背景色

```
"ゆっくり魔理沙": { defaultchara: "!marisa01", "--lcv-name-color": "#FFE082", "--lcv-text-color": "#333333", "--lcv-background-color": "#FF8F00" },
```

- NightbotやStreamlabs、特定のユーザーのコメントを拾って表示させることもできます。

### カスタマイズ:おみくじ機能

- MODEOBJ 内で設定されているキーワードで反応します。
- デフォルトでは「omikuji」と「janken」の2つが入っています。内容はサンプルですので、自由に改変して構いません。
- コードを少し触れるなら、おみくじを3つや4つに増やすことも可能です。
- 反応するワードは、正規表現を使っています。

### カスタマイズ:フキダシの内容

- ranはメッセージの出現率です。その項目のranをすべて足した数を分母として計算しますので、ranの数値が大きいほど出やすくなります。
- chara:は喋らせるキャラクターです。カスタマイズ：会話するキャラクター に対応したフキダシを出すことができます。
- message(標準)：喋らせる内容です。変数として ${user} :ユーザー名、${tc} :コメント回数を記載できます。

```
message: `${user}さん、久しぶり!また会えたね。`,
```

- message(配列)：遅延機能を使うことで、複数の投稿や演出に対応します

```
message: [{ [`じゃんけんぽん!`]: 0 }, { [`俺の勝ち!負けは次につながるチャンスです!ネバーギブアップ!`]: 4500 },],
```

- img(標準、省略可)：WordPartyに対応した画像や動画を表示させます。省略した場合「会話するキャラクター」で設定したdefaultcharaが出現します。

```
img: "!reimu11",
```

- img(配列)：遅延機能を使うことで、複数の投稿や演出に対応します

```
img: [{ "!初見": 0 }, { "!marisa22": 1500 },],
```


### カスタマイズ:初見・久しぶり判定

- わんコメのmeta情報を参照して、初見・久しぶり・初日判定をします。
- おまけ機能として「初見」と書かれたコメントにツッコミを入れる機能もあります。（必要なければsyoken_sagi_switch を0にして下さい）
- 「初見詐欺」のオマケ機能は、予告なく削除する場合があります。

### ギフト・スパチャ対応機能
- 金額(price)以上がギフトされた場合、該当する金額以下のコメントが抽選されます。
- priceとギフト金額が近いものほど、当選しやすい仕組みです。

### カスタマイズ:参加型管理で反応させる

- 新しく参加希望が出た時、コメントを出すことができます。
- 必要がない場合、waiting_switch を0にして下さい。

### カスタマイズ:タイマー機能

- 決められた時間ごとにランダムでコメントします。
- メッセージを話す間隔 はposttime_min で変更できます。タイマー機能が必要ない場合は0にして下さい。
- 負荷対策として、1分未満の設定はできないようになってます。

## 備考：コードの改変について

- このコードは、わんコメのテンプレート「flipboard」をベースに改変をしていますが、更なる改変はもちろん歓迎しています。必要なカスタマイズを施して下さい。
- また、わんコメの利用規約に基づき、コードに限っては商業利用も含め自由に利用することができます。
  - おみくじの一部のサンプル内容については元ネタがありますので、良識の範囲内でお使い下さい。
- コードがあまり綺麗でない点はご了承ください。

## クレジット：イラストと音源について

- WordPartyで使用しています。

- ゆっくり霊夢・ゆっくり魔理沙のイラスト：凪ぽんの素材置き場
  https://nagipon-sozai.studio.site/
- 挿絵：ツカッテ
  https://tsukatte.com/
- 各種効果音：効果音ラボ
  https://soundeffect-lab.info/
- 細かい部品のほとんど：ダーヤマ TOPECONHEROES
  https://twitter.com/topeconheroes
- イラスト素材・動画・音源の再配布は禁止されています。
- イラストや音源の利用については、各配布サイトの利用規約をご確認ください。

## バージョン情報

v0.23 24/02/23

- 【重要】v0.22以前では「フキダシが表示されない」という致命的なバグがありました。これを修正しました。お手数をかけてしまい申し訳ありません。

v0.22 24/02/22

- 初見判定ちゃんがコメントした時、わんコメの他のテンプレートでアイコンを表示するように
- ギフトコメントが来ても反応しないバグを修正
- 導入方法で、音声について重要な事を書き忘れていたので追記
- 参加型管理のリスト入りの際「挑戦者が現れました」のWordPartyを追加
- 他、細かい不具合の修正

v0.21 24/02/22

- わんコメのコメントテスターで「おみくじ」や「じゃんけん」が起動しない不具合を修正
- Nightbot以外のBotや、特定のユーザーのコメントも表示できるように
- じゃんけんの文章を少し変更。マリサ キリサメの心なんて読めるわけがない、そう思ってないですか
- 他、細かい不具合の修正

v0.2 : 24/02/21 0.1から大幅な仕様変更

- キャラクターによって、名前の色やコメント色を変えられるように
- 遅延機能の追加により、メッセージ、WordPartyを複数投稿可能に
- おみくじ機能の追加
- ギフト・スパチャ対応機能の追加
- 参加型管理で反応する機能を追加
- 細かいバグ修正等

v0.1 : 24/02/02 初版

------

せすじピンとしてます @pintocuru
https://twitter.com/pintocuru
https://www.youtube.com/@pintocuru