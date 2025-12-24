// Notification型のDB ↔ フロントエンド変換
// @see specs/features/notification.md

import type { Notification, NotificationCategory, NotificationPriority } from '@/shared/types';

// DBから取得する生のデータ型（snake_case）
interface NotificationFromDB {
    id: string;
    category: string;
    title: string;
    content: string;
    priority: string;
    icon_url: string | null;
    created_by: string | null;
    expires_at: string | null;
    created_at: string;
    // user_notificationsとのJOIN結果
    userNotification?: {
        is_read: boolean;
        read_at: string | null;
    } | null;
    isRead?: boolean;
}

/**
 * DBのNotificationデータをフロントエンド型に変換
 */
export function convertNotificationFromDB(dbNotification: NotificationFromDB): Notification {
    return {
        id: dbNotification.id,
        category: dbNotification.category as NotificationCategory,
        title: dbNotification.title,
        content: dbNotification.content,
        createdAt: dbNotification.created_at,
        isRead: dbNotification.isRead ?? dbNotification.userNotification?.is_read ?? false,
        priority: (dbNotification.priority as NotificationPriority) || undefined,
        createdBy: dbNotification.created_by ?? undefined,
        iconUrl: dbNotification.icon_url ?? undefined,
        expiresAt: dbNotification.expires_at ?? undefined,
    };
}
