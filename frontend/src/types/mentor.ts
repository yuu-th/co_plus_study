// @see specs/features/mentor.md

import type { DiaryPost } from './diary';
import type { NotificationCategory } from './notification';

/** 生徒サマリー */
export interface StudentSummary {
  id: string;
  name: string;
  avatarUrl?: string;
  totalPosts: number;
  totalHours: number;
  lastActivity: string; // ISO8601
}

/** 教科別学習時間 */
export interface SubjectTime {
  subject: string;
  hours: number;
}

/** 生徒の学習統計 */
export interface StudentStats {
  continuousDays: number;
  totalHours: number;
  subjectBreakdown: SubjectTime[];
}

/** 生徒詳細 */
export interface StudentDetail extends StudentSummary {
  posts: DiaryPost[];
  stats: StudentStats;
}

/** お知らせ下書き */
export interface NotificationDraft {
  category: NotificationCategory;
  title: string;
  content: string;
}
