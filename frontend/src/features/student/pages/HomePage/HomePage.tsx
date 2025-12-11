// HomePage - ホームページ

import { Link } from 'react-router-dom';
import Button from '@/shared/components/Button';
import Card from '@/shared/components/Card';
import { useTutorialContext } from '../../components/tutorial/TutorialProvider';
import RecentActivityTimeline from '../../components/home/RecentActivityTimeline';
import { mockActivities } from '../../mockData/activities';
import styles from './HomePage.module.css';

const HomePage = () => {
    const { state, startTutorial, resetTutorial } = useTutorialContext();

    const handleStartTutorial = () => {
        resetTutorial();
        startTutorial();
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>ようこそ、Co+ Studyへ！</h1>
            <p className={styles.subtitle}>今日も一緒にがんばろう！</p>

            {/* チュートリアル案内（未完了の場合） */}
            {!state.isCompleted && !state.isActive && (
                <div className={styles.tutorialBanner}>
                    <div className={styles.tutorialContent}>
                        <span className={styles.tutorialIcon}>📚</span>
                        <div className={styles.tutorialText}>
                            <strong>はじめての方へ</strong>
                            <p>アプリの使い方を学びましょう！</p>
                        </div>
                    </div>
                    <Button onClick={handleStartTutorial}>
                        チュートリアルを開始
                    </Button>
                </div>
            )}

            <div className={styles.layout}>
                <div className={styles.main}>
                    <div className={styles.grid}>
                        <Card title="実績を見る">
                            <p className={styles.description}>あなたの学習の記録や獲得したバッジを確認できます。</p>
                            <Link to="/archive"><Button variant="primary">実績へ</Button></Link>
                        </Card>
                        <Card title="学習日報を書く">
                            <p className={styles.description}>今日の学習内容を記録しましょう。</p>
                            <Link to="/diary"><Button variant="secondary">日報を書く</Button></Link>
                        </Card>
                        <Card title="メンターに相談">
                            <p className={styles.description}>分からないことがあれば、いつでも相談できます。</p>
                            <Link to="/chat"><Button variant="outline">相談する</Button></Link>
                        </Card>
                        <Card title="アンケート">
                            <p className={styles.description}>みんなの声を聞かせてね！</p>
                            <Link to="/survey"><Button variant="outline">回答する</Button></Link>
                        </Card>
                    </div>
                </div>

                <div className={styles.side}>
                    <RecentActivityTimeline activities={mockActivities} maxItems={5} />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
