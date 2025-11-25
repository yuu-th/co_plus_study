# 001: 技術スタック選定

## 日付
2025-10-01

## ステータス
採用

## 決定
React 18 + TypeScript + Vite を採用

## 背景
小中学生向け学習支援Webアプリのフロントエンドを開発する必要がある。

## 理由
- **React 18**: コンポーネントベースで再利用性が高い、エコシステムが充実
- **TypeScript**: 型安全性により実行時エラーを削減、IDEサポートが優秀
- **Vite**: 高速なHMR、設定が簡潔、ESM native

## 検討した代替案

| 選択肢 | 長所 | 短所 | 判断 |
|--------|------|------|------|
| Next.js | SSR/SSG対応 | 今回SSR不要、過剰 | 不採用 |
| Vue 3 | 学習コスト低 | チーム経験がReact寄り | 不採用 |
| Svelte | 軽量、高速 | エコシステムが小さい | 不採用 |

## 影響
- スタイリングはCSS Modulesを標準とする
- 状態管理はContext API + useReducerで十分（Redux不使用）
- ルーティングはReact Router v6

## 関連
- → project/decisions/002-no-backend.md
- → project/decisions/003-css-modules.md
