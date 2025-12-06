// ユーザーのモックデータ

import type { User } from '@/shared/types';

export const mockCurrentUser: User = {
    id: '1',
    name: '田中太郎',
    role: 'student',
    email: 'tanaka@example.com',
};

export const mockMentor: User = {
    id: 'mentor-1',
    name: '高専 花子',
    role: 'mentor',
    email: 'hanako@example.com',
};

export const mockUsers: User[] = [
    mockCurrentUser,
    mockMentor,
    {
        id: '2',
        name: '佐藤次郎',
        role: 'student',
    },
    {
        id: 'mentor-2',
        name: '先輩 太郎',
        role: 'mentor',
    },
];
