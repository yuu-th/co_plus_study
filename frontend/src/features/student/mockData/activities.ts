export interface Activity {
    id: string;
    type: 'diary' | 'badge' | 'chat' | 'survey';
    title: string;
    description: string;
    timestamp: string;
    link?: string;
}

export const mockActivities: Activity[] = [
    {
        id: 'act-1',
        type: 'diary',
        title: '学習日報を投稿しました',
        description: '数学の二次関数を1時間学習',
        timestamp: new Date().toISOString(),
        link: '/diary',
    },
    {
        id: 'act-2',
        type: 'badge',
        title: 'バッジを獲得しました',
        description: '「継続は力なり」バッジ',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        link: '/archive',
    },
    {
        id: 'act-3',
        type: 'chat',
        title: 'メッセージを受信しました',
        description: 'おにいさんから励ましのメッセージ',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        link: '/chat',
    },
];
