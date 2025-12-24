// @see specs/features/survey.md
// SurveyResultsPage - アンケート結果分析ページ

import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@/shared/components/Button';
import Card from '@/shared/components/Card';
import type { Answer } from '@/shared/types';
import { useSurvey, useSurveyResponses, convertSurveyFromDB, convertSurveyResponseFromDB } from '@/lib';
import styles from './SurveyResultsPage.module.css';

const SurveyResultsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // アンケートと回答データを取得
    const { data: surveyData, isLoading: isLoadingSurvey } = useSurvey(id ?? '');
    const { data: responsesData, isLoading: isLoadingResponses } = useSurveyResponses(id ?? '');

    // DBデータをフロントエンド型に変換
    const survey = useMemo(() => {
        if (!surveyData) return null;
        return convertSurveyFromDB(surveyData);
    }, [surveyData]);

    const responses = useMemo(() => {
        if (!responsesData) return [];
        return responsesData.map(convertSurveyResponseFromDB);
    }, [responsesData]);

    const isLoading = isLoadingSurvey || isLoadingResponses;

    if (isLoading) {
        return (
            <div className={styles.page}>
                <div className={styles.loading}>読み込み中...</div>
            </div>
        );
    }

    if (!survey) {
        return (
            <div className={styles.errorPage}>
                <Card>
                    <p>指定されたアンケートが見つかりませんでした。</p>
                    <Button onClick={() => navigate('/mentor/surveys')}>アンケート一覧へ戻る</Button>
                </Card>
            </div>
        );
    }

    const aggregateResults = () => {
        const results: Record<string, { type: string; average?: string; count?: number; counts?: Record<string, number>; total?: number; responses?: (string | string[] | number)[] }> = {};

        survey.questions.forEach(question => {
            const questionResponses = responses
                .map(r => r.answers.find((a: Answer) => a.questionId === question.id)?.value)
                .filter(v => v != null);

            if (question.type === 'rating') {
                const values = questionResponses.map(v => parseInt(v as string)).filter(n => !isNaN(n));
                const average = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
                results[question.id] = {
                    type: 'rating',
                    average: average.toFixed(1),
                    count: values.length,
                };
            } else if (question.type === 'single' || question.type === 'multiple') {
                const counts: Record<string, number> = {};
                questionResponses.forEach(v => {
                    if (Array.isArray(v)) {
                        v.forEach(opt => {
                            counts[opt] = (counts[opt] || 0) + 1;
                        });
                    } else {
                        counts[v as string] = (counts[v as string] || 0) + 1;
                    }
                });
                results[question.id] = {
                    type: question.type,
                    counts,
                    total: questionResponses.length,
                };
            } else {
                results[question.id] = {
                    type: 'text',
                    responses: questionResponses,
                };
            }
        });

        return results;
    };

    const results = aggregateResults();

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.headerInfo}>
                    <h1 className={styles.title}>{survey.title}</h1>
                    <div className={styles.meta}>
                        <span className={styles.responseBadge}>回答 {responses.length} 件</span>
                        <span className={styles.date}>公開日: {survey.releaseDate ? new Date(survey.releaseDate).toLocaleDateString('ja-JP') : '-'}</span>
                    </div>
                </div>
                <Button variant="outline" onClick={() => navigate('/mentor/surveys')}>
                    一覧へ戻る
                </Button>
            </div>

            <div className={styles.resultsList}>
                {survey.questions.map((question, idx) => {
                    const result = results[question.id];
                    if (!result) return null;

                    return (
                        <Card key={question.id} className={styles.questionCard}>
                            <div className={styles.questionHeader}>
                                <span className={styles.qNumber}>Q{idx + 1}</span>
                                <h3 className={styles.questionTitle}>{question.text}</h3>
                            </div>

                            <div className={styles.resultBody}>
                                {result.type === 'rating' && result.average !== undefined && (
                                    <div className={styles.ratingSection}>
                                        <div className={styles.averageCard}>
                                            <span className={styles.averageLabel}>平均スコア</span>
                                            <div className={styles.scoreContainer}>
                                                <span className={styles.scoreValue}>{result.average}</span>
                                                <span className={styles.scoreMax}>/ 5.0</span>
                                            </div>
                                            <div className={styles.miniStars}>
                                                {'★'.repeat(Math.round(parseFloat(String(result.average))))}
                                                {'☆'.repeat(5 - Math.round(parseFloat(String(result.average))))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {(result.type === 'single' || result.type === 'multiple') && result.counts && result.total !== undefined && (
                                    <div className={styles.choiceSection}>
                                        {question.options?.map((option) => {
                                            const count = (result.counts![option] as number) || 0;
                                            const percentage = result.total! > 0
                                                ? ((count / result.total!) * 100).toFixed(1)
                                                : '0';
                                            return (
                                                <div key={option} className={styles.choiceRow}>
                                                    <div className={styles.choiceLabelRow}>
                                                        <span className={styles.optionText}>{option}</span>
                                                        <span className={styles.optionCount}>{count} 票 ({percentage}%)</span>
                                                    </div>
                                                    <div className={styles.progressBar}>
                                                        <div
                                                            className={styles.progressFill}
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {result.type === 'text' && result.responses && (
                                    <div className={styles.textSection}>
                                        <label className={styles.sectionLabel}>回答一覧</label>
                                        <div className={styles.textResponses}>
                                            {result.responses.length > 0 ? (
                                                result.responses.map((text, i: number) => (
                                                    <div key={i} className={styles.textItem}>
                                                        {String(text)}
                                                    </div>
                                                ))
                                            ) : (
                                                <p className={styles.noData}>まだ回答がありません</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default SurveyResultsPage;
