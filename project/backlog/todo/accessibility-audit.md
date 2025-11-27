---
id: accessibility-audit
feature: shared
depends_on: []
scope_files:
  - frontend/src/components/
forbidden_files:
  - frontend/src/types/
created_at: 2025-11-25
---

# タスク: アクセシビリティ監査

> このファイルはサブエージェントへの作業指示書です。

## 0. 最初に必ず読むファイル（スキップ禁止）

| 順序 | ファイル | 読む目的 |
|------|----------|----------|
| 1 | `specs/overview.md` | システム全体像・技術制約 |
| 2 | `specs/shared/conventions.md` | コーディング規約（アクセシビリティ項目） |

## 1. タスク概要

全コンポーネントのアクセシビリティを監査・改善する。

## 2. 完了条件

- [ ] セマンティックHTML確認完了
- [ ] ARIAラベル確認完了
- [ ] キーボード操作確認完了
- [ ] フォーカス順序確認完了
- [ ] コントラスト比確認完了
- [ ] 改善箇所の修正完了

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/components/**/*.tsx` | 必要に応じて編集 |

## 4. 参考実装

- 主要フォーム、モーダル、ナビゲーションを重点確認

## 5. 技術的制約

- ✅ セマンティックHTML使用
- ✅ 適切なARIA属性使用

## 6. 完了報告

```markdown
## 完了報告
### タスクID: accessibility-audit
### 作成/編集ファイル:
### 主要な変更点:
### 未解決の問題: なし
```
