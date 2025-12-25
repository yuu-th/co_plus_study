// @see specs/features/home.md
// ProfilePage - プロフィール画面

import { useAuth } from '@/lib';
import Button from '@/shared/components/Button';
import { Link } from 'react-router-dom';
import { useTutorialContext } from '../../components/tutorial/TutorialProvider';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
    const { state, startTutorial, resetTutorial } = useTutorialContext();
    const { profile, isLoading } = useAuth();

    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return '-';
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

    if (isLoading) {
        return (
            <div className={styles.page}>
                <div className={styles.loading}>読み込み中...</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className={styles.page}>
                <div className={styles.error}>プロフィールが見つかりません</div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>プロフィール</h1>
                <Link to="/profile/edit">
                    <Button variant="outline" size="small">編集</Button>
                </Link>
            </div>

            <div className={styles.profileCard}>
                <div className={styles.avatarWrapper}>
                    {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt={profile.display_name} className={styles.avatar} />
                    ) : (
                        <div className={styles.avatarPlaceholder}>
                            {profile.display_name?.charAt(0) || '?'}
                        </div>
                    )}
                </div>

                <div className={styles.info}>
                    <div className={styles.field}>
                        <label className={styles.label}>名前</label>
                        <p className={styles.value}>{profile.display_name}</p>
                    </div>
                    {profile.name_kana && (
                        <div className={styles.field}>
                            <label className={styles.label}>フリガナ</label>
                            <p className={styles.value}>{profile.name_kana}</p>
                        </div>
                    )}
                    {profile.grade && (
                        <div className={styles.field}>
                            <label className={styles.label}>学年</label>
                            <p className={styles.value}>{profile.grade}</p>
                        </div>
                    )}
                    <div className={styles.field}>
                        <label className={styles.label}>参加日</label>
                        <p className={styles.value}>{formatDate(profile.created_at)}</p>
                    </div>
                </div>
            </div>

            {/* TODO: 統計情報はDBから動的に取得する */}
            {/* <div className={styles.stats}>
                <div className={styles.stat}>
                    <h3 className={styles.statLabel}>総学習時間</h3>
                    <p className={styles.statValue}>- <span className={styles.unit}>時間</span></p>
                </div>
                <div className={styles.stat}>
                    <h3 className={styles.statLabel}>投稿数</h3>
                    <p className={styles.statValue}>- <span className={styles.unit}>件</span></p>
                </div>
            </div> */}

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
