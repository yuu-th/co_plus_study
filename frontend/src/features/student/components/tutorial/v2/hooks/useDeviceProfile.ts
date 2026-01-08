// デバイスプロファイル判定フック
// 画面幅に応じて適切なデバイスプロファイルを返す

import { useCallback, useEffect, useState } from 'react';
import type { DeviceProfile } from '../types/tutorial';

/**
 * デバイスプロファイル定義
 * CSS変数 --breakpoint-* と整合性を保つ
 */
const DEVICE_PROFILES: readonly DeviceProfile[] = [
    {
        id: 'mobile',
        breakpoint: { min: 0, max: 640 },
        tooltipPosition: 'bottom',
        spotlightStrategy: 'highlight-only',
        panelStyle: 'modal',
    },
    {
        id: 'tablet',
        breakpoint: { min: 641, max: 1024 },
        tooltipPosition: 'auto',
        spotlightStrategy: 'full',
        panelStyle: 'bottom-sheet',
    },
    {
        id: 'desktop',
        breakpoint: { min: 1025, max: Infinity },
        tooltipPosition: 'auto',
        spotlightStrategy: 'full',
        panelStyle: 'side-panel',
    },
] as const;

/**
 * デフォルトプロファイル（SSR対応）
 */
const DEFAULT_PROFILE: DeviceProfile = DEVICE_PROFILES[2]; // desktop

/**
 * 画面幅からデバイスプロファイルを取得
 */
const getProfileByWidth = (width: number): DeviceProfile => {
    return (
        DEVICE_PROFILES.find(
            (p) => width >= p.breakpoint.min && width <= p.breakpoint.max
        ) ?? DEFAULT_PROFILE
    );
};

/**
 * 現在の画面幅に応じたデバイスプロファイルを返すフック
 *
 * @example
 * ```tsx
 * const deviceProfile = useDeviceProfile();
 * console.log(deviceProfile.id); // 'mobile' | 'tablet' | 'desktop'
 * ```
 */
export const useDeviceProfile = (): DeviceProfile => {
    const [profile, setProfile] = useState<DeviceProfile>(() => {
        // SSR対応: windowがない場合はデフォルト
        if (typeof window === 'undefined') {
            return DEFAULT_PROFILE;
        }
        return getProfileByWidth(window.innerWidth);
    });

    const handleResize = useCallback(() => {
        const newProfile = getProfileByWidth(window.innerWidth);
        setProfile((prev) => {
            // 同じプロファイルなら更新しない（不要な再レンダリング防止）
            if (prev.id === newProfile.id) {
                return prev;
            }
            return newProfile;
        });
    }, []);

    useEffect(() => {
        // 初回マウント時に確認
        handleResize();

        // ResizeObserverの方がパフォーマンスが良いが、
        // ここでは画面全体の幅なのでwindow.resizeで十分
        window.addEventListener('resize', handleResize, { passive: true });

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize]);

    return profile;
};

/**
 * プロファイル定数をエクスポート（テスト用）
 */
export { DEVICE_PROFILES, DEFAULT_PROFILE };
