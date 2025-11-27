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
---

# タスク: チュートリアルページ統合

> このファイルはサブエージェントへの作業指示書です。

## 0. 最初に必ず読むファイル（スキップ禁止）

| 順序 | ファイル | 読む目的 |
|------|----------|----------|
| 1 | `specs/overview.md` | システム全体像・技術制約 |
| 2 | `specs/features/tutorial.md` | チュートリアル機能の仕様 |
| 3 | `specs/shared/conventions.md` | コーディング規約 |

## 1. タスク概要

チュートリアル機能をアプリに統合する。

## 2. 完了条件

- [ ] 初回ログイン検出が実装されている
- [ ] 自動チュートリアル開始が実装されている
- [ ] 設定画面から再開リンクがある
- [ ] 完了時のバッジ付与（モック）が実装されている
- [ ] TypeScriptエラーがないこと

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/App.tsx` | 編集 |
| `frontend/src/pages/Settings.tsx` | 編集 |

**上記以外は編集禁止**

## 4. 参考実装

- チュートリアルコンポーネント
- useTutorialフック

## 5. 技術的制約

- ❌ `any` 型禁止
- ❌ localStorage 直接使用禁止

## 6. 完了報告

```markdown
## 完了報告
### タスクID: tutorial-integration
### 作成/編集ファイル:
### 主要な変更点:
### 未解決の問題: なし
```
