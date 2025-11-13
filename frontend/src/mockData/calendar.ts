// カレンダー・活動記録のモックデータ
// イメージ図に基づく: 連続ログイン953日、9月・8月・7月の活動日

import type { CalendarData, ActivityDay, DayActivity, MonthData } from '../types';

// 9月の活動日（イメージ図に基づく）
const september2025Activities: ActivityDay[] = [
  // 1-6日（活動あり）
  { date: '2025-09-01', hasLogin: true, hasDiary: true },
  { date: '2025-09-02', hasLogin: true, hasDiary: false },
  { date: '2025-09-03', hasLogin: true, hasDiary: true },
  { date: '2025-09-04', hasLogin: true, hasDiary: true },
  { date: '2025-09-05', hasLogin: true, hasDiary: false },
  { date: '2025-09-06', hasLogin: true, hasDiary: true },
  // 7-15日（活動あり）
  { date: '2025-09-07', hasLogin: true, hasDiary: false },
  { date: '2025-09-08', hasLogin: true, hasDiary: true },
  { date: '2025-09-09', hasLogin: true, hasDiary: true },
  { date: '2025-09-10', hasLogin: true, hasDiary: false },
  { date: '2025-09-11', hasLogin: true, hasDiary: true },
  { date: '2025-09-12', hasLogin: true, hasDiary: true },
  { date: '2025-09-13', hasLogin: true, hasDiary: false },
  { date: '2025-09-14', hasLogin: true, hasDiary: true },
  { date: '2025-09-15', hasLogin: true, hasDiary: true },
  // 16-20日（活動あり）
  { date: '2025-09-16', hasLogin: true, hasDiary: false },
  { date: '2025-09-17', hasLogin: true, hasDiary: true },
  { date: '2025-09-18', hasLogin: true, hasDiary: false },
  { date: '2025-09-19', hasLogin: true, hasDiary: true },
  { date: '2025-09-20', hasLogin: true, hasDiary: false },
  // 21-27日（活動あり）
  { date: '2025-09-21', hasLogin: true, hasDiary: false },
  { date: '2025-09-22', hasLogin: true, hasDiary: true },
  { date: '2025-09-23', hasLogin: true, hasDiary: false },
  { date: '2025-09-24', hasLogin: true, hasDiary: true },
  { date: '2025-09-25', hasLogin: true, hasDiary: true },
  { date: '2025-09-26', hasLogin: true, hasDiary: false },
  { date: '2025-09-27', hasLogin: true, hasDiary: true },
  // 28-30日（活動あり）
  { date: '2025-09-28', hasLogin: true, hasDiary: false },
  { date: '2025-09-29', hasLogin: true, hasDiary: true },
  { date: '2025-09-30', hasLogin: true, hasDiary: false },
];

// 8月の活動日
const august2025Activities: ActivityDay[] = [
  // 1-2日
  { date: '2025-08-01', hasLogin: true, hasDiary: true },
  { date: '2025-08-02', hasLogin: true, hasDiary: false },
  // 3-9日
  { date: '2025-08-03', hasLogin: true, hasDiary: false },
  { date: '2025-08-04', hasLogin: true, hasDiary: true },
  { date: '2025-08-05', hasLogin: true, hasDiary: false },
  { date: '2025-08-06', hasLogin: true, hasDiary: true },
  { date: '2025-08-07', hasLogin: true, hasDiary: true },
  { date: '2025-08-08', hasLogin: true, hasDiary: false },
  { date: '2025-08-09', hasLogin: true, hasDiary: true },
  // 10-16日
  { date: '2025-08-10', hasLogin: true, hasDiary: false },
  { date: '2025-08-11', hasLogin: true, hasDiary: true },
  { date: '2025-08-12', hasLogin: true, hasDiary: false },
  { date: '2025-08-13', hasLogin: true, hasDiary: true },
  { date: '2025-08-14', hasLogin: true, hasDiary: false },
  { date: '2025-08-15', hasLogin: true, hasDiary: true },
  { date: '2025-08-16', hasLogin: true, hasDiary: false },
  // 17-23日
  { date: '2025-08-17', hasLogin: true, hasDiary: false },
  { date: '2025-08-18', hasLogin: true, hasDiary: true },
  { date: '2025-08-19', hasLogin: true, hasDiary: false },
  { date: '2025-08-20', hasLogin: true, hasDiary: true },
  { date: '2025-08-21', hasLogin: true, hasDiary: false },
  { date: '2025-08-22', hasLogin: true, hasDiary: true },
  { date: '2025-08-23', hasLogin: true, hasDiary: false },
  // 24-30日
  { date: '2025-08-24', hasLogin: true, hasDiary: false },
  { date: '2025-08-25', hasLogin: true, hasDiary: true },
  { date: '2025-08-26', hasLogin: true, hasDiary: false },
  { date: '2025-08-27', hasLogin: true, hasDiary: true },
  { date: '2025-08-28', hasLogin: true, hasDiary: false },
  { date: '2025-08-29', hasLogin: true, hasDiary: true },
  { date: '2025-08-30', hasLogin: true, hasDiary: false },
];

// 7月の活動日
const july2025Activities: ActivityDay[] = [
  // 1-6日
  { date: '2025-07-01', hasLogin: true, hasDiary: true },
  { date: '2025-07-02', hasLogin: true, hasDiary: false },
  { date: '2025-07-03', hasLogin: true, hasDiary: true },
  { date: '2025-07-04', hasLogin: true, hasDiary: false },
  { date: '2025-07-05', hasLogin: true, hasDiary: true },
  { date: '2025-07-06', hasLogin: true, hasDiary: false },
];

// 全活動日をマージ
const allActivityDays: ActivityDay[] = [
  ...july2025Activities,
  ...august2025Activities,
  ...september2025Activities,
];

// 直近1週間の活動（9月24日〜30日と仮定）
const weeklyActivity: DayActivity[] = [
  { dayOfWeek: 'S', hasActivity: true, date: '2025-09-28' }, // 日曜
  { dayOfWeek: 'M', hasActivity: true, date: '2025-09-29' }, // 月曜
  { dayOfWeek: 'T', hasActivity: true, date: '2025-09-30' }, // 火曜
  { dayOfWeek: 'W', hasActivity: false }, // 水曜（未来）
  { dayOfWeek: 'T', hasActivity: false }, // 木曜
  { dayOfWeek: 'F', hasActivity: false }, // 金曜
  { dayOfWeek: 'S', hasActivity: false }, // 土曜
];

export const mockCalendarData: CalendarData = {
  continuousDays: 953, // イメージ図に基づく
  totalLoginDays: allActivityDays.filter(d => d.hasLogin).length,
  totalDiaryDays: allActivityDays.filter(d => d.hasDiary).length,
  activityDays: allActivityDays,
  weeklyActivity,
};

// 月別データ
export const mockMonthlyData: MonthData[] = [
  {
    year: 2025,
    month: 9,
    activityDays: september2025Activities,
  },
  {
    year: 2025,
    month: 8,
    activityDays: august2025Activities,
  },
  {
    year: 2025,
    month: 7,
    activityDays: july2025Activities,
  },
];
