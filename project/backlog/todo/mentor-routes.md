---
id: mentor-routes
feature: mentor
depends_on: [mentor-types]
scope_files:
  - frontend/src/router.tsx
forbidden_files:
  - frontend/src/types/
  - frontend/src/mockData/
created_at: 2025-11-25
---

# タスク: メンタールート追加

> このファイルはサブエージェントへの作業指示書です。

## 0. 最初に必ず読むファイル（スキップ禁止）

| 順序 | ファイル | 読む目的 |
|------|----------|----------|
| 1 | `specs/overview.md` | システム全体像・技術制約 |
| 2 | `specs/features/mentor.md` | メンター機能の仕様 |
| 3 | `specs/shared/conventions.md` | コーディング規約 |

## 1. タスク概要

router.tsx にメンター専用ルートを追加する。

## 2. 完了条件

- [ ] /mentor/login ルートが追加されている
- [ ] /mentor/dashboard ルートが追加されている
- [ ] /mentor/students ルートが追加されている
- [ ] /mentor/students/:id ルートが追加されている
- [ ] /mentor/notifications ルートが追加されている
- [ ] /mentor/chat ルートが追加されている
- [ ] MentorLayoutでネストされている
- [ ] TypeScriptエラーがないこと

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/router.tsx` | 編集 |

**上記以外は編集禁止**

## 4. 参考実装

- 既存のルート定義パターンを参照

## 5. 技術的制約

- ❌ `any` 型禁止
- ✅ React Router v6 のパターンに従う

## 6. 完了報告

```markdown
## 完了報告
### タスクID: mentor-routes
### 作成/編集ファイル:
### 主要な変更点:
### 未解決の問題: なし
```
