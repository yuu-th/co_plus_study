// ChatPage - メンター専用チャットページ
// @see specs/features/chat.md

import { useState, useMemo, useCallback } from 'react';
import type { Message } from '@/shared/types';
import { 
    useAuth, 
    useChatRooms, 
    useMessages, 
    useRealtimeMessages,
    useSendMessage,
    useAddMessageReaction,
    useRemoveMessageReaction,
    convertMessageFromDB
} from '@/lib';
import StudentChatSwitcher from '../../components/StudentChatSwitcher';
import MessageList from '../../components/chat/MessageList';
import ChatInput from '../../components/chat/ChatInput';
import styles from './ChatPage.module.css';

const ChatPage = () => {
    const { user } = useAuth();
    const currentUserId = user?.id ?? '';

    // メンターのチャットルームを取得
    const { data: chatRoomsData, isLoading: isLoadingRooms } = useChatRooms(currentUserId);

    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

    // チャットルームと生徒情報を整形
    const studentChats = useMemo(() => {
        if (!chatRoomsData) return [];
        return chatRoomsData.map(room => {
            // roomには student情報が含まれていると仮定
            const student = (room as unknown as { student: { id: string; display_name: string; avatar_url?: string } }).student;
            return {
                roomId: room.id,
                student: {
                    id: student?.id ?? room.student_id,
                    displayName: student?.display_name ?? '生徒',
                    avatarUrl: student?.avatar_url,
                    role: 'student' as const,
                    email: '',
                    totalPosts: 0,
                    totalHours: 0,
                    lastActivity: room.created_at ?? new Date().toISOString(),
                },
                unreadCount: 0, // TODO: 未読カウント
                lastMessageTime: room.created_at ?? new Date().toISOString(),
            };
        });
    }, [chatRoomsData]);

    // 選択中のルームIDを初期化
    const effectiveRoomId = selectedRoomId ?? studentChats[0]?.roomId ?? '';

    // メッセージを取得
    const { data: messagesData, isLoading: isLoadingMessages } = useMessages(effectiveRoomId);

    // リアルタイム更新を購読
    useRealtimeMessages(effectiveRoomId);

    // Mutations
    const sendMessage = useSendMessage();
    const addReaction = useAddMessageReaction();
    const removeReaction = useRemoveMessageReaction();

    // メッセージをフロントエンド型に変換
    const messages: Message[] = useMemo(() => {
        if (!messagesData?.pages) return [];
        return messagesData.pages
            .flatMap(page => page.data)
            .map(convertMessageFromDB);
    }, [messagesData]);

    // 現在選択中の生徒
    const currentStudent = useMemo(() => {
        const chat = studentChats.find(c => c.roomId === effectiveRoomId);
        return chat?.student ?? null;
    }, [studentChats, effectiveRoomId]);

    const handleSelectStudent = useCallback((studentId: string) => {
        const chat = studentChats.find(c => c.student.id === studentId);
        if (chat) {
            setSelectedRoomId(chat.roomId);
        }
    }, [studentChats]);

    const handleSend = useCallback(async (msg: Message) => {
        if (!effectiveRoomId || !user) return;

        try {
            await sendMessage.mutateAsync({
                room_id: effectiveRoomId,
                sender_id: user.id,
                content: msg.content,
                message_type: msg.type === 'image' ? 'image' : 'text',
                image_url: msg.imageUrl,
            });
        } catch (error) {
            console.error('メッセージ送信に失敗しました:', error);
        }
    }, [effectiveRoomId, user, sendMessage]);

    const handleReactionToggle = useCallback(async (messageId: string, emoji: string) => {
        if (!user) return;

        const message = messages.find(m => m.id === messageId);
        if (!message) return;

        const existingReaction = message.reactions?.find(r => r.emoji === emoji);
        const hasReacted = existingReaction?.userIds.includes(user.id);

        try {
            if (hasReacted) {
                await removeReaction.mutateAsync({
                    messageId,
                    emoji,
                    userId: user.id,
                });
            } else {
                await addReaction.mutateAsync({
                    message_id: messageId,
                    emoji,
                    user_id: user.id,
                });
            }
        } catch (error) {
            console.error('リアクション操作に失敗しました:', error);
        }
    }, [user, messages, addReaction, removeReaction]);

    const handleDelete = useCallback((_messageId: string) => {
        // TODO: メッセージ削除機能（バックエンドに実装が必要）
        console.log('Delete message:', _messageId);
    }, []);

    const isLoading = isLoadingRooms;

    if (isLoading) {
        return (
            <div className={styles.page}>
                <div className={styles.loading}>読み込み中...</div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.sidebar}>
                <StudentChatSwitcher
                    students={studentChats}
                    selectedStudentId={currentStudent?.id ?? null}
                    onSelectStudent={handleSelectStudent}
                />
            </div>
            <div className={styles.chatArea}>
                {effectiveRoomId && currentStudent ? (
                    <>
                        <div className={styles.chatHeader}>
                            <h2 className={styles.studentName}>{currentStudent.displayName}</h2>
                            <span className={styles.status}>オンライン</span>
                        </div>
                        <div className={styles.messageContainer}>
                            {isLoadingMessages ? (
                                <div className={styles.loading}>メッセージを読み込み中...</div>
                            ) : (
                                <MessageList
                                    messages={messages}
                                    currentUserId={currentUserId}
                                    onReactionToggle={handleReactionToggle}
                                    onDelete={handleDelete}
                                />
                            )}
                        </div>
                        <ChatInput 
                            onSend={handleSend} 
                            studentName={currentStudent.displayName}
                            isSubmitting={sendMessage.isPending}
                        />
                    </>
                ) : (
                    <div className={styles.placeholder}>
                        {studentChats.length === 0 
                            ? '担当生徒がいません' 
                            : '左側から生徒を選択してください'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
