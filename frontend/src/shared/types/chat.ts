// @see specs/features/chat.md

/**
 * メッセージへのリアクション（LINE風）
 * @see specs/features/chat.md
 */
export interface MessageReaction {
    /** リアクション絵文字（👍 ❤️ 🎉 👏 🔥） */
    emoji: string;
    /** リアクションしたユーザーID配列 */
    userIds: string[];
}

/**
 * チャットメッセージ本体
 * @see specs/features/chat.md
 */
export interface Message {
    /** メッセージの一意識別子 */
    id: string;
    /** 送信者ID */
    senderId: string;
    /** 送信者名 */
    senderName: string;
    /** 役割 */
    senderRole: 'student' | 'mentor';
    /** アバター画像URL */
    senderAvatarUrl?: string;
    /** テキスト本文（最大500文字）またはキャプション */
    content: string;
    /** 送信日時（ISO8601） */
    timestamp: string;
    /** 既読フラグ */
    isRead: boolean;
    /** メッセージタイプ（デフォルト: 'text'） */
    type?: 'text' | 'image';
    /** 画像URL（type='image' 時に設定） */
    imageUrl?: string;
    /** LINEスタイルリアクション */
    reactions?: MessageReaction[];
}

/**
 * チャットルーム
 * @see specs/features/chat.md
 */
export interface ChatRoom {
    /** チャットルームID */
    id: string;
    /** メンターID */
    mentorId: string;
    /** メンター名（システム名） */
    mentorName: string;
    /** メンターのアバター画像URL */
    mentorAvatarUrl?: string;
    /** メンターのオンライン状態 */
    mentorStatus: 'online' | 'offline';
    /** メンターの最終ログイン（ISO8601） */
    lastSeen?: string;
    /** 生徒ID */
    studentId: string;
    /** 生徒の表示名 */
    studentName: string;
    /** 生徒のアバター画像URL */
    studentAvatarUrl?: string;
    /** メッセージ配列 */
    messages: Message[];
}
