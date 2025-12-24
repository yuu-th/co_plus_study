// ProtectedRoute - 認証必須ルートを保護するコンポーネント
// @see specs/features/auth.md

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib';
import styles from './ProtectedRoute.module.css';

interface ProtectedRouteProps {
    children: React.ReactNode;
    /** プロフィール登録も必須にするか（デフォルト: true） */
    requireProfile?: boolean;
}

const ProtectedRoute = ({ children, requireProfile = true }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, profile } = useAuth();
    const location = useLocation();

    // 初期化中はローディング表示
    if (isLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>読み込み中...</p>
            </div>
        );
    }

    // 未認証の場合はログインページへ
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // プロフィール未設定の場合は登録ページへ
    if (requireProfile && (!profile || !profile.display_name)) {
        return <Navigate to="/register" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
