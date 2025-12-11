---
id: diary-achievement-mark
feature: diary
depends_on: []
scope_files:
  - frontend/src/shared/components/DiaryPostCard/DiaryPostCard.tsx
  - frontend/src/shared/components/DiaryPostCard/DiaryPostCard.module.css
forbidden_files:
  - frontend/src/shared/types/
  - frontend/src/features/mentor/
created_at: 2025-12-11
---

# タスク: 学習日報の◎マーク表示（生徒用）

> このファイルはサブエージェントへの作業指示書です。

## 0. 必読ファイル（スキップ禁止）

以下を **必ず読んでから** 作業開始:

1. `specs/overview.md` - システム全体像
2. `specs/features/diary.md` - 学習日報機能の仕様（特に「リアクション表示の役割分離」セクション）
3. `specs/shared/conventions.md` - コーディング規約

## 1. タスク概要

学習日報のリアクション表示を役割別に分離する。生徒画面では「◎（二重丸）」マークで達成感を表現し、メンター画面では従来のリアクションボタンを表示する。

## 2. 完了条件

- [ ] DiaryPostCard に `viewMode` prop を追加（'student' | 'mentor'）
- [ ] viewMode='student' の場合、リアクションボタンの代わりに◎マークを表示
- [ ] ◎マークは金色（--color-badge-gold）、サイズ 48px × 48px
- [ ] viewMode='mentor' の場合、従来通りリアクションボタンを表示
- [ ] TypeScriptエラーがないこと
- [ ] 仕様書（diary.md）との整合性確認

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/shared/components/DiaryPostCard/DiaryPostCard.tsx` | 編集（viewMode追加） |
| `frontend/src/shared/components/DiaryPostCard/DiaryPostCard.module.css` | 編集（◎マークスタイル） |

**上記以外は編集禁止**

## 4. 実装仕様

### DiaryPostCard.tsx の変更

**Props に viewMode を追加:**
```typescript
interface DiaryPostCardProps {
    post: DiaryPost;
    currentUserId?: string;
    onReactionsChange?: (postId: string, reactions: Reaction[]) => void;
    viewMode?: 'student' | 'mentor';  // 追加
}

const DiaryPostCard = ({ 
    post, 
    currentUserId, 
    onReactionsChange,
    viewMode = 'student'  // デフォルトは生徒用
}: DiaryPostCardProps) => {
```

**条件分岐でUIを切り替え:**
```tsx
{/* リアクション表示エリア */}
<div className={styles.reactionArea}>
  {viewMode === 'student' ? (
    // 生徒用: ◎マーク
    <div className={styles.achievementMark} aria-label="投稿完了">
      ◎
    </div>
  ) : (
    // メンター用: リアクションボタン
    <div className={styles.reactionBar} aria-label="リアクション操作">
      {reactionTypes.map(rt => (
        <ReactionButton
          key={rt}
          type={rt}
          count={getCount(rt)}
          isActive={isActive(rt)}
          onToggle={() => toggleReaction(rt)}
        />
      ))}
    </div>
  )}
</div>
```

### DiaryPostCard.module.css の追加

```css
.reactionArea {
  margin-top: var(--spacing-sm);
}

.achievementMark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  font-size: 40px;
  color: var(--color-badge-gold);
  font-weight: var(--font-weight-bold);
  user-select: none;
}

.reactionBar {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}
```

## 5. 参考実装

- `specs/features/diary.md` - リアクション表示の役割分離仕様
- `frontend/src/styles/variables.css` - `--color-badge-gold` 定義確認

## 6. 使用例

**生徒側（DiaryPage等）:**
```tsx
<DiaryPostCard 
  post={post} 
  viewMode="student"  // ◎マーク表示
/>
```

**メンター側（MentorDashboard等）:**
```tsx
<DiaryPostCard 
  post={post}
  currentUserId={mentorId}
  onReactionsChange={handleReactionChange}
  viewMode="mentor"  // リアクションボタン表示
/>
```

## 7. 技術的制約

- ❌ `any` 型禁止
- ❌ CSS値ハードコード禁止（CSS変数使用）
- ❌ 外部ライブラリ追加禁止
- ✅ `import type` で型をimport
- ✅ デフォルト値は 'student'（後方互換性確保）

## 8. 完了報告

### タスクID: diary-achievement-mark

### 作成/編集ファイル:
- `DiaryPostCard.tsx` - viewMode prop追加、条件分岐UI
- `DiaryPostCard.module.css` - ◎マークスタイル追加

### 主要な変更点:
- 生徒用◎マーク表示機能追加
- メンター/生徒でリアクション表示を分離
- 後方互換性維持（デフォルト='student'）

### 未解決の問題: なし
