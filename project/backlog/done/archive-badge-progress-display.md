---
id: archive-badge-progress-display
feature: archive
depends_on: []
scope_files:
  - frontend/src/features/student/components/archive/SkillView/SkillView.tsx
  - frontend/src/features/student/components/archive/BadgeCard/BadgeCard.tsx
  - frontend/src/features/student/components/archive/BadgeCard/BadgeCard.module.css
  - frontend/src/features/student/mockData/badges.ts
forbidden_files:
  - frontend/src/shared/types/badge.ts
created_at: 2025-12-11
---

# タスク: 実績バッジの進捗ゲージ表示と全バッジ表示

> このファイルはサブエージェントへの作業指示書です。

## 0. 必読ファイル（スキップ禁止）

以下を **必ず読んでから** 作業開始:

1. `specs/overview.md` - システム全体像
2. `specs/features/archive.md` - ARCHIVE機能の仕様
3. `specs/shared/conventions.md` - コーディング規約

## 1. タスク概要

実績（ARCHIVE）のバッジ表示機能を仕様通りに改善する。現在は獲得済みバッジのみ表示されているが、未獲得バッジ（locked/in_progress）も含めた全バッジ表示に変更し、進捗ゲージを追加する。

## 2. 完了条件

- [ ] SkillView で全バッジ（locked, in_progress, earned）を表示
- [ ] BadgeCard に進捗ゲージUI追加（in_progress 状態のみ表示）
- [ ] locked 状態のバッジはグレーアウト表示
- [ ] mockBadges に in_progress 状態のバッジデータ追加
- [ ] TypeScriptエラーがないこと
- [ ] 仕様書（archive.md）との整合性確認

## 3. 編集対象ファイル

| ファイル | 操作 |
|----------|------|
| `frontend/src/features/student/components/archive/SkillView/SkillView.tsx` | 編集（フィルター削除） |
| `frontend/src/features/student/components/archive/BadgeCard/BadgeCard.tsx` | 編集（進捗ゲージ追加） |
| `frontend/src/features/student/components/archive/BadgeCard/BadgeCard.module.css` | 編集（進捗バースタイル） |
| `frontend/src/features/student/mockData/badges.ts` | 編集（in_progressバッジ追加） |

**上記以外は編集禁止**

## 4. 実装仕様

### SkillView.tsx の変更

**現在の実装:**
```tsx
const earnedBadges = badges.filter(b => !!b.earnedAt);
// ... earnedBadges のみ表示
```

**変更後:**
```tsx
// フィルターを削除し、全バッジを表示
{badges.map((badge) => (
  <BadgeCard key={badge.id} badge={badge} />
))}
```

### BadgeCard.tsx の変更

**追加機能:**
- `badge.status === 'in_progress'` の場合に進捗ゲージを表示
- `badge.progress` の値（0-100）でゲージの幅を設定

**UI構造:**
```tsx
{badge.status === 'in_progress' && badge.progress !== undefined && (
  <div className={styles.progressBar}>
    <div 
      className={styles.progressFill} 
      style={{ width: `${badge.progress}%` }}
    />
    <span className={styles.progressText}>{badge.progress}%</span>
  </div>
)}
```

### BadgeCard.module.css の追加

```css
.progressBar {
  width: 100%;
  height: 8px;
  background-color: var(--color-bg-secondary);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  margin-top: var(--spacing-sm);
  position: relative;
}

.progressFill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent-blue), var(--color-accent-orange));
  border-radius: var(--border-radius-sm);
  transition: width var(--transition-base);
}

.progressText {
  position: absolute;
  top: -18px;
  right: 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}
```

### mockBadges.ts の変更

未獲得バッジに `status` と `progress` を追加:

```typescript
{
  id: 'badge-9',
  name: 'マスター',
  rank: 'platinum',
  description: '圧倒的な学習量を達成',
  condition: '365日間連続でログイン',
  category: '継続',
  status: 'in_progress',  // 追加
  progress: 68,            // 追加（68%達成）
},
{
  id: 'badge-10',
  name: 'チャレンジャー',
  rank: 'silver',
  description: '新しいことに挑戦中',
  condition: '5つ以上の新しい教科を学習',
  category: '学習',
  status: 'locked',       // 追加
  progress: 0,            // 追加
}
```

## 5. 参考実装

- `frontend/src/shared/types/badge.ts` - Badge型定義（progress, status フィールド確認）
- `specs/features/archive.md` - バッジ状態別表示仕様

## 6. 技術的制約

- ❌ `any` 型禁止
- ❌ CSS値ハードコード禁止（CSS変数使用）
- ❌ 外部ライブラリ追加禁止
- ✅ `import type` で型をimport
- ✅ 既存の Badge 型定義を使用（新規型定義不要）

## 7. 完了報告

### タスクID: archive-badge-progress-display

### 作成/編集ファイル:
- `SkillView.tsx` - フィルター削除、全バッジ表示
- `BadgeCard.tsx` - 進捗ゲージUI追加
- `BadgeCard.module.css` - 進捗バースタイル追加
- `badges.ts` - in_progress/locked バッジデータ追加

### 主要な変更点:
- 獲得済みバッジのみ → 全バッジ表示に変更
- 進捗ゲージコンポーネント追加
- バッジ状態（locked/in_progress/earned）に応じた表示

### 未解決の問題: なし
