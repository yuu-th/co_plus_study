// @see specs/features/tutorial.md

/**
 * チュートリアルの各ステップを表すクエスト
 */
export type QuestAction = 'click' | 'input' | 'navigate';

export interface Quest {
  id: string;
  title: string;
  description: string;
  targetElement?: string; // ハイライト対象のセレクタ
  targetDescription?: string;
  action?: QuestAction;
  isCompleted: boolean;
}

/**
 * チュートリアル全体の進捗状況
 */
export interface TutorialProgress {
  currentStep: number;
  totalSteps: number;
  completedQuests: string[];
  isSkipped: boolean;
  isCompleted: boolean;
}
