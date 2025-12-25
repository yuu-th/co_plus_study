// SurveyPage - アンケートページ
// @see specs/features/survey.md

import { convertSurveyFromDB, useActiveSurveys, useAuth, useSubmitSurveyResponse } from '@/lib';
import type { Answer, SurveyResponse } from '@/shared/types';
import { useMemo, useState } from 'react';
import SurveyForm from '../../components/survey/SurveyForm';
import styles from './SurveyPage.module.css';

const SurveyPage = () => {
    const { user } = useAuth();
    const { data: surveysData, isLoading } = useActiveSurveys();
    const submitMutation = useSubmitSurveyResponse();
    
    const [selectedId, setSelectedId] = useState<string>('');
    const [submittedResponses, setSubmittedResponses] = useState<SurveyResponse[]>([]);

    // DBデータをフロントエンド型に変換
    const surveys = useMemo(() => {
        if (!surveysData) return [];
        return surveysData.map(convertSurveyFromDB);
    }, [surveysData]);

    // 初期選択
    const effectiveSelectedId = selectedId || surveys[0]?.id || '';
    const selected = surveys.find(s => s.id === effectiveSelectedId);

    const handleSubmit = async (resp: SurveyResponse) => {
        if (!user) return;

        try {
            await submitMutation.mutateAsync({
                survey_id: resp.surveyId,
                user_id: user.id,
                answers: resp.answers as unknown as Answer[],
            });
            setSubmittedResponses(prev => [...prev, resp]);
        } catch (error) {
            console.error('回答の送信に失敗しました:', error);
        }
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('ja-JP');
    };

    const getDaysRemaining = (dueDate?: string) => {
        if (!dueDate) return null;
        const now = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    if (isLoading) {
        return (
            <div className={styles.page}>
                <h1 className={styles.title}>アンケート</h1>
                <div className={styles.loading}>読み込み中...</div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>アンケート</h1>
            <div className={styles.layout}>
                <aside className={styles.list} aria-label="アンケート一覧">
                    <h2 className={styles.listTitle}>一覧</h2>
                    {surveys.length === 0 ? (
                        <p className={styles.empty}>現在回答できるアンケートはありません</p>
                    ) : (
                        <ul>
                            {surveys.map(s => (
                                <li key={s.id}>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedId(s.id)}
                                        aria-current={effectiveSelectedId === s.id}
                                        className={`${styles.surveyItem} ${effectiveSelectedId === s.id ? styles.selected : ''}`}
                                    >{s.title}</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </aside>
                <main className={styles.main}>
                    {selected ? (
                        <>
                            {(selected.releaseDate || selected.dueDate) && (
                                <div className={styles.surveyMeta}>
                                    {selected.releaseDate && (
                                        <p className={styles.metaItem}>
                                            <span className={styles.metaLabel}>公開日:</span> {formatDate(selected.releaseDate)}
                                        </p>
                                    )}
                                    {selected.dueDate && (
                                        <p className={styles.metaItem}>
                                            <span className={styles.metaLabel}>締切:</span> {formatDate(selected.dueDate)}
                                            {getDaysRemaining(selected.dueDate) !== null && (
                                                <span className={styles.remaining}>
                                                    （残り {getDaysRemaining(selected.dueDate)}日）
                                                </span>
                                            )}
                                        </p>
                                    )}
                                </div>
                            )}
                            <SurveyForm 
                                survey={selected} 
                                onSubmit={handleSubmit}
                                isSubmitting={submitMutation.isPending}
                            />
                        </>
                    ) : (
                        <p>アンケートを選択してください</p>
                    )}
                </main>
                <aside className={styles.side} aria-label="回答履歴">
                    <h2 className={styles.listTitle}>回答履歴</h2>
                    {submittedResponses.length === 0 && <p>まだ回答はありません</p>}
                    {submittedResponses.map(r => (
                        <div key={r.submittedAt} className={styles.responseItem}>
                            {r.surveyId} / {new Date(r.submittedAt).toLocaleString('ja-JP')}
                        </div>
                    ))}
                </aside>
            </div>
        </div>
    );
};

export default SurveyPage;
