
import type { Notification } from '@/shared/types';
import NotificationCard from '../NotificationCard';
import styles from './NotificationList.module.css';

interface NotificationListProps {
    notifications: Notification[];
    onOpen: (notification: Notification) => void;
}

const NotificationList = ({ notifications, onOpen }: NotificationListProps) => {
    return (
        <div className={styles.list} aria-label="通知一覧">
            {notifications.length === 0 ? (
                <div className={styles.empty}>通知はありません</div>
            ) : (
                notifications.map(n => (
                    <NotificationCard key={n.id} notification={n} onOpen={onOpen} />
                ))
            )}
        </div>
    );
};

export default NotificationList;
