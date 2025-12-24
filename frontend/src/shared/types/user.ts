// ユーザー関連の型定義
// @see ADR-005: profiles テーブル

/** ユーザーロール */
export type UserRole = 'student' | 'mentor' | 'admin';

/** 性別（メンター表示名決定用: おにいさん/おねえさん） */
export type Gender = 'male' | 'female';

/** 学年（生徒のみ） */
export type Grade =
    | '小学1年' | '小学2年' | '小学3年' | '小学4年' | '小学5年' | '小学6年'
    | '中学1年' | '中学2年' | '中学3年';

/**
 * ユーザー情報
 * @see ADR-005: profiles テーブル
 */
export interface User {
    /** 一意識別子 (UUID) - Supabase Auth の user id */
    id: string;
    /** 表示名（必須） - DB: display_name */
    displayName: string;
    /** ふりがな（ひらがな/カタカナ） - DB: name_kana */
    nameKana?: string;
    /** ロール - DB: role */
    role: UserRole;
    /** アバター画像URL（Supabase Storage） - DB: avatar_url */
    avatarUrl?: string;
    /** メールアドレス（auth.users から取得、DBには保存しない） */
    email?: string;
    /** 性別 - DB: gender */
    gender?: Gender;
    /** 学年（生徒のみ） - DB: grade */
    grade?: Grade;
    /** 最終アクセス日時 - DB: last_seen_at */
    lastSeenAt?: string;
    /** 作成日時 - DB: created_at */
    createdAt?: string;
    /** 更新日時 - DB: updated_at */
    updatedAt?: string;
}

/**
 * ログイン認証情報
 */
export interface LoginCredentials {
    username: string;
    password: string;
}

/**
 * ユーザープロフィール（UI表示用拡張）
 * @see specs/features/home.md UserProfile
 */
export interface UserProfile extends User {
    /** 表示名（homeで必須） */
    displayName: string;
    /** フリガナ（homeで必須） */
    nameKana: string;
}
