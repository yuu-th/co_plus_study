// Mentor data converters (DB ↔ Frontend)
// @see specs/features/mentor.md

import type { StudentSummary, StudentDetail } from '@/features/mentor/types';

// DBから取得する型
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
    diary_count?: number;
    total_duration?: number;
    last_diary_at?: string | null;
}

/**
 * DB形式の生徒サマリーをフロントエンド形式に変換
 */
export function convertStudentSummaryFromDB(dbStudent: StudentSummaryFromDB): StudentSummary {
    return {
        id: dbStudent.id,
        displayName: dbStudent.display_name,
        avatarUrl: dbStudent.avatar_url ?? undefined,
        lastActivity: dbStudent.last_seen_at ?? dbStudent.created_at,
        // 統計情報は別クエリで取得するため、デフォルト値
        totalPosts: 0,
        totalHours: 0,
    };
}

/**
 * DB形式の生徒詳細をフロントエンド形式に変換
 */
export function convertStudentDetailFromDB(dbStudent: StudentDetailFromDB): StudentDetail {
    const totalMinutes = dbStudent.total_duration ?? 0;
    const totalHours = Math.round(totalMinutes / 60 * 10) / 10; // 小数点1桁

    return {
        id: dbStudent.id,
        displayName: dbStudent.display_name,
        nameKana: dbStudent.name_kana ?? undefined,
        avatarUrl: dbStudent.avatar_url ?? undefined,
        lastActivity: dbStudent.last_seen_at ?? dbStudent.created_at,
        totalPosts: dbStudent.diary_count ?? 0,
        totalHours,
        stats: {
            continuousDays: 0, // 別途計算
            totalHours,
            subjectBreakdown: [], // 別途取得
        },
        joinedAt: dbStudent.created_at,
        posts: [], // 別途取得
    };
}
