// Calendar data hook (dynamic calculation from diary posts)
// @see ADR-005: バックエンド連携アーキテクチャ

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';

// Query keys
export const CALENDAR_QUERY_KEYS = {
    all: ['calendar'] as const,
    month: (year: number, month: number) => [...CALENDAR_QUERY_KEYS.all, 'month', year, month] as const,
    user: (userId: string, year: number, month: number) => [...CALENDAR_QUERY_KEYS.all, 'user', userId, year, month] as const,
};

// Types
export interface CalendarDay {
    date: string; // YYYY-MM-DD
    hasActivity: boolean;
    postsCount: number;
    totalMinutes: number;
    subjects: string[];
}

export interface CalendarData {
    year: number;
    month: number;
    days: CalendarDay[];
    streakCurrent: number;
    streakMax: number;
    totalActiveDays: number;
}

// Fetch calendar data for a specific month
export function useCalendarData(userId?: string, year?: number, month?: number) {
    const now = new Date();
    const targetYear = year ?? now.getFullYear();
    const targetMonth = month ?? now.getMonth() + 1; // 1-indexed

    return useQuery({
        queryKey: userId
            ? CALENDAR_QUERY_KEYS.user(userId, targetYear, targetMonth)
            : CALENDAR_QUERY_KEYS.month(targetYear, targetMonth),
        queryFn: async () => {
            if (!userId) {
                return createEmptyCalendarData(targetYear, targetMonth);
            }

            // Calculate date range for the month
            const startDate = new Date(targetYear, targetMonth - 1, 1);
            const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

            // Fetch diary posts for the month
            const { data: posts, error } = await supabase
                .from('diary_posts')
                .select('created_at, duration_minutes, subject')
                .eq('user_id', userId)
                .gte('created_at', startDate.toISOString())
                .lte('created_at', endDate.toISOString());

            if (error) {
                throw new Error(error.message);
            }

            const postList = (posts || []) as { created_at: string; duration_minutes: number; subject: string }[];

            // Also fetch all posts for streak calculation
            const { data: allPosts } = await supabase
                .from('diary_posts')
                .select('created_at')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            const allPostList = (allPosts || []) as { created_at: string }[];

            // Group posts by date
            const dayMap = new Map<string, { count: number; minutes: number; subjects: Set<string> }>();

            postList.forEach(post => {
                const date = new Date(post.created_at).toISOString().split('T')[0];
                const existing = dayMap.get(date) || { count: 0, minutes: 0, subjects: new Set() };
                existing.count++;
                existing.minutes += post.duration_minutes;
                existing.subjects.add(post.subject);
                dayMap.set(date, existing);
            });

            // Generate all days in the month
            const daysInMonth = endDate.getDate();
            const days: CalendarDay[] = [];

            for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayData = dayMap.get(dateStr);

                days.push({
                    date: dateStr,
                    hasActivity: !!dayData,
                    postsCount: dayData?.count || 0,
                    totalMinutes: dayData?.minutes || 0,
                    subjects: dayData ? Array.from(dayData.subjects) : [],
                });
            }

            // Calculate streaks
            const { current, max } = calculateStreaks(allPostList);

            return {
                year: targetYear,
                month: targetMonth,
                days,
                streakCurrent: current,
                streakMax: max,
                totalActiveDays: dayMap.size,
            } as CalendarData;
        },
        enabled: !!userId,
    });
}

// Calculate current and max streak
function calculateStreaks(posts: { created_at: string }[]): { current: number; max: number } {
    if (posts.length === 0) {
        return { current: 0, max: 0 };
    }

    // Get unique dates
    const dates = new Set(
        posts.map(p => new Date(p.created_at).toISOString().split('T')[0])
    );

    if (dates.size === 0) {
        return { current: 0, max: 0 };
    }

    // Check if current streak is active (posted today or yesterday)
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;

    // Calculate streaks
    const sortedAsc = Array.from(dates).sort();

    for (const dateStr of sortedAsc) {
        const date = new Date(dateStr);

        if (prevDate) {
            const diffDays = Math.round((date.getTime() - prevDate.getTime()) / 86400000);

            if (diffDays === 1) {
                tempStreak++;
            } else {
                tempStreak = 1;
            }
        } else {
            tempStreak = 1;
        }

        maxStreak = Math.max(maxStreak, tempStreak);
        prevDate = date;
    }

    // Calculate current streak (must be connected to today or yesterday)
    if (dates.has(today) || dates.has(yesterday)) {
        const startDate = dates.has(today) ? today : yesterday;
        currentStreak = 1;

        const checkDate = new Date(startDate);
        checkDate.setDate(checkDate.getDate() - 1);

        while (dates.has(checkDate.toISOString().split('T')[0])) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }
    }

    return { current: currentStreak, max: maxStreak };
}

// Create empty calendar data
function createEmptyCalendarData(year: number, month: number): CalendarData {
    const endDate = new Date(year, month, 0);
    const daysInMonth = endDate.getDate();
    const days: CalendarDay[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        days.push({
            date: dateStr,
            hasActivity: false,
            postsCount: 0,
            totalMinutes: 0,
            subjects: [],
        });
    }

    return {
        year,
        month,
        days,
        streakCurrent: 0,
        streakMax: 0,
        totalActiveDays: 0,
    };
}
