// @see specs/features/tutorial.md
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { initialTutorialState, tutorialSteps } from '../../mockData/tutorials';
import type { TutorialState, TutorialStep } from '../../types/tutorial';
import TutorialOverlay from './TutorialOverlay';
import TutorialPanel from './TutorialPanel';

interface TutorialContextValue {
    /** 現在の状態 */
    state: TutorialState;
    /** 現在のステップ */
    currentStep: TutorialStep | null;
    /** チュートリアルを開始 */
    startTutorial: () => void;
    /** 次のステップへ */
    nextStep: () => void;
    /** スキップ */
    skipTutorial: () => void;
    /** 完了 */
    completeTutorial: () => void;
    /** リセット */
    resetTutorial: () => void;
}

const TutorialContext = createContext<TutorialContextValue | null>(null);

interface TutorialProviderProps {
    children: React.ReactNode;
}

/**
 * チュートリアルのContextプロバイダー
 * App全体をラップして使用
 */
export const TutorialProvider = ({ children }: TutorialProviderProps) => {
    const [state, setState] = useState<TutorialState>(initialTutorialState);
    const navigate = useNavigate();
    const location = useLocation();

    const currentStep = useMemo(() => {
        if (!state.isActive || state.currentStepIndex >= tutorialSteps.length) {
            return null;
        }
        return tutorialSteps[state.currentStepIndex];
    }, [state.isActive, state.currentStepIndex]);

    // 必要なルートへ遷移
    const navigateToStepRoute = useCallback((step: TutorialStep) => {
        if (step.route && location.pathname !== step.route) {
            navigate(step.route);
        }
    }, [navigate, location.pathname]);

    const startTutorial = useCallback(() => {
        const firstStep = tutorialSteps[0];
        setState({
            isActive: true,
            currentStepIndex: 0,
            isCompleted: false,
            isSkipped: false,
        });
        if (firstStep) {
            navigateToStepRoute(firstStep);
        }
    }, [navigateToStepRoute]);

    const nextStep = useCallback(() => {
        setState(prev => {
            const nextIndex = prev.currentStepIndex + 1;
            if (nextIndex >= tutorialSteps.length) {
                return {
                    ...prev,
                    isActive: false,
                    isCompleted: true,
                };
            }

            const nextStepData = tutorialSteps[nextIndex];
            if (nextStepData) {
                // 次のステップのルートへ遷移
                setTimeout(() => navigateToStepRoute(nextStepData), 100);
            }

            return {
                ...prev,
                currentStepIndex: nextIndex,
            };
        });
    }, [navigateToStepRoute]);

    const skipTutorial = useCallback(() => {
        setState({
            isActive: false,
            currentStepIndex: 0,
            isCompleted: false,
            isSkipped: true,
        });
    }, []);

    const completeTutorial = useCallback(() => {
        setState({
            isActive: false,
            currentStepIndex: tutorialSteps.length,
            isCompleted: true,
            isSkipped: false,
        });
        console.log('🎖️ チュートリアル完了バッジを獲得しました！');
    }, []);

    const resetTutorial = useCallback(() => {
        setState(initialTutorialState);
    }, []);

    const value = useMemo(
        () => ({
            state,
            currentStep,
            startTutorial,
            nextStep,
            skipTutorial,
            completeTutorial,
            resetTutorial,
        }),
        [state, currentStep, startTutorial, nextStep, skipTutorial, completeTutorial, resetTutorial]
    );

    return (
        <TutorialContext.Provider value={value}>
            {children}

            {/* チュートリアルUI */}
            {state.isActive && currentStep && (
                <>
                    <TutorialOverlay
                        targetSelector={currentStep.targetSelector}
                        action={currentStep.action}
                        onActionComplete={nextStep}
                    />
                    <TutorialPanel
                        step={currentStep}
                        currentIndex={state.currentStepIndex}
                        totalSteps={tutorialSteps.length}
                        onSkip={skipTutorial}
                        onComplete={completeTutorial}
                    />
                </>
            )}
        </TutorialContext.Provider>
    );
};

/**
 * チュートリアルContextを使用するフック
 */
export const useTutorialContext = (): TutorialContextValue => {
    const context = useContext(TutorialContext);
    if (!context) {
        throw new Error('useTutorialContext must be used within TutorialProvider');
    }
    return context;
};

export default TutorialProvider;
