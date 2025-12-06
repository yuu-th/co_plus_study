---
id: types-update-diary-chat-archive-survey
feature: shared
depends_on:
  - design-spec-diary-improvements
  - design-spec-chat-improvements
  - design-spec-archive-improvements
  - design-spec-survey-improvements
scope_files:
  - frontend/src/types/diary.ts
  - frontend/src/types/chat.ts
  - frontend/src/types/archive.ts
  - frontend/src/types/badge.ts
  - frontend/src/types/survey.ts
forbidden_files:
  - frontend/src/components/
  - frontend/src/pages/
  - frontend/src/mockData/
created_at: 2025-11-27
---

# タスク: 型定義統一更新（日報、チャット、実績、アンケート）

> このファイルはサブエージェントへの作業指示書です。

## 0. 最初に必ず読むファイル（スキップ禁止）

| 順序 | ファイル | 読む目的 |
|------|----------|----------|
| 1 | `specs/overview.md` | システム全体像・技術制約 |
| 2 | `specs/features/diary.md` | 更新日報仕様 |
| 3 | `specs/features/chat.md` | 更新チャット仕様 |
| 4 | `specs/features/archive.md` | 更新実績仕様 |
| 5 | `specs/features/survey.md` | 更新アンケート仕様 |
| 6 | `specs/shared/conventions.md` | コーディング規約 |

## 1. タスク概要

各機能の仕様更新に合わせて、型定義ファイルを統一・更新する。
新しいフィールドの追加、型の細分化、JSDoc追加等を実施。

## 2. 完了条件

- [ ] `diary.ts` が更新（リアクション表示条件等）
- [ ] `chat.ts` が更新（image、reactions フィールド追加）
- [ ] `badge.ts` が更新（progress、status フィールド追加）
- [ ] `survey.ts` が更新（color タイプ、ratingStyle 追加）
- [ ] 全型に JSDoc コメント
- [ ] 全型に `@see specs/features/xxx.md` 参照コメント
- [ ] TypeScriptエラーなし

## 3. 編集対象ファイル

| ファイル | 操作 | 詳細 |
|----------|------|------|
| `frontend/src/types/diary.ts` | 編集 | DiaryPost に isUserReactionVisible 等 |
| `frontend/src/types/chat.ts` | 編集 | Message に type, imageUrl, reactions 追加 |
| `frontend/src/types/archive.ts` | 編集 | ContinuousStats に totalDays 追加 |
| `frontend/src/types/badge.ts` | 編集 | Badge に condition, progress, status 追加 |
| `frontend/src/types/survey.ts` | 編集 | Question に ratingStyle、color タイプ追加 |

## 4. 詳細な更新内容

### diary.ts

```typescript
// @see specs/features/diary.md

/**
 * 絵文字リアクション種別
 */
export type ReactionType = '👍' | '❤️' | '🎉' | '👏' | '🔥';

/**
 * ユーザーからの単一リアクション情報
 */
export interface Reaction {
  type: ReactionType;
  count: number;
  userIds: string[];
  isMentorReaction?: boolean;  // メンター側のリアクション判定
}

/**
 * 学習日報投稿
 */
export interface DiaryPost {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  duration: number;  // 分単位
  content: string;
  timestamp: string;  // ISO8601
  reactions: Reaction[];
  // ※ UI表示: ユーザー側は reactions 非表示、代わりに◎表示
  // メンター側のみ reactions 操作可能
}
```

### chat.ts

```typescript
// @see specs/features/chat.md

/**
 * チャットメッセージ本体
 */
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'mentor';
  senderAvatarUrl?: string;  // アイコン表示用
  content: string;
  timestamp: string;  // ISO8601
  isRead: boolean;
  type?: 'text' | 'image';  // デフォルト: 'text'
  imageUrl?: string;        // type='image' 時に設定
  reactions?: MessageReaction[];  // LINEスタイルリアクション
}

/**
 * メッセージへのリアクション（LINE風）
 */
export interface MessageReaction {
  emoji: string;      // 👍 ❤️ 🎉 👏 🔥
  userIds: string[];
}

/**
 * チャットルーム
 */
export interface ChatRoom {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorAvatarUrl?: string;
  mentorStatus: 'online' | 'offline';
  lastSeen?: string;
  studentId: string;          // ★追加
  studentName: string;        // ★追加
  studentAvatarUrl?: string;  // ★追加
  messages: Message[];
}
```

### archive.ts / badge.ts

```typescript
// @see specs/features/archive.md

/**
 * 連続学習統計
 */
export interface ContinuousStats {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;  // ★追加: 累計活動日数
}

/**
 * バッジ状態
 */
export type BadgeStatus = 'locked' | 'in_progress' | 'earned';

/**
 * バッジ情報
 */
export interface Badge {
  id: string;
  name: string;
  description: string;
  rank: BadgeRank;
  category: string;
  iconUrl?: string;
  earnedAt?: string;
  condition?: string;         // ★追加: 獲得条件（例: "連続7日学習"）
  progress?: number;          // ★追加: 進捗（0～100%）
  status?: BadgeStatus;       // ★追加: locked | in_progress | earned
}
```

### survey.ts

```typescript
// @see specs/features/survey.md

/**
 * 質問タイプ
 */
export type QuestionType = 'single' | 'multiple' | 'text' | 'rating' | 'color';

/**
 * 星評価の表示方式
 */
export type RatingStyle = 'numeric' | 'emoji';

/**
 * カラー選択用の選択肢
 */
export interface ColorOption {
  id: string;
  label: string;
  colorCode: string;  // #RRGGBB
}

/**
 * アンケート質問
 */
export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  required: boolean;
  options?: string[];        // single, multiple 用
  ratingStyle?: RatingStyle; // rating 用（デフォルト: 'emoji'）
  colorOptions?: ColorOption[];  // color 用 ★追加
}
```

## 5. JSDoc コメント例

```typescript
/**
 * 学習日報投稿
 * @see specs/features/diary.md
 */
export interface DiaryPost {
  /** 投稿の一意識別子 */
  id: string;
  
  /** 投稿者のユーザーID */
  userId: string;
  
  // ... etc
}
```

## 6. 注意事項

- 既存コンポーネントとの互換性を確保
- `any` 型は使用しない
- アバター画像URL は `senderAvatarUrl` / `mentorAvatarUrl` で統一
- ISO8601 形式を厳密に

## 7. 完了報告

```markdown
## 完了報告

### タスクID
types-update-diary-chat-archive-survey

### 編集ファイル
- types/diary.ts
- types/chat.ts
- types/archive.ts
- types/badge.ts
- types/survey.ts

### 主要な変更点
- DiaryPost: リアクション表示条件情報追加
- Message: 画像、リアクション対応
- ChatRoom: 学生情報追加
- Badge: 達成ゲージ、ステータス追加
- Question: color タイプ、ratingStyle 追加

### 未解決の問題
- なし
```
