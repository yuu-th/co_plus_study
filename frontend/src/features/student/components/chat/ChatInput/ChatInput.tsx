import { useState } from 'react';
import type { Message } from '@/shared/types';
import styles from './ChatInput.module.css';

interface ChatInputProps {
    onSend: (message: Message) => void;
}

const ChatInput = ({ onSend }: ChatInputProps) => {
    const [text, setText] = useState('');
    const maxLen = 300;

    const handleSubmit = () => {
        const content = text.trim();
        if (!content) return;
        const now = new Date();
        onSend({
            id: `msg-${now.getTime()}`,
            senderId: '1',
            senderName: '田中太郎',
            senderRole: 'student',
            content,
            timestamp: now.toISOString(),
            isRead: false,
        });
        setText('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className={styles.inputBar}>
            <textarea
                className={styles.text}
                value={text}
                onChange={e => setText(e.target.value.slice(0, maxLen))}
                onKeyDown={handleKeyDown}
                placeholder="相談内容を入力 (Enterで送信 / Shift+Enterで改行)"
                aria-label="相談テキスト"
            />
            <button type="button" onClick={handleSubmit} disabled={!text.trim()} className={styles.sendBtn}>送信</button>
        </div>
    );
};

export default ChatInput;
