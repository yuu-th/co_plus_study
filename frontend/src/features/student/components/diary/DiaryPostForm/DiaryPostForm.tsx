import { useState } from 'react';
import type { DiaryFormData, DiaryPost, Reaction } from '@/shared/types';
import DurationInput from '@/shared/components/DurationInput';
import { mockSubjects } from '../../../mockData/diaries';
import styles from './DiaryPostForm.module.css';

interface DiaryPostFormProps {
    onAdd: (post: DiaryPost) => void;
}

const INITIAL: DiaryFormData = { subject: '国語', duration: 30, content: '' };
const MAX_CONTENT = 500;

const DiaryPostForm = ({ onAdd }: DiaryPostFormProps) => {
    const [form, setForm] = useState<DiaryFormData>(INITIAL);
    const [errors, setErrors] = useState<string[]>([]);

    const validate = (): boolean => {
        const errs: string[] = [];
        if (!form.subject) errs.push('教科を選択してください');

        if (form.duration < 1 || form.duration > 59999) {
            errs.push('学習時間は1分～999時間59分で入力してください');
        }

        if (!form.content.trim()) errs.push('内容を入力してください');
        if (form.content.length > MAX_CONTENT) errs.push(`内容は${MAX_CONTENT}文字以内`);
        setErrors(errs);
        return errs.length === 0;
    };

    const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, subject: e.target.value }));
    };

    const handleDurationChange = (minutes: number) => {
        setForm(prev => ({ ...prev, duration: minutes }));
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, content: e.target.value }));
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
                <DurationInput
                    value={form.duration}
                    onChange={handleDurationChange}
                />
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
                    {errors.map((e, i) => <p key={i} className={styles.error}>{e}</p>)}
                </div>
            )}
            <div className={styles.actions}>
                <button type="submit">投稿</button>
            </div>
        </form>
    );
};

export default DiaryPostForm;
