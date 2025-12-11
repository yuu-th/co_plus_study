// DiaryPage - 学習日報ページ
import { useState, useMemo } from 'react';
import type { DiaryPost, Subject } from '@/shared/types';
import DiaryPostForm from '../../components/diary/DiaryPostForm';
import DiaryFilter from '../../components/diary/DiaryFilter';
import DiaryStats from '../../components/diary/DiaryStats';
import DiaryTimeline from '../../components/diary/DiaryTimeline';
import { mockDiaryPosts } from '../../mockData/diaries';
import styles from './DiaryPage.module.css';

type RangeType = 'week' | 'month' | 'all';

const DiaryPage = () => {
    const [posts, setPosts] = useState<DiaryPost[]>(mockDiaryPosts);
    const [selectedSubject, setSelectedSubject] = useState<Subject | 'all'>('all');
    const [selectedRange, setSelectedRange] = useState<RangeType>('all');

    // フィルタリング処理
    const filteredPosts = useMemo(() => {
        let filtered = posts;

        // 教科フィルター
        if (selectedSubject !== 'all') {
            filtered = filtered.filter(p => p.subject === selectedSubject);
        }

        // 期間フィルター
        if (selectedRange !== 'all') {
            const now = new Date();
            const cutoffDate = new Date();

            // setHours(0,0,0,0) で日付比較を厳密にする運用も考えられるが、
            // 簡易的に 現在時刻 - 期間 でフィルタリングする
            if (selectedRange === 'week') {
                cutoffDate.setDate(now.getDate() - 7);
            } else if (selectedRange === 'month') {
                cutoffDate.setDate(now.getDate() - 30);
            }

            filtered = filtered.filter(p => new Date(p.timestamp) >= cutoffDate);
        }

        return filtered;
    }, [posts, selectedSubject, selectedRange]);

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
                    <DiaryFilter
                        selectedSubject={selectedSubject}
                        selectedRange={selectedRange}
                        onSubjectChange={setSelectedSubject}
                        onRangeChange={setSelectedRange}
                    />
                    <DiaryTimeline posts={filteredPosts} onLoadMore={handleLoadMore} />
                </div>
                <div className={styles.side}>
                    <DiaryStats posts={filteredPosts} />
                </div>
            </div>
        </div>
    );
};

export default DiaryPage;
