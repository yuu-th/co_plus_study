// @see specs/features/home.md
// RegisterPage - アカウント登録画面

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib';
import Button from '@/shared/components/Button';
import styles from './RegisterPage.module.css';

interface RegistrationForm {
    displayName: string;
    nameKana: string;
    grade: string;
}

const GRADES = [
    '小学1年', '小学2年', '小学3年', '小学4年', '小学5年', '小学6年',
    '中学1年', '中学2年', '中学3年',
];

const RegisterPage = () => {
    const navigate = useNavigate();
    const { updateProfile, isAuthenticated, isLoading, profile } = useAuth();
    const [form, setForm] = useState<RegistrationForm>({
        displayName: '',
        nameKana: '',
        grade: '小学1年',
    });
    const [errors, setErrors] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 未認証ならログインへ
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isLoading, isAuthenticated, navigate]);

    // 既にプロフィール設定済みならホームへ
    useEffect(() => {
        if (!isLoading && profile?.display_name) {
            navigate('/');
        }
    }, [isLoading, profile, navigate]);

    const validate = (): boolean => {
        const errs: string[] = [];

        if (!form.displayName.trim()) {
            errs.push('ユーザー名を入力してください');
        } else if (form.displayName.length > 20) {
            errs.push('ユーザー名は20文字以内です');
        }

        if (!form.nameKana.trim()) {
            errs.push('フリガナを入力してください');
        } else if (!/^[ぁ-んァ-ヴー\s]+$/.test(form.nameKana)) {
            errs.push('フリガナはひらがなまたはカタカナで入力してください');
        }

        setErrors(errs);
        return errs.length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        setErrors([]);

        try {
            const { error } = await updateProfile({
                display_name: form.displayName.trim(),
                name_kana: form.nameKana.trim(),
                grade: form.grade,
            });

            if (error) {
                setErrors(['登録に失敗しました。もう一度お試しください。']);
                console.error('Profile update error:', error);
            } else {
                navigate('/');
            }
        } catch (err) {
            setErrors(['予期しないエラーが発生しました。']);
            console.error('Unexpected error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <p>読み込み中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.title}>アカウント登録</h1>
                <p className={styles.subtitle}>Co+ Study へようこそ！</p>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label htmlFor="displayName" className={styles.label}>
                            ユーザー名 <span className={styles.required}>*</span>
                        </label>
                        <input
                            id="displayName"
                            name="displayName"
                            type="text"
                            value={form.displayName}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="やまだ たろう"
                            maxLength={20}
                            required
                        />
                        <p className={styles.hint}>最大20文字</p>
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="nameKana" className={styles.label}>
                            フリガナ <span className={styles.required}>*</span>
                        </label>
                        <input
                            id="nameKana"
                            name="nameKana"
                            type="text"
                            value={form.nameKana}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="ヤマダ タロウ"
                            required
                        />
                        <p className={styles.hint}>ひらがなまたはカタカナ</p>
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
                            {GRADES.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>

                    {errors.length > 0 && (
                        <div className={styles.errorContainer} role="alert">
                            {errors.map((e, i) => (
                                <p key={i} className={styles.error}>{e}</p>
                            ))}
                        </div>
                    )}

                    <div className={styles.actions}>
                        <Button type="submit" variant="primary" disabled={isSubmitting}>
                            {isSubmitting ? '登録中...' : '登録する'}
                        </Button>
                    </div>
                </form>

                <p className={styles.footer}>
                    登録することで、利用規約に同意します
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
