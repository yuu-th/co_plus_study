// @see specs/features/notification.md
// NotificationListPage - 配信済み通知一覧

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/shared/components/Button';
import Card from '@/shared/components/Card';
import { useNotifications, useDeleteNotification, convertNotificationFromDB } from '@/lib';
import styles from './NotificationListPage.module.css';

const CATEGORY_LABEL_MAP: Record<string, string> = {
    info: 'お知らせ',
    event: 'イベント',
    important: '重要',
};

const NotificationListPage = () => {
    const { data: notificationsData, isLoading } = useNotifications();
    const deleteMutation = useDeleteNotification();

    // DBデータをフロントエンド型に変換
    const notifications = useMemo(() => {
        if (!notificationsData) return [];
        return notificationsData.map(convertNotificationFromDB);
    }, [notificationsData]);

    const handleDelete = async (notificationId: string) => {
        if (window.confirm('このお知らせを削除してもよろしいですか？')) {
            try {
                await deleteMutation.mutateAsync(notificationId);
            } catch (error) {
                console.error('削除に失敗しました:', error);
            }
        }
    };

    const getPriorityLabel = (priority?: string) => {
        switch (priority) {
            case 'high': return '高';
            case 'medium': return '中';
            case 'low': return '低';
            default: return '-';
        }
    };

    if (isLoading) {
        return (
            <div className={styles.page}>
                <div className={styles.header}>
                    <h1 className={styles.title}>配信済み通知</h1>
                </div>
                <div className={styles.loading}>読み込み中...</div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.headerTitleArea}>
                    <h1 className={styles.title}>配信済み通知</h1>
                    <p className={styles.subtitle}>学生へ配信した全てのお知らせを管理します</p>
                </div>
                <Link to="/mentor/notifications/new">
                    <Button variant="primary">新規作成</Button>
                </Link>
            </div>

            <div className={styles.list}>
                {notifications.length === 0 ? (
                    <div className={styles.emptyCard}>
                        <p className={styles.empty}>配信済みのお知らせはありません</p>
                        <Link to="/mentor/notifications/new">
                            <Button variant="outline">最初のお知らせを作成する</Button>
                        </Link>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <Card key={notification.id} className={styles.card}>
                            <div className={styles.notificationItem}>
                                <div className={styles.notificationInfo}>
                                    <div className={styles.itemHeader}>
                                        <span className={`${styles.category} ${styles[notification.category]}`}>
                                            {CATEGORY_LABEL_MAP[notification.category] || notification.category}
                                        </span>
                                        <span className={`${styles.priority} ${styles[notification.priority || 'medium']}`}>
                                            優先度: {getPriorityLabel(notification.priority)}
                                        </span>
                                        <span className={styles.date}>
                                            {new Date(notification.createdAt).toLocaleDateString('ja-JP')}
                                        </span>
                                    </div>
                                    <h3 className={styles.notificationTitle}>{notification.title}</h3>
                                    <p className={styles.notificationContent}>
                                        {notification.content.slice(0, 120)}
                                        {notification.content.length > 120 ? '...' : ''}
                                    </p>
                                </div>
                                <div className={styles.actions}>
                                    <Link to={`/mentor/notifications/${notification.id}/edit`}>
                                        <Button variant="ghost" size="small">編集</Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="small"
                                        onClick={() => handleDelete(notification.id)}
                                        className={styles.deleteBtn}
                                    >
                                        削除
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationListPage;
