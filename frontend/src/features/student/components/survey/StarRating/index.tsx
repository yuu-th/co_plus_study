import styles from './StarRating.module.css';

interface StarRatingProps {
    value: number;
    onChange: (value: number) => void;
    max?: number;
    readOnly?: boolean;
}

const StarRating = ({ value, onChange, max = 5, readOnly = false }: StarRatingProps) => {
    return (
        <div className={styles.container} role="radiogroup" aria-label="評価">
            {[...Array(max)].map((_, i) => {
                const ratingValue = i + 1;
                return (
                    <button
                        key={ratingValue}
                        type="button"
                        className={`${styles.star} ${ratingValue <= value ? styles.active : ''} ${readOnly ? styles.readOnly : ''}`}
                        onClick={() => !readOnly && onChange(ratingValue)}
                        aria-label={`${ratingValue}つ星`}
                        aria-checked={ratingValue === value}
                        disabled={readOnly}
                    >
                        ★
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;
