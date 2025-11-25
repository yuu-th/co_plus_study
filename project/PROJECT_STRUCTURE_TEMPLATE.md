# プロジェクト構成テンプレート

> **このファイルの使い方**: AI Agentにこのファイル全体を渡し、「このテンプレートに基づいてプロジェクト構成を作成してください」と指示する。

---

## 1. コンセプト

### 1.1 解決する問題

| 問題 | 解決策 |
|------|--------|
| ドキュメントが乱立し、どれが正しいか分からない | **Single Source of Truth**: `specs/`のみが仕様の源 |
| 同じ情報が複数箇所にあり、更新時に齟齬が発生 | 仕様は`specs/`に一元化、コードは参照のみ |
| タスク管理に外部ツールが必要 | **Issue-as-File**: ファイルでタスク管理 |
| AI Agentが文脈不足で誤った実装をする | `copilot-instructions.md`で参照先を明示 |
| 過去の意思決定理由が不明 | **ADR**: `project/decisions/`に記録 |
| 機能仕様はあるが全体像が分からない | **overview.md**: システム全体像を1ファイルに集約 |

### 1.2 設計原則

1. **仕様は`specs/`にのみ存在する** - コード内コメントに仕様を書かない
2. **コードは仕様を参照する** - `// @see specs/features/xxx.md`
3. **タスクはファイルで管理** - `todo/` → `doing/` → `done/` に移動
4. **決定には理由を残す** - ADR形式で`decisions/`に記録
5. **AI Agentへの指示は参照リンク集** - 情報本体は各所に、指示書は軽量に
6. **全体像は`overview.md`に** - AIが最初に読むべきファイル

### 1.3 ドキュメントの階層構造

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

## 2. ディレクトリ構造

**以下のディレクトリとファイルをすべて作成すること。**

```
{project-root}/
│
├── .github/
│   └── copilot-instructions.md    # AI向け指示書（参照リンク集）
│
├── specs/                          # ★ 仕様の唯一の源
│   ├── overview.md                # ★ システム全体像（最重要）
│   ├── README.md                  # specs/の使い方
│   ├── _templates/
│   │   └── feature-spec.md        # 機能仕様テンプレート
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
│   │   ├── README.md
│   │   ├── todo/
│   │   ├── doing/                  # 最大3個（WIP制限）
│   │   └── done/
│   └── decisions/                  # 意思決定記録（ADR）
│       └── 001-{name}.md
│
└── {src}/                          # ソースコード
```

---

## 3. 各ファイルの完全な内容

### 3.1 `specs/overview.md`（最重要）

**このファイルの目的**: システム全体像を定義する。AIが最初に読むべきファイル。

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

### 3.4 タイポグラフィ哲学

| 要素 | 方針 |
|------|------|
| 本文 | {方針} |
| 見出し | {方針} |

→ 具体的なフォント設定: `shared/typography.md`

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

### 3.2 `.github/copilot-instructions.md`

**このファイルの目的**: AI/Copilotに対して「どこに何があるか」を伝える参照リンク集。100行以内を目標。

```markdown
# GitHub Copilot Instructions

## プロジェクト概要
**{プロジェクト名}** - {1文で説明}

→ **システム全体像は `specs/overview.md` を参照**

## 情報の場所（Single Source of Truth）

| 知りたいこと | 見る場所 |
|-------------|----------|
| **システム全体像** | `specs/overview.md` ★最初に読む |
| 機能の仕様 | `specs/features/{機能名}.md` |
| 共通ルール | `specs/shared/conventions.md` |
| カラー定義 | `specs/shared/colors.md` |
| コンポーネント仕様 | `specs/shared/components.md` |
| やるべきこと | `project/backlog/todo/` |
| 進行中タスク | `project/backlog/doing/` |
| 完了タスク | `project/backlog/done/` |
| 過去の決定理由 | `project/decisions/` |

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
```

---

### 3.3 `specs/README.md`

