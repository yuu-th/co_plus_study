import { useState } from 'react';
import type { Notification } from '../../../types';
import NotificationCard from '../NotificationCard/NotificationCard';
import styles from './NotificationList.module.css';

interface NotificationListProps {
  notifications: Notification[];
  onOpen: (notification: Notification) => void;
}

const categories: { value: '' | Notification['category']; label: string }[] = [
  { value: '', label: 'すべて' },
  { value: 'info', label: '情報' },
  { value: 'important', label: '重要' },
  { value: 'event', label: 'イベント' },
  { value: 'achievement', label: '達成' },
];

const NotificationList = ({ notifications, onOpen }: NotificationListProps) => {
  const [category, setCategory] = useState<'' | Notification['category']>('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const filtered = notifications.filter(n => {
    if (category && n.category !== category) return false;
    if (showUnreadOnly && n.read) return false;
    return true;
  });

  return (
    <div>
      <div className={styles.filters}>
        <select
          value={category}
          onChange={e => setCategory(e.target.value as Notification['category'] | '')}
          className={styles.filterSelect}
          aria-label="カテゴリフィルター"
        >
          {categories.map(c => <option key={c.value || 'all'} value={c.value}>{c.label}</option>)}
        </select>
        <label style={{ fontSize:'0.75rem' }}>
          <input
            type="checkbox"
            checked={showUnreadOnly}
            onChange={e => setShowUnreadOnly(e.target.checked)}
          /> 未読のみ
        </label>
      </div>
      {filtered.length === 0 && <div className={styles.empty}>通知はありません</div>}
      <div className={styles.list} aria-label="通知一覧">
        {filtered.map(n => (
          <NotificationCard key={n.id} notification={n} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
};

export default NotificationList;