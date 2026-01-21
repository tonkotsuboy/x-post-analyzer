# X Post Analyzer

X（Twitter）の投稿を分析し、レコメンデーションアルゴリズムに基づいたスコアリングと改善提案を提供するWebアプリケーションです。

🔗 **Live Demo**: [https://x.kano.codes/](https://x.kano.codes/)

## 特徴

- **投稿分析**: Xの実際のレコメンデーションアルゴリズムに基づいた詳細なスコアリング
- **改善提案**: AIによる具体的な改善提案と最適化された投稿例の生成
- **多言語対応**: 日本語・英語の両言語をサポート
- **サンプル画像**: 実際の投稿例を確認できるギャラリー機能
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップに最適化

## スコアリング指標

### Tier 1（エンゲージメント）
- リプライ、リツイート、いいね、引用の可能性

### Tier 2（滞在時間）
- 滞在時間、クリック、画像展開、動画再生など

### Tier 3（プロフィール連携）
- プロフィールクリック、フォロー、シェアなど

### ペナルティ
- 興味なし、ミュート、ブロック、報告リスク

## 技術スタック

- **フレームワーク**: Next.js 16.1.4（App Router）
- **言語**: TypeScript
- **UIライブラリ**: Mantine UI 8.3
- **AI**: Google Generative AI（Gemini）
- **国際化**: next-intl
- **スタイリング**: CSS Modules + PostCSS
- **コード品質**: ESLint + knip

## セットアップ

### 必要な環境

- Node.js 20以上
- npm

### インストール

```bash
npm install
```

### 環境変数

`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```bash
# Gemini API Key
GEMINI_API_KEY=your_api_key_here

# Base URL（本番環境）
NEXT_PUBLIC_BASE_URL=https://x.kano.codes
```

`.env.example`を参考にしてください。

### 開発サーバー起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開いてください。

## スクリプト

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start

# ESLint実行
npm run lint

# 未使用コード検出
npm run knip
```

## プロジェクト構成

```
.
├── app/              # Next.js App Router
│   └── [locale]/     # 多言語対応ページ
├── components/       # Reactコンポーネント
├── lib/              # ユーティリティ関数・型定義
├── messages/         # 国際化メッセージ
├── public/           # 静的ファイル
│   └── samples/      # サンプル画像
└── i18n/             # 国際化設定
```

## ライセンス

MIT

## 作者

Takeshi Kano ([@tonkotsuboy_com](https://x.com/tonkotsuboy_com))
