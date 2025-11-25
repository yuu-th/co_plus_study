// Layoutコンポーネント - 全ページ共通レイアウト

import { useState } from 'react';
import { mockCurrentUser } from '../../../mockData/users';
import Header from '../Header';
import Sidebar from '../Sidebar';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
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
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
