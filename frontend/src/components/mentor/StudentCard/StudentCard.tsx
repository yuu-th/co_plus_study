// @see specs/features/mentor.md

import type { StudentSummary } from '../../../types';
import styles from './StudentCard.module.css';

// A simple utility to format relative time
const formatRelativeTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}秒前`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}分前`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}時間前`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}日前`;
};

const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('');
};

interface StudentCardProps {
  student: StudentSummary;
  onClick?: () => void;
}

const StudentCard = ({ student, onClick }: StudentCardProps) => {
  const { name, avatarUrl, lastActivity, totalHours, totalPosts } = student;

  return (
    <div onClick={onClick} className={styles.card}>
      <div className={styles.avatar}>
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} />
        ) : (
          <span className={styles.initials}>{getInitials(name)}</span>
        )}
      </div>
      <h3 className={styles.name}>{name}</h3>
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>最終活動日</span>
          <span className={styles.statValue}>{formatRelativeTime(lastActivity)}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>総学習時間</span>
          <span className={styles.statValue}>{totalHours}h</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>総投稿数</span>
          <span className={styles.statValue}>{totalPosts}</span>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
