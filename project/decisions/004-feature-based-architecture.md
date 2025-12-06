# ADR-004: Feature-Based Architecture Migration

> 決定日: 2025-12-06
> ステータス: **採用・進行中**

---

## コンテキスト

現在のfrontendは以下の問題を抱えている:

1. `pages/` に学生向け・メンター向けが混在
2. `components/layout/` に両ロールのレイアウトが混在
3. ログイン/登録がロール別に分離されていない
4. 将来的な機能拡張が困難

## 決定事項

### 1. Feature-Based アーキテクチャへの移行

```
src/
├── features/
│   ├── student/     # 学生向け機能（完全分離）
│   ├── mentor/      # メンター向け機能（完全分離）
│   └── auth/        # 認証機能（ロール別分離）
├── shared/          # 真に共通のもののみ
├── styles/          # グローバルスタイル
└── router.tsx       # ルート統合
```

### 2. パスエイリアス

```json
"paths": {
  "@/shared/*": ["src/shared/*"],
  "@/features/*": ["src/features/*"]
}
```

tsconfig.app.json と vite.config.ts で設定済み。

### 3. URL構造

| ロール | ログイン | 登録 |
|--------|----------|------|
| 学生 | `/login` | `/register` |
| メンター | `/mentor/login` | `/mentor/register` |

### 4. 共有コンポーネントの配置

| コンポーネント | 配置 | 理由 |
|---------------|------|------|
| Button, Card, Modal, etc. | `shared/components/` | 純粋なUI部品 |
| DiaryPostCard | `shared/components/` | 学生・メンター両方で使用 |
| ReactionButton | `shared/components/` | DiaryPostCardの依存 |
| ChatPage | **別々に実装** | 将来的な差別化のため |
| Badge型 (BadgeType/BadgeRank) | `shared/types/` | Badgeコンポーネントで使用 |
| Diary型 (DiaryPost, Reaction) | `shared/types/` | DiaryPostCardで使用 |

### 5. 制約事項

> [!CAUTION]
> **PowerShellコマンドでの一括置換は禁止**
> ファイルが破損するリスクがあるため、すべて手動でのファイル操作のみで実行すること。

---

## Phase 1 完了状況

以下は**完了済み**:

### shared/components/ (9コンポーネント)
- Button, Card, Badge, Modal, EmptyState, ErrorBoundary, Skeleton
- DiaryPostCard, ReactionButton

### shared/types/ (6ファイル)
- user.ts, chat.ts, notification.ts, badge.ts, diary.ts, index.ts

### shared/hooks/
- useNotifications.ts

### shared/utils/
- formatTime.ts, groupByDate.ts, groupByDate.test.ts

### shared/mockData/
- users.ts, chats.ts, notifications.ts

### Config
- tsconfig.app.json (パスエイリアス設定済み)
- vite.config.ts (パスエイリアス設定済み)

---

## 残りのPhase

| Phase | 内容 | タスクファイル |
|-------|------|---------------|
| 2 | features/student/ | `migration-student.md` |
| 3 | features/mentor/ | `migration-mentor.md` |
| 4-7 | auth, router統合, 削除, 検証 | `migration-auth-cleanup.md` |

---

## 参照ファイル

- 元の実装計画: `implementation_plan.md` (brain artifact)
- 既存コンポーネント: `src/components/` (移行元)
- 既存ページ: `src/pages/` (移行元)
