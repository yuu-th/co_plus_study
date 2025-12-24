# 学習日報機能

> 最終更新: 2025-12-25
> ステータス: 実装完了

## 1. 概要

SNS風タイムラインで学習記録を投稿・閲覧する機能。1日に複数回投稿可能で、日付ごとにグループ化して表示する。

## 2. ユーザーストーリー

- 生徒として、今日の学習内容を投稿したい。学習の振り返りになるから。
- 生徒として、過去の学習記録を時系列で見返したい。継続のモチベーションになるから。
- 生徒として、教科や期間でフィルターしたい。特定の学習を振り返りやすいから。
- 生徒として、自分の投稿に◎マークがついているのを見たい。がんばった証を確認したいから。
- メンターとして、生徒の投稿にリアクションしたい。励ましを伝えたいから。

## 3. データ構造

> **SSoT**: `project/decisions/005-backend-integration-preparation.md`
>
> 関連テーブル: `diary_posts`, `diary_reactions`
> 型定義: `frontend/src/shared/types/diary.ts`

### DiaryPost（ADR-005参照）

| フィールド | DB | 説明 |
|-----------|-----|------|
| `id` | diary_posts.id | 一意識別子 |
| `userId` | diary_posts.user_id | 投稿者ID |
| `userName` | profiles.display_name (JOIN) | 投稿者名 |
| `subject` | diary_posts.subject | 教科（subject_type enum） |
| `duration` | diary_posts.duration_minutes | 学習時間（分） |
| `content` | diary_posts.content | 学習内容（最大500文字） |
| `timestamp` | diary_posts.created_at | 投稿日時 |
| `reactions` | diary_reactions (集約) | リアクション配列 |

### Subject（教科）

```typescript
type Subject = '国語' | '数学' | '理科' | '社会' | '英語' | 'その他';
```

### ReactionType

```typescript
type ReactionType = '👍' | '❤️' | '🎉' | '👏' | '🔥';
```

※ chat.md の ReactionEmoji と統一

### Duration（勉強時間）

- **入力UI**: 時間と分を別々のフィールドで入力
- **データ保存**: 分単位の整数で保存（例: 1時間30分 → 90分）
- **表示形式**: 「X時間YY分」形式
- **バリデーション**: 1分〜59999分

## 4. CRUDフロー

### 生徒側

| 操作 | 画面 | 説明 |
|------|------|------|
| **Create** | DiaryPage（DiaryPostForm） | 新規日報投稿 |
| **Read** | DiaryPage（DiaryTimeline） | 投稿一覧取得（フィルター/ページング対応） |
| **Update** | DiaryPage（DiaryEditModal） | 自分の投稿を編集 |
| **Delete** | DiaryPage | 自分の投稿を削除 |

### メンター側

| 操作 | 画面 | 説明 |
|------|------|------|
| **Read** | StudentDetailPage | 担当生徒の日報一覧取得 |
| **Update** | StudentDetailPage | リアクション追加/削除 |

## 5. フィルター機能

### DiaryFilter

| フィールド | 型 | 説明 |
|-----------|-----|------|
| subject | Subject \| 'all' | 教科フィルター（'all'で全教科） |
| range | 'week' \| 'month' \| 'all' | 期間フィルター |

### WeeklyDiaryStats

| フィールド | 型 | 説明 |
|-----------|-----|------|
| totalMinutes | number | 今週の総学習時間（分） |
| totalPosts | number | 今週の投稿数 |
| subjectBreakdown | SubjectTime[] | 教科別内訳 |

## 4. コンポーネント

| 名前 | 責務 | 配置 |
|------|------|------|
| DiaryPostForm | 投稿フォーム（教科・時間・内容入力） | features/diary/components/ |
| DurationInput | 時間入力コンポーネント（時間+分） | features/diary/components/ |
| DiaryPostCard | 投稿カード表示 + リアクション/◎表示 | features/diary/components/ |
| DiaryTimeline | タイムライン（日付グループ化） | features/diary/components/ |
| DiaryStats | 統計ウィジェット | features/diary/components/ |
| ReactionButton | リアクション操作ボタン（メンター用） | features/diary/components/ |
| AchievementMark | ◎マーク表示（生徒用） | features/diary/components/ |

## 5. 画面仕様

### レイアウト
- **モバイル**: 縦1列、統計は下部に折りたたみ
- **タブレット以上**: 左にタイムライン、右に統計サイドバー

### 日付グループ化
- 「今日」「昨日」「○月○日」のラベルで区切り
- `utils/groupByDate.ts` で変換

### リアクション表示の役割分離

#### 生徒画面
- リアクションボタン: 非表示（操作不可）
- 代わりに大きな二重丸◎を表示
- ◎の意味: 「投稿できたね！」という達成マーク
- 色: `--color-badge-gold`（金色）
- サイズ: 48px × 48px

#### メンター画面
- リアクションボタン: 表示（5種類: 👍❤️🎉👏🔥）
- リアクションをクリックしてトグル操作
- リアクション済みは背景色でハイライト

### フィルター機能

#### 教科フィルター
| 選択肢 | 説明 |
|--------|------|
| すべて | 全教科表示 |
| 国語 | 国語のみ |
| 数学 | 数学のみ |
| 理科 | 理科のみ |
| 社会 | 社会のみ |
| 英語 | 英語のみ |
| その他 | その他のみ |

#### 期間フィルター
| 選択肢 | 説明 |
|--------|------|
| 1週間 | 過去7日間 |
| 1ヶ月 | 過去30日間 |
| すべて | 全期間 |

### ページング（さらに読み込む）

| 項目 | 値 |
|------|-----|
| 初期表示件数 | 20件 |
| 追加読み込み件数 | 10件 |
| トリガー | 「さらに読み込む」ボタンクリック |
| 終端表示 | 「すべての投稿を表示しました」 |

※ 無限スクロールは採用しない（ボタンクリック方式）

### インタラクション
- 投稿フォーム送信 → リストに即時反映 → 成功トースト
- リアクションボタンクリック → トグル動作（押す/外す）
- フィルター変更 → タイムライン再描画
- 「さらに読み込む」クリック → 追加データ取得・表示

## 6. 制約・バリデーション

| フィールド | 制約 |
|-----------|------|
| subject | 必須、選択肢（国語/数学/理科/社会/英語/その他）から選ぶ |
| duration（時間） | 必須、0-999の整数 |
| duration（分） | 必須、0-59の整数 |
| duration（合計） | 最小1分、最大59999分 |
| content | 必須、1-500文字 |

## 7. 教科カラー

| 教科 | CSS変数 | 値 |
|------|---------|-----|
| 国語 | `--color-subject-japanese` | #FF6B9D |
| 数学 | `--color-subject-math` | #4169E1 |
| 理科 | `--color-subject-science` | #32CD32 |
| 社会 | `--color-subject-social` | #FF8C00 |
| 英語 | `--color-subject-english` | #9370DB |
| その他 | `--color-subject-other` | #808080 |

## 8. 関連

- → specs/shared/colors.md（教科カラー定義）
- → specs/features/mentor.md（リアクション操作はメンター側）
- → specs/features/chat.md（リアクション絵文字の統一）

## 9. 変更履歴

| 日付 | 変更内容 |
|------|----------|
| 2025-12-04 | UI/UX改善: 時間入力形式、リアクション表示条件、フィルター仕様、ページング明確化 |
| 2025-11-25 | リアクショントグル機能追加 |
| 2025-11-20 | 初版作成、基本実装完了 |
