import type { Answer, Question } from '../../../types';
import styles from './QuestionItem.module.css';

interface QuestionItemProps {
  question: Question;
  value: string | string[] | undefined;
  onChange: (answer: Answer) => void;
}

const QuestionItem = ({ question, value, onChange }: QuestionItemProps) => {
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

  return (
    <div className={styles.question} aria-label={`質問 ${question.text}`}>
      <div className={styles.title}>{question.text}{question.required && ' *'}</div>
      {question.type === 'single' && (
        <select value={(value as string) || ''} onChange={handleSingle} aria-label={question.text} required={question.required}>
          <option value="">選択してください</option>
          {question.options?.map(o => <option key={o} value={o}>{o}</option>)}
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
                style={{
                  padding: '4px 8px',
                  borderRadius: '16px',
                  border: '1px solid #ccc',
                  background: checked ? '#dfefff' : '#f7f7f7',
                  cursor: 'pointer'
                }}
              >{o}</button>
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
        />
      )}
    </div>
  );
};

export default QuestionItem;
