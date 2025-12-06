// @see specs/features/mentor.md
// DashboardPage - メンターダッシュボード

import { Link } from 'react-router-dom';
import Button from '@/shared/components/Button';
import DiaryPostCard from '@/shared/components/DiaryPostCard';
import StudentCard from '../../components/students/StudentCard';
import { mockStudents } from '../../mockData/mentors';
import { mockDiaryPosts } from '@/features/student/mockData/diaries';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
    const recentPosts = mockDiaryPosts.slice(0, 5);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>ダッシュボード</h1>
                <Link to="/mentor/notifications/new">
                    <Button variant="primary">新規お知らせを作成</Button>
                </Link>
            </header>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>担当生徒</h2>
                <div className={styles.studentGrid}>
                    {mockStudents.map((student) => (
                        <Link to={`/mentor/students/${student.id}`} key={student.id} className={styles.studentCardLink}>
                            <StudentCard student={student} />
                        </Link>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>最近の日報</h2>
                <div className={styles.diaryTimeline}>
                    {recentPosts.map((post) => (
                        <DiaryPostCard post={post} key={post.id} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default DashboardPage;
