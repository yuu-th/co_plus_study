// MentorHeaderコンポーネント

import type { MouseEventHandler } from 'react';
import { FaBars } from 'react-icons/fa';
import styles from './MentorHeader.module.css';

interface MentorHeaderProps {
  onMenuClick?: MouseEventHandler<HTMLButtonElement>;
}

const MentorHeader = ({ onMenuClick }: MentorHeaderProps) => {
  return (
    <header className={styles.header}>
      <button className={styles.menuButton} onClick={onMenuClick} aria-label="メニューを開く">
        <FaBars />
      </button>
      <div className={styles.title}>メンターモード</div>
    </header>
  );
};

export default MentorHeader;
