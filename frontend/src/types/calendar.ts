// カレンダー・活動記録関連の型定義

export interface ActivityDay {
  date: string; // YYYY-MM-DD
  hasLogin: boolean;
  hasDiary: boolean;
}

export type DayOfWeek = 'S' | 'M' | 'T' | 'W' | 'T' | 'F' | 'S';

export interface DayActivity {
  dayOfWeek: DayOfWeek;
  hasActivity: boolean;
  date?: string;
}

export interface CalendarData {
  continuousDays: number;
  totalLoginDays: number;
  totalDiaryDays: number;
  activityDays: ActivityDay[];
  weeklyActivity: DayActivity[];
}

export interface MonthData {
  year: number;
  month: number; // 1-12
  activityDays: ActivityDay[];
}
