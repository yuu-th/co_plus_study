// BadgeCard - バッジカード（メダル + 説明）

import Badge from '@/shared/components/Badge';
import type { Badge as BadgeType } from '@/shared/types';
import styles from './BadgeCard.module.css';

interface BadgeCardProps {
    badge: BadgeType;
}

const BadgeCard = ({ badge }: BadgeCardProps) => {
    const isEarned = !!badge.earnedAt;

    return (
        <div className={`${styles.card} ${!isEarned ? styles.locked : ''}`}>
            <div className={styles.badgeIcon}>
                <Badge type={badge.rank} size="large" />
            </div>
            <div className={styles.info}>
                <h4 className={styles.name}>{badge.name}</h4>
                <p className={styles.description}>{badge.description}</p>
                {badge.condition && (
                    <p className={styles.condition}>条件: {badge.condition}</p>
                )}
                {isEarned && badge.earnedAt && (
                    <p className={styles.earnedDate}>
                        獲得日: {new Date(badge.earnedAt).toLocaleDateString('ja-JP')}
                    </p>
                )}
            </div>
        </div>
    );
};

export default BadgeCard;
