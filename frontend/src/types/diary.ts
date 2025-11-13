// 学習日報関連の型定義

export interface DiaryEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  subject: string;
  duration: number; // 分
  content: string;
  comment?: string;
  createdAt: string;
}

export interface Feedback {
  id: string;
  diaryId: string;
  mentorId: string;
  mentorName: string;
  message: string;
  timestamp: string;
}

export interface DiaryEntryWithFeedback extends DiaryEntry {
  feedback?: Feedback[];
}

export interface DiaryFormData {
  date: string;
  subject: string;
  duration: number;
  content: string;
  comment?: string;
}
