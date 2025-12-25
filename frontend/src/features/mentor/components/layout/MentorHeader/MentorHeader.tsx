// @see specs/features/mentor.md
// MentorHeader for mentor layout - displays mentor profile info

import { useAuth } from '@/lib';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import styles from './MentorHeader.module.css';

interface MentorHeaderProps {
    onMenuClick: () => void;
}

const MentorHeader = ({ onMenuClick }: MentorHeaderProps) => {
    const { profile } = useAuth();

    const displayName = profile?.display_name ?? 'メンター';
    const avatarUrl = profile?.avatar_url;
    const gender = profile?.gender;

    // Generate display name from gender (おにいさん/おねえさん)
    const genderDisplayName = gender === 'male' ? 'おにいさん' : 'おねえさん';

    return (
        <header className={styles.header}>
            <button
                className={styles.menuButton}
                onClick={onMenuClick}
                aria-label="メニューを開く"
            >
                <FaBars />
            </button>
            <span className={styles.modeLabel}>メンターモード</span>

            <div className={styles.spacer} />

            <div className={styles.profile}>
                <div className={styles.avatar}>
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={displayName} />
                    ) : (
                        <span className={styles.avatarInitial}>
                            {displayName.charAt(0)}
                        </span>
                    )}
                </div>
                <div className={styles.profileInfo}>
                    <span className={styles.profileName}>{displayName}</span>
                    <span className={styles.profileRole}>{genderDisplayName}</span>
                </div>
                <button
                    className={styles.logoutButton}
                    aria-label="ログアウト"
                    title="ログアウト"
                >
                    <FaSignOutAlt />
                </button>
            </div>
        </header>
    );
};

export default MentorHeader;
