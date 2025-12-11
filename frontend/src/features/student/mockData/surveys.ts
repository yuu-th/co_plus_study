// アンケートモックデータ
// @see specs/features/survey.md

import type { Survey, SurveyResponse } from '@/shared/types';

export const mockSurveys: Survey[] = [
    {
        id: 'survey-1',
        title: '週次学習振り返り',
        description: '今週の学習状況について教えてください。',
        questions: [
            { id: 'q1', type: 'single', text: '今週の学習満足度は？', options: ['とても良い', '良い', '普通', '悪い'], required: true },
            { id: 'q2', type: 'multiple', text: 'よく学習した教科を選んでください', options: ['国語', '算数', '理科', '社会', '英語'], required: true },
            { id: 'q3', type: 'text', text: '来週挑戦したいこと', required: false },
        ],
        releaseDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        targetGroups: ['students'],
        status: 'active',
    },
    {
        id: 'survey-2',
        title: '月間メンタリングフィードバック',
        description: 'メンターとのコミュニケーションについて',
        questions: [
            { id: 'q1', type: 'rating', text: 'メンタリングの分かりやすさ', required: true, ratingStyle: 'emoji' },
            { id: 'q2', type: 'text', text: '改善してほしい点', required: false },
        ],
        releaseDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        targetGroups: ['students'],
        status: 'scheduled',
    },
];

export const mockSurveyResponses: SurveyResponse[] = [
    {
        surveyId: 'survey-1',
        userId: '1',
        answers: [
            { questionId: 'q1', value: '良い' },
            { questionId: 'q2', value: ['算数', '英語'] },
            { questionId: 'q3', value: '来週は英語の長文読解に挑戦したい' },
        ],
        submittedAt: new Date().toISOString(),
    },
];
