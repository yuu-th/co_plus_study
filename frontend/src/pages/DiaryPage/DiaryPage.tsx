// DiaryPage - 学習日報ページ Phase 2 実装
import { useState } from 'react';
import DiaryPostForm from '../../components/diary/DiaryPostForm/DiaryPostForm';
import DiaryStats from '../../components/diary/DiaryStats/DiaryStats';
import DiaryTimeline from '../../components/diary/DiaryTimeline/DiaryTimeline';
import { mockDiaryPosts } from '../../mockData/diaries';
import type { DiaryPost } from '../../types';
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
