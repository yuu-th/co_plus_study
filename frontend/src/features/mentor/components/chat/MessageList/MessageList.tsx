import type { Message } from '@/shared/types';
import ChatMessage from '../ChatMessage';
import styles from './MessageList.module.css';

interface MessageListProps {
    messages: Message[];
    currentUserId?: string;
    onReactionToggle?: (messageId: string, emoji: string) => void;
}

const MessageList = ({ messages, currentUserId = 'mentor-1', onReactionToggle }: MessageListProps) => {
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
                    currentUserId={currentUserId}
                    onReactionToggle={onReactionToggle}
                />
            ))}
        </div>
    );
};

export default MessageList;
