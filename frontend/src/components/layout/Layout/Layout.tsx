// Layoutコンポーネント - 全ページ共通レイアウト

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { mockCurrentUser } from '../../../mockData/users';
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
    <div className={styles.layout}>
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      <div className={styles.mainWrapper}>
        <Header onMenuClick={handleMenuClick} userName={mockCurrentUser.name} />
        <main className={styles.main}><Outlet /></main>
      </div>
    </div>
  );
};

export default Layout;
