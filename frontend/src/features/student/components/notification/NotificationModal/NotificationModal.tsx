import Modal from '@/shared/components/Modal';
import type { Notification } from '@/shared/types';
import styles from './NotificationModal.module.css';

interface NotificationModalProps {
    notification: Notification | null;
    onClose: () => void;
    onMarkRead: (id: string) => void;
}

const NotificationModal = ({ notification, onClose, onMarkRead }: NotificationModalProps) => {
    if (!notification) return null;
    const { id, title, content, createdAt, isRead, category } = notification;
    return (
        <Modal isOpen={!!notification} onClose={onClose} title={title} size="medium">
            <div className={styles.content}>
                <div className={styles.meta}>カテゴリ: {category} / 作成: {new Date(createdAt).toLocaleString('ja-JP')}</div>
                <p>{content}</p>
                <div className={styles.actions}>
                    {!isRead && (
                        <button type="button" onClick={() => onMarkRead(id)}>既読にする</button>
                    )}
                    <button type="button" onClick={onClose}>閉じる</button>
                </div>
            </div>
        </Modal>
    );
};

export default NotificationModal;
