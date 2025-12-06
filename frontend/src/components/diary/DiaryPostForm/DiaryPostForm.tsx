import { useState } from 'react';
import { mockSubjects } from '../../../mockData/diaries';
import type { DiaryFormData, DiaryPost, Reaction } from '../../../types';
import { hmToMinutes, minutesToHM, minutesToJapanese } from '../../../utils/formatTime';
import styles from './DiaryPostForm.module.css';

interface DiaryPostFormProps {
  onAdd: (post: DiaryPost) => void;
}

const INITIAL: DiaryFormData = { subject: '算数', duration: 30, content: '' };
const MAX_CONTENT = 500;

const DiaryPostForm = ({ onAdd }: DiaryPostFormProps) => {
  const [form, setForm] = useState<DiaryFormData>(INITIAL);
  const [timeInput, setTimeInput] = useState<string>(minutesToHM(INITIAL.duration));
  const [errors, setErrors] = useState<string[]>([]);

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!form.subject) errs.push('教科を選択してください');
    
    const minutes = hmToMinutes(timeInput);
    if (minutes === null || minutes < 1 || minutes > 59999) {
      errs.push('学習時間は 0:01～999:59 で入力してください');
    }
    
    if (!form.content.trim()) errs.push('内容を入力してください');
    if (form.content.length > MAX_CONTENT) errs.push(`内容は${MAX_CONTENT}文字以内`);
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, subject: e.target.value }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeInput(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, content: e.target.value }));
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
      duration: minutes,
      content: form.content.trim(),
      timestamp: now.toISOString(),
      reactions: [] as Reaction[],
    };
    onAdd(newPost);
    setForm(INITIAL);
    setTimeInput(minutesToHM(INITIAL.duration));
  };

  const displayMinutes = hmToMinutes(timeInput);

  return (
    <form 
      className={styles.form} 
      onSubmit={handleSubmit} 
      aria-label="学習日報投稿フォーム"
      data-tutorial="diary-form"
    >
      <div className={styles.row}>
        <select
          name="subject"
          value={form.subject}
          onChange={handleSubjectChange}
          className={styles.subjectSelect}
          aria-label="教科選択"
          required
        >
          {mockSubjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className={styles.timeInputGroup}>
          <input
            type="text"
            value={timeInput}
            onChange={handleTimeChange}
            placeholder="0:30"
            className={styles.timeInput}
            aria-label="学習時間（h:mm形式）"
            pattern="^[0-9]{1,3}:[0-5][0-9]$"
            required
          />
          <span className={styles.timeDisplay}>
            {displayMinutes !== null && displayMinutes > 0 
              ? minutesToJapanese(displayMinutes)
              : ''}
          </span>
        </div>
      </div>
      <textarea
        name="content"
        value={form.content}
        onChange={handleContentChange}
        maxLength={MAX_CONTENT}
        className={styles.textarea}
        placeholder="今日学んだ内容..."
        aria-label="学習内容"
        required
      />
      {errors.length > 0 && (
        <div role="alert" aria-live="polite">
          {errors.map((e,i) => <p key={i} className={styles.error}>{e}</p>)}
        </div>
      )}
      <div className={styles.actions}>
        <button type="submit">投稿</button>
      </div>
    </form>
  );
};

export default DiaryPostForm;
