// HomePage - ホームページ（簡易実装）

import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>ようこそ、CO+ Studyへ！</h1>
      
      <div className={styles.grid}>
        <Card title="ARCHIVEを見る">
          <p className={styles.description}>
            あなたの学習の記録や獲得したバッジを確認できます。
          </p>
          <Link to="/archive">
            <Button variant="primary">ARCHIVEへ</Button>
          </Link>
        </Card>

        <Card title="学習日報を書く">
          <p className={styles.description}>
            今日の学習内容を記録しましょう。
          </p>
          <Link to="/diary">
            <Button variant="secondary">日報を書く</Button>
          </Link>
        </Card>

        <Card title="メンターに相談">
          <p className={styles.description}>
            分からないことがあれば、いつでも相談できます。
          </p>
          <Link to="/chat">
            <Button variant="outline">相談する</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
