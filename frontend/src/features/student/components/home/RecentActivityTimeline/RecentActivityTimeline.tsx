import type { Activity } from '@/lib';
import styles from './RecentActivityTimeline.module.css';

interface RecentActivityTimelineProps {
    activities: Activity[];
    maxItems?: number;
    isLoading?: boolean;
}

const RecentActivityTimeline = ({ activities, maxItems = 10, isLoading = false }: RecentActivityTimelineProps) => {
    const displayActivities = activities.slice(0, maxItems);

    const getIcon = (type: Activity['type']) => {
        const icons = {
            diary: '📝',
            badge: '🏆',
            chat: '💬',
        };
        return icons[type];
    };

    const formatTime = (timestamp: string) => {
        const now = new Date();
        const activityDate = new Date(timestamp);
        const diffMs = now.getTime() - activityDate.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}分前`;
        if (diffHours < 24) return `${diffHours}時間前`;
        return `${diffDays}日前`;
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>最近の活動</h3>
            {isLoading ? (
                <div className={styles.loading}>読み込み中...</div>
            ) : displayActivities.length === 0 ? (
                <div className={styles.empty}>まだ活動がありません</div>
            ) : (
                <ul className={styles.timeline}>
                    {displayActivities.map((activity) => (
                        <li key={activity.id} className={styles.item}>
                            <div className={styles.icon}>{getIcon(activity.type)}</div>
                            <div className={styles.content}>
                                <p className={styles.activityTitle}>{activity.title}</p>
                                <p className={styles.description}>{activity.description}</p>
                                <span className={styles.time}>{formatTime(activity.timestamp)}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RecentActivityTimeline;
