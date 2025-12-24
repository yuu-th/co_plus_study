// MentorSidebarコンポーネント
// @see specs/features/mentor.md

import type { MouseEventHandler } from 'react';
import { FaBell, FaComments, FaHome, FaPoll, FaSignOutAlt, FaUsers } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, useMentorProfile } from '@/lib';
import styles from './MentorSidebar.module.css';

interface NavItem {
    id: string;
    label: string;
    path: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { id: 'dashboard', label: 'ダッシュボード', path: '/mentor/dashboard', icon: <FaHome /> },
    { id: 'students', label: '生徒一覧', path: '/mentor/students', icon: <FaUsers /> },
    { id: 'notifications', label: 'お知らせ管理', path: '/mentor/notifications', icon: <FaBell /> },
    { id: 'surveys', label: 'アンケート管理', path: '/mentor/surveys', icon: <FaPoll /> }, // 修正: 一覧ページへ
    { id: 'chat', label: 'チャット', path: '/mentor/chat', icon: <FaComments /> },
];

interface MentorSidebarProps {
    isOpen?: boolean;
    onClose?: MouseEventHandler<HTMLDivElement | HTMLAnchorElement>;
    onLogout?: () => void;
}

const MentorSidebar = ({ isOpen = false, onClose, onLogout }: MentorSidebarProps) => {
    const location = useLocation();
    const { profile } = useAuth();
    const { data: mentorProfile } = useMentorProfile(profile?.id);

    const displayName = profile?.display_name ?? 'メンター';
    const avatarUrl = profile?.avatar_url;
    const gender = profile?.gender;
    const introduction = mentorProfile?.introduction;
    const specialties = mentorProfile?.specialties ?? [];

    const genderDisplayName = gender === 'male' ? 'おにいさん' : 'おねえさん';

    return (
        <>
            <div
                className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
                onClick={onClose}
                aria-hidden="true"
            />
            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.logo}>
                    <h2>CO+ Study</h2>
                    <span className={styles.mode}>Mentor Mode</span>
                </div>

                {/* Mentor Profile Section */}
                <div className={styles.profileSection}>
                    <div className={styles.profileAvatar}>
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={displayName} />
                        ) : (
                            <span className={styles.avatarInitial}>
                                {displayName.charAt(0)}
                            </span>
                        )}
                    </div>
                    <div className={styles.profileDetails}>
                        <span className={styles.profileName}>{displayName}</span>
                        <span className={styles.profileRole}>{genderDisplayName}</span>
                    </div>
                    {introduction && (
                        <div className={styles.introduction}>
                            <h4>自己紹介</h4>
                            <p>{introduction}</p>
                        </div>
                    )}
                    {specialties.length > 0 && (
                        <div className={styles.specialties}>
                            <h4>得意分野</h4>
                            <ul>
                                {specialties.map((specialty) => (
                                    <li key={specialty}>{specialty}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <Link to="/mentor/profile/edit" className={styles.editProfileLink} onClick={onClose}>
                        プロフィール編集
                    </Link>
                </div>

                <nav className={styles.nav}>
                    <ul>
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <Link
                                    to={item.path}
                                    className={`${styles.navItem} ${location.pathname.startsWith(item.path) ? styles.active : ''
                                        }`}
                                    onClick={onClose}
                                >
                                    <span className={styles.icon}>{item.icon}</span>
                                    <span className={styles.label}>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                {onLogout && (
                    <div className={styles.footer}>
                        <button className={styles.logoutButton} onClick={onLogout}>
                            <span className={styles.icon}><FaSignOutAlt /></span>
                            <span className={styles.label}>ログアウト</span>
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
};

export default MentorSidebar;
