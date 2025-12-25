// MentorLoginPage - メンター専用ログインページ
// @see specs/features/auth.md

import { useAuth } from '@/lib';
import Button from '@/shared/components/Button';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MentorLoginPage.module.css';

interface LoginForm {
    email: string;
    password: string;
}

const MentorLoginPage = () => {
    const { signIn, isLoading, isAuthenticated, profile } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState<LoginForm>({
        email: '',
        password: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 既に認証済みの場合のリダイレクト
    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            // roleに応じて適切なダッシュボードへリダイレクト
            if (profile?.role === 'mentor') {
                navigate('/mentor/dashboard');
            } else if (profile?.role === 'student') {
                // 生徒が誤ってメンターログインに来た場合
                navigate('/');
            }
        }
    }, [isAuthenticated, isLoading, profile, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        
        try {
            const { error: authError } = await signIn(form.email, form.password);
            if (authError) {
                if (authError.message.includes('Invalid login credentials')) {
                    setError('メールアドレスまたはパスワードが正しくありません。');
                } else if (authError.message.includes('Email not confirmed')) {
                    setError('メールアドレスの確認が完了していません。');
                } else {
                    setError('ログインに失敗しました。もう一度お試しください。');
                }
                console.error('Login error:', authError);
            }
            // ログイン成功時はuseEffectのリダイレクト処理に任せる
        } catch (err) {
            setError('予期しないエラーが発生しました。');
            console.error('Unexpected error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <p className={styles.subtitle}>読み込み中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.title}>メンターログイン</h1>
                <p className={styles.subtitle}>CO+ Study メンター管理画面</p>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label htmlFor="email" className={styles.label}>
                            メールアドレス
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="mentor@example.com"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="password" className={styles.label}>
                            パスワード
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="パスワードを入力"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div className={styles.error} role="alert">
                            {error}
                        </div>
                    )}

                    <div className={styles.actions}>
                        <Button type="submit" variant="primary" disabled={isSubmitting}>
                            {isSubmitting ? 'ログイン中...' : 'ログイン'}
                        </Button>
                    </div>
                </form>

                <p className={styles.note}>
                    メンターアカウントは管理者によって作成されます。
                </p>
            </div>
        </div>
    );
};

export default MentorLoginPage;
