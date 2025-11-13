// アンケート関連の型定義

export type QuestionType = 'single' | 'multiple' | 'text';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  required: boolean;
}

export interface Survey {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface Answer {
  questionId: string;
  value: string | string[];
}

export interface SurveyResponse {
  surveyId: string;
  userId: string;
  answers: Answer[];
  submittedAt: string;
}
