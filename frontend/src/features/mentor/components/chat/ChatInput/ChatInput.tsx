// @see specs/features/chat.md
// ChatInput - メンター用チャット入力

import { useState } from 'react';
import type { Message } from '@/shared/types';
import styles from './ChatInput.module.css';

interface ChatInputProps {
    onSend: (message: Message) => void;
    studentName?: string;
}

const ChatInput = ({ onSend, studentName = '' }: ChatInputProps) => {
    const [text, setText] = useState('');
    const maxLen = 300;

    const handleSubmit = () => {
        const content = text.trim();
        if (!content) return;
        const now = new Date();
        onSend({
            id: `msg-${now.getTime()}`,
            senderId: 'mentor-1',
            senderName: '高専 花子',
            senderRole: 'mentor',
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
                placeholder={studentName ? `${studentName}さんへのメッセージを入力` : '回答を入力 (Enterで送信 / Shift+Enterで改行)'}
                aria-label="回答テキスト"
            />
            <button type="button" onClick={handleSubmit} disabled={!text.trim()} className={styles.sendBtn}>送信</button>
        </div>
    );
};

export default ChatInput;
