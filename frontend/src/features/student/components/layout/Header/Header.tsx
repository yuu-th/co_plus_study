// Headerコンポーネント - 学生向け

import { FaBars, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '@/shared/types';
import NotificationBell from '../../notification/NotificationBell';
import styles from './Header.module.css';

interface HeaderProps {
    onMenuClick?: () => void;
    userName?: string;
    unreadNotificationCount?: number;
    notifications?: Notification[];
    onNotificationMarkRead?: (id: string) => void;
}

const Header = ({
    onMenuClick,
    userName = 'ユーザー',
    unreadNotificationCount = 0,
    notifications = [],
    onNotificationMarkRead,
}: HeaderProps) => {
    const navigate = useNavigate();

    const handleLogoClick = () => navigate('/');
    const handleUserNameClick = () => navigate('/profile');

    return (
        <header className={styles.header}>
            <div className={styles.leftSection}>
                <button className={styles.menuButton} onClick={onMenuClick} aria-label="メニューを開く">
                    <FaBars />
                </button>
                <button className={styles.logoButton} onClick={handleLogoClick} aria-label="ホームへ戻る">
                    Co+ Study
                </button>
            </div>
            <div className={styles.rightSection}>
                <NotificationBell
                    count={unreadNotificationCount}
                    notifications={notifications}
                    onMarkRead={onNotificationMarkRead}
                />
                <button className={styles.userButton} onClick={handleUserNameClick} aria-label="プロフィールを開く">
                    <FaUser className={styles.userIcon} />
                    <span className={styles.userName}>{userName}</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
