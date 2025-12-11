import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/shared/components/Button';
import Card from '@/shared/components/Card';
import type { Survey, Question, QuestionType, RatingStyle } from '@/shared/types';
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
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [showPreview, setShowPreview] = useState(false);

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

    const handleSave = () => {
        const newSurvey: Survey = {
            id: `survey-${Date.now()}`,
            title,
            description,
            questions,
            releaseDate: new Date().toISOString(),
            targetGroups: ['students'],
            status: 'active',
        };

        // モックデータに追加
        console.log('新規アンケート作成:', newSurvey);
        alert('アンケートを作成しました（モックデータに保存）');
        navigate('/mentor/dashboard');
    };

    const renderRatingPreview = (style?: RatingStyle) => {
        if (style === 'numeric') {
            return (
                <div className={styles.ratingPreview}>
                    {[1, 2, 3, 4, 5].map(n => (
                        <span key={n} className={styles.ratingNumber}>{n}</span>
                    ))}
                </div>
            );
        }
        return (
            <div className={styles.ratingPreview}>
                <span className={styles.ratingStars}>★★★★★</span>
            </div>
        );
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>アンケート作成</h1>
                <div className={styles.actions}>
                    <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                        {showPreview ? '編集に戻る' : 'プレビュー'}
                    </Button>
                    <Button variant="primary" onClick={handleSave} disabled={!title || questions.length === 0}>
                        保存
                    </Button>
                </div>
            </div>

            {showPreview ? (
                <Card title="プレビュー">
                    <h2>{title}</h2>
                    <p>{description}</p>
                    {questions.map((q, i) => (
                        <div key={i} className={styles.previewQuestion}>
                            <p><strong>Q{i + 1} ({TYPE_LABELS[q.type]}):</strong> {q.text || '（未入力）'}</p>

                            {q.type === 'rating' && (
                                <div style={{ marginTop: '8px' }}>
                                    {renderRatingPreview(q.ratingStyle)}
                                    <p className={styles.helpText}>※生徒にはこのように表示されます</p>
                                </div>
                            )}

                            {q.options && (
                                <ul style={{ listStyle: 'disc', marginLeft: '20px' }}>
                                    {q.options.map((o, idx) => <li key={idx}>{o}</li>)}
                                </ul>
                            )}
                            <p>{q.required && '（必須）'}</p>
                        </div>
                    ))}
                </Card>
            ) : (
                <div className={styles.form}>
                    <Card title="基本情報">
                        <div className={styles.field}>
                            <label className={styles.label}>タイトル *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="例: 今週の学習振り返り"
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>説明</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="アンケートの目的や回答方法を説明"
                                className={styles.textarea}
                            />
                        </div>
                    </Card>

                    <Card title="質問">
                        {questions.map((q, i) => (
                            <div key={i} className={styles.questionItem}>
                                <div className={styles.questionHeader}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span>質問 {i + 1}</span>
                                        <span className={styles.badge}>{TYPE_LABELS[q.type]}</span>
                                    </div>
                                    <button onClick={() => removeQuestion(i)} className={styles.removeBtn}>
                                        削除
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={q.text}
                                    onChange={(e) => updateQuestion(i, 'text', e.target.value)}
                                    placeholder="質問文を入力"
                                    className={styles.input}
                                />

                                {q.type === 'rating' && (
                                    <div className={styles.optionsArea}>
                                        <label className={styles.label}>評価スタイル</label>
                                        <div className={styles.ratingStyleSelector}>
                                            <label className={styles.radioLabel}>
                                                <input
                                                    type="radio"
                                                    checked={q.ratingStyle === 'emoji' || !q.ratingStyle}
                                                    onChange={() => updateQuestion(i, 'ratingStyle', 'emoji')}
                                                />
                                                星アイコン (★★★★★)
                                            </label>
                                            <label className={styles.radioLabel}>
                                                <input
                                                    type="radio"
                                                    checked={q.ratingStyle === 'numeric'}
                                                    onChange={() => updateQuestion(i, 'ratingStyle', 'numeric')}
                                                />
                                                数字選択 (1〜5)
                                            </label>
                                        </div>
                                        <div className={styles.previewBox}>
                                            <span className={styles.previewLabel}>プレビュー:</span>
                                            {renderRatingPreview(q.ratingStyle)}
                                        </div>
                                    </div>
                                )}

                                {(q.type === 'single' || q.type === 'multiple') && q.options && (
                                    <div className={styles.optionsArea}>
                                        <label className={styles.label}>選択肢</label>
                                        {q.options.map((option, oIndex) => (
                                            <div key={oIndex} className={styles.optionRow}>
                                                <input
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => handleOptionChange(i, oIndex, e.target.value)}
                                                    className={styles.input}
                                                    placeholder={`選択肢 ${oIndex + 1}`}
                                                />
                                                <button
                                                    onClick={() => removeOption(i, oIndex)}
                                                    className={styles.removeOptionBtn}
                                                    disabled={q.options?.length === 1}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        <Button size="small" variant="outline" onClick={() => addOption(i)}>
                                            選択肢を追加
                                        </Button>
                                    </div>
                                )}

                                <label className={styles.checkbox}>
                                    <input
                                        type="checkbox"
                                        checked={q.required}
                                        onChange={(e) => updateQuestion(i, 'required', e.target.checked)}
                                    />
                                    必須回答
                                </label>
                            </div>
                        ))}

                        <div className={styles.addButtons}>
                            <Button size="small" onClick={() => addQuestion('text')}>
                                テキスト質問を追加
                            </Button>
                            <Button size="small" onClick={() => addQuestion('single')}>
                                単一選択を追加
                            </Button>
                            <Button size="small" onClick={() => addQuestion('multiple')}>
                                複数選択を追加
                            </Button>
                            <Button size="small" onClick={() => addQuestion('rating')}>
                                評価を追加
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default SurveyCreatePage;
