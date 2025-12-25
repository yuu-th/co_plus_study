// NotificationManagePage - お知らせ管理ページ（新規作成・編集対応）
// @see specs/features/notification.md

import { convertNotificationFromDB, useAuth, useCreateNotification, useNotifications, useUpdateNotification } from '@/lib';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NotificationEditor from '../../components/notifications/NotificationEditor';
import type { NotificationDraft } from '../../types';
import styles from './NotificationManagePage.module.css';

const NotificationManagePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isEditMode = !!id;

    const [initialData, setInitialData] = useState<NotificationDraft | undefined>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 通知一覧から編集対象を取得（編集モード時）
    const { data: notificationsData, isLoading } = useNotifications();
    const createMutation = useCreateNotification();
    const updateMutation = useUpdateNotification();

    // DBデータをフロントエンド型に変換
    const existingNotification = useMemo(() => {
        if (!isEditMode || !id || !notificationsData) return null;
        const found = notificationsData.find(n => n.id === id);
        return found ? convertNotificationFromDB(found) : null;
    }, [isEditMode, id, notificationsData]);

    // 編集モードの場合、既存データを読み込み
    useEffect(() => {
        if (existingNotification) {
            setInitialData({
                category: existingNotification.category,
                title: existingNotification.title,
                content: existingNotification.content,
                priority: existingNotification.priority,
            });
        }
    }, [existingNotification]);

    const handleSubmit = async (draft: NotificationDraft) => {
        if (!user) {
            alert('ログインが必要です');
            return;
        }

        setIsSubmitting(true);

        // priority のマッピング: medium -> normal (DB用)
        const priorityMap: Record<string, 'low' | 'normal' | 'high'> = {
            low: 'low',
            medium: 'normal',
            high: 'high',
        };
        const dbPriority = priorityMap[draft.priority ?? 'medium'] ?? 'normal';

        try {
            if (isEditMode && id) {
                await updateMutation.mutateAsync({
                    id,
                    category: draft.category,
                    title: draft.title,
                    content: draft.content,
                    priority: dbPriority,
                });
                alert('お知らせを更新しました');
            } else {
                await createMutation.mutateAsync({
                    category: draft.category,
                    title: draft.title,
                    content: draft.content,
                    priority: dbPriority,
                    created_by: user.id,
                });
                alert('お知らせを作成しました');
            }
            navigate('/mentor/notifications');
        } catch (error) {
            console.error('保存に失敗しました:', error);
            alert('保存に失敗しました');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading && isEditMode) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>読み込み中...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                {isEditMode ? 'お知らせ編集' : 'お知らせ作成'}
            </h1>

            <section className={styles.editorSection}>
                <NotificationEditor
                    onSubmit={handleSubmit}
                    initialData={initialData}
                    mode={isEditMode ? 'edit' : 'create'}
                    isSubmitting={isSubmitting}
                />
            </section>
        </div>
    );
};

export default NotificationManagePage;
