// @see specs/features/diary.md

/**
 * 教科
 * @see specs/features/diary.md
 */
export type Subject = '国語' | '数学' | '理科' | '社会' | '英語' | 'その他';

/**
 * 絵文字リアクション種別
 * @see specs/features/diary.md
 */
export type ReactionType = '👍' | '❤️' | '🎉' | '👏' | '🔥';

/**
 * ユーザーからの単一リアクション情報
 * @see specs/features/diary.md
 * @see ADR-005: diary_reactions テーブル
 */
export interface Reaction {
    /** 
     * リアクションタイプ
     * DB: emoji カラムとして保存。API層で type ↔ emoji 変換
     */
    type: ReactionType;
    /** 表示用集計カウント（クエリで集計） */
    count: number;
    /** リアクションしたユーザーID配列（クエリで集計） */
    userIds: string[];
    /** メンター側のリアクション判定（プロフィールのroleで判定） */
    isMentorReaction?: boolean;
}

/**
 * 学習日報投稿
 * @see specs/features/diary.md
 * @see ADR-005: diary_posts テーブル
 */
export interface DiaryPost {
    /** 投稿の一意識別子 - DB: id */
    id: string;
    /** 投稿者のユーザーID - DB: user_id */
    userId: string;
    /** 
     * 投稿者の表示名（生徒名）
     * DB: diary_posts には存在しない。profiles.display_name からJOINで取得
     */
    userName: string;
    /** 教科 - DB: subject (subject_type enum) */
    subject: Subject;
    /** 学習時間（分単位）- DB: duration_minutes */
    duration: number;
    /** 学習内容（最大500文字）- DB: content */
    content: string;
    /** 投稿日時（ISO8601）- DB: created_at */
    timestamp: string;
    /**
     * リアクション配列（別テーブル diary_reactions からJOIN）
     * ※ UI表示: ユーザー側は reactions 非表示、代わりに◎表示
     * メンター側のみ reactions 操作可能
     */
    reactions: Reaction[];
}

/** 日付単位でグループ化された投稿集合 */
export interface GroupedDiaryPost {
    dateLabel: string; // "今日" | "昨日" | "M月D日" 表示用
    posts: DiaryPost[];
}

/** フォーム送信用データ (内部ステート) */
export interface DiaryFormData {
    subject: Subject;
    duration: number; // 1-999
    content: string; // <=500
}

/** 教科別集計用 (DiaryStats向け) */
export interface SubjectDurationStat {
    subject: Subject;
    totalMinutes: number;
}

/** 週次統計 (DiaryStats 向け) */
export interface WeeklyDiaryStats {
    weekStartISO: string; // 週開始 ISO (月曜など)
    totalPosts: number;
    totalMinutes: number;
    subjectBreakdown: SubjectDurationStat[];
}
