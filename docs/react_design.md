# 文書3: React フロントエンド設計書

## 1. プロジェクト概要

### 1.1. 目的
学習意欲のある小中学生向けWebアプリケーションのフロントエンドを、Reactを用いて実装する。
本設計は**描画・UI表示に特化**し、バックエンドAPI連携やデータ永続化は考慮せず、モックデータを用いた静的な画面表示とインタラクションを実現する。

### 1.2. 技術スタック
- **フレームワーク:** React 18.x
- **言語:** TypeScript
- **ビルドツール:** Vite
- **スタイリング:** CSS Modules / Tailwind CSS
- **ルーティング:** React Router v6
- **状態管理:** React Context API (またはuseState/useReducer)
- **UIコンポーネント:** 自作コンポーネント中心
- **アイコン:** React Icons

## 2. プロジェクト構造

```
src/
├── assets/                 # 静的アセット(画像、アイコンなど)
│   ├── images/
│   └── icons/
├── components/             # 再利用可能なUIコンポーネント
│   ├── common/            # 共通コンポーネント
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Modal/
│   │   └── Badge/
│   ├── layout/            # レイアウトコンポーネント
│   │   ├── Sidebar/
│   │   ├── Header/
│   │   └── Layout/
│   ├── tutorial/          # チュートリアル関連
│   │   ├── QuestModal/
│   │   └── ProgressBar/
│   ├── diary/             # 学習日報関連
│   │   ├── DiaryForm/
│   │   ├── DiaryTimeline/
│   │   └── DiaryItem/
│   ├── chat/              # 相談チャット関連
│   │   ├── ChatMessage/
│   │   ├── ChatInput/
│   │   └── ChatList/
│   ├── archive/           # ARCHIVE関連
│   │   ├── CalendarView/
│   │   ├── MonthlyCalendar/
│   │   ├── WeeklyActivity/
│   │   ├── ContinuousCounter/
│   │   ├── SkillView/
│   │   └── BadgeCard/
│   └── survey/            # アンケート関連
│       ├── SurveyForm/
│       └── QuestionItem/
├── pages/                 # ページコンポーネント
│   ├── LoginPage/
│   ├── TutorialPage/
│   ├── DiaryPage/
│   ├── ChatPage/
│   ├── ArchivePage/
│   └── SurveyPage/
├── contexts/              # Context API用
│   └── AppContext.tsx
├── hooks/                 # カスタムフック
│   ├── useTutorial.ts
│   ├── useCalendar.ts
│   └── useBadges.ts
├── utils/                 # ユーティリティ関数
│   ├── dateUtils.ts
│   └── badgeUtils.ts
├── types/                 # TypeScript型定義
│   ├── user.ts
│   ├── diary.ts
│   ├── chat.ts
│   ├── badge.ts
│   └── index.ts
├── mockData/              # モックデータ
│   ├── users.ts
│   ├── diaries.ts
│   ├── chats.ts
│   ├── badges.ts
│   └── calendar.ts
├── styles/                # グローバルスタイル
│   ├── global.css
│   ├── variables.css
│   └── colors.css
├── App.tsx
├── main.tsx
└── router.tsx
```

## 3. カラースキーム定義

### 3.1. 基本カラー
```css
/* 背景・ベース */
--color-bg-primary: #FFFFFF;
--color-bg-secondary: #E8F4F8;  /* ライトブルー */
--color-bg-tertiary: #F5FEFF;

/* テキスト */
--color-text-primary: #333333;
--color-text-secondary: #666666;
--color-text-light: #999999;

/* アクセント */
--color-accent-blue: #4DB8E8;
--color-accent-orange: #FF9F40;
--color-accent-gold: #FFD700;
--color-accent-silver: #C0C0C0;
--color-accent-bronze: #CD7F32;

/* 活動日マーカー */
--color-activity-login: #FFD700;      /* ゴールド */
--color-activity-diary: #FF9F40;      /* オレンジ */
--color-activity-both: #FF6B6B;       /* 赤系 */

/* システムカラー */
--color-success: #4CAF50;
--color-warning: #FFC107;
--color-error: #F44336;
--color-info: #2196F3;
```

