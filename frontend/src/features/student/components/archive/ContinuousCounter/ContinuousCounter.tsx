// ContinuousCounter - 連続ログイン日数を大きく表示

import { useEffect, useState } from 'react';
import styles from './ContinuousCounter.module.css';

interface ContinuousCounterProps {
    days: number;
    label?: string;
    longestStreak?: number;
    totalDays?: number;
}

const ContinuousCounter = ({ days, label = '連続ログイン', longestStreak, totalDays }: ContinuousCounterProps) => {
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
            <div className={styles.mainStat}>
                <h2 className={styles.label}>{label}</h2>
                <div className={styles.counter}>
                    <span className={styles.number}>{displayDays}</span>
                    <span className={styles.unit}>日</span>
                </div>
            </div>

            {(longestStreak !== undefined || totalDays !== undefined) && (
                <div className={styles.subStats}>
                    {longestStreak !== undefined && (
                        <div className={styles.subStatItem}>
                            <span className={styles.subLabel}>最長</span>
                            <span className={styles.subValue}>{longestStreak}日</span>
                        </div>
                    )}
                    {longestStreak !== undefined && totalDays !== undefined && (
                        <div className={styles.separator} />
                    )}
                    {totalDays !== undefined && (
                        <div className={styles.subStatItem}>
                            <span className={styles.subLabel}>累計</span>
                            <span className={styles.subValue}>{totalDays}日</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ContinuousCounter;
