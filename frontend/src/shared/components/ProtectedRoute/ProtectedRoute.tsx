// ProtectedRoute - 認証必須ルートを保護するコンポーネント
// @see specs/features/auth.md

import { useAuth } from '@/lib';
import { Navigate, useLocation } from 'react-router-dom';
import styles from './ProtectedRoute.module.css';

interface ProtectedRouteProps {
    children: React.ReactNode;
    /** プロフィール登録も必須にするか（デフォルト: true） */
    requireProfile?: boolean;
    /** 必要なrole（指定しない場合はすべて許可） */
    requireRole?: 'student' | 'mentor' | 'admin';
}

const ProtectedRoute = ({ children, requireProfile = true, requireRole }: ProtectedRouteProps) => {
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
        // メンター用ルートならメンターログインへ、それ以外は生徒ログインへ
        const loginPath = location.pathname.startsWith('/mentor') ? '/mentor/login' : '/login';
        return <Navigate to={loginPath} state={{ from: location }} replace />;
    }

    // プロフィール未設定の場合は登録ページへ
    if (requireProfile && (!profile || !profile.display_name)) {
        return <Navigate to="/register" state={{ from: location }} replace />;
    }

    // Role チェック
    if (requireRole && profile?.role !== requireRole) {
        // 期待されるroleと異なる場合、適切なダッシュボードにリダイレクト
        if (profile?.role === 'mentor') {
            return <Navigate to="/mentor/dashboard" replace />;
        } else if (profile?.role === 'student') {
            return <Navigate to="/" replace />;
        } else {
            // roleが不明な場合はログアウト
            return <Navigate to="/login" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
