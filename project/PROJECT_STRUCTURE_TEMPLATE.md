# プロジェクト構造テンプレート

> **このファイルの目的**: このファイル1つを読むだけで、AIと協働するためのプロジェクト構造を完全に再現できる。

---

## 目次

1. [コンセプト](#1-コンセプト)
2. [ディレクトリ構造](#2-ディレクトリ構造)
3. [各ファイルの完全な内容](#3-各ファイルの完全な内容)
4. [AIエージェント運用システム](#4-aiエージェント運用システム)
5. [ワークフロー](#5-ワークフロー)
6. [セットアップ手順](#6-セットアップ手順)

---

# 1. コンセプト

## 1.1 解決する問題

| 問題 | 解決策 |
|------|--------|
| ドキュメントが乱立し、どれが正しいか分からない | **Single Source of Truth**: `specs/` のみが仕様の源 |
| 同じ情報が複数箇所にあり、更新時に齟齬が発生 | 仕様は `specs/` に一元化、コードは参照のみ |
| タスク管理に外部ツールが必要 | **Issue-as-File**: ファイルでタスク管理 |
| AI Agentが文脈不足で誤った実装をする | 必読ファイルを明示、スキップ禁止を強制 |
| 過去の意思決定理由が不明 | **ADR**: `project/decisions/` に記録 |
| AIへのプロンプト作成が毎回手間 | **タスクファイル = プロンプト** として機能 |
| 並列でAIを使うと衝突・重複が起きる | **depends_on** で依存関係を管理 |

## 1.2 設計原則

1. **仕様は `specs/` にのみ存在する** - コード内コメントに仕様を書かない
2. **コードは仕様を参照する** - `// @see specs/features/xxx.md`
3. **タスクはファイルで管理** - `todo/` → `doing/` → `done/` に移動
4. **タスクファイル = AIへのプロンプト** - そのままAIに渡せる
5. **決定には理由を残す** - ADR形式で `decisions/` に記録
6. **全体像は `overview.md` に** - AIが最初に読むべきファイル
7. **オーケストレーターとサブエージェントの分離** - 計画と実行を分ける

## 1.3 ドキュメントの階層構造

```
overview.md          ← 「このシステムは何か」（幹）
    ↓
features/*.md        ← 「各機能はどう動くか」（枝）
    ↓
shared/*.md          ← 「どう作るか」（葉）
```

**AIが読む順序**:
1. `overview.md` - 全体像を把握
2. `features/{機能}.md` - 実装対象の詳細
3. `shared/*.md` - 共通ルール確認

---

# 2. ディレクトリ構造

**以下のディレクトリとファイルをすべて作成すること。**

```
{project-root}/
│
├── .github/
│   ├── copilot-instructions.md    # AI向け指示書（参照リンク集）
│   └── prompts/                       # ★ AIエージェント用プロンプト
│       ├── README.md                  # 使い方ガイド
│       ├── orchestrator.prompt.md            # オーケストレーター用（タスク分解）
│       └── subagent.prompt.md                # サブエージェント用（タスク実行）
│
├── specs/                          # ★ 仕様の唯一の源
│   ├── overview.md                # ★ システム全体像（最重要）
│   ├── README.md                  # specs/の使い方
│   ├── features/                   # 機能別仕様
│   │   └── {feature}.md
│   └── shared/                     # 共通仕様
│       ├── conventions.md          # コーディング規約
│       ├── colors.md               # カラー定義（UI系）
│       ├── typography.md           # タイポグラフィ（UI系）
│       └── components.md           # 共通コンポーネント（UI系）
│
├── project/                        # プロジェクト管理
│   ├── README.md
│   ├── changelog.md
│   ├── backlog/                    # タスク管理（Issue-as-File）
│   │   ├── README.md              # 運用ガイド
│   │   ├── todo/                  # 未着手タスク（AIプロンプトとして機能）
│   │   ├── doing/                 # 進行中（最大3個：WIP制限）
│   │   └── done/                  # 完了
│   └── decisions/                  # 意思決定記録（ADR）
│       └── 001-{name}.md
│
└── {src}/                          # ソースコード
```

---

# 3. 各ファイルの完全な内容

## 3.1 `.github/copilot-instructions.md`

**目的**: AIに「どこに何があるか」を伝える参照リンク集。100行以内を目標。

```markdown
# GitHub Copilot Instructions

## プロジェクト概要

**{プロジェクト名}** - {1文で説明}

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

- ❌ {禁止事項1}
- ❌ {禁止事項2}
- ❌ {禁止事項3}

## 技術スタック

- {技術1}
- {技術2}
- {技術3}

## 実装時の参照順序

1. `specs/overview.md` で全体像を把握
2. `specs/features/{機能}.md` で仕様確認
3. `specs/shared/conventions.md` で規約確認
4. 既存の類似実装を参考に
5. 完了後 `project/backlog/` を更新

## ディレクトリ構造

```
{src}/
├── {dir1}/
├── {dir2}/
└── ...

specs/
├── overview.md        # ★システム全体像（最初に読む）
├── features/          # 機能別仕様
└── shared/            # 共通仕様
```

## 命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| {対象1} | {規則} | {例} |
| {対象2} | {規則} | {例} |

## Type-only imports（必須）

```typescript
// ✅ Good
import type { User } from "../types";
import { mockUsers } from "../mockData";

// ❌ Bad
import { User } from "../types";
```
```

---

## 3.2 `specs/overview.md`（最重要）

**目的**: システム全体像を定義。AIが最初に読むべきファイル。

```markdown
# {プロジェクト名} システム概要

> 最終更新: YYYY-MM-DD
> このファイルは「システム全体像」を定義する。AIが最初に読むべきファイル。

---

## 1. プロジェクト概要

### 1.1 システム名
**{プロジェクト名}**

### 1.2 一言で言うと
{1文でシステムを説明}

### 1.3 解決する課題

| 課題 | 解決アプローチ |
|------|----------------|
| {課題1} | {アプローチ} |
| {課題2} | {アプローチ} |

### 1.4 対象ユーザー

| ロール | 対象 | 主な利用機能 |
|--------|------|--------------|
| {ロール1} | {対象} | {機能} |
| {ロール2} | {対象} | {機能} |

---

## 2. 機能一覧

| 機能 | 概要 | 仕様書 |
|------|------|--------|
| {機能1} | {説明} | → `features/{機能1}.md` |
| {機能2} | {説明} | → `features/{機能2}.md` |

---

## 3. デザイン哲学

### 3.1 基本原則

| 原則 | 具体的な方針 |
|------|-------------|
| {原則1} | {方針} |
| {原則2} | {方針} |

### 3.2 レイアウト方針

{レイアウトの基本構造をASCIIアートで図示}

### 3.3 色彩哲学

| 用途 | 色 | 意図 |
|------|-----|------|
| 基調色 | {色} | {意図} |
| アクセント | {色} | {意図} |

→ 具体的なカラーコード: `shared/colors.md`

---

## 4. 技術制約

### 4.1 技術スタック

| レイヤー | 技術 |
|----------|------|
| {レイヤー1} | {技術} |
| {レイヤー2} | {技術} |

### 4.2 禁止事項

| 禁止 | 理由 |
|------|------|
| {禁止事項1} | {理由} |
| {禁止事項2} | {理由} |

---

## 5. 非機能要件

| 要件 | 内容 |
|------|------|
| 対応ブラウザ | {内容} |
| 対応デバイス | {内容} |

---

## 6. 関連ドキュメント

### 機能仕様（詳細）
- `features/{機能1}.md` - {説明}
- `features/{機能2}.md` - {説明}

### 共通仕様
- `shared/colors.md` - カラーパレット
- `shared/typography.md` - タイポグラフィ
- `shared/components.md` - 共通コンポーネント
- `shared/conventions.md` - コーディング規約

---

## 7. 変更履歴

| 日付 | 変更内容 |
|------|----------|
| YYYY-MM-DD | 初版作成 |
```

---

## 3.3 `specs/README.md`

```markdown
# 仕様書（Specs）

## 概要

このディレクトリは **Single Source of Truth（唯一の真実の源）** です。
すべての仕様はここにのみ記載し、コード内には仕様を書きません。

## ディレクトリ構成

| ファイル/ディレクトリ | 内容 |
|---------------------|------|
| `overview.md` | **★システム全体像（最初に読む）** |
| `features/` | 機能別の仕様書 |
| `shared/` | 共通仕様（規約、カラー、コンポーネント等） |

## 読む順序

1. **`overview.md`** - システムが何か、全体像を把握
2. **`features/{機能}.md`** - 実装対象の機能仕様
3. **`shared/*.md`** - 共通ルール、スタイル定義

## コードからの参照方法

```typescript
// @see specs/features/user.md
export type User = {
  id: string;
  name: string;
};
```
```

---

## 3.4 `specs/features/{feature}.md`（テンプレート）

```markdown
# {機能名}機能

> 最終更新: YYYY-MM-DD
> ステータス: 未実装 | 実装中 | 実装完了

## 1. 概要

{1-2文で機能の目的を説明}

## 2. ユーザーストーリー

- {ロール}として、{行動}したい。なぜなら{理由}。

## 3. データ構造

### {型名}

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | string | ✓ | 一意識別子 |
| name | string | ✓ | 名前 |
| createdAt | Date | ✓ | 作成日時 |

## 4. コンポーネント

| 名前 | 責務 | Props |
|------|------|-------|
| XxxList | 一覧表示 | items: Xxx[] |
| XxxCard | 単体表示 | item: Xxx |
| XxxForm | 入力フォーム | onSubmit: (data) => void |

## 5. 画面仕様

### 5.1 一覧画面

- パス: `/xxx`
- 表示内容: {説明}
- アクション: {説明}

## 6. 変更履歴

| 日付 | 変更内容 |
|------|----------|
| YYYY-MM-DD | 初版作成 |
```

---

## 3.5 `specs/shared/conventions.md`

```markdown
# コーディング規約

> 最終更新: YYYY-MM-DD

## 1. 命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| コンポーネントファイル | PascalCase | `UserCard.tsx` |
| CSSモジュール | PascalCase.module.css | `UserCard.module.css` |
| 関数 | camelCase | `handleSubmit` |
| 定数 | UPPER_SNAKE_CASE | `MAX_LENGTH` |
| 型/インターフェース | PascalCase | `User`, `UserProps` |
| CSS変数 | kebab-case | `--color-bg-primary` |

## 2. TypeScript

### Type-only imports（必須）

```typescript
// ✅ Good
import type { User } from './types';
import { mockUsers } from './mock';

// ❌ Bad
import { User } from './types';
```

### 仕様参照コメント

```typescript
// @see specs/features/diary.md
export interface DiaryPost { ... }
```

## 3. React

```typescript
// ✅ Good: 通常の関数 + Props分割代入
interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card = ({ title, children }: CardProps) => {
  return <div>{children}</div>;
};

export default Card;

// ❌ Bad: React.FCは使用しない
const Card: React.FC<CardProps> = () => {};
```

## 4. CSS Modules

```css
/* ✅ Good: CSS変数を使用 */
.button {
  background-color: var(--color-accent-blue);
  padding: var(--spacing-sm);
}

/* ❌ Bad: ハードコード */
.button {
  background-color: #4DB8E8;
  padding: 8px;
}
```

## 5. 禁止事項

| 禁止 | 理由 | 代替案 |
|------|------|--------|
| `any` 型 | 型安全性 | `unknown` または適切な型 |
| `React.FC` | 不要な型推論 | 通常の関数宣言 |
| CSS値ハードコード | 一貫性 | CSS変数を使用 |

## 変更履歴

| 日付 | 変更内容 |
|------|----------|
| YYYY-MM-DD | 初版作成 |
```

---

## 3.6 `specs/shared/colors.md`

```markdown
# カラー定義

> 最終更新: YYYY-MM-DD

## CSS変数

```css
:root {
  /* Primary */
  --color-primary: #007bff;
  --color-primary-hover: #0056b3;
  
  /* Background */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8f9fa;
  
  /* Text */
  --color-text-primary: #212529;
  --color-text-secondary: #6c757d;
  
  /* Border */
  --color-border: #dee2e6;
  
  /* Status */
  --color-success: #28a745;
  --color-warning: #ffc107;
  --color-error: #dc3545;
}
```

## 使用ルール

- ❌ カラーコードを直接書かない
- ✅ CSS変数を使用する
```

---

# 4. AIエージェント運用システム

## 4.1 概念

このシステムは **2種類のAIエージェント** を使い分けます：

| エージェント | 役割 | 渡すファイル |
|-------------|------|-------------|
| **オーケストレーター** | タスク分解・計画 | `.github/prompts/orchestrator.prompt.md` |
| **サブエージェント** | タスク実行 | `.github/prompts/subagent.prompt.md` + タスクファイル |

**重要な分離原則:**
- オーケストレーターは **計画のみ** 行い、コードを書かない
- サブエージェントは **タスクファイルのみ** を見て作業する（オーケストレーターの存在を知らない）

## 4.2 依存関係による並列実行管理

タスクは `depends_on` フィールドで依存関係を管理します：

```
feature-types.md     (depends_on: [])
        ↓
feature-mock.md      (depends_on: [feature-types])
feature-card.md      (depends_on: [feature-types])
        ↓
feature-page.md      (depends_on: [feature-mock, feature-card])
```

**実行可能判定ルール:**
```
タスクが実行可能 ⟺
  1. todo/ にある
  2. depends_on が空、または
  3. depends_on の全タスクが done/ にある
```

**命名規則:** `{feature}-{task}.md`

例:
- `mentor-types.md` - 型定義（依存なし）
- `mentor-card.md` - コンポーネント（型に依存）
- `mentor-mock.md` - モックデータ（型に依存、並列可）
- `mentor-page.md` - ページ統合（card, mockに依存）

---

## 4.3 `.github/prompts/README.md`

```markdown
# プロンプトファイル

このディレクトリには、AIエージェント向けのプロンプトが格納されています。

## ファイル一覧

| ファイル | 用途 | 渡す対象 |
|----------|------|----------|
| `orchestrator.prompt.md` | タスク分解・計画 | 計画担当AI |
| `subagent.prompt.md` | タスク実行 | 実装担当AI |

## 使い方

### オーケストレーター（タスク分解）

1. `orchestrator.prompt.md` をAIに渡す
2. 実行したいタスクを伝える
3. AIがタスクを分解し、`project/backlog/todo/*.md` を生成

### サブエージェント（タスク実行）

1. `subagent.prompt.md` + タスクファイル（`project/backlog/todo/*.md`）をAIに渡す
2. AIがタスクを実行
3. 完了報告を受け取る

## ワークフロー

```
[ユーザー]
    │
    ▼ 依頼
[orchestrator.prompt.md を渡す]
    │
    ▼ タスク分解・依存関係特定
[project/backlog/todo/*.md が生成される]
    │
    ▼ 実行可能タスクを doing/ に移動
[subagent.prompt.md + タスクファイル を渡す] ×並列
    │
    ▼ 実装
[完了したタスクを done/ に移動]
    │
    ▼ 新たに実行可能になったタスクを開始...
```
```

---

## 4.4 `.github/prompts/orchestrator.prompt.md`

```markdown
# オーケストレーター プロンプト

> **使い方**: このファイル全体をAIに渡し、実行したいタスクを伝える。

---

## あなたの役割

あなたは **オーケストレーター**（計画担当AI）です。

**やること:**
- ユーザーの依頼を実行可能な小タスクに分解
- 各タスクを `project/backlog/todo/*.md` として生成
- 依存関係（depends_on）を特定し、実行可能なタスクを明示

**やらないこと:**
- コードの実装（タスクファイル生成のみ）
- サブエージェントへの直接指示

---

## 手順

### Step 1: コンテキスト取得（必須）

以下を **この順序で** 読んでから作業を開始:

| 順序 | ファイル | 目的 |
|------|----------|------|
| 1 | `specs/overview.md` | システム全体像、技術制約、禁止事項 |
| 2 | `specs/shared/conventions.md` | 命名規則、ファイル構成 |
| 3 | `specs/features/*.md` | 依頼に関連する機能の仕様 |
| 4 | `project/backlog/doing/` | 進行中タスク（衝突回避） |
| 5 | `project/backlog/todo/` | 既存の未着手タスク |

### Step 2: タスク分解

**分解の原則:**

| 原則 | 説明 |
|------|------|
| 単一責任 | 1タスク = 1つの明確な成果物 |
| 独立実行可能 | 依存タスク完了後、単独で実行できる |
| 検証可能 | 完了条件が明確 |
| スコープ限定 | 編集ファイルは最小限 |

**典型的な分解パターン:**

```
機能実装の依頼
  ↓
├── 型定義（types/*.ts）         depends_on: []
├── モックデータ（mockData/*）   depends_on: [types]
├── コンポーネントA              depends_on: [types]
├── コンポーネントB              depends_on: [types]
└── ページ統合（pages/*）        depends_on: [mock, componentA, componentB]
```

### Step 3: タスクファイル生成

**ファイル名:** `project/backlog/todo/{feature}-{task}.md`

例: `mentor-types.md`, `mentor-card.md`

**フォーマット:**

```markdown
---
id: {feature}-{task}
feature: {feature-name}
depends_on: [{dependency-ids}]
scope_files:
  - {編集対象ファイル}
forbidden_files:
  - {触ってはいけないパターン}
created_at: {YYYY-MM-DD}
---

# タスク: {タイトル}

> このファイルはサブエージェントへの作業指示書です。

## 0. 必読ファイル（スキップ禁止）

以下を **必ず読んでから** 作業開始:

1. `specs/overview.md` - システム全体像
2. `specs/features/{feature}.md` - この機能の仕様
3. `specs/shared/conventions.md` - コーディング規約

## 1. タスク概要

{1-2文で説明}

## 2. 完了条件

- [ ] {条件1}
- [ ] {条件2}
- [ ] TypeScriptエラーがないこと

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `{パス}` | 新規作成/編集 |

**上記以外は編集禁止**

## 4. 参考実装

- `{パス}` - {参考になる点}

## 5. 技術的制約

- ❌ `any` 型禁止
- ❌ CSS値ハードコード禁止（CSS変数使用）
- ❌ 外部ライブラリ追加禁止
- ✅ `import type` で型をimport

## 6. 完了報告

作業完了時に以下を報告:
- タスクID
- 作成/編集ファイル
- 主要な変更点
- 未解決の問題
```

### Step 4: 実行計画の出力

```markdown
## コンテキスト取得結果

- specs/overview.md ✓
- specs/shared/conventions.md ✓
- specs/features/{feature}.md ✓
- project/backlog/doing/ ✓（衝突なし）

## 実行計画

### 今すぐ実行可能なタスク
| タスクID | 概要 | 編集対象 | depends_on |
|----------|------|----------|------------|
| xxx-types | 型定義 | types/*.ts | なし |

### 依存待ちのタスク
| タスクID | 概要 | 編集対象 | depends_on |
|----------|------|----------|------------|
| xxx-mock | モック | mockData/* | xxx-types |
| xxx-card | カード | components/* | xxx-types |
| xxx-page | ページ | pages/* | xxx-mock, xxx-card |

## 生成したタスクファイル

1. `xxx-types.md` (実行可能)
2. `xxx-mock.md` (xxx-types 完了待ち)
3. `xxx-card.md` (xxx-types 完了待ち)
4. `xxx-page.md` (xxx-mock, xxx-card 完了待ち)
```

---

## チェックリスト

タスクファイル生成前に確認:

- [ ] 各タスクが単一責任
- [ ] 依存関係（depends_on）が正しい
- [ ] 同時実行で同じファイルを編集するタスクがない
- [ ] 全タスクに必読ファイルが含まれている
- [ ] 編集対象ファイルが明示されている

---

## タスク実行の手順（人間向け）

1. 「今すぐ実行可能なタスク」を `doing/` に移動
2. 各タスクファイルを **サブエージェント** に渡す（`.github/prompts/subagent.prompt.md` + タスクファイル）
3. 完了したタスクを `done/` に移動
4. 新たに「実行可能」になったタスクを確認し、繰り返す

**注意:**
- `doing/` は最大3個（WIP制限）
- 同じファイルを編集するタスクは同時に実行しない
```

---

## 4.5 `.github/prompts/subagent.prompt.md`

```markdown
# サブエージェント プロンプト

> **使い方**: このファイルと、実行するタスクファイル（`project/backlog/todo/*.md` or `doing/*.md`）をAIに渡す。

---

## あなたの役割

あなたは **実装担当AI** です。

渡されたタスクファイルに書かれていることだけを実行してください。

---

## 作業手順

### Step 1: タスクファイルを確認

渡されたタスクファイル（`.md`）を読み、以下を把握:

- タスク概要
- 完了条件
- 編集対象ファイル
- 技術的制約

### Step 2: 必読ファイルを読む（スキップ禁止）

タスクファイルの「必読ファイル」セクションに記載されているファイルを **すべて読んでから** 作業開始。

**典型的な必読ファイル:**

| ファイル | 読む目的 |
|----------|----------|
| `specs/overview.md` | システム全体像、禁止事項 |
| `specs/features/{機能}.md` | この機能の仕様 |
| `specs/shared/conventions.md` | 命名規則、コーディング規約 |

### Step 3: 参考実装を確認

タスクファイルに「参考実装」があれば、そのファイルを読んで実装パターンを把握。

### Step 4: 実装

タスクファイルに記載された **編集対象ファイルのみ** を編集。

**絶対に守ること:**

- ❌ `any` 型を使わない
- ❌ CSS値をハードコードしない（CSS変数を使用）
- ❌ 外部ライブラリを追加しない
- ❌ 編集対象以外のファイルを変更しない
- ✅ `import type` で型をimport
- ✅ 既存の実装パターンに従う

### Step 5: 完了報告

作業完了後、以下のフォーマットで報告:

```markdown
## 完了報告

### タスクID
{タスクファイルのid}

### 作成/編集したファイル
- `{ファイル1}` - 新規作成
- `{ファイル2}` - 編集

### 主要な変更点
- {変更点1}
- {変更点2}

### 検証結果
- [ ] TypeScriptエラーなし
- [ ] CSS変数使用
- [ ] 命名規則準拠

### 未解決の問題
なし
```

---

## 失敗時の対応

以下の場合は作業を中断し、報告:

- 必読ファイルが見つからない
- 依存するファイル（型定義等）が存在しない
- 仕様に不明点がある
- 編集対象外のファイルを変更する必要がある

**中断報告フォーマット:**

```markdown
## 中断報告

### タスクID
{id}

### 中断理由
{具体的な理由}

### 必要な情報/対応
{何が解決されれば再開できるか}
```

---

## 重要な注意

- **タスクファイルに書かれていないことはやらない**
- **判断に迷ったら中断して報告**
- **他のタスクの存在を気にしない**（あなたはこのタスクだけに集中）
```

---

## 4.6 `project/backlog/README.md`

```markdown
# バックログ管理

## 概要

このディレクトリでタスク（Issue相当）を管理します。
**タスクファイル = AIエージェントへのプロンプト** として機能します。

---

## 2つの起動方法

### 方法1: オーケストレーターに依頼（推奨）

**大きな機能や複数タスクがある場合**

1. `.github/prompts/orchestrator.prompt.md` をAIに渡す
2. 実装したい機能を依頼
3. オーケストレーターがタスクを分解し、`todo/` にファイルを生成
4. 生成されたタスクをサブエージェントに渡して実行

### 方法2: todoファイルを直接渡す

**単発タスクの場合**

1. `.github/prompts/subagent.prompt.md` + `todo/` 内のタスクファイルをAIに渡す
2. AIがタスクを実行

---

## ディレクトリ

| ディレクトリ | 説明 | 制限 |
|-------------|------|------|
| `todo/` | 未着手タスク（実行可能なプロンプト） | なし |
| `doing/` | 進行中タスク | **最大3個** |
| `done/` | 完了タスク | 削除しない |

---

## タスクファイルのフォーマット

### 必須構造

```markdown
---
id: {feature}-{task-name}
feature: {feature-name}
depends_on: [{dependency-ids}]
scope_files:
  - {編集対象ファイル}
forbidden_files:
  - {触ってはいけないパターン}
created_at: {YYYY-MM-DD}
---

# タスク: {タスクタイトル}

## 0. 最初に必ず読むファイル（スキップ禁止）
## 1. タスク概要
## 2. 完了条件
## 3. 編集対象ファイル
## 4. 参考にすべき既存実装
## 5. 技術的制約
## 6. 実装のヒント
## 7. 作業完了時の報告
## 8. 失敗した場合
```

---

## 実行可能判定

タスクは以下の条件を満たすとき **実行可能** です：

1. `todo/` に存在する
2. `depends_on` が空、**または**
3. `depends_on` に記載された全タスクが `done/` に移動済み

**例:**
```
todo/mentor-types.md    depends_on: []           → 実行可能
todo/mentor-mock.md     depends_on: [mentor-types]
todo/mentor-card.md     depends_on: [mentor-types]

# mentor-types が done/ に移動したら:
todo/mentor-mock.md     depends_on: [mentor-types] → 実行可能
todo/mentor-card.md     depends_on: [mentor-types] → 実行可能
```

---

## ワークフロー

```
ユーザー依頼
    ↓
┌─────────────────────────────────────┐
│ .github/prompts/orchestrator.prompt.md をAIに渡す │
│ → タスク分解・依存関係特定          │
│ → todo/ にタスクファイル生成        │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 実行可能タスクを doing/ に移動      │
│ → .github/prompts/subagent.prompt.md + タスクを   │
│   サブAIに渡す                      │
│ → サブAIが実行・報告                │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 完了タスクを done/ に移動           │
│ → 新たに実行可能になったタスクを確認│
│ → 繰り返す...                       │
└─────────────────────────────────────┘
```

---

## 命名規則

```
{feature}-{task-name}.md

例:
mentor-types.md      # mentor機能, 型定義
mentor-card.md       # mentor機能, カード
mentor-mock.md       # mentor機能, モックデータ
mentor-page.md       # mentor機能, ページ
```

---

## 関連ファイル

| ファイル | 用途 |
|----------|------|
| `.github/prompts/orchestrator.prompt.md` | オーケストレーターへの指示書 |
| `.github/prompts/subagent.prompt.md` | サブエージェントへの指示書 |
| `specs/overview.md` | システム全体像（全タスク共通の必読） |
| `specs/shared/conventions.md` | コーディング規約（全タスク共通の必読） |
```

---

## 4.7 タスクファイル具体例

以下は実際のタスクファイルの例です。この形式でオーケストレーターがタスクを生成します。

```markdown
---
id: mentor-types
feature: mentor
depends_on: []
scope_files:
  - frontend/src/types/mentor.ts
forbidden_files:
  - frontend/src/components/
  - frontend/src/pages/
  - frontend/src/mockData/
created_at: 2025-11-26
---

# タスク: メンター機能の型定義作成

> **重要**: このファイルはあなたへの作業指示書です。
> このファイルに書かれていることだけを実行してください。

---

## 0. 最初に必ず読むファイル（スキップ禁止）

以下のファイルを **必ず最初に読んでから** 作業を開始してください。

**読まずに作業を始めることは禁止です。**

| 順序 | ファイル | 読む目的 |
|------|----------|----------|
| 1 | `specs/overview.md` | システム全体像・技術制約 |
| 2 | `specs/features/mentor.md` | メンター機能の仕様 |
| 3 | `specs/shared/conventions.md` | コーディング規約 |
| 4 | `frontend/src/types/diary.ts` | 既存の型定義パターン |

### 読んだ後の確認

上記を読んだ後、以下を把握していることを確認：

- [ ] 対象ユーザー（小中学生）を理解した
- [ ] 技術スタック（React 18, TypeScript, CSS Modules）を理解した
- [ ] 禁止事項を理解した
- [ ] メンターが持つべき情報（名前、専門分野、自己紹介等）を理解した
- [ ] 型定義の命名規則を理解した

---

## 1. タスク概要

メンター機能で使用する型定義を作成する。
メンター情報、専門分野、メンターリストなどの型を定義する。

---

## 2. 完了条件

以下を **すべて** 満たすこと：

- [ ] `frontend/src/types/mentor.ts` が作成されている
- [ ] `Mentor` 型が定義されている（id, name, avatar, specialties, introduction, createdAt）
- [ ] `Specialty` 型が定義されている（専門分野）
- [ ] 必要に応じて関連型（MentorStatus等）が定義されている
- [ ] TypeScriptエラーがないこと
- [ ] `@see specs/features/mentor.md` コメントが先頭にあること

---

## 3. 編集対象ファイル（これだけ触る）

| ファイル | 操作 | 説明 |
|----------|------|------|
| `frontend/src/types/mentor.ts` | 新規作成 | メンター関連の型定義 |

### ⚠️ 重要な制約

- **上記以外のファイルは編集禁止**
- 特に以下は絶対に触らない：
  - `frontend/src/components/`
  - `frontend/src/pages/`
  - `frontend/src/mockData/`

---

## 4. 参考にすべき既存実装

作業前に以下のファイルを確認し、実装パターンを把握してください：

| ファイル | 参考になる点 |
|----------|-------------|
| `frontend/src/types/diary.ts` | 型定義の構造、コメントの書き方 |
| `frontend/src/types/user.ts` | ユーザー関連型の定義パターン |

---

## 5. 技術的制約

### 禁止事項（このプロジェクト共通）

| 禁止 | 理由 | 代替 |
|------|------|------|
| `any` 型 | 型安全性 | 適切な型を定義 |
| `interface` の乱用 | 統一性 | `type` を優先 |
| 外部ライブラリの型 | 依存を減らす | 自前で定義 |

### 必須事項

- ファイル先頭に `// @see specs/features/mentor.md` コメント
- 各型に JSDoc コメントで説明を付ける
- `export type` で named export

---

## 6. 実装のヒント

```typescript
// @see specs/features/mentor.md

/** メンターの専門分野 */
export type Specialty = {
  id: string;
  name: string;
  // ...
};

/** メンター情報 */
export type Mentor = {
  id: string;
  name: string;
  avatar?: string;
  specialties: Specialty[];
  introduction: string;
  createdAt: Date;
  // ...
};
```

---

## 7. 作業完了時の報告

作業が完了したら、以下のフォーマットで報告してください：

```markdown
## 完了報告

### タスクID
mentor-types

### 作成/編集したファイル
- `frontend/src/types/mentor.ts` - 新規作成

### 主要な変更点
- Mentor型を定義
- Specialty型を定義
- （その他定義した型）

### 検証結果
- [ ] TypeScriptエラーなし
- [ ] @see コメントあり
- [ ] JSDocコメントあり

### 未解決の問題
- なし
```

---

## 8. 失敗した場合

以下の場合は作業を中断し、報告してください：

- `specs/features/mentor.md` が見つからない、または不完全
- 既存の型と競合する
- 仕様に不明点がある

**中断報告フォーマット**:

```markdown
## 中断報告

### タスクID
mentor-types

### 中断理由
{具体的な理由}

### 必要な情報/対応
{何が解決されれば再開できるか}
```
```

---

## 4.8 `project/decisions/001-template.md`（ADRテンプレート）

```markdown
# 001: {決定タイトル}

## 日付
YYYY-MM-DD

## ステータス
採用

## コンテキスト
{なぜこの決定が必要だったか、背景を説明}

## 検討した選択肢

### 選択肢A: {名前}
- メリット: {説明}
- デメリット: {説明}

### 選択肢B: {名前}
- メリット: {説明}
- デメリット: {説明}

## 決定
{選択肢X}を採用する。

## 理由
{なぜこの選択をしたか}

## 影響
- {影響1}
- {影響2}
```

---

# 5. ワークフロー

## 5.1 新機能を追加する

```
1. specs/features/{機能名}.md を作成（仕様を書く）
2. specs/overview.md の機能一覧に追加
3. .github/prompts/orchestrator.prompt.md をAIに渡し、機能を依頼
4. オーケストレーターが project/backlog/todo/ にタスクファイルを生成
5. 実行可能なタスク（depends_on 解決済み）を doing/ に移動
6. .github/prompts/subagent.prompt.md + タスクファイルをAIに渡して実行
7. 完了したタスクを done/ に移動
8. 新たに実行可能になったタスクを確認し繰り返す
9. 全タスク完了後、changelog.md に記録
```

## 5.2 仕様を変更する

```
1. specs/features/{機能名}.md を編集
2. 変更履歴セクションに日付と内容を追記
3. 必要に応じて specs/overview.md も更新
4. 関連するコードを更新
5. changelog.md に記録
```

## 5.3 技術的な決定をする

```
1. project/decisions/{番号}-{名前}.md を作成
2. コンテキスト、選択肢、決定、理由を記述
3. 必要に応じて specs/overview.md の技術制約セクションを更新
4. .github/copilot-instructions.md を更新
```

---

# 6. セットアップ手順

## 6.1 AI Agentへの指示

このテンプレートを元に新しいプロジェクトを作成する際、以下をAIに伝えてください：

```
このテンプレート（PROJECT_STRUCTURE_TEMPLATE.md）に基づいて、
以下のプロジェクトの構成を作成してください。
すべてのディレクトリとファイルを作成し、プレースホルダ（{...}）を
プロジェクト固有の内容に置き換えてください。

プロジェクト名: {名前}
概要: {説明}
対象ユーザー: {ユーザー}
解決する課題: {課題}
技術スタック: {言語, フレームワーク等}
禁止事項: {any型禁止, 等}
主要機能: {機能1}, {機能2}, {機能3}
デザイン方針: {方針}
```

## 6.2 セットアップ完了チェックリスト

### 必須ファイル

- [ ] `.github/copilot-instructions.md` - プロジェクト固有の情報を記入
- [ ] `.github/prompts/README.md` - そのまま使用
- [ ] `.github/prompts/orchestrator.prompt.md` - そのまま使用
- [ ] `.github/prompts/subagent.prompt.md` - そのまま使用
- [ ] `specs/overview.md` - **★最重要** システム全体像を詳細に記述
- [ ] `specs/README.md` - そのまま使用
- [ ] `specs/shared/conventions.md` - プロジェクト固有のルールを記入
- [ ] `project/README.md` - そのまま使用
- [ ] `project/backlog/README.md` - そのまま使用
- [ ] `project/changelog.md` - 初期エントリを記入

### UI系プロジェクトの場合

- [ ] `specs/shared/colors.md` - カラー定義を記入
- [ ] `specs/shared/typography.md` - フォント設定を記入
- [ ] `specs/shared/components.md` - 共通コンポーネント仕様を記入

### プロジェクト開始時

- [ ] `specs/features/` - 主要機能の仕様を作成
- [ ] `project/backlog/todo/` - 初期タスクを作成（または orchestrator で生成）
- [ ] `project/decisions/001-xxx.md` - 技術選定の決定を記録

---

# この構成のメリット

| メリット | 説明 |
|----------|------|
| **AI Agentとの協働が容易** | overview.mdで全体像を把握、必読ファイルで品質担保 |
| **並列実行が安全** | depends_onで依存関係を管理、ファイル競合を防止 |
| **継続的なタスク追加** | 依存関係ベースなのでいつでもタスク追加可能 |
| **コンテキスト不足の防止** | タスクファイルに必読ファイルを明示、スキップ禁止 |
| **情報の一貫性** | 仕様は1箇所にのみ存在、更新漏れが起きない |
| **外部ツール不要** | タスク管理がファイルベースで完結 |
| **Git親和性** | すべてがテキストファイル、差分が追跡可能 |
| **決定の透明性** | なぜその技術を選んだか、後から分かる |
| **新メンバーのオンボーディング** | overview.mdを読めば全体が分かる |
| **タスクファイルの再利用** | 同じ形式のタスクは別プロジェクトでも使える |

---

# よくある質問

## Q: overview.md と features/*.md の違いは？

**overview.md**: 「このシステムは何か」を定義
- 全体像、対象ユーザー、機能一覧
- デザイン哲学（なぜそうするか）
- 技術制約（何を禁止するか）

**features/*.md**: 「各機能がどう動くか」を定義
- データ構造、コンポーネント、画面仕様
- 実装に必要な詳細情報

## Q: オーケストレーターとサブエージェントを分ける理由は？

1. **責務の分離**: 計画と実装を分けることで品質向上
2. **並列実行の安全性**: サブエージェントは他のタスクを知らないので、干渉しない
3. **再利用性**: タスクファイルは独立しているので、別のAIでも実行可能
4. **デバッグの容易さ**: 問題が起きた時、計画の問題か実装の問題か切り分けやすい

## Q: depends_on（依存関係）方式を使う理由は？

1. **依存関係の明示**: 型定義 → コンポーネント → ページの順序を強制
2. **並列実行の最大化**: 依存関係がないタスクは並列実行可能
3. **継続的なタスク追加**: いつでも新しいタスクを追加でき、依存解決済みから実行
4. **進捗の可視化**: 「実行可能」「依存待ち」で進捗を把握できる
5. **衝突の防止**: 同じファイルを編集するタスクを同時に実行しない

## Q: タスクファイルに「必読ファイル」を毎回書く理由は？

AIは前のセッションの文脈を覚えていません。毎回「最初に読むべきファイル」を明示することで：
- 文脈不足による誤実装を防止
- 一貫した品質を確保
- 新しいAIエージェントでも同じ結果を得られる

## Q: WIP制限（doing/ 最大3個）の理由は？

1. **並行作業が増えると品質が下がる**
2. **コンテキストスイッチのコストが高い**
3. **完了までの時間が長くなる**
4. **3個を超えると管理が困難になる**

---

# 変更履歴

| 日付 | 変更内容 |
|------|----------|
| 2025-11-26 | Wave方式を廃止、depends_on（依存関係）ベースに全面移行 |
| 2025-11-26 | AIエージェント運用システム（オーケストレーター/サブエージェント）を追加 |
| 2025-11-26 | .github/prompts/ ディレクトリ構成を追加 |
| 2025-11-25 | overview.md の概念を追加 |
| 2025-11-25 | 初版作成 |
