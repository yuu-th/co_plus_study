import type { Subject } from '@/shared/types';
import styles from './DiaryFilter.module.css';

type RangeType = 'week' | 'month' | 'all';

interface DiaryFilterProps {
    selectedSubject: Subject | 'all';
    selectedRange: RangeType;
    onSubjectChange: (subject: Subject | 'all') => void;
    onRangeChange: (range: RangeType) => void;
}

const DiaryFilter = ({
    selectedSubject,
    selectedRange,
    onSubjectChange,
    onRangeChange,
}: DiaryFilterProps) => {
    const subjects: Array<Subject | 'all'> = [
        'all', '国語', '数学', '理科', '社会', '英語', 'その他'
    ];

    const ranges: Array<{ value: RangeType; label: string }> = [
        { value: 'week', label: '1週間' },
        { value: 'month', label: '1ヶ月' },
        { value: 'all', label: 'すべて' },
    ];

    return (
        <div className={styles.filterContainer}>
            <div className={styles.filterGroup}>
                <label className={styles.label}>教科</label>
                <div className={styles.buttonGroup}>
                    {subjects.map((subject) => (
                        <button
                            key={subject}
                            type="button"
                            className={`${styles.filterButton} ${selectedSubject === subject ? styles.active : ''
                                }`}
                            onClick={() => onSubjectChange(subject)}
                        >
                            {subject === 'all' ? 'すべて' : subject}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.filterGroup}>
                <label className={styles.label}>期間</label>
                <div className={styles.buttonGroup}>
                    {ranges.map(({ value, label }) => (
                        <button
                            key={value}
                            type="button"
                            className={`${styles.filterButton} ${selectedRange === value ? styles.active : ''
                                }`}
                            onClick={() => onRangeChange(value)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DiaryFilter;
