// @see specs/features/notification.md
import { useMemo, useState } from 'react';
import NotificationFilter from '../../components/notification/NotificationFilter';
import NotificationList from '../../components/notification/NotificationList';
import type { Notification, NotificationCategory } from '@/shared/types';
import { mockNotifications } from '@/shared/mockData/notifications';
import styles from './NotificationPage.module.css';

const NotificationPage = () => {
    // In a real app, this would come from a hook or API
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | 'all'>('all');

    const filteredNotifications = useMemo(() => {
        if (selectedCategory === 'all') {
            return notifications;
        }
        return notifications.filter(n => n.category === selectedCategory);
    }, [notifications, selectedCategory]);

    const handleOpenNotification = (notification: Notification) => {
        // Mark as read logic would go here
        console.log('Open notification', notification);
        setNotifications(prev =>
            prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
        );
    };

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
            />
        </div>
    );
};

export default NotificationPage;
