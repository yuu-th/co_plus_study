# チュートリアル機能

> 最終更新: 2025-11-25
> ステータス: 未実装

## 1. 概要

初回利用者に主要機能を案内するクエスト型チュートリアル。モーダルとハイライトを組み合わせ、進捗を視覚化する。

## 2. ユーザーストーリー

- 新規ユーザーとして、アプリの使い方を知りたい。初めてでも迷わず使いたいから。
- ユーザーとして、チュートリアルをスキップしたい。すぐに使い始めたいから。
- ユーザーとして、チュートリアルを後から見返したい。忘れた機能を確認したいから。

## 3. データ構造

### Quest

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | string | ✓ | クエストID |
| title | string | ✓ | クエストタイトル |
| description | string | ✓ | 説明文 |
| targetElement | string | | ハイライト対象のCSSセレクタ |
| targetDescription | string | | 対象要素の説明 |
| step | number | ✓ | 現在のステップ番号 |
| totalSteps | number | ✓ | 全ステップ数 |
| isCompleted | boolean | ✓ | 完了フラグ |
| action | QuestAction | | 期待するアクション |

### QuestAction

```typescript
type QuestAction = 'click' | 'input' | 'navigate';
```

### TutorialProgress

| フィールド | 型 | 説明 |
|-----------|-----|------|
| currentStep | number | 現在のステップ |
| totalSteps | number | 全ステップ数 |
| completedQuests | string[] | 完了済みクエストID |
| isSkipped | boolean | スキップフラグ |
| isCompleted | boolean | 全完了フラグ |

## 4. コンポーネント

| 名前 | 責務 | 配置 |
|------|------|------|
| TutorialModal | チュートリアル説明モーダル | features/tutorial/components/ |
| ProgressBar | 進捗バー | features/tutorial/components/ |
| Highlight | 要素ハイライト | features/tutorial/components/ |

## 5. 画面仕様

### TutorialModal
- 中央表示のモーダル
- タイトル、説明文、進捗バー
- 「次へ」「スキップ」「完了」ボタン
- ESCでスキップ確認ダイアログ

### ProgressBar
- 水平バー、完了部分を色付け
- 「○件中△件完了」ラベル（オプション）

### Highlight
- 対象要素の周囲を半透明オーバーレイで囲む
- 対象要素のみ明るく表示
- ツールチップで説明を表示

## 6. クエスト一覧

| # | タイトル | 説明 | 対象 |
|---|----------|------|------|
| 1 | 初めての日報を投稿しよう | 学習内容を記録する方法を学ぼう | DiaryPostForm |
| 2 | ARCHIVEを見てみよう | 学習の記録を振り返ろう | サイドバー ARCHIVE |
| 3 | メンターに相談してみよう | 困ったことを相談しよう | ChatInput |
| 4 | バッジを確認しよう | 獲得したバッジを見よう | BadgeCard |
| 5 | 完了！ | 全クエスト達成おめでとう！ | - |

## 7. フック

### useTutorial

```typescript
interface UseTutorialReturn {
  progress: TutorialProgress;
  currentQuest: Quest | null;
  isActive: boolean;
  startTutorial: () => void;
  nextStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  resetTutorial: () => void;
}
```

## 8. 表示トリガー

- 初回ログイン時に自動開始
- 設定画面から手動で再開可能
- スキップ状態はローカルステートで管理（永続化なし）

## 9. アクセシビリティ

- フォーカストラップ（モーダル内でTab循環）
- ESCでスキップ確認
- ハイライト対象に明確な説明
- キーボードでの進行操作

## 10. 関連

- → specs/shared/components.md（Modalコンポーネント仕様）

## 11. 変更履歴

| 日付 | 変更内容 |
|------|----------|
| 2025-11-25 | 初版作成 |
