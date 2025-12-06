// @see specs/features/home.md
// AccountRegistrationPage - アカウント登録画面

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import styles from './AccountRegistrationPage.module.css';

interface RegistrationForm {
  name: string;
  kana: string;
  grade: string;
}

const GRADES = [
  '小1', '小2', '小3', '小4', '小5', '小6',
  '中1', '中2', '中3',
];

const AccountRegistrationPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegistrationForm>({
    name: '',
    kana: '',
    grade: '小1',
  });
  const [errors, setErrors] = useState<string[]>([]);

  const validate = (): boolean => {
    const errs: string[] = [];

    if (!form.name.trim()) {
      errs.push('ユーザー名を入力してください');
    } else if (form.name.length > 20) {
      errs.push('ユーザー名は20文字以内です');
    }

    if (!form.kana.trim()) {
      errs.push('フリガナを入力してください');
    } else if (!/^[ぁ-んァ-ヴー\s]+$/.test(form.kana)) {
      errs.push('フリガナはひらがなまたはカタカナで入力してください');
    }

    setErrors(errs);
    return errs.length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // モックデータに登録（実装時はバックエンドへ）
    // ここでは単にホームへ遷移
    navigate('/');
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>アカウント登録</h1>
        <p className={styles.subtitle}>Co+ Study へようこそ！</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              ユーザー名 <span className={styles.required}>*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="やまだ たろう"
              maxLength={20}
              required
            />
            <p className={styles.hint}>最大20文字</p>
          </div>

          <div className={styles.field}>
            <label htmlFor="kana" className={styles.label}>
              フリガナ <span className={styles.required}>*</span>
            </label>
            <input
              id="kana"
              name="kana"
              type="text"
              value={form.kana}
              onChange={handleChange}
              className={styles.input}
              placeholder="ヤマダ タロウ"
              required
            />
            <p className={styles.hint}>ひらがなまたはカタカナ</p>
          </div>

          <div className={styles.field}>
            <label htmlFor="grade" className={styles.label}>
              学年
            </label>
            <select
              id="grade"
              name="grade"
              value={form.grade}
              onChange={handleChange}
              className={styles.select}
            >
              {GRADES.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {errors.length > 0 && (
            <div className={styles.errorContainer} role="alert">
              {errors.map((e, i) => (
                <p key={i} className={styles.error}>{e}</p>
              ))}
            </div>
          )}

          <div className={styles.actions}>
            <Button type="submit" variant="primary">
              登録する
            </Button>
          </div>
        </form>

        <p className={styles.footer}>
          登録することで、利用規約に同意します
        </p>
      </div>
    </div>
  );
};

export default AccountRegistrationPage;
