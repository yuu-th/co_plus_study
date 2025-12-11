---
id: survey-response-validation
feature: survey
depends_on: []
scope_files:
  - frontend/src/features/student/pages/SurveyResponsePage/SurveyResponsePage.tsx
  - frontend/src/features/student/components/survey/SurveyQuestionCard/SurveyQuestionCard.tsx
forbidden_files:
  - frontend/src/shared/types/survey.ts
created_at: 2025-12-11
---

# タスク: アンケート回答バリデーション強化

> このファイルはサブエージェントへの作業指示書です。

## 0. 必読ファイル（スキップ禁止）

以下を **必ず読んでから** 作業開始:

1. `specs/overview.md` - システム全体像
2. `specs/features/survey.md` - アンケート機能の仕様（バリデーションセクション）
3. `specs/shared/conventions.md` - コーディング規約

## 1. タスク概要

アンケート回答ページに必須回答チェックとエラー表示機能を追加し、未回答の必須質問がある場合に送信を防ぐ。

## 2. 完了条件

- [ ] 必須質問（required: true）の未回答チェック
- [ ] エラーメッセージ表示（質問ごと + 全体）
- [ ] 送信ボタンの有効/無効制御
- [ ] 回答済み質問の視覚的フィードバック
- [ ] TypeScriptエラーがないこと
- [ ] 仕様書（survey.md）との整合性確認

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/features/student/pages/SurveyResponsePage/SurveyResponsePage.tsx` | 編集 |
| `frontend/src/features/student/components/survey/SurveyQuestionCard/SurveyQuestionCard.tsx` | 編集 |

**上記以外は編集禁止**

## 4. 実装仕様

### SurveyResponsePage.tsx の変更

```typescript
import { useState, useMemo } from 'react';
import type { Survey, SurveyResponse } from '@/shared/types';
// ... 既存のimport

const SurveyResponsePage = () => {
    const [responses, setResponses] = useState<Record<string, unknown>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showGlobalError, setShowGlobalError] = useState(false);

    // 仮のsurveyデータ
    const survey: Survey = mockSurveys[0];

    // 必須質問の未回答チェック
    const validateResponses = (): boolean => {
        const newErrors: Record<string, string> = {};

        survey.questions.forEach((q) => {
            if (q.required && !responses[q.id]) {
                newErrors[q.id] = 'この質問は必須です';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 送信ボタンの有効/無効
    const canSubmit = useMemo(() => {
        return survey.questions
            .filter(q => q.required)
            .every(q => !!responses[q.id]);
    }, [responses, survey.questions]);

    const handleSubmit = () => {
        if (!validateResponses()) {
            setShowGlobalError(true);
            // 最初のエラー位置にスクロール
            const firstErrorId = Object.keys(errors)[0];
            document.getElementById(`question-${firstErrorId}`)?.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        const response: SurveyResponse = {
            id: `response-${Date.now()}`,
            surveyId: survey.id,
            userId: 'student-1',
            answers: survey.questions.map(q => ({
                questionId: q.id,
                value: responses[q.id],
            })),
            submittedAt: new Date().toISOString(),
        };

        console.log('アンケート送信:', response);
        alert('回答を送信しました');
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>{survey.title}</h1>
            <p className={styles.description}>{survey.description}</p>

            {showGlobalError && Object.keys(errors).length > 0 && (
                <div className={styles.globalError}>
                    未回答の必須質問があります。すべて回答してください。
                </div>
            )}

            <div className={styles.questions}>
                {survey.questions.map((q) => (
                    <SurveyQuestionCard
                        key={q.id}
                        question={q}
                        value={responses[q.id]}
                        onChange={(value) => {
                            setResponses(prev => ({ ...prev, [q.id]: value }));
                            // エラーをクリア
                            if (errors[q.id]) {
                                setErrors(prev => {
                                    const { [q.id]: _, ...rest } = prev;
                                    return rest;
                                });
                            }
                        }}
                        error={errors[q.id]}
                    />
                ))}
            </div>

            <div className={styles.actions}>
                <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className={`${styles.submitBtn} ${!canSubmit ? styles.disabled : ''}`}
                >
                    送信
                </button>
            </div>
        </div>
    );
};
```

### SurveyQuestionCard.tsx の変更

```typescript
interface SurveyQuestionCardProps {
    question: Question;
    value: unknown;
    onChange: (value: unknown) => void;
    error?: string;  // 追加
}

const SurveyQuestionCard = ({ question, value, onChange, error }: SurveyQuestionCardProps) => {
    return (
        <div id={`question-${question.id}`} className={styles.card}>
            <div className={styles.header}>
                <h3 className={styles.questionText}>
                    {question.text}
                    {question.required && <span className={styles.required}>*</span>}
                </h3>
            </div>

            {/* 質問タイプに応じた入力UI */}
            <div className={styles.inputArea}>
                {/* ... 既存の入力フィールド */}
            </div>

            {/* エラー表示 */}
            {error && (
                <p className={styles.error}>{error}</p>
            )}

            {/* 回答済みインジケータ */}
            {!error && value && (
                <p className={styles.completed}>✓ 回答済み</p>
            )}
        </div>
    );
};
```

### CSS の追加

```css
/* SurveyResponsePage.module.css */
.globalError {
  background-color: var(--color-error-light);
  color: var(--color-error);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.submitBtn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* SurveyQuestionCard.module.css */
.required {
  color: var(--color-error);
  margin-left: var(--spacing-xs);
}

.error {
  color: var(--color-error);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
}

.completed {
  color: var(--color-success);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
}
```

## 5. 参考実装

- `specs/features/survey.md` - バリデーション仕様
- `frontend/src/shared/types/survey.ts` - Question型のrequiredフィールド確認

## 6. 技術的制約

- ❌ `any` 型禁止
- ❌ CSS値ハードコード禁止（CSS変数使用）
- ❌ 外部バリデーションライブラリ禁止
- ✅ `import type` で型をimport
- ✅ useMemo でバリデーション最適化

## 7. 完了報告

### タスクID: survey-response-validation

### 作成/編集ファイル:
- `SurveyResponsePage.tsx` - バリデーションロジック追加
- `SurveyQuestionCard.tsx` - エラー表示追加

### 主要な変更点:
- 必須回答チェック機能
- エラーメッセージ表示
- 送信ボタン制御
- 回答済みフィードバック

### 未解決の問題: なし
