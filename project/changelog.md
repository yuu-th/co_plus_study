# 変更履歴

## 2025-11-26

### Wave 1完了（並列エージェント実行）
- MentorLayout（MentorSidebar, MentorHeader）
- チュートリアルモックデータ（Quest型、mockQuests）
- ErrorBoundary（App.tsx統合）
- CSS空ルール削除（全ファイル確認済み）
- アンケート進捗ユーティリティ（completionRate, getMissingRequiredIds）
- 単体テスト（vitest, groupByDate.test.ts）
- メンター型定義（StudentSummary, StudentDetail, StudentStats）

### Wave 2完了（Jules並列エージェント）
- MentorDashboardPage（担当生徒グリッド、日報タイムライン、CTAボタン）
- StudentListPage（検索・ソート機能付き生徒一覧）
- StudentDetailPage（生徒統計、日報タイムライン）
- NotificationManagePage（お知らせエディタ、プレビュー機能）
- useTutorialフック（stale closureバグ修正済み）
- StudentCard, StudentStatsコンポーネント

### バグ修正
- useTutorial: stale closure in nextStep → setProgress関数型更新パターンで解決
- 各コンポーネントにindex.ts追加（DiaryPostCard, NotificationCard, NotificationList等）
- NotificationEditor: インポートパス修正
- StudentDetailPage: DiaryPost.timestamp参照に修正

---

## 2025-11-25

### 構造リファクタリング
- プロジェクト構造を Feature-Driven + Single Source of Truth に移行
- `project/` ディレクトリ新設（タスク管理・意思決定記録）
- `specs/` ディレクトリ新設（仕様の唯一の源）
- `frontend/src/features/` 構造に移行

### 実装完了
- 通知機能一式（NotificationCard, List, Modal, Badge, useNotifications）
- リアクション機能（ReactionButton, DiaryPostCard統合）

---

## 2025-11-20

### 実装完了
- 学習日報機能（DiaryPostForm, DiaryPostCard, DiaryTimeline, DiaryStats）
- 相談チャット機能（ChatMessage, ChatInput, ChatHeader, MessageList）
- アンケート機能（SurveyForm, QuestionItem）

---

## 2025-11-15

### 実装完了
- ARCHIVE機能（CalendarView, MonthlyCalendar, WeeklyActivity, BadgeCard）
- 基本レイアウト（Layout, Sidebar, Header）
- 共通コンポーネント（Button, Card, Modal, Badge）
