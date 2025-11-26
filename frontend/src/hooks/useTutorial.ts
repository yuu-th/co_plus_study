// @see specs/features/tutorial.md
import { useCallback, useMemo, useState } from 'react';
import { mockQuests } from '../mockData/tutorials';
import type { Quest, TutorialProgress } from '../types/tutorial';

const initialProgress: TutorialProgress = {
  currentStep: 0,
  totalSteps: mockQuests.length,
  completedQuests: [],
  isSkipped: false,
  isCompleted: false,
};

// Pure function to encapsulate the logic for completing the tutorial
const getCompletedProgress = (prev: TutorialProgress): TutorialProgress => ({
  ...prev,
  isCompleted: true,
  currentStep: prev.totalSteps,
  completedQuests: mockQuests.map(q => q.id),
});

interface UseTutorialReturn {
  /** 現在の進捗状態 */
  progress: TutorialProgress;
  /** 現在のクエスト（完了またはスキップ時はnull） */
  currentQuest: Quest | null;
  /** チュートリアルがアクティブかどうか */
  isActive: boolean;
  /** チュートリアルを開始 */
  startTutorial: () => void;
  /** 次のステップへ進む */
  nextStep: () => void;
  /** チュートリアルをスキップ */
  skipTutorial: () => void;
  /** チュートリアルを完了 */
  completeTutorial: () => void;
  /** チュートリアルをリセット */
  resetTutorial: () => void;
}

const useTutorial = (): UseTutorialReturn => {
  const [progress, setProgress] = useState<TutorialProgress>(initialProgress);

  const isActive = useMemo(
    () => progress.currentStep > 0 && !progress.isCompleted && !progress.isSkipped,
    [progress.currentStep, progress.isCompleted, progress.isSkipped]
  );

  const currentQuest = useMemo(
    () => (isActive ? mockQuests[progress.currentStep - 1] : null),
    [isActive, progress.currentStep]
  );

  const completeTutorial = useCallback(() => {
    setProgress(getCompletedProgress);
  }, []);

  const startTutorial = useCallback(() => {
    setProgress({
      ...initialProgress,
      currentStep: 1,
    });
  }, []);

  const nextStep = useCallback(() => {
    setProgress(prev => {
      if (prev.currentStep >= prev.totalSteps) {
        return getCompletedProgress(prev);
      }

      const currentQuestId = mockQuests[prev.currentStep - 1]?.id;
      const newCompletedQuests = currentQuestId
        ? [...prev.completedQuests, currentQuestId]
        : prev.completedQuests;

      return {
        ...prev,
        currentStep: prev.currentStep + 1,
        completedQuests: newCompletedQuests,
      };
    });
  }, []);

  const skipTutorial = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      isSkipped: true,
      currentStep: prev.totalSteps,
    }));
  }, []);

  const resetTutorial = useCallback(() => {
    setProgress(initialProgress);
  }, []);

  return {
    progress,
    currentQuest,
    isActive,
    startTutorial,
    nextStep,
    skipTutorial,
    completeTutorial,
    resetTutorial,
  };
};

export default useTutorial;
