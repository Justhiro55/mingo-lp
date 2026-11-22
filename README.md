# mingo-lp

mingo（走るたび、フラミンゴが色づくアプリ）の紹介ページです。

## 見る

ビルドは要りません。`index.html` をブラウザで開くか、このフォルダを静的サーバーで配信します。

```sh
python3 -m http.server 8000   # http://localhost:8000
```

GitHub Pages で公開するときは、Settings → Pages で `main` ブランチのルートを選びます。

## 構成

| ファイル | 中身 |
|---|---|
| `index.html` | ページの本文 |
| `css/style.css` | 見た目。色はアプリと同じ（背景 #F5FCF5、コーラル #FF737D、ミント #45D6A6） |
| `js/main.js` | ロゴの動き、色えらび、地図のスクロール、羽根のコレクション |
| `assets/` | ロゴの部品、キービジュアル、アプリの画面、紹介動画 |

## デザインの決めごと

- **主役は「えらんだ色」。** 色をえらぶと、フラミンゴ、地図の道、手順の数字がその色に変わります。
- **絵はアプリと同じ。** フラミンゴと羽根は、アプリの絵（SVGの線と色の決め方）をそのまま使っています。ロゴの動きも、アプリの起動画面と同じ時間とばねです。
- **動きは3か所だけ。** はじめのロゴ、スクロールで歩く地図、ふれてひらく羽根。ほかは動かしません。
- **色の上の文字は濃い色。** コーラルの上に白い文字は読みにくいためです。
- **動きを減らす設定**（prefers-reduced-motion）では、自動の動きを止めます。キーボードだけでも操作できます。

## 参考

- Apple Human Interface Guidelines（アクセシビリティ、カラー）
- anthropics/skills の frontend-design
- heydamir/unslop（CC BY 4.0）
- フォント：Zen Maru Gothic（SIL Open Font License、Google Fonts から読み込み）
