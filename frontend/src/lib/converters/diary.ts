// @see ADR-005: バックエンド連携アーキテクチャ
// DBデータ → フロントエンド型への変換ユーティリティ

import type { DiaryPost, Reaction, ReactionType } from '@/shared/types';

/**
 * バックエンドから取得したDiaryPost行データをフロントエンド型に変換
 */
interface DiaryPostFromDB {
    id: string;
    user_id: string;
    subject: string;
    duration_minutes: number;
    content: string;
    created_at: string;
    user?: {
        id: string;
        display_name: string;
        avatar_url: string | null;
    } | null;
    reactions?: Array<{
        reaction_type: string;
        count: number;
    }>;
}

/**
 * DB形式のDiaryPostをフロントエンド型に変換
 */
export function convertDiaryPostFromDB(dbPost: DiaryPostFromDB): DiaryPost {
    const validReactionTypes: ReactionType[] = ['👍', '❤️', '🎉', '👏', '🔥'];

    const reactions: Reaction[] = (dbPost.reactions || [])
        .filter(r => validReactionTypes.includes(r.reaction_type as ReactionType))
        .map(r => ({
            type: r.reaction_type as ReactionType,
            count: r.count,
            userIds: [], // 詳細が必要な場合は別途取得
            isMentorReaction: false, // 後で判定
        }));

    return {
        id: dbPost.id,
        userId: dbPost.user_id,
        userName: dbPost.user?.display_name ?? '不明なユーザー',
        subject: dbPost.subject as DiaryPost['subject'],
        duration: dbPost.duration_minutes,
        content: dbPost.content,
        timestamp: dbPost.created_at,
        reactions,
    };
}

/**
 * フロントエンド型のDiaryPostをDB挿入用形式に変換
 */
export function convertDiaryPostToDB(post: Pick<DiaryPost, 'userId' | 'subject' | 'duration' | 'content'>) {
    return {
        user_id: post.userId,
        subject: post.subject,
        duration_minutes: post.duration,
        content: post.content,
    };
}
