// @see specs/features/tutorial.md
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  /** 現在のステップ */
  current: number;
  /** 全体のステップ数 */
  total: number;
  /** ラベルを表示するかどうか */
  showLabel?: boolean;
}

/**
 * 進捗バーコンポーネント
 * チュートリアルの進捗を視覚的に表示する
 */
const ProgressBar = ({ current, total, showLabel = true }: ProgressBarProps) => {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <div className={styles.container}>
      {showLabel && (
        <span className={styles.label}>
          {current}件中{Math.min(current, total)}件完了
        </span>
      )}
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`進捗: ${current}/${total}完了`}
      >
        <div
          className={styles.fill}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
