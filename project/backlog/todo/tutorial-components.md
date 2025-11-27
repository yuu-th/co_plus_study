---
id: tutorial-components
feature: tutorial
depends_on: []
scope_files:
  - frontend/src/components/tutorial/
forbidden_files:
  - frontend/src/pages/
  - frontend/src/types/
created_at: 2025-11-25
---

# タスク: チュートリアルコンポーネント作成

> このファイルはサブエージェントへの作業指示書です。

## 0. 最初に必ず読むファイル（スキップ禁止）

| 順序 | ファイル | 読む目的 |
|------|----------|----------|
| 1 | `specs/overview.md` | システム全体像・技術制約 |
| 2 | `specs/features/tutorial.md` | チュートリアル機能の仕様 |
| 3 | `specs/shared/conventions.md` | コーディング規約 |

## 1. タスク概要

チュートリアル表示用UIコンポーネントを作成する。

## 2. 完了条件

- [ ] TutorialModal（説明、進捗、ボタン）が作成されている
- [ ] ProgressBar（進捗バー）が作成されている
- [ ] Highlight（要素ハイライト）が作成されている
- [ ] TypeScriptエラーがないこと
- [ ] CSS変数を使用していること

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/components/tutorial/TutorialModal.tsx` | 新規作成 |
| `frontend/src/components/tutorial/TutorialModal.module.css` | 新規作成 |
| `frontend/src/components/tutorial/ProgressBar.tsx` | 新規作成 |
| `frontend/src/components/tutorial/ProgressBar.module.css` | 新規作成 |
| `frontend/src/components/tutorial/Highlight.tsx` | 新規作成 |
| `frontend/src/components/tutorial/Highlight.module.css` | 新規作成 |

**上記以外は編集禁止**

## 4. 参考実装

- 既存のモーダルコンポーネント

## 5. 技術的制約

- ❌ `any` 型禁止
- ❌ CSS値ハードコード禁止
- ✅ フォーカストラップ必須
- ✅ Highlightは対象要素周囲をオーバーレイ

## 6. 完了報告

```markdown
## 完了報告
### タスクID: tutorial-components
### 作成/編集ファイル:
### 主要な変更点:
### 未解決の問題: なし
```
