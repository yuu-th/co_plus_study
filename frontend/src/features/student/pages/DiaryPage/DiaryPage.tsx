// DiaryPage - 学習日報ページ
// @see specs/features/diary.md
import { useState, useMemo } from 'react';
import type { DiaryPost, Subject } from '@/shared/types';
import { useAuth, useDiaryPosts, useCreateDiaryPost, useUpdateDiaryPost, useDeleteDiaryPost, convertDiaryPostFromDB } from '@/lib';
import DiaryPostForm from '../../components/diary/DiaryPostForm';
import DiaryFilter from '../../components/diary/DiaryFilter';
import DiaryStats from '../../components/diary/DiaryStats';
import DiaryTimeline from '../../components/diary/DiaryTimeline';
import DiaryEditModal from '../../components/diary/DiaryEditModal';
import styles from './DiaryPage.module.css';

type RangeType = 'week' | 'month' | 'all';

const DiaryPage = () => {
    const { user } = useAuth();
    const [selectedSubject, setSelectedSubject] = useState<Subject | 'all'>('all');
    const [selectedRange, setSelectedRange] = useState<RangeType>('all');
    const [editingPost, setEditingPost] = useState<DiaryPost | null>(null);

    // Supabaseからデータ取得
    const { 
        data: diaryData, 
        isLoading, 
        fetchNextPage, 
        hasNextPage,
        isFetchingNextPage 
    } = useDiaryPosts();

    // Mutations
    const createPost = useCreateDiaryPost();
    const updatePost = useUpdateDiaryPost();
    const deletePost = useDeleteDiaryPost();

    // DBデータをフロントエンド型に変換
    const posts = useMemo(() => {
        if (!diaryData?.pages) return [];
        return diaryData.pages.flatMap(page => 
            page.data.map(convertDiaryPostFromDB)
        );
    }, [diaryData]);

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

            if (selectedRange === 'week') {
                cutoffDate.setDate(now.getDate() - 7);
            } else if (selectedRange === 'month') {
                cutoffDate.setDate(now.getDate() - 30);
            }

            filtered = filtered.filter(p => new Date(p.timestamp) >= cutoffDate);
        }

        return filtered;
    }, [posts, selectedSubject, selectedRange]);

    const handleAdd = async (post: DiaryPost) => {
        if (!user) return;

        try {
            await createPost.mutateAsync({
                user_id: user.id,
                subject: post.subject,
                duration_minutes: post.duration,
                content: post.content,
            });
        } catch (error) {
            console.error('投稿に失敗しました:', error);
        }
    };

    const handleDelete = async (postId: string) => {
        try {
            await deletePost.mutateAsync(postId);
        } catch (error) {
            console.error('削除に失敗しました:', error);
        }
    };

    const handleEdit = (postId: string) => {
        const post = posts.find(p => p.id === postId);
        if (post) setEditingPost(post);
    };

    const handleSaveEdit = async (updatedPost: DiaryPost) => {
        try {
            await updatePost.mutateAsync({
                id: updatedPost.id,
                subject: updatedPost.subject,
                duration_minutes: updatedPost.duration,
                content: updatedPost.content,
            });
            setEditingPost(null);
        } catch (error) {
            console.error('更新に失敗しました:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditingPost(null);
    };

    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    const currentUserId = user?.id ?? '';

    if (isLoading) {
        return (
            <div className={styles.page}>
                <h1 className={styles.title}>学習日報</h1>
                <div className={styles.loading}>読み込み中...</div>
            </div>
        );
    }

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
                    <DiaryTimeline
                        posts={filteredPosts}
                        onLoadMore={hasNextPage ? handleLoadMore : undefined}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        currentUserId={currentUserId}
                    />
                    {isFetchingNextPage && (
                        <div className={styles.loadingMore}>読み込み中...</div>
                    )}
                </div>
                <div className={styles.side}>
                    <DiaryStats posts={filteredPosts} />
                </div>
            </div>
            {editingPost && (
                <DiaryEditModal
                    post={editingPost}
                    onSave={handleSaveEdit}
                    onCancel={handleCancelEdit}
                />
            )}
        </div>
    );
};

export default DiaryPage;
