// チュートリアルステップ管理フック
// ステップの進行、スキップ、ジャンプなどのロジックを提供

import { useCallback, useMemo, useState } from 'react';
import type { RefObject } from 'react';
import type {
    DeviceProfile,
    TargetRegistry,
    TutorialStateV2,
    TutorialStepV2,
} from '../types/tutorial';

interface UseTutorialStepOptions {
    /** チュートリアルステップ配列 */
    steps: TutorialStepV2[];
    /** 現在のデバイスプロファイル */
    deviceProfile: DeviceProfile;
    /** 完了時コールバック */
    onComplete?: () => void;
    /** ステップ変更時コールバック */
    onStepChange?: (step: TutorialStepV2, index: number) => void;
}

interface UseTutorialStepReturn {
    /** 現在の状態 */
    state: TutorialStateV2;
    /** 現在のステップ */
    currentStep: TutorialStepV2 | null;
    /** 有効なステップ配列（スキップを除外） */
    activeSteps: TutorialStepV2[];
    /** ターゲットレジストリ */
    targetRegistry: TargetRegistry;
    /** チュートリアル開始 */
    startTutorial: () => void;
    /** 次のステップ */
    nextStep: () => void;
    /** 前のステップ */
    prevStep: () => void;
    /** 指定ステップへジャンプ */
    goToStep: (index: number) => void;
    /** スキップ */
    skipTutorial: () => void;
    /** 完了 */
    completeTutorial: () => void;
    /** リセット */
    resetTutorial: () => void;
    /** ターゲット登録 */
    registerTarget: (id: string, ref: RefObject<HTMLElement>) => void;
    /** ターゲット登録解除 */
    unregisterTarget: (id: string) => void;
}

const initialState: TutorialStateV2 = {
    isActive: false,
    currentStepIndex: 0,
    isCompleted: false,
    isSkipped: false,
    isWaitingForElement: false,
    error: null,
};

/**
 * チュートリアルステップを管理するフック
 */
export const useTutorialStep = ({
    steps,
    deviceProfile,
    onComplete,
    onStepChange,
}: UseTutorialStepOptions): UseTutorialStepReturn => {
    const [state, setState] = useState<TutorialStateV2>(initialState);
    const [targetRegistry] = useState<TargetRegistry>(() => new Map());

    // デバイスでスキップするステップを除外した有効なステップ配列
    const activeSteps = useMemo(() => {
        return steps.filter(
            (step) => !step.skipOnDevice?.includes(deviceProfile.id)
        );
    }, [steps, deviceProfile.id]);

    // 現在のステップ
    const currentStep = useMemo(() => {
        if (
            !state.isActive ||
            state.currentStepIndex < 0 ||
            state.currentStepIndex >= activeSteps.length
        ) {
            return null;
        }
        return activeSteps[state.currentStepIndex];
    }, [state.isActive, state.currentStepIndex, activeSteps]);

    // チュートリアル開始
    const startTutorial = useCallback(() => {
        setState({
            isActive: true,
            currentStepIndex: 0,
            isCompleted: false,
            isSkipped: false,
            isWaitingForElement: false,
            error: null,
        });
        if (activeSteps[0] && onStepChange) {
            onStepChange(activeSteps[0], 0);
        }
    }, [activeSteps, onStepChange]);

    // 次のステップ
    const nextStep = useCallback(() => {
        setState((prev) => {
            const nextIndex = prev.currentStepIndex + 1;

            if (nextIndex >= activeSteps.length) {
                // 最後のステップを超えた場合は完了
                onComplete?.();
                return {
                    ...prev,
                    isActive: false,
                    isCompleted: true,
                };
            }

            const nextStepData = activeSteps[nextIndex];
            if (nextStepData && onStepChange) {
                // 次のイベントループで実行（状態更新後）
                setTimeout(() => onStepChange(nextStepData, nextIndex), 0);
            }

            return {
                ...prev,
                currentStepIndex: nextIndex,
                isWaitingForElement: false,
                error: null,
            };
        });
    }, [activeSteps, onComplete, onStepChange]);

    // 前のステップ
    const prevStep = useCallback(() => {
        setState((prev) => {
            const prevIndex = Math.max(0, prev.currentStepIndex - 1);
            const prevStepData = activeSteps[prevIndex];

            if (prevStepData && onStepChange) {
                setTimeout(() => onStepChange(prevStepData, prevIndex), 0);
            }

            return {
                ...prev,
                currentStepIndex: prevIndex,
                isWaitingForElement: false,
                error: null,
            };
        });
    }, [activeSteps, onStepChange]);

    // 指定ステップへジャンプ
    const goToStep = useCallback(
        (index: number) => {
            if (index < 0 || index >= activeSteps.length) {
                return;
            }

            setState((prev) => {
                const targetStep = activeSteps[index];
                if (targetStep && onStepChange) {
                    setTimeout(() => onStepChange(targetStep, index), 0);
                }

                return {
                    ...prev,
                    currentStepIndex: index,
                    isWaitingForElement: false,
                    error: null,
                };
            });
        },
        [activeSteps, onStepChange]
    );

    // スキップ
    const skipTutorial = useCallback(() => {
        setState({
            isActive: false,
            currentStepIndex: 0,
            isCompleted: false,
            isSkipped: true,
            isWaitingForElement: false,
            error: null,
        });
    }, []);

    // 完了
    const completeTutorial = useCallback(() => {
        onComplete?.();
        setState({
            isActive: false,
            currentStepIndex: activeSteps.length,
            isCompleted: true,
            isSkipped: false,
            isWaitingForElement: false,
            error: null,
        });
    }, [activeSteps.length, onComplete]);

    // リセット
    const resetTutorial = useCallback(() => {
        setState(initialState);
    }, []);

    // ターゲット登録
    const registerTarget = useCallback(
        (id: string, ref: RefObject<HTMLElement>) => {
            targetRegistry.set(id, ref);
        },
        [targetRegistry]
    );

    // ターゲット登録解除
    const unregisterTarget = useCallback(
        (id: string) => {
            targetRegistry.delete(id);
        },
        [targetRegistry]
    );

    return {
        state,
        currentStep,
        activeSteps,
        targetRegistry,
        startTutorial,
        nextStep,
        prevStep,
        goToStep,
        skipTutorial,
        completeTutorial,
        resetTutorial,
        registerTarget,
        unregisterTarget,
    };
};
