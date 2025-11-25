# アンケート機能

> 最終更新: 2025-11-25
> ステータス: 実装完了（基本機能）

## 1. 概要

運営がアンケートを配信・スケジュールし、生徒が回答する機能。公開期間や対象グループを指定可能。

## 2. ユーザーストーリー

- 生徒として、配信されたアンケートに回答したい。フィードバックを伝えたいから。
- 生徒として、過去の回答履歴を確認したい。何を答えたか振り返りたいから。
- 運営として、アンケートを作成・配信したい。生徒の意見を収集したいから。
- 運営として、配信スケジュールを設定したい。適切なタイミングで届けたいから。

## 3. データ構造

### Survey

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | string | ✓ | 一意識別子 |
| title | string | ✓ | アンケートタイトル |
| description | string | | 説明文 |
| questions | Question[] | ✓ | 質問配列 |
| releaseDate | ISO8601 | | 公開開始日時 |
| dueDate | ISO8601 | | 締切日時 |
| targetGroups | string[] | | 対象グループ |
| status | SurveyStatus | ✓ | ステータス |

### SurveyStatus

```typescript
type SurveyStatus = 'draft' | 'scheduled' | 'active' | 'closed';
```

### Question

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | string | ✓ | 質問ID |
| type | QuestionType | ✓ | 質問タイプ |
| text | string | ✓ | 質問文 |
| required | boolean | ✓ | 必須フラグ |
| options | string[] | | 選択肢（single/multiple用） |

### QuestionType

```typescript
type QuestionType = 'single' | 'multiple' | 'text' | 'rating';
```

- `single`: 単一選択（ラジオボタン）
- `multiple`: 複数選択（チェックボックス）
- `text`: 自由記述（テキストエリア）
- `rating`: 評価（1-5スター）

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

## 4. コンポーネント

| 名前 | 責務 | 配置 |
|------|------|------|
| SurveyCardList | アンケート一覧（カード形式） | features/survey/components/ |
| SurveyForm | 回答フォーム | features/survey/components/ |
| QuestionItem | 個別質問（4タイプ対応） | features/survey/components/ |
| SurveyComplete | 完了画面 | features/survey/components/ |

## 5. 画面仕様

### 一覧画面
- **デスクトップ**: 3カラムカードグリッド
- **モバイル**: 1カラムスクロール
- 残り日数バッジ、回答済みマーク表示
- 「もっと見る」で全件展開

### 回答画面
- 1問ずつ or 全問一括（アンケート設定による）
- 進捗バー表示
- 必須未回答時はエラー表示

### 完了画面
- 「ご協力ありがとうございました」メッセージ
- 回答履歴へのリンク

## 6. 表示ロジック

```
現在日時 < releaseDate → 非表示
releaseDate <= 現在日時 < dueDate → 表示（回答可能）
dueDate <= 現在日時 → 表示（回答不可、締切表示）
```

## 7. 制約・バリデーション

| 項目 | 制約 |
|------|------|
| required=true の質問 | 回答必須、未回答で送信エラー |
| text タイプ | 最大1000文字 |
| rating タイプ | 1-5の整数 |

## 8. 関連

- → specs/features/notification.md（アンケート公開通知）
- → specs/features/mentor.md（管理者側アンケート管理）

## 9. 未実装項目

- [ ] Survey progress utility（回答率計算）
- [ ] AdminSurveyManager（管理画面）

## 10. 変更履歴

| 日付 | 変更内容 |
|------|----------|
| 2025-11-25 | スケジュール機能仕様追加 |
| 2025-11-20 | 初版作成、基本回答機能実装 |
