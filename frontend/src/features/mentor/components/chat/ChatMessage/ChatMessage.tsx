import { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import type { Message } from '@/shared/types';
import MessageReaction from '@/shared/components/chat/MessageReaction';
import ReactionPicker from '@/shared/components/chat/ReactionPicker';
import styles from './ChatMessage.module.css';

interface ChatMessageProps {
    message: Message;
    isOwn: boolean;
    currentUserId?: string;
    onReactionToggle?: (messageId: string, emoji: string) => void;
}

const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
};

const ChatMessage = ({ message, isOwn, currentUserId, onReactionToggle }: ChatMessageProps) => {
    const [showImageModal, setShowImageModal] = useState(false);
    const [showPicker, setShowPicker] = useState(false);

    const containerClass = `${styles.container} ${isOwn ? styles.ownContainer : styles.otherContainer}`;
    const messageClass = isOwn ? styles.ownMessage : styles.otherMessage;

    const handleReactionSelect = (emoji: string) => {
        if (onReactionToggle) {
            onReactionToggle(message.id, emoji);
        }
    };

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
                    {message.imageUrl && (
                        <img
                            src={message.imageUrl}
                            alt="送信画像"
                            className={styles.messageImage}
                            onClick={() => setShowImageModal(true)}
                        />
                    )}
                    {message.content && <p>{message.content}</p>}
                </div>

                {/* リアクション追加ボタン */}
                {onReactionToggle && (
                    <button
                        className={styles.addReactionBtn}
                        onClick={() => setShowPicker(true)}
                        aria-label="リアクションを追加"
                    >
                        ➕
                    </button>
                )}

                {/* リアクション一覧 */}
                {message.reactions && message.reactions.length > 0 && (
                    <MessageReaction
                        reactions={message.reactions}
                        currentUserId={currentUserId}
                        onToggle={handleReactionSelect}
                    />
                )}

                {/* リアクションピッカー */}
                {showPicker && (
                    <div style={{ position: 'relative', zIndex: 100 }}>
                        <ReactionPicker
                            onSelect={handleReactionSelect}
                            onClose={() => setShowPicker(false)}
                        />
                    </div>
                )}
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

            {showImageModal && message.imageUrl && (
                <div className={styles.imageModal} onClick={() => setShowImageModal(false)}>
                    <img src={message.imageUrl} alt="拡大画像" />
                </div>
            )}
        </div>
    );
};

export default ChatMessage;
