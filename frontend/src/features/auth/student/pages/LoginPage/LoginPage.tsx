// LoginPage - ログインページ
// @see specs/features/auth.md

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib';
import Button from '@/shared/components/Button';
import styles from './LoginPage.module.css';

const LoginPage = () => {
    const { signInAnonymously, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 既に認証済みならホームへリダイレクト
    if (isAuthenticated && !isLoading) {
        navigate('/');
        return null;
    }

    const handleLogin = async () => {
        setError(null);
        setIsSubmitting(true);
        
        try {
            const { error: authError } = await signInAnonymously();
            if (authError) {
                setError('ログインに失敗しました。もう一度お試しください。');
                console.error('Login error:', authError);
            } else {
                // 新規ユーザーは登録ページへ、既存ユーザーはホームへ
                navigate('/register');
            }
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
                <h1 className={styles.title}>CO+ Study</h1>
                <p className={styles.subtitle}>学びを、もっと楽しく</p>
                
                {error && (
                    <p className={styles.error} role="alert">{error}</p>
                )}
                
                <div className={styles.actions}>
                    <Button 
                        onClick={handleLogin} 
                        disabled={isSubmitting}
                        variant="primary"
                    >
                        {isSubmitting ? 'ログイン中...' : 'はじめる'}
                    </Button>
                </div>
                
                <p className={styles.note}>
                    ※ 匿名でログインします。後からアカウント連携も可能です。
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
