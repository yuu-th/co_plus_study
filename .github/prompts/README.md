# プロンプトファイル

このディレクトリには、AIエージェント向けのプロンプトが格納されています。

## ファイル一覧

| ファイル | 用途 | 渡す対象 |
|----------|------|----------|
| `orchestrator.md` | タスク分解・計画 | 計画担当AI |
| `subagent.md` | タスク実行 | 実装担当AI |

## 使い方

### オーケストレーター（タスク分解）

1. `orchestrator.md` をAIに渡す
2. 実行したいタスクを伝える
3. AIがタスクを分解し、`project/backlog/todo/*.md` を生成

```
例: 「メンター管理機能を実装したい」
→ AIが型定義、コンポーネント、ページのタスクに分解
```

### サブエージェント（タスク実行）

1. `subagent.md` + タスクファイル（`project/backlog/todo/*.md`）をAIに渡す
2. AIがタスクを実行
3. 完了報告を受け取る

```
例: `subagent.md` + `mentor-types.md` を渡す
→ AIが型定義を作成
```

## ワークフロー

```
[ユーザー]
    │
    ▼ 依頼
[orchestrator.md を渡す]
    │
    ▼ タスク分解・依存関係特定
[project/backlog/todo/*.md が生成される]
    │
    ▼ 実行可能タスクを doing/ に移動
[subagent.md + タスクファイル を渡す] ×並列
    │
    ▼ 実装
[完了したタスクを done/ に移動]
    │
    ▼ 新たに実行可能になったタスクを確認...
```

## 実行可能判定

タスクは以下の条件で **実行可能** になります：

```
depends_on が空、または
depends_on の全タスクが done/ にある
```

## 関連ファイル

- `project/backlog/README.md` - バックログ管理の詳細
- `specs/overview.md` - システム全体像
