# 仕様書（Specs）

## 概要

このディレクトリは **Single Source of Truth（唯一の真実の源）** です。
すべての仕様はここにのみ記載し、コード内には仕様を書きません。

## ディレクトリ構成

```
specs/
├── README.md              # このファイル
├── _templates/            # テンプレート
│   └── feature-spec.md    # 機能仕様テンプレート
├── shared/                # 共通仕様
│   ├── colors.md          # カラーパレット
│   ├── typography.md      # タイポグラフィ
│   ├── components.md      # 共通コンポーネント
│   └── conventions.md     # 命名・コーディング規約
└── features/              # 機能別仕様
    ├── diary.md           # 学習日報
    ├── chat.md            # 相談チャット
    ├── survey.md          # アンケート
    ├── notification.md    # お知らせ
    ├── tutorial.md        # チュートリアル
    ├── archive.md         # ARCHIVE
    └── mentor.md          # メンター管理
```

## 運用ルール

### 1. 仕様の追加・変更

1. 該当する `specs/features/*.md` または `specs/shared/*.md` を編集
2. 変更履歴セクションに日付と内容を追記
3. 関連するコードを更新

### 2. 新機能の追加

1. `specs/_templates/feature-spec.md` をコピー
2. `specs/features/{機能名}.md` として保存
3. テンプレートに沿って仕様を記載
4. `project/backlog/todo/` にタスクファイルを作成

### 3. コードからの参照

型定義ファイルの先頭に参照コメントを記載:

```typescript
// @see specs/features/diary.md
export interface DiaryPost { ... }
```

## 仕様ファイルの構成

各仕様ファイルは以下のセクションを含む:

1. **概要** - 機能の目的（1-2文）
2. **ユーザーストーリー** - 誰が何をしたいか
3. **データ構造** - 型定義（テーブル形式）
4. **コンポーネント** - 必要なコンポーネント一覧
5. **画面仕様** - レイアウト・レスポンシブ対応
6. **制約・バリデーション** - 入力制限等
7. **関連** - 他の仕様への参照
8. **変更履歴** - 変更の記録

## 関連

- タスク管理: `../project/backlog/`
- 意思決定: `../project/decisions/`
- 実装: `../frontend/src/features/`
