// @see specs/features/survey.md
// RatingInput - 評価入力コンポーネント（星/数値）

import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import type { RatingStyle } from '@/shared/types';
import styles from './RatingInput.module.css';

interface RatingInputProps {
    value: number | null;
    onChange: (value: number) => void;
    style?: RatingStyle;
    disabled?: boolean;
}

const RatingInput = ({ value, onChange, style = 'emoji', disabled = false }: RatingInputProps) => {
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    const displayValue = hoverValue ?? value ?? 0;

    const handleClick = (rating: number) => {
        if (!disabled) {
            onChange(rating);
        }
    };

    const handleMouseEnter = (rating: number) => {
        if (!disabled) {
            setHoverValue(rating);
        }
    };

    const handleMouseLeave = () => {
        setHoverValue(null);
    };

    if (style === 'numeric') {
        return (
            <div className={styles.container}>
                <div className={styles.numericGroup} role="radiogroup" aria-label="評価">
                    {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                            key={rating}
                            type="button"
                            className={`${styles.numericBtn} ${rating === value ? styles.numericSelected : ''}`}
                            onClick={() => handleClick(rating)}
                            aria-label={`${rating}点を選択`}
                            aria-checked={rating === value}
                            role="radio"
                            disabled={disabled}
                        >
                            {rating}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Default: emoji (star)
    return (
        <div className={styles.container}>
            <div className={styles.starGroup} role="radiogroup" aria-label="評価">
                {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                        key={rating}
                        type="button"
                        className={`${styles.star} ${rating <= displayValue ? styles.filled : styles.empty}`}
                        onClick={() => handleClick(rating)}
                        onMouseEnter={() => handleMouseEnter(rating)}
                        onMouseLeave={handleMouseLeave}
                        aria-label={`${rating}つ星を選択`}
                        aria-checked={rating === value}
                        role="radio"
                        disabled={disabled}
                    >
                        <FaStar />
                    </button>
                ))}
            </div>
            {value !== null && value > 0 && (
                <p className={styles.label}>{value}つ星</p>
            )}
        </div>
    );
};

export default RatingInput;
