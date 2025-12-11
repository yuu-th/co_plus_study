---
id: diary-filter-feature
feature: diary
depends_on: []
scope_files:
  - frontend/src/features/student/pages/DiaryPage/DiaryPage.tsx
  - frontend/src/features/student/pages/DiaryPage/DiaryPage.module.css
  - frontend/src/features/student/components/diary/DiaryFilter/
forbidden_files:
  - frontend/src/shared/types/diary.ts
created_at: 2025-12-11
---

# タスク: 学習日報のフィルター機能

> このファイルはサブエージェントへの作業指示書です。

## 0. 必読ファイル（スキップ禁止）

以下を **必ず読んでから** 作業開始:

1. `specs/overview.md` - システム全体像
2. `specs/features/diary.md` - 学習日報機能の仕様（特に「フィルター機能」セクション）
3. `specs/shared/conventions.md` - コーディング規約

## 1. タスク概要

学習日報に教科フィルターと期間フィルターを追加し、投稿を絞り込んで表示できるようにする。

## 2. 完了条件

- [ ] DiaryFilter コンポーネント新規作成
- [ ] 教科フィルター（すべて/国語/数学/理科/社会/英語/その他）
- [ ] 期間フィルター（1週間/1ヶ月/すべて）
- [ ] DiaryPage にフィルター状態管理を追加
- [ ] フィルター条件に基づいて投稿をフィルタリング
- [ ] TypeScriptエラーがないこと
- [ ] 仕様書（diary.md）との整合性確認

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/features/student/components/diary/DiaryFilter/DiaryFilter.tsx` | 新規作成 |
| `frontend/src/features/student/components/diary/DiaryFilter/DiaryFilter.module.css` | 新規作成 |
| `frontend/src/features/student/components/diary/DiaryFilter/index.ts` | 新規作成 |
| `frontend/src/features/student/pages/DiaryPage/DiaryPage.tsx` | 編集（フィルター統合） |
| `frontend/src/features/student/pages/DiaryPage/DiaryPage.module.css` | 編集（レイアウト） |

**上記以外は編集禁止**

## 4. 実装仕様

### DiaryFilter.tsx

```typescript
import type { Subject } from '@/shared/types';
import styles from './DiaryFilter.module.css';

type RangeType = 'week' | 'month' | 'all';

interface DiaryFilterProps {
  selectedSubject: Subject | 'all';
  selectedRange: RangeType;
  onSubjectChange: (subject: Subject | 'all') => void;
  onRangeChange: (range: RangeType) => void;
}

const DiaryFilter = ({
  selectedSubject,
  selectedRange,
  onSubjectChange,
  onRangeChange,
}: DiaryFilterProps) => {
  const subjects: Array<Subject | 'all'> = [
    'all', '国語', '数学', '理科', '社会', '英語', 'その他'
  ];

  const ranges: Array<{ value: RangeType; label: string }> = [
    { value: 'week', label: '1週間' },
    { value: 'month', label: '1ヶ月' },
    { value: 'all', label: 'すべて' },
  ];

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterGroup}>
        <label className={styles.label}>教科</label>
        <div className={styles.buttonGroup}>
          {subjects.map((subject) => (
            <button
              key={subject}
              type="button"
              className={`${styles.filterButton} ${
                selectedSubject === subject ? styles.active : ''
              }`}
              onClick={() => onSubjectChange(subject)}
            >
              {subject === 'all' ? 'すべて' : subject}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>期間</label>
        <div className={styles.buttonGroup}>
          {ranges.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`${styles.filterButton} ${
                selectedRange === value ? styles.active : ''
              }`}
              onClick={() => onRangeChange(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiaryFilter;
```

### DiaryFilter.module.css

```css
.filterContainer {
  background-color: var(--color-bg-primary);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-lg);
}

.filterGroup {
  margin-bottom: var(--spacing-md);
}

.filterGroup:last-child {
  margin-bottom: 0;
}

.label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.buttonGroup {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.filterButton {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all var(--transition-base);
}

.filterButton:hover {
  background-color: var(--color-bg-hover);
}

.filterButton.active {
  background-color: var(--color-accent-blue);
  color: white;
  border-color: var(--color-accent-blue);
}
```

### DiaryPage.tsx の変更

```typescript
import { useState, useMemo } from 'react';
import type { DiaryPost, Subject } from '@/shared/types';
import DiaryFilter from '../../components/diary/DiaryFilter';
// ... 既存のimport

type RangeType = 'week' | 'month' | 'all';

const DiaryPage = () => {
    const [posts, setPosts] = useState<DiaryPost[]>(mockDiaryPosts);
    const [selectedSubject, setSelectedSubject] = useState<Subject | 'all'>('all');
    const [selectedRange, setSelectedRange] = useState<RangeType>('all');

    // フィルタリング処理
    const filteredPosts = useMemo(() => {
        let filtered = posts;

        // 教科フィルター
        if (selectedSubject !== 'all') {
            filtered = filtered.filter(p => p.subject === selectedSubject);
        }

        // 期間フィルター
        if (selectedRange !== 'all') {
            const now = new Date();
            const cutoffDate = new Date();
            
            if (selectedRange === 'week') {
                cutoffDate.setDate(now.getDate() - 7);
            } else if (selectedRange === 'month') {
                cutoffDate.setDate(now.getDate() - 30);
            }

            filtered = filtered.filter(p => new Date(p.timestamp) >= cutoffDate);
        }

        return filtered;
    }, [posts, selectedSubject, selectedRange]);

    const handleAdd = (post: DiaryPost) => {
        setPosts(prev => [post, ...prev]);
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>学習日報</h1>
            <div className={styles.layout}>
                <div className={styles.main}>
                    <DiaryPostForm onAdd={handleAdd} />
                    <DiaryFilter
                        selectedSubject={selectedSubject}
                        selectedRange={selectedRange}
                        onSubjectChange={setSelectedSubject}
                        onRangeChange={setSelectedRange}
                    />
                    <DiaryTimeline posts={filteredPosts} onLoadMore={() => {}} />
                </div>
                <div className={styles.side}>
                    <DiaryStats posts={filteredPosts} />
                </div>
            </div>
        </div>
    );
};
```

## 5. 参考実装

- `specs/features/diary.md` - フィルター機能仕様
- `frontend/src/features/student/mockData/diaries.ts` - mockSubjects 確認

## 6. 技術的制約

- ❌ `any` 型禁止
- ❌ CSS値ハードコード禁止（CSS変数使用）
- ❌ 外部ライブラリ追加禁止
- ✅ `import type` で型をimport
- ✅ useMemo でフィルタリング処理を最適化

## 7. 完了報告

### タスクID: diary-filter-feature

### 作成/編集ファイル:
- `DiaryFilter.tsx` - フィルターコンポーネント新規作成
- `DiaryFilter.module.css` - スタイル新規作成
- `DiaryPage.tsx` - フィルター統合、フィルタリングロジック追加

### 主要な変更点:
- 教科・期間フィルター機能追加
- フィルター条件に基づく投稿の絞り込み
- DiaryStats にもフィルター済みデータを渡す

### 未解決の問題: なし
