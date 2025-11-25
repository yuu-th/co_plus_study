import { useMemo, useState } from 'react';
import type { Answer, Survey, SurveyResponse } from '../../../types';
import QuestionItem from '../QuestionItem/QuestionItem';
import styles from './SurveyForm.module.css';

interface SurveyFormProps {
  survey: Survey;
  onSubmit: (response: SurveyResponse) => void;
}

const SurveyForm = ({ survey, onSubmit }: SurveyFormProps) => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (answer: Answer) => {
    setAnswers(prev => {
      const idx = prev.findIndex(a => a.questionId === answer.questionId);
      if (idx >= 0) {
        const copy = prev.slice();
        copy[idx] = answer;
        return copy;
      }
      return [...prev, answer];
    });
  };

  const requiredMissing = useMemo(() => {
    return survey.questions.filter(q => q.required).some(q => {
      const a = answers.find(ans => ans.questionId === q.id);
      if (!a) return true;
      if (q.type === 'multiple') return !Array.isArray(a.value) || (a.value as string[]).length === 0;
      return !a.value || (Array.isArray(a.value) && a.value.length === 0);
    });
  }, [answers, survey.questions]);

  const disabled = submitted || requiredMissing || survey.status === 'scheduled' || survey.status === 'closed';

  const handleSubmit = () => {
    if (disabled) return;
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
      <div className={styles.questions}>
        {survey.questions.map(q => (
          <QuestionItem
            key={q.id}
            question={q}
            value={answers.find(a => a.questionId === q.id)?.value}
            onChange={handleChange}
          />
        ))}
      </div>
      <div className={styles.actions}>
        <button type="button" onClick={handleSubmit} disabled={disabled}>送信</button>
      </div>
      {submitted && <div role="status" aria-live="polite">送信が完了しました。ありがとうございました。</div>}
    </div>
  );
};

export default SurveyForm;
