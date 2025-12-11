
import type { User } from '@/shared/types';
import styles from './StudentChatSwitcher.module.css';

interface StudentInfo {
    student: User;
    unreadCount: number;
    lastMessageTime: string;
}

interface StudentChatSwitcherProps {
    students: StudentInfo[];
    selectedStudentId: string | null;
    onSelectStudent: (studentId: string) => void;
}

const StudentChatSwitcher = ({
    students,
    selectedStudentId,
    onSelectStudent,
}: StudentChatSwitcherProps) => {
    return (
        <div className={styles.container}>
            <h3 className={styles.title}>担当生徒</h3>
            <ul className={styles.list}>
                {students.map(({ student, unreadCount, lastMessageTime }) => (
                    <li
                        key={student.id}
                        className={`${styles.item} ${selectedStudentId === student.id ? styles.active : ''
                            }`}
                        onClick={() => onSelectStudent(student.id)}
                    >
                        <div className={styles.info}>
                            <span className={styles.name}>{student.name}</span>
                            <span className={styles.time}>
                                {new Date(lastMessageTime).toLocaleTimeString('ja-JP', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                        {unreadCount > 0 && (
                            <span className={styles.badge}>{unreadCount}</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudentChatSwitcher;
