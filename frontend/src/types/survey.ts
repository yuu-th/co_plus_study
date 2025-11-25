// アンケート関連 (Phase 2以降拡張) 型定義

export type QuestionType = 'single' | 'multiple' | 'text';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[]; // single / multiple 用
  required: boolean;
}

/** スケジュール & 配信対象付きアンケート */
export interface Survey {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  // スケジュール関連 (オプション: draft段階は未設定可)
  releaseDate?: string; // 公開予定日時 ISO
  dueDate?: string; // 回答期限 ISO
  targetGroups?: string[]; // 例: ['students','mentors']
  status?: 'draft' | 'scheduled' | 'open' | 'closed';
  archived?: boolean; // 過去アンケートアーカイブ
}

export interface Answer {
  questionId: string;
  value: string | string[]; // multiple時は配列
}

export interface SurveyResponse {
  surveyId: string;
  userId: string;
  answers: Answer[];
  submittedAt: string; // ISO8601
}

/** 集計用統計 */
export interface SurveyStats {
  totalResponses: number;
  completionRate: number; // 0-1
  lastSubmittedAt?: string;
}

/** 一覧用サマリ */
export interface SurveySummary extends Survey {
  stats?: SurveyStats;
}