### 3.2. バッジカラー
```css
--color-badge-gold: #FFD700;
--color-badge-silver: #C0C0C0;
--color-badge-bronze: #CD7F32;
--color-badge-platinum: #E5E4E2;
```

## 4. コンポーネント設計

### 4.1. レイアウトコンポーネント

#### Layout Component
```typescript
interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}
```
- 全ページ共通のレイアウトフレーム
- Sidebarとメインコンテンツエリアを配置
- レスポンシブ対応（モバイル時はハンバーガーメニュー）

#### Sidebar Component
```typescript
interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}
```
- ナビゲーションアイテム:
  - ホーム
  - 学習日報
  - 相談
  - ARCHIVE
  - アンケート
- アクティブ状態のハイライト表示

### 4.2. ARCHIVEページコンポーネント

#### ArchivePage Component
```typescript
interface ArchivePageProps {}

interface ArchiveTab {
  id: 'calendar' | 'skill';
  label: string;
}
```
- タブ切り替え機能（カレンダー/スキル）
- タブごとに異なるビューを表示

#### ContinuousCounter Component
```typescript
interface ContinuousCounterProps {
  days: number;
  label: string; // "連続ログイン" など
}
```
- 大きな数字で継続日数を表示
- アニメーション効果（カウントアップ）

#### MonthlyCalendar Component
```typescript
interface MonthlyCalendarProps {
  year: number;
  month: number;
  activityDays: ActivityDay[];
}

interface ActivityDay {
  date: string; // "2025-09-01"
  hasLogin: boolean;
  hasDiary: boolean;
}
```
- 月ごとのカレンダー表示
- 活動日を色分けマーカーで表示
  - ログインのみ: ゴールド
  - 日報のみ: オレンジ
  - 両方: 赤系
- 複数月表示対応（3ヶ月分）

#### WeeklyActivity Component
```typescript
interface WeeklyActivityProps {
  week: DayActivity[]; // 7日分
}

interface DayActivity {
  dayOfWeek: 'S' | 'M' | 'T' | 'W' | 'T' | 'F' | 'S';
  hasActivity: boolean;
}
```
- 直近1週間の活動状況を表示
- S M T W T F S の形式
- 活動日を円マーカーで表示

#### BadgeCard Component
```typescript
interface BadgeCardProps {
  badge: Badge;
}

interface Badge {
  id: string;
  name: string;
  type: 'gold' | 'silver' | 'bronze' | 'platinum';
  description: string;
  condition: string; // 獲得条件
  earnedDate?: string;
  isEarned: boolean;
}
```
- メダル形状のバッジアイコン
- バッジ名と説明
- 獲得/未獲得状態の表示
- グリッドレイアウト（2列または3列）

### 4.3. 学習日報コンポーネント

#### DiaryForm Component
```typescript
interface DiaryFormProps {
  onSubmit: (diary: DiaryEntry) => void;
}

interface DiaryEntry {
  date: string;
  subject: string;
  duration: number; // 分
  content: string;
  comment?: string;
}
```
- 日付選択（デフォルト: 今日）
- 教科選択（ドロップダウン）
- 学習時間入力
- 学習内容入力（テキストエリア）
- コメント入力（任意）

#### DiaryTimeline Component
```typescript
interface DiaryTimelineProps {
  diaries: DiaryEntryWithFeedback[];
}

interface DiaryEntryWithFeedback extends DiaryEntry {
  id: string;
  feedback?: Feedback[];
}

interface Feedback {
  id: string;
  mentorName: string;
  message: string;
  timestamp: string;
}
```
- 時系列での日報表示
- メンターからのフィードバック表示
- スクロール可能なリスト

### 4.4. 相談チャットコンポーネント

#### ChatMessage Component
```typescript
interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}
```
- 吹き出し形式
- 自分のメッセージ/相手のメッセージで配置を変更
- タイムスタンプ表示

#### ChatInput Component
```typescript
interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}
```
- テキスト入力欄
- 送信ボタン
- Enterキーでも送信可能

### 4.5. チュートリアルコンポーネント

