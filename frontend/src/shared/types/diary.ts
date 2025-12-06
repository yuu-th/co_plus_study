// @see specs/features/diary.md

/**
 * 絵文字リアクション種別
 * @see specs/features/diary.md
 */
export type ReactionType = '👍' | '❤️' | '🎉' | '👏' | '🔥';

/**
 * ユーザーからの単一リアクション情報
 * @see specs/features/diary.md
 */
export interface Reaction {
    /** リアクションタイプ */
    type: ReactionType;
    /** 表示用集計カウント */
    count: number;
    /** リアクションしたユーザーID配列 */
    userIds: string[];
    /** メンター側のリアクション判定 */
    isMentorReaction?: boolean;
}

/**
 * 学習日報投稿
 * @see specs/features/diary.md
 */
export interface DiaryPost {
    /** 投稿の一意識別子 */
    id: string;
    /** 投稿者のユーザーID */
    userId: string;
    /** 投稿者の表示名（生徒名） */
    userName: string;
    /** 教科 */
    subject: string;
    /** 学習時間（分単位） */
    duration: number;
    /** 学習内容（最大500文字） */
    content: string;
    /** 投稿日時（ISO8601） */
    timestamp: string;
    /**
     * リアクション配列
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
    subject: string;
    duration: number; // 1-999
    content: string; // <=500
}

/** 教科別集計用 (DiaryStats向け) */
export interface SubjectDurationStat {
    subject: string;
    totalMinutes: number;
}

/** 週次統計 (DiaryStats 向け) */
export interface WeeklyDiaryStats {
    weekStartISO: string; // 週開始 ISO (月曜など)
    totalPosts: number;
    totalMinutes: number;
    subjectBreakdown: SubjectDurationStat[];
}
