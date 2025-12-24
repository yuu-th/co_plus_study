// @see specs/features/notification.md
import type { NotificationCategory } from '@/shared/types';
import styles from './NotificationFilter.module.css';

interface NotificationFilterProps {
    selectedCategory: NotificationCategory | 'all';
    onCategoryChange: (category: NotificationCategory | 'all') => void;
}

const NotificationFilter = ({ selectedCategory, onCategoryChange }: NotificationFilterProps) => {
    const categories: Array<{ value: NotificationCategory | 'all'; label: string }> = [
        { value: 'all', label: 'すべて' },
        { value: 'info', label: 'お知らせ' },
        { value: 'event', label: 'イベント' },
        { value: 'important', label: '重要' },
    ];

    return (
        <div className={styles.container}>
            {categories.map(({ value, label }) => (
                <button
                    key={value}
                    type="button"
                    className={`${styles.button} ${selectedCategory === value ? styles.active : ''
                        }`}
                    onClick={() => onCategoryChange(value)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};

export default NotificationFilter;
