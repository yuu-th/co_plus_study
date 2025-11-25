import type { Notification } from '../../../types';
import Modal from '../../common/Modal/Modal';
import styles from './NotificationModal.module.css';

interface NotificationModalProps {
  notification: Notification | null;
  onClose: () => void;
  onMarkRead: (id: string) => void;
}

const NotificationModal = ({ notification, onClose, onMarkRead }: NotificationModalProps) => {
  if (!notification) return null;
  const { id, title, message, createdAt, read, category } = notification;
  return (
    <Modal isOpen={!!notification} onClose={onClose} title={title} size="medium">
      <div className={styles.content}>
        <div className={styles.meta}>カテゴリ: {category} / 作成: {new Date(createdAt).toLocaleString('ja-JP')}</div>
        <p>{message}</p>
        <div className={styles.actions}>
          {!read && (
            <button type="button" onClick={() => onMarkRead(id)}>既読にする</button>
          )}
          <button type="button" onClick={onClose}>閉じる</button>
        </div>
      </div>
    </Modal>
  );
};

export default NotificationModal;