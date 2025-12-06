---
id: ui-diary-time-input-improvements
feature: diary
depends_on:
  - design-spec-diary-improvements
scope_files:
  - frontend/src/components/diary/DiaryPostForm/DiaryPostForm.tsx
  - frontend/src/components/diary/DiaryPostForm/DiaryPostForm.module.css
  - frontend/src/types/diary.ts
  - frontend/src/utils/formatTime.ts
forbidden_files:
  - frontend/src/mockData/
  - frontend/src/pages/
created_at: 2025-11-27
---

# タスク: 学習時間入力UI改善（「XXX時間YY分」形式）

> このファイルはサブエージェントへの作業指示書です。

## 0. 最初に必ず読むファイル（スキップ禁止）

| 順序 | ファイル | 読む目的 |
|------|----------|----------|
| 1 | `specs/overview.md` | システム全体像・技術制約 |
| 2 | `specs/features/diary.md` | 更新された日報仕様 |
| 3 | `specs/shared/conventions.md` | コーディング規約 |

## 1. タスク概要

学習時間の入力UI を改善する。
現在の「分」単位の入力から、「h:mm」形式（または「XX時間YY分」表示）に変更し、ユーザビリティを向上させる。

## 2. 完了条件

- [ ] DiaryPostForm で時間入力が改善されている
- [ ] 入力形式が「0:00～999:59」の h:mm 形式
- [ ] 表示形式が「XXX時間YY分」（例: 「1時間30分」）
- [ ] バリデーションが正しく機能
- [ ] formatTime ユーティリティが実装されている
- [ ] TypeScriptエラーなし

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/components/diary/DiaryPostForm/DiaryPostForm.tsx` | 編集 |
| `frontend/src/components/diary/DiaryPostForm/DiaryPostForm.module.css` | 編集 |
| `frontend/src/types/diary.ts` | 編集（duration フィールド）※必要に応じて |
| `frontend/src/utils/formatTime.ts` | 新規作成 |

## 4. 実装仕様

### 時間入力形式

内部データは **分（minutes）** で管理（既存との互換性）:

```typescript
// DiaryFormData
interface DiaryFormData {
  subject: string;
  duration: number;      // 内部: 分（0～59940分 = 999時間59分）
  content: string;
}

// ユーザー入力は h:mm 形式
interface TimeInput {
  hours: number;         // 0～999
  minutes: number;       // 0～59
}
```

### 変換ロジック

```typescript
// utils/formatTime.ts

/** 分を h:mm 形式の文字列に変換 */
export const minutesToHM = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}:${String(m).padStart(2, '0')}`;
};

/** h:mm 形式の文字列を分に変換 */
export const hmToMinutes = (hm: string): number | null => {
  const match = hm.match(/^(\d{1,3}):([0-5]\d)$/);
  if (!match) return null;
  const [_, h, m] = match;
  return parseInt(h) * 60 + parseInt(m);
};

/** 分を「XXX時間YY分」形式で表示 */
export const minutesToJapanese = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}分`;
  if (m === 0) return `${h}時間`;
  return `${h}時間${m}分`;
};
```

### DiaryPostForm の改善

```tsx
// DiaryPostForm.tsx

const INITIAL: DiaryFormData = { 
  subject: '算数', 
  duration: 30,  // 30分
  content: '' 
};

const DiaryPostForm = ({ onAdd }: DiaryPostFormProps) => {
  const [form, setForm] = useState<DiaryFormData>(INITIAL);
  const [timeInput, setTimeInput] = useState<string>(minutesToHM(INITIAL.duration));
  const [errors, setErrors] = useState<string[]>([]);

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!form.subject) errs.push('教科を選択してください');
    
    const minutes = hmToMinutes(timeInput);
    if (minutes === null || minutes < 1 || minutes > 59940) {
      errs.push('学習時間は 0:01～999:59 で入力してください');
    }
    
    if (!form.content.trim()) errs.push('内容を入力してください');
    if (form.content.length > MAX_CONTENT) errs.push(`内容は${MAX_CONTENT}文字以内`);
    
    setErrors(errs);
    return errs.length === 0;
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const minutes = hmToMinutes(timeInput);
    if (minutes === null) return;
    
    const now = new Date();
    const newPost: DiaryPost = {
      id: `temp-${now.getTime()}`,
      userId: '1',
      userName: '田中太郎',
      subject: form.subject,
      duration: minutes,  // 分で保存
      content: form.content.trim(),
      timestamp: now.toISOString(),
      reactions: [],
    };
    onAdd(newPost);
    setForm(INITIAL);
    setTimeInput(minutesToHM(INITIAL.duration));
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <select
          name="subject"
          value={form.subject}
          onChange={e => setForm(prev => ({ ...prev, subject: e.target.value }))}
          className={styles.subjectSelect}
          required
        >
          {mockSubjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        
        {/* 改善: h:mm 形式の入力欄 */}
        <input
          type="text"
          value={timeInput}
          onChange={handleTimeChange}
          placeholder="0:30"
          className={styles.timeInput}
          aria-label="学習時間"
          pattern="^[0-9]{1,3}:[0-5][0-9]$"
          required
        />
        
        {/* 表示: 「XXX時間YY分」 */}
        <span className={styles.timeDisplay}>
          {minutesToJapanese(hmToMinutes(timeInput) || 0)}
        </span>
      </div>
      
      <textarea
        name="content"
        value={form.content}
        onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
        maxLength={MAX_CONTENT}
        className={styles.textarea}
        placeholder="今日学んだ内容..."
        required
      />
      
      {errors.length > 0 && (
        <div role="alert">
          {errors.map((e, i) => <p key={i} className={styles.error}>{e}</p>)}
        </div>
      )}
      
      <div className={styles.actions}>
        <button type="submit">投稿</button>
      </div>
    </form>
  );
};
```

## 5. スタイリング

```css
/* DiaryPostForm.module.css */

.row {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  align-items: center;
}

.subjectSelect {
  flex: 1;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
}

.timeInput {
  width: 80px;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-family: monospace;
  text-align: center;
}

.timeInput::placeholder {
  color: var(--color-text-secondary);
}

.timeDisplay {
  font-weight: bold;
  color: var(--color-accent-blue);
  font-size: var(--font-size-lg);
  white-space: nowrap;
}
```

## 6. 注意事項

- 内部では分（minutes）で保持し、既存データとの互換性を確保
- 入力値のバリデーションを厳密に
- ユーザーに入力形式のヒント（「h:mm」）を表示

## 7. 完了報告

```markdown
## 完了報告

### タスクID
ui-diary-time-input-improvements

### 作成/編集ファイル
- DiaryPostForm.tsx - 編集（時間入力UI改善）
- DiaryPostForm.module.css - 編集（スタイル追加）
- formatTime.ts - 新規作成（変換ユーティリティ）

### 主要な変更点
- 時間入力を h:mm 形式に改善
- 表示を「XXX時間YY分」に統一
- バリデーション強化（0:01～999:59）

### 未解決の問題
- なし
```
