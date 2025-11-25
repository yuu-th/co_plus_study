// SurveyPage - アンケートページ Phase 実装
import { useState } from 'react';
import SurveyForm from '../../components/survey/SurveyForm/SurveyForm';
import { mockSurveys } from '../../mockData/surveys';
import type { Survey, SurveyResponse } from '../../types';
import styles from './SurveyPage.module.css';

const SurveyPage = () => {
  const [surveys] = useState<Survey[]>(mockSurveys);
  const [selectedId, setSelectedId] = useState<string>(surveys[0]?.id || '');
  const [responses, setResponses] = useState<SurveyResponse[]>([]);

  const selected = surveys.find(s => s.id === selectedId);

  const handleSubmit = (resp: SurveyResponse) => {
    setResponses(prev => [...prev, resp]);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>アンケート</h1>
      <div className={styles.layout}>
        <aside className={styles.list} aria-label="アンケート一覧">
          <h2 className={styles.listTitle}>一覧</h2>
          <ul>
            {surveys.map(s => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(s.id)}
                  aria-current={selectedId === s.id}
                  style={{
                    display:'block',
                    width:'100%',
                    textAlign:'left',
                    padding:'6px 8px',
                    border:'1px solid #ddd',
                    borderRadius:'6px',
                    background: selectedId === s.id ? '#eef5ff' : '#fff',
                    marginBottom:'4px'
                  }}
                >{s.title}</button>
              </li>
            ))}
          </ul>
        </aside>
        <main className={styles.main}>
          {selected ? (
            <SurveyForm survey={selected} onSubmit={handleSubmit} />
          ) : (
            <p>アンケートがありません</p>
          )}
        </main>
        <aside className={styles.side} aria-label="回答履歴">
          <h2 className={styles.listTitle}>回答履歴</h2>
          {responses.length === 0 && <p>まだ回答はありません</p>}
          {responses.map(r => (
            <div key={r.submittedAt} style={{ fontSize:'0.75rem', marginBottom:'4px' }}>
              {r.surveyId} / {new Date(r.submittedAt).toLocaleString('ja-JP')}
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default SurveyPage;
