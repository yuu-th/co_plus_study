import type { Message } from '../../../types';
import ChatMessage from '../ChatMessage/ChatMessage';
import styles from './MessageList.module.css';

interface MessageListProps { messages: Message[]; }

const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className={styles.list} aria-label="メッセージ一覧">
      {messages.length === 0 && <div className={styles.empty}>メッセージはまだありません</div>}
      {messages.map(m => <ChatMessage key={m.id} message={m} />)}
    </div>
  );
};

export default MessageList;
