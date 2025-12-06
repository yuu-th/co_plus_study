# チュートリアル機能

> 最終更新: 2025-12-04
> ステータス: 実装中

## 1. 概要

初回利用者に主要機能を案内するクエスト型チュートリアル。
**実際の画面上で対象要素のみを操作可能**にし、ユーザーが実際に操作することで進行する。
右側にサイドパネルで指示を表示する。

## 2. ユーザーストーリー

- 新規ユーザーとして、アプリの使い方を知りたい。初めてでも迷わず使いたいから。
- ユーザーとして、チュートリアルをスキップしたい。すぐに使い始めたいから。
- ユーザーとして、チュートリアルを後から見返したい。忘れた機能を確認したいから。

## 3. UI構成

### 3.1 全体レイアウト（チュートリアル中）

```
┌─────────────────────────────────────────────────────────┐
│  Header                                                 │
├────────┬──────────────────────────┬────────────────────┤
│ Side   │   Main Content           │ TutorialPanel     │
│ bar    │   (実際の画面)            │ (幅: 320px)       │
│        │                          │                   │
│ [対象] ← 穴あきオーバーレイ         │ ┌───────────────┐ │
│  ...   │                          │ │ ステップ表示   │ │
│        │                          │ │ タイトル       │ │
│        │                          │ │ 説明文         │ │
│        │                          │ │ 操作ヒント     │ │
│        │                          │ │ プログレス     │ │
│        │                          │ │ [スキップ]    │ │
│        │                          │ └───────────────┘ │
└────────┴──────────────────────────┴────────────────────┘
```

### 3.2 コンポーネント構成

| コンポーネント | 責務 |
|--------------|------|
| TutorialOverlay | 画面全体を覆うオーバーレイ。対象要素のみ穴を開ける |
| TutorialPanel | 右側のサイドパネル。指示・進捗を表示 |
| TutorialProvider | チュートリアル状態を管理するContext |

### 3.3 オーバーレイの仕組み

1. 画面全体を半透明オーバーレイで覆う（pointer-events: all）
2. 対象要素の位置・サイズを取得
3. 対象要素部分に「穴」を開ける（clip-path または SVG mask）
4. 対象要素にはハイライト枠を表示
5. 対象要素のみクリック/入力可能

## 4. データ構造

### TutorialStep

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | string | ✓ | ステップID |
| title | string | ✓ | タイトル（例: 「日報を書こう！」） |
| description | string | ✓ | 説明文 |
| targetSelector | string | ✓ | 対象要素のCSSセレクタ |
| action | 'click' \| 'input' \| 'navigate' | ✓ | 期待するアクション |
| route | string | | このステップで必要なルート（例: '/diary'） |
| hint | string | | 操作ヒント（例: 「👆 クリックしてね」） |

### TutorialState

| フィールド | 型 | 説明 |
|-----------|-----|------|
| isActive | boolean | チュートリアル実行中か |
| currentStepIndex | number | 現在のステップインデックス |
| isCompleted | boolean | 完了フラグ |
| isSkipped | boolean | スキップフラグ |

## 5. クエスト（ステップ）一覧

| # | ID | タイトル | 対象セレクタ | アクション | ルート | ヒント |
|---|-----|----------|-------------|-----------|--------|--------|
| 1 | step-diary-link | 日報を見てみよう | [data-tutorial="nav-diary"] | click | / | 👆 「学習日報」をクリック |
| 2 | step-diary-form | 日報を書いてみよう | [data-tutorial="diary-form"] | input | /diary | ✏️ 何か入力してみよう |
| 3 | step-archive-link | 実績を見てみよう | [data-tutorial="nav-archive"] | click | /diary | 👆 「ARCHIVE」をクリック |
| 4 | step-chat-link | 相談してみよう | [data-tutorial="nav-chat"] | click | /archive | 👆 「相談」をクリック |
| 5 | step-complete | 完了！ | (なし) | (なし) | /chat | 🎉 チュートリアル完了！ |

## 6. コンポーネント詳細

### 6.1 TutorialOverlay

**Props:**
```typescript
interface TutorialOverlayProps {
  targetSelector: string;
  onTargetAction: () => void;
  action: 'click' | 'input' | 'navigate';
}
```

**動作:**
- 対象要素の位置をリアルタイム監視
- clip-pathで穴あきオーバーレイを生成
- 対象要素のアクションを検出してコールバック

### 6.2 TutorialPanel

**Props:**
```typescript
interface TutorialPanelProps {
  step: TutorialStep;
  currentIndex: number;
  totalSteps: number;
  onSkip: () => void;
}
```

**表示内容:**
- ステップ番号（例: 1/5）
- タイトル
- 説明文
- 操作ヒント（アニメーション付き）
- プログレスバー
- スキップボタン

### 6.3 TutorialProvider

**Context値:**
```typescript
interface TutorialContextValue {
  state: TutorialState;
  currentStep: TutorialStep | null;
  startTutorial: () => void;
  nextStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  resetTutorial: () => void;
}
```

## 7. 実装場所

| ファイル | 説明 |
|---------|------|
| components/tutorial/TutorialOverlay.tsx | 穴あきオーバーレイ |
| components/tutorial/TutorialPanel.tsx | 右サイドパネル |
| components/tutorial/TutorialProvider.tsx | Context Provider |
| components/tutorial/ProgressBar.tsx | 進捗バー（既存） |
| hooks/useTutorial.ts | フック（既存・修正） |

## 8. 対象要素へのマーキング

各画面に `data-tutorial` 属性を付与:

```tsx
// Sidebar.tsx
<Link data-tutorial="nav-diary" to="/diary">学習日報</Link>
<Link data-tutorial="nav-archive" to="/archive">ARCHIVE</Link>
<Link data-tutorial="nav-chat" to="/chat">相談</Link>

// DiaryPostForm.tsx
<form data-tutorial="diary-form">...</form>

// ChatInput.tsx
<div data-tutorial="chat-input">...</div>
```

## 9. ルート遷移の対応

チュートリアルはページ遷移をまたいで進行する:
1. TutorialProviderをApp.tsxでラップ
2. 各ステップで必要なrouteが定義されている場合、自動遷移
3. 遷移後、対象要素が見つかるまで待機

## 10. アクセシビリティ

- オーバーレイは `aria-hidden="true"`
- パネルは `role="complementary"` + `aria-label`
- ESCキーでスキップ確認
- Tab移動はパネル内のみ（フォーカストラップ不要、対象要素は操作可能）

## 11. 変更履歴

| 日付 | 変更内容 |
|------|----------|
| 2025-11-25 | 初版作成 |
| 2025-12-04 | サイドパネル + 穴あきオーバーレイ方式に変更 |
