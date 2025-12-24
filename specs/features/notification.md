# お知らせ機能

> 最終更新: 2025-12-25
> ステータス: 実装完了

## 1. 概要

メンターからの重要なお知らせをインタラクティブに表示。カテゴリ別色分け、未読バッジ、詳細モーダルで視認性を高める。

## 2. ユーザーストーリー

- 生徒として、重要なお知らせを見逃したくない。イベント情報を把握したいから。
- 生徒として、未読のお知らせがあることを知りたい。新着を確認したいから。
- メンターとして、生徒にお知らせを配信したい。情報を伝達したいから。

## 3. データ構造

> **SSoT**: `project/decisions/005-backend-integration-preparation.md`
> 
> 関連テーブル: `notifications`, `user_notifications`
> 型定義: `frontend/src/shared/types/notification.ts`

### NotificationCategory

```typescript
type NotificationCategory = 'info' | 'event' | 'important';
```

| カテゴリ | 用途 | 色 |
|----------|------|-----|
| info | 一般的なお知らせ | 青 #2196F3 |
| event | イベント告知 | 緑 #4CAF50 |
| important | 重要な通知 | 赤 #F44336 |

### NotificationPriority

```typescript
type NotificationPriority = 'low' | 'medium' | 'high';
```

## 4. CRUDフロー

### 生徒側

| 操作 | 画面 | 説明 |
|------|------|------|
| **Read** | NotificationPage | お知らせ一覧を取得・表示 |
| **Update** | NotificationPage | 既読マークを付ける（`isRead: true`） |
| **Delete** | NotificationPage | お知らせを削除（確認ダイアログ付き） |

### メンター側

| 操作 | 画面 | 説明 |
|------|------|------|
| **Create** | NotificationManagePage | 新規お知らせ作成 |
| **Read** | NotificationListPage | 配信済みお知らせ一覧 |
| **Update** | NotificationManagePage | 既存お知らせ編集 |
| **Delete** | NotificationListPage | お知らせ削除 |

## 5. コンポーネント

| 名前 | 責務 | 配置 |
|------|------|------|
| NotificationList | 通知一覧（フィルター機能） | features/student/components/notification/ |
| NotificationFilter | カテゴリフィルター | features/student/components/notification/ |
| NotificationEditor | お知らせ作成/編集 | features/mentor/components/notifications/ |

## 6. 画面仕様

### 一覧表示
- カード形式、未読は背景色で強調
- カテゴリフィルター
- 「すべて既読にする」ボタン

### カードデザイン
- 左: カテゴリアイコン + 色付き縦線
- 中央: タイトル + 日時（`createdAt`）
- 右: 未読ドット（未読時）
- ホバーで軽く浮き上がる

### 詳細モーダル
- タイトル、本文、作成日時
- 開いた時点で自動既読化
- ESCまたは×ボタンで閉じる

### バッジ
- 未読件数を赤丸で表示
- 0件時は非表示
- サイドバーのお知らせアイコンに配置

## 7. カラー

| 用途 | CSS変数 | 値 |
|------|---------|-----|
| 情報 | `--color-notification-info` | #2196F3 |
| 重要 | `--color-notification-important` | #F44336 |
| イベント | `--color-notification-event` | #4CAF50 |
| 未読背景 | `--color-notification-unread-bg` | #E3F2FD |
| バッジ | `--color-notification-badge` | #FF0000 |

## 8. 関連

- → ADR-005（データベース設計）
- → specs/features/mentor.md（お知らせ配信機能）
- → specs/shared/colors.md（カラー定義）

## 9. 変更履歴

| 日付 | 変更内容 |
|------|----------|
| 2025-12-25 | 抜本修正: データ構造をADR-005参照に変更、CRUDフロー追加、achievementカテゴリ削除、フィールド名統一 |
| 2025-11-25 | 初版作成、実装完了 |
