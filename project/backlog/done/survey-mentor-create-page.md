---
id: survey-mentor-create-page
feature: survey
depends_on: []
scope_files:
  - frontend/src/features/mentor/pages/SurveyCreatePage/
  - frontend/src/features/mentor/routes.tsx
forbidden_files:
  - frontend/src/shared/types/
  - frontend/src/features/student/
created_at: 2025-12-11
---

# タスク: アンケート作成画面（メンター側・最小実装）

> このファイルはサブエージェントへの作業指示書です。

## 0. 必読ファイル（スキップ禁止）

以下を **必ず読んでから** 作業開始:

1. `specs/overview.md` - システム全体像
2. `specs/features/survey.md` - アンケート機能の仕様
3. `specs/features/mentor.md` - メンター管理機能の仕様
4. `specs/shared/conventions.md` - コーディング規約

## 1. タスク概要

メンターがアンケートを作成できる簡易画面を実装する。最小限の機能（タイトル・説明・質問の追加）のみを提供し、保存時はモックデータに追加する。

## 2. 完了条件

- [ ] SurveyCreatePage コンポーネント新規作成
- [ ] タイトル・説明入力フォーム
- [ ] 質問追加機能（テキスト・単一選択・複数選択・評価）
- [ ] プレビュー機能（簡易）
- [ ] 保存ボタン（モックデータに追加）
- [ ] /mentor/surveys/new ルート追加
- [ ] TypeScriptエラーがないこと
- [ ] 仕様書（survey.md）との整合性確認

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/features/mentor/pages/SurveyCreatePage/SurveyCreatePage.tsx` | 新規作成 |
| `frontend/src/features/mentor/pages/SurveyCreatePage/SurveyCreatePage.module.css` | 新規作成 |
| `frontend/src/features/mentor/pages/SurveyCreatePage/index.ts` | 新規作成 |
| `frontend/src/features/mentor/routes.tsx` | 編集（ルート追加） |

**上記以外は編集禁止**

## 4. 実装仕様

### SurveyCreatePage.tsx

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/shared/components/Button';
import Card from '@/shared/components/Card';
import type { Survey, Question, QuestionType } from '@/shared/types';
import styles from './SurveyCreatePage.module.css';

const SurveyCreatePage = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [showPreview, setShowPreview] = useState(false);

    const addQuestion = (type: QuestionType) => {
        const newQuestion: Question = {
            id: `q${questions.length + 1}`,
            type,
            text: '',
            required: false,
            options: type === 'single' || type === 'multiple' ? ['選択肢1'] : undefined,
        };
        setQuestions([...questions, newQuestion]);
    };

    const updateQuestion = (index: number, field: keyof Question, value: unknown) => {
        const updated = [...questions];
        updated[index] = { ...updated[index], [field]: value };
        setQuestions(updated);
    };

    const removeQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        const newSurvey: Survey = {
            id: `survey-${Date.now()}`,
            title,
            description,
            questions,
            releaseDate: new Date().toISOString(),
            targetGroups: ['students'],
            status: 'active',
        };

        // モックデータに追加（実際はここでAPIコール）
        console.log('新規アンケート作成:', newSurvey);
        alert('アンケートを作成しました（モックデータに保存）');
        navigate('/mentor/dashboard');
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>アンケート作成</h1>
                <div className={styles.actions}>
                    <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                        {showPreview ? '編集に戻る' : 'プレビュー'}
                    </Button>
                    <Button variant="primary" onClick={handleSave} disabled={!title || questions.length === 0}>
                        保存
                    </Button>
                </div>
            </div>

            {showPreview ? (
                <Card title="プレビュー">
                    <h2>{title}</h2>
                    <p>{description}</p>
                    {questions.map((q, i) => (
                        <div key={i} className={styles.previewQuestion}>
                            <p><strong>Q{i + 1}:</strong> {q.text || '（未入力）'}</p>
                            <p>タイプ: {q.type} {q.required && '（必須）'}</p>
                        </div>
                    ))}
                </Card>
            ) : (
                <div className={styles.form}>
                    <Card title="基本情報">
                        <div className={styles.field}>
                            <label className={styles.label}>タイトル *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="例: 今週の学習振り返り"
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>説明</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="アンケートの目的や回答方法を説明"
                                className={styles.textarea}
                            />
                        </div>
                    </Card>

                    <Card title="質問">
                        {questions.map((q, i) => (
                            <div key={i} className={styles.questionItem}>
                                <div className={styles.questionHeader}>
                                    <span>質問 {i + 1}</span>
                                    <button onClick={() => removeQuestion(i)} className={styles.removeBtn}>
                                        削除
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={q.text}
                                    onChange={(e) => updateQuestion(i, 'text', e.target.value)}
                                    placeholder="質問文を入力"
                                    className={styles.input}
                                />
                                <label className={styles.checkbox}>
                                    <input
                                        type="checkbox"
                                        checked={q.required}
                                        onChange={(e) => updateQuestion(i, 'required', e.target.checked)}
                                    />
                                    必須回答
                                </label>
                            </div>
                        ))}

                        <div className={styles.addButtons}>
                            <Button size="small" onClick={() => addQuestion('text')}>
                                テキスト質問を追加
                            </Button>
                            <Button size="small" onClick={() => addQuestion('single')}>
                                単一選択を追加
                            </Button>
                            <Button size="small" onClick={() => addQuestion('multiple')}>
                                複数選択を追加
                            </Button>
                            <Button size="small" onClick={() => addQuestion('rating')}>
                                評価を追加
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default SurveyCreatePage;
```

### SurveyCreatePage.module.css

```css
.page {
  padding: var(--spacing-lg);
  max-width: 800px;
  margin: 0 auto;
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

.actions {
  display: flex;
  gap: var(--spacing-sm);
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.field {
  margin-bottom: var(--spacing-md);
}

.label {
  display: block;
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-primary);
}

.input,
.textarea {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-base);
}

.textarea {
  min-height: 100px;
  resize: vertical;
}

.questionItem {
  padding: var(--spacing-md);
  background-color: var(--color-bg-secondary);
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--spacing-md);
}

.questionHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
  font-weight: var(--font-weight-medium);
}

.removeBtn {
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-error);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.checkbox {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-sm);
  cursor: pointer;
}

.addButtons {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.previewQuestion {
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-sm);
  background-color: var(--color-bg-secondary);
  border-radius: var(--border-radius-sm);
}
```

### routes.tsx への追加

```typescript
import SurveyCreatePage from './pages/SurveyCreatePage';

// 既存のルート配列に追加
{
  path: '/mentor/surveys/new',
  element: <SurveyCreatePage />,
},
```

## 5. 参考実装

- `specs/features/survey.md` - アンケート仕様
- `frontend/src/features/mentor/pages/NotificationManagePage/` - 類似の作成画面
- `frontend/src/shared/types/survey.ts` - Survey, Question 型確認

## 6. 技術的制約

- ❌ `any` 型禁止
- ❌ CSS値ハードコード禁止（CSS変数使用）
- ❌ 外部ライブラリ追加禁止
- ✅ `import type` で型をimport
- ✅ 実際の保存はconsole.log（バックエンドなし）

## 7. 完了報告

### タスクID: survey-mentor-create-page

### 作成/編集ファイル:
- `SurveyCreatePage.tsx` - アンケート作成画面
- `SurveyCreatePage.module.css` - スタイル
- `routes.tsx` - /mentor/surveys/new ルート追加

### 主要な変更点:
- メンター向けアンケート作成機能（最小実装）
- タイトル・説明・質問の入力
- 簡易プレビュー機能

### 未解決の問題: なし
