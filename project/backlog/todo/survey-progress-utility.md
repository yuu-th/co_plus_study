# アンケート進捗ユーティリティ

## 概要
アンケートの回答率計算、必須未回答項目の抽出ユーティリティ

## 参照仕様
→ specs/features/survey.md

## チェックリスト
- [ ] completionRate 関数（回答済み / 全質問）
- [ ] getMissingRequiredIds 関数（必須未回答の質問ID配列）
- [ ] SurveySummary.stats への統合

## メモ
- 軽量タスク、他に依存なし
- SurveyForm のバリデーション強化にも使用可能

## 履歴
- 2025-11-25: 作成
