// ChatPage - 相談チャットページ
// @see specs/features/chat.md
import {
    convertChatRoomFromDB,
    convertMessageFromDB,
    useAddMessageReaction,
    useAuth,
    useChatRooms,
    useMessages,
    useRealtimeMessages,
    useRemoveMessageReaction,
    useSendMessage
} from '@/lib';
import type { Message } from '@/shared/types';
import { useMemo } from 'react';
import ChatHeader from '../../components/chat/ChatHeader';
import ChatInput from '../../components/chat/ChatInput';
import MentorSelectList from '../../components/chat/MentorSelectList';
import MessageList from '../../components/chat/MessageList';
import styles from './ChatPage.module.css';

const ChatPage = () => {
    const { user, profile } = useAuth();
    const currentUserId = user?.id ?? '';

    // チャットルームを取得
    const { data: chatRoomsData, isLoading: isLoadingRooms, refetch: refetchRooms } = useChatRooms(currentUserId);

    // 最初のチャットルームを使用（生徒は通常1つのルームを持つ）
    const chatRoom = useMemo(() => {
        if (!chatRoomsData || chatRoomsData.length === 0) return null;
        return convertChatRoomFromDB(chatRoomsData[0]);
    }, [chatRoomsData]);

    const roomId = chatRoom?.id ?? '';

    // メッセージを取得
    const { 
        data: messagesData, 
        isLoading: isLoadingMessages,
    } = useMessages(roomId);

    // リアルタイム更新を購読
    useRealtimeMessages(roomId);

    // Mutations
    const sendMessage = useSendMessage();
    const addReaction = useAddMessageReaction();
    const removeReaction = useRemoveMessageReaction();

    // DBデータをフロントエンド型に変換
    const messages = useMemo(() => {
        if (!messagesData?.pages) return [];
        return messagesData.pages.flatMap(page => 
            page.data.map(convertMessageFromDB)
        );
    }, [messagesData]);

    // メンター表示名の変換
    const mentorDisplayName = chatRoom?.mentorDisplayName ?? 'メンター';
    const studentName = profile?.display_name ?? 'あなた';

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

    const handleSend = async (msg: Message) => {
        if (!roomId || !user) return;

        try {
            await sendMessage.mutateAsync({
                room_id: roomId,
                sender_id: user.id,
                message_type: msg.type,
                content: msg.content || null,
                image_url: msg.imageUrl || null,
            });
        } catch (error) {
            console.error('メッセージ送信に失敗しました:', error);
        }
    };

    const handleReactionToggle = async (messageId: string, emoji: string) => {
        if (!user) return;

        const message = messages.find(m => m.id === messageId);
        const existingReaction = message?.reactions?.find(r => r.emoji === emoji);
        const hasUserReacted = existingReaction?.userIds.includes(currentUserId);

        try {
            if (hasUserReacted) {
                await removeReaction.mutateAsync({
                    messageId,
                    userId: currentUserId,
                    emoji,
                });
            } else {
                await addReaction.mutateAsync({
                    message_id: messageId,
                    user_id: currentUserId,
                    emoji,
                });
            }
        } catch (error) {
            console.error('リアクションの更新に失敗しました:', error);
        }
    };

    const handleDelete = async (messageId: string) => {
        // TODO: メッセージ削除機能を実装
        console.log('メッセージ削除:', messageId);
    };

    if (isLoadingRooms) {
        return (
            <div className={styles.page}>
                <h1 className={styles.title}>相談</h1>
                <div className={styles.loading}>読み込み中...</div>
            </div>
        );
    }

    if (!chatRoom) {
        return (
            <div className={styles.page}>
                <h1 className={styles.title}>相談</h1>
                <MentorSelectList onChatRoomCreated={() => refetchRooms()} />
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>相談</h1>
            <ChatHeader mentorName={mentorDisplayName} studentName={studentName} />
            {isLoadingMessages ? (
                <div className={styles.loading}>メッセージを読み込み中...</div>
            ) : (
                <MessageList
                    messages={displayMessages}
                    currentUserId={currentUserId}
                    onReactionToggle={handleReactionToggle}
                    onDelete={handleDelete}
                />
            )}
            <ChatInput onSend={handleSend} />
        </div>
    );
};

export default ChatPage;
