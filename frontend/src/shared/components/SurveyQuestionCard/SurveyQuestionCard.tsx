// @see specs/features/survey.md
// QuestionItem - アンケート質問項目

import type { Answer, Question } from '@/shared/types';
import RatingInput from '../StarRating';
import styles from './QuestionItem.module.css';

interface QuestionItemProps {
    question: Question;
    value: string | string[] | number | undefined;
    onChange: (answer: Answer) => void;
    disabled?: boolean;
    error?: string;
}

const QuestionItem = ({ question, value, onChange, disabled = false, error }: QuestionItemProps) => {
    const handleSingle = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({ questionId: question.id, value: e.target.value });
    };

    const handleMultiple = (opt: string) => {
        const current = Array.isArray(value) ? value.slice() : [];
        const exists = current.includes(opt);
        const next = exists ? current.filter(v => v !== opt) : [...current, opt];
        onChange({ questionId: question.id, value: next });
    };

    const handleText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange({ questionId: question.id, value: e.target.value });
    };

    const handleRating = (rating: number) => {
        onChange({ questionId: question.id, value: rating });
    };

    return (
        <div id={`question-${question.id}`} className={styles.question} aria-label={`質問 ${question.text}`}>
            <div className={styles.title}>
                {question.text}
                {question.required && <span className={styles.required}> *</span>}
            </div>

            {question.type === 'single' && (
                <select
                    value={(value as string) || ''}
                    onChange={handleSingle}
                    aria-label={question.text}
                    required={question.required}
                    disabled={disabled}
                    className={styles.select}
                >
                    <option value="">選択してください</option>
                    {question.options?.map(o => (
                        <option key={o} value={o}>{o}</option>
                    ))}
                </select>
            )}

            {question.type === 'multiple' && (
                <div className={styles.options}>
                    {question.options?.map(o => {
                        const checked = Array.isArray(value) && value.includes(o);
                        return (
                            <button
                                type="button"
                                key={o}
                                onClick={() => handleMultiple(o)}
                                aria-pressed={checked}
                                disabled={disabled}
                                className={`${styles.optionButton} ${checked ? styles.selected : ''}`}
                            >
                                {o}
                            </button>
                        );
                    })}
                </div>
            )}

            {question.type === 'text' && (
                <textarea
                    className={styles.text}
                    value={(value as string) || ''}
                    onChange={handleText}
                    aria-label={question.text}
                    placeholder="自由記述"
                    disabled={disabled}
                />
            )}

            {question.type === 'rating' && (
                <div className={styles.ratingContainer}>
                    <RatingInput
                        value={typeof value === 'number' ? value : null}
                        onChange={handleRating}
                        disabled={disabled}
                        style={question.ratingStyle}
                    />
                </div>
            )}

            {error && (
                <p className={styles.error} role="alert">{error}</p>
            )}

            {!error && value && (
                <p className={styles.completed}>✓ 回答済み</p>
            )}
        </div>
    );
};

export default QuestionItem;
