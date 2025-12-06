// @see specs/features/chat.md
// MessageList - メッセージ一覧表示

import type { Message } from '@/shared/types';
import ChatMessage from '../ChatMessage';
import styles from './MessageList.module.css';

interface MessageListProps {
    messages: Message[];
    currentUserId?: string;
}

const MessageList = ({ messages, currentUserId = 'mentor-1' }: MessageListProps) => {
    return (
        <div className={styles.list} aria-label="メッセージ一覧">
            {messages.length === 0 && (
                <div className={styles.empty}>メッセージはまだありません</div>
            )}
            {messages.map((m) => (
                <ChatMessage
                    key={m.id}
                    message={m}
                    isOwn={m.senderId === currentUserId}
                />
            ))}
        </div>
    );
};

export default MessageList;
