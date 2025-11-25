# カラーパレット

> 最終更新: 2025-11-25

## 概要

CO+ Studyで使用するすべての色定義。
CSS変数として `frontend/src/shared/styles/variables.css` に実装。

## ベースカラー

| 用途 | CSS変数 | 値 | 説明 |
|------|---------|-----|------|
| 背景（メイン） | `--color-bg-primary` | #F5F9FC | 水色がかった白 |
| 背景（サブ） | `--color-bg-secondary` | #FFFFFF | 純白 |
| テキスト（メイン） | `--color-text-primary` | #333333 | ほぼ黒 |
| テキスト（サブ） | `--color-text-secondary` | #666666 | グレー |
| テキスト（薄） | `--color-text-muted` | #999999 | 薄いグレー |
| ボーダー | `--color-border` | #E0E0E0 | 薄いグレー |

## アクセントカラー

| 用途 | CSS変数 | 値 | 説明 |
|------|---------|-----|------|
| プライマリ | `--color-accent-blue` | #4DB8E8 | メインの水色 |
| 成功 | `--color-accent-green` | #4CAF50 | 緑 |
| 警告 | `--color-accent-orange` | #FF9800 | オレンジ |
| エラー | `--color-accent-red` | #F44336 | 赤 |

## 教科別カラー

| 教科 | CSS変数 | 値 |
|------|---------|-----|
| 国語 | `--color-subject-japanese` | #FF6B9D |
| 算数 | `--color-subject-math` | #4169E1 |
| 理科 | `--color-subject-science` | #32CD32 |
| 社会 | `--color-subject-social` | #FF8C00 |
| 英語 | `--color-subject-english` | #9370DB |
| その他 | `--color-subject-other` | #808080 |

## バッジカラー

| ランク | CSS変数 | 値 |
|--------|---------|-----|
| プラチナ | `--color-badge-platinum` | #E5E4E2 |
| 金 | `--color-badge-gold` | #FFD700 |
| 銀 | `--color-badge-silver` | #C0C0C0 |
| 銅 | `--color-badge-bronze` | #CD7F32 |

## 通知カテゴリカラー

| カテゴリ | CSS変数 | 値 | 用途 |
|----------|---------|-----|------|
| 情報 | `--color-notification-info` | #2196F3 | 一般的なお知らせ |
| 重要 | `--color-notification-important` | #F44336 | 重要な通知 |
| イベント | `--color-notification-event` | #4CAF50 | イベント告知 |
| 達成 | `--color-notification-achievement` | #FFD700 | バッジ獲得等 |

## 使用例

```css
/* コンポーネント内での使用 */
.card {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
}

.button {
  background-color: var(--color-accent-blue);
}

.subjectBadge {
  background-color: var(--color-subject-math);
}
```

## 変更履歴

| 日付 | 変更内容 |
|------|----------|
| 2025-11-25 | 通知カテゴリカラー追加 |
| 2025-11-15 | 初版作成 |
