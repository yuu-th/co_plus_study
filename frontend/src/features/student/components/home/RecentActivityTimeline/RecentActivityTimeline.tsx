import { Link } from 'react-router-dom';
import type { Activity } from '@/features/student/mockData/activities';
import styles from './RecentActivityTimeline.module.css';

interface RecentActivityTimelineProps {
    activities: Activity[];
    maxItems?: number;
}

const RecentActivityTimeline = ({ activities, maxItems = 10 }: RecentActivityTimelineProps) => {
    const displayActivities = activities.slice(0, maxItems);

    const getIcon = (type: Activity['type']) => {
        const icons = {
            diary: '📝',
            badge: '🏆',
            chat: '💬',
            survey: '📋',
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
            <ul className={styles.timeline}>
                {displayActivities.map((activity) => (
                    <li key={activity.id} className={styles.item}>
                        <div className={styles.icon}>{getIcon(activity.type)}</div>
                        <div className={styles.content}>
                            <p className={styles.activityTitle}>{activity.title}</p>
                            <p className={styles.description}>{activity.description}</p>
                            <span className={styles.time}>{formatTime(activity.timestamp)}</span>
                        </div>
                        {activity.link && (
                            <Link to={activity.link} className={styles.link}>
                                →
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentActivityTimeline;
