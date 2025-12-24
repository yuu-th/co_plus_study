// NotificationEditor - お知らせ作成フォーム
// @see specs/features/notification.md

import { useState, useEffect } from 'react';
import NotificationCard from '@/shared/components/NotificationCard';
import type { Notification, NotificationCategory, NotificationPriority } from '@/shared/types';
import type { NotificationDraft } from '../../../types';
import styles from './NotificationEditor.module.css';

interface NotificationEditorProps {
    onSubmit: (draft: NotificationDraft) => void;
    initialData?: NotificationDraft;
    mode?: 'create' | 'edit';
    isSubmitting?: boolean;
}

const CATEGORIES: NotificationCategory[] = ['info', 'event', 'important'];
const CATEGORY_LABELS: Record<NotificationCategory, string> = {
    info: 'お知らせ',
    event: 'イベント',
    important: '重要',
};

const PRIORITIES: NotificationPriority[] = ['low', 'medium', 'high'];
const PRIORITY_LABELS: Record<NotificationPriority, string> = {
    low: '低',
    medium: '中',
    high: '高',
};

const MAX_TITLE = 50;
const MAX_CONTENT = 500;

import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';

const NotificationEditor = ({ onSubmit, initialData, mode = 'create', isSubmitting = false }: NotificationEditorProps) => {
    const [draft, setDraft] = useState<NotificationDraft>({
        category: 'info',
        title: '',
        content: '',
        priority: 'medium',
    });
    const [isPreview, setIsPreview] = useState(false);

    // 編集モードの場合、初期データを設定
    useEffect(() => {
        if (initialData) {
            setDraft(initialData);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDraft(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(draft);
        if (mode === 'create') {
            setDraft({ category: 'info', title: '', content: '', priority: 'medium' });
        }
    };

    const isSubmitDisabled = !draft.title.trim() || !draft.content.trim() || isSubmitting;

    // Preview notification
    const previewNotification: Notification = {
        id: 'preview',
        category: draft.category,
        title: draft.title,
        content: draft.content,
        createdAt: new Date().toISOString(),
        isRead: false,
        priority: draft.priority,
    };

    return (
        <div className={styles.editorContainer}>
            <div className={styles.headerActions}>
                <Button
                    variant="outline"
                    onClick={() => setIsPreview(!isPreview)}
                    className={styles.previewToggle}
                >
                    {isPreview ? '編集に戻る' : 'プレビュー'}
                </Button>
            </div>

            {isPreview ? (
                <div className={styles.previewSection}>
                    <h3 className={styles.sectionTitle}>配信イメージ</h3>
                    <div className={styles.previewWrapper}>
                        <NotificationCard
                            notification={previewNotification}
                            onOpen={() => { }}
                        />
                    </div>
                </div>
            ) : (
                <Card>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formGrid}>
                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="category">カテゴリ *</label>
                                <select
                                    id="category"
                                    name="category"
                                    className={styles.select}
                                    value={draft.category}
                                    onChange={handleChange}
                                    required
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>
                                            {CATEGORY_LABELS[cat]}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="priority">優先度 *</label>
                                <select
                                    id="priority"
                                    name="priority"
                                    className={styles.select}
                                    value={draft.priority || 'medium'}
                                    onChange={handleChange}
                                    required
                                >
                                    {PRIORITIES.map(pri => (
                                        <option key={pri} value={pri}>
                                            {PRIORITY_LABELS[pri]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="title">タイトル *</label>
                            <input
                                id="title"
                                type="text"
                                name="title"
                                className={styles.input}
                                value={draft.title}
                                onChange={handleChange}
                                maxLength={MAX_TITLE}
                                placeholder="例：【重要】来週の面談日程について"
                                required
                            />
                            <div className={styles.fieldFooter}>
                                <span className={styles.counter}>
                                    {draft.title.length} / {MAX_TITLE}
                                </span>
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="content">本文 *</label>
                            <textarea
                                id="content"
                                name="content"
                                className={styles.textarea}
                                value={draft.content}
                                onChange={handleChange}
                                maxLength={MAX_CONTENT}
                                rows={8}
                                placeholder="お知らせの内容を詳しく入力してください..."
                                required
                            />
                            <div className={styles.fieldFooter}>
                                <span className={styles.counter}>
                                    {draft.content.length} / {MAX_CONTENT}
                                </span>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isSubmitDisabled}
                                className={styles.submitButton}
                            >
                                {isSubmitting ? '送信中...' : mode === 'edit' ? '更新する' : 'この内容で配信する'}
                            </Button>
                        </div>
                    </form>
                </Card>
            )}
        </div>
    );
};

export default NotificationEditor;
