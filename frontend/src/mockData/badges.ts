// バッジ・スキルのモックデータ
// イメージ図に基づく: 金・銀・銅のバッジ

import type { Badge, BadgeCategory } from '../types';

export const mockBadges: Badge[] = [
  // 1行目: 金、銅
  {
    id: 'badge-1',
    name: 'まじめさ',
    type: 'gold',
    description: '毎日コツコツと学習を続けている証',
    condition: '30日間連続でログイン',
    isEarned: true,
    earnedDate: '2025-08-15',
  },
  {
    id: 'badge-2',
    name: '探求心',
    type: 'bronze',
    description: '様々な分野に興味を持っている',
    condition: '5つ以上の教科で学習記録',
    isEarned: true,
    earnedDate: '2025-07-20',
  },
  // 2行目: 銅、銀
  {
    id: 'badge-3',
    name: '努力賞',
    type: 'bronze',
    description: '継続的な努力を積み重ねている',
    condition: '学習時間累計100時間達成',
    isEarned: true,
    earnedDate: '2025-08-01',
  },
  {
    id: 'badge-4',
    name: '継続力',
    type: 'silver',
    description: '学習を習慣化できている',
    condition: '60日間連続でログイン',
    isEarned: true,
    earnedDate: '2025-09-01',
  },
  // 3行目: 銀、金
  {
    id: 'badge-5',
    name: '質問力',
    type: 'silver',
    description: 'メンターに積極的に質問している',
    condition: 'メンターへの相談10回以上',
    isEarned: true,
    earnedDate: '2025-08-10',
  },
  {
    id: 'badge-6',
    name: '記録王',
    type: 'gold',
    description: '学習日報を欠かさず記録している',
    condition: '50日分の学習日報を記録',
    isEarned: true,
    earnedDate: '2025-09-10',
  },
  // 4行目: 銅、銅
  {
    id: 'badge-7',
    name: '初心者',
    type: 'bronze',
    description: '学習の第一歩を踏み出した',
    condition: '初回ログイン',
    isEarned: true,
    earnedDate: '2025-06-01',
  },
  {
    id: 'badge-8',
    name: 'チャレンジャー',
    type: 'bronze',
    description: '新しいことに挑戦している',
    condition: '新しい教科の学習を開始',
    isEarned: true,
    earnedDate: '2025-07-15',
  },
  // 未獲得バッジ（参考）
  {
    id: 'badge-9',
    name: 'マスター',
    type: 'platinum',
    description: '圧倒的な学習量を達成',
    condition: '365日間連続でログイン',
    isEarned: false,
  },
];

export const mockBadgeCategories: BadgeCategory[] = [
  {
    id: 'category-1',
    name: '継続',
    badges: mockBadges.filter(b => ['badge-1', 'badge-4', 'badge-9'].includes(b.id)),
  },
  {
    id: 'category-2',
    name: '学習',
    badges: mockBadges.filter(b => ['badge-2', 'badge-3', 'badge-6'].includes(b.id)),
  },
  {
    id: 'category-3',
    name: 'コミュニケーション',
    badges: mockBadges.filter(b => ['badge-5'].includes(b.id)),
  },
  {
    id: 'category-4',
    name: 'その他',
    badges: mockBadges.filter(b => ['badge-7', 'badge-8'].includes(b.id)),
  },
];

// 獲得済みバッジのみ
export const mockEarnedBadges = mockBadges.filter(b => b.isEarned);
