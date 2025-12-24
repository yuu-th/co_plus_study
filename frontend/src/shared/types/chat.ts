// @see specs/features/chat.md
// @see ADR-005: chat_rooms, messages, message_reactions テーブル

/** メッセージタイプ - DB: message_type enum */
export type MessageType = 'text' | 'image';

/** リアクション絵文字 - DB: reaction_emoji enum と統一 */
export type ReactionEmoji = '👍' | '❤️' | '🎉' | '👏' | '🔥';

/**
 * メッセージへのリアクション（LINE風）
 * @see ADR-005: message_reactions テーブル
 */
export interface MessageReaction {
    /** リアクション絵文字 - DB: emoji */
    emoji: ReactionEmoji;
    /** リアクションしたユーザーID配列（フロントエンド集約用） */
    userIds: string[];
}

/**
 * チャットメッセージ本体
 * @see ADR-005: messages テーブル
 */
export interface Message {
    /** メッセージの一意識別子 - DB: id */
    id: string;
    /** 送信者ID - DB: sender_id */
    senderId: string;
    /** 送信者名（JOINで取得）- profiles.display_name */
    senderName: string;
    /** 役割（JOINで取得）- profiles.role */
    senderRole: 'student' | 'mentor';
    /** アバター画像URL（JOINで取得）- profiles.avatar_url */
    senderAvatarUrl?: string;
    /** テキスト本文（最大500文字）またはキャプション - DB: content */
    content: string;
    /** 送信日時（ISO8601）- DB: created_at */
    timestamp: string;
    /** 既読フラグ - DB: is_read */
    isRead: boolean;
    /** メッセージタイプ（必須）- DB: message_type NOT NULL */
    type: MessageType;
    /** 画像URL（type='image' 時に設定）- DB: image_url */
    imageUrl?: string;
    /** LINEスタイルリアクション（別テーブルから集約） */
    reactions?: MessageReaction[];
}

/** メンターステータス（Supabase Presence で管理） */
export type MentorStatus = 'online' | 'offline';

/**
 * チャットルーム
 * @see ADR-005: chat_rooms テーブル
 */
export interface ChatRoom {
    /** チャットルームID - DB: id */
    id: string;
    /** メンターID - DB: mentor_id */
    mentorId: string;
    /** メンター名（JOINで取得）- profiles.display_name */
    mentorName: string;
    /** メンター表示名（「おにいさん」「おねえさん」）- gender から動的生成 */
    mentorDisplayName?: string;
    /** メンターのアバター画像URL（JOINで取得）- profiles.avatar_url */
    mentorAvatarUrl?: string;
    /** メンターのオンライン状態（Supabase Presence）*/
    mentorStatus: MentorStatus;
    /** メンターの最終ログイン（ISO8601）- profiles.last_seen_at */
    lastSeen?: string;
    /** 生徒ID - DB: student_id */
    studentId: string;
    /** 生徒の表示名（JOINで取得）- profiles.display_name */
    studentName: string;
    /** 生徒のアバター画像URL（JOINで取得）- profiles.avatar_url */
    studentAvatarUrl?: string;
    /** メッセージ配列（別テーブルから取得） */
    messages: Message[];
}
