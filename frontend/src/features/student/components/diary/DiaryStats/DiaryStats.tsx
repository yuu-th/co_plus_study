import type { DiaryPost } from '@/shared/types';
import { computeWeeklyStats } from '@/shared/utils/groupByDate';
import styles from './DiaryStats.module.css';

interface DiaryStatsProps { posts: DiaryPost[]; }

const DiaryStats = ({ posts }: DiaryStatsProps) => {
    const week = computeWeeklyStats(posts);

    return (
        <aside className={styles.stats} aria-label="週間学習統計">
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>今週の合計学習時間</h3>
                <div>{week.totalMinutes} 分</div>
            </div>
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>今週の投稿数</h3>
                <div>{week.totalPosts} 件</div>
            </div>
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>教科別</h3>
                <div className={styles.grid}>
                    {week.subjectBreakdown.map(s => (
                        <div key={s.subject} className={styles.badge}>{s.subject}: {s.totalMinutes}分</div>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default DiaryStats;
