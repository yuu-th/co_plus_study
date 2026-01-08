// @see specs/features/mentor.md
// DashboardPage - メンターダッシュボード

import { convertDiaryPostFromDB, convertStudentSummaryFromDB, useAuth, useDiaryPosts, useMentorStudents } from '@/lib';
import Button from '@/shared/components/Button';
import DiaryPostCard from '@/shared/components/DiaryPostCard';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import StudentCard from '../../components/students/StudentCard';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
    const { user } = useAuth();

    // 担当生徒を取得
    const { data: studentsData, isLoading: isLoadingStudents } = useMentorStudents(user?.id);

    // 最近の日報を取得（全生徒分）
    const { data: diaryData, isLoading: isLoadingDiary } = useDiaryPosts({ limit: 5 });

    // データ変換
    const students = useMemo(() => {
        if (!studentsData) return [];
        return studentsData.map(convertStudentSummaryFromDB);
    }, [studentsData]);

    const recentPosts = useMemo(() => {
        if (!diaryData?.pages) return [];
        return diaryData.pages
            .flatMap(page => page.data)
            .slice(0, 5)
            .map(convertDiaryPostFromDB);
    }, [diaryData]);

    const isLoading = isLoadingStudents || isLoadingDiary;

    if (isLoading) {
        return (
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>ダッシュボード</h1>
                </header>
                <div className={styles.loading}>読み込み中...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>ダッシュボード</h1>
                <Link to="/mentor/surveys/new" style={{ marginRight: 'var(--spacing-sm)' }}>
                    <Button variant="outline">新規アンケートを作成</Button>
                </Link>
                <Link to="/mentor/notifications" style={{ marginRight: 'var(--spacing-sm)' }}>
                    <Button variant="outline">お知らせ一覧</Button>
                </Link>
                <Link to="/mentor/notifications/new">
                    <Button variant="primary">新規お知らせを作成</Button>
                </Link>
            </header>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>担当生徒</h2>
                {students.length === 0 ? (
                    <p className={styles.empty}>担当生徒がいません</p>
                ) : (
                    <div className={styles.studentGrid}>
                        {students.map((student) => (
                            <Link to={`/mentor/students/${student.id}`} key={student.id} className={styles.studentCardLink}>
                                <StudentCard student={student} />
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>最近の日報</h2>
                {recentPosts.length === 0 ? (
                    <p className={styles.empty}>まだ日報がありません</p>
                ) : (
                    <div className={styles.diaryTimeline}>
                        {recentPosts.map((post) => (
                            <DiaryPostCard post={post} key={post.id} viewMode="mentor" />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default DashboardPage;
