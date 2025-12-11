import { useState, useEffect } from 'react';
import styles from './DurationInput.module.css';

interface DurationInputProps {
    value: number; // 分単位の合計時間
    onChange: (minutes: number) => void;
    label?: string;
}

const DurationInput = ({ value, onChange, label }: DurationInputProps) => {
    const [hours, setHours] = useState(Math.floor(value / 60));
    const [minutes, setMinutes] = useState(value % 60);

    // 親コンポーネントからの値変更を反映
    useEffect(() => {
        setHours(Math.floor(value / 60));
        setMinutes(value % 60);
    }, [value]);

    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHours = parseInt(e.target.value) || 0;
        const validHours = Math.max(0, Math.min(999, newHours));
        setHours(validHours);
        onChange(validHours * 60 + minutes);
    };

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMinutes = parseInt(e.target.value) || 0;
        const validMinutes = Math.max(0, Math.min(59, newMinutes));
        setMinutes(validMinutes);
        onChange(hours * 60 + validMinutes);
    };

    return (
        <div className={styles.container}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={styles.inputs}>
                <div className={styles.field}>
                    <input
                        type="number"
                        value={hours}
                        onChange={handleHoursChange}
                        min={0}
                        max={999}
                        className={styles.input}
                        aria-label="時間"
                    />
                    <span className={styles.unit}>時間</span>
                </div>
                <div className={styles.field}>
                    <input
                        type="number"
                        value={minutes}
                        onChange={handleMinutesChange}
                        min={0}
                        max={59}
                        className={styles.input}
                        aria-label="分"
                    />
                    <span className={styles.unit}>分</span>
                </div>
            </div>
        </div>
    );
};

export default DurationInput;
