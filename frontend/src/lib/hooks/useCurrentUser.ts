// Hook for fetching current user's profile
// @see ADR-005: バックエンド連携アーキテクチャ

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { useAuth } from '../auth';

export const CURRENT_USER_QUERY_KEY = ['currentUser'] as const;

// Types
interface ProfileRow {
    id: string;
    role: string;
    display_name: string;
    name_kana: string | null;
    avatar_url: string | null;
    grade: string | null;
    gender: string | null;
    last_seen_at: string | null;
    created_at: string;
    updated_at: string;
}

interface UseCurrentUserResult {
    user: ProfileRow | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
}

export function useCurrentUser(): UseCurrentUserResult {
    const { user: authUser, isLoading: authLoading } = useAuth();

    const { data, isLoading, error, refetch } = useQuery<ProfileRow | null, Error>({
        queryKey: CURRENT_USER_QUERY_KEY,
        queryFn: async () => {
            if (!authUser) return null;

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return data as ProfileRow;
        },
        enabled: !!authUser && !authLoading,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    return {
        user: data ?? null,
        isLoading: authLoading || isLoading,
        error: error ?? null,
        refetch,
    };
}

export default useCurrentUser;
