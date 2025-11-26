# ErrorBoundaryコンポーネント

## 概要
Reactエラー境界コンポーネントを追加

## 参照仕様
→ specs/shared/components.md

## チェックリスト
- [x] ErrorBoundary コンポーネント作成
- [x] エラーフォールバックUI
- [x] App.tsx でラップ
- [x] エラーログ出力（console）

## 実装結果
- `frontend/src/components/common/ErrorBoundary/` - コンポーネント
- `frontend/src/App.tsx` - ErrorBoundaryでRouterをラップ

## メモ
- クラスコンポーネントで実装（getDerivedStateFromError）
- 「ホームに戻る」「再読み込み」ボタン付き

## 履歴
- 2025-11-25: 作成
- 2025-11-26: 実装完了（Wave 1）
