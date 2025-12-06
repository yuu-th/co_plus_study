// MentorLayoutコンポーネント
// @see specs/features/mentor.md

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import MentorHeader from '../MentorHeader';
import MentorSidebar from '../MentorSidebar';
import styles from './MentorLayout.module.css';

const MentorLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleMenuClick = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarClose = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className={styles.layout}>
            <MentorSidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
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
