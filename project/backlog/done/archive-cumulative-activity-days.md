---
id: archive-cumulative-activity-days
feature: archive
depends_on: []
scope_files:
  - frontend/src/features/student/components/archive/AchievementCalendar/AchievementCalendar.tsx
  - frontend/src/features/student/components/archive/AchievementCalendar/AchievementCalendar.module.css
  - frontend/src/features/student/pages/ArchivePage/ArchivePage.tsx
forbidden_files:
  - frontend/src/shared/types/
created_at: 2025-12-11
---

# タスク: 累積活動日数の表示

> このファイルはサブエージェントへの作業指示書です。

## 0. 必読ファイル（スキップ禁止）

以下を **必ず読んでから** 作業開始:

1. `specs/overview.md` - システム全体像
2. `specs/features/archive.md` - ARCHIVE機能の仕様（累積活動日数セクション）
3. `specs/shared/conventions.md` - コーディング規約

## 1. タスク概要

ARCHIVEページのカレンダー上部に「累積活動日数」を表示する。学習記録がある日をカウントし、モチベーション向上につなげる。

## 2. 完了条件

- [ ] AchievementCalendar に累積活動日数の表示エリア追加
- [ ] 学習記録がある日（activityDates）をカウント
- [ ] 「XX日間活動中！」の形式で表示
- [ ] アイコン/絵文字で視覚的に強調
- [ ] TypeScriptエラーがないこと
- [ ] 仕様書（archive.md）との整合性確認

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/features/student/components/archive/AchievementCalendar/AchievementCalendar.tsx` | 編集 |
| `frontend/src/features/student/components/archive/AchievementCalendar/AchievementCalendar.module.css` | 編集 |
| `frontend/src/features/student/pages/ArchivePage/ArchivePage.tsx` | 編集（必要に応じて） |

**上記以外は編集禁止**

## 4. 実装仕様

### AchievementCalendar.tsx の変更

```typescript
interface AchievementCalendarProps {
    activityDates: string[]; // "YYYY-MM-DD" 形式
}

const AchievementCalendar = ({ activityDates }: AchievementCalendarProps) => {
    // 累積活動日数を計算
    const totalActivityDays = activityDates.length;

    // 現在の月の活動日数も表示する場合
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentMonthDays = activityDates.filter(date => {
        const d = new Date(date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    return (
        <div className={styles.container}>
            {/* 累積活動日数表示エリア */}
            <div className={styles.statsHeader}>
                <div className={styles.totalDays}>
                    <span className={styles.icon}>🔥</span>
                    <span className={styles.number}>{totalActivityDays}</span>
                    <span className={styles.label}>日間活動中！</span>
                </div>
                <div className={styles.monthlyDays}>
                    今月: {currentMonthDays}日
                </div>
            </div>

            {/* 既存のカレンダー表示 */}
            <div className={styles.calendar}>
                {/* ... 既存のカレンダーコード */}
            </div>
        </div>
    );
};
```

### AchievementCalendar.module.css の追加

```css
.statsHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background: linear-gradient(135deg, var(--color-accent-blue-light), var(--color-accent-orange-light));
  border-radius: var(--border-radius-md);
}

.totalDays {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.icon {
  font-size: 32px;
}

.number {
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-bold);
  color: var(--color-accent-orange);
}

.label {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.monthlyDays {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  background-color: var(--color-bg-primary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
}
```

## 5. 参考実装

- `specs/features/archive.md` - 累積活動日数仕様
- `frontend/src/features/student/mockData/archives.ts` - activityDates確認

## 6. 技術的制約

- ❌ `any` 型禁止
- ❌ CSS値ハードコード禁止（CSS変数使用）
- ❌ 外部ライブラリ追加禁止
- ✅ `import type` で型をimport
- ✅ Date APIで日付計算

## 7. 完了報告

### タスクID: archive-cumulative-activity-days

### 作成/編集ファイル:
- `AchievementCalendar.tsx` - 累積活動日数表示追加
- `AchievementCalendar.module.css` - 統計ヘッダースタイル追加

### 主要な変更点:
- 累積活動日数の計算と表示
- 今月の活動日数も表示
- 視覚的に目立つデザイン（グラデーション、絵文字）

### 未解決の問題: なし
