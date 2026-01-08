// @see specs/features/tutorial.md
// TutorialPage - チュートリアルページ

import { Link } from 'react-router-dom';
import Button from '@/shared/components/Button';
import { useTutorialContext } from '../../components/tutorial/v2';
import styles from './TutorialPage.module.css';

const TutorialPage = () => {
    const {
        state,
        startTutorial,
        resetTutorial,
    } = useTutorialContext();

    const handleRestart = () => {
        resetTutorial();
        startTutorial();
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>チュートリアル</h1>

            <div className={styles.content}>
                {state.isCompleted ? (
                    <>
                        <div className={styles.completedBadge}>🎉</div>
                        <p className={styles.message}>
                            チュートリアルを完了しました！
                        </p>
                        <p className={styles.subMessage}>
                            アプリの使い方はバッチリですね。
                        </p>
                    </>
                ) : state.isSkipped ? (
                    <>
                        <p className={styles.message}>
                            チュートリアルをスキップしました
                        </p>
                        <p className={styles.subMessage}>
                            いつでも再開できます。
                        </p>
                    </>
                ) : state.isActive ? (
                    <>
                        <p className={styles.message}>
                            チュートリアル実行中...
                        </p>
                        <p className={styles.subMessage}>
                            画面の指示に従って操作してください。
                        </p>
                    </>
                ) : (
                    <>
                        <p className={styles.message}>
                            CO+ Studyの使い方を学びましょう！
                        </p>
                        <p className={styles.subMessage}>
                            実際の画面を操作しながら、アプリの機能を覚えましょう。
                        </p>
                    </>
                )}

                <div className={styles.actions}>
                    {!state.isActive && (
                        <Button onClick={handleRestart}>
                            {state.isCompleted || state.isSkipped ? 'もう一度はじめる' : 'チュートリアルを開始'}
                        </Button>
                    )}
                    <Link to="/">
                        <Button variant="outline">ホームへ戻る</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TutorialPage;
