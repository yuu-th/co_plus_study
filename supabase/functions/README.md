# Edge Functions セットアップガイド

CO+ Study の Edge Functions をデプロイ・設定するためのガイドです。

## 📋 全体の流れ

1. **CLI セットアップ** - Supabase CLI のインストールとログイン
2. **Edge Functions デプロイ** - 3つの関数をサーバーにアップロード
3. **CRON_SECRET 設定** - セキュリティ用の秘密キーを2箇所に登録
4. **Webhook 設定** - 日報投稿時のバッジチェック自動化
5. **確認** - 動作テスト

---

## 1️⃣ CLI セットアップ

```powershell
# Supabase CLI インストール
npm install -g supabase

# ログイン（ブラウザが開きます）
supabase login

# プロジェクトにリンク
cd c:\Users\e2210\ProgrammingProject\co_plus_study
supabase link --project-ref zlfizonqkxikwwoytdil
```

---

## 2️⃣ Edge Functions デプロイ

```powershell
# プロジェクトルートで実行
cd c:\Users\e2210\ProgrammingProject\co_plus_study

# 3つの関数をデプロイ
supabase functions deploy check-badges --no-verify-jwt
supabase functions deploy calculate-streaks --no-verify-jwt
supabase functions deploy update-survey-status --no-verify-jwt
```

**確認**: https://supabase.com/dashboard/project/zlfizonqkxikwwoytdil/functions

---

## 3️⃣ CRON_SECRET の設定

CRON_SECRET は **2箇所** に設定が必要です。

### Step 1: 秘密キーを生成

```powershell
$secret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
Write-Host "CRON_SECRET: $secret"
```

**⚠️ この値をコピーしておいてください！**

### Step 2: Supabase に登録

```powershell
supabase secrets set CRON_SECRET=$secret
```

### Step 3: GitHub Secrets に登録

1. https://github.com/yuu-th/co_plus_study/settings/secrets/actions
2. **New repository secret** をクリック
3. 設定:
   - **Name**: `CRON_SECRET`
   - **Secret**: `(Step 1 でコピーした値)`
4. **Add secret** をクリック

### なぜ2箇所？

| 場所 | 用途 |
|------|------|
| **Supabase Secrets** | Edge Function 内で認証チェックに使用 |
| **GitHub Secrets** | GitHub Actions からリクエスト送信時に使用 |

両方が **同じ値** でないと認証が通りません。

---

## 4️⃣ バッジチェックの自動化

日報投稿時に自動でバッジをチェックします。

### ✅ 実装済み（コード内）

`useCreateDiaryPost()` フック内で、日報投稿成功後に自動的に `check-badges` Edge Function を呼び出すようになっています。

```typescript
// frontend/src/lib/hooks/useDiary.ts
supabase.functions.invoke('check-badges', {
    body: { record: { user_id: post.user_id } },
});
```

**追加設定は不要です。**

### 📝 補足: Database Webhook（代替方法）

Supabase Dashboard で Webhook が利用可能な場合は、そちらを使うこともできます：

1. Database → Hooks → Create a new hook
2. 設定:
   - Table: `diary_posts`
   - Events: `INSERT`
   - Type: `HTTP Request`
   - URL: `https://zlfizonqkxikwwoytdil.supabase.co/functions/v1/check-badges`
   - Headers: `Authorization: Bearer <anon-key>`

ただし、現在はフロントエンドからの呼び出しで対応しているため、この設定は不要です。

---

## 5️⃣ 確認

### Edge Functions の確認

Dashboard → Functions → 各関数のステータスが「Active」になっていればOK

### Cron の確認

GitHub → Actions タブ → 「Daily Cron Jobs」ワークフローを手動実行してテスト

### Webhook の確認

1. アプリで日報を投稿
2. Dashboard → Functions → check-badges → Logs を確認
3. バッジが付与されていればOK

---

## 📁 ファイル構成

```
supabase/functions/
├── _shared/           # 共通モジュール
│   ├── supabase.ts    # Supabase クライアント
│   └── cors.ts        # CORS ヘッダー
├── check-badges/      # 日報投稿時のバッジチェック
│   ├── index.ts
│   └── deno.json
├── calculate-streaks/ # 連続日数計算（日次）
│   ├── index.ts
│   └── deno.json
├── update-survey-status/ # アンケート状態更新（日次）
│   ├── index.ts
│   └── deno.json
└── import_map.json    # 依存関係
```

---

## 🔧 トラブルシューティング

| エラー | 原因 | 解決策 |
|--------|------|--------|
| 401 Unauthorized | CRON_SECRET が一致しない | Supabase と GitHub 両方に同じ値を設定 |
| 500 Internal Error | コードのバグ | Dashboard → Functions → Logs を確認 |
| Webhook が動かない | Authorization ヘッダーが間違い | anon key を再確認 |
| Cron が動かない | GitHub Actions が無効 | Actions タブで有効化 |

---

## 📝 補足: Storage バケット

Storage バケット（avatars, chat-images）は Dashboard で手動作成済みの場合、追加設定不要です。

CLI で作成する場合:
```powershell
supabase db push
```