#### QuestModal Component
```typescript
interface QuestModalProps {
  quest: Quest;
  onComplete: () => void;
  onSkip: () => void;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  targetElement?: string; // ハイライト対象
  step: number;
  totalSteps: number;
}
```
- モーダルウィンドウ表示
- 操作対象のハイライト（矢印やオーバーレイ）
- 次へ/スキップボタン

#### ProgressBar Component
```typescript
interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
}
```
- 進捗バー表示
- パーセンテージ表示

### 4.6. アンケートコンポーネント

#### SurveyForm Component
```typescript
interface SurveyFormProps {
  survey: Survey;
  onSubmit: (answers: Answer[]) => void;
}

interface Survey {
  id: string;
  title: string;
  questions: Question[];
}

interface Question {
  id: string;
  type: 'single' | 'multiple' | 'text';
  text: string;
  options?: string[];
  required: boolean;
}

interface Answer {
  questionId: string;
  value: string | string[];
}
```
- 質問タイプに応じた入力UI
- バリデーション機能
- 送信完了メッセージ

### 4.7. 共通コンポーネント

#### Button Component
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}
```

#### Card Component
```typescript
interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}
```

#### Modal Component
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}
```

## 5. ページ設計

### 5.1. LoginPage
- ログインフォーム（ID/パスワード）
- ロゴ表示
- シンプルな背景デザイン

### 5.2. TutorialPage
- クエスト形式のチュートリアル
- 進捗表示
- スキップ機能

### 5.3. DiaryPage
- DiaryForm（上部または右サイド）
- DiaryTimeline（メイン）

### 5.4. ChatPage
- メッセージリスト（ChatMessage の配列）
- ChatInput（下部固定）

### 5.5. ArchivePage
- タブ切り替え（カレンダー/スキル）
- カレンダータブ:
  - ContinuousCounter（連続ログイン日数）
  - MonthlyCalendar × 3（9月、8月、7月）
  - WeeklyActivity
- スキルタブ:
  - BadgeCard のグリッド表示

### 5.6. SurveyPage
- SurveyForm
- 完了メッセージ

## 6. モックデータ仕様

### 6.1. ユーザーデータ (`mockData/users.ts`)
```typescript
interface User {
  id: string;
  name: string;
  role: 'student' | 'mentor';
  avatarUrl?: string;
}
```

### 6.2. カレンダーデータ (`mockData/calendar.ts`)
```typescript
interface CalendarData {
  continuousDays: number;
  activityDays: ActivityDay[];
  weeklyActivity: DayActivity[];
}
```
- イメージ図に基づき、9月に953日の連続ログイン
- 9月の活動日: 1-6, 7-15, 16-20, 21-27, 28-30
- 8月の活動日: 1-2, 3-9, 10-16, 17-23, 24-30
- 7月の活動日: 1-6

### 6.3. バッジデータ (`mockData/badges.ts`)
```typescript
interface BadgeData {
  badges: Badge[];
}
```
- イメージ図に基づき、金・銀・銅のバッジを複数配置
- 例: 「まじめさ」「継続力」「探求心」「努力賞」など

### 6.4. 日報データ (`mockData/diaries.ts`)
```typescript
interface DiaryData {
  entries: DiaryEntryWithFeedback[];
}
```

### 6.5. チャットデータ (`mockData/chats.ts`)
```typescript
interface ChatData {
  messages: Message[];
}
```

## 7. レスポンシブ対応

### 7.1. ブレークポイント
```css
--breakpoint-mobile: 640px;
--breakpoint-tablet: 768px;
--breakpoint-desktop: 1024px;
```

### 7.2. レイアウト調整
- **PC (1024px以上):**
  - サイドバー常時表示（左側固定）
  - コンテンツエリア広々
  - ARCHIVEのカレンダーを横並び
  
- **タブレット (768px - 1023px):**
  - サイドバーをハンバーガーメニュー化
  - カレンダーを2列配置
  
- **モバイル (640px以下):**
  - サイドバーをハンバーガーメニュー化
  - カレンダーを1列配置
  - フォントサイズやボタンサイズを調整
  - 継続日数の数字サイズをやや縮小

## 8. アニメーション・インタラクション

