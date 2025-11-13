// チュートリアル・クエスト関連の型定義

export interface Quest {
  id: string;
  title: string;
  description: string;
  targetElement?: string; // ハイライト対象のセレクタ
  step: number;
  totalSteps: number;
  isCompleted: boolean;
}

export interface TutorialProgress {
  userId: string;
  completedQuests: string[];
  currentQuestId?: string;
  isCompleted: boolean;
}
