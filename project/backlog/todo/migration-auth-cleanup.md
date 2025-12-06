---
id: migration-auth-cleanup
feature: architecture
depends_on: [migration-mentor]
scope_files:
  - src/features/auth/**/*
  - src/router.tsx
  - src/App.tsx
forbidden_files:
  - src/features/student/**/*
  - src/features/mentor/**/*
  - src/shared/**/*
created_at: 2025-12-06
---

# タスク: Auth Feature 移行・Router統合・旧ファイル削除・検証

> このファイルはサブエージェントへの作業指示書です。

## 0. 必読ファイル（スキップ禁止）

以下を **必ず読んでから** 作業開始:

1. `project/decisions/004-feature-based-architecture.md` - アーキテクチャ決定
2. `specs/overview.md` - システム全体像
3. `specs/features/home.md` - ログイン/登録画面仕様
4. `specs/shared/conventions.md` - コーディング規約

## 1. タスク概要

1. 認証機能を `src/features/auth/` にロール別（student/mentor）で作成
2. `router.tsx` を更新して各featureのroutesを統合
3. 旧ディレクトリ (`components/`, `pages/`, `types/`, `mockData/`, `hooks/`, `utils/`) を削除
4. TypeScriptチェック、ESLint、ビルド、動作確認

## 2. 前提条件（完了済み）

以下は**既に完了**している（`migration-mentor` 完了前提）:

- `shared/` - 共通コンポーネント・型・モックデータ
- `features/student/` - 学生機能
- `features/mentor/` - メンター機能

## 3. 完了条件

### Phase A: Auth Feature
- [ ] `features/auth/student/pages/LoginPage/` 作成
- [ ] `features/auth/student/pages/RegisterPage/` 作成
- [ ] `features/auth/student/routes.tsx` 作成
- [ ] `features/auth/mentor/pages/LoginPage/` 作成（新規）
- [ ] `features/auth/mentor/pages/RegisterPage/` 作成（新規）
- [ ] `features/auth/mentor/routes.tsx` 作成

### Phase B: Router統合
- [ ] `router.tsx` 更新（各featureのroutesをimport）
- [ ] `App.tsx` 更新（importパス修正）

### Phase C: 旧ディレクトリ削除
- [ ] `src/components/` 削除
- [ ] `src/pages/` 削除
- [ ] `src/types/` 削除
- [ ] `src/mockData/` 削除
- [ ] `src/hooks/` 削除
- [ ] `src/utils/` 削除

### Phase D: 検証
- [ ] `npx tsc --noEmit` - 型チェック通過
- [ ] `npm run lint` - ESLint通過
- [ ] `npm run build` - ビルド成功
- [ ] 学生ページ動作確認（/, /profile, /archive, /diary, /chat, /survey, /tutorial, /login, /register）
- [ ] メンターページ動作確認（/mentor/dashboard, /mentor/students, /mentor/notifications, /mentor/chat, /mentor/login, /mentor/register）

## 4. Auth URL構造

| ロール | ログイン | 登録 |
|--------|----------|------|
| 学生 | `/login` | `/register` |
| メンター | `/mentor/login` | `/mentor/register` |

## 5. 編集対象ファイル

| カテゴリ | 移行元 | 移行先 |
|----------|--------|--------|
| Student Auth | `pages/LoginPage/` | `features/auth/student/pages/LoginPage/` |
| Student Auth | `pages/AccountRegistrationPage/` | `features/auth/student/pages/RegisterPage/` |
| Mentor Auth | (新規) | `features/auth/mentor/pages/LoginPage/` |
| Mentor Auth | (新規) | `features/auth/mentor/pages/RegisterPage/` |
| Routes | (新規) | `features/auth/student/routes.tsx` |
| Routes | (新規) | `features/auth/mentor/routes.tsx` |
| Router | `router.tsx` | `router.tsx` (更新) |
| App | `App.tsx` | `App.tsx` (更新) |

## 6. router.tsx テンプレート

```typescript
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import { studentRoutes } from '@/features/student/routes';
import { mentorRoutes } from '@/features/mentor/routes';
import { studentAuthRoutes } from '@/features/auth/student/routes';
import { mentorAuthRoutes } from '@/features/auth/mentor/routes';

const router = createBrowserRouter([
  ...studentAuthRoutes,
  ...mentorAuthRoutes,
  ...studentRoutes,
  ...mentorRoutes,
  {
    path: '*',
    element: <ErrorBoundary />,
  },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
```

## 7. App.tsx テンプレート

```typescript
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import Router from './router';
import './styles/global.css';

function App() {
  return (
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  );
}

export default App;
```

## 8. メンター認証ページ（新規作成）

### LoginPage
- 学生用LoginPageをベースに作成
- タイトル: 「CO+ Study メンター」
- スタイル: メンター用配色（オレンジ/ゴールド系）
- 成功時: `/mentor/dashboard` へリダイレクト

### RegisterPage
- メンター登録フォーム
- フィールド: 名前、フリガナ、高専名、学年、専門分野
- 成功時: `/mentor/dashboard` へリダイレクト

## 9. 技術的制約

> [!CAUTION]
> **PowerShellコマンドでの置換禁止** - ファイル破損リスクあり。

> [!WARNING]
> **削除は最後に実行** - すべての移行と検証が完了してから旧ディレクトリを削除すること。

- ❌ `any` 型禁止
- ✅ `import type` で型を import
- ✅ 全ての import は `@/shared/` または `@/features/` を使用

## 10. 完了報告

```
## 完了報告

### タスク ID: migration-auth-cleanup

### 作成/編集ファイル:

### 削除ファイル/ディレクトリ:

### 検証結果:
- TypeScript: 
- ESLint: 
- Build: 
- 動作確認: 

### 未解決の問題:
```
