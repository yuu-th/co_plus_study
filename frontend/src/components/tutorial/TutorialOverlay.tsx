// @see specs/features/tutorial.md
import { useCallback, useEffect, useState } from 'react';
import type { TutorialAction } from '../../types/tutorial';
import styles from './TutorialOverlay.module.css';

interface TutorialOverlayProps {
  /** 対象要素のCSSセレクタ */
  targetSelector: string;
  /** 期待するアクション */
  action: TutorialAction;
  /** アクション完了時のコールバック */
  onActionComplete: () => void;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * 穴あきオーバーレイコンポーネント
 * 画面全体を覆い、対象要素のみ操作可能にする
 */
const TutorialOverlay = ({
  targetSelector,
  action,
  onActionComplete,
}: TutorialOverlayProps) => {
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);

  // 対象要素の位置を更新
  const updatePosition = useCallback(() => {
    if (!targetSelector) {
      setTargetRect(null);
      return;
    }

    const element = document.querySelector(targetSelector);
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });

      // 対象要素が見えるようにスクロール
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setTargetRect(null);
    }
  }, [targetSelector]);

  useEffect(() => {
    updatePosition();

    // 位置の更新を監視
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    const observer = new MutationObserver(updatePosition);
    observer.observe(document.body, { childList: true, subtree: true });

    // 定期的に更新（アニメーション対応）
    const interval = setInterval(updatePosition, 100);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      observer.disconnect();
      clearInterval(interval);
    };
  }, [updatePosition]);

  // ユーザーアクションの検出
  useEffect(() => {
    if (!targetSelector) return;

    const element = document.querySelector(targetSelector);
    if (!element) return;

    const handleAction = () => {
      onActionComplete();
    };

    if (action === 'click' || action === 'navigate') {
      element.addEventListener('click', handleAction);
    }
    if (action === 'input') {
      element.addEventListener('input', handleAction);
      element.addEventListener('focus', handleAction, true);
    }

    return () => {
      element.removeEventListener('click', handleAction);
      element.removeEventListener('input', handleAction);
      element.removeEventListener('focus', handleAction, true);
    };
  }, [targetSelector, action, onActionComplete]);

  // 対象がない場合（完了ステップなど）
  if (!targetSelector || !targetRect) {
    return (
      <div className={styles.overlay} aria-hidden="true">
        <div className={styles.fullOverlay} />
      </div>
    );
  }

  const padding = 8;

  // clip-pathで穴を開ける
  const clipPath = `polygon(
    0% 0%,
    0% 100%,
    ${targetRect.left - padding}px 100%,
    ${targetRect.left - padding}px ${targetRect.top - padding}px,
    ${targetRect.left + targetRect.width + padding}px ${targetRect.top - padding}px,
    ${targetRect.left + targetRect.width + padding}px ${targetRect.top + targetRect.height + padding}px,
    ${targetRect.left - padding}px ${targetRect.top + targetRect.height + padding}px,
    ${targetRect.left - padding}px 100%,
    100% 100%,
    100% 0%
  )`;

  return (
    <div className={styles.overlay} aria-hidden="true">
      {/* 穴あきオーバーレイ */}
      <div
        className={styles.maskedOverlay}
        style={{ clipPath }}
      />
      {/* ハイライト枠 */}
      <div
        className={styles.highlightBox}
        style={{
          top: `${targetRect.top - padding}px`,
          left: `${targetRect.left - padding}px`,
          width: `${targetRect.width + padding * 2}px`,
          height: `${targetRect.height + padding * 2}px`,
        }}
      />
    </div>
  );
};

export default TutorialOverlay;
