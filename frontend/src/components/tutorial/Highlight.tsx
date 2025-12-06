// @see specs/features/tutorial.md
import { useCallback, useEffect, useState } from 'react';
import type { QuestAction } from '../../types/tutorial';
import styles from './Highlight.module.css';

interface HighlightProps {
  /** ハイライト対象のCSSセレクタ */
  targetSelector: string;
  /** ツールチップに表示する説明文 */
  description?: string;
  /** ハイライトを表示するかどうか */
  isVisible?: boolean;
  /** 期待するアクション */
  action?: QuestAction;
  /** アクション完了時のコールバック */
  onActionComplete?: () => void;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * 要素ハイライトコンポーネント
 * 対象要素の周囲を半透明オーバーレイで囲み、対象のみ明るく表示する
 * ユーザーが対象要素を操作すると次のステップに進む
 */
const Highlight = ({
  targetSelector,
  description,
  isVisible = true,
  action,
  onActionComplete,
}: HighlightProps) => {
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [targetElement, setTargetElement] = useState<Element | null>(null);

  // 対象要素の位置を更新
  const updatePosition = useCallback(() => {
    const element = document.querySelector(targetSelector);
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
      setTargetElement(element);
    } else {
      setTargetRect(null);
      setTargetElement(null);
    }
  }, [targetSelector]);

  useEffect(() => {
    if (!isVisible) {
      setTargetRect(null);
      setTargetElement(null);
      return;
    }

    updatePosition();

    // リサイズやスクロール時に位置を更新
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    // DOM変更の監視
    const observer = new MutationObserver(updatePosition);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      observer.disconnect();
    };
  }, [targetSelector, isVisible, updatePosition]);

  // ユーザーアクションの検出
  useEffect(() => {
    if (!isVisible || !targetElement || !action || !onActionComplete) {
      return;
    }

    const handleClick = () => {
      if (action === 'click' || action === 'navigate') {
        onActionComplete();
      }
    };

    const handleInput = () => {
      if (action === 'input') {
        // 入力があったら完了とみなす
        onActionComplete();
      }
    };

    // イベントリスナーを追加
    if (action === 'click' || action === 'navigate') {
      targetElement.addEventListener('click', handleClick);
    }
    if (action === 'input') {
      targetElement.addEventListener('input', handleInput);
      targetElement.addEventListener('focus', handleInput);
    }

    return () => {
      targetElement.removeEventListener('click', handleClick);
      targetElement.removeEventListener('input', handleInput);
      targetElement.removeEventListener('focus', handleInput);
    };
  }, [isVisible, targetElement, action, onActionComplete]);

  // 対象要素が見えるようにスクロール
  useEffect(() => {
    if (isVisible && targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isVisible, targetElement]);

  if (!isVisible || !targetRect) {
    return null;
  }

  const padding = 8; // ハイライト周囲のパディング

  return (
    <div className={styles.overlay} aria-hidden="true">
      {/* 上部オーバーレイ */}
      <div
        className={styles.overlayPart}
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: `${Math.max(0, targetRect.top - padding)}px`,
        }}
      />
      {/* 左部オーバーレイ */}
      <div
        className={styles.overlayPart}
        style={{
          top: `${targetRect.top - padding}px`,
          left: 0,
          width: `${Math.max(0, targetRect.left - padding)}px`,
          height: `${targetRect.height + padding * 2}px`,
        }}
      />
      {/* 右部オーバーレイ */}
      <div
        className={styles.overlayPart}
        style={{
          top: `${targetRect.top - padding}px`,
          left: `${targetRect.left + targetRect.width + padding}px`,
          right: 0,
          height: `${targetRect.height + padding * 2}px`,
        }}
      />
      {/* 下部オーバーレイ */}
      <div
        className={styles.overlayPart}
        style={{
          top: `${targetRect.top + targetRect.height + padding}px`,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      {/* ハイライト枠（クリック可能にするためpointer-events: none） */}
      <div
        className={styles.highlightBox}
        style={{
          top: `${targetRect.top - padding}px`,
          left: `${targetRect.left - padding}px`,
          width: `${targetRect.width + padding * 2}px`,
          height: `${targetRect.height + padding * 2}px`,
        }}
      />
      {/* ツールチップ */}
      {description && (
        <div
          className={styles.tooltip}
          style={{
            top: `${targetRect.top + targetRect.height + padding + 12}px`,
            left: `${targetRect.left}px`,
          }}
          role="tooltip"
        >
          {description}
        </div>
      )}
    </div>
  );
};

export default Highlight;
