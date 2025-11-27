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