### 8.1. 継続日数カウンター
- 画面表示時にカウントアップアニメーション（0から953へ）
- 所要時間: 2秒程度

### 8.2. バッジ表示
- バッジ獲得時の光るエフェクト（将来的に）
- ホバー時に拡大・影を強調

### 8.3. カレンダーマーカー
- ホバー時にツールチップ表示（日付と活動内容）

### 8.4. ページ遷移
- フェードイン/アウト効果

### 8.5. ボタンフィードバック
- クリック時のリップルエフェクト
- ホバー時の色変更

## 9. アクセシビリティ配慮

- セマンティックHTML使用
- ARIAラベルの適切な配置
- キーボード操作対応
- 十分なコントラスト比
- フォーカス表示の明確化

## 10. 開発フェーズ

### Phase 1: 基盤構築
1. プロジェクトセットアップ（Vite + React + TypeScript）
2. フォルダ構造作成
3. カラー定義とグローバルスタイル
4. ルーティング設定
5. 基本レイアウト（Layout, Sidebar, Header）

### Phase 2: 共通コンポーネント
1. Button, Card, Modal
2. Badge
3. フォーム要素（Input, Select, Textarea）

### Phase 3: ページ実装
1. LoginPage（最小限）
2. ArchivePage（カレンダータブ優先）
   - ContinuousCounter
   - MonthlyCalendar
   - WeeklyActivity
3. ArchivePage（スキルタブ）
   - BadgeCard, SkillView
4. DiaryPage
5. ChatPage
6. TutorialPage
7. SurveyPage

### Phase 4: モックデータ統合
1. 各モックデータファイル作成
2. コンポーネントとの接続
3. 動作確認

### Phase 5: レスポンシブ対応
1. ブレークポイント実装
2. モバイルレイアウト調整
3. タブレットレイアウト調整

### Phase 6: アニメーション・仕上げ
1. カウントアップアニメーション
2. ホバーエフェクト
3. ページ遷移効果
4. 細部の調整

## 11. 注意事項

### 11.1. スコープ外
- バックエンドAPI連携
- 実際の認証処理
- データベース連携
- 状態の永続化
- リアルタイムチャット機能
- ファイルアップロード

### 11.2. モック動作のみ
本設計で実装するのは静的な描画とクライアントサイドのインタラクションのみ。
すべてのデータはモックデータで提供し、画面遷移や状態変更は一時的なもの。

### 11.3. 将来的な拡張性
コンポーネント設計は、将来的にAPI連携や実機能追加が容易になるよう、
Propsとして必要なデータ構造を明確に定義する。

## 12. 補足: イメージ図からの具体的な実装ポイント

### 12.1. カレンダータブ（1枚目の画像）
- **連続ログイン 953 日**: 
  - フォントサイズ: 72px以上
  - フォントウェイト: Bold
  - 配置: 左側中央
- **月次カレンダー（9月、8月、7月）**:
  - 右側に縦並び配置
  - 各月のヘッダー: "9月", "8月", "7月"
  - グリッド: 7列（日〜土）
  - 活動日を丸数字でマーク（オレンジ系）
- **ウィークリー表示**:
  - S M T W T F S の形式
  - 活動日を丸マーカーで表示（オレンジ）
  - 未活動日は白抜き

### 12.2. スキルタブ（2枚目の画像）
- **バッジグリッド**:
  - 2列レイアウト
  - 各バッジカード:
    - メダルアイコン（金・銀・銅）
    - 説明テキスト用スペース（右側）
  - 配置順（上から）:
    - 金, 銅
    - 銅, 銀
    - 銀, 金
    - 銅, 銅

### 12.3. 共通デザイン要素
- **ARCHIVEヘッダー**:
  - 中央上部配置
  - アウトラインスタイルのテキスト
  - フォントサイズ: 36px程度
- **タブ**:
  - "メダル" と "カレンダー" の2つ
  - アクティブタブは下線で強調
  - 配置: ヘッダー直下
- **背景色**:
  - ライトブルー系（#E8F4F8 または類似色）
- **サイドバー**:
  - 左端に配置（画像では灰色で表現）
  - 幅: 約60-80px

---

以上が、描画に特化したReactプロジェクトの設計書です。
