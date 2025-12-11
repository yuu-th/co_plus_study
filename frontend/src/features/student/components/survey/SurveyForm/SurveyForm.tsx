import { useMemo, useState } from 'react';
import type { Answer, Survey, SurveyResponse } from '@/shared/types';
import SurveyQuestionCard from '../SurveyQuestionCard/SurveyQuestionCard';
import styles from './SurveyForm.module.css';

interface SurveyFormProps {
    survey: Survey;
    onSubmit: (response: SurveyResponse) => void;
}

const SurveyForm = ({ survey, onSubmit }: SurveyFormProps) => {
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [submitted, setSubmitted] = useState(false);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showGlobalError, setShowGlobalError] = useState(false);

    const handleChange = (answer: Answer) => {
        setAnswers(prev => {
            const idx = prev.findIndex(a => a.questionId === answer.questionId);
            let next;
            if (idx >= 0) {
                const copy = prev.slice();
                copy[idx] = answer;
                next = copy;
            } else {
                next = [...prev, answer];
            }
            return next;
        });

        // Clear error for this question
        if (errors[answer.questionId]) {
            setErrors(prev => {
                const { [answer.questionId]: _, ...rest } = prev;
                return rest;
            });
        }
    };

    const validateResponses = (): boolean => {
        const newErrors: Record<string, string> = {};
        survey.questions.forEach((q) => {
            if (q.required) {
                const ans = answers.find(a => a.questionId === q.id);
                const val = ans?.value;
                const isMissing = !val || (Array.isArray(val) && val.length === 0);
                if (isMissing) {
                    newErrors[q.id] = 'この質問は必須です';
                }
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const canSubmit = useMemo(() => {
        return survey.questions
            .filter(q => q.required)
            .every(q => {
                const ans = answers.find(a => a.questionId === q.id);
                const val = ans?.value;
                return val && (!Array.isArray(val) || val.length > 0);
            });
    }, [answers, survey.questions]);

    const disabled = submitted || survey.status === 'scheduled' || survey.status === 'closed' || !canSubmit;

    const handleSubmit = () => {
        if (disabled) return;

        if (!validateResponses()) {
            setShowGlobalError(true);
            // const firstErrorId = Object.keys(errors)[0];
            // Re-calculate first error id from result of validateResponses logic if needed, but state update batching might be an issue.
            // Actually, validateResponses returns false if errors found.
            // We can scroll to the first missing required question found in validateResponses logic.
            // Simple fix: finding first missing directly here or just showing global error.
            // The prompt code relies on `Object.keys(errors)[0]` but since setErrors is async, this is buggy in React. 
            // Correction: do finding first error locally.
            const firstMissing = survey.questions.find(q => q.required && !answers.find(a => a.questionId === q.id)?.value);
            if (firstMissing) {
                document.getElementById(`question-${firstMissing.id}`)?.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        }

        const response: SurveyResponse = {
            surveyId: survey.id,
            userId: '1',
            answers,
            submittedAt: new Date().toISOString(),
        };
        onSubmit(response);
        setSubmitted(true);
    };

    return (
        <div className={styles.form} aria-label="アンケートフォーム">
            <div className={styles.header}>
                <h2>{survey.title}</h2>
                {survey.description && <p>{survey.description}</p>}
                <div className={styles.status}>
                    状態: {survey.status || 'draft'} / 期限: {survey.dueDate ? new Date(survey.dueDate).toLocaleDateString('ja-JP') : '未設定'}
                </div>
            </div>

            {showGlobalError && Object.keys(errors).length > 0 && (
                <div className={styles.globalError}>
                    未回答の必須質問があります。すべて回答してください。
                </div>
            )}

            <div className={styles.questions}>
                {survey.questions.map(q => (
                    <SurveyQuestionCard
                        key={q.id}
                        question={q}
                        value={answers.find(a => a.questionId === q.id)?.value}
                        onChange={(value) => handleChange({ questionId: q.id, value: value as string | string[] | number })}
                        error={errors[q.id]}
                    />
                ))}
            </div>
            <div className={styles.actions}>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={disabled}
                    className={`${styles.submitBtn} ${disabled ? styles.disabled : ''}`}
                >
                    送信
                </button>
            </div>
            {submitted && <div role="status" aria-live="polite">送信が完了しました。ありがとうございました。</div>}
        </div>
    );
};

export default SurveyForm;
