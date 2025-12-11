// ChatPage - 相談チャットページ
import { useState, useMemo } from 'react';
import type { Message, User, MessageReaction as MessageReactionType } from '@/shared/types';
import { mockMessages } from '@/shared/mockData/chats';
import { mockMentor } from '@/shared/mockData/users';
import ChatHeader from '../../components/chat/ChatHeader';
import ChatInput from '../../components/chat/ChatInput';
import MessageList from '../../components/chat/MessageList';
import styles from './ChatPage.module.css';

const ChatPage = () => {
    const [messages, setMessages] = useState<Message[]>(mockMessages);
    const currentUserId = '1';

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

    const handleReactionToggle = (messageId: string, emoji: string) => {
        setMessages(prev => prev.map(msg => {
            if (msg.id !== messageId) return msg;

            const reactions = msg.reactions || [];
            const existingReaction = reactions.find(r => r.emoji === emoji);
            let newReactions: MessageReactionType[];

            if (existingReaction) {
                // 既にリアクションがある場合
                if (existingReaction.userIds.includes(currentUserId)) {
                    // 自分のリアクションを削除
                    const newUserIds = existingReaction.userIds.filter(id => id !== currentUserId);
                    if (newUserIds.length === 0) {
                        // 誰もリアクションしていなければ削除
                        newReactions = reactions.filter(r => r.emoji !== emoji);
                    } else {
                        newReactions = reactions.map(r =>
                            r.emoji === emoji ? { ...r, userIds: newUserIds } : r
                        );
                    }
                } else {
                    // 自分を追加
                    newReactions = reactions.map(r =>
                        r.emoji === emoji ? { ...r, userIds: [...r.userIds, currentUserId] } : r
                    );
                }
            } else {
                // 新しいリアクションを追加
                newReactions = [...reactions, { emoji, userIds: [currentUserId] }];
            }

            return { ...msg, reactions: newReactions };
        }));
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>相談</h1>
            <ChatHeader mentorName={mentorDisplayName} studentName={studentName} />
            <MessageList
                messages={displayMessages}
                currentUserId={currentUserId}
                onReactionToggle={handleReactionToggle}
            />
            <ChatInput onSend={handleSend} />
        </div>
    );
};

export default ChatPage;
