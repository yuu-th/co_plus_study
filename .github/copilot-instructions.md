# GitHub Copilot Instructions

## プロジェクト概要

**CO+ Study** - 小中学生向け学習支援 Web アプリ（フロントエンドのみ）

→ **システム全体像は `specs/overview.md` を参照**

## 情報の場所（Single Source of Truth）

| 知りたいこと       | 見る場所                         |
| ------------------ | -------------------------------- |
| **システム全体像** | `specs/overview.md` ★ 最初に読む |
| 機能の仕様         | `specs/features/{機能名}.md`     |
| 共通ルール         | `specs/shared/conventions.md`    |
| カラー定義         | `specs/shared/colors.md`         |
| コンポーネント仕様 | `specs/shared/components.md`     |
| やるべきこと       | `project/backlog/todo/`          |
| 進行中タスク       | `project/backlog/doing/`         |
| 完了タスク         | `project/backlog/done/`          |
| 過去の決定理由     | `project/decisions/`             |

## 基本ルール

1. **仕様は `specs/` を正とする**（コード内に仕様を書かない）
2. **型定義の先頭に参照コメント**を書く: `// @see specs/features/xxx.md`
3. **新機能は仕様を書いてから実装**（`specs/features/` → 実装）
4. **タスク管理はファイルベース**（todo → doing → done に移動）

## 技術制約（禁止事項）

- ❌ `any` 型の使用
- ❌ `React.FC` の使用
- ❌ CSS 値のハードコード（CSS 変数を使用）
- ❌ fetch / axios による API 通信
- ❌ localStorage / sessionStorage の使用
- ❌ 外部 UI ライブラリ（Material UI, Ant Design 等）
- ❌ styled-components / Emotion / Tailwind

## 技術スタック

- React 18 + TypeScript Strict + Vite
- CSS Modules + CSS 変数（`frontend/src/styles/variables.css`）
- React Router v6
- モックデータのみ（バックエンド連携なし）

## 実装時の参照順序

1. `specs/features/{機能}.md` で仕様確認
2. `specs/shared/conventions.md` で規約確認
3. 既存の類似実装を参考に
4. 完了後 `project/backlog/` を更新

## ディレクトリ構造

```
frontend/src/
├── components/        # UIコンポーネント
│   ├── common/        # Button, Card, Modal等
│   ├── layout/        # Sidebar, Header, Layout
│   ├── diary/         # 学習日報
│   ├── chat/          # 相談チャット
│   ├── survey/        # アンケート
│   ├── notification/  # お知らせ
│   ├── tutorial/      # チュートリアル
│   ├── archive/       # ARCHIVE
│   └── mentor/        # メンター管理
├── pages/             # ページコンポーネント
├── hooks/             # カスタムフック
├── types/             # 型定義
├── mockData/          # モックデータ
├── utils/             # ユーティリティ
└── styles/            # グローバルスタイル

specs/                 # 仕様書（唯一の真実の源）
├── overview.md        # ★システム全体像（最初に読む）
├── features/          # 機能別仕様
│   ├── diary.md
│   ├── chat.md
│   ├── survey.md
│   ├── notification.md
│   ├── tutorial.md
│   ├── archive.md
│   └── mentor.md
└── shared/            # 共通仕様
    ├── colors.md
    ├── typography.md
    ├── components.md
    └── conventions.md

project/               # プロジェクト管理
├── backlog/           # タスク管理（Issue代替）
│   ├── todo/          # 未着手
│   ├── doing/         # 進行中
│   └── done/          # 完了
├── decisions/         # 意思決定記録
└── changelog.md       # 変更履歴
```

## 命名規則

| 対象           | 規則                  | 例                         |
| -------------- | --------------------- | -------------------------- |
| コンポーネント | PascalCase            | `DiaryPostCard.tsx`        |
| CSS モジュール | PascalCase.module.css | `DiaryPostCard.module.css` |
| 型ファイル     | camelCase             | `types.ts`                 |
| 関数           | camelCase             | `handleSubmit`             |
| 定数           | UPPER_SNAKE_CASE      | `MAX_LENGTH`               |
| CSS 変数       | kebab-case            | `--color-bg-primary`       |

## Type-only imports（必須）

```typescript
// ✅ Good
import type { User } from "../types";
import { mockUsers } from "../mockData";

// ❌ Bad
import { User } from "../types";
```
