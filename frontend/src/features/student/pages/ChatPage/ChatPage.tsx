// ChatPage - 相談チャットページ
import { useState, useMemo } from 'react';
import type { Message, User } from '@/shared/types';
import { mockMessages } from '@/shared/mockData/chats';
import { mockMentor } from '@/shared/mockData/users';
import ChatHeader from '../../components/chat/ChatHeader';
import ChatInput from '../../components/chat/ChatInput';
import MessageList from '../../components/chat/MessageList';
import styles from './ChatPage.module.css';

const ChatPage = () => {
    const [messages, setMessages] = useState<Message[]>(mockMessages);

    // メンター情報取得(モック)
    const mentor: User = mockMentor;
    const studentName = '田中太郎';

    // メンター表示名の変換
    const mentorDisplayName = useMemo(() => {
        if (mentor.role !== 'mentor') return mentor.name;
        return mentor.gender === 'female' ? 'おねえさん' : 'おにいさん';
    }, [mentor]);

    // メッセージ内のメンター名を表示名に変換
    const displayMessages = useMemo(() => {
        return messages.map(msg => {
            if (msg.senderRole === 'mentor') {
                return {
                    ...msg,
                    senderName: mentorDisplayName,
                };
            }
            return msg;
        });
    }, [messages, mentorDisplayName]);

    const handleSend = (msg: Message) => {
        setMessages(prev => [...prev, msg]);
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>相談</h1>
            <ChatHeader mentorName={mentorDisplayName} studentName={studentName} />
            <MessageList messages={displayMessages} />
            <ChatInput onSend={handleSend} />
        </div>
    );
};

export default ChatPage;
