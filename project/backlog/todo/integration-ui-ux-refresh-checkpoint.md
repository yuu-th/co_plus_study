---
id: integration-ui-ux-refresh-checkpoint
feature: shared
depends_on:
  - design-spec-home-improvements
  - design-spec-diary-improvements
  - design-spec-chat-improvements
  - design-spec-archive-improvements
  - design-spec-survey-improvements
  - ui-header-notification-integration
  - ui-header-logo-profile-nav
  - ui-diary-time-input-improvements
  - ui-archive-calendar-improvements
  - ui-chat-message-identification-improvements
  - ui-survey-star-rating-improvements
  - ui-account-registration-page
  - types-update-diary-chat-archive-survey
  - mentor-types-and-routes
scope_files:
  - frontend/src/
  - specs/
forbidden_files: []
created_at: 2025-11-27
---

# タスク: UI/UX改善統合チェックポイント

> このファイルはサブエージェントへの作業指示書です。

## 0. 最初に必ず読むファイル（スキップ禁止）

| 順序 | ファイル | 読む目的 |
|------|----------|----------|
| 1 | `specs/overview.md` | システム全体像 |
| 2 | `specs/shared/conventions.md` | コーディング規約 |
| 3 | `project/backlog/todo/` | 完了したタスク一覧 |

## 1. タスク概要

UI/UX改善の全タスク完了後、統合検証を実施するチェックポイント。
以下を確認：

1. **ビジュアル統一性** - カラー、フォント、間隔の一貫性
2. **TypeScript エラー** - 型定義の整合性
3. **ルーティング** - 全ページへのナビゲーション動作
4. **レスポンシブ** - モバイル～デスクトップ対応
5. **アクセシビリティ** - WCAG 基準への適合

## 2. 完了条件

- [ ] TypeScript コンパイルエラーなし
- [ ] ESLint エラーなし
- [ ] すべてのページがレンダリング可能
- [ ] ナビゲーション全て正常
- [ ] 色・フォント・間隔が specs に基づいている
- [ ] モバイルで見切れがない
- [ ] ARIA 属性が適切に配置

## 3. チェックリスト

### 3.1 ホーム画面
- [ ] ロゴクリック → ホームに遷移
- [ ] ユーザー名クリック → プロフィール画面に遷移
- [ ] ベルアイコン表示（未読バッジ付き）
- [ ] 表現が「～してみよう！」等でカジュアル

### 3.2 学習日報
- [ ] 時間入力が h:mm 形式
- [ ] 表示が「XXX時間YY分」
- [ ] メンター側のみリアクション表示
- [ ] ユーザー側は◎表示
- [ ] フィルターに「数学」「その他」含まれる

### 3.3 実績（ARCHIVE）
- [ ] ページタイトルが「実績」
- [ ] 曜日が日本語（日月火水木金土）
- [ ] 土日が色分け（土=青、日=赤）
- [ ] 活動日がグレー/黄色で区別
- [ ] 連続日が視覚的に繋がって見える
- [ ] 累計日数が表示される
- [ ] バッジに達成ゲージ表示

### 3.4 相談チャット
- [ ] メッセージの左右配置が明確
- [ ] アイコンが配置されている
- [ ] 背景色が十分コントラスト
- [ ] 名前・時刻が見やすい位置に配置

### 3.5 アンケート
- [ ] タイトルが明確
- [ ] 星評価が☆アイコン表示
- [ ] ホバーでプレビュー表示
- [ ] 送信ボタンが大きく、見やすい

### 3.6 プロフィール
- [ ] ユーザー名、フリガナが表示
- [ ] 統計情報が表示
- [ ] 戻るボタンで ホームに遷移

### 3.7 アカウント登録
- [ ] フォーム入力が可能
- [ ] バリデーション表示
- [ ] 登録後ホームに遷移

### 3.8 CSS 変数
- [ ] すべて `--color-*`, `--spacing-*` を使用
- [ ] ハードコードなし

## 4. 検証手順

### 4.1 TypeScript
```bash
cd frontend
npm run build
```
→ エラーなし

### 4.2 ESLint
```bash
npm run lint
```
→ エラーなし（警告は許容）

### 4.3 ビジュアル確認
- [ ] ブラウザで全ページを開く
- [ ] 各ページの UI が仕様と一致
- [ ] カラーが specs/shared/colors.md と一致

### 4.4 レスポンシブ
- [ ] DevTools で 375px（モバイル）確認
- [ ] 768px（タブレット）確認
- [ ] 1920px（デスクトップ）確認
- [ ] 見切れやレイアウト崩れなし

### 4.5 ナビゲーション
- [ ] 全ページ間を移動可能
- [ ] ルートが正しく設定されている
- [ ] リンク切れなし

## 5. 問題発見時の手順

以下の場合は該当するタスクを修正:

1. **TypeScript エラー** → 該当タスクのコンポーネント・型定義を確認
2. **ビジュアル相違** → CSS モジュール、CSS 変数を確認
3. **ナビゲーション問題** → router.tsx を確認
4. **レスポンシブ問題** → CSS モジュールのメディアクエリを確認

## 6. 未実装項目の記録

以下は「段階2」以降で実装予定（メモとして記録）:

- [ ] メンター側ダッシュボード画面
- [ ] メンター側学生一覧画面
- [ ] メンター側学生詳細画面
- [ ] メンター側お知らせ管理画面
- [ ] 画像送信機能（チャット）
- [ ] リアクション機能（チャット、日報）
- [ ] バックエンド連携

## 7. 完了報告

```markdown
## 完了報告

### タスクID
integration-ui-ux-refresh-checkpoint

### 検証項目
- TypeScript コンパイル: ✓
- ESLint: ✓
- ビジュアル統一性: ✓
- ナビゲーション: ✓
- レスポンシブ: ✓
- アクセシビリティ: ✓

### 問題点
- （なし、または具体的に記載）

### 未実装
- メンター側画面（段階2予定）
- 画像送信機能（段階2予定）
- バックエンド連携（段階3予定）

### 次のステップ
- メンター機能の実装開始
- バックエンド API 設計
- ユーザー認証の実装
```
