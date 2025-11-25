# お知らせ機能

> 最終更新: 2025-11-25
> ステータス: 実装完了

## 1. 概要

メンターからの重要なお知らせをインタラクティブに表示。カテゴリ別色分け、未読バッジ、詳細モーダルで視認性を高める。

## 2. ユーザーストーリー

- 生徒として、重要なお知らせを見逃したくない。イベント情報を把握したいから。
- 生徒として、未読のお知らせがあることを知りたい。新着を確認したいから。
- メンターとして、生徒にお知らせを配信したい。情報を伝達したいから。

## 3. データ構造

### Notification

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | string | ✓ | 一意識別子 |
| category | NotificationCategory | ✓ | カテゴリ |
| title | string | ✓ | タイトル |
| content | string | ✓ | 本文 |
| timestamp | ISO8601 | ✓ | 投稿日時 |
| isRead | boolean | ✓ | 既読フラグ |
| iconUrl | string | | アイコンURL |

### NotificationCategory

```typescript
type NotificationCategory = 'info' | 'important' | 'event' | 'achievement';
```

| カテゴリ | 用途 | 色 |
|----------|------|-----|
| info | 一般的なお知らせ | 青 #2196F3 |
| important | 重要な通知 | 赤 #F44336 |
| event | イベント告知 | 緑 #4CAF50 |
| achievement | バッジ獲得等 | 金 #FFD700 |

## 4. コンポーネント

| 名前 | 責務 | 配置 |
|------|------|------|
| NotificationList | 通知一覧（フィルター機能） | features/notification/components/ |
| NotificationCard | 個別通知カード | features/notification/components/ |
| NotificationModal | 詳細モーダル | features/notification/components/ |
| NotificationBadge | 未読件数バッジ | features/notification/components/ |

## 5. 画面仕様

### 一覧表示
- カード形式、未読は背景色で強調
- カテゴリフィルター、「未読のみ」トグル
- 「すべて既読にする」ボタン

### カードデザイン
- 左: カテゴリアイコン + 色付き縦線
- 中央: タイトル + 日時
- 右: 未読ドット（未読時）
- ホバーで軽く浮き上がる

### 詳細モーダル
- タイトル、本文、投稿日時
- 開いた時点で自動既読化
- ESCまたは×ボタンで閉じる

### バッジ
- 未読件数を赤丸で表示
- 0件時は非表示
- サイドバーのお知らせアイコンに配置

## 6. フック

### useNotifications

```typescript
interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  filterByCategory: (category: NotificationCategory | 'all') => Notification[];
}
```

## 7. カラー

| 用途 | CSS変数 | 値 |
|------|---------|-----|
| 情報 | `--color-notification-info` | #2196F3 |
| 重要 | `--color-notification-important` | #F44336 |
| イベント | `--color-notification-event` | #4CAF50 |
| 達成 | `--color-notification-achievement` | #FFD700 |
| 未読背景 | `--color-notification-unread-bg` | #E3F2FD |
| バッジ | `--color-notification-badge` | #FF0000 |

## 8. 関連

- → specs/features/mentor.md（お知らせ配信機能）
- → specs/shared/colors.md（カラー定義）

## 9. 変更履歴

| 日付 | 変更内容 |
|------|----------|
| 2025-11-25 | 初版作成、実装完了 |
