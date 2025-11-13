// Headerコンポーネント

import { FaBars, FaUser } from 'react-icons/fa';
import styles from './Header.module.css';

interface HeaderProps {
  onMenuClick?: () => void;
  userName?: string;
}

const Header = ({ onMenuClick, userName = 'ユーザー' }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <button className={styles.menuButton} onClick={onMenuClick}>
        <FaBars />
      </button>
      <div className={styles.userInfo}>
        <FaUser className={styles.userIcon} />
        <span className={styles.userName}>{userName}</span>
      </div>
    </header>
  );
};

export default Header;
