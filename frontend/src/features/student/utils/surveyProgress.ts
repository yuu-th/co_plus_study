import type { Question as SurveyQuestion, Answer as SurveyAnswer } from '@/shared/types';

const getAnsweredQuestionIds = (answers: SurveyAnswer[]): Set<string> => {
    return new Set(
        answers
            .filter(answer => {
                if (Array.isArray(answer.value)) {
                    return answer.value.length > 0;
                }
                return !!answer.value;
            })
            .map(answer => answer.questionId)
    );
};

/**
 * アンケートの回答率を計算する
 * @param questions - 質問配列
 * @param answers - 回答配列
 * @returns 0〜1の回答率（回答済み質問数 / 全質問数）
 */
export const completionRate = (questions: SurveyQuestion[], answers: SurveyAnswer[]): number => {
    if (!questions || questions.length === 0) {
        return 0;
    }

    const answeredQuestionIds = getAnsweredQuestionIds(answers);
    const answeredCount = questions.filter(question => answeredQuestionIds.has(question.id)).length;

    return answeredCount / questions.length;
};

/**
 * 必須だが未回答の質問IDを取得する
 * @param questions - 質問配列
 * @param answers - 回答配列
 * @returns 未回答の必須質問ID配列
 */
export const getMissingRequiredIds = (questions: SurveyQuestion[], answers: SurveyAnswer[]): string[] => {
    const requiredQuestions = questions.filter(q => q.required);
    const answeredQuestionIds = getAnsweredQuestionIds(answers);

    return requiredQuestions
        .filter(question => !answeredQuestionIds.has(question.id))
        .map(question => question.id);
};
