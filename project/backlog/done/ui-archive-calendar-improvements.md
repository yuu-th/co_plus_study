---
id: ui-archive-calendar-improvements
feature: archive
depends_on:
  - design-spec-archive-improvements
scope_files:
  - frontend/src/components/archive/CalendarView/CalendarView.tsx
  - frontend/src/components/archive/CalendarView/CalendarView.module.css
  - frontend/src/components/archive/MonthlyCalendar/MonthlyCalendar.tsx
  - frontend/src/components/archive/MonthlyCalendar/MonthlyCalendar.module.css
  - frontend/src/pages/ArchivePage/ArchivePage.tsx
  - frontend/src/pages/ArchivePage/ArchivePage.module.css
  - frontend/src/types/calendar.ts
forbidden_files:
  - frontend/src/mockData/
  - frontend/src/pages/
created_at: 2025-11-27
---

# タスク: 実績画面カレンダーUI改善（グレー/黄色、日本語曜日、色分け）

> このファイルはサブエージェントへの作業指示書です。

## 0. 最初に必ず読むファイル（スキップ禁止）

| 順序 | ファイル | 読む目的 |
|------|----------|----------|
| 1 | `specs/overview.md` | システム全体像・技術制約 |
| 2 | `specs/features/archive.md` | 更新された実績仕様 |
| 3 | `specs/shared/conventions.md` | コーディング規約 |

## 1. タスク概要

ARCHIVE（実績）画面のカレンダーUIを大幅に改善する:

1. グレー（活動なし）/ 黄色（活動あり）の色分け
2. 連続活動日の視覚的繋ぎ表示
3. 曜日を日本語（日月火水木金土）で表示
4. 土日を色分け（土曜=青、日曜=赤）
5. ページタイトル「ARCHIVE」→「実績」

## 2. 完了条件

- [ ] ArchivePage のタイトルが「実績」に変更
- [ ] MonthlyCalendar で日本語曜日が表示される
- [ ] 活動日がグレー（未活動）/ 黄色（活動）で色分け
- [ ] 連続活動日が視覚的に繋がって見える（線or連続セル）
- [ ] 土曜=青、日曜=赤色で表示
- [ ] TypeScriptエラーなし
- [ ] CSS変数を使用

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/pages/ArchivePage/ArchivePage.tsx` | 編集（タイトル変更） |
| `frontend/src/pages/ArchivePage/ArchivePage.module.css` | 編集 |
| `frontend/src/components/archive/MonthlyCalendar/MonthlyCalendar.tsx` | 編集 |
| `frontend/src/components/archive/MonthlyCalendar/MonthlyCalendar.module.css` | 編集（大幅） |
| `frontend/src/components/archive/CalendarView/CalendarView.tsx` | 編集 |
| `frontend/src/types/calendar.ts` | 編集（必要に応じて） |

## 4. 実装仕様

### カレンダーセル表示

```tsx
// MonthlyCalendar.tsx

interface CalendarCellProps {
  day: number;
  hasActivity: boolean;    // true=活動あり（黄色）、false=活動なし（グレー）
  dayOfWeek: number;       // 0=日, 1=月, ..., 6=土
}

const CalendarCell = ({ day, hasActivity, dayOfWeek }: CalendarCellProps) => {
  const className = `
    ${styles.cell}
    ${hasActivity ? styles.active : styles.inactive}
    ${dayOfWeek === 0 ? styles.sunday : ''}
    ${dayOfWeek === 6 ? styles.saturday : ''}
  `;

  return <div className={className}>{day}</div>;
};
```

### 曜日ヘッダー

```tsx
// MonthlyCalendar.tsx の曜日ヘッダー
const WEEKDAY_NAMES = ['日', '月', '火', '水', '木', '金', '土'];

const weekHeader = WEEKDAY_NAMES.map((name, i) => (
  <div key={i} className={`
    ${styles.weekdayHeader}
    ${i === 0 ? styles.sundayHeader : ''}
    ${i === 6 ? styles.saturdayHeader : ''}
  `}>
    {name}
  </div>
));
```

### スタイリング

```css
/* MonthlyCalendar.module.css */

.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: var(--spacing-lg);
}

.weekdayHeader {
  text-align: center;
  font-weight: bold;
  padding: var(--spacing-sm);
  color: var(--color-text-primary);
}

.sundayHeader {
  color: #D32F2F;  /* 赤 */
}

.saturdayHeader {
  color: #1976D2;  /* 青 */
}

.cell {
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-sm);
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.1s;
}

.cell:hover {
  transform: scale(1.05);
}

/* 活動なし: グレー */
.inactive {
  background-color: #E0E0E0;
  color: #999999;
}

/* 活動あり: 黄色 */
.active {
  background-color: #FFD54F;
  color: var(--color-text-primary);
}

/* 連続表示: 左右に白いボーダーなし */
.active + .active {
  border-left: 2px solid var(--color-text-primary);
}

/* 日曜日: 赤字 */
.cell:nth-child(7n+1) {
  color: #D32F2F;
}

/* 土曜日: 青字 */
.cell:nth-child(7n) {
  color: #1976D2;
}
```

### タイトル変更

```tsx
// ArchivePage.tsx

const ArchivePage = () => {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>実績</h1>  {/* ARCHIVE → 実績 */}
        {/* ... 既存のタブボタン ... */}
      </header>
      {/* ... */}
    </div>
  );
};
```

## 5. 連続日表示の詳細

### オプション 1: グラデーションボーダー
```css
.active {
  background: linear-gradient(to right, transparent, #FFD54F);
  position: relative;
}

.active:not(:last-child) {
  border-right: 1px dashed var(--color-text-primary);
}
```

### オプション 2: 背景グラデーション
```css
.active {
  background: linear-gradient(90deg, #FFF59D 0%, #FFD54F 50%, #FBC02D 100%);
}
```

どちらか実装チームが選択

## 6. レスポンシブ対応

モバイルでも見やすいサイズ（最小 40px × 40px）を保つ

## 7. 注意事項

- 曜日の色分けはテキスト色の変更のみ（背景色の変更はしない）
- グレー（未活動）はやや薄く、活動日の方が目立つように
- ホバーエフェクトでインタラクティブさを強調

## 8. 完了報告

```markdown
## 完了報告

### タスクID
ui-archive-calendar-improvements

### 編集ファイル
- ArchivePage.tsx - 編集（タイトル変更）
- MonthlyCalendar.tsx - 編集（曜日日本語化、色分け）
- MonthlyCalendar.module.css - 編集（大幅改善）

### 主要な変更点
- タイトル: ARCHIVE → 実績
- 曜日: 英字 → 日本語（日月火水木金土）
- 活動日: グレー/黄色で色分け
- 土日: テキスト色で色分け（土青、日赤）
- 連続活動日の視覚的繋ぎ表示

### 未解決の問題
- なし
```
