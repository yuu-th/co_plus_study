// チャットのモックデータ
// @see ADR-005: chat_rooms, messages テーブル

import type { ChatRoom, Message } from '@/shared/types';

export const mockMessages: Message[] = [
    {
        id: 'msg-1',
        senderId: '1',
        senderName: '田中太郎',
        senderRole: 'student',
        content: 'こんにちは！分数の割り算がよく分からなくて困っています。',
        timestamp: '2025-09-29T10:00:00Z',
        isRead: true,
        type: 'text',
    },
    {
        id: 'msg-2',
        senderId: 'mentor-1',
        senderName: '高専 花子',
        senderRole: 'mentor',
        content: 'こんにちは！分数の割り算ですね。どの部分が分かりにくいですか?',
        timestamp: '2025-09-29T10:15:00Z',
        isRead: true,
        type: 'text',
    },
    {
        id: 'msg-3',
        senderId: '1',
        senderName: '田中太郎',
        senderRole: 'student',
        content: 'なぜ割る数を逆にして掛けるのかが理解できません。',
        timestamp: '2025-09-29T10:20:00Z',
        isRead: true,
        type: 'text',
    },
    {
        id: 'msg-4',
        senderId: 'mentor-1',
        senderName: '高専 花子',
        senderRole: 'mentor',
        content: 'なるほど！それはとても良い質問ですね。例えば、1 ÷ 1/2 を考えてみましょう。1の中に1/2がいくつ入るか、という意味です。',
        timestamp: '2025-09-29T10:25:00Z',
        isRead: true,
        type: 'text',
    },
    {
        id: 'msg-5',
        senderId: 'mentor-1',
        senderName: '高専 花子',
        senderRole: 'mentor',
        content: '1の中に1/2は2つ入りますよね。つまり1 ÷ 1/2 = 2です。これを計算式で表すと、1 × 2/1 = 2 となります。',
        timestamp: '2025-09-29T10:26:00Z',
        isRead: true,
        type: 'text',
        reactions: [
            { emoji: '👍', userIds: ['1'] }
        ]
    },
    {
        id: 'msg-6',
        senderId: '1',
        senderName: '田中太郎',
        senderRole: 'student',
        content: 'なるほど！分かってきました。ありがとうございます！',
        timestamp: '2025-09-29T10:30:00Z',
        isRead: false,
        type: 'image',
        imageUrl: 'https://placehold.jp/300x200.png?text=Thank+You',
        reactions: [
            { emoji: '🎉', userIds: ['mentor-1'] }
        ]
    },
];

export const mockChatRoom: ChatRoom = {
    id: 'room-1',
    studentId: '1',
    studentName: '田中太郎',
    mentorId: 'mentor-1',
    mentorName: '高専 花子',
    mentorDisplayName: 'おねえさん',
    mentorStatus: 'online',
    messages: mockMessages,
};
