// @see specs/features/archive.md

/**
 * 活動日情報
 * @see specs/features/archive.md
 */
export interface ActivityDay {
    /** 日付（YYYY-MM-DD形式） */
    date: string;
    /** ログイン有無 */
    hasLogin: boolean;
    /** 日報投稿有無 */
    hasDiary: boolean;
}

/**
 * 曜日タイプ
 */
export type DayOfWeek = 'S' | 'M' | 'T' | 'W' | 'T' | 'F' | 'S';

/**
 * 曜日別活動情報
 */
export interface DayActivity {
    /** 曜日 */
    dayOfWeek: DayOfWeek;
    /** 活動有無 */
    hasActivity: boolean;
    /** 日付 */
    date?: string;
}

/**
 * 連続学習統計
 * @see specs/features/archive.md
 */
export interface ContinuousStats {
    /** 現在の連続日数 */
    currentStreak: number;
    /** 最長連続日数 */
    longestStreak: number;
    /** 累計活動日数 */
    totalDays: number;
}

/**
 * カレンダーデータ
 * @see specs/features/archive.md
 */
export interface CalendarData {
    /** 連続活動日数 */
    continuousDays: number;
    /** 最長連続日数 */
    longestStreak: number;
    /** 累計活動日数 */
    totalDays: number;
    /** 総ログイン日数 */
    totalLoginDays: number;
    /** 総日報投稿日数 */
    totalDiaryDays: number;
    /** 活動日配列 */
    activityDays: ActivityDay[];
    /** 週間活動 */
    weeklyActivity: DayActivity[];
}

/**
 * 月別データ
 */
export interface MonthData {
    /** 年 */
    year: number;
    /** 月（1-12） */
    month: number;
    /** 活動日配列 */
    activityDays: ActivityDay[];
}
