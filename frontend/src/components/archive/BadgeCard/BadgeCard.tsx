// BadgeCard - バッジカード（メダル + 説明）

import type { Badge } from '../../../types';
import BadgeComponent from '../../common/Badge';
import styles from './BadgeCard.module.css';

interface BadgeCardProps {
  badge: Badge;
}

const BadgeCard = ({ badge }: BadgeCardProps) => {
  return (
    <div className={`${styles.card} ${!badge.isEarned ? styles.locked : ''}`}>
      <div className={styles.badgeIcon}>
        <BadgeComponent type={badge.type} size="large" />
      </div>
      <div className={styles.info}>
        <h4 className={styles.name}>{badge.name}</h4>
        <p className={styles.description}>{badge.description}</p>
        <p className={styles.condition}>条件: {badge.condition}</p>
        {badge.isEarned && badge.earnedDate && (
          <p className={styles.earnedDate}>
            獲得日: {new Date(badge.earnedDate).toLocaleDateString('ja-JP')}
          </p>
        )}
      </div>
    </div>
  );
};

export default BadgeCard;
