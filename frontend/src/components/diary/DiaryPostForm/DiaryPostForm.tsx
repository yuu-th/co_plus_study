import { useState } from 'react';
import { mockSubjects } from '../../../mockData/diaries';
import type { DiaryFormData, DiaryPost, Reaction } from '../../../types';
import styles from './DiaryPostForm.module.css';

interface DiaryPostFormProps {
  onAdd: (post: DiaryPost) => void;
}

const INITIAL: DiaryFormData = { subject: '算数', duration: 30, content: '' };
const MAX_CONTENT = 500;

const DiaryPostForm = ({ onAdd }: DiaryPostFormProps) => {
  const [form, setForm] = useState<DiaryFormData>(INITIAL);
  const [errors, setErrors] = useState<string[]>([]);

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!form.subject) errs.push('教科を選択してください');
    if (form.duration < 1 || form.duration > 999) errs.push('学習時間は1〜999分');
    if (!form.content.trim()) errs.push('内容を入力してください');
    if (form.content.length > MAX_CONTENT) errs.push(`内容は${MAX_CONTENT}文字以内`);
    setErrors(errs);
    return errs.length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'duration' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const now = new Date();
    const newPost: DiaryPost = {
      id: `temp-${now.getTime()}`,
      userId: '1',
      userName: '田中太郎',
      subject: form.subject,
      duration: form.duration,
      content: form.content.trim(),
      timestamp: now.toISOString(),
      reactions: [] as Reaction[],
    };
    onAdd(newPost);
    setForm(INITIAL);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-label="学習日報投稿フォーム">
      <div className={styles.row}>
        <select
          name="subject"
          value={form.subject}
          onChange={handleChange}
          className={styles.subjectSelect}
          aria-label="教科選択"
          required
        >
          {mockSubjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          type="number"
          name="duration"
          value={form.duration}
          min={1}
          max={999}
          onChange={handleChange}
          className={styles.durationInput}
          aria-label="学習時間(分)"
          required
        />
      </div>
      <textarea
        name="content"
        value={form.content}
        onChange={handleChange}
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
