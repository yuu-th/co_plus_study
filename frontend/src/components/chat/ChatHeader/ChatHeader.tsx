import styles from './ChatHeader.module.css';

interface ChatHeaderProps {
  mentorName: string;
  studentName: string;
}

const ChatHeader = ({ mentorName, studentName }: ChatHeaderProps) => {
  return (
    <div className={styles.header} aria-label="チャットヘッダー">
      <div className={styles.title}>相談チャット</div>
      <div className={styles.status}>生徒: {studentName} / メンター: {mentorName}</div>
    </div>
  );
};

export default ChatHeader;
