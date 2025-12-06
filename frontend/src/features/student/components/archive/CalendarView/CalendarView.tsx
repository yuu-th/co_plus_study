// CalendarView - カレンダータブの表示

import type { CalendarData, MonthData } from '../../../types/calendar';
import ContinuousCounter from '../ContinuousCounter';
import MonthlyCalendar from '../MonthlyCalendar';
import WeeklyActivity from '../WeeklyActivity';
import styles from './CalendarView.module.css';

interface CalendarViewProps {
    calendarData: CalendarData;
    monthlyData: MonthData[];
}

const CalendarView = ({ calendarData, monthlyData }: CalendarViewProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.leftSection}>
                <ContinuousCounter days={calendarData.continuousDays} />
                <div className={styles.weeklySection}>
                    <WeeklyActivity week={calendarData.weeklyActivity} />
                </div>
            </div>
            <div className={styles.rightSection}>
                <div className={styles.calendars}>
                    {monthlyData.map((monthData) => (
                        <MonthlyCalendar
                            key={`${monthData.year}-${monthData.month}`}
                            year={monthData.year}
                            month={monthData.month}
                            activityDays={monthData.activityDays}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
