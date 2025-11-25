# プロジェクト管理

このディレクトリはCO+ Studyプロジェクトの管理中枢です。

## ディレクトリ構成

```
project/
├── README.md          # このファイル
├── backlog/           # タスク管理（Issue代替）
│   ├── todo/          # 未着手タスク
│   ├── doing/         # 進行中タスク
│   └── done/          # 完了タスク
├── decisions/         # 意思決定の記録
└── changelog.md       # 変更履歴
```

## 運用ルール

### タスク管理（backlog/）

1. **新タスク作成**: `todo/` にマークダウンファイルを作成
2. **着手時**: `todo/` → `doing/` にファイルを移動
3. **完了時**: `doing/` → `done/` にファイルを移動

### 意思決定の記録（decisions/）

技術選定や設計判断を行った際に記録を残す。
フォーマット: `NNN-タイトル.md`（例: `001-tech-stack.md`）

### 変更履歴（changelog.md）

重要な変更を日付順に記録。

## 関連

- 仕様書: `../specs/`
- 実装: `../frontend/src/`
