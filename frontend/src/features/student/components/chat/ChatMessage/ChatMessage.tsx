import { useState } from 'react';
import type { Message } from '@/shared/types';
import MessageReaction from '@/shared/components/chat/MessageReaction';
import ReactionPicker from '@/shared/components/chat/ReactionPicker';
import styles from './ChatMessage.module.css';

interface ChatMessageProps {
    message: Message;
    isOwn: boolean;
    currentUserId?: string;
    onReactionToggle?: (messageId: string, emoji: string) => void;
    onDelete?: (messageId: string) => void;
}

const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
};

const ChatMessage = ({ message, isOwn, currentUserId, onReactionToggle, onDelete }: ChatMessageProps) => {
    const [showImageModal, setShowImageModal] = useState(false);
    const [showPicker, setShowPicker] = useState(false);

    const containerClass = `${styles.container} ${isOwn ? styles.ownContainer : styles.otherContainer}`;
    const messageClass = isOwn ? styles.ownMessage : styles.otherMessage;

    const handleReactionSelect = (emoji: string) => {
        if (onReactionToggle) {
            onReactionToggle(message.id, emoji);
        }
    };

    const handleDelete = () => {
        if (window.confirm('このメッセージを削除してもよろしいですか？')) {
            onDelete?.(message.id);
        }
    };

    return (
        <div className={containerClass} aria-label={`メッセージ ${message.senderName}`}>
            {/* アバター（DOM先頭に配置: row-reverseで自分側は右、相手側は左に表示される） */}
            <div className={styles.avatarWrapper}>
                {message.senderAvatarUrl ? (
                    <img
                        src={message.senderAvatarUrl}
                        alt={isOwn ? 'あなた' : message.senderName}
                        className={styles.avatar}
                    />
                ) : (
                    <div className={styles.avatarPlaceholder}>
                        {message.senderName.charAt(0)}
                    </div>
                )}
            </div>

            <div className={styles.messageContentWrapper}>
                <div className={styles.messageGroup}>
                    <div className={styles.meta}>
                        <span className={styles.senderName}>{message.senderName}</span>
                        <span className={styles.timestamp}>{formatTime(message.timestamp)}</span>
                        {isOwn && onDelete && (
                            <button
                                onClick={handleDelete}
                                className={styles.deleteButton}
                                aria-label="メッセージを削除"
                            >
                                ×
                            </button>
                        )}
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

                    {/* リアクション行（吹き出しの直下）: 絵文字と➕ボタン */}
                    <div className={styles.reactionsRow}>
                        {message.reactions && message.reactions.length > 0 && (
                            <MessageReaction
                                reactions={message.reactions}
                                currentUserId={currentUserId}
                                onToggle={handleReactionSelect}
                            />
                        )}
                        {onReactionToggle && (
                            <div className={styles.addReactionWrapper}>
                                <button
                                    className={styles.addReactionBtn}
                                    onClick={() => setShowPicker(true)}
                                    aria-label="リアクションを追加"
                                >
                                    ➕
                                </button>
                                {/* リアクションピッカー: ボタンの直上に浮かせる */}
                                {showPicker && (
                                    <ReactionPicker
                                        onSelect={handleReactionSelect}
                                        onClose={() => setShowPicker(false)}
                                        className={`${styles.pickerWrapper} ${isOwn ? styles.ownPicker : styles.otherPicker}`}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showImageModal && message.imageUrl && (
                <div className={styles.imageModal} onClick={() => setShowImageModal(false)}>
                    <img src={message.imageUrl} alt="拡大画像" />
                </div>
            )}
        </div>
    );
};

export default ChatMessage;
