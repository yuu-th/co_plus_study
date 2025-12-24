// @see specs/features/mentor.md
// @see ADR-005: profiles テーブル + mentor_profiles テーブル（新規追加）
// Mentor feature type definitions

import type { DiaryPost } from '@/shared/types/diary';

/**
 * メンターの専門分野
 * @see ADR-005: mentor_profiles.specialties (JSONB)
 */
export interface Specialty {
    /** 専門分野ID */
    id: string;
    /** 専門分野名（例: "算数", "英語"） */
    name: string;
}

/** メンターステータス - DB: mentor_profiles.status */
export type MentorStatus = 'active' | 'inactive';

/**
 * メンター情報
 * @see ADR-005: profiles + mentor_profiles テーブル
 */
export interface Mentor {
    /** メンターID - profiles.id */
    id: string;
    /** メンター名 - profiles.display_name */
    displayName: string;
    /** フリガナ - profiles.name_kana */
    nameKana?: string;
    /** アバター画像URL - profiles.avatar_url */
    avatarUrl?: string;
    /** 専門分野 - mentor_profiles.specialties (JSONB) */
    specialties?: Specialty[];
    /** 自己紹介文 - mentor_profiles.introduction */
    introduction?: string;
    /** メールアドレス（auth.users から取得） */
    email?: string;
    /** ステータス - mentor_profiles.status */
    status: MentorStatus;
    /** 作成日時（ISO8601）- profiles.created_at */
    createdAt: string;
    /** 性別 - profiles.gender */
    gender?: 'male' | 'female';
}

/**
 * 生徒の概要情報（一覧表示用）
 * @see specs/features/mentor.md
 * @see ADR-005: profiles テーブル
 */
export interface StudentSummary {
    /** 生徒ID - profiles.id */
    id: string;
    /** 生徒名 - profiles.display_name */
    displayName: string;
    /** フリガナ - profiles.name_kana */
    nameKana?: string;
    /** アバター画像URL - profiles.avatar_url */
    avatarUrl?: string;
    /** 総投稿数（クエリで集計） */
    totalPosts: number;
    /** 総学習時間（時間、クエリで集計） */
    totalHours: number;
    /** 最終活動日時（ISO8601、クエリで取得） */
    lastActivity: string;
}

/**
 * 教科別学習時間
 */
export interface SubjectTime {
    /** 教科名 */
    subject: string;
    /** 学習時間（時間） */
    hours: number;
}

/**
 * 生徒の統計情報
 * @see specs/features/mentor.md
 */
export interface StudentStats {
    /** 連続学習日数（クエリで算出） */
    continuousDays: number;
    /** 最長連続日数（クエリで算出） */
    longestStreak?: number;
    /** 累計活動日数（クエリで算出） */
    totalDays?: number;
    /** 累計学習時間（時間、クエリで集計） */
    totalHours: number;
    /** 教科別学習時間（クエリで集計） */
    subjectBreakdown: SubjectTime[];
}

/**
 * 生徒の詳細情報
 * @see specs/features/mentor.md
 */
export interface StudentDetail extends StudentSummary {
    /** 学習統計 */
    stats: StudentStats;
    /** 参加日時（ISO8601）- profiles.created_at */
    joinedAt?: string;
    /** 日報配列（別テーブルから取得） */
    posts: DiaryPost[];
}

/**
 * お知らせドラフト（メンター作成用）
 * @see specs/features/mentor.md
 * @see ADR-005: notifications テーブル
 */
export interface NotificationDraft {
    /** カテゴリ - notifications.category */
    category: 'info' | 'event' | 'important';
    /** タイトル - notifications.title */
    title: string;
    /** 本文 - notifications.content */
    content: string;
    /** 優先度 - notifications.priority */
    priority?: 'low' | 'medium' | 'high';
}
