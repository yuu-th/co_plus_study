// スポットライト位置追従フック
// ResizeObserver + IntersectionObserverで要素位置を効率的に追跡

import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { TargetPosition } from '../types/tutorial';

interface UseSpotlightPositionOptions {
    /** パディング（px） */
    padding?: number;
    /** スクロール時に要素を中央に持ってくるか */
    scrollIntoView?: boolean;
    /** 可視性閾値（0-1） */
    visibilityThreshold?: number;
}

/**
 * ターゲット要素の位置を追跡するフック
 * ResizeObserverとIntersectionObserverを使用して効率的に位置を更新
 *
 * @param selector - CSSセレクタ（フォールバック）
 * @param ref - 要素のRef（優先）
 * @param options - オプション設定
 * @returns ターゲット位置情報
 */
export const useSpotlightPosition = (
    selector: string | null,
    ref: RefObject<HTMLElement> | null | undefined,
    options: UseSpotlightPositionOptions = {}
): TargetPosition | null => {
    const {
        padding = 8,
        scrollIntoView = true,
        visibilityThreshold = 0.8,
    } = options;

    const [position, setPosition] = useState<TargetPosition | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
    const scrollTimeoutRef = useRef<number | null>(null);

    // 位置更新関数
    const updatePosition = useCallback((element: Element) => {
        const rect = element.getBoundingClientRect();
        setPosition({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            isVisible: true,
        });
    }, []);

    // 要素取得関数
    const getElement = useCallback((): Element | null => {
        // Ref優先
        if (ref?.current) {
            return ref.current;
        }
        // セレクタでフォールバック
        if (selector) {
            return document.querySelector(selector);
        }
        return null;
    }, [selector, ref]);

    // スクロールハンドラ（デバウンス付き）
    const handleScroll = useCallback(() => {
        if (scrollTimeoutRef.current) {
            window.clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = window.setTimeout(() => {
            const element = getElement();
            if (element) {
                updatePosition(element);
            }
        }, 16); // 約60fpsに制限
    }, [getElement, updatePosition]);

    useEffect(() => {
        const element = getElement();

        if (!element) {
            setPosition(null);
            return;
        }

        // 初回位置更新
        updatePosition(element);

        // ResizeObserver: 要素サイズ変更を監視
        resizeObserverRef.current = new ResizeObserver((entries) => {
            for (const entry of entries) {
                updatePosition(entry.target);
            }
        });
        resizeObserverRef.current.observe(element);

        // IntersectionObserver: 可視性を監視
        intersectionObserverRef.current = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry) {
                    if (!entry.isIntersecting && scrollIntoView) {
                        // 要素が見えない場合、スクロールして表示
                        element.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                        });
                    }
                    setPosition((prev) =>
                        prev
                            ? { ...prev, isVisible: entry.isIntersecting }
                            : null
                    );
                }
            },
            { threshold: visibilityThreshold }
        );
        intersectionObserverRef.current.observe(element);

        // スクロールイベント（位置更新用）
        window.addEventListener('scroll', handleScroll, {
            passive: true,
            capture: true,
        });
        window.addEventListener('resize', handleScroll, { passive: true });

        return () => {
            resizeObserverRef.current?.disconnect();
            intersectionObserverRef.current?.disconnect();
            window.removeEventListener('scroll', handleScroll, { capture: true });
            window.removeEventListener('resize', handleScroll);
            if (scrollTimeoutRef.current) {
                window.clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [
        selector,
        ref,
        getElement,
        updatePosition,
        handleScroll,
        scrollIntoView,
        visibilityThreshold,
    ]);

    return position;
};

/**
 * ターゲット要素のCSS変数を生成
 */
export const getSpotlightCSSVars = (
    position: TargetPosition | null,
    padding: number = 8
): Record<string, string> => {
    if (!position) {
        return {
            '--spotlight-active': '0',
        };
    }

    return {
        '--spotlight-active': '1',
        '--spotlight-top': `${position.top}px`,
        '--spotlight-left': `${position.left}px`,
        '--spotlight-width': `${position.width}px`,
        '--spotlight-height': `${position.height}px`,
        '--spotlight-padding': `${padding}px`,
    };
};
