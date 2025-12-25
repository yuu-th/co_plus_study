// @see specs/features/auth.md
// RegisterPage - アカウント新規登録画面（1ステップ登録）

import { useAuth } from '@/lib';
import Button from '@/shared/components/Button';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './RegisterPage.module.css';

interface RegistrationForm {
    email: string;
    password: string;
    passwordConfirm: string;
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
    const { signUp, isAuthenticated, isLoading, profile } = useAuth();
    const [form, setForm] = useState<RegistrationForm>({
        email: '',
        password: '',
        passwordConfirm: '',
        displayName: '',
        nameKana: '',
        grade: '小学1年',
    });
    const [errors, setErrors] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 既にログイン済み かつ プロフィール設定済み ならホームへ
    useEffect(() => {
        if (!isLoading && isAuthenticated && profile?.display_name) {
            navigate('/');
        }
    }, [isLoading, isAuthenticated, profile, navigate]);

    const validate = (): boolean => {
        const errs: string[] = [];

        // メールアドレス
        if (!form.email.trim()) {
            errs.push('メールアドレスを入力してください');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errs.push('有効なメールアドレスを入力してください');
        }

        // パスワード
        if (!form.password) {
            errs.push('パスワードを入力してください');
        } else if (form.password.length < 6) {
            errs.push('パスワードは6文字以上で入力してください');
        }

        if (form.password !== form.passwordConfirm) {
            errs.push('パスワードが一致しません');
        }

        // ユーザー名
        if (!form.displayName.trim()) {
            errs.push('ユーザー名を入力してください');
        } else if (form.displayName.length > 20) {
            errs.push('ユーザー名は20文字以内です');
        }

        // フリガナ
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
            const { error } = await signUp({
                email: form.email.trim(),
                password: form.password,
                displayName: form.displayName.trim(),
                nameKana: form.nameKana.trim(),
                grade: form.grade,
            });

            if (error) {
                if (error.message.includes('already registered')) {
                    setErrors(['このメールアドレスは既に登録されています。']);
                } else {
                    setErrors([error.message || '登録に失敗しました。もう一度お試しください。']);
                }
                console.error('SignUp error:', error);
            } else {
                // 登録成功、ホームへ
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
                    {/* アカウント情報 */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>アカウント情報</h2>
                        
                        <div className={styles.field}>
                            <label htmlFor="email" className={styles.label}>
                                メールアドレス <span className={styles.required}>*</span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="example@email.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="password" className={styles.label}>
                                パスワード <span className={styles.required}>*</span>
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="6文字以上"
                                required
                                autoComplete="new-password"
                            />
                            <p className={styles.hint}>6文字以上</p>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="passwordConfirm" className={styles.label}>
                                パスワード（確認） <span className={styles.required}>*</span>
                            </label>
                            <input
                                id="passwordConfirm"
                                name="passwordConfirm"
                                type="password"
                                value={form.passwordConfirm}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="もう一度入力"
                                required
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    {/* プロフィール情報 */}
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>プロフィール</h2>

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
                    既にアカウントをお持ちの方は{' '}
                    <Link to="/login" className={styles.link}>ログイン</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
