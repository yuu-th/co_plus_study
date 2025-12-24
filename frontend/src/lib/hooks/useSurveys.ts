// Survey data hooks
// @see ADR-005: バックエンド連携アーキテクチャ

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

// Query keys
export const SURVEY_QUERY_KEYS = {
    all: ['surveys'] as const,
    list: () => [...SURVEY_QUERY_KEYS.all, 'list'] as const,
    active: () => [...SURVEY_QUERY_KEYS.all, 'active'] as const,
    detail: (id: string) => [...SURVEY_QUERY_KEYS.all, 'detail', id] as const,
    responses: (surveyId: string) => [...SURVEY_QUERY_KEYS.all, 'responses', surveyId] as const,
    userResponse: (surveyId: string, userId: string) => [...SURVEY_QUERY_KEYS.all, 'userResponse', surveyId, userId] as const,
};

// Types
interface SurveyRow {
    id: string;
    title: string;
    description: string | null;
    questions: unknown;
    release_date: string | null;
    due_date: string | null;
    status: string;
    created_by: string;
    created_at: string;
}

interface SurveyWithCreator extends SurveyRow {
    creator: {
        id: string;
        display_name: string;
    };
}

interface SurveyResponseRow {
    id: string;
    survey_id: string;
    user_id: string;
    answers: unknown;
    submitted_at: string;
}

interface SurveyResponseWithUser extends SurveyResponseRow {
    user: {
        id: string;
        display_name: string;
    };
}

interface CreateSurveyInput {
    title: string;
    description?: string | null;
    questions: unknown;
    release_date?: string | null;
    due_date?: string | null;
    status?: 'draft' | 'scheduled' | 'active' | 'closed';
    created_by: string;
}

interface SubmitResponseInput {
    survey_id: string;
    user_id: string;
    answers: unknown;
}

// Fetch active surveys for students
export function useActiveSurveys() {
    return useQuery({
        queryKey: SURVEY_QUERY_KEYS.active(),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('surveys')
                .select(`
                    *,
                    creator:profiles!created_by(id, display_name)
                `)
                .eq('status', 'active')
                .order('release_date', { ascending: false });

            if (error) {
                throw new Error(error.message);
            }

            return data as unknown as SurveyWithCreator[];
        },
    });
}

// Fetch all surveys for mentors/admins
export function useAllSurveys() {
    return useQuery({
        queryKey: SURVEY_QUERY_KEYS.list(),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('surveys')
                .select(`
                    *,
                    creator:profiles!created_by(id, display_name)
                `)
                .order('created_at', { ascending: false });

            if (error) {
                throw new Error(error.message);
            }

            return data as unknown as SurveyWithCreator[];
        },
    });
}

// Fetch single survey
export function useSurvey(id: string) {
    return useQuery({
        queryKey: SURVEY_QUERY_KEYS.detail(id),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('surveys')
                .select(`
                    *,
                    creator:profiles!created_by(id, display_name)
                `)
                .eq('id', id)
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return data as unknown as SurveyWithCreator;
        },
        enabled: !!id,
    });
}

// Fetch survey responses (for survey creator)
export function useSurveyResponses(surveyId: string) {
    return useQuery({
        queryKey: SURVEY_QUERY_KEYS.responses(surveyId),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('survey_responses')
                .select(`
                    *,
                    user:profiles!user_id(id, display_name)
                `)
                .eq('survey_id', surveyId)
                .order('submitted_at', { ascending: false });

            if (error) {
                throw new Error(error.message);
            }

            return data as unknown as SurveyResponseWithUser[];
        },
        enabled: !!surveyId,
    });
}

// Check if user has already responded
export function useUserSurveyResponse(surveyId: string, userId: string) {
    return useQuery({
        queryKey: SURVEY_QUERY_KEYS.userResponse(surveyId, userId),
        queryFn: async () => {
            const { data, error } = await supabase
                .from('survey_responses')
                .select('*')
                .eq('survey_id', surveyId)
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') {
                throw new Error(error.message);
            }

            return data as SurveyResponseRow | null;
        },
        enabled: !!surveyId && !!userId,
    });
}

// Create survey mutation
export function useCreateSurvey() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (survey: CreateSurveyInput) => {
            const insertData = { ...survey } as unknown as Record<string, unknown>;
            const { data, error } = await supabase
                .from('surveys')
                .insert(insertData)
                .select()
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SURVEY_QUERY_KEYS.all });
        },
    });
}

// Update survey mutation
export function useUpdateSurvey() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: { id: string } & Partial<SurveyRow>) => {
            const updateData = { ...updates } as unknown as Record<string, unknown>;
            const { data, error } = await supabase
                .from('surveys')
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
            queryClient.invalidateQueries({ queryKey: SURVEY_QUERY_KEYS.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: SURVEY_QUERY_KEYS.list() });
        },
    });
}

// Delete survey mutation
export function useDeleteSurvey() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('surveys')
                .delete()
                .eq('id', id);

            if (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SURVEY_QUERY_KEYS.all });
        },
    });
}

// Submit survey response mutation
export function useSubmitSurveyResponse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (response: SubmitResponseInput) => {
            const insertData = { ...response } as unknown as Record<string, unknown>;
            const { data, error } = await supabase
                .from('survey_responses')
                .insert(insertData)
                .select()
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return data as SurveyResponseRow;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: SURVEY_QUERY_KEYS.responses(data.survey_id) });
            queryClient.invalidateQueries({
                queryKey: SURVEY_QUERY_KEYS.userResponse(data.survey_id, data.user_id)
            });
        },
    });
}
