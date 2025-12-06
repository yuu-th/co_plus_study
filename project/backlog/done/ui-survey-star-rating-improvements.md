---
id: ui-survey-star-rating-improvements
feature: survey
depends_on:
  - design-spec-survey-improvements
scope_files:
  - frontend/src/components/survey/QuestionItem/QuestionItem.tsx
  - frontend/src/components/survey/QuestionItem/QuestionItem.module.css
  - frontend/src/components/survey/StarRating/StarRating.tsx
  - frontend/src/components/survey/StarRating/StarRating.module.css
  - frontend/src/types/survey.ts
forbidden_files:
  - frontend/src/mockData/
  - frontend/src/pages/
created_at: 2025-11-27
---

# タスク: アンケート星評価UI実装（☆アイコン表示）

> このファイルはサブエージェントへの作業指示書です。

## 0. 最初に必ず読むファイル（スキップ禁止）

| 順序 | ファイル | 読む目的 |
|------|----------|----------|
| 1 | `specs/overview.md` | システム全体像・技術制約 |
| 2 | `specs/features/survey.md` | 更新されたアンケート仕様 |
| 3 | `specs/shared/conventions.md` | コーディング規約 |

## 1. タスク概要

アンケートの rating 設問を改善する。
現在の数字（1～5）表示から、大きな☆アイコンを使った直感的なUI に改善する。

## 2. 完了条件

- [ ] StarRating コンポーネントが新規作成される
- [ ] ☆アイコンが5個並んで表示される
- [ ] クリック/タップで選択可能
- [ ] 選択済みは金色、未選択はグレー
- [ ] TypeScriptエラーなし
- [ ] CSS変数を使用

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/components/survey/StarRating/StarRating.tsx` | 新規作成 |
| `frontend/src/components/survey/StarRating/StarRating.module.css` | 新規作成 |
| `frontend/src/components/survey/QuestionItem/QuestionItem.tsx` | 編集 |
| `frontend/src/components/survey/QuestionItem/QuestionItem.module.css` | 編集 |
| `frontend/src/types/survey.ts` | 編集（必要に応じて） |

## 4. 実装仕様

### StarRating コンポーネント

```tsx
// StarRating.tsx

import { FaStar } from 'react-icons/fa';
import styles from './StarRating.module.css';

interface StarRatingProps {
  value: number | null;           // 現在の値（1～5 or null）
  onChange: (value: number) => void;
  disabled?: boolean;
}

const StarRating = ({ value, onChange, disabled = false }: StarRatingProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue || value || 0;

  return (
    <div className={styles.container}>
      <div className={styles.starGroup}>
        {[1, 2, 3, 4, 5].map(i => (
          <button
            key={i}
            type="button"
            className={`${styles.star} ${i <= displayValue ? styles.filled : styles.empty}`}
            onClick={() => {
              if (!disabled) onChange(i);
            }}
            onMouseEnter={() => !disabled && setHoverValue(i)}
            onMouseLeave={() => setHoverValue(null)}
            onTouchStart={() => !disabled && setHoverValue(i)}
            onTouchEnd={() => setHoverValue(null)}
            aria-label={`${i}星を選択`}
            disabled={disabled}
          >
            <FaStar />
          </button>
        ))}
      </div>
      {value && <p className={styles.label}>{value}つ星</p>}
    </div>
  );
};

export default StarRating;
```

### スタイリング

```css
/* StarRating.module.css */

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.starGroup {
  display: flex;
  gap: var(--spacing-sm);
}

.star {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 2rem;              /* 大きく */
  color: var(--color-badge-gold);  /* デフォルト: 金色 */
  transition: color 0.1s, transform 0.1s;
  padding: var(--spacing-xs);
}

.star:hover {
  transform: scale(1.15);
}

.star:active {
  transform: scale(0.95);
}

.star:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* 未選択: グレー */
.empty {
  color: #CCCCCC;
}

/* 選択済み: 金色 */
.filled {
  color: var(--color-badge-gold);
}

.label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: 0;
}

/* モバイル: さらに大きく */
@media (max-width: 600px) {
  .star {
    font-size: 2.5rem;
  }
}
```

### QuestionItem での使用

```tsx
// QuestionItem.tsx
// rating タイプの質問を処理する部分を修正

import StarRating from '../StarRating/StarRating';

const QuestionItem = ({ question, value, onChange }: QuestionItemProps) => {
  // ...

  if (question.type === 'rating') {
    return (
      <div className={styles.question}>
        <label>{question.text}</label>
        <StarRating
          value={value as number | null}
          onChange={v => onChange(v)}
          disabled={disabled}
        />
      </div>
    );
  }

  // ... その他の質問タイプ ...
};
```

### 型定義更新

```typescript
// types/survey.ts
// 既存の rating タイプに対応する Answer 型は以下の通り

type Answer = {
  questionId: string;
  value: string | string[] | number;  // rating の場合は number（1～5）
};
```

## 5. インタラクション詳細

- **ホバー**: マウスホバーで☆が大きくなる（プレビュー）
- **クリック**: クリック位置の☆まで選択
- **タッチ**: モバイルでもタッチで選択可能
- **未選択**: グレー（#CCCCCC）
- **選択済み**: 金色（`--color-badge-gold`）

## 6. アクセシビリティ

```tsx
// スクリーンリーダー対応
<button
  aria-label={`${i}星を選択`}
  role="radio"
  aria-checked={i === value}
/>
```

## 7. 注意事項

- FaStar（react-icons）を使用
- クリック範囲を十分に確保（最小 48px × 48px）
- モバイルでも操作しやすいサイズ

## 8. 完了報告

```markdown
## 完了報告

### タスクID
ui-survey-star-rating-improvements

### 作成/編集ファイル
- StarRating.tsx - 新規作成
- StarRating.module.css - 新規作成
- QuestionItem.tsx - 編集（rating タイプ対応）
- QuestionItem.module.css - 編集

### 主要な変更点
- ☆アイコン5個を大きく表示
- クリック/タップで選択可能
- ホバーでプレビュー表示
- 未選択=グレー、選択済み=金色

### 未解決の問題
- なし
```
