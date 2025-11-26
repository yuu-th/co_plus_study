// MentorLayoutコンポーネント

import type { ReactNode } from 'react';
import { useState } from 'react';
import MentorHeader from '../MentorHeader';
import MentorSidebar from '../MentorSidebar';
import styles from './MentorLayout.module.css';

interface MentorLayoutProps {
  children: ReactNode;
}

const MentorLayout = ({ children }: MentorLayoutProps) => {
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
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
};

export default MentorLayout;
