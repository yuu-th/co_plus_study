---
id: mentor-notification-create-integration
feature: mentor
depends_on: []
scope_files:
  - frontend/src/features/mentor/pages/NotificationManagePage/NotificationManagePage.tsx
  - frontend/src/features/mentor/routes.tsx
forbidden_files:
  - frontend/src/shared/types/
  - frontend/src/features/student/
created_at: 2025-12-11
---

# タスク: メンターお知らせ作成ページへのルート統合

> このファイルはサブエージェントへの作業指示書です。

## 0. 必読ファイル（スキップ禁止）

以下を **必ず読んでから** 作業開始:

1. `specs/overview.md` - システム全体像
2. `specs/features/mentor.md` - メンター管理機能の仕様
3. `specs/features/notification.md` - お知らせ機能の仕様
4. `specs/shared/conventions.md` - コーディング規約

## 1. タスク概要

既に実装されている NotificationManagePage をメンターダッシュボードから遷移できるようにルートを整備し、お知らせ一覧ページも追加する。

## 2. 完了条件

- [ ] /mentor/notifications ルート追加（一覧ページ）
- [ ] /mentor/notifications/new ルート追加（作成ページ・既存）
- [ ] /mentor/notifications/:id/edit ルート追加（編集ページ）
- [ ] MentorDashboard にお知らせ管理リンク追加
- [ ] TypeScriptエラーがないこと
- [ ] 仕様書（mentor.md）との整合性確認

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/features/mentor/pages/NotificationListPage/NotificationListPage.tsx` | 新規作成 |
| `frontend/src/features/mentor/pages/NotificationListPage/NotificationListPage.module.css` | 新規作成 |
| `frontend/src/features/mentor/pages/NotificationListPage/index.ts` | 新規作成 |
| `frontend/src/features/mentor/routes.tsx` | 編集 |
| `frontend/src/features/mentor/pages/MentorDashboardPage/MentorDashboardPage.tsx` | 編集 |

**上記以外は編集禁止**

## 4. 実装仕様

### NotificationListPage.tsx（簡易版）

```typescript
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import type { Notification } from '@/shared/types';
import { mockNotifications } from '@/shared/mockData/notifications';
import styles from './NotificationListPage.module.css';

const NotificationListPage = () => {
    const [notifications] = useState<Notification[]>(mockNotifications);

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>お知らせ管理</h1>
                <Link to="/mentor/notifications/new">
                    <Button variant="primary">新規作成</Button>
                </Link>
            </div>

            <div className={styles.list}>
                {notifications.map((notification) => (
                    <Card key={notification.id}>
                        <div className={styles.item}>
                            <div className={styles.content}>
                                <h3>{notification.title}</h3>
                                <p className={styles.category}>{notification.category}</p>
                                <p className={styles.date}>
                                    公開日: {new Date(notification.publishedAt).toLocaleDateString('ja-JP')}
                                </p>
                            </div>
                            <div className={styles.actions}>
                                <Link to={`/mentor/notifications/${notification.id}/edit`}>
                                    <Button size="small">編集</Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default NotificationListPage;
```

### NotificationListPage.module.css

```css
.page {
  padding: var(--spacing-lg);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.title {
  margin: 0;
  font-size: var(--font-size-xxl);
}

.list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content {
  flex: 1;
}

.content h3 {
  margin: 0 0 var(--spacing-xs) 0;
}

.category {
  display: inline-block;
  padding: 2px 8px;
  background-color: var(--color-accent-blue-light);
  color: var(--color-accent-blue);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  margin-bottom: var(--spacing-xs);
}

.date {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin: 0;
}

.actions {
  display: flex;
  gap: var(--spacing-xs);
}
```

### routes.tsx への追加

```typescript
import NotificationListPage from './pages/NotificationListPage';
import NotificationManagePage from '../../src_pages/NotificationManagePage';

// 既存のルート配列に追加
{
  path: '/mentor/notifications',
  element: <NotificationListPage />,
},
{
  path: '/mentor/notifications/new',
  element: <NotificationManagePage />,
},
{
  path: '/mentor/notifications/:id/edit',
  element: <NotificationManagePage />,
},
```

### MentorDashboardPage.tsx の変更

```typescript
import { Link } from 'react-router-dom';
import Card from '@/shared/components/Card';
// ... 既存のimport

const MentorDashboardPage = () => {
    return (
        <div className={styles.page}>
            <h1 className={styles.title}>メンターダッシュボード</h1>

            <div className={styles.grid}>
                {/* 既存のカード */}
                <Link to="/mentor/students">
                    <Card title="生徒管理" hoverable>
                        <p>担当生徒の一覧と学習状況を確認</p>
                    </Card>
                </Link>

                {/* 追加 */}
                <Link to="/mentor/notifications">
                    <Card title="お知らせ管理" hoverable>
                        <p>お知らせの作成・編集・配信</p>
                    </Card>
                </Link>

                <Link to="/mentor/surveys/new">
                    <Card title="アンケート作成" hoverable>
                        <p>新規アンケートの作成</p>
                    </Card>
                </Link>
            </div>
        </div>
    );
};
```

## 5. 参考実装

- `specs/features/mentor.md` - メンター管理機能仕様
- `src_pages/NotificationManagePage/NotificationManagePage.tsx` - 既存の作成ページ

## 6. 技術的制約

- ❌ `any` 型禁止
- ❌ CSS値ハードコード禁止（CSS変数使用）
- ❌ 外部ライブラリ追加禁止
- ✅ `import type` で型をimport
- ✅ React Router v6のLink使用

## 7. 完了報告

### タスクID: mentor-notification-create-integration

### 作成/編集ファイル:
- `NotificationListPage.tsx` - お知らせ一覧ページ
- `routes.tsx` - ルート追加
- `MentorDashboardPage.tsx` - リンク追加

### 主要な変更点:
- メンター向けお知らせ管理導線整備
- 一覧・作成・編集ページへのルーティング
- ダッシュボードからアクセス可能に

### 未解決の問題: なし
