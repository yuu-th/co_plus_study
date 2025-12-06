// MentorSidebarコンポーネント
// @see specs/features/mentor.md

import type { MouseEventHandler } from 'react';
import { FaBell, FaComments, FaHome, FaUsers } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
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
    { id: 'chat', label: 'チャット', path: '/mentor/chat', icon: <FaComments /> },
];

interface MentorSidebarProps {
    isOpen?: boolean;
    onClose?: MouseEventHandler<HTMLDivElement | HTMLAnchorElement>;
}

const MentorSidebar = ({ isOpen = false, onClose }: MentorSidebarProps) => {
    const location = useLocation();

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
            </aside>
        </>
    );
};

export default MentorSidebar;
