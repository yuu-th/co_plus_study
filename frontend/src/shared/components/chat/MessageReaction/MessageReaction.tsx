import type { MessageReaction as MessageReactionType } from '@/shared/types';
import styles from './MessageReaction.module.css';

interface MessageReactionProps {
    reactions: MessageReactionType[];
    currentUserId?: string;
    onToggle: (emoji: string) => void;
}

const MessageReaction = ({ reactions, currentUserId, onToggle }: MessageReactionProps) => {
    // 絵文字ごとに集計
    const reactionCounts = reactions.reduce((acc, r) => {
        if (!acc[r.emoji]) {
            acc[r.emoji] = { count: 0, userIds: [] };
        }
        acc[r.emoji].count++;
        acc[r.emoji].userIds.push(...r.userIds);
        return acc;
    }, {} as Record<string, { count: number; userIds: string[] }>);

    return (
        <div className={styles.container}>
            {Object.entries(reactionCounts).map(([emoji, { count, userIds }]) => {
                // userIdsはフラット化されているので、currentUserIdが含まれているかチェック
                // 注意: 元のデータ構造が { emoji: string, userIds: string[] }[] なので、
                // 同じemojiのエントリが複数ある場合を考慮して統合しています。
                // (通常はemojiごとに1つのエントリになるように管理されるべきですが、安全のため)
                const isActive = currentUserId ? userIds.includes(currentUserId) : false;

                return (
                    <button
                        key={emoji}
                        className={`${styles.reaction} ${isActive ? styles.active : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggle(emoji);
                        }}
                        aria-label={`${emoji}リアクション ${count}件 ${isActive ? '(選択中)' : ''}`}
                    >
                        <span className={styles.emoji}>{emoji}</span>
                        <span className={styles.count}>{count}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default MessageReaction;
