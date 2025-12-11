---
id: mentor-student-chat-switcher
feature: mentor
depends_on: []
scope_files:
  - frontend/src/features/mentor/components/StudentChatSwitcher/
  - frontend/src/features/mentor/pages/MentorChatPage/MentorChatPage.tsx
  - frontend/src/features/mentor/pages/MentorChatPage/MentorChatPage.module.css
forbidden_files:
  - frontend/src/shared/types/
  - frontend/src/features/student/
created_at: 2025-12-11
---

# タスク: メンター複数生徒チャット切替機能

> このファイルはサブエージェントへの作業指示書です。

## 0. 必読ファイル（スキップ禁止）

以下を **必ず読んでから** 作業開始:

1. `specs/overview.md` - システム全体像
2. `specs/features/mentor.md` - メンター管理機能の仕様（チャット切替セクション）
3. `specs/features/chat.md` - チャット機能の仕様
4. `specs/shared/conventions.md` - コーディング規約

## 1. タスク概要

メンターが担当する複数生徒のチャットを切り替えられるUIを実装する。サイドバーに生徒リストを表示し、選択した生徒とのチャット履歴を表示する。

## 2. 完了条件

- [ ] StudentChatSwitcher コンポーネント新規作成
- [ ] 生徒リスト表示（名前、未読バッジ）
- [ ] 生徒選択でチャット切替
- [ ] MentorChatPage に統合
- [ ] 選択中の生徒をハイライト
- [ ] TypeScriptエラーがないこと
- [ ] 仕様書（mentor.md）との整合性確認

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/features/mentor/components/StudentChatSwitcher/StudentChatSwitcher.tsx` | 新規作成 |
| `frontend/src/features/mentor/components/StudentChatSwitcher/StudentChatSwitcher.module.css` | 新規作成 |
| `frontend/src/features/mentor/components/StudentChatSwitcher/index.ts` | 新規作成 |
| `frontend/src/features/mentor/pages/MentorChatPage/MentorChatPage.tsx` | 編集 |
| `frontend/src/features/mentor/pages/MentorChatPage/MentorChatPage.module.css` | 編集 |

**上記以外は編集禁止**

## 4. 実装仕様

### StudentChatSwitcher.tsx

```typescript
import type { User } from '@/shared/types';
import styles from './StudentChatSwitcher.module.css';

interface StudentInfo {
    student: User;
    unreadCount: number;
    lastMessageTime: string;
}

interface StudentChatSwitcherProps {
    students: StudentInfo[];
    selectedStudentId: string | null;
    onSelectStudent: (studentId: string) => void;
}

const StudentChatSwitcher = ({
    students,
    selectedStudentId,
    onSelectStudent,
}: StudentChatSwitcherProps) => {
    return (
        <div className={styles.container}>
            <h3 className={styles.title}>担当生徒</h3>
            <ul className={styles.list}>
                {students.map(({ student, unreadCount, lastMessageTime }) => (
                    <li
                        key={student.id}
                        className={`${styles.item} ${
                            selectedStudentId === student.id ? styles.active : ''
                        }`}
                        onClick={() => onSelectStudent(student.id)}
                    >
                        <div className={styles.info}>
                            <span className={styles.name}>{student.name}</span>
                            <span className={styles.time}>
                                {new Date(lastMessageTime).toLocaleTimeString('ja-JP', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                        {unreadCount > 0 && (
                            <span className={styles.badge}>{unreadCount}</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudentChatSwitcher;
```

### StudentChatSwitcher.module.css

```css
.container {
  width: 250px;
  background-color: var(--color-bg-primary);
  border-right: 1px solid var(--color-border);
  padding: var(--spacing-md);
  height: 100%;
}

.title {
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item {
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  margin-bottom: var(--spacing-xs);
  transition: background-color var(--transition-base);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item:hover {
  background-color: var(--color-bg-hover);
}

.item.active {
  background-color: var(--color-accent-blue-light);
  border-left: 3px solid var(--color-accent-blue);
}

.info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.name {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.time {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.badge {
  background-color: var(--color-error);
  color: white;
  border-radius: var(--border-radius-full);
  padding: 2px 8px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
}
```

### MentorChatPage.tsx の変更

```typescript
import { useState } from 'react';
import StudentChatSwitcher from '../../components/StudentChatSwitcher';
import ChatRoom from '@/features/student/components/chat/ChatRoom';
import type { User, Message } from '@/shared/types';
import { mockStudents } from '@/shared/mockData/users';
import styles from './MentorChatPage.module.css';

const MentorChatPage = () => {
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

    // モックデータ: 担当生徒とチャット情報
    const studentChats = mockStudents.map(student => ({
        student,
        unreadCount: Math.floor(Math.random() * 5),
        lastMessageTime: new Date().toISOString(),
    }));

    return (
        <div className={styles.page}>
            <StudentChatSwitcher
                students={studentChats}
                selectedStudentId={selectedStudentId}
                onSelectStudent={setSelectedStudentId}
            />
            <div className={styles.chatArea}>
                {selectedStudentId ? (
                    <ChatRoom
                        partnerId={selectedStudentId}
                        partnerName={studentChats.find(s => s.student.id === selectedStudentId)?.student.name || ''}
                    />
                ) : (
                    <div className={styles.placeholder}>
                        左側から生徒を選択してください
                    </div>
                )}
            </div>
        </div>
    );
};

export default MentorChatPage;
```

### MentorChatPage.module.css の変更

```css
.page {
  display: flex;
  height: calc(100vh - 60px); /* ヘッダー分を引く */
}

.chatArea {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}
```

## 5. 参考実装

- `specs/features/mentor.md` - メンターチャット切替仕様
- `frontend/src/features/student/components/chat/ChatRoom/` - ChatRoomコンポーネント
- `frontend/src/shared/mockData/users.ts` - mockStudents確認

## 6. 技術的制約

- ❌ `any` 型禁止
- ❌ CSS値ハードコード禁止（CSS変数使用）
- ❌ 外部ライブラリ追加禁止
- ✅ `import type` で型をimport
- ✅ 既存のChatRoomコンポーネントを再利用

## 7. 完了報告

### タスクID: mentor-student-chat-switcher

### 作成/編集ファイル:
- `StudentChatSwitcher.tsx` - 生徒切替サイドバー
- `MentorChatPage.tsx` - チャット切替機能統合
- 対応するCSSファイル

### 主要な変更点:
- メンター向け生徒切替UI
- 未読バッジ表示
- サイドバー + チャットエリアのレイアウト

### 未解決の問題: なし
