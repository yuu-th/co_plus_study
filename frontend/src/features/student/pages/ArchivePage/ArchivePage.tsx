// ArchivePage - 実績ページ（カレンダー/スキルタブ）
// @see specs/features/archive.md

import {
    convertBadgeFromDB,
    convertCalendarDataFromDB,
    generateMonthlyDataFromCalendar,
    useAuth,
    useBadgesWithProgress,
    useCalendarData
} from '@/lib';
import { useMemo, useState } from 'react';
import CalendarView from '../../components/archive/CalendarView';
import SkillView from '../../components/archive/SkillView';
import styles from './ArchivePage.module.css';

type TabType = 'calendar' | 'skill';

const ArchivePage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('calendar');

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // Supabaseからデータ取得
    const { data: badgesData, isLoading: isLoadingBadges } = useBadgesWithProgress(user?.id);
    const { data: calendarData, isLoading: isLoadingCalendar } = useCalendarData(
        user?.id, 
        currentYear, 
        currentMonth
    );

    // DBデータをフロントエンド型に変換
    const badges = useMemo(() => {
        if (!badgesData) return [];
        return badgesData.map(convertBadgeFromDB);
    }, [badgesData]);

    const convertedCalendarData = useMemo(() => {
        if (!calendarData) return null;
        return convertCalendarDataFromDB(calendarData);
    }, [calendarData]);

    const monthlyData = useMemo(() => {
        if (!calendarData) return [];
        return generateMonthlyDataFromCalendar(
            calendarData.days,
            currentYear,
            currentMonth
        );
    }, [calendarData, currentYear, currentMonth]);

    const isLoading = isLoadingBadges || isLoadingCalendar;

    if (isLoading) {
        return (
            <div className={styles.page}>
                <header className={styles.header}>
                    <h1 className={styles.title}>実績</h1>
                </header>
                <div className={styles.loading}>読み込み中...</div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>実績</h1>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'calendar' ? styles.active : ''}`}
                        onClick={() => setActiveTab('calendar')}
                    >
                        カレンダー
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'skill' ? styles.active : ''}`}
                        onClick={() => setActiveTab('skill')}
                    >
                        メダル
                    </button>
                </div>
            </header>
            <div className={styles.content}>
                {activeTab === 'calendar' && convertedCalendarData && (
                    <CalendarView calendarData={convertedCalendarData} monthlyData={monthlyData} />
                )}
                {activeTab === 'skill' && <SkillView badges={badges} />}
            </div>
        </div>
    );
};

export default ArchivePage;
