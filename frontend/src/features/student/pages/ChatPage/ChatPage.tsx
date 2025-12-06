// ChatPage - 相談チャットページ
import { useState } from 'react';
import type { Message } from '@/shared/types';
import { mockMessages } from '@/shared/mockData/chats';
import ChatHeader from '../../components/chat/ChatHeader';
import ChatInput from '../../components/chat/ChatInput';
import MessageList from '../../components/chat/MessageList';
import styles from './ChatPage.module.css';

const ChatPage = () => {
    const [messages, setMessages] = useState<Message[]>(mockMessages);
    const mentorName = '高専 花子';
    const studentName = '田中太郎';

    const handleSend = (msg: Message) => {
        setMessages(prev => [...prev, msg]);
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>相談</h1>
            <ChatHeader mentorName={mentorName} studentName={studentName} />
            <MessageList messages={messages} />
            <ChatInput onSend={handleSend} />
        </div>
    );
};

export default ChatPage;
