// @see specs/features/notification.md
import {
    convertNotificationFromDB,
    useAuth,
    useMarkNotificationAsRead,
    useNotifications,
    useRealtimeNotifications
} from '@/lib';
import type { Notification, NotificationCategory } from '@/shared/types';
import { useCallback, useMemo, useState } from 'react';
import NotificationFilter from '../../components/notification/NotificationFilter';
import NotificationList from '../../components/notification/NotificationList';
import styles from './NotificationPage.module.css';

const NotificationPage = () => {
    const { user } = useAuth();
    const { data: notificationsData, isLoading } = useNotifications(user?.id);
    const markAsReadMutation = useMarkNotificationAsRead();
    const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | 'all'>('all');

    // リアルタイム更新を購読
    useRealtimeNotifications();

    // DBデータをフロントエンド型に変換
    const notifications = useMemo(() => {
        if (!notificationsData) return [];
        return notificationsData.map(convertNotificationFromDB);
    }, [notificationsData]);

    const filteredNotifications = useMemo(() => {
        if (selectedCategory === 'all') {
            return notifications;
        }
        return notifications.filter(n => n.category === selectedCategory);
    }, [notifications, selectedCategory]);

    const handleOpenNotification = useCallback(async (notification: Notification) => {
        if (!user || notification.isRead) return;
        
        try {
            await markAsReadMutation.mutateAsync({
                notificationId: notification.id,
                userId: user.id,
            });
        } catch (error) {
            console.error('既読にできませんでした:', error);
        }
    }, [user, markAsReadMutation]);

    const handleDelete = useCallback((notificationId: string) => {
        // TODO: 削除機能（現在はバックエンドに実装なし）
        console.log('Delete notification:', notificationId);
    }, []);

    const handleArchive = useCallback((notificationId: string) => {
        // TODO: アーカイブ機能
        console.log('Archive notification:', notificationId);
    }, []);

    if (isLoading) {
        return (
            <div className={styles.page}>
                <h1 className={styles.title}>お知らせ</h1>
                <div className={styles.loading}>読み込み中...</div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>お知らせ</h1>

            <NotificationFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
            />

            <NotificationList
                notifications={filteredNotifications}
                onOpen={handleOpenNotification}
                onDelete={handleDelete}
                onArchive={handleArchive}
            />
        </div>
    );
};

export default NotificationPage;
