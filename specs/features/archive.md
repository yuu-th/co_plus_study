# ARCHIVE機能

> 最終更新: 2025-11-25
> ステータス: 実装完了

## 1. 概要

学習実績を可視化するページ。学習カレンダー、連続ログイン日数、獲得バッジを表示し、継続のモチベーションを高める。

## 2. ユーザーストーリー

- 生徒として、学習した日をカレンダーで確認したい。頑張りを可視化したいから。
- 生徒として、連続ログイン日数を知りたい。記録を伸ばすモチベーションになるから。
- 生徒として、獲得したバッジを見たい。達成感を味わいたいから。

## 3. データ構造

### CalendarDay

| フィールド | 型 | 説明 |
|-----------|-----|------|
| date | string | YYYY-MM-DD形式 |
| hasActivity | boolean | 活動有無 |
| activityType | 'login' \| 'diary' \| 'both' | 活動タイプ |

### Badge

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | string | ✓ | バッジID |
| name | string | ✓ | バッジ名 |
| description | string | ✓ | 獲得条件説明 |
| rank | BadgeRank | ✓ | ランク |
| category | string | ✓ | カテゴリ |
| iconUrl | string | | アイコンURL |
| earnedAt | ISO8601 | | 獲得日時 |

### BadgeRank

```typescript
type BadgeRank = 'platinum' | 'gold' | 'silver' | 'bronze';
```

### ContinuousStats

| フィールド | 型 | 説明 |
|-----------|-----|------|
| currentStreak | number | 現在の連続日数 |
| longestStreak | number | 最長連続日数 |
| totalDays | number | 累計活動日数 |

## 4. コンポーネント

| 名前 | 責務 | 配置 |
|------|------|------|
| CalendarView | カレンダータブ全体 | features/archive/components/ |
| MonthlyCalendar | 月別カレンダー | features/archive/components/ |
| WeeklyActivity | 週間活動表示（S M T W T F S） | features/archive/components/ |
| ContinuousCounter | 連続日数カウンター | features/archive/components/ |
| SkillView | バッジタブ全体 | features/archive/components/ |
| BadgeCard | 個別バッジカード | features/archive/components/ |

## 5. 画面仕様

### タブ構成
- 「カレンダー」タブ
- 「スキル（バッジ）」タブ

### カレンダータブ
- **連続日数**: 大きなフォント（72px）でカウンター表示
- **月次カレンダー**: 当月・前月・前々月を縦に並べる
- **週間表示**: S M T W T F S 形式、活動日を丸マーカーで表示
- 活動日は色分け（ログインのみ / 日報あり / 両方）

### バッジタブ
- 2列グリッドでバッジカードを表示
- カード内にランクアイコン（金・銀・銅・プラチナ）
- 未獲得バッジはグレーアウト（オプション）

### アニメーション
- 連続日数カウンター: 2秒でカウントアップ

## 6. バッジランクカラー

| ランク | CSS変数 | 値 |
|--------|---------|-----|
| プラチナ | `--color-badge-platinum` | #E5E4E2 |
| 金 | `--color-badge-gold` | #FFD700 |
| 銀 | `--color-badge-silver` | #C0C0C0 |
| 銅 | `--color-badge-bronze` | #CD7F32 |

## 7. 関連

- → specs/shared/colors.md（バッジカラー）
- → specs/features/tutorial.md（チュートリアルでARCHIVE案内）

## 8. 変更履歴

| 日付 | 変更内容 |
|------|----------|
| 2025-11-15 | 初版作成、実装完了 |
