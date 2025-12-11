---
id: diary-duration-input-separate
feature: diary
depends_on: []
scope_files:
  - frontend/src/shared/components/DurationInput/
  - frontend/src/features/student/components/diary/DiaryPostForm/DiaryPostForm.tsx
forbidden_files:
  - frontend/src/shared/types/
created_at: 2025-12-11
---

# タスク: 学習時間入力の時間・分分離

> このファイルはサブエージェントへの作業指示書です。

## 0. 必読ファイル（スキップ禁止）

以下を **必ず読んでから** 作業開始:

1. `specs/overview.md` - システム全体像
2. `specs/features/diary.md` - 学習日報機能の仕様（DurationInputセクション）
3. `specs/shared/components.md` - DurationInput仕様
4. `specs/shared/conventions.md` - コーディング規約

## 1. タスク概要

現在の学習時間入力（h:mm形式の単一input）を、時間と分の2つの独立した数値入力フィールドに分離する。小中学生が直感的に入力できるUI を提供する。

## 2. 完了条件

- [ ] DurationInput コンポーネント新規作成
- [ ] 時間フィールド（0-23）と分フィールド（0-59）の2つの入力欄
- [ ] 数値のみ入力可能（type="number"）
- [ ] DiaryPostForm で DurationInput を使用
- [ ] 値の変換（分単位 ↔ 時間+分）を正しく処理
- [ ] TypeScriptエラーがないこと
- [ ] 仕様書（diary.md）との整合性確認

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/shared/components/DurationInput/DurationInput.tsx` | 新規作成 |
| `frontend/src/shared/components/DurationInput/DurationInput.module.css` | 新規作成 |
| `frontend/src/shared/components/DurationInput/index.ts` | 新規作成 |
| `frontend/src/features/student/components/diary/DiaryPostForm/DiaryPostForm.tsx` | 編集 |

**上記以外は編集禁止**

## 4. 実装仕様

### DurationInput.tsx

```typescript
import { useState, useEffect } from 'react';
import styles from './DurationInput.module.css';

interface DurationInputProps {
    value: number; // 分単位の合計時間
    onChange: (minutes: number) => void;
    label?: string;
}

const DurationInput = ({ value, onChange, label }: DurationInputProps) => {
    const [hours, setHours] = useState(Math.floor(value / 60));
    const [minutes, setMinutes] = useState(value % 60);

    // 親コンポーネントからの値変更を反映
    useEffect(() => {
        setHours(Math.floor(value / 60));
        setMinutes(value % 60);
    }, [value]);

    const handleHoursChange = (newHours: number) => {
        const validHours = Math.max(0, Math.min(23, newHours));
        setHours(validHours);
        onChange(validHours * 60 + minutes);
    };

    const handleMinutesChange = (newMinutes: number) => {
        const validMinutes = Math.max(0, Math.min(59, newMinutes));
        setMinutes(validMinutes);
        onChange(hours * 60 + validMinutes);
    };

    return (
        <div className={styles.container}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={styles.inputs}>
                <div className={styles.field}>
                    <input
                        type="number"
                        value={hours}
                        onChange={(e) => handleHoursChange(parseInt(e.target.value) || 0)}
                        min={0}
                        max={23}
                        className={styles.input}
                        aria-label="時間"
                    />
                    <span className={styles.unit}>時間</span>
                </div>
                <div className={styles.field}>
                    <input
                        type="number"
                        value={minutes}
                        onChange={(e) => handleMinutesChange(parseInt(e.target.value) || 0)}
                        min={0}
                        max={59}
                        className={styles.input}
                        aria-label="分"
                    />
                    <span className={styles.unit}>分</span>
                </div>
            </div>
        </div>
    );
};

export default DurationInput;
```

### DurationInput.module.css

```css
.container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.label {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.inputs {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.field {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.input {
  width: 60px;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-base);
  text-align: center;
}

.input:focus {
  outline: none;
  border-color: var(--color-accent-blue);
}

.unit {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}
```

### DiaryPostForm.tsx の変更

**既存のinput要素を置き換え:**

```typescript
import DurationInput from '@/shared/components/DurationInput';
// ... 既存のimport

const DiaryPostForm = ({ onAdd }: DiaryPostFormProps) => {
    const [duration, setDuration] = useState(0); // 分単位

    // ... 他のstate

    return (
        <Card title="今日の学習を記録">
            <form onSubmit={handleSubmit} className={styles.form}>
                {/* ... 他のフィールド */}

                {/* 旧実装を削除: */}
                {/* <input type="time" ... /> */}

                {/* 新実装: */}
                <DurationInput
                    value={duration}
                    onChange={setDuration}
                    label="学習時間"
                />

                {/* ... 他のフィールド */}
            </form>
        </Card>
    );
};
```

## 5. 参考実装

- `specs/features/diary.md` - DurationInput仕様
- `specs/shared/components.md` - 共通コンポーネント規約

## 6. 技術的制約

- ❌ `any` 型禁止
- ❌ CSS値ハードコード禁止（CSS変数使用）
- ❌ 外部ライブラリ追加禁止
- ✅ `import type` で型をimport
- ✅ 数値入力のバリデーション（0-23時間、0-59分）

## 7. 完了報告

### タスクID: diary-duration-input-separate

### 作成/編集ファイル:
- `DurationInput.tsx` - 時間・分分離入力コンポーネント
- `DurationInput.module.css` - スタイル
- `DiaryPostForm.tsx` - DurationInput統合

### 主要な変更点:
- 単一input → 時間・分の2フィールドに変更
- 直感的な数値入力UI
- バリデーション機能追加

### 未解決の問題: なし
