import type { Question } from '@/shared/types';
import StarRating from '../StarRating';
import styles from './SurveyQuestionCard.module.css';

interface SurveyQuestionCardProps {
    question: Question;
    value: unknown;
    onChange: (value: unknown) => void;
    error?: string;
}

const SurveyQuestionCard = ({ question, value, onChange, error }: SurveyQuestionCardProps) => {
    const handleChange = (val: unknown) => {
        onChange(val);
    };

    const renderInput = () => {
        switch (question.type) {
            case 'single':
                return (
                    <div className={styles.options}>
                        {question.options?.map(opt => (
                            <label key={opt} className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name={question.id}
                                    value={opt}
                                    checked={value === opt}
                                    onChange={(e) => handleChange(e.target.value)}
                                    className={styles.radio}
                                />
                                {opt}
                            </label>
                        ))}
                    </div>
                );
            case 'multiple':
                return (
                    <div className={styles.options}>
                        {question.options?.map(opt => (
                            <label key={opt} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    value={opt}
                                    checked={Array.isArray(value) && (value as string[]).includes(opt)}
                                    onChange={(e) => {
                                        const current = (value as string[]) || [];
                                        const next = e.target.checked
                                            ? [...current, opt]
                                            : current.filter(v => v !== opt);
                                        handleChange(next);
                                    }}
                                    className={styles.checkbox}
                                />
                                {opt}
                            </label>
                        ))}
                    </div>
                );
            case 'text':
                return (
                    <textarea
                        className={styles.textarea}
                        value={(value as string) || ''}
                        onChange={(e) => handleChange(e.target.value)}
                        placeholder="自由に入力してください"
                        rows={4}
                    />
                );
            case 'rating':
                return (
                    <StarRating
                        value={(value as number) || 0}
                        onChange={handleChange}
                    />
                );
            case 'color':
                return <div className={styles.error}>カラー選択は現在未実装です</div>;
            default:
                return null;
        }
    };

    return (
        <div id={`question-${question.id}`} className={styles.card}>
            <div className={styles.header}>
                <h3 className={styles.questionText}>
                    {question.text}
                    {question.required && <span className={styles.required}>*</span>}
                </h3>
            </div>

            <div className={styles.inputArea}>
                {renderInput()}
            </div>

            {error && (
                <p className={styles.error}>{error}</p>
            )}

            {!error && !!value && (
                <p className={styles.completed}>✓ 回答済み</p>
            )}
        </div>
    );
};

export default SurveyQuestionCard;
