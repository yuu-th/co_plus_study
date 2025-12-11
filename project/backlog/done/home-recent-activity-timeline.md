---
id: home-recent-activity-timeline
feature: home
depends_on: []
scope_files:
  - frontend/src/features/student/components/home/RecentActivityTimeline/
  - frontend/src/features/student/pages/HomePage/HomePage.tsx
forbidden_files:
  - frontend/src/shared/types/
created_at: 2025-12-11
---

# タスク: ホーム画面の最近の活動タイムライン

> このファイルはサブエージェントへの作業指示書です。

## 0. 必読ファイル（スキップ禁止）

以下を **必ず読んでから** 作業開始:

1. `specs/overview.md` - システム全体像
2. `specs/features/home.md` - ホーム画面機能の仕様（最近の活動セクション）
3. `specs/shared/conventions.md` - コーディング規約

## 1. タスク概要

ホーム画面に「最近の活動」タイムラインを追加し、学習日報投稿・バッジ獲得・チャットメッセージ等の最新アクティビティを時系列で表示する。

## 2. 完了条件

- [ ] RecentActivityTimeline コンポーネント新規作成
- [ ] アクティビティ種別（diary/badge/chat）ごとのアイコン
- [ ] 時系列で降順表示
- [ ] 各アクティビティへのリンク
- [ ] HomePage に統合
- [ ] TypeScriptエラーがないこと
- [ ] 仕様書（home.md）との整合性確認

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/features/student/components/home/RecentActivityTimeline/RecentActivityTimeline.tsx` | 新規作成 |
| `frontend/src/features/student/components/home/RecentActivityTimeline/RecentActivityTimeline.module.css` | 新規作成 |
| `frontend/src/features/student/components/home/RecentActivityTimeline/index.ts` | 新規作成 |
| `frontend/src/features/student/pages/HomePage/HomePage.tsx` | 編集 |
| `frontend/src/features/student/mockData/activities.ts` | 新規作成（モックデータ） |

**上記以外は編集禁止**

## 4. 実装仕様

### Activity型定義（仮）

```typescript
// mockData/activities.ts
export interface Activity {
    id: string;
    type: 'diary' | 'badge' | 'chat' | 'survey';
    title: string;
    description: string;
    timestamp: string;
    link?: string;
}

export const mockActivities: Activity[] = [
    {
        id: 'act-1',
        type: 'diary',
        title: '学習日報を投稿しました',
        description: '数学の二次関数を1時間学習',
        timestamp: new Date().toISOString(),
        link: '/diary',
    },
    {
        id: 'act-2',
        type: 'badge',
        title: 'バッジを獲得しました',
        description: '「継続は力なり」バッジ',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        link: '/archive',
    },
    {
        id: 'act-3',
        type: 'chat',
        title: 'メッセージを受信しました',
        description: 'おにいさんから励ましのメッセージ',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        link: '/chat',
    },
];
```

### RecentActivityTimeline.tsx

```typescript
import { Link } from 'react-router-dom';
import type { Activity } from '@/features/student/mockData/activities';
import styles from './RecentActivityTimeline.module.css';

interface RecentActivityTimelineProps {
    activities: Activity[];
    maxItems?: number;
}

const RecentActivityTimeline = ({ activities, maxItems = 10 }: RecentActivityTimelineProps) => {
    const displayActivities = activities.slice(0, maxItems);

    const getIcon = (type: Activity['type']) => {
        const icons = {
            diary: '📝',
            badge: '🏆',
            chat: '💬',
            survey: '📋',
        };
        return icons[type];
    };

    const formatTime = (timestamp: string) => {
        const now = new Date();
        const activityDate = new Date(timestamp);
        const diffMs = now.getTime() - activityDate.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}分前`;
        if (diffHours < 24) return `${diffHours}時間前`;
        return `${diffDays}日前`;
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>最近の活動</h3>
            <ul className={styles.timeline}>
                {displayActivities.map((activity) => (
                    <li key={activity.id} className={styles.item}>
                        <div className={styles.icon}>{getIcon(activity.type)}</div>
                        <div className={styles.content}>
                            <p className={styles.activityTitle}>{activity.title}</p>
                            <p className={styles.description}>{activity.description}</p>
                            <span className={styles.time}>{formatTime(activity.timestamp)}</span>
                        </div>
                        {activity.link && (
                            <Link to={activity.link} className={styles.link}>
                                →
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentActivityTimeline;
```

### RecentActivityTimeline.module.css

```css
.container {
  background-color: var(--color-bg-primary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
}

.title {
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
}

.timeline {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-left: 2px solid var(--color-border);
  margin-bottom: var(--spacing-sm);
  position: relative;
}

.item:last-child {
  margin-bottom: 0;
  border-left-color: transparent;
}

.icon {
  font-size: 24px;
  flex-shrink: 0;
}

.content {
  flex: 1;
}

.activityTitle {
  margin: 0 0 var(--spacing-xs) 0;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.description {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
}

.time {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.link {
  color: var(--color-accent-blue);
  font-size: var(--font-size-lg);
  text-decoration: none;
  flex-shrink: 0;
}

.link:hover {
  opacity: 0.7;
}
```

### HomePage.tsx の変更

```typescript
import RecentActivityTimeline from '../../components/home/RecentActivityTimeline';
import { mockActivities } from '../../mockData/activities';
// ... 既存のimport

const HomePage = () => {
    return (
        <div className={styles.page}>
            <h1 className={styles.title}>ホーム</h1>
            
            <div className={styles.layout}>
                <div className={styles.main}>
                    {/* 既存のコンテンツ */}
                </div>
                
                <div className={styles.side}>
                    <RecentActivityTimeline activities={mockActivities} maxItems={5} />
                </div>
            </div>
        </div>
    );
};
```

## 5. 参考実装

- `specs/features/home.md` - 最近の活動仕様
- `frontend/src/features/student/components/diary/DiaryTimeline/` - タイムライン表示の参考

## 6. 技術的制約

- ❌ `any` 型禁止
- ❌ CSS値ハードコード禁止（CSS変数使用）
- ❌ 外部ライブラリ追加禁止
- ✅ `import type` で型をimport
- ✅ 相対時間表示（X分前、X時間前）

## 7. 完了報告

### タスクID: home-recent-activity-timeline

### 作成/編集ファイル:
- `RecentActivityTimeline.tsx` - 活動タイムラインコンポーネント
- `activities.ts` - モックデータ
- `HomePage.tsx` - タイムライン統合

### 主要な変更点:
- 最近の活動タイムライン表示
- アクティビティ種別ごとのアイコン
- 相対時間表示
- 各ページへのリンク

### 未解決の問題: なし
