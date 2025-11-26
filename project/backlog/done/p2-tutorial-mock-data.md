# チュートリアルモックデータ

## 概要
チュートリアル機能のモックデータを作成

## 参照仕様
→ specs/features/tutorial.md

## チェックリスト
- [x] Quest型定義（拡張: targetDescription, action追加）
- [x] TutorialProgress型定義（拡張: currentStep, totalSteps, isSkipped追加）
- [x] mockQuests（5クエスト）
- [x] mockTutorialProgress 初期状態
- [x] 対象セレクタ設定

## 実装結果
- `frontend/src/types/tutorial.ts` - 型定義拡張
- `frontend/src/mockData/tutorials.ts` - モックデータ

## 履歴
- 2025-11-25: 作成
- 2025-11-26: 実装完了（Wave 1）
