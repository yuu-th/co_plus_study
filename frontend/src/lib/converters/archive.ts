// @see ADR-005: バックエンド連携アーキテクチャ
// 実績（Archive）データ変換ユーティリティ

import type { Badge, BadgeRank, BadgeStatus } from '@/shared/types';
import type { 
    CalendarData as FrontendCalendarData, 
    MonthData, 
    ActivityDay, 
    DayActivity 
} from '@/features/student/types/calendar';
import type { CalendarData as DBCalendarData, CalendarDay } from '@/lib/hooks/useCalendar';

/**
 * バックエンドから取得したBadge行データ
 */
interface BadgeFromDB {
    id: string;
    name: string;
    description: string;
    condition_description: string;
    rank: string;
    category: string;
    condition_logic: string;
    icon_url: string | null;
    sort_order: number;
    earnedAt: string | null;
    status: 'locked' | 'in_progress' | 'earned';
    progress: number;
}

/**
 * DB形式のBadgeをフロントエンド型に変換
 */
export function convertBadgeFromDB(dbBadge: BadgeFromDB): Badge {
    const validRanks: BadgeRank[] = ['platinum', 'gold', 'silver', 'bronze'];
    const rank = validRanks.includes(dbBadge.rank as BadgeRank) 
        ? (dbBadge.rank as BadgeRank) 
        : 'bronze';

    return {
        id: dbBadge.id,
        name: dbBadge.name,
        description: dbBadge.description,
        rank,
        category: dbBadge.category,
        iconUrl: dbBadge.icon_url ?? undefined,
        earnedAt: dbBadge.earnedAt ?? undefined,
        condition: dbBadge.condition_description,
        progress: dbBadge.progress,
        status: dbBadge.status as BadgeStatus,
    };
}

/**
 * CalendarDayからActivityDayへ変換
 */
function convertCalendarDayToActivityDay(day: CalendarDay): ActivityDay {
    return {
        date: day.date,
        hasLogin: day.hasActivity, // 活動があればログインとみなす
        hasDiary: day.postsCount > 0,
    };
}

/**
 * 週間活動データを生成
 */
function generateWeeklyActivity(days: CalendarDay[]): DayActivity[] {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=日曜日
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - dayOfWeek);

    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
    const result: DayActivity[] = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const dayData = days.find(d => d.date === dateStr);

        result.push({
            dayOfWeek: dayLabels[i],
            hasActivity: dayData?.hasActivity ?? false,
            date: dateStr,
        });
    }

    return result;
}

/**
 * DB形式のCalendarDataをフロントエンド型に変換
 */
export function convertCalendarDataFromDB(dbCalendar: DBCalendarData): FrontendCalendarData {
    const activityDays = dbCalendar.days.map(convertCalendarDayToActivityDay);
    const weeklyActivity = generateWeeklyActivity(dbCalendar.days);

    // 日報投稿日数をカウント
    const totalDiaryDays = dbCalendar.days.filter(d => d.postsCount > 0).length;

    return {
        continuousDays: dbCalendar.streakCurrent,
        longestStreak: dbCalendar.streakMax,
        totalDays: dbCalendar.totalActiveDays,
        totalLoginDays: dbCalendar.totalActiveDays, // 活動があればログインとみなす
        totalDiaryDays,
        activityDays,
        weeklyActivity,
    };
}

/**
 * 複数月のMonthDataを生成
 */
export function generateMonthlyDataFromCalendar(
    days: CalendarDay[],
    year: number,
    month: number
): MonthData[] {
    // 現在の月と前月のデータを生成
    const currentMonthDays = days.filter(d => {
        const [y, m] = d.date.split('-').map(Number);
        return y === year && m === month;
    });

    const activityDays = currentMonthDays.map(convertCalendarDayToActivityDay);

    return [
        {
            year,
            month,
            activityDays,
        },
    ];
}
