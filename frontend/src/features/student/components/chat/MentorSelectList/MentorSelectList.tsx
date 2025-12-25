// MentorSelectList - メンター選択リストコンポーネント
// @see specs/features/chat.md

import { useActiveMentors, useAuth, useGetOrCreateChatRoom } from '@/lib';
import { useState } from 'react';
import MentorSelectCard from '../MentorSelectCard/MentorSelectCard';
import styles from './MentorSelectList.module.css';

interface MentorSelectListProps {
    onChatRoomCreated?: () => void;
}

const MentorSelectList = ({ onChatRoomCreated }: MentorSelectListProps) => {
    const { user } = useAuth();
    const { data: mentors, isLoading, error } = useActiveMentors();
    const getOrCreateChatRoom = useGetOrCreateChatRoom();
    const [selectingMentorId, setSelectingMentorId] = useState<string | null>(null);

    const handleSelectMentor = async (mentorId: string) => {
        if (!user) return;

        setSelectingMentorId(mentorId);

        try {
            await getOrCreateChatRoom.mutateAsync({
                studentId: user.id,
                mentorId: mentorId,
            });
            onChatRoomCreated?.();
        } catch (err) {
            console.error('チャットルーム作成に失敗しました:', err);
            alert('チャットルームの作成に失敗しました。もう一度お試しください。');
        } finally {
            setSelectingMentorId(null);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>メンターを読み込み中...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    メンターの読み込みに失敗しました。
                    <button onClick={() => window.location.reload()}>再読み込み</button>
                </div>
            </div>
        );
    }

    if (!mentors || mentors.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.empty}>
                    <p>現在利用可能なメンターがいません。</p>
                    <p>しばらくしてからもう一度お試しください。</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>相談するメンターを選んでね</h2>
                <p className={styles.description}>
                    困っていることや相談したいことがあれば、メンターに相談できます。
                </p>
            </div>
            <div className={styles.list}>
                {mentors.map((mentor) => (
                    <MentorSelectCard
                        key={mentor.id}
                        mentor={{
                            id: mentor.id,
                            displayName: mentor.display_name,
                            avatarUrl: mentor.avatar_url,
                            gender: mentor.gender,
                            introduction: mentor.introduction,
                            specialties: mentor.specialties,
                        }}
                        onSelect={handleSelectMentor}
                        isSelecting={selectingMentorId === mentor.id}
                    />
                ))}
            </div>
        </div>
    );
};

export default MentorSelectList;
