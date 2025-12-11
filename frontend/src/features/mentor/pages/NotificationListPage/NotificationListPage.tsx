// @see specs/features/mentor.md
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import type { Notification } from '@/shared/types';
import { mockNotifications } from '@/shared/mockData/notifications';
import styles from './NotificationListPage.module.css';

const NotificationListPage = () => {
    // In a real app, this would be fetched from API
    const [notifications] = useState<Notification[]>(mockNotifications);

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>お知らせ管理</h1>
                <Link to="/mentor/notifications/new">
                    <Button variant="primary">新規作成</Button>
                </Link>
            </div>

            <div className={styles.list}>
                {notifications.map((notification) => (
                    <Card key={notification.id}>
                        <div className={styles.item}>
                            <div className={styles.content}>
                                <h3>{notification.title}</h3>
                                <p className={styles.category}>{notification.category}</p>
                                <p className={styles.date}>
                                    投稿日: {new Date(notification.createdAt).toLocaleDateString('ja-JP')}
                                </p>
                            </div>
                            <div className={styles.actions}>
                                <Link to={`/mentor/notifications/${notification.id}/edit`}>
                                    <Button variant="outline" size="small">編集</Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default NotificationListPage;
