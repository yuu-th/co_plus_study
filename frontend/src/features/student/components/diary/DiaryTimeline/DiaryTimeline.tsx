import { useState } from 'react';
import DiaryPostCard from '@/shared/components/DiaryPostCard';
import type { DiaryPost, GroupedDiaryPost } from '@/shared/types';
import { groupByDate } from '@/shared/utils/groupByDate';
import styles from './DiaryTimeline.module.css';

interface DiaryTimelineProps {
    posts: DiaryPost[];
    onLoadMore?: () => void;
    onDelete?: (postId: string) => void;
    onEdit?: (postId: string) => void;
    currentUserId?: string;
}

const DiaryTimeline = ({ posts, onLoadMore, onDelete, onEdit, currentUserId }: DiaryTimelineProps) => {
    const [filterSubject, setFilterSubject] = useState<string>('');
    const filtered = filterSubject ? posts.filter(p => p.subject === filterSubject) : posts;
    const grouped: GroupedDiaryPost[] = groupByDate(filtered);

    return (
        <div className={styles.timeline} aria-label="学習日報タイムライン">
            <div className={styles.filters}>
                <select
                    value={filterSubject}
                    onChange={e => setFilterSubject(e.target.value)}
                    className={styles.subjectFilter}
                    aria-label="教科フィルター"
                >
                    <option value="">すべての教科</option>
                    {Array.from(new Set(posts.map(p => p.subject))).map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>
            {grouped.map(group => (
                <section key={group.dateLabel} className={styles.group} aria-labelledby={`group-${group.dateLabel}`}>
                    <h2 id={`group-${group.dateLabel}`} className={styles.groupTitle}>{group.dateLabel}</h2>
                    <div className={styles.posts}>
                        {group.posts.map(p => (
                            <DiaryPostCard
                                key={p.id}
                                post={p}
                                viewMode="student"
                                currentUserId={currentUserId}
                                onDelete={onDelete}
                                onEdit={onEdit}
                            />
                        ))}
                    </div>
                </section>
            ))}
            {onLoadMore && (
                <div className={styles.loadMore}>
                    <button onClick={onLoadMore}>さらに読み込む</button>
                </div>
            )}
        </div>
    );
};

export default DiaryTimeline;
