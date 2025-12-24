# 実績機能

> 最終更新: 2025-12-25
> ステータス: 実装完了

## 1. 概要

学習実績を可視化するページ。学習カレンダー、連続・累計日数、獲得バッジを表示し、継続のモチベーションを高める。

※ URL・内部IDは `archive` を使用。UI表示名は「実績」とする。

## 2. ユーザーストーリー

- 生徒として、学習した日をカレンダーで確認したい。頑張りを可視化したいから。
- 生徒として、連続ログイン日数を知りたい。記録を伸ばすモチベーションになるから。
- 生徒として、累計の活動日数を知りたい。これまでの努力の総量を把握したいから。
- 生徒として、獲得したバッジを見たい。達成感を味わいたいから。
- 生徒として、バッジの獲得条件と進捗を確認したい。次の目標が分かるから。

## 3. データ構造

> **SSoT**: `project/decisions/005-backend-integration-preparation.md`
>
> 関連テーブル: `badge_definitions`, `user_badges`
> 型定義: `frontend/src/shared/types/badge.ts`, `frontend/src/features/student/types/calendar.ts`

### Badge（ADR-005参照）

| フィールド | DB | 説明 |
|-----------|-----|------|
| `id` | badge_definitions.id | バッジID |
| `name` | badge_definitions.name | バッジ名 |
| `description` | badge_definitions.description | 説明 |
| `condition` | badge_definitions.condition_description | 獲得条件テキスト |
| `rank` | badge_definitions.rank | ランク（badge_rank enum） |
| `category` | badge_definitions.category | カテゴリ |
| `iconUrl` | badge_definitions.icon_url | アイコンURL |
| `earnedAt` | user_badges.earned_at | 獲得日時（未獲得時はnull） |
| `progress` | 動的算出 | 進捗率（0-100） |
| `status` | 動的算出 | バッジ状態（locked/in_progress/earned） |

### BadgeRank

```typescript
type BadgeRank = 'platinum' | 'gold' | 'silver' | 'bronze';
```

### BadgeStatus

```typescript
type BadgeStatus = 'locked' | 'in_progress' | 'earned';
```

| ステータス | 説明 | 表示 |
|-----------|------|------|
| locked | 未着手（条件未達） | グレーアウト、鍵アイコン |
| in_progress | 進行中 | 通常表示 + 進捗ゲージ |
| earned | 獲得済み | フルカラー + 獲得日時 |

### カレンダーデータ（クライアント動的生成）

カレンダー表示用データは `diary_posts` と `profiles.last_seen_at` から動的に生成。
DB専用テーブルなし。

## 4. CRUDフロー

| 操作 | 画面 | 説明 |
|------|------|------|
| **Read** | ArchivePage | カレンダーデータ取得（diary_postsから集計） |
| **Read** | ArchivePage | バッジ一覧・進捗取得 |


## 4. コンポーネント

| 名前 | 責務 | 配置 |
|------|------|------|
| CalendarView | カレンダータブ全体 | features/archive/components/ |
| MonthlyCalendar | 月別カレンダー | features/archive/components/ |
| WeeklyActivity | 週間活動表示（日〜土） | features/archive/components/ |
| ContinuousCounter | 連続・累計日数カウンター | features/archive/components/ |
| StreakConnector | 連続日の視覚的連結線 | features/archive/components/ |
| SkillView | バッジタブ全体 | features/archive/components/ |
| BadgeCard | 個別バッジカード（進捗ゲージ付き） | features/archive/components/ |
| ProgressGauge | 達成進捗ゲージ | features/archive/components/ |

## 5. 画面仕様

### タブ構成
- 「カレンダー」タブ
- 「スキル」タブ

#### タブサイズ統一
- 両タブ同じ幅（flex: 1 または固定幅）
- パディング: 12px 24px
- フォントサイズ: 16px

### 5.1 カレンダータブ

#### 統計情報（上部）
- **連続日数**: 大きなフォント（48-72px）で中央表示
  - 「連続 XX 日」形式
