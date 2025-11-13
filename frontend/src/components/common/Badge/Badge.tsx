// Badgeコンポーネント - メダル型バッジの表示

import type { BadgeType } from '../../../types';
import styles from './Badge.module.css';

interface BadgeProps {
  type: BadgeType;
  size?: 'small' | 'medium' | 'large';
}

const Badge = ({ type, size = 'medium' }: BadgeProps) => {
  return (
    <div className={`${styles.badge} ${styles[type]} ${styles[size]}`}>
      <div className={styles.medal}>
        <div className={styles.ribbon} />
      </div>
    </div>
  );
};

export default Badge;
