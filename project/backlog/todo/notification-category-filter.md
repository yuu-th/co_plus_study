---
id: notification-category-filter
feature: notification
depends_on: []
scope_files:
  - frontend/src/features/student/components/notification/NotificationFilter/
  - frontend/src/features/student/pages/NotificationPage/NotificationPage.tsx
forbidden_files:
  - frontend/src/shared/types/notification.ts
created_at: 2025-12-11
---

# タスク: お知らせカテゴリフィルター機能

> このファイルはサブエージェントへの作業指示書です。

## 0. 必読ファイル（スキップ禁止）

以下を **必ず読んでから** 作業開始:

1. `specs/overview.md` - システム全体像
2. `specs/features/notification.md` - お知らせ機能の仕様（フィルター機能セクション）
3. `specs/shared/conventions.md` - コーディング規約

## 1. タスク概要

お知らせ一覧ページにカテゴリフィルター機能を追加し、特定カテゴリ（システム/イベント/お知らせ）のみを表示できるようにする。

## 2. 完了条件

- [ ] NotificationFilter コンポーネント新規作成
- [ ] カテゴリボタン（すべて/システム/イベント/お知らせ）
- [ ] 選択したカテゴリでフィルタリング
- [ ] NotificationPage に統合
- [ ] アクティブ状態のスタイル
- [ ] TypeScriptエラーがないこと
- [ ] 仕様書（notification.md）との整合性確認

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/features/student/components/notification/NotificationFilter/NotificationFilter.tsx` | 新規作成 |
| `frontend/src/features/student/components/notification/NotificationFilter/NotificationFilter.module.css` | 新規作成 |
| `frontend/src/features/student/components/notification/NotificationFilter/index.ts` | 新規作成 |
| `frontend/src/features/student/pages/NotificationPage/NotificationPage.tsx` | 編集 |

**上記以外は編集禁止**

## 4. 実装仕様

### NotificationFilter.tsx

```typescript
import type { NotificationCategory } from '@/shared/types';
import styles from './NotificationFilter.module.css';

interface NotificationFilterProps {
    selectedCategory: NotificationCategory | 'all';
    onCategoryChange: (category: NotificationCategory | 'all') => void;
}

const NotificationFilter = ({ selectedCategory, onCategoryChange }: NotificationFilterProps) => {
    const categories: Array<{ value: NotificationCategory | 'all'; label: string }> = [
        { value: 'all', label: 'すべて' },
        { value: 'system', label: 'システム' },
        { value: 'event', label: 'イベント' },
        { value: 'announcement', label: 'お知らせ' },
    ];

    return (
        <div className={styles.container}>
            {categories.map(({ value, label }) => (
                <button
                    key={value}
                    type="button"
                    className={`${styles.button} ${
                        selectedCategory === value ? styles.active : ''
                    }`}
                    onClick={() => onCategoryChange(value)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};

export default NotificationFilter;
```

### NotificationFilter.module.css

```css
.container {
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
}

.button {
  padding: var(--spacing-xs) var(--spacing-md);
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-full);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-base);
}

.button:hover {
  background-color: var(--color-bg-hover);
}

.button.active {
  background-color: var(--color-accent-blue);
  color: white;
  border-color: var(--color-accent-blue);
}
```

### NotificationPage.tsx の変更

```typescript
import { useState, useMemo } from 'react';
import NotificationFilter from '../../components/notification/NotificationFilter';
import type { Notification, NotificationCategory } from '@/shared/types';
// ... 既存のimport

const NotificationPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | 'all'>('all');

    // フィルタリング処理
    const filteredNotifications = useMemo(() => {
        if (selectedCategory === 'all') {
            return notifications;
        }
        return notifications.filter(n => n.category === selectedCategory);
    }, [notifications, selectedCategory]);

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>お知らせ</h1>
            
            <NotificationFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
            />

            <NotificationList
                notifications={filteredNotifications}
                onMarkAsRead={(id) => {
                    setNotifications(prev =>
                        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
                    );
                }}
            />
        </div>
    );
};
```

## 5. 参考実装

- `specs/features/notification.md` - フィルター仕様
- `frontend/src/shared/types/notification.ts` - NotificationCategory型確認
- `frontend/src/features/student/components/diary/DiaryFilter/` - 類似のフィルターコンポーネント

## 6. 技術的制約

- ❌ `any` 型禁止
- ❌ CSS値ハードコード禁止（CSS変数使用）
- ❌ 外部ライブラリ追加禁止
- ✅ `import type` で型をimport
- ✅ useMemo でフィルタリング最適化

## 7. 完了報告

### タスクID: notification-category-filter

### 作成/編集ファイル:
- `NotificationFilter.tsx` - カテゴリフィルターコンポーネント
- `NotificationPage.tsx` - フィルター統合

### 主要な変更点:
- カテゴリフィルター機能追加
- すべて/システム/イベント/お知らせの切替
- フィルタリングロジック実装

### 未解決の問題: なし
