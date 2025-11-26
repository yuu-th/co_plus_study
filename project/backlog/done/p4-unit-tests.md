# ユーティリティ単体テスト

## 概要
ユーティリティ関数の単体テスト作成

## 参照仕様
（テスト戦略は任意）

## チェックリスト
- [x] Vitest セットアップ
- [x] groupByDate テスト
- [ ] computeWeeklyStats テスト（任意）
- [ ] dateUtils テスト（任意）

## 実装結果
- `frontend/package.json` - vitest, @vitest/ui, jsdom追加
- `frontend/src/utils/groupByDate.test.ts` - テストケース作成

## テストケース
- 空配列を渡すと空配列を返す
- 同じ日付の投稿が同じグループになる
- 異なる日付の投稿が別グループになる
- 今日・昨日のラベルが正しく表示される
- 投稿が日付の降順でソートされる

## 履歴
- 2025-11-25: 作成
- 2025-11-26: 実装完了（Wave 1）
