// @see specs/features/mentor.md

import { FaBars } from 'react-icons/fa';
import styles from './MentorHeader.module.css';

interface MentorHeaderProps {
  onMenuClick: () => void;
}

const MentorHeader = ({ onMenuClick }: MentorHeaderProps) => {
  return (
    <header className={styles.header}>
      <button
        className={styles.menuButton}
        onClick={onMenuClick}
        aria-label="メニューを開く"
      >
        <FaBars />
      </button>
      <span className={styles.modeLabel}>メンターモード</span>
    </header>
  );
};

export default MentorHeader;
