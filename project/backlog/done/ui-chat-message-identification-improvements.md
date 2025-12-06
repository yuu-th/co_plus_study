---
id: ui-chat-message-identification-improvements
feature: chat
depends_on:
  - design-spec-chat-improvements
scope_files:
  - frontend/src/components/chat/MessageList/MessageList.tsx
  - frontend/src/components/chat/MessageList/MessageList.module.css
  - frontend/src/components/chat/ChatMessage/ChatMessage.tsx
  - frontend/src/components/chat/ChatMessage/ChatMessage.module.css
  - frontend/src/types/chat.ts
forbidden_files:
  - frontend/src/mockData/
  - frontend/src/pages/
created_at: 2025-11-27
---

# タスク: チャットメッセージ識別性向上（アイコン、色、位置改善）

> このファイルはサブエージェントへの作業指示書です。

## 0. 最初に必ず読むファイル（スキップ禁止）

| 順序 | ファイル | 読む目的 |
|------|----------|----------|
| 1 | `specs/overview.md` | システム全体像・技術制約 |
| 2 | `specs/features/chat.md` | 更新されたチャット仕様 |
| 3 | `specs/shared/conventions.md` | コーディング規約 |

## 1. タスク概要

チャットメッセージUIを改善し、「自分」「相手」の識別性を向上させる:

1. メッセージ吹き出しの配置最適化（左右）
2. アイコン表示（自分の左/相手の左）
3. 背景色の工夫（より区別しやすい）
4. 名前・時刻表示の最適化

## 2. 完了条件

- [ ] メッセージの左右配置が明確
- [ ] アイコンが自分/相手で区別される
- [ ] 背景色が十分コントラスト
- [ ] 名前・時刻表示が見やすい位置に配置
- [ ] TypeScriptエラーなし
- [ ] CSS変数を使用

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/components/chat/ChatMessage/ChatMessage.tsx` | 編集 |
| `frontend/src/components/chat/ChatMessage/ChatMessage.module.css` | 編集 |
| `frontend/src/components/chat/MessageList/MessageList.tsx` | 編集 |
| `frontend/src/components/chat/MessageList/MessageList.module.css` | 編集 |
| `frontend/src/types/chat.ts` | 編集（必要に応じて） |

## 4. 実装仕様

### ChatMessage コンポーネント

```tsx
// ChatMessage.tsx

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;  // true = 自分のメッセージ
}

const ChatMessage = ({ message, isOwn }: ChatMessageProps) => {
  const messageClass = isOwn ? styles.ownMessage : styles.otherMessage;
  const containerClass = `${styles.container} ${isOwn ? styles.ownContainer : styles.otherContainer}`;

  return (
    <div className={containerClass}>
      {/* アイコン（相手の場合は左、自分の場合は右） */}
      {!isOwn && <img src={avatarUrl} alt={message.senderName} className={styles.avatar} />}
      
      <div className={styles.messageGroup}>
        {/* 名前・時刻表示 */}
        <div className={styles.meta}>
          <span className={styles.senderName}>{message.senderName}</span>
          <span className={styles.timestamp}>{formatTime(message.timestamp)}</span>
        </div>
        
        {/* メッセージ本体 */}
        <div className={messageClass}>
          {message.content}
        </div>
      </div>
      
      {isOwn && <img src={avatarUrl} alt="You" className={styles.avatar} />}
    </div>
  );
};
```

### スタイリング

```css
/* ChatMessage.module.css */

.container {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  align-items: flex-end;
}

.ownContainer {
  flex-direction: row-reverse;  /* アイコンを右に */
  justify-content: flex-end;
}

.otherContainer {
  flex-direction: row;           /* アイコンを左に */
  justify-content: flex-start;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.messageGroup {
  display: flex;
  flex-direction: column;
  max-width: 70%;
  gap: 2px;
}

.ownContainer .messageGroup {
  align-items: flex-end;
}

.otherContainer .messageGroup {
  align-items: flex-start;
}

.meta {
  display: flex;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.senderName {
  font-weight: bold;
}

.timestamp {
  opacity: 0.7;
}

/* メッセージ本体 */
.ownMessage {
  background-color: var(--color-message-own);      /* #DCF8C6 */
  color: var(--color-text-primary);
  border-radius: 16px 2px 16px 16px;               /* 右下が尖る */
  padding: var(--spacing-sm) var(--spacing-md);
  word-wrap: break-word;
}

.otherMessage {
  background-color: var(--color-message-other);    /* #ECECEC */
  color: var(--color-text-primary);
  border-radius: 2px 16px 16px 16px;               /* 左下が尖る */
  padding: var(--spacing-sm) var(--spacing-md);
  word-wrap: break-word;
}

/* モバイルでは max-width を80%に */
@media (max-width: 600px) {
  .messageGroup {
    max-width: 85%;
  }
}
```

### MessageList コンポーネント

```tsx
// MessageList.tsx
// 既存のコンポーネントを修正

const MessageList = ({ messages }: MessageListProps) => {
  const currentUserId = '1';  // 現在ユーザーID（モック）

  return (
    <div className={styles.messageList}>
      {messages.map(msg => (
        <ChatMessage
          key={msg.id}
          message={msg}
          isOwn={msg.senderId === currentUserId}
        />
      ))}
    </div>
  );
};
```

### CSS変数定義

既存の `styles/variables.css` に以下を確認:

```css
:root {
  --color-message-own: #DCF8C6;      /* 自分: 緑系 */
  --color-message-other: #ECECEC;    /* 相手: グレー */
  --color-message-timestamp: #999999;
  --color-online: #34B7F1;
  --color-offline: #CCCCCC;
}
```

## 5. オプション: オンライン表示

ChatHeader に相手のオンライン状態を表示:

```tsx
// ChatHeader.tsx に追加
<div className={styles.statusIndicator}>
  <span className={isOnline ? styles.online : styles.offline}></span>
  <span>{isOnline ? 'オンライン' : 'オフライン'}</span>
</div>
```

## 6. 注意事項

- アバター画像は `mockData` から取得
- 時刻フォーマットは「14:30」など簡潔に
- モバイル対応を確認

## 7. 完了報告

```markdown
## 完了報告

### タスクID
ui-chat-message-identification-improvements

### 編集ファイル
- ChatMessage.tsx - 編集（配置改善、アイコン追加）
- ChatMessage.module.css - 編集（大幅改善）
- MessageList.tsx - 編集（isOwn判定追加）
- MessageList.module.css - 編集

### 主要な変更点
- メッセージ左右配置を明確化（自分=右、相手=左）
- アイコンを配置（自分=右、相手=左）
- 吹き出し形状を区別（左下尖/右下尖）
- 名前・時刻表示の見やすさ向上

### 未解決の問題
- なし
```
