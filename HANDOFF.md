# CO+ Study バックエンド連携 引き継ぎドキュメント

> 作成日: 2025-12-25
> 作成者: AI Assistant
> 目的: プロジェクト引き継ぎのための完全ガイド

---

## 📋 目次

1. [プロジェクト概要](#1-プロジェクト概要)
2. [必読ドキュメント](#2-必読ドキュメント)
3. [現在の実装状態](#3-現在の実装状態)
4. [ディレクトリ構造](#4-ディレクトリ構造)
5. [技術スタック](#5-技術スタック)
6. [認証設計](#6-認証設計)
7. [データベース設計](#7-データベース設計)
8. [フック一覧](#8-フック一覧)
9. [次のアクション（優先度順）](#9-次のアクション優先度順)
10. [注意事項・落とし穴](#10-注意事項落とし穴)
11. [開発環境セットアップ](#11-開発環境セットアップ)
12. [よくある質問](#12-よくある質問)

---

## 1. プロジェクト概要

**CO+ Study** は、学習意欲のある小中学生を高専生メンターが支援する学習記録・相談Webアプリ。

### ユーザーロール

| ロール | 対象 | 主な機能 |
|--------|------|----------|
| 生徒 (`student`) | 小中学生 | 日報作成、チャット相談、実績閲覧、アンケート回答 |
| メンター (`mentor`) | 高専生 | 日報リアクション、チャット対応、お知らせ配信 |
| 管理者 (`admin`) | 運営者 | メンター管理、アンケート作成、全機能アクセス |

### 主要機能

- **学習日報**: SNS風タイムラインで学習記録
- **相談チャット**: メンターとの1対1リアルタイムチャット
- **実績**: カレンダー、バッジ、連続日数表示
- **アンケート**: 運営からの調査収集
- **お知らせ**: 運営からの通知配信

---

## 2. 必読ドキュメント

### 最重要（必ず全文読むこと）

| ファイル | 内容 | 行数 |
|---------|------|------|
| `project/decisions/005-backend-integration-preparation.md` | **バックエンド連携の全設計** (SSoT) | 705行 |
| `specs/features/auth.md` | 認証・登録フロー仕様 | 117行 |

### 機能別仕様書

| ファイル | 機能 |
|---------|------|
| `specs/features/diary.md` | 学習日報 |
| `specs/features/chat.md` | 相談チャット |
| `specs/features/archive.md` | 実績（カレンダー・バッジ） |
| `specs/features/survey.md` | アンケート |
| `specs/features/notification.md` | お知らせ |
| `specs/features/home.md` | ホーム画面 |
| `specs/features/tutorial.md` | チュートリアル |
| `specs/features/mentor.md` | メンター管理 |

### アーキテクチャ

| ファイル | 内容 |
|---------|------|
| `project/decisions/` | 全ADR（アーキテクチャ決定記録） |
| `specs/overview.md` | プロジェクト概要 |
| `specs/README.md` | specs構造説明 |

---

## 3. 現在の実装状態

### ✅ 完了済み

#### フロントエンド基盤
- [x] React 18 + Vite + TypeScript 環境構築
- [x] 全ページUI実装（生徒・メンター両画面）
- [x] モックデータによる動作確認
- [x] CSS Modules スタイリング

#### バックエンド連携基盤
- [x] `@supabase/supabase-js` インストール
- [x] `@tanstack/react-query` インストール
- [x] Supabaseクライアント設定（`lib/supabase.ts`）
- [x] React Query設定（`lib/queryClient.ts`）
- [x] 認証プロバイダー（`lib/auth/AuthProvider.tsx`）
- [x] 全データフック作成（7種類）
- [x] `App.tsx` にProvider統合

#### SQLマイグレーション
- [x] `001_initial_schema.sql` - 全13テーブル＋ENUM
- [x] `002_triggers.sql` - updated_at自動更新、profiles自動作成
- [x] `003_rls_policies.sql` - 全テーブルRLS
- [x] `004_seed_data.sql` - バッジ定義15件
- [x] `005_storage.sql` - Storageバケット設定

#### P0: 認証連携 ✅（2025-12-25 完了）
- [x] Supabaseプロジェクト作成・リンク済み
- [x] `.env.local` 設定済み
- [x] マイグレーション実行済み（supabase db push）
- [x] `LoginPage.tsx` で `signInAnonymously()` 呼び出し実装
- [x] `RegisterPage.tsx` で `updateProfile()` 呼び出し実装
- [x] `ProtectedRoute` コンポーネント作成
- [x] 生徒・メンター両方のルートを `ProtectedRoute` で保護
- [x] サイドバーにログアウトボタン追加（生徒・メンター両方）

### ⏳ 未完了

#### P1: ページ別フック統合 ✅（2025-12-25 完了）
- [x] DiaryPage でフック使用
- [x] ChatPage でフック使用
- [x] ArchivePage でフック使用
- [x] SurveyPage でフック使用
- [x] NotificationPage でフック使用
- [x] Header で未読数表示
- [x] 生徒側 全ページ統合完了
- [x] メンター側 全ページ統合完了
  - StudentListPage / StudentDetailPage
  - SurveyListPage / SurveyCreatePage / SurveyResultsPage  
  - NotificationListPage / NotificationManagePage
  - DashboardPage / ChatPage
  - MentorHeader / MentorSidebar / MentorProfileEditPage

#### P2: 残対応項目
- [ ] HomePage の RecentActivityTimeline（activitiesテーブルが未定義のためモックデータのまま）

#### P3: Edge Functions
- [ ] バッジ判定ロジック
- [ ] 連続日数計算Cron
- [ ] アンケートスケジュール

---

## 4. ディレクトリ構造

```
co_plus_study/
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # ルートコンポーネント（Provider統合済）
│   │   ├── router.tsx           # React Router設定
│   │   ├── lib/                  # ★ バックエンド連携コア
│   │   │   ├── supabase.ts      # Supabaseクライアント
│   │   │   ├── queryClient.ts   # React Query設定
│   │   │   ├── database.types.ts # DB型定義
│   │   │   ├── index.ts         # エクスポート
│   │   │   ├── auth/
│   │   │   │   ├── AuthProvider.tsx  # 認証Context
│   │   │   │   └── index.ts
│   │   │   └── hooks/           # データフック
│   │   │       ├── useCurrentUser.ts
│   │   │       ├── useDiary.ts
│   │   │       ├── useChat.ts
│   │   │       ├── useNotifications.ts
│   │   │       ├── useSurveys.ts
│   │   │       ├── useBadges.ts
│   │   │       ├── useCalendar.ts
│   │   │       └── index.ts
│   │   ├── features/
│   │   │   ├── auth/            # 認証関連ページ
│   │   │   │   ├── student/     # 生徒ログイン・登録
│   │   │   │   └── mentor/      # メンターログイン
│   │   │   ├── student/         # 生徒機能
│   │   │   └── mentor/          # メンター機能
│   │   └── shared/
│   │       ├── types/           # 共通型定義
│   │       └── components/      # 共通コンポーネント
│   ├── .env.example             # 環境変数テンプレート
│   ├── vite.config.ts           # @/lib エイリアス設定済
│   └── tsconfig.app.json        # パス設定済
├── supabase/
│   └── migrations/              # SQLマイグレーション
│       ├── 001_initial_schema.sql
│       ├── 002_triggers.sql
│       ├── 003_rls_policies.sql
│       ├── 004_seed_data.sql
│       └── 005_storage.sql
├── specs/
│   └── features/                # 機能仕様書
└── project/
    └── decisions/               # ADR
        └── 005-backend-integration-preparation.md  # ★最重要
```

---

## 5. 技術スタック

| 層 | 技術 | バージョン |
|-----|------|-----------|
| Frontend | React | 18.x |
| Build | Vite | 最新 |
| 言語 | TypeScript | 5.x |
| State | @tanstack/react-query | 5.x |
| Backend | Supabase | - |
| DB | PostgreSQL + RLS | - |
| Auth | Supabase Auth | 匿名→OAuth→Email |
| Realtime | Supabase Realtime | WebSocket |
| Storage | Supabase Storage | avatars, chat-images |
| Styling | CSS Modules | - |

---

## 6. 認証設計

### 段階的認証モデル

```
Phase 1: 匿名認証
    ↓ リンク
Phase 2: Google OAuth
    ↓ リンク
Phase 3: Email/Password
```

### 実装済みAPI

```typescript
// lib/auth/AuthProvider.tsx から利用可能

const { 
  user,              // Supabase Auth User
  session,           // Session
  profile,           // profiles テーブルのレコード
  isLoading,         // 初期化中
  isAuthenticated,   // 認証済みか
  signInAnonymously, // 匿名ログイン
  signOut,           // ログアウト
  linkWithGoogle,    // Google連携
  updateProfile,     // プロフィール更新
  refreshProfile,    // プロフィール再取得
} = useAuth();
```

### 登録フォームフィールド

| フィールド | DB列 | バリデーション |
|-----------|------|---------------|
| displayName | `profiles.display_name` | 必須、1-20文字 |
| nameKana | `profiles.name_kana` | 必須、ひらがな/カタカナ |
| grade | `profiles.grade` | 必須、'小学1年'〜'中学3年' |
| avatarUrl | `profiles.avatar_url` | 任意、5MB以下 |

---

## 7. データベース設計

### テーブル一覧

| # | テーブル | 用途 | RLS |
|---|---------|------|-----|
| 1 | `profiles` | ユーザー拡張 | ✓ |
| 2 | `mentor_profiles` | メンター固有情報 | ✓ |
| 3 | `diary_posts` | 学習日報 | ✓ |
| 4 | `diary_reactions` | 日報リアクション | ✓ |
| 5 | `chat_rooms` | チャットルーム | ✓ |
| 6 | `messages` | メッセージ | ✓ |
| 7 | `message_reactions` | メッセージリアクション | ✓ |
| 8 | `badge_definitions` | バッジマスタ | ✓ |
| 9 | `user_badges` | 獲得バッジ | ✓ |
| 10 | `surveys` | アンケート | ✓ |
| 11 | `survey_responses` | 回答 | ✓ |
| 12 | `notifications` | お知らせ | ✓ |
| 13 | `user_notifications` | 既読状態 | ✓ |

### ENUM型

| 型 | 値 |
|-----|-----|
| `subject_type` | 国語, 数学, 理科, 社会, 英語, その他 |
| `reaction_emoji` | 👍, ❤️, 🎉, 👏, 🔥 |
| `message_type` | text, image |
| `badge_rank` | platinum, gold, silver, bronze |
| `survey_status` | draft, scheduled, active, closed |
| `notification_category` | info, event, important |

---

## 8. フック一覧

### 認証

```typescript
import { useAuth } from '@/lib';
```

### データ取得

| フック | 用途 | ファイル |
|-------|------|---------|
| `useCurrentUser()` | 現在ユーザー取得 | `useCurrentUser.ts` |
| `useDiaryPosts(options)` | 日報一覧（無限スクロール） | `useDiary.ts` |
| `useDiaryPost(id)` | 日報詳細 | `useDiary.ts` |
| `useCreateDiaryPost()` | 日報作成 | `useDiary.ts` |
| `useAddDiaryReaction()` | 日報リアクション追加 | `useDiary.ts` |
| `useChatRooms(userId)` | チャットルーム一覧 | `useChat.ts` |
| `useMessages(roomId)` | メッセージ一覧 | `useChat.ts` |
| `useRealtimeMessages(roomId)` | リアルタイム購読 | `useChat.ts` |
| `useSendMessage()` | メッセージ送信 | `useChat.ts` |
| `useNotifications(userId)` | 通知一覧 | `useNotifications.ts` |
| `useUnreadNotificationCount(userId)` | 未読数 | `useNotifications.ts` |
| `useActiveSurveys()` | 回答可能アンケート | `useSurveys.ts` |
| `useSubmitSurveyResponse()` | 回答送信 | `useSurveys.ts` |
| `useBadgesWithProgress(userId)` | バッジ一覧（進捗付き） | `useBadges.ts` |
| `useCalendarData(userId, year, month)` | カレンダーデータ | `useCalendar.ts` |
| `useStreak(userId)` | 連続日数 | `useBadges.ts` |

---

## 9. 次のアクション（優先度順）

### P0: 認証連携（ログインが動作しないと他が何もできない）

#### 1. LoginPage.tsx 修正

```typescript
// frontend/src/features/auth/student/pages/LoginPage/LoginPage.tsx

import { useAuth } from '@/lib';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { signInAnonymously, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { error } = await signInAnonymously();
    if (!error) {
      navigate('/');  // ホームへ遷移
    }
  };

  return (
    <button onClick={handleLogin} disabled={isLoading}>
      ログイン
    </button>
  );
};
```

#### 2. RegisterPage.tsx 修正

```typescript
// frontend/src/features/auth/student/pages/RegisterPage/RegisterPage.tsx

import { useAuth } from '@/lib';

const RegisterPage = () => {
  const { updateProfile } = useAuth();

  const handleSubmit = async (formData: FormData) => {
    const { error } = await updateProfile({
      display_name: formData.displayName,
      name_kana: formData.nameKana,
      grade: formData.grade,
      avatar_url: formData.avatarUrl,
    });
    // 成功時はホームへ遷移
  };
};
```

#### 3. ProtectedRoute.tsx 新規作成

```typescript
// frontend/src/shared/components/ProtectedRoute/ProtectedRoute.tsx

import { useAuth } from '@/lib';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return <>{children}</>;
};
```

### P1: ページ別統合

各ページでmockデータをフック呼び出しに置換。例：

```typescript
// DiaryPage.tsx
import { useDiaryPosts, useCreateDiaryPost } from '@/lib';

const DiaryPage = () => {
  const { data, isLoading, fetchNextPage } = useDiaryPosts();
  const createPost = useCreateDiaryPost();

  // mockData を data?.pages.flatMap(p => p.data) に置換
};
```

### P2: Supabaseセットアップ

1. https://supabase.com でプロジェクト作成
2. `.env.local` を作成:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Supabase CLI インストール: `npm install -g supabase`
4. マイグレーション実行: `supabase db push`

---

## 10. 注意事項・落とし穴

### 型定義の不整合

| フロントエンド | DB | 注意 |
|---------------|-----|------|
| `displayName` | `display_name` | snake_case変換必要 |
| `nameKana` | `name_kana` | snake_case変換必要 |
| `isRead` | `is_read` | snake_case変換必要 |

### grade値のフォーマット

```typescript
// ✅ 正しい
grade: '小学1年' | '小学2年' | ... | '中学3年'

// ❌ 間違い（以前のコードにあった）
grade: '小1' | '小2' | ...
```

### Supabaseクライアントのモックモード

`lib/supabase.ts` は環境変数未設定時にモックモードで動作：
- 開発時に警告が出るが正常
- 本番は必ず環境変数を設定すること

### RLSポリシー

- 全テーブルにRLSが有効
- 認証なしでは何もCRUDできない
- テスト時は認証を先に実装すること

### リアルタイム機能

- `useRealtimeMessages` / `useRealtimeNotifications` はEffect内でsubscribe
- コンポーネントunmount時にcleanupが自動実行される
- Supabase Realtimeを有効にする必要あり（Dashboard設定）

---

## 11. 開発環境セットアップ

```bash
# リポジトリクローン
git clone <repo-url>
cd co_plus_study

# 依存関係インストール
cd frontend
npm install

# 開発サーバー起動
npm run dev

# ビルド確認
npm run build
```

### 環境変数

```bash
# frontend/.env.local を作成
cp .env.example .env.local

# 以下を設定
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

---

## 12. よくある質問

### Q: ビルドエラーが出る
A: `npm run build` でTypeScriptエラーが出る場合、`lib/hooks/` 内の型アサーションを確認。`as unknown as Record<string, unknown>` パターンで解決済みのはず。

### Q: mockデータはどこ？
A: `frontend/src/mockData/` または各 `features/*/mockData/` にある。フック統合時にこれらの参照を削除。

### Q: チャットのリアルタイムが動かない
A: Supabase DashboardでRealtimeを有効化。Database → Replication でテーブルを有効化。

### Q: バッジの進捗計算はどうなってる？
A: `useBadges.ts` の `calculateBadgeProgress()` でフロントエンド計算。Edge Function化はP3。

### Q: メンター割り当てはどうする？
A: Phase 1では管理者が手動で `chat_rooms` レコードを作成。自動マッチングはPhase 2以降。

---

## 連絡先

このドキュメントで不明点があれば、以下を参照：
- ADR-005: `project/decisions/005-backend-integration-preparation.md`
- 機能仕様: `specs/features/*.md`
- 型定義: `frontend/src/shared/types/*.ts`
