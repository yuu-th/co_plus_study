// SkillView - スキル（バッジ）タブの表示

import type { Badge } from '@/shared/types';
import BadgeCard from '../BadgeCard';
import styles from './SkillView.module.css';

interface SkillViewProps {
    badges: Badge[];
}

const SkillView = ({ badges }: SkillViewProps) => {
    // 獲得済みバッジの数をカウント
    const earnedCount = badges.filter(b => !!b.earnedAt).length;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>獲得したスキル</h2>
                <p className={styles.count}>
                    {earnedCount} / {badges.length} 個獲得
                </p>
            </div>
            <div className={styles.badgeGrid}>
                {badges.map((badge) => (
                    <BadgeCard key={badge.id} badge={badge} />
                ))}
            </div>
        </div>
    );
};

export default SkillView;
