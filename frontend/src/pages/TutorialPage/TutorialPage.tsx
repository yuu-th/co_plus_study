// TutorialPage - チュートリアルページ（簡易実装）

import styles from './TutorialPage.module.css';

const TutorialPage = () => {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>チュートリアル</h1>
      <p className={styles.comingSoon}>チュートリアル機能は実装中です</p>
    </div>
  );
};

export default TutorialPage;
