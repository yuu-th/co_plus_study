// @see specs/features/archive.md

/**
 * バッジランク
 * @see specs/features/archive.md
 */
export type BadgeRank = 'platinum' | 'gold' | 'silver' | 'bronze';

/**
 * バッジ状態
 * @see specs/features/archive.md
 */
export type BadgeStatus = 'locked' | 'in_progress' | 'earned';

/**
 * バッジ情報
 * @see specs/features/archive.md
 */
export interface Badge {
  /** バッジID */
  id: string;
  /** バッジ名 */
  name: string;
  /** バッジの説明 */
  description: string;
  /** ランク */
  rank: BadgeRank;
  /** カテゴリ */
  category: string;
  /** アイコンURL */
  iconUrl?: string;
  /** 獲得日時（ISO8601、未獲得時はundefined） */
  earnedAt?: string;
  /** 獲得条件（例: "連続7日学習"） */
  condition?: string;
  /** 進捗率（0-100%） */
  progress?: number;
  /** バッジ状態 */
  status?: BadgeStatus;
}

/**
 * バッジカテゴリ
 */
export interface BadgeCategory {
  /** カテゴリID */
  id: string;
  /** カテゴリ名 */
  name: string;
  /** カテゴリ内のバッジ */
  badges: Badge[];
}
