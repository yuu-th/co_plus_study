// Sidebarコンポーネント

import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBook, FaComments, FaArchive, FaClipboardList } from 'react-icons/fa';
import styles from './Sidebar.module.css';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'ホーム',
    icon: <FaHome />,
    path: '/',
  },
  {
    id: 'diary',
    label: '学習日報',
    icon: <FaBook />,
    path: '/diary',
  },
  {
    id: 'chat',
    label: '相談',
    icon: <FaComments />,
    path: '/chat',
  },
  {
    id: 'archive',
    label: 'ARCHIVE',
    icon: <FaArchive />,
    path: '/archive',
  },
  {
    id: 'survey',
    label: 'アンケート',
    icon: <FaClipboardList />,
    path: '/survey',
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.logo}>
          <h1>CO+ Study</h1>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`${styles.navItem} ${
                location.pathname === item.path ? styles.active : ''
              }`}
              onClick={onClose}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
