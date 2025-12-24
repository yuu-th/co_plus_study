// 通知モックデータ
// @see ADR-005: notifications, user_notifications テーブル

import type { Notification } from '@/shared/types';

export const mockNotifications: Notification[] = [
    {
        id: 'ntf-1',
        title: '今週の目標を設定しよう',
        content: '学習計画シートで今週の目標を設定しましょう。早めの計画が成果につながります。',
        category: 'info',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        priority: 'medium',
    },
    {
        id: 'ntf-2',
        title: 'メンター相談会 (今夜19時)',
        content: 'メンターとのオンライン相談会が 19:00 に開催されます。質問を準備して参加しましょう。',
        category: 'event',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        priority: 'high',
    },
    {
        id: 'ntf-3',
        title: '英単語チャレンジ達成！',
        content: '先週の英単語チャレンジを達成しました。継続は力なり！次のステップに進みましょう。',
        category: 'important',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        priority: 'low',
    },
    {
        id: 'ntf-4',
        title: 'システムメンテナンスのお知らせ',
        content: '定期メンテナンスのため、明日は一時的にサービスが利用しにくくなる場合があります。',
        category: 'important',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        priority: 'medium',
    },
];
