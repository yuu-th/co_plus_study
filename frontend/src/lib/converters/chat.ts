// @see ADR-005: バックエンド連携アーキテクチャ
// チャットデータ変換ユーティリティ

import type { ChatRoom, Message, MessageReaction, ReactionEmoji } from '@/shared/types';

/**
 * バックエンドから取得したMessage行データ
 */
interface MessageFromDB {
    id: string;
    room_id: string;
    sender_id: string;
    message_type: string;
    content: string | null;
    image_url: string | null;
    is_read: boolean;
    created_at: string;
    sender?: {
        id: string;
        display_name: string;
        avatar_url: string | null;
        role: string;
    } | null;
    reactions?: Array<{
        emoji: string;
        user_id: string;
    }>;
}

/**
 * バックエンドから取得したChatRoom行データ
 */
interface ChatRoomFromDB {
    id: string;
    student_id: string;
    mentor_id: string;
    created_at: string;
    student?: {
        id: string;
        display_name: string;
        avatar_url: string | null;
    } | null;
    mentor?: {
        id: string;
        display_name: string;
        avatar_url: string | null;
        gender: string | null;
    } | null;
}

/**
 * DB形式のMessageをフロントエンド型に変換
 */
export function convertMessageFromDB(dbMessage: MessageFromDB): Message {
    const validEmojis: ReactionEmoji[] = ['👍', '❤️', '🎉', '👏', '🔥'];

    // リアクションをユーザーID配列でグループ化
    const reactionMap = new Map<string, string[]>();
    (dbMessage.reactions || []).forEach(r => {
        if (validEmojis.includes(r.emoji as ReactionEmoji)) {
            const existing = reactionMap.get(r.emoji) || [];
            existing.push(r.user_id);
            reactionMap.set(r.emoji, existing);
        }
    });

    const reactions: MessageReaction[] = Array.from(reactionMap.entries()).map(([emoji, userIds]) => ({
        emoji: emoji as ReactionEmoji,
        userIds,
    }));

    return {
        id: dbMessage.id,
        senderId: dbMessage.sender_id,
        senderName: dbMessage.sender?.display_name ?? '不明なユーザー',
        senderRole: (dbMessage.sender?.role === 'mentor' ? 'mentor' : 'student') as 'student' | 'mentor',
        senderAvatarUrl: dbMessage.sender?.avatar_url ?? undefined,
        content: dbMessage.content ?? '',
        timestamp: dbMessage.created_at,
        isRead: dbMessage.is_read,
        type: dbMessage.message_type as Message['type'],
        imageUrl: dbMessage.image_url ?? undefined,
        reactions: reactions.length > 0 ? reactions : undefined,
    };
}

/**
 * メンター表示名を生成（gender から「おにいさん」「おねえさん」）
 */
function getMentorDisplayName(displayName: string, gender: string | null): string {
    if (gender === 'female') return 'おねえさん';
    if (gender === 'male') return 'おにいさん';
    return displayName;
}

/**
 * DB形式のChatRoomをフロントエンド型に変換
 */
export function convertChatRoomFromDB(dbRoom: ChatRoomFromDB): Omit<ChatRoom, 'messages'> {
    const mentorDisplayName = getMentorDisplayName(
        dbRoom.mentor?.display_name ?? 'メンター',
        dbRoom.mentor?.gender ?? null
    );

    return {
        id: dbRoom.id,
        mentorId: dbRoom.mentor_id,
        mentorName: dbRoom.mentor?.display_name ?? 'メンター',
        mentorDisplayName,
        mentorAvatarUrl: dbRoom.mentor?.avatar_url ?? undefined,
        mentorStatus: 'offline', // Presenceで後から更新
        studentId: dbRoom.student_id,
        studentName: dbRoom.student?.display_name ?? '生徒',
        studentAvatarUrl: dbRoom.student?.avatar_url ?? undefined,
    };
}
