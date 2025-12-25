import { useAuth } from '@/lib';
import Button from '@/shared/components/Button';
import type { Grade } from '@/shared/types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProfileEditPage.module.css';

const ProfileEditPage = () => {
    const navigate = useNavigate();
    const { profile, updateProfile, isLoading } = useAuth();

    const [form, setForm] = useState<{
        displayName: string;
        nameKana: string;
        avatarUrl: string;
        grade: Grade | '';
    }>({
        displayName: '',
        nameKana: '',
        avatarUrl: '',
        grade: '',
    });

    const [errors, setErrors] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // プロフィールデータでフォームを初期化
    useEffect(() => {
        if (profile) {
            setForm({
                displayName: profile.display_name ?? '',
                nameKana: profile.name_kana ?? '',
                avatarUrl: profile.avatar_url ?? '',
                grade: (profile.grade as Grade) ?? '',
            });
        }
    }, [profile]);

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
        if (form.nameKana && !/^[ぁ-んァ-ヴー\s]*$/.test(form.nameKana)) {
            errs.push('フリガナはひらがなまたはカタカナで入力してください');
        }
        setErrors(errs);
        return errs.length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        setErrors([]);

        try {
            const { error } = await updateProfile({
                display_name: form.displayName.trim(),
                name_kana: form.nameKana.trim() || null,
                avatar_url: form.avatarUrl.trim() || null,
                grade: form.grade || null,
            });

            if (error) {
                setErrors(['プロフィールの更新に失敗しました。']);
                console.error('Profile update error:', error);
            } else {
                navigate('/profile');
            }
        } catch (err) {
            setErrors(['予期しないエラーが発生しました。']);
            console.error('Unexpected error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    if (isLoading) {
        return (
            <div className={styles.page}>
                <div className={styles.loading}>読み込み中...</div>
            </div>
        );
    }

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
                                {form.displayName.charAt(0) || '?'}
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
                    <label htmlFor="nameKana" className={styles.label}>
                        フリガナ
                    </label>
                    <input
                        type="text"
                        id="nameKana"
                        name="nameKana"
                        value={form.nameKana}
                        onChange={handleChange}
                        maxLength={50}
                        placeholder="ひらがなまたはカタカナ"
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
                        disabled={isSubmitting}
                    >
                        キャンセル
                    </Button>
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? '保存中...' : '保存'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ProfileEditPage;
