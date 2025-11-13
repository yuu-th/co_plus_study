// MonthlyCalendar - 月次カレンダー表示

import type { ActivityDay } from '../../../types';
import styles from './MonthlyCalendar.module.css';

interface MonthlyCalendarProps {
  year: number;
  month: number; // 1-12
  activityDays: ActivityDay[];
}

const MonthlyCalendar = ({ year, month, activityDays }: MonthlyCalendarProps) => {
  // 月の初日と日数を取得
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 = 日曜日

  // カレンダーのグリッドを生成
  const calendarDays: (number | null)[] = [];
  
  // 月初より前の空白
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // 各日
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // 活動日を色分けするロジック
  const getActivityClass = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const activity = activityDays.find(a => a.date === dateStr);
    
    if (!activity) return '';
    if (activity.hasLogin && activity.hasDiary) return styles.both;
    if (activity.hasDiary) return styles.diary;
    if (activity.hasLogin) return styles.login;
    return '';
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <h3 className={styles.title}>{month}月</h3>
      </div>
      <div className={styles.weekdays}>
        {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
          <div key={index} className={styles.weekday}>
            {day}
          </div>
        ))}
      </div>
      <div className={styles.days}>
        {calendarDays.map((day, index) => (
          <div key={index} className={styles.dayCell}>
            {day !== null && (
              <div className={`${styles.day} ${getActivityClass(day)}`}>
                {day}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyCalendar;
