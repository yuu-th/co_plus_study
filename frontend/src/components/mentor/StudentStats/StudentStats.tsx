// @see specs/features/mentor.md

import type { StudentStats as StudentStatsType } from '../../../types';
import styles from './StudentStats.module.css';

interface StudentStatsProps {
  stats: StudentStatsType;
}

const StudentStats = ({ stats }: StudentStatsProps) => {
  const maxHours = Math.max(
    ...stats.subjectBreakdown.map((subject) => subject.hours),
    1,
  );

  return (
    <div className={styles.statsContainer}>
      <div className={styles.continuousDays}>
        <span className={styles.daysValue}>{stats.continuousDays}</span>
        <span className={styles.daysLabel}>日連続</span>
      </div>
      <div className={styles.subjectBreakdown}>
        <h3 className={styles.breakdownTitle}>教科別学習時間</h3>
        <ul className={styles.subjectList}>
          {stats.subjectBreakdown.map((subject) => (
            <li key={subject.subject} className={styles.subjectItem}>
              <span className={styles.subjectName}>{subject.subject}</span>
              <div className={styles.barContainer}>
                <div
                  className={styles.bar}
                  style={{ width: `${(subject.hours / maxHours) * 100}%` }}
                />
              </div>
              <span className={styles.subjectHours}>{subject.hours}h</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentStats;
