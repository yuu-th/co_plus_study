
import type { Notification } from '@/shared/types';
import NotificationCard from '../NotificationCard';
import styles from './NotificationList.module.css';

interface NotificationListProps {
    notifications: Notification[];
    onOpen: (notification: Notification) => void;
    onDelete?: (notificationId: string) => void;
    onArchive?: (notificationId: string) => void;
}

const NotificationList = ({ notifications, onOpen, onDelete, onArchive }: NotificationListProps) => {
    return (
        <div className={styles.list} aria-label="通知一覧">
            {notifications.length === 0 ? (
                <div className={styles.empty}>通知はありません</div>
            ) : (
                notifications.map(n => (
                    <NotificationCard
                        key={n.id}
                        notification={n}
                        onOpen={onOpen}
                        onDelete={onDelete}
                        onArchive={onArchive}
                    />
                ))
            )}
        </div>
    );
};

export default NotificationList;
