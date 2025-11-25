# メンター管理機能

> 最終更新: 2025-11-25
> ステータス: 未実装

## 1. 概要

メンターが生徒を管理し、日報リアクション、お知らせ配信、チャット対応を行うための管理画面。

## 2. ユーザーストーリー

- メンターとして、担当生徒の学習状況を把握したい。適切なサポートをしたいから。
- メンターとして、生徒の日報にリアクションしたい。励ましを伝えたいから。
- メンターとして、お知らせを配信したい。重要な情報を伝えたいから。
- メンターとして、複数生徒のチャットを管理したい。効率的に対応したいから。

## 3. データ構造

### StudentSummary

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | string | 生徒ID |
| name | string | 生徒名 |
| avatarUrl | string? | アバターURL |
| totalPosts | number | 総投稿数 |
| totalHours | number | 総学習時間 |
| lastActivity | ISO8601 | 最終活動日時 |

### StudentDetail

StudentSummaryを拡張:

| フィールド | 型 | 説明 |
|-----------|-----|------|
| posts | DiaryPost[] | 日報配列 |
| stats | StudentStats | 学習統計 |

### StudentStats

| フィールド | 型 | 説明 |
|-----------|-----|------|
| continuousDays | number | 連続活動日数 |
| totalHours | number | 総学習時間 |
| subjectBreakdown | SubjectTime[] | 教科別内訳 |

### NotificationDraft

| フィールド | 型 | 説明 |
|-----------|-----|------|
| category | NotificationCategory | カテゴリ |
| title | string | タイトル |
| content | string | 本文 |

## 4. コンポーネント

| 名前 | 責務 | 配置 |
|------|------|------|
| MentorLayout | メンター専用レイアウト | features/mentor/components/ |
| MentorDashboard | ダッシュボード | features/mentor/components/ |
| StudentList | 生徒一覧 | features/mentor/components/ |
| StudentDetailPage | 生徒詳細 | features/mentor/components/ |
| NotificationEditor | お知らせ作成 | features/mentor/components/ |

## 5. 画面仕様

### MentorDashboard
- **担当生徒カード**: グリッド表示、最終活動日、未読メッセージバッジ
- **最近の日報**: タイムライン形式、リアクションボタン付き
- **お知らせ作成CTA**: 新規お知らせ作成へ遷移

### StudentList
- 生徒カード一覧
- 検索・ソート機能（名前、最終活動日、学習時間）
- クリックで詳細ページへ

### StudentDetailPage
- **ヘッダー**: 生徒名、アバター、基本統計
- **統計グラフ**: 学習時間推移、教科別内訳
- **日報タイムライン**: リアクションボタン付き

### NotificationEditor
- カテゴリ選択
- タイトル・本文入力
- プレビュー機能
- 投稿 / 下書き保存ボタン

## 6. ルーティング

| パス | コンポーネント | 説明 |
|------|---------------|------|
| /mentor/login | MentorLoginPage | ログイン |
| /mentor/dashboard | MentorDashboard | ダッシュボード |
| /mentor/students | StudentListPage | 生徒一覧 |
| /mentor/students/:id | StudentDetailPage | 生徒詳細 |
| /mentor/notifications | NotificationManagePage | お知らせ管理 |
| /mentor/chat | ChatPage | チャット（生徒切替） |

## 7. レイアウト

MentorLayoutはStudentLayout（通常のLayout）と分離:
- サイドバーメニューが異なる（生徒管理、お知らせ管理など）
- ヘッダーに「メンターモード」表示

## 8. 関連

- → specs/features/diary.md（リアクション機能）
- → specs/features/notification.md（お知らせ配信）
- → specs/features/chat.md（チャット機能）
- → specs/features/survey.md（アンケート管理）

## 9. 実装タスク

- [ ] MentorLayout
- [ ] MentorDashboard
- [ ] StudentListPage
- [ ] StudentDetailPage
- [ ] NotificationManagePage
- [ ] メンタールート追加

## 10. 変更履歴

| 日付 | 変更内容 |
|------|----------|
| 2025-11-25 | 初版作成 |
