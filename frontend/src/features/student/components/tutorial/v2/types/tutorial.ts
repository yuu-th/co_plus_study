// チュートリアルシステム V2 型定義
// @see specs/features/tutorial.md

import type { RefObject } from 'react';

// ============================================
// デバイスプロファイル
// ============================================

/**
 * デバイスタイプ識別子
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * ツールチップの表示位置
 */
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'auto';

/**
 * スポットライト戦略
 * - full: 全画面オーバーレイ + ハイライト
 * - highlight-only: ハイライト枠のみ（オーバーレイなし）
 * - none: スポットライト非表示
 */
export type SpotlightStrategy = 'full' | 'highlight-only' | 'none';

/**
 * パネルスタイル
 * - modal: フルスクリーンモーダル（モバイル向け）
 * - bottom-sheet: 下部スライドパネル（タブレット向け）
 * - side-panel: 右サイドパネル（デスクトップ向け）
 */
export type PanelStyle = 'modal' | 'bottom-sheet' | 'side-panel';

/**
 * デバイスプロファイル定義
 */
export interface DeviceProfile {
    /** デバイスタイプ識別子 */
    id: DeviceType;
    /** ブレークポイント範囲 */
    breakpoint: {
        min: number;
        max: number;
    };
    /** ツールチップのデフォルト位置 */
    tooltipPosition: TooltipPosition;
    /** スポットライト戦略 */
    spotlightStrategy: SpotlightStrategy;
    /** パネルスタイル */
    panelStyle: PanelStyle;
}

// ============================================
// チュートリアルステップ
// ============================================

/**
 * ユーザーが行うべきアクション
 */
export type TutorialAction = 'click' | 'input' | 'navigate' | 'view';

/**
 * デバイス別ヒントテキスト
 */
export interface DeviceHints {
    mobile?: string;
    tablet?: string;
    desktop?: string;
}

/**
 * チュートリアルステップ V2
 * 既存のTutorialStepと後方互換性を維持しつつ拡張
 */
export interface TutorialStepV2 {
    /** ステップID */
    id: string;
    /** タイトル */
    title: string;
    /** 説明文 */
    description: string;
    /** 対象要素のCSSセレクタ（既存互換） */
    targetSelector: string;
    /** 対象要素のRef（推奨、セレクタより優先） */
    targetRef?: RefObject<HTMLElement>;
    /** 期待するアクション */
    action: TutorialAction;
    /** このステップで必要なルート */
    route?: string;
    /** 操作ヒント（デフォルト） */
    hint: string;
    /** デバイス別ヒント（指定がある場合は優先） */
    hintByDevice?: DeviceHints;
    /** 特定のデバイスでこのステップをスキップ */
    skipOnDevice?: DeviceType[];
    /** 要素が見つかるまで待機するか */
    waitForElement?: boolean;
    /** 待機タイムアウト（ms, デフォルト: 5000） */
    timeout?: number;
    /** ツールチップ位置の上書き */
    tooltipPosition?: TooltipPosition;
}

// ============================================
// チュートリアル状態
// ============================================

/**
 * チュートリアル全体の状態 V2
 */
export interface TutorialStateV2 {
    /** チュートリアル実行中か */
    isActive: boolean;
    /** 現在のステップインデックス */
    currentStepIndex: number;
    /** 完了フラグ */
    isCompleted: boolean;
    /** スキップフラグ */
    isSkipped: boolean;
    /** 要素待機中フラグ */
    isWaitingForElement: boolean;
    /** エラー状態 */
    error: string | null;
}

/**
 * 登録されたターゲット要素のマップ
 */
export type TargetRegistry = Map<string, RefObject<HTMLElement>>;

// ============================================
// コンテキスト
// ============================================

/**
 * チュートリアルコンテキスト V2
 */
export interface TutorialContextV2 {
    // 状態
    /** 現在の状態 */
    state: TutorialStateV2;
    /** 現在のステップ */
    currentStep: TutorialStepV2 | null;
    /** 全ステップ数 */
    totalSteps: number;
    /** 現在のデバイスプロファイル */
    deviceProfile: DeviceProfile;

    // アクション
    /** チュートリアルを開始 */
    startTutorial: () => void;
    /** 次のステップへ */
    nextStep: () => void;
    /** 前のステップへ */
    prevStep: () => void;
    /** 特定のステップへジャンプ */
    goToStep: (index: number) => void;
    /** チュートリアルをスキップ */
    skipTutorial: () => void;
    /** チュートリアルを完了 */
    completeTutorial: () => void;
    /** チュートリアルをリセット */
    resetTutorial: () => void;

    // 要素登録（Refベース）
    /** ターゲット要素を登録 */
    registerTarget: (id: string, ref: RefObject<HTMLElement>) => void;
    /** ターゲット要素の登録解除 */
    unregisterTarget: (id: string) => void;
}

// ============================================
// スポットライト
// ============================================

/**
 * ターゲット要素の位置情報
 */
export interface TargetPosition {
    top: number;
    left: number;
    width: number;
    height: number;
    isVisible: boolean;
}

/**
 * スポットライトコンポーネントのProps
 */
export interface TutorialSpotlightProps {
    /** 対象要素のセレクタ */
    targetSelector: string | null;
    /** 対象要素のRef */
    targetRef?: RefObject<HTMLElement>;
    /** 現在のデバイスプロファイル */
    deviceProfile: DeviceProfile;
    /** アクション完了時のコールバック */
    onActionComplete?: () => void;
    /** 期待するアクション */
    action?: TutorialAction;
}

// ============================================
// ツールチップ
// ============================================

/**
 * ツールチップコンポーネントのProps
 */
export interface TutorialTooltipProps {
    /** 現在のステップ */
    step: TutorialStepV2;
    /** 現在のインデックス */
    currentIndex: number;
    /** 全ステップ数 */
    totalSteps: number;
    /** デバイスプロファイル */
    deviceProfile: DeviceProfile;
    /** ターゲット位置 */
    targetPosition: TargetPosition | null;
    /** 次へ */
    onNext: () => void;
    /** 前へ */
    onPrev: () => void;
    /** スキップ */
    onSkip: () => void;
    /** 完了 */
    onComplete: () => void;
}

// ============================================
// 後方互換性
// ============================================

// 既存の型をre-export（段階的移行用）
export type { TutorialAction as LegacyTutorialAction } from '../../types/tutorial';
