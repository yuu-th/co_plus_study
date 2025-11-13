# プロジェクトセットアップ手順

## 前提条件
- Node.js 18.x 以上がインストールされていること
- npm または yarn がインストールされていること

## セットアップ手順

### 1. Viteプロジェクトの作成

以下のコマンドを実行してください（**ユーザーが実行**）:

```bash
npm create vite@latest frontend -- --template react-ts
```

プロンプトが表示されたら:
- Project name: `frontend`
- Select a framework: `React`
- Select a variant: `TypeScript`

### 2. プロジェクトディレクトリへ移動

```bash
cd frontend
```

### 3. 依存パッケージのインストール

```bash
npm install
```

### 4. 追加パッケージのインストール

```bash
npm install react-router-dom
npm install react-icons
npm install --save-dev @types/node
```

### 5. 開発サーバーの起動確認

```bash
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスして、デフォルトのVite画面が表示されることを確認してください。

確認後、`Ctrl+C` でサーバーを停止してください。

---

## セットアップ完了後の作業

ここから先は**自動実装**で進めます。

以下のファイル・ディレクトリを作成します:

### フォルダ構造
```
frontend/src/
├── assets/
├── components/
│   ├── common/
│   ├── layout/
│   ├── archive/
│   ├── diary/
│   ├── chat/
│   ├── tutorial/
│   └── survey/
├── pages/
├── contexts/
├── hooks/
├── utils/
├── types/
├── mockData/
└── styles/
```

### 実装順序
1. ✅ フォルダ構造作成
2. ✅ CSS変数とグローバルスタイル
3. ✅ 型定義ファイル
4. ✅ モックデータ
5. ✅ ルーティング設定
6. ✅ レイアウトコンポーネント（Layout, Sidebar）
7. ✅ 共通コンポーネント（Button, Card, Badge）
8. ✅ ARCHIVEページコンポーネント
9. ✅ ARCHIVEページ実装
10. その他のページ（DiaryPage, ChatPage等）

---

## ユーザーが実行するコマンドまとめ

```bash
# 1. Viteプロジェクト作成
npm create vite@latest frontend -- --template react-ts

# 2. ディレクトリ移動
cd frontend

# 3. 依存パッケージインストール
npm install

# 4. 追加パッケージインストール
npm install react-router-dom react-icons
npm install --save-dev @types/node

# 5. 開発サーバー起動（確認用）
npm run dev
# → Ctrl+C で停止

# 以降は自動実装が進みます
```

---

## 実装完了後の起動方法

すべての実装が完了したら、再度以下のコマンドで開発サーバーを起動してください:

```bash
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスすると、実装したアプリケーションが表示されます。
