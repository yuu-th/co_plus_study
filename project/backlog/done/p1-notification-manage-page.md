# お知らせ管理ページ

## 概要
メンターがお知らせを作成・管理するページ

## 参照仕様
→ specs/features/mentor.md
→ specs/features/notification.md

## チェックリスト
- [x] NotificationManagePage コンポーネント
- [x] NotificationEditor（カテゴリ、タイトル、本文）
- [x] プレビュー機能 (NotificationCard使用)
- [x] 投稿機能 (addNotification)
- [x] 配信済み一覧 (NotificationList)

## 依存
- MentorLayout ✅
- useNotifications ✅

## 成果物
- `frontend/src/pages/NotificationManagePage/`
- `frontend/src/components/mentor/NotificationEditor/`

## 履歴
- 2025-11-25: 作成
- 2025-11-26: Jules Agent実装完了
