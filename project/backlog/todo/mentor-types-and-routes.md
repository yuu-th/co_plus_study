---
id: mentor-types-and-routes
feature: mentor
depends_on: []
scope_files:
  - frontend/src/types/mentor.ts
  - frontend/src/router.tsx
forbidden_files:
  - frontend/src/components/
  - frontend/src/pages/
  - frontend/src/mockData/
created_at: 2025-11-27
---

# タスク: メンター機能の型定義とルート追加

> このファイルはサブエージェントへの作業指示書です。

## 0. 最初に必ず読むファイル（スキップ禁止）

| 順序 | ファイル | 読む目的 |
|------|----------|----------|
| 1 | `specs/overview.md` | システム全体像・技術制約 |
| 2 | `specs/features/mentor.md` | メンター機能の仕様 |
| 3 | `specs/shared/conventions.md` | コーディング規約 |

## 1. タスク概要

メンター機能で使用する型定義と、ルーティング設定を整備する。
メンター側の画面実装の基盤となる。

## 2. 完了条件

- [ ] `frontend/src/types/mentor.ts` が作成
- [ ] Mentor, StudentSummary, StudentDetail, StudentStats 型が定義
- [ ] JSDoc コメントが完備
- [ ] router.tsx にメンターのルートが追加（/mentor/...）
- [ ] TypeScriptエラーなし

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/types/mentor.ts` | 新規作成 |
| `frontend/src/router.tsx` | 編集（ルート追加） |

## 4. 実装仕様

### mentor.ts

```typescript
// @see specs/features/mentor.md

/**
 * メンターの専門分野
 */
export interface Specialty {
  id: string;
  name: string;  // e.g., "算数", "英語"
}

/**
 * メンター情報
 */
export interface Mentor {
  id: string;
  name: string;
  kana: string;               // フリガナ
  avatarUrl?: string;
  specialties: Specialty[];
  introduction: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: string;          // ISO8601
}

/**
 * 生徒の概要情報（一覧表示用）
 */
export interface StudentSummary {
  id: string;
  name: string;
  avatarUrl?: string;
  totalPosts: number;
  totalHours: number;
  lastActivity: string;       // ISO8601
}

/**
 * 教科別学習時間
 */
export interface SubjectTime {
  subject: string;
  hours: number;
}

/**
 * 生徒の統計情報
 */
export interface StudentStats {
  continuousDays: number;
  longestStreak: number;
  totalDays: number;
  totalHours: number;
  subjectBreakdown: SubjectTime[];
}

/**
 * 生徒の詳細情報
 */
export interface StudentDetail extends StudentSummary {
  kana: string;
  stats: StudentStats;
  joinedAt: string;
}

/**
 * お知らせドラフト（メンター作成用）
 */
export interface NotificationDraft {
  category: 'info' | 'important' | 'event' | 'achievement';
  title: string;
  content: string;
}
```

### router.tsx 更新

```typescript
// router.tsx

import MentorDashboard from './pages/MentorDashboardPage/MentorDashboardPage';
import StudentListPage from './pages/StudentListPage/StudentListPage';
import StudentDetailPage from './pages/StudentDetailPage/StudentDetailPage';
import NotificationManagePage from './pages/NotificationManagePage/NotificationManagePage';
// ... 他のインポート

const routes = [
  // 既存のルート...
  
  // メンター関連ルート（/mentor 配下）
  {
    path: '/mentor',
    children: [
      {
        path: 'dashboard',
        element: <MentorDashboard />,
      },
      {
        path: 'students',
        element: <StudentListPage />,
      },
      {
        path: 'students/:id',
        element: <StudentDetailPage />,
      },
      {
        path: 'notifications',
        element: <NotificationManagePage />,
      },
      {
        path: 'chat',
        element: <ChatPage />,  // 既存の ChatPage を再利用（メンターモード）
      },
    ],
  },
];
```

## 5. メンターダッシュボードとの連携

- MentorDashboard は /mentor/dashboard からアクセス
- StudentDetailPage は /mentor/students/:id へ
- チャットはメンター側レイアウトで表示

## 6. 注意事項

- 型定義のみで実装は別タスク
- Mentor, StudentDetail, StudentStats は後続タスクで使用
- ルート構造を明確にして、メンター側画面の実装時に迷わないように

## 7. 完了報告

```markdown
## 完了報告

### タスクID
mentor-types-and-routes

### 作成/編集ファイル
- mentor.ts - 新規作成
- router.tsx - 編集（メンタールート追加）

### 主要な変更点
- Mentor, StudentSummary, StudentDetail, StudentStats 型定義
- /mentor 配下のルート構造設計
- JSDoc コメント完備

### 未解決の問題
- なし
```
