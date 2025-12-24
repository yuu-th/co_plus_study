// お知らせ機能 型定義
// @see ADR-005: notifications, user_notifications テーブル

/** 通知カテゴリ - DB: notification_category enum */
export type NotificationCategory = 'info' | 'event' | 'important';

/** 通知優先度 - DB: priority */
export type NotificationPriority = 'low' | 'medium' | 'high';

/**
 * 通知本体
 * @see ADR-005: notifications テーブル + user_notifications テーブル
 */
export interface Notification {
    /** 一意識別子 - DB: id */
    id: string;
    /** カテゴリ - DB: category */
    category: NotificationCategory;
    /** タイトル - DB: title */
    title: string;
    /** 本文 - DB: content（※旧 message から変更） */
    content: string;
    /** 作成日時 - DB: created_at */
    createdAt: string;
    /** 既読フラグ - DB: user_notifications.is_read */
    isRead: boolean;
    /** 優先度 - DB: priority */
    priority?: NotificationPriority;
    /** 作成者ID - DB: created_by */
    createdBy?: string;
    /** アイコンURL - DB: icon_url */
    iconUrl?: string;
    /** 期限 - DB: expires_at */
    expiresAt?: string;
}

/** 未読件数などの簡易メタ情報（UI用） */
export interface NotificationMeta {
    unreadCount: number;
    latestTimestamp?: string;
}
