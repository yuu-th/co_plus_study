import type { Message } from '../../../types';
import styles from './ChatMessage.module.css';

interface ChatMessageProps { message: Message; }

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString('ja-JP',{ hour:'2-digit', minute:'2-digit' });
};

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div className={`${styles.msg} ${message.senderRole === 'student' ? styles.student : styles.mentor}`}
      aria-label={`メッセージ ${message.senderName}`}
    >
      <div className={styles.name}>{message.senderName}</div>
      <div>{message.content}</div>
      <div className={styles.time}>{formatTime(message.timestamp)}</div>
    </div>
  );
};

export default ChatMessage;
