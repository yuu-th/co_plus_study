// カレンダー・活動記録のモックデータ
// @see specs/features/archive.md

import type { ActivityDay, CalendarData, DayActivity, MonthData } from '../types/calendar';

// 9月の活動日
const september2025Activities: ActivityDay[] = [
    { date: '2025-09-01', hasLogin: true, hasDiary: true },
    { date: '2025-09-02', hasLogin: true, hasDiary: false },
    { date: '2025-09-03', hasLogin: true, hasDiary: true },
    { date: '2025-09-04', hasLogin: true, hasDiary: true },
    { date: '2025-09-05', hasLogin: true, hasDiary: false },
    { date: '2025-09-06', hasLogin: true, hasDiary: true },
    { date: '2025-09-07', hasLogin: true, hasDiary: false },
    { date: '2025-09-08', hasLogin: true, hasDiary: true },
    { date: '2025-09-09', hasLogin: true, hasDiary: true },
    { date: '2025-09-10', hasLogin: true, hasDiary: false },
    { date: '2025-09-11', hasLogin: true, hasDiary: true },
    { date: '2025-09-12', hasLogin: true, hasDiary: true },
    { date: '2025-09-13', hasLogin: true, hasDiary: false },
    { date: '2025-09-14', hasLogin: true, hasDiary: true },
    { date: '2025-09-15', hasLogin: true, hasDiary: true },
    { date: '2025-09-16', hasLogin: true, hasDiary: false },
    { date: '2025-09-17', hasLogin: true, hasDiary: true },
    { date: '2025-09-18', hasLogin: true, hasDiary: false },
    { date: '2025-09-19', hasLogin: true, hasDiary: true },
    { date: '2025-09-20', hasLogin: true, hasDiary: false },
    { date: '2025-09-21', hasLogin: true, hasDiary: false },
    { date: '2025-09-22', hasLogin: true, hasDiary: true },
    { date: '2025-09-23', hasLogin: true, hasDiary: false },
    { date: '2025-09-24', hasLogin: true, hasDiary: true },
    { date: '2025-09-25', hasLogin: true, hasDiary: true },
    { date: '2025-09-26', hasLogin: true, hasDiary: false },
    { date: '2025-09-27', hasLogin: true, hasDiary: true },
    { date: '2025-09-28', hasLogin: true, hasDiary: false },
    { date: '2025-09-29', hasLogin: true, hasDiary: true },
    { date: '2025-09-30', hasLogin: true, hasDiary: false },
];

// 8月の活動日
const august2025Activities: ActivityDay[] = [
    { date: '2025-08-01', hasLogin: true, hasDiary: true },
    { date: '2025-08-02', hasLogin: true, hasDiary: false },
    { date: '2025-08-03', hasLogin: true, hasDiary: false },
    { date: '2025-08-04', hasLogin: true, hasDiary: true },
    { date: '2025-08-05', hasLogin: true, hasDiary: false },
    { date: '2025-08-06', hasLogin: true, hasDiary: true },
    { date: '2025-08-07', hasLogin: true, hasDiary: true },
    { date: '2025-08-08', hasLogin: true, hasDiary: false },
    { date: '2025-08-09', hasLogin: true, hasDiary: true },
    { date: '2025-08-10', hasLogin: true, hasDiary: false },
    { date: '2025-08-11', hasLogin: true, hasDiary: true },
    { date: '2025-08-12', hasLogin: true, hasDiary: false },
    { date: '2025-08-13', hasLogin: true, hasDiary: true },
    { date: '2025-08-14', hasLogin: true, hasDiary: false },
    { date: '2025-08-15', hasLogin: true, hasDiary: true },
    { date: '2025-08-16', hasLogin: true, hasDiary: false },
    { date: '2025-08-17', hasLogin: true, hasDiary: false },
    { date: '2025-08-18', hasLogin: true, hasDiary: true },
    { date: '2025-08-19', hasLogin: true, hasDiary: false },
    { date: '2025-08-20', hasLogin: true, hasDiary: true },
    { date: '2025-08-21', hasLogin: true, hasDiary: false },
    { date: '2025-08-22', hasLogin: true, hasDiary: true },
    { date: '2025-08-23', hasLogin: true, hasDiary: false },
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

// 直近1週間の活動
const weeklyActivity: DayActivity[] = [
    { dayOfWeek: 'S', hasActivity: true, date: '2025-09-28' },
    { dayOfWeek: 'M', hasActivity: true, date: '2025-09-29' },
    { dayOfWeek: 'T', hasActivity: true, date: '2025-09-30' },
    { dayOfWeek: 'W', hasActivity: false },
    { dayOfWeek: 'T', hasActivity: false },
    { dayOfWeek: 'F', hasActivity: false },
    { dayOfWeek: 'S', hasActivity: false },
];

export const mockCalendarData: CalendarData = {
    continuousDays: 953,
    longestStreak: 953,
    totalDays: allActivityDays.filter(d => d.hasLogin).length,
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
