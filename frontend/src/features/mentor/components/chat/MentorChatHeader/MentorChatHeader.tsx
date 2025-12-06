// @see specs/features/chat.md
// MentorChatHeader - メンター専用チャットヘッダー

import type { StudentSummary } from '../../../types';
import styles from './MentorChatHeader.module.css';

interface MentorChatHeaderProps {
    currentStudent: StudentSummary | null;
    students: StudentSummary[];
    onSelectStudent: (studentId: string) => void;
}

const MentorChatHeader = ({ currentStudent, students, onSelectStudent }: MentorChatHeaderProps) => {
    return (
        <div className={styles.header} aria-label="メンターチャットヘッダー">
            <div className={styles.left}>
                <span className={styles.title}>相談チャット（メンター）</span>
                {currentStudent && (
                    <span className={styles.currentStudent}>現在の生徒: {currentStudent.name}</span>
                )}
            </div>
            <div className={styles.right}>
                <label htmlFor="student-select" className={styles.selectLabel}>
                    生徒を選択:
                </label>
                <select
                    id="student-select"
                    className={styles.select}
                    value={currentStudent?.id ?? ''}
                    onChange={(e) => onSelectStudent(e.target.value)}
                >
                    {students.map((student) => (
                        <option key={student.id} value={student.id}>
                            {student.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default MentorChatHeader;
