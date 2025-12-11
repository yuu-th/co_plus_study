// ユーザー関連の型定義

export interface User {
    id: string;
    name: string;
    role: 'student' | 'mentor' | 'admin';
    avatarUrl?: string;
    email?: string;
    gender?: 'male' | 'female';
    grade?: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}
