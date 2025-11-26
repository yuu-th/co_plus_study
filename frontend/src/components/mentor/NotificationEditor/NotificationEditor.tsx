import { useState } from 'react';
import type { NotificationDraft, NotificationCategory, Notification } from '../../../types';
import NotificationCard from '../../../components/notification/NotificationCard';
import styles from './NotificationEditor.module.css';

interface NotificationEditorProps {
  onSubmit: (draft: NotificationDraft) => void;
}

const CATEGORIES: NotificationCategory[] = ['info', 'important', 'event', 'achievement'];
const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  info: 'お知らせ',
  important: '重要',
  event: 'イベント',
  achievement: '達成',
};
const MAX_TITLE = 50;
const MAX_CONTENT = 500;

const NotificationEditor = ({ onSubmit }: NotificationEditorProps) => {
  const [draft, setDraft] = useState<NotificationDraft>({
    category: 'info',
    title: '',
    content: '',
  });
  const [isPreview, setIsPreview] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDraft(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(draft);
    setDraft({ category: 'info', title: '', content: '' });
  };

  const isSubmitDisabled = !draft.title.trim() || !draft.content.trim();

  const previewNotification: Notification = {
    id: 'preview',
    ...draft,
    message: draft.content,
    createdAt: new Date().toISOString(),
    read: false,
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.previewToggle}>
        <button onClick={() => setIsPreview(!isPreview)} type="button">
          {isPreview ? '編集に戻る' : 'プレビュー'}
        </button>
      </div>

      {isPreview ? (
        <div className={styles.preview}>
          <NotificationCard notification={previewNotification} onOpen={() => {}} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>カテゴリ</legend>
            <div className={styles.radioGroup}>
              {CATEGORIES.map(category => (
                <label key={category} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={draft.category === category}
                    onChange={handleChange}
                  />
                  {CATEGORY_LABELS[category]}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={styles.fieldset}>
            <label htmlFor="title" className={styles.label}>タイトル</label>
            <input
              id="title"
              name="title"
              type="text"
              value={draft.title}
              onChange={handleChange}
              maxLength={MAX_TITLE}
              required
              className={styles.input}
            />
          </fieldset>

          <fieldset className={styles.fieldset}>
            <label htmlFor="content" className={styles.label}>本文</label>
            <textarea
              id="content"
              name="content"
              value={draft.content}
              onChange={handleChange}
              maxLength={MAX_CONTENT}
              required
              className={styles.textarea}
              rows={8}
            />
          </fieldset>

          <div className={styles.actions}>
            <button type="submit" disabled={isSubmitDisabled}>
              投稿する
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default NotificationEditor;
