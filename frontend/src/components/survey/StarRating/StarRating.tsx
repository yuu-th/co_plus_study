// @see specs/features/survey.md
// StarRating - 星評価コンポーネント

import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import styles from './StarRating.module.css';

interface StarRatingProps {
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const StarRating = ({ value, onChange, disabled = false }: StarRatingProps) => {
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

export default StarRating;
