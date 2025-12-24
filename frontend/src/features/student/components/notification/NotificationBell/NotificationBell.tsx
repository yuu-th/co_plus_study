// @see specs/features/notification.md
// NotificationBell - ヘッダー用お知らせベルアイコン

import { useEffect, useRef, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '@/shared/types';
import styles from './NotificationBell.module.css';

interface NotificationBellProps {
    count: number;
    notifications?: Notification[];
    onMarkRead?: (id: string) => void;
}

const NotificationBell = ({ count, notifications = [], onMarkRead }: NotificationBellProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleBellClick = () => {
        setIsOpen(!isOpen);
    };

    const handleNotificationClick = (notification: Notification) => {
        if (onMarkRead && !notification.isRead) {
            onMarkRead(notification.id);
        }
        setIsOpen(false);
    };

    const handleViewAll = () => {
        setIsOpen(false);
        navigate('/notifications');
    };

    const formatTime = (createdAt: string) => {
        const date = new Date(createdAt);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffHours < 1) return '今';
        if (diffHours < 24) return `${diffHours}時間前`;
        if (diffDays < 7) return `${diffDays}日前`;
        return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
    };

    const recentNotifications = notifications.slice(0, 5);

    return (
        <div className={styles.container} ref={dropdownRef}>
            <button
                type="button"
                className={styles.bellButton}
                onClick={handleBellClick}
                aria-label={`お知らせ ${count > 0 ? `${count}件の未読` : ''}`}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <FaBell />
                {count > 0 && (
                    <span className={styles.badge} aria-live="polite">
                        {count > 9 ? '9+' : count}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className={styles.dropdown} role="menu">
                    <div className={styles.dropdownHeader}>
                        <h3 className={styles.dropdownTitle}>お知らせ</h3>
                        {count > 0 && <span className={styles.unreadCount}>{count}件の未読</span>}
                    </div>

                    <div className={styles.notificationList}>
                        {recentNotifications.length === 0 ? (
                            <p className={styles.empty}>お知らせはありません</p>
                        ) : (
                            recentNotifications.map((notification) => (
                                <button
                                    key={notification.id}
                                    type="button"
                                    className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ''}`}
                                    onClick={() => handleNotificationClick(notification)}
                                    role="menuitem"
                                >
                                    <div className={styles.notificationContent}>
                                        <p className={styles.notificationTitle}>{notification.title}</p>
                                        <span className={styles.notificationTime}>
                                            {formatTime(notification.createdAt)}
                                        </span>
                                    </div>
                                    {!notification.isRead && <span className={styles.unreadDot} />}
                                </button>
                            ))
                        )}
                    </div>

                    <button
                        type="button"
                        className={styles.viewAllButton}
                        onClick={handleViewAll}
                        role="menuitem"
                    >
                        すべて見る
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
