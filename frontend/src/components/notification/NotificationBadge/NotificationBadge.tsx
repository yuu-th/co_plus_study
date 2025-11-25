import styles from './NotificationBadge.module.css';

interface NotificationBadgeProps {
  count: number;
  onClick?: () => void;
}

const NotificationBadge = ({ count, onClick }: NotificationBadgeProps) => {
  return (
    <button
      type="button"
      className={styles.badge}
      aria-label={`未読通知 ${count} 件`}
      onClick={onClick}
    >
      🔔
      {count > 0 && <span className={styles.count} aria-live="polite">{count}</span>}
    </button>
  );
};

export default NotificationBadge;