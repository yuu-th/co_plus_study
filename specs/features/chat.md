# 相談チャット機能

> 最終更新: 2025-11-25
> ステータス: 実装完了

## 1. 概要

生徒がメンターと1対1でチャットできる機能。LINE/Slackライクな吹き出しUIで、学習相談や進路相談を行う。

## 2. ユーザーストーリー

- 生徒として、メンターに学習の相談をしたい。わからないことを聞きたいから。
- 生徒として、過去のやり取りを見返したい。アドバイスを確認したいから。
- メンターとして、生徒からの相談に回答したい。学習支援をしたいから。

## 3. データ構造

### Message

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | string | ✓ | 一意識別子 |
| senderId | string | ✓ | 送信者ID |
| senderName | string | ✓ | 送信者名 |
| senderRole | 'student' \| 'mentor' | ✓ | 役割 |
| content | string | ✓ | メッセージ本文（最大500文字） |
| timestamp | ISO8601 | ✓ | 送信日時 |
| isRead | boolean | ✓ | 既読フラグ |

### ChatRoom

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | string | チャットルームID |
| mentorId | string | メンターID |
| mentorName | string | メンター名 |
| mentorStatus | 'online' \| 'offline' | オンライン状態 |
| lastSeen | ISO8601? | 最終ログイン |
| messages | Message[] | メッセージ配列 |

## 4. コンポーネント

| 名前 | 責務 | 配置 |
|------|------|------|
| ChatHeader | メンター情報表示 | features/chat/components/ |
| MessageList | メッセージ一覧（日付区切り） | features/chat/components/ |
| ChatMessage | 個別メッセージ（吹き出し） | features/chat/components/ |
| ChatInput | 入力エリア | features/chat/components/ |

## 5. 画面仕様

### レイアウト
- **上部**: メンター情報ヘッダー（固定）
- **中央**: メッセージリスト（スクロール）
- **下部**: 入力エリア（固定）

### 吹き出しスタイル
- **自分**: 右寄せ、緑背景（`--color-message-own`）
- **相手**: 左寄せ、グレー背景（`--color-message-other`）

### インタラクション
- Enter送信、Shift+Enter改行
- 上スクロールで過去メッセージ読み込み
- 新着メッセージで最下部へ自動スクロール

## 6. 制約・バリデーション

| フィールド | 制約 |
|-----------|------|
| content | 必須、1-500文字 |

## 7. カラー

| 用途 | CSS変数 | 値 |
|------|---------|-----|
| 自分のメッセージ | `--color-message-own` | #DCF8C6 |
| 相手のメッセージ | `--color-message-other` | #ECECEC |
| タイムスタンプ | `--color-message-timestamp` | #999999 |
| オンライン | `--color-online` | #34B7F1 |
| オフライン | `--color-offline` | #CCCCCC |

## 8. 関連

- → specs/features/mentor.md（メンター側チャット画面）

## 9. 変更履歴

| 日付 | 変更内容 |
|------|----------|
| 2025-11-20 | 初版作成、基本実装完了 |
