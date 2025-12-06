// ChatPage - メンター専用チャットページ
// @see specs/features/chat.md

import { useState, useMemo } from 'react';
import type { Message } from '@/shared/types';
import { mockMessages } from '@/shared/mockData/chats';
import { mockStudents } from '../../mockData/mentors';
import MentorChatHeader from '../../components/chat/MentorChatHeader';
import MessageList from '../../components/chat/MessageList';
import ChatInput from '../../components/chat/ChatInput';
import styles from './ChatPage.module.css';

// studentId別のメッセージをシミュレート
const mockStudentMessages: Record<string, Message[]> = {
    'student-1': mockMessages,
    'student-2': [
        {
            id: 'msg-s2-1',
            senderId: 'student-2',
            senderName: '佐藤 花子',
            senderRole: 'student',
            content: '英語の勉強方法について相談したいです。',
            timestamp: '2025-11-24T14:00:00Z',
            isRead: true,
        },
        {
            id: 'msg-s2-2',
            senderId: 'mentor-1',
            senderName: '高専 花子',
            senderRole: 'mentor',
            content: '英語の勉強方法ですね。どんなことで困っていますか？',
            timestamp: '2025-11-24T14:10:00Z',
            isRead: true,
        },
    ],
    'student-3': [
        {
            id: 'msg-s3-1',
            senderId: 'student-3',
            senderName: '高橋 健太',
            senderRole: 'student',
            content: 'プログラミングに興味があります！',
            timestamp: '2025-11-25T09:00:00Z',
            isRead: false,
        },
    ],
    'student-4': [],
};

const ChatPage = () => {
    const [selectedStudentId, setSelectedStudentId] = useState(mockStudents[0]?.id ?? '');
    const [studentMessages, setStudentMessages] = useState<Record<string, Message[]>>(mockStudentMessages);

    const currentStudent = useMemo(
        () => mockStudents.find((s) => s.id === selectedStudentId) ?? null,
        [selectedStudentId]
    );

    const messages = studentMessages[selectedStudentId] ?? [];

    const handleSelectStudent = (studentId: string) => {
        setSelectedStudentId(studentId);
    };

    const handleSend = (msg: Message) => {
        setStudentMessages((prev) => ({
            ...prev,
            [selectedStudentId]: [...(prev[selectedStudentId] ?? []), msg],
        }));
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>相談チャット</h1>
            <MentorChatHeader
                currentStudent={currentStudent}
                students={mockStudents}
                onSelectStudent={handleSelectStudent}
            />
            <MessageList messages={messages} currentUserId="mentor-1" />
            <ChatInput onSend={handleSend} studentName={currentStudent?.name} />
        </div>
    );
};

export default ChatPage;
