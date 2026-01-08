// V2 チュートリアルプロバイダー
// 既存のTutorialProviderと互換性を保ちつつ、新機能を提供

import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { RefObject } from 'react';
import type {
    TutorialContextV2,
    TutorialStepV2,
} from './types/tutorial';
import { useDeviceProfile, useTutorialStep } from './hooks';
import TutorialSpotlight from './TutorialSpotlight';
import TutorialTooltip from './TutorialTooltip';

// ============================================
// ステップ定義（既存mockDataから変換用）
// ============================================

/**
 * 既存のtutorialStepsをV2形式に変換
 * 実際の運用では mockData/tutorials.ts を直接更新するか、
 * ここで変換処理を行う
 */
const tutorialStepsV2: TutorialStepV2[] = [
    {
        id: 'step-diary-link',
        title: '日報を見てみよう',
        description: '毎日の学習を記録する「学習日報」ページに行ってみよう！',
        targetSelector: '[data-tutorial="nav-diary"]',
        action: 'click',
        route: '/',
        hint: '👆 「学習日報」をクリック！',
        hintByDevice: {
            mobile: '👆 下のメニューから「学習日報」をタップ！',
            tablet: '👆 左の「学習日報」をタップ！',
            desktop: '👆 左の「学習日報」をクリック！',
        },
    },
    {
        id: 'step-diary-form',
        title: '日報を書いてみよう',
        description: '今日勉強したことを記録してみよう。教科を選んで、内容を入力してね！',
        targetSelector: '[data-tutorial="diary-form"]',
        action: 'input',
        route: '/diary',
        hint: '✏️ 何か入力してみよう！',
    },
    {
        id: 'step-archive-link',
        title: '実績を見てみよう',
        description: '学習の記録はARCHIVEで振り返れるよ。カレンダーやバッジをチェック！',
        targetSelector: '[data-tutorial="nav-archive"]',
        action: 'click',
        route: '/diary',
        hint: '👆 「ARCHIVE」をクリック！',
        hintByDevice: {
            mobile: '👆 下のメニューから「ARCHIVE」をタップ！',
            tablet: '👆 左の「ARCHIVE」をタップ！',
            desktop: '👆 左の「ARCHIVE」をクリック！',
        },
    },
    {
        id: 'step-chat-link',
        title: 'メンターに相談してみよう',
        description: '困ったことがあれば、メンターに相談できるよ！',
        targetSelector: '[data-tutorial="nav-chat"]',
        action: 'click',
        route: '/archive',
        hint: '👆 「相談」をクリック！',
        hintByDevice: {
            mobile: '👆 下のメニューから「相談」をタップ！',
            tablet: '👆 左の「相談」をタップ！',
            desktop: '👆 左の「相談」をクリック！',
        },
    },
    {
        id: 'step-complete',
        title: 'チュートリアル完了！🎉',
        description: 'これでCo+ Studyの基本的な使い方はバッチリ！毎日コツコツ学習を記録していこう！',
        targetSelector: '',
        action: 'view',
        route: '/chat',
        hint: '🎉 お疲れさま！',
    },
];

// ============================================
// Context
// ============================================

const TutorialContextV2Internal = createContext<TutorialContextV2 | null>(null);

interface TutorialProviderV2Props {
    children: React.ReactNode;
    /** カスタムステップ定義（オプション） */
    steps?: TutorialStepV2[];
}

/**
 * チュートリアルプロバイダー V2
 */
export const TutorialProviderV2 = ({
    children,
    steps = tutorialStepsV2,
}: TutorialProviderV2Props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const deviceProfile = useDeviceProfile();

    // ステップ変更時のルート遷移
    const handleStepChange = useCallback(
        (step: TutorialStepV2) => {
            if (step.route && location.pathname !== step.route) {
                navigate(step.route);
            }
        },
        [navigate, location.pathname]
    );

    // 完了時の処理
    const handleComplete = useCallback(() => {
        console.log('🎖️ チュートリアル完了バッジを獲得しました！');
        // TODO: バッジ付与API呼び出し
    }, []);

    // ステップ管理フック
    const {
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
    } = useTutorialStep({
        steps,
        deviceProfile,
        onComplete: handleComplete,
        onStepChange: handleStepChange,
    });

    // 現在のステップのターゲットRefを取得
    const currentTargetRef = useMemo((): RefObject<HTMLElement> | undefined => {
        if (!currentStep) return undefined;
        return targetRegistry.get(currentStep.id);
    }, [currentStep, targetRegistry]);

    // コンテキスト値
    const contextValue = useMemo(
        (): TutorialContextV2 => ({
            state,
            currentStep,
            totalSteps: activeSteps.length,
            deviceProfile,
            startTutorial,
            nextStep,
            prevStep,
            goToStep,
            skipTutorial,
            completeTutorial,
            resetTutorial,
            registerTarget,
            unregisterTarget,
        }),
        [
            state,
            currentStep,
            activeSteps.length,
            deviceProfile,
            startTutorial,
            nextStep,
            prevStep,
            goToStep,
            skipTutorial,
            completeTutorial,
            resetTutorial,
            registerTarget,
            unregisterTarget,
        ]
    );

    return (
        <TutorialContextV2Internal.Provider value={contextValue}>
            {children}

            {/* チュートリアルUI */}
            {state.isActive && currentStep && (
                <>
                    <TutorialSpotlight
                        targetSelector={currentStep.targetSelector}
                        targetRef={currentTargetRef}
                        deviceProfile={deviceProfile}
                        action={currentStep.action}
                        onActionComplete={nextStep}
                    />
                    <TutorialTooltip
                        step={currentStep}
                        currentIndex={state.currentStepIndex}
                        totalSteps={activeSteps.length}
                        deviceProfile={deviceProfile}
                        targetPosition={null}
                        onNext={nextStep}
                        onPrev={prevStep}
                        onSkip={skipTutorial}
                        onComplete={completeTutorial}
                    />
                </>
            )}
        </TutorialContextV2Internal.Provider>
    );
};

/**
 * チュートリアルコンテキストを使用するフック
 */
export const useTutorialContextV2 = (): TutorialContextV2 => {
    const context = useContext(TutorialContextV2Internal);
    if (!context) {
        throw new Error(
            'useTutorialContextV2 must be used within TutorialProviderV2'
        );
    }
    return context;
};

// 後方互換性: 既存のuseTutorialContextと同じインターフェースを提供
export const useTutorialContext = useTutorialContextV2;

export default TutorialProviderV2;
