import type { Notification } from '@/shared/types';
import styles from './NotificationCard.module.css';

interface NotificationCardProps {
    notification: Notification;
    onOpen: (notification: Notification) => void;
    onDelete?: (notificationId: string) => void;
    onArchive?: (notificationId: string) => void;
}

const NotificationCard = ({ notification, onOpen, onDelete, onArchive }: NotificationCardProps) => {
    const { category, title, content, isRead, priority } = notification;
    const snippet = content.slice(0, 48) + (content.length > 48 ? '…' : '');

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete?.(notification.id);
    };

    const handleArchive = (e: React.MouseEvent) => {
        e.stopPropagation();
        onArchive?.(notification.id);
    };

    // 優先度に応じたクラス名
    const priorityClass = priority ? styles[`priority${priority.charAt(0).toUpperCase() + priority.slice(1)}`] : '';

    return (
        <article
            className={`${styles.card} ${priorityClass}`}
            onClick={() => onOpen(notification)}
            aria-label={`通知 ${title}`}
            aria-describedby={`ntf-${notification.id}-snippet`}
        >
            <div className={`${styles.badge} ${styles[category]}`} aria-hidden="true" />
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <p id={`ntf-${notification.id}-snippet`} className={styles.messageSnippet}>{snippet}</p>
            </div>
            {!isRead && <span className={styles.unreadDot} aria-label="未読" />}

            {/* アクションボタン */}
            {(onDelete || onArchive) && (
                <div className={styles.actions}>
                    {onArchive && (
                        <button
                            onClick={handleArchive}
                            className={styles.archiveButton}
                            aria-label="アーカイブ"
                        >
                            📁
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={handleDelete}
                            className={styles.deleteButton}
                            aria-label="削除"
                        >
                            ×
                        </button>
                    )}
                </div>
            )}
        </article>
    );
};

export default NotificationCard;
