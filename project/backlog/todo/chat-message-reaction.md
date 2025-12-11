---
id: chat-message-reaction
feature: chat
depends_on: []
scope_files:
  - frontend/src/shared/components/chat/MessageReaction/
  - frontend/src/shared/components/chat/ReactionPicker/
  - frontend/src/features/student/components/chat/MessageBubble/MessageBubble.tsx
  - frontend/src/features/student/components/chat/MessageBubble/MessageBubble.module.css
forbidden_files:
  - frontend/src/shared/types/chat.ts
created_at: 2025-12-11
---

# タスク: チャットメッセージリアクション機能

> このファイルはサブエージェントへの作業指示書です。

## 0. 必読ファイル（スキップ禁止）

以下を **必ず読んでから** 作業開始:

1. `specs/overview.md` - システム全体像
2. `specs/features/chat.md` - チャット機能の仕様（MessageReaction/ReactionPickerセクション）
3. `specs/shared/conventions.md` - コーディング規約

## 1. タスク概要

チャットメッセージに絵文字リアクション機能を追加する。メッセージをホバー/長押しでリアクションピッカーを表示し、選択したリアクションをメッセージに追加する。

## 2. 完了条件

- [ ] MessageReaction コンポーネント新規作成
- [ ] ReactionPicker コンポーネント新規作成
- [ ] MessageBubble にリアクション表示追加
- [ ] ホバー時にリアクション追加ボタン表示
- [ ] リアクションピッカーで絵文字選択
- [ ] TypeScriptエラーがないこと
- [ ] 仕様書（chat.md）との整合性確認

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/shared/components/chat/MessageReaction/MessageReaction.tsx` | 新規作成 |
| `frontend/src/shared/components/chat/MessageReaction/MessageReaction.module.css` | 新規作成 |
| `frontend/src/shared/components/chat/MessageReaction/index.ts` | 新規作成 |
| `frontend/src/shared/components/chat/ReactionPicker/ReactionPicker.tsx` | 新規作成 |
| `frontend/src/shared/components/chat/ReactionPicker/ReactionPicker.module.css` | 新規作成 |
| `frontend/src/shared/components/chat/ReactionPicker/index.ts` | 新規作成 |
| `frontend/src/features/student/components/chat/MessageBubble/MessageBubble.tsx` | 編集 |
| `frontend/src/features/student/components/chat/MessageBubble/MessageBubble.module.css` | 編集 |

**上記以外は編集禁止**

## 4. 実装仕様

### MessageReaction.tsx

```typescript
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
        acc[r.emoji].userIds.push(r.userId);
        return acc;
    }, {} as Record<string, { count: number; userIds: string[] }>);

    return (
        <div className={styles.container}>
            {Object.entries(reactionCounts).map(([emoji, { count, userIds }]) => {
                const isActive = currentUserId ? userIds.includes(currentUserId) : false;
                return (
                    <button
                        key={emoji}
                        className={`${styles.reaction} ${isActive ? styles.active : ''}`}
                        onClick={() => onToggle(emoji)}
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
```

### MessageReaction.module.css

```css
.container {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
  margin-top: var(--spacing-xs);
}

.reaction {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-full);
  cursor: pointer;
  transition: all var(--transition-base);
}

.reaction:hover {
  background-color: var(--color-bg-hover);
  transform: scale(1.05);
}

.reaction.active {
  background-color: var(--color-accent-blue-light);
  border-color: var(--color-accent-blue);
}

.emoji {
  font-size: 16px;
}

.count {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}
```

### ReactionPicker.tsx

```typescript
import styles from './ReactionPicker.module.css';

interface ReactionPickerProps {
    onSelect: (emoji: string) => void;
    onClose: () => void;
}

const ReactionPicker = ({ onSelect, onClose }: ReactionPickerProps) => {
    const emojis = ['👍', '❤️', '😊', '🎉', '👏', '🔥'];

    const handleSelect = (emoji: string) => {
        onSelect(emoji);
        onClose();
    };

    return (
        <>
            <div className={styles.overlay} onClick={onClose} />
            <div className={styles.picker}>
                {emojis.map((emoji) => (
                    <button
                        key={emoji}
                        className={styles.emojiButton}
                        onClick={() => handleSelect(emoji)}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </>
    );
};

export default ReactionPicker;
```

### ReactionPicker.module.css

```css
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  z-index: 999;
}

.picker {
  position: absolute;
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-xs);
  display: flex;
  gap: var(--spacing-xs);
  box-shadow: var(--shadow-md);
  z-index: 1000;
}

.emojiButton {
  padding: var(--spacing-xs);
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  border-radius: var(--border-radius-sm);
  transition: background-color var(--transition-base);
}

.emojiButton:hover {
  background-color: var(--color-bg-hover);
}
```

### MessageBubble.tsx の変更

```typescript
import { useState } from 'react';
import MessageReaction from '@/shared/components/chat/MessageReaction';
import ReactionPicker from '@/shared/components/chat/ReactionPicker';
// ... 既存のimport

const MessageBubble = ({ message, isMine, currentUserId, onReactionToggle }: MessageBubbleProps) => {
    const [showPicker, setShowPicker] = useState(false);

    const handleReactionToggle = (emoji: string) => {
        if (!currentUserId) return;
        onReactionToggle?.(message.id, emoji);
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.bubble} ${isMine ? styles.mine : styles.theirs}`}>
                {message.content && <p className={styles.text}>{message.content}</p>}
                <span className={styles.timestamp}>
                    {new Date(message.timestamp).toLocaleTimeString('ja-JP', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </span>
                
                {/* ホバー時のリアクション追加ボタン */}
                <button
                    className={styles.addReactionBtn}
                    onClick={() => setShowPicker(true)}
                    aria-label="リアクションを追加"
                >
                    ➕
                </button>

                {showPicker && (
                    <ReactionPicker
                        onSelect={handleReactionToggle}
                        onClose={() => setShowPicker(false)}
                    />
                )}
            </div>

            {message.reactions && message.reactions.length > 0 && (
                <MessageReaction
                    reactions={message.reactions}
                    currentUserId={currentUserId}
                    onToggle={handleReactionToggle}
                />
            )}
        </div>
    );
};
```

### MessageBubble.module.css の追加

```css
.container {
  position: relative;
}

.addReactionBtn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  opacity: 0;
  transition: opacity var(--transition-base);
}

.container:hover .addReactionBtn {
  opacity: 1;
}
```

## 5. 参考実装

- `specs/features/chat.md` - MessageReaction/ReactionPicker仕様
- `frontend/src/shared/types/chat.ts` - MessageReaction型確認

## 6. 技術的制約

- ❌ `any` 型禁止
- ❌ CSS値ハードコード禁止
- ❌ 外部絵文字ライブラリ禁止
- ✅ `import type` で型をimport
- ✅ シンプルな絵文字文字列を使用

## 7. 完了報告

### タスクID: chat-message-reaction

### 作成/編集ファイル:
- `MessageReaction.tsx` - リアクション表示コンポーネント
- `ReactionPicker.tsx` - リアクション選択UI
- `MessageBubble.tsx` - リアクション統合

### 主要な変更点:
- メッセージリアクション機能追加
- ホバー時リアクション追加ボタン
- 絵文字ピッカー実装

### 未解決の問題: なし
