// @see specs/features/mentor.md (section 5)
// StudentListPage - 生徒一覧ページ

import { convertStudentSummaryFromDB, useAuth, useMentorStudents } from '@/lib';
import Card from '@/shared/components/Card';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { StudentSummary } from '../../types';
import styles from './StudentListPage.module.css';

type SortKey = 'name' | 'lastActivity' | 'totalHours';

const sortStudents = (students: StudentSummary[], key: SortKey): StudentSummary[] => {
    return [...students].sort((a, b) => {
        switch (key) {
            case 'name':
                return a.displayName.localeCompare(b.displayName, 'ja');
            case 'lastActivity':
                return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
            case 'totalHours':
                return b.totalHours - a.totalHours;
            default:
                return 0;
        }
    });
};

const StudentListPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { data: studentsData, isLoading } = useMentorStudents(user?.id);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('name');

    // DBデータをフロントエンド型に変換
    const students = useMemo(() => {
        if (!studentsData) return [];
        return studentsData.map(convertStudentSummaryFromDB);
    }, [studentsData]);

    const filteredAndSortedStudents = useMemo(() => {
        const filtered = students.filter(student =>
            student.displayName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return sortStudents(filtered, sortKey);
    }, [students, searchTerm, sortKey]);

    const handleCardClick = (studentId: string) => {
        navigate(`/mentor/students/${studentId}`);
    };

    if (isLoading) {
        return (
            <div className={styles.page}>
                <header className={styles.header}>
                    <h1 className={styles.title}>生徒一覧</h1>
                </header>
                <div className={styles.loading}>読み込み中...</div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>生徒一覧</h1>
            </header>
            <div className={styles.controls}>
                <input
                    type="text"
                    placeholder="生徒名で検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
                <select
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value as SortKey)}
                    className={styles.sortSelect}
                >
                    <option value="name">名前（あいうえお順）</option>
                    <option value="lastActivity">最終活動日（新しい順）</option>
                    <option value="totalHours">学習時間（多い順）</option>
                </select>
            </div>
            <main className={styles.grid}>
                {filteredAndSortedStudents.length > 0 ? (
                    filteredAndSortedStudents.map(student => (
                        <Card
                            key={student.id}
                            className={styles.studentCard}
                            padding="medium"
                        >
                            <div onClick={() => handleCardClick(student.id)}>
                                <div className={styles.cardHeader}>
                                    <img src={student.avatarUrl || 'https://placehold.jp/150x150.png?text=No+Image'} alt={student.displayName} className={styles.avatar} />
                                    <h2 className={styles.studentName}>{student.displayName}</h2>
                                </div>
                                <div className={styles.cardBody}>
                                    <p>総学習時間: {student.totalHours}h</p>
                                    <p>最終活動日: {new Date(student.lastActivity).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <p className={styles.noResults}>該当する生徒がいません</p>
                )}
            </main>
        </div>
    );
};

export default StudentListPage;
