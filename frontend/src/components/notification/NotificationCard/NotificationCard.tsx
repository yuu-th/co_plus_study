import type { Notification } from '../../../types';
import styles from './NotificationCard.module.css';

interface NotificationCardProps {
  notification: Notification;
  onOpen: (notification: Notification) => void;
}

const NotificationCard = ({ notification, onOpen }: NotificationCardProps) => {
  const { category, title, message, read } = notification;
  const snippet = message.slice(0, 48) + (message.length > 48 ? '…' : '');
  return (
    <article
      className={styles.card}
      onClick={() => onOpen(notification)}
      aria-label={`通知 ${title}`}
      aria-describedby={`ntf-${notification.id}-snippet`}
    >
      <div className={`${styles.badge} ${styles[category]}`} aria-hidden="true" />
      <h3 className={styles.title}>{title}</h3>
      <p id={`ntf-${notification.id}-snippet`} className={styles.messageSnippet}>{snippet}</p>
      {!read && <span className={styles.unreadDot} aria-label="未読" />}
    </article>
  );
};

export default NotificationCard;