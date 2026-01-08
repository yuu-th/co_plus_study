// スポットライトコンポーネント
// 画面全体を覆い、対象要素のみハイライトする

import { useCallback, useEffect } from 'react';
import type { TutorialAction, TutorialSpotlightProps } from './types/tutorial';
import { getSpotlightCSSVars, useSpotlightPosition } from './hooks';
import styles from './styles/spotlight.module.css';

/**
 * チュートリアルスポットライトコンポーネント
 * CSS変数とclip-path: inset()を使用して効率的な穴あきオーバーレイを実現
 */
const TutorialSpotlight = ({
    targetSelector,
    targetRef,
    deviceProfile,
    onActionComplete,
    action = 'click',
}: TutorialSpotlightProps) => {
    // ターゲット位置を追跡
    const position = useSpotlightPosition(targetSelector, targetRef);

    // CSS変数を生成
    const cssVars = getSpotlightCSSVars(position);

    // アクション検出
    const handleAction = useCallback(() => {
        onActionComplete?.();
    }, [onActionComplete]);

    // イベントリスナーを設定
    useEffect(() => {
        if (!targetSelector && !targetRef?.current) return;

        const element = targetRef?.current ?? document.querySelector(targetSelector ?? '');
        if (!element) return;

        const eventMap: Record<TutorialAction, string[]> = {
            click: ['click', 'touchend'],
            input: ['input', 'change'],  // focusは除外（初回フォーカスで進んでしまう）
            navigate: ['click', 'touchend'],
            view: [], // viewアクションはイベント不要
        };

        const events = eventMap[action] ?? [];

        // inputアクションの場合は、子要素のイベントもキャプチャ
        if (action === 'input') {
            // 一度だけ発火させるためのフラグ
            let hasTriggered = false;

            const handleInputAction = (e: Event) => {
                // すでに発火済みなら無視
                if (hasTriggered) return;

                // イベントが対象要素またはその子孫から発生したか確認
                if (element.contains(e.target as Node)) {
                    hasTriggered = true;
                    handleAction();
                }
            };

            events.forEach((event) => {
                // キャプチャフェーズで検出（子要素のイベントも拾える）
                document.addEventListener(event, handleInputAction, { capture: true });
            });

            return () => {
                events.forEach((event) => {
                    document.removeEventListener(event, handleInputAction, { capture: true });
                });
            };
        }

        // click/navigateアクションの場合は通常通り
        events.forEach((event) => {
            element.addEventListener(event, handleAction, { capture: true });
        });

        // キーボードイベント（Enter/Spaceでクリック相当）
        const handleKeydown = (e: KeyboardEvent) => {
            if (action === 'click' && (e.key === 'Enter' || e.key === ' ')) {
                handleAction();
            }
        };
        element.addEventListener('keydown', handleKeydown as EventListener);

        return () => {
            events.forEach((event) => {
                element.removeEventListener(event, handleAction, { capture: true });
            });
            element.removeEventListener('keydown', handleKeydown as EventListener);
        };
    }, [targetSelector, targetRef, action, handleAction]);

    // スポットライトを表示しない設定の場合
    if (deviceProfile.spotlightStrategy === 'none') {
        return null;
    }

    const isActive = position !== null;
    const isHighlightOnly = deviceProfile.spotlightStrategy === 'highlight-only';

    return (
        <div
            className={styles.spotlight}
            style={cssVars as React.CSSProperties}
            data-active={isActive}
            aria-hidden="true"
        >
            {/* オーバーレイ（4つの矩形で穴を作成） */}
            {!isHighlightOnly && isActive && (
                <>
                    <div className={styles.overlayTop} />
                    <div className={styles.overlayRight} />
                    <div className={styles.overlayBottom} />
                    <div className={styles.overlayLeft} />
                </>
            )}
            {/* ハイライト枠 */}
            <div
                className={`${styles.highlight} ${!isActive ? styles.highlightHidden : ''}`}
            />
        </div>
    );
};

export default TutorialSpotlight;
