// MentorLayoutコンポーネント
// @see specs/features/mentor.md

import { useAuth } from '@/lib';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import MentorHeader from '../MentorHeader';
import MentorSidebar from '../MentorSidebar';
import styles from './MentorLayout.module.css';

const MentorLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { signOut } = useAuth();
    const navigate = useNavigate();

    const handleMenuClick = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarClose = () => {
        setIsSidebarOpen(false);
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className={styles.layout}>
            <MentorSidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} onLogout={handleLogout} />
            <div className={styles.mainWrapper}>
                <MentorHeader onMenuClick={handleMenuClick} />
                <main className={styles.mainContent}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MentorLayout;
