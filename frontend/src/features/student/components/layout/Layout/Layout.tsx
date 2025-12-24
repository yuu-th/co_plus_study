// Layoutコンポーネント - 学生向け全ページ共通レイアウト

import { useState, useMemo, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
    useAuth, 
    useUnreadNotificationCount, 
    useNotifications, 
    useMarkNotificationAsRead,
    convertNotificationFromDB 
} from '@/lib';
import { TutorialProvider } from '../../tutorial/TutorialProvider';
import Header from '../Header';
import Sidebar from '../Sidebar';
import styles from './Layout.module.css';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, profile, signOut } = useAuth();
    const navigate = useNavigate();

    // 未読通知数と通知一覧を取得
    const { data: unreadCount } = useUnreadNotificationCount(user?.id);
    const { data: notificationsData } = useNotifications(user?.id);
    const markAsReadMutation = useMarkNotificationAsRead();

    // 通知データをフロントエンド型に変換
    const notifications = useMemo(() => {
        if (!notificationsData) return [];
        return notificationsData.map(convertNotificationFromDB);
    }, [notificationsData]);

    const handleMenuClick = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarClose = () => {
        setIsSidebarOpen(false);
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    const handleNotificationMarkRead = useCallback(async (notificationId: string) => {
        if (!user) return;
        try {
            await markAsReadMutation.mutateAsync({
                notificationId,
                userId: user.id,
            });
        } catch (error) {
            console.error('既読にできませんでした:', error);
        }
    }, [user, markAsReadMutation]);

    const userName = profile?.display_name ?? 'ユーザー';

    return (
        <TutorialProvider>
            <div className={styles.layout}>
                <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} onLogout={handleLogout} />
                <div className={styles.mainWrapper}>
                    <Header 
                        onMenuClick={handleMenuClick} 
                        userName={userName}
                        unreadNotificationCount={unreadCount ?? 0}
                        notifications={notifications}
                        onNotificationMarkRead={handleNotificationMarkRead}
                    />
                    <main className={styles.main}><Outlet /></main>
                </div>
            </div>
        </TutorialProvider>
    );
};

export default Layout;
