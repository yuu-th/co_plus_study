# メンター型定義追加

## 概要
メンター管理機能で使用する型定義とモックデータを作成

## 参照仕様
→ specs/features/mentor.md（セクション3 データ構造）

## チェックリスト
- [x] StudentSummary 型
- [x] StudentDetail 型（StudentSummary拡張）
- [x] StudentStats 型
- [x] SubjectTime 型
- [x] NotificationDraft 型
- [x] mockStudents（4人分）
- [x] mockStudentDetails（2人分）
- [x] types/index.ts からのre-export

## 実装結果
- `frontend/src/types/mentor.ts` - 型定義
- `frontend/src/mockData/mentors.ts` - モックデータ

## 履歴
- 2025-11-26: 作成・実装完了（Wave 1）
