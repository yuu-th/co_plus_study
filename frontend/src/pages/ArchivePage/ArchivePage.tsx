// ArchivePage - ARCHIVEページ（カレンダー/スキルタブ）

import { useState } from 'react';
import CalendarView from '../../components/archive/CalendarView';
import SkillView from '../../components/archive/SkillView';
import { mockBadges } from '../../mockData/badges';
import { mockCalendarData, mockMonthlyData } from '../../mockData/calendar';
import styles from './ArchivePage.module.css';

type TabType = 'calendar' | 'skill';

const ArchivePage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('calendar');

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>ARCHIVE</h1>
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
        {activeTab === 'calendar' && (
          <CalendarView calendarData={mockCalendarData} monthlyData={mockMonthlyData} />
        )}
        {activeTab === 'skill' && <SkillView badges={mockBadges} />}
      </div>
    </div>
  );
};

export default ArchivePage;
