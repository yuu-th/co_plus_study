# 学習日報機能

> 最終更新: 2025-11-25
> ステータス: 実装完了

## 1. 概要

SNS風タイムラインで学習記録を投稿・閲覧する機能。1日に複数回投稿可能で、日付ごとにグループ化して表示する。

## 2. ユーザーストーリー

- 生徒として、今日の学習内容を投稿したい。学習の振り返りになるから。
- 生徒として、過去の学習記録を時系列で見返したい。継続のモチベーションになるから。
- 生徒として、教科や期間でフィルターしたい。特定の学習を振り返りやすいから。
- メンターとして、生徒の投稿にリアクションしたい。励ましを伝えたいから。

## 3. データ構造

### DiaryPost

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | string | ✓ | 一意識別子 |
| userId | string | ✓ | 投稿者のユーザーID |
| userName | string | ✓ | 投稿者の表示名 |
| subject | string | ✓ | 教科名 |
| duration | number | ✓ | 学習時間（分）1-999 |
| content | string | ✓ | 学習内容（最大500文字） |
| timestamp | ISO8601 | ✓ | 投稿日時 |
| reactions | Reaction[] | | リアクション配列 |

### Reaction

| フィールド | 型 | 説明 |
|-----------|-----|------|
| type | ReactionType | 絵文字タイプ |
| count | number | リアクション数 |
| userIds | string[] | 押したユーザーID配列 |

### ReactionType

```typescript
type ReactionType = '👍' | '❤️' | '🎉' | '👏' | '🔥';
```

### GroupedDiaryPost

| フィールド | 型 | 説明 |
|-----------|-----|------|
| dateLabel | string | "今日" / "昨日" / "○月○日" |
| posts | DiaryPost[] | その日の投稿配列 |

### DiaryFilter

| フィールド | 型 | 説明 |
|-----------|-----|------|
| subject | string? | 教科フィルター |
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
| DiaryPostCard | 投稿カード表示 + リアクション | features/diary/components/ |
| DiaryTimeline | タイムライン（日付グループ化） | features/diary/components/ |
| DiaryStats | 統計ウィジェット | features/diary/components/ |
| ReactionButton | リアクション操作ボタン | features/diary/components/ |

## 5. 画面仕様

### レイアウト
- **モバイル**: 縦1列、統計は下部に折りたたみ
- **タブレット以上**: 左にタイムライン、右に統計サイドバー

### 日付グループ化
- 「今日」「昨日」「○月○日」のラベルで区切り
- `utils/groupByDate.ts` で変換

### インタラクション
- 投稿フォーム送信 → リストに即時反映 → 成功トースト
- リアクションボタンクリック → トグル動作（押す/外す）
- フィルター変更 → タイムライン再描画
- スクロール終端 → 「もっと読み込む」

## 6. 制約・バリデーション

| フィールド | 制約 |
|-----------|------|
| subject | 必須、選択肢から選ぶ |
| duration | 必須、1-999の整数 |
| content | 必須、1-500文字 |

## 7. 教科カラー

| 教科 | CSS変数 | 値 |
|------|---------|-----|
| 国語 | `--color-subject-japanese` | #FF6B9D |
| 算数 | `--color-subject-math` | #4169E1 |
| 理科 | `--color-subject-science` | #32CD32 |
| 社会 | `--color-subject-social` | #FF8C00 |
| 英語 | `--color-subject-english` | #9370DB |
| その他 | `--color-subject-other` | #808080 |

## 8. 関連

- → specs/shared/colors.md（教科カラー定義）
- → specs/features/mentor.md（リアクション操作はメンター側）

## 9. 変更履歴

| 日付 | 変更内容 |
|------|----------|
| 2025-11-25 | リアクショントグル機能追加 |
| 2025-11-20 | 初版作成、基本実装完了 |
