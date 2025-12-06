// DiaryPage - 学習日報ページ
import { useState } from 'react';
import type { DiaryPost } from '@/shared/types';
import DiaryPostForm from '../../components/diary/DiaryPostForm';
import DiaryStats from '../../components/diary/DiaryStats';
import DiaryTimeline from '../../components/diary/DiaryTimeline';
import { mockDiaryPosts } from '../../mockData/diaries';
import styles from './DiaryPage.module.css';

const DiaryPage = () => {
    const [posts, setPosts] = useState<DiaryPost[]>(mockDiaryPosts);

    const handleAdd = (post: DiaryPost) => {
        setPosts(prev => [post, ...prev]);
    };

    const handleLoadMore = () => {
        // モック: 追加読み込みは何もしない / 将来拡張
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>学習日報</h1>
            <div className={styles.layout}>
                <div className={styles.main}>
                    <DiaryPostForm onAdd={handleAdd} />
                    <DiaryTimeline posts={posts} onLoadMore={handleLoadMore} />
                </div>
                <div className={styles.side}>
                    <DiaryStats posts={posts} />
                </div>
            </div>
        </div>
    );
};

export default DiaryPage;
