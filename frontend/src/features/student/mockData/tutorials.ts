// チュートリアルモックデータ
// @see specs/features/tutorial.md

import type { Quest, TutorialProgress, TutorialState, TutorialStep } from '../types/tutorial';

/**
 * チュートリアルステップ定義
 */
export const tutorialSteps: TutorialStep[] = [
    {
        id: 'step-diary-link',
        title: '日報を見てみよう',
        description: '毎日の学習を記録する「学習日報」ページに行ってみよう！',
        targetSelector: '[data-tutorial="nav-diary"]',
        action: 'click',
        route: '/',
        hint: '👆 左の「学習日報」をクリック！',
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
        hint: '👆 左の「ARCHIVE」をクリック！',
    },
    {
        id: 'step-chat-link',
        title: 'メンターに相談してみよう',
        description: '困ったことがあれば、メンターに相談できるよ！',
        targetSelector: '[data-tutorial="nav-chat"]',
        action: 'click',
        route: '/archive',
        hint: '👆 左の「相談」をクリック！',
    },
    {
        id: 'step-complete',
        title: 'チュートリアル完了！🎉',
        description: 'これでCo+ Studyの基本的な使い方はバッチリ！毎日コツコツ学習を記録していこう！',
        targetSelector: '',
        action: 'click',
        route: '/chat',
        hint: '🎉 お疲れさま！',
    },
];

/**
 * 初期状態
 */
export const initialTutorialState: TutorialState = {
    isActive: false,
    currentStepIndex: 0,
    isCompleted: false,
    isSkipped: false,
};

// 後方互換性のため
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
