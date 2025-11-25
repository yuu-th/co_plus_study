// 学習日報 (Phase 2) 型定義
// 既存の DiaryEntry 系は新仕様へ統合されたため削除し、DiaryPost/Reaction ベースに刷新。

/** 絵文字リアクション種別 */
export type ReactionType = '👍' | '❤️' | '🎉' | '👏' | '🔥';

/** リアクション単位 */
export interface Reaction {
  type: ReactionType;
  count: number; // 表示用集計カウント
  userIds: string[]; // リアクションしたメンター等のユーザーID
}

/** SNS風日報投稿 */
export interface DiaryPost {
  id: string;
  userId: string;
  userName: string; // 表示用（生徒名）
  subject: string; // 教科
  duration: number; // 分
  content: string; // 本文 (<=500文字想定)
  timestamp: string; // ISO8601 (例: 2025-09-29T14:30:00Z)
  reactions: Reaction[]; // リアクション配列
}

/** 日付単位でグループ化された投稿集合 */
export interface GroupedDiaryPost {
  dateLabel: string; // "今日" | "昨日" | "M月D日" 表示用
  posts: DiaryPost[];
}

/** フォーム送信用データ (内部ステート) */
export interface DiaryFormData {
  subject: string;
  duration: number; // 1-999
  content: string; // <=500
}

/** 教科別集計用 (DiaryStats向け) */
export interface SubjectDurationStat {
  subject: string;
  totalMinutes: number;
}

/** 週次統計 (DiaryStats 向け) */
export interface WeeklyDiaryStats {
  weekStartISO: string; // 週開始 ISO (月曜など)
  totalPosts: number;
  totalMinutes: number;
  subjectBreakdown: SubjectDurationStat[];
}