```markdown
# 仕様書（Specs）

## 概要

このディレクトリは **Single Source of Truth（唯一の真実の源）** です。
すべての仕様はここにのみ記載し、コード内には仕様を書きません。

## ディレクトリ構成

| ファイル/ディレクトリ | 内容 |
|---------------------|------|
| `overview.md` | **★システム全体像（最初に読む）** |
| `_templates/` | 新規作成時に使うテンプレート |
| `features/` | 機能別の仕様書 |
| `shared/` | 共通仕様（規約、カラー、コンポーネント等） |

## 読む順序

1. **`overview.md`** - システムが何か、全体像を把握
2. **`features/{機能}.md`** - 実装対象の機能仕様
3. **`shared/*.md`** - 共通ルール、スタイル定義

## 運用ルール

### 仕様の追加・変更

1. 該当する `specs/features/*.md` または `specs/shared/*.md` を編集
2. 変更履歴セクションに日付と内容を追記
3. 関連するコードを更新（コードは仕様を参照するだけ）

### コードからの参照方法

```typescript
// @see specs/features/user.md
export type User = {
  id: string;
  name: string;
};
```

### 新機能追加の流れ

1. `specs/_templates/feature-spec.md` をコピー
2. `specs/features/{機能名}.md` として保存
3. 仕様を記述
4. `overview.md` の機能一覧に追加
5. 実装開始
```

---

### 3.4 `specs/_templates/feature-spec.md`

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

### 5.2 詳細画面

- パス: `/xxx/:id`
- 表示内容: {説明}

## 6. 状態管理

| 状態 | 型 | 初期値 | 説明 |
|------|-----|--------|------|
| items | Xxx[] | [] | アイテム一覧 |
| loading | boolean | false | 読み込み中 |

## 7. API/データソース

{バックエンドがある場合はエンドポイント、ない場合はモックデータの場所}

## 8. 変更履歴

| 日付 | 変更内容 |
|------|----------|
| YYYY-MM-DD | 初版作成 |
```

---

### 3.5 `specs/shared/conventions.md`

```markdown
# コーディング規約

> 最終更新: YYYY-MM-DD

## 1. 命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| コンポーネントファイル | PascalCase | `UserCard.tsx` |
| 関数 | camelCase | `handleSubmit` |
| 定数 | UPPER_SNAKE_CASE | `MAX_LENGTH` |
| 型/インターフェース | PascalCase | `User`, `UserProps` |

## 2. ファイル構成

{プロジェクト固有のディレクトリ構造}

## 3. インポート順序

```typescript
// 1. 外部ライブラリ
import { useState } from 'react';

// 2. 内部モジュール
import { Button } from '@/components/common';

// 3. 相対パス
import { helper } from './helper';

// 4. 型（type-only import）
import type { User } from '@/types';

// 5. スタイル
import styles from './UserCard.module.css';
```

## 4. 禁止事項

| 禁止 | 理由 | 代替案 |
|------|------|--------|
| {禁止1} | {理由} | {代替} |
| {禁止2} | {理由} | {代替} |

## 5. 変更履歴

| 日付 | 変更内容 |
|------|----------|
| YYYY-MM-DD | 初版作成 |
```

---

### 3.6 `specs/shared/colors.md`

```markdown
# カラー定義

> 最終更新: YYYY-MM-DD

## デザイン意図

→ 詳細は `overview.md` の「色彩哲学」セクションを参照

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

## 変更履歴

| 日付 | 変更内容 |
|------|----------|
| YYYY-MM-DD | 初版作成 |
```

---

### 3.7 `project/README.md`

```markdown
# プロジェクト管理

このディレクトリはプロジェクトの管理情報を格納します。

## ディレクトリ構成

| パス | 内容 |
|------|------|
| `backlog/` | タスク管理（Issue-as-File方式） |
| `decisions/` | 意思決定記録（ADR） |
| `changelog.md` | 変更履歴 |

## Issue-as-File方式

外部ツール（GitHub Issues等）を使わず、ファイルでタスクを管理します。

```
backlog/
├── todo/     # 未着手 → 優先度順にファイル名でソート
├── doing/    # 進行中 → 最大3個まで（WIP制限）
└── done/     # 完了 → 削除しない（履歴として残す）
```

## 運用フロー

1. 新タスク発見 → `todo/` にファイル作成
2. 着手 → `doing/` にファイル移動
3. 完了 → `done/` にファイル移動、完了日を追記
```

---

### 3.8 `project/backlog/README.md`

```markdown
# バックログ管理

## ディレクトリ

| ディレクトリ | 説明 | 制限 |
|-------------|------|------|
| `todo/` | 未着手タスク | なし |
| `doing/` | 進行中タスク | **最大3個**（WIP制限） |
| `done/` | 完了タスク | 削除しない |

## ファイル命名規則

```
{優先度}-{カテゴリ}-{タスク名}.md

例:
p1-auth-login-form.md      # 優先度1、認証カテゴリ
p2-ui-button-refactor.md   # 優先度2、UIカテゴリ
```

## タスクファイルのフォーマット

```markdown
# {タスクタイトル}

## 概要
{何をするか1-2文で}

## 参照仕様
→ specs/features/{関連機能}.md

## 完了条件
- [ ] {条件1}
- [ ] {条件2}

## 履歴
- YYYY-MM-DD: 作成
- YYYY-MM-DD: 完了
```

## WIP制限の理由

`doing/` は最大3個までに制限。

- 並行作業が増えると品質が下がる
- コンテキストスイッチのコストが高い
- 完了までの時間が長くなる
```

---

### 3.9 `project/changelog.md`

```markdown
# 変更履歴

## YYYY-MM-DD

### 初期セットアップ
- プロジェクト構造を作成
- 基本的な仕様を定義
```

---

### 3.10 `project/decisions/001-template.md`

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

## 4. 運用ワークフロー

### 4.1 新機能を追加する

```
1. specs/_templates/feature-spec.md をコピー
2. specs/features/{機能名}.md として保存
3. 仕様を記述（データ構造、コンポーネント、画面仕様）
4. specs/overview.md の機能一覧に追加
5. project/backlog/todo/ にタスクファイルを作成
6. 着手時にタスクを doing/ に移動
7. 実装
8. 完了時にタスクを done/ に移動
9. changelog.md に記録
```

### 4.2 仕様を変更する

```
1. specs/features/{機能名}.md を編集
2. 変更履歴セクションに日付と内容を追記
3. 必要に応じて specs/overview.md も更新
4. 関連するコードを更新
5. changelog.md に記録
```

### 4.3 技術的な決定をする

```
1. project/decisions/{番号}-{名前}.md を作成
2. コンテキスト、選択肢、決定、理由を記述
3. 必要に応じて specs/overview.md の技術制約セクションを更新
4. copilot-instructions.md を更新
```

---

## 5. AI Agentへの指示例

### 5.1 このテンプレートでプロジェクトを作成する

```
このテンプレートに基づいて、以下のプロジェクトの構成を作成してください。
すべてのディレクトリとファイルを、テンプレートの内容に従って作成してください。
特に specs/overview.md はプロジェクトの全体像として詳細に記述してください。

プロジェクト名: {名前}
概要: {説明}
対象ユーザー: {ユーザー}
解決する課題: {課題}
技術スタック: {言語, フレームワーク等}
禁止事項: {any型禁止, 等}
主要機能: {機能1}, {機能2}, {機能3}
デザイン方針: {方針}
```

### 5.2 機能を実装する

```
まず specs/overview.md でシステム全体像を確認し、
次に specs/features/{機能名}.md の仕様に基づいて実装してください。
実装前に仕様を確認し、不明点があれば質問してください。
完了後は project/backlog/ のタスクを更新してください。
```

---

## 6. セットアップ完了チェックリスト

### 必須ファイル

- [ ] `specs/overview.md` - **★最重要** システム全体像を詳細に記述
- [ ] `.github/copilot-instructions.md` - プロジェクト固有の情報を記入
- [ ] `specs/README.md` - そのまま使用
- [ ] `specs/_templates/feature-spec.md` - そのまま使用
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
- [ ] `project/backlog/todo/` - 初期タスクを作成
- [ ] `project/decisions/001-xxx.md` - 技術選定の決定を記録

---

## 7. この構成のメリット

| メリット | 説明 |
|----------|------|
| **AI Agentとの協働が容易** | overview.mdで全体像を把握、参照先が明確 |
| **コンテキスト不足の防止** | 全体像→機能詳細→共通ルールの階層構造 |
| **情報の一貫性** | 仕様は1箇所にのみ存在、更新漏れが起きない |
| **外部ツール不要** | タスク管理がファイルベースで完結 |
| **Git親和性** | すべてがテキストファイル、差分が追跡可能 |
| **決定の透明性** | なぜその技術を選んだか、後から分かる |
| **新メンバーのオンボーディング** | overview.mdを読めば全体が分かる |

---

## 8. よくある質問

### Q: overview.md と features/*.md の違いは？

**overview.md**: 「このシステムは何か」を定義
- 全体像、対象ユーザー、機能一覧
- デザイン哲学（なぜそうするか）
- 技術制約（何を禁止するか）

**features/*.md**: 「各機能がどう動くか」を定義
- データ構造、コンポーネント、画面仕様
- 実装に必要な詳細情報

### Q: shared/colors.md と overview.md の「色彩哲学」の違いは？

**overview.md**: 「なぜこの色を使うか」（哲学・意図）
**colors.md**: 「具体的に何色を使うか」（CSS変数の値）

### Q: copilot-instructions.md に全部書けばいいのでは？

copilot-instructions.md は「参照リンク集」です。情報本体をここに書くと：
- ファイルが肥大化（1000行超も）
- 更新箇所が分散
- 他のドキュメントと齟齬が発生

情報は適切な場所に、指示書は軽量に。
