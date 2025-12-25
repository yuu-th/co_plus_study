import type { Message } from '@/shared/types';
import { useRef, useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import styles from './ChatInput.module.css';

interface ChatInputProps {
    onSend: (message: Message) => void;
    studentName?: string;
    isSubmitting?: boolean;
}

const ChatInput = ({ onSend, studentName = '', isSubmitting = false }: ChatInputProps) => {
    const [text, setText] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
        if (e.target) {
            e.target.value = '';
        }
    };

    const handleSubmit = () => {
        const content = text.trim();
        if (!content && !selectedImage) return;

        const now = new Date();
        onSend({
            id: `msg-${now.getTime()}`,
            senderId: 'mentor-1',
            senderName: '高専 花子',
            senderRole: 'mentor',
            content,
            imageUrl: selectedImage || undefined,
            type: selectedImage ? 'image' : 'text',
            timestamp: now.toISOString(),
            isRead: false,
        });
        setText('');
        setSelectedImage(null);
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
                    placeholder={studentName ? `${studentName}さんへのメッセージを入力` : '回答を入力 (Enterで送信 / Shift+Enterで改行)'}
                    aria-label="回答テキスト"
                />
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || (!text.trim() && !selectedImage)}
                    className={styles.sendBtn}
                >
                    {isSubmitting ? '送信中...' : '送信'}
                </button>
            </div>
        </div>
    );
};

export default ChatInput;
