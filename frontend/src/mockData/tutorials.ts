// @see specs/features/tutorial.md
import type { Quest, TutorialProgress } from '../types/tutorial';

export const mockQuests: Quest[] = [
  {
    id: 'quest-1',
    title: '初めての日報を投稿しよう',
    description: '学習内容を記録する方法を学ぼう',
    targetElement: '[data-tutorial="diary-form"]',
    targetDescription: 'ここから日報を投稿できます。',
    action: 'input',
    isCompleted: false,
  },
  {
    id: 'quest-2',
    title: 'ARCHIVEを見てみよう',
    description: '学習の記録を振り返ろう',
    targetElement: '[data-tutorial="archive-link"]',
    targetDescription: 'ここから過去の学習記録を確認できます。',
    action: 'click',
    isCompleted: false,
  },
  {
    id: 'quest-3',
    title: 'メンターに相談してみよう',
    description: '困ったことを相談しよう',
    targetElement: '[data-tutorial="chat-input"]',
    targetDescription: 'メンターへの相談はここから入力します。',
    action: 'input',
    isCompleted: false,
  },
  {
    id: 'quest-4',
    title: 'バッジを確認しよう',
    description: '獲得したバッジを見よう',
    targetElement: '[data-tutorial="badge-card"]',
    targetDescription: '学習を続けるとバッジがもらえます。',
    action: 'click',
    isCompleted: false,
  },
  {
    id: 'quest-5',
    title: '完了！',
    description: '全クエスト達成おめでとう！',
    isCompleted: false,
  },
];

export const mockTutorialProgress: TutorialProgress = {
  currentStep: 1,
  totalSteps: mockQuests.length,
  completedQuests: [],
  isSkipped: false,
  isCompleted: false,
};
