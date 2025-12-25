// MentorSelectCard - メンター選択カードコンポーネント
// @see specs/features/chat.md

import styles from './MentorSelectCard.module.css';

interface MentorInfo {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    gender: string | null;
    introduction: string | null;
    specialties: string[];
}

interface MentorSelectCardProps {
    mentor: MentorInfo;
    onSelect: (mentorId: string) => void;
    isSelecting?: boolean;
}

const MentorSelectCard = ({ mentor, onSelect, isSelecting }: MentorSelectCardProps) => {
    const genderLabel = mentor.gender === 'male' ? 'おにいさん' : mentor.gender === 'female' ? 'おねえさん' : 'メンター';

    return (
        <div className={styles.card}>
            <div className={styles.avatar}>
                {mentor.avatarUrl ? (
                    <img src={mentor.avatarUrl} alt={mentor.displayName} />
                ) : (
                    <span className={styles.avatarInitial}>
                        {mentor.displayName.charAt(0)}
                    </span>
                )}
            </div>
            <div className={styles.info}>
                <div className={styles.name}>
                    {mentor.displayName}
                    <span className={styles.genderLabel}>{genderLabel}</span>
                </div>
                {mentor.specialties.length > 0 && (
                    <div className={styles.specialties}>
                        {mentor.specialties.slice(0, 3).map((s) => (
                            <span key={s} className={styles.specialty}>{s}</span>
                        ))}
                    </div>
                )}
                {mentor.introduction && (
                    <p className={styles.introduction}>
                        {mentor.introduction.length > 60
                            ? `${mentor.introduction.slice(0, 60)}...`
                            : mentor.introduction}
                    </p>
                )}
            </div>
            <button
                className={styles.selectButton}
                onClick={() => onSelect(mentor.id)}
                disabled={isSelecting}
            >
                {isSelecting ? '接続中...' : '相談する'}
            </button>
        </div>
    );
};

export default MentorSelectCard;
