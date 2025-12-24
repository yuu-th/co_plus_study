// React Query client configuration
// @see ADR-005: バックエンド連携アーキテクチャ

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // キャッシュ時間: 5分
            staleTime: 5 * 60 * 1000,
            // ガベージコレクション時間: 10分
            gcTime: 10 * 60 * 1000,
            // ウィンドウフォーカス時の再取得を無効化
            refetchOnWindowFocus: false,
            // リトライ設定
            retry: (failureCount, error) => {
                // 認証エラーはリトライしない
                if (error instanceof Error && error.message.includes('401')) {
                    return false;
                }
                return failureCount < 3;
            },
        },
        mutations: {
            // エラー時のリトライを無効化
            retry: false,
        },
    },
});

export default queryClient;
