// @see specs/features/tutorial.md
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Quest, TutorialProgress } from '../../types/tutorial';
import Highlight from './Highlight';
import ProgressBar from './ProgressBar';
import styles from './TutorialModal.module.css';

interface TutorialModalProps {
  /** 現在のクエスト */
  quest: Quest;
  /** 進捗状況 */
  progress: TutorialProgress;
  /** 次のステップへ進む */
  onNext: () => void;
  /** スキップ */
  onSkip: () => void;
  /** チュートリアルを完了 */
  onComplete: () => void;
}

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface ModalPosition {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  transform?: string;
}

/**
 * チュートリアルモーダルコンポーネント
 * クエストの説明を対象要素の近くに表示し、ユーザーの操作を促す
 */
const TutorialModal = ({
  quest,
  progress,
  onNext,
  onSkip,
  onComplete,
}: TutorialModalProps) => {
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [modalPosition, setModalPosition] = useState<ModalPosition>({});
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>('bottom');
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const isLastStep = progress.currentStep >= progress.totalSteps;
  const hasTarget = Boolean(quest.targetElement);

  // モーダル位置を計算
  useEffect(() => {
    if (!hasTarget || !quest.targetElement) {
      // 対象がない場合は中央に表示
      setModalPosition({
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      });
      return;
    }

    const updatePosition = () => {
      const target = document.querySelector(quest.targetElement as string);
      if (!target) {
        setModalPosition({
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        });
        return;
      }

      const rect = target.getBoundingClientRect();
      const modalWidth = 360;
      const modalHeight = 200;
      const padding = 20;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // 最適な位置を決定
      // 下に表示できるか
      if (rect.bottom + padding + modalHeight < viewportHeight) {
        setTooltipPosition('bottom');
        setModalPosition({
          top: `${rect.bottom + window.scrollY + padding}px`,
          left: `${Math.max(padding, Math.min(rect.left + window.scrollX, viewportWidth - modalWidth - padding))}px`,
        });
      }
      // 上に表示できるか
      else if (rect.top - padding - modalHeight > 0) {
        setTooltipPosition('top');
        setModalPosition({
          top: `${rect.top + window.scrollY - padding - modalHeight}px`,
          left: `${Math.max(padding, Math.min(rect.left + window.scrollX, viewportWidth - modalWidth - padding))}px`,
        });
      }
      // 右に表示できるか
      else if (rect.right + padding + modalWidth < viewportWidth) {
        setTooltipPosition('right');
        setModalPosition({
          top: `${rect.top + window.scrollY}px`,
          left: `${rect.right + window.scrollX + padding}px`,
        });
      }
      // 左に表示
      else {
        setTooltipPosition('left');
        setModalPosition({
          top: `${rect.top + window.scrollY}px`,
          left: `${Math.max(padding, rect.left + window.scrollX - padding - modalWidth)}px`,
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [quest.targetElement, hasTarget]);

  // ESCキーでスキップ確認ダイアログを表示
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (showSkipConfirm) {
          setShowSkipConfirm(false);
        } else {
          setShowSkipConfirm(true);
        }
      }
    },
    [showSkipConfirm]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // フォーカス管理
  useEffect(() => {
    if (modalRef.current) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;

      const focusable = modalRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();

      return () => {
        previouslyFocused.current?.focus();
      };
    }
  }, [showSkipConfirm]);

  // ユーザーアクション完了時のハンドラ
  const handleActionComplete = useCallback(() => {
    if (isLastStep) {
      onComplete();
    } else {
      onNext();
    }
  }, [isLastStep, onNext, onComplete]);

  const handleSkipConfirm = () => {
    setShowSkipConfirm(false);
    onSkip();
  };

  const handleSkipCancel = () => {
    setShowSkipConfirm(false);
  };

  // スキップ確認ダイアログ
  if (showSkipConfirm) {
    return (
      <div className={styles.overlay}>
        <div
          ref={modalRef}
          className={styles.modal}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="skip-confirm-title"
          aria-describedby="skip-confirm-desc"
        >
          <h2 id="skip-confirm-title" className={styles.title}>
            チュートリアルをスキップしますか？
          </h2>
          <p id="skip-confirm-desc" className={styles.description}>
            チュートリアルはプロフィール画面からいつでも再開できます。
          </p>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleSkipCancel}
            >
              続ける
            </button>
            <button
              type="button"
              className={styles.skipButton}
              onClick={handleSkipConfirm}
            >
              スキップ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 対象要素がない場合（完了画面など）
  if (!hasTarget) {
    return (
      <div className={styles.overlay}>
        <div
          ref={modalRef}
          className={styles.modal}
          style={modalPosition}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tutorial-title"
        >
          <div className={styles.header}>
            <span className={styles.stepBadge}>
              クエスト {progress.currentStep}/{progress.totalSteps}
            </span>
          </div>

          <h2 id="tutorial-title" className={styles.title}>
            {quest.title}
          </h2>

          <p className={styles.description}>
            {quest.description}
          </p>

          <div className={styles.progressContainer}>
            <ProgressBar
              current={progress.completedQuests.length}
              total={progress.totalSteps}
              showLabel
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={onComplete}
            >
              完了！🎉
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ハイライト表示（ユーザーアクション検出付き） */}
      <Highlight
        targetSelector={quest.targetElement as string}
        description={quest.targetDescription}
        isVisible
        action={quest.action}
        onActionComplete={handleActionComplete}
      />

      {/* チュートリアル説明カード（対象要素の近くに表示） */}
      <div
        ref={modalRef}
        className={`${styles.floatingCard} ${styles[tooltipPosition]}`}
        style={modalPosition}
        role="dialog"
        aria-modal="false"
        aria-labelledby="tutorial-title"
        aria-describedby="tutorial-desc"
      >
        <div className={styles.header}>
          <span className={styles.stepBadge}>
            クエスト {progress.currentStep}/{progress.totalSteps}
          </span>
          <button
            type="button"
            className={styles.skipLink}
            onClick={() => setShowSkipConfirm(true)}
          >
            スキップ
          </button>
        </div>

        <h2 id="tutorial-title" className={styles.cardTitle}>
          {quest.title}
        </h2>

        <p id="tutorial-desc" className={styles.cardDescription}>
          {quest.description}
        </p>

        <div className={styles.actionHint}>
          {quest.action === 'click' && '👆 クリックして進む'}
          {quest.action === 'input' && '✏️ 入力して進む'}
          {quest.action === 'navigate' && '🔗 クリックして移動'}
        </div>

        <div className={styles.progressContainer}>
          <ProgressBar
            current={progress.completedQuests.length}
            total={progress.totalSteps}
            showLabel={false}
          />
        </div>
      </div>
    </>
  );
};

export default TutorialModal;
