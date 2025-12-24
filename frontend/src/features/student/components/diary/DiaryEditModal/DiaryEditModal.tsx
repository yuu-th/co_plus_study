import { useState, useEffect } from 'react';
import type { DiaryFormData, DiaryPost } from '@/shared/types';
import DurationInput from '@/shared/components/DurationInput';
import { mockSubjects } from '../../../mockData/diaries';
import styles from './DiaryEditModal.module.css';

interface DiaryEditModalProps {
    post: DiaryPost;
    onSave: (post: DiaryPost) => void;
    onCancel: () => void;
}

const MAX_CONTENT = 500;

const DiaryEditModal = ({ post, onSave, onCancel }: DiaryEditModalProps) => {
    const [form, setForm] = useState<DiaryFormData>({
        subject: post.subject,
        duration: post.duration,
        content: post.content,
    });
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
        setForm(prev => ({ ...prev, subject: e.target.value as typeof form.subject }));
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

        const updatedPost: DiaryPost = {
            ...post,
            subject: form.subject,
            duration: form.duration,
            content: form.content.trim(),
        };
        onSave(updatedPost);
    };

    // ESCキーでキャンセル
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onCancel]);

    return (
        <div className={styles.overlay} onClick={onCancel}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>日報を編集</h2>
                    <button onClick={onCancel} className={styles.closeButton} aria-label="閉じる">
                        ×
                    </button>
                </div>
                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                    aria-label="学習日報編集フォーム"
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
                        <button type="button" onClick={onCancel} className={styles.cancelButton}>
                            キャンセル
                        </button>
                        <button type="submit" className={styles.saveButton}>保存</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DiaryEditModal;
