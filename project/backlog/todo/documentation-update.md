---
id: documentation-update
feature: shared
depends_on: []
scope_files:
  - specs/
  - project/
forbidden_files:
  - frontend/src/
created_at: 2025-11-25
---

# タスク: ドキュメント更新

> このファイルはサブエージェントへの作業指示書です。

## 0. 最初に必ず読むファイル（スキップ禁止）

| 順序 | ファイル | 読む目的 |
|------|----------|----------|
| 1 | `specs/overview.md` | システム全体像 |

## 1. タスク概要

実装完了に合わせてドキュメントを最新化する。

## 2. 完了条件

- [ ] specs/features/*.md のステータス更新完了
- [ ] project/changelog.md 追記完了
- [ ] README.md 更新完了（あれば）

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `specs/features/*.md` | 編集 |
| `project/changelog.md` | 編集 |

**上記以外は編集禁止**

## 4. メモ

- 機能実装完了時に随時更新

## 5. 完了報告

```markdown
## 完了報告
### タスクID: documentation-update
### 作成/編集ファイル:
### 主要な変更点:
### 未解決の問題: なし
```
