// @see specs/features/home.md
// RegisterPage - メンターアカウント登録画面

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/shared/components/Button';
import styles from './RegisterPage.module.css';

interface MentorRegistrationForm {
    name: string;
    kana: string;
    schoolName: string;
    grade: string;
    specialty: string;
}

const GRADES = ['1年', '2年', '3年', '4年', '5年', '専攻科1年', '専攻科2年'];

const RegisterPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState<MentorRegistrationForm>({
        name: '',
        kana: '',
        schoolName: '',
        grade: '1年',
        specialty: '',
    });
    const [errors, setErrors] = useState<string[]>([]);

    const validate = (): boolean => {
        const errs: string[] = [];

        if (!form.name.trim()) {
            errs.push('名前を入力してください');
        } else if (form.name.length > 20) {
            errs.push('名前は20文字以内です');
        }

        if (!form.kana.trim()) {
            errs.push('フリガナを入力してください');
        } else if (!/^[ぁ-んァ-ヴー\s]+$/.test(form.kana)) {
            errs.push('フリガナはひらがなまたはカタカナで入力してください');
        }

        if (!form.schoolName.trim()) {
            errs.push('高専名を入力してください');
        }

        if (!form.specialty.trim()) {
            errs.push('専門分野を入力してください');
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
        // メンターダッシュボードへ遷移
        navigate('/mentor/dashboard');
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.title}>メンター登録</h1>
                <p className={styles.subtitle}>CO+ Study メンターへようこそ！</p>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label htmlFor="name" className={styles.label}>
                            名前 <span className={styles.required}>*</span>
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="山田 太郎"
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
                        <label htmlFor="schoolName" className={styles.label}>
                            高専名 <span className={styles.required}>*</span>
                        </label>
                        <input
                            id="schoolName"
                            name="schoolName"
                            type="text"
                            value={form.schoolName}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="○○工業高等専門学校"
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="grade" className={styles.label}>
                            学年 <span className={styles.required}>*</span>
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

                    <div className={styles.field}>
                        <label htmlFor="specialty" className={styles.label}>
                            専門分野 <span className={styles.required}>*</span>
                        </label>
                        <input
                            id="specialty"
                            name="specialty"
                            type="text"
                            value={form.specialty}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="例: 情報工学、機械工学、電気工学"
                            required
                        />
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

export default RegisterPage;
