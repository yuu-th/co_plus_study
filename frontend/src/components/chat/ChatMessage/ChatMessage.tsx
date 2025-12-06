// @see specs/features/chat.md
// ChatMessage - チャットメッセージ表示

import { FaUser } from 'react-icons/fa';
import type { Message } from '../../../types';
import styles from './ChatMessage.module.css';

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
}

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
};

const ChatMessage = ({ message, isOwn }: ChatMessageProps) => {
  const containerClass = `${styles.container} ${isOwn ? styles.ownContainer : styles.otherContainer}`;
  const messageClass = isOwn ? styles.ownMessage : styles.otherMessage;

  return (
    <div className={containerClass} aria-label={`メッセージ ${message.senderName}`}>
      {/* アバター（相手側は左、自分側は右） */}
      {!isOwn && (
        <div className={styles.avatarWrapper}>
          {message.senderAvatarUrl ? (
            <img
              src={message.senderAvatarUrl}
              alt={message.senderName}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <FaUser />
            </div>
          )}
        </div>
      )}

      <div className={styles.messageGroup}>
        <div className={styles.meta}>
          <span className={styles.senderName}>{message.senderName}</span>
          <span className={styles.timestamp}>{formatTime(message.timestamp)}</span>
        </div>
        <div className={messageClass}>
          {message.content}
        </div>
      </div>

      {isOwn && (
        <div className={styles.avatarWrapper}>
          {message.senderAvatarUrl ? (
            <img
              src={message.senderAvatarUrl}
              alt="あなた"
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <FaUser />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
