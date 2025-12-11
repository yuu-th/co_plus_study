---
id: home-profile-grade-field
feature: home
depends_on: []
scope_files:
  - frontend/src/features/student/pages/ProfilePage/ProfilePage.tsx
  - frontend/src/shared/mockData/users.ts
  - frontend/src/shared/types/user.ts
forbidden_files:
  - frontend/src/features/mentor/
created_at: 2025-12-11
---

# タスク: プロフィールに学年フィールド追加

> このファイルはサブエージェントへの作業指示書です。

## 0. 必読ファイル（スキップ禁止）

以下を **必ず読んでから** 作業開始:

1. `specs/overview.md` - システム全体像
2. `specs/features/home.md` - ホーム画面機能の仕様（UserProfile型）
3. `specs/shared/conventions.md` - コーディング規約

## 1. タスク概要

プロフィール画面に学年フィールドを追加し、ユーザーの学年情報を表示できるようにする。User型にgradeフィールドを追加し、モックデータとProfilePageを更新する。

## 2. 完了条件

- [ ] User型にgradeフィールド追加（optional）
- [ ] mockCurrentUser にgrade値を追加
- [ ] ProfilePage に学年表示UI追加
- [ ] TypeScriptエラーがないこと
- [ ] 仕様書（home.md）との整合性確認

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/shared/types/user.ts` | 編集（gradeフィールド追加） |
| `frontend/src/shared/mockData/users.ts` | 編集（gradeデータ追加） |
| `frontend/src/features/student/pages/ProfilePage/ProfilePage.tsx` | 編集（学年表示追加） |

**上記以外は編集禁止**

## 4. 実装仕様

### user.ts の変更

```typescript
export interface User {
    id: string;
    name: string;
    role: 'student' | 'mentor' | 'admin';
    avatarUrl?: string;
    email?: string;
    grade?: string;  // 追加: 学年（例: "小学6年", "中学2年"）
}
```

### users.ts の変更

```typescript
export const mockCurrentUser: User = {
    id: '1',
    name: '田中太郎',
    role: 'student',
    grade: '中学2年',  // 追加
};
```

### ProfilePage.tsx の変更

**UserProfile interfaceを更新:**
```typescript
interface UserProfile {
    id: string;
    name: string;
    kana: string;
    avatarUrl?: string;
    joinedAt: string;
    totalStudyHours: number;
    totalPosts: number;
    grade?: string;  // 追加
}
```

**モックデータに学年追加:**
```typescript
const user: UserProfile = {
    id: '1',
    name: '田中太郎',
    kana: 'たなかたろう',
    avatarUrl: undefined,
    joinedAt: '2024-01-15',
    totalStudyHours: 156,
    totalPosts: 42,
    grade: '中学2年',  // 追加
};
```

**表示UIに学年フィールド追加:**
```tsx
<div className={styles.info}>
    <div className={styles.field}>
        <label className={styles.label}>名前</label>
        <p className={styles.value}>{user.name}</p>
    </div>
    <div className={styles.field}>
        <label className={styles.label}>フリガナ</label>
        <p className={styles.value}>{user.kana}</p>
    </div>
    {/* 追加 */}
    {user.grade && (
        <div className={styles.field}>
            <label className={styles.label}>学年</label>
            <p className={styles.value}>{user.grade}</p>
        </div>
    )}
    <div className={styles.field}>
        <label className={styles.label}>参加日</label>
        <p className={styles.value}>{formatDate(user.joinedAt)}</p>
    </div>
</div>
```

## 5. 参考実装

- `specs/features/home.md` - UserProfile型定義
- `frontend/src/features/auth/student/pages/RegisterPage/RegisterPage.tsx` - 学年選択の実装例（存在する場合）

## 6. 技術的制約

- ❌ `any` 型禁止
- ❌ CSS値ハードコード禁止（CSS変数使用）
- ❌ 外部ライブラリ追加禁止
- ✅ `import type` で型をimport
- ✅ gradeフィールドはoptional（既存データとの互換性）

## 7. 完了報告

### タスクID: home-profile-grade-field

### 作成/編集ファイル:
- `user.ts` - grade フィールド追加
- `users.ts` - mockCurrentUser に学年データ追加
- `ProfilePage.tsx` - 学年表示UI追加

### 主要な変更点:
- User型にgrade（学年）フィールド追加
- プロフィール画面で学年を表示
- optional設計で後方互換性維持

### 未解決の問題: なし
