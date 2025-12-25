// Diary data hooks
// @see ADR-005: バックエンド連携アーキテクチャ

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

// Query keys
export const DIARY_QUERY_KEYS = {
    all: ['diaries'] as const,
    list: () => [...DIARY_QUERY_KEYS.all, 'list'] as const,
    detail: (id: string) => [...DIARY_QUERY_KEYS.all, 'detail', id] as const,
    userPosts: (userId: string) => [...DIARY_QUERY_KEYS.all, 'user', userId] as const,
};

// Types
interface DiaryPostRow {
    id: string;
    user_id: string;
    subject: string;
    duration_minutes: number;
    content: string;
    created_at: string;
}

interface DiaryPostWithUser extends DiaryPostRow {
    user: {
        id: string;
        display_name: string;
        avatar_url: string | null;
    };
    reactions: {
        reaction_type: string;
        count: number;
    }[];
}

interface CreateDiaryPostInput {
    user_id: string;
    subject: string;
    duration_minutes: number;
    content: string;
}

interface UpdateDiaryPostInput {
    id: string;
    subject?: string;
    duration_minutes?: number;
    content?: string;
}

interface AddReactionInput {
    post_id: string;
    user_id: string;
    reaction_type: string;
}

interface UseDiaryPostsOptions {
    userId?: string;
    limit?: number;
}

// Fetch diary posts with pagination
export function useDiaryPosts(options: UseDiaryPostsOptions = {}) {
    const { userId, limit = 20 } = options;

    return useInfiniteQuery({
        queryKey: userId ? DIARY_QUERY_KEYS.userPosts(userId) : DIARY_QUERY_KEYS.list(),
        queryFn: async ({ pageParam = 0 }) => {
            let query = supabase
                .from('diary_posts')
                .select(`
                    *,
                    user:profiles!user_id(id, display_name, avatar_url),
                    reactions:diary_reactions(reaction_type)
                `)
                .order('created_at', { ascending: false })
                .range(pageParam, pageParam + limit - 1);

            if (userId) {
                query = query.eq('user_id', userId);
            }

            const { data, error } = await query;

            if (error) {
                throw new Error(error.message);
            }

            const posts = (data || []).map((post: Record<string, unknown>) => {
                const reactions = post.reactions as { reaction_type: string }[] | null;
                const reactionCounts: Record<string, number> = {};

                (reactions || []).forEach((r) => {
                    reactionCounts[r.reaction_type] = (reactionCounts[r.reaction_type] || 0) + 1;
                });

                return {
                    ...post,
                    reactions: Object.entries(reactionCounts).map(([type, count]) => ({
                        reaction_type: type,
                        count,
                    })),
                };
            });

            return {
                data: posts as DiaryPostWithUser[],
                nextPage: data && data.length === limit ? pageParam + limit : undefined,
            };
        },
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 0,
    });
}

// Fetch single diary post
export function useDiaryPost(id: string) {
    return useQuery({
        queryKey: DIARY_QUERY_KEYS.detail(id),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('diary_posts')
                .select(`
                    *,
                    user:profiles!user_id(id, display_name, avatar_url),
                    reactions:diary_reactions(*)
                `)
                .eq('id', id)
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return data;
        },
        enabled: !!id,
    });
}

// Create diary post mutation
export function useCreateDiaryPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (post: CreateDiaryPostInput) => {
            const insertData = { ...post } as unknown as Record<string, unknown>;
            const { data, error } = await supabase
                .from('diary_posts')
                .insert(insertData)
                .select()
                .single();

            if (error) {
                throw new Error(error.message);
            }

            // バッジチェックを非同期で実行（エラーは無視）
            supabase.functions.invoke('check-badges', {
                body: { record: { user_id: post.user_id } },
            }).catch(() => {
                // バッジチェックが失敗しても日報投稿は成功とする
            });

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DIARY_QUERY_KEYS.all });
        },
    });
}

// Update diary post mutation
export function useUpdateDiaryPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: UpdateDiaryPostInput) => {
            const updateData = { ...updates } as unknown as Record<string, unknown>;
            const { data, error } = await supabase
                .from('diary_posts')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: DIARY_QUERY_KEYS.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: DIARY_QUERY_KEYS.list() });
        },
    });
}

// Delete diary post mutation
export function useDeleteDiaryPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('diary_posts')
                .delete()
                .eq('id', id);

            if (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DIARY_QUERY_KEYS.all });
        },
    });
}

// Add reaction mutation
export function useAddDiaryReaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (reaction: AddReactionInput) => {
            const insertData = { ...reaction } as unknown as Record<string, unknown>;
            const { data, error } = await supabase
                .from('diary_reactions')
                .insert(insertData)
                .select()
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DIARY_QUERY_KEYS.all });
        },
    });
}

// Remove reaction mutation
export function useRemoveDiaryReaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ postId, userId, reactionType }: { postId: string; userId: string; reactionType: string }) => {
            const { error } = await supabase
                .from('diary_reactions')
                .delete()
                .eq('post_id', postId)
                .eq('user_id', userId)
                .eq('reaction_type', reactionType);

            if (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DIARY_QUERY_KEYS.all });
        },
    });
}
