// Mentor-specific data hooks
// @see ADR-005: バックエンド連携アーキテクチャ
// @see specs/features/mentor.md

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';

// Query keys
export const MENTOR_QUERY_KEYS = {
    all: ['mentor'] as const,
    students: (mentorId: string) => [...MENTOR_QUERY_KEYS.all, 'students', mentorId] as const,
    studentDetail: (studentId: string) => [...MENTOR_QUERY_KEYS.all, 'studentDetail', studentId] as const,
};

// Types
interface StudentSummaryFromDB {
    id: string;
    display_name: string;
    avatar_url: string | null;
    grade: string | null;
    last_seen_at: string | null;
    created_at: string;
}

interface StudentDetailFromDB extends StudentSummaryFromDB {
    name_kana: string | null;
    gender: string | null;
    // 統計情報はサブクエリで取得
    diary_count?: number;
    total_duration?: number;
    last_diary_at?: string | null;
}

interface ChatRoomWithStudent {
    id: string;
    student_id: string;
    student: StudentSummaryFromDB;
}

/**
 * メンターがアサインされた生徒一覧を取得
 * chat_roomsテーブルを通じて紐づけを確認
 */
export function useMentorStudents(mentorId?: string) {
    return useQuery({
        queryKey: MENTOR_QUERY_KEYS.students(mentorId ?? ''),
        queryFn: async () => {
            if (!mentorId) return [];

            // chat_roomsからメンターがアサインされた生徒を取得
            const { data: chatRooms, error: roomError } = await supabase
                .from('chat_rooms')
                .select(`
                    id,
                    student_id,
                    student:profiles!student_id(
                        id,
                        display_name,
                        avatar_url,
                        grade,
                        last_seen_at,
                        created_at
                    )
                `)
                .eq('mentor_id', mentorId);

            if (roomError) {
                throw new Error(roomError.message);
            }

            // 生徒情報を抽出（重複排除）
            const studentMap = new Map<string, StudentSummaryFromDB>();
            (chatRooms as unknown as ChatRoomWithStudent[])?.forEach(room => {
                if (room.student && !studentMap.has(room.student.id)) {
                    studentMap.set(room.student.id, room.student);
                }
            });

            return Array.from(studentMap.values());
        },
        enabled: !!mentorId,
    });
}

/**
 * 特定の生徒の詳細情報を取得（メンター用）
 */
export function useStudentDetail(studentId?: string) {
    return useQuery({
        queryKey: MENTOR_QUERY_KEYS.studentDetail(studentId ?? ''),
        queryFn: async () => {
            if (!studentId) return null;

            // プロフィール取得
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', studentId)
                .single();

            if (profileError) {
                throw new Error(profileError.message);
            }

            // 日報統計を取得
            const { data: diaryStats, error: diaryError } = await supabase
                .from('diary_posts')
                .select('id, duration, created_at')
                .eq('user_id', studentId);

            if (diaryError) {
                throw new Error(diaryError.message);
            }

            const diaryList = diaryStats as { id: string; duration: number; created_at: string }[] || [];
            const totalDuration = diaryList.reduce((sum, d) => sum + (d.duration || 0), 0);
            const lastDiary = diaryList.length > 0 
                ? diaryList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
                : null;

            return {
                ...profile,
                diary_count: diaryList.length,
                total_duration: totalDuration,
                last_diary_at: lastDiary?.created_at ?? null,
            } as StudentDetailFromDB;
        },
        enabled: !!studentId,
    });
}
