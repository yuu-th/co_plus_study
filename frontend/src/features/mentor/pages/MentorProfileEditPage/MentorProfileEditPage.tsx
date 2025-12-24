import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/shared/components/Button';
import { useAuth } from '@/lib';
import styles from './MentorProfileEditPage.module.css';
import Card from '@/shared/components/Card';

const MentorProfileEditPage = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { profile, updateProfile } = useAuth();

    const [form, setForm] = useState({
        displayName: '',
        avatarUrl: '',
        introduction: '',
    });

    // プロフィール読み込み時に初期値をセット
    useEffect(() => {
        if (profile) {
            setForm({
                displayName: profile.display_name ?? '',
                avatarUrl: profile.avatar_url ?? '',
                introduction: profile.introduction ?? '',
            });
        }
    }, [profile]);

    const [errors, setErrors] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const validate = (): boolean => {
        const errs: string[] = [];
        if (!form.displayName.trim()) {
            errs.push('名前を入力してください');
        }
        if (form.displayName.length > 50) {
            errs.push('名前は50文字以内で入力してください');
        }
        if (form.introduction.length > 500) {
            errs.push('自己紹介は500文字以内で入力してください');
        }
        setErrors(errs);
        return errs.length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSaving(true);

        try {
            const { error } = await updateProfile({
                display_name: form.displayName,
                avatar_url: form.avatarUrl || null,
                introduction: form.introduction || null,
            });

            if (error) {
                throw error;
            }

            alert('プロフィールを更新しました');
            navigate('/mentor/dashboard');
        } catch (error) {
            console.error('プロフィール更新エラー:', error);
            alert('プロフィールの更新に失敗しました');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm(prev => ({ ...prev, avatarUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>プロフィール編集</h1>
                <p className={styles.subtitle}>公開されるプロフィール情報を編集できます</p>
            </div>

            <Card className={styles.editorCard}>
                <form onSubmit={handleSubmit} className={styles.formSplit}>
                    {/* 左側: アバター */}
                    <div className={styles.sideCol}>
                        <div className={styles.avatarMain}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                            <div
                                className={styles.avatarCircle}
                                onClick={() => fileInputRef.current?.click()}
                                title="画像を変更"
                            >
                                {form.avatarUrl ? (
                                    <div className={styles.avatarContainer}>
                                        <img src={form.avatarUrl} alt="Preview" className={styles.avatarImg} />
                                        <div className={styles.avatarOverlay}>変更</div>
                                    </div>
                                ) : (
                                    <div className={styles.avatarInitials}>
                                        {form.displayName.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="small"
                                className={styles.uploadBtn}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                画像を変更
                            </Button>
                        </div>
                    </div>

                    {/* 右側: フォーム項目 */}
                    <div className={styles.mainCol}>
                        <div className={styles.fieldGroup}>
                            <div className={styles.field}>
                                <label className={styles.label}>氏名 / 表示名 <span className={styles.required}>*</span></label>
                                <input
                                    type="text"
                                    name="displayName"
                                    value={form.displayName}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="例: 山田 太郎"
                                />
                            </div>

                            {/* 学年（ユーザー要望の画像1枚目にあった項目を追加） */}
                            <div className={styles.field}>
                                <label className={styles.label}>担当 / 学年</label>
                                <select className={styles.input}>
                                    <option value="中学生">中学生</option>
                                    <option value="高校生">高校生</option>
                                    <option value="高専生">高専生</option>
                                    <option value="その他">その他</option>
                                </select>
                            </div>

                            {/* 専門分野はDBにカラムがないため一時的に非表示
                            <div className={styles.field}>
                                <label className={styles.label}>専門分野 (カンマ区切り)</label>
                                <input
                                    type="text"
                                    name="specialties"
                                    value=""
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="数学, 英語, 進路指導..."
                                />
                            </div>
                            */}

                            <div className={styles.field}>
                                <label className={styles.label}>自己紹介 (500文字以内)</label>
                                <textarea
                                    name="introduction"
                                    value={form.introduction}
                                    onChange={handleChange}
                                    className={styles.textarea}
                                    rows={6}
                                    placeholder="あなたの経歴や大切にしている教育方針などを入力してください"
                                />
                                <div className={styles.charCount}>
                                    {form.introduction.length} / 500
                                </div>
                            </div>
                        </div>

                        {errors.length > 0 && (
                            <div className={styles.errorBox}>
                                {errors.map((e, i) => <div key={i} className={styles.errorMsg}>• {e}</div>)}
                            </div>
                        )}

                        <div className={styles.footerActions}>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => navigate('/mentor/dashboard')}
                                disabled={isSaving}
                            >
                                キャンセル
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                            >
                                {isSaving ? '保存中...' : '変更を保存する'}
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default MentorProfileEditPage;
