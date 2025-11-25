# タイポグラフィ

> 最終更新: 2025-11-25

## 概要

フォント、サイズ、行間の定義。

## フォントファミリー

| 用途 | CSS変数 | 値 |
|------|---------|-----|
| 本文 | `--font-family-base` | 'Noto Sans JP', sans-serif |
| 数字 | `--font-family-numeric` | 'Roboto', sans-serif |

## フォントサイズ

| サイズ | CSS変数 | 値 | 用途 |
|--------|---------|-----|------|
| XS | `--font-size-xs` | 0.75rem (12px) | 補足、タイムスタンプ |
| SM | `--font-size-sm` | 0.875rem (14px) | 小さめテキスト |
| MD | `--font-size-md` | 1rem (16px) | 本文 |
| LG | `--font-size-lg` | 1.125rem (18px) | 小見出し |
| XL | `--font-size-xl` | 1.5rem (24px) | 見出し |
| 2XL | `--font-size-2xl` | 2rem (32px) | 大見出し |
| 3XL | `--font-size-3xl` | 3rem (48px) | 特大（カウンター等） |

## フォントウェイト

| 太さ | CSS変数 | 値 |
|------|---------|-----|
| 標準 | `--font-weight-normal` | 400 |
| 中 | `--font-weight-medium` | 500 |
| 太字 | `--font-weight-bold` | 700 |

## 行間

| サイズ | CSS変数 | 値 |
|--------|---------|-----|
| タイト | `--line-height-tight` | 1.25 |
| 標準 | `--line-height-normal` | 1.5 |
| ゆったり | `--line-height-relaxed` | 1.75 |

## 使用例

```css
.title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

.body {
  font-size: var(--font-size-md);
  line-height: var(--line-height-normal);
}

.counter {
  font-family: var(--font-family-numeric);
  font-size: var(--font-size-3xl);
}
```

## 変更履歴

| 日付 | 変更内容 |
|------|----------|
| 2025-11-25 | 初版作成 |
