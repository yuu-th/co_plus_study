// ユーザーのモックデータ
// @see ADR-005: profiles テーブル

import type { User } from '@/shared/types';

export const mockCurrentUser: User = {
    id: '1',
    displayName: '田中太郎',
    nameKana: 'たなかたろう',
    role: 'student',
    email: 'tanaka@example.com',
    grade: '中学2年',
    createdAt: '2024-04-01T00:00:00.000Z',
};

export const mockMentor: User = {
    id: 'mentor-1',
    displayName: '高専 花子',
    nameKana: 'こうせんはなこ',
    role: 'mentor',
    email: 'hanako@example.com',
    gender: 'female',
    createdAt: '2024-01-01T00:00:00.000Z',
};

export const mockUsers: User[] = [
    mockCurrentUser,
    mockMentor,
    {
        id: '2',
        displayName: '佐藤次郎',
        nameKana: 'さとうじろう',
        role: 'student',
        grade: '小学6年',
    },
    {
        id: 'mentor-2',
        displayName: '先輩 太郎',
        nameKana: 'せんぱいたろう',
        role: 'mentor',
        gender: 'male',
    },
];
