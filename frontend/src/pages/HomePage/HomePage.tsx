// HomePage - ホームページ（簡易実装）

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import NotificationBadge from '../../components/notification/NotificationBadge/NotificationBadge';
import NotificationList from '../../components/notification/NotificationList/NotificationList';
import NotificationModal from '../../components/notification/NotificationModal/NotificationModal';
import { useNotifications } from '../../hooks/useNotifications';
import styles from './HomePage.module.css';

const HomePage = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [openNotification, setOpenNotification] = useState<null | (typeof notifications[number])>(null);

  return (
    <div className={styles.page}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h1 className={styles.title}>ようこそ、CO+ Studyへ！</h1>
        <NotificationBadge count={unreadCount} onClick={() => { /* スクロール先など拡張余地 */ }} />
      </div>
      <div className={styles.grid}>
        <Card title="ARCHIVEを見る">
          <p className={styles.description}>あなたの学習の記録や獲得したバッジを確認できます。</p>
          <Link to="/archive"><Button variant="primary">ARCHIVEへ</Button></Link>
        </Card>
        <Card title="学習日報を書く">
          <p className={styles.description}>今日の学習内容を記録しましょう。</p>
          <Link to="/diary"><Button variant="secondary">日報を書く</Button></Link>
        </Card>
        <Card title="メンターに相談">
          <p className={styles.description}>分からないことがあれば、いつでも相談できます。</p>
          <Link to="/chat"><Button variant="outline">相談する</Button></Link>
        </Card>
      </div>
      <section aria-labelledby="home-notifications" style={{ marginTop:'32px' }}>
        <h2 id="home-notifications" style={{ fontSize:'1.1rem', marginBottom:'12px' }}>最新のお知らせ</h2>
        <NotificationList notifications={notifications} onOpen={n => setOpenNotification(n)} />
      </section>
      <NotificationModal
        notification={openNotification}
        onClose={() => setOpenNotification(null)}
        onMarkRead={(id) => {
          markAsRead(id);
          setOpenNotification((prev: null | (typeof notifications[number])) => (prev && prev.id === id ? { ...prev, read: true } : prev));
        }}
      />
    </div>
  );
};

export default HomePage;
