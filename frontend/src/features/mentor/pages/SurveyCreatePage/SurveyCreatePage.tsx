import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@/shared/components/Button';
import Card from '@/shared/components/Card';
import type { Question, QuestionType } from '@/shared/types';
import { useAuth, useSurvey, useCreateSurvey, useUpdateSurvey, convertSurveyFromDB } from '@/lib';
import styles from './SurveyCreatePage.module.css';

const TYPE_LABELS: Record<QuestionType, string> = {
    text: 'テキスト',
    single: '単一選択',
    multiple: '複数選択',
    rating: '評価',
    color: 'カラー',
};

const SurveyCreatePage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;
    const { user } = useAuth();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [showPreview, setShowPreview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 既存アンケートの取得（編集モード）
    const { data: existingData, isLoading } = useSurvey(id ?? '');
    const createMutation = useCreateSurvey();
    const updateMutation = useUpdateSurvey();

    // DBデータをフロントエンド型に変換
    const existingSurvey = useMemo(() => {
        if (!existingData) return null;
        return convertSurveyFromDB(existingData);
    }, [existingData]);

    // 編集モードの場合、既存データを読み込み
    useEffect(() => {
        if (isEditMode && existingSurvey) {
            setTitle(existingSurvey.title);
            setDescription(existingSurvey.description || '');
            setQuestions(existingSurvey.questions);
        }
    }, [isEditMode, existingSurvey]);

    const addQuestion = (type: QuestionType) => {
        const newQuestion: Question = {
            id: `q${questions.length + 1}`,
            type,
            text: '',
            required: false,
            options: type === 'single' || type === 'multiple' ? ['選択肢1'] : undefined,
            ratingStyle: type === 'rating' ? 'emoji' : undefined,
        };
        setQuestions([...questions, newQuestion]);
    };

    const updateQuestion = (index: number, field: keyof Question, value: unknown) => {
        const updated = [...questions];
        updated[index] = { ...updated[index], [field]: value };
        setQuestions(updated);
    };

    const removeQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const question = questions[qIndex];
        if (!question.options) return;
        const newOptions = [...question.options];
        newOptions[oIndex] = value;
        updateQuestion(qIndex, 'options', newOptions);
    };

    const addOption = (qIndex: number) => {
        const question = questions[qIndex];
        if (!question.options) return;
        updateQuestion(qIndex, 'options', [...question.options, `選択肢${question.options.length + 1}`]);
    };

    const removeOption = (qIndex: number, oIndex: number) => {
        const question = questions[qIndex];
        if (!question.options) return;
        updateQuestion(qIndex, 'options', question.options.filter((_, i) => i !== oIndex));
    };

    const handleSave = async () => {
        if (!title.trim()) {
            alert('タイトルを入力してください');
            return;
        }

        if (!user) {
            alert('ログインが必要です');
            return;
        }

        setIsSubmitting(true);

        try {
            if (isEditMode && id) {
                await updateMutation.mutateAsync({
                    id,
                    title,
                    description: description || null,
                    questions,
                    status: 'active',
                });
                alert('アンケートを更新しました');
            } else {
                await createMutation.mutateAsync({
                    title,
                    description: description || null,
                    questions,
                    release_date: new Date().toISOString(),
                    status: 'active',
                    created_by: user.id,
                });
                alert('アンケートを作成しました');
            }
            navigate('/mentor/surveys');
        } catch (error) {
            console.error('保存に失敗しました:', error);
            alert('保存に失敗しました');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading && isEditMode) {
        return (
            <div className={styles.page}>
                <div className={styles.loading}>読み込み中...</div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.headerInfo}>
                    <h1 className={styles.title}>
                        {isEditMode ? 'アンケート編集' : 'アンケート作成'}
                    </h1>
                    <p className={styles.subtitle}>学習状況や満足度の調査に使用します</p>
                </div>
                <div className={styles.headerActions}>
                    <Button variant="ghost" onClick={() => navigate('/mentor/surveys')} disabled={isSubmitting}>
                        キャンセル
                    </Button>
                    <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                        {showPreview ? '編集モード' : '詳細プレビュー'}
                    </Button>
                    <Button variant="primary" onClick={handleSave} className={styles.saveBtn} disabled={isSubmitting}>
                        {isSubmitting ? '保存中...' : isEditMode ? '更新する' : 'アンケートを公開'}
                    </Button>
                </div>
            </div>

            {!showPreview ? (
                <div className={styles.editorBody}>
                    <Card className={styles.basicInfoCard}>
                        <h2 className={styles.sectionTitle}>基本情報</h2>
                        <div className={styles.grid}>
                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="title">アンケート名称 *</label>
                                <input
                                    id="title"
                                    type="text"
                                    className={styles.input}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="例：【重要】週次学習状況の振り返り"
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="desc">アンケートの説明</label>
                                <textarea
                                    id="desc"
                                    className={styles.textarea}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="このアンケートの目的や回答期限などを入力してください"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </Card>

                    <div className={styles.questionsArea}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>質問項目 ({questions.length})</h2>
                        </div>

                        <div className={styles.questionList}>
                            {questions.map((q, qIndex) => (
                                <Card key={q.id} className={styles.questionCard}>
                                    <div className={styles.questionHeader}>
                                        <div className={styles.typeBadge}>
                                            <span className={styles.badge}>{TYPE_LABELS[q.type]}</span>
                                            <span className={styles.qIndex}>質問 {qIndex + 1}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(qIndex)}
                                            className={styles.removeBtn}
                                            title="この質問を削除"
                                        >
                                            削除
                                        </button>
                                    </div>

                                    <div className={styles.questionBody}>
                                        <div className={styles.field}>
                                            <label className={styles.label} htmlFor={`q-text-${qIndex}`}>質問文 *</label>
                                            <input
                                                id={`q-text-${qIndex}`}
                                                type="text"
                                                className={styles.input}
                                                value={q.text}
                                                onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                                                placeholder="具体的な質問内容を入力してください"
                                                required
                                            />
                                        </div>

                                        <div className={styles.questionMeta}>
                                            <label className={styles.checkboxLabel}>
                                                <input
                                                    type="checkbox"
                                                    checked={q.required}
                                                    onChange={(e) => updateQuestion(qIndex, 'required', e.target.checked)}
                                                />
                                                <span>必須回答にする</span>
                                            </label>

                                            {q.type === 'rating' && (
                                                <div className={styles.ratingStyleField}>
                                                    <label className={styles.miniLabel}>評価方式:</label>
                                                    <select
                                                        className={styles.smallSelect}
                                                        value={q.ratingStyle || 'emoji'}
                                                        onChange={(e) => updateQuestion(qIndex, 'ratingStyle', e.target.value)}
                                                    >
                                                        <option value="emoji">絵文字 (😞 ~ 😍)</option>
                                                        <option value="star">スター (★)</option>
                                                        <option value="number">数値 (1 ~ 5)</option>
                                                    </select>
                                                </div>
                                            )}
                                        </div>

                                        {(q.type === 'single' || q.type === 'multiple') && q.options && (
                                            <div className={styles.optionsArea}>
                                                <label className={styles.miniLabel}>選択肢設定</label>
                                                <div className={styles.optionList}>
                                                    {q.options.map((opt, oIndex) => (
                                                        <div key={oIndex} className={styles.optionRow}>
                                                            <div className={styles.optionDragHandle}>::</div>
                                                            <input
                                                                type="text"
                                                                className={styles.optionInput}
                                                                value={opt}
                                                                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                            />
                                                            {q.options!.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeOption(qIndex, oIndex)}
                                                                    className={styles.removeOptionBtn}
                                                                >
                                                                    ×
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="small"
                                                    onClick={() => addOption(qIndex)}
                                                    className={styles.addOptionBtn}
                                                >
                                                    + 選択肢を追加
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className={styles.addQuestionBox}>
                            <h3 className={styles.addTitle}>質問を追加する</h3>
                            <div className={styles.addButtons}>
                                {(Object.keys(TYPE_LABELS) as QuestionType[]).map(type => (
                                    <Button
                                        key={type}
                                        variant="outline"
                                        size="small"
                                        onClick={() => addQuestion(type)}
                                        className={styles.addBtn}
                                    >
                                        {TYPE_LABELS[type]}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.previewContainer}>
                    <Card className={styles.previewCard}>
                        <div className={styles.previewHeader}>
                            <span className={styles.previewBadge}>プレビューモード</span>
                            <h2 className={styles.previewTitle}>{title || '（アンケートタイトル未設定）'}</h2>
                            {description && <p className={styles.previewDesc}>{description}</p>}
                        </div>

                        <div className={styles.previewQuestions}>
                            {questions.length === 0 ? (
                                <div className={styles.emptyPreview}>
                                    質問が追加されていません
                                </div>
                            ) : (
                                questions.map((q, idx) => (
                                    <div key={q.id} className={styles.previewQuestionItem}>
                                        <p className={styles.previewQuestionText}>
                                            <span className={styles.qNum}>{idx + 1}.</span> {q.text || '（質問文が未入力です）'}
                                            {q.required && <span className={styles.requiredMark}> *</span>}
                                        </p>
                                        <div className={styles.previewInputArea}>
                                            {q.type === 'text' && (
                                                <input type="text" placeholder="回答を入力してください" disabled className={styles.previewTextInput} />
                                            )}
                                            {(q.type === 'single' || q.type === 'multiple') && q.options && (
                                                <div className={styles.previewChoices}>
                                                    {q.options.map((opt, oIdx) => (
                                                        <div key={oIdx} className={styles.previewChoice}>
                                                            <input type={q.type === 'single' ? 'radio' : 'checkbox'} disabled />
                                                            <span>{opt}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {q.type === 'rating' && (
                                                <div className={styles.previewRating}>
                                                    {q.ratingStyle === 'emoji' && (
                                                        <div className={styles.ratingEmoji}>😞 😐 😊 😍</div>
                                                    )}
                                                    {q.ratingStyle === 'star' && (
                                                        <div className={styles.ratingStar}>★ ★ ★ ★ ★</div>
                                                    )}
                                                    {q.ratingStyle === 'number' && (
                                                        <div className={styles.ratingNumber}>1 2 3 4 5</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className={styles.previewFooter}>
                            <Button variant="primary" disabled className={styles.submitPreviewBtn}>
                                回答を送信する
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default SurveyCreatePage;
