// @see specs/features/notification.md
import type { NotificationCategory } from '@/shared/types';
import styles from './NotificationFilter.module.css';

interface NotificationFilterProps {
    selectedCategory: NotificationCategory | 'all';
    onCategoryChange: (category: NotificationCategory | 'all') => void;
}

const NotificationFilter = ({ selectedCategory, onCategoryChange }: NotificationFilterProps) => {
    // Map UI labels to existing internal types
    // all -> '' (or 'all' in state), system -> 'important' (approx), event -> 'event', announcement -> 'info'
    const categories: Array<{ value: NotificationCategory | 'all'; label: string }> = [
        { value: 'all', label: 'すべて' },
        { value: 'important', label: 'システム' }, // Mapping 'system' requirement to 'important' type
        { value: 'event', label: 'イベント' },
        { value: 'info', label: 'お知らせ' }, // Mapping 'announcement' requirement to 'info' type
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
