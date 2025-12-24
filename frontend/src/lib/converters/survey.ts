// Survey型のDB ↔ フロントエンド変換
// @see specs/features/survey.md

import type { Survey, SurveyResponse, Question, Answer, SurveyStatus } from '@/shared/types';

// DBから取得する生のデータ型（snake_case）
interface SurveyFromDB {
    id: string;
    title: string;
    description: string | null;
    questions: unknown;
    release_date: string | null;
    due_date: string | null;
    status: string;
    created_by: string;
    created_at: string;
    creator?: {
        id: string;
        display_name: string;
    };
}

interface SurveyResponseFromDB {
    id: string;
    survey_id: string;
    user_id: string;
    answers: unknown;
    submitted_at: string;
    user?: {
        id: string;
        display_name: string;
    };
}

/**
 * DBのSurveyデータをフロントエンド型に変換
 */
export function convertSurveyFromDB(dbSurvey: SurveyFromDB): Survey {
    return {
        id: dbSurvey.id,
        title: dbSurvey.title,
        description: dbSurvey.description ?? undefined,
        questions: (dbSurvey.questions as Question[]) ?? [],
        releaseDate: dbSurvey.release_date ?? undefined,
        dueDate: dbSurvey.due_date ?? undefined,
        status: dbSurvey.status as SurveyStatus,
        createdBy: dbSurvey.created_by,
    };
}

/**
 * DBのSurveyResponseデータをフロントエンド型に変換
 */
export function convertSurveyResponseFromDB(dbResponse: SurveyResponseFromDB): SurveyResponse {
    return {
        id: dbResponse.id,
        surveyId: dbResponse.survey_id,
        userId: dbResponse.user_id,
        answers: (dbResponse.answers as Answer[]) ?? [],
        submittedAt: dbResponse.submitted_at,
    };
}

/**
 * フロントエンド型の回答データをDB形式に変換
 */
export function convertSurveyResponseToDB(response: Omit<SurveyResponse, 'id' | 'submittedAt'>): {
    survey_id: string;
    user_id: string;
    answers: unknown;
} {
    return {
        survey_id: response.surveyId,
        user_id: response.userId,
        answers: response.answers,
    };
}
