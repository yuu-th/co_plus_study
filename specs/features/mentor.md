# メンター管理機能

> 最終更新: 2025-12-25
> ステータス: 実装完了

## 1. 概要

メンターが生徒を管理し、日報リアクション、お知らせ配信、チャット対応を行うための管理画面。

## 2. ユーザーストーリー

- メンターとして、担当生徒の学習状況を把握したい。適切なサポートをしたいから。
- メンターとして、生徒の日報にリアクションしたい。励ましを伝えたいから。
- メンターとして、お知らせを配信したい。重要な情報を伝えたいから。
- メンターとして、複数生徒のチャットを管理したい。効率的に対応したいから。

## 3. データ構造

> **SSoT**: `project/decisions/005-backend-integration-preparation.md`
>
> 関連テーブル: `profiles`, `mentor_profiles`
> 型定義: `frontend/src/features/mentor/types/mentor.ts`

### StudentSummary（ADR-005参照）

| フィールド | DB | 説明 |
|-----------|-----|------|
| `id` | profiles.id | 生徒ID |
| `displayName` | profiles.display_name | 生徒名 |
| `avatarUrl` | profiles.avatar_url | アバターURL |
| `totalPosts` | クエリ集計 | 総投稿数 |
| `totalHours` | クエリ集計 | 総学習時間 |
| `lastActivity` | クエリ | 最終活動日時 |

### NotificationDraft

| フィールド | DB | 説明 |
|-----------|-----|------|
| `category` | notifications.category | カテゴリ（info/event/important） |
| `title` | notifications.title | タイトル |
| `content` | notifications.content | 本文 |
| `priority` | notifications.priority | 優先度（low/medium/high） |

## 4. CRUDフロー

### 生徒管理

| 操作 | 画面 | 説明 |
|------|------|------|
| **Read** | StudentListPage | 担当生徒一覧を取得 |
| **Read** | StudentDetailPage | 生徒詳細・学習統計を取得 |

### お知らせ管理

| 操作 | 画面 | 説明 |
|------|------|------|
| **Create** | NotificationManagePage | 新規お知らせ作成・配信 |
| **Read** | NotificationListPage | 配信済みお知らせ一覧 |
| **Update** | NotificationManagePage | 既存お知らせ編集 |
| **Delete** | NotificationListPage | お知らせ削除 |

### チャット

| 操作 | 画面 | 説明 |
|------|------|------|
| **Create** | ChatPage | メッセージ送信 |
| **Read** | ChatPage | 全担当生徒のチャット取得 |
| **Update** | ChatPage | リアクション追加 |
| **Delete** | ChatPage | メッセージ削除 |

## 5. コンポーネント

| 名前 | 責務 | 配置 |
|------|------|------|
| MentorLayout | メンター専用レイアウト | features/mentor/components/layout/ |
| MentorSidebar | サイドバーナビゲーション | features/mentor/components/layout/ |
| StudentList | 生徒一覧 | features/mentor/components/ |
| StudentDetailPage | 生徒詳細 | features/mentor/pages/ |
| NotificationEditor | お知らせ作成 | features/mentor/components/notifications/ |
| StudentChatSwitcher | 生徒切替チャット | features/mentor/components/ |

## 6. 画面仕様

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
- カテゴリ選択（info/event/important）
- 優先度選択（low/medium/high）
- タイトル・本文入力
- プレビュー機能
- 投稿ボタン

## 7. ルーティング

| パス | コンポーネント | 説明 |
|------|---------------|------|
| /mentor | MentorDashboard | ダッシュボード |
| /mentor/students | StudentListPage | 生徒一覧 |
| /mentor/students/:id | StudentDetailPage | 生徒詳細 |
| /mentor/notifications | NotificationListPage | お知らせ一覧 |
| /mentor/notifications/create | NotificationManagePage | お知らせ作成 |
| /mentor/notifications/:id/edit | NotificationManagePage | お知らせ編集 |
| /mentor/chat | ChatPage | チャット（生徒切替） |
| /mentor/surveys | SurveyListPage | アンケート一覧 |
| /mentor/surveys/create | SurveyCreatePage | アンケート作成 |

## 8. 関連

- → ADR-005（データベース設計）
- → specs/features/diary.md（リアクション機能）
- → specs/features/notification.md（お知らせ配信）
- → specs/features/chat.md（チャット機能）
- → specs/features/survey.md（アンケート管理）

## 9. 変更履歴

| 日付 | 変更内容 |
|------|----------|
| 2025-12-25 | 抜本修正: ステータス更新、データ構造をADR-005参照に変更、CRUDフロー追加、ルーティング更新 |
| 2025-11-25 | 初版作成 |
