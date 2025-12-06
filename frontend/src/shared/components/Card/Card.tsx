// Cardコンポーネント

import styles from './Card.module.css';

interface CardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'small' | 'medium' | 'large';
}

const Card = ({ title, children, className = '', padding = 'medium' }: CardProps) => {
    return (
        <div className={`${styles.card} ${styles[padding]} ${className}`}>
            {title && <h3 className={styles.title}>{title}</h3>}
            <div className={styles.content}>{children}</div>
        </div>
    );
};

export default Card;
