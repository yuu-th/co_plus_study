import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Grade } from '@/shared/types';
import Button from '@/shared/components/Button';
import styles from './ProfileEditPage.module.css';

const ProfileEditPage = () => {
    const navigate = useNavigate();

    // モックデータ（本来はContextやAPIから取得）
    const [form, setForm] = useState<{
        displayName: string;
        avatarUrl: string;
        grade: Grade | '';
    }>({
        displayName: '田中太郎',
        avatarUrl: '',
        grade: '中学2年',
    });

    const [errors, setErrors] = useState<string[]>([]);

    const grades: Grade[] = [
        '小学1年', '小学2年', '小学3年', '小学4年', '小学5年', '小学6年',
        '中学1年', '中学2年', '中学3年',
    ];

    const validate = (): boolean => {
        const errs: string[] = [];
        if (!form.displayName.trim()) {
            errs.push('名前を入力してください');
        }
        if (form.displayName.length > 50) {
            errs.push('名前は50文字以内で入力してください');
        }
        setErrors(errs);
        return errs.length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        // ここで実際にはAPIに送信
        console.log('プロフィール更新:', form);
        alert('プロフィールを更新しました');
        navigate('/profile');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>プロフィール編集</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.avatarSection}>
                    <div className={styles.avatarPreview}>
                        {form.avatarUrl ? (
                            <img src={form.avatarUrl} alt="プロフィール画像" className={styles.avatar} />
                        ) : (
                            <div className={styles.avatarPlaceholder}>
                                {form.displayName.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className={styles.avatarInput}>
                        <label htmlFor="avatarUrl" className={styles.label}>
                            プロフィール画像URL
                        </label>
                        <input
                            type="url"
                            id="avatarUrl"
                            name="avatarUrl"
                            value={form.avatarUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/avatar.jpg"
                            className={styles.input}
                        />
                        <p className={styles.hint}>画像のURLを入力してください</p>
                    </div>
                </div>

                <div className={styles.field}>
                    <label htmlFor="displayName" className={styles.label}>
                        名前 <span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        id="displayName"
                        name="displayName"
                        value={form.displayName}
                        onChange={handleChange}
                        required
                        maxLength={50}
                        className={styles.input}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="grade" className={styles.label}>
                        学年
                    </label>
                    <select
                        id="grade"
                        name="grade"
                        value={form.grade}
                        onChange={handleChange}
                        className={styles.select}
                    >
                        <option value="">選択してください</option>
                        {grades.map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>

                {errors.length > 0 && (
                    <div role="alert" aria-live="polite" className={styles.errors}>
                        {errors.map((e, i) => <p key={i} className={styles.error}>{e}</p>)}
                    </div>
                )}

                <div className={styles.actions}>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/profile')}
                    >
                        キャンセル
                    </Button>
                    <Button type="submit" variant="primary">
                        保存
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ProfileEditPage;
