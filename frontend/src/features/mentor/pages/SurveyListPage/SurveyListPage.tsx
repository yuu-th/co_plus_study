// @see specs/features/survey.md
// SurveyListPage - アンケート管理一覧

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/shared/components/Button';
import Card from '@/shared/components/Card';
import { useAllSurveys, useDeleteSurvey, convertSurveyFromDB } from '@/lib';
import styles from './SurveyListPage.module.css';

const SurveyListPage = () => {
    const { data: surveysData, isLoading } = useAllSurveys();
    const deleteMutation = useDeleteSurvey();

    // DBデータをフロントエンド型に変換
    const surveys = useMemo(() => {
        if (!surveysData) return [];
        return surveysData.map(convertSurveyFromDB);
    }, [surveysData]);

    const handleDelete = async (surveyId: string) => {
        const survey = surveys.find(s => s.id === surveyId);
        if (!survey) return;

        if (survey.status === 'active' || survey.status === 'closed') {
            alert('公開済みまたは完了済みのアンケートは削除できません');
            return;
        }

        if (window.confirm(`「${survey.title}」を削除してもよろしいですか？`)) {
            try {
                await deleteMutation.mutateAsync(surveyId);
            } catch (error) {
                console.error('削除に失敗しました:', error);
            }
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'draft': return '下書き';
            case 'scheduled': return '公開予定';
            case 'active': return '公開中';
            case 'closed': return '終了済み';
            default: return status;
        }
    };

    if (isLoading) {
        return (
            <div className={styles.page}>
                <div className={styles.header}>
                    <h1 className={styles.title}>アンケート管理</h1>
                </div>
                <div className={styles.loading}>読み込み中...</div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.headerTitleArea}>
                    <h1 className={styles.title}>アンケート管理</h1>
                    <p className={styles.subtitle}>学生の意識調査や満足度アンケートを管理します</p>
                </div>
                <Link to="/mentor/surveys/new">
                    <Button variant="primary">新規アンケート作成</Button>
                </Link>
            </div>

            <div className={styles.list}>
                {surveys.length === 0 ? (
                    <div className={styles.emptyCard}>
                        <p className={styles.empty}>まだアンケートが作成されていません</p>
                        <Link to="/mentor/surveys/new">
                            <Button variant="outline">最初のアンケートを作成する</Button>
                        </Link>
                    </div>
                ) : (
                    surveys.map((survey) => (
                        <Card key={survey.id} className={styles.card}>
                            <div className={styles.surveyItem}>
                                <div className={styles.surveyInfo}>
                                    <div className={styles.itemHeader}>
                                        <span className={`${styles.status} ${styles[survey.status]}`}>
                                            {getStatusLabel(survey.status)}
                                        </span>
                                        <span className={styles.questionCount}>
                                            全 {survey.questions.length} 問
                                        </span>
                                        {survey.releaseDate && (
                                            <span className={styles.date}>
                                                公開開始: {new Date(survey.releaseDate).toLocaleDateString('ja-JP')}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className={styles.surveyTitle}>{survey.title}</h3>
                                    {survey.description && (
                                        <p className={styles.surveyDescription}>
                                            {survey.description.length > 100
                                                ? survey.description.slice(0, 100) + '...'
                                                : survey.description}
                                        </p>
                                    )}
                                </div>
                                <div className={styles.actions}>
                                    <Link to={`/mentor/surveys/${survey.id}/results`}>
                                        <Button variant="outline" size="small">分析結果</Button>
                                    </Link>
                                    <Link to={`/mentor/surveys/${survey.id}/edit`}>
                                        <Button variant="ghost" size="small">編集</Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="small"
                                        onClick={() => handleDelete(survey.id)}
                                        disabled={survey.status === 'active' || survey.status === 'closed'}
                                        className={styles.deleteBtn}
                                    >
                                        削除
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default SurveyListPage;
