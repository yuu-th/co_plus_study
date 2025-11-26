# useTutorialフック

## 概要
チュートリアル状態管理のカスタムフック

## 参照仕様
→ specs/features/tutorial.md

## チェックリスト
- [x] progress 状態 (useState)
- [x] currentQuest 取得 (useMemo)
- [x] isActive 判定
- [x] startTutorial (useCallback)
- [x] nextStep (useCallback + stale closure修正済み)
- [x] skipTutorial (useCallback)
- [x] completeTutorial (useCallback)
- [x] resetTutorial (useCallback)

## 依存
- チュートリアルモックデータ ✅

## 成果物
- `frontend/src/hooks/useTutorial.ts`

## 履歴
- 2025-11-25: 作成
- 2025-11-26: Jules Agent実装完了（stale closureバグ自動修正含む）
