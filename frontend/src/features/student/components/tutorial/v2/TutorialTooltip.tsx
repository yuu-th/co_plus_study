// ツールチップコンポーネント
// デバイスプロファイルに応じてレイアウトを自動切り替え

import { useMemo } from 'react';
import type { DeviceProfile, TutorialTooltipProps } from './types/tutorial';
import styles from './styles/tooltip.module.css';

/**
 * デバイスプロファイルに応じたスタイルクラスを取得
 */
const getPanelStyleClass = (profile: DeviceProfile): string => {
    switch (profile.panelStyle) {
        case 'side-panel':
            return styles.sidePanel;
        case 'bottom-sheet':
            return styles.bottomSheet;
        case 'modal':
            return styles.modal;
        default:
            return styles.sidePanel;
    }
};

/**
 * デバイスに応じたヒントテキストを取得
 */
const getHintText = (
    step: TutorialTooltipProps['step'],
    deviceProfile: DeviceProfile
): string => {
    if (step.hintByDevice?.[deviceProfile.id]) {
        return step.hintByDevice[deviceProfile.id]!;
    }
    return step.hint;
};

/**
 * チュートリアルツールチップコンポーネント
 * デバイスプロファイルに応じて自動的にレイアウトを変更
 */
const TutorialTooltip = ({
    step,
    currentIndex,
    totalSteps,
    deviceProfile,
    onNext,
    onPrev,
    onSkip,
    onComplete,
}: TutorialTooltipProps) => {
    const panelClass = useMemo(
        () => getPanelStyleClass(deviceProfile),
        [deviceProfile]
    );

    const hintText = useMemo(
        () => getHintText(step, deviceProfile),
        [step, deviceProfile]
    );

    const isFirstStep = currentIndex === 0;
    const isLastStep = !step.targetSelector || currentIndex === totalSteps - 1;
    const progressPercent = ((currentIndex + 1) / totalSteps) * 100;

    // マスコットアイコン
    const mascotIcon = isLastStep ? '🎉' : '📚';

    return (
        <aside
            className={`${styles.tooltip} ${panelClass}`}
            role="complementary"
            aria-label="チュートリアルガイド"
        >
            {/* ボトムシート用ドラッグハンドル */}
            {deviceProfile.panelStyle === 'bottom-sheet' && (
                <div className={styles.dragHandle} />
            )}

            <div className={styles.content}>
                {/* ステップ番号 */}
                <div className={styles.stepBadge}>
                    ステップ {currentIndex + 1} / {totalSteps}
                </div>

                {/* タイトル */}
                <h2 className={styles.title}>{step.title}</h2>

                {/* 説明文 */}
                <p className={styles.description}>{step.description}</p>

                {/* 操作ヒント */}
                {hintText && (
                    <div className={styles.hint}>
                        <span className={styles.hintIcon}>💡</span>
                        <span className={styles.hintText}>{hintText}</span>
                    </div>
                )}

                {/* 進捗バー */}
                <div className={styles.progress}>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${progressPercent}%` }}
                            role="progressbar"
                            aria-valuenow={currentIndex + 1}
                            aria-valuemin={0}
                            aria-valuemax={totalSteps}
                        />
                    </div>
                </div>

                {/* アクションボタン */}
                <div className={styles.actions}>
                    {/* 戻るボタン（最初のステップ以外） */}
                    {!isFirstStep && (
                        <button
                            type="button"
                            className={styles.prevButton}
                            onClick={onPrev}
                        >
                            戻る
                        </button>
                    )}

                    {/* スキップボタン（最後のステップ以外） */}
                    {!isLastStep && isFirstStep && (
                        <button
                            type="button"
                            className={styles.skipButton}
                            onClick={onSkip}
                        >
                            スキップ
                        </button>
                    )}

                    {/* 次へ/完了ボタン */}
                    {isLastStep ? (
                        <button
                            type="button"
                            className={styles.completeButton}
                            onClick={onComplete}
                        >
                            はじめる！
                        </button>
                    ) : (
                        <button
                            type="button"
                            className={styles.nextButton}
                            onClick={onNext}
                        >
                            次へ
                        </button>
                    )}
                </div>
            </div>

            {/* マスコット */}
            <div className={styles.mascot}>{mascotIcon}</div>
        </aside>
    );
};

export default TutorialTooltip;
