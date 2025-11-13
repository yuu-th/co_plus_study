// バッジ・スキル関連の型定義

export type BadgeType = 'gold' | 'silver' | 'bronze' | 'platinum';

export interface Badge {
  id: string;
  name: string;
  type: BadgeType;
  description: string;
  condition: string; // 獲得条件
  earnedDate?: string;
  isEarned: boolean;
  iconUrl?: string;
}

export interface BadgeCategory {
  id: string;
  name: string;
  badges: Badge[];
}
