// @see specs/features/tutorial.md

/**
 * ユーザーが行うべきアクション
 */
export type TutorialAction = 'click' | 'input' | 'navigate';

/**
 * チュートリアルの各ステップ
 */
export interface TutorialStep {
    /** ステップID */
    id: string;
    /** タイトル */
    title: string;
    /** 説明文 */
    description: string;
    /** 対象要素のCSSセレクタ */
    targetSelector: string;
    /** 期待するアクション */
    action: TutorialAction;
    /** このステップで必要なルート */
    route?: string;
    /** 操作ヒント */
    hint: string;
}

/**
 * チュートリアル全体の状態
 */
export interface TutorialState {
    /** チュートリアル実行中か */
    isActive: boolean;
    /** 現在のステップインデックス */
    currentStepIndex: number;
    /** 完了フラグ */
    isCompleted: boolean;
    /** スキップフラグ */
    isSkipped: boolean;
}

// 後方互換性のため残す（段階的に移行）
export type QuestAction = TutorialAction;

export interface Quest {
    id: string;
    title: string;
    description: string;
    targetElement?: string;
    targetDescription?: string;
    action?: QuestAction;
    isCompleted: boolean;
}

export interface TutorialProgress {
    currentStep: number;
    totalSteps: number;
    completedQuests: string[];
    isSkipped: boolean;
    isCompleted: boolean;
}
