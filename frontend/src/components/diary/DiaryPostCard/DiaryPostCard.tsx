import { useCallback, useState } from 'react';
import type { DiaryPost, Reaction, ReactionType } from '../../../types';
import ReactionButton from '../ReactionButton/ReactionButton';
import styles from './DiaryPostCard.module.css';

interface DiaryPostCardProps {
  post: DiaryPost;
  /** 現在操作中のメンター(またはユーザー)ID。未指定ならトグル不可 */
  currentUserId?: string;
  /** リアクションが更新されたとき外部へ通知 */
  onReactionsChange?: (postId: string, reactions: Reaction[]) => void;
}

const subjectColorMap: Record<string,string> = {
  '国語': 'var(--color-subject-japanese,#FF6B9D)',
  '算数': 'var(--color-subject-math,#4169E1)',
  '理科': 'var(--color-subject-science,#32CD32)',
  '社会': 'var(--color-subject-social,#FF8C00)',
  '英語': 'var(--color-subject-english,#9370DB)',
  'その他': 'var(--color-subject-other,#808080)',
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString('ja-JP',{ hour:'2-digit', minute:'2-digit' });
};

const reactionTypes: ReactionType[] = ['👍','❤️','🎉','👏','🔥'];

const DiaryPostCard = ({ post, currentUserId, onReactionsChange }: DiaryPostCardProps) => {
  const color = subjectColorMap[post.subject] || subjectColorMap['その他'];
  const [reactions, setReactions] = useState<Reaction[]>(post.reactions);

  const toggleReaction = useCallback((type: ReactionType) => {
    if (!currentUserId) return; // 操作ユーザー不明なら何もしない
    setReactions(prev => {
      const existing = prev.find(r => r.type === type);
      let next: Reaction[];
      if (!existing) {
        next = [...prev, { type, count: 1, userIds: [currentUserId] }];
      } else {
        const isActive = existing.userIds.includes(currentUserId);
        const newUserIds = isActive
          ? existing.userIds.filter(id => id !== currentUserId)
          : [...existing.userIds, currentUserId];
        const updated: Reaction = { ...existing, userIds: newUserIds, count: newUserIds.length };
        next = newUserIds.length === 0
          ? prev.filter(r => r.type !== type) // 全員外したら削除
          : prev.map(r => r.type === type ? updated : r);
      }
      if (onReactionsChange) onReactionsChange(post.id, next);
      return next;
    });
  }, [currentUserId, onReactionsChange, post.id]);

  const getCount = (type: ReactionType) => reactions.find(r => r.type === type)?.count || 0;
  const isActive = (type: ReactionType) => !!reactions.find(r => r.type === type && currentUserId && r.userIds.includes(currentUserId));

  return (
    <article className={styles.card} aria-label={`${post.subject}の学習記録`}>
      <div className={styles.left} style={{ color }}>
        <div className={styles.subject}>{post.subject}</div>
        <div className={styles.time}>{formatTime(post.timestamp)}</div>
      </div>
      <div className={styles.content}>
        <p>{post.content}</p>
        <div className={styles.meta}>{post.duration}分 / {post.userName}</div>
        <div className={styles.reactionBar} aria-label="リアクション操作">
          {reactionTypes.map(rt => (
            <ReactionButton
              key={rt}
              type={rt}
              count={getCount(rt)}
              isActive={isActive(rt)}
              onToggle={() => toggleReaction(rt)}
            />
          ))}
        </div>
      </div>
    </article>
  );
};

export default DiaryPostCard;
