import styles from './EmptyState.module.css';

interface EmptyStateProps {
  icon?: string; // 絵文字など
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({ icon = '📄', message, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <div className={styles.icon} aria-hidden="true">{icon}</div>
      <p className={styles.message}>{message}</p>
      {actionLabel && onAction && (
        <button className={styles.actionBtn} onClick={onAction}>{actionLabel}</button>
      )}
    </div>
  );
};

export default EmptyState;
