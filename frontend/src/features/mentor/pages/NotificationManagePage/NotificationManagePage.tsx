// NotificationManagePage - お知らせ管理ページ
// @see specs/features/notification.md

import NotificationEditor from '../../components/notifications/NotificationEditor';
import NotificationList from '@/shared/components/NotificationList';
import { useNotifications } from '@/shared/hooks/useNotifications';
import type { NotificationDraft } from '../../types';
import styles from './NotificationManagePage.module.css';

const NotificationManagePage = () => {
    const { notifications, addNotification } = useNotifications();

    const handleSubmit = (draft: NotificationDraft) => {
        console.log('New notification draft submitted:', draft);

        // The hook expects a different structure, so we adapt it here.
        // Spec says Notification has 'message', draft has 'content'.
        addNotification({
            title: draft.title,
            message: draft.content,
            category: draft.category,
        });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>お知らせ管理</h1>

            <section className={styles.editorSection}>
                <h2 className={styles.sectionTitle}>新規お知らせ作成</h2>
                <NotificationEditor onSubmit={handleSubmit} />
            </section>

            <section className={styles.listSection}>
                <h2 className={styles.sectionTitle}>配信済み一覧</h2>
                <NotificationList notifications={notifications} onOpen={() => { }} />
            </section>
        </div>
    );
};

export default NotificationManagePage;
