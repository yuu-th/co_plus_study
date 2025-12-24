// Badge data hooks
// @see ADR-005: バックエンド連携アーキテクチャ

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';

// Query keys
export const BADGE_QUERY_KEYS = {
    all: ['badges'] as const,
    definitions: () => [...BADGE_QUERY_KEYS.all, 'definitions'] as const,
    userBadges: (userId: string) => [...BADGE_QUERY_KEYS.all, 'user', userId] as const,
    progress: (userId: string) => [...BADGE_QUERY_KEYS.all, 'progress', userId] as const,
};

// Types
interface BadgeDefinitionRow {
    id: string;
    name: string;
    description: string;
    condition_description: string;
    rank: string;
    category: string;
    condition_logic: string;
    icon_url: string | null;
    sort_order: number;
}

interface BadgeWithStatus extends BadgeDefinitionRow {
    earnedAt: string | null;
    status: 'locked' | 'in_progress' | 'earned';
    progress: number;
}

interface BadgeProgress {
    streak_days: number;
    total_posts: number;
    total_hours: number;
    unique_subjects: number;
    total_messages: number;
}

// Fetch all badge definitions
export function useBadgeDefinitions() {
    return useQuery({
        queryKey: BADGE_QUERY_KEYS.definitions(),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('badge_definitions')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) {
                throw new Error(error.message);
            }

            return data as BadgeDefinitionRow[];
        },
    });
}

// Fetch user's earned badges
export function useUserBadges(userId?: string) {
    return useQuery({
        queryKey: userId ? BADGE_QUERY_KEYS.userBadges(userId) : ['none'],
        queryFn: async () => {
            if (!userId) return [];

            const { data, error } = await supabase
                .from('user_badges')
                .select(`
                    *,
                    badge:badge_definitions(*)
                `)
                .eq('user_id', userId)
                .order('earned_at', { ascending: false });

            if (error) {
                throw new Error(error.message);
            }

            return data;
        },
        enabled: !!userId,
    });
}

// Calculate badge progress for user
async function calculateBadgeProgress(userId: string): Promise<BadgeProgress> {
    // Get diary posts for streak and total calculations
    const { data: posts } = await supabase
        .from('diary_posts')
        .select('created_at, duration_minutes, subject')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    // Get message count
    const { count: messageCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('sender_id', userId);

    const postList = (posts || []) as { created_at: string; duration_minutes: number; subject: string }[];

    // Calculate streak
    let streakDays = 0;
    if (postList.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const postDates = new Set(
            postList.map(p => {
                const d = new Date(p.created_at);
                d.setHours(0, 0, 0, 0);
                return d.getTime();
            })
        );

        // Check if there's a post today or yesterday to start counting
        const hasPostToday = postDates.has(today.getTime());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const hasPostYesterday = postDates.has(yesterday.getTime());

        if (hasPostToday || hasPostYesterday) {
            const currentDate = hasPostToday ? today : yesterday;
            streakDays = 1;

            // Count consecutive days
            const checkDate = new Date(currentDate);
            checkDate.setDate(checkDate.getDate() - 1);

            while (postDates.has(checkDate.getTime())) {
                streakDays++;
                checkDate.setDate(checkDate.getDate() - 1);
            }
        }
    }

    // Calculate total hours
    const totalMinutes = postList.reduce((sum, p) => sum + p.duration_minutes, 0);
    const totalHours = Math.floor(totalMinutes / 60);

    // Calculate unique subjects
    const uniqueSubjects = new Set(postList.map(p => p.subject)).size;

    return {
        streak_days: streakDays,
        total_posts: postList.length,
        total_hours: totalHours,
        unique_subjects: uniqueSubjects,
        total_messages: messageCount || 0,
    };
}

// Parse condition logic and calculate progress percentage
function calculateProgressPercentage(conditionLogic: string, progress: BadgeProgress): number {
    const [type, valueStr] = conditionLogic.split(':');
    const targetValue = parseInt(valueStr, 10);

    let currentValue = 0;
    switch (type) {
        case 'streak_days':
            currentValue = progress.streak_days;
            break;
        case 'total_posts':
            currentValue = progress.total_posts;
            break;
        case 'total_hours':
            currentValue = progress.total_hours;
            break;
        case 'unique_subjects':
            currentValue = progress.unique_subjects;
            break;
        case 'total_messages':
            currentValue = progress.total_messages;
            break;
        default:
            return 0;
    }

    return Math.min(100, Math.round((currentValue / targetValue) * 100));
}

// Fetch badges with progress and status
export function useBadgesWithProgress(userId?: string) {
    return useQuery({
        queryKey: userId ? BADGE_QUERY_KEYS.progress(userId) : ['none'],
        queryFn: async () => {
            if (!userId) return [];

            // Get all badge definitions
            const { data: definitions, error: defError } = await supabase
                .from('badge_definitions')
                .select('*')
                .order('sort_order', { ascending: true });

            if (defError) {
                throw new Error(defError.message);
            }

            // Get user's earned badges
            const { data: earnedBadges, error: earnedError } = await supabase
                .from('user_badges')
                .select('badge_id, earned_at')
                .eq('user_id', userId);

            if (earnedError) {
                throw new Error(earnedError.message);
            }

            const definitionList = (definitions || []) as BadgeDefinitionRow[];
            const earnedList = (earnedBadges || []) as { badge_id: string; earned_at: string }[];

            // Calculate progress
            const progress = await calculateBadgeProgress(userId);

            // Map earned badges for quick lookup
            const earnedMap = new Map(
                earnedList.map(eb => [eb.badge_id, eb.earned_at])
            );

            // Combine data
            const badgesWithStatus: BadgeWithStatus[] = definitionList.map(def => {
                const earnedAt = earnedMap.get(def.id) || null;
                const progressPercent = earnedAt ? 100 : calculateProgressPercentage(def.condition_logic, progress);

                let status: 'locked' | 'in_progress' | 'earned' = 'locked';
                if (earnedAt) {
                    status = 'earned';
                } else if (progressPercent > 0) {
                    status = 'in_progress';
                }

                return {
                    ...def,
                    earnedAt,
                    status,
                    progress: progressPercent,
                };
            });

            return badgesWithStatus;
        },
        enabled: !!userId,
    });
}

// Get current streak days
export function useStreak(userId?: string) {
    return useQuery({
        queryKey: ['streak', userId],
        queryFn: async () => {
            if (!userId) return 0;
            const progress = await calculateBadgeProgress(userId);
            return progress.streak_days;
        },
        enabled: !!userId,
    });
}
