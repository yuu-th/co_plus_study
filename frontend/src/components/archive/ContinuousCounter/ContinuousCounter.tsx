// ContinuousCounter - 連続ログイン日数を大きく表示

import { useEffect, useState } from 'react';
import styles from './ContinuousCounter.module.css';

interface ContinuousCounterProps {
  days: number;
  label?: string;
}

const ContinuousCounter = ({ days, label = '連続ログイン' }: ContinuousCounterProps) => {
  const [displayDays, setDisplayDays] = useState(0);

  // カウントアップアニメーション
  useEffect(() => {
    const duration = 2000; // 2秒
    const steps = 60;
    const increment = days / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.floor(increment * step), days);
      setDisplayDays(current);

      if (step >= steps) {
        clearInterval(timer);
        setDisplayDays(days);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [days]);

  return (
    <div className={styles.container}>
      <h2 className={styles.label}>{label}</h2>
      <div className={styles.counter}>
        <span className={styles.number}>{displayDays}</span>
        <span className={styles.unit}>日</span>
      </div>
    </div>
  );
};

export default ContinuousCounter;
