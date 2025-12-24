import { useState, useRef } from 'react';
import { FaCamera } from 'react-icons/fa';
import type { Message } from '@/shared/types';
import { useAuth } from '@/lib';
import styles from './ChatInput.module.css';

interface ChatInputProps {
    onSend: (message: Message) => void | Promise<void>;
}

const ChatInput = ({ onSend }: ChatInputProps) => {
    const { user, profile } = useAuth();
    const [text, setText] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const maxLen = 300;

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
        // Reset input value to allow selecting the same file again
        if (e.target) {
            e.target.value = '';
        }
    };

    const handleSubmit = async () => {
        const content = text.trim();
        if ((!content && !selectedImage) || !user || isSending) return;

        setIsSending(true);
        const now = new Date();
        
        try {
            await onSend({
                id: `msg-${now.getTime()}`,
                senderId: user.id,
                senderName: profile?.display_name ?? 'ユーザー',
                senderRole: 'student',
                content,
                imageUrl: selectedImage || undefined,
                type: selectedImage ? 'image' : 'text',
                timestamp: now.toISOString(),
                isRead: false,
            });
            setText('');
            setSelectedImage(null);
        } catch (error) {
            console.error('送信に失敗しました:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className={styles.inputBar}>
            {selectedImage && (
                <div className={styles.imagePreview}>
                    <img src={selectedImage} alt="プレビュー" />
                    <button
                        onClick={() => setSelectedImage(null)}
                        className={styles.removeBtn}
                        aria-label="画像を削除"
                    >
                        ✕
                    </button>
                </div>
            )}
            <div className={styles.inputRow}>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                    data-testid="file-input"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={styles.imageBtn}
                    aria-label="画像を選択"
                >
                    <FaCamera />
                </button>
                <textarea
                    className={styles.text}
                    value={text}
                    onChange={e => setText(e.target.value.slice(0, maxLen))}
                    onKeyDown={handleKeyDown}
                    placeholder="相談内容を入力 (Enterで送信 / Shift+Enterで改行)"
                    aria-label="相談テキスト"
                />
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSending || (!text.trim() && !selectedImage)}
                    className={styles.sendBtn}
                >
                    {isSending ? '送信中...' : '送信'}
                </button>
            </div>
        </div>
    );
};

export default ChatInput;
