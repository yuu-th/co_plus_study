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
completed_at: 2025-11-26
---

# タスク: チュートリアルコンポーネント作成

> このファイルはサブエージェントへの作業指示書です。

## 0. 最初に必ず読むファイル（スキップ禁止）

| 順序 | ファイル                       | 読む目的                     |
| ---- | ------------------------------ | ---------------------------- |
| 1    | `specs/overview.md`            | システム全体像・技術制約     |
| 2    | `specs/features/tutorial.md`   | チュートリアル機能の仕様     |
| 3    | `specs/shared/conventions.md`  | コーディング規約             |

## 1. タスク概要

チュートリアル表示用UIコンポーネントを作成する。

## 2. 完了条件

- [x] TutorialOverlay（穴あきオーバーレイ）が作成されている
- [x] TutorialPanel（右サイドパネル）が作成されている
- [x] TutorialProvider（コンテキスト）が作成されている
- [x] ProgressBar（進捗バー）が作成されている
- [x] TypeScriptエラーがないこと
- [x] CSS変数を使用していること

## 3. 作成されたファイル

| ファイル                                                        | 説明                           |
| --------------------------------------------------------------- | ------------------------------ |
| `frontend/src/components/tutorial/TutorialOverlay.tsx`          | 穴あきオーバーレイコンポーネント |
| `frontend/src/components/tutorial/TutorialOverlay.module.css`   | オーバーレイのスタイル         |
| `frontend/src/components/tutorial/TutorialPanel.tsx`            | 右サイドパネルコンポーネント   |
| `frontend/src/components/tutorial/TutorialPanel.module.css`     | パネルのスタイル               |
| `frontend/src/components/tutorial/TutorialProvider.tsx`         | チュートリアルコンテキスト     |
| `frontend/src/components/tutorial/ProgressBar.tsx`              | 進捗バーコンポーネント         |
| `frontend/src/components/tutorial/ProgressBar.module.css`       | 進捗バーのスタイル             |

## 4. 実装メモ

- 当初はモーダルベースの設計だったが、ユーザーフィードバックにより「実際のUI要素をハイライトし、操作させる」インタラクティブ方式に変更
- clip-pathを使用した穴あきオーバーレイで、ターゲット要素のみ操作可能
- 右側サイドパネルで指示を表示
- TutorialProviderでグローバル状態管理、ルート間のナビゲーションも対応
