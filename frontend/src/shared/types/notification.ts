// お知らせ機能 型定義

/** 通知カテゴリ */
export type NotificationCategory = 'info' | 'important' | 'event' | 'achievement';

/** 通知優先度 */
export type NotificationPriority = 'low' | 'normal' | 'high';

/** 通知本体 */
export interface Notification {
    id: string;
    title: string;
    message: string;
    category: NotificationCategory;
    createdAt: string; // ISO8601
    read: boolean; // 既読フラグ
    targetUserIds?: string[]; // 対象ユーザー (未指定で全体)
    expiresAt?: string; // 期限 (任意)
    priority?: NotificationPriority; // 表示順制御用
}

/** 未読件数などの簡易メタ情報 */
export interface NotificationMeta {
    unreadCount: number;
    latestCreatedAt?: string;
}
