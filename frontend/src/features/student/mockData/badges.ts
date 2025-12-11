// バッジ・スキルのモックデータ
// @see specs/features/archive.md

import type { Badge } from '@/shared/types';

// 共有のBadge型に合わせて rank, earnedAt を使用
export const mockBadges: Badge[] = [
    // 1行目: 金、銅
    {
        id: 'badge-1',
        name: 'まじめさ',
        rank: 'gold',
        description: '毎日コツコツと学習を続けている証',
        condition: '30日間連続でログイン',
        category: '継続',
        status: 'earned',
        earnedAt: '2025-08-15T00:00:00Z',
    },
    {
        id: 'badge-2',
        name: '探求心',
        rank: 'bronze',
        description: '様々な分野に興味を持っている',
        condition: '5つ以上の教科で学習記録',
        category: '学習',
        status: 'earned',
        earnedAt: '2025-07-20T00:00:00Z',
    },
    // 2行目: 銅、銀
    {
        id: 'badge-3',
        name: '努力賞',
        rank: 'bronze',
        description: '継続的な努力を積み重ねている',
        condition: '学習時間累計100時間達成',
        category: '学習',
        status: 'earned',
        earnedAt: '2025-08-01T00:00:00Z',
    },
    {
        id: 'badge-4',
        name: '継続力',
        rank: 'silver',
        description: '学習を習慣化できている',
        condition: '60日間連続でログイン',
        category: '継続',
        status: 'earned',
        earnedAt: '2025-09-01T00:00:00Z',
    },
    // 3行目: 銀、金
    {
        id: 'badge-5',
        name: '質問力',
        rank: 'silver',
        description: 'メンターに積極的に質問している',
        condition: 'メンターへの相談10回以上',
        category: 'コミュニケーション',
        status: 'earned',
        earnedAt: '2025-08-10T00:00:00Z',
    },
    {
        id: 'badge-6',
        name: '記録王',
        rank: 'gold',
        description: '学習日報を欠かさず記録している',
        condition: '50日分の学習日報を記録',
        category: '学習',
        status: 'earned',
        earnedAt: '2025-09-10T00:00:00Z',
    },
    // 4行目: 銅、銅
    {
        id: 'badge-7',
        name: '初心者',
        rank: 'bronze',
        description: '学習の第一歩を踏み出した',
        condition: '初回ログイン',
        category: 'その他',
        status: 'earned',
        earnedAt: '2025-06-01T00:00:00Z',
    },
    {
        id: 'badge-8',
        name: 'チャレンジャー',
        rank: 'bronze',
        description: '新しいことに挑戦している',
        condition: '新しい教科の学習を開始',
        category: 'その他',
        status: 'earned',
        earnedAt: '2025-07-15T00:00:00Z',
    },
    // 未獲得バッジ
    {
        id: 'badge-9',
        name: 'マスター',
        rank: 'platinum',
        description: '圧倒的な学習量を達成',
        condition: '365日間連続でログイン',
        category: '継続',
        status: 'in_progress',
        progress: 68,
    },
    {
        id: 'badge-10',
        name: 'チャレンジャー',
        rank: 'silver',
        description: '新しいことに挑戦中',
        condition: '5つ以上の新しい教科を学習',
        category: '学習',
        status: 'locked',
        progress: 0,
    },
];

// 獲得済みバッジのみ
export const mockEarnedBadges = mockBadges.filter(b => !!b.earnedAt);
