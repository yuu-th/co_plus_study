# アンケート機能

> 最終更新: 2025-12-25
> ステータス: 実装完了（基本機能）

## 1. 概要

運営がアンケートを配信・スケジュールし、生徒が回答する機能。公開期間や対象グループを指定可能。

## 2. ユーザーストーリー

- 生徒として、配信されたアンケートに回答したい。フィードバックを伝えたいから。
- 生徒として、過去の回答履歴を確認したい。何を答えたか振り返りたいから。
- 生徒として、星評価で気持ちを伝えたい。数字より分かりやすいから。
- 運営として、アンケートを作成・配信したい。生徒の意見を収集したいから。
- 運営として、配信スケジュールを設定したい。適切なタイミングで届けたいから。

## 3. データ構造

> **SSoT**: `project/decisions/005-backend-integration-preparation.md`
>
> 関連テーブル: `surveys`, `survey_responses`
> 型定義: `frontend/src/shared/types/survey.ts`

### Survey（ADR-005参照）

| フィールド | DB | 説明 |
|-----------|-----|------|
| `id` | surveys.id | 一意識別子 |
| `title` | surveys.title | アンケートタイトル |
| `description` | surveys.description | 説明文 |
| `questions` | surveys.questions (JSONB) | 質問配列 |
| `releaseDate` | surveys.release_date | 公開開始日時 |
| `dueDate` | surveys.due_date | 締切日時 |
| `status` | surveys.status | ステータス（survey_status enum） |

### QuestionType

```typescript
type QuestionType = 'single' | 'multiple' | 'text' | 'rating' | 'color';
```

| タイプ | 説明 | UI |
|--------|------|-----|
| single | 単一選択 | ラジオボタン |
| multiple | 複数選択 | チェックボックス |
| text | 自由記述 | テキストエリア |
| rating | 評価（1-5） | ☆アイコン |
| color | カラー選択 | カラースウォッチ |

## 4. CRUDフロー

### 生徒側

| 操作 | 画面 | 説明 |
|------|------|------|
| **Read** | SurveyPage | 配信中アンケート一覧取得 |
| **Create** | SurveyPage | アンケート回答送信 |

### メンター/運営側

| 操作 | 画面 | 説明 |
|------|------|------|
| **Create** | SurveyCreatePage | アンケート作成 |
| **Read** | SurveyListPage | アンケート一覧・回答統計取得 |
| **Update** | SurveyCreatePage | アンケート編集 |
| **Delete** | SurveyListPage | アンケート削除 |

## 5. UIガイドライン
| text | 自由記述 | テキストエリア |
| rating | 評価（1-5） | ☆アイコン（推奨）または数字 |
| color | カラー選択 | カラースウォッチ |

### ColorOption

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | string | 選択肢ID |
| label | string | 色の名前（例: 赤、青） |
| colorCode | string | HEXカラーコード（例: #FF6B9D） |

### Answer

| フィールド | 型 | 説明 |
|-----------|-----|------|
| questionId | string | 対象質問ID |
| value | string \| string[] \| number | 回答値 |

### SurveySummary（一覧表示用）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | string | アンケートID |
| title | string | タイトル |
| description | string? | 説明 |
| publisher | string | 配信者名 |
| releaseDate | ISO8601 | 公開日 |
| dueDate | ISO8601? | 締切日 |
| isAnswered | boolean | 回答済みフラグ |
| daysRemaining | number? | 残り日数 |

## 4. タイトル命名ガイドライン

### 基本方針
- 簡潔で、生徒が目的を理解しやすい文言
- 親しみやすいカジュアルなトーン
- 「〜ね」「〜かな」「〜してね」等の表現を使用

### 例

| ❌ 避ける表現 | ✅ 推奨表現 |
|-------------|-----------|
| 学習体験アンケート | 勉強のことをきかせてね！ |
| サービス満足度調査 | アプリは使いやすいかな？ |
| 月次フィードバック | 今月どうだった？きかせてね！ |

## 5. 質問設計ガイドライン

### 推奨される質問例

