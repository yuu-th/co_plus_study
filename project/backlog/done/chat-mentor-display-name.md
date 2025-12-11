---
id: chat-mentor-display-name
feature: chat
depends_on: []
scope_files:
  - frontend/src/features/student/pages/ChatPage/ChatPage.tsx
  - frontend/src/features/student/components/chat/MessageBubble/MessageBubble.tsx
forbidden_files:
  - frontend/src/shared/types/
created_at: 2025-12-11
---

# タスク: チャットでメンター名を「おにいさん・おねえさん」表示

> このファイルはサブエージェントへの作業指示書です。

## 0. 必読ファイル（スキップ禁止）

以下を **必ず読んでから** 作業開始:

1. `specs/overview.md` - システム全体像
2. `specs/features/chat.md` - チャット機能の仕様（メンター表示名セクション）
3. `specs/shared/conventions.md` - コーディング規約

## 1. タスク概要

生徒側のチャット画面で、メンターの実名を表示せず「おにいさん」「おねえさん」という親しみやすい呼称で表示する。

## 2. 完了条件

- [ ] ChatPage でメンター表示名を変換
- [ ] メンター性別に応じて「おにいさん」「おねえさん」を表示
- [ ] MessageBubble のヘッダーに反映
- [ ] 実名は内部的に保持（id等）
- [ ] TypeScriptエラーがないこと
- [ ] 仕様書（chat.md）との整合性確認

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/features/student/pages/ChatPage/ChatPage.tsx` | 編集 |
| `frontend/src/features/student/components/chat/MessageBubble/MessageBubble.tsx` | 編集（必要に応じて） |

**上記以外は編集禁止**

## 4. 実装仕様

### ChatPage.tsx の変更

```typescript
import { useMemo } from 'react';
import type { User } from '@/shared/types';
// ... 既存のimport

const ChatPage = () => {
    // メンター情報取得（モック）
    const mentor: User = {
        id: 'mentor-1',
        name: '佐藤先生',
        role: 'mentor',
        gender: 'female', // または 'male'
    };

    // メンター表示名の変換
    const mentorDisplayName = useMemo(() => {
        if (mentor.role !== 'mentor') return mentor.name;
        return mentor.gender === 'female' ? 'おねえさん' : 'おにいさん';
    }, [mentor]);

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h2>{mentorDisplayName}とのチャット</h2>
            </div>
            <ChatRoom
                partnerId={mentor.id}
                partnerName={mentorDisplayName}  // 変換後の名前を渡す
            />
        </div>
    );
};
```

### User型の拡張確認

`frontend/src/shared/types/user.ts` に `gender` フィールドがあるか確認:

```typescript
export interface User {
    id: string;
    name: string;
    role: 'student' | 'mentor' | 'admin';
    avatarUrl?: string;
    email?: string;
    grade?: string;
    gender?: 'male' | 'female';  // 存在しない場合は追加
}
```

### MessageBubble.tsx の変更（必要な場合）

すでに `partnerName` を props で受け取っている場合は変更不要。もし直接Userオブジェクトを受け取っている場合:

```typescript
interface MessageBubbleProps {
    message: Message;
    isMine: boolean;
    partnerName?: string;  // 追加
}

const MessageBubble = ({ message, isMine, partnerName }: MessageBubbleProps) => {
    const displayName = isMine ? 'あなた' : (partnerName || '相手');
    
    return (
        <div className={styles.container}>
            {!isMine && <span className={styles.senderName}>{displayName}</span>}
            {/* ... 既存のコード */}
        </div>
    );
};
```

## 5. 参考実装

- `specs/features/chat.md` - メンター表示名仕様
- `frontend/src/shared/mockData/users.ts` - メンターのgender設定

## 6. 技術的制約

- ❌ `any` 型禁止
- ❌ ハードコード禁止（gender値で条件分岐）
- ✅ `import type` で型をimport
- ✅ useMemo で表示名を最適化

## 7. 完了報告

### タスクID: chat-mentor-display-name

### 作成/編集ファイル:
- `ChatPage.tsx` - メンター表示名変換ロジック
- `user.ts` - gender フィールド追加（必要な場合）

### 主要な変更点:
- メンター名を「おにいさん・おねえさん」に変換
- 性別に応じた表示分岐
- 親しみやすいUI実現

### 未解決の問題: なし
