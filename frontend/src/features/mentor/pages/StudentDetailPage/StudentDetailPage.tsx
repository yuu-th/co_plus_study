// @see specs/features/mentor.md (section 5)
// StudentDetailPage - 生徒詳細ページ

import { Link, useParams } from 'react-router-dom';
import DiaryPostCard from '@/shared/components/DiaryPostCard';
import StudentStats from '../../components/students/StudentStats';
import { mockStudentDetails } from '../../mockData/mentors';
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
    const student = mockStudentDetails.find((s) => s.id === id);

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
    const sortedPosts = [...student.posts].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.profile}>
                    {student.avatarUrl ? (
                        <img
                            src={student.avatarUrl}
                            alt={student.name}
                            className={`${styles.avatar} ${styles.large}`}
                        />
                    ) : (
                        <div
                            className={`${styles.avatar} ${styles.initialsAvatar} ${styles.large}`}
                        >
                            <span>{getInitials(student.name)}</span>
                        </div>
                    )}
                    <h1 className={styles.studentName}>{student.name}</h1>
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
                        <DiaryPostCard key={post.id} post={post} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default StudentDetailPage;
