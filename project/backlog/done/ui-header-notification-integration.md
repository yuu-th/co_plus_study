---
id: ui-header-notification-integration
feature: notification
depends_on:
  - design-spec-home-improvements
scope_files:
  - frontend/src/components/layout/Header/Header.tsx
  - frontend/src/components/layout/Header/Header.module.css
  - frontend/src/components/notification/NotificationBell/NotificationBell.tsx
  - frontend/src/components/notification/NotificationBell/NotificationBell.module.css
  - frontend/src/pages/HomePage/HomePage.tsx
forbidden_files:
  - frontend/src/mockData/
  - frontend/src/types/
  - frontend/src/hooks/
created_at: 2025-11-27
---

# タスク: ヘッダーにお知らせベルアイコン統合

> このファイルはサブエージェントへの作業指示書です。

## 0. 最初に必ず読むファイル（スキップ禁止）

| 順序 | ファイル | 読む目的 |
|------|----------|----------|
| 1 | `specs/overview.md` | システム全体像・技術制約 |
| 2 | `specs/features/home.md` | ホーム画面仕様（作成後） |
| 3 | `specs/features/notification.md` | お知らせ機能の仕様 |
| 4 | `specs/shared/conventions.md` | コーディング規約 |

## 1. タスク概要

お知らせ（通知）のベルアイコンをヘッダーに移動・統合する。
ホームページからお知らせ表示を削除し、ベルアイコン経由でのみアクセス可能にする。

## 2. 完了条件

- [ ] Header.tsx でベルアイコン + 未読バッジを表示
- [ ] ベルアイコンクリックで通知一覧を表示（モーダルまたはドロップダウン）
- [ ] 未読件数バッジが正しく表示される
- [ ] ホームページから埋め込まれたお知らせ表示を削除
- [ ] TypeScriptエラーなし
- [ ] CSS変数を使用

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/components/layout/Header/Header.tsx` | 編集 |
| `frontend/src/components/layout/Header/Header.module.css` | 編集 |
| `frontend/src/components/notification/NotificationBell/NotificationBell.tsx` | 新規作成 |
| `frontend/src/components/notification/NotificationBell/NotificationBell.module.css` | 新規作成 |
| `frontend/src/pages/HomePage/HomePage.tsx` | 編集（お知らせセクション削除） |

## 4. 実装仕様

### Header コンポーネント
```tsx
// 新しい構成:
// [Menu Button] [Logo/Title] [Notifications Bell + Badge] [User Info]

// HeaderProps に以下を追加:
interface HeaderProps {
  onMenuClick?: () => void;
  userName?: string;
  unreadNotificationCount?: number;
  onNotificationClick?: () => void;
}
```

### NotificationBell コンポーネント
新規作成、以下の機能を実装:

```tsx
interface NotificationBellProps {
  count: number;              // 未読件数
  onClick?: () => void;       // クリック時のハンドラ
  notifications?: Notification[];  // 通知一覧（ドロップダウン表示用）
  onMarkRead?: (id: string) => void;
}
```

機能:
- ベルアイコン（FaBell推奨）
- 未読件数 > 0 時に赤いバッジ表示
- ホバーまたはクリックで通知プレビュー表示

### ホームページの変更
- `<section aria-labelledby="home-notifications">` セクション全体を削除
- 統計情報やウェルカムメッセージは残す

## 5. スタイリング

```css
/* NotificationBell.module.css */

.bellButton {
  position: relative;
  background: none;
  border: none;
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
  cursor: pointer;
}

.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: var(--color-notification-badge);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}
```

## 6. 参考実装

- 既存の `NotificationList.tsx` と `NotificationModal.tsx`
- Header.module.css の既存スタイル

## 7. 注意事項

- ベルアイコン表示時のアクセシビリティ対応（ARIA属性）
- レスポンシブ対応（モバイルでも見やすい位置・サイズ）

## 8. 完了報告

```markdown
## 完了報告

### タスクID
ui-header-notification-integration

### 作成/編集ファイル
- Header.tsx - 編集（ベルアイコン追加）
- Header.module.css - 編集（スタイル追加）
- NotificationBell.tsx - 新規作成
- NotificationBell.module.css - 新規作成
- HomePage.tsx - 編集（お知らせセクション削除）

### 主要な変更点
- ベルアイコン + 未読バッジをヘッダーに統合
- ホームページからお知らせセクション削除
- NotificationBell コンポーネント作成

### 未解決の問題
- なし
```
