// WeeklyActivity - 直近1週間の活動状況を S M T W T F S 形式で表示

import type { DayActivity } from '../../../types/calendar';
import styles from './WeeklyActivity.module.css';

interface WeeklyActivityProps {
    week: DayActivity[];
}

const WeeklyActivity = ({ week }: WeeklyActivityProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.days}>
                {week.map((day, index) => (
                    <div key={index} className={styles.dayItem}>
                        <div className={styles.dayLabel}>{day.dayOfWeek}</div>
                        <div className={`${styles.marker} ${day.hasActivity ? styles.active : ''}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeeklyActivity;