| 質問ID | タイプ | 質問文 | 備考 |
|--------|--------|--------|------|
| q1 | rating | このアプリは使いやすいですか？ | ☆1〜5 |
| q2 | rating | 勉強は楽しいですか？ | ☆1〜5 |
| q3 | single | 一番よく使う機能は？ | 選択肢: 日報、相談、実績 |
| q4 | text | よかったことを教えてね！ | 自由記述 |
| q5 | text | もっとこうなったらいいな、と思うことはある？ | 自由記述 |

※「学習満足度」のような曖昧な質問は避け、具体的で意図が明確な質問にする

## 6. コンポーネント

| 名前 | 責務 | 配置 |
|------|------|------|
| SurveyCardList | アンケート一覧（カード形式） | features/survey/components/ |
| SurveyCard | 個別アンケートカード | features/survey/components/ |
| SurveyForm | 回答フォーム | features/survey/components/ |
| QuestionItem | 個別質問（5タイプ対応） | features/survey/components/ |
| RatingInput | 星評価入力（☆アイコン） | features/survey/components/ |
| ColorPicker | カラー選択入力 | features/survey/components/ |
| SurveyComplete | 完了画面 | features/survey/components/ |

## 7. 画面仕様

### 一覧画面
- **デスクトップ**: 3カラムカードグリッド
- **モバイル**: 1カラムスクロール
- 残り日数バッジ、回答済みマーク表示
- 「もっと見る」で全件展開

#### SurveyCard表示
- タイトルは目立つサイズで表示（font-size: 1.25rem以上）
- 説明文（description）も表示
- 「〇日後まで」という期限表示を強調（赤系の色で残り3日以下は目立たせる）
- 回答済みマークは視認性を高める（チェックアイコン + 緑色）

### 回答画面
- 1問ずつ or 全問一括（アンケート設定による）
- 進捗バー表示
- 必須未回答時はエラー表示

### 星評価（rating タイプ）UI仕様

#### 表示方式
- デフォルト: `emoji`（☆アイコン表示）
- 代替: `numeric`（1 2 3 4 5 数字表示）

#### ☆アイコン仕様
- サイズ: 40px × 40px
- 未選択: グレー（`--color-text-secondary`）
- 選択済み: 金色（`--color-badge-gold`）
- タップ/クリックで選択
- 選択済み部分まで連続して色が付く（例: 3選択で★★★☆☆）

### カラー選択（color タイプ）UI仕様

- カラースウォッチを横並びで表示
- サイズ: 48px × 48px（タップしやすいサイズ）
- 選択済み: 白いチェックマーク + 枠線
- 複数選択可否は `required` フィールドで制御（複数選択の場合は multiple と組み合わせ検討）

### 送信ボタン仕様

| 項目 | 値 |
|------|-----|
| 最小サイズ | 48px × 48px（タッチターゲット確保） |
| 背景色 | `--color-accent-orange` |
| テキスト | 「送信する」 |
| 位置 | フォーム下部、中央または右寄せ |
| 無効状態 | 必須項目未入力時、グレーアウト（`--color-text-disabled`）、クリック不可 |
| ホバー | やや濃い色に変化 |

### 完了画面
- 「ありがとう！回答できたよ！」メッセージ
- 回答履歴へのリンク

## 8. 表示ロジック

```
現在日時 < releaseDate → 非表示
releaseDate <= 現在日時 < dueDate → 表示（回答可能）
dueDate <= 現在日時 → 表示（回答不可、締切表示）
```

## 9. 制約・バリデーション

| 項目 | 制約 |
|------|------|
| required=true の質問 | 回答必須、未回答で送信エラー |
| text タイプ | 最大1000文字 |
| rating タイプ | 1-5の整数 |
| color タイプ | 選択肢から1つ以上選択 |

## 10. 関連

- → specs/features/notification.md（アンケート公開通知）
- → specs/features/mentor.md（管理者側アンケート管理）
- → specs/shared/colors.md（カラー定義）

## 11. 未実装項目

- [ ] Survey progress utility（回答率計算）
- [ ] AdminSurveyManager（管理画面）
- [ ] color タイプの実装

## 12. 変更履歴

| 日付 | 変更内容 |
|------|----------|
| 2025-12-04 | UI/UX改善: タイトルガイドライン、質問例具体化、星評価☆表示、カラー選択タイプ追加、送信ボタン仕様 |
| 2025-11-25 | スケジュール機能仕様追加 |
| 2025-11-20 | 初版作成、基本回答機能実装 |
