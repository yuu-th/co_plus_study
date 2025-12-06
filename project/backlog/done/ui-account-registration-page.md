---
id: ui-account-registration-page
feature: home
depends_on:
  - design-spec-home-improvements
scope_files:
  - frontend/src/pages/AccountRegistrationPage/AccountRegistrationPage.tsx
  - frontend/src/pages/AccountRegistrationPage/AccountRegistrationPage.module.css
  - frontend/src/router.tsx
  - frontend/src/types/user.ts
forbidden_files:
  - frontend/src/mockData/
created_at: 2025-11-27
---

# タスク: アカウント登録画面実装

> このファイルはサブエージェントへの作業指示書です。

## 0. 最初に必ず読むファイル（スキップ禁止）

| 順序 | ファイル | 読む目的 |
|------|----------|----------|
| 1 | `specs/overview.md` | システム全体像・技術制約 |
| 2 | `specs/features/home.md` | ホーム画面仕様（作成後） |
| 3 | `specs/shared/conventions.md` | コーディング規約 |

## 1. タスク概要

初回ユーザー向けのアカウント登録画面を新規作成する。
ユーザー名、フリガナ、その他必要な情報を入力し、ホームページへ遷移する。

## 2. 完了条件

- [ ] AccountRegistrationPage が新規作成
- [ ] 入力フォーム: ユーザー名、フリガナ、学年（オプション）等
- [ ] バリデーション実装
- [ ] 送信後、ホームページへ遷移
- [ ] TypeScriptエラーなし
- [ ] CSS変数を使用
- [ ] router.tsx に /register ルート追加

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/pages/AccountRegistrationPage/AccountRegistrationPage.tsx` | 新規作成 |
| `frontend/src/pages/AccountRegistrationPage/AccountRegistrationPage.module.css` | 新規作成 |
| `frontend/src/router.tsx` | 編集（ルート追加） |
| `frontend/src/types/user.ts` | 編集（必要に応じて） |

## 4. 実装仕様

### アカウント登録フォーム

```tsx
// AccountRegistrationPage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import styles from './AccountRegistrationPage.module.css';

interface RegistrationForm {
  name: string;              // ユーザー名
  kana: string;              // フリガナ
  grade?: string;            // 学年（小1～中3）
}

const AccountRegistrationPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegistrationForm>({
    name: '',
    kana: '',
    grade: '小1',
  });
  const [errors, setErrors] = useState<string[]>([]);

  const GRADES = [
    '小1', '小2', '小3', '小4', '小5', '小6',
    '中1', '中2', '中3',
  ];

  const validate = (): boolean => {
    const errs: string[] = [];

    if (!form.name.trim()) {
      errs.push('ユーザー名を入力してください');
    } else if (form.name.length > 20) {
      errs.push('ユーザー名は20文字以内です');
    }

    if (!form.kana.trim()) {
      errs.push('フリガナを入力してください');
    } else if (!/^[ぁ-んァ-ヴー一-龥々〆〤]*$/.test(form.kana)) {
      errs.push('フリガナはカタカナまたはひらがなで入力してください');
    }

    setErrors(errs);
    return errs.length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // モックデータに登録（実装時はバックエンドへ）
    // ここでは単にホームへ遷移
    navigate('/');
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>アカウント登録</h1>
        <p className={styles.subtitle}>Co+ Study へようこそ！</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* ユーザー名 */}
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              ユーザー名 <span className={styles.required}>*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              maxLength={20}
              className={styles.input}
              placeholder="例: 田中太郎"
              required
            />
            <p className={styles.hint}>最大20文字</p>
          </div>

          {/* フリガナ */}
          <div className={styles.field}>
            <label htmlFor="kana" className={styles.label}>
              フリガナ <span className={styles.required}>*</span>
            </label>
            <input
              id="kana"
              type="text"
              name="kana"
              value={form.kana}
              onChange={handleChange}
              className={styles.input}
              placeholder="例: たなかたろう"
              required
            />
            <p className={styles.hint}>ひらがなまたはカタカナ</p>
          </div>

          {/* 学年 */}
          <div className={styles.field}>
            <label htmlFor="grade" className={styles.label}>
              学年
            </label>
            <select
              id="grade"
              name="grade"
              value={form.grade}
              onChange={handleChange}
              className={styles.select}
            >
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* エラー表示 */}
          {errors.length > 0 && (
            <div className={styles.errorContainer} role="alert">
              {errors.map((err, i) => (
                <p key={i} className={styles.error}>{err}</p>
              ))}
            </div>
          )}

          {/* ボタン */}
          <div className={styles.actions}>
            <Button type="submit" variant="primary">
              登録する
            </Button>
          </div>
        </form>

        <p className={styles.footer}>
          登録することで、利用規約に同意します
        </p>
      </div>
    </div>
  );
};

export default AccountRegistrationPage;
```

### スタイリング

```css
/* AccountRegistrationPage.module.css */

.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-primary);
  padding: var(--spacing-lg);
}

.container {
  width: 100%;
  max-width: 500px;
  background: var(--color-bg-secondary);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.subtitle {
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.label {
  font-weight: bold;
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
}

.required {
  color: #FF0000;
  margin-left: 2px;
}

.input,
.select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-md);
  color: var(--color-text-primary);
  background-color: white;
}

.input:focus,
.select:focus {
  outline: none;
  border-color: var(--color-accent-blue);
  box-shadow: 0 0 0 3px rgba(65, 105, 225, 0.1);
}

.hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin: 0;
}

.errorContainer {
  background-color: #FFEBEE;
  border-left: 4px solid #F44336;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
}

.error {
  color: #F44336;
  font-size: var(--font-size-sm);
  margin: 0;
}

.actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.footer {
  text-align: center;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-lg);
}

@media (max-width: 600px) {
  .container {
    padding: var(--spacing-md);
  }

  .title {
    font-size: var(--font-size-lg);
  }
}
```

### ルーティング

```typescript
// router.tsx
import AccountRegistrationPage from './pages/AccountRegistrationPage/AccountRegistrationPage';

// routes配列に追加:
{
  path: '/register',
  element: <AccountRegistrationPage />,
}
```

## 5. 注意事項

- フリガナ入力のバリデーションは厳密に（ひらがな/カタカナのみ）
- ユーザー名の長さ制限を設定
- 学年は選択肢から選ぶ（自由入力ではなく）
- 実装時はモックデータに登録するか、バックエンドへ送信

## 6. 完了報告

```markdown
## 完了報告

### タスクID
ui-account-registration-page

### 作成/編集ファイル
- AccountRegistrationPage.tsx - 新規作成
- AccountRegistrationPage.module.css - 新規作成
- router.tsx - 編集（/register ルート追加）

### 主要な変更点
- アカウント登録フォーム実装
- ユーザー名、フリガナ、学年入力
- バリデーション・エラー表示
- 送信後、ホーム画面へ遷移

### 未解決の問題
- なし
```
