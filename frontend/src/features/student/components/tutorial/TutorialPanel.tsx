// @see specs/features/tutorial.md
import type { TutorialStep } from '../../types/tutorial';
import ProgressBar from './ProgressBar';
import styles from './TutorialPanel.module.css';

interface TutorialPanelProps {
    /** 現在のステップ */
    step: TutorialStep;
    /** 現在のインデックス（0始まり） */
    currentIndex: number;
    /** 全ステップ数 */
    totalSteps: number;
    /** スキップ時のコールバック */
    onSkip: () => void;
    /** 完了時のコールバック（最終ステップ用） */
    onComplete?: () => void;
}

/**
 * チュートリアルサイドパネル
 * 画面右側に表示し、現在のステップの指示を表示する
 */
const TutorialPanel = ({
    step,
    currentIndex,
    totalSteps,
    onSkip,
    onComplete,
}: TutorialPanelProps) => {
    const isLastStep = !step.targetSelector;

    return (
        <aside
            className={styles.panel}
            role="complementary"
            aria-label="チュートリアルガイド"
        >
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
                {step.hint && (
                    <div className={styles.hint}>
                        <span className={styles.hintIcon}>💡</span>
                        <span className={styles.hintText}>{step.hint}</span>
                    </div>
                )}

                {/* 進捗バー */}
                <div className={styles.progressContainer}>
                    <ProgressBar
                        current={currentIndex + 1}
                        total={totalSteps}
                        showLabel={false}
                    />
                </div>

                {/* ボタン */}
                <div className={styles.actions}>
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
                            className={styles.skipButton}
                            onClick={onSkip}
                        >
                            スキップ
                        </button>
                    )}
                </div>
            </div>

            {/* キャラクターイラスト的な装飾 */}
            <div className={styles.mascot}>
                {isLastStep ? '🎉' : '📚'}
            </div>
        </aside>
    );
};

export default TutorialPanel;