- **最長記録**: 「最長 XX 日」を小さめに表示
- **累計日数**: 「累計 XX 日」を追加表示
- レイアウト: 連続日数を中央大きく、最長・累計を左右または下に配置

#### 月次カレンダー
- 当月・前月・前々月を縦に並べる
- 月ヘッダー: 「2025年12月」形式

#### 曜日表示
| 曜日 | 表記 | 色 |
|------|------|-----|
| 日曜 | 日 | 赤（`--color-weekend-sunday`） |
| 月曜 | 月 | デフォルト |
| 火曜 | 火 | デフォルト |
| 水曜 | 水 | デフォルト |
| 木曜 | 木 | デフォルト |
| 金曜 | 金 | デフォルト |
| 土曜 | 土 | 青（`--color-weekend-saturday`） |

※ フォントウェイト: やや太め（500-600）

#### 日付セルの色分け
| 状態 | 背景色 | 説明 |
|------|--------|------|
| 活動なし | グレー（`--color-calendar-inactive`） | 学習していない日 |
| 活動あり | 黄色（`--color-calendar-active`） | 学習した日 |
| 今日 | 枠線強調 | 現在日 |

#### 連続日の視覚的連結
- 連続した活動日を線で繋ぐ
- 例: 18→19→20日が活動日の場合、セル間を線または背景色で連結
- 連結線の色: 黄色系（活動ありと同系統）

### 5.2 バッジ（スキル）タブ

#### レイアウト
- 2列グリッドでバッジカードを表示
- カード間隔: 16px

#### BadgeCard表示
- **アイコン**: 上部中央（48px × 48px）
- **バッジ名**: アイコン下
- **獲得条件**: バッジ名の下に小さめテキスト
- **進捗ゲージ**: 未獲得時に表示（横バー形式）
- **獲得日時**: 獲得済み時に表示（「2025/12/01 獲得」形式）
- **ランクアイコン**: カード右上に小さく表示

#### 状態別表示
| 状態 | 表示 |
|------|------|
| locked | グレースケール、鍵アイコンオーバーレイ |
| in_progress | 通常色、進捗ゲージ表示 |
| earned | フルカラー、キラキラエフェクト（オプション） |

### 5.3 レイアウト改善

#### ホワイトスペースの最適化
- 統計情報エリア: 上部に余裕を持たせて大きく表示
- カレンダー: 中央にゆったり配置、セル間隔は適度に
- モバイル: 横スクロールなしで収まるサイズ

#### スマートフォン対応
- カレンダーセル: 最小36px × 36px（タップ可能サイズ）
- 数字フォント: 読みやすいサイズ（14px以上）

### アニメーション
- 連続日数カウンター: 2秒でカウントアップ
- バッジ獲得時: ポップアップ + キラキラ（オプション）

## 6. カラー

| 用途 | CSS変数 | 値 |
|------|---------|-----|
| プラチナ | `--color-badge-platinum` | #E5E4E2 |
| 金 | `--color-badge-gold` | #FFD700 |
| 銀 | `--color-badge-silver` | #C0C0C0 |
| 銅 | `--color-badge-bronze` | #CD7F32 |
| 活動日 | `--color-calendar-active` | #FFE066（黄色） |
| 非活動日 | `--color-calendar-inactive` | #E0E0E0（グレー） |
| 日曜 | `--color-weekend-sunday` | #E53935（赤） |
| 土曜 | `--color-weekend-saturday` | #1E88E5（青） |

## 7. 関連

- → specs/shared/colors.md（バッジカラー）
- → specs/features/tutorial.md（チュートリアルで実績案内）
- → specs/features/diary.md（日報投稿が活動日にカウント）

## 8. 変更履歴

| 日付 | 変更内容 |
|------|----------|
| 2025-12-04 | UI/UX改善: タイトル日本語化、累計日数追加、カレンダー色・連続線、曜日日本語化、バッジ進捗ゲージ、タブサイズ統一 |
| 2025-11-15 | 初版作成、実装完了 |
