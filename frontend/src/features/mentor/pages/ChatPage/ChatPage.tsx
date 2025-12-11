// ChatPage - メンター専用チャットページ
// @see specs/features/chat.md

import { useState, useMemo } from 'react';
import type { Message } from '@/shared/types';
import { mockMessages } from '@/shared/mockData/chats';
import { mockStudents } from '../../mockData/mentors';
import StudentChatSwitcher from '../../components/StudentChatSwitcher';
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
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(mockStudents[0]?.id ?? null);
    const [studentMessages, setStudentMessages] = useState<Record<string, Message[]>>(mockStudentMessages);

    // 担当生徒とチャット情報
    const studentChats = useMemo(() => {
        return mockStudents.map((student) => {
            const msgs = studentMessages[student.id] ?? [];
            const lastMsg = msgs[msgs.length - 1];
            // 未読数は簡易的にランダム（本来はMessageのisReadを集計）
            // タスク仕様に合わせてランダムを使用しつつ、既存ロジックも尊重
            return {
                student: {
                    ...student,
                    role: 'student' as const, // StudentSummary -> User conversion partial
                    email: '', // dummy
                },
                unreadCount: Math.floor(Math.random() * 5),
                lastMessageTime: lastMsg?.timestamp ?? new Date().toISOString(),
            };
        });
    }, [studentMessages]);

    const currentStudent = useMemo(
        () => mockStudents.find((s) => s.id === selectedStudentId) ?? null,
        [selectedStudentId]
    );

    const messages = selectedStudentId ? (studentMessages[selectedStudentId] ?? []) : [];

    const handleSelectStudent = (studentId: string) => {
        setSelectedStudentId(studentId);
    };

    const handleSend = (msg: Message) => {
        if (!selectedStudentId) return;
        setStudentMessages((prev) => ({
            ...prev,
            [selectedStudentId]: [...(prev[selectedStudentId] ?? []), msg],
        }));
    };

    return (
        <div className={styles.page}>
            <div className={styles.sidebar}>
                <StudentChatSwitcher
                    students={studentChats}
                    selectedStudentId={selectedStudentId}
                    onSelectStudent={handleSelectStudent}
                />
            </div>
            <div className={styles.chatArea}>
                {selectedStudentId && currentStudent ? (
                    <>
                        <div className={styles.chatHeader}>
                            <h2 className={styles.studentName}>{currentStudent.name}</h2>
                            <span className={styles.status}>オンライン</span>
                        </div>
                        <div className={styles.messageContainer}>
                            <MessageList messages={messages} currentUserId="mentor-1" />
                        </div>
                        <ChatInput onSend={handleSend} studentName={currentStudent.name} />
                    </>
                ) : (
                    <div className={styles.placeholder}>
                        左側から生徒を選択してください
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
