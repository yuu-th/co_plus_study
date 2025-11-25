# 変更履歴

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
