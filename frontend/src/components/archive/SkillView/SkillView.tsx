// SkillView - スキル（バッジ）タブの表示

import BadgeCard from '../BadgeCard';
import type { Badge } from '../../../types';
import styles from './SkillView.module.css';

interface SkillViewProps {
  badges: Badge[];
}

const SkillView = ({ badges }: SkillViewProps) => {
  // 獲得済みバッジのみ表示
  const earnedBadges = badges.filter(b => b.isEarned);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>獲得したスキル</h2>
        <p className={styles.count}>
          {earnedBadges.length} / {badges.length} 個獲得
        </p>
      </div>
      <div className={styles.badgeGrid}>
        {earnedBadges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </div>
    </div>
  );
};

export default SkillView;
