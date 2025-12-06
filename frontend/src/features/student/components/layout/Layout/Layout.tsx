// Layoutコンポーネント - 学生向け全ページ共通レイアウト

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { mockCurrentUser } from '@/shared/mockData/users';
import { TutorialProvider } from '../../tutorial/TutorialProvider';
import Header from '../Header';
import Sidebar from '../Sidebar';
import styles from './Layout.module.css';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleMenuClick = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarClose = () => {
        setIsSidebarOpen(false);
    };

    return (
        <TutorialProvider>
            <div className={styles.layout}>
                <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
                <div className={styles.mainWrapper}>
                    <Header onMenuClick={handleMenuClick} userName={mockCurrentUser.name} />
                    <main className={styles.main}><Outlet /></main>
                </div>
            </div>
        </TutorialProvider>
    );
};

export default Layout;
