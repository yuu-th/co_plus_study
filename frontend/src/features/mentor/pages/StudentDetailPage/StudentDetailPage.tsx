// @see specs/features/mentor.md (section 5)
// StudentDetailPage - 生徒詳細ページ

import { convertDiaryPostFromDB, convertStudentDetailFromDB, useDiaryPosts, useStudentDetail } from '@/lib';
import DiaryPostCard from '@/shared/components/DiaryPostCard';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import StudentStats from '../../components/students/StudentStats';
import styles from './StudentDetailPage.module.css';

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

const StudentDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    
    // 生徒情報を取得
    const { data: studentData, isLoading: isLoadingStudent } = useStudentDetail(id);
    
    // 生徒の日報を取得
    const { data: diaryData, isLoading: isLoadingDiary } = useDiaryPosts({ userId: id });
    
    // データ変換
    const student = useMemo(() => {
        if (!studentData) return null;
        return convertStudentDetailFromDB(studentData);
    }, [studentData]);

    const posts = useMemo(() => {
        if (!diaryData?.pages) return [];
        return diaryData.pages
            .flatMap(page => page.data)
            .map(convertDiaryPostFromDB);
    }, [diaryData]);

    const isLoading = isLoadingStudent || isLoadingDiary;

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>読み込み中...</div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className={styles.notFound}>
                <h2>生徒が見つかりません</h2>
                <p>指定された生徒は存在しないか、アクセス権限がありません。</p>
                <Link to="/mentor/students" className={styles.backLink}>
                    生徒一覧に戻る
                </Link>
            </div>
        );
    }

    // Sort posts by date, newest first
    const sortedPosts = [...posts].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.profile}>
                    {student.avatarUrl ? (
                        <img
                            src={student.avatarUrl}
                            alt={student.displayName}
                            className={`${styles.avatar} ${styles.large}`}
                        />
                    ) : (
                        <div
                            className={`${styles.avatar} ${styles.initialsAvatar} ${styles.large}`}
                        >
                            <span>{getInitials(student.displayName)}</span>
                        </div>
                    )}
                    <h1 className={styles.studentName}>{student.displayName}</h1>
                </div>
                <div className={styles.headerStats}>
                    <span>
                        総投稿数: <strong>{student.totalPosts}</strong>
                    </span>
                    <span>
                        総学習時間: <strong>{student.totalHours}h</strong>
                    </span>
                </div>
                <Link to="/mentor/students" className={styles.backLink}>
                    &larr; 一覧に戻る
                </Link>
            </header>

            <section className={styles.statsSection}>
                <StudentStats stats={student.stats} />
            </section>

            <section className={styles.timelineSection}>
                <h2 className={styles.timelineTitle}>日報タイムライン</h2>
                <div className={styles.timeline}>
                    {sortedPosts.map((post) => (
                        <DiaryPostCard key={post.id} post={post} viewMode="mentor" />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default StudentDetailPage;
