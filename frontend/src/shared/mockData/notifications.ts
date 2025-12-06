// 通知モックデータ
import type { Notification } from '@/shared/types';

export const mockNotifications: Notification[] = [
    {
        id: 'ntf-1',
        title: '今週の目標を設定しよう',
        message: '学習計画シートで今週の目標を設定しましょう。早めの計画が成果につながります。',
        category: 'info',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        priority: 'normal',
    },
    {
        id: 'ntf-2',
        title: 'メンター相談会 (今夜19時)',
        message: 'メンターとのオンライン相談会が 19:00 に開催されます。質問を準備して参加しましょう。',
        category: 'event',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        read: false,
        priority: 'high',
    },
    {
        id: 'ntf-3',
        title: '英単語チャレンジ達成！',
        message: '先週の英単語チャレンジを達成しました。継続は力なり！次のステップに進みましょう。',
        category: 'achievement',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        priority: 'low',
    },
    {
        id: 'ntf-4',
        title: '重要: パスワード再設定のお願い',
        message: 'セキュリティ向上のため、アカウントのパスワード再設定をお願いいたします。マイページから変更可能です。',
        category: 'important',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        read: false,
        priority: 'high',
    },
];
