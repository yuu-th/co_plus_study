// @see specs/features/survey.md

/**
 * 質問タイプ
 * @see specs/features/survey.md
 */
export type QuestionType = 'single' | 'multiple' | 'text' | 'rating' | 'color';

/**
 * 星評価の表示方式
 * @see specs/features/survey.md
 */
export type RatingStyle = 'numeric' | 'emoji';

/**
 * カラー選択用の選択肢
 * @see specs/features/survey.md
 */
export interface ColorOption {
    /** 選択肢ID */
    id: string;
    /** 色の名前（例: 赤、青） */
    label: string;
    /** HEXカラーコード（例: #FF6B9D） */
    colorCode: string;
}

/**
 * アンケート質問
 * @see specs/features/survey.md
 */
export interface Question {
    /** 質問ID */
    id: string;
    /** 質問タイプ */
    type: QuestionType;
    /** 質問文 */
    text: string;
    /** 必須フラグ */
    required: boolean;
    /** 選択肢（single, multiple 用） */
    options?: string[];
    /** 評価表示方式（rating 用、デフォルト: 'emoji'） */
    ratingStyle?: RatingStyle;
    /** カラー選択肢（color 用） */
    colorOptions?: ColorOption[];
}

/**
 * アンケートステータス
 * @see specs/features/survey.md
 */
export type SurveyStatus = 'draft' | 'scheduled' | 'active' | 'closed';

/**
 * スケジュール & 配信対象付きアンケート
 * @see specs/features/survey.md
 */
export interface Survey {
    /** 一意識別子 */
    id: string;
    /** アンケートタイトル */
    title: string;
    /** 説明文 */
    description?: string;
    /** 質問配列 */
    questions: Question[];
    /** 公開開始日時（ISO8601） */
    releaseDate?: string;
    /** 締切日時（ISO8601） */
    dueDate?: string;
    /** 対象グループ */
    targetGroups?: string[];
    /** ステータス */
    status: SurveyStatus;
    /** 過去アンケートアーカイブフラグ */
    archived?: boolean;
}

/**
 * 回答データ
 * @see specs/features/survey.md
 */
export interface Answer {
    /** 対象質問ID */
    questionId: string;
    /** 回答値（multiple時は配列、rating時はnumber） */
    value: string | string[] | number;
}

/**
 * アンケート回答
 */
export interface SurveyResponse {
    /** 対象アンケートID */
    surveyId: string;
    /** 回答者ユーザーID */
    userId: string;
    /** 回答配列 */
    answers: Answer[];
    /** 提出日時（ISO8601） */
    submittedAt: string;
}

/**
 * 集計用統計
 */
export interface SurveyStats {
    /** 総回答数 */
    totalResponses: number;
    /** 完了率（0-1） */
    completionRate: number;
    /** 最終提出日時 */
    lastSubmittedAt?: string;
}

/**
 * 一覧表示用サマリ
 * @see specs/features/survey.md
 */
export interface SurveySummary {
    /** アンケートID */
    id: string;
    /** タイトル */
    title: string;
    /** 説明 */
    description?: string;
    /** 配信者名 */
    publisher: string;
    /** 公開日（ISO8601） */
    releaseDate: string;
    /** 締切日（ISO8601） */
    dueDate?: string;
    /** 回答済みフラグ */
    isAnswered: boolean;
    /** 残り日数 */
    daysRemaining?: number;
}
