---
id: tutorial-integration
feature: tutorial
depends_on: [tutorial-components]
scope_files:
  - frontend/src/pages/
  - frontend/src/App.tsx
forbidden_files:
  - frontend/src/types/
created_at: 2025-11-25
completed_at: 2025-11-26
---

# タスク: チュートリアルページ統合

> このファイルはサブエージェントへの作業指示書です。

## 0. 最初に必ず読むファイル（スキップ禁止）

| 順序 | ファイル                       | 読む目的                     |
| ---- | ------------------------------ | ---------------------------- |
| 1    | `specs/overview.md`            | システム全体像・技術制約     |
| 2    | `specs/features/tutorial.md`   | チュートリアル機能の仕様     |
| 3    | `specs/shared/conventions.md`  | コーディング規約             |

## 1. タスク概要

チュートリアル機能をアプリに統合する。

## 2. 完了条件

- [x] ホームページにチュートリアル開始バナーが表示される
- [x] チュートリアル開始時に自動的に各ページへ遷移する
- [x] プロフィールページからチュートリアル再開可能
- [x] チュートリアル完了時に完了状態が保持される
- [x] TypeScriptエラーがないこと

## 3. 編集されたファイル

| ファイル                                                 | 変更内容                                   |
| -------------------------------------------------------- | ------------------------------------------ |
| `frontend/src/components/layout/Layout/Layout.tsx`       | TutorialProviderでラップ                   |
| `frontend/src/pages/HomePage/HomePage.tsx`               | チュートリアル開始バナー追加               |
| `frontend/src/pages/HomePage/HomePage.module.css`        | バナーのスタイル追加                       |
| `frontend/src/pages/TutorialPage/TutorialPage.tsx`       | useTutorialContext使用                     |
| `frontend/src/pages/ProfilePage/ProfilePage.tsx`         | チュートリアル再開ボタン追加               |
| `frontend/src/components/layout/Sidebar/Sidebar.tsx`     | data-tutorial属性追加                      |
| `frontend/src/components/diary/DiaryPostForm/DiaryPostForm.tsx` | data-tutorial属性追加              |

## 4. 実装メモ

- TutorialProviderをLayoutに配置することで、全ページからチュートリアル状態にアクセス可能
- ホームページでは未完了ユーザー向けにチュートリアル開始バナーを表示
- 各ステップでreact-router-domのuseNavigateを使用して自動的にページ遷移
- data-tutorial属性でターゲット要素を特定し、TutorialOverlayでハイライト
