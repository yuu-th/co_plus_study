import type { ReactionType } from '../../../types';
import styles from './ReactionButton.module.css';

interface ReactionButtonProps {
  type: ReactionType;
  count: number;
  isActive: boolean;
  onToggle: () => void;
}

const ReactionButton = ({ type, count, isActive, onToggle }: ReactionButtonProps) => {
  return (
    <button
      type="button"
      className={`${styles.btn} ${isActive ? styles.active : ''}`}
      aria-pressed={isActive}
      aria-label={`リアクション ${type} ${count}件`}
      onClick={onToggle}
    >
      <span className={styles.emoji}>{type}</span>
      {count > 0 && <span className={styles.count}>{count}</span>}
    </button>
  );
};

export default ReactionButton;