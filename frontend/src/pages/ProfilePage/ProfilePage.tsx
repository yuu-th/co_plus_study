// @see specs/features/home.md
// ProfilePage - プロフィール画面

import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { useTutorialContext } from '../../components/tutorial/TutorialProvider';
import styles from './ProfilePage.module.css';

interface UserProfile {
  id: string;
  name: string;
  kana: string;
  avatarUrl?: string;
  joinedAt: string;
  totalStudyHours: number;
  totalPosts: number;
}

const ProfilePage = () => {
  const { state, startTutorial, resetTutorial } = useTutorialContext();

  // モックデータから現在ユーザー情報を取得
  const user: UserProfile = {
    id: '1',
    name: '田中太郎',
    kana: 'たなかたろう',
    avatarUrl: undefined,
    joinedAt: '2024-01-15',
    totalStudyHours: 156,
    totalPosts: 42,
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleStartTutorial = () => {
    resetTutorial();
    startTutorial();
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>プロフィール</h1>

      <div className={styles.profileCard}>
        <div className={styles.avatarWrapper}>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className={styles.avatar} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {user.name.charAt(0)}
            </div>
          )}
        </div>

        <div className={styles.info}>
          <div className={styles.field}>
            <label className={styles.label}>名前</label>
            <p className={styles.value}>{user.name}</p>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>フリガナ</label>
            <p className={styles.value}>{user.kana}</p>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>参加日</label>
            <p className={styles.value}>{formatDate(user.joinedAt)}</p>
          </div>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <h3 className={styles.statLabel}>総学習時間</h3>
          <p className={styles.statValue}>{user.totalStudyHours} <span className={styles.unit}>時間</span></p>
        </div>
        <div className={styles.stat}>
          <h3 className={styles.statLabel}>投稿数</h3>
          <p className={styles.statValue}>{user.totalPosts} <span className={styles.unit}>件</span></p>
        </div>
      </div>

      {/* 設定セクション */}
      <div className={styles.settingsSection}>
        <h2 className={styles.sectionTitle}>設定</h2>
        <div className={styles.settingItem}>
          <div className={styles.settingInfo}>
            <h3 className={styles.settingLabel}>チュートリアル</h3>
            <p className={styles.settingDescription}>
              {state.isCompleted 
                ? '完了済み - もう一度確認できます' 
                : 'アプリの使い方を確認できます'}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="small" 
            onClick={handleStartTutorial}
            disabled={state.isActive}
          >
            {state.isActive ? '実行中...' : '開始する'}
          </Button>
        </div>
      </div>

      <div className={styles.actions}>
        <Link to="/">
          <Button variant="outline">ホームへ戻る</Button>
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
