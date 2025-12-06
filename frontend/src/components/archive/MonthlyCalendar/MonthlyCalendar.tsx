// MonthlyCalendar - 月次カレンダー表示
// @see specs/features/archive.md

import type { ActivityDay } from '../../../types';
import styles from './MonthlyCalendar.module.css';

interface MonthlyCalendarProps {
  year: number;
  month: number; // 1-12
  activityDays: ActivityDay[];
}

const WEEKDAY_NAMES = ['日', '月', '火', '水', '木', '金', '土'];

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

  // 活動日かどうかを判定
  const hasActivity = (day: number): boolean => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const activity = activityDays.find(a => a.date === dateStr);
    return activity ? (activity.hasLogin || activity.hasDiary) : false;
  };

  // 曜日を取得（0=日曜, 6=土曜）
  const getDayOfWeek = (day: number): number => {
    return new Date(year, month - 1, day).getDay();
  };

  // 曜日ヘッダーのクラス名を取得
  const getWeekdayClass = (index: number): string => {
    const classes = [styles.weekday];
    if (index === 0) classes.push(styles.sundayHeader);
    if (index === 6) classes.push(styles.saturdayHeader);
    return classes.join(' ');
  };

  // 日付セルのクラス名を取得
  const getDayClass = (day: number): string => {
    const classes = [styles.day];
    const dayOfWeek = getDayOfWeek(day);
    
    // 活動日の色分け
    if (hasActivity(day)) {
      classes.push(styles.active);
    } else {
      classes.push(styles.inactive);
    }
    
    // 曜日の色分け
    if (dayOfWeek === 0) classes.push(styles.sunday);
    if (dayOfWeek === 6) classes.push(styles.saturday);
    
    return classes.join(' ');
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <h3 className={styles.title}>{month}月</h3>
      </div>
      <div className={styles.weekdays}>
        {WEEKDAY_NAMES.map((name, index) => (
          <div key={index} className={getWeekdayClass(index)}>
            {name}
          </div>
        ))}
      </div>
      <div className={styles.days}>
        {calendarDays.map((day, index) => (
          <div key={index} className={styles.dayCell}>
            {day !== null && (
              <div className={getDayClass(day)}>
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
