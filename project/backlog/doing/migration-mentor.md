---
id: migration-mentor
feature: architecture
depends_on: [migration-student]
scope_files:
  - src/features/mentor/**/*
forbidden_files:
  - src/features/student/**/*
  - src/features/auth/**/*
  - src/shared/**/*
  - src/components/**/*
  - src/pages/**/*
created_at: 2025-12-06
---

# タスク: Mentor Feature 移行

> このファイルはサブエージェントへの作業指示書です。

## 0. 必読ファイル（スキップ禁止）

以下を **必ず読んでから** 作業開始:

1. `project/decisions/004-feature-based-architecture.md` - アーキテクチャ決定と完了済み作業
2. `specs/overview.md` - システム全体像
3. `specs/features/mentor.md` - メンター管理機能仕様
4. `specs/features/notification.md` - お知らせ機能仕様
5. `specs/features/chat.md` - 相談チャット機能仕様
6. `specs/shared/conventions.md` - コーディング規約

## 1. タスク概要

メンター向け機能を `src/features/mentor/` に移行する。既存の `src/components/` と `src/pages/` からメンター向けコンポーネント・ページをコピーし、importパスを更新する。**ChatPageはメンター専用版として新規実装**（学生版とは別）。

## 2. 前提条件（完了済み）

以下は**既に完了**している（`migration-student` 完了前提）:

- `shared/components/` - 共通コンポーネント（DiaryPostCard含む）
- `shared/types/` - 共通型定義
- `shared/mockData/` - 共通モックデータ
- `features/student/` - 学生機能（完了前提）

## 3. 完了条件

- [ ] `features/mentor/components/layout/` (MentorLayout, MentorHeader, MentorSidebar) 作成
- [ ] `features/mentor/components/students/` (StudentCard, StudentStats) 作成
- [ ] `features/mentor/components/notifications/` (NotificationEditor) 作成
- [ ] `features/mentor/components/chat/` (4コンポーネント - メンター専用版) 作成
- [ ] `features/mentor/pages/` (5ページ) 作成
- [ ] `features/mentor/types/` (mentor.ts, index.ts) 作成
- [ ] `features/mentor/mockData/` (mentors.ts) 作成
- [ ] `features/mentor/routes.tsx` 作成
- [ ] TypeScriptエラーがないこと

## 4. 編集対象ファイル

| カテゴリ | 移行元 | 移行先 |
|----------|--------|--------|
| Layout | `components/layout/MentorLayout/` | `features/mentor/components/layout/MentorLayout/` |
| Layout | `components/layout/MentorHeader/` | `features/mentor/components/layout/MentorHeader/` |
| Layout | `components/layout/MentorSidebar/` | `features/mentor/components/layout/MentorSidebar/` |
| Students | `components/mentor/StudentCard/` | `features/mentor/components/students/StudentCard/` |
| Students | `components/mentor/StudentStats/` | `features/mentor/components/students/StudentStats/` |
| Notifications | `components/mentor/NotificationEditor/` | `features/mentor/components/notifications/NotificationEditor/` |
| Chat | `components/chat/*` | `features/mentor/components/chat/*` (コピー＆カスタマイズ) |
| Pages | `pages/MentorDashboardPage/` | `features/mentor/pages/DashboardPage/` |
| Pages | `pages/StudentListPage/` | `features/mentor/pages/StudentListPage/` |
| Pages | `pages/StudentDetailPage/` | `features/mentor/pages/StudentDetailPage/` |
| Pages | `pages/NotificationManagePage/` | `features/mentor/pages/NotificationManagePage/` |
| Pages | (新規) | `features/mentor/pages/ChatPage/` (メンター専用版) |
| Types | `types/mentor.ts` | `features/mentor/types/mentor.ts` |
| MockData | `mockData/mentors.ts` | `features/mentor/mockData/mentors.ts` |
| Routes | (新規) | `features/mentor/routes.tsx` |

## 5. メンター専用ChatPage

学生版ChatPageをベースに以下をカスタマイズ:
- すべての担当生徒一覧を表示
- 複数の会話を切り替え可能
- メンター用のUI/配色

## 6. routes.tsx テンプレート

```typescript
import { RouteObject } from 'react-router-dom';
import MentorLayout from './components/layout/MentorLayout';
import DashboardPage from './pages/DashboardPage';
import StudentListPage from './pages/StudentListPage';
import StudentDetailPage from './pages/StudentDetailPage';
import NotificationManagePage from './pages/NotificationManagePage';
import ChatPage from './pages/ChatPage';

export const mentorRoutes: RouteObject[] = [
  {
    path: '/mentor',
    element: <MentorLayout />,
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'students', element: <StudentListPage /> },
      { path: 'students/:id', element: <StudentDetailPage /> },
      { path: 'notifications', element: <NotificationManagePage /> },
      { path: 'chat', element: <ChatPage /> },
    ],
  },
];
```

## 7. 技術的制約

> [!CAUTION]
> **PowerShellコマンドでの置換禁止** - ファイル破損リスクあり。

- ❌ `any` 型禁止
- ❌ CSS 値ハードコード禁止
- ✅ `import type` で型を import
- ✅ shared コンポーネントは `@/shared/` から import
- ✅ DiaryPostCard は `@/shared/components/DiaryPostCard` から import

## 8. 完了報告

```
## 完了報告

### タスク ID: migration-mentor

### 作成/編集ファイル:

### 主要な変更点:

### 未解決の問題:
```
