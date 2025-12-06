// @see specs/features/mentor.md

/**
 * メンターの専門分野
 */
export interface Specialty {
  /** 専門分野ID */
  id: string;
  /** 専門分野名（例: "算数", "英語"） */
  name: string;
}

/**
 * メンター情報
 * @see specs/features/mentor.md
 */
export interface Mentor {
  /** メンターID */
  id: string;
  /** メンター名 */
  name: string;
  /** フリガナ */
  kana: string;
  /** アバター画像URL */
  avatarUrl?: string;
  /** 専門分野 */
  specialties: Specialty[];
  /** 自己紹介文 */
  introduction: string;
  /** メールアドレス */
  email: string;
  /** ステータス */
  status: 'active' | 'inactive';
  /** 作成日時（ISO8601） */
  createdAt: string;
}

/**
 * 生徒の概要情報（一覧表示用）
 * @see specs/features/mentor.md
 */
export interface StudentSummary {
  /** 生徒ID */
  id: string;
  /** 生徒名 */
  name: string;
  /** アバター画像URL */
  avatarUrl?: string;
  /** 総投稿数 */
  totalPosts: number;
  /** 総学習時間（時間） */
  totalHours: number;
  /** 最終活動日時（ISO8601） */
  lastActivity: string;
}

/**
 * 教科別学習時間
 */
export interface SubjectTime {
  /** 教科名 */
  subject: string;
  /** 学習時間（時間） */
  hours: number;
}

/**
 * 生徒の統計情報
 * @see specs/features/mentor.md
 */
export interface StudentStats {
  /** 連続学習日数 */
  continuousDays: number;
  /** 最長連続日数 */
  longestStreak: number;
  /** 累計活動日数 */
  totalDays: number;
  /** 累計学習時間（時間） */
  totalHours: number;
  /** 教科別学習時間 */
  subjectBreakdown: SubjectTime[];
}

/**
 * 生徒の詳細情報
 * @see specs/features/mentor.md
 */
export interface StudentDetail extends StudentSummary {
  /** フリガナ */
  kana: string;
  /** 学習統計 */
  stats: StudentStats;
  /** 参加日時（ISO8601） */
  joinedAt: string;
}

/**
 * お知らせドラフト（メンター作成用）
 * @see specs/features/mentor.md
 */
export interface NotificationDraft {
  /** カテゴリ */
  category: 'info' | 'important' | 'event' | 'achievement';
  /** タイトル */
  title: string;
  /** 本文 */
  content: string;
}
