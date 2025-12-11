// LoginPage - メンターログインページ

import styles from './LoginPage.module.css';

const LoginPage = () => {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.title}>CO+ Study メンター</h1>
                <p className={styles.subtitle}>学びをサポートする</p>
                <p className={styles.note}>※ ログイン機能は実装中です</p>
            </div>
        </div>
    );
};

export default LoginPage;
