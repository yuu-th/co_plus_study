# アンケート進捗ユーティリティ

## 概要
アンケートの回答率計算、必須未回答項目の抽出ユーティリティ

## 参照仕様
→ specs/features/survey.md

## チェックリスト
- [x] completionRate 関数（回答済み / 全質問）
- [x] getMissingRequiredIds 関数（必須未回答の質問ID配列）
- [ ] SurveySummary.stats への統合（任意、未実施）

## 実装結果
- `frontend/src/utils/surveyProgress.ts` - ユーティリティ関数

## メモ
- 軽量タスク、他に依存なし
- SurveyForm のバリデーション強化にも使用可能

## 履歴
- 2025-11-25: 作成
- 2025-11-26: 実装完了（Wave 1）
