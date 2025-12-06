---
id: migration-student
feature: architecture
depends_on: []
scope_files:
  - src/features/student/**/*
forbidden_files:
  - src/features/mentor/**/*
  - src/features/auth/**/*
  - src/shared/**/*
  - src/components/**/*
  - src/pages/**/*
created_at: 2025-12-06
---

# タスク: Student Feature 移行

> このファイルはサブエージェントへの作業指示書です。

## 0. 必読ファイル（スキップ禁止）

以下を **必ず読んでから** 作業開始:

1. `project/decisions/004-feature-based-architecture.md` - アーキテクチャ決定と完了済み作業
2. `specs/overview.md` - システム全体像
3. `specs/features/archive.md` - ARCHIVE機能仕様
4. `specs/features/diary.md` - 学習日報機能仕様
5. `specs/features/chat.md` - 相談チャット機能仕様
6. `specs/features/survey.md` - アンケート機能仕様
7. `specs/features/tutorial.md` - チュートリアル機能仕様
8. `specs/shared/conventions.md` - コーディング規約

## 1. タスク概要

学生向け機能を `src/features/student/` に移行する。既存の `src/components/` と `src/pages/` から学生向けコンポーネント・ページをコピーし、importパスを `@/shared/` と相対パスに更新する。

## 2. 前提条件（完了済み）

以下は**既に完了**している:

- `shared/components/` - Button, Card, Badge, Modal, EmptyState, ErrorBoundary, Skeleton, DiaryPostCard, ReactionButton
- `shared/types/` - user, chat, notification, badge, diary
- `shared/hooks/useNotifications.ts`
- `shared/utils/` - formatTime, groupByDate
- `shared/mockData/` - users, chats, notifications
- `tsconfig.app.json` / `vite.config.ts` - パスエイリアス設定済み

## 3. 完了条件

- [ ] `features/student/components/layout/` (Layout, Header, Sidebar) 作成
- [ ] `features/student/components/archive/` (6コンポーネント) 作成
- [ ] `features/student/components/diary/` (4コンポーネント) 作成
- [ ] `features/student/components/chat/` (4コンポーネント) 作成
- [ ] `features/student/components/survey/` (全コンポーネント) 作成
- [ ] `features/student/components/tutorial/` (全コンポーネント) 作成
- [ ] `features/student/components/notification/` (5コンポーネント) 作成
- [ ] `features/student/pages/` (7ページ) 作成
- [ ] `features/student/types/` (calendar, survey, tutorial) 作成
- [ ] `features/student/mockData/` (badges, calendar, diaries, surveys, tutorials) 作成
- [ ] `features/student/hooks/useTutorial.ts` 作成
- [ ] `features/student/routes.tsx` 作成
- [ ] TypeScriptエラーがないこと

## 4. 編集対象ファイル

| カテゴリ | 移行元 | 移行先 |
|----------|--------|--------|
| Layout | `components/layout/Layout/` | `features/student/components/layout/Layout/` |
| Layout | `components/layout/Header/` | `features/student/components/layout/Header/` |
| Layout | `components/layout/Sidebar/` | `features/student/components/layout/Sidebar/` |
| Archive | `components/archive/*` | `features/student/components/archive/*` |
| Diary | `components/diary/DiaryPostForm/` | `features/student/components/diary/DiaryPostForm/` |
| Diary | `components/diary/DiaryStats/` | `features/student/components/diary/DiaryStats/` |
| Diary | `components/diary/DiaryTimeline/` | `features/student/components/diary/DiaryTimeline/` |
| Chat | `components/chat/*` | `features/student/components/chat/*` |
| Survey | `components/survey/*` | `features/student/components/survey/*` |
| Tutorial | `components/tutorial/*` | `features/student/components/tutorial/*` |
| Notification | `components/notification/*` | `features/student/components/notification/*` |
| Pages | `pages/HomePage/` | `features/student/pages/HomePage/` |
| Pages | `pages/ProfilePage/` | `features/student/pages/ProfilePage/` |
| Pages | `pages/ArchivePage/` | `features/student/pages/ArchivePage/` |
| Pages | `pages/DiaryPage/` | `features/student/pages/DiaryPage/` |
| Pages | `pages/ChatPage/` | `features/student/pages/ChatPage/` |
| Pages | `pages/SurveyPage/` | `features/student/pages/SurveyPage/` |
| Pages | `pages/TutorialPage/` | `features/student/pages/TutorialPage/` |
| Types | `types/calendar.ts` | `features/student/types/calendar.ts` |
| Types | `types/survey.ts` | `features/student/types/survey.ts` |
| Types | `types/tutorial.ts` | `features/student/types/tutorial.ts` |
| MockData | `mockData/badges.ts` | `features/student/mockData/badges.ts` |
| MockData | `mockData/calendar.ts` | `features/student/mockData/calendar.ts` |
| MockData | `mockData/diaries.ts` | `features/student/mockData/diaries.ts` |
| MockData | `mockData/surveys.ts` | `features/student/mockData/surveys.ts` |
| MockData | `mockData/tutorials.ts` | `features/student/mockData/tutorials.ts` |
| Hooks | `hooks/useTutorial.ts` | `features/student/hooks/useTutorial.ts` |
| Utils | `utils/surveyProgress.ts` | `features/student/utils/surveyProgress.ts` |
| Routes | (新規) | `features/student/routes.tsx` |

## 5. importパス変換ルール

```typescript
// Before
import Button from '../../components/common/Button';
import type { User } from '../../../types';
import { mockCurrentUser } from '../../../mockData/users';

// After
import Button from '@/shared/components/Button';
import type { User } from '@/shared/types';
import { mockCurrentUser } from '@/shared/mockData/users';

// student内の相対参照
import Header from '../Header';
import { useTutorial } from '../../hooks/useTutorial';
```

## 6. 技術的制約

> [!CAUTION]
> **PowerShellコマンドでの置換禁止** - ファイル破損リスクあり。すべて手動でファイル作成・編集。

- ❌ `any` 型禁止
- ❌ CSS 値ハードコード禁止（CSS 変数使用）
- ❌ 外部ライブラリ追加禁止
- ✅ `import type` で型を import
- ✅ shared コンポーネントは `@/shared/components/` から import

## 7. routes.tsx テンプレート

```typescript
import { RouteObject } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ArchivePage from './pages/ArchivePage';
import DiaryPage from './pages/DiaryPage';
import ChatPage from './pages/ChatPage';
import SurveyPage from './pages/SurveyPage';
import TutorialPage from './pages/TutorialPage';

export const studentRoutes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/archive', element: <ArchivePage /> },
      { path: '/diary', element: <DiaryPage /> },
      { path: '/chat', element: <ChatPage /> },
      { path: '/survey', element: <SurveyPage /> },
      { path: '/tutorial', element: <TutorialPage /> },
    ],
  },
];
```

## 8. 完了報告

```
## 完了報告

### タスク ID: migration-student

### 作成/編集ファイル:

### 主要な変更点:

### 未解決の問題:
```
